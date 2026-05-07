import { auth, currentUser } from "@clerk/nextjs/server"

import { prisma } from "@/lib/prisma"
import type { ProjectListItem } from "@/lib/project-types"

async function getCurrentUserContext() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  const user = await currentUser()
  const emailAddresses =
    user?.emailAddresses
      .map((emailAddress) => emailAddress.emailAddress.toLowerCase())
      .filter(Boolean) ?? []

  return {
    emailAddresses,
    userId,
  }
}

export async function getProjectSidebarData(): Promise<{
  ownedProjects: ProjectListItem[]
  sharedProjects: ProjectListItem[]
}> {
  const userContext = await getCurrentUserContext()

  if (!userContext) {
    return {
      ownedProjects: [],
      sharedProjects: [],
    }
  }

  const { emailAddresses, userId } = userContext

  const [ownedProjects, sharedProjects] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: userId },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
      },
    }),
    emailAddresses.length > 0
      ? prisma.project.findMany({
          where: {
            NOT: { ownerId: userId },
            collaborators: {
              some: {
                collaboratorEmail: {
                  in: emailAddresses,
                },
              },
            },
          },
          orderBy: { updatedAt: "desc" },
          select: {
            id: true,
            name: true,
          },
        })
      : Promise.resolve([]),
  ])

  return {
    ownedProjects: ownedProjects.map((project) => ({
      id: project.id,
      name: project.name,
      ownership: "owned" as const,
    })),
    sharedProjects: sharedProjects.map((project) => ({
      id: project.id,
      name: project.name,
      ownership: "shared" as const,
      collaboratorLabel: "Shared with you",
    })),
  }
}

