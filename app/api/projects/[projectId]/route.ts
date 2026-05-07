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

async function loadProject(projectId: string) {
  return prisma.project.findUnique({
    where: { id: projectId },
    select: projectSelect,
  })
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  const userId = await requireUserId()

  if (userId instanceof NextResponse) {
    return userId
  }

  const { projectId } = await context.params
  const project = await loadProject(projectId)

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }

  if (project.ownerId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  let payload: { name?: unknown }

  try {
    payload = (await request.json()) as { name?: unknown }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : ""

  if (!name) {
    return NextResponse.json(
      { error: "Project name is required" },
      { status: 400 }
    )
  }

   const updateResult = await prisma.project.updateMany({
   where: { id: projectId, ownerId: userId },
   data: { name },
 })

 if (updateResult.count === 0) {
  const exists = await prisma.project.findUnique({
       where: { id: projectId },
     select: { id: true },
   })
   return NextResponse.json(
     { error: exists ? "Forbidden" : "Project not found" },
     { status: exists ? 403 : 404 }
   )
 }
 const updatedProject = await prisma.project.findUnique({
   where: { id: projectId },
   select: projectSelect,
 })

  return NextResponse.json({ project: updatedProject })
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  const userId = await requireUserId()

  if (userId instanceof NextResponse) {
    return userId
  }

  const { projectId } = await context.params
  const project = await loadProject(projectId)

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }

  if (project.ownerId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const deleteResult = await prisma.project.deleteMany({
   where: { id: projectId, ownerId: userId },
 })
 if (deleteResult.count === 0) {
   const exists = await prisma.project.findUnique({
     where: { id: projectId },
     select: { id: true },
   })
   return NextResponse.json(
     { error: exists ? "Forbidden" : "Project not found" },
     { status: exists ? 403 : 404 }
   )
 }

  return new NextResponse(null, { status: 204 })
}
