import type { Lyric } from "@/types/lyrics";
import { Slider } from "./ui/slider";
import InteractiveTranslation from "./InteractiveTranslation";

export default function SentenceMode({
  lyrics,
  currentLyricIndex,
  handleShowSentenceMode,
  playInRange,
  nextLyric,
  prevLyric,
  playing,
  lyricStep,
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
    if (currentLyricIndex < lyrics.length - 1) {
      nextLyric();
      playInRange(lyric.startTime, lyric.endTime);
    } else {
      console.log("end")
    }
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
        onValueChange={(value) => lyricStep(value[0])}
      />
      {/* <p>{currentLyric.text}</p> */}
      <InteractiveTranslation
        text={currentLyric.text}
        ipa={currentLyric.ipa}
        translation={currentLyric.translation}
      />
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
