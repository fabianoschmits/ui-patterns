"use client";

import { useState } from "react";
import { ArrowRight, BookOpen, Boxes, ChevronDown, Sparkles } from "lucide-react";
import type { PatternPreviewProps } from "@/types/pattern";
import { PreviewFrame } from "@/patterns/shared/preview-frame";

export default function ModernMegaMenu(props: PatternPreviewProps) {
  const [open, setOpen] = useState(true);
  return <PreviewFrame {...props} className="mega-menu-demo"><header className="mega-header"><b>fieldwork</b><nav><button onClick={() => setOpen((v) => !v)} aria-expanded={open}>Produto <ChevronDown size={13} /></button><button>Clientes</button><button>Recursos</button></nav><button className="demo-pill">Começar</button></header>{open ? <div className="mega-panel"><div className="mega-intro"><span className="mega-icon"><Sparkles size={18} /></span><small>Plataforma</small><b>Tudo que sua equipe precisa para colocar ideias em movimento.</b><a>Conheça o produto <ArrowRight size={13} /></a></div><div className="mega-links"><a><Boxes size={17} /><span><b>Workspace</b><small>Planeje e acompanhe o trabalho.</small></span></a><a><BookOpen size={17} /><span><b>Knowledge</b><small>Documente o que importa.</small></span></a><a><Sparkles size={17} /><span><b>Automations</b><small>Remova tarefas repetitivas.</small></span></a></div><div className="mega-feature"><span>Em destaque</span><div className="feature-art"><i /><i /><i /></div><b>Menos status, mais progresso.</b><small>Veja como a Linear organiza o ciclo.</small></div></div> : <div className="mega-closed"><p>Selecione “Produto” para explorar o menu.</p></div>}</PreviewFrame>;
}
