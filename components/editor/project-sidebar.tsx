"use client"

import { Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type ProjectSidebarProps = {
  isOpen: boolean
  onClose: () => void
}

function EmptyProjectsState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex h-full min-h-0 items-center justify-center rounded-xl border border-dashed border-border/80 bg-background/40 p-6 text-center">
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  return (
    <aside
    id="project-sidebar"
      className={cn(
        "absolute inset-y-0 left-0 z-30 w-full max-w-sm px-3 pb-3 pt-2 transition-transform duration-200 ease-out sm:w-[22rem]",
        isOpen ? "translate-x-0" : "-translate-x-[calc(100%+0.75rem)]"
      )}
      aria-hidden={!isOpen}
      inert={!isOpen}
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
            <EmptyProjectsState
              title="No projects yet"
              description="Create your first architecture workspace to start shaping ideas."
            />
          </TabsContent>

          <TabsContent value="shared" className="mt-4 min-h-0 flex-1">
            <EmptyProjectsState
              title="Nothing shared yet"
              description="Shared project spaces from collaborators will appear here."
            />
          </TabsContent>
        </Tabs>

        <div className="border-t border-border/80 p-4">
          <Button className="w-full">
            <Plus data-icon="inline-start" />
            New Project
          </Button>
        </div>
      </div>
    </aside>
  )
}
