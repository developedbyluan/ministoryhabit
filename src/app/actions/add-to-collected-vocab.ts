"use server";

import supabase from "@/utils/supabase";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function addToCollectedVocab(
  vocabArray: string[],
) {
  if (!Array.isArray(vocabArray) || vocabArray.some(word => typeof word !== "string")) {
    return { success: false, error: "Invalid input" };
  }

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    return { success: false, error: "User not authenticated." };
  }

  // console.log(user.id);

  const { data, error } = await supabase
    .from("collected_vocab")
    .insert([
      {
        vocab_array: vocabArray,
        kinde_id: user.id,
      },
    ])
    .select();

  if (error) {
    console.error("Error saving high frequency words:", error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function getFromCollectedVocab(kindeId: string) {

  const { data, error } = await supabase
    .from("collected_vocab")
    .select("vocab_array")
    .eq("kinde_id", kindeId);

  if (error) {
    return { success: false, error: error };
  }

  return { success: true, data: data };
}
