"use client";

import { useMemo, useState } from "react";
import { Check, Code2, Copy, Maximize2, Monitor, Moon, Palette, Play, Smartphone, Sun, Tablet, SlidersHorizontal } from "lucide-react";
import { PatternPreview } from "@/components/preview/pattern-preview";
import type { PatternDevice, PatternSummary, PreviewTheme } from "@/types/pattern";
import { cn } from "@/lib/utils";

export function PatternLab({ pattern, mode = "preview" }: { pattern: PatternSummary; mode?: "preview" | "code" }) {
  const [device, setDevice] = useState<PatternDevice>("desktop");
  const [theme, setTheme] = useState<PreviewTheme>("light");
  const [accent, setAccent] = useState("#6e59d9");
  const [radius, setRadius] = useState(12);
  const [shadow, setShadow] = useState(35);
  const [speed, setSpeed] = useState(1);
  const [tab, setTab] = useState("component.tsx");
  const [copied, setCopied] = useState(false);
  const code = useMemo(() => getCode(pattern.slug, tab), [pattern.slug, tab]);

  async function copyCode() { try { await navigator.clipboard.writeText(code); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { setCopied(false); } }
  if (mode === "code") return <div className="code-lab"><div className="code-toolbar"><div className="code-tabs">{["component.tsx", "tokens.css", "usage.tsx"].map((item) => <button className={tab === item ? "active" : ""} onClick={() => setTab(item)} key={item}>{item}</button>)}</div><button className="copy-button" onClick={copyCode}>{copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "Copiado" : "Copiar código"}</button></div><pre><code>{code}</code></pre><div className="code-footer"><span><Code2 size={14} /> TypeScript ready</span><span>Tailwind CSS · React</span></div></div>;
  return <div className="pattern-lab"><div className="lab-toolbar"><div className="device-switcher" role="group" aria-label="Tamanho da demonstração">{([ ["desktop", Monitor], ["tablet", Tablet], ["mobile", Smartphone] ] as const).map(([value, Icon]) => <button key={value} className={device === value ? "active" : ""} onClick={() => setDevice(value)} aria-label={value}><Icon size={15} /></button>)}</div><div className="theme-switcher" role="group" aria-label="Tema da demonstração"><button className={theme === "light" ? "active" : ""} onClick={() => setTheme("light")} aria-label="Tema claro"><Sun size={14} /></button><button className={theme === "dark" ? "active" : ""} onClick={() => setTheme("dark")} aria-label="Tema escuro"><Moon size={14} /></button></div><button className="lab-fullscreen" aria-label="Abrir em tela cheia"><Maximize2 size={15} /></button></div><div className="lab-stage"><div className={cn("lab-device", "device-" + device)}><PatternPreview slug={pattern.slug} theme={theme} accent={accent} radius={radius} shadow={shadow} speed={speed} /></div></div><div className="lab-controls"><div className="lab-control-group"><span><Palette size={14} /> Cor principal</span><div className="color-options">{["#6e59d9", "#5384a5", "#427a63", "#b7655b", "#9c762b"].map((color) => <button key={color} className={accent === color ? "active" : ""} style={{ backgroundColor: color }} onClick={() => setAccent(color)} aria-label={"Usar cor " + color} />)}</div></div><label className="range-control"><span><SlidersHorizontal size={14} /> Raio <b>{radius}px</b></span><input type="range" min="0" max="24" value={radius} onChange={(event) => setRadius(Number(event.target.value))} /></label><label className="range-control"><span><SlidersHorizontal size={14} /> Sombra <b>{shadow}%</b></span><input type="range" min="0" max="80" value={shadow} onChange={(event) => setShadow(Number(event.target.value))} /></label><label className="range-control"><span><Play size={13} /> Velocidade <b>{speed === 1 ? "normal" : speed < 1 ? "rápida" : "suave"}</b></span><input type="range" min="0.5" max="2" step="0.5" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} /></label></div></div>;
}

function getCode(slug: string, tab: string) {
  const title = slug.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join("");
  if (tab === "tokens.css") return [":root {", "  --pattern-accent: #6e59d9;", "  --pattern-radius: 12px;", "  --pattern-shadow: 0 18px 50px rgb(23 23 28 / .10);", "}", "", "@media (prefers-reduced-motion: reduce) {", "  *, *::before, *::after {", "    animation-duration: .01ms !important;", "    transition-duration: .01ms !important;", "  }", "}"].join("\\n");
  if (tab === "usage.tsx") return ["import { " + title + " } from \"./" + slug + "\";", "", "export function Example() {", "  return <" + title + " defaultOpen />;", "}"].join("\\n");
  return ["\"use client\";", "", "import { useState } from \"react\";", "", "export function " + title + "() {", "  const [open, setOpen] = useState(true);", "", "  return (", "    <section data-open={open}>", "      <button onClick={() => setOpen(!open)}", "        aria-expanded={open}>", "        Toggle " + title, "      </button>", "    </section>", "  );", "}"].join("\\n");
}
