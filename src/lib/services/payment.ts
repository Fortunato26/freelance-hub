import { prisma } from '@/lib/prisma'
import { PaymentInput } from '@/lib/validations'

export async function getPayments(userId: string) {
  return prisma.payment.findMany({
    where: { project: { userId } },
    include: { project: true },
    orderBy: { date: 'desc' },
  })
}

export async function getPaymentsByProject(projectId: string, userId: string) {
  return prisma.payment.findMany({
    where: {
      projectId,
      project: { userId },
    },
    orderBy: { date: 'desc' },
  })
}

export async function createPayment(data: PaymentInput, userId: string) {
  const project = await prisma.project.findFirst({
    where: { id: data.projectId, userId },
  })

  if (!project) throw new Error('Projeto não encontrado')

  return prisma.payment.create({
    data: {
      amount: data.amount,
      type: data.type,
      description: data.description,
      projectId: data.projectId,
    },
  })
}

export async function deletePayment(id: string, userId: string) {
  return prisma.payment.deleteMany({
    where: { id, project: { userId } },
  })
}
