import { MessageSquareText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X, TvMinimalPlay, TextSearch, Play, Pause } from "lucide-react";
import { Ref, useState } from "react";
import ReadModeText from "./ReadModeText";

type Word = {
  word: string;
  index: number;
};

type Lyric = { startTime: number; endTime: number; text: string; ipa: string };

type ReadModeProps = {
  videoRef: Ref<HTMLVideoElement>;
  progress: number;
  isPlaying: boolean;
  duration: number;
  handleProgressChange: (newProgress: number) => void;
  togglePlay: () => void;
  lyrics: Lyric[];
  updateCurrentLyricIndex: (index: number) => void;
};
export default function ReadMode({
  videoRef,
  progress,
  isPlaying,
  duration,
  handleProgressChange,
  togglePlay,
  lyrics,
  updateCurrentLyricIndex,
}: ReadModeProps) {
  const [showIPA, setShowIPA] = useState(false)

  const handleShowIPA =() => {
    setShowIPA(prev => !prev)
  }
  return (
    <div className="max-h-full py-4 flex flex-col justify-between">
      <header>
        <div className="max-w-[576px] w-[95%] mx-auto flex justify-between items-center gap-4 pb-4">
          <Button variant="ghost">
            <X className="scale-150" />
          </Button>
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
        <div className="max-w-[576px] w-[95%] mx-auto px-6 space-y-4">
          <div className="max-w-3xl mx-auto">
            <video
              ref={videoRef}
              // src={src}
              className="w-full rounded-lg shadow-lg hidden"
              playsInline
            />
          </div>
        </div>
        <ReadModeText
          lyrics={lyrics}
          currentTime={progress}
          updateCurrentLyricIndex={updateCurrentLyricIndex}
          showIPA={showIPA}
        />
      </main>
      <footer>
        <div className="max-w-[576px] w-[95%] mx-auto px-4 pt-4">
          <div className="play-pause-toggler flex justify-between items-center">
            <Button variant="outline" size="sm">
              <TvMinimalPlay className="scale-150" />
            </Button>
            <Button
              size="icon"
              className="bg-white hover:bg-slate-100 border w-12 h-12 rounded-full"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause fill="black" strokeWidth={2} stroke="black" />
              ) : (
                <Play fill="black" strokeWidth={4} stroke="black" />
              )}
            </Button>
            <Button variant="outline" size="sm">
              <TextSearch className="scale-150" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
