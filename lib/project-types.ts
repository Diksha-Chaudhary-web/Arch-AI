export type ProjectListItem = {
  id: string
  name: string
  ownership: "owned" | "shared"
  collaboratorLabel?: string
}

