import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
export default function NotFound() { return <section className="not-found"><span className="not-found-mark"><Sparkles size={26} /></span><small>404 / FORA DO MAPA</small><h1>Esse padrão ainda<br /><em>não existe.</em></h1><p>Mas a biblioteca está cheia de bons lugares para começar.</p><Link className="button" href="/explore"><ArrowLeft size={15} /> Voltar para explorar</Link></section>; }
