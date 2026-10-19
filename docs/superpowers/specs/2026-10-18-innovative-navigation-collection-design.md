# Menus compactos de navegação — direção corrigida

## Objetivo
Criar dez menus de navegação utilizáveis como Menu rápido, Meniscus e Liquid Glass, com a mesma apresentação no laboratório. A primeira entrega interpretou o pedido como composições artísticas de tela inteira; o usuário rejeitou essa direção. Este documento substitui aquele desenho.

## Apresentação
Reutilizar MenuShowcase: cabeçalho, demonstração central compacta, modos Público/Logado, orientação Horizontal/Vertical, Rótulos/Ícones e controles de cores. O conteúdo principal deve ser um menu com cinco destinos, ícones, seleção clara e alvos estáveis. O cabeçalho mostra a página escolhida, seguindo os três exemplos originais.

## Dez modelos
- Dock recortado: tecla elevada se encaixa num recorte animado da base.
- Trilho prisma: navegação lateral com teclas chanfradas e cursor de borda.
- Abas dobradas: abas articuladas com cantos dobráveis.
- Ilha expansível: o destino ativo abre espaço para o seu rótulo.
- Teclas magnéticas: peças independentes respondem com elevação e inclinação.
- Fita de navegação: colchetes móveis percorrem uma faixa segmentada.
- Anel orbital: cinco destinos contornam a seleção central.
- Leque de ações: um gatilho desdobra a lista de destinos.
- Menu de canto: dois braços articulados abrem os atalhos.
- Pilha retrátil: camadas se abrem em uma lista recolhível.

## Implementação
Cada modelo possui component.tsx e CSS próprio. Apenas os dados de demonstração, controles do laboratório, cores e lógica de teclado são compartilhados em navigation-collection/shared.tsx. O catálogo tipado fica em src/data/navigation-patterns.ts, integrado ao catálogo e ao registro dinâmico existentes.

## Comportamento
Todos os menus oferecem cinco destinos e atualizam seleção e título por clique ou teclado. Setas, Home e End movem seleção e foco juntos. Menus retráteis fecham com Escape e devolvem o foco ao gatilho; itens fechados não podem receber foco. Estado de movimento reduzido é lido de forma compatível com SSR. Teclado produz mudança imediata; ponteiro recebe animação característica. Animações são acionadas pela interação, sem loops de atenção.

## Critérios visuais
Materiais opacos, sombras físicas e paleta sóbria sem neon. As dez silhuetas e mecânicas devem se distinguir. As três implementações originais permanecem como referência. As composições artísticas rejeitadas são removidas do catálogo e do código.

## Verificação
Inspecionar as dez rotas no navegador, com clique, teclado, modos e orientações. Conferir larguras de 320 e 390 px, temas claro e escuro, superfícies personalizadas e prefers-reduced-motion. Executar lint, typecheck e build antes de commit e push.

## Ambiente de prévia
UI_PATTERNS_PREVIEW=1 usa .next-preview, isolando o servidor de desenvolvimento da saída .next do build de produção. Isso evita os manifestos ausentes observados na execução anterior.
