"use client"

import PostEditor from "@/app/(root)/_components/post-editor"

export default function RootPage() {
  return (
    <main className="h-[200vh] w-full bg-red-50">
      <div className="w-full">
        <PostEditor />
      </div>
    </main>
  )
}
