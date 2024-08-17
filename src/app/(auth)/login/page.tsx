// components
import LoginForm from "@/app/(auth)/login/login-form"

// utils
import Image from "next/image"

// assets
import loginImage from "@/assets/images/login-image.jpg"

// types
import type { Metadata } from "next"
import Link from "next/link"

// meta data
export const metadata: Metadata = {
  title: "Login",
}

export default function LoginPage() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <h1 className="text-center text-2xl font-bold">
            Login to Yet Another SocMed
          </h1>
          <div className="space-y-5">
            {/* <GoogleSignInButton /> */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-muted" />
              <span>OR</span>
              <div className="h-px flex-1 bg-muted" />
            </div>
            <LoginForm />
            <Link href="/sign-up" className="block text-center hover:underline">
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </div>

        {/* bg */}
        <Image
          src={loginImage}
          alt=""
          className="hidden w-1/2 object-cover md:block"
          priority
        />
      </div>
    </main>
  )
}
