import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        project: true
      },
      orderBy: { date: 'desc' }
    })
    return NextResponse.json(payments)
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar pagamentos' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, type, description, projectId } = body

    const payment = await prisma.payment.create({
      data: {
        amount: parseFloat(amount),
        type,
        description,
        projectId
      }
    })

    return NextResponse.json(payment, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erro ao criar pagamento' }, { status: 500 })
  }
}
