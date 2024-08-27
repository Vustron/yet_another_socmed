"use client"

// components
import SubmitButton from "@/components/shared/submit-button"
import UserAvatar from "@/components/ui/user-avatar"
import { SendHorizonal } from "lucide-react"

// hooks
import { useCreatePost } from "@/app/(root)/api"
import { useSession } from "@/components/providers/session"
import { useEditor } from "@tiptap/react"

// validation
import { createPostSchema } from "@/lib/validation"

// utils
import { clientErrorHandler } from "@/lib/utils"
import Placeholder from "@tiptap/extension-placeholder"
import { EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import toast from "react-hot-toast"
import "@/lib/styles/editor.css"
import { z } from "zod"

const PostEditor = () => {
  // get session
  const { user } = useSession()

  // init create post
  const createPostMutation = useCreatePost()

  // init editor
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "What's a crack-a-lackin?",
      }),
    ],
  })

  // get post content
  const input = editor?.getText({ blockSeparator: "\n" }).trim() || ""

  // submit handler
  const submitHandler = async () => {
    try {
      const validatedInput = createPostSchema.parse({ content: input })

      await toast.promise(createPostMutation.mutateAsync(validatedInput), {
        loading: <span className="animate-pulse">Posting...</span>,
        success: "Post created successfully",
        error: (error: unknown) => clientErrorHandler(error),
      })

      editor?.commands.clearContent()
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error?.errors[0]!.message)
      } else {
        toast.error("An unexpected error occurred")
      }
    }
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline" />

        <EditorContent
          editor={editor}
          className="w-full max-h-[20rem] overflow-y-auto bg-background rounded-2xl px-5 py-3"
        />
      </div>
      <div className="flex justify-end">
        <SubmitButton
          onClick={submitHandler}
          disabled={createPostMutation.isPending}
          buttonClassName="min-w-20"
          title="Post"
          position="right"
          icon={<SendHorizonal className="ml-2 size-4" />}
        />
      </div>
    </div>
  )
}

export default PostEditor
