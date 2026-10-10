import type { ToolCall, ToolRun } from "../types.ts";

/**
 * Command: one thing the game master can do, described so a model can ask for it.
 * Adding a tool is writing one of these and registering it; nothing else changes.
 */
export interface Tool {
  readonly name: string;
  readonly description: string;
  /** JSON Schema for the arguments. */
  readonly parameters: Record<string, unknown>;
  execute(args: Record<string, unknown>): unknown | Promise<unknown>;
}

/** The tools on offer: advertises them to the model and runs the ones it calls. */
export class ToolRegistry {
  readonly #tools = new Map<string, Tool>();

  constructor(tools: Tool[] = []) {
    for (const tool of tools) this.#tools.set(tool.name, tool);
  }

  /** The tools as the OpenAI `tools` request property. */
  specs() {
    return [...this.#tools.values()].map(({ name, description, parameters }) => ({
      type: "function" as const,
      function: { name, description, parameters },
    }));
  }

  /** Runs a call. A failure is returned as the result, so the model can read it and carry on. */
  async run(call: ToolCall): Promise<ToolRun> {
    const { name } = call.function;
    let args: Record<string, unknown> = {};
    try {
      args = JSON.parse(call.function.arguments || "{}");
      const tool = this.#tools.get(name);
      if (!tool) throw new Error(`unknown tool "${name}"`);
      return { name, arguments: args, result: await tool.execute(args) };
    } catch (error) {
      return { name, arguments: args, result: { error: (error as Error).message } };
    }
  }
}
