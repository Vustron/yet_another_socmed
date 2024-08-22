// hooks
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

// actions
import { createPost, getForYouFeed, getPosts } from "@/app/(root)/actions"

// utils
// import { httpRequest } from "@/lib/config/http"
import { clientErrorHandler } from "@/lib/utils"
import { queryOptions } from "@tanstack/react-query"
// import { createPostSchema } from "@/lib/validation"
// import DOMPurify from "dompurify"

// types
import type { PostData } from "@/lib/constants"
import type { createPostValues } from "@/lib/validation"

// set purify dom
// const purify = DOMPurify

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
      // const unsanitizedData = values

      // // init sanitizer
      // const sanitizedData = sanitizer<typeof createPostSchema._type>(
      //   unsanitizedData,
      //   createPostSchema,
      //   purify,
      // )

      await createPost(values)
    },

    // on success redirect to verification page
    onSettled: () => {
      // Always refetch after error or success:
      void queryClient.invalidateQueries({ queryKey: ["accounts"] })

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
  return useQuery<PostData[]>({
    queryKey: ["post-feed", "for-you"],
    queryFn: () => getForYouFeed(),
  })
}

/* --------------prefetch get for you feed ---------------- */
export async function preFetchGetForYouFeed() {
  // init prefetch query
  return queryOptions({
    queryKey: ["post-feed", "for-you"],
    queryFn: () => getForYouFeed(),
  })
}
