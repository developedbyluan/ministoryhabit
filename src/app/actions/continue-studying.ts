"use server"

import supabase from "@/utils/supabase";

export async function insertData(formData: FormData) {
  console.log(formData)
  const userData = {
    lesson_slug: formData.get("lesson_slug"),
    date: formData.get("date"),
    latest_time: Number.parseInt(formData.get("latest_time") as string),
    total_playing_time: Number.parseInt(
      formData.get("total_playing_time") as string
    ),
    playlist_id: formData.get("playlist_id"),
  };

  try {
    const { data, error } = await supabase
      .from("users_progress_logs")
      .insert([userData]).select(`
        id,
        lesson_slug,
        date,
        latest_time,
        total_playing_time,
        playlists(id, name, songs(id, title, slug))
      `);

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error inserting data:", error);
    return {
      success: false,
      error: "Failed to insert data. Please try again.",
    };
  }
}

export async function fetchLogs() {
  try {
    const { data, error } = await supabase.from("users_progress_logs").select(`
      id,
      lesson_slug,
      date,
      latest_time,
      total_playing_time,
      playlists(id, name, songs(id, title, slug))
    `);

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching logs:", error);
    return { success: false, error: "Failed to fetch logs. Please try again." };
  }
}

export async function fetchStats() {
  try {
    const { data, error } = await supabase
      .from("users_progress_logs")
      .select("date, total_playing_time")
      .order("date", { ascending: true });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return {
      success: false,
      error: "Failed to fetch stats. Please try again.",
    };
  }
}
