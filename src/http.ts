import { serveDir } from "@std/http/file-server";
import { HttpError } from "./errors.ts";
import { collect, type GameHarness } from "./harness.ts";
import type { ChatRequest, Chunk } from "./types.ts";

type Handler = (request: Request) => Response | Promise<Response>;

/** Any page may call the API: the key never leaves the server. */
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/** The whole HTTP surface: the chat endpoint under both of its names, a health check, and the landing page. */
export function createApp(harness: GameHarness, staticDir = "static"): Handler {
  const chat: Handler = async (request) => {
    const body = await readChatRequest(request);
    // Pull the first chunk before answering, so a bad key or a provider error is a proper HTTP error. The turn is
    // not tied to request.signal: for a streamed response that signal aborts the moment the handler returns, which
    // would cut the story short. If the client disconnects, the stream's teardown closes the turn (see events()).
    const chunks = await primed(harness.play(body));
    if (!body.stream) return Response.json(await collect(chunks), { headers: CORS });
    return new Response(ReadableStream.from(events(chunks)), {
      headers: { ...CORS, "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
    });
  };

  const routes: Record<string, Handler> = {
    "POST /chat": chat,
    "POST /v1/chat/completions": chat,
    "GET /health": () => Response.json({ ok: true }),
  };

  return async (request) => {
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
    const route = routes[`${request.method} ${new URL(request.url).pathname}`];
    if (!route) return serveDir(request, { fsRoot: staticDir, quiet: true });
    try {
      return await route(request);
    } catch (error) {
      return asHttpError(error).toResponse(CORS);
    }
  };
}

async function readChatRequest(request: Request): Promise<ChatRequest> {
  const body = await request.json().catch(() => null);
  if (!Array.isArray(body?.messages) || !body.messages.length) {
    throw new HttpError(400, "Send a JSON body with a non-empty `messages` array.");
  }
  return body;
}

/** Starts a stream and waits for its first item, so a failure to start surfaces here and not mid-response. */
async function primed<T>(source: AsyncGenerator<T>): Promise<AsyncGenerator<T>> {
  const first = await source.next();
  return (async function* () {
    try {
      if (!first.done) yield first.value;
      yield* source;
    } finally {
      await source.return(undefined);
    }
  })();
}

/** Chunks as server-sent events, closed the way OpenAI closes them. A late failure is sent as a final event. */
async function* events(chunks: AsyncIterable<Chunk>): AsyncGenerator<Uint8Array> {
  const encoder = new TextEncoder();
  const event = (data: unknown) =>
    encoder.encode(`data: ${typeof data === "string" ? data : JSON.stringify(data)}\n\n`);
  try {
    for await (const chunk of chunks) yield event(chunk);
  } catch (error) {
    const { message, type } = asHttpError(error);
    yield event({ error: { message, type } });
  }
  yield event("[DONE]");
}

function asHttpError(error: unknown): HttpError {
  if (error instanceof HttpError) return error;
  console.error(error);
  return new HttpError(500, "The game master lost the thread. Try again.", "server_error");
}
