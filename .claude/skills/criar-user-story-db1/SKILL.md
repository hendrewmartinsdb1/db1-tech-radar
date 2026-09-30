---
name: criar-user-story-db1
description: >
  Use para quebrar uma demanda/feature em subcards de User Story no padrão
  DB1/VSTS (Azure DevOps), ou para escrever a descrição de uma User Story. Cobre
  a granularidade de 10–12h (~1 mês a 3h/semana), o tipo correto, critérios de aceite, dependências e o formato do card.
---

# Criar User Stories no padrão DB1

No VSTS (Azure DevOps, `db1global.visualstudio.com`), a entrega é contabilizada
**de forma automatizada pela pipeline do time de dados**, e só
conta o que for do **tipo User Story**. Feature/Epic/Task/Bug não entram nessa
contagem.

## Regras de quebra

1. **Tipo:** cada subcard é uma **User Story**, filha do card principal.
2. **Granularidade:** **10 a 12 horas** de trabalho por US (~1 mês de duração
   considerando disponibilidade de ~3h/semana). Nem maior (vira entrega tardia),
   nem picotada artificialmente.
3. **Valor independente e testável.** Cada US deve entregar algo verificável por
   si, respeitando dependências técnicas — não fatie por arquivo, fatie por
   resultado.
4. **Dependências explícitas.** Diga de quais US ela depende e o que pode correr
   em paralelo.
5. **Rastreabilidade.** Ligue cada US ao escopo/risco do card principal.

## Formato de cada card

**Título:** frase curta de resultado (ex.: "Brilho de fundo por máscara +
polígono").

**Descrição:**
- _Objetivo_ — o resultado de negócio/técnico em 1–2 frases.
- _Escopo_ — bullets do que será feito, citando arquivos reais.
- _Fora de escopo_ — quando ajudar a evitar inchaço.

**Critérios de aceite:** lista verificável (comportamento observável, testes,
equivalência visual), não descrição de implementação.

**Estimativa:** 10–12h.

**Dependências:** US-X, US-Y (e o que roda em paralelo).

## Exemplo (bom)

> **US — Brilho de fundo por máscara + polígono**
> **Objetivo:** substituir os 4 `<rect>` de canto por máscara compartilhada +
> polígono por setor, generalizável para qualquer N.
> **Escopo:** `<defs>` no `<svg>` de `RadarChart.tsx`; grupo do quadrante com
> `mask`; polígono por setor com raio = `size`; casos N=1 (circle), N=2 (rect).
> **Critérios de aceite:** brilho idêntico em N=4 (screenshot antes/depois);
> N=3 sem fio de fundo faltando.
> **Estimativa:** 10–12h. **Depende de:** US de geometria.

## Antiexemplos

- ❌ "Editar QuadrantRings.tsx" (fatiou por arquivo, sem resultado).
- ❌ US de 40h (estoura a granularidade — quebrar em 3–4).
- ❌ Critério de aceite = "código refatorado" (não é verificável).
- ❌ Criar como Task/Feature.

## Fluxo sugerido

1. Ler o detalhamento técnico e o sequenciamento recomendado da demanda.
2. Agrupar em blocos de resultado de ~10–12h, respeitando a ordem de risco.
3. Montar a tabela-resumo (US | estimativa | depende de | escopo).
4. Escrever cada card no formato acima, pronto para colar no VSTS.

> Observação: nesta sessão não há ferramenta de Azure DevOps/VSTS conectada, então
> a IA entrega o conteúdo pronto para colar; a criação dos cards no board é manual.
