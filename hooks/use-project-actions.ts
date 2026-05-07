"use client"

import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"

import type { ProjectListItem } from "@/lib/project-types"
import { NextResponse } from "next/dist/server/web/spec-extension/response"

type DialogMode = "create" | "rename" | "delete" | null

function slugifyProjectName(name: string) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return slug || "untitled-project"
}

function generateShortSuffix() {
  return Math.random().toString(36).slice(2, 8)
}

function buildRoomId(name: string, suffix: string) {
  return `${slugifyProjectName(name)}-${suffix}`
}

async function parseProjectError(response: Response) {
  try {
    const payload = (await response.json()) as { error?: string }

    return payload.error || "Something went wrong."
  } catch {
    return "Something went wrong."
  }
}

export function useProjectActions({
  activeProjectId,
  ownedProjects,
  sharedProjects,
}: {
  activeProjectId?: string | null
  ownedProjects: ProjectListItem[]
  sharedProjects: ProjectListItem[]
}) {
  const router = useRouter()
  const [activeDialog, setActiveDialog] = useState<DialogMode>(null)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [projectName, setProjectName] = useState("")
  const [createSuffix, setCreateSuffix] = useState(generateShortSuffix)
  const [isLoading, setIsLoading] = useState(false)

  const projects = useMemo(
    () => [...ownedProjects, ...sharedProjects],
    [ownedProjects, sharedProjects]
  )

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? null,
    [projects, selectedProjectId]
  )

  const roomIdPreview = useMemo(
    () => buildRoomId(projectName, createSuffix),
    [createSuffix, projectName]
  )

  const resetDialogState = () => {
    setActiveDialog(null)
    setSelectedProjectId(null)
    setProjectName("")
    setCreateSuffix(generateShortSuffix())
  }

  const closeDialog = () => {
    if (isLoading) {
      return
    }

    resetDialogState()
  }

  const openCreateDialog = () => {
    setSelectedProjectId(null)
    setProjectName("")
    setCreateSuffix(generateShortSuffix())
    setActiveDialog("create")
  }

  const openProject = (projectId: string) => {
    router.push(`/editor/${projectId}`)
  }

  const openRenameDialog = (projectId: string) => {
    const project = ownedProjects.find((entry) => entry.id === projectId)

    if (!project) {
      return
    }

    setSelectedProjectId(project.id)
    setProjectName(project.name)
    setActiveDialog("rename")
  }

  const openDeleteDialog = (projectId: string) => {
    const project = ownedProjects.find((entry) => entry.id === projectId)

    if (!project) {
      return
    }

    setSelectedProjectId(project.id)
    setProjectName(project.name)
    setActiveDialog("delete")
  }

  const [error, setError] = useState<string | null>(null)

 if (!selectedProject) {
   return NextResponse.json({ error: "Project not found" }, { status: 404 })
 }

  const submitRename = async () => {
    const trimmedName = projectName.trim()

    if (!selectedProject || !trimmedName) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
        }),
      })

      if (!response.ok) {
        setError(await parseProjectError(response))
        return
      }

      resetDialogState()
      router.refresh()
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const submitDelete = async () => {
    if (!selectedProject) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        setError(await parseProjectError(response))
        return
      }

      resetDialogState()

      if (selectedProject.id === activeProjectId) {
        router.replace("/editor")
        router.refresh()
        return
      }

      router.refresh()
    } finally {
      setIsLoading(false)
      setError(null)
    }
  }

  return {
    activeDialog,
    closeDialog,
    currentProject: selectedProject,
    isLoading,
    openCreateDialog,
    openDeleteDialog,
    openProject,
    openRenameDialog,
    projectName,
    roomIdPreview,
    setProjectName,
    submitCreate,
    submitDelete,
    submitRename,
  }
}

