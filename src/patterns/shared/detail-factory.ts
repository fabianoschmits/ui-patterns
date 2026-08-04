import { getPatternBySlug } from "@/data/patterns";
import type { PatternDetail, PatternProp, SourceFile } from "@/types/pattern";

interface DetailInput {
  introduction: string;
  features: string[];
  accessibility: string[];
  responsiveNotes: string[];
  componentCode: string;
  usageCode?: string;
  props?: PatternProp[];
}

const defaultProps: PatternProp[] = [
  { name: "className", type: "string", defaultValue: "-", description: "Classes adicionais para integrar o componente ao layout." },
  { name: "defaultOpen", type: "boolean", defaultValue: "false", description: "Estado inicial de abertura, quando aplicável." },
  { name: "onChange", type: "(value: string) => void", defaultValue: "-", description: "Notifica mudanças no item selecionado." },
];

export function makeDetail(slug: string, input: DetailInput): PatternDetail {
  const summary = getPatternBySlug(slug);
  if (!summary) throw new Error("Pattern not found: " + slug);
  const sourceFiles: SourceFile[] = [
    { name: "component.tsx", language: "tsx", code: input.componentCode.trim() },
    { name: "usage.tsx", language: "tsx", code: (input.usageCode || makeUsage(slug)).trim() },
    { name: "tokens.css", language: "css", code: makeTokens(summary.accent) },
  ];

  return {
    ...summary,
    introduction: input.introduction,
    features: input.features,
    installation: [
      "Adicione component.tsx ao diretório de componentes do projeto.",
      summary.dependencies.length ? "Instale: npm install " + summary.dependencies.join(" ") : "Nenhuma dependência externa é necessária.",
      "Importe o componente e ajuste os tokens visuais à sua marca.",
    ],
    usage: "O padrão funciona com estado próprio e também pode ser controlado por propriedades em fluxos mais complexos.",
    props: input.props || defaultProps,
    accessibility: input.accessibility,
    responsiveNotes: input.responsiveNotes,
    sourceFiles,
  };
}

function makeUsage(slug: string) {
  const name = slug.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join("");
  return "import { " + name + " } from '@/components/" + slug + "';\n\nexport function Example() {\n  return <" + name + " defaultOpen />;\n}";
}

function makeTokens(accent: string) {
  const colors: Record<string, string> = { lavender: "#6e59d9", blue: "#5384a5", mint: "#427a63", peach: "#b7655b", cream: "#9c762b" };
  return ":root {\n  --pattern-accent: " + (colors[accent] || colors.lavender) + ";\n  --pattern-surface: #ffffff;\n  --pattern-ink: #17171c;\n  --pattern-radius: 12px;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  *, *::before, *::after { transition-duration: 0.01ms !important; }\n}";
}
