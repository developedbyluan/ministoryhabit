"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  fetchLogs,
  fetchStats,
  insertUserProgress,
} from "@/app/actions/continue-studying";
import { groupDataByPeriod } from "@/utils/continue-studying";
import { StatsChart } from "./StatsChart";
import { LessonCard } from "./LessonCard";
import { PlaylistCard } from "./PlaylistCard";

import {
  useKindeBrowserClient,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs";
import SqueezePage from "./squeeze-page/page";

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

type ProcessedLog = {
  lesson_slug: string;
  playlist_name: string;
  song_title: string;
  latest_date: string;
  latest_time: number;
  total_playing_time: number;
};

type Lesson = {
  title: string;
  slug: string;
  latestTime: number;
  totalPlayingTime: number;
};

export default function ContinueStudying() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [statsData, setStatsData] = useState<StatsResult[] | undefined>([]);
  const [logsError, setLogsError] = useState<string | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncSuccessful, setIsSyncSuccessful] = useState<boolean>(false);

  const { isAuthenticated } = useKindeBrowserClient();

  const handleInsertUserProgress = async () => {
    try {
      const storedData = localStorage.getItem("stats");
      const localData = storedData ? JSON.parse(storedData) : [];

      if (!Array.isArray(localData) || localData.length === 0) return;

      const result = await insertUserProgress(localData);
      // console.log(result.success);
      if (result.success) {
        localStorage.setItem("stats", "[]");
        window.location.reload();
      }
    } catch (error) {
      throw new Error("Error parsing or inserting data:", error!);
    }
  };

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("stats");
      const localData = storedData ? JSON.parse(storedData) : [];

      if (localData.length <= 0) {
        setIsSyncSuccessful(true);
      }
    } catch (error) {
      throw new Error("Error parsing or inserting data:", error!);
    }
  }, []);

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
          // console.log(statsResult.data);
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
    ? logs.reduce<Record<string, ProcessedLog>>((acc, log) => {
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
    (a, b) => b.latest_time - a.latest_time
  );

  const groupedByPlaylist = sortedLogs.reduce<
    Record<string, { lessons: Lesson[]; totalTime: number }>
  >((acc, log) => {
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
    return (
      <div className="flex justify-center items-center h-24">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      {!isAuthenticated ? (
        <SqueezePage />
      ) : (
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-baseline">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">
              Continue Studying
            </h1>
            <div>
              {!isSyncSuccessful && (
                <Button onClick={handleInsertUserProgress}>Sync</Button>
              )}
              <LogoutLink>
                <Button>Log out</Button>
              </LogoutLink>
            </div>
          </div>
          {/* <ProgressForm setLogs={setLogs} /> */}
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
                {sortedLogs.map((log) => (
                  <LessonCard key={log.lesson_slug} lesson={log} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="grouped-by-playlist">
              <div className="grid gap-8">
                {Object.entries(groupedByPlaylist).map(
                  ([playlistName, data]) => (
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
      )}
    </>
  );
}
