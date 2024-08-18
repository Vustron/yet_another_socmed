// types
import type { IncomingMessage } from "node:http"
import type { Session, User } from "lucia"
import type { Metadata, Viewport } from "next"
import type {
  FieldValues,
  Path,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form"

/* --------------HTTP Requests Types---------------- */

/* RequestConfig Type */
export type RequestConfig<T> = {
  url: string
  params?: Record<string, string | number | boolean>
  headers?: HeadersInit
  transformResponse?: (data: unknown) => T
}

/* ErrorResponseData Type */
export interface ErrorResponseData {
  message: string
  statusCode?: number
}

/* CompatibleRequest Type */
export interface CompatibleRequest extends IncomingMessage {
  headers: Record<string, string | string[]>
}

/* SiteConfig Type */
export type SiteConfig = {
  meta: Metadata
  viewport: Viewport
}

/* FieldConfig Type */
interface FieldConfig<TFieldValues> {
  name: Path<TFieldValues>
  type: string
  label: string
  placeholder: string
  className?: string
}

/* Mutation Type */
interface Mutation {
  isPending: boolean
}

/* DynamicFormProps Type */
interface DynamicFormProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>
  onSubmit: SubmitHandler<TFieldValues>
  fields: FieldConfig<TFieldValues>[]
  submitButtonTitle: string
  mutation?: Mutation
  className?: string
  disabled?: boolean
}

/* Unique Id Type */
export type UniqueId = string

/* DatabaseUserAttributes Type */
export interface DatabaseUserAttributes {
  id: string
  username: string
  displayName: string
  avatarUrl: string | null
  googleId: string | null
}

/* SessionContextProps Type */
export interface SessionContextProps {
  user: User
  session: Session
}

/* UserButtonProps Type */
export interface UserButtonProps {
  className?: string
}

/* UserAvatarProps Type */
export interface UserAvatarProps {
  avatarUrl: string | null | undefined
  size?: number
  className?: string
}
