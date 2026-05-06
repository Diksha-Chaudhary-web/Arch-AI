import { ClerkProvider } from "@clerk/nextjs"
import type { Metadata } from "next"

import { clerkAppearance, getClerkPath } from "@/lib/clerk"

import "./globals.css"

export const metadata: Metadata = {
  title: "ArchFlow AI",
  description: "AI-powered collaborative software architecture workspace",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const signInUrl = getClerkPath(process.env.CLERK_SIGN_IN_URL, "/sign-in")

  return (
    <html lang="en" className="h-full dark antialiased">
      <body className="min-h-full flex flex-col">
        <ClerkProvider
          appearance={clerkAppearance}
          afterSignOutUrl={signInUrl}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}
