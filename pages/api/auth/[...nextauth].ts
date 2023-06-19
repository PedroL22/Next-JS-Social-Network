import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { PrismaClient } from '@prisma/client'
import { PrismaAdapter } from '@next-auth/prisma-adapter'

const prisma = new PrismaClient()

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  secret: process.env.SECRET as string,
  callbacks: {
    session({ session, user }: any) {
      if (session.user) {
        session.user.id = user.id
        if (user.isAdmin) {
          session.user.isAdmin = user.isAdmin
        }
      }
      return session
    },
  },
})
