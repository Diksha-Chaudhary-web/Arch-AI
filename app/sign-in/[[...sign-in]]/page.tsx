import { SignIn } from "@clerk/nextjs"

import { AuthShell } from "@/components/auth/auth-shell"

export default function SignInPage() {
  return (
    <AuthShell
      title="Sign in to continue"
      subtitle="Access your architecture workspace, project sidebar, and collaborative editor from one secure entry point."
    >
      <SignIn
        path="/sign-in"
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
