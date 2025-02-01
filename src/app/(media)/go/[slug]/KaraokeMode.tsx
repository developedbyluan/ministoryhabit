import {
  Book,
  Languages,
  Pause,
  TextSearch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { Ref, useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import KaraokeModeText from "./KaraokeModeText";
import { formatTime } from "./formatTime";

type Lyric = {
  start_time: number;
  end_time: number;
  text: string;
  ipa: string;
  translation: string;
};

type LessonData = {
  id: number;
  media_url: string;
  paid: boolean;
  title: string;
  type: "video" | "audio";
  body: string;
  thumbnail_url: string;
  seriesId: number;
};

type KaraokeModeProps = {
  videoRef: Ref<HTMLVideoElement>;
  isPlaying: boolean;
  togglePlay: () => void;
  handleShowKaraokeMode: () => void;
  showKaraokeMode: boolean;
  progress: number;
  lyrics: Lyric[];
  updateCurrentLyricIndex: (index: number) => void;
  lessonData: LessonData[];
  handlePause: (startTime: number, index: number) => void;
  duration: number;
  handleProgressChange: (newProgress: number) => void;
  playbackRate: number;
  handlePlaybackRateChange: (newRate: number) => void;
};

export default function KaraokeMode({
  videoRef,
  isPlaying,
  togglePlay,
  handleShowKaraokeMode,
  showKaraokeMode,
  lyrics,
  progress,
  updateCurrentLyricIndex,
  lessonData,
  handleProgressChange,
  duration,
  playbackRate,
  handlePlaybackRateChange,
}: KaraokeModeProps) {
  const [showTranslation, setShowTranslation] = useState(false);

  const handleShowTranslation = () => {
    setShowTranslation((prev) => !prev);
  };

  useEffect(() => {
    if (!videoRef) return;
    console.log(videoRef);
  }, [videoRef]);
  return (
    <div
      className={`${
        showKaraokeMode ? "" : "hidden"
      } py-4 flex flex-col justify-between border`}
    >
      <header>
        <div className="max-w-[576px] w-[95%] mx-auto flex justify-between items-center gap-4 pb-4"></div>
      </header>
      <main>
        {/* <ReadModeText
          lyrics={lyrics}
          currentTime={progress}
          updateCurrentLyricIndex={updateCurrentLyricIndex}
          showIPA={showIPA}
          handlePause={handlePause}
          lessonData={lessonData}
        /> */}
        <KaraokeModeText
          lyrics={lyrics}
          currentTime={progress}
          lessonData={lessonData}
          updateCurrentLyricIndex={updateCurrentLyricIndex}
          showTranslation={showTranslation}
        />
      </main>
      <footer className="mt-auto">
        <div className="max-w-[576px] w-[95%] mx-auto px-4 pt-4">
          <div className="space-y-2">
            <Slider
              value={[progress]}
              max={duration}
              step={1}
              onValueChange={(value) => handleProgressChange(value[0])}
              className="flex-grow"
            />
            <div className="flex justify-between">
              <span className="text-slate-400 text-xs">
                {formatTime(progress)}
              </span>
              <span className="text-slate-400 text-xs">
                {formatTime(duration - progress)}
              </span>
            </div>
          </div>
          <div className="play-pause-toggler flex justify-between items-center">
            <Button variant="outline" size="sm" onClick={handleShowKaraokeMode}>
              <Book className="scale-150" />
            </Button>
            <select
              value={playbackRate}
              onChange={(e) => handlePlaybackRateChange(Number(e.target.value))}
              className="cursor-pointer hover:bg-slate-100 rounded-md px-2 py-1 text-center font-semibold appearance-none bg-transparent outline-none text-lg"
            >
              {[0.5, 0.66, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2].map(
                (rate) => (
                  <option key={rate} value={rate}>
                    {rate}x
                  </option>
                )
              )}
            </select>
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
            <Button variant="ghost" onClick={handleShowTranslation}>
              <Languages className="scale-150" />
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
