# `.claude/` — Skills e Agents do projeto db1-tech-radar

Esta pasta guarda o conhecimento operacional do projeto num formato **portável e legível por qualquer IA**: Markdown com _front matter_ YAML, codificação UTF-8, um arquivo por unidade. É a convenção do Claude Code / Agent SDK, mas o formato é texto puro e pode ser lido por qualquer ferramenta ou modelo.

## Estrutura

```
.claude/
├── README.md                      ← este arquivo (o índice e o padrão)
├── skills/                        ← conhecimento reutilizável, acionado por tarefa
│   └── <nome-da-skill>/
│       └── SKILL.md
└── agents/                        ← perfis de subagente com papel e ferramentas
    └── <nome-do-agent>.md
```

- **Skill** = um procedimento ou base de conhecimento que a IA carrega quando a tarefa casa com a `description`. Fica em `skills/<nome>/SKILL.md`. O `<nome>` da pasta deve ser igual ao campo `name`.
- **Agent** = um subagente especializado, com papel, ferramentas e modelo definidos. Um arquivo `.md` por agente em `agents/`.

## Padrão de um arquivo de Skill

```markdown
---
name: minha-skill                # kebab-case, igual ao nome da pasta
description: >                    # QUANDO usar — é isso que dispara a skill.
  Use quando ... . Cobre ... .    # Escreva gatilhos concretos, não um resumo genérico.
---

# Título legível

Corpo em Markdown: passos, regras, exemplos, armadilhas.
Referencie arquivos do repo como `src/components/Chart/RadarChart.tsx`.
```

## Padrão de um arquivo de Agent

```markdown
---
name: meu-agent                   # kebab-case, igual ao nome do arquivo
description: >
  Quando acionar este agente e o que ele entrega.
tools: Read, Grep, Glob           # ferramentas permitidas (opcional; omitir = todas)
model: sonnet                     # sonnet | opus | haiku (opcional)
---

# Papel

Instruções do subagente: objetivo, o que checar, formato da resposta.
```

## Convenções deste repositório

1. **Uma unidade, um arquivo.** Uma skill por pasta, um agent por `.md`. Nada de juntar assuntos.
2. **`description` é gatilho, não resumo.** Comece com "Use quando…" e liste situações concretas. É o que faz a IA escolher (ou não) a skill.
3. **Referencie o código real** por caminho relativo, para a orientação envelhecer junto com o repo.
4. **Idioma:** conteúdo em português (idioma do time); termos técnicos e nomes de arquivo em inglês conforme o código.
5. **Ao criar uma skill/agent novo**, adicione uma linha no índice abaixo.

## Índice

### Skills
- [`radar-geometry`](skills/radar-geometry/SKILL.md) — convenção angular única, campo `order`, inversão do `yScale`, arcos e blips na mesma função. Leia antes de tocar no desenho do radar.
- [`adicionar-quadrante`](skills/adicionar-quadrante/SKILL.md) — procedimento para incluir/reorganizar um quadrante só por configuração, i18n e conteúdo.
- [`revisao-regressao-visual`](skills/revisao-regressao-visual/SKILL.md) — checklist de validação visual (screenshots, 3 idiomas, responsivo 800px, N=3/4/5/6, blip dentro do setor).
- [`criar-user-story-db1`](skills/criar-user-story-db1/SKILL.md) — quebrar demanda em User Stories no padrão DB1/VSTS (10–12h, critérios de aceite, contabilização do prêmio).
- [`contribuir-db1-tech-radar`](skills/contribuir-db1-tech-radar/SKILL.md) — padrão de contribuição via fork + Pull Request (repo canônico db1group, fork pessoal, push no fork, PR para `main`).

### Agents
- [`radar-geometry-reviewer`](agents/radar-geometry-reviewer.md) — revisa mudanças no gráfico/geometria contra os riscos críticos (radar espelhado, rotação, blip fora do setor).
- [`user-story-splitter`](agents/user-story-splitter.md) — recebe uma demanda e devolve User Stories de 10–12h com dependências e critérios de aceite.

## Contexto do projeto

`db1-tech-radar` é um fork do `AOEpeople/aoe_technology_radar` (linha v3). React 18 + TypeScript + d3 7 sobre Create React App. Deploy via GitHub Actions para o bucket S3 `techradar.db1.com.br`. Os dados vêm de `public/db1-opinion.json` via `fetch` em `src/components/App.tsx`; a configuração dos quadrantes está em `public/config.json`. Boa parte destas skills nasceu da iniciativa **2125624 — evolução dos quadrantes sem depender de mudança de código**.
