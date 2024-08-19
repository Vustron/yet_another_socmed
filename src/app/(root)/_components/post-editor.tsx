"use client"

// components
import { Button } from "@/components/ui/button"
import UserAvatar from "@/components/ui/user-avatar"

// hooks
import { useCreatePost } from "@/app/(root)/api"
import { useSession } from "@/components/providers/session"
import { EditorContent, useEditor } from "@tiptap/react"

// utils
import { clientErrorHandler } from "@/lib/utils"
import Placeholder from "@tiptap/extension-placeholder"
import StarterKit from "@tiptap/starter-kit"
import toast from "react-hot-toast"
import "@/lib/styles/editor.css"
import { submitPost } from "../actions"

// TODO: fix error cannot post

const PostEditor = () => {
  // get session
  const { user } = useSession()

  // init create post
  const createPostMutation = useCreatePost()

  // init editor
  const editor = useEditor({
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
  const input = editor?.getText({ blockSeparator: "\n" }) || ""

  // submit handler
  const submitHandler = async () => {
    // await toast.promise(createPostMutation.mutateAsync(input), {
    //   loading: <span className="animate-pulse">Posting...</span>,
    //   success: "Post created successfully",
    //   error: (error: unknown) => clientErrorHandler(error),
    // })

    await submitPost(input)
    editor?.commands.clearContent()
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
        <Button
          onClick={submitHandler}
          disabled={createPostMutation.isPending}
          className="min-w-20"
        >
          Post
        </Button>
      </div>
    </div>
  )
}

export default PostEditor
