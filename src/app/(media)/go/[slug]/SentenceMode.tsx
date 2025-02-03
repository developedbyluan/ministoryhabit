import { Button } from "@/components/ui/button";
import {
  CornerDownLeft,
  MessageCircleQuestion,
  Pause,
  Play,
  StepForward,
} from "lucide-react";

type Lyric = {
  start_time: number;
  end_time: number;
  text: string;
  ipa: string;
  translation: string;
};

type SentenceModeProps = {
  isPlaying: boolean;
  playInRange: (startTime: number, endTime: number) => void;
  lyrics: Lyric[];
  currentLyricIndex: number;
  updateCurrentLyricIndex: (index: number) => void;
  handleShowKaraokeMode: (mode: "karaoke" | "read") => void;
  handleShowSentenceMode: (mode: "karaoke" | "read") => void;
  previousMode: "karaoke" | "read" | "";
};

export default function SentenceMode({
  isPlaying,
  playInRange,
  lyrics,
  currentLyricIndex,
  updateCurrentLyricIndex,
  handleShowKaraokeMode,
  handleShowSentenceMode,
  previousMode,
}: SentenceModeProps) {
  const currentLyric = lyrics[currentLyricIndex];

  //   useEffect(() => {
  //     console.log(currentLyric)
  //   }, [currentLyricIndex, currentLyric]);

  const handlePlayNextLyric = (currentLyricIndex: number) => {
    if (isPlaying || currentLyricIndex > lyrics.length - 1) return;
    updateCurrentLyricIndex(currentLyricIndex + 1);

    const nextLyric = lyrics[currentLyricIndex + 1];
    playInRange(nextLyric.start_time, nextLyric.end_time);
  };

  const handleGoBackToPreviousMode = () => {
    if (previousMode === "karaoke") {
      console.log("back to karaoke");
      handleShowKaraokeMode("karaoke");
      return;
    }

    if (previousMode === "read") {
      console.log("back to read");
      handleShowSentenceMode("read");
    }
  };

  return (
    <>
      <main>
        <div>{previousMode}</div>
        <div className="max-w-[396px] w-full px-2 mx-auto space-y-4 flex flex-col overflow-y-auto">
          <p>{currentLyric.text}</p>
          <div>
            <p className="text-sm text-slate-400">{currentLyric.translation}</p>
          </div>
        </div>
      </main>
      <footer>
        <div className="max-w-[396px] w-[95%] mx-auto px-4 pt-4 space-y-4">
          <div className="play-pause-toggler flex justify-between items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoBackToPreviousMode}
            >
              <CornerDownLeft className="scale-150" />
            </Button>
            <Button variant="ghost" size="sm">
              <MessageCircleQuestion className="scale-150" />
            </Button>
            <Button
              size="icon"
              className="bg-white hover:bg-slate-100 border border-black w-12 h-12 rounded-full"
              onClick={() =>
                playInRange(currentLyric.start_time, currentLyric.end_time)
              }
            >
              {isPlaying ? (
                <Pause fill="black" strokeWidth={2} stroke="black" />
              ) : (
                <Play fill="black" strokeWidth={4} stroke="black" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePlayNextLyric(currentLyricIndex)}
            >
              <StepForward className="scale-150" />
            </Button>
          </div>
        </div>
      </footer>
    </>
  );
}
