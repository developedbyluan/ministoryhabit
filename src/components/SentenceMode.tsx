import type { Lyric } from "@/types/lyrics";

export default function SentenceMode({
  lyrics,
  curretLyricIndex,
  handleShowSentenceMode,
  playInRange
}: {
  lyrics: Lyric[];
  curretLyricIndex: number;
  handleShowSentenceMode: () => void;
  playInRange: (startTime: number, endTime: number) => void;
}) {
  const currentLyric = lyrics[curretLyricIndex];

  function handlePlayInRange() {
    playInRange(currentLyric.startTime, currentLyric.endTime)
  }
  return (
    <main>
      <p>{currentLyric.text}</p>
      <button onClick={() => handlePlayInRange()}>Play</button>
      <button onClick={handleShowSentenceMode}>Hide Sentence mode</button>
    </main>
  );
}
