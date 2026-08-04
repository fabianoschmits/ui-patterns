"use client";

import { useState } from "react";
import { ArrowUpRight, Menu } from "lucide-react";
import type { PatternPreviewProps } from "@/types/pattern";
import { PreviewFrame } from "@/patterns/shared/preview-frame";

export default function FloatingTopMenu(props: PatternPreviewProps) {
  const [active, setActive] = useState("Trabalho");
  return <PreviewFrame {...props} className="floating-menu-demo">
    <div className="floating-canvas"><span className="mini-brand">Morrow<span>.</span></span><p>Estúdio independente<br />para marcas inquietas.</p><button className="demo-round"><ArrowUpRight size={16} /></button></div>
    <nav className="floating-nav" aria-label="Menu flutuante"><span className="mini-brand">M.</span>{["Trabalho", "Estúdio", "Notas"].map((item) => <button className={active === item ? "active" : ""} onClick={() => setActive(item)} key={item}>{item}</button>)}<button className="floating-menu-icon" aria-label="Abrir navegação"><Menu size={15} /></button></nav>
  </PreviewFrame>;
}
