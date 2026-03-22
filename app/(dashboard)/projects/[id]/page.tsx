import { auth } from "@/app/lib/auth"
import { db } from "@/app/lib/db"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { CreateTaskButton } from "@/components/create-task-button"
import { TaskCard } from "@/components/task-card"
import { TaskStatus } from "@prisma/client"

const columns = [
  { status: TaskStatus.TODO, label: "A fazer", color: "bg-slate-100" },
  { status: TaskStatus.IN_PROGRESS, label: "Em progresso", color: "bg-yellow-100" },
  { status: TaskStatus.DONE, label: "Concluído", color: "bg-green-100" },
]

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  const userId = session!.user.id
  const { id } = await params
  
  const project = await db.project.findUnique({
    where: { id, userId },
    include: { tasks: { orderBy: { createdAt: "desc" } } },
  })

  if (!project) notFound()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: project.color }}
          />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
            {project.description && (
              <p className="text-slate-500 mt-1">{project.description}</p>
            )}
          </div>
        </div>
        <CreateTaskButton projectId={project.id} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => {
          const tasks = project.tasks.filter((t) => t.status === column.status)
          return (
            <div key={column.status}>
              <div className="flex items-center gap-2 mb-4">
                <div className={`px-3 py-1 rounded-full ${column.color}`}>
                  <span className="text-sm font-medium">{column.label}</span>
                </div>
                <Badge variant="secondary">{tasks.length}</Badge>
              </div>
              <div className="space-y-3">
                {tasks.length === 0 ? (
                  <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center">
                    <p className="text-sm text-slate-400">Nenhuma tarefa</p>
                  </div>
                ) : (
                  tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}