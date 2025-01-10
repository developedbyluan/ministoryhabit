import { Slider } from "@/components/ui/slider";

export default function LyricsModeControls({
  duration,
  currentTime,
  togglePlay,
  playing,
  seek,
}: {
  duration: number;
  currentTime: number;
  togglePlay: () => void;
  playing: boolean;
  seek: (time: number) => void;
}) {
  return (
    <>
      <p>duration: {duration}</p>
      <p>current time: {currentTime}</p>
      <Slider
        className="max-w-[300px]"
        value={[currentTime]}
        max={duration}
        step={1}
        onValueChange={(value) => seek(value[0])}
      />
      <div>
        <button onClick={togglePlay}>{playing ? "Pause" : "Play"}</button>
      </div>
    </>
  );
}
