import { NextResponse } from "next/server";

import { Property } from "@/types/property";

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

type OnboardingAnswers = {
  goal: string;
  budget: string;
  timeline: string;
};

type Payload = {
  property?: Property;
  onboarding?: OnboardingAnswers;
  messages?: ChatMessage[];
  customApiKey?: string;
};

const MODEL = "gemini-1.5-flash";

function isValidMessage(message: unknown): message is ChatMessage {
  return (
    typeof message === "object" &&
    message !== null &&
    "role" in message &&
    "content" in message &&
    (message.role === "assistant" || message.role === "user") &&
    typeof message.content === "string" &&
    message.content.trim().length > 0
  );
}

function formatOnboardingValue(value: string, fallback: string) {
  return value ? value.replace(/-/g, " ") : fallback;
}

function buildSystemInstruction(property: Property, onboarding: OnboardingAnswers) {
  const goal = formatOnboardingValue(onboarding.goal, "buying/investing");
  const budget = formatOnboardingValue(onboarding.budget, "your budget");
  const timeline = formatOnboardingValue(onboarding.timeline, "soon");

  return [
    "You are PropWise AI, a friendly, expert real-estate concierge. 🏡",
    "Your tone: Warm, professional, and slightly conversational (like a savvy human advisor). Use appropriate emojis to feel friendly but stay focused on value. 😊",
    "Rule 1: Be concise. Don't repeat facts multiple times. Use short paragraphs or clear bullet points.",
    "Rule 2: Focus ONLY on the selected property. Don't speculate about external market trends unless they directly impact this specific listing.",
    "Rule 3: Answer as if you know the user is looking for " + goal + " within " + budget + " on a " + timeline + " timeline. Tailor your advice to these specific needs.",
    "",
    `Context: ${property.title} in ${property.location.locality}. ₹${property.price.toLocaleString("en-IN")}.`,
    `${property.bedrooms}BHK, ${property.areaSqFt} sqft. Amenities: ${property.amenities.slice(0, 5).join(", ")}.`,
    `Location Highlight: ${property.neighborhoodInfo.slice(0, 150)}...`,
    `ROI: ${property.roiPotential}% | Rent: ₹${property.monthlyRentEstimate?.toLocaleString("en-IN")}/mo.`,
    "",
    "If you don't know a specific detail (like exact maintenance fees or legal status), suggest they ask for a callback from the primary agent. 📞"
  ].join("\n");
}

function readGeminiText(payload: unknown) {
  if (
    typeof payload !== "object" ||
    payload === null ||
    !("candidates" in payload) ||
    !Array.isArray(payload.candidates)
  ) {
    return "";
  }

  const candidate = payload.candidates[0];
  if (
    !candidate ||
    typeof candidate !== "object" ||
    !("content" in candidate) ||
    typeof candidate.content !== "object" ||
    candidate.content === null ||
    !("parts" in candidate.content) ||
    !Array.isArray(candidate.content.parts)
  ) {
    return "";
  }

  return candidate.content.parts
    .map((part: unknown) =>
      typeof part === "object" && part !== null && "text" in part ? String(part.text ?? "") : ""
    )
    .join("")
    .trim();
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Payload;
    const property = body.property;
    const onboarding = body.onboarding;
    const customApiKey = body.customApiKey;
    const messages = Array.isArray(body.messages) ? body.messages.filter(isValidMessage).slice(-6) : [];

    if (!property || !onboarding || messages.length === 0) {
      return NextResponse.json(
        { error: "Missing property, onboarding, or chat history." },
        { status: 400 }
      );
    }

    const latestUserMessage = [...messages].reverse().find((message) => message.role === "user");
    if (!latestUserMessage) {
      return NextResponse.json({ error: "No user message found." }, { status: 400 });
    }

    const apiKey = customApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API Key is missing. Please add it in Settings or .env.local." },
        { status: 401 }
      );
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [
              {
                text: buildSystemInstruction(property, onboarding)
              }
            ]
          },
          contents: messages.map((message) => ({
            role: message.role === "assistant" ? "model" : "user",
            parts: [
              {
                text: message.content
              }
            ]
          }))
        })
      }
    );

    const data = (await response.json()) as any;

    if (!response.ok) {
      const errorMessage = data.error?.message || "Gemini API request failed.";
      return NextResponse.json(
        { error: `Gemini Error: ${errorMessage}` },
        { status: response.status }
      );
    }

    const reply = readGeminiText(data);

    if (!reply) {
      return NextResponse.json(
        { error: "Gemini returned an empty response. Please try rephrasing." },
        { status: 500 }
      );
    }

    return NextResponse.json({ mode: "gemini", reply });
  } catch (err) {
    console.error("Chat API Error:", err);
    return NextResponse.json(
      {
        error: "Internal server error while processing chat request."
      },
      { status: 500 }
    );
  }
}
