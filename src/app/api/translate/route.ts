import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function GET() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");

  const result = await res.json();

  return NextResponse.json(result, {
    status: 200,
  });
}

export async function POST(request: NextRequest) {
  const req: { text: string } = await request.json();
  console.log(req.text);

  const res = await translate(req.text, "Vietnamese");

  return NextResponse.json(res, {
    status: 201,
  });
}

async function translate(text: string, targetLanguage: string) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const words = text.split(" ").join(", ");

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: [
          {
            type: "text",
            text: "You are a JSON formatter assistant",
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `text: ${text}; words: ${words}`,
          },
        ],
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "translation_schema",
        strict: true,
        schema: {
          type: "object",
          properties: {
            full_translation: {
              type: "string",
              description:
                "The complete translation of the provided English text into Vietnamese.",
            },
            word_phrase_breakdown: {
              type: "array",
              description:
                "A breakdown of the translation word-by-word or phrase-by-phrase.",
              items: {
                type: "object",
                properties: {
                  english: {
                    type: "string",
                    description: "The word or phrase in English.",
                  },
                  vietnamese: {
                    type: "string",
                    description:
                      "The corresponding word or phrase in Vietnamese.",
                  },
                },
                required: ["english", "vietnamese"],
                additionalProperties: false,
              },
            },
          },
          required: ["full_translation", "word_phrase_breakdown"],
          additionalProperties: false,
        },
      },
    },
    temperature: 1,
    max_completion_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  return response.choices[0].message.content;
}
