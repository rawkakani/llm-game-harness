/** Every word on the landing page, in one place. */

export const NAV = [
  { label: "How it works", href: "#how" },
  { label: "The endpoint", href: "#api" },
  { label: "GitHub", href: "https://github.com/rawkakani/llm-game-harness" },
];

export const HERO = {
  eyebrow: "LLM game harness",
  title: "The story engine for text adventures",
  blurb:
    "An OpenAI-compatible chat endpoint that runs a text-based adventure. One tool, random, rolls the dice of fate so every playthrough bends somewhere new.",
  primary: { label: "Play it now", href: "#play" },
  secondary: { label: "Read the code", href: "https://github.com/rawkakani/llm-game-harness" },
};

export const FEATURES = [
  {
    title: "One endpoint, OpenAI-shaped",
    body: "POST /v1/chat/completions with the messages and model you already send. Streaming or not, the wire format is the one your client speaks.",
  },
  {
    title: "A single tool: random",
    body: "The game master calls random to roll a d20 and deal a scenario — an event and a complication. A low roll goes badly, a high roll goes well.",
  },
  {
    title: "The key never leaves the server",
    body: "Your provider key lives in one environment variable and is read only server-side. The browser talks to the harness, never to the provider.",
  },
];

/** A short, fixed transcript shown in the hero preview, so the page reads as a game before you play it. */
export const PREVIEW = [
  { role: "user" as const, text: "I push open the tavern door." },
  {
    role: "assistant" as const,
    text:
      "Smoke and firelight spill out. A hooded figure at the back looks up the instant you enter, as if they were waiting. The barkeep sets down a glass, slowly.\n\n1. Walk straight to the hooded figure\n2. Take a seat at the bar and listen\n3. Leave — something is wrong here",
  },
];

export const API = {
  title: "Talk to it like OpenAI",
  body: "Point any OpenAI-compatible client at the harness. The system prompt, the tool and the dice are all on the server; you send messages and read the story back.",
  curl: `curl https://agame.worklyn.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "messages": [
      { "role": "user", "content": "Start a pirate adventure." }
    ]
  }'`,
};

export const FOOTER = {
  note: "A text-adventure LLM harness. Built on Deno.",
  links: [
    { label: "GitHub", href: "https://github.com/rawkakani/llm-game-harness" },
    { label: "Deno", href: "https://deno.com" },
  ],
};

export const WIDGET = {
  title: "Story Engine",
  subtitle: "A text adventure. Type what you do.",
  opener: "You wake at the edge of a quiet wood, the path forking ahead. What do you do?",
  placeholder: "I look around...",
};
