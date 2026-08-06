# UI Patterns

Galeria interativa, documentação e laboratório de componentes para React, TypeScript e Tailwind CSS.

## O que está incluído

- Página inicial editorial e responsiva.
- Catálogo com busca, filtros e ordenação em tempo real.
- Três padrões autorais com prévias interativas.
- Rotas individuais geradas estaticamente.
- Laboratório com dispositivo, tema e personalização visual.
- Visualizador de código com cópia para a área de transferência.
- Favoritos persistentes no armazenamento local.
- Temas claro e escuro, navegação por teclado e movimento reduzido.
- Sitemap, robots, metadados e página 404.

## Desenvolvimento

~~~text
npm ci
npm run dev
~~~

Abra http://localhost:3000.

## Validação

~~~text
npm run lint
npm run typecheck
npm run build
~~~

## Deploy na Vercel

O projeto usa Next.js App Router e já inclui vercel.json, script vercel-build, versão mínima do Node e cabeçalhos de segurança. Importe o repositório na Vercel e mantenha as configurações detectadas automaticamente:

- Framework: Next.js
- Install command: npm ci
- Build command: npm run vercel-build
- Output: padrão do Next.js

Nenhuma variável de ambiente é necessária nesta versão.

## Arquitetura

Leia ARCHITECTURE.md para o modelo de catálogo, estratégia de carregamento e decisões de mobile-first.
