/** The slice of the OpenAI chat completions wire format the harness reads. Everything else passes through untouched. */

export interface ToolCall {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
}

export interface Message {
  role: "system" | "user" | "assistant" | "tool";
  content: string | null;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
}

/** An OpenAI chat completions request: `messages` plus any other property (model, temperature, max_tokens, ...). */
export interface ChatRequest {
  messages: Message[];
  model?: string;
  stream?: boolean;
  [property: string]: unknown;
}

/** A tool call as it arrives in a stream: in pieces, keyed by `index`. */
export interface ToolCallDelta {
  index: number;
  id?: string;
  function?: { name?: string; arguments?: string };
}

export interface Chunk {
  id: string;
  object: "chat.completion.chunk";
  created: number;
  model: string;
  choices: {
    index: number;
    delta: { role?: string; content?: string | null; tool_calls?: ToolCallDelta[] };
    finish_reason: string | null;
  }[];
  usage?: unknown;
  /** Harness extension: a tool the game master just ran. Standard OpenAI clients ignore it. */
  x_tool?: ToolRun;
}

export interface ToolRun {
  name: string;
  arguments: unknown;
  result: unknown;
}
