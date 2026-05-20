# LTracker

Tracker pessoal minimalista para treino, sono e recuperacao.

## Objetivo

Registrar rapidamente dados do dia, atividades e um resumo semanal simples, usando apenas recursos locais do navegador.

O LTracker e pensado para uso pessoal, rapido e sem friccao. Nesta versao, os dados ficam salvos apenas no `localStorage` do navegador/dispositivo em que voce esta usando o app.

Nao ha sincronizacao entre dispositivos nesta versao. Se voce abrir no celular e no computador, cada um tera seus proprios dados locais.

## Stack

- HTML
- CSS
- JavaScript puro
- localStorage

## Como abrir localmente

Abra o arquivo `index.html` no navegador.

## Como usar via GitHub Pages

1. Publique este repositorio no GitHub.
2. No GitHub, abra `Settings`.
3. Entre em `Pages`.
4. Em `Build and deployment`, selecione `Deploy from a branch`.
5. Escolha a branch `main` e a pasta `/root`.
6. Acesse a URL gerada pelo GitHub Pages.

Mesmo via GitHub Pages, os dados continuam salvos apenas no navegador/dispositivo usado para acessar o app.

## Estrutura

```text
LTracker/
  index.html
  style.css
  app.js
  docs/
    DEV_LOG.md
    DATA_SCHEMA.md
    ROADMAP.md
```

## Principios

- MVP primeiro
- Simplicidade
- Baixa friccao
- Sem backend
- Sem frameworks
- Sem build tools
