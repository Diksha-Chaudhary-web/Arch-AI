import { redirect } from "next/navigation"

import { AccessDenied } from "@/components/editor/access-denied"
import { EditorWorkspace } from "@/components/editor/editor-workspace"
import {
  getAccessibleProjectById,
  getCurrentProjectIdentity,
} from "@/lib/project-access"
import { getProjectSidebarData } from "@/lib/project-data"

export default async function ProjectEditorPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const identity = await getCurrentProjectIdentity()

  if (!identity) {
    redirect("/sign-in")
  }

  const [activeProject, { ownedProjects, sharedProjects }] = await Promise.all([
    getAccessibleProjectById(projectId, identity),
    getProjectSidebarData(identity),
  ])

  if (!activeProject) {
    return <AccessDenied />
  }

  return (
    <EditorWorkspace
      activeProjectId={activeProject.id}
      canManageAccess={activeProject.accessRole === "owner"}
      ownedProjects={ownedProjects}
      projectName={activeProject.name}
      sharedProjects={sharedProjects}
    />
  )
}
