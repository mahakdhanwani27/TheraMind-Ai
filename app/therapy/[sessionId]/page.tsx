"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  PlusCircle,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { BreathingGame } from "@/components/games/breathing-game";
import { ZenGarden } from "@/components/games/zen-garden";
import { ForestGame } from "@/components/games/forest-game";
import { OceanWaves } from "@/components/games/ocean-waves";
import {
  createChatSession,
  sendChatMessage,
  getChatHistory,
  getAllChatSessions,
  ChatMessage,
  ChatSession,
} from "@/lib/api/chat";

interface StressPrompt {
  trigger: string;
  activity: {
    type: "breathing" | "garden" | "forest" | "waves";
    title: string;
    description: string;
  };
}

const SUGGESTED_QUESTIONS = [
  { text: "How can I manage my anxiety better?" },
  { text: "I've been feeling overwhelmed lately" },
  { text: "Can we talk about improving sleep?" },
  { text: "I need help with work-life balance" },
];

const glowAnimation = {
  initial: { opacity: 0.5, scale: 1 },
  animate: {
    opacity: [0.5, 1, 0.5],
    scale: [1, 1.05, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function TherapyPage() {
  const params = useParams();
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(
    params.sessionId as string
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [stressPrompt, setStressPrompt] = useState<StressPrompt | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🧠 Scroll to latest message
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // 🧩 Initialize chat
  useEffect(() => {
    const initChat = async () => {
      try {
        setIsLoading(true);
        if (!sessionId || sessionId === "new") {
          const newSessionId = await createChatSession();
          setSessionId(newSessionId);
          window.history.pushState({}, "", `/therapy/${newSessionId}`);
        } else {
          const history = await getChatHistory(sessionId);
          if (Array.isArray(history)) {
            const formattedHistory = history.map((msg) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            }));
            setMessages(formattedHistory);
          } else {
            setMessages([]);
          }
        }
      } catch {
        setMessages([
          {
            role: "assistant",
            content:
              "I’m having trouble loading your session. Please refresh the page.",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    initChat();
  }, [sessionId]);

  // 🗂️ Load all sessions
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const allSessions = await getAllChatSessions();
        setSessions(allSessions);
      } catch (e) {
        console.error("Error loading sessions:", e);
      }
    };
    loadSessions();
  }, [messages]);

  // ✨ Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentMessage = message.trim();
    if (!currentMessage || isTyping || !sessionId) return;

    setMessage("");
    setIsTyping(true);

    const userMessage: ChatMessage = {
      role: "user",
      content: currentMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // 🧘 Stress detection
    const stressCheck = detectStressSignals(currentMessage);
    if (stressCheck) {
      setStressPrompt(stressCheck);
      setIsTyping(false);
      return;
    }

    try {
      const response = await sendChatMessage(sessionId, currentMessage);
      const aiResponse =
        typeof response === "string" ? JSON.parse(response) : response;

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content:
          aiResponse.response ||
          aiResponse.message ||
          "I'm here to support you. Tell me more about what's on your mind.",
        timestamp: new Date(),
        metadata: {
          technique: aiResponse.metadata?.technique || "supportive",
          goal: aiResponse.metadata?.currentGoal || "Provide support",
        },
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I’m having trouble connecting right now. Please try again later.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
      scrollToBottom();
    }
  };

  // 🔍 Detect stress triggers
  const detectStressSignals = (message: string): StressPrompt | null => {
    const keywords = [
      "stress",
      "anxiety",
      "panic",
      "nervous",
      "pressure",
      "overwhelmed",
      "tense",
    ];
    const found = keywords.find((k) => message.toLowerCase().includes(k));
    if (found) {
      const activities = [
        {
          type: "breathing" as const,
          title: "Breathing Exercise",
          description: "Follow calming breathing patterns",
        },
        {
          type: "waves" as const,
          title: "Ocean Waves",
          description: "Relax with wave sounds and visuals",
        },
        {
          type: "garden" as const,
          title: "Zen Garden",
          description: "Create a peaceful digital garden",
        },
        {
          type: "forest" as const,
          title: "Mindful Forest",
          description: "Take a calm virtual forest walk",
        },
      ];
      return {
        trigger: found,
        activity: activities[Math.floor(Math.random() * activities.length)],
      };
    }
    return null;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // ✨ UI
  return (
    <div className="relative max-w-7xl mx-auto px-4">
      <div className="flex h-[calc(100vh-4rem)] mt-20 gap-6">
        {/* Sidebar */}
        <div className="w-80 flex flex-col border-r bg-muted/30">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Chat Sessions</h2>
            <Button variant="ghost" size="icon" onClick={() => createChatSession()}>
              <PlusCircle className="w-5 h-5" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.sessionId}
                  onClick={() => setSessionId(session.sessionId)}
                  className={cn(
                    "p-3 rounded-lg cursor-pointer transition",
                    session.sessionId === sessionId
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted/40"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-medium">
                      {session.messages[0]?.content.slice(0, 30) || "New Chat"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {session.messages.length} messages ·{" "}
                    {formatDistanceToNow(new Date(session.updatedAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col bg-background rounded-lg border overflow-hidden">
          <div className="p-4 border-b flex items-center gap-2">
            <Bot className="w-6 h-6 text-primary" />
            <h2 className="font-semibold">AI Therapist</h2>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.timestamp.toISOString()}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "px-6 py-8",
                      msg.role === "assistant"
                        ? "bg-muted/30"
                        : "bg-background"
                    )}
                  >
                    <div className="flex gap-4">
                      <div className="w-8 h-8 shrink-0">
                        {msg.role === "assistant" ? (
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                            <Bot className="w-5 h-5" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                            <User className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">
                            {msg.role === "assistant" ? "AI Therapist" : "You"}
                          </p>
                          {msg.metadata?.technique && (
                            <Badge variant="secondary" className="text-xs">
                              {msg.metadata.technique}
                            </Badge>
                          )}
                        </div>
                        <div className="prose dark:prose-invert text-sm mt-1">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && (
                <div className="px-6 py-4 text-sm text-muted-foreground">
                  AI Therapist is typing...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <form
              onSubmit={handleSubmit}
              className="max-w-3xl mx-auto flex items-end gap-3"
            >
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 rounded-xl border p-3 resize-none bg-background focus:ring-2 focus:ring-primary/50 outline-none"
                rows={1}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!message.trim() || isTyping}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
