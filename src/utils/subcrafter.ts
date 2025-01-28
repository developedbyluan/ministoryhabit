type SubtitleItem = {
    id: number,
    start_time: number,
    end_time: number,
    text: string,
    ipa: string,
    translation: string
}

const subCrafter = (subtitle: string) => {
  const subtitleArr: SubtitleItem[] = [];

  const lyricsArr = subtitle.split("\n\n");

  lyricsArr.forEach((lyric) => {
    // console.log(lyric)

    const lyricComponents = lyric.split("\n");

    // console.log(lyricComponents)

    const [id, timestamp, text, ipa, translation] = lyricComponents;

    const [start_time, end_time] = timestamp.split(" ---> ");
    // console.log({
    //   id: parseInt(id), start_time: parseFloat(start_time), end_time: parseFloat(end_time), text: text.trim()
    // })

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

  return subtitleArr
};

// produce subtitle with the structure below with ChatGPT:
// 1. https://chatgpt.com/c/678c5231-8dd8-8013-a6a7-668813695a0b,
// 2. https://chatgpt.com/share/678c858b-8114-8013-96fb-f2155b0b886c

export {subCrafter}