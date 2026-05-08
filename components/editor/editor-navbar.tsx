"use client"

import { UserButton } from "@clerk/nextjs"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"

type EditorNavbarProps = {
  centerContent?: ReactNode
  isSidebarOpen: boolean
  onSidebarToggle: () => void
  rightContent?: ReactNode
}

export function EditorNavbar({
  centerContent,
  isSidebarOpen,
  onSidebarToggle,
  rightContent,
}: EditorNavbarProps) {
  const SidebarIcon = isSidebarOpen ? PanelLeftClose : PanelLeftOpen

  return (
    <header className="flex h-14 items-center justify-between border-b border-border/80 bg-card/95 px-4 backdrop-blur-sm">
      <div className="flex min-w-0 flex-1 items-center">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onSidebarToggle}
          aria-label={isSidebarOpen ? "Close project sidebar" : "Open project sidebar"}
          aria-expanded={isSidebarOpen}
         aria-controls="project-sidebar"
        >
          <SidebarIcon />
        </Button>
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-center px-4">
        {centerContent}
      </div>

      <div className="flex flex-1 items-center justify-end gap-2">
        {rightContent}
        <UserButton />
      </div>
    </header>
  )
}
