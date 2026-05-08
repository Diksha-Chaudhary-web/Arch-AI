import { prisma } from "@/lib/prisma"
import {
  getCurrentProjectIdentity,
  type ProjectIdentity,
} from "@/lib/project-access"
import type { ProjectListItem } from "@/lib/project-types"

export async function getProjectSidebarData(): Promise<{
  ownedProjects: ProjectListItem[]
  sharedProjects: ProjectListItem[]
}>
export async function getProjectSidebarData(identity: ProjectIdentity): Promise<{
  ownedProjects: ProjectListItem[]
  sharedProjects: ProjectListItem[]
}>
export async function getProjectSidebarData(identity?: ProjectIdentity | null): Promise<{
  ownedProjects: ProjectListItem[]
  sharedProjects: ProjectListItem[]
}> {
  const userContext = identity ?? (await getCurrentProjectIdentity())

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
