"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useParams, useSearchParams } from "next/navigation";
import {
  Languages,
  Play,
  X,
  TvMinimalPlay,
  TextSearch,
  Pause,
} from "lucide-react";

import { useVideo } from "@/hooks/use-video";
import ReadMode from "./ReadMode";

type Word = {
  word: string;
  index: number;
};

const lyric = {
  text: "It's five o'clock and Allen is riding his motorcycle in San Francisco.",
  ipa: "ɪts faɪv əˈklɑk ænd ˈælən ɪz ˈraɪdɪŋ hɪz ˈmoʊtərˌsaɪkəl ɪn ˌsæn frænˈsɪskoʊ.",
  translation: "Bây giờ là năm giờ và Allen đang chạy xe máy ở San Francisco.",
};

export default function GoPage() {
  const params = useParams<{ slug: string }>();
  const lessonSlug = params.slug;

  const searchParams = useSearchParams();
  const lineIndex = searchParams.get("i");

  // console.log("Lesson Slug:", lessonSlug);
  // console.log("Line Index:", lineIndex);

  const src =
    "https://res.cloudinary.com/dqssqzt3y/video/upload/v1737861394/xitrum-25-ttpb_vhapji.mp4";

  //
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
    lyrics
  } = useVideo({ src });

  

  return (
    <>
      <ReadMode
        videoRef={videoRef}
        progress={progress}
        isPlaying={isPlaying}
        duration={duration}
        handleProgressChange={handleProgressChange}
        togglePlay={togglePlay}
        lyrics={lyrics}
      />
    </>
  );
}
