import { useEffect, useRef } from "react";
import type { Lyric } from "@/types/lyrics";

export default function LyricsDisplay({
  lyrics,
  currentTime,
}: {
  lyrics: Lyric[];
  currentTime: number;
}) {
  const lyricsArrayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentLyricIndex = lyrics.findIndex((lyric: Lyric) => {
      return currentTime >= lyric.startTime && currentTime < lyric.endTime;
    });
    if (currentLyricIndex != -1 && lyricsArrayRef.current) {
      const lyricElement = lyricsArrayRef.current.children[currentLyricIndex];

      lyricElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentTime, lyrics]);

  return (
    <div ref={lyricsArrayRef} className="h-48 overflow-y-auto">
      {lyrics.map((lyric: Lyric, index: number) => {
        return (
          <p
            key={index}
            className={`text-2xl mb-4 ${
              currentTime >= lyric.startTime && currentTime < lyric.endTime
                ? "text-2xl font-bold"
                : "text-gray-200"
            }`}
          >
            {lyric.text}
          </p>
        );
      })}
    </div>
  );
}
