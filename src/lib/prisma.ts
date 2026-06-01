/* eslint-disable @typescript-eslint/no-explicit-any */

// Mock Prisma client for development without database
// Replace with real PrismaClient when database is connected

const createMockModel = () => ({
  findMany: async () => [],
  findUnique: async () => null,
  findFirst: async () => null,
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

// To use real Prisma, uncomment below and run: prisma generate
// import { PrismaClient } from '@prisma/client'
// const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }
// export const prisma = globalForPrisma.prisma ?? new PrismaClient()
// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
