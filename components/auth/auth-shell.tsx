import type { ReactNode } from "react"

type AuthShellProps = {
  title: string
  subtitle: string
  children: ReactNode
}

const authHighlights = [
  "Protected architecture workspaces for every project",
  "Shared editor flows with consistent dark-mode tokens",
  "Fast handoff from sign-in to the editor workspace",
]

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-[minmax(20rem,28rem)_1fr]">
        <section className="hidden border-r border-border/80 bg-card lg:flex lg:flex-col lg:justify-between lg:px-10 lg:py-10">
          <div className="space-y-10">
            <div className="space-y-4">
              <p className="text-sm font-semibold tracking-[0.18em] text-foreground uppercase">
                Arch AI
              </p>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                  {title}
                </h1>
                <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                  {subtitle}
                </p>
              </div>
            </div>

            <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
              {authHighlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>

          <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
            Secure software architecture workspace
          </p>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-md">{children}</div>
        </section>
      </div>
    </main>
  )
}
