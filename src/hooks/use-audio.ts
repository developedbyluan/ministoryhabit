import { useEffect, useRef, useState } from "react";

export function useAudio(
  url: string,
  startTime: number,
  audioDuration: number
) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(startTime);
  // const duration = audioDuration;
  const [duration, setDuration] = useState(audioDuration)

  useEffect(() => {
    // Initialize audio only on client side
    audio.current = new Audio(url);
  }, [url]);

  const togglePlay = () => setPlaying((prev) => !prev);

  const seek = (time: number) => {
    const audioElement = audio.current;
    if (!audioElement) return;
    audioElement.currentTime = time;
  };

  useEffect(() => {
    const audioElement = audio.current;
    if (!audioElement) return;

    const setAudioTime = () => {
      setCurrentTime(audioElement.currentTime);
    };
    const setAudioMetadata = () => {
      setDuration(audioElement.duration)
    }

    audioElement.addEventListener("timeupdate", setAudioTime);
    audioElement.addEventListener("loadedmetadata", setAudioMetadata)

    if (playing) {
      audioElement.play();
    } else {
      audioElement.pause();
    }

    return () => {
      audioElement.removeEventListener("timeupdate", setAudioTime);
      audioElement.addEventListener("loadedmetadata", setAudioMetadata)
    };
  }, [playing]);

  useEffect(() => {
    const audioElement = audio.current
    if(!audioElement) return

    if (currentTime >= duration) {
      audioElement.currentTime = 0;
      audioElement.pause();
      setPlaying(false);
    }
  }, [currentTime]);

  return { playing, duration, currentTime, togglePlay, seek };
}
