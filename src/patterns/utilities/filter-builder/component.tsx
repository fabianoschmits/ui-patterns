"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Filter, Layers3, Plus, SlidersHorizontal, Sparkles, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { PatternPreviewProps } from "@/types/pattern";
import { UtilityShowcase, utilityQuickSpring, utilitySpring } from "@/patterns/utilities/shared/utility-showcase";

const choices = [
  ["Status", "é", "Em andamento"],
  ["Responsável", "contém", "Meu time"],
  ["Prazo", "antes de", "30 de agosto"],
  ["Prioridade", "é", "Alta"],
];

export default function FilterBuilder(props: PatternPreviewProps) {
  const [rules, setRules] = useState(choices.slice(0, 2).map((values, index) => ({ id: index + 1, values })));
  const [logic, setLogic] = useState<"E" | "OU">("E");
  const [applied, setApplied] = useState(true);
  const count = useMemo(() => Math.max(4, 36 - rules.length * 9 - (logic === "E" ? 4 : 0)), [logic, rules.length]);

  return (
    <UtilityShowcase {...props} eyebrow="Dados sob medida" title="Construtor de filtros" description="Regras visuais combináveis transformam consultas complexas em uma experiência direta e reversível." accent={props.accent ?? "#576fc7"}>
      {({ size }) => (
        <div className="utility-view u-split filters-view">
          <aside className="u-aside filters-aside">
            <div className="u-brand"><span className="u-brand-mark"><SlidersHorizontal size={16} /></span> Visão inteligente</div>
            <div><span className="u-kicker">Resultado em tempo real</span><motion.span className="filters-count" key={count} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>{applied ? count : 36}</motion.span><p className="u-copy">projetos correspondem às regras desta visão.</p></div>
            <div className="filters-insight u-hide-small"><Sparkles size={14} /> A combinação atual prioriza trabalho urgente do seu time.</div>
          </aside>

          <main className="u-main filters-main">
            <div className="u-row filters-head"><div><span className="u-kicker">Refinar projetos</span><b>Todos os filtros</b></div><button type="button" className="u-icon-button" onClick={() => { setRules([]); setApplied(false); }}><X size={14} /></button></div>
            <div className="filters-logic"><span>Mostrar itens que atendem</span><div className="u-tabs">{(["E", "OU"] as const).map((value) => <button type="button" key={value} className={logic === value ? "is-active" : ""} onClick={() => setLogic(value)}>{value}{logic === value ? <motion.i layoutId="filter-logic" transition={utilityQuickSpring} /> : null}</button>)}</div><span>às regras</span></div>

            <motion.div layout className="filters-rules">
              <AnimatePresence mode="popLayout" initial={false}>
                {rules.slice(0, size === "small" ? 2 : size === "medium" ? 3 : 4).map((rule, index) => <motion.div layout key={rule.id} className="filter-rule" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20 }} transition={utilitySpring}><span>{index + 1}</span>{rule.values.map((value) => <button type="button" key={value}>{value}<ChevronDown size={11} /></button>)}<button type="button" className="filter-delete" onClick={() => setRules((current) => current.filter((item) => item.id !== rule.id))}><Trash2 size={12} /></button></motion.div>)}
              </AnimatePresence>
              {rules.length === 0 ? <motion.div className="u-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Filter size={22} /><b>Nenhuma regra ainda</b><small>Comece criando um filtro.</small></motion.div> : null}
            </motion.div>

            <button type="button" className="filters-add" onClick={() => { const next = choices[rules.length % choices.length]; setRules((current) => [...current, { id: Date.now(), values: next }]); }}><Plus size={13} /> Adicionar regra</button>
            {size === "large" ? <div className="filters-preview"><Layers3 size={14} /><span>Visualização salva como <b>“Foco da semana”</b></span></div> : null}
            <button type="button" className="u-primary filters-apply" onClick={() => setApplied(true)}>{applied ? <Check size={14} /> : <Filter size={14} />} {applied ? `${count} resultados encontrados` : "Aplicar filtros"}</button>
          </main>
        </div>
      )}
    </UtilityShowcase>
  );
}
