/**
 * Aggregates lesson data by lesson_slug and date, computing the latest time
 * and total playing time for each unique combination.
 *
 * @param {Array<Object>} data - Array of lesson objects containing:
 *   - lesson_slug: string identifier for the lesson
 *   - date: string date in YYYY-MM-DD format
 *   - time: number representing timestamp
 *   - playing_time: number representing duration
 * @returns {Array<Object>} Aggregated array of lesson objects with:
 *   - lesson_slug: string
 *   - date: string
 *   - latest_time: number (maximum timestamp)
 *   - total_playing_time: number (sum of playing times)
 */

type Data = {
    lesson_slug: string,
    date: string,
    time: number,
    playing_time: number
}
function aggregateLessonData(data: Data[]) {
  // Create a map to group lessons by their unique combination of slug and date
  const lessonMap = new Map();

  // Process each lesson entry
  data.forEach((lesson) => {
    // Create a unique key combining lesson_slug and date
    const key = `${lesson.lesson_slug}|${lesson.date}`;

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
      });
    }
  });

  // Convert map values to array for final output
  return Array.from(lessonMap.values());
}
