"use client"

import { useSession } from "@/components/providers/session"

export default function RootPage() {
  const { user } = useSession()
  return (
    <main>
      {user.username}
      <br /> FrontPage
    </main>
  )
}
