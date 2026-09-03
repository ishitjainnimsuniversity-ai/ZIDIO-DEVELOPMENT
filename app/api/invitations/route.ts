import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

const validRoles = ["ADMIN", "ANALYST", "VIEWER"]

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.workspaceId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const body = await request.json()
    const { email, role } = body

    if (!email || !role) {
      return NextResponse.json(
        { error: "Email and role are required." },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format." },
        { status: 400 }
      )
    }

    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be one of ADMIN, ANALYST, VIEWER." },
        { status: 400 }
      )
    }

    const invitation = await prisma.invitation.create({
      data: {
        email,
        role,
        workspaceId: session.user.workspaceId,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Invitation created successfully",
      invitation,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    )
  }
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.workspaceId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const invitations = await prisma.invitation.findMany({
      where: { workspaceId: session.user.workspaceId },
      orderBy: {
        createdAt: "desc",
      },
    })
    return NextResponse.json({ invitations })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch invitations." },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  const session = await auth()
  if (!session?.user?.workspaceId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, role } = body

    if (!id || !role) {
      return NextResponse.json(
        { error: "ID and role are required." },
        { status: 400 }
      )
    }

    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be one of ADMIN, ANALYST, VIEWER." },
        { status: 400 }
      )
    }

    // Check if it's an invitation first
    const existingInvitation = await prisma.invitation.findUnique({ where: { id } })
    if (existingInvitation) {
      if (existingInvitation.workspaceId !== session.user.workspaceId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      const invitation = await prisma.invitation.update({
        where: { id },
        data: { role },
      })
      return NextResponse.json({ success: true, message: "Role updated successfully", invitation })
    }

    // Otherwise check if it's a user
    const existingUser = await prisma.user.findUnique({ where: { id } })
    if (existingUser) {
      if (existingUser.workspaceId !== session.user.workspaceId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      const user = await prisma.user.update({
        where: { id },
        data: { role },
      })
      return NextResponse.json({ success: true, message: "Role updated successfully", user })
    }

    return NextResponse.json({ error: "Record not found" }, { status: 404 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update role." },
      { status: 500 }
    )
  }
}
