/**
 * The floating "play" widget: a bubble pinned to the bottom-right that opens a chat overlay. Visitors type what
 * they do and the harness answers with the story, streamed. It is the landing page's live demo of the endpoint.
 */
import { useEffect, useRef, useState } from "react";
import { Avatar } from "@astryxdesign/core/Avatar";
import { Button } from "@astryxdesign/core/Button";
import { ChatComposer, ChatMessage, ChatMessageBubble, ChatMessageList } from "@astryxdesign/core/Chat";
import { Icon } from "@astryxdesign/core/Icon";
import { Markdown } from "@astryxdesign/core/Markdown";
import { HStack, VStack } from "@astryxdesign/core/Stack";
import { Text } from "@astryxdesign/core/Text";
import { Dices, Sparkles, X } from "lucide-react";
import { play, type Msg } from "./client.ts";
import { WIDGET } from "./content.ts";

const OPENER: Msg = { role: "assistant", content: WIDGET.opener };

export function PlayWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([OPENER]);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const abort = useRef<AbortController | undefined>(undefined);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, isOpen]);
  useEffect(() => () => abort.current?.abort(), []);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isThinking) return;
    setError(undefined);
    const history: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setIsThinking(true);
    abort.current = new AbortController();
    const show = (content: string) =>
      setMessages((prev) => [...prev.slice(0, -1), { role: "assistant", content }]);
    try {
      // Drop the scripted opener before asking the server: it was never the model's, so it stays out of history.
      await play(history.slice(1), show, abort.current.signal);
    } catch (cause) {
      if ((cause as Error).name !== "AbortError") {
        setError((cause as Error).message);
        setMessages((prev) => prev.slice(0, -1));
      }
    } finally {
      setIsThinking(false);
    }
  }

  if (!isOpen) {
    return (
      <button type="button" className="fab" aria-label="Play the game" onClick={() => setIsOpen(true)}>
        <Icon icon={Dices} size="lg" color="inherit" />
      </button>
    );
  }

  return (
    <section className="overlay" aria-label="Play the game">
      <VStack className="overlay-head" gap={0}>
        <HStack padding={3} hAlign="between" vAlign="center">
          <HStack gap={2} vAlign="center">
            <Avatar name="Story Engine" size="sm" />
            <VStack gap={0}>
              <Text weight="semibold">{WIDGET.title}</Text>
              <Text type="supporting" color="secondary">{WIDGET.subtitle}</Text>
            </VStack>
          </HStack>
          <Button label="Close" variant="ghost" isIconOnly icon={<Icon icon={X} size="sm" />} onClick={() => setIsOpen(false)} />
        </HStack>
      </VStack>

      <VStack className="overlay-body" isScrollable padding={3} gap={3}>
        <ChatMessageList>
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              sender={message.role}
              avatar={message.role === "assistant" ? <Avatar name="Story Engine" size="sm" /> : undefined}
            >
              <ChatMessageBubble>
                {message.content
                  ? <Markdown density="compact">{message.content}</Markdown>
                  : <Text className="thinking" color="secondary"><Icon icon={Sparkles} size="sm" color="inherit" /> rolling the dice…</Text>}
              </ChatMessageBubble>
            </ChatMessage>
          ))}
        </ChatMessageList>
        <div ref={endRef} />
      </VStack>

      <div className="overlay-foot">
        <ChatComposer
          placeholder={WIDGET.placeholder}
          isDisabled={isThinking}
          onSubmit={send}
          status={error ? { type: "error", message: error } : undefined}
        />
      </div>
    </section>
  );
}
