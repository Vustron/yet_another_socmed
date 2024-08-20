// components
import PostEditor from "@/app/(root)/_components/post-editor"
import Posts from "@/app/(root)/_components/posts"

import TrendsSidebar from "@/app/(root)/_components/trends"
// actions
import { getPosts } from "@/app/(root)/actions"

export default async function RootPage() {
  // get posts
  const posts = await getPosts()

  return (
    <main className="w-full min-w-0 flex gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        {posts?.map((post) => (
          <Posts key={post.id} post={post} />
        ))}
      </div>
      <TrendsSidebar />
    </main>
  )
}
