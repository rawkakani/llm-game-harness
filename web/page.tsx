/**
 * The landing page: a dark, developer-tool homepage in the manner of linear.app. A sticky nav, a centered hero
 * glowing over a game-transcript preview, three feature columns, a "talk to it like OpenAI" band with a curl
 * sample, and a footer. The live demo lives in the floating PlayWidget, bottom-right.
 */
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { CodeBlock } from "@astryxdesign/core/CodeBlock";
import { Grid } from "@astryxdesign/core/Grid";
import { Heading } from "@astryxdesign/core/Heading";
import { Icon } from "@astryxdesign/core/Icon";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { ArrowRight, Dices } from "lucide-react";
import { API, FEATURES, FOOTER, HERO, NAV, PREVIEW, WIDGET } from "./content.ts";
import { PlayWidget } from "./widget.tsx";

function Nav() {
  return (
    <header className="nav">
      <HStack className="wrap" paddingBlock={3} hAlign="between" vAlign="center">
        <HStack className="brand" gap={2} vAlign="center">
          <span className="mark"><Icon icon={Dices} size="sm" color="inherit" /></span>
          <Text weight="semibold">Story Engine</Text>
        </HStack>
        <HStack className="nav-links" gap={1} vAlign="center">
          {NAV.map((item) => <Button key={item.label} label={item.label} variant="ghost" size="sm" href={item.href} />)}
        </HStack>
        <Button label="Play it now" variant="primary" size="sm" href="#play" endContent={<Icon icon={ArrowRight} size="sm" color="inherit" />} />
      </HStack>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="glow" aria-hidden="true" />
      <VStack className="wrap" gap={10} hAlign="center" paddingBlock={10}>
        <VStack gap={5} hAlign="center">
          <Text className="eyebrow" type="label" color="accent" justify="center">{HERO.eyebrow}</Text>
          <Heading className="hero-title" level={1} type="display-1" justify="center" textWrap="balance">{HERO.title}</Heading>
          <Text className="hero-blurb" type="large" color="secondary" justify="center" textWrap="pretty">{HERO.blurb}</Text>
          <HStack className="hero-cta" gap={3} vAlign="center" wrap="wrap">
            <Button label={HERO.primary.label} variant="primary" size="lg" href={HERO.primary.href} endContent={<Icon icon={ArrowRight} size="sm" color="inherit" />} />
            <Button label={HERO.secondary.label} variant="secondary" size="lg" href={HERO.secondary.href} target="_blank" />
          </HStack>
        </VStack>
        <Preview />
      </VStack>
    </section>
  );
}

/** The hero's picture: a short, fixed game transcript dressed as an app window, so the page reads as a game at a glance. */
function Preview() {
  return (
    <Card className="preview" padding={0} variant="transparent">
      <HStack className="preview-bar" gap={1.5} vAlign="center" padding={3}>
        <span className="dot" /><span className="dot" /><span className="dot" />
        <Text className="preview-title" type="supporting" color="secondary">a pirate adventure · /v1/chat/completions</Text>
      </HStack>
      <VStack className="preview-body" gap={4} padding={4}>
        {PREVIEW.map((turn, index) => (
          <VStack key={index} gap={1.5} className={`turn turn-${turn.role}`}>
            <Text type="label" color={turn.role === "user" ? "accent" : "secondary"}>{turn.role === "user" ? "you" : "game master"}</Text>
            <Text className="turn-text" color="primary">{turn.text}</Text>
          </VStack>
        ))}
      </VStack>
    </Card>
  );
}

function Features() {
  return (
    <section id="how" className="section">
      <VStack className="wrap" gap={8}>
        <VStack gap={3} hAlign="center">
          <Heading level={2} type="display-3" justify="center" textWrap="balance">A tiny harness with one good idea</Heading>
          <Text type="large" color="secondary" justify="center" textWrap="pretty">Chance, handed to the model as a tool, and let to truly decide where the story goes.</Text>
        </VStack>
        <Grid columns={{ minWidth: 280, max: 3 }} gap={4}>
          {FEATURES.map((feature) => (
            <Card key={feature.title} className="feature" padding={5}>
              <VStack gap={2}>
                <Heading level={3} type="display-3">{feature.title}</Heading>
                <Text color="secondary" textWrap="pretty">{feature.body}</Text>
              </VStack>
            </Card>
          ))}
        </Grid>
      </VStack>
    </section>
  );
}

function Api() {
  return (
    <section id="api" className="section">
      <Card className="wrap api" padding={0}>
        <Grid columns={{ minWidth: 320, max: 2 }} gap={0}>
          <VStack className="api-copy" gap={4} padding={6} vAlign="center">
            <Heading level={2} type="display-3" textWrap="balance">{API.title}</Heading>
            <Text color="secondary" textWrap="pretty">{API.body}</Text>
          </VStack>
          <div className="api-code">
            <CodeBlock code={API.curl} language="bash" title="curl" container="section" width="100%" />
          </div>
        </Grid>
      </Card>
    </section>
  );
}

function Play() {
  return (
    <section id="play" className="section">
      <Card className="wrap play-band" padding={8}>
        <VStack gap={4} hAlign="center">
          <span className="mark mark-lg"><Icon icon={Dices} size="lg" color="inherit" /></span>
          <Heading level={2} type="display-2" justify="center" textWrap="balance">Play it right here</Heading>
          <Text type="large" color="secondary" justify="center" textWrap="pretty">
            Tap the dice in the corner. The adventure starts at a fork in the road — type what you do, and see where the dice take it.
          </Text>
          <Text type="supporting" color="secondary" justify="center">{WIDGET.subtitle}</Text>
        </VStack>
      </Card>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <HStack className="wrap" paddingBlock={6} hAlign="between" vAlign="center" wrap="wrap" gap={3}>
        <Text type="supporting" color="secondary">{FOOTER.note}</Text>
        <HStack gap={1} vAlign="center">
          {FOOTER.links.map((link) => <Button key={link.label} label={link.label} variant="ghost" size="sm" href={link.href} target="_blank" />)}
        </HStack>
      </HStack>
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
        <Api />
        <Play />
      </main>
      <Footer />
      <PlayWidget />
    </>
  );
}
