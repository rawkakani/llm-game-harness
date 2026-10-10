/**
 * The landing page: a dark, refined developer-tool homepage in the manner of linear.app. A sticky translucent
 * nav; a centered hero with a pill badge glowing over a framed transcript window; a trust caption; three
 * figure-tagged columns; a signature showcase of the random tool with a designed scenario card; a "talk to it
 * like OpenAI" band; a play CTA; and a multi-column footer. The live demo is the floating PlayWidget.
 */
import { Button } from "@astryxdesign/core/Button";
import { CodeBlock } from "@astryxdesign/core/CodeBlock";
import { Grid } from "@astryxdesign/core/Grid";
import { Heading } from "@astryxdesign/core/Heading";
import { Icon } from "@astryxdesign/core/Icon";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { ArrowRight, ArrowUpRight, Dices } from "lucide-react";
import { API, DICE, FEATURES, FOOTER, HERO, NAV, PLAY, PREVIEW, TRUST, WIDGET } from "./content.ts";
import { PlayWidget } from "./widget.tsx";

const arrow = <Icon icon={ArrowRight} size="sm" color="inherit" />;

/** The GitHub mark, inlined — lucide 1.x no longer ships a brand icon. */
const GithubMark = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
  </svg>
);

function Nav() {
  return (
    <header className="nav">
      <HStack className="wrap nav-inner" paddingBlock={3} hAlign="between" vAlign="center">
        <HStack className="brand" gap={2} vAlign="center">
          <span className="mark"><Icon icon={Dices} size="sm" color="inherit" /></span>
          <Text weight="semibold">Story Engine</Text>
        </HStack>
        <HStack className="nav-links" gap={0.5} vAlign="center">
          {NAV.map((item) => <Button key={item.label} label={item.label} variant="ghost" size="sm" href={item.href} />)}
        </HStack>
        <HStack gap={2} vAlign="center">
          <Button className="nav-ghost" label="GitHub" variant="ghost" size="sm" href={HERO.secondary.href} target="_blank" />
          <Button label="Play it now" variant="primary" size="sm" href="#play" />
        </HStack>
      </HStack>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="glow" aria-hidden="true" />
      <VStack className="wrap" gap={8} hAlign="center">
        <VStack className="hero-copy" gap={5} hAlign="center">
          <a className="badge" href={HERO.badge.href}>
            <span className="badge-tag">{HERO.badge.tag}</span>
            <span className="badge-text">{HERO.badge.text}</span>
            <Icon icon={ArrowRight} size="sm" color="inherit" />
          </a>
          <Heading className="hero-title" level={1} type="display-1" justify="center" textWrap="balance">{HERO.title}</Heading>
          <Text className="hero-blurb" type="large" color="secondary" justify="center" textWrap="pretty">{HERO.blurb}</Text>
          <HStack className="hero-cta" gap={3} vAlign="center" wrap="wrap">
            <Button label={HERO.primary.label} variant="primary" size="lg" href={HERO.primary.href} endContent={arrow} />
            <Button label={HERO.secondary.label} variant="secondary" size="lg" href={HERO.secondary.href} target="_blank" />
          </HStack>
        </VStack>
        <Preview />
        <HStack className="trust" gap={0} hAlign="center" wrap="wrap">
          {TRUST.map((item, i) => (
            <HStack key={item} gap={0} vAlign="center">
              {i > 0 && <span className="trust-sep" aria-hidden="true" />}
              <Text className="trust-item" type="supporting" color="secondary">{item}</Text>
            </HStack>
          ))}
        </HStack>
      </VStack>
    </section>
  );
}

/** The hero's picture: a short, fixed game transcript dressed as an app window, so the page reads as a game at a glance. */
function Preview() {
  return (
    <div className="preview">
      <HStack className="preview-bar" gap={2} vAlign="center" padding={3}>
        <HStack gap={1.5} vAlign="center"><span className="dot" /><span className="dot" /><span className="dot" /></HStack>
        <Text className="preview-title" type="supporting" color="secondary">{PREVIEW.title}</Text>
        <span className="preview-endpoint">{PREVIEW.endpoint}</span>
      </HStack>
      <VStack className="preview-body" gap={4} padding={5}>
        {PREVIEW.turns.map((turn, index) => (
          <div key={index} className={`msg msg-${turn.role}`}>
            <Text className="bubble" color="inherit">{turn.text}</Text>
          </div>
        ))}
        <HStack className="typing" gap={1} vAlign="center" aria-hidden="true">
          <span className="tdot" /><span className="tdot" /><span className="tdot" />
        </HStack>
      </VStack>
    </div>
  );
}

function SectionHead({ eyebrow, title, body }: { eyebrow?: string; title: string; body?: string }) {
  return (
    <VStack className="head" gap={3} hAlign="center">
      {eyebrow && <Text className="eyebrow" type="label" color="accent" justify="center">{eyebrow}</Text>}
      <Heading level={2} type="display-2" justify="center" textWrap="balance">{title}</Heading>
      {body && <Text className="head-body" type="large" color="secondary" justify="center" textWrap="pretty">{body}</Text>}
    </VStack>
  );
}

function Features() {
  return (
    <section id="how" className="section">
      <VStack className="wrap" gap={10}>
        <SectionHead title="A tiny harness with one good idea" body="Chance, handed to the model as a tool, and let to truly decide where the story goes." />
        <Grid className="features" columns={{ minWidth: 260, max: 3 }} gap={0}>
          {FEATURES.map((feature) => (
            <VStack key={feature.title} className="feature" gap={3} padding={6}>
              <Text className="fig" type="supporting" color="secondary">{feature.fig}</Text>
              <Heading level={3} type="display-3">{feature.title}</Heading>
              <Text color="secondary" textWrap="pretty">{feature.body}</Text>
            </VStack>
          ))}
        </Grid>
      </VStack>
    </section>
  );
}

/** The signature section: copy on one side, a designed sample of the random tool's output on the other. */
function Dice() {
  const { sample } = DICE;
  const pct = Math.round((sample.roll / sample.max) * 100);
  return (
    <section id="dice" className="section">
      <div className="wrap dice">
        <div className="dice-glow" aria-hidden="true" />
        <Grid columns={{ minWidth: 320, max: 2 }} gap={8} align="center">
          <VStack className="dice-copy" gap={4}>
            <Text className="eyebrow" type="label" color="accent">{DICE.eyebrow}</Text>
            <Heading level={2} type="display-2" textWrap="balance">{DICE.title}</Heading>
            <Text color="secondary" textWrap="pretty">{DICE.body}</Text>
            <HStack className="chips" gap={1.5} wrap="wrap">
              {DICE.kinds.map((kind) => <span key={kind} className="chip">{kind}</span>)}
            </HStack>
            <HStack>
              <Button label={DICE.link.label} variant="ghost" href={DICE.link.href} target="_blank" endContent={<Icon icon={ArrowUpRight} size="sm" color="inherit" />} />
            </HStack>
          </VStack>

          <div className="scenario">
            <HStack className="scenario-head" gap={2} vAlign="center" padding={4}>
              <span className="scenario-dot" aria-hidden="true" />
              <Text className="scenario-tool" type="supporting">random</Text>
              <Text className="scenario-label" type="supporting" color="secondary">tool call</Text>
            </HStack>
            <VStack className="scenario-body" gap={4} padding={5}>
              <VStack gap={1.5}>
                <Text className="scenario-kind" type="label" color="accent">{sample.kind}</Text>
                <Text className="scenario-text" color="primary">{sample.scenario}</Text>
              </VStack>
              <VStack className="roll" gap={2}>
                <HStack hAlign="between" vAlign="center">
                  <Text type="supporting" color="secondary">d{sample.max} roll</Text>
                  <HStack gap={2} vAlign="center">
                    <Text className="roll-value" weight="semibold" color="primary">{String(sample.roll).padStart(2, "0")}</Text>
                    <span className="fortune">{sample.fortune}</span>
                  </HStack>
                </HStack>
                <div className="meter" role="img" aria-label={`rolled ${sample.roll} of ${sample.max}`}>
                  <div className="meter-fill" style={{ width: `${pct}%` }} />
                </div>
              </VStack>
            </VStack>
          </div>
        </Grid>
      </div>
    </section>
  );
}

function Api() {
  return (
    <section id="api" className="section">
      <div className="wrap api">
        <Grid columns={{ minWidth: 320, max: 2 }} gap={0} align="stretch">
          <VStack className="api-copy" gap={4} padding={8} vAlign="center">
            <Text className="eyebrow" type="label" color="accent">{API.eyebrow}</Text>
            <Heading level={2} type="display-2" textWrap="balance">{API.title}</Heading>
            <Text color="secondary" textWrap="pretty">{API.body}</Text>
          </VStack>
          <div className="api-code">
            <CodeBlock code={API.curl} language="bash" title="curl" container="section" width="100%" />
          </div>
        </Grid>
      </div>
    </section>
  );
}

function Play() {
  return (
    <section id="play" className="section">
      <div className="wrap play-band">
        <div className="play-glow" aria-hidden="true" />
        <VStack gap={5} hAlign="center">
          <span className="mark mark-lg"><Icon icon={Dices} size="lg" color="inherit" /></span>
          <Heading level={2} type="display-2" justify="center" textWrap="balance">{PLAY.title}</Heading>
          <Text className="head-body" type="large" color="secondary" justify="center" textWrap="pretty">{PLAY.body}</Text>
          <Text type="supporting" color="secondary" justify="center">{WIDGET.subtitle}</Text>
        </VStack>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <VStack className="wrap" gap={8} paddingBlock={10}>
        <Grid className="footer-grid" columns={{ minWidth: 200, max: 4 }} gap={6}>
          <VStack gap={2}>
            <HStack className="brand" gap={2} vAlign="center">
              <span className="mark"><Icon icon={Dices} size="sm" color="inherit" /></span>
              <Text weight="semibold">{FOOTER.brand}</Text>
            </HStack>
            <Text type="supporting" color="secondary" textWrap="pretty">{FOOTER.tagline}</Text>
          </VStack>
          {FOOTER.columns.map((column) => (
            <VStack key={column.heading} className="footer-col" gap={2}>
              <Text className="footer-heading" type="supporting" color="secondary">{column.heading}</Text>
              {column.links.map((link) => (
                <a key={link.label} className="footer-link" href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{link.label}</a>
              ))}
            </VStack>
          ))}
        </Grid>
        <div className="footer-rule" />
        <HStack className="footer-bottom" hAlign="between" vAlign="center" wrap="wrap" gap={3}>
          <Text type="supporting" color="secondary">© {new Date().getFullYear()} Story Engine — MIT licensed.</Text>
          <a className="footer-repo" href={HERO.secondary.href} target="_blank" rel="noreferrer">
            <GithubMark />
            <span>github.com/rawkakani/llm-game-harness</span>
          </a>
        </HStack>
      </VStack>
    </footer>
  );
}

export function Landing() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Features />
        <Dice />
        <Api />
        <Play />
      </main>
      <Footer />
      <PlayWidget />
    </>
  );
}
