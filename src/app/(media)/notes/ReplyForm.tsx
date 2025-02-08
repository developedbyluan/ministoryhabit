"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReplyForm({
  createReply,
  postId,
}: {
  createReply: (
    postId: number,
    content: string,
    videoUrl: string
  ) => Promise<void>;
  postId: number;
}) {
  // const [content, setContent] = useState("");
  const [content, setContent] = useState({ text: "", videoUrl: "" });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createReply(postId, content.text, content.videoUrl);
    setContent({ text: "", videoUrl: "" });
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
      <textarea
        value={content.text}
        onChange={(e) =>
          setContent((prev) => ({ ...prev, text: e.target.value }))
        }
        placeholder="Write your reply here..."
        className="w-full p-2 border rounded"
        rows={4}
      />
      <input
        type="text"
        value={content.videoUrl}
        onChange={(e) =>
          setContent((prev) => ({ ...prev, videoUrl: e.target.value }))
        }
      />
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Add Reply
      </button>
    </form>
  );
}
