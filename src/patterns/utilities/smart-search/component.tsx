"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Clock3,
  Command,
  FileText,
  FolderKanban,
  Search,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { PatternPreviewProps } from "@/types/pattern";
import {
  UtilityShowcase,
  utilitySpring,
} from "@/patterns/utilities/shared/utility-showcase";

const searchable = [
  { title: "Projeto Aurora", detail: "Atualizado há 8 min", type: "Projetos", Icon: FolderKanban },
  { title: "Guia de identidade", detail: "Documento · 24 páginas", type: "Arquivos", Icon: FileText },
  { title: "Marina Costa", detail: "Product designer", type: "Pessoas", Icon: Users },
  { title: "Pesquisa de usuários", detail: "6 arquivos encontrados", type: "Arquivos", Icon: FileText },
  { title: "Time de Produto", detail: "12 participantes", type: "Pessoas", Icon: Users },
  { title: "Projeto Horizonte", detail: "Atualizado há 34 min", type: "Projetos", Icon: FolderKanban },
  { title: "Relatório de métricas", detail: "Documento · 18 páginas", type: "Arquivos", Icon: FileText },
  { title: "Caio Lima", detail: "Design engineer", type: "Pessoas", Icon: Users },
  { title: "Biblioteca de componentes", detail: "84 componentes publicados", type: "Projetos", Icon: FolderKanban },
  { title: "Notas da retrospectiva", detail: "Editado ontem por Ana", type: "Arquivos", Icon: FileText },
];

export default function SmartSearch(props: PatternPreviewProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Tudo");
  const [selected, setSelected] = useState(0);
  const filters = ["Tudo", "Projetos", "Arquivos", "Pessoas"];
  const results = useMemo(
    () => searchable.filter((item) =>
      (filter === "Tudo" || item.type === filter) &&
      item.title.toLowerCase().includes(query.toLowerCase()),
    ),
    [filter, query],
  );

  return (
    <UtilityShowcase
      {...props}
      eyebrow="Encontrar sem interromper"
      title="Busca inteligente"
      description="Pesquisa global com filtros, atalhos recentes e resultados que se reorganizam enquanto você digita."
      accent={props.accent ?? "#5b7fe5"}
    >
      {({ size }) => (
        <div className="utility-view u-split search-view">
          <aside className="u-aside search-aside">
            <div className="u-brand">
              <span className="u-brand-mark"><Search size={16} /></span>
              Atalho global
            </div>
            <div className="search-idea">
              <span className="u-kicker">Busca contextual</span>
              <h2 className="u-title">Tudo está a uma pergunta.</h2>
              <p className="u-copy u-aside-copy">Encontre pessoas, documentos e projetos no mesmo fluxo.</p>
            </div>
            <div className="search-shortcut u-hide-small">
              <Command size={13} /> <span>Pressione</span> <kbd>⌘ K</kbd>
            </div>
          </aside>

          <main className="u-main search-main">
            <label className="u-input-wrap search-box">
              <Search size={17} />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSelected(0);
                }}
                placeholder="Busque em todo o espaço…"
                aria-label="Busca global"
              />
              {query ? (
                <button type="button" aria-label="Limpar busca" onClick={() => setQuery("")}>
                  <X size={14} />
                </button>
              ) : <kbd>⌘ K</kbd>}
            </label>

            <div className="search-filters" role="group" aria-label="Filtrar resultados">
              {filters.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={filter === item ? "is-active" : undefined}
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="u-row search-result-head">
              <span>{query ? `${results.length} resultados` : "Sugestões para você"}</span>
              <span className="u-badge"><Sparkles size={11} /> Inteligente</span>
            </div>

            <AnimatePresence mode="popLayout" initial={false}>
              {results.length ? (
                <motion.ul layout className="u-list search-results" key={`${filter}-${query || "all"}`}>
                  {results.slice(0, size === "small" ? 4 : size === "medium" ? 7 : 10).map((item, index) => {
                    const Icon = item.Icon;
                    return (
                      <motion.li
                        layout
                        key={item.title}
                        className={`u-list-item search-result${selected === index ? " is-selected" : ""}`}
                        initial={{ opacity: 0, y: 9 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={utilitySpring}
                        onMouseEnter={() => setSelected(index)}
                      >
                        <span className="u-list-icon"><Icon size={15} /></span>
                        <div className="u-grow">
                          <b>{item.title}</b>
                          <small>{item.detail}</small>
                        </div>
                        <span className="search-type">{item.type}</span>
                        <ArrowUpRight size={14} />
                      </motion.li>
                    );
                  })}
                </motion.ul>
              ) : (
                <motion.div className="u-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <span><Search size={19} /></span>
                  <b>Nenhum resultado ainda</b>
                  <p>Tente uma palavra mais curta ou selecione outro filtro.</p>
                </motion.div>
              )}
            </AnimatePresence>

            {!query && size !== "small" ? (
              <div className="search-recent u-secondary-detail">
                <Clock3 size={12} /> Recentes: Briefing, Biblioteca, Marina
              </div>
            ) : null}
          </main>
        </div>
      )}
    </UtilityShowcase>
  );
}
