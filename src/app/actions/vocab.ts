"use server";

import supabase from "@/utils/supabase";

export async function fetchVocabularyItems(startDate: string, endDate: string) {
  const { data, error } = await supabase
    .from("goldlist")
    .select(
      "id, created_at, sentence, original_chunk, new_chunk, lesson_slug, is_acquired, last_review_at"
    )
    .gte("created_at", startDate)
    .lt("created_at", endDate)
    .is("last_review_at", null)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function acquireItem(id: number) {
  const today = new Date().toISOString().split("T")[0];
  const { error } = await supabase
    .from("goldlist")
    .update({ is_acquired: true, last_review_at: today })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function fetchReviewItems(startDate: string, endDate: string) {
  console.log(startDate, endDate);
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  const { data, error } = await supabase
    .from("goldlist")
    .select(
      "id, created_at, sentence, original_chunk, new_chunk, lesson_slug, is_acquired, last_review_at"
    )
    .lt("last_review_at", fourteenDaysAgo.toISOString())
    .is("is_acquired", false)
    .order("last_review_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function fetchGroupedItems(isReviewItems: boolean) {
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 0);

  const query = supabase
    .from("goldlist")
    .select("id, created_at, last_review_at");

  if (isReviewItems) {
    query
      .lt("last_review_at", fourteenDaysAgo.toISOString())
      .not("last_review_at", "is", null)
      .is("is_acquired", false)
      .order("last_review_at", { ascending: false });
  } else {
    query
      .lt("created_at", new Date().toISOString())
      .eq("is_acquired", false)
      .is("last_review_at", null)
      .order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  const grouped = (data || []).reduce(
    (acc: { [key: string]: number }, item) => {
      const date = new Date(
        isReviewItems ? item.last_review_at : item.created_at
      ).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {}
  );

  return grouped;
}

export async function reviewMoreItem(id: number) {
  const today = new Date().toISOString().split("T")[0];
  const { error } = await supabase
    .from("goldlist")
    .update({ last_review_at: today })
    .eq("id", id);

  if (error) throw new Error(error.message);
}
