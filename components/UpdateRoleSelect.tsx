"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function UpdateRoleSelect({
  memberId,
  currentRole,
}: {
  memberId: string
  currentRole: string
}) {
  const router = useRouter()
  const [role, setRole] = useState(currentRole)
  const [isPending, setIsPending] = useState(false)

  const handleRoleChange = async (newRole: string | null) => {
    if (!newRole) return
    setRole(newRole)
    setIsPending(true)

    try {
      const response = await fetch("/api/invitations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: memberId, role: newRole }),
      })

      if (response.ok) {
        router.refresh()
      } else {
        // Rollback on error
        setRole(currentRole)
      }
    } catch (err) {
      setRole(currentRole)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Select value={role} onValueChange={handleRoleChange} disabled={isPending}>
      <SelectTrigger className="w-[120px] ml-auto h-8 bg-slate-950 border-slate-700 text-white disabled:opacity-50">
        <SelectValue placeholder="Select role" />
      </SelectTrigger>
      <SelectContent className="bg-slate-900 border-slate-700 text-white">
        <SelectItem value="ADMIN">Admin</SelectItem>
        <SelectItem value="ANALYST">Analyst</SelectItem>
        <SelectItem value="VIEWER">Viewer</SelectItem>
      </SelectContent>
    </Select>
  )
}
