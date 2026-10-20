# 0002. Lugar do bloco de rótulo pelo slot de tela

- **Status:** Aceita
- **Data:** 2026-10-20
- **Domínio afetado:** Visualização do Radar, Taxonomia de Quadrantes e Anéis

## Contexto

A [ADR 0001](0001-geometria-configuravel-do-grafico.md) estabelece a quantidade de quadrantes
como escolha de configuração e separa os dois números de cada quadrante: `order`, o slot de tela
que reparte o círculo, e `position`, o número exibido. Arcos, brilho de fundo e pontos já
consomem `segmentAngles` a partir do slot, para qualquer quantidade de setores.

O layout ao redor do diagrama ficou de fora dessa migração. O bloco de rótulo de cada quadrante
recebe o seu canto de uma tabela de quatro entradas indexada por `position`, aplicada como
`style` inline, e a grade de listagens da página inicial fixa a largura de cada bloco em 45% com
quebra de linha — uma composição que só fecha com quatro blocos. Uma taxonomia com cinco
quadrantes lê entrada inexistente na tabela e deixa o quinto bloco sem posicionamento.

Os dois números divergem em todos os quatro quadrantes publicados, e o layout atual está correto
por consequência da combinação dos dois mapeamentos, não por construção: trocar `order` move o
setor no diagrama e deixa o bloco no canto antigo, sem erro visível.

## Decisão

O lugar do bloco de rótulo vem do slot de tela do quadrante, resolvido por `slotOf` em
`src/components/Chart/geometry.ts` e aplicado como a classe `quadrant-label--slot-N`. A
`position` responde apenas pelo número que o leitor lê no bloco.

O lugar de cada slot é declarado em `src/components/RadarGrid/radar-grid.scss`, em uma tabela
indexada pela classe do slot e pelo atributo `data-quadrants` que a `div.radar-grid` publica. A
tabela declara um lugar por slot para as quantidades de um a seis quadrantes, e é ela que fixa o
teto de seis da taxonomia. A tabela é portada da branch `v5` de
`AOEpeople/aoe_technology_radar`, introduzida no PR #502 daquele repositório, sob licença
Apache-2.0 — a mesma origem e a mesma licença deste fork.

## Consequências

- Bloco e setor ficam do mesmo lado por construção: reordenar o desenho leva o bloco junto, e o
  desalinhamento silencioso entre os dois deixa de ser possível.
- A taxonomia deixa de exigir uma `position` entre 1 e 4. Posição repetida passa a significar
  número exibido repetido, não dois blocos no mesmo lugar.
- O teto do radar passa a ser seis quadrantes, e ele é de layout, não de geometria: a repartição
  do círculo continua genérica para qualquer N, e um sétimo quadrante ganha setor correto com um
  bloco sem lugar próprio, sobreposto ao do slot 6. Elevar o teto é acrescentar lugares à tabela.
- As quantidades de cinco e de seis quadrantes exigem espaço reservado no contêiner do gráfico —
  faixa abaixo do círculo para o bloco do centro inferior, faixa nas laterais para os blocos do
  meio. Com seis quadrantes o diagrama fica menor, contrapartida aceita para manter os blocos
  fora do círculo. Nenhuma regra de espaço incide sobre quatro quadrantes, de modo que o layout
  publicado permanece intocado.
- Com seis quadrantes a legenda das formas vai para o centro inferior, a única região livre
  nessa quantidade.
- `QuadrantLabel` passa a viver em arquivo próprio, fora do grafo de importação do `d3`, o que
  torna a escolha do lugar afirmável por teste de componente. A equivalência visual com
  `techradar.db1.com.br` continua conferida por captura de tela.
- A restrição global de quatro quadrantes do `AGENTS.md` dá lugar ao teto de seis, com a sua
  origem na tabela de lugares.

## Alternativas consideradas

- **Calcular o lugar de cada bloco em tempo de renderização**, a partir do ângulo médio do setor,
  sem teto de quantidade. Dispensaria a tabela e aceitaria qualquer N, mas o lugar do bloco não é
  função contínua do ângulo: ele precisa cair em uma das regiões livres da caixa do gráfico —
  canto, meio de lateral ou centro inferior —, e cada uma exige espaço reservado próprio no
  contêiner. A fórmula produziria blocos sobre o círculo nas quantidades em que hoje há lugar
  declarado, e trocaria uma tabela legível por um cálculo que a conferência visual teria de
  refazer a cada quantidade.
- **Manter a escolha pela posição exibida**, corrigindo apenas o estouro de índice com mais
  entradas na tabela. Preserva o layout publicado com menos código, e deixa de pé o defeito que
  motiva a decisão: a posição é dado editorial, livre para ser renumerada, e o setor é dado de
  tela. Enquanto os dois coincidirem em consequência, o layout está certo por sorte; na primeira
  reordenação do desenho, o bloco fica do lado errado sem que nada acuse.
- **Encolher o bloco nas quantidades altas**, com largura menor em vez de espaço reservado no
  contêiner. Evitaria mexer no tamanho do diagrama, ao custo de um bloco com largura variável por
  quantidade de quadrantes — a descrição longa do quadrante passaria a quebrar de forma diferente
  em cada taxonomia, e o texto publicado hoje deixaria de ter uma única largura de referência.
