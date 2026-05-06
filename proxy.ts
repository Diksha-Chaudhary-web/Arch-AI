import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

import { getClerkRouteMatcher } from "@/lib/clerk"

const isPublicRoute = createRouteMatcher([
  getClerkRouteMatcher(process.env.CLERK_SIGN_IN_URL, "/sign-in"),
  getClerkRouteMatcher(process.env.CLERK_SIGN_UP_URL, "/sign-up"),
])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
