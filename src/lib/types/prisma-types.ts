// types
import type { Prisma } from "@prisma/client"

/* --------------Data Types---------------- */

/* userDataSelect Type */
export const userDataSelect = {
  id: true,
  username: true,
  displayName: true,
  avatarUrl: true,
} satisfies Prisma.UserSelect

/* postDataInclude Type */
export const postDataInclude = {
  user: {
    select: userDataSelect,
  },
} satisfies Prisma.PostInclude

/* PostData Type */
export type PostData = Prisma.PostGetPayload<{
  include: typeof postDataInclude
}>

/* PostsPage Type */
export interface PostsPage {
  posts: PostData[]
  nextCursor: string | null | undefined
}
