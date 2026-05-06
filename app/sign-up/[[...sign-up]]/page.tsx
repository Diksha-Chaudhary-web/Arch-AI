import { SignUp } from "@clerk/nextjs"

import { AuthShell } from "@/components/auth/auth-shell"

export default function SignUpPage() {
  return (
    <AuthShell
      title="Create your workspace"
      subtitle="Set up your account to start mapping systems, organizing projects, and collaborating inside the editor."
    >
      <SignUp
        path="/sign-up"
        routing="path"
        appearance={{
          elements: {
            card: "border border-border bg-card shadow-none",
            rootBox: "mx-auto w-full",
          },
        }}
      />
    </AuthShell>
  )
}
