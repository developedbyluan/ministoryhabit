import React from "react";
import { useVideo } from "@/hooks/use-video";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { PlayIcon, PauseIcon } from "lucide-react";
import { LyricsDisplay } from "./LyricsDisplay";

interface VideoPlayerProps {
  src: string;
}

export function VideoPlayer({ src }: VideoPlayerProps) {
  const {
    videoRef,
    isPlaying,
    progress,
    duration,
    playbackRate,
    currentLyric,
    togglePlay,
    handleProgressChange,
    handlePlaybackRateChange,
  } = useVideo({ src, text: "" });

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <video
        ref={videoRef}
        // src={src}
        className="hidden w-full rounded-lg shadow-lg"
        playsInline
      />
      <div className="mt-4 space-y-4">
        <div className="flex items-center space-x-4">
          <Button onClick={togglePlay} variant="outline" size="icon">
            {isPlaying ? (
              <PauseIcon className="h-4 w-4" />
            ) : (
              <PlayIcon className="h-4 w-4" />
            )}
          </Button>

          <Slider
            value={[progress]}
            max={duration}
            step={1}
            onValueChange={(value) => handleProgressChange(value[0])}
            className="flex-grow"
          />
          <span className="text-sm text-gray-500">
            {formatTime(progress)} / {formatTime(duration)}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">Playback Rate:</span>
          <select
            value={playbackRate}
            onChange={(e) =>
              handlePlaybackRateChange(parseFloat(e.target.value))
            }
            className="bg-transparent border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="0.5">0.5x</option>
            <option value="0.66">0.66x</option>
            <option value="0.75">0.75x</option>
            <option value="0.9">0.9x</option>
            <option value="1">1x</option>
            <option value="1.1">1.1x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="1.75">1.75x</option>
            <option value="2">2x</option>
          </select>
        </div>
      </div>
      <LyricsDisplay currentLyric={currentLyric} />
    </div>
  );
}
