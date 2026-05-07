"use client"

import type { FormEvent } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type ProjectDialogsProps = {
  activeDialog: "create" | "rename" | "delete" | null
  currentProjectName?: string
  isLoading: boolean
  projectName: string
  slugPreview: string
  onClose: () => void
  onCreateSubmit: () => Promise<void>
  onDeleteSubmit: () => Promise<void>
  onProjectNameChange: (value: string) => void
  onRenameSubmit: () => Promise<void>
}

export function ProjectDialogs({
  activeDialog,
  currentProjectName,
  isLoading,
  projectName,
  slugPreview,
  onClose,
  onCreateSubmit,
  onDeleteSubmit,
  onProjectNameChange,
  onRenameSubmit,
}: ProjectDialogsProps) {
  const projectLabel = currentProjectName ?? "this project"

  const handleCreateSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await onCreateSubmit()
  }

  const handleRenameSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await onRenameSubmit()
  }

  return (
    <>
      <Dialog
        open={activeDialog === "create"}
        onOpenChange={(open) => {
          if (!open) {
            onClose()
          }
        }}
      >
        <DialogContent>
          <form className="space-y-4" onSubmit={handleCreateSubmit}>
            <DialogHeader>
              <DialogTitle>Create Project</DialogTitle>
              <DialogDescription>
                Start a new architecture workspace and confirm its generated
                slug before you continue.
              </DialogDescription>
            </DialogHeader>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-foreground">
                Project name
              </span>
              <Input
                autoFocus
                value={projectName}
                onChange={(event) => onProjectNameChange(event.target.value)}
                placeholder="Payments Platform"
                disabled={isLoading}
              />
            </label>

            <div className="rounded-lg border border-border/70 bg-muted/40 px-3 py-2">
              <p className="text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase">
                Slug preview
              </p>
              <p className="mt-1 font-mono text-sm text-foreground">
                {slugPreview}
              </p>
            </div>

            <DialogFooter showCloseButton>
              <Button
                type="submit"
                disabled={isLoading || projectName.trim().length === 0}
              >
                {isLoading ? "Creating..." : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={activeDialog === "rename"}
        onOpenChange={(open) => {
          if (!open) {
            onClose()
          }
        }}
      >
        <DialogContent>
          <form className="space-y-4" onSubmit={handleRenameSubmit}>
            <DialogHeader>
              <DialogTitle>Rename Project</DialogTitle>
              <DialogDescription>
                Update <span className="font-medium text-foreground">{projectLabel}</span> with a new project name.
              </DialogDescription>
            </DialogHeader>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-foreground">
                Project name
              </span>
              <Input
                autoFocus
                value={projectName}
                onChange={(event) => onProjectNameChange(event.target.value)}
                disabled={isLoading}
              />
            </label>

            <DialogFooter showCloseButton>
              <Button
                type="submit"
                disabled={isLoading || projectName.trim().length === 0}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={activeDialog === "delete"}
        onOpenChange={(open) => {
          if (!open) {
            onClose()
          }
        }}
      >
        <DialogContent>
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle>Delete Project</DialogTitle>
              <DialogDescription>
                Delete <span className="font-medium text-foreground">{projectLabel}</span> from this mock workspace.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter showCloseButton>
              <Button
                variant="destructive"
                onClick={() => {
                  void onDeleteSubmit()
                }}
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Delete Project"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
