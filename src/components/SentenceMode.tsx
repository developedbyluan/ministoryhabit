import type { Lyric } from "@/types/lyrics";

export default function SentenceMode({
  lyrics,
  currentLyricIndex,
  handleShowSentenceMode,
  playInRange,
  playNext,
  playPrev,
  playing,
}: {
  lyrics: Lyric[];
  currentLyricIndex: number;
  handleShowSentenceMode: () => void;
  playInRange: (startTime: number, endTime: number) => void;
  playNext: () => void;
  playPrev: () => void;
  playing: boolean;
}) {
  const currentLyric = lyrics[currentLyricIndex];

  function handlePlayInRange() {
    playInRange(currentLyric.startTime, currentLyric.endTime);
  }
  return (
    <main>
      <p>{currentLyric.text}</p>
      <button onClick={() => playNext()} disabled={currentLyricIndex > lyrics.length - 2}>Next</button>
      <button onClick={() => handlePlayInRange()}>
        {playing ? "Pause" : "Play"}
      </button>
      <button onClick={() => playPrev()} disabled={currentLyricIndex < 1}>Prev</button>
      <button onClick={handleShowSentenceMode}>Hide Sentence mode</button>
    </main>
  );
}
