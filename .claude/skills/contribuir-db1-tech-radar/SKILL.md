---
name: contribuir-db1-tech-radar
description: >
  Use ao contribuir com o db1-tech-radar: criar branch, abrir PR/MR, configurar
  remotes ou entender o fluxo de fork. Documenta o padrão da DB1 — repo canônico
  db1group/db1-tech-radar, trabalho a partir de um fork pessoal, push no fork e
  Pull Request para db1group:main (fluxo "tipo open source"). Use também ao
  adicionar uma nova tecnologia ao radar.
---

# Padrão de contribuição do db1-tech-radar

A contribuição segue o fluxo **fork + Pull Request**, como em projeto open
source: ninguém commita direto na `main` do repo canônico.

## Repositórios

| Papel | Repositório |
| --- | --- |
| Canônico (upstream) | `https://github.com/db1group/db1-tech-radar` |
| Fork pessoal (exemplo) | `https://github.com/hendrewmartinsdb1/db1-tech-radar` |

> O `db1group/db1-tech-radar` é, por sua vez, um fork do upstream público
> `AOEpeople/aoe_technology_radar` (linha v3). Contribuições de código genérico
> podem, em tese, subir para lá; conteúdo específico da DB1 (quadrantes, itens,
> skills internas) fica no repo da DB1.

## Layout de remotes recomendado

Cada contribuidor trabalha do **seu** fork:

```bash
# origin = seu fork; upstream = repo canônico da DB1
git clone https://github.com/<seu-usuario>/db1-tech-radar.git
cd db1-tech-radar
git remote add upstream https://github.com/db1group/db1-tech-radar.git
```

Se você clonou direto o repo da DB1 (então `origin` já é o canônico), adicione o
fork como um remote à parte em vez de trocar o `origin`:

```bash
git remote add fork https://github.com/<seu-usuario>/db1-tech-radar.git
```

## Fluxo de uma contribuição

```bash
# 1. Parta da main atualizada do canônico
git fetch upstream            # ou: git fetch origin, se origin = canônico
git checkout -b <tipo>/<descricao> upstream/main

# 2. Faça as mudanças e commite
git add <arquivos>
git commit -m "<tipo>: <resumo>"

# 3. Publique no SEU fork
git push -u fork <tipo>/<descricao>      # ou origin, se origin = seu fork

# 4. Abra o PR do seu fork para db1group:main
#    URL de compare (troque <seu-usuario> e a branch):
#    https://github.com/db1group/db1-tech-radar/compare/main...<seu-usuario>:<tipo>/<descricao>?expand=1
```

O time de Engenharia monitora os PRs e faz merge, pede ajustes ou fecha com
explicação.

## Convenção de nomes de branch

`feat/`, `fix/`, `chore/`, `docs/` + descrição curta em kebab-case.
Ex.: `feat/add-ai-quadrant`, `chore/claude-skills-agents`.

## Adicionar uma nova tecnologia ao radar

1. Edite `public/db1-opinion.json`.
2. Toda tecnologia nova entra no **ring `assess`** para avaliação prévia; o time
   de Engenharia decide depois a promoção para outros rings.
3. Preencha o template do PR (nome da tecnologia, por que merece estar aqui,
   benefícios e possíveis desvantagens) — ver `CONTRIBUTING.md`.

## Ao portar código do upstream

Quando o código vier da branch `v5` do `AOEpeople/aoe_technology_radar` (ambos
Apache-2.0, mesma origem), **cite a procedência nos commits**.

## Observações

- Sem a GitHub CLI (`gh`) instalada, o PR não pode ser aberto por linha de
  comando: faça o `push` e abra o PR pela URL de compare acima, ou pelo botão da
  interface do GitHub.
- Não faça `push` de branches de trabalho direto no `db1group` (canônico); use
  sempre o fork.
