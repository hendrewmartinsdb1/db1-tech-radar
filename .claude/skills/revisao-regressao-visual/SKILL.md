---
name: revisao-regressao-visual
description: >
  Use para validar mudanças no desenho do radar contra regressão visual: depois
  de mexer em arcos, blips, brilho de fundo, rótulos ou geometria, ou antes de
  abrir PR que toque em src/components/Chart, RadarGrid ou QuadrantGrid. Cobre
  comparação de screenshot antes/depois, os 3 idiomas, o responsivo de 800px e
  o teste de N=3/4/5/6 com blip dentro do setor.
---

# Revisão de regressão visual do radar

O risco central da 2125624 é **regressão visual**: é refatoração de geometria,
não ajuste de parâmetro. A validação precisa cobrir os 3 idiomas e o responsivo,
porque o layout atual assume uma grade 2x2.

## Checklist obrigatório

### 1. Equivalência em N=4 (o publicado hoje)
- [ ] Radar **pixel-equivalente** ao de hoje: mesmas cores nos mesmos lugares,
      mesma numeração "QUADRANTE 1..4", mesmo brilho de fundo.
- [ ] Comparar **screenshot antes e depois** da mudança.
- [ ] Faixas angulares travadas: languages 270°–360°, methods 0°–90°,
      platforms 180°–270°, tools 90°–180°.

### 2. Generalização
- [ ] Renderiza corretamente com **N = 3, 4, 5 e 6**, cobrindo arcos, brilho de
      fundo, rótulos de quadrante e rótulos de anel.
- [ ] Atenção **N=3** no glow: se aparecer fio de fundo faltando no meio do
      arco, o raio dos vértices do polígono precisa ser `size` (ver R3 na skill
      `radar-geometry`).

### 3. Blips
- [ ] Nenhum blip com coordenada `NaN`/`undefined`.
- [ ] Nº de blips renderizados **igual** ao nº de itens (blip com `NaN` some
      silenciosamente do SVG).
- [ ] Nenhum blip fora do seu setor — **coberto por teste automatizado**, não só
      no olho.

### 4. Idiomas e navegação
- [ ] Português, inglês e espanhol: rótulos, textos de ajuda e página de item.
- [ ] Rotas por quadrante, busca, página de item e visão geral OK (inclusive
      para um quadrante novo, se houver).

### 5. Responsivo
- [ ] Breakpoint de **800px** (`radar-grid.scss`) casado com `chartConfig.size:
      800` do `config.json`.
- [ ] Grade de colunas não estoura com N ≠ 4.

### 6. Portão final
- [ ] `yarn lint` e `yarn test` passando.
- [ ] Config inválida produz **erro legível**, não `TypeError`.

## Testes que travam os riscos

Em `src/components/Chart/geometry.test.ts`:
- `segmentAngles(slot, N)` para N=3,4,5,6: setores contíguos, sem sobreposição,
  somando 360°.
- **Trava de retrocompatibilidade:** N=4 com os `order` atuais → cada quadrante
  na mesma faixa angular de hoje.
- **Blip dentro do setor:** para cada N e slot, gerar ~200 blips e afirmar que o
  ângulo cai em `[startAngle + paddingAngle, endAngle - paddingAngle]`. É este
  teste que pega o risco do `yScale` invertido (R1).
- Nenhuma coordenada `NaN`/`undefined` para qualquer N.

## Como rodar o app para conferir no olho

```bash
yarn start
```

Visite `/`, alterne os 3 idiomas, teste com 800px de largura, e (se estiver
validando generalização) adicione temporariamente um quadrante de teste no
`config.json` + itens no `db1-opinion.json` para N=5, depois N=3 e N=6.
**Reverta o quadrante de teste antes do commit.**
