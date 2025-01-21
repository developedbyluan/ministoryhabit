type LyricObject = {
  id: number;
  start_time: number;
  end_time: number;
  text: string;
  ipa: string;
  translation: string;
};

function convertToSubtitleArr(subtitle: string) {
  let subtitleArr: LyricObject[] = [];
  const lyricsArr = subtitle.split("\n\n");

  lyricsArr.forEach((lyric) => {
    const lyricComponents = lyric.split("\n");

    const [id, timestamp, text, ipa, translation] = lyricComponents;

    const [start_time, end_time] = timestamp.split(" ---> ");

    const lyricObject = {
      id: parseInt(id),
      start_time: parseFloat(start_time),
      end_time: parseFloat(end_time),
      text: text.trim(),
      ipa: ipa ? ipa.slice(1, -1) : "",
      translation: translation || "",
    };

    subtitleArr.push(lyricObject);
  });

  return subtitleArr;
}

export {convertToSubtitleArr}