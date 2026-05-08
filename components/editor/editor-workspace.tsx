"use client"

import { Bot, Share2 } from "lucide-react"
import { useState } from "react"

import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectDialogs } from "@/components/editor/project-dialogs"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { ShareDialog } from "@/components/editor/share-dialog"
import { Button } from "@/components/ui/button"
import { useProjectActions } from "@/hooks/use-project-actions"
import type { ProjectListItem } from "@/lib/project-types"

type EditorWorkspaceProps = {
  activeProjectId: string
  canManageAccess: boolean
  ownedProjects: ProjectListItem[]
  projectName: string
  sharedProjects: ProjectListItem[]
}

export function EditorWorkspace({
  activeProjectId,
  canManageAccess,
  ownedProjects,
  projectName,
  sharedProjects,
}: EditorWorkspaceProps) {
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(true)
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
    projectName: pendingProjectName,
    roomIdPreview,
    setProjectName,
    submitCreate,
    submitDelete,
    submitRename,
  } = useProjectActions({
    activeProjectId,
    ownedProjects,
    sharedProjects,
  })

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={() => setIsSidebarOpen((open) => !open)}
        centerContent={
          <div className="min-w-0 text-center">
            <p className="truncate text-sm font-semibold tracking-[0.08em] text-foreground uppercase">
              {projectName}
            </p>
          </div>
        }
        rightContent={
          <>
            <ShareDialog
              canManageAccess={canManageAccess}
              projectId={activeProjectId}
              projectName={projectName}
              triggerIcon={<Share2 data-icon="inline-start" />}
            />
            <Button
             className="hidden lg:inline-flex"
              variant="outline"
              size="sm"
              onClick={() => setIsAiSidebarOpen((open) => !open)}
              aria-expanded={isAiSidebarOpen}
              aria-controls="ai-sidebar"
            >
              <Bot data-icon="inline-start" />
              AI Panel
            </Button>
          </>
        }
      />

      <main className="relative flex min-h-0 flex-1 overflow-hidden">
        <button
          type="button"
          className={`absolute inset-0 z-20 bg-black/45 transition-opacity duration-200 md:hidden ${
            isSidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close project sidebar backdrop"
        />

        <ProjectSidebar
          activeProjectId={activeProjectId}
          isOpen={isSidebarOpen}
          layout="overlay"
          onClose={() => setIsSidebarOpen(false)}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
          onCreateProject={openCreateDialog}
          onDeleteProject={openDeleteDialog}
          onOpenProject={openProject}
          onRenameProject={openRenameDialog}
        />

        <ProjectSidebar
          activeProjectId={activeProjectId}
          isOpen={isSidebarOpen}
          layout="docked"
          onClose={() => setIsSidebarOpen(false)}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
          onCreateProject={openCreateDialog}
          onDeleteProject={openDeleteDialog}
          onOpenProject={openProject}
          onRenameProject={openRenameDialog}
        />

        <section className="relative flex min-w-0 flex-1 overflow-hidden bg-[#0b1117]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(77,163,255,0.14),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.16),transparent_28%)]" />
          <div className="relative flex flex-1 items-center justify-center px-6 py-10">
            <div className="max-w-xl rounded-3xl border border-white/10 bg-white/5 px-8 py-10 text-center shadow-2xl shadow-black/30 backdrop-blur-sm">
              <p className="text-xs font-semibold tracking-[0.16em] text-slate-400 uppercase">
                Canvas coming next
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-white">{projectName}</h1>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                This workspace shell is ready for collaborative canvas, presence, and AI tools.
                For now, it keeps the project context in place while the editor surface is built.
              </p>
            </div>
          </div>
        </section>

        {isAiSidebarOpen ? (
          <aside
           id="ai-sidebar"
            className="hidden h-full w-[22rem] shrink-0 border-l border-border/70 bg-card/75 p-4 backdrop-blur-sm lg:block"
          >
            <div className="flex h-full flex-col rounded-2xl border border-border/80 bg-popover/80 p-5">
              <p className="text-sm font-semibold tracking-[0.08em] text-foreground uppercase">
                AI Workspace
              </p>
              <div className="mt-4 flex flex-1 items-center justify-center rounded-2xl border border-dashed border-border/70 bg-background/40 px-5 text-center">
                <p className="text-sm leading-6 text-muted-foreground">
                  AI chat and generation tools will land here in a future step.
                </p>
              </div>
            </div>
          </aside>
        ) : null}

        <ProjectDialogs
          activeDialog={activeDialog}
          currentProjectName={currentProject?.name}
          isLoading={isLoading}
          projectName={pendingProjectName}
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
