export type ProjectListItem = {
  id: string
  name: string
  ownership: "owned" | "shared"
  collaboratorLabel?: string
}

export type ProjectCollaboratorListItem = {
  avatarImageUrl: string | null
  displayName: string | null
  email: string
}
