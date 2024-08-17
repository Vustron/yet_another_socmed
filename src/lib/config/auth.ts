// utils
import { PrismaAdapter } from "@lucia-auth/adapter-prisma"
import { cookies } from "next/headers"
import { cache } from "react"

// configs
import prisma from "@/lib/config/prisma"
import { Lucia } from "lucia"

// types
import type { DatabaseUserAttributes } from "@/lib/types/index"
import type { Session, User } from "lucia"

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}

// init adapter
const adapter = new PrismaAdapter(prisma.session, prisma.user)

// init lucia adapter
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes(databaseUserAttributes) {
    return {
      id: databaseUserAttributes.id,
      username: databaseUserAttributes.username,
      displayName: databaseUserAttributes.displayName,
      avatarUrl: databaseUserAttributes.avatarUrl,
      googleId: databaseUserAttributes.googleId,
    }
  },
})

// validate request function
export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    // get session id
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null

    if (!sessionId) {
      return {
        user: null,
        session: null,
      }
    }

    const result = await lucia.validateSession(sessionId)

    try {
      if (result.session?.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id)
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        )
      }

      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie()
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        )
      }
    } catch {}

    return result
  },
)
