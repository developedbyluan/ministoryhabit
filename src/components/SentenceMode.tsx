import type { Lyric } from "@/types/lyrics";

export default function SentenceMode({
  lyrics,
  curretLyricIndex,
  handleShowSentenceMode,
  playInRange,
  playing,
}: {
  lyrics: Lyric[];
  curretLyricIndex: number;
  handleShowSentenceMode: () => void;
  playInRange: (startTime: number, endTime: number) => void;
  playing: boolean;
}) {
  const currentLyric = lyrics[curretLyricIndex];

  function handlePlayInRange() {
    playInRange(currentLyric.startTime, currentLyric.endTime);
  }
  return (
    <main>
      <p>{currentLyric.text}</p>
      <button onClick={() => handlePlayInRange()}>
        {playing ? "Pause" : "Play"}
      </button>
      <button onClick={handleShowSentenceMode}>Hide Sentence mode</button>
    </main>
  );
}
