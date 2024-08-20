// hooks
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

// actions
import { signUp } from "@/app/(auth)/sign-up/actions"

// utils
import { clientErrorHandler, sanitizer } from "@/lib/utils"
import { signUpSchema } from "@/lib/validation"
import DOMPurify from "dompurify"

// types
import type { SignUpValues } from "@/lib/validation"

// set purify dom
const purify = DOMPurify

/* --------------create account---------------- */
export const useCreateAccount = () => {
  // init router
  const router = useRouter()

  // init query client
  const queryClient = useQueryClient()

  return useMutation({
    // set mutation key
    mutationKey: ["create-account"],

    // create user function
    mutationFn: async (values: SignUpValues) => {
      // set unsanitized data
      const unsanitizedData = values

      // init sanitizer
      const sanitizedData = sanitizer<typeof signUpSchema._type>(
        unsanitizedData,
        signUpSchema,
        purify,
      )

      await signUp(sanitizedData)
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
