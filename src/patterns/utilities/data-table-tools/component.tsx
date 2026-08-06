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
];

export default function DataTableTools(props: PatternPreviewProps) {
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState(starterRows);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [descending, setDescending] = useState(false);
  const filtered = useMemo(() => rows.filter((row) => `${row.name} ${row.project}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => descending ? b.value - a.value : a.value - b.value), [descending, query, rows]);
  const toggle = (id: number) => setSelected((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; });

  return (
    <UtilityShowcase {...props} eyebrow="Informação acionável" title="Tabela operacional" description="Busca, seleção, ordenação e ações em massa preservam clareza mesmo quando os dados ficam densos." accent={props.accent ?? "#2f8b78"}>
      {({ size }) => (
        <div className="utility-view u-split table-view">
          <aside className="u-aside table-aside">
            <div className="u-brand"><span className="u-brand-mark"><Table2 size={16} /></span> Operações</div>
            <div><span className="u-kicker">Portfólio ativo</span><span className="table-metric">{rows.length}</span><p className="u-copy">pessoas distribuídas entre projetos e entregas desta semana.</p></div>
            <div className="table-health u-hide-small"><span><Users size={14} /> Ocupação da equipe</span><div className="u-progress"><span style={{ width: "76%" }} /></div></div>
          </aside>

          <main className="u-main table-main">
            <div className="table-toolbar">
              <label className="u-input-wrap"><Search size={14} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar pessoa ou projeto" /></label>
              <button type="button" className="u-secondary"><Filter size={13} /><span>Filtrar</span></button>
              <button type="button" className="u-icon-button u-hide-small"><Columns3 size={14} /></button>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {selected.size ? <motion.div key="bulk" className="table-bulk" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}><span>{selected.size} selecionado{selected.size > 1 ? "s" : ""}</span><button type="button"><Download size={13} /> Exportar</button><button type="button" onClick={() => { setRows((current) => current.filter((row) => !selected.has(row.id))); setSelected(new Set()); }}><Trash2 size={13} /> Remover</button></motion.div> : <motion.div key="head" className="table-caption" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><span>Equipe e projetos</span><button type="button" onClick={() => setDescending((value) => !value)}><ArrowDownUp size={12} /> Progresso</button></motion.div>}
            </AnimatePresence>

            <div className="data-table" role="table">
              <div className="data-row data-head" role="row"><span /><span>Pessoa</span>{size !== "small" ? <span>Projeto</span> : null}<span>Status</span><span>Avanço</span><span /></div>
              <AnimatePresence mode="popLayout" initial={false}>{filtered.slice(0, size === "small" ? 3 : size === "medium" ? 4 : 5).map((row) => <motion.div layout key={row.id} className={`data-row${selected.has(row.id) ? " is-selected" : ""}`} role="row" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20 }} transition={utilitySpring}><button type="button" className={`table-check${selected.has(row.id) ? " is-on" : ""}`} onClick={() => toggle(row.id)}>{selected.has(row.id) ? <Check size={10} /> : null}</button><span className="data-person"><i className="u-avatar">{row.initials}</i><b>{row.name}</b></span>{size !== "small" ? <span>{row.project}</span> : null}<span><i className={`data-status is-${row.status.toLowerCase().replace(" ", "-")}`}>{row.status}</i></span><span className="data-progress"><i><motion.b animate={{ width: `${row.value}%` }} transition={utilitySpring} /></i><small>{row.value}%</small></span><button type="button" className="table-more"><MoreHorizontal size={13} /></button></motion.div>)}</AnimatePresence>
            </div>
            {!filtered.length ? <div className="u-empty"><Search size={20} /><b>Nenhum resultado</b><small>Tente um nome ou projeto diferente.</small></div> : null}
            <div className="table-pagination"><span>1–{Math.min(filtered.length, size === "small" ? 3 : size === "medium" ? 4 : 5)} de {filtered.length}</span><div><button type="button"><ChevronLeft size={13} /></button><button type="button"><ChevronRight size={13} /></button></div></div>
          </main>
        </div>
      )}
    </UtilityShowcase>
  );
}
