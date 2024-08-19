// components
import { Button } from "@/components/ui/button"
import { BellIcon, BookmarkIcon, HomeIcon, MailIcon } from "lucide-react"

// utils
import Link from "next/link"

// types
import type { MenuBarProps } from "@/lib/types"

const MenuBar = ({ className }: MenuBarProps) => {
  return (
    <div className={className}>
      <Button
        variant="ghost"
        title="Home"
        asChild
        className="flex items-center justify-start gap-3"
      >
        <Link href="/">
          <HomeIcon />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>

      <Button
        variant="ghost"
        title="Notification"
        asChild
        className="flex items-center justify-start gap-3"
      >
        <Link href="/notification">
          <BellIcon />
          <span className="hidden lg:inline">Notifications</span>
        </Link>
      </Button>

      <Button
        variant="ghost"
        title="Messages"
        asChild
        className="flex items-center justify-start gap-3"
      >
        <Link href="/messages">
          <MailIcon />
          <span className="hidden lg:inline">Messages</span>
        </Link>
      </Button>

      <Button
        variant="ghost"
        title="Bookmarks"
        asChild
        className="flex items-center justify-start gap-3"
      >
        <Link href="/bookmarks">
          <BookmarkIcon />
          <span className="hidden lg:inline">Bookmarks</span>
        </Link>
      </Button>
    </div>
  )
}

export default MenuBar
