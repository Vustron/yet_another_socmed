// utils
import { handleErrorResponse } from "@/lib/api-helpers"
import { checkRequiredFields, requestBodyHandler } from "@/lib/utils"
import { hash } from "@node-rs/argon2"
import { generateIdFromEntropySize } from "lucia"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// configs
import { lucia } from "@/lib/config/auth"
import prisma from "@/lib/config/prisma"

// types
import type { SignUpValues } from "@/lib/validation"
import type { NextRequest } from "next/server"

// register handler
export async function registerController(request: NextRequest) {
  try {
    const registerBody = await requestBodyHandler<SignUpValues>(request)

    // set parsed data
    const { username, email, password } = registerBody

    // throw error if any required fields are missing
    const requiredFields: (keyof typeof registerBody)[] = [
      "username",
      "email",
      "password",
    ]

    // check if the required fields are there on the request
    const errorResponse = checkRequiredFields(registerBody, requiredFields)

    if (errorResponse)
      // throw error
      return errorResponse

    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    })

    const userId = generateIdFromEntropySize(10)

    const existingUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    })

    // throw error if user not found or password is incorrect
    if (existingUsername) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 },
      )
    }

    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    })

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already taken" },
        { status: 400 },
      )
    }

    await prisma.user.create({
      data: {
        id: userId,
        username,
        displayName: username,
        email,
        passwordHash,
      },
    })

    const session = await lucia.createSession(userId, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    )

    return NextResponse.json({ userId }, { status: 200 })
  } catch (error) {
    return handleErrorResponse(error)
  }
}
