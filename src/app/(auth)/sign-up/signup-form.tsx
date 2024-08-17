"use client"

// components
import DynamicForm from "@/components/shared/dynamic-form"

// utils
import { signUpFields } from "@/lib/misc/field-configs"
import { clientErrorHandler } from "@/lib/utils"
import { signUpSchema } from "@/lib/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"

// hooks
import { useCreateAccount } from "@/app/(auth)/api"
import { useForm } from "react-hook-form"

// types
import type { SignUpValues } from "@/lib/validation"

const SignupForm = () => {
  // init mutation
  const signUpMutation = useCreateAccount()

  // init form
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  })

  // submit handler
  const submitHandler = async (values: SignUpValues) => {
    await toast.promise(signUpMutation.mutateAsync(values), {
      loading: <span className="animate-pulse">Creating user...</span>,
      success: "User created.",
      error: (error: unknown) => clientErrorHandler(error),
    })

    form.reset()
  }

  return (
    <DynamicForm<SignUpValues>
      form={form}
      onSubmit={submitHandler}
      fields={signUpFields}
      submitButtonTitle="Register"
      mutation={signUpMutation}
    />
  )
}

export default SignupForm
