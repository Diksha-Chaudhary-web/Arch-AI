"use client"

import { Check, Copy, LoaderCircle, Trash2, UserPlus, Users } from "lucide-react"
import { useEffect, useState, type FormEvent, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { ProjectCollaboratorListItem } from "@/lib/project-types"

type ShareDialogProps = {
  canManageAccess: boolean
  projectId: string
  projectName: string
  triggerIcon?: ReactNode
}

type CollaboratorResponse = {
  canManageAccess: boolean
  collaborators: ProjectCollaboratorListItem[]
}

function getInitials(value: string) {
  return value
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

async function parseError(response: Response) {
  try {
    const payload = (await response.json()) as { error?: string }

    return payload.error || "Something went wrong."
  } catch {
    return "Something went wrong."
  }
}

function CollaboratorAvatar({
  avatarImageUrl,
  fallbackLabel,
}: {
  avatarImageUrl: string | null
  fallbackLabel: string
}) {
  if (avatarImageUrl) {
    return (
      <img
        alt=""
        className="size-10 rounded-full border border-white/10 object-cover"
        src={avatarImageUrl}
      />
    )
  }

  return (
    <div className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-semibold tracking-[0.12em] text-slate-200 uppercase">
      {getInitials(fallbackLabel) || "?"}
    </div>
  )
}

export function ShareDialog({
  canManageAccess,
  projectId,
  projectName,
  triggerIcon,
}: ShareDialogProps) {
  const [open, setOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [collaborators, setCollaborators] = useState<ProjectCollaboratorListItem[]>([])
  const [canManageState, setCanManageState] = useState(canManageAccess)
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle")
  const [error, setError] = useState<string | null>(null)
  const [isInviting, setIsInviting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [removingEmail, setRemovingEmail] = useState<string | null>(null)

  useEffect(() => {
    setCanManageState(canManageAccess)
  }, [canManageAccess])

  useEffect(() => {
    if (copyState !== "copied") {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setCopyState("idle")
    }, 1500)

    return () => window.clearTimeout(timeoutId)
  }, [copyState])

  useEffect(() => {
    if (!open) {
      return
    }

    let isCancelled = false

    const loadCollaborators = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/projects/${projectId}/collaborators`, {
          cache: "no-store",
        })

        if (!response.ok) {
          if (!isCancelled) {
            setError(await parseError(response))
          }
          return
        }

        const payload = (await response.json()) as CollaboratorResponse

        if (!isCancelled) {
          setCollaborators(payload.collaborators)
          setCanManageState(payload.canManageAccess)
        }
      } catch {
        if (!isCancelled) {
          setError("Network error. Please try again.")
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadCollaborators()

    return () => {
      isCancelled = true
    }
  }, [open, projectId])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/editor/${projectId}`
      )
      setCopyState("copied")
    } catch {
      setError("Unable to copy the project link right now.")
    }
  }

  const handleInvite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const email = inviteEmail.trim()

    if (!email) {
      return
    }

    setIsInviting(true)
    setError(null)

    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        setError(await parseError(response))
        return
      }

      const payload = (await response.json()) as {
        collaborators: ProjectCollaboratorListItem[]
      }

      setCollaborators(payload.collaborators)
      setInviteEmail("")
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setIsInviting(false)
    }
  }

  const handleRemove = async (email: string) => {
    setRemovingEmail(email)
    setError(null)

    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        setError(await parseError(response))
        return
      }

      setCollaborators((currentCollaborators) =>
        currentCollaborators.filter((collaborator) => collaborator.email !== email)
      )
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setRemovingEmail(null)
    }
  }

  const emptyStateLabel = canManageState
    ? "No collaborators yet. Invite a teammate to give them access."
    : "No collaborators have been added to this project yet."

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)

        if (!nextOpen) {
          setCopyState("idle")
          setError(null)
          setInviteEmail("")
          setRemovingEmail(null)
        }
      }}
    >
      <DialogTrigger
        render={<Button variant="outline" size="sm" />}
      >
        {triggerIcon}
        Share
      </DialogTrigger>

      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-2xl">
        <div className="space-y-5">
          <DialogHeader>
            <DialogTitle>Share Project</DialogTitle>
            <DialogDescription>
              Manage access for <span className="font-medium text-foreground">{projectName}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-2xl border border-white/10 bg-[#101722] p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold tracking-[0.16em] text-slate-400 uppercase">
                  Project link
                </p>
                <p className="mt-1 break-all text-sm text-slate-100">
                  {`/editor/${projectId}`}
                </p>
              </div>

              <Button variant="secondary" size="sm" onClick={() => void handleCopyLink()}>
                {copyState === "copied" ? (
                  <Check data-icon="inline-start" />
                ) : (
                  <Copy data-icon="inline-start" />
                )}
                {copyState === "copied" ? "Copied!" : "Copy Link"}
              </Button>
            </div>
          </div>

          {canManageState ? (
            <form className="space-y-3" onSubmit={handleInvite}>
              <div className="flex items-center gap-2">
                <UserPlus className="size-4 text-slate-400" />
                <p className="text-sm font-medium text-foreground">
                  Invite collaborator
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  autoFocus
                  value={inviteEmail}
                  onChange={(event) => setInviteEmail(event.target.value)}
                  placeholder="teammate@example.com"
                  disabled={isInviting}
                  type="email"
                />
                <Button
                  className="sm:shrink-0"
                  type="submit"
                  disabled={isInviting || inviteEmail.trim().length === 0}
                >
                  {isInviting ? "Inviting..." : "Invite"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="rounded-xl border border-border/70 bg-muted/30 px-4 py-3">
              <p className="text-sm text-muted-foreground">
                You can view who has access to this project, but only the owner can invite or remove collaborators.
              </p>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-slate-400" />
                <p className="text-sm font-medium text-foreground">
                  Collaborators
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {collaborators.length} {collaborators.length === 1 ? "person" : "people"}
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-background/40">
              <ScrollArea className="max-h-72">
                <div className="space-y-2 p-3">
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2 px-3 py-10 text-sm text-muted-foreground">
                      <LoaderCircle className="size-4 animate-spin" />
                      Loading collaborators...
                    </div>
                  ) : collaborators.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
                      {emptyStateLabel}
                    </div>
                  ) : (
                    collaborators.map((collaborator) => {
                      const fallbackLabel =
                        collaborator.displayName || collaborator.email
                      const isRemoving = removingEmail === collaborator.email

                      return (
                        <div
                          key={collaborator.email}
                          className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-3"
                        >
                          <CollaboratorAvatar
                            avatarImageUrl={collaborator.avatarImageUrl}
                            fallbackLabel={fallbackLabel}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">
                              {collaborator.displayName || collaborator.email}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {collaborator.email}
                            </p>
                          </div>
                          {canManageState ? (
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => void handleRemove(collaborator.email)}
                              aria-label={`Remove ${collaborator.email}`}
                              disabled={isRemoving}
                            >
                              {isRemoving ? (
                                <LoaderCircle className="size-4 animate-spin" />
                              ) : (
                                <Trash2 className="size-4 text-destructive" />
                              )}
                            </Button>
                          ) : null}
                        </div>
                      )
                    })
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}
        </div>

        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  )
}
