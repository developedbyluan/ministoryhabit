"use server";

import supabase from "@/utils/supabase";

export async function addToGoldlist(
  sentence: string,
  originalChunk: string,
  newChunk: string,
  lessonSlug: string,
  sentenceIndex: number,
  kindeId: string,
  startTime: number,
  endTime: number
) {
  const { data, error } = await supabase
    .from("goldlist")
    .insert([
      {
        lesson_slug: lessonSlug,
        sentence_index: sentenceIndex,
        sentence: sentence,
        original_chunk: originalChunk,
        new_chunk: newChunk,
        kinde_id: kindeId,
        is_acquired: false,
        start_time: startTime,
        end_time: endTime

      },
    ])
    .select();

  if (error) {
    console.error("Error saving new chunk to goldlist:", error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
