"use client"

// components
import Posts from "@/app/(root)/_components/posts"
import { Loader2 } from "lucide-react"

// hooks
import { useGetForYouFeed } from "@/app/(root)/api"

const ForYouFeed = () => {
  // get post feed for you
  const { data, isLoading, error, status } = useGetForYouFeed()

  return (
    <>
      {isLoading ? (
        <Loader2 className="mx-auto animate-spin" />
      ) : status === "error" ? (
        <span className="text-center text-destructive">
          An error occurred while loading posts:{" "}
          {error?.message || "Unknown error"}
        </span>
      ) : status === "success" && data ? (
        <>
          {data.map((post) => (
            <Posts key={post.id} post={post} />
          ))}
        </>
      ) : null}
    </>
  )
}

export default ForYouFeed
