// utils
import HydrationBoundaryWrapper from "@/components/shared/hydration-boundary"
import { validateRequest } from "@/lib/config/auth"
import { redirect } from "next/navigation"

export default async function AuthLayout({
  children,
}: { children: React.ReactNode }) {
  // init validate request
  const { user } = await validateRequest()

  // redirect if login
  if (user) redirect("/")

  return <HydrationBoundaryWrapper>{children}</HydrationBoundaryWrapper>
}
