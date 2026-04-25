"use client";

import { useEffect, useRef, useState } from "react";
import { Building2, ChevronDown, MessageCircleMore, Send, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { demoProperties } from "@/data/demo";
import { getProperties } from "@/lib/firestore/properties";
import { cn, formatCurrency } from "@/lib/utils";
import { Property } from "@/types/property";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

type OnboardingAnswers = {
  goal: string;
  budget: string;
  timeline: string;
};

type ChatResponse = {
  mode: "fallback" | "gemini";
  reply: string;
};

const goalOptions = [
  { value: "end-use", label: "Primary home" },
  { value: "investment", label: "Investment" },
  { value: "rental-income", label: "Rental income" }
];

const budgetOptions = [
  { value: "under-1cr", label: "Under ₹1 Cr" },
  { value: "1cr-2cr", label: "₹1 Cr to ₹2 Cr" },
  { value: "2cr-4cr", label: "₹2 Cr to ₹4 Cr" },
  { value: "4cr-plus", label: "₹4 Cr+" }
];

const timelineOptions = [
  { value: "0-3-months", label: "0 to 3 months" },
  { value: "3-6-months", label: "3 to 6 months" },
  { value: "6-12-months", label: "6 to 12 months" }
];

const initialAnswers: OnboardingAnswers = {
  goal: "",
  budget: "",
  timeline: ""
};

function getActiveFallbackProperties() {
  return demoProperties.filter((property) => property.status === "active");
}

function createMessage(role: ChatMessage["role"], content: string) {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content
  } satisfies ChatMessage;
}

function getPropertyStarter(property: Property, answers: OnboardingAnswers) {
  const goal = goalOptions.find((option) => option.value === answers.goal)?.label ?? "your goal";
  const budget = budgetOptions.find((option) => option.value === answers.budget)?.label ?? "your budget";
  const timeline =
    timelineOptions.find((option) => option.value === answers.timeline)?.label ?? "your timeline";

  return `You're set. I'm focused on ${property.title} in ${property.location.locality}, ${property.location.city}. I already know you're evaluating it for ${goal.toLowerCase()}, around ${budget.toLowerCase()}, with a ${timeline.toLowerCase()} horizon. Ask me about fit, pricing, ROI, amenities, neighborhood, or what questions you should ask next.`;
}

function NativeSelect({
  value,
  onChange,
  placeholder,
  options,
  disabled = false
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: { label: string; value: string }[];
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full appearance-none rounded-[22px] border border-slate-200/80 bg-white/88 px-4 pr-11 text-sm text-foreground dark:text-white shadow-sm outline-none transition focus:border-slate-300 dark:border-white/10 dark:bg-white/5 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

export function PropertyChatbot() {
  const [open, setOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>(getActiveFallbackProperties());
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [answers, setAnswers] = useState<OnboardingAnswers>(initialAnswers);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [assistantMode, setAssistantMode] = useState<ChatResponse["mode"]>("fallback");
  const [statusMessage, setStatusMessage] = useState("");
  const [syncedLiveProperties, setSyncedLiveProperties] = useState(false);
  const messageListRef = useRef<HTMLDivElement | null>(null);

  const selectedProperty = properties.find((property) => property.id === selectedPropertyId) ?? null;
  const chatReady =
    Boolean(selectedProperty) &&
    Boolean(answers.goal) &&
    Boolean(answers.budget) &&
    Boolean(answers.timeline) &&
    messages.length > 0;

  useEffect(() => {
    if (!open || syncedLiveProperties) {
      return;
    }

    let cancelled = false;

    async function syncLiveProperties() {
      try {
        const liveProperties = await Promise.race([
          getProperties({ status: "active" }),
          new Promise<Property[]>((_, reject) => {
            window.setTimeout(() => reject(new Error("Property loading timed out.")), 2000);
          })
        ]);

        if (cancelled) {
          return;
        }

        if (liveProperties.length > 0) {
          setProperties(liveProperties);
          setStatusMessage("");
        } else {
          setStatusMessage("Using the curated portfolio right now.");
        }
      } catch {
        if (!cancelled) {
          setStatusMessage("Using the curated portfolio right now.");
        }
      } finally {
        if (!cancelled) {
          setSyncedLiveProperties(true);
        }
      }
    }

    void syncLiveProperties();

    return () => {
      cancelled = true;
    };
  }, [open, syncedLiveProperties]);

  useEffect(() => {
    if (!messageListRef.current) {
      return;
    }

    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }, [messages, open]);

  function resetConversation() {
    setMessages([]);
    setDraft("");
    setAnswers(initialAnswers);
    setSelectedPropertyId("");
    setStatusMessage("");
    setAssistantMode("fallback");
  }

  function startConversation() {
    if (!selectedProperty || !answers.goal || !answers.budget || !answers.timeline) {
      return;
    }

    setMessages([createMessage("assistant", getPropertyStarter(selectedProperty, answers))]);
  }

  async function sendMessage() {
    if (!draft.trim() || !selectedProperty || !chatReady || sending) {
      return;
    }

    const userMessage = createMessage("user", draft.trim());
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setDraft("");
    setSending(true);
    setStatusMessage("");

    try {
      const response = await fetch("/api/chat/property-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          property: selectedProperty,
          onboarding: answers,
          messages: nextMessages
        })
      });

      const data = (await response.json()) as ChatResponse & { error?: string };

      if (!response.ok || !data.reply) {
        throw new Error(data.error ?? "The property assistant could not answer right now.");
      }

      setAssistantMode(data.mode);
      setMessages((current) => [...current, createMessage("assistant", data.reply)]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        createMessage(
          "assistant",
          "I’m still here, but the assistant request did not complete. Try again in a moment or rephrase the question."
        )
      ]);
      setStatusMessage(error instanceof Error ? error.message : "Assistant request failed.");
    } finally {
      setSending(false);
    }
  }

  const propertyOptions = properties.map((property) => ({
    value: property.id,
    label: `${property.title} • ${property.location.locality}`
  }));

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[70]">
        <Button
          size="icon"
          className="h-16 w-16 rounded-full bg-slate-950 shadow-[0_24px_60px_rgba(15,23,42,0.32)] hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close property assistant" : "Open property assistant"}
        >
          {open ? <X className="h-6 w-6" /> : <MessageCircleMore className="h-6 w-6" />}
        </Button>
      </div>

      {open ? (
        <div className="fixed bottom-24 right-4 z-[70] w-[calc(100vw-2rem)] max-w-[24.5rem] sm:right-6">
          <div className="overflow-hidden rounded-[32px] border border-white/15 bg-[rgba(255,255,255,0.92)] shadow-[0_36px_90px_rgba(0,0,0,0.42)] backdrop-blur-2xl dark:bg-black/90 dark:border-white/10">
            <div className="border-b border-slate-200/80 dark:border-white/10 px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-soft dark:bg-white dark:text-slate-950">
                    <MessageCircleMore className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-display text-xl font-semibold text-slate-950 dark:text-white">PropWise Assistant</p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Pick a property, answer three quick questions, then chat about fit, returns, and next steps.
                    </p>
                  </div>
                </div>
                <button
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-muted-foreground transition hover:bg-slate-50 dark:hover:bg-white/10 hover:text-slate-950 dark:hover:text-white"
                  onClick={() => setOpen(false)}
                  aria-label="Close assistant"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4 p-4">
              {!chatReady ? (
                <>
                  <div className="rounded-[24px] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(248,244,238,0.96),rgba(255,255,255,0.96))] dark:border-white/10 dark:bg-white/5 p-4">
                    <div className="mb-3 flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <p className="text-xs font-semibold uppercase tracking-[0.2em]">Start with a property</p>
                    </div>

                    <NativeSelect
                      value={selectedPropertyId}
                      onChange={setSelectedPropertyId}
                      placeholder="Choose a property"
                      options={propertyOptions}
                    />

                    {selectedProperty ? (
                      <div className="mt-4 rounded-[22px] border border-white/80 bg-white/82 dark:bg-white/5 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-display text-lg font-semibold text-slate-950 dark:text-white">{selectedProperty.title}</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {selectedProperty.location.locality}, {selectedProperty.location.city}
                            </p>
                          </div>
                          <div className="rounded-full bg-slate-950 dark:bg-white px-3 py-1 text-xs font-semibold text-white dark:text-slate-950">
                            {formatCurrency(selectedProperty.price)}
                          </div>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-muted-foreground">{selectedProperty.description}</p>
                      </div>
                    ) : null}
                  </div>

                  <div className="grid gap-3">
                    <NativeSelect
                      value={answers.goal}
                      onChange={(value) => setAnswers((current) => ({ ...current, goal: value }))}
                      placeholder="What is the main goal?"
                      options={goalOptions}
                    />
                    <NativeSelect
                      value={answers.budget}
                      onChange={(value) => setAnswers((current) => ({ ...current, budget: value }))}
                      placeholder="Which budget range fits?"
                      options={budgetOptions}
                    />
                    <NativeSelect
                      value={answers.timeline}
                      onChange={(value) => setAnswers((current) => ({ ...current, timeline: value }))}
                      placeholder="When are you looking to move?"
                      options={timelineOptions}
                    />
                  </div>

                  <div className="rounded-[24px] border border-amber-100 dark:border-amber-900/30 bg-amber-50/86 dark:bg-amber-950/20 p-4 text-sm leading-6 text-slate-700 dark:text-slate-300">
                    <div className="mb-2 flex items-center gap-2 text-slate-950 dark:text-white">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      <p className="font-semibold">What the assistant will do</p>
                    </div>
                    It will stay focused on the selected property, your buying intent, your budget, and your timeline so the answers feel like a guided sales conversation instead of a generic chatbot.
                  </div>

                  <div className="flex gap-3">
                    <Button
                      className="flex-1"
                      disabled={!selectedProperty || !answers.goal || !answers.budget || !answers.timeline}
                      onClick={startConversation}
                    >
                      Start property chat
                    </Button>
                    <Button variant="secondary" onClick={resetConversation}>
                      Reset
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-3 rounded-[22px] border border-slate-200/80 dark:border-white/10 bg-slate-50/90 dark:bg-white/5 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-950 dark:text-white">{selectedProperty?.title}</p>
                      <p className="truncate text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        {selectedProperty?.location.locality}, {selectedProperty?.location.city}
                      </p>
                    </div>
                    <Button variant="ghost" className="shrink-0" onClick={resetConversation}>
                      New brief
                    </Button>
                  </div>

                  <div
                    ref={messageListRef}
                    className="flex max-h-[26rem] min-h-[20rem] flex-col gap-3 overflow-y-auto rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-[linear-gradient(180deg,rgba(248,245,239,0.9),rgba(255,255,255,0.97))] dark:bg-white/5 p-3"
                  >
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "max-w-[88%] rounded-[22px] px-4 py-3 text-sm leading-6 shadow-sm",
                          message.role === "assistant"
                            ? "border border-white/80 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300"
                            : "ml-auto bg-slate-950 dark:bg-white text-white dark:text-slate-950"
                        )}
                      >
                        {message.content}
                      </div>
                    ))}
                    {sending ? (
                      <div className="max-w-[88%] rounded-[22px] border border-white/80 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 text-sm text-muted-foreground">
                        Thinking about the property...
                      </div>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          void sendMessage();
                        }
                      }}
                      placeholder="Ask about ROI, location, fit, objections, or next steps"
                      disabled={sending}
                    />
                    <Button
                      size="icon"
                      className="h-11 w-11 shrink-0"
                      onClick={() => void sendMessage()}
                      disabled={!draft.trim() || sending}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}

              <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
                <span>{assistantMode === "gemini" ? "Live property guidance is active." : "Property guidance is ready."}</span>
                {statusMessage ? <span className="text-right">{statusMessage}</span> : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
