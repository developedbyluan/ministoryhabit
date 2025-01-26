import { useReducer, useRef, useEffect } from "react";

const lyrics = [
  { startTime: 0, endTime: 3.113839, text: "I'm such a nerd!" },
  {
    startTime: 3.113839,
    endTime: 10.587138,
    text: "I can see you guys' faces like, what is she talking about?",
  },
  { startTime: 10.587138, endTime: 12.247645, text: "Hi, this is Lisa, " },
  {
    startTime: 12.247645,
    endTime: 16.950343,
    text: "and this is my secret obsession.",
  },
  { startTime: 16.950343, endTime: 19.889932, text: "Whoa!" },
];

interface VideoState {
  isPlaying: boolean;
  progress: number;
  duration: number;
  playbackRate: number;
  currentLyric: string;
}

type VideoAction =
  | { type: "TOGGLE_PLAY" }
  | { type: "SET_PROGRESS"; payload: number }
  | { type: "SET_DURATION"; payload: number }
  | { type: "SET_PLAYBACK_RATE"; payload: number }
  | { type: "SET_CURRENT_LYRIC"; payload: string };

const initialState: VideoState = {
  isPlaying: false,
  progress: 0,
  duration: 0,
  playbackRate: 1,
  currentLyric: "",
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
    default:
      return state;
  }
}

interface UseVideoProps {
  src: string;
}

export function useVideo({ src }: UseVideoProps) {
  const [state, dispatch] = useReducer(videoReducer, initialState);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.src = src
    const updateProgress = () => {
        // console.log(video.duration)
      dispatch({ type: "SET_PROGRESS", payload: video.currentTime });
      updateLyrics(video.currentTime);
    };

    const updateDuration = () => {
    //   console.log(video.duration);
      dispatch({ type: "SET_DURATION", payload: video.duration });
    };

    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("loadedmetadata", updateDuration);
    // video.addEventListener('loadeddata', updateDuration)

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("loadedmetadata", updateDuration);
      // video.removeEventListener('loadeddata', updateDuration)
    };
  }, []);

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
    const currentLyric = lyrics.find(
      (lyric) => currentTime >= lyric.startTime && currentTime < lyric.endTime
    );
    dispatch({
      type: "SET_CURRENT_LYRIC",
      payload: currentLyric ? currentLyric.text : "",
    });
  };

  return {
    videoRef,
    ...state,
    togglePlay,
    handleProgressChange,
    handlePlaybackRateChange,
  };
}
