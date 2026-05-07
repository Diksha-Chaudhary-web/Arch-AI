import { EditorShell } from "@/components/editor/editor-shell"
import { getProjectSidebarData } from "@/lib/project-data"

export default async function EditorPage() {
  const { ownedProjects, sharedProjects } = await getProjectSidebarData()

  return <EditorShell ownedProjects={ownedProjects} sharedProjects={sharedProjects} />
}
