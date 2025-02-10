import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTime } from "@/utils/continue-studying";
import { Button } from "@/components/ui/button";

type PlaylistCardProps = {
  playlistName: string;
  data: {
    lessons: Array<{
      title: string;
      slug: string;
      latestTime: number;
      totalPlayingTime: number;
    }>;
    totalTime: number;
  };
};

export function PlaylistCard({ playlistName, data }: PlaylistCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{playlistName}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Total time: {formatTime(data.totalTime)}
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.lessons.map((lesson) => (
            <Card key={lesson.slug} className="overflow-hidden">
              <CardHeader className="bg-secondary text-secondary-foreground py-2">
                <CardTitle className="text-sm">{lesson.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                {/* <p className="text-xs mb-1">
                  Latest time: {formatTime(lesson.latestTime)}
                </p> */}
                <p className="text-xs mb-4">
                  Total time: {formatTime(lesson.totalPlayingTime)}
                </p>
                <Link
                  href={`/go/${lesson.slug}`}
                  className="text-primary hover:underline text-xs"
                >
                  <Button>Go to lesson</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
