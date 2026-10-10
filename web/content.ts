/** Every word on the landing page, in one place. */

const GITHUB = "https://github.com/rawkakani/llm-game-harness";

export const NAV = [
  { label: "How it works", href: "#how" },
  { label: "The dice", href: "#dice" },
  { label: "The endpoint", href: "#api" },
];

export const HERO = {
  badge: { tag: "New", text: "one tool: random", href: "#dice" },
  title: "The story engine for text adventures",
  blurb:
    "An OpenAI-compatible chat endpoint that runs a text adventure. One tool — random — rolls the dice of fate, so every playthrough bends somewhere new.",
  primary: { label: "Play it now", href: "#play" },
  secondary: { label: "View the code", href: GITHUB },
};

/** A thin caption row under the hero, in the manner of a homepage's trust strip — honest facts, not logos. */
export const TRUST = ["Built on Deno", "OpenAI-compatible", "Streaming (SSE)", "Key stays server-side", "Zero config"];

/** The three-up columns, each tagged with a figure label like a reference diagram. */
export const FEATURES = [
  {
    fig: "Fig 0.1",
    title: "One endpoint, OpenAI-shaped",
    body: "POST /v1/chat/completions with the messages and model you already send. Streaming or not, the wire format is the one your client speaks.",
  },
  {
    fig: "Fig 0.2",
    title: "A single tool: random",
    body: "The game master rolls a d20 and is dealt a scenario — an event and a complication. A low roll goes badly, a high roll goes well.",
  },
  {
    fig: "Fig 0.3",
    title: "The key never leaves the server",
    body: "Your provider key lives in one environment variable, read only server-side. The browser talks to the harness, never to the provider.",
  },
];

/** The signature showcase: how the random tool shapes a turn, with a designed sample of its output. */
export const DICE = {
  eyebrow: "The dice of fate",
  title: "Chance, handed to the model as a tool",
  body: "When the outcome is uncertain, the game master calls random. It rolls a d20 and deals a scenario; the roll decides how it lands, and the scenario enters the story dressed to fit the setting. The model never sees the dice — only what fate hands it.",
  link: { label: "Read the tool", href: GITHUB + "/blob/main/src/tools/random.ts" },
  sample: {
    kind: "twist",
    scenario: "an ally has been working for the other side, and there is very little time to decide",
    roll: 4,
    max: 20,
    fortune: "setback",
  },
  kinds: ["encounter", "discovery", "hazard", "twist", "boon"],
};

/** A short, fixed transcript shown in the hero preview, so the page reads as a game before you play it. */
export const PREVIEW = {
  title: "a pirate adventure",
  endpoint: "/v1/chat/completions",
  turns: [
    { role: "user" as const, text: "I push open the tavern door." },
    {
      role: "assistant" as const,
      text:
        "Smoke and firelight spill out. A hooded figure at the back looks up the instant you enter, as if they were waiting. The barkeep sets down a glass, slowly.",
    },
    { role: "user" as const, text: "I walk straight to the hooded figure." },
  ],
};

export const API = {
  eyebrow: "The endpoint",
  title: "Talk to it like OpenAI",
  body: "Point any OpenAI-compatible client at the harness. The system prompt, the tools and the dice all live on the server; you send messages and read the story back.",
  curl: `curl https://agame.worklyn.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "messages": [
      { "role": "user", "content": "Start a pirate adventure." }
    ]
  }'`,
};

export const PLAY = {
  title: "Play it right here",
  body: "Tap the dice in the corner. The adventure starts at a fork in the road — type what you do, and see where the dice take it.",
};

export const FOOTER = {
  brand: "Story Engine",
  tagline: "A text-adventure LLM harness, built on Deno.",
  columns: [
    { heading: "Project", links: [{ label: "GitHub", href: GITHUB }, { label: "README", href: GITHUB + "#readme" }, { label: "License", href: GITHUB + "/blob/main/README.md" }] },
    { heading: "Endpoint", links: [{ label: "Chat completions", href: "#api" }, { label: "The random tool", href: "#dice" }, { label: "Play now", href: "#play" }] },
    { heading: "Built with", links: [{ label: "Deno", href: "https://deno.com" }, { label: "Astryx", href: "https://astryx.design" }] },
  ],
};

export const WIDGET = {
  title: "Story Engine",
  subtitle: "A text adventure. Type what you do.",
  opener: "You wake at the edge of a quiet wood, the path forking ahead. What do you do?",
  placeholder: "I look around...",
};
