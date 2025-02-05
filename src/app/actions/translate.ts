"use server";

import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

export async function translateText(text: string) {
  try {
    const openai = createOpenAI({
      // custom settings, e.g.
      compatibility: "strict", // strict mode, enable when using the OpenAI API
      baseURL: process.env.AI_GATEWAY,
    });

    const { text: translation } = await generateText({
      model: openai("gpt-4o-mini"),
      temperature: 1,
      prompt: `Translate the following English text to Vietnamese. Only return the translation, nothing else: "${text}"`,
    });

    return { translation };
  } catch (error) {
    console.error("Translation error:", error);
    return { error: "Translation failed" };
  }
}
