import { Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X, TvMinimalPlay, TextSearch, Play, Pause } from "lucide-react";
import { Ref } from "react";

type ReadModeProps = {
  videoRef: Ref<HTMLVideoElement>,
  progress: number,
  isPlaying: boolean,
  duration: number,
  handleProgressChange: (newProgress: number) => void,
  togglePlay: () => void
}
export default function ReadMode({
  videoRef,
  progress,
  isPlaying,
  duration,
  handleProgressChange,
  togglePlay
}: ReadModeProps) {
  return (
    <div className="max-h-full py-4 flex flex-col justify-between">
      <header>
        <div className="max-w-[576px] w-[95%] mx-auto flex justify-between items-center gap-4 pb-4">
          <Button variant="ghost">
            <X className="scale-150" />
          </Button>
          <Slider
            value={[progress]}
            max={duration}
            step={1}
            onValueChange={(value) => handleProgressChange(value[0])}
            className="flex-grow"
          />
          <Button variant="ghost">
            <Languages className="scale-150" />
          </Button>
        </div>
      </header>
      <main className="flex-grow overflow-y-auto">
        <div className="max-w-[576px] w-[95%] mx-auto px-6 space-y-4">
          <div className="max-w-3xl mx-auto">
            <video
              ref={videoRef}
              // src={src}
              className="w-full rounded-lg shadow-lg"
              playsInline
            />
          </div>
        </div>
        {/* <div className="max-w-[576px] w-[95%] mx-auto px-6 space-y-4">
          <div className="my-4 text-center border border-red-400 flex flex-wrap">
            {words.map((word: Word) => (
              <div key={word.index} className="flex flex-col items-center mt-2">
                <span className="text-xs text-slate-400">
                  {ipaArr[word.index]}
                </span>
                <span className="px-2 cursor-pointer bg-blue-100">
                  {word.word}
                </span>
              </div>
            ))}
          </div>
        </div> */}
      </main>
      <footer>
        <div className="max-w-[576px] w-[95%] mx-auto px-4 pt-4">
          <div className="play-pause-toggler flex justify-between items-center">
            <Button variant="outline" size="sm">
              <TvMinimalPlay className="scale-150" />
            </Button>
            <Button
              size="icon"
              className="bg-white hover:bg-slate-100 border w-12 h-12 rounded-full"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause fill="black" strokeWidth={2} stroke="black" />
              ) : (
                <Play fill="black" strokeWidth={4} stroke="black" />
              )}
            </Button>
            <Button variant="outline" size="sm">
              <TextSearch className="scale-150" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}
