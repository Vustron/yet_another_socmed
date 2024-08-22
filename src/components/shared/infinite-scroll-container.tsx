"use client"

// hooks
import { useInView } from "react-intersection-observer"

// types
import type { InfiniteScrollContainerProps } from "@/lib/types"

const InfiniteScrollContainer = ({
  children,
  onBottomReached,
  className,
}: InfiniteScrollContainerProps) => {
  // init in view
  const { ref } = useInView({
    rootMargin: "200px",
    onChange(inView) {
      if (inView) {
        onBottomReached()
      }
    },
  })

  return (
    <div className={className}>
      {children}
      <div ref={ref} />
    </div>
  )
}

export default InfiniteScrollContainer
