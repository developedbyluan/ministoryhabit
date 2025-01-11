"use client";

import LyricsDisplay from "@/components/LyricsDisplay";
import LyricsModeControls from "@/components/LyricsModeControls";
import { useAudio } from "@/hooks/use-audio";

import { sampleData } from "@/db/sample-data";
import { useState } from "react";
import SentenceDisplay from "@/components/SentenceDisplay";
import SentenceModeControls from "@/components/SentenceModeControls";

export default function AudioPlayerPage() {
  const audioUrl = sampleData.audioUrl;
  // TODO: will be retrieved from database where the previous time the user left the app
  const startTime = 0;
  const audioDuration = sampleData.metaData.duration;

  const lyrics = sampleData.lyrics;

  const { playing, togglePlay, duration, currentTime, seek } = useAudio(
    audioUrl,
    startTime,
    audioDuration
  );

  // TODO: PREPARE FOR SHOWING `SENTENCE MODE`
  const [showSentenceMode, setShowSentenceMode] = useState<boolean>(false);

  function handleShowSentenceMode() {
    setShowSentenceMode(true);
  }

  return (
    <main>
      {showSentenceMode ? (
        <>
          <SentenceDisplay />
          <SentenceModeControls />
        </>
      ) : (
        <>
          <LyricsDisplay lyrics={lyrics} currentTime={currentTime} />
          {/* Lyrics Mode Controls */}
          <LyricsModeControls
            playing={playing}
            togglePlay={togglePlay}
            duration={duration}
            currentTime={currentTime}
            seek={seek}
            handleShowSentenceMode={handleShowSentenceMode}
          />
        </>
      )}
    </main>
  );
}
