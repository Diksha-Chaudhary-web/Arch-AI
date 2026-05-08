import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

import { getAccessibleProjectById, getCurrentProjectIdentity } from "@/lib/project-access"
import {
  getProjectCollaborators,
  isValidCollaboratorEmail,
} from "@/lib/project-collaborators"
import { prisma } from "@/lib/prisma"

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

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
    select: {
      id: true,
      ownerId: true,
    },
  })
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  const identity = await getCurrentProjectIdentity()

  if (!identity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectId } = await context.params
  const project = await getAccessibleProjectById(projectId, identity)

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }

  const collaborators = await getProjectCollaborators(projectId)

  return NextResponse.json({
    canManageAccess: project.accessRole === "owner",
    collaborators,
  })
}

export async function POST(
  request: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  const userId = await requireUserId()

  if (userId instanceof NextResponse) {
    return userId
  }

  const identity = await getCurrentProjectIdentity()

  if (!identity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { projectId } = await context.params
  const project = await loadProject(projectId)

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }

  if (project.ownerId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  let payload: { email?: unknown }

  try {
    payload = (await request.json()) as { email?: unknown }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const email = typeof payload.email === "string" ? normalizeEmail(payload.email) : ""

  if (!email) {
    return NextResponse.json(
      { error: "Collaborator email is required" },
      { status: 400 }
    )
  }

  if (!isValidCollaboratorEmail(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address" },
      { status: 400 }
    )
  }

  if (identity.emailAddresses.includes(email)) {
    return NextResponse.json(
      { error: "The project owner already has access" },
      { status: 400 }
    )
  }

  try {
    await prisma.projectCollaborator.create({
      data: {
        collaboratorEmail: email,
        projectId,
      },
    })
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "That collaborator already has access" },
        { status: 409 }
      )
    }

    throw error
  }

  const collaborators = await getProjectCollaborators(projectId)

  return NextResponse.json(
    {
      collaborator: collaborators.find((entry) => entry.email === email) ?? null,
      collaborators,
    },
    { status: 201 }
  )
}

export async function DELETE(
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

  let payload: { email?: unknown }

  try {
    payload = (await request.json()) as { email?: unknown }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const email = typeof payload.email === "string" ? normalizeEmail(payload.email) : ""

  if (!email) {
    return NextResponse.json(
      { error: "Collaborator email is required" },
      { status: 400 }
    )
  }

  const deleteResult = await prisma.projectCollaborator.deleteMany({
    where: {
      collaboratorEmail: email,
      projectId,
    },
  })

  if (deleteResult.count === 0) {
    return NextResponse.json(
      { error: "Collaborator not found" },
      { status: 404 }
    )
  }

  return new NextResponse(null, { status: 204 })
}
