// hooks
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

// actions
import { login } from "@/app/(auth)/login/actions"

// utils
import { clientErrorHandler, sanitizer } from "@/lib/utils"
import { loginSchema } from "@/lib/validation"
import DOMPurify from "dompurify"

// types
import type { LoginValues } from "@/lib/validation"

// set purify dom
const purify = DOMPurify

/* --------------login account---------------- */
export const useLoginAccount = () => {
  // init router
  const router = useRouter()

  return useMutation({
    // set mutation key
    mutationKey: ["login-account"],

    // create user function
    mutationFn: async (values: LoginValues) => {
      // set unsanitized data
      const unsanitizedData = values

      // init sanitizer
      const sanitizedData = sanitizer<typeof loginSchema._type>(
        unsanitizedData,
        loginSchema,
        purify,
      )

      await login(sanitizedData)
    },

    // on success redirect to verification page
    onSettled: () => {
      router.refresh()
    },

    // handler error
    onError: (error) => clientErrorHandler(error),
  })
}
