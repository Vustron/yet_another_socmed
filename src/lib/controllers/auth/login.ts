// utils
import { handleErrorResponse } from "@/lib/api-helpers"
import { checkRequiredFields, requestBodyHandler } from "@/lib/utils"
import { verify } from "@node-rs/argon2"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// configs
import { lucia } from "@/lib/config/auth"
import prisma from "@/lib/config/prisma"

// types
import type { LoginValues } from "@/lib/validation"
import type { NextRequest } from "next/server"

// login handler
export async function loginController(request: NextRequest) {
  try {
    const loginBody = await requestBodyHandler<LoginValues>(request)

    // set parsed data
    const { username, password } = loginBody

    // throw error if any required fields are missing
    const requiredFields: (keyof typeof loginBody)[] = ["username", "password"]

    // check if the required fields are there on the request
    const errorResponse = checkRequiredFields(loginBody, requiredFields)

    if (errorResponse)
      // throw error
      return errorResponse

    // check existing user
    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    })

    // throw error if user not found or password is incorrect
    if (!existingUser || !existingUser.passwordHash) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 },
      )
    }

    const validPassword = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    })

    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 },
      )
    }

    const session = await lucia.createSession(existingUser.id, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    )

    return NextResponse.json({ message: "Login success" }, { status: 200 })
  } catch (error) {
    return handleErrorResponse(error)
  }
}
