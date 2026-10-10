import type { Tool } from "./tool.ts";

/**
 * A simple command: it logs the player in and echoes the login back. In the game it lets the story greet the
 * player by name and remember who they are; as a harness demo it is the smallest possible tool — one input,
 * echoed in the result. It never takes or returns a password: a login tool that reflected a secret would be
 * leaking it, so identity is all it handles.
 */
export class LoginTool implements Tool {
  readonly name = "login";
  readonly description =
    "Log the player in and echo their login back. Call it once when the player first gives a name or identity " +
    '(for example "I\'m Mara" or "call me Captain"), so the story can greet them and remember who they are.';
  readonly parameters = {
    type: "object",
    properties: {
      username: { type: "string", description: "The name or handle the player logs in as." },
    },
    required: ["username"],
    additionalProperties: false,
  };

  execute(args: Record<string, unknown>) {
    const username = String(args.username ?? "").trim();
    if (!username) return { error: "A username is required to log in." };
    return { loggedInAs: username, at: new Date().toISOString(), message: `Logged in as ${username}.` };
  }
}
