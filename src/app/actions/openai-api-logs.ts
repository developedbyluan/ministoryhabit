"use server"

import supabase from "@/utils/supabase"

export async function openaiApiLogs(lessonSlug: string, content: string, kindeId: string) {

  const { data, error } = await supabase
    .from("open_ai_api_logs")
    .insert([{ lesson_slug: lessonSlug, content: content, kinde_id: kindeId}])
    .select()

  if (error) {
    console.error("Error saving story:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

