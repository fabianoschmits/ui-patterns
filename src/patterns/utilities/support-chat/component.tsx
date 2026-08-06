"use client";

import { useState } from "react";
import {
  Bot,
  CheckCheck,
  ChevronLeft,
  Circle,
  Headphones,
  ImagePlus,
  MoreHorizontal,
  Paperclip,
  Send,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { PatternPreviewProps } from "@/types/pattern";
import {
  UtilityShowcase,
  utilityQuickSpring,
  utilitySpring,
} from "@/patterns/utilities/shared/utility-showcase";

interface ChatMessage { id: number; text: string; mine: boolean; time: string }

const initialMessages: ChatMessage[] = [
  { id: 1, text: "Olá! Sou a Lia. Como posso ajudar hoje?", mine: false, time: "10:32" },
  { id: 2, text: "Quero entender como organizar as permissões do meu time.", mine: true, time: "10:33" },
  { id: 3, text: "Claro. Posso mostrar o caminho mais simples e revisar com você.", mine: false, time: "10:33" },
];

export default function SupportChat(props: PatternPreviewProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);

  const send = () => {
    if (!draft.trim()) return;
    const text = draft.trim();
    setDraft("");
    setMessages((current) => [...current, { id: Date.now(), text, mine: true, time: "agora" }]);
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMessages((current) => [...current, { id: Date.now() + 1, text: "Perfeito. Vou preparar isso para você em poucos passos.", mine: false, time: "agora" }]);
    }, 900);
  };

  return (
    <UtilityShowcase
      {...props}
      eyebrow="Ajuda que parece humana"
      title="Chat de suporte"
      description="Conversa em tempo real, respostas assistidas e composição fluida em um painel pronto para qualquer página."
      accent={props.accent ?? "#16a98f"}
    >
      {({ size }) => (
        <div className="utility-view u-split chat-view">
          <aside className="u-aside chat-aside">
            <div className="u-brand"><span className="u-brand-mark"><Headphones size={16} /></span> Suporte Lume</div>
            <div>
              <span className="u-kicker">Tempo médio: 2 min</span>
              <h2 className="u-title">Uma conversa, não um protocolo.</h2>
              <p className="u-copy u-aside-copy">Conte o que aconteceu. Nós cuidamos do caminho até a solução.</p>
            </div>
            <div className="chat-status u-hide-small"><Circle size={8} fill="currentColor" /> Lia está online</div>
          </aside>

          <main className="u-main chat-main">
            <header className="chat-head">
              <button type="button" className="u-icon-button"><ChevronLeft size={15} /></button>
              <span className="u-avatar"><Bot size={15} /></span>
              <div className="u-grow"><b>Lia · Suporte</b><small>Online agora</small></div>
              <button type="button" className="u-icon-button"><MoreHorizontal size={15} /></button>
            </header>

            <div className="chat-messages" aria-live="polite">
              <AnimatePresence initial={false}>
                {messages.slice(-(size === "small" ? 3 : size === "medium" ? 5 : 7)).map((message) => (
                  <motion.div key={message.id} className={`chat-bubble${message.mine ? " is-mine" : ""}`} initial={{ opacity: 0, y: 12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={utilitySpring}>
                    <p>{message.text}</p>
                    <small>{message.time}{message.mine ? <CheckCheck size={11} /> : null}</small>
                  </motion.div>
                ))}
                {typing ? (
                  <motion.div className="chat-typing" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                    <i /><i /><i />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            {size !== "small" ? (
              <div className="chat-suggestion u-secondary-detail"><Sparkles size={12} /> Resposta sugerida: “Pode me mostrar onde encontro isso?”</div>
            ) : null}

            <form className="chat-compose" onSubmit={(event) => { event.preventDefault(); send(); }}>
              <button type="button" aria-label="Anexar arquivo"><Paperclip size={15} /></button>
              <button type="button" aria-label="Anexar imagem" className="u-hide-small"><ImagePlus size={15} /></button>
              <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Escreva uma mensagem…" aria-label="Mensagem" />
              <motion.button type="submit" className="chat-send" aria-label="Enviar mensagem" whileTap={{ scale: 0.88 }} transition={utilityQuickSpring}><Send size={15} /></motion.button>
            </form>
          </main>
        </div>
      )}
    </UtilityShowcase>
  );
}
