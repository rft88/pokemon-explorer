# PokéAPI Explorer — React

Interface React para explorar todos os endpoints da [PokéAPI v2](https://pokeapi.co/api/v2/).

## Pré-requisitos

- Node.js 18+
- npm 9+

## Instalação e execução

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173` no navegador.

## Build para produção

```bash
npm run build
npm run preview
```

## Estrutura do projeto

```
pokeapi-react/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx               # Entry point React
    ├── index.css              # CSS global / design tokens
    ├── App.jsx                # Componente raiz + estado global
    ├── App.module.css
    ├── services/
    │   └── pokeapi.js         # Back-end: fetch, URL builder, lista de endpoints
    └── components/
        ├── PokeballIcon.jsx   # Ícone SVG animado
        ├── RequestPanel.jsx   # Formulário: select + input personalizado + ID
        ├── RequestPanel.module.css
        ├── StatusBar.jsx      # Barra de status HTTP / tempo
        ├── StatusBar.module.css
        ├── ResultViewer.jsx   # Cards / Tabela / JSON com syntax highlight
        └── ResultViewer.module.css
```

## Funcionalidades

- **Select** com todos os 48 endpoints da PokéAPI v2
- **Endpoint personalizado** — última opção do select revela um `<input>` onde o usuário digita qualquer endpoint
- **Identificador opcional** — nome ou ID do recurso (ex: `pikachu`, `25`)
- **Preview da URL** em tempo real
- **Camada de serviço** (`pokeapi.js`) separada do front-end
- **Visualização em abas:**
  - **Cards** — para resultados em lista
  - **Tabela/Detalhes** — campos do recurso em formato legível
  - **JSON** — resposta completa com syntax highlight colorido
- **Status bar** com código HTTP e tempo de resposta em ms
- Design dark, responsivo, sem dependências externas além do React + Vite


## Deploy on Render

This project is ready for Render as a static site.

### Option 1: Blueprint deploy
1. Push the project to GitHub, GitLab, or Bitbucket.
2. In Render, create a new Blueprint and point it to this repository.
3. Render will use the `render.yaml` file in the project root.

### Option 2: Manual static site deploy
Use these settings in Render:

- **Runtime:** Static Site
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`

### Notes
- The rewrite rule in `render.yaml` sends all routes to `index.html`, which is the standard setup for a Vite single-page app.
- Do not commit `node_modules` or `dist`. Render installs dependencies and builds the app during deploy.
