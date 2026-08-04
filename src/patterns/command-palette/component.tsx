"use client";

import { useMemo, useState } from "react";
import { ArrowRight, FileText, FolderKanban, Search, Settings, UserPlus } from "lucide-react";
import type { PatternPreviewProps } from "@/types/pattern";
import { PreviewFrame } from "@/patterns/shared/preview-frame";

const commands = [{ icon: FileText, label: "Criar novo documento", group: "Ações" }, { icon: UserPlus, label: "Convidar uma pessoa", group: "Ações" }, { icon: FolderKanban, label: "Abrir projeto Aurora", group: "Recentes" }, { icon: Settings, label: "Preferências do workspace", group: "Navegação" }];
export default function CommandPalette(props: PatternPreviewProps) {
  const [query, setQuery] = useState(""); const [selected, setSelected] = useState(0);
  const visible = useMemo(() => commands.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())), [query]);
  return <PreviewFrame {...props} className="command-demo"><div className="command-backdrop"><div className="command-window"><label><Search size={17} /><input value={query} onChange={(e) => { setQuery(e.target.value); setSelected(0); }} placeholder="Digite um comando ou pesquise…" aria-label="Buscar comandos" /><kbd>ESC</kbd></label><small className="command-section">Sugestões</small><div role="listbox">{visible.map(({ icon: Icon, label }, index) => <button key={label} role="option" aria-selected={selected === index} onMouseEnter={() => setSelected(index)} onClick={() => setQuery(label)} className={selected === index ? "active" : ""}><Icon size={16} /><span>{label}</span><ArrowRight size={13} /></button>)}{visible.length === 0 && <p className="command-empty">Nenhum comando encontrado.</p>}</div><footer><span><kbd>↑</kbd><kbd>↓</kbd> navegar</span><span><kbd>↵</kbd> selecionar</span></footer></div></div></PreviewFrame>;
}
