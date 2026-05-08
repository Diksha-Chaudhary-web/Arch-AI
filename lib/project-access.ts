import { auth, currentUser } from "@clerk/nextjs/server"

import { prisma } from "@/lib/prisma"

export type ProjectIdentity = {
  emailAddresses: string[]
  primaryEmail: string | null
  userId: string
}

export type AccessibleProject = {
  accessRole: "collaborator" | "owner"
  id: string
  name: string
}

export async function getCurrentProjectIdentity(): Promise<ProjectIdentity | null> {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  const user = await currentUser()
  const emailAddresses = Array.from(
    new Set(
      (user?.emailAddresses ?? [])
        .map((emailAddress) => emailAddress.emailAddress.trim().toLowerCase())
        .filter((emailAddress) => emailAddress.length > 0)
    )
  )
  const primaryEmail =
    user?.emailAddresses
      .find((emailAddress) => emailAddress.id === user.primaryEmailAddressId)
      ?.emailAddress.toLowerCase() ?? null

  return {
    emailAddresses,
    primaryEmail,
    userId,
  }
}

export async function getAccessibleProjectById(
  projectId: string,
  identity: ProjectIdentity
): Promise<AccessibleProject | null> {
  const accessConditions = [
    { ownerId: identity.userId },
    ...(identity.emailAddresses.length > 0
      ? [
          {
            collaborators: {
              some: {
                collaboratorEmail: {
                  in: identity.emailAddresses,
                },
              },
            },
          },
        ]
      : []),
  ]

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: accessConditions,
    },
    select: {
      id: true,
      name: true,
      ownerId: true,
    },
  })

  if (!project) {
    return null
  }

  return {
    accessRole: project.ownerId === identity.userId ? "owner" : "collaborator",
    id: project.id,
    name: project.name,
  }
}
