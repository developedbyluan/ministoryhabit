"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchLogs, fetchStats } from "@/app/actions/continue-studying";
import { groupDataByPeriod } from "@/utils/continue-studying";
import { StatsChart } from "./StatsChart";
import { ProgressForm } from "./ProgressForm";
import { LessonCard } from "./LessonCard";
import { PlaylistCard } from "./PlaylistCard";

export const runtime = "edge";

type Song = { id: number; title: string; slug: string };
type Playlist = { id: number; name: string; songs: Song[] };
type Log = {
  id: number;
  lesson_slug: string;
  date: string;
  latest_time: number;
  total_playing_time: number;
  playlists: Playlist[];
};

type StatsResult = { date: string; total_playing_time: number };

export default function ContinueStudying() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [statsData, setStatsData] = useState<StatsResult[] | undefined>([]);
  const [logsError, setLogsError] = useState<string | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const logsResult = await fetchLogs();
        if (logsResult.success) {
          setLogs(logsResult.data || []);
        } else {
          setLogsError(logsResult.error || null);
        }

        const statsResult = await fetchStats();
        if (statsResult.success) {
          setStatsData(statsResult.data);
        } else {
          setStatsError(statsResult.error || null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLogsError("Failed to fetch logs. Please try again.");
        setStatsError("Failed to fetch stats. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const processedLogs = logs
    ? logs.reduce<Record<string, any>>((acc, log) => {
        if (!acc[log.lesson_slug]) {
          acc[log.lesson_slug] = {
            lesson_slug: log.lesson_slug,
            playlist_name:
              (log.playlists as unknown as Playlist)?.name || "Unknown",
            song_title:
              (log.playlists as unknown as Playlist)?.songs?.find(
                (song) => song.slug === log.lesson_slug
              )?.title || "Unknown",
            latest_date: log.date,
            latest_time: log.latest_time,
            total_playing_time: 0,
          };
        }

        acc[log.lesson_slug].total_playing_time += log.total_playing_time;

        if (log.date > acc[log.lesson_slug].latest_date) {
          acc[log.lesson_slug].latest_date = log.date;
          acc[log.lesson_slug].latest_time = log.latest_time;
        }

        return acc;
      }, {})
    : {};

  const sortedLogs = Object.values(processedLogs).sort(
    (a: any, b: any) => b.latest_time - a.latest_time
  );

  const groupedByPlaylist = sortedLogs.reduce((acc, log) => {
    if (!acc[log.playlist_name]) {
      acc[log.playlist_name] = { lessons: [], totalTime: 0 };
    }
    acc[log.playlist_name].lessons.push({
      title: log.song_title,
      slug: log.lesson_slug,
      latestTime: log.latest_time,
      totalPlayingTime: log.total_playing_time,
    });
    acc[log.playlist_name].totalTime += log.total_playing_time;
    return acc;
  }, {});

  const dailyData: { date: string; total_time: number }[] = groupDataByPeriod(
    statsData || [],
    "day"
  );
  const weeklyData: { date: string; total_time: number }[] = groupDataByPeriod(
    statsData || [],
    "week"
  );
  const monthlyData: { date: string; total_time: number }[] = groupDataByPeriod(
    statsData || [],
    "month"
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Continue Studying</h1>
      <ProgressForm setLogs={setLogs} />
      {logsError && <p className="text-red-500 mt-2 mb-4">{logsError}</p>}
      {statsError && <p className="text-red-500 mt-2 mb-4">{statsError}</p>}
      <Tabs defaultValue="all-lessons" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
          <TabsTrigger value="all-lessons">All Lessons</TabsTrigger>
          <TabsTrigger value="grouped-by-playlist">Courses</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>
        <TabsContent value="all-lessons">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedLogs.map((log: any) => (
              <LessonCard key={log.lesson_slug} lesson={log} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="grouped-by-playlist">
          <div className="grid gap-8">
            {Object.entries(groupedByPlaylist).map(
              ([playlistName, data]: [string, any]) => (
                <PlaylistCard
                  key={playlistName}
                  playlistName={playlistName}
                  data={data}
                />
              )
            )}
          </div>
        </TabsContent>
        <TabsContent value="stats">
          <div className="grid gap-8">
            <Card className="w-full max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Daily Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <StatsChart data={dailyData} />
              </CardContent>
            </Card>
            <Card className="w-full max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Weekly Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <StatsChart data={weeklyData} />
              </CardContent>
            </Card>
            <Card className="w-full max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Monthly Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <StatsChart data={monthlyData} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
