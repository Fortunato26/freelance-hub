import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@freelancehub.com' },
    update: {},
    create: {
      email: 'admin@freelancehub.com',
      name: 'Administrador',
      password: adminPassword,
      emailVerified: new Date(),
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Create sample clients
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        name: 'TechCorp',
        email: 'contato@techcorp.com',
        phone: '(11) 99999-9999',
        company: 'TechCorp Ltda',
        notes: 'Cliente desde 2024',
        userId: admin.id,
      },
    }),
    prisma.client.create({
      data: {
        name: 'StartupXYZ',
        email: 'admin@startupxyz.com',
        phone: '(21) 88888-8888',
        company: 'StartupXYZ Inc',
        notes: 'Projeto de e-commerce',
        userId: admin.id,
      },
    }),
    prisma.client.create({
      data: {
        name: 'Digital Agency',
        email: 'hello@digital.com',
        phone: '(31) 77777-7777',
        company: 'Digital Agency',
        notes: 'Agência de marketing',
        userId: admin.id,
      },
    }),
  ])
  console.log('✅ Clients created:', clients.length)

  // Create sample projects
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        name: 'Website Institucional',
        description: 'Redesign completo do site',
        value: 5000,
        status: 'in_progress',
        deadline: new Date('2026-06-15'),
        clientId: clients[0].id,
        userId: admin.id,
      },
    }),
    prisma.project.create({
      data: {
        name: 'E-commerce Shopify',
        description: 'Loja virtual completa',
        value: 12000,
        status: 'proposal',
        deadline: new Date('2026-07-01'),
        clientId: clients[1].id,
        userId: admin.id,
      },
    }),
    prisma.project.create({
      data: {
        name: 'App Mobile',
        description: 'Aplicativo React Native',
        value: 25000,
        status: 'delivered',
        deadline: new Date('2026-05-20'),
        clientId: clients[2].id,
        userId: admin.id,
      },
    }),
  ])
  console.log('✅ Projects created:', projects.length)

  // Create sample payments
  const payments = await Promise.all([
    prisma.payment.create({
      data: {
        amount: 5000,
        type: 'receive',
        description: 'Website Institucional - TechCorp',
        projectId: projects[0].id,
      },
    }),
    prisma.payment.create({
      data: {
        amount: 150,
        type: 'pay',
        description: 'Hospedagem AWS',
        projectId: projects[0].id,
      },
    }),
  ])
  console.log('✅ Payments created:', payments.length)

  // Create sample tasks
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        title: 'Criar wireframe do site',
        completed: true,
        projectId: projects[0].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Desenvolver homepage',
        completed: true,
        projectId: projects[0].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Implementar formulário de contato',
        completed: false,
        projectId: projects[0].id,
      },
    }),
  ])
  console.log('✅ Tasks created:', tasks.length)

  console.log('🎉 Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
