"use client"

import { Plus } from "lucide-react"
import { useState } from "react"

import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectDialogs } from "@/components/editor/project-dialogs"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { Button } from "@/components/ui/button"
import { useProjectActions } from "@/hooks/use-project-actions"
import type { ProjectListItem } from "@/lib/project-types"

export function EditorShell({
  activeProjectId,
  ownedProjects,
  sharedProjects,
}: {
  activeProjectId?: string | null
  ownedProjects: ProjectListItem[]
  sharedProjects: ProjectListItem[]
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const {
    activeDialog,
    closeDialog,
    currentProject,
    isLoading,
    openCreateDialog,
    openDeleteDialog,
    openProject,
    openRenameDialog,
    projectName,
    setProjectName,
    roomIdPreview,
    submitCreate,
    submitDelete,
    submitRename,
  } = useProjectActions({
    activeProjectId,
    ownedProjects,
    sharedProjects,
  })

  const activeProject =
    currentProject?.id === activeProjectId
      ? currentProject
      : [...ownedProjects, ...sharedProjects].find(
          (project) => project.id === activeProjectId
        ) ?? null

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={() => setIsSidebarOpen((open) => !open)}
      />

      <main className="relative flex-1 overflow-hidden">
        <button
          type="button"
          className={`absolute inset-0 z-20 bg-black/45 transition-opacity duration-200 sm:hidden ${
            isSidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close project sidebar backdrop"
        />

        <ProjectSidebar
          activeProjectId={activeProjectId}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
          onCreateProject={openCreateDialog}
          onDeleteProject={openDeleteDialog}
          onOpenProject={openProject}
          onRenameProject={openRenameDialog}
        />

        <section className="relative flex h-full min-h-[calc(100vh-3.5rem)] items-center justify-center overflow-hidden px-6 py-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--accent-soft)_52%,transparent),transparent_34%),radial-gradient(circle_at_bottom_right,color-mix(in_srgb,var(--accent-primary)_16%,transparent),transparent_28%)]" />
          <div className="relative flex w-full max-w-2xl flex-col items-center justify-center text-center">
            <div className="space-y-4">
              {activeProject ? (
                <>
                  <h1 className="text-3xl font-semibold text-foreground">{activeProject.name}</h1>
                  <p className="max-w-xl font-mono text-sm leading-6 text-muted-foreground">
                    {activeProject.id}
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-semibold text-foreground">
                    Create a project or open an existing one
                  </h1>
                  <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                    Start a new architecture workspace, or choose a project from the sidebar.
                  </p>
                </>
              )}
            </div>

            <Button className="mt-6" size="lg" onClick={openCreateDialog}>
              <Plus data-icon="inline-start" />
              New Project
            </Button>
          </div>
        </section>

        <ProjectDialogs
          activeDialog={activeDialog}
          currentProjectName={currentProject?.name}
          isLoading={isLoading}
          projectName={projectName}
          roomIdPreview={roomIdPreview}
          onClose={closeDialog}
          onCreateSubmit={submitCreate}
          onDeleteSubmit={submitDelete}
          onProjectNameChange={setProjectName}
          onRenameSubmit={submitRename}
        />
      </main>
    </div>
  )
}
