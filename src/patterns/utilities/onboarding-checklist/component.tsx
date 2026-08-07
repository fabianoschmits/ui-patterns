"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, Circle, Compass, PartyPopper, Play, Rocket, Sparkles, UserPlus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { PatternPreviewProps } from "@/types/pattern";
import { UtilityShowcase, utilityQuickSpring, utilitySpring } from "@/patterns/utilities/shared/utility-showcase";

const starterTasks = [
  { id: 1, title: "Personalize seu espaço", copy: "Nome, símbolo e cor da equipe", minutes: "2 min", icon: Sparkles },
  { id: 2, title: "Convide uma pessoa", copy: "Colaboração começa em boa companhia", minutes: "1 min", icon: UserPlus },
  { id: 3, title: "Crie o primeiro projeto", copy: "Transforme uma ideia em movimento", minutes: "3 min", icon: Rocket },
  { id: 4, title: "Conheça os atalhos", copy: "Um passeio rápido pela plataforma", minutes: "2 min", icon: Compass },
  { id: 5, title: "Importe seus arquivos", copy: "Traga referências e documentos", minutes: "2 min", icon: Sparkles },
  { id: 6, title: "Defina as permissões", copy: "Escolha quem edita e publica", minutes: "2 min", icon: UserPlus },
  { id: 7, title: "Publique sua primeira entrega", copy: "Compartilhe o trabalho com o time", minutes: "3 min", icon: Rocket },
];

export default function OnboardingChecklist(props: PatternPreviewProps) {
  const [done, setDone] = useState<Set<number>>(new Set([1]));
  const completed = done.size;
  const progress = useMemo(() => completed / starterTasks.length * 100, [completed]);
  const toggle = (id: number) => setDone((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; });

  return (
    <UtilityShowcase {...props} eyebrow="Primeiros passos" title="Onboarding guiado" description="Progresso, pequenas conquistas e próximos passos claros conduzem a pessoa sem sobrecarregar a experiência." accent={props.accent ?? "#9a6acb"}>
      {({ size }) => (
        <div className="utility-view u-split onboarding-view">
          <aside className="u-aside onboarding-aside">
            <div className="u-brand"><span className="u-brand-mark"><Rocket size={16} /></span> Comece por aqui</div>
            <div><span className="u-kicker">Seu progresso</span><div className="onboarding-ring" style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}><span><AnimatePresence mode="popLayout" initial={false}><motion.b key={completed} initial={{ opacity: 0, scale: 0.7, y: 4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.7, y: -4 }} transition={utilityQuickSpring}>{completed}/{starterTasks.length}</motion.b></AnimatePresence><small>concluídos</small></span></div><p className="u-copy">Cada pequeno passo deixa seu espaço mais pronto para trabalhar.</p></div>
            <motion.button type="button" className="onboarding-tour u-hide-small" whileTap={{ scale: 0.95 }} transition={utilityQuickSpring}><Play size={13} fill="currentColor" /> Ver tour de 90 segundos</motion.button>
          </aside>

          <main className="u-main onboarding-main">
            <AnimatePresence mode="popLayout" initial={false}>
              {completed === starterTasks.length ? <motion.div key="celebration" className="onboarding-complete" initial={{ opacity: 0, scale: 0.86 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={utilitySpring}><motion.span animate={{ rotate: [0, -8, 8, 0], y: [0, -5, 0] }} transition={{ duration: 0.8 }}><PartyPopper size={29} /></motion.span><span className="u-kicker">Tudo pronto</span><h3>Seu espaço ganhou vida.</h3><p>Agora você já conhece o essencial. O restante pode ser descoberto no seu ritmo.</p><motion.button type="button" className="u-primary" onClick={() => setDone(new Set([1]))} whileTap={{ scale: 0.95 }} transition={utilityQuickSpring}>Explorar novamente <ArrowRight size={14} /></motion.button></motion.div> : <motion.div key="tasks" className="onboarding-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.94 }}>
                <div className="u-row onboarding-head"><div><span className="u-kicker">Olá, Fabiano</span><b>Prepare seu espaço</b></div><AnimatePresence mode="popLayout" initial={false}><motion.span key={Math.round(progress)} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={utilityQuickSpring}>{Math.round(progress)}%</motion.span></AnimatePresence></div>
                <div className="u-progress onboarding-progress"><motion.span style={{ transformOrigin: "left center" }} initial={false} animate={{ scaleX: progress / 100 }} transition={utilitySpring} /></div>
                <motion.ul layout className="u-list onboarding-tasks"><AnimatePresence mode="popLayout" initial={false}>{starterTasks.slice(0, size === "small" ? 4 : size === "medium" ? 6 : 7).map((task) => { const Icon = task.icon; const checked = done.has(task.id); return <motion.li layout key={task.id} className={`u-list-item onboarding-task${checked ? " is-done" : ""}`} animate={{ opacity: checked ? 0.68 : 1 }} transition={utilitySpring}><motion.button type="button" className="onboarding-check" onClick={() => toggle(task.id)} aria-label={`${checked ? "Marcar como pendente" : "Concluir"}: ${task.title}`} aria-pressed={checked} whileTap={{ scale: 0.82 }} transition={utilityQuickSpring}><AnimatePresence mode="wait" initial={false}>{checked ? <motion.span key="checked" initial={{ opacity: 0, scale: 0.45, rotate: -30 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.45, rotate: 25 }} transition={utilityQuickSpring}><Check size={12} /></motion.span> : <motion.i key="pending" initial={{ opacity: 0, scale: 0.65 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.65 }} transition={utilityQuickSpring} style={{ display: "grid", placeItems: "center" }}><Circle size={15} /></motion.i>}</AnimatePresence></motion.button><span className="u-list-icon"><Icon size={14} /></span><div className="u-grow"><b>{task.title}</b><small>{task.copy}</small></div><span className="onboarding-time">{task.minutes}</span><ArrowRight size={13} /></motion.li>; })}</AnimatePresence></motion.ul>
                {size === "large" ? <div className="onboarding-tip"><Sparkles size={14} /><span><b>Dica:</b> você pode voltar a esta lista pelo menu de ajuda.</span></div> : null}
              </motion.div>}
            </AnimatePresence>
          </main>
        </div>
      )}
    </UtilityShowcase>
  );
}
