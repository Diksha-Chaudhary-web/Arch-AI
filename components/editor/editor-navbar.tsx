"use client"

import { UserButton } from "@clerk/nextjs"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"

import { Button } from "@/components/ui/button"

type EditorNavbarProps = {
  isSidebarOpen: boolean
  onSidebarToggle: () => void
}

export function EditorNavbar({
  isSidebarOpen,
  onSidebarToggle,
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

      <div className="flex flex-1 items-center justify-center" />

      <div className="flex flex-1 items-center justify-end">
        <UserButton />
      </div>
    </header>
  )
}
