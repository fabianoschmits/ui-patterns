"use client";

import { useId, useMemo, useRef, useState } from "react";
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
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import type { PatternPreviewProps } from "@/types/pattern";
import {
  UtilityLiquidIndicator,
  UtilityShowcase,
  utilityQuickSpring,
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
  const uid = useId().replace(/:/g, "");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Tudo");
  const [selected, setSelected] = useState(0);
  const resultRefs = useRef<Array<HTMLLIElement | null>>([]);
  const filters = ["Tudo", "Projetos", "Arquivos", "Pessoas"];
  const results = useMemo(
    () => searchable.filter((item) =>
      (filter === "Tudo" || item.type === filter) &&
      item.title.toLowerCase().includes(query.toLowerCase()),
    ),
    [filter, query],
  );

  const focusResult = (index: number, resultCount: number) => {
    if (!resultCount) return;
    const nextIndex = Math.max(0, Math.min(index, resultCount - 1));
    setSelected(nextIndex);
    window.requestAnimationFrame(() => resultRefs.current[nextIndex]?.focus());
  };

  return (
    <UtilityShowcase
      {...props}
      eyebrow="Encontrar sem interromper"
      title="Busca inteligente"
      description="Pesquisa global com filtros, atalhos recentes e resultados que se reorganizam enquanto você digita."
      accent={props.accent ?? "#5b7fe5"}
      frame="wide"
    >
      {({ size }) => {
        const visibleResults = results.slice(0, size === "small" ? 4 : size === "medium" ? 7 : 10);
        const activeResult = visibleResults.length ? Math.min(selected, visibleResults.length - 1) : -1;

        return (
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
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    focusResult(0, visibleResults.length);
                  } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    focusResult(visibleResults.length - 1, visibleResults.length);
                  }
                }}
              />
              {query ? (
                <button type="button" aria-label="Limpar busca" onClick={() => { setQuery(""); setSelected(0); }}>
                  <X size={14} />
                </button>
              ) : <kbd>⌘ K</kbd>}
            </label>

            <LayoutGroup id={`search-filters-${uid}`}>
              <div className="search-filters search-liquid-filters" role="group" aria-label="Filtrar resultados">
                {filters.map((item) => {
                  const active = filter === item;
                  return (
                    <motion.button
                      type="button"
                      key={item}
                      className={active ? "is-active" : undefined}
                      aria-pressed={active}
                      onClick={() => { setFilter(item); setSelected(0); }}
                      whileTap={{ scale: 0.92 }}
                      transition={utilityQuickSpring}
                    >
                      {active ? (
                        <UtilityLiquidIndicator
                          layoutId={`search-filter-indicator-${uid}`}
                          tone="soft"
                          className="search-filter-liquid-indicator"
                        />
                      ) : null}
                      <motion.span
                        className="search-filter-label"
                        animate={{ y: active ? -1 : 0, scale: active ? 1.03 : 1 }}
                        transition={utilityQuickSpring}
                      >
                        {item}
                      </motion.span>
                    </motion.button>
                  );
                })}
              </div>
            </LayoutGroup>

            <div className="u-row search-result-head">
              <span>{query ? `${results.length} resultados` : "Sugestões para você"}</span>
              <span className="u-badge"><Sparkles size={11} /> Inteligente</span>
            </div>

            <LayoutGroup id={`search-results-${uid}`}>
              <AnimatePresence mode="popLayout" initial={false}>
                {visibleResults.length ? (
                  <motion.ul
                    layout="position"
                    className="u-list search-results search-liquid-results"
                    key="search-results"
                    role="listbox"
                    aria-label="Resultados da busca"
                  >
                    <AnimatePresence mode="popLayout" initial={false}>
                      {visibleResults.map((item, index) => {
                        const Icon = item.Icon;
                        const isSelected = activeResult === index;
                        return (
                          <motion.li
                            layout="position"
                            ref={(element) => { resultRefs.current[index] = element; }}
                            key={item.title}
                            id={`search-result-${uid}-${index}`}
                            className={`u-list-item search-result search-liquid-result${isSelected ? " is-selected" : ""}`}
                            role="option"
                            aria-selected={isSelected}
                            tabIndex={isSelected ? 0 : -1}
                            initial={{ opacity: 0, y: 9 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={utilitySpring}
                            onClick={() => setSelected(index)}
                            onFocus={() => setSelected(index)}
                            onMouseEnter={() => setSelected(index)}
                            onKeyDown={(event) => {
                              if (event.key === "ArrowDown") {
                                event.preventDefault();
                                focusResult((index + 1) % visibleResults.length, visibleResults.length);
                              } else if (event.key === "ArrowUp") {
                                event.preventDefault();
                                focusResult((index - 1 + visibleResults.length) % visibleResults.length, visibleResults.length);
                              } else if (event.key === "Home") {
                                event.preventDefault();
                                focusResult(0, visibleResults.length);
                              } else if (event.key === "End") {
                                event.preventDefault();
                                focusResult(visibleResults.length - 1, visibleResults.length);
                              } else if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                setSelected(index);
                              }
                            }}
                          >
                            {isSelected ? (
                              <UtilityLiquidIndicator
                                layoutId={`search-result-indicator-${uid}`}
                                tone="soft"
                                className="search-result-liquid-indicator"
                              />
                            ) : null}
                            <motion.span
                              className="u-list-icon search-result-liquid-icon"
                              animate={{ y: isSelected ? -2 : 0, scale: isSelected ? 1.06 : 1 }}
                              transition={utilityQuickSpring}
                            >
                              <Icon size={15} />
                            </motion.span>
                            <div className="u-grow">
                              <b>{item.title}</b>
                              <small>{item.detail}</small>
                            </div>
                            <span className="search-type">{item.type}</span>
                            <motion.span
                              className="search-result-liquid-arrow"
                              animate={{ x: isSelected ? 2 : 0, y: isSelected ? -2 : 0 }}
                              transition={utilityQuickSpring}
                            >
                              <ArrowUpRight size={14} />
                            </motion.span>
                          </motion.li>
                        );
                      })}
                    </AnimatePresence>
                  </motion.ul>
                ) : (
                  <motion.div key="search-empty" className="u-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <span><Search size={19} /></span>
                    <b>Nenhum resultado ainda</b>
                    <p>Tente uma palavra mais curta ou selecione outro filtro.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </LayoutGroup>

            {!query && size !== "small" ? (
              <div className="search-recent u-secondary-detail">
                <Clock3 size={12} /> Recentes: Briefing, Biblioteca, Marina
              </div>
            ) : null}
          </main>
        </div>
        );
      }}
    </UtilityShowcase>
  );
}
