import { useState } from "react";

type Word = {
  text: string;
  index: number;
};

export default function InteractiveTranslation({ text }: { text: string }) {
  const words: Word[] = text
    .split(" ")
    .map((word, index) => ({ text: word, index }));

  const [startIndex, setStartIndex] = useState<number | null>(null);
  const [endIndex, setEndIndex] = useState<number | null>(null);

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

  return (
    <>
      <p className="my-4 text-center border border-red-400">
        {words.map((word, index) => (
          <span
            key={index}
            onClick={() => handleWordClick(index)}
            className={`cursor-pointer px-0.5 ${
              selectedWords.some((word) => word.index === index)
                ? "bg-blue-200 text-blue-800"
                : "hover:bg-gray-100"
            }`}
          >
            {word.text}
          </span>
        ))}
      </p>
      <div className="mt-4 p-2 bg-gray-100 rounded">
        <p className="text-sm text-gray-600">Selected words:</p>
        <p className="font-medium">
          {selectedWords.map((word) => word.text).join(" ")}
        </p>
      </div>
    </>
  );
}
