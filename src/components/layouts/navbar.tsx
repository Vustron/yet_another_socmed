// components
import SearchField from "@/components/ui/searchfield"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import UserButton from "@/components/ui/user-button"

// utils
import Link from "next/link"

const Navbar = () => {
  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-center flex-wrap gap-5 px-5 py-3">
        {/* app name */}
        <Link href="/" className="text-2xl font-bold text-primary">
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <span>Yeas</span>
            </TooltipTrigger>
            <TooltipContent side="bottom">Yet Another SocMed</TooltipContent>
          </Tooltip>
        </Link>

        {/* search */}
        <SearchField />

        {/* userbutton */}
        <UserButton className="sm:ms-auto" />
      </div>
    </header>
  )
}

export default Navbar
