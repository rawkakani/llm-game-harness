/**
 * The raw material of chance. Entries are deliberately free of genre, so the game master can dress them for a
 * dungeon, a starship or a rainy city. A scenario is one event plus one complication: 10 x 12 per kind.
 */

export const EVENTS = {
  encounter: [
    "someone who should be far away is standing right here",
    "a stranger offers help, a little too eagerly",
    "an old rival appears, and for once they need something",
    "a frightened messenger arrives with word meant for someone else",
    "an animal, or something like one, has been following for a while",
    "a figure of authority starts asking pointed questions",
    "a child who knows far too much steps into the path",
    "a wounded enemy asks for mercy",
    "a crowd gathers, and it is not friendly",
    "a familiar voice calls out from somewhere it cannot be",
  ],
  discovery: [
    "a hidden way through, recently used",
    "a letter that was never delivered",
    "a map where one detail is plainly wrong",
    "an object that hums when held",
    "evidence that someone trusted has been lying",
    "a locked container with a name scratched on it",
    "a record of this very moment, written long ago",
    "a tool far too advanced for this place",
    "a grave that is fresh, and empty",
    "a door that was not there before",
  ],
  hazard: [
    "the ground gives way",
    "fire, spreading faster than it should",
    "the only way back is cut off",
    "the weather turns violent without warning",
    "something essential breaks at the worst moment",
    "a trap, old but still working",
    "the light fails",
    "an alarm sounds, and everyone hears it",
    "the air turns bad",
    "the structure begins to come apart",
  ],
  twist: [
    "the goal was never what it seemed",
    "an ally has been working for the other side",
    "the enemy turns out to be right about one thing",
    "time is much shorter than anyone believed",
    "someone thought dead walks in",
    "the prize is already gone, taken by a third party",
    "a past choice comes back with a price attached",
    "the roles reverse, and the hunter is now hunted",
    "what looked like the danger was a warning about the real one",
    "two plans collide, and neither survives",
  ],
  boon: [
    "an unexpected ally arrives exactly on time",
    "a lucky find: just the thing that was needed",
    "an enemy makes a careless mistake",
    "a debt is repaid, with interest",
    "a moment of calm, and a safe place to use it",
    "a rumour turns out to be true, and useful",
    "someone important takes a liking to the hero",
    "a shortcut opens",
    "old training comes back at the right second",
    "a gift arrives, and for once there are no strings",
  ],
} as const;

export const COMPLICATIONS = [
  "and someone is watching",
  "but it will cost something dear",
  "and there is very little time to decide",
  "but only one person can go on",
  "and it is not the first time this has happened",
  "but something about it feels staged",
  "and it draws attention nobody wanted",
  "but an old promise stands in the way",
  "and it changes who can be trusted",
  "but it leaves a mark that will not fade",
  "and the obvious answer is the wrong one",
  "but luck rarely comes alone",
] as const;

export type ScenarioKind = keyof typeof EVENTS;
export const KINDS = Object.keys(EVENTS) as ScenarioKind[];
