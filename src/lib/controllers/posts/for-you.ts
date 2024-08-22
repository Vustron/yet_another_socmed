// utils
import { handleErrorResponse } from "@/lib/api-helpers"
import { postDataInclude } from "@/lib/types/prisma-types"
import { NextResponse } from "next/server"

// configs
import prisma from "@/lib/config/prisma"

// types
import type { PostsPage } from "@/lib/types/prisma-types"
import type { NextRequest } from "next/server"

// get postsForYou handler
export async function postsForYouController(request: NextRequest) {
  try {
    // get cursor
    const cursor = request.nextUrl.searchParams.get("cursor") || undefined

    // init pagesize
    const pageSize = 10

    const posts = await prisma.post.findMany({
      include: postDataInclude,
      orderBy: {
        createdAt: "desc",
      },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    })

    // init next cursor
    const nextCursor = posts.length > pageSize ? posts[pageSize]?.id : null

    // init batched posts data
    const data: PostsPage = {
      posts: posts.slice(0, pageSize),
      nextCursor,
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return handleErrorResponse(error)
  }
}
