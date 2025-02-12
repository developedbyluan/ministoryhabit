import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { getVideo } from "@/utils/indexedDB";
import { Button } from "@/components/ui/button";
import VideoPlayer from "./VocabularyCardVideoPlayer";
import { MonitorUp, Speech } from "lucide-react";
import Link from "next/link";

interface VocabularyCardProps {
  item: {
    sentence: string;
    original_chunk: string;
    new_chunk: string;
    lesson_slug: string;
    created_at: string;
    start_time: number;
  };
}

export default function VocabularyCard({ item }: VocabularyCardProps) {
  const createdDate = new Date(item.created_at).toLocaleDateString();
  const [isLoading, setIsLoading] = useState(false);
  const [videoSource, setVideoSource] = useState("");
  const [isError, setError] = useState<string | null>(null);

  const loadVideo = async (videoName: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const video = await getVideo(videoName);
      if (video) {
        const url = URL.createObjectURL(video.blob);
        setVideoSource(url);
      } else {
        throw new Error("Video not found");
      }
    } catch (err) {
      // setError("Failed to load video")
      // console.error(err);
      console.log(err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
      // console.log(isLoading);
    }
  };

  if (isLoading) {
    return "Loading";
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-semibold">
              <Link href={`/go/${item.lesson_slug}`}>{item.lesson_slug}</Link>
            </CardTitle>
            <CardDescription>Created on: {createdDate}</CardDescription>
          </div>
          <Button variant="ghost" size="icon" aria-label="open real world pronunciation app">
            <Speech className="text-red-400 scale-150" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4 mb-7">
          <p className="text-red-600">{isError}</p>
          {videoSource ? (
            <VideoPlayer src={videoSource} startTime={item.start_time} />
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                loadVideo(item.lesson_slug);
              }}
              aria-label="show video"
            >
              <MonitorUp className="scale-150" />
            </Button>
          )}
        </div>
        <p className="mb-2">
          <strong>Sentence:</strong> {item.sentence}
        </p>
        <p className="mb-2">
          <strong>Original:</strong> {item.original_chunk}
        </p>
        <p>
          <strong>New:</strong> {item.new_chunk}
        </p>
      </CardContent>
    </Card>
  );
}
