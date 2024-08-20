// actions
import { preFetchPosts } from "@/app/(root)/api"

// utils
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query"

const HydrationBoundaryWrapper = ({
  children,
}: {
  children: React.ReactNode
}) => {
  // init query client
  const queryClient = new QueryClient()

  // prefetched posts
  void queryClient.prefetchQuery({
    queryKey: ["posts"],
    queryFn: async () => preFetchPosts(),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  )
}

export default HydrationBoundaryWrapper
