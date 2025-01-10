import { useEffect, useRef, useState } from "react";

export function useAudio(url: string, startTime: number, audioDuration: number) {
  const audio = useRef(new Audio(url));
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(audioDuration);
  const [currentTime, setCurrentTime] = useState(startTime);

  const togglePlay = () => setPlaying((prev) => !prev);

  useEffect(() => {
    const audioElement = audio.current;

    const setAudioTime = () => {
      setCurrentTime(audioElement.currentTime);
    };

    audioElement.addEventListener("timeupdate", setAudioTime);

    playing ? audioElement.play() : audioElement.pause();

    return () => {
    audioElement.addEventListener("timeupdate", setAudioTime)
    };
  }, [playing]);

  return { playing, duration, currentTime, togglePlay };
}
