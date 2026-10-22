"use client";

import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  Bot,
  User,
  RotateCcw,
  ChefHat,
  MessageSquare,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function CookingAssistant({ recipe }) {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hello chef! I'm your AI Sous-Chef for this **${recipe?.title}**. Ask me anything about ingredient swaps, timing, heat levels, or technique!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    `Can I substitute any dairy or nuts?`,
    `How do I know when the sauce is properly reduced?`,
    `Can I prep this the day before?`,
    `What wine or beverage pairs best with this?`,
  ];

  const handleSend = async (textToSend) => {
    const text = textToSend || input.trim();
    if (!text || loading) return;

    const userMessage = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipe: {
            title: recipe.title,
            cuisine: recipe.cuisine,
            ingredients: recipe.ingredients,
            steps: recipe.steps,
            chefTips: recipe.chefTips,
            allergens: recipe.allergens,
          },
          messages: updatedMessages,
          prompt: text,
        }),
      });

      if (!res.ok) {
        throw new Error("Assistant response failed");
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || "Happy cooking! Let me know if you need anything else.",
        },
      ]);
    } catch (err) {
      console.error("AI Assistant error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I ran into a temporary kitchen hiccup. For culinary safety: keep your heat moderate, taste as you go, and don't hesitate to ask again!",
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8DEC8] shadow-md overflow-hidden transition-all">
      {/* Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 sm:p-5 bg-gradient-to-r from-[#221B1A] to-[#382B2A] text-white flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#D95338] text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-base font-bold text-white">AI Sous-Chef</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-400/30">
                Online &bull; Context Aware
              </span>
            </div>
            <p className="text-[11px] text-stone-300">
              Live guidance tailored to {recipe.title}
            </p>
          </div>
        </div>

        <button
          className="text-stone-300 hover:text-white p-1 rounded-lg"
          aria-label="Toggle assistant"
        >
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Body */}
      {isOpen && (
        <div className="flex flex-col h-[420px] sm:h-[460px]">
          {/* Quick Prompts Bar */}
          <div className="p-3 bg-[#FAF7F2] border-b border-[#E8DEC8] overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 min-w-max">
              <span className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#D95338]" /> Ask:
              </span>
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  disabled={loading}
                  className="px-2.5 py-1 text-xs bg-white text-stone-700 hover:text-[#D95338] hover:border-[#D95338] border border-stone-200 rounded-full transition-colors whitespace-nowrap disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-stone-50/50">
            {messages.map((msg, index) => {
              const isAssistant = msg.role === "assistant";
              return (
                <div
                  key={index}
                  className={`flex gap-3 ${isAssistant ? "items-start" : "items-start flex-row-reverse"}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
                      isAssistant
                        ? "bg-[#D95338] text-white"
                        : "bg-stone-800 text-white"
                    }`}
                  >
                    {isAssistant ? <ChefHat className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                      isAssistant
                        ? "bg-white text-stone-800 border border-[#E8DEC8] shadow-xs"
                        : "bg-[#D95338] text-white shadow-xs font-sans"
                    }`}
                  >
                    {/* Render plain text or simple markdown formatting */}
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-3 items-center text-stone-500 text-xs italic">
                <div className="w-7 h-7 rounded-full bg-[#D95338] text-white flex items-center justify-center shrink-0">
                  <ChefHat className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-white px-3 py-2 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#D95338] rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-[#D95338] rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-[#D95338] rounded-full animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1 text-[11px] text-stone-600">Chef is reviewing recipe notes...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-[#E8DEC8]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about steps, substitutions, heat level..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                className="flex-1 bg-[#FAF7F2] text-xs sm:text-sm text-stone-800 rounded-full px-4 py-2.5 border border-[#E0D4C3] focus:outline-none focus:ring-2 focus:ring-[#D95338]/30 focus:border-[#D95338] disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-full bg-[#D95338] text-white flex items-center justify-center hover:bg-[#C24329] active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-xs"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
