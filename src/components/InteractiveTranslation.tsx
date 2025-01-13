import { useState } from "react";

type Word = {
  text: string;
  index: number;
};

type LookUpPhrase = {
  order: number;
  text: string;
  translation: string;
};

export default function InteractiveTranslation({
  text,
  ipa,
  translation,
}: {
  text: string;
  ipa: string;
  translation: string;
}) {
  const words: Word[] = text
    .split(" ")
    .map((word, index) => ({ text: word, index }));
  const ipaArr = ipa.split(" ");

  const [startIndex, setStartIndex] = useState<number | null>(null);
  const [endIndex, setEndIndex] = useState<number | null>(null);

  const [lookUpList, setLookUpList] = useState<LookUpPhrase[]>([]);

  const handleWordClick = (index: number) => {
    if (startIndex === null) {
      setStartIndex(index);
      setEndIndex(index);
    } else if (index === startIndex && index === endIndex) {
      // Deselect if clicking on a single selected word
      setStartIndex(null);
      setEndIndex(null);
    } else if (endIndex !== null && index === Math.min(startIndex, endIndex)) {
      // Deselect entire group if clicking on the first word of the selection
      setStartIndex(null);
      setEndIndex(null);
    } else {
      setEndIndex(index);
    }
  };
  const getSelectedRange = () => {
    if (startIndex === null || endIndex === null) return [];
    const start = Math.min(startIndex, endIndex);
    const end = Math.max(startIndex, endIndex);
    return words.slice(start, end + 1);
  };

  const selectedWords = getSelectedRange();

  console.log(selectedWords);

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="my-4 text-center border border-red-400 flex flex-wrap">
        {words.map((word, index) => (
          <div key={index} className="flex flex-col items-center">
            <span className="text-xs text-slate-400">{ipaArr[index]}</span>
            <span
              onClick={() => handleWordClick(index)}
              className={`text-lg px-2 cursor-pointer ${
                selectedWords.some((word) => word.index === index)
                  ? `bg-blue-200 text-blue-800 ${
                      index === startIndex && "font-semibold"
                    }`
                  : "hover:bg-gray-100"
              }`}
            >
              {word.text}
            </span>
          </div>
        ))}
      </div>
      <p>{translation}</p>
      <button
        onClick={() => {
          if (selectedWords.length <= 0) return [];
          setLookUpList((prev) => [
            ...prev,
            {
              order: selectedWords[0].index,
              index: new Date(),
              text: selectedWords.map((word) => word.text).join(" "),
              translation: "Hello world",
            },
          ]);

          setStartIndex(null);
          setEndIndex(null);
        }}
      >
        Look Up
      </button>
      <div className="max-h-20 overflow-y-auto">
        {lookUpList
          .reduce((acc: LookUpPhrase[], current: LookUpPhrase) => {
            const isDuplicate = acc.some(
              (item: LookUpPhrase) => item.text === current.text
            );
            if (!isDuplicate) {
              acc.push(current);
            }

            return acc;
          }, [])
          .sort((a: LookUpPhrase, b: LookUpPhrase) => a.order - b.order)
          .map((lookUpPhrase, index) => {
            return (
              <li className="flex justify-between" key={index}>
                {lookUpPhrase.text}: {lookUpPhrase.translation}
              </li>
            );
          })}
      </div>
    </div>
  );
}
