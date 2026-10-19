# Coleção de navegação inovadora — plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar dez menus de navegação originais, interativos e acessíveis na galeria UI Patterns.

**Architecture:** Cada padrão terá uma pasta isolada com componente cliente e CSS local. O catálogo e o registro dinâmico recebem uma entrada por padrão; a implementação preserva o contrato `PatternPreviewProps` e não cria uma base visual compartilhada.

**Tech Stack:** Next.js 15, React 19, TypeScript, Motion, CSS.

**Spec:** `docs/superpowers/specs/2026-10-18-innovative-navigation-collection-design.md`

## Global Constraints

- Sem dependências novas, neon, vidro, dock, cápsula ativa ou indicador viajante.
- Cada padrão deve expor controles semânticos, foco visível e `prefers-reduced-motion` local.
- Animar transform, opacity, filter, clip-path ou mask; não animar propriedades de layout.
- Manter `npm run lint`, `npm run typecheck` e `npm run build` verdes.

## Review Focus

- Todas as dez entradas do catálogo devem ter preview carregável no registro.
- O foco por teclado deve selecionar o mesmo destino que o clique nos controles exclusivos.
- Movimento reduzido deve preservar o conteúdo selecionado sem transição perceptível.
- Geometrias estreitas não podem ocultar o destino selecionado.
- Nenhum padrão deve restabelecer barra de vidro, pill ou dock como estrutura principal.

---

### Task 1: Registrar a coleção e criar a fundação editorial

**Files:**
- Modify: `src/data/patterns.ts`
- Modify: `src/patterns/registry.tsx`
- Create: `src/patterns/navigation-collection/shared.ts`
- Test: `npm run typecheck`

- [ ] Adicionar as dez entradas de Navegação e seus imports dinâmicos.
- [ ] Criar dados e helpers mínimos para destinos, teclado roving e conteúdo de demonstração.
- [ ] Rodar `npm run typecheck`.

### Task 2: Construir os cinco padrões espaciais

**Files:**
- Create: `src/patterns/articulated-territories-nav/{component.tsx,territories.css}`
- Create: `src/patterns/inhabitable-plan-nav/{component.tsx,plan.css}`
- Create: `src/patterns/route-loom-nav/{component.tsx,loom.css}`
- Create: `src/patterns/editorial-shutter-nav/{component.tsx,shutter.css}`
- Create: `src/patterns/cartographic-fold-nav/{component.tsx,fold.css}`
- Test: `npm run lint && npm run typecheck`

- [ ] Implementar os cinco componentes com seleção por botão e `aria-current`.
- [ ] Aplicar a transição assinatura de cada estrutura e modo reduzido de movimento.
- [ ] Rodar lint e typecheck.

### Task 3: Construir os cinco padrões editoriais restantes

**Files:**
- Create: `src/patterns/archive-drawers-nav/{component.tsx,archive.css}`
- Create: `src/patterns/portal-sequence-nav/{component.tsx,portals.css}`
- Create: `src/patterns/destination-mobile-nav/{component.tsx,mobile.css}`
- Create: `src/patterns/navigation-score/{component.tsx,score.css}`
- Create: `src/patterns/layered-collage-nav/{component.tsx,collage.css}`
- Test: `npm run lint && npm run typecheck`

- [ ] Implementar os cinco componentes com controles acessíveis e transições próprias.
- [ ] Aplicar responsividade e modo reduzido de movimento em cada folha.
- [ ] Rodar lint e typecheck.

### Task 4: Validar a coleção e preparar a entrega

**Files:**
- Modify: arquivos ajustados pelos diagnósticos de lint, tipos e build.
- Test: `npm run lint && npm run typecheck && npm run build`

- [ ] Corrigir problemas de integração encontrados nas verificações.
- [ ] Confirmar que as dez rotas estáticas são geradas no build.
- [ ] Fazer revisão final do diff e registrar verificações.
