import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatTime } from "@/utils/continue-studying";
import { Button } from "@/components/ui/button";

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
          Course: {lesson.playlist_name}
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
          className="text-primary mt-4 inline-block"
        >
          <Button>
          Go to lesson
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}