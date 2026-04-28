"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, RotateCcw } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
}

interface Props {
  tenantId: string;
  branche: string;
}

function parseSuggestions(text: string): { clean: string; suggestions: string[] } {
  const match = text.match(/<suggestions>([\s\S]*?)<\/suggestions>/);
  const clean = text.replace(/<suggestions>[\s\S]*?<\/suggestions>/g, "").trim();
  const suggestions: string[] = [];
  if (match) {
    const re = /<q>(.*?)<\/q>/g;
    let m;
    while ((m = re.exec(match[1])) !== null) {
      if (m[1].trim()) suggestions.push(m[1].trim());
    }
  }
  return { clean, suggestions };
}

const OPENING = `Hoi, ik ben de AI Collega van Makelaardij Van den Berg. Kan ik je helpen? Je kunt vragen stellen over onze woningen, het aankoop- of verkoopproces, of een bezichtiging inplannen.

<suggestions>
<q>Welke woningen zijn er beschikbaar?</q>
<q>Hoe werkt een bezichtiging aanvragen?</q>
<q>Wat zijn de courtagekosten?</q>
</suggestions>`;

export default function DemoChat({ tenantId, branche }: Props) {
  const [messages, setMessages] = useState<Message[]>(() => {
    const { clean, suggestions } = parseSuggestions(OPENING);
    return [{ role: "assistant", content: clean, suggestions }];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const convId = useRef<string>(crypto.randomUUID());

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg: Message = { role: "user", content: trimmed };
      const history = [...messages, userMsg];
      setMessages(history);
      setInput("");
      setLoading(true);

      try {
        const res = await fetch(`/api/aicollega/${branche}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tenantId,
            conversationId: convId.current,
            messages: history
              .filter((m) => m.role === "user" || m.role === "assistant")
              .map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        if (!res.ok || !res.body) {
          throw new Error(`HTTP ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let assistantText = "";

        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const parts = buffer.split("\n\n");
          buffer = parts.pop() ?? "";

          for (const part of parts) {
            const lines = part.split("\n");
            let event = "";
            let data = "";
            for (const line of lines) {
              if (line.startsWith("event: ")) event = line.slice(7);
              if (line.startsWith("data: ")) data = line.slice(6);
            }
            if (event === "delta" && data) {
              try {
                const parsed = JSON.parse(data) as { text: string };
                assistantText += parsed.text;
                setMessages((prev) => {
                  const next = [...prev];
                  next[next.length - 1] = {
                    role: "assistant",
                    content: assistantText,
                  };
                  return next;
                });
              } catch {}
            }
            if (event === "done") {
              const { clean, suggestions } = parseSuggestions(assistantText);
              setMessages((prev) => {
                const next = [...prev];
                next[next.length - 1] = {
                  role: "assistant",
                  content: clean,
                  suggestions,
                };
                return next;
              });
            }
            if (event === "error" && data) {
              try {
                const parsed = JSON.parse(data) as { error: string };
                setMessages((prev) => {
                  const next = [...prev];
                  next[next.length - 1] = {
                    role: "assistant",
                    content: parsed.error || "Er ging iets mis.",
                  };
                  return next;
                });
              } catch {}
            }
          }
        }
      } catch (err) {
        console.error("[DemoChat] fout:", err);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Er ging iets mis. Probeer het opnieuw.",
          },
        ]);
      } finally {
        setLoading(false);
        inputRef.current?.focus();
      }
    },
    [messages, loading, tenantId, branche]
  );

  const reset = () => {
    const { clean, suggestions } = parseSuggestions(OPENING);
    setMessages([{ role: "assistant", content: clean, suggestions }]);
    setInput("");
    convId.current = crypto.randomUUID();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <div className="flex flex-col bg-white h-[600px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className="flex flex-col gap-2 max-w-[85%]">
              <div
                className={`px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-[#1f1f1f] text-white"
                    : "bg-[#f2f3f5] text-[#1f1f1f]"
                }`}
              >
                {msg.content || (loading && i === messages.length - 1 ? (
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-[#575760] rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-[#575760] rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-[#575760] rounded-full animate-bounce [animation-delay:300ms]" />
                  </span>
                ) : "")}
              </div>

              {msg.role === "assistant" && msg.suggestions && msg.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {msg.suggestions.map((s, si) => (
                    <button
                      key={si}
                      onClick={() => send(s)}
                      disabled={loading}
                      className="text-xs border border-[#1f1f1f]/20 bg-white px-3 py-1.5 text-[#1f1f1f] hover:bg-[#f2f3f5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex justify-start">
            <div className="bg-[#f2f3f5] px-4 py-3">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-[#575760] rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-[#575760] rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-[#575760] rounded-full animate-bounce [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-black/10 p-4 flex gap-3 items-end">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Stel een vraag over een woning of het verkoopproces..."
          rows={1}
          disabled={loading}
          className="flex-1 resize-none bg-[#f2f3f5] text-sm text-[#1f1f1f] placeholder-[#575760] px-4 py-3 outline-none disabled:opacity-50 max-h-32"
          style={{ lineHeight: "1.5" }}
        />
        <div className="flex gap-2">
          <button
            onClick={reset}
            disabled={loading}
            title="Nieuw gesprek"
            className="p-3 text-[#575760] hover:text-[#1f1f1f] transition-colors disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            className="p-3 bg-[#1f1f1f] text-white hover:bg-[#3a3a42] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
