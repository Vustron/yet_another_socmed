// components
import Navbar from "@/components/layouts/navbar"
import SessionProvider from "@/components/providers/session"
import HydrationBoundaryWrapper from "@/components/shared/hydration-boundary"

// utils
import { validateRequest } from "@/lib/config/auth"
import { redirect } from "next/navigation"

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // init validate request
  const session = await validateRequest()

  // redirect if login
  if (!session.user) redirect("/login")

  return (
    <SessionProvider value={session}>
      <HydrationBoundaryWrapper>
        <div className="flex min-h-screen flex-col">
          {/* navbar */}
          <Navbar />
          <div className="max-w-7xl p-5 mx-auto">{children}</div>
        </div>
      </HydrationBoundaryWrapper>
    </SessionProvider>
  )
}
