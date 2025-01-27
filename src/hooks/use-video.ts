import { useReducer, useRef, useEffect } from "react";

const lyrics = [
  {
    id: 1,
    start_time: 10.110778,
    end_time: 16.238959,
    text: "Thank you. Thank you very much, everybody. Well, thank you very, very much.",
    ipa: "ðæŋk juː. ˈðæŋk juː ˈvɛri mʌʧ, ˈɛvrɪbɒdi. wɛl, ˈðæŋk juː ˈvɛri, ˈvɛri mʌʧ./ ",
    translation:
      "Cảm ơn bạn. Cảm ơn rất nhiều, mọi người. Chà, cảm ơn rất nhiều, rất nhiều.",
  },
  {
    id: 2,
    start_time: 16.238959,
    end_time: 19.253153,
    text: "Vice president Vance.",
    ipa: "vaɪs ˈprɛzɪdənt væns.",
    translation: "Phó tổng thống Vance.",
  },
  {
    id: 3,
    start_time: 19.253153,
    end_time: 20.890975,
    text: "Speaker Johnson.",
    ipa: "ˈspiːkə ˈʤɒnsən./",
    translation: "Chủ tịch Hạ viện Johnson.",
  },
  {
    id: 4,
    start_time: 20.890975,
    end_time: 22.889329,
    text: "Senator Thune.",
    ipa: "ˈsɛnətə θuːn./ ",
    translation: "Thượng nghị sĩ Thune.",
  },
  {
    id: 5,
    start_time: 22.889329,
    end_time: 25.424459,
    text: "Chief Justice Roberts,",
    ipa: "ʧiːf ˈʤʌstɪs ˈrɒbərts,/ ",
    translation: "Chánh án Roberts,",
  },
  {
    id: 6,
    start_time: 25.424459,
    end_time: 31.705784,
    text: "Justices of the United States Supreme Court.",
    ipa: "ˈʤʌstɪsɪz ɒv ði ˈjuːnaɪtɪd steɪts səˈpriːm kɔːt./ ",
    translation: "Các thẩm phán của Tòa án Tối cao Hoa Kỳ.",
  },
  {
    id: 7,
    start_time: 31.705784,
    end_time: 34.08619,
    text: "President Clinton.",
    ipa: "ˈprɛzɪdənt ˈklɪntən./ ",
    translation: "Tổng thống Clinton.",
  },
  {
    id: 8,
    start_time: 34.08619,
    end_time: 35.675774,
    text: "President Bush.",
    ipa: "ˈprɛzɪdənt bʊʃ./ ",
    translation: "Tổng thống Bush.",
  },
  {
    id: 9,
    start_time: 35.675774,
    end_time: 37.683881,
    text: "President Obama.",
    ipa: "ˈprɛzɪdənt əʊˈbɑːmə./ ",
    translation: "Tổng thống Obama.",
  },
  {
    id: 10,
    start_time: 37.683881,
    end_time: 39.421638,
    text: "President Biden.",
    ipa: "ˈprɛzɪdənt ˈbaɪdən./ ",
    translation: "Tổng thống Biden.",
  },
  {
    id: 11,
    start_time: 39.421638,
    end_time: 42.380865,
    text: "Vice president Harris.",
    ipa: "vaɪs ˈprɛzɪdənt ˈhæɹɪs/ ",
    translation: "Phó tổng thống Harris.",
  },
  {
    id: 12,
    start_time: 42.380865,
    end_time: 45.416579,
    text: "And my fellow citizens.",
    ipa: "ænd maɪ ˈfɛləʊ ˈsɪtɪzənz/ ",
    translation: "Và các công dân thân mến của tôi.",
  },
  {
    id: 13,
    start_time: 45.416579,
    end_time: 57.947684,
    text: "The golden age of America begins right now.",
    ipa: "ðə ˈɡəʊldən eɪʤ ɒv əˈmɛrɪkə bɪˈɡɪnz raɪt naʊ/ ",
    translation: "Thời kỳ hoàng kim của nước Mỹ bắt đầu ngay bây giờ.",
  },
  {
    id: 14,
    start_time: 57.947684,
    end_time: 63.640453,
    text: "From this day forward, our country will flourish and be respected again all over the world.",
    ipa: "frɒm ðɪs deɪ ˈfɔːwəd aʊər ˈkʌntri wɪl ˈflʌrɪʃ ənd biː rɪˈspɛktɪd əˈɡɛn ɔːl ˈəʊvər ðə wɜːrld/ ",
    translation:
      "Từ hôm nay trở đi, đất nước chúng ta sẽ phát triển và được tôn trọng trở lại trên toàn thế giới.",
  },
  {
    id: 15,
    start_time: 63.640453,
    end_time: 66.850713,
    text: "We will be the envy of every nation.",
    ipa: "wiː wɪl biː ðə ˈɛnvi ɒv ˈɛvrɪ ˈneɪʃən/ ",
    translation: "Chúng ta sẽ là niềm ghen tị của mọi quốc gia.",
  },
  {
    id: 16,
    start_time: 66.850713,
    end_time: 72.042586,
    text: "And we will not allow ourselves to be taken advantage of any longer.",
    ipa: "ænd wiː wɪl nɒt əˈlaʊ aʊərˈsɛlvz tə biː ˈteɪkən ədˈvɑːntɪdʒ ɒv ˈɛni ˈlɒŋɡər/ ",
    translation: "Và chúng ta sẽ không để bản thân bị lợi dụng thêm nữa.",
  },
  {
    id: 17,
    start_time: 72.042586,
    end_time: 76.849467,
    text: "During every single day of the Trump administration,",
    ipa: "ˈdjʊərɪŋ ˈɛvrɪ ˈsɪŋɡəl deɪ ɒv ðə trʌmp ædmɪnɪˈstreɪʃən/ ",
    translation: "Trong mỗi ngày của chính quyền Trump.",
  },
  {
    id: 18,
    start_time: 76.849467,
    end_time: 89.089353,
    text: "I will very simply put America first.",
    ipa: "aɪ wɪl ˈvɛri ˈsɪmpli pʊt əˈmɛrɪkə fɜːst",
    translation: "Tôi sẽ đơn giản đặt nước Mỹ lên hàng đầu.",
  },
  {
    id: 19,
    start_time: 89.089353,
    end_time: 92.825907,
    text: "Our sovereignty will be reclaimed.",
    ipa: "aʊər ˈsɒvrɪnti wɪl biː rɪˈkleɪmd",
    translation: "Chủ quyền của chúng ta sẽ được khôi phục.",
  },
  {
    id: 20,
    start_time: 92.825907,
    end_time: 95.582114,
    text: "Our safety will be restored.",
    ipa: "aʊər ˈseɪfti wɪl biː rɪˈstɔːd/ ",
    translation: "An toàn của chúng ta sẽ được phục hồi.",
  },
  {
    id: 21,
    start_time: 95.582114,
    end_time: 99.728304,
    text: "The scales of justice will be rebalanced.",
    ipa: "ðə skeɪlz ɒv ˈdʒʌstɪs wɪl biː rɪˈbælənst/ ",
    translation: "Cái cân công lý sẽ được cân bằng lại.",
  },
  {
    id: 22,
    start_time: 99.728304,
    end_time: 113.501202,
    text: "The vicious, violent, and unfair weaponization of the Justice Department and our government will end.",
    ipa: "ðə ˈvɪʃəs, ˈvaɪələnt, ənd ʌnˈfɛə ˈwɛpənaɪˌzeɪʃən ɒv ðə ˈdʒʌstɪs dɪˈpɑːtmənt ənd aʊər ˈɡʌvənmənt wɪl ɛnd",
    translation:
      "Sự vũ khí hóa tàn bạo, bạo lực và không công bằng của Bộ Tư pháp và chính phủ của chúng ta sẽ kết thúc.",
  },
  {
    id: 23,
    start_time: 113.501202,
    end_time: 126.604877,
    text: "And our top priority will be to create a nation that is proud, prosperous and free.",
    ipa: "ænd aʊər tɒp praɪˈɒrɪti wɪl biː tə kriˈeɪt ə ˈneɪʃən ðæt ɪz praʊd, ˈprɒspərəs ənd friː",
    translation:
      "Và ưu tiên hàng đầu của chúng ta sẽ là xây dựng một quốc gia tự hào, thịnh vượng và tự do.",
  },
  {
    id: 24,
    start_time: 126.604877,
    end_time: 139.928644,
    text: "America will soon be greater, stronger, and far more exceptional than ever before.",
    ipa: "əˈmɛrɪkə wɪl suːn biː ˈɡreɪtə, ˈstrɒŋɡər, ənd fɑːr mɔːr ɪkˈsɛpʃənəl ðæn ˈɛvər bɪˈfɔː",
    translation:
      "Nước Mỹ sẽ sớm vĩ đại hơn, kiên cường hơn và xuất sắc hơn bao giờ hết.",
  },
  {
    id: 25,
    start_time: 139.928644,
    end_time: 148.384293,
    text: "I return to the presidency confident and optimistic that we are at the start of a thrilling new era of national success.",
    ipa: "aɪ rɪˈtɜːn tə ðə ˈprɛzɪdənsi ˈkɒnfɪdənt ənd ɒptɪˈmɪstɪk ðæt wiː ɑːr æt ðə stɑːt ɒv ə ˈθrɪlɪŋ njuː ˈɪərə ɒv ˈnæʃənl səkˈsɛs",
    translation:
      "Tôi quay lại với cương vị tổng thống, tự tin và lạc quan rằng chúng ta đang ở đầu của một kỷ nguyên mới đầy thú vị về thành công quốc gia.",
  },
  {
    id: 26,
    start_time: 148.384293,
    end_time: 151.451798,
    text: "A tide of change is sweeping the country.",
    ipa: "ột làn sóng thay đổi đang quét qua đất nước",
    translation: "",
  },
  {
    id: 27,
    start_time: 151.451798,
    end_time: 154.31148,
    text: "Sunlight is pouring over the entire world,",
    ipa: "ˈsʌnlaɪt ɪz ˈpɔːrɪŋ ˈəʊvər ði ɪnˈtaɪə wɜːrld",
    translation: "Ánh sáng mặt trời đang chiếu sáng khắp thế giới,",
  },
  {
    id: 28,
    start_time: 154.31148,
    end_time: 159.478798,
    text: "and America has the chance to seize this opportunity like never before.",
    ipa: "ænd əˈmɛrɪkə hæz ðə ʧɑːns tə siːz ðɪs ˌɒpəˈtjuːnɪti laɪk ˈnɛvər bɪˈfɔː",
    translation:
      "và nước Mỹ có cơ hội nắm bắt cơ hội này như chưa bao giờ trước đây.",
  },
  {
    id: 29,
    start_time: 159.478798,
    end_time: 163.642463,
    text: "But first, we must be honest about the challenges we face.",
    ipa: "bʌt fɜːst, wiː mʌst biː ˈɒnɪst əˈbaʊt ðə ˈʧælɪndʒɪz wiː feɪs",
    translation:
      "Nhưng trước hết, chúng ta phải trung thực về những thử thách mà chúng ta đối mặt.",
  },
  {
    id: 30,
    start_time: 163.642463,
    end_time: 168,
    text: "While they are plentiful, they will be annihilated by this great momentum",
    ipa: "waɪl ðeɪ ɑːr ˈplɛntɪfʊl, ðeɪ wɪl biː əˈnaɪəleɪtɪd baɪ ðɪs ɡreɪt məʊˈmɛntəm",
    translation:
      "Mặc dù chúng còn rất nhiều, chúng sẽ bị tiêu diệt bởi động lực lớn",
  },
  {
    id: 31,
    start_time: 168.689687,
    end_time: 173.03918,
    text: "that the world is now witnessing in the United States of America.",
    ipa: "ðæt ðə wɜːrld ɪz naʊ ˈwɪtnɪsɪŋ ɪn ðə juːˈnaɪtɪd steɪts ɒv əˈmɛrɪkə",
    translation: "mà thế giới hiện đang chứng kiến ở Hợp chủng quốc Hoa Kỳ.",
  },
];

interface VideoState {
  isPlaying: boolean;
  progress: number;
  duration: number;
  playbackRate: number;
  currentLyric: string;
  currentLyricIndex: number;
}

type VideoAction =
  | { type: "TOGGLE_PLAY" }
  | { type: "SET_PROGRESS"; payload: number }
  | { type: "SET_DURATION"; payload: number }
  | { type: "SET_PLAYBACK_RATE"; payload: number }
  | { type: "SET_CURRENT_LYRIC"; payload: string }
  | { type: "SET_CURRENT_LYRIC_INDEX"; payload: number };

const initialState: VideoState = {
  isPlaying: false,
  progress: 0,
  duration: 0,
  playbackRate: 1,
  currentLyric: "",
  currentLyricIndex: 0,
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
    video.src = src;
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
      (lyric) => currentTime >= lyric.start_time && currentTime < lyric.end_time
    );
    dispatch({
      type: "SET_CURRENT_LYRIC",
      payload: currentLyric ? currentLyric.text : "",
    });
  };

  const updateCurrentLyricIndex = (index: number) => {
    console.log(index);
    dispatch({ type: "SET_CURRENT_LYRIC_INDEX", payload: index });
  };

  // Read Mode
  function handlePause(startTime: number, index: number) {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.pause();
    handleProgressChange(startTime)
    // dispatch({type: "SET_PROGRESS", payload: startTime})
    dispatch({ type: "SET_CURRENT_LYRIC_INDEX", payload: index });

    if (state.isPlaying) {
      dispatch({ type: "TOGGLE_PLAY" });
    }
  }

  return {
    videoRef,
    ...state,
    togglePlay,
    handleProgressChange,
    handlePlaybackRateChange,
    lyrics,
    updateCurrentLyricIndex,
    handlePause,
  };
}
