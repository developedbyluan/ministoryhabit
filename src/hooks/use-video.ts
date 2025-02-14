import { useReducer, useRef, useEffect } from "react";

import { subCrafter } from "@/utils/subcrafter";
import {
  // getIndexFromLocalStorage,
  storeIndexToLocalStorage,
  storeTotalPlayTimeToLocalStorage,
} from "@/utils/storeDataToLocalStorage";
import { addSentenceToLocalStorage } from "@/utils/addSentenceToLocalStorage";

type SubtitleItem = {
  id: number;
  start_time: number;
  end_time: number;
  text: string;
  ipa: string;
  translation: string;
};

interface VideoState {
  isPlaying: boolean;
  progress: number;
  duration: number;
  playbackRate: number;
  currentLyric: string;
  currentLyricIndex: number;
  lyrics: SubtitleItem[];
}

type VideoAction =
  | { type: "TOGGLE_PLAY" }
  | { type: "SET_PROGRESS"; payload: number }
  | { type: "SET_DURATION"; payload: number }
  | { type: "SET_PLAYBACK_RATE"; payload: number }
  | { type: "SET_CURRENT_LYRIC"; payload: string }
  | { type: "SET_CURRENT_LYRIC_INDEX"; payload: number }
  | { type: "SET_LYRICS"; payload: SubtitleItem[] };

const initialState: VideoState = {
  isPlaying: false,
  progress: 0,
  duration: 0,
  playbackRate: 1,
  currentLyric: "",
  currentLyricIndex: 0,
  lyrics: [],
};

function videoReducer(state: VideoState, action: VideoAction): VideoState {
  switch (action.type) {
    case "TOGGLE_PLAY":
      return { ...state, isPlaying: !state.isPlaying };
    case "SET_PROGRESS":
      return { ...state, progress: action.payload };
    case "SET_DURATION":
      return { ...state, duration: action.payload };
    case "SET_PLAYBACK_RATE":
      return { ...state, playbackRate: action.payload };
    case "SET_CURRENT_LYRIC":
      return { ...state, currentLyric: action.payload };
    case "SET_CURRENT_LYRIC_INDEX":
      return { ...state, currentLyricIndex: action.payload };
    case "SET_LYRICS":
      return { ...state, lyrics: action.payload };
    default:
      return state;
  }
}

interface UseVideoProps {
  src: string;
  text: string;
  lineIndex: number | null;
  lessonSlug: string;
  playlistId: string;
  thumbnail: string
}

export function useVideo({ src, text, lineIndex, lessonSlug, playlistId, thumbnail }: UseVideoProps) {
  const [state, dispatch] = useReducer(videoReducer, initialState);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoStartTimeRef = useRef<number>(0);

  const endTimeRef = useRef<number>(-1);

  useEffect(() => {
    if (!src) return;
    if (!text) return;

    const subtitleArr: SubtitleItem[] = subCrafter(text);
    dispatch({ type: "SET_LYRICS", payload: subtitleArr });

    const video = videoRef.current;
    if (!video) return;
    // for iOS
    video.load();

    video.src = src;
    video.preload = "auto";
    video.poster = thumbnail
    const updateProgress = () => {
      dispatch({ type: "SET_PROGRESS", payload: video.currentTime });
      updateLyrics(video.currentTime);
    };

    const updateDuration = () => {
      dispatch({ type: "SET_DURATION", payload: video.duration });
    };

    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("loadedmetadata", updateDuration);
    // video.addEventListener('loadeddata', updateDuration)
    // video.addEventListener("canplay", updateDuration)

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("loadedmetadata", updateDuration);
      // video.removeEventListener('loadeddata', updateDuration)
      // video.addEventListener("canplay", updateDuration)
    };
  }, [src, text]);

  // TODO: take a pause on scroll into previous session lyric
  console.log(lineIndex)
  // useEffect(() => {
  //   // if (!lineIndex) return;
  //   if (!state.lyrics) return;
  //   // console.log(lineIndex)

  //   if (lineIndex) {
  //     const startTime = state.lyrics[lineIndex]?.start_time;
  //     if (!startTime) return;
  //     handlePause(startTime, lineIndex);
  //     return;
  //   }

  //   const previousIndex = getIndexFromLocalStorage(lessonSlug);
  //   // console.log("previousIndex", previousIndex);

  //   const startTime = state.lyrics[previousIndex]?.start_time;
  //   if (!startTime) return;
  //   handlePause(startTime, previousIndex);
  // }, [lineIndex, state.lyrics, lessonSlug]);

  useEffect(() => {
    if (!lessonSlug) return;
    if (!state.currentLyricIndex) return;

    if (state.currentLyricIndex > 0) {
      storeIndexToLocalStorage(lessonSlug, state.currentLyricIndex);
    }
  }, [state.currentLyricIndex, lessonSlug]);

  useEffect(() => {
    if(!state.currentLyricIndex) return
    const oneLyric = state.lyrics[state.currentLyricIndex];

    if (state.progress > oneLyric.end_time) {
      addSentenceToLocalStorage(oneLyric.text)
    }
  }, [state.progress, state.currentLyricIndex]);

  useEffect(() => {
    if(!playlistId) return
    if (state.isPlaying) {
      videoStartTimeRef.current = Date.now();
    } else {
      if (videoStartTimeRef.current === 0) return;
      const playingTime = Date.now() - videoStartTimeRef.current;
      // console.log("playingTime in seconds", playingTime / 1000)

      storeTotalPlayTimeToLocalStorage(lessonSlug, playingTime, playlistId);
    }
  }, [state.isPlaying, lessonSlug]);

  useEffect(
    () => () => {
      if (!endTimeRef.current) return;
      if (!state.lyrics) return;

      const videoElement = videoRef.current;
      if (!videoElement) return;

      if (state.progress >= endTimeRef.current && endTimeRef.current !== -1) {
        // console.log("end 1");
        const currentLyric = state.lyrics[state.currentLyricIndex];
        handlePause(currentLyric.start_time, state.currentLyricIndex);
        videoElement.pause();
        //  dispatch({type:"TOGGLE_PLAY"})
        // Handle edge case: isPlaying state not turning into false
        // after playInRange finished
        endTimeRef.current = -1;
      }
    },
    [state.progress, state.lyrics, state.currentLyricIndex, state.isPlaying]
  );

  useEffect(() => {
    // console.log(state.duration);
    if (state.progress >= state.duration) {
      // handlePause(state.duration, -1);
      videoRef.current?.pause();
      handleProgressChange(state.duration);
      if (state.isPlaying) {
        dispatch({ type: "TOGGLE_PLAY" });
      }
      // dispatch({type:"TOGGLE_PLAY"})
      // console.log("restart")
    }
  }, [state.progress, state.duration]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (state.isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      dispatch({ type: "TOGGLE_PLAY" });
    }
  };

  const handleProgressChange = (newProgress: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newProgress;
      dispatch({ type: "SET_PROGRESS", payload: newProgress });
    }
  };

  const handlePlaybackRateChange = (newRate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = newRate;
      dispatch({ type: "SET_PLAYBACK_RATE", payload: newRate });
    }
  };

  const updateLyrics = (currentTime: number) => {
    const currentLyric = state.lyrics.find(
      (lyric) => currentTime >= lyric.start_time && currentTime < lyric.end_time
    );
    dispatch({
      type: "SET_CURRENT_LYRIC",
      payload: currentLyric ? currentLyric.text : "",
    });
  };

  const updateCurrentLyricIndex = (index: number) => {
    dispatch({ type: "SET_CURRENT_LYRIC_INDEX", payload: index });
  };

  // Read Mode
  function handlePause(startTime: number, index: number) {
    console.log(startTime, index);
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.pause();
    handleProgressChange(startTime);
    dispatch({ type: "SET_CURRENT_LYRIC_INDEX", payload: index });

    if (state.isPlaying) {
      dispatch({ type: "TOGGLE_PLAY" });
    }
  }

  // Karaoke Mode
  function handlePlay(startTime: number, index: number) {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    handleProgressChange(startTime);
    if (videoElement.paused) {
      videoElement.play();
      dispatch({ type: "TOGGLE_PLAY" });
    }
    updateCurrentLyricIndex(index);
  }

  // Sentence Mode
  function playInRange(startTime: number, endTime: number) {
    // console.log(endTimeRef.current);
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (state.isPlaying) {
      videoElement.pause();
      endTimeRef.current = -1;
      dispatch({ type: "TOGGLE_PLAY" });
      return;
    }

    handleProgressChange(startTime);
    videoElement.play();
    dispatch({ type: "TOGGLE_PLAY" });
    endTimeRef.current = endTime - 0.44;

    // dispatch({ type: "TOGGLE_PLAY" });

    // if (videoElement.paused) {
    //   handleProgressChange(startTime);
    //   videoElement.play();
    //   endTimeRef.current = endTime;
    //   return;
    // }

    // videoElement.pause();
    // handleProgressChange(startTime);
  }

  return {
    videoRef,
    ...state,
    togglePlay,
    handleProgressChange,
    handlePlaybackRateChange,
    updateCurrentLyricIndex,
    handlePause,
    handlePlay,
    playInRange,
  };
}
