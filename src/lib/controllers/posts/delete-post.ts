// utils
import { handleErrorResponse } from "@/lib/api-helpers"
import { NextResponse } from "next/server"

// configs
import prisma from "@/lib/config/prisma"

// types
import { postDataInclude } from "@/lib/types/prisma-types"
import type { NextRequest } from "next/server"

// delete post handler
export async function deletePostController(request: NextRequest) {
  try {
    // init search params
    const { searchParams } = new URL(request.url)

    // init get account id
    const id = searchParams.get("id")

    // init get userId
    const userId = searchParams.get("userId")

    if (!id) {
      // throw error if no id provided
      return NextResponse.json({ error: "No ID provided" }, { status: 400 })
    }

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    })

    if (!post) {
      // throw error if no id provided
      return NextResponse.json({ error: "Post not found" }, { status: 400 })
    }

    if (post.userId !== userId) {
      // throw error if no id provided
      return NextResponse.json({ error: "Unauthorized" }, { status: 400 })
    }

    const deletePost = await prisma.post.delete({
      where: {
        id,
      },
      include: postDataInclude,
    })

    return NextResponse.json(deletePost, { status: 200 })
  } catch (error) {
    return handleErrorResponse(error)
  }
}
