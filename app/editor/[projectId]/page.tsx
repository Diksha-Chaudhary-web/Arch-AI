import { notFound } from "next/navigation"

import { EditorShell } from "@/components/editor/editor-shell"
import { getProjectSidebarData } from "@/lib/project-data"

export default async function ProjectEditorPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const { ownedProjects, sharedProjects } = await getProjectSidebarData()
  const allProjects = [...ownedProjects, ...sharedProjects]
  const activeProject = allProjects.find((project) => project.id === projectId)

  if (!activeProject) {
    notFound()
  }

  return (
    <EditorShell
      activeProjectId={activeProject.id}
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
    />
  )
}
