import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("[AUTH] === INÍCIO DA TENTATIVA DE LOGIN ===")
        console.log("[AUTH] Email:", credentials?.email)
        console.log("[AUTH] DATABASE_URL existe:", !!process.env.DATABASE_URL)
        console.log("[AUTH] DATABASE_URL prefixo:", process.env.DATABASE_URL?.substring(0, 30))

        if (!credentials?.email || !credentials?.password) {
          console.log("[AUTH] Email ou senha não fornecidos")
          return null
        }

        try {
          console.log("[AUTH] Tentando conectar ao banco...")
          await prisma.$connect()
          console.log("[AUTH] Conectado ao banco com sucesso")

          console.log("[AUTH] Buscando usuário...")
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string }
          })

          console.log("[AUTH] Usuário encontrado:", !!user)
          if (user) {
            console.log("[AUTH] Usuário ID:", user.id)
            console.log("[AUTH] Usuário tem senha:", !!user.password)
          }

          if (!user || !user.password) {
            console.log("[AUTH] Usuário não encontrado ou sem senha")
            await prisma.$disconnect()
            return null
          }

          console.log("[AUTH] Comparando senhas...")
          const passwordMatch = await bcrypt.compare(credentials.password as string, user.password)
          console.log("[AUTH] Senha confere:", passwordMatch)

          if (!passwordMatch) {
            await prisma.$disconnect()
            return null
          }

          console.log("[AUTH] === LOGIN BEM-SUCEDIDO ===")
          await prisma.$disconnect()

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          console.error("[AUTH] === ERRO AO BUSCAR USUÁRIO ===")
          console.error("[AUTH] Tipo do erro:", error?.constructor?.name)
          console.error("[AUTH] Mensagem:", error instanceof Error ? error.message : String(error))
          console.error("[AUTH] Stack:", error instanceof Error ? error.stack : 'N/A')
          await prisma.$disconnect().catch(() => {})
          return null
        }
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  }
})
