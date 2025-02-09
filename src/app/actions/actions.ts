"use server";

import supabase from "@/utils/supabase";
import { Genre } from "@/types";

export async function getVocabulary() {
  try {
    const { data, error } = await supabase
      .from("collected_vocab")
      .select("vocab_array")
      .eq("kinde_id", "kp_e15445a4c1334aa3a592809f9444e9d9");

    if (error) {
      throw error;
    }

    return { data };
  } catch (error) {
    return { error: `Failed to fetch vocabulary ${error}` };
  }
}

export async function fetchGenresData(): Promise<Genre[]> {
  const { data: genres, error: genresError } = await supabase
    .from("genres")
    .select("*, playlists(*, songs(*))");

  if (genresError) {
    console.error("Error fetching genres:", genresError);
    throw new Error("Failed to fetch genres data");
  }

  return genres as Genre[];
}

// notes page
export async function createPost(
  content: string,
  slug: string,
  sentenceIndex: number,
  kindeId: string
) {
  await supabase
    .from("posts")
    .insert({
      content,
      slug,
      sentence_index: sentenceIndex,
      kinde_id: kindeId,
    });
}

export async function getPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("*, replies(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  return data;
}

export async function getPost(id: number) {
  // const { data, error } = await supabase.from("posts").select("*").eq("id", id).single()
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching post:", error);
    return null;
  }

  return data;
}

export async function getReplies(postId: number) {
  const { data, error } = await supabase
    .from("replies")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching replies:", error);
    return [];
  }

  return data;
}