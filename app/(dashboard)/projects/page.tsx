import { auth } from "@/app/lib/auth"
import { db } from "@/app/lib/db"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreateProjectButton } from "@/components/create-project-button"
import { FolderKanban } from "lucide-react"

export default async function ProjectsPage() {
  const session = await auth()
  const userId = session!.user.id

  const projects = await db.project.findMany({
    where: { userId },
    include: {
      _count: {
        select: { tasks: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projetos</h1>
          <p className="text-slate-500 mt-1">Gerencie seus projetos</p>
        </div>
        <CreateProjectButton />
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FolderKanban className="w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">Nenhum projeto ainda</h3>
          <p className="text-slate-500 mt-1">Crie seu primeiro projeto para começar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <CardTitle className="text-base">{project.name}</CardTitle>
                  </div>
                  {project.description && (
                    <p className="text-sm text-slate-500 mt-1">
                      {project.description}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">
                    {project._count.tasks} tarefa{project._count.tasks !== 1 ? "s" : ""}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}