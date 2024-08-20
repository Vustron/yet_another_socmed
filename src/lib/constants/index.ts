// types
import type { Prisma } from "@prisma/client"

/* --------------Data Types---------------- */

/* postDataInclude Type */
export const postDataInclude = {
  user: {
    select: {
      username: true,
      displayName: true,
      avatarUrl: true,
    },
  },
} satisfies Prisma.PostInclude

/* PostData Type */
export type PostData = Prisma.PostGetPayload<{
  include: typeof postDataInclude
}>
