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
- **Banco de Dados**: Prisma + Supabase PostgreSQL (produção)
- **Autenticação**: NextAuth v5
- **UI Components**: Radix UI + shadcn/ui style
- **Gráficos**: Recharts v3
- **PDF**: @react-pdf/renderer + jsPDF
- **Drag & Drop**: @dnd-kit

## Configuração do Supabase

- **Projeto**: zntyonwqnmhzaftbztbi
- **Connection Pooler**: aws-1-us-east-1.pooler.supabase.com:6543
- **Connection String**: `postgresql://postgres.zntyonwqnmhzaftbztbi:Funixad2t48%40@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true`
- **Importante**: Usar `?pgbouncer=true` na URL para evitar erro de prepared statements
- **SQL Schema**: `prisma/supabase-schema.sql` (usar `gen_random_uuid()` ao invés de `cuid()`)

## Variáveis de Ambiente (Vercel)

```
DATABASE_URL=postgresql://postgres.zntyonwqnmhzaftbztbi:Funixad2t48%40@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
NEXTAUTH_URL=https://freelance-hub-sage.vercel.app
NEXTAUTH_SECRET=freelancehub-secret-key-2024-production
```

## Credenciais de Acesso

- **Email**: admin@freelancehub.com
- **Senha**: admin123
- **Senha hasheada (bcrypt)**: `$2a$10$GrbdtzIX8y8gXSwB4Emt7uha6FLcWC6aiQLLknhTZgSnODNj0Iqse`

## URLs do Projeto

- **Vercel**: https://freelance-hub-sage.vercel.app
- **GitHub**: https://github.com/Fortunato26/freelance-hub

## Páginas Implementadas

- `/` - Dashboard principal com gráficos e KPIs
- `/clients` - Gerenciamento de clientes
- `/projects` - Listagem e detalhes de projetos (Kanban com DnD)
- `/finances` - Controle financeiro (pagamentos/recebimentos)
- `/time-tracking` - Registro de tempo
- `/calendar` - Visualização em calendário
- `/proposals` - Geração de propostas PDF
- `/templates` - Templates de documentos
- `/settings` - Configurações
- `/login` - Login com credenciais
- `/register` - Cadastro de usuários

## Componentes Principais

- `DashboardLayout` - Layout com sidebar
- `Sidebar` - Navegação lateral (corrigido espaçamento)
- `Header` - Cabeçalho com busca, notificações e botão "+novo" funcional
- `GlobalSearch` - Busca global (Ctrl+K)
- `TimeTracker` - Cronômetro de tempo
- `Charts` - Gráficos de receitas e status (simplificados, sem wrapper Card)

## API Routes

### Autenticação
- `POST /api/auth/[...nextauth]` - Login/Logout
- `POST /api/auth/register` - Cadastro de usuários

### CRUD
- `GET/POST /api/clients` - Listar/criar clientes
- `PUT/DELETE /api/clients/[id]` - Atualizar/deletar clientes
- `GET/POST /api/projects` - Listar/criar projetos
- `PUT/DELETE /api/projects/[id]` - Atualizar/deletar projetos
- `GET/POST /api/payments` - Listar/criar pagamentos
- `GET/POST /api/tasks` - Listar/criar tarefas
- `PUT/DELETE /api/tasks/[id]` - Atualizar/deletar tarefas

## Contexto Global (AppContext)

O `AppContext` agora usa **API routes** (não mais localStorage):
- `clients` - Lista de clientes (carregada do banco)
- `projects` - Lista de projetos (carregada do banco)
- `payments` - Lista de pagamentos (carregada do banco)
- `tasks` - Lista de tarefas (carregada do banco)
- `addClient()`, `updateClient()`, `deleteClient()` - CRUD via API
- `addProject()`, `updateProject()`, `deleteProject()` - CRUD via API
- `addPayment()` - Criar pagamento via API
- `addTask()`, `updateTask()`, `deleteTask()` - CRUD via API
- `getDashboardStats()` - Estatísticas do dashboard

## Alterações nesta Sessão

### 1. Configuração do Supabase
- Criado `prisma/supabase-schema.sql` com schema completo
- Corrigido `cuid()` para `gen_random_uuid()::text` (PostgreSQL nativo)
- Configurado connection string com `?pgbouncer=true`

### 2. Correção da Autenticação
- Adicionado logs detalhados em `src/lib/auth.ts` para debug
- Criado PrismaClient com logs de query/error/warn
- Corrigido erro "prepared statement already exists" com pgbouncer

### 3. Migração do AppContext para API
- Removido uso de localStorage
- Implementado carregamento via API routes
- Todas as operações CRUD agora usam fetch para API
- Dados persistidos no Supabase

### 4. Criação de API Routes
- `src/app/api/clients/[id]/route.ts` (PUT, DELETE)
- `src/app/api/projects/[id]/route.ts` (PUT, DELETE)
- `src/app/api/tasks/route.ts` (GET, POST)
- `src/app/api/tasks/[id]/route.ts` (PUT, DELETE)

### 5. Botão "+novo" Funcional
- Adicionado dropdown menu no Header
- Opções: Novo Cliente, Novo Negócio, Novo Pagamento, Nova Tarefa
- Redireciona para a página correspondente

### 6. Correção do Dashboard
- Removido wrapper `Card` dos componentes de gráfico
- Altura padronizada em 300px para todos os gráficos
- Removidos headers duplicados
- Corrigido sobreposição de seções

### 7. Correção do Sidebar
- Removido `flex-1` da navegação principal
- Eliminado espaçamento excessivo no meio do menu

### 8. Atualização de Dependências
- Recharts atualizado para v3 (remove warnings de depreciação)

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
npm run db:reset

# Gerar Prisma Client
npx prisma generate
```

## Fluxo de Deploy

1. Fazer push para GitHub (`git push origin main`)
2. Vercel faz deploy automaticamente
3. Variáveis de ambiente configuradas na Vercel
4. Banco de dados criado via SQL Editor do Supabase

## Próximos Passos Sugeridos

1. Implementar OAuth login (GitHub/Google) - requer configuração de client IDs
2. Sistema de notificações
3. Exportação de dados (CSV/Excel)
4. Implementar página de tarefas standalone
5. Melhorar performance com React Query/SWR
6. Adicionar testes E2E

## Estado do Projeto

Projeto funcional com:
- ✅ Autenticação completa
- ✅ CRUD de clientes, projetos, pagamentos, tarefas
- ✅ Dashboard com gráficos
- ✅ Persistência no Supabase
- ✅ Deploy automático via Vercel

Foco atual: Refinamento de UI/UX e novas funcionalidades sob demanda.
