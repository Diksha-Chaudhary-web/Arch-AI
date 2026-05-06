"use client"

import { useState } from "react"

import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"

export function EditorShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={() => setIsSidebarOpen((open) => !open)}
      />

      <main className="relative flex-1 overflow-hidden">
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <section className="relative flex h-full min-h-[calc(100vh-3.5rem)] items-center justify-center overflow-hidden px-6 py-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--accent-soft)_52%,transparent),transparent_34%),radial-gradient(circle_at_bottom_right,color-mix(in_srgb,var(--accent-primary)_16%,transparent),transparent_28%)]" />
          <div className="relative flex h-full w-full max-w-6xl items-center justify-center rounded-[2rem] border border-border/70 bg-card/55 shadow-[0_30px_120px_rgba(0,0,0,0.35)] backdrop-blur-sm">
            <div className="space-y-3 px-6 text-center">
              <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
                Editor Canvas
              </p>
              <h1 className="text-2xl font-semibold text-foreground">
                Base editor chrome is ready
              </h1>
              <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                The shared navbar, floating project sidebar, and dialog styling
                pattern are now in place for the feature work that follows.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
