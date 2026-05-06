
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { getClerkPath } from "@/lib/clerk"

export default async function Home() {
  const { userId } = await auth()

  if (userId) {
    redirect("/editor")
  }

  redirect(getClerkPath(process.env.CLERK_SIGN_IN_URL, "/sign-in"))
}
