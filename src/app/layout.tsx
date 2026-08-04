import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { AppProviders } from "@/providers/app-providers";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://uipatterns.dev"),
  title: { default: "UI Patterns — Interfaces que transformam ideias", template: "%s — UI Patterns" },
  description: "Explore componentes modernos, veja cada interação em funcionamento e leve o código para seus projetos.",
  keywords: ["componentes React", "UI patterns", "Tailwind CSS", "TypeScript", "interfaces web"],
  openGraph: { title: "UI Patterns", description: "Uma galeria interativa de componentes modernos para a web.", type: "website", locale: "pt_BR" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: [{ media: "(prefers-color-scheme: light)", color: "#f8f7fc" }, { media: "(prefers-color-scheme: dark)", color: "#15141a" }] };

const themeInit = "try{const t=localStorage.getItem('ui-patterns-theme');const d=t||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');document.documentElement.dataset.theme=d;document.documentElement.style.colorScheme=d}catch(e){}";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head><Script id="theme-init" strategy="beforeInteractive">{themeInit}</Script></head>
      <body>
        <AppProviders>
          <a className="skip-link" href="#main-content">Pular para o conteúdo</a>
          <SiteHeader />
          <main id="main-content">{children}</main>
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}
