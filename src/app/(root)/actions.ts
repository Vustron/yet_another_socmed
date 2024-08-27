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

  const newPost = await prisma.post.create({
    data: {
      content,
      userId: user.id,
    },
    include: postDataInclude,
  })

  return newPost
}

/* get posts */
export async function getPosts() {
  // request validation
  const { user } = await validateRequest()

  if (!user) throw Error("Unauthorized")

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
  // request validation
  const { user } = await validateRequest()

  if (!user) throw Error("Unauthorized")

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
  pageParam?: string | number | boolean,
): Promise<PostsPage> {
  // request validation
  const { user } = await validateRequest()

  if (!user) throw Error("Unauthorized")

  // set url
  const URL = "posts/for-you"

  // init http get method to get posts feed for you
  const data: PostsPage = await httpRequest({
    url: URL,
    method: "GET",
    params: {
      cursor: pageParam!,
    },
  })

  return data
}

/* deletePost */
export async function deletePost(id: string) {
  // request validation
  const { user } = await validateRequest()

  if (!user) throw new Error("Unauthorized")

  // set url
  const URL = "posts/delete"

  const deletePost = await httpRequest({
    url: URL,
    method: "DELETE",
    params: {
      id,
      userId: user.id,
    },
  })
  return deletePost
}
