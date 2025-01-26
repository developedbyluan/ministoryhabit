type Word = {
  word: string;
  index: number;
};

type Lyric = { startTime: number; endTime: number; text: string; ipa: string };

type ReadModeTextProps = {
  lyrics: Lyric[];
};
export default function ReadModeText({ lyrics }: ReadModeTextProps) {
  return (
    <div className="max-w-[576px] w-[95%] mx-auto px-6 space-y-4 flex flex-col">
      {lyrics.map((lyric, index) => {
        const words: Word[] = lyric.text
          .split(" ")
          .map((word, index) => ({ word, index }));
        const ipaArr = lyric.ipa.split(" ");
        // console.log(words)
        const wordsElement = words.map((word: Word) => (
          <div key={word.index} className="flex flex-col items-center mt-2">
            <span className="text-xs text-slate-400">{ipaArr[word.index]}</span>
            <span className="px-2 cursor-pointer bg-blue-100">{word.word}</span>
          </div>
        ));
        return (
          <div className="flex flex-wrap" key={index}>
            {wordsElement}
          </div>
        );
      })}
    </div>
  );
}
