# LLM Game Harness — Story Engine

An OpenAI-compatible chat endpoint that runs a **text-based adventure**. The model plays the game
master; the player's messages are their actions and the replies are the world answering back. The
harness gives the model one tool — **`random`** — which rolls the dice of fate and deals a scenario, so
every playthrough bends somewhere new.

Built on [Deno](https://deno.com). Clean, lean, and dependency-light.

## What it does

- Exposes `POST /v1/chat/completions` (and `POST /chat`) in the OpenAI Chat Completions wire format.
- Prepends a game-master system prompt and advertises the `random` tool to the model.
- Runs the tool calls the model makes, feeds the results back, and returns **only the story** — the
  tool traffic never reaches the caller.
- Streams (`"stream": true`, server-sent events) or returns a single completion.
- Serves a landing page with a live, in-browser demo (the floating dice, bottom-right).

## Quick start

```bash
# 1. Give it a provider key (any OpenAI-compatible provider works).
cp .env.example .env            # then edit LLM_API_KEY

# 2. Run it.
deno task start                 # http://localhost:8000

# 3. Play.
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{ "messages": [ { "role": "user", "content": "Start a pirate adventure." } ] }'
```

## Configuration

All configuration is through environment variables (see `.env.example`):

| Variable       | Required | Default                     | Description                                              |
| -------------- | -------- | --------------------------- | -------------------------------------------------------- |
| `LLM_API_KEY`  | yes      | —                           | Your provider key. `OPENAI_API_KEY` is read as fallback. |
| `LLM_BASE_URL` | no       | `https://api.openai.com/v1` | Any OpenAI-compatible endpoint.                          |
| `LLM_MODEL`    | no       | `gpt-4o-mini`               | Default model (a request may override with `model`).     |
| `PORT`         | no       | `8000`                      | Port to listen on.                                       |

The key is read **only on the server** and is never sent to the browser.

## The `random` tool

The game master calls `random` to roll a d20 and deal a scenario — an *event* (an encounter,
a discovery, a hazard, a twist, or a boon) and a *complication*. A low roll goes badly, a high roll
goes well, and the scenario enters the story dressed to fit the setting. It returns, for example:

```json
{ "kind": "twist", "scenario": "an ally has been working for the other side, and there is very little time to decide", "roll": 4, "fortune": "setback" }
```

## Design

The code follows a few Gang-of-Four patterns, each earning its place:

- **Strategy** — `ChatProvider` (any OpenAI-compatible upstream) and `Rng` (real randomness in play, a
  fixed sequence under test) are swappable behind interfaces.
- **Adapter** — `OpenAICompatibleProvider` adapts a provider's HTTP/SSE API to the harness's needs.
- **Facade** — `GameHarness.play()` hides the tool-calling loop behind one call.
- **Command + Registry** — each `Tool` is a self-described command; `ToolRegistry` advertises and runs
  them. Adding a tool is writing one `Tool` and registering it in `main.ts`; nothing else changes.

```
main.ts                 composition root — wires provider + tools into the harness and serves HTTP
src/http.ts             the HTTP surface (chat endpoint, SSE, static files, CORS)
src/harness.ts          the game loop (Facade): system prompt, tool rounds, stream folding
src/provider.ts         ChatProvider + the OpenAI-compatible Adapter
src/tools/tool.ts       Tool (Command) + ToolRegistry
src/tools/random.ts     the random tool
src/tools/scenarios.ts  the raw material of chance
src/prompt.ts           the game-master system prompt
web/                    the landing page (React + Astryx), built into static/
```

## Tests

```bash
deno task test
```

Covers the tool's rolls, the harness's tool-calling loop (the model asks for the dice, the result is
fed back, only the story is returned), and the endpoint's streaming and validation.

## Develop the landing page

```bash
cd web
deno task dev     # http://localhost:5175, proxies /chat to the server on :8000
deno task build   # writes the built page into ../static
```

## License

MIT
