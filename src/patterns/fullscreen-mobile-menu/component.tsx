"use client";

import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import type { PatternPreviewProps } from "@/types/pattern";
import { PreviewFrame } from "@/patterns/shared/preview-frame";

export default function FullscreenMobileMenu(props: PatternPreviewProps) {
  const [open, setOpen] = useState(false);
  return <PreviewFrame {...props} className="mobile-menu-demo"><div className="mobile-device"><header><b>SOLACE</b><button onClick={() => setOpen((v) => !v)} aria-label="Alternar menu">{open ? <X size={18} /> : <Menu size={18} />}</button></header>{open ? <div className="mobile-menu-layer"><small>MENU</small>{["Coleções", "Journal", "Sobre"].map((item, index) => <button key={item}><span>0{index + 1}</span>{item}<ArrowUpRight size={16} /></button>)}<div><a>Instagram</a><a>Pinterest</a></div></div> : <div className="mobile-home"><span>01 — 04</span><div className="mobile-photo"><i /></div><h3>Objetos para<br />um cotidiano gentil.</h3><button onClick={() => setOpen(true)}>Explorar coleção <ArrowUpRight size={14} /></button></div>}</div></PreviewFrame>;
}
