import { useEffect, useRef } from "react";

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

type KaraokeModeTextProps = {
  lyrics: Lyric[];
  currentTime: number;
  updateCurrentLyricIndex: (index: number) => void;
  lessonData: LessonData[];
  showTranslation: boolean;
};

export default function KaraokeModeText({
  lyrics,
  currentTime,
  updateCurrentLyricIndex,
  showTranslation,
}: KaraokeModeTextProps) {
  const lyricsArrayRef = useRef<HTMLDivElement>(null);
  const prevLyricIndexRef = useRef<number>(0);

  useEffect(() => {
    const currentLyricIndex = lyrics.findIndex((lyric: Lyric) => {
      return currentTime >= lyric.start_time && currentTime < lyric.end_time;
    });

    // if (currentLyricIndex === prevLyricIndexRef.current) return;

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
      className="max-w-[576px] w-full mx-auto px-6 space-y-8 flex flex-col overflow-y-auto h-72"
    >
      {lyrics.map((lyric, index) => {
        const { text, translation } = lyric;
        return (
          <div
            key={index}
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
