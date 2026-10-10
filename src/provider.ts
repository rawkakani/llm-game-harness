import type { Config } from "./config.ts";
import { HttpError } from "./errors.ts";
import type { ChatRequest, Chunk } from "./types.ts";

/** Strategy: anything that can answer a chat request as a stream of OpenAI chunks. */
export interface ChatProvider {
  stream(request: ChatRequest, signal?: AbortSignal): AsyncIterable<Chunk>;
}

/** Adapter: any service that speaks OpenAI's `/chat/completions` (OpenAI, OpenRouter, Groq, Ollama, ...). */
export class OpenAICompatibleProvider implements ChatProvider {
  constructor(private readonly config: Config, private readonly send: typeof fetch = fetch) {}

  async *stream(request: ChatRequest, signal?: AbortSignal): AsyncIterable<Chunk> {
    const { apiKey, baseUrl, model } = this.config;
    if (!apiKey) throw new HttpError(500, "The server has no LLM key: set LLM_API_KEY.", "configuration_error");

    const response = await this.send(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ ...request, model: request.model ?? model, stream: true }),
      signal,
    });
    if (!response.ok || !response.body) {
      throw new HttpError(response.status || 502, await upstreamMessage(response), "upstream_error");
    }
    yield* parseEvents(response.body);
  }
}

/** The provider's own words for what went wrong, when it gave any. */
async function upstreamMessage(response: Response): Promise<string> {
  const text = await response.text();
  try {
    return JSON.parse(text).error.message;
  } catch {
    return text || `The LLM provider answered ${response.status}.`;
  }
}

/** Reads a server-sent event stream as the JSON chunks it carries, up to `[DONE]`. */
async function* parseEvents(body: ReadableStream<Uint8Array>): AsyncIterable<Chunk> {
  let buffer = "";
  for await (const text of body.pipeThrough(new TextDecoderStream())) {
    const lines = (buffer + text).split("\n");
    buffer = lines.pop()!;
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (data === "[DONE]") return;
      if (data) yield JSON.parse(data);
    }
  }
}
