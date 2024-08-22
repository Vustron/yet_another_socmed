"use server"

// configs
import { httpRequest } from "@/lib/config/http"
import prisma from "@/lib/config/prisma"

// actions
import { validateRequest } from "@/lib/config/auth"

// utils
import { unstable_cache } from "next/cache"

// validation
import { createPostSchema } from "@/lib/validation"

// types
import {
  type PostsPage,
  postDataInclude,
  userDataSelect,
} from "@/lib/types/prisma-types"
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

/* get posts */
export async function whoToFollow() {
  // request validation
  const { user } = await validateRequest()

  if (!user) return null

  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: user.id,
      },
    },
    select: userDataSelect,
    take: 5,
  })

  return usersToFollow
}

/* getTrendingTopics */
export async function getTrendingTopics() {
  // init get topics
  const trendingTopics = unstable_cache(
    async () => {
      const result = await prisma.$queryRaw<
        { hashtag: string; count: bigint }[]
      >`
         SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
            FROM posts
            GROUP BY (hashtag)
            ORDER BY count DESC, hashtag ASC
            LIMIT 5
      `

      return result.map((row) => ({
        hashtag: row.hashtag,
        count: Number(row.count),
      }))
    },
    ["trending_topics"],
    {
      revalidate: 3 * 60 * 60,
    },
  )

  return await trendingTopics()
}

/* getForYoufeed */
export async function getForYouFeed(
  pageParam: string | null,
): Promise<PostsPage> {
  // set url
  const URL = "posts/for-you"

  // init http get method to get posts feed for you
  const data: PostsPage = await httpRequest({
    url: URL,
    method: "GET",
    params: {
      cursor: pageParam,
    },
  })

  return data
}
