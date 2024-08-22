"use client"

// components
import Posts from "@/app/(root)/_components/posts"
import InfiniteScrollContainer from "@/components/shared/infinite-scroll-container"
import { Loader2 } from "lucide-react"

// hooks
import { useGetForYouFeed } from "@/app/(root)/api"

const ForYouFeed = () => {
  // get post feed for you
  const {
    data,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    status,
  } = useGetForYouFeed()

  const posts = data?.pages.flatMap((page) => page.posts) || []

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {status === "pending" ? (
        <Loader2 className="mx-auto animate-spin" />
      ) : status === "error" ? (
        <span className="text-center text-destructive">
          An error occurred while loading posts:{" "}
        </span>
      ) : status === "success" && data ? (
        <>
          {posts.map((post) => (
            <Posts key={post.id} post={post} />
          ))}

          {isFetchingNextPage && <Loader2 className="mx-auto animate-spin" />}
        </>
      ) : null}
    </InfiniteScrollContainer>
  )
}

export default ForYouFeed
