import type { Lyric } from "@/types/lyrics";
import { Slider } from "./ui/slider";

export default function SentenceMode({
  lyrics,
  currentLyricIndex,
  handleShowSentenceMode,
  playInRange,
  nextLyric,
  prevLyric,
  playing,
  lyricStep
}: {
  lyrics: Lyric[];
  currentLyricIndex: number;
  handleShowSentenceMode: () => void;
  playInRange: (startTime: number, endTime: number) => void;
  nextLyric: () => void;
  prevLyric: () => void;
  playing: boolean;
  lyricStep: (step: number) => void;
}) {
  const currentLyric = lyrics[currentLyricIndex];

  function handlePlayInRange() {
    playInRange(currentLyric.startTime, currentLyric.endTime);
  }

  function handlePlayNext() {
    const lyric = lyrics[currentLyricIndex + 1];
    nextLyric();
    playInRange(lyric.startTime, lyric.endTime);
  }

  function handlePlayPrev() {
    const lyric = lyrics[currentLyricIndex - 1];
    prevLyric();
    playInRange(lyric.startTime, lyric.endTime);
  }
  return (
    <main>
      <Slider
        className="max-w-[300px]"
        value={[currentLyricIndex]}
        max={lyrics.length - 1}
        step={1}
        onValueChange={value => lyricStep(value[0])}
      />
      <p>{currentLyric.text}</p>
      <button
        onClick={() => handlePlayNext()}
        disabled={currentLyricIndex > lyrics.length - 2 || playing}
      >
        Next
      </button>
      <button onClick={() => handlePlayInRange()}>
        {playing ? "Pause" : "Play"}
      </button>
      <button
        onClick={() => handlePlayPrev()}
        disabled={currentLyricIndex < 1 || playing}
      >
        Prev
      </button>
      <button onClick={handleShowSentenceMode}>Hide Sentence mode</button>
    </main>
  );
}
