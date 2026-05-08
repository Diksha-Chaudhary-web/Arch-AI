import { clerkClient } from "@clerk/nextjs/server"

import { prisma } from "@/lib/prisma"
import type { ProjectCollaboratorListItem } from "@/lib/project-types"

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function getUserDisplayName(user: {
  firstName: string | null
  fullName: string | null
  lastName: string | null
  username: string | null
}) {
  if (user.fullName?.trim()) {
    return user.fullName.trim()
  }

  const fallbackName = [user.firstName, user.lastName]
    .filter(Boolean)
    .join(" ")
    .trim()

  if (fallbackName) {
    return fallbackName
  }

  return user.username?.trim() || null
}

export function isValidCollaboratorEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function enrichCollaboratorEmails(
  emails: string[]
): Promise<ProjectCollaboratorListItem[]> {
  const normalizedEmails = Array.from(
    new Set(emails.map(normalizeEmail).filter((email) => email.length > 0))
  )

  if (normalizedEmails.length === 0) {
    return []
  }

  let usersData: Awaited<
    ReturnType<Awaited<ReturnType<typeof clerkClient>>["users"]["getUserList"]>
  >["data"] = []

  try {
    const client = await clerkClient()
    const users = await client.users.getUserList({
      emailAddress: normalizedEmails,
      limit: normalizedEmails.length,
    })
    usersData = users.data
  } catch {
    return normalizedEmails.map((email) => ({
      avatarImageUrl: null,
      displayName: null,
      email,
    }))
  }
  const collaboratorProfiles = new Map<
    string,
    Omit<ProjectCollaboratorListItem, "email">
  >()

  for (const user of usersData) {
    const displayName = getUserDisplayName(user)
    const avatarImageUrl = user.hasImage ? user.imageUrl : null

    for (const emailAddress of user.emailAddresses) {
      const email = normalizeEmail(emailAddress.emailAddress)

      if (!collaboratorProfiles.has(email)) {
        collaboratorProfiles.set(email, {
          avatarImageUrl,
          displayName,
        })
      }
    }
  }

  return normalizedEmails.map((email) => ({
    avatarImageUrl: collaboratorProfiles.get(email)?.avatarImageUrl ?? null,
    displayName: collaboratorProfiles.get(email)?.displayName ?? null,
    email,
  }))
}

export async function getProjectCollaborators(projectId: string) {
  const collaborators = await prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: [{ createdAt: "asc" }, { collaboratorEmail: "asc" }],
    select: {
      collaboratorEmail: true,
    },
  })

  return enrichCollaboratorEmails(
    collaborators.map((collaborator) => collaborator.collaboratorEmail)
  )
}
