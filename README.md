# PokéAPI Explorer — React

Interface React para explorar endpoints da PokéAPI v2.

## Executar localmente

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
npm run preview
```

## Deploy no Render

Este projeto foi preparado para **Render Static Site**.

### Opção 1 — com `render.yaml`

1. Envie o projeto para um repositório Git.
2. No Render, escolha **New > Blueprint** ou conecte o repositório.
3. O arquivo `render.yaml` configura automaticamente:
   - runtime `static`
   - build command `npm ci && npm run build`
   - publish directory `dist`
   - rewrite de `/*` para `/index.html`

### Opção 2 — configuração manual no painel

Crie um **Static Site** e use:

- **Build Command:** `npm ci && npm run build`
- **Publish Directory:** `dist`

## Observações

- O diretório `node_modules` não deve ser versionado.
- O diretório `dist` pode ser gerado no deploy pelo Render.
- A regra de rewrite ajuda caso você adicione rotas client-side no futuro.
