// assets
import avatarPlaceholder from "@/assets/images/avatar-placeholder.png"

// utils
import { cn } from "@/lib/utils"
import Image from "next/image"

// types
import type { UserAvatarProps } from "@/lib/types"

const UserAvatar = ({ avatarUrl, size, className }: UserAvatarProps) => {
  return (
    <Image
      src={avatarUrl || avatarPlaceholder}
      alt="User avatar"
      width={size ?? 48}
      height={size ?? 48}
      className={cn(
        "aspect-square h-fit flex-none rounded-full bg-secondary object-cover",
        className,
      )}
    />
  )
}

export default UserAvatar
