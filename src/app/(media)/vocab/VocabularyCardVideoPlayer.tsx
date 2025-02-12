"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Rewind, FastForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface VideoPlayerProps {
  src: string;
  startTime: number
}

export default function VideoPlayer({ src, startTime }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      const progress = (video.currentTime / video.duration) * 100;
      setProgress(progress);
    };

    video.addEventListener("timeupdate", updateProgress);
    return () => video.removeEventListener("timeupdate", updateProgress);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.currentTime = startTime
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const rewind = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 5;
    }
  };

  const fastForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 5;
    }
  };

  const handleProgressChange = (newProgress: number[]) => {
    if (videoRef.current) {
      const newTime = (newProgress[0] / 100) * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
    }
  };

  return (
    <div className="w-full max-w-3xl rounded-md bg-gray-800 p-3 shadow-lg">
      <div className="relative aspect-video overflow-hidden rounded-lg">
        <video
          ref={videoRef}
          src={src}
          className="h-full w-full object-cover"
          playsInline
        />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={rewind}
          className="rounded-full hover:bg-gray-700 transition-colors duration-200"
        >
          <Rewind className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={togglePlay}
          className="rounded-full hover:bg-gray-700 transition-colors duration-200"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={fastForward}
          className="rounded-full hover:bg-gray-700 transition-colors duration-200"
        >
          <FastForward className="h-4 w-4" />
        </Button>
      </div>
      <div className="mt-4">
        <Slider
          value={[progress]}
          onValueChange={handleProgressChange}
          max={100}
          step={0.1}
        />
      </div>
    </div>
  );
}
