"use client"

// components
import PostLoadingSkeleton from "@/app/(root)/_components/loading-skeleton"
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

  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        No one has posted anything yet.
      </p>
    )
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading posts:{" "}
      </p>
    )
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {status === "pending" ? (
        <PostLoadingSkeleton />
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
