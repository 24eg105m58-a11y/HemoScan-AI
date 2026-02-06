import { useMemo, useState } from "react";
import { Button } from "./ui/button";
import { api } from "../api/client";

type ChatMessage = {
  role: "user" | "ai";
  text: string;
};

const cannedReplies = [
  {
    match: ["diet", "food", "meal", "nutrition"],
    reply:
      "I can generate a personalized diet plan based on your results, diet type, and symptoms. Would you like a veg or non-veg plan?",
  },
  {
    match: ["cbc", "report", "hemoglobin", "hb"],
    reply:
      "Share your CBC values and I will explain them in simple language and highlight what matters most.",
  },
  {
    match: ["scan", "eye", "camera", "image"],
    reply:
      "For eye scans, ensure good lighting and capture a clear conjunctiva image. I can guide you step-by-step.",
  },
  {
    match: ["translate", "language", "local"],
    reply:
      "I can translate health advice into your preferred language. Which language should I use?",
  },
  {
    match: ["summary", "medical", "report"],
    reply:
      "I can auto-generate a medical summary to share with your doctor. Do you want a short or detailed summary?",
  },
];

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      text: "Hi, I'm your AI health assistant. Ask me about CBC reports, diet plans, scans, or translations.",
    },
  ]);

  const replyFor = async (text: string) => {
    try {
      const res = await api.chat(text);
      return res.reply;
    } catch {
      const lower = text.toLowerCase();
      const match = cannedReplies.find((item) =>
        item.match.some((m) => lower.includes(m))
      );
      return (
        match?.reply ??
        "Thanks! I can help with anemia screening, diet guidance, and report explanations. Try asking about your CBC or diet plan."
      );
    }
  };

  const canSend = useMemo(() => input.trim().length > 0, [input]);

  const handleSend = async () => {
    if (!canSend) return;
    const text = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    const aiText = await replyFor(text);
    setMessages((prev) => [...prev, { role: "ai", text: aiText }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-sky-100 overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-sky-500 to-teal-500 text-white flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">HemoScan AI Assistant</p>
              <p className="text-xs opacity-90">Generative health support</p>
            </div>
            <button
              className="text-white/90 hover:text-white"
              onClick={() => setOpen(false)}
              aria-label="Close chatbot"
            >
              ✕
            </button>
          </div>
          <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={
                  msg.role === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }
              >
                <div
                  className={
                    msg.role === "user"
                      ? "bg-sky-600 text-white px-3 py-2 rounded-2xl rounded-br-sm text-sm max-w-[80%]"
                      : "bg-slate-100 text-slate-800 px-3 py-2 rounded-2xl rounded-bl-sm text-sm max-w-[80%]"
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-slate-100 flex gap-2">
            <input
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
              placeholder="Ask about your report, diet, or symptoms..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />
            <Button
              className="bg-sky-600 hover:bg-sky-700 text-white"
              onClick={handleSend}
              disabled={!canSend}
            >
              Send
            </Button>
          </div>
        </div>
      )}
      {!open && (
        <Button
          className="bg-sky-600 hover:bg-sky-700 text-white shadow-lg"
          onClick={() => setOpen(true)}
        >
          AI Chat
        </Button>
      )}
    </div>
  );
}
