// utils
import { clsx } from "clsx"
import { formatDate, formatDistanceToNowStrict } from "date-fns"
import { NextResponse } from "next/server"
import toast from "react-hot-toast"
import { twMerge } from "tailwind-merge"
import { ZodError } from "zod"

// types
import type { ErrorResponseData, UniqueId } from "@/lib/types"
import type { ClassValue } from "clsx"
import type DOMPurify from "dompurify"
import type { NextRequest } from "next/server"
import type { z } from "zod"

/* formatRelativeDate */
export function formatNumber(n: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n)
}

/* formatRelativeDate */
export function formatRelativeDate(from: Date) {
  // init current date
  const currentDate = new Date()

  if (currentDate.getTime() - from.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(from, { addSuffix: true })
  }

  if (currentDate.getFullYear() === from.getFullYear()) {
    return formatDate(from, "MMM d")
  }

  return formatDate(from, "MMM d, yyy")
}

/* Unique Id generator */
export function createUniqueId(
  length: number = 21,
  alphabet: string = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_",
): UniqueId {
  let result = ""
  for (let i = 0; i < length; i++) {
    result += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
  }
  return result
}

/* Construct query string utility */
export function buildQueryString(
  params?: Record<string, string | number | boolean | null>,
): string {
  if (!params) return ""

  const queryParams = Object.entries(params)
    .filter(([_, value]) => value !== null && value !== undefined)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    )
    .join("&")

  return queryParams ? `?${queryParams}` : ""
}

/* client error handler */
export function clientErrorHandler(error: unknown, isToast?: "isToast") {
  // init error handler
  const { message }: ErrorResponseData = ErrorHandler.handleError(error)

  if (isToast) {
    toast.error(message)
  }
  // return error message as string
  return message
}

/* placeholder image */
export const placeholderImage = (str: string) => {
  return `https://placehold.co/400x600/EEE/31343C?font=montserrat&text=${encodeURI(
    str,
  )}`
}

/* parse json data */
export function requestBodyHandler<T>(request: NextRequest): Promise<T> {
  return request.json() as Promise<T>
}

/* check required fields */
export function checkRequiredFields<T>(
  body: T,
  requiredFields: (keyof T)[],
): NextResponse | null {
  for (const field of requiredFields) {
    if (!body[field]) {
      return NextResponse.json(
        { error: `${String(field)} is missing` },
        { status: 400 },
      )
    }
  }
  return null
}

/* response stringify parser */
export const dataSerializer = <T>(data: T): T => {
  // serialize data
  const serializedData = JSON.stringify(data).toString()
  return JSON.parse(serializedData) as T
}

/* data sanitizer */
export const sanitizer = <T>(
  data: unknown,
  schema: z.ZodObject<z.ZodRawShape>,
  purify: DOMPurify.DOMPurifyI,
): T => {
  // Sanitize each field of the object
  const sanitizeObject = (obj: unknown): unknown => {
    if (obj === null || obj === undefined) return obj

    switch (typeof obj) {
      case "string":
        return purify.sanitize(obj)
      case "object":
        if (Array.isArray(obj)) {
          return obj.map((item) => sanitizeObject(item))
        }
        return Object.keys(obj).reduce(
          (acc, key) => {
            acc[key] = sanitizeObject((obj as Record<string, unknown>)[key])
            return acc
          },
          {} as Record<string, unknown>,
        )
      default:
        return obj // leave non-string fields unchanged
    }
  }

  // Sanitize the data
  const sanitizedData = sanitizeObject(data)

  // Validate and parse the object
  const parsedData = schema.safeParse(sanitizedData)

  if (!parsedData.success) {
    throw new Error(JSON.stringify(parsedData.error.errors))
  }

  return parsedData.data as T
}

/* class name merger */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/* bytes formatter */
export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number
    sizeType?: "accurate" | "normal"
  } = {},
) {
  const { decimals = 0, sizeType = "normal" } = opts

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"]
  if (bytes === 0) return "0 Byte"
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(decimals)} ${
    sizeType === "accurate" ? accurateSizes[i] ?? "Bytes" : sizes[i] ?? "Bytes"
  }`
}

/* error class handler */
export class ErrorHandler {
  // init error handler method
  public static handleError(error: unknown): ErrorResponseData {
    // return fetch error if fetch error
    if (ErrorHandler.isFetchError(error)) {
      return ErrorHandler.handleFetchError(error)
    }

    // return zod error if zod error
    if (ErrorHandler.isZodError(error)) {
      return ErrorHandler.handleZodError(error)
    }

    // return generic if generic error
    if (error instanceof Error) {
      return ErrorHandler.handleGenericError(error)
    }

    // return unknown error if unknown error
    return ErrorHandler.handleUnknownError(error)
  }

  // init fetch error identifier method
  private static isFetchError(
    error: unknown,
  ): error is { status: number; error: string } {
    return (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      "error" in error
    )
  }

  // init zod error identifier method
  private static isZodError(error: unknown): error is ZodError {
    return error instanceof ZodError
  }

  // init fetch error handler method
  private static handleFetchError(error: {
    status: number
    error: string
  }): ErrorResponseData {
    return {
      message: error.error || "A network error occurred.",
      statusCode: error.status || 500,
    }
  }

  // init zod error handler method
  private static handleZodError(error: ZodError): ErrorResponseData {
    // init message
    const message = error.errors.map((e) => e.message).join(", ")
    return {
      message: `Validation error: ${message}`,
      statusCode: 400,
    }
  }

  // init generic error handler method
  private static handleGenericError(error: Error): ErrorResponseData {
    return {
      message: error.message || "An unexpected error occurred.",
      statusCode: 500,
    }
  }

  // init unknown error handler method
  private static handleUnknownError(error: unknown): ErrorResponseData {
    return {
      message: typeof error === "string" ? error : "An unknown error occurred.",
      statusCode: 500,
    }
  }
}
