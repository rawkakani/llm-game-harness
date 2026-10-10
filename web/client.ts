/** Talks to the harness from the browser: sends the conversation, reads the story back as it streams. */

export interface Msg {
  role: "user" | "assistant";
  content: string;
}

interface Chunk {
  choices?: { delta?: { content?: string | null } }[];
  error?: { message?: string };
}

/**
 * Streams one assistant turn. `onText` is called with each new piece of the story as it arrives; the full reply
 * is returned when the turn ends. The provider key stays on the server — the browser only ever calls the harness.
 */
export async function play(messages: Msg[], onText: (text: string) => void, signal?: AbortSignal): Promise<string> {
  const response = await fetch("/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, stream: true }),
    signal,
  });
  if (!response.ok || !response.body) {
    const detail = await response.json().catch(() => null);
    throw new Error(detail?.error?.message ?? `The harness answered ${response.status}.`);
  }

  let full = "";
  let buffer = "";
  for await (const text of response.body.pipeThrough(new TextDecoderStream())) {
    const lines = (buffer + text).split("\n");
    buffer = lines.pop()!;
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      const chunk: Chunk = JSON.parse(data);
      if (chunk.error) throw new Error(chunk.error.message ?? "The game master lost the thread.");
      const piece = chunk.choices?.[0]?.delta?.content ?? "";
      if (piece) {
        full += piece;
        onText(full);
      }
    }
  }
  return full;
}
