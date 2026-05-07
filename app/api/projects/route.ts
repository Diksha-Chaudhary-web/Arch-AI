import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

const projectSelect = {
  id: true,
  ownerId: true,
  name: true,
  description: true,
  status: true,
  canvasJsonPath: true,
  createdAt: true,
  updatedAt: true,
} as const

async function requireUserId() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return userId
}

export async function GET() {
  const userId = await requireUserId()

  if (userId instanceof NextResponse) {
    return userId
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { updatedAt: "desc" },
    select: projectSelect,
  })

  return NextResponse.json({ projects })
}

export async function POST(request: Request) {
  const userId = await requireUserId()

  if (userId instanceof NextResponse) {
    return userId
  }

  let payload: { id?: unknown; name?: unknown } = {}

  try {
    payload = (await request.json()) as { name?: unknown }
  } catch {}

  const parsedName =
    typeof payload.name === "string" ? payload.name.trim() : ""
  const parsedId = typeof payload.id === "string" ? payload.id.trim() : ""
  const name = parsedName || "Untitled Project"
  const id =
    parsedId && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(parsedId) ? parsedId : undefined

  try {
    const project = await prisma.$transaction(async (tx) => {
      const createdProject = await tx.project.create({
        data: {
          ...(id ? { id } : {}),
          ownerId: userId,
          name,
          canvasJsonPath: "__pending__",
        },
        select: projectSelect,
      })

      return tx.project.update({
        where: { id: createdProject.id },
        data: {
          canvasJsonPath: `projects/${createdProject.id}/canvas.json`,
        },
        select: projectSelect,
      })
    })

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "A project with this room ID already exists" },
        { status: 409 }
      )
    }

    throw error
  }
}
