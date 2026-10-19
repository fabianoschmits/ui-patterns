# Coleção de navegação inovadora — design

## Objetivo

Publicar dez padrões interativos de navegação na galeria UI Patterns. Cada padrão deve ser reconhecível pela sua organização espacial e pela sua transição principal, sem reciclar as barras de vidro, cápsulas ativas, docks, gotas ou indicadores viajantes dos três menus existentes.

## Contexto e critérios de sucesso

O catálogo atual contém Menu rápido, Meniscus e Liquid Glass. Eles já cobrem barra inferior ou lateral, vidro, seleção por arraste, mola, expansão de rótulos e deformação líquida. A nova coleção deve oferecer dez lógicas de navegação que continuem claras por clique, toque e teclado.

Uma demonstração é aceita quando:

- aparece no catálogo e possui rota própria;
- seleciona destinos de forma previsível por ponteiro e teclado;
- apresenta uma composição e uma transição que não dependem de cor para se diferenciar;
- usa materiais opacos e paletas sem neon;
- respeita `prefers-reduced-motion`, mantendo o estado final e a navegação funcional;
- anima apenas propriedades compostas quando possível: `transform`, `opacity`, `filter`, `clip-path` e `mask`.

## Arquitetura

Cada menu será um pacote isolado em `src/patterns/<slug>/`, composto por `component.tsx` e uma folha CSS local. O componente administra apenas a seleção e seus controles específicos; dados de catálogo continuam em `src/data/patterns.ts` e o carregamento dinâmico continua centralizado em `src/patterns/registry.tsx`.

Não haverá uma fábrica visual que force os dez padrões a terem a mesma estrutura. Apenas utilitários de acessibilidade e, se necessários, dados pequenos de demonstração poderão ser compartilhados. Isso preserva a identidade de cada menu e impede que a coleção se reduza a skins de um componente-base.

## Padrões a construir

### 1. Territórios articulados (`articulated-territories-nav`)

Uma superfície tessellada sem lacunas. O território selecionado recebe o conteúdo e as regiões vizinhas se recolhem para as bordas, mantendo seus nomes e relações. A transição é uma reorganização de fronteiras com máscaras e transformações; a matéria visual é cerâmica fosca, carvão e um acento mineral.

### 2. Planta habitável (`inhabitable-plan-nav`)

Destinos aparecem como ambientes conectados de uma planta. Ao entrar em uma sala, suas paredes se afastam para formar a área de conteúdo e preservam as portas de retorno. A demonstração oferece alvos diretos e roving tabindex; a perspectiva serve orientação e não simula caminhada obrigatória.

### 3. Tear de rotas (`route-loom-nav`)

Duas taxonomias reais, como área e tarefa, formam urdidura e trama. Uma interseção abre um destino e os fios próximos criam uma abertura que explica a escolha. O componente deve expor todas as combinações como botões, sem depender da animação para entendimento.

### 4. Obturador editorial (`editorial-shutter-nav`)

Lâminas radiais compõem uma abertura central; cada lâmina é um destino. A escolha gira somente o conjunto necessário e revela conteúdo pelo centro. A linguagem é mecânica e editorial: papel marfim, grafite, latão envelhecido e vermelho-óxido, sem brilho emissivo.

### 5. Dobra cartográfica (`cartographic-fold-nav`)

Uma folha de mapa é dividida em painéis navegáveis. Selecionar um destino vira ou abre a dobra correspondente e revela sua face interna. A implementação usa transformações 3D discretas, sombras estáticas e alternativa instantânea em movimento reduzido.

### 6. Arquivo de gavetas (`archive-drawers-nav`)

Categorias são gavetas horizontais e destinos são fichas internas. Abrir uma gaveta desloca a frente e expõe as fichas; escolher uma ficha atualiza a área de leitura. As posições dos alvos permanecem estáveis e a profundidade é dada por camadas opacas, não por vidro.

### 7. Pórticos (`portal-sequence-nav`)

Uma sequência de pórticos verticais mostra fragmentos de cada destino. A seleção aproxima um portal e deixa o conteúdo surgir no vão, enquanto os demais preservam a posição em uma faixa de contexto. A transição terá curta profundidade de campo e nenhuma rotação contínua.

### 8. Móbile de destinos (`destination-mobile-nav`)

Itens pendem de um suporte e se equilibram ao trazer o destino selecionado ao primeiro plano. O movimento tem limite e desaceleração, sem alvos oscilantes após o clique. O estado sem movimento mostra a mesma hierarquia em posições estáticas.

### 9. Partitura de navegação (`navigation-score`)

Seções e subáreas tornam-se blocos de uma pauta. O usuário escolhe uma sequência legível de marcadores e a linha ativa revela o destino. A interação usa botões com nomes claros; a metáfora musical organiza o ritmo visual, não exige conhecimento musical.

### 10. Colagem de camadas (`layered-collage-nav`)

Cartazes, etiquetas e recortes representam destinos em um painel editorial. O item selecionado se separa do conjunto e se torna conteúdo pela mesma composição visual. Máscaras e pequenos deslocamentos substituem cartões convencionais; cada recorte permanece um botão semanticamente identificável.

## Movimento

O projeto é uma galeria criativa, portanto a ponderação é Jakub Krehel como referência principal de acabamento e Jhey Tompkins como referência secundária de expressão. A animação principal é acionada pela escolha de um destino; foco, teclado e troca recorrente de item recebem feedback mínimo ou instantâneo.

Entradas usam opacidade, deslocamento curto e desfoque leve quando ajudam a estabelecer foco. Saídas são menores que entradas. Não serão usados loops de atenção, pulsos, brilho neon, parallax de tela inteira ou movimento que impeça cliques. Cada folha local inclui uma regra explícita para reduzir transições e animações em `prefers-reduced-motion`.

## Acessibilidade e responsividade

Cada estrutura será um `nav` ou grupo de controles semanticamente nomeado, com `aria-current` para o destino selecionado. As listas terão navegação por setas quando forem conjuntos mutuamente exclusivos, e todos os itens manterão foco visível. Em telas estreitas, a geometria se reorganiza em uma versão empilhada que conserva a mesma lógica, sem exigir arraste, hover ou gestos precisos.

## Verificação

Após cada grupo de padrões, executar `npm run lint` e `npm run typecheck`. Ao fim, executar `npm run build` e validar as dez rotas estáticas, a publicação no catálogo, a navegação por teclado e o modo reduzido de movimento em uma inspeção no navegador.

## Fora de escopo

Não serão adicionadas dependências, imagens externas, efeitos neon, superfícies de vidro, variações de cor dos menus existentes ou uma camada genérica que homogeneíze os dez desenhos.
