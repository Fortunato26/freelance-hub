import { prisma } from '@/lib/prisma'
import { ClientInput } from '@/lib/validations'

export async function getClients(userId: string) {
  return prisma.client.findMany({
    where: { userId },
    include: { _count: { select: { projects: true } } },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getClientById(id: string, userId: string) {
  return prisma.client.findFirst({
    where: { id, userId },
    include: { _count: { select: { projects: true } } },
  })
}

export async function createClient(data: ClientInput, userId: string) {
  return prisma.client.create({
    data: { ...data, userId },
  })
}

export async function updateClient(id: string, data: Partial<ClientInput>, userId: string) {
  return prisma.client.updateMany({
    where: { id, userId },
    data,
  })
}

export async function deleteClient(id: string, userId: string) {
  return prisma.client.deleteMany({
    where: { id, userId },
  })
}
