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
  const [duration, setDuration] = useState(audioDuration);

  // TODO: SentenceMode component
  const [currentLyricIndex, setCurrentLyricIndex] = useState<number>(0);
  const endTimeRef = useRef<number>(-1);

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

  const lyricStep = (step: number) => {
    const audioElement = audio.current
    if(!audioElement) return

    setCurrentLyricIndex(step);

    // TODO: edge case
    audioElement.pause()    
    setPlaying(false)
  };

  useEffect(() => {
    const audioElement = audio.current;
    if (!audioElement) return;

    const setAudioTime = () => {
      setCurrentTime(audioElement.currentTime);
    };
    const setAudioMetadata = () => {
      setDuration(audioElement.duration);
    };

    audioElement.addEventListener("timeupdate", setAudioTime);
    audioElement.addEventListener("loadedmetadata", setAudioMetadata);

    if (playing) {
      audioElement.play();
    } else {
      audioElement.pause();
    }

    return () => {
      audioElement.removeEventListener("timeupdate", setAudioTime);
      audioElement.addEventListener("loadedmetadata", setAudioMetadata);
    };
  }, [playing]);

  useEffect(() => {
    const audioElement = audio.current;
    if (!audioElement) return;

    if (currentTime >= duration) {
      audioElement.currentTime = 0;
      audioElement.pause();
      setPlaying(false);
    }

    // TODO: SentenceMode
    if (endTimeRef.current !== -1 && currentTime >= endTimeRef.current) {
      audioElement.pause();
      setPlaying(false);
      endTimeRef.current = -1;
    }
  }, [currentTime, duration]);

  // TODO: SentenceMode
  function updateCurrentLyricIndex(index: number) {
    setCurrentLyricIndex(index);
  }

  function playInRange(startTime: number, endTime: number) {
    const audioElement = audio.current;
    if (!audioElement) return;

    if (playing) {
      audioElement.pause();
      endTimeRef.current = -1;
      setPlaying(false);
      return;
    }
    audioElement.currentTime = startTime;
    audioElement.play();
    setPlaying(true);
    endTimeRef.current = endTime - 0.4;
  }

  function nextLyric() {
    setCurrentLyricIndex((prev) => prev + 1);
  }

  function prevLyric() {
    setCurrentLyricIndex((prev) => prev - 1);
  }

  function handlePause() {
    const audioElement = audio.current;
    if (!audioElement) return;

    audioElement.pause();
    setPlaying(false);
  }

  return {
    playing,
    handlePause,
    duration,
    currentTime,
    togglePlay,
    seek,
    currentLyricIndex,
    updateCurrentLyricIndex,
    playInRange,
    nextLyric,
    prevLyric,
    lyricStep
  };
}
