import type { Metadata, Viewport } from "next";
import { Manrope, Syne } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AppProviders } from "@/providers/app-providers";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://uipatterns.dev"),
  title: {
    default: "UI Patterns",
    template: "%s — UI Patterns",
  },
  description: "Uma coleção simples de padrões de interface para explorar e reutilizar.",
  keywords: ["componentes React", "UI patterns", "Tailwind CSS", "TypeScript"],
  openGraph: {
    title: "UI Patterns",
    description: "Uma coleção simples de padrões de interface.",
    type: "website",
    locale: "pt_BR",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f1ec" },
    { media: "(prefers-color-scheme: dark)", color: "#121316" },
  ],
};

const themeInit =
  "try{const t=localStorage.getItem('ui-patterns-theme');const d=t||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');document.documentElement.dataset.theme=d;document.documentElement.style.colorScheme=d}catch(e){}";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${syne.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInit}
        </Script>
        <AppProviders>
          <a className="skip-link" href="#main-content">
            Pular para o conteúdo
          </a>
          <main id="main-content">{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
