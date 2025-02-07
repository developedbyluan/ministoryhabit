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
