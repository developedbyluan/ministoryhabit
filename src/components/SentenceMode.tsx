import type { Lyric } from "@/types/lyrics";

export default function SentenceMode({
  lyrics,
  currentLyricIndex,
  handleShowSentenceMode,
  playInRange,
  nextLyric,
  prevLyric,
  playing,
}: {
  lyrics: Lyric[];
  currentLyricIndex: number;
  handleShowSentenceMode: () => void;
  playInRange: (startTime: number, endTime: number) => void;
  nextLyric: () => void;
  prevLyric: () => void;
  playing: boolean;
}) {
  const currentLyric = lyrics[currentLyricIndex];

  function handlePlayInRange() {
    playInRange(currentLyric.startTime, currentLyric.endTime);
  }

  function handlePlayNext() {
    const lyric = lyrics[currentLyricIndex + 1];
    nextLyric()
    playInRange(lyric.startTime, lyric.endTime);
  }


  function handlePlayPrev() {
    const lyric = lyrics[currentLyricIndex - 1];
    prevLyric()
    playInRange(lyric.startTime, lyric.endTime);
  }
  return (
    <main>
      <p>{currentLyric.text}</p>
      <button
        onClick={() => handlePlayNext()}
        disabled={currentLyricIndex > lyrics.length - 2}
      >
        Next
      </button>
      <button onClick={() => handlePlayInRange()}>
        {playing ? "Pause" : "Play"}
      </button>
      <button onClick={() => handlePlayPrev()} disabled={currentLyricIndex < 1}>
        Prev
      </button>
      <button onClick={handleShowSentenceMode}>Hide Sentence mode</button>
    </main>
  );
}
