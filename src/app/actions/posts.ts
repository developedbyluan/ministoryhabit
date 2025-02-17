"use server"

import { revalidatePath } from "next/cache"
import supabase from "@/utils/supabase"


export async function createPost(content: string, slug: string, sentenceIndex: number) {
  const { error } = await supabase.from("posts").insert({ content, slug, sentence_index: sentenceIndex })

  if (error) {
    console.error("Error creating post:", error)
    throw new Error("Failed to create post")
  }

  revalidatePath("/")
}

export async function getPosts(sentenceIndex?: number, kindeId?: string) {
  let query = supabase.from("posts").select("*")

  if (sentenceIndex !== undefined) {
    query = query.eq("sentence_index", sentenceIndex)
  }

  if (kindeId) {
    query = query.eq("kinde_id", kindeId)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching posts:", error)
    throw new Error("Failed to fetch posts")
  }

  return data
}

export async function searchPostsBySlug(slug: string) {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .ilike("slug", `%${slug}%`)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error searching posts by slug:", error)
    throw new Error("Failed to search posts by slug")
  }

  return data
}

export async function createReply(postId: string, content: string, videoUrl: string) {
  const { error } = await supabase.from("replies").insert({ post_id: postId, content, video_url: videoUrl })

  if (error) {
    console.error("Error creating reply:", error)
    throw new Error("Failed to create reply")
  }

  revalidatePath("/")
}

export async function getReplies(postId: string) {
  const { data, error } = await supabase
    .from("replies")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching replies:", error)
    throw new Error("Failed to fetch replies")
  }

  return data
}

