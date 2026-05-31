import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      include: {
        _count: {
          select: { projects: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(clients)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar clientes' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, company, notes, userId } = body

    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        company,
        notes,
        userId
      }
    })

    return NextResponse.json(client, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar cliente' }, { status: 500 })
  }
}
