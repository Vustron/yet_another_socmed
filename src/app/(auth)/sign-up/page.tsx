// components
import SignupForm from "@/app/(auth)/sign-up/_components/signup-form"

// utils
import Image from "next/image"

// assets
import signupImage from "@/assets/images/signup-image.jpg"

// types
import type { Metadata } from "next"
import Link from "next/link"

// meta data
export const metadata: Metadata = {
  title: "Sign Up",
}

export default function SignUpPage() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-bold">
              Sign up to <span className="text-primary">Yeas</span>
            </h1>
            <p className="text-muted-foreground">
              A place where even <span className="italic">you</span> can find a
              friend.
            </p>
          </div>

          <div className="space-y-5">
            <SignupForm />
            <Link
              href="/login"
              className="block text-center hover:underline"
              prefetch={false}
            >
              Already have an account? Log in
            </Link>
          </div>
        </div>

        {/* bg */}
        <Image
          src={signupImage}
          alt=""
          className="hidden w-1/2 object-cover md:block"
          priority
        />
      </div>
    </main>
  )
}
