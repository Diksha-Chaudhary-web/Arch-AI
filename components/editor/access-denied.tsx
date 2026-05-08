import Link from "next/link"
import { LockKeyhole } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function AccessDenied() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="flex w-full max-w-md flex-col items-center rounded-3xl border border-border/80 bg-card/90 px-8 py-10 text-center shadow-2xl shadow-black/20 backdrop-blur-sm">
        <div className="flex size-14 items-center justify-center rounded-2xl border border-border/70 bg-muted/60">
          <LockKeyhole className="size-6 text-muted-foreground" />
        </div>

        <div className="mt-5 space-y-2">
          <h1 className="text-xl font-semibold">Access denied</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            This workspace is unavailable or you do not have permission to open it.
          </p>
        </div>

        <Link
          href="/editor"
          className={cn(buttonVariants(), "mt-6")}
        >
          Back to editor
        </Link>
      </div>
    </div>
  )
}
