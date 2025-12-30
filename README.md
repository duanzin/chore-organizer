# Organizador de Tarefas

Aplicação web em React + Vite para organizar tarefas em categorias e acompanhar passos concluídos de forma visual.

## Funcionalidades

- Criação de categorias com cor para agrupar tarefas.
- Criação de tarefas com título, descrição opcional e passos (subitens).
- Marcação de passos como feitos.
- Filtro por categorias selecionadas e visualização agrupada por categoria.
- Exclusão de tarefas e gerenciamento de passos (adicionar, editar texto, remover).

## Tecnologias principais

- React 19 com Vite 7.
- Radix UI e componentes base inspirados em shadcn/ui.
- Tailwind CSS 4 para estilo utilitário.
- clsx e tailwind-merge para composição de classes.
- Lucide React para ícones.

## Como executar localmente

1. Pré-requisitos: Node.js 18+ e npm.
2. Instale dependências:

```bash
npm install
```

3. Rode o servidor de desenvolvimento:

```bash
npm run dev
```

4. Acesse a aplicação no endereço informado pelo Vite.

## Estrutura rápida

- src/App.jsx: orquestra filtros, criação de categorias/tarefas e renderiza as seções.
- src/hooks/useTasks.js: regras de negócio de tarefas e passos em memória.
- src/hooks/useCategories.js: categorias iniciais e seleção ativa.
- src/components/\*: componentes de UI (cartões, diálogos, filtros, campos de formulário).
