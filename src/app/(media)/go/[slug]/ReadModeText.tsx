import { useEffect, useRef } from "react";
import ReadModeTextTranslation from "./ReadModeTextTranslation";
import ReadModeBadge from "./ReadModeBadge";

type Word = {
  word: string;
  index: number;
};

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

type ReadModeTextProps = {
  lyrics: Lyric[];
  currentTime: number;
  updateCurrentLyricIndex: (index: number) => void;
  showIPA: boolean;
  handlePause: (startTime: number, index: number) => void;
  lessonData: LessonData[];
};

export default function ReadModeText({
  lyrics,
  currentTime,
  updateCurrentLyricIndex,
  showIPA,
  handlePause,
  lessonData,
}: ReadModeTextProps) {
  const lyricsArrayRef = useRef<HTMLDivElement>(null);
  const prevLyricIndexRef = useRef<number>(0);

  useEffect(() => {
    const currentLyricIndex = lyrics.findIndex((lyric: Lyric) => {
      return currentTime >= lyric.start_time && currentTime < lyric.end_time;
    });
    // console.log(currentLyricIndex)

    if (currentLyricIndex === prevLyricIndexRef.current) return;

    prevLyricIndexRef.current = currentLyricIndex;

    if (currentLyricIndex != -1 && lyricsArrayRef.current) {
      const lyricElement = lyricsArrayRef.current.children[currentLyricIndex];

      lyricElement.scrollIntoView({ behavior: "smooth", block: "nearest" });

      updateCurrentLyricIndex(currentLyricIndex);
    }
  }, [currentTime, lyrics]);

  return (
    <div
      ref={lyricsArrayRef}
      className="max-w-[576px] w-[95%] mx-auto px-6 space-y-8 flex flex-col"
    >
      {lessonData.length > 0 && (
        <ReadModeBadge
          imageUrl={lessonData[0].thumbnail_url}
          title={lessonData[0].title}
          seriesId={lessonData[0].seriesId}
        />
      )}
      {lyrics.map((lyric, index) => {
        const words: Word[] = lyric.text
          .split(" ")
          .map((word, index) => ({ word, index }));
        const ipaArr = lyric.ipa.split(" ");
        // console.log(words)
        const wordsElement = words.map((word: Word) => (
          <div key={word.index} className="flex flex-col items-center mt-2">
            <span
              className={`${showIPA ? "" : "hidden"} text-xs text-slate-400`}
            >
              {ipaArr[word.index]}
            </span>
            <span
              className={`px-1 cursor-pointer ${
                currentTime >= lyric.start_time && currentTime < lyric.end_time
                  ? "border-b-2 border-red-100"
                  : ""
              }`}
            >
              {word.word}
            </span>
          </div>
        ));

        return (
          <ReadModeTextTranslation
            key={index}
            index={index}
            wordsElement={wordsElement}
            lyric={lyric}
            handlePause={handlePause}
          />
        );
      })}
    </div>
  );
}
