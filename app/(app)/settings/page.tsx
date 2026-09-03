import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { RoleGuard } from "@/components/RoleGuard"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import InviteMemberButton from "@/components/InviteMemberButton"
import { UpdateRoleSelect } from "@/components/UpdateRoleSelect"

type TeamMember = {
  id: string
  name: string
  email: string
  role: string
  status?: string
  createdAt?: Date
}

export default async function SettingsPage() {
  const session = await auth()

  const workspaceId = session?.user?.workspaceId

  if (!workspaceId) {
    return null // or redirect
  }

  const [dbUsers, dbInvitations] = await Promise.all([
    prisma.user.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "asc" }
    }),
    prisma.invitation.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" }
    })
  ])

  const team: TeamMember[] = [
    ...dbUsers.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: "ACTIVE",
      createdAt: u.createdAt,
    })),
    ...dbInvitations.map(i => ({
      id: i.id,
      name: "Invited User",
      email: i.email,
      role: i.role,
      status: i.status,
      createdAt: i.createdAt,
    }))
  ]

  return (
    <main className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-slate-400 mt-2">Manage your workspace and team members.</p>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Team Members</CardTitle>
          <CardDescription className="text-slate-400">
            View and manage the roles of people in your workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-300">User</TableHead>
                  <TableHead className="text-slate-300">Email</TableHead>
                  <TableHead className="text-slate-300">Role</TableHead>
                  <TableHead className="text-slate-300 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {team.map((member) => (
                  <TableRow key={member.id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="font-medium text-white">
                      {member.name}
                      {member.status === 'PENDING' && (
                        <div className="text-xs text-yellow-500 font-normal">
                          Invite Pending
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-400">{member.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-slate-700 text-slate-300 bg-slate-950">
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <RoleGuard 
                        allowedRoles={["ADMIN"]}
                        fallback={<span className="text-xs text-slate-500 italic">No access</span>}
                      >
                        <UpdateRoleSelect memberId={member.id} currentRole={member.role} />
                      </RoleGuard>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <RoleGuard allowedRoles={["ADMIN"]}>
            <div className="mt-6 flex justify-end">
              <InviteMemberButton />
            </div>
          </RoleGuard>
        </CardContent>
      </Card>
    </main>
  )
}
