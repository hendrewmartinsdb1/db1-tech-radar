---
name: radar-geometry
description: >
  Use ao mexer no desenho do radar — arcos, blips, brilho de fundo, rótulos de
  quadrante/anel — ou em qualquer cálculo de ângulo/posição em
  src/components/Chart. Explica a convenção angular única, o campo `order`, a
  inversão do `yScale` e por que arcos e blips precisam usar a MESMA função de
  geometria. Leia antes de alterar RadarChart.tsx, QuadrantRings.tsx ou
  BlipPoints.tsx, ou antes de suportar um número de quadrantes diferente de 4.
---

# Geometria do radar: a fonte única de verdade

Todo bug estrutural do radar vem de o código usar **duas convenções angulares
diferentes**, reconciliadas à mão por tabelas de 4 elementos: os arcos usam a
convenção do `d3.arc()` e os blips usam `cos`/`sin` puro. Por isso o número 4
está embutido na geometria e `position: 5` quebra a aplicação em runtime.

**Regra de ouro:** arcos e blips consomem a **mesma** função de geometria. Duas
fontes de verdade em arquivos diferentes fazem os blips saírem de dentro dos
arcos.

## Convenção única

Graus, `0° = 12 horas`, sentido horário. É exatamente a convenção do `d3.arc()`
(que o `QuadrantRings.tsx` já usa), só que em radianos. A conversão é apenas
`graus * Math.PI / 180` — não há remapeamento a fazer.

Fonte única proposta em `src/components/Chart/geometry.ts`:

```ts
export const DEG_TO_RAD = Math.PI / 180;

export const segmentCount = (config) => Object.keys(config.quadrantsMap).length;

// Slot na tela (1..N, horário a partir das 12h). Default = position.
export const slotOf = (q) => q.order ?? q.position;

export function segmentAngles(slot, numSegments) {
  const angleIncrement = 360 / numSegments;
  const startAngle = (slot - 1) * angleIncrement;
  return { startAngle, endAngle: startAngle + angleIncrement, angleIncrement };
}
```

## O campo `order` — preserva o layout publicado

A tabela angular atual (`arcAngel` em `QuadrantRings.tsx`) mapeia posição para
ângulo em ordem **embaralhada**. A fórmula nova é **sequencial**. Aplicada com
`slot = position`, o radar **rotaciona** e os quadrantes trocam de lugar.

Solução: campo opcional `order` em `quadrantsMap` (o slot na tela), mantendo
`position` só para o rótulo "QUADRANTE N". Layout de hoje preservado com:

| quadrante | position | order | faixa angular (na tela) |
| --- | --- | --- | --- |
| languages-and-frameworks | 1 | 4 | 270°–360° (sup. esquerdo) |
| methods-and-patterns | 2 | 1 | 0°–90° (sup. direito) |
| platforms-and-operations | 3 | 3 | 180°–270° (inf. esquerdo) |
| tools | 4 | 2 | 90°–180° (inf. direito) |

Adicionar `order?: number` em `QuadrantConfig` (`src/model.ts`).

## Riscos críticos ao portar (da branch v5 do upstream)

- **R1 — `yScale` invertido.** Nosso `yScale` tem range `[size, 0]`
  (`RadarChart.tsx`). Usar a fórmula da v5 direto espelha o radar na vertical e
  joga blips no setor errado — e **a simetria de N=4 disfarça o erro**. Saída:
  calcular em pixels de tela, ou negar o seno. **Escreva antes o teste "blip
  dentro do setor".**
- **R2 — ignorar `order` rotaciona tudo.** Trava com teste de
  retrocompatibilidade das faixas angulares atuais.
- **R3 — raio do polígono do glow = `size`, não `center`.** É o dobro do raio;
  o excesso é cortado pela máscara circular. Atenção especial em N=3.
- **R4 — não duplicar a fórmula angular.** Na v5 ela existe em dois arquivos e
  só coincidem por acaso. É por isso que `geometry.ts` existe.

## Faixa suportada

1 a 6 quadrantes. O limite de 6 é **do CSS dos rótulos** (casos escritos à mão),
não da matemática — o cálculo de ângulos é genérico. Fora da faixa: falhar com
**erro legível**, nunca `TypeError` + tela branca.

## O que NÃO mudar / NÃO portar

- Manter o `d3.arc()` (faixas preenchidas); não trazer o `describeArc` da v5
  (linhas com `stroke`), que mudaria o visual.
- Manter o cálculo de blips **em tempo de render**; não mover para build time.
- Não renomear `quadrant` para `segment` (atinge config, dados, rotas, i18n e
  ~34 componentes).
- O posicionamento dos blips continua **não determinístico** (trocam a cada
  render). Isso é o comportamento de hoje e está fora de escopo.

## Referência de código (upstream v5, Apache-2.0, mesma origem)

```
gh api repos/AOEpeople/aoe_technology_radar/contents/src/components/Radar/Chart.tsx?ref=v5 --jq '.content' | base64 -d
gh api repos/AOEpeople/aoe_technology_radar/contents/scripts/positioner.ts?ref=v5 --jq '.content' | base64 -d
```

Cite a procedência nos commits.
