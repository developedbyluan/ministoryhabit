import { useEffect, useRef } from "react";
import type { LessonData } from "@/types";

type Lyric = {
  start_time: number;
  end_time: number;
  text: string;
  ipa: string;
  translation: string;
};

type KaraokeModeTextProps = {
  lyrics: Lyric[];
  currentTime: number;
  updateCurrentLyricIndex: (index: number) => void;
  lessonData: LessonData;
  showTranslation: boolean;
  handlePlay: (startTime: number, index: number) => void;
};

export default function KaraokeModeText({
  lyrics,
  currentTime,
  updateCurrentLyricIndex,
  showTranslation,
  handlePlay
}: KaraokeModeTextProps) {
  const lyricsArrayRef = useRef<HTMLDivElement>(null);
  const prevLyricIndexRef = useRef<number>(0);

  useEffect(() => {
    const currentLyricIndex = lyrics.findIndex((lyric: Lyric) => {
      return currentTime >= lyric.start_time && currentTime < lyric.end_time;
    });

    if (currentLyricIndex === prevLyricIndexRef.current) return;

    prevLyricIndexRef.current = currentLyricIndex;

    if (currentLyricIndex != -1 && lyricsArrayRef.current) {
      const lyricElement = lyricsArrayRef.current.children[currentLyricIndex];

      lyricElement.scrollIntoView({ behavior: "smooth", block: "center" });

      updateCurrentLyricIndex(currentLyricIndex);
    }
  }, [currentTime, lyrics]);

  return (
    <div
      ref={lyricsArrayRef}
      className="max-w-[396px] w-full mx-auto px-6 space-y-8 flex flex-col overflow-y-auto"
    >
      {lyrics.map((lyric, index) => {
        const { text, translation } = lyric;
        return (
          <div
            key={index}
            role="button"
            onClick={() => handlePlay(lyric.start_time, index)}
            className={`${
              currentTime >= lyric.start_time && currentTime < lyric.end_time
                ? "font-bold text-2xl"
                : "text-slate-300 text-xl"
            }`}
          >
            {!showTranslation ? (
              <p>{text}</p>
            ) : (
              <p>{translation}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
