import { prisma } from '@/lib/prisma'
import { ProjectInput } from '@/lib/validations'

export async function getProjects(userId: string) {
  return prisma.project.findMany({
    where: { userId },
    include: {
      client: true,
      _count: { select: { tasks: true, payments: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getProjectById(id: string, userId: string) {
  return prisma.project.findFirst({
    where: { id, userId },
    include: {
      client: true,
      tasks: true,
      payments: true,
    },
  })
}

export async function createProject(data: ProjectInput, userId: string) {
  return prisma.project.create({
    data: {
      name: data.name,
      description: data.description || null,
      value: data.value,
      status: 'proposal',
      deadline: data.deadline ? new Date(data.deadline) : null,
      clientId: data.clientId,
      userId,
    },
  })
}

export async function updateProject(id: string, data: Partial<ProjectInput>, userId: string) {
  return prisma.project.updateMany({
    where: { id, userId },
    data,
  })
}

export async function deleteProject(id: string, userId: string) {
  return prisma.project.deleteMany({
    where: { id, userId },
  })
}
