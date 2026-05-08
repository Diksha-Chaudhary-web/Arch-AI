"use client"

import { Pencil, Plus, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { ProjectListItem } from "@/lib/project-types"

type ProjectSidebarProps = {
  activeProjectId?: string | null
  isOpen: boolean
  layout?: "overlay" | "docked"
  onClose: () => void
  ownedProjects: ProjectListItem[]
  sharedProjects: ProjectListItem[]
  onCreateProject: () => void
  onDeleteProject: (projectId: string) => void
  onOpenProject: (projectId: string) => void
  onRenameProject: (projectId: string) => void
}

function EmptyProjectsState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex h-full min-h-0 items-center justify-center rounded-xl border border-dashed border-border/80 bg-background/40 p-6 text-center">
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function ProjectList({
  projects,
  activeProjectId,
  onDeleteProject,
  onOpenProject,
  onRenameProject,
  showActions,
}: {
  activeProjectId?: string | null
  projects: ProjectListItem[]
  onDeleteProject: (projectId: string) => void
  onOpenProject: (projectId: string) => void
  onRenameProject: (projectId: string) => void
  showActions: boolean
}) {
  return (
    <div className="space-y-2">
      {projects.map((project) => (
        <div
          key={project.id}
          className={cn(
            "flex items-start justify-between gap-3 rounded-xl border px-3 py-3 transition-colors",
            project.id === activeProjectId
              ? "border-accent-primary/50 bg-accent-soft/35"
              : "border-border/70 bg-background/50"
          )}
        >
          <button
            type="button"
            className="min-w-0 flex-1 space-y-1 text-left"
            onClick={() => onOpenProject(project.id)}
          >
            <p className="truncate text-sm font-medium text-foreground">{project.name}</p>
            <p className="truncate font-mono text-xs text-muted-foreground">{project.id}</p>
            {project.collaboratorLabel ? (
              <p className="text-xs text-muted-foreground">{project.collaboratorLabel}</p>
            ) : null}
          </button>

          {showActions ? (
            <div className="flex shrink-0 items-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onRenameProject(project.id)}
                aria-label={`Rename ${project.name}`}
              >
                <Pencil />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onDeleteProject(project.id)}
                aria-label={`Delete ${project.name}`}
              >
                <Trash2 />
              </Button>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}

export function ProjectSidebar({
  activeProjectId,
  isOpen,
  layout = "overlay",
  onClose,
  ownedProjects,
  sharedProjects,
  onCreateProject,
  onDeleteProject,
  onOpenProject,
  onRenameProject,
}: ProjectSidebarProps) {
  return (
    <aside
      id="project-sidebar"
      className={cn(
        "w-full max-w-sm px-3 pb-3 pt-2 transition-transform duration-200 ease-out sm:w-[22rem]",
        layout === "overlay"
          ? "absolute inset-y-0 left-0 z-30"
          : "relative z-10 h-full shrink-0 border-r border-border/70 bg-card/70",
        isOpen ? "translate-x-0" : "-translate-x-[calc(100%+0.75rem)]",
        layout === "docked" && "hidden md:block",
        layout === "docked" && !isOpen && "md:-ml-[22rem]"
      )}
      aria-hidden={!isOpen}
      inert={!isOpen && layout === "overlay"}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-popover/96 shadow-2xl shadow-black/25 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-border/80 px-4 py-4">
          <h2 className="text-sm font-semibold tracking-[0.08em] text-foreground uppercase">
            Projects
          </h2>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close project sidebar"
          >
            <X />
          </Button>
        </div>

        <Tabs
          defaultValue="my-projects"
          className="flex min-h-0 flex-1 flex-col px-4 py-4"
        >
          <TabsList className="grid h-auto w-full grid-cols-2 bg-muted/70 p-1">
            <TabsTrigger value="my-projects">My Projects</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
          </TabsList>

          <TabsContent value="my-projects" className="mt-4 min-h-0 flex-1">
            {ownedProjects.length > 0 ? (
              <ProjectList
                activeProjectId={activeProjectId}
                projects={ownedProjects}
                onDeleteProject={onDeleteProject}
                onOpenProject={onOpenProject}
                onRenameProject={onRenameProject}
                showActions
              />
            ) : (
              <EmptyProjectsState
                title="No projects yet"
                description="Create your first architecture workspace to start shaping ideas."
              />
            )}
          </TabsContent>

          <TabsContent value="shared" className="mt-4 min-h-0 flex-1">
            {sharedProjects.length > 0 ? (
              <ProjectList
                activeProjectId={activeProjectId}
                projects={sharedProjects}
                onDeleteProject={onDeleteProject}
                onOpenProject={onOpenProject}
                onRenameProject={onRenameProject}
                showActions={false}
              />
            ) : (
              <EmptyProjectsState
                title="Nothing shared yet"
                description="Shared project spaces from collaborators will appear here."
              />
            )}
          </TabsContent>
        </Tabs>

        <div className="border-t border-border/80 p-4">
          <Button className="w-full" onClick={onCreateProject}>
            <Plus data-icon="inline-start" />
            New Project
          </Button>
        </div>
      </div>
    </aside>
  )
}
