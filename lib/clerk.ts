import { dark } from "@clerk/ui/themes"

export const clerkAppearance = {
  theme: dark,
  variables: {
    colorPrimary: "var(--accent-primary)",
    colorDanger: "var(--state-error)",
    colorSuccess: "var(--state-success)",
    colorWarning: "var(--state-warning)",
    colorNeutral: "var(--border-default)",
    colorForeground: "var(--text-primary)",
    colorPrimaryForeground: "var(--text-primary)",
    colorMutedForeground: "var(--text-muted)",
    colorMuted: "var(--bg-elevated)",
    colorBackground: "var(--bg-surface)",
    colorInputForeground: "var(--text-primary)",
    colorInput: "var(--input-bg)",
    colorRing: "var(--accent-primary)",
    colorShadow: "var(--bg-base)",
    colorBorder: "var(--border-default)",
    colorModalBackdrop:
      "color-mix(in srgb, var(--bg-base) 78%, transparent)",
    fontFamily: "var(--font-sans)",
    fontFamilyButtons: "var(--font-sans)",
    borderRadius: "var(--radius)",
  },
} as const

export function getClerkPath(pathname: string | undefined, fallback: string) {
  if (!pathname) {
     return (fallback)
  }

  if (pathname.startsWith("http://") || pathname.startsWith("https://")) {
    const normalizePath = (value: string) =>
    value.startsWith("/") ? value : `/${value}`;
     try {
      return new URL(pathname).pathname || fallback
    } catch {
      return normalizePath(fallback)
    }
  }

   return (pathname)
}

export function getClerkRouteMatcher(
  pathname: string | undefined,
  fallback: string
) {
  const routePath = getClerkPath(pathname, fallback).replace(/\/$/, "") || "/"

  return routePath === "/" ? "/" : `${routePath}(.*)`
}
