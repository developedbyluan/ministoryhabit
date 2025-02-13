import { Button } from "@/components/ui/button";
import {
  CornerDownLeft,
  MessageCircleQuestion,
  Mic,
  MonitorDown,
  MonitorUp,
  Pause,
  Play,
  StepForward,
} from "lucide-react";
import { useState } from "react";
import { TranslatableText } from "./SentenceModeTranslatableText";
import VoiceRecorder from "./SentenceModeVoiceRecorder";

import { addToGoldlist } from "@/app/actions/add-to-goldlist";
import { useParams } from "next/navigation";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

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
  showVideoInSentenceMode: () => void;
  showVideo: boolean;
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
  showVideoInSentenceMode,
  showVideo,
}: SentenceModeProps) {
  const currentLyric = lyrics[currentLyricIndex];
  const [showTranslation, setShowTranslation] = useState<boolean>(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState<boolean>(false);

  const { user } = useKindeBrowserClient();

  const handlePlayNextLyric = (currentLyricIndex: number) => {
    if (isPlaying || currentLyricIndex > lyrics.length - 2) {
      toast({
        title: "✅ End!",
        description: "You're at the end of the lesson.",
      });
      return;
    }
    updateCurrentLyricIndex(currentLyricIndex + 1);

    try {
      const nextLyric = lyrics[currentLyricIndex + 1];
      playInRange(nextLyric.start_time, nextLyric.end_time);
    } catch (err) {
      console.log(err);
    }
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

  const handleShowVoiceRecorder = () => {
    setShowVoiceRecorder((prev) => !prev);
  };

  const params: { slug: string } = useParams();
  const handleAddToGoldlist = async (
    originalChunk: string,
    newChunk: string
  ) => {
    const { error } = await addToGoldlist(
      currentLyric.text,
      originalChunk,
      newChunk,
      params.slug,
      currentLyricIndex,
      user?.id || "xxx",
      currentLyric.start_time,
      currentLyric.end_time
    );

    if (error) {
      // console.log(error);
      // setErrorMessage
      return false;
    }

    // console.log(data);
    return true;
  };

  return (
    <>
      <main className="relative overflow-y-auto space-y-4 px-4">
        <div className="flex justify-center mb-auto">
          <Button variant="outline" size="sm" onClick={showVideoInSentenceMode}>
            {showVideo ? (
              <MonitorDown className="scale-150" />
            ) : (
              <MonitorUp className="scale-150" />
            )}
          </Button>
        </div>
        <div className="max-w-[396px] w-full px-2 mx-auto space-y-4 flex flex-col overflow-y-auto">
          {isPlaying ? (
            <span className="leading-relaxed text-lg">{currentLyric.text}</span>
          ) : (
            <TranslatableText
              text={currentLyric.text}
              handleAddToGoldlist={handleAddToGoldlist}
            />
          )}
          {showVoiceRecorder && <VoiceRecorder />}
          <div>
            {showTranslation ? (
              <p
                role="button"
                aria-label="hide translation"
                className="text-slate-500 hover:font-semibold text-xs"
                onClick={() => setShowTranslation(false)}
              >
                {currentLyric.translation}
              </p>
            ) : (
              <p
                role="button"
                aria-label="show translation"
                className="text-slate-500 hover:font-semibold text-xs"
                onClick={() => setShowTranslation(true)}
              >
                Translate Sentence
              </p>
            )}
          </div>
        </div>
      </main>
      <footer className="mt-auto">
        <div className="max-w-[396px] w-[95%] mx-auto px-4 pt-4 space-y-4">
          <div className="play-pause-toggler flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGoBackToPreviousMode}
            >
              <CornerDownLeft className="scale-150" />
            </Button>
            <Button variant="ghost" size="sm" disabled>
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
            <Button variant="ghost" size="sm" onClick={handleShowVoiceRecorder}>
              <Mic className="scale-150" />
            </Button>
          </div>
        </div>
      <Toaster />
      </footer>
    </>
  );
}
