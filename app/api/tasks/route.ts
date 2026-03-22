import { NextResponse } from "next/server"
import { auth } from "@/app/lib/auth"
import { db } from "@/app/lib/db"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { title, description, priority, dueDate, projectId } = await req.json()

    if (!title || !projectId) {
      return NextResponse.json(
        { error: "Título e projeto são obrigatórios" },
        { status: 400 }
      )
    }

    const project = await db.project.findUnique({
      where: { id: projectId, userId: session.user.id },
    })

    if (!project) {
      return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 })
    }

    const task = await db.task.create({
      data: {
        title,
        description,
        priority: priority || "MEDIUM",
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        userId: session.user.id,
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}