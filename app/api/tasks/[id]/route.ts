import { NextResponse } from "next/server"
import { auth } from "@/app/lib/auth"
import { db } from "@/app/lib/db"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { id } = await params
    const data = await req.json()

    const task = await db.task.update({
      where: { id, userId: session.user.id },
      data,
    })

    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { id } = await params

    await db.task.delete({
      where: { id, userId: session.user.id },
    })

    return NextResponse.json({ message: "Tarefa deletada" })
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}