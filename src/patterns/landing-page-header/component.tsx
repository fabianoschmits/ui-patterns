"use client";
import { ArrowRight, Play } from "lucide-react";
import type { PatternPreviewProps } from "@/types/pattern";
import { PreviewFrame } from "@/patterns/shared/preview-frame";
export default function LandingPageHeader(props: PatternPreviewProps) { return <PreviewFrame {...props} className="landing-demo"><div className="landing-grain" /><header className="landing-header"><b>monument<span>®</span></b><nav><a>Studio</a><a>Work</a><a>Contact</a></nav><button aria-label="Abrir projeto"><ArrowRight size={15} /></button></header><div className="landing-hero"><small>Independent creative practice · 2024—26</small><h3>We build<br /><em>distinctive</em><br />digital places.</h3><div className="landing-bottom"><p>Brand, strategy and digital craft for people building what comes next.</p><button><Play size={13} fill="currentColor" /> Watch reel</button></div></div><div className="landing-shape"><i /><i /><i /></div></PreviewFrame>; }
