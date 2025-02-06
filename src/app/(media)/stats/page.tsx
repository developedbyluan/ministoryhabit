"use client";

import {
  getWords,
  getWordFrequency,
  createResultObject,
} from "@/utils/getUniqueWords";
import { words3000 } from "../words3000";
import { useEffect, useState } from "react";
import WordFrequencyGrid from "./WordFrequencyGrid";
import { addToCollectedVocab } from "@/app/actions/add-to-collected-vocab";

export const runtime = "edge";

type VocabResponse = {
  data?: { vocab_array: string[] }[];
  error?: string;
};

export default function StatsPage() {
  const [wordFrequency, setWordFrequency] = useState<{
    [key: string]: { frequency: number; isInTheArray: boolean };
  }>({});
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const exporsureList = localStorage.getItem("exposure_list");
    const words: string[] = getWords(JSON.parse(exporsureList || "[]"));
    // console.log(words);

    // TODO: insert words into supabase
    async function insertWordsArrayIntoSupabase() {
      if (words.length <= 0) return true;

      const { error } = await addToCollectedVocab(
        words,
        "kp_e15445a4c1334aa3a592809f9444e9d9"
      );

      if (error) {
        return false;
      }

      return true;
    }

    async function loadVocab() {
      try {
        const result = await insertWordsArrayIntoSupabase();
        console.log(result)
        const response = await fetch("api/supabase_vocab", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kinde_auth_id: "kp_e15445a4c1334aa3a592809f9444e9d9",
          }),
        });
        const vocab: VocabResponse = await response.json();
        console.log(vocab.data);

        if (vocab.data) {
          setWordFrequency(
            createResultObject(words3000, getWordFrequency(vocab.data ?? []))
          );

          localStorage.setItem("exposure_list", "[]");
        } else if (vocab.error) {
          setError(vocab.error);
        }
      } catch (err) {
        setError(`Failed to fetch vocabulary with error ${err}`);
      } finally {
        setIsLoading(false);
      }
    }
    loadVocab();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        <p>{error}</p>
      </div>
    );
  }

  return <div className="max-w-2xl mx-auto"><WordFrequencyGrid data={wordFrequency} /></div>;
}
