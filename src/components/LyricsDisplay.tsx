import { useEffect, useRef } from "react";

export default function LyricsDisplay({
  lyrics,
  currentTime,
}: {
  lyrics: any;
  currentTime: number;
}) {
  const lyricsArrayRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const currentLyricIndex = lyrics.findIndex((lyric) => {
      return currentTime >= lyric.startTime && currentTime < lyric.endTime;
    });
    if (currentLyricIndex != -1 && lyricsArrayRef.current) {
      const lyricElement = lyricsArrayRef.current.children[currentLyricIndex];

      lyricElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentTime]);

  return (
    <div ref={lyricsArrayRef} className="h-48 overflow-y-auto">
      {lyrics.map((lyric, index: number) => {
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
