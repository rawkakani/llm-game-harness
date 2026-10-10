/** The composition root: the one place that decides which provider and which tools the game is played with. */
import { loadConfig } from "./src/config.ts";
import { GameHarness } from "./src/harness.ts";
import { createApp } from "./src/http.ts";
import { OpenAICompatibleProvider } from "./src/provider.ts";
import { LoginTool } from "./src/tools/login.ts";
import { RandomTool } from "./src/tools/random.ts";
import { ToolRegistry } from "./src/tools/tool.ts";

const config = loadConfig();
const harness = new GameHarness(
  new OpenAICompatibleProvider(config),
  new ToolRegistry([new RandomTool(), new LoginTool()]),
);

if (!config.apiKey) console.warn("LLM_API_KEY is not set: the page will load, but /chat will answer with an error.");
Deno.serve({ port: config.port }, createApp(harness, new URL("./static", import.meta.url).pathname));
