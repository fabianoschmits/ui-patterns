"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp, Check, ChevronLeft, ChevronRight, Columns3, Download, Filter, MoreHorizontal, Search, Table2, Trash2, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { PatternPreviewProps } from "@/types/pattern";
import { UtilityShowcase, utilityQuickSpring, utilitySpring } from "@/patterns/utilities/shared/utility-showcase";

const starterRows = [
  { id: 1, name: "Marina Costa", initials: "MC", project: "Aurora", status: "Em curso", value: 84 },
  { id: 2, name: "Caio Lima", initials: "CL", project: "Horizonte", status: "Revisão", value: 62 },
  { id: 3, name: "Ana Nunes", initials: "AN", project: "Nébula", status: "Concluído", value: 100 },
  { id: 4, name: "Ravi Souza", initials: "RS", project: "Lume", status: "Em curso", value: 76 },
  { id: 5, name: "Lia Torres", initials: "LT", project: "Brisa", status: "Planejado", value: 18 },
  { id: 6, name: "Bia Mendes", initials: "BM", project: "Aurora", status: "Revisão", value: 54 },
  { id: 7, name: "João Viana", initials: "JV", project: "Nexo", status: "Em curso", value: 69 },
  { id: 8, name: "Nina Alves", initials: "NA", project: "Orbe", status: "Concluído", value: 100 },
  { id: 9, name: "Ivo Rocha", initials: "IR", project: "Brisa", status: "Planejado", value: 24 },
  { id: 10, name: "Luna Freire", initials: "LF", project: "Lume", status: "Em curso", value: 81 },
  { id: 11, name: "Theo Martins", initials: "TM", project: "Horizonte", status: "Revisão", value: 47 },
  { id: 12, name: "Eva Ramos", initials: "ER", project: "Nébula", status: "Em curso", value: 73 },
];

export default function DataTableTools(props: PatternPreviewProps) {
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState(starterRows);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [descending, setDescending] = useState(false);
  const filtered = useMemo(() => rows.filter((row) => `${row.name} ${row.project}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => descending ? b.value - a.value : a.value - b.value), [descending, query, rows]);
  const toggle = (id: number) => setSelected((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; });

  return (
    <UtilityShowcase {...props} eyebrow="Informação acionável" title="Tabela operacional" description="Busca, seleção, ordenação e ações em massa preservam clareza mesmo quando os dados ficam densos." accent={props.accent ?? "#2f8b78"} frame="wide">
      {({ size }) => (
        <div className="utility-view u-split table-view">
          <aside className="u-aside table-aside">
            <div className="u-brand"><span className="u-brand-mark"><Table2 size={16} /></span> Operações</div>
            <div><span className="u-kicker">Portfólio ativo</span><span className="table-metric"><AnimatePresence mode="popLayout" initial={false}><motion.span key={rows.length} initial={{ opacity: 0, y: 7, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -7, scale: 0.9 }} transition={utilityQuickSpring}>{rows.length}</motion.span></AnimatePresence></span><p className="u-copy">pessoas distribuídas entre projetos e entregas desta semana.</p></div>
            <div className="table-health u-hide-small"><span><Users size={14} /> Ocupação da equipe</span><div className="u-progress"><motion.span style={{ transformOrigin: "left center" }} initial={false} animate={{ scaleX: 0.76 }} transition={utilitySpring} /></div></div>
          </aside>

          <main className="u-main table-main">
            <div className="table-toolbar">
              <label className="u-input-wrap"><Search size={14} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar pessoa ou projeto" /></label>
              <motion.button type="button" className="u-secondary" whileTap={{ scale: 0.94 }} transition={utilityQuickSpring}><Filter size={13} /><span>Filtrar</span></motion.button>
              <motion.button type="button" className="u-icon-button u-hide-small" aria-label="Escolher colunas" whileTap={{ scale: 0.88, rotate: 4 }} transition={utilityQuickSpring}><Columns3 size={14} /></motion.button>
            </div>

            <AnimatePresence mode="popLayout" initial={false}>
              {selected.size ? (
                <motion.div key="bulk" className="table-bulk" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={utilitySpring}>
                  <span><AnimatePresence mode="popLayout" initial={false}><motion.b key={selected.size} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={utilityQuickSpring}>{selected.size}</motion.b></AnimatePresence> selecionado{selected.size > 1 ? "s" : ""}</span>
                  <motion.button type="button" whileTap={{ scale: 0.92 }} transition={utilityQuickSpring}><Download size={13} /> Exportar</motion.button>
                  <motion.button type="button" onClick={() => { setRows((current) => current.filter((row) => !selected.has(row.id))); setSelected(new Set()); }} whileTap={{ scale: 0.92 }} transition={utilityQuickSpring}><Trash2 size={13} /> Remover</motion.button>
                </motion.div>
              ) : (
                <motion.div key="head" className="table-caption" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -4 }} transition={utilitySpring}>
                  <span>Equipe e projetos</span>
                  <motion.button type="button" aria-pressed={descending} onClick={() => setDescending((value) => !value)} whileTap={{ scale: 0.92 }} transition={utilityQuickSpring}>
                    <motion.span animate={{ rotate: descending ? 180 : 0 }} transition={utilityQuickSpring} style={{ display: "inline-flex" }}><ArrowDownUp size={12} /></motion.span>
                    Progresso
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="data-table" role="table">
              <div className="data-row data-head" role="row"><span /><span>Pessoa</span>{size !== "small" ? <span>Projeto</span> : null}<span>Status</span><span>Avanço</span><span /></div>
              <AnimatePresence mode="popLayout" initial={false}>
                {filtered.slice(0, size === "small" ? 5 : size === "medium" ? 8 : 12).map((row) => {
                  const isSelected = selected.has(row.id);
                  return (
                    <motion.div layout key={row.id} className={`data-row${isSelected ? " is-selected" : ""}`} role="row" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, scale: isSelected ? 0.997 : 1 }} exit={{ opacity: 0, x: 20 }} transition={utilitySpring}>
                      <motion.button type="button" className={`table-check${isSelected ? " is-on" : ""}`} onClick={() => toggle(row.id)} aria-label={`${isSelected ? "Desmarcar" : "Selecionar"} ${row.name}`} aria-pressed={isSelected} whileTap={{ scale: 0.78 }} transition={utilityQuickSpring}>
                        <AnimatePresence initial={false}>{isSelected ? <motion.span key="check" initial={{ opacity: 0, scale: 0.4, rotate: -25 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.4, rotate: 20 }} transition={utilityQuickSpring} style={{ display: "grid", placeItems: "center" }}><Check size={10} /></motion.span> : null}</AnimatePresence>
                      </motion.button>
                      <span className="data-person"><i className="u-avatar">{row.initials}</i><b>{row.name}</b></span>
                      {size !== "small" ? <span>{row.project}</span> : null}
                      <span><i className={`data-status is-${row.status.toLowerCase().replace(" ", "-")}`}>{row.status}</i></span>
                      <span className="data-progress"><i><motion.b style={{ transformOrigin: "left center" }} initial={false} animate={{ scaleX: row.value / 100 }} transition={utilitySpring} /></i><small>{row.value}%</small></span>
                      <motion.button type="button" className="table-more" aria-label={`Mais opções para ${row.name}`} whileTap={{ scale: 0.82, rotate: -5 }} transition={utilityQuickSpring}><MoreHorizontal size={13} /></motion.button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            {!filtered.length ? <div className="u-empty"><Search size={20} /><b>Nenhum resultado</b><small>Tente um nome ou projeto diferente.</small></div> : null}
            <div className="table-pagination"><span>1–<AnimatePresence mode="popLayout" initial={false}><motion.b key={`${filtered.length}-${size}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={utilityQuickSpring}>{Math.min(filtered.length, size === "small" ? 5 : size === "medium" ? 8 : 12)}</motion.b></AnimatePresence> de {filtered.length}</span><div><motion.button type="button" aria-label="Página anterior" whileTap={{ scale: 0.82, x: -2 }} transition={utilityQuickSpring}><ChevronLeft size={13} /></motion.button><motion.button type="button" aria-label="Próxima página" whileTap={{ scale: 0.82, x: 2 }} transition={utilityQuickSpring}><ChevronRight size={13} /></motion.button></div></div>
          </main>
        </div>
      )}
    </UtilityShowcase>
  );
}
