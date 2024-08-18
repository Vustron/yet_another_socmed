"use client"

// utils
import { AppProgressBar as ProgressBar } from "next-nprogress-bar"

export default function ProgressBarProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ProgressBar
        height="4px"
        color="#00fe02"
        options={{ showSpinner: false }}
        shallowRouting
      />
      {children}
    </>
  )
}
