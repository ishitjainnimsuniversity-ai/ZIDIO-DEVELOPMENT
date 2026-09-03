import { auth } from "@/auth"
import { redirect } from "next/navigation"

type Role = "ADMIN" | "ANALYST" | "VIEWER"

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: Role[]
  fallback?: React.ReactNode
}

export async function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const userRole = session.user.role as Role

  if (allowedRoles.includes(userRole)) {
    return <>{children}</>
  }

  return <>{fallback}</>
}
