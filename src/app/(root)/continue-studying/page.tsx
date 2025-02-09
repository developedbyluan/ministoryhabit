import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  insertData,
  fetchLogs,
  fetchStats,
} from "@/app/actions/continue-studying";
import {
  formatDate,
  formatTime,
  groupDataByPeriod,
} from "@/utils/continue-studying";
import { StatsChart } from "./StatsChart";

type Song = {
    id: any;
    title: string;
    slug: string;
  };
  
  type Playlist = {
    id: any;
    name: string;
    songs: Song[];
  };

interface ProcessedLog {
  lesson_slug: string;
  playlist_name: string;
  song_title: string;
  latest_date: string | Date;
  latest_time: number;
  total_playing_time: number;
}

interface PlaylistGroup {
  lessons: {
    title: string;
    slug: string;
    latestTime: number;
    totalPlayingTime: number;
  }[];
  totalTime: number;
}

export default async function ProgressLogger() {
  const { data: logs, error: logsError } = await fetchLogs();
  const { data: statsData, error: statsError } = await fetchStats();

  const processedLogs = logs
    ? logs.reduce<Record<string, ProcessedLog>>((acc, log) => {
        if (!acc[log.lesson_slug]) {
          acc[log.lesson_slug] = {
            lesson_slug: log.lesson_slug,
            playlist_name: (log.playlists as unknown as Playlist)?.name || "Unknown",
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

  const groupedByPlaylist = sortedLogs.reduce<Record<string, PlaylistGroup>>(
    (acc, log) => {
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
    },
    {}
  );

  const dailyData = groupDataByPeriod(statsData || [], "day");
  const weeklyData = groupDataByPeriod(statsData || [], "week");
  const monthlyData = groupDataByPeriod(statsData || [], "month");

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Continue Studying</h1>
        <form
          action={insertData}
          className="mb-6"
        >
          <Button type="submit">Insert Sample Data</Button>
        </form>
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
                <Card key={log.lesson_slug} className="overflow-hidden">
                  <CardHeader className="bg-primary text-primary-foreground">
                    <CardTitle className="text-lg">{log.song_title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Playlist: {log.playlist_name}
                    </p>
                    <p className="text-sm mb-1">
                      Latest session: {formatDate(log.latest_date)}
                    </p>
                    <p className="text-sm mb-1">
                      Time spent: {formatTime(log.latest_time)}
                    </p>
                    <p className="text-sm font-semibold">
                      Total time: {formatTime(log.total_playing_time)}
                    </p>
                    <Link
                      href={`/go/${log.lesson_slug}`}
                      className="text-primary hover:underline text-sm mt-2 inline-block"
                    >
                      Go to lesson
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="grouped-by-playlist">
            <div className="grid gap-8">
              {Object.entries(groupedByPlaylist).map(
                ([playlistName, data]: [string, any]) => (
                  <Card key={playlistName}>
                    <CardHeader>
                      <CardTitle>{playlistName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Total time: {formatTime(data.totalTime)}
                      </p>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {data.lessons.map((lesson: any) => (
                          <Card key={lesson.slug} className="overflow-hidden">
                            <CardHeader className="bg-secondary text-secondary-foreground py-2">
                              <CardTitle className="text-sm">
                                {lesson.title}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-2">
                              <p className="text-xs mb-1">
                                Latest time: {formatTime(lesson.latestTime)}
                              </p>
                              <p className="text-xs mb-2">
                                Total time:{" "}
                                {formatTime(lesson.totalPlayingTime)}
                              </p>
                              <Link
                                href={`/go/${lesson.slug}`}
                                className="text-primary hover:underline text-xs"
                              >
                                Go to lesson
                              </Link>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
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
    </Suspense>
  );
}
