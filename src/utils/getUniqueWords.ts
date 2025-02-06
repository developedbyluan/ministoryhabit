import { filterMultiWordTexts, splitTextWithPhrases } from "./splitTextWithPhrases";
import { words3000 } from "@/app/(media)/words3000";

export const removeDuplicateSentences = (sentences: string[]) => {
  // Use a Set to remove duplicates (Sets only store unique values)
  const uniqueSentences = [...new Set(sentences)];
  return uniqueSentences;
};

function convertToLowercase(arrayOfStrings: string[]) {
    // Use map to create a new array with all strings converted to lowercase
    return arrayOfStrings.map(str => str.toLowerCase());
}

export const getWords = (sentences: string[]) => {
  const uniqueWords: string[] = [];

  removeDuplicateSentences(sentences).forEach((sentence) => {
    // const words = sentence.split(/\s+/);
    const words = splitTextWithPhrases(sentence, filterMultiWordTexts(words3000))

    words.forEach((word) => {
      const normalizedWord = word.toLowerCase().replace(/[^\w'\s+]/g, ""); // Remove everything except word characters and apostrophes

      if (normalizedWord) {
        uniqueWords.push(normalizedWord);
      }
    });
  });

  return uniqueWords;
};

export const getWordFrequency = (arraysOfWords: {vocab_array: string[]}[]) => {
  const frequencyMap: { [key: string]: number } = {};

  // Iterate through each array of words
  arraysOfWords.forEach(({vocab_array}) => {
    // Iterate through each word in the array
    vocab_array.forEach((word) => {
      // Normalize the word to ensure consistency (e.g., lowercase)
      const normalizedWord: string = word.toLowerCase();

      // Update the frequency count in the map
      if (frequencyMap[normalizedWord]) {
        frequencyMap[normalizedWord] += 1;
      } else {
        frequencyMap[normalizedWord] = 1;
      }
    });
  });

  return frequencyMap;
};

export const createResultObject = (arr: string[], obj: {[key: string]: number}) => {
  const result: {[key: string]: {frequency: number, isInTheArray: boolean}} = {};

  // First, process the array to set keys with isInTheArray: true
  for (const item of convertToLowercase(arr).sort()) {
    result[item] = {
      frequency: Object.prototype.hasOwnProperty.call(obj, item)
        ? obj[item]
        : 0,
      isInTheArray: true,
    };
  }

  // Then, process the object to add keys not in the array with isInTheArray: false
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(result, key)) {
      result[key] = {
        frequency: obj[key],
        isInTheArray: false,
      };
    }
  }

  return result;
}
