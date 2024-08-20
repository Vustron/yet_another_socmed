// components
import { Button } from "@/components/ui/button"
import UserAvatar from "@/components/ui/user-avatar"

// actions
import { whoToFollow } from "@/app/(root)/actions"

// utils
import Link from "next/link"

const WhoToFollow = async () => {
  // init who to follow
  const usersToFollow = await whoToFollow()

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Who To Follow</div>
      {usersToFollow?.map((user) => (
        <div key={user.id} className="flex items-center justify-between gap-3">
          <Link
            href={`/users/${user.username}`}
            className="flex items-center gap-3"
          >
            <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
            <div>
              <p className="line-clamp-1 break-all font-semibold hover:underline">
                {user.displayName}
              </p>
              <p className="line-clamp-1 break-all text-muted-foreground">
                @{user.username}
              </p>
            </div>
          </Link>
          {/* follow button */}
          <Button>Follow</Button>
        </div>
      ))}
    </div>
  )
}

export default WhoToFollow
