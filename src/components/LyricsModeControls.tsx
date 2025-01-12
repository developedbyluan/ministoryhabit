import { Slider } from "@/components/ui/slider";

export default function LyricsModeControls({
  duration,
  currentTime,
  togglePlay,
  playing,
  seek,
  handleShowSentenceMode,
  handlePause,
}: {
  duration: number;
  currentTime: number;
  togglePlay: () => void;
  playing: boolean;
  seek: (time: number) => void;
  handleShowSentenceMode: () => void;
  handlePause: () => void;
}) {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <p>duration: {formatTime(duration)}</p>
      <p>current time: {formatTime(currentTime)}</p>
      <Slider
        className="max-w-[300px]"
        value={[currentTime]}
        max={duration}
        step={1}
        onValueChange={(value) => seek(value[0])}
      />
      <div>
        <button onClick={() => togglePlay()}>{playing ? "Pause" : "Play"}</button>
        <button
          onClick={() => {
            handlePause();
            handleShowSentenceMode();
          }}
        >
          Show Sentence Mode
        </button>
      </div>
    </>
  );
}
