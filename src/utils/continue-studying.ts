export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (remainingSeconds > 0 || parts.length === 0)
    parts.push(`${remainingSeconds}s`);

  return parts.join(" ");
}

export function groupDataByPeriod(
  // Accept an array of data items and a period type
  data: Array<{ date: string; total_playing_time: number }>,
  period: "day" | "week" | "month"
): Array<{ date: string; total_time: number }> {
  // First, reduce the data into groups based on the specified period
  const groupedData = data.reduce((acc: Record<string, number>, item) => {
    // Create a Date object from the item's date string
    const date = new Date(item.date);

    // Determine the appropriate key based on the period type
    const key =
      period === "day"
        ? // For daily grouping, use YYYY-MM-DD format
          date.toISOString().split("T")[0]
        : period === "week"
        ? // For weekly grouping, find the start of the week (Sunday)
          // and format as YYYY-MM-DD
          new Date(date.setDate(date.getDate() - date.getDay()))
            .toISOString()
            .split("T")[0]
        : // For monthly grouping, use YYYY-MM format
          `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}`;

    // Add the current item's playing time to the accumulated total
    // If this is the first item for this key, initialize with 0
    acc[key] = (acc[key] || 0) + item.total_playing_time;

    return acc;
  }, {});

  // Convert the grouped data object into an array of date/total_time objects
  return Object.entries(groupedData).map(([date, total_time]) => ({
    date,
    total_time,
  }));
}
