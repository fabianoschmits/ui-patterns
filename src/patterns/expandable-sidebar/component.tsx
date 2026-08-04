"use client";

import { useState } from "react";
import { Bell, ChevronLeft, LayoutGrid, MessageCircle, Settings, Sparkles, Users } from "lucide-react";
import type { PatternPreviewProps } from "@/types/pattern";
import { DemoAvatar, PreviewFrame } from "@/patterns/shared/preview-frame";

const items = [{ icon: LayoutGrid, label: "Visão geral" }, { icon: Users, label: "Equipe" }, { icon: MessageCircle, label: "Mensagens", count: 4 }, { icon: Settings, label: "Ajustes" }];

export default function ExpandableSidebar(props: PatternPreviewProps) {
  const [expanded, setExpanded] = useState(true);
  const [active, setActive] = useState("Visão geral");
  return (
    <PreviewFrame {...props} className="sidebar-demo">
      <aside className={expanded ? "demo-sidebar is-expanded" : "demo-sidebar"}>
        <div className="demo-sidebar-logo"><Sparkles size={16} /><span>Northstar</span></div>
        <button className="demo-collapse" onClick={() => setExpanded((value) => !value)} aria-label={expanded ? "Recolher menu" : "Expandir menu"}><ChevronLeft size={14} /></button>
        <nav aria-label="Demonstração de sidebar">
          {items.map(({ icon: Icon, label, count }) => <button key={label} onClick={() => setActive(label)} className={active === label ? "active" : ""} title={!expanded ? label : undefined}><Icon size={16} /><span>{label}</span>{count && <small>{count}</small>}</button>)}
        </nav>
        <div className="demo-sidebar-user"><DemoAvatar label="AM" /><span><b>Ana Moura</b><small>Product lead</small></span><Bell size={14} /></div>
      </aside>
      <section className="demo-workspace">
        <div className="demo-workspace-head"><span><i /> terça, 4 de agosto</span><DemoAvatar label="AM" /></div>
        <h3>{active}</h3><p>Um espaço calmo para seu melhor trabalho.</p>
        <div className="demo-stat-row"><div><small>Projetos ativos</small><b>12</b><i /></div><div><small>Foco da equipe</small><b>86%</b><i /></div></div>
        <div className="demo-lines"><i /><i /><i /></div>
      </section>
    </PreviewFrame>
  );
}
