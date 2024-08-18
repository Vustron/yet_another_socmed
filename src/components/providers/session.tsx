"use client"

// utils
import { createContext } from "react"

// hooks
import { useContext } from "react"

// types
import type { SessionContextProps } from "@/lib/types"

// init session context
const SessionContext = createContext<SessionContextProps | null>(null)

// session provider
const SessionProvider = ({
  children,
  value,
}: React.PropsWithChildren<{ value: SessionContextProps }>) => {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  )
}

export default SessionProvider

// useSession function
export function useSession() {
  // init context
  const context = useContext(SessionContext)

  if (!context) {
    throw new Error("useSession must be used within a SessionProvider")
  }

  return context
}
