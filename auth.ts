import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "loop-enterprise-ai-secret-key-32chars-min-entropy",
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = (credentials.email as string).trim().toLowerCase()
        const password = credentials.password as string

        // 1. Built-in instant demo credentials (guaranteed to work across all serverless environments)
        if (password === "password123") {
          if (email === "admin@loop.dev" || email === "ishit@loop.dev") {
            return {
              id: "usr_admin_001",
              name: email === "ishit@loop.dev" ? "Ishit Jain" : "Admin User",
              email,
              role: "ADMIN",
              workspaceId: "ws_demo_acme"
            }
          }
          if (email === "analyst@loop.dev" || email === "mitali@loop.dev") {
            return {
              id: "usr_analyst_001",
              name: email === "mitali@loop.dev" ? "Mitali" : "Analyst User",
              email,
              role: "ANALYST",
              workspaceId: "ws_demo_acme"
            }
          }
          if (email === "viewer@loop.dev") {
            return {
              id: "usr_viewer_001",
              name: "Viewer User",
              email,
              role: "VIEWER",
              workspaceId: "ws_demo_acme"
            }
          }
        }
        
        // 2. Check database for registered users
        try {
          const user = await prisma.user.findUnique({
            where: { email }
          })

          if (user) {
            const passwordsMatch = await bcrypt.compare(password, user.password)
            if (passwordsMatch) {
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                workspaceId: user.workspaceId
              }
            }
          }
        } catch (dbErr) {
          console.warn("Database lookup skipped in serverless environment:", dbErr)
        }

        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.workspaceId = (user as any).workspaceId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role as string
        (session.user as any).workspaceId = token.workspaceId as string
      }
      return session
    }
  },
  pages: {
    signIn: "/login"
  }
})
