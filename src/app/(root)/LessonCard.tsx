import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatTime } from "@/utils/continue-studying";

type LessonCardProps = {
  lesson: {
    lesson_slug: string;
    song_title: string;
    playlist_name: string;
    latest_date: string;
    latest_time: number;
    total_playing_time: number;
  };
};

export function LessonCard({ lesson }: LessonCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle className="text-lg">{lesson.song_title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground mb-2">
          Playlist: {lesson.playlist_name}
        </p>
        <p className="text-sm mb-1">
          Latest session: {formatDate(lesson.latest_date)}
        </p>
        {/* <p className="text-sm mb-1">
          Time spent: {formatTime(lesson.latest_time)}
        </p> */}
        <p className="text-sm font-semibold">
          Total time: {formatTime(lesson.total_playing_time)}
        </p>
        <Link
          href={`/go/${lesson.lesson_slug}`}
          className="text-primary hover:underline text-sm mt-2 inline-block"
        >
          Go to lesson
        </Link>
      </CardContent>
    </Card>
  );
}