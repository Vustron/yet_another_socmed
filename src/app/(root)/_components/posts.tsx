// utils
import UserAvatar from "@/components/ui/user-avatar"
import Link from "next/link"

// types
import type { PostData } from "@/lib/types/prisma-types"
import { formatRelativeDate } from "@/lib/utils"

interface PostsProps {
  post: PostData
}

const Posts = ({ post }: PostsProps) => {
  return (
    <article className="space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          {/* avatar */}
          <Link href={`/users/${post.user.username}`}>
            <UserAvatar avatarUrl={post.user.avatarUrl} />
          </Link>
          <div>
            {/* display name */}
            <Link
              href={`/users/${post.user.username}`}
              className="block font-medium hover:underline"
            >
              {post.user.displayName}
            </Link>

            {/* timestamp */}
            <Link
              href={`/posts/${post.id}`}
              className="block text-sm text-muted-foreground hover:underline"
            >
              {formatRelativeDate(post.createdAt)}
            </Link>
          </div>
        </div>
      </div>
      <div className="whitespace-pre-line break-words">{post.content}</div>
    </article>
  )
}

export default Posts
