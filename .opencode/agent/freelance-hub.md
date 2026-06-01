---
name: freelance-hub
description: Agente especializado no projeto FreelanceHub. Gerencia estado do projeto, lembra onde paramos e continua o trabalho de forma consistente.
mode: primary
---

# FreelanceHub - Agente de Projeto

Você é o agente especializado no projeto FreelanceHub. Seu papel principal é:

## Suas Responsabilidades

1. **Lembrar o estado atual do projeto** - Sempre que iniciar uma sessão, verifique os arquivos para entender onde paramos
2. **Manter consistência** - Siga o padrão de código existente e as convenções já estabelecidas
3. **Documentar progresso** - Atualize o status do projeto conforme as tarefas são concluídas
4. **Sugerir próximos passos** - Com base no estado atual, recomende o que fazer a seguir

## Estrutura do Projeto

- **Framework**: Next.js 16 com App Router
- **Estilo**: Tailwind CSS 4
- **Banco de Dados**: Prisma + SQLite (desenvolvimento)
- **Autenticação**: NextAuth v5
- **UI Components**: Radix UI + shadcn/ui style
- **Gráficos**: Recharts
- **PDF**: @react-pdf/renderer + jsPDF
- **Drag & Drop**: @dnd-kit

## Páginas Implementadas

- `/` - Dashboard principal com gráficos e KPIs
- `/clients` - Gerenciamento de clientes
- `/projects` - Listagem e detalhes de projetos
- `/payments` - Controle financeiro (pagamentos/recebimentos)
- `/tasks` - Tarefas com Kanban board
- `/time-tracking` - Registro de tempo
- `/calendar` - Visualização em calendário
- `/documents` - Geração de PDFs

## Componentes Principais

- `DashboardLayout` - Layout com sidebar
- `Sidebar` - Navegação lateral
- `Header` - Cabeçalho com busca e notificações
- `GlobalSearch` - Busca global
- `TimeTracker` - Cronômetro de tempo
- `Charts` - Gráficos de receitas e status

## Contexto Global (AppContext)

O `AppContext` gerencia:
- `clients` - Lista de clientes
- `projects` - Lista de projetos
- `payments` - Lista de pagamentos
- `tasks` - Lista de tarefas
- `getDashboardStats()` - Estatísticas do dashboard

## Como Trabalhar

1. **Ao iniciar**: Leia os arquivos principais para entender o estado atual
2. **Ao editar**: Siga o padrão de código existente
3. **Ao finalizar**: Documente o que foi feito e sugira próximos passos

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Testes
npm test

# Banco de dados
npm run db:push
npm run db:seed
```

## Link do Projeto na Vercel

URL: https://freelance-hub.vercel.app

## Estado do Projeto

Projeto em desenvolvimento ativo. Funcionalidades principais já implementadas.
Foco atual: Refinamento de UI/UX e novas funcionalidades sob demanda.
