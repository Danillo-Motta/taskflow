"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, Calendar } from "lucide-react"
import { Task, TaskStatus, Priority } from "@prisma/client"

const statusConfig = {
  TODO: { label: "A fazer", className: "bg-slate-100 text-slate-700" },
  IN_PROGRESS: { label: "Em progresso", className: "bg-yellow-100 text-yellow-700" },
  DONE: { label: "Concluído", className: "bg-green-100 text-green-700" },
}

const priorityConfig = {
  LOW: { label: "Baixa", className: "bg-blue-100 text-blue-700" },
  MEDIUM: { label: "Média", className: "bg-orange-100 text-orange-700" },
  HIGH: { label: "Alta", className: "bg-red-100 text-red-700" },
}

export function TaskCard({ task }: { task: Task }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleStatusChange(status: TaskStatus) {
    setLoading(true)
    await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    router.refresh()
    setLoading(false)
  }

  async function handleDelete() {
    if (!confirm("Deletar esta tarefa?")) return
    setLoading(true)
    await fetch(`/api/tasks/${task.id}`, { method: "DELETE" })
    router.refresh()
    setLoading(false)
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-medium leading-snug">
            {task.title}
          </CardTitle>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="text-slate-400 hover:text-red-500 transition-colors shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {task.description && (
          <p className="text-xs text-slate-500">{task.description}</p>
        )}

        <div className="flex flex-wrap gap-1.5">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityConfig[task.priority].className}`}>
            {priorityConfig[task.priority].label}
          </span>
        </div>

        {task.dueDate && (
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Calendar className="w-3 h-3" />
            {new Date(task.dueDate).toLocaleDateString("pt-BR")}
          </div>
        )}

        <select
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
          disabled={loading}
          className="w-full text-xs border border-slate-200 rounded-md px-2 py-1.5 bg-white text-slate-700 cursor-pointer"
        >
          <option value="TODO">A fazer</option>
          <option value="IN_PROGRESS">Em progresso</option>
          <option value="DONE">Concluído</option>
        </select>
      </CardContent>
    </Card>
  )
}