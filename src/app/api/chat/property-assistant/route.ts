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
};

const MODEL = "gemini-2.5-flash";

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
  return [
    "You are PropWise Assistant, a concise real-estate sales and analysis concierge for a single selected property.",
    "Answer with confidence, but only use the provided property context and the user's questions. Never invent hidden fees, legal approvals, exact appreciation guarantees, or unsupported facts.",
    "If information is missing, say that directly and suggest a practical next question or verification step.",
    "Keep responses compact, useful, and customer-facing. Use short paragraphs or brief bullet points only when helpful.",
    `Selected property: ${property.title} in ${property.location.locality}, ${property.location.city}.`,
    `Property summary: ${property.description}`,
    `Type: ${property.type}. Price: ₹${property.price}. Area: ${property.areaSqFt} sq ft. Bedrooms: ${property.bedrooms}. Bathrooms: ${property.bathrooms}.`,
    `Amenities: ${property.amenities.join(", ")}.`,
    `Neighborhood: ${property.neighborhoodInfo}`,
    `Optional metrics: location rating ${property.locationRating ?? "not provided"}, ROI potential ${property.roiPotential ?? "not provided"}, monthly rent estimate ${property.monthlyRentEstimate ?? "not provided"}.`,
    `Customer goal: ${formatOnboardingValue(onboarding.goal, "not provided")}.`,
    `Customer budget range: ${formatOnboardingValue(onboarding.budget, "not provided")}.`,
    `Customer timeline: ${formatOnboardingValue(onboarding.timeline, "not provided")}.`
  ].join("\n");
}

function createFallbackReply(
  property: Property,
  onboarding: OnboardingAnswers,
  question: string
) {
  const lowerQuestion = question.toLowerCase();
  const budgetText = formatOnboardingValue(onboarding.budget, "the stated budget");
  const goalText = formatOnboardingValue(onboarding.goal, "the stated goal");
  const timelineText = formatOnboardingValue(onboarding.timeline, "the stated timeline");

  if (lowerQuestion.includes("roi") || lowerQuestion.includes("rent") || lowerQuestion.includes("investment")) {
    return `${property.title} looks strongest when framed as a ${goalText} decision. The asking price is ₹${property.price.toLocaleString("en-IN")} and the monthly rent estimate is ${property.monthlyRentEstimate ? `around ₹${property.monthlyRentEstimate.toLocaleString("en-IN")}` : "not listed yet"}. The ROI potential in the current record is ${property.roiPotential ? `${property.roiPotential}%` : "not specified"}, so I would position this as a candidate worth deeper yield validation rather than a guaranteed return story.`;
  }

  if (
    lowerQuestion.includes("location") ||
    lowerQuestion.includes("area") ||
    lowerQuestion.includes("amenit") ||
    lowerQuestion.includes("neighborhood")
  ) {
    return `${property.title} is in ${property.location.locality}, ${property.location.city}, and the current brief highlights ${property.neighborhoodInfo.toLowerCase()}. It offers ${property.areaSqFt} sq ft with ${property.bedrooms} bedrooms and ${property.bathrooms} bathrooms, plus amenities like ${property.amenities.slice(0, 4).join(", ")}. For a ${timelineText} buying horizon, that makes it easier to discuss both immediate usability and neighborhood upside.`;
  }

  if (lowerQuestion.includes("fit") || lowerQuestion.includes("good") || lowerQuestion.includes("buy")) {
    return `For someone targeting ${goalText} within ${budgetText}, ${property.title} looks compelling if the actual quote and financing plan stay aligned with expectations. Its biggest strengths are the ${property.location.locality} location, the ${property.type.toLowerCase()} format, and the amenity stack. My next checks would be final all-in cost, possession readiness, and whether the neighborhood profile matches your day-to-day use case.`;
  }

  return `Here’s the clean read on ${property.title}: it is a ${property.type.toLowerCase()} in ${property.location.locality}, ${property.location.city}, priced at ₹${property.price.toLocaleString("en-IN")} with ${property.areaSqFt} sq ft and ${property.bedrooms} bedrooms. For a customer with ${goalText}, ${budgetText}, and a ${timelineText} horizon, I would use this as a guided-fit conversation around location quality, cash flow potential, and whether the amenity mix justifies the ticket size. Ask me about pricing fit, ROI, location strengths, or what objections a customer may raise next.`;
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
    const messages = Array.isArray(body.messages) ? body.messages.filter(isValidMessage).slice(-10) : [];

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

    const fallbackReply = createFallbackReply(property, onboarding, latestUserMessage.content);
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ mode: "fallback", reply: fallbackReply });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
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

    if (!response.ok) {
      return NextResponse.json({ mode: "fallback", reply: fallbackReply });
    }

    const data = (await response.json()) as unknown;
    const reply = readGeminiText(data);

    if (!reply) {
      return NextResponse.json({ mode: "fallback", reply: fallbackReply });
    }

    return NextResponse.json({ mode: "gemini", reply });
  } catch {
    return NextResponse.json(
      {
        error: "Unable to process the property assistant request."
      },
      { status: 500 }
    );
  }
}
