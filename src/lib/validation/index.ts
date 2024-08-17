// utils
import { z } from "zod"

// required string method
const requiredString = z.string().trim().min(1, "Required")

export const signUpSchema = z.object({
  email: requiredString.email("Invalid email address"),
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only letters, numbers, - and _ are allowed",
  ),
  password: requiredString.min(8, "Must be at least 8 characters"),
})
/* SignUpValues Type */
export type SignUpValues = z.infer<typeof signUpSchema>

export const loginSchema = z.object({
  username: requiredString,
  password: requiredString,
})
/* loginSchema Type */
export type LoginValues = z.infer<typeof loginSchema>