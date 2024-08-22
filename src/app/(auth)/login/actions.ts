// configs
import { httpRequest } from "@/lib/config/http"

// types
import type { LoginValues } from "@/lib/validation"

/* login */
export async function login(credentials: LoginValues) {
  // set url
  const URL = "auth/login-account"

  // init http post method
  await httpRequest<LoginValues>({
    url: URL,
    method: "POST",
    body: credentials,
  })
}
