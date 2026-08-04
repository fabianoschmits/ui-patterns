"use client";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { PatternPreviewProps } from "@/types/pattern";
import { PreviewFrame } from "@/patterns/shared/preview-frame";
export default function AnimatedIndicatorNavbar(props: PatternPreviewProps) { const [active, setActive] = useState("Overview"); return <PreviewFrame {...props} className="indicator-demo"><nav className="indicator-nav"><b>atlas<span>·</span></b><div>{["Overview", "Projects", "Journal"].map((item) => <button key={item} onClick={() => setActive(item)} className={active === item ? "active" : ""}>{item}</button>)}</div><button className="indicator-arrow" aria-label="Abrir painel"><ArrowUpRight size={15} /></button></nav><div className="indicator-content"><small>/{active.toLowerCase()}</small><h3>Make room<br /><em>for good work.</em></h3><span className="indicator-line" /></div></PreviewFrame>; }
