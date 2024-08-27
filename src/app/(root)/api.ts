"use client"

// hooks
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"

// hooks
import { useRouter } from "next-nprogress-bar"
import { usePathname } from "next/navigation"

// actions
import {
  createPost,
  deletePost,
  getForYouFeed,
  getPosts,
} from "@/app/(root)/actions"

// utils
// import { httpRequest } from "@/lib/config/http"
import { clientErrorHandler, sanitizer } from "@/lib/utils"
import { createPostSchema } from "@/lib/validation"
import { queryOptions } from "@tanstack/react-query"
import DOMPurify from "dompurify"

// types
import type { PostsPage } from "@/lib/types/prisma-types"
import type { createPostValues } from "@/lib/validation"
import type { InfiniteData, QueryFilters } from "@tanstack/react-query"

// set purify dom
const purify = DOMPurify

/* --------------create post---------------- */
export const useCreatePost = () => {
  // init router
  const router = useRouter()

  // init query client
  const queryClient = useQueryClient()

  return useMutation({
    // set mutation key
    mutationKey: ["create-post"],

    // create user function
    mutationFn: async (values: createPostValues) => {
      // set unsanitized data
      const unsanitizedData = values

      // init sanitizer
      const sanitizedData = sanitizer<createPostValues>(
        unsanitizedData,
        createPostSchema,
        purify,
      )

      return await createPost(sanitizedData)
    },

    onSuccess: async (newPost) => {
      const queryFilter: QueryFilters = {
        queryKey: ["post-feed", "for-you"],
      }

      await queryClient.cancelQueries(queryFilter)

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          const firstPage = oldData?.pages[0]

          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  posts: [newPost, ...firstPage.posts],
                  nextCursor: firstPage.nextCursor,
                },
                ...oldData.pages.slice(1),
              ],
            }
          }
        },
      )
    },

    // on success redirect to verification page
    onSettled: () => {
      // // Always refetch after error or success:
      // void queryClient.invalidateQueries({ queryKey: ["posts"] })

      // // Always refetch after error or success:
      // void queryClient.invalidateQueries({ queryKey: ["post-feed", "for-you"] })

      router.refresh()
    },

    // handler error
    onError: (error) => clientErrorHandler(error),
  })
}

/* --------------get post ---------------- */
export const useGetPosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(),
  })
}

/* --------------prefetch post ---------------- */
export async function preFetchPosts() {
  // init prefetch query
  return queryOptions({
    queryKey: ["posts"],
    queryFn: () => getPosts(),
  })
}

/* --------------get for you feed---------------- */
export const useGetForYouFeed = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "for-you"],
    queryFn: ({ pageParam }) => getForYouFeed(pageParam),
    initialPageParam: null as unknown as string,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  }
}

/* --------------prefetch get for you feed ---------------- */
export async function preFetchGetForYouFeed() {
  // init prefetch query
  return queryOptions({
    queryKey: ["post-feed", "for-you"],
    queryFn: () => getForYouFeed(),
  })
}

/* -------------- delete post ---------------- */
export const useDeletePost = (id: string) => {
  const router = useRouter()
  const pathName = usePathname()

  // init query client
  const queryClient = useQueryClient()

  return useMutation({
    // set mutation key
    mutationKey: ["delete-post", id],

    // delete user function
    mutationFn: async () => {
      return await deletePost(id)
    },

    // error handler
    onError: (error) => clientErrorHandler(error),

    onSuccess: async (deletePost) => {
      const queryFilters: QueryFilters = {
        queryKey: ["post-feed"],
      }

      await queryClient.cancelQueries(queryFilters)
      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilters,
        (oldData) => {
          if (!oldData) return

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.filter((p) => p.id !== deletePost.id),
            })),
          }
        },
      )
    },

    // on success redirect to verification page
    onSettled: (deletePost) => {
      if (pathName === `/posts/${deletePost.id}`) {
        router.push(`/users/${deletePost.user.username}`)
      }
      router.refresh()
    },
  })
}
