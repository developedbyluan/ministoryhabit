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
import { ChevronDown, MonitorUp, Speech } from "lucide-react";
import Link from "next/link";
import Youglish from "@/components/Youglish";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

  const [showYouglish, setShowYouglish] = useState<boolean>(false);

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

  const handleShowYouglish = () => {
    setShowYouglish((prev) => !prev);
  };

  const handleReplace = (
    sentence: string,
    originalChunk: string,
    newChunk: string
  ) => {
    return sentence.replace(originalChunk, newChunk);
  };

  const renderResultWithPopover = (
    sentence: string,
    originalChunk: string,
    newChunk: string
  ) => {
    const result = handleReplace(sentence, originalChunk, newChunk);

    const parts = result.split(newChunk);
    return (
      <>
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {index < parts.length - 1 && (
              <Popover>
                <PopoverTrigger>
                  <span className="underline underline-offset-8 cursor-pointer text-blue-600 leading-10">
                    {newChunk}
                  </span>
                </PopoverTrigger>
                <PopoverContent>{originalChunk}</PopoverContent>
              </Popover>
            )}
          </span>
        ))}
      </>
    );
  };

  if (isLoading) {
    return "Loading";
  }

  return (
    <>
      <Card className={`hover:shadow-lg transition-shadow duration-300 ${showYouglish? "hidden": ""}`}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg font-semibold">
                <Link href={`/go/${item.lesson_slug}`}>{item.lesson_slug}</Link>
              </CardTitle>
              <CardDescription>Created on: {createdDate}</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="open real world pronunciation app"
              onClick={handleShowYouglish}
            >
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
          <div className="text-xl mt-4 p-4 bg-blue-50 rounded-md">
            {renderResultWithPopover(
              item.sentence,
              item.original_chunk,
              item.new_chunk
            )}
          </div>
        </CardContent>
      </Card>
      {showYouglish && (
        <div className="fixed w-full">
          <Button
            variant="ghost"
            className="fixed w-full"
            onClick={handleShowYouglish}
          >
            <ChevronDown className="scale-150" strokeWidth={3} />
          </Button>
          <Youglish dataQuery={item.original_chunk} />
        </div>
      )}
    </>
  );
}
