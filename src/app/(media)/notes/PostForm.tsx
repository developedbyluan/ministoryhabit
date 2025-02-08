"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function PostForm({ createPost }: { createPost: (content: string, slug: string, sentenceIndex: number, kindeId: string) => Promise<void> }) {
  const [content, setContent] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if(content.length <= 10) return
    await createPost(content, "trump", 0, "kp_e15445a4c1334aa3a592809f9444e9d9")
    setContent("")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your post here..."
        className="w-full p-2 border rounded"
        rows={4}
      />
      <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        Create Post
      </button>
    </form>
  )
}

