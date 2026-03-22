import { auth } from "@/app/lib/auth"
import { db } from "@/app/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderKanban, CheckCircle, Clock, AlertCircle } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  const userId = session!.user.id

  const [projectCount, todoCount, inProgressCount, doneCount] =
    await Promise.all([
      db.project.count({ where: { userId } }),
      db.task.count({ where: { userId, status: "TODO" } }),
      db.task.count({ where: { userId, status: "IN_PROGRESS" } }),
      db.task.count({ where: { userId, status: "DONE" } }),
    ])

  const stats = [
    {
      label: "Projetos",
      value: projectCount,
      icon: FolderKanban,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "A fazer",
      value: todoCount,
      icon: AlertCircle,
      color: "text-slate-600",
      bg: "bg-slate-50",
    },
    {
      label: "Em progresso",
      value: inProgressCount,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "Concluídas",
      value: doneCount,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Olá, {session!.user.name}! 👋
        </h1>
        <p className="text-slate-500 mt-1">
          Aqui está um resumo das suas tarefas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {stat.label}
                </CardTitle>
                <div className={`p-2 rounded-md ${stat.bg}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}