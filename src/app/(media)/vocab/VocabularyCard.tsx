import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRef, useState } from "react";
import { getVideo } from "@/utils/indexedDB";
import { Button } from "@/components/ui/button";
import VideoPlayer from "./VocabularyCardVideoPlayer";

interface VocabularyCardProps {
  item: {
    sentence: string;
    original_chunk: string;
    new_chunk: string;
    lesson_slug: string;
    created_at: string;
    start_time: number
  };
}

export default function VocabularyCard({ item }: VocabularyCardProps) {
  const createdDate = new Date(item.created_at).toLocaleDateString();
  const [isLoading, setIsLoading] = useState(false);
  const [videoSource, setVideoSource] = useState("");
  const [isError, setError] = useState(null);
  const videoRef = useRef<HTMLVideoElement>(null);
console.log(item)
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
      console.error(err);
    } finally {
      setIsLoading(false);
      console.log(isLoading);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {item.lesson_slug}
        </CardTitle>
        <CardDescription>Created on: {createdDate}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={() => {
            loadVideo(item.lesson_slug);
          }}
        >
          Hint
        </Button>
        {videoSource && <VideoPlayer src={videoSource} startTime={item.start_time} />}
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
