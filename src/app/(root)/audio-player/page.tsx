"use client";

import LyricsDisplay from "@/components/LyricsDisplay";
import LyricsModeControls from "@/components/LyricsModeControls";
import { useAudio } from "@/hooks/use-audio";

import { sampleData } from "@/db/sample-data";
import { useState } from "react";
import SentenceMode from "@/components/SentenceMode";

export default function AudioPlayerPage() {
  const audioUrl = sampleData.audioUrl;
  // TODO: will be retrieved from database where the previous time the user left the app
  const startTime = 0;
  const audioDuration = sampleData.metaData.duration;

  const lyrics = sampleData.lyrics;

  const {
    playing,
    handlePause,
    togglePlay,
    handleLyricClick,
    duration,
    currentTime,
    seek,
    currentLyricIndex,
    updateCurrentLyricIndex,
    playInRange,
    nextLyric,
    prevLyric,
    lyricStep
  } = useAudio(audioUrl, startTime, audioDuration);

  // TODO: PREPARE FOR SHOWING `SENTENCE MODE`
  const [showSentenceMode, setShowSentenceMode] = useState<boolean>(false);

  function handleShowSentenceMode() {
    setShowSentenceMode((prev) => !prev);
  }
  // TODO: Check if lyrics available before render UI

  return (
    <main>
      {showSentenceMode ? (
        <>
          <SentenceMode
            lyrics={lyrics}
            currentLyricIndex={currentLyricIndex}
            handleShowSentenceMode={handleShowSentenceMode}
            playInRange={playInRange}
            nextLyric={nextLyric}
            prevLyric={prevLyric}
            playing={playing}
            lyricStep={lyricStep}
          />
        </>
      ) : (
        <>
          <LyricsDisplay
            lyrics={lyrics}
            currentTime={currentTime}
            updateCurrentLyricIndex={updateCurrentLyricIndex}
            handleLyricClick={handleLyricClick}
          />
          {/* Lyrics Mode Controls */}
          <LyricsModeControls
            playing={playing}
            togglePlay={togglePlay}
            duration={duration}
            currentTime={currentTime}
            seek={seek}
            handleShowSentenceMode={handleShowSentenceMode}
            handlePause={handlePause}
          />
        </>
      )}
    </main>
  );
}
