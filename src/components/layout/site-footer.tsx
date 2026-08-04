import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "@/components/shared/brand";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-promise">
        <span className="section-index">∞</span>
        <h2>Uma biblioteca feita para continuar crescendo.</h2>
        <p>Novos padrões, mesma obsessão por clareza, interação e código que você realmente pode usar.</p>
        <Link className="text-link" href="/explore">Abrir biblioteca <ArrowUpRight size={16} /></Link>
      </div>
      <div className="footer-bottom">
        <Brand />
        <p>Interfaces estudadas, construídas e compartilhadas com cuidado.</p>
        <div><Link href="/categories">Categorias</Link><Link href="/favorites">Favoritos</Link></div>
      </div>
    </footer>
  );
}
