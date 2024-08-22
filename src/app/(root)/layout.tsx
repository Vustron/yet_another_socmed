// components
import Navbar from "@/components/layouts/navbar"
import SessionProvider from "@/components/providers/session"
import HydrationBoundaryWrapper from "@/components/shared/hydration-boundary"
import MenuBar from "@/components/ui/menu-bar"

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
          <div className="max-w-7xl p-5 mx-auto flex w-full grow gap-5">
            <MenuBar className="sticky top-[5.25rem] h-fit hidden sm:block flex-none space-y-3 rounded-2xl bg-card px-3 py-5 lg:px-5 shadow-sm xl:w-80" />
            {children}
          </div>
          <MenuBar className="sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 sm:hidden" />
        </div>
      </HydrationBoundaryWrapper>
    </SessionProvider>
  )
}
