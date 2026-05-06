"use client"

import { useMemo, useState } from "react"

export type ProjectRecord = {
  id: string
  name: string
  slug: string
  ownership: "owned" | "shared"
  collaboratorLabel?: string
}

type DialogMode = "create" | "rename" | "delete" | null

const MOCK_PROJECTS: ProjectRecord[] = [
  {
    id: "proj-marketplace-core",
    name: "Marketplace Core",
    slug: "marketplace-core",
    ownership: "owned",
  },
  {
    id: "proj-ops-console",
    name: "Operations Console",
    slug: "operations-console",
    ownership: "owned",
  },
  {
    id: "proj-client-portal",
    name: "Client Portal Refresh",
    slug: "client-portal-refresh",
    ownership: "shared",
    collaboratorLabel: "Shared by Maya",
  },
]

function slugifyProjectName(name: string) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return slug || "your-project-slug"
}

function waitForMockAction() {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, 200)
  })
}

export function useProjectDialogs() {
  const [projects, setProjects] = useState(MOCK_PROJECTS)
  const [activeDialog, setActiveDialog] = useState<DialogMode>(null)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [projectName, setProjectName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? null,
    [projects, selectedProjectId]
  )

  const ownedProjects = useMemo(
    () => projects.filter((project) => project.ownership === "owned"),
    [projects]
  )

  const sharedProjects = useMemo(
    () => projects.filter((project) => project.ownership === "shared"),
    [projects]
  )

  const slugPreview = useMemo(
    () => slugifyProjectName(projectName),
    [projectName]
  )

  const resetDialogState = () => {
    setActiveDialog(null)
    setSelectedProjectId(null)
    setProjectName("")
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
    setActiveDialog("create")
  }

  const openRenameDialog = (projectId: string) => {
    const project = projects.find((entry) => entry.id === projectId)

    if (!project || project.ownership !== "owned") {
      return
    }

    setSelectedProjectId(project.id)
    setProjectName(project.name)
    setActiveDialog("rename")
  }

  const openDeleteDialog = (projectId: string) => {
    const project = projects.find((entry) => entry.id === projectId)

    if (!project || project.ownership !== "owned") {
      return
    }

    setSelectedProjectId(project.id)
    setProjectName(project.name)
    setActiveDialog("delete")
  }

  const submitCreate = async () => {
    const trimmedName = projectName.trim()

    if (!trimmedName) {
      return
    }

    setIsLoading(true)
    await waitForMockAction()

    const newProject: ProjectRecord = {
      id: `proj-${slugifyProjectName(trimmedName)}`,
      name: trimmedName,
      slug: slugifyProjectName(trimmedName),
      ownership: "owned",
    }

    setProjects((currentProjects) => [newProject, ...currentProjects])
    setIsLoading(false)
    resetDialogState()
  }

  const submitRename = async () => {
    const trimmedName = projectName.trim()

    if (!selectedProject || !trimmedName) {
      return
    }

    setIsLoading(true)
    await waitForMockAction()

    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === selectedProject.id
          ? {
              ...project,
              name: trimmedName,
              slug: slugifyProjectName(trimmedName),
            }
          : project
      )
    )

    setIsLoading(false)
    resetDialogState()
  }

  const submitDelete = async () => {
    if (!selectedProject) {
      return
    }

    setIsLoading(true)
    await waitForMockAction()

    setProjects((currentProjects) =>
      currentProjects.filter((project) => project.id !== selectedProject.id)
    )

    setIsLoading(false)
    resetDialogState()
  }

  return {
    activeDialog,
    closeDialog,
    isLoading,
    openCreateDialog,
    openDeleteDialog,
    openRenameDialog,
    ownedProjects,
    projectName,
    selectedProject,
    setProjectName,
    sharedProjects,
    slugPreview,
    submitCreate,
    submitDelete,
    submitRename,
  }
}
