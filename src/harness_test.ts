import { assertEquals, assertMatch } from "@std/assert";
import { collect, GameHarness } from "./harness.ts";
import { createApp } from "./http.ts";
import type { ChatProvider } from "./provider.ts";
import { LoginTool } from "./tools/login.ts";
import { RandomTool } from "./tools/random.ts";
import { ToolRegistry } from "./tools/tool.ts";
import type { ChatRequest, Chunk } from "./types.ts";

const chunk = (delta: Chunk["choices"][0]["delta"], finish_reason: string | null = null): Chunk => ({
  id: "chatcmpl-test",
  object: "chat.completion.chunk",
  created: 0,
  model: "test",
  choices: [{ index: 0, delta, finish_reason }],
});

/** A provider that asks for the dice (in two fragments, as real streams do) and then tells the story. */
class ScriptedProvider implements ChatProvider {
  readonly requests: ChatRequest[] = [];

  async *stream(request: ChatRequest) {
    this.requests.push(structuredClone(request));
    if (this.requests.length === 1) {
      yield chunk({
        role: "assistant",
        tool_calls: [{ index: 0, id: "call_1", function: { name: "random", arguments: '{"kind":' } }],
      });
      yield chunk({ tool_calls: [{ index: 0, function: { arguments: '"twist"}' } }] });
      yield chunk({}, "tool_calls");
    } else {
      yield chunk({ role: "assistant", content: "The door " });
      yield chunk({ content: "opens." });
      yield chunk({}, "stop");
    }
  }
}

const game = (provider: ChatProvider) => new GameHarness(provider, new ToolRegistry([new RandomTool(() => 0)]));
const ask = (body: unknown) =>
  new Request("http://game/chat", { method: "POST", body: typeof body === "string" ? body : JSON.stringify(body) });

Deno.test("random deals a scenario and reads the roll", () => {
  const lowest = new RandomTool(() => 0).execute({ kind: "hazard" });
  assertEquals(lowest, {
    kind: "hazard",
    scenario: "the ground gives way, and someone is watching",
    roll: 1,
    fortune: "disaster",
  });
  assertEquals(new RandomTool(() => 0.999).execute({ kind: "nonsense" }).roll, 20);
  assertEquals(new RandomTool(() => 0.999).execute({}).fortune, "triumph");
});

Deno.test("login echoes the username and refuses an empty one", () => {
  const login = new LoginTool();
  const ok = login.execute({ username: "  Captain Mara  " }) as { loggedInAs: string; message: string };
  assertEquals(ok.loggedInAs, "Captain Mara");
  assertEquals(ok.message, "Logged in as Captain Mara.");
  assertEquals(login.execute({ username: "   " }), { error: "A username is required to log in." });
});

Deno.test("the harness runs the tool, feeds the result back and returns only the story", async () => {
  const provider = new ScriptedProvider();
  const completion = await collect(
    game(provider).play({ messages: [{ role: "user", content: "open the door" }], temperature: 0.2 }),
  );

  assertEquals(completion.choices[0], {
    index: 0,
    message: { role: "assistant", content: "The door opens." },
    finish_reason: "stop",
  });
  assertEquals(completion.x_tools.map((run) => [run.name, run.arguments]), [["random", { kind: "twist" }]]);

  const [first, second] = provider.requests;
  assertEquals(first.messages.map((message) => message.role), ["system", "user"]);
  assertEquals(first.temperature, 0.2);
  assertEquals((first.tools as { function: { name: string } }[]).map((tool) => tool.function.name), ["random"]);
  assertEquals(second.messages.map((message) => message.role), ["system", "user", "assistant", "tool"]);
  assertMatch(second.messages[3].content!, /"roll":1/);
});

Deno.test("POST /chat streams server-sent events and rejects a body without messages", async () => {
  const app = createApp(game(new ScriptedProvider()));

  const stream = await app(ask({ stream: true, messages: [{ role: "user", content: "go" }] }));
  assertEquals(stream.headers.get("content-type"), "text/event-stream");
  const events = (await stream.text()).trim().split("\n\n");
  assertEquals(events.at(-1), "data: [DONE]");
  assertEquals(events.some((event) => event.includes('"x_tool"')), true);
  assertEquals(events.some((event) => event.includes("tool_calls")), false);

  const bad = await app(ask("not json"));
  assertEquals(bad.status, 400);
  assertEquals((await bad.json()).error.type, "invalid_request_error");
});
