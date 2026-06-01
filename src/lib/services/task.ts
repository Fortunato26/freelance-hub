import { prisma } from '@/lib/prisma'
import { TaskInput } from '@/lib/validations'

export async function getTasksByProject(projectId: string, userId: string) {
  return prisma.task.findMany({
    where: {
      projectId,
      project: { userId },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function createTask(data: TaskInput, projectId: string, userId: string) {
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
  })

  if (!project) throw new Error('Projeto não encontrado')

  return prisma.task.create({
    data: {
      title: data.title,
      completed: false,
      projectId,
    },
  })
}

export async function updateTask(id: string, data: Partial<TaskInput & { completed: boolean }>, userId: string) {
  return prisma.task.updateMany({
    where: { id, project: { userId } },
    data,
  })
}

export async function deleteTask(id: string, userId: string) {
  return prisma.task.deleteMany({
    where: { id, project: { userId } },
  })
}
