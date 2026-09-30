---
name: adicionar-quadrante
description: >
  Use quando alguém quiser adicionar, remover ou reorganizar um quadrante do
  Tech Radar (ex.: criar um quadrante de IA). Descreve o procedimento que deve
  passar a ser só configuração + i18n + conteúdo, sem tocar em .tsx nem .scss.
  Use também para explicar por que um quadrante novo hoje quebra a aplicação.
---

# Adicionar ou reorganizar um quadrante

**Meta (após a entrega da 2125624):** incluir um quadrante é editar 3 tipos de
arquivo. **Zero alteração em `.tsx` ou `.scss`.** Faixa suportada: **1 a 6**.

> Estado atual do repo: o número 4 está embutido na geometria e a validação de
> faixa/`order` ainda não existe. Enquanto a 2125624 não estiver concluída,
> adicionar um 5º quadrante quebra em runtime. Esta skill descreve o
> procedimento-alvo; confira se os passos de geometria já foram entregues.

## Passo a passo

### 1. `public/config.json`
Adicione a entrada em **dois** lugares e defina `order`:

```jsonc
"quadrants": {
  // ... rótulo curto do novo quadrante
  "ai": "AI"
},
"quadrantsMap": {
  "ai": {
    "colour": "#RRGGBB",
    "txtColour": "white",
    "position": 5,     // número do rótulo "QUADRANTE N"
    "order": 5,        // slot na tela (1..N, horário a partir das 12h)
    "description": "..."
  }
}
```

Regras: `order` deve ser **contíguo de 1 a N, sem repetição**. Para não mexer no
layout dos 4 atuais, mantenha os `order` existentes (methods=1, tools=2,
platforms=3, languages=4) e use o próximo livre.

### 2. i18n — `src/i18n/translations/{pt,en,es}.json`
Adicione o quadrante em `pageHelp.quadrants`, **indexado por slug** (não por
posição), nos **três** idiomas:

```json
"quadrants": {
  "ai": { "name": "...", "description": "..." }
}
```

O slug precisa existir nos 3 idiomas — a validação de config rejeita slug sem
tradução.

### 3. Conteúdo — `public/db1-opinion.json`
Adicione os itens do novo quadrante. Todo item novo entra no **ring `assess`**
para avaliação prévia (ver `CONTRIBUTING.md`). O campo `quadrant` do item deve
casar com o slug definido no `config.json`.

## Verificação

- `yarn test` e `yarn lint` passando.
- Radar renderiza com o novo N; arcos, brilho, rótulos de quadrante e de anel
  corretos (rode a skill `revisao-regressao-visual`).
- Rotas por quadrante, busca, página de item e visão geral funcionando nos 3
  idiomas para o quadrante novo.
- Nenhum blip fora do setor; nº de blips renderizados = nº de itens.

## Limites e armadilhas

- **Máximo 6 por causa do CSS dos rótulos**, não da matemática. Para 7+, o
  trabalho é escrever mais casos de CSS (`[data-quadrants="7"]`), não mexer em
  geometria.
- Config inválida (N fora de 1–6, `order` repetido/furado, slug sem tradução)
  deve falhar com **erro legível**, não `TypeError`.
- **Fora de escopo aqui:** decidir o conteúdo editorial do quadrante de IA — é
  trabalho separado. Esta skill habilita; o conteúdo vem depois.

Relacionado: skill `radar-geometry` (por que o `order` importa) e
`revisao-regressao-visual` (como validar).
