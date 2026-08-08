import { FormEventHandler, useEffect, useRef, useState } from "react";
import axios from "axios";

interface ChatMessage {
    id?: number;
    role: "user" | "assistant";
    content: string;
    created_at?: string;
}

function getSessionId(): string {
    const key = "verity_chat_session";
    let sessionId = localStorage.getItem(key);

    if (!sessionId) {
        sessionId = crypto.randomUUID
            ? crypto.randomUUID()
            : `sess-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        localStorage.setItem(key, sessionId);
    }

    return sessionId;
}

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const sessionId = useRef(getSessionId());

    useEffect(() => {
        if (open && messages.length === 0) {
            axios
                .get(route("chat.history"), {
                    params: { session_id: sessionId.current },
                })
                .then((res) => {
                    if (res.data.messages.length > 0) {
                        setMessages(res.data.messages);
                    } else {
                        setMessages([
                            {
                                role: "assistant",
                                content:
                                    "Hello! I'm the Verity House booking assistant. Ask me about rooms, dates, or anything else about your stay.",
                            },
                        ]);
                    }
                })
                .catch(() => {
                    setMessages([
                        {
                            role: "assistant",
                            content:
                                "Hello! I'm the Verity House booking assistant. Ask me about rooms, dates, or anything else about your stay.",
                        },
                    ]);
                });
        }
    }, [open]);

    useEffect(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages, sending]);

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        const text = input.trim();
        if (!text || sending) return;

        setMessages((prev) => [...prev, { role: "user", content: text }]);
        setInput("");
        setSending(true);

        try {
            const res = await axios.post(route("chat.send"), {
                session_id: sessionId.current,
                message: text,
            });
            setMessages((prev) => [...prev, res.data.message]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "Sorry, something went wrong sending that. Please try again.",
                },
            ]);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {open && (
                <div className="mb-4 flex h-[28rem] w-80 flex-col overflow-hidden rounded-tag border border-hairline bg-white shadow-2xl shadow-ink/20 sm:w-96">
                    <div className="flex items-center justify-between bg-ink px-4 py-3">
                        <div>
                            <p className="font-display text-sm text-ivory">
                                Booking Assistant
                            </p>
                            <p className="text-xs text-ivory/50">
                                Verity House
                            </p>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-ivory/60 hover:text-ivory"
                            aria-label="Close chat"
                        >
                            ✕
                        </button>
                    </div>

                    <div
                        ref={scrollRef}
                        className="flex-1 space-y-3 overflow-y-auto bg-ivory px-4 py-4"
                    >
                        {messages.map((m, i) => (
                            <div
                                key={m.id ?? i}
                                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                                        m.role === "user"
                                            ? "bg-burgundy text-ivory"
                                            : "border border-hairline bg-white text-charcoal"
                                    }`}
                                >
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {sending && (
                            <div className="flex justify-start">
                                <div className="rounded-2xl border border-hairline bg-white px-4 py-2 text-sm text-sage">
                                    Typing…
                                </div>
                            </div>
                        )}
                    </div>

                    <form
                        onSubmit={submit}
                        className="flex gap-2 border-t border-hairline p-3"
                    >
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about rooms, dates…"
                            className="flex-1 rounded-full border-hairline text-sm focus:border-brass focus:ring-brass"
                        />
                        <button
                            type="submit"
                            disabled={sending || !input.trim()}
                            className="rounded-full bg-ink px-4 py-2 text-sm text-ivory disabled:opacity-40"
                        >
                            Send
                        </button>
                    </form>
                </div>
            )}

            <button
                onClick={() => setOpen((v) => !v)}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-burgundy text-ivory shadow-xl shadow-ink/20 transition hover:bg-ink"
                aria-label="Toggle chat assistant"
            >
                {open ? "✕" : "💬"}
            </button>
        </div>
    );
}
