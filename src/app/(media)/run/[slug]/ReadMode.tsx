"use client";

// import { Loader2, MessageSquareText } from "lucide-react";
import { MessageSquareText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X, TvMinimalPlay, TextSearch, Play, Pause } from "lucide-react";
import { Ref, useState } from "react";
import ReadModeText from "./ReadModeText";

import { LessonData } from "@/types";
import Link from "next/link";

type Lyric = {
  start_time: number;
  end_time: number;
  text: string;
  ipa: string;
  translation: string;
};

type ReadModeProps = {
  videoRef: Ref<HTMLVideoElement>;
  progress: number;
  isPlaying: boolean;
  duration: number;
  handleProgressChange: (newProgress: number) => void;
  togglePlay: () => void;
  lyrics: Lyric[];
  updateCurrentLyricIndex: (index: number) => void;
  handlePause: (startTime: number, index: number) => void;
  lessonData: LessonData;
  handleShowKaraokeMode: (mode: "karaoke" | "read") => void;
  handleShowSentenceMode: (mode: "karaoke" | "read") => void;
};

export default function ReadMode({
  progress,
  isPlaying,
  duration,
  handleProgressChange,
  togglePlay,
  lyrics,
  updateCurrentLyricIndex,
  handlePause,
  lessonData,
  handleShowKaraokeMode,
  handleShowSentenceMode,
}: ReadModeProps) {
  const [showIPA, setShowIPA] = useState(false);

  const handleShowIPA = () => {
    setShowIPA((prev) => !prev);
  };

  return (
    <>
      {/* {!duration && (
        <div className="absolute inset-0 text-white bg-slate-800 z-50 flex items-center justify-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span>Video is being downloaded</span>
        </div>
      )} */}
      <header>
        <div className="flex-shrink max-w-[396px] w-[95%] mx-auto flex justify-between items-center gap-4 pb-4">
          <Link href="/">
            <Button variant="ghost">
              <X className="scale-150" />
            </Button>
          </Link>
          <Slider
            value={[progress]}
            max={duration}
            step={1}
            onValueChange={(value) => handleProgressChange(value[0])}
            className="flex-grow"
          />
          <Button variant="ghost" onClick={handleShowIPA}>
            <MessageSquareText className="scale-150" />
          </Button>
        </div>
      </header>
      <main className="flex-grow overflow-y-auto">
        <ReadModeText
          lyrics={lyrics}
          currentTime={progress}
          updateCurrentLyricIndex={updateCurrentLyricIndex}
          showIPA={showIPA}
          handlePause={handlePause}
          lessonData={lessonData}
        />
      </main>
      <footer>
        <div className="max-w-[396px] w-[95%] mx-auto px-4 pt-4">
          <div className="play-pause-toggler flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShowKaraokeMode("read")}
              aria-label="show/hide video"
            >
              <TvMinimalPlay className="scale-150" />
            </Button>
            <Button
              size="icon"
              className="bg-white hover:bg-slate-100 border border-black w-12 h-12 rounded-full"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause fill="black" strokeWidth={2} stroke="black" />
              ) : (
                <Play fill="black" strokeWidth={4} stroke="black" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShowSentenceMode("read")}
            >
              <TextSearch className="scale-150" />
            </Button>
          </div>
        </div>
      </footer>
    </>
  );
}
