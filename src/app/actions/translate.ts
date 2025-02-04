"use server";

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function translateText(text: string) {
  try {
    const { text: translation } = await generateText({
      model: openai("gpt-4"),
      prompt: `Translate the following English text to Vietnamese. Only return the translation, nothing else: "${text}"`,
    });

    return { translation };
  } catch (error) {
    console.error("Translation error:", error);
    return { error: "Translation failed" };
  }
}
