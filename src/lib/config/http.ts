// utils
import { env } from "@/lib/config/env.mjs"
import { buildQueryString, clientErrorHandler } from "@/lib/utils"
import ky from "ky"

// types
import type { Options as KyOptions } from "ky"

// Updated RequestConfig type
export type RequestConfig<RequestType = any, ResponseType = any> = {
  url?: string
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  params?: Record<string, string | number | boolean | null>
  headers?: HeadersInit
  body?: RequestType
  transformResponse?: (data: unknown) => ResponseType
  customURL?: string
}

// http request method
export async function httpRequest<RequestType = any, ResponseType = any>({
  url,
  method,
  params,
  headers = {},
  body,
  transformResponse,
  customURL,
}: RequestConfig<RequestType, ResponseType>): Promise<ResponseType> {
  try {
    // init ky
    const kyInstance = ky.create({
      hooks: {
        beforeRequest: [
          (request) => {
            request.headers.set("Content-Type", "application/json")
          },
        ],
        afterResponse: [
          (_request, _options, response) => {
            if (!response.ok) {
              throw response
            }
          },
        ],
      },
      parseJson: (text) => {
        return JSON.parse(text, (key, value) => {
          if (key.endsWith("At") && typeof value === "string") {
            return new Date(value)
          }
          return value
        })
      },
    })

    // Full URL with query string
    const fullUrl = `${env.NEXT_PUBLIC_APP_URL}/api/v1/${url}${buildQueryString(params)}`

    // Use customURL if provided, otherwise use fullUrl
    const requestUrl = customURL || fullUrl

    // Prepare request options
    const requestOptions: KyOptions = {
      method,
      headers,
      cache: "no-store",
    }

    // Add body for non-GET requests
    if (method !== "GET" && body) {
      requestOptions.json = body
    }

    // Perform request using ky
    const response = await kyInstance(
      requestUrl,
      requestOptions,
    ).json<ResponseType>()

    // Transform response data if transformer is provided
    const transformedData: ResponseType = transformResponse
      ? transformResponse(response)
      : response

    return transformedData
  } catch (error: unknown) {
    if (error instanceof Response) {
      const errorData = await error.json()
      return Promise.reject({ status: error.status, ...errorData })
    }
    return Promise.reject(clientErrorHandler(error))
  }
}
