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

type ReadModeTextProps = {
  lyrics: Lyric[];
  currentTime: number;
  updateCurrentLyricIndex: (index: number) => void;
  showIPA: boolean;
  handlePause: (startTime: number, index: number) => void;
};

export default function ReadModeText({
  lyrics,
  currentTime,
  updateCurrentLyricIndex,
  showIPA,
  handlePause,
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
      <ReadModeBadge
        imageUrl="https://res.cloudinary.com/dqssqzt3y/image/upload/v1738044857/hq720_n1kejk.avif"
        title="Bài phát biểu nhậm chức đầy đủ năm 2025 của Tổng thống Donald Trump"
        seriesTitle="Học tiếng Anh với loạt nội dung thôi miên"
      />
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
