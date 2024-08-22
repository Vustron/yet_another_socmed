// utils
import { handleErrorResponse } from "@/lib/api-helpers"
import { postDataInclude } from "@/lib/constants"
import { NextResponse } from "next/server"

// configs
import prisma from "@/lib/config/prisma"

// get postsForYou handler
export async function postsForYouController() {
  try {
    const posts = await prisma.post.findMany({
      include: postDataInclude,
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(posts, { status: 200 })
  } catch (error) {
    return handleErrorResponse(error)
  }
}
