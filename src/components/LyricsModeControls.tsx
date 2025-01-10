export default function LyricsModeControls({
  duration,
  currentTime,
  togglePlay,
  playing,
}: {
  duration: number;
  currentTime: number;
  togglePlay: () => void;
  playing: boolean;
}) {
  return (
    <>
      <p>duration: {duration}</p>
      <p>current time: {currentTime}</p>
      <div>
        <button onClick={togglePlay}>{playing ? "Pause" : "Play"}</button>
      </div>
    </>
  );
}
