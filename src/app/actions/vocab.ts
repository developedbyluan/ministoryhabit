"use server";

import supabase from "@/utils/supabase";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function fetchVocabularyItems(startDate: string, endDate: string) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // console.log(user);
  if (!user || !user.id) {
    // return { success: false, error: "User not authenticated." };
    throw new Error("User not authenticated.");
  }

  const { data, error } = await supabase
    .from("goldlist")
    .select(
      "id, created_at, sentence, original_chunk, new_chunk, lesson_slug, is_acquired, last_review_at, kinde_id, start_time"
    )
    .gte("created_at", startDate)
    .lt("created_at", endDate)
    .is("last_review_at", null)
    .eq("kinde_id", user.id)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function acquireItem(id: number) {
  const { isAuthenticated } = getKindeServerSession();
  // const user = await getUser();

  // console.log(user);

  if (!isAuthenticated) {
    // return { success: false, error: "User not authenticated." };
    throw new Error("User not authenticated.");
  }

  const today = new Date().toISOString().split("T")[0];
  const { error } = await supabase
    .from("goldlist")
    .update({ is_acquired: true, last_review_at: today })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function fetchReviewItems(startDate: string, endDate: string) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // console.log(user);
  console.log(startDate, endDate);
  if (!user || !user.id) {
    // return { success: false, error: "User not authenticated." };
    throw new Error("User not authenticated.");
  }
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  const { data, error } = await supabase
    .from("goldlist")
    .select(
      "id, created_at, sentence, original_chunk, new_chunk, lesson_slug, is_acquired, last_review_at, start_time"
    )
    .lt("last_review_at", fourteenDaysAgo.toISOString())
    .is("is_acquired", false)
    .eq("kinde_id", user.id)
    .order("last_review_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function fetchGroupedItems(isReviewItems: boolean) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // console.log(user);
  if (!user || !user.id) {
    // return { success: false, error: "User not authenticated." };
    throw new Error("User not authenticated.");
  }
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 0);

  const query = supabase
    .from("goldlist")
    .select("id, created_at, last_review_at")
    .eq("kinde_id", user.id);

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
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // console.log(user);
  if (!user || !user.id) {
    return { success: false, error: "User not authenticated." };
  }

  const today = new Date().toISOString().split("T")[0];
  const { error } = await supabase
    .from("goldlist")
    .update({ last_review_at: today })
    .eq("id", id)
    .eq("kinde_id", user.id);

  if (error) throw new Error(error.message);
}
