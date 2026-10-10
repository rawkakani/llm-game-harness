import type { Tool } from "./tool.ts";
import { COMPLICATIONS, EVENTS, KINDS, type ScenarioKind } from "./scenarios.ts";

/** Strategy: where chance comes from. `Math.random` in play, a fixed sequence under test. */
export type Rng = () => number;

/** How a d20 reads, from worst to best; each entry is the highest roll that still earns it. */
const FORTUNES = [[1, "disaster"], [7, "setback"], [13, "mixed"], [19, "advantage"], [20, "triumph"]] as const;

/** The harness's one tool: it rolls the dice and deals a scenario for the game master to weave into the story. */
export class RandomTool implements Tool {
  readonly name = "random";
  readonly description =
    "Roll the dice of fate. Returns a random scenario (an event and a complication), a d20 roll and how fortune " +
    "reads it. Call it to open the story, whenever the player attempts something whose outcome is uncertain, and " +
    "whenever the story needs a new direction. Adapt the scenario to the story's setting.";
  readonly parameters = {
    type: "object",
    properties: {
      kind: { type: "string", enum: KINDS, description: "The kind of scenario wanted. Leave out to let fate choose." },
    },
    additionalProperties: false,
  };

  constructor(private readonly rng: Rng = Math.random) {}

  execute(args: Record<string, unknown>) {
    const kind = KINDS.includes(args.kind as ScenarioKind) ? args.kind as ScenarioKind : this.#pick(KINDS);
    const roll = 1 + Math.floor(this.rng() * 20);
    return {
      kind,
      scenario: `${this.#pick(EVENTS[kind])}, ${this.#pick(COMPLICATIONS)}`,
      roll,
      fortune: FORTUNES.find(([highest]) => roll <= highest)![1],
    };
  }

  #pick<T>(from: readonly T[]): T {
    return from[Math.floor(this.rng() * from.length)];
  }
}
