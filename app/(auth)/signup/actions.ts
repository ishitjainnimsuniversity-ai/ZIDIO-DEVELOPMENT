"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { signIn } from "@/auth"

export async function signupAction(prevState: any, formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const workspaceName = formData.get("workspaceName") as string

  if (!name || !email || !password || !workspaceName) {
    return { error: "All fields are required." }
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: "Email is already in use." }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const workspace = await prisma.workspace.create({
      data: {
        name: workspaceName,
      },
    })

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
        workspaceId: workspace.id,
      },
    })

    // Sign in immediately after signup
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    })
    
  } catch (error) {
    if ((error as Error).message === "NEXT_REDIRECT") {
      throw error // Re-throw Next.js redirect
    }
    return { error: "Something went wrong during signup." }
  }
}
