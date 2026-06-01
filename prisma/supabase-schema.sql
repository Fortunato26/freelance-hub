-- FreelanceHub - Schema SQL para Supabase
-- Execute este código no SQL Editor do Supabase

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- Tabela de Accounts (NextAuth)
CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- Tabela de Sessions (NextAuth)
CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session"("sessionToken");

-- Tabela de Verification Tokens
CREATE TABLE IF NOT EXISTS "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier", "token")
);
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_token_key" ON "VerificationToken"("token");

-- Tabela de Clientes
CREATE TABLE IF NOT EXISTS "Client" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "company" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Client_userId_idx" ON "Client"("userId");

-- Tabela de Projetos/Negócios
CREATE TABLE IF NOT EXISTS "Project" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "value" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'proposal',
    "deadline" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Project_userId_idx" ON "Project"("userId");
CREATE INDEX IF NOT EXISTS "Project_clientId_idx" ON "Project"("clientId");
CREATE INDEX IF NOT EXISTS "Project_status_idx" ON "Project"("status");

-- Tabela de Tarefas
CREATE TABLE IF NOT EXISTS "Task" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "title" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" TEXT NOT NULL,
    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Task_projectId_idx" ON "Task"("projectId");

-- Tabela de Pagamentos
CREATE TABLE IF NOT EXISTS "Payment" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "projectId" TEXT NOT NULL,
    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Payment_projectId_idx" ON "Payment"("projectId");
CREATE INDEX IF NOT EXISTS "Payment_type_idx" ON "Payment"("type");

-- Tabela de Controle de Horas
CREATE TABLE IF NOT EXISTS "TimeEntry" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "duration" INTEGER NOT NULL DEFAULT 0,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TimeEntry_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "TimeEntry_projectId_idx" ON "TimeEntry"("projectId");

-- Foreign Keys
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
ALTER TABLE "Client" ADD CONSTRAINT "Client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
ALTER TABLE "Project" ADD CONSTRAINT "Project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE;
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE;
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE;
ALTER TABLE "TimeEntry" ADD CONSTRAINT "TimeEntry_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE;
