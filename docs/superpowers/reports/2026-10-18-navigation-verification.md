# Verificação da coleção corrigida

A coleção foi refeita como dez menus compactos de navegação no mesmo MenuShowcase dos três modelos originais. Os dez painéis artísticos rejeitados foram removidos; os três menus originais não foram alterados.

## Verificações técnicas

- npm run lint: aprovado.
- npm run typecheck: aprovado.
- npm run build: aprovado, com 35 páginas estáticas.
- git diff --check: aprovado.

## Navegador

O build de produção foi executado localmente na porta 3002. Dez de dez fluxos passaram: selecionar Explorar por clique; usar ArrowRight para selecionar e focar Salvos; trocar para Público; usar End para selecionar Entrar; alternar para Vertical e Ícones; confirmar cinco destinos e seleção válida.

Leque de ações, Menu de canto e Pilha retrátil também passaram pelo fechamento com Escape: o painel saiu do DOM e o foco retornou ao gatilho. O console da conferência final não registrou erros.

As dez rotas foram inspecionadas a 390 px e 320 px. Nenhuma apresentou rolagem horizontal no documento ou botões fora do viewport. Foram conferidas as apresentações clara e escura e o caminho com movimento reduzido.

## Correções encontradas durante a revisão

- Preferência de movimento lida com useSyncExternalStore para evitar divergência de hidratação.
- Foco e seleção movidos juntos por setas, Home e End.
- Tooltips nos destinos cujo rótulo está oculto.
- Itens da pilha retrátil removidos imediatamente ao fechar, evitando foco em controles invisíveis.
- Abertura animada de menus retráteis acionada pelo usuário; a primeira apresentação já exibe todos os destinos.
- Ordem de key antes de props spread corrigida para evitar o fallback de compilação que gerava avisos de chaves no SSR.
- Rótulo selecionado da fita usa a largura disponível, evitando truncamento indevido.

As imagens de comparação foram recortadas de capturas reais do navegador, sem geração de mockups.
