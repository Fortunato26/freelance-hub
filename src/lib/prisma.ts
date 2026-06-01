/* eslint-disable @typescript-eslint/no-explicit-any */

// Mock Prisma client for development without database
// Replace with real PrismaClient when database is connected

import bcrypt from 'bcryptjs'

const adminUser = {
  id: 'admin-001',
  email: 'admin@freelancehub.com',
  name: 'Administrador',
  password: null as string | null,
  emailVerified: new Date(),
  image: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

// Generate password hash on module load
const initializeAdmin = async () => {
  if (!adminUser.password) {
    adminUser.password = await bcrypt.hash('admin123', 10)
  }
}

// Initialize admin password hash
initializeAdmin()

const createMockModel = () => ({
  findMany: async () => [],
  findUnique: async ({ where }: any) => {
    // Return admin user when searching by email
    if (where?.email === adminUser.email) {
      return adminUser
    }
    return null
  },
  findFirst: async ({ where }: any) => {
    if (where?.email === adminUser.email) {
      return adminUser
    }
    return null
  },
  create: async (args: any) => ({ id: 'mock-id', ...args?.data }),
  update: async (args: any) => ({ id: args?.where?.id, ...args?.data }),
  delete: async () => null,
  count: async () => 0,
  groupBy: async () => [],
  aggregate: async () => ({}),
})

export const prisma = {
  user: createMockModel(),
  account: createMockModel(),
  session: createMockModel(),
  client: createMockModel(),
  project: createMockModel(),
  task: createMockModel(),
  payment: createMockModel(),
  timeEntry: createMockModel(),
  verificationToken: createMockModel(),
} as any

// To use real Prisma with Supabase:
// 1. Run: npx prisma generate
// 2. Set DATABASE_URL in .env
// 3. Uncomment the code below and comment out the mock above

/*
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
*/
