"use client";

import { useState } from "react";
import { Activity, CheckCircle2, Clock3, FileText, GitCommitHorizontal, MessageCircle, MoreHorizontal, Sparkles, UserPlus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { PatternPreviewProps } from "@/types/pattern";
import { UtilityLiquidIndicator, UtilityShowcase, utilitySpring } from "@/patterns/utilities/shared/utility-showcase";

const events = [
  { id: 1, type: "equipe", icon: MessageCircle, person: "Marina", action: "comentou no protótipo", detail: "A transição ficou muito mais natural agora.", time: "há 8 min", tone: "violet" },
  { id: 2, type: "projeto", icon: CheckCircle2, person: "Você", action: "concluiu uma tarefa", detail: "Revisar estados vazios", time: "há 24 min", tone: "mint" },
  { id: 3, type: "sistema", icon: GitCommitHorizontal, person: "Sistema", action: "publicou uma nova versão", detail: "Release 2.8 · produção", time: "há 1 h", tone: "blue" },
  { id: 4, type: "equipe", icon: UserPlus, person: "Caio", action: "entrou no projeto", detail: "Convidado por Marina", time: "há 3 h", tone: "coral" },
  { id: 5, type: "projeto", icon: FileText, person: "Ana", action: "atualizou um documento", detail: "Diretrizes de conteúdo", time: "ontem", tone: "gold" },
  { id: 6, type: "equipe", icon: MessageCircle, person: "Lia", action: "respondeu uma conversa", detail: "Checklist de acessibilidade", time: "ontem", tone: "violet" },
  { id: 7, type: "sistema", icon: GitCommitHorizontal, person: "Sistema", action: "sincronizou a biblioteca", detail: "84 componentes atualizados", time: "ontem", tone: "blue" },
  { id: 8, type: "projeto", icon: CheckCircle2, person: "Ravi", action: "aprovou uma entrega", detail: "Protótipo responsivo", time: "2 dias", tone: "mint" },
  { id: 9, type: "equipe", icon: UserPlus, person: "Bia", action: "entrou no workspace", detail: "Time de Conteúdo", time: "2 dias", tone: "coral" },
];

export default function ActivityTimeline(props: PatternPreviewProps) {
  const [filter, setFilter] = useState("todos");
  const [live, setLive] = useState(true);
  const visible = filter === "todos" ? events : events.filter((event) => event.type === filter);

  return (
    <UtilityShowcase {...props} eyebrow="Contexto contínuo" title="Linha do tempo" description="Mudanças, conversas e marcos organizados como uma narrativa viva, filtrável e fácil de percorrer." accent={props.accent ?? "#417daf"}>
      {({ size }) => (
        <div className="utility-view u-split timeline-view">
          <aside className="u-aside timeline-aside">
            <div className="u-brand"><span className="u-brand-mark"><Activity size={16} /></span> Atividade</div>
            <div><span className="u-kicker">Projeto Aurora</span><h2 className="u-title">A história do trabalho, enquanto acontece.</h2><p className="u-copy u-aside-copy">Retome qualquer conversa sabendo o que mudou e por quê.</p></div>
            <button type="button" className={`timeline-live${live ? " is-on" : ""}`} onClick={() => setLive((value) => !value)}><motion.i animate={{ scale: live ? [1, 1.45, 1] : 1 }} transition={{ repeat: live ? Infinity : 0, duration: 1.8 }} /> Atualizações {live ? "ao vivo" : "pausadas"}</button>
          </aside>

          <main className="u-main timeline-main">
            <div className="u-row timeline-head"><div><span className="u-kicker">Hoje · 6 de agosto</span><b>Movimentos recentes</b></div><button type="button" className="u-icon-button" aria-label="Mais opções da atividade"><MoreHorizontal size={15} /></button></div>
            <div className="timeline-filters" role="group" aria-label="Filtrar atividades">{[["todos", "Tudo"], ["equipe", "Equipe"], ["projeto", "Projeto"], ["sistema", "Sistema"]].map(([value, label]) => <button type="button" key={value} className={filter === value ? "is-active" : ""} aria-pressed={filter === value} onClick={() => setFilter(value)}>{filter === value ? <UtilityLiquidIndicator layoutId="timeline-filter" /> : null}<span>{label}</span></button>)}</div>
            <motion.ol layout className="timeline-events">
              <AnimatePresence mode="popLayout" initial={false}>{visible.slice(0, size === "small" ? 4 : size === "medium" ? 7 : 9).map((event) => { const Icon = event.icon; return <motion.li layout key={event.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20 }} transition={utilitySpring}><div className={`timeline-icon tone-${event.tone}`}><Icon size={14} /></div><div className="timeline-line" /><div><p><b>{event.person}</b> {event.action}</p><span>{event.detail}</span><small><Clock3 size={10} />{event.time}</small></div></motion.li>; })}</AnimatePresence>
            </motion.ol>
            {size === "large" ? <div className="timeline-summary"><Sparkles size={14} /><span><b>Resumo do dia</b> · 12 tarefas concluídas e 4 decisões registradas.</span></div> : null}
          </main>
        </div>
      )}
    </UtilityShowcase>
  );
}
