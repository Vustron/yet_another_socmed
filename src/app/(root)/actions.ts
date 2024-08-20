"use server"

// configs
import prisma from "@/lib/config/prisma"

// actions
import { validateRequest } from "@/lib/config/auth"

// schema
import { createPostSchema } from "@/lib/validation"

// types
import { postDataInclude } from "@/lib/constants"
import type { createPostValues } from "@/lib/validation"

/* create post */
export async function createPost(input: createPostValues) {
  // request validation
  const { user } = await validateRequest()

  if (!user) throw Error("Unauthorized")

  const { content } = createPostSchema.parse(input)

  await prisma.post.create({
    data: {
      content,
      userId: user.id,
    },
  })
}

/* get posts */
export async function getPosts() {
  return await prisma.post.findMany({
    include: postDataInclude,
    orderBy: {
      createdAt: "desc",
    },
  })
}
