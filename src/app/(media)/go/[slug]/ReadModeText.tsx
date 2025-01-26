import { useEffect, useRef } from "react";

type Word = {
  word: string;
  index: number;
};

type Lyric = { startTime: number; endTime: number; text: string; ipa: string };

type ReadModeTextProps = {
  lyrics: Lyric[];
  currentTime: number;
  updateCurrentLyricIndex: (index: number) => void;
};
export default function ReadModeText({ lyrics, currentTime, updateCurrentLyricIndex }: ReadModeTextProps) {
  const lyricsArrayRef = useRef<HTMLDivElement>(null);
  const prevLyricIndexRef = useRef<number>(0)
  
  useEffect(() => {
    const currentLyricIndex = lyrics.findIndex((lyric: Lyric) => {
      return currentTime >= lyric.startTime && currentTime < lyric.endTime;
    });
    // console.log(currentLyricIndex)

    if (currentLyricIndex === prevLyricIndexRef.current) return

    prevLyricIndexRef.current = currentLyricIndex

    if (currentLyricIndex != -1 && lyricsArrayRef.current) {
      const lyricElement = lyricsArrayRef.current.children[currentLyricIndex];

      lyricElement.scrollIntoView({ behavior: "smooth", block: "nearest"});

      updateCurrentLyricIndex(currentLyricIndex)
    }
  }, [currentTime, lyrics]);
  
  return (
    <div ref={lyricsArrayRef} className="max-w-[576px] w-[95%] mx-auto px-6 space-y-4 flex flex-col">
      {lyrics.map((lyric, index) => {
        const words: Word[] = lyric.text
          .split(" ")
          .map((word, index) => ({ word, index }));
        const ipaArr = lyric.ipa.split(" ");
        // console.log(words)
        const wordsElement = words.map((word: Word) => (
          <div key={word.index} className="flex flex-col items-center mt-2">
            <span className="text-xs text-slate-400">{ipaArr[word.index]}</span>
            <span className="px-2 cursor-pointer">{word.word}</span>
          </div>
        ));
        return (
          <div key={index}
          className={`flex flex-wrap ${
            currentTime >= lyric.startTime && currentTime < lyric.endTime
              ? "font-semibold"
              : ""
          }`}
          >
            {wordsElement}
          </div>
        );
      })}
    </div>
  );
}
