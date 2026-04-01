"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const STARTER_QUESTIONS = [
  "Hoe kan AI mijn klantenservice automatiseren?",
  "Wat levert AI op voor een MKB-bedrijf in Zuid-Limburg?",
  "Hoe bespaar ik 40 uur per week met AI-agents?",
  "Welke processen lenen zich het best voor AI-automatisering?",
];

export default function AIDemo() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || isStreaming) return;

    const userMessage: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsStreaming(true);
    setStarted(true);

    const assistantMessage: Message = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!res.ok || !res.body) throw new Error("API error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: updated[updated.length - 1].content + chunk,
          };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content:
            "Er is iets misgegaan. Probeer het opnieuw of neem direct contact met ons op.",
        };
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <section id="demo" className="relative px-6 py-32">
      {/* Background accent */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4af0c4]/[0.03] blur-3xl" />

      <div className="relative mx-auto max-w-3xl">
        <div className="mb-12 flex flex-col gap-4">
          <span className="text-xs font-medium uppercase tracking-widest text-[#4af0c4]">
            Live demo
          </span>
          <h2 className="text-4xl font-black tracking-tight text-[#f0f4ff] sm:text-5xl">
            Ervaar het zelf.
            <br />
            <span className="text-[#8892a4]">Vraag het onze AI.</span>
          </h2>
          <p className="max-w-xl text-[#8892a4]">
            Stel een vraag over AI en automatisering voor jouw bedrijf. Dit is een echte AI —
            aangedreven door Claude.
          </p>
        </div>

        {/* Chat window */}
        <div className="flex flex-col gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
          {/* Header bar */}
          <div className="flex items-center gap-3 border-b border-white/5 bg-[#0d1219] px-5 py-3">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-white/10" />
              <div className="h-3 w-3 rounded-full bg-white/10" />
              <div className="h-3 w-3 rounded-full bg-white/10" />
            </div>
            <span className="text-xs text-[#8892a4]">Maison Blender — AI Adviseur</span>
            <div className="ml-auto flex items-center gap-1.5 text-xs text-[#4af0c4]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#4af0c4]" />
              live
            </div>
          </div>

          {/* Messages area */}
          <div className="min-h-[320px] max-h-[480px] overflow-y-auto bg-[#080b10] p-5 flex flex-col gap-4">
            {!started && (
              <div className="flex flex-col gap-3 my-auto">
                <p className="text-sm text-[#8892a4] text-center py-4">
                  Stel een vraag of kies een van de suggesties hieronder
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {STARTER_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3 text-left text-sm text-[#8892a4] transition-all hover:border-[#4af0c4]/20 hover:bg-[#4af0c4]/5 hover:text-[#f0f4ff]"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#4af0c4]/20 bg-[#4af0c4]/10 text-xs font-bold text-[#4af0c4]">
                    AI
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#4af0c4]/10 text-[#f0f4ff] border border-[#4af0c4]/10"
                      : "bg-white/[0.04] text-[#c8d0e0] border border-white/5"
                  }`}
                >
                  {msg.content || (
                    <span className="inline-flex gap-1">
                      <span className="animate-bounce text-[#4af0c4]" style={{ animationDelay: "0ms" }}>·</span>
                      <span className="animate-bounce text-[#4af0c4]" style={{ animationDelay: "150ms" }}>·</span>
                      <span className="animate-bounce text-[#4af0c4]" style={{ animationDelay: "300ms" }}>·</span>
                    </span>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/5 text-xs text-[#8892a4]">
                    U
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div className="flex items-end gap-3 border-t border-white/5 bg-[#0d1219] px-4 py-3">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Stel een vraag over AI voor jouw bedrijf…"
              disabled={isStreaming}
              className="flex-1 resize-none bg-transparent py-1.5 text-sm text-[#f0f4ff] placeholder-[#8892a4]/60 outline-none disabled:opacity-50"
              style={{ maxHeight: "120px" }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isStreaming}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#4af0c4] text-[#080b10] transition-all hover:bg-[#6af5d4] disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Verstuur"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M13 1L1 7l5 2m7-8L8 13l-2-4m7-8L6 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-[#8892a4]/50">
          Aangedreven door Claude · Maison Blender AI-demo
        </p>
      </div>
    </section>
  );
}
