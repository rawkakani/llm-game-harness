import { GAME_MASTER_PROMPT } from "./prompt.ts";
import type { ChatProvider } from "./provider.ts";
import type { ToolRegistry } from "./tools/tool.ts";
import type { ChatRequest, Chunk, Message, ToolCall, ToolCallDelta, ToolRun } from "./types.ts";

/** How many times the game master may consult its tools in one turn before it must speak. */
const MAX_TOOL_ROUNDS = 4;

/**
 * Facade: one turn of the game behind one call. It gives the model its role and its tools, runs the tools the
 * model asks for, and hands back only the story, as one stream of OpenAI chunks.
 */
export class GameHarness {
  constructor(
    private readonly provider: ChatProvider,
    private readonly tools: ToolRegistry,
    private readonly prompt: string = GAME_MASTER_PROMPT,
  ) {}

  async *play(request: ChatRequest, signal?: AbortSignal): AsyncGenerator<Chunk> {
    const messages: Message[] = [{ role: "system", content: this.prompt }, ...request.messages];
    let first: Chunk | undefined;

    for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
      const calls: ToolCall[] = [];
      let said = "";
      const turn = {
        ...request,
        messages,
        tools: this.tools.specs(),
        // On the last round the model may no longer reach for a tool: it has to tell the story.
        ...(round === MAX_TOOL_ROUNDS && { tool_choice: "none" }),
      };

      for await (const chunk of this.provider.stream(turn, signal)) {
        first ??= chunk;
        const choice = chunk.choices[0];
        const { tool_calls, ...delta } = choice?.delta ?? {};
        if (tool_calls) gather(calls, tool_calls);
        said += delta.content ?? "";
        // Tool traffic stays inside the harness; the caller sees one continuous answer.
        const isToolTraffic = choice && (choice.finish_reason === "tool_calls" || (tool_calls && !delta.content));
        if (!isToolTraffic) yield { ...chunk, id: first.id, choices: choice ? [{ ...choice, delta }] : [] };
      }
      if (!calls.length) return;

      messages.push({ role: "assistant", content: said || null, tool_calls: calls });
      for (const call of calls) {
        const run = await this.tools.run(call);
        messages.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify(run.result) });
        yield notice(first!, run);
      }
    }
  }
}

/** Tool calls arrive in fragments; this puts each fragment where it belongs. */
function gather(calls: ToolCall[], deltas: ToolCallDelta[]): void {
  for (const delta of deltas) {
    const call = calls[delta.index] ??= { id: "", type: "function", function: { name: "", arguments: "" } };
    call.id ||= delta.id ?? "";
    call.function.name += delta.function?.name ?? "";
    call.function.arguments += delta.function?.arguments ?? "";
  }
}

/** A chunk that says nothing but carries a tool's result, for callers that want to show the dice. */
function notice(like: Chunk, run: ToolRun): Chunk {
  return { ...like, usage: undefined, choices: [{ index: 0, delta: {}, finish_reason: null }], x_tool: run };
}

/** Folds a stream of chunks into the single response a non-streaming caller expects. */
export async function collect(chunks: AsyncIterable<Chunk>) {
  let last: Chunk | undefined;
  let content = "";
  let finish_reason = "stop";
  let usage: unknown;
  const x_tools: ToolRun[] = [];

  for await (const chunk of chunks) {
    last = chunk;
    content += chunk.choices[0]?.delta.content ?? "";
    finish_reason = chunk.choices[0]?.finish_reason ?? finish_reason;
    usage = chunk.usage ?? usage;
    if (chunk.x_tool) x_tools.push(chunk.x_tool);
  }
  return {
    id: last?.id,
    object: "chat.completion",
    created: last?.created,
    model: last?.model,
    choices: [{ index: 0, message: { role: "assistant", content }, finish_reason }],
    usage,
    x_tools,
  };
}
