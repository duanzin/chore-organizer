## REQUISITOS - Organizador de Tarefas

Autor: Lucas Duan Rodrigues

---

## 1. Identificação do Produto

- Nome do produto: Organizador de Tarefas
- Autoria: Projeto solo (desenvolvedor único)
- Público-alvo: Pessoas em geral que buscam uma forma simples e visual de organizar e acompanhar tarefas do dia-a-dia (tarefas domésticas, limpeza, compras, projetos pessoais, etc.)
- Plataforma alvo: Web (front-end em Vite + React; back-end em TypeScript + Prisma; banco de dados: PostgreSQL em produção ou SQLite para desenvolvimento/local)

## 2. Missão do Produto

Apoiar usuários na organização e visualização de tarefas do dia a dia por meio de uma interface visual, permitindo criação, edição, exclusão e acompanhamento de tarefas com passos (subitens), tipos personalizáveis e status (A Fazer, Feito), de maneira simples e intuitiva.

## 3. Escopo do Sistema (Limites do Produto)

Limites:

- Não há suporte a pagamentos, faturamento ou integrações financeiras.
- Backup/restore gerenciado não será provido; administração do banco de dados fica a cargo do usuário/infraestrutura.
- Não haverá integração com calendários externos.
- Suporte para uso por um único usuário.
- Não haverá sincronização em tempo real entre múltiplos dispositivos.

Premissas:

- O usuário utiliza um navegador moderno.
- Banco de dados PostgreSQL (produção) ou SQLite (desenvolvimento).
- Front-end usará shadcn/ui e Tailwind (ou CSS) para aparência de post-its.

## 4. Usuários e Sistemas Externos

Usuários:

- Usuário Comum: cria, edita, apaga e organiza tarefas; cria tipos de tarefas; marca passos como feitos.

Sistemas Externos:

- Sistema de Persistência: PostgreSQL / SQLite via Prisma.

## 5. Modelo de Processo do Software

Desenvolvimento Incremental (dirigido a planos/ágil).

Justificativa: permite entregar versões incrementais, aceitar mudanças ágeis de requisitos visuais e comportamentais, e facilitar iterações rápidas com teste e feedback. Planejar sprints curtos (1–2 semanas) com incrementos: (1) API/DB e modelos; (2) CRUD básico + UI; (3) passos e tipos dinâmicos; (4) organização por tipo/status e melhorias de UX.

## 6. Requisitos Funcionais (RF)

RF1 — Criar Categoria

- Descrição: Usuário cria uma categoria, a qual permitirá a criação de tarefas dentro dela.

RF2 — Criar Tarefa

- Descrição: Usuário cria uma tarefa, definindo nome principal (título), descrição opcional, tipo (categoria) e passos (lista de subitens). Pode definir status inicial (A Fazer / Feito), e caso não o faça, ficará como A fazer até todos os passos serem concluídos.

RF3 — Editar Tarefa

- Descrição: Usuário modifica título, descrição, tipo e passos de uma tarefa existente.

RF4 — Excluir Tarefa

- Descrição: Usuário remove uma tarefa ou passos dela.

RF5 — Concluir Passos

- Descrição: Usuário define passos como concluídos.

RF6 — Concluir Tarefa

- Descrição: Sistema define tarefa como concluída quando todos os passos forem concluídos.

RF7 — Exibir Tarefas Organizadas por Tipo e Status

- Descrição: Visualização organiza tarefas por tipo, e dentro de cada tipo sub-organiza por status (A Fazer / Feito).

RF8 — Buscar/Filtrar Tarefas

- Descrição: Usuário pesquisa por tarefas por título ou as filtra por tipo e status.

## 7. Casos de Uso

Diagrama de Casos de Uso (Mermaid):

```mermaid
%% Diagrama de Casos de Uso - Organizador de Tarefas
actor Usuario

Usuario --> (RF1 - Criar Categoria)
Usuario --> (RF2 - Criar Tarefa)
Usuario --> (RF3 - Editar Tarefa)
Usuario --> (RF4 - Excluir Tarefa)
Usuario --> (RF5 - Concluir Passos)
Usuario --> (RF6 — Concluir Tarefa)
Usuario --> (RF7 - Exibir Tarefas Organizadas por Tipo e Status)
Usuario --> (RF8 - Buscar/Filtrar Tarefas)
```

## 8. Diagrama de Classes & Modelo de Dados

Entidades principais:

1. Task (Tarefa)

- id: UUID
- title: string (obrigatório)
- description: string (opcional)
- status: enum {TODO, DONE}
- typeId: FK -> Type (opcional)
- createdAt: datetime
- updatedAt: datetime

2. TaskStep (Passo)

- id: UUID
- taskId: FK -> Task
- text: string (obrigatório)
- done: boolean
- createdAt, updatedAt

3. Type (Tipo/Categoria)

- id: UUID
- name: string (único por usuário/instância)
- color?: string (opcional, para UI)
- createdAt, updatedAt

Relacionamentos:

- Task 1..N TaskStep
- Task optional -> Type (N tasks por type)

Esboço de schema Prisma (exemplo):

```prisma
model Task {
  id          String     @id @default(uuid())
  title       String
  description String?
  status      TaskStatus @default(TODO)
  typeId      String?
  type        Type?  @relation(fields: [typeId], references: [id])
  steps       TaskStep[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model TaskStep {
  id        String   @id @default(uuid())
  task      Task     @relation(fields: [taskId], references: [id])
  taskId    String
  text      String
  done      Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Type {
  id        String   @id @default(uuid())
  name      String
  color     String?
  tasks     Task[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([name])
}

enum TaskStatus {
  TODO
  DONE
}
```

## 9. Requisitos Não-Funcionais (RNF)

RNF1 — Performance

- A UI deve carregar a lista de tarefas iniciais em < 1s.

RNF2 — Escalabilidade

- Projetar modelos para permitir novas funcionalidades sem mudanças lógicas.

RNF3 — Usabilidade

- UI responsiva e visualmente limpa e intuitiva.

RNF4 — Acessibilidade

- Elementos de formulários com labels, contraste suficiente, navegação por teclado básica.
