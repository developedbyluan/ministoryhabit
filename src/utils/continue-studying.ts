type StatsResult = { date: string; total_playing_time: number };

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatTime(milliSeconds: number): string {
  const seconds = milliSeconds / 1000
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (remainingSeconds > 0 || parts.length === 0)
    parts.push(`${Math.round(remainingSeconds)}s`);

  return parts.join(" ");
}

export function groupDataByPeriod(
  data: StatsResult[],
  period: "day" | "week" | "month"
): { date: string; total_time: number }[] {
  const groupedData = data.reduce<Record<string, number>>((acc, item) => {
    let key;
    const date = new Date(item.date);

    if (period === "day") {
      key = date.toISOString().split("T")[0];
    } else if (period === "week") {
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
      key = weekStart.toISOString().split("T")[0];
    } else if (period === "month") {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
    }

    if (key !== undefined) {
      acc[key] = (acc[key] || 0) + item.total_playing_time;
    }

    // if (!acc[key]) {
    //   acc[key] = 0;
    // }
    // acc[key] += item.total_playing_time;

    return acc;
  }, {});

  return Object.entries(groupedData).map(([date, total_time]) => ({
    date,
    total_time,
  }));
}
