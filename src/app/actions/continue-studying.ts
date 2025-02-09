"use server"

import supabase from "@/utils/supabase"

export async function insertData(formData: FormData) {
  const sampleData = [
    {
      lesson_slug: "the-race-1a",
      date: "2025-02-16",
      latest_time: 119999,
      total_playing_time: 10000,
      playlist_id: "ecc6301f-74aa-476e-b792-63df9bb3a861",
    },
  ]

  try {
    const { data, error } = await supabase
      .from("users_progress_logs")
      .insert(sampleData)
      .select(`
        id,
        lesson_slug,
        date,
        latest_time,
        total_playing_time,
        playlists(id, name, songs(id, title, slug))
      `)

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error inserting data:", error)
    return { success: false, error: "Failed to insert data. Please try again." }
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
    `)

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching logs:", error)
    return { success: false, error: "Failed to fetch logs. Please try again." }
  }
}

export async function fetchStats() {
  try {
    const { data, error } = await supabase
      .from("users_progress_logs")
      .select("date, total_playing_time")
      .order("date", { ascending: true })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching stats:", error)
    return { success: false, error: "Failed to fetch stats. Please try again." }
  }
}

