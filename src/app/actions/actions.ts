"use server"

import supabase from "@/utils/supabase"

export async function getVocabulary() {
  try {
    const { data, error } = await supabase
      .from("collected_vocab")
      .select("vocab_array")
      .eq("kinde_id", "kp_e15445a4c1334aa3a592809f9444e9d9")

    if (error) {
      throw error
    }

    return { data }
  } catch (error) {
    return { error: `Failed to fetch vocabulary ${error}` }
  }
}

