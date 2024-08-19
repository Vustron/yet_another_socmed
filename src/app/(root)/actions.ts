"use server"

// configs
import prisma from "@/lib/config/prisma"

// actions
import { validateRequest } from "@/lib/config/auth"

// schema
import { createPostSchema } from "@/lib/validation"

export async function submitPost(input: string) {
  // request validation
  const { user } = await validateRequest()

  if (!user) throw Error("Unauthorized")

  const { content } = createPostSchema.parse({ content: input })

  await prisma.post.create({
    data: {
      content,
      userId: user.id,
    },
  })
}
