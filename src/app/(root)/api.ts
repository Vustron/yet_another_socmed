// hooks
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

// actions
import { submitPost } from "@/app/(root)/actions"

// utils
import { clientErrorHandler, sanitizer } from "@/lib/utils"
import { createPostSchema } from "@/lib/validation"
import DOMPurify from "dompurify"

// types
import type { createPostValues } from "@/lib/validation"

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
      const sanitizedData = sanitizer<typeof createPostSchema._type>(
        unsanitizedData,
        createPostSchema,
        purify,
      )

      await submitPost(sanitizedData)
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
