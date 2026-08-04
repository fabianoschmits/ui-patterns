"use client";

import { useState } from "react";
import { Bell, CalendarDays, Home, Mail, Search, UserRound } from "lucide-react";
import type { PatternPreviewProps } from "@/types/pattern";
import { PreviewFrame } from "@/patterns/shared/preview-frame";

const dockItems = [{ icon: Home, label: "Início" }, { icon: Search, label: "Buscar" }, { icon: CalendarDays, label: "Agenda" }, { icon: Mail, label: "Mensagens" }, { icon: Bell, label: "Avisos" }, { icon: UserRound, label: "Perfil" }];
export default function NavigationDock(props: PatternPreviewProps) { const [active, setActive] = useState("Início"); return <PreviewFrame {...props} className="dock-demo"><div className="dock-scene"><div className="dock-date"><span>Hoje</span><b>04</b><small>AGOSTO · TERÇA</small></div><p>{active === "Início" ? "Bom dia, Ana." : active}</p><div className="dock-cards"><i /><i /><i /></div><nav className="demo-dock">{dockItems.map(({ icon: Icon, label }) => <button key={label} className={active === label ? "active" : ""} onClick={() => setActive(label)} title={label}><Icon size={17} /><span>{label}</span></button>)}</nav></div></PreviewFrame>; }
