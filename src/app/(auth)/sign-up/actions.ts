"use server"

// configs
import { lucia, validateRequest } from "@/lib/config/auth"
import { httpRequest } from "@/lib/config/http"

// utils
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// types
import type { SignUpValues } from "@/lib/validation"

/* logout */
export async function logout() {
  // validate request
  const { session } = await validateRequest()

  if (!session) {
    throw new Error("Unauthorized")
  }

  await lucia.invalidateSession(session.id)

  const sessionCookie = lucia.createBlankSessionCookie()

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  )

  return redirect("/login")
}

/* signup */
export async function signUp(credentials: SignUpValues) {
  // set url
  const URL = "auth/register-account"

  // init http post method
  const response = await httpRequest<SignUpValues>({
    url: URL,
    method: "POST",
    body: credentials,
  })

  const { userId } = response

  if (!userId) {
    throw new Error("User registration failed")
  }

  // Create session for the new user
  const session = await lucia.createSession(userId, {})

  // Set session cookie
  const sessionCookie = lucia.createSessionCookie(session.id)
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  )

  return redirect("/")
}
