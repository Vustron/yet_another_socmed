// components
import ForYouFeed from "@/app/(root)/_components/for-you-feed"
import PostEditor from "@/app/(root)/_components/post-editor"
import TrendsSidebar from "@/app/(root)/_components/trends"

export default function RootPage() {
  return (
    <main className="w-full min-w-0 flex gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <ForYouFeed />
      </div>
      <TrendsSidebar />
    </main>
  )
}
