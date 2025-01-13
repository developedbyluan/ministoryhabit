import { useState } from "react";

type Word = {
  text: string;
  index: number;
};

export default function InteractiveTranslation({ text, ipa }: { text: string, ipa: string }) {
  const words: Word[] = text
    .split(" ")
    .map((word, index) => ({ text: word, index }));
    const ipaArr = ipa.split(" ")

  const [startIndex, setStartIndex] = useState<number | null>(null);
  const [endIndex, setEndIndex] = useState<number | null>(null);

  const [lookUpList, setLookUpList] = useState<
    {
      order: number;
      text: string;
      translation: string;
    }[]
  >([]);

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
      <div className="my-4 text-center border border-red-400 flex">
        {words.map((word, index) => (
          <div key={index} className="flex flex-col">
            <span className="text-xs text-slate-400">{ipaArr[index]}</span>
            <span
              onClick={() => handleWordClick(index)}
              className={`cursor-pointer px-0.5 ${
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
      <button
        onClick={() => {
          if (!selectedWords) return [];
          setLookUpList((prev) => [
            ...prev,
            {
              order: selectedWords[0].index,
              index: new Date(),
              text: selectedWords.map((word) => word.text).join(" "),
              translation: "Hello world",
            },
          ]);
        }}
      >
        Look Up
      </button>
      <div className="max-h-20 overflow-y-auto">
        {lookUpList
          .sort((a, b) => a.order - b.order)
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
