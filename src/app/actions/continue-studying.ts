"use server";

import supabase from "@/utils/supabase";
import { z } from "zod"; // Type validation
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

type LessonData = {
  lesson_slug: string;
  date: string;
  time: number;
  playing_time: number;
  playlist_id: string;
};

// Define a strict schema to prevent invalid/malicious data
const LessonDataSchema = z.object({
  lesson_slug: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // Ensure valid date format
  time: z.number().nonnegative(),
  playing_time: z.number().nonnegative(),
  playlist_id: z.string().uuid(), // Ensure valid UUID
});

function aggregateLessonData(
  lessonDataFromLocalStorage: LessonData[],
  kindeId: string
) {
  // Create a map to group lessons by their unique combination of slug and date
  const lessonMap = new Map();

  // Process each lesson entry
  lessonDataFromLocalStorage.forEach((lesson) => {
    // Create a unique key combining lesson_slug and date
    const key = `${lesson.lesson_slug}|${lesson.date}|${lesson.playlist_id}`;

    if (lessonMap.has(key)) {
      // Update existing entry
      const existing = lessonMap.get(key);
      existing.latest_time = Math.max(existing.latest_time, lesson.time);
      existing.total_playing_time += lesson.playing_time;
    } else {
      // Create new entry
      lessonMap.set(key, {
        lesson_slug: lesson.lesson_slug,
        date: lesson.date,
        latest_time: lesson.time,
        total_playing_time: lesson.playing_time,
        playlist_id: lesson.playlist_id,
        kinde_id: kindeId,
      });
    }
  });

  // Convert map values to array for final output
  return Array.from(lessonMap.values());
}

export async function insertUserProgress(localLessonData: LessonData[]) {
  try {
    const parsedData = localLessonData.map((item) =>
      LessonDataSchema.parse(item)
    );

    // TODO: Attach user ID to each record to the aggregated data
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    // console.log(user);

    const { data, error } = await supabase
      .from("users_progress_logs")
      .insert(aggregateLessonData(parsedData, user.id)).select(`
        id,
        lesson_slug,
        date,
        latest_time,
        total_playing_time,
        kinde_id,
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
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    // console.log(user);
    const { data, error } = await supabase.from("users_progress_logs").select(`
      id,
      lesson_slug,
      date,
      latest_time,
      total_playing_time,
      playlists(id, name, songs(id, title, slug))
    `).eq("kinde_id", user.id);

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching logs:", error);
    return { success: false, error: "Failed to fetch logs. Please try again." };
  }
}

export async function fetchStats() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    // console.log(user);

    const { data, error } = await supabase
      .from("users_progress_logs")
      .select("date, total_playing_time")
      .eq("kinde_id", user.id)
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
