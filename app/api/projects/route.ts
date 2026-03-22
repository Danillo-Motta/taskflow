import { NextResponse } from "next/server"
import { auth } from "@/app/lib/auth"
import { db } from "@/app/lib/db"

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { name, description, color } = await req.json()

    if (!name) {
      return NextResponse.json(
        { error: "Nome é obrigatório" },
        { status: 400 }
      )
    }

    const project = await db.project.create({
      data: {
        name,
        description,
        color: color || "#6366f1",
        userId: session.user.id,
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}