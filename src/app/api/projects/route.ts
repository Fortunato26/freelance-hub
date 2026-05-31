import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        client: true,
        _count: {
          select: { tasks: true, payments: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(projects)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar projetos' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, value, status, deadline, clientId, userId } = body

    const project = await prisma.project.create({
      data: {
        name,
        description,
        value: parseFloat(value),
        status,
        deadline: deadline ? new Date(deadline) : null,
        clientId,
        userId
      }
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar projeto' }, { status: 500 })
  }
}
