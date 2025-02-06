"use server";

import supabase from "@/utils/supabase";

export async function addToCollectedVocab(
  vocabArray: string[],
  kindeId: string
) {
  const { data, error } = await supabase
    .from("collected_vocab")
    .insert([
      {
        vocab_array: vocabArray,
        kinde_id: kindeId,
      },
    ])
    .select();

  if (error) {
    console.error("Error saving new chunk to goldlist:", error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function getFromCollectedVocab(kindeId: string) {
  const { data, error } = await supabase
    .from("collected_vocab")
    .select("vocab_array")
    .eq("kinde_id", kindeId);

    if(error) {
      return {success: false, error: error}
    }

    return {success: true, data: data}
}
