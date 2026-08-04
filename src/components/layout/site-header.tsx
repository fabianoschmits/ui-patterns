"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, Menu, Search, X } from "lucide-react";
import { Brand } from "@/components/shared/brand";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useFavorites } from "@/providers/favorites-provider";
import { cn } from "@/lib/utils";

const links = [{ href: "/explore", label: "Explorar" }, { href: "/categories", label: "Categorias" }];

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { favorites } = useFavorites();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? "/explore?q=" + encodeURIComponent(value) : "/explore");
  }

  return (
    <header className={cn("site-header", scrolled && "is-scrolled")}>
      <div className="header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Navegação principal">
          {links.map((link) => <Link key={link.href} className={pathname.startsWith(link.href) ? "is-active" : undefined} href={link.href}>{link.label}</Link>)}
          <Link className={pathname === "/favorites" ? "is-active favorite-link" : "favorite-link"} href="/favorites">
            Favoritos {favorites.length > 0 && <span>{favorites.length}</span>}
          </Link>
        </nav>
        <div className="header-actions">
          <form className="header-search" onSubmit={submitSearch} role="search">
            <Search size={15} aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Pesquisar padrões" placeholder="Pesquisar" />
            <kbd>⌘ K</kbd>
          </form>
          <ThemeToggle />
          <Link className="button button-small desktop-cta" href="/explore">Explorar padrões</Link>
          <button className="icon-button mobile-menu-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label="Abrir menu">
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="mobile-nav" id="mobile-navigation" aria-label="Navegação mobile">
          <form className="mobile-search" onSubmit={submitSearch} role="search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Pesquisar padrões" placeholder="O que você quer construir?" autoFocus /></form>
          {links.map((link) => <Link href={link.href} key={link.href}>{link.label}<span>↗</span></Link>)}
          <Link href="/favorites"><span className="mobile-nav-label"><Heart size={17} /> Favoritos</span><small>{favorites.length}</small></Link>
        </nav>
      )}
    </header>
  );
}
