/**
 * The landing page's theme: a near-black canvas with a single indigo accent and cool grey ink, in the manner of
 * a modern developer-tool homepage. Colour lives here only; the page and its components read tokens. Dark is the
 * one mode, so every token is a flat value rather than a [light, dark] pair.
 */
import { defineTheme } from "@astryxdesign/core/theme";

const SANS = '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

export const harnessTheme = defineTheme({
  name: "harness",
  typography: {
    scale: { base: 16, ratio: 1.22 },
    body: { family: "Inter", fallbacks: SANS },
    heading: { family: "Inter", fallbacks: SANS, weights: { 1: "semibold", 2: "semibold" } },
    code: { family: "ui-monospace", fallbacks: '"SF Mono", "Fira Code", monospace' },
  },
  radius: { base: 8, multiplier: 1 },
  motion: { fast: 140, medium: 300, ratio: 0.75 },
  color: { neutralStyle: "neutral" },
  localTokens: {
    "--glow": "radial-gradient(120% 80% at 50% -10%, rgba(94,106,210,0.22) 0%, rgba(94,106,210,0.06) 36%, rgba(0,0,0,0) 64%)",
    "--hairline": "rgba(255,255,255,0.08)",
    "--hairline-strong": "rgba(255,255,255,0.14)",
    "--surface-raised": "rgba(255,255,255,0.03)",
    "--bubble-shadow": "0 18px 50px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)",
  },
  tokens: {
    "--color-accent": "#5e6ad2",
    "--color-on-accent": "#ffffff",
    "--color-accent-muted": "#2a2f52",
    "--color-text-accent": "#8d97f0",
    "--color-icon-accent": "#8d97f0",

    "--color-background-body": "#08080a",
    "--color-background-surface": "#0d0e11",
    "--color-background-card": "#101117",
    "--color-background-popover": "#14151c",
    "--color-background-muted": "#15161d",
    "--color-background-inverted": "#f7f8f8",
    "--color-border": "rgba(255,255,255,0.10)",
    "--color-border-emphasized": "rgba(255,255,255,0.22)",
    "--color-text-primary": "#f7f8f8",
    "--color-text-secondary": "#9ca0ab",
    "--color-text-disabled": "#5b5f6b",
    "--color-on-dark": "#f7f8f8",

    "--color-background-blue": "#1b2240",
    "--color-background-purple": "#211a40",
    "--color-background-green": "#13291f",
    "--color-background-orange": "#2e2113",
    "--color-background-gray": "#101117",
  },
});
