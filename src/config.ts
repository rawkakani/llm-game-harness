/** Everything the harness reads from the environment, in one place. See .env.example. */

export interface Config {
  apiKey: string | undefined;
  baseUrl: string;
  model: string;
  port: number;
}

export function loadConfig(env: (name: string) => string | undefined = (name) => Deno.env.get(name)): Config {
  return {
    apiKey: env("LLM_API_KEY") ?? env("OPENAI_API_KEY"),
    baseUrl: (env("LLM_BASE_URL") ?? "https://api.openai.com/v1").replace(/\/+$/, ""),
    model: env("LLM_MODEL") ?? "gpt-4o-mini",
    port: Number(env("PORT") ?? 8000),
  };
}
