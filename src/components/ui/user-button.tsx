"use client"

// components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import UserAvatar from "@/components/ui/user-avatar"
import { Check, LogOutIcon, Monitor, Moon, Sun, UserIcon } from "lucide-react"

// hooks
import { useSession } from "@/components/providers/session"
import { useQueryClient } from "@tanstack/react-query"
import { useTheme } from "next-themes"

// actions
import { logout } from "@/app/(auth)/sign-up/actions"

// utils
import { clientErrorHandler, cn } from "@/lib/utils"
import Link from "next/link"
import toast from "react-hot-toast"

// types
import type { UserButtonProps } from "@/lib/types"

const UserButton = ({ className }: UserButtonProps) => {
  // get session
  const { user } = useSession()

  // theme state
  const { setTheme, theme } = useTheme()

  // get query client
  const queryClient = useQueryClient()

  // logout handler
  const handleLogout = async () => {
    queryClient.clear()
    await toast.promise(logout(), {
      loading: <span className="animate-pulse">Logging out...</span>,
      success: "Logout successful",
      error: (error: unknown) => clientErrorHandler(error),
    })
  }

  return (
    <DropdownMenu>
      {/* trigger */}
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn("flex-none rounded-full", className)}
        >
          <UserAvatar avatarUrl={user.avatarUrl} size={40} />
        </button>
      </DropdownMenuTrigger>
      {/* content */}
      <DropdownMenuContent>
        {/* current session */}
        <DropdownMenuLabel>Logged in as @{user.username}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* profile */}
        <Link href={`/users/${user.username}`} prefetch={false}>
          <DropdownMenuItem>
            <UserIcon className="mr-2 size-4" />
            Profile
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSub>
          {/* theme */}
          <DropdownMenuSubTrigger>
            <Monitor className="mr-2 size-4" />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="mr-2 size-4" />
                System
                {theme === "system" && <Check className="ms-2 size-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="w-[1.2rem] h-[1.2rem] rotate-90 scale-100   transition-transform ease-in-out duration-500 dark:rotate-0 dark:scale-100 mr-2" />
                Light
                {theme === "light" && <Check className="ms-2 size-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon
                  className="w-[1.2rem] h-[1.2rem] rotate-0 scale-100   transition-transform ease-in-out duration-500 dark:rotate-0 dark:scale-100 mr-2 size-4"
                  size-4
                />
                Dark
                {theme === "dark" && <Check className="ms-2 size-4" />}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator />
        {/* logout */}
        <DropdownMenuItem onClick={handleLogout}>
          <LogOutIcon className="mr-2 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserButton
