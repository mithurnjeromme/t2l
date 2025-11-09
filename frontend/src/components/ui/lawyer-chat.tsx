"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Send,
  Phone,
  Video,
  Calendar,
  Clock,
  CheckCheck,
  Check,
  Lock,
  Loader2,
} from "lucide-react";
import { Button } from "./button";
import { Textarea } from "./textarea";

interface Message {
  id: string;
  content: string;
  sender: "client" | "lawyer";
  timestamp: Date;
  status: "sent" | "delivered" | "read";
}

interface ChatRequest {
  caseDescription: string;
  preferredDateTime: string;
  status: "pending" | "accepted" | "rejected";
  timestamp: Date;
}

interface LawyerChatProps {
  isOpen: boolean;
  onClose: () => void;
  lawyerName: string;
  lawyerSpecialization: string;
  lawyerImage?: string;
  initialRequest: {
    caseDescription: string;
    preferredDateTime: string;
  };
  perMinuteRate: number;
}

export const LawyerChat = ({
  isOpen,
  onClose,
  lawyerName,
  lawyerSpecialization,
  initialRequest,
  perMinuteRate,
}: LawyerChatProps) => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [chatRequest, setChatRequest] = useState<ChatRequest>({
    caseDescription: initialRequest.caseDescription,
    preferredDateTime: initialRequest.preferredDateTime,
    status: "pending",
    timestamp: new Date(),
  });
  const [isLawyerTyping, setIsLawyerTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate initial system message and redirect to messages
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add system message about request sent
      const systemMessage: Message = {
        id: "system-1",
        content: `Your consultation request has been sent to the lawyer. Redirecting you to messages...`,
        sender: "client",
        timestamp: new Date(),
        status: "sent",
      };

      setMessages([systemMessage]);

      // Redirect to messages page with pending chat after 2 seconds
      setTimeout(() => {
        const params = new URLSearchParams({
          lawyerId: Date.now().toString(),
          caseDescription: initialRequest.caseDescription,
          specialization: lawyerSpecialization,
        });
        router.push(`/messages?${params.toString()}`);
        onClose(); // Close the chat modal
      }, 2000);
    }
  }, [
    isOpen,
    messages.length,
    initialRequest,
    lawyerSpecialization,
    router,
    onClose,
  ]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || chatRequest.status !== "accepted") return;

    const newMessage: Message = {
      id: `client-${Date.now()}`,
      content: inputMessage,
      sender: "client",
      timestamp: new Date(),
      status: "sent",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");

    // Simulate message status updates
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg,
        ),
      );
    }, 500);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "read" } : msg,
        ),
      );
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const maskName = (name: string) => {
    const parts = name.split(" ");
    return parts
      .map((part) => {
        if (part.length <= 2) return part;
        return (
          part.substring(0, 2) +
          "*".repeat(Math.min(part.length - 3, 2)) +
          part[part.length - 1]
        );
      })
      .join(" ");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      <div className="relative bg-gradient-to-br from-gray-900/98 via-black/98 to-gray-900/98 border border-white/10 rounded-3xl max-w-5xl w-full h-[90vh] overflow-hidden shadow-[0_0_100px_rgba(250,204,21,0.1)] backdrop-blur-2xl flex flex-col">
        {/* Chat Header */}
        <div className="relative bg-gradient-to-r from-gray-900/95 via-gray-950/95 to-gray-900/95 border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Lawyer Avatar */}
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border-2 border-yellow-400/30 flex items-center justify-center">
                  <span className="text-2xl">⚖️</span>
                </div>
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
              </div>

              {/* Lawyer Info */}
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  {maskName(lawyerName)}
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/30">
                    Verified
                  </span>
                </h3>
                <p className="text-white/60 text-sm">{lawyerSpecialization}</p>
                <p className="text-yellow-400 text-xs font-semibold mt-0.5">
                  ₹{perMinuteRate}/min • Available Now
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-green-500/20 border border-white/10 hover:border-green-500/50 flex items-center justify-center transition-all duration-300 group">
                <Phone className="w-5 h-5 text-white/60 group-hover:text-green-400 transition-colors" />
              </button>
              <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/50 flex items-center justify-center transition-all duration-300 group">
                <Video className="w-5 h-5 text-white/60 group-hover:text-blue-400 transition-colors" />
              </button>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 flex items-center justify-center transition-all duration-300 group"
              >
                <X className="w-5 h-5 text-white/60 group-hover:text-red-400 transition-colors" />
              </button>
            </div>
          </div>

          {/* Request Status Banner */}
          {chatRequest.status === "pending" && (
            <div className="mt-4 bg-yellow-400/10 border border-yellow-400/30 rounded-xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-yellow-400/20 flex items-center justify-center">
                <Clock className="w-4 h-4 text-yellow-400 animate-pulse" />
              </div>
              <div className="flex-1">
                <p className="text-yellow-400 text-sm font-semibold">
                  Request Pending
                </p>
                <p className="text-white/60 text-xs">
                  Waiting for lawyer to accept your consultation request...
                </p>
              </div>
            </div>
          )}

          {chatRequest.status === "accepted" && (
            <div className="mt-4 bg-green-400/10 border border-green-400/30 rounded-xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-400/20 flex items-center justify-center">
                <CheckCheck className="w-4 h-4 text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-green-400 text-sm font-semibold">
                  Request Accepted
                </p>
                <p className="text-white/60 text-xs">
                  You can now chat with your lawyer
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Messages Area */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-6 space-y-4 bg-black/20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        >
          {/* Date Separator */}
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5">
              <p className="text-white/60 text-xs font-medium">
                {formatDate(new Date())}
              </p>
            </div>
          </div>

          {/* Initial Case Request Card */}
          <div className="flex justify-end mb-6">
            <div className="max-w-xl">
              <div className="bg-gradient-to-br from-yellow-400/10 via-yellow-500/5 to-yellow-600/10 border border-yellow-400/30 rounded-2xl rounded-tr-md p-4 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-yellow-400" />
                  <p className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
                    Consultation Request
                  </p>
                </div>
                <p className="text-white text-sm mb-3 leading-relaxed">
                  {chatRequest.caseDescription}
                </p>
                <div className="flex items-center gap-2 text-xs text-white/50 pt-2 border-t border-white/10">
                  <Clock className="w-3 h-3" />
                  <span>
                    Preferred:{" "}
                    {new Date(chatRequest.preferredDateTime).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-1 mt-2">
                  <span className="text-white/40 text-xs">
                    {formatTime(chatRequest.timestamp)}
                  </span>
                  <CheckCheck className="w-4 h-4 text-yellow-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "client" ? "justify-end" : "justify-start"} mb-3`}
            >
              <div
                className={`max-w-xl ${message.sender === "client" ? "order-2" : "order-1"}`}
              >
                <div
                  className={`rounded-2xl p-4 shadow-lg ${
                    message.sender === "client"
                      ? "bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border border-yellow-400/30 rounded-tr-md"
                      : "bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-tl-md"
                  }`}
                >
                  <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-2">
                    <span className="text-white/40 text-xs">
                      {formatTime(message.timestamp)}
                    </span>
                    {message.sender === "client" && (
                      <>
                        {message.status === "sent" && (
                          <Check className="w-4 h-4 text-white/40" />
                        )}
                        {message.status === "delivered" && (
                          <CheckCheck className="w-4 h-4 text-white/40" />
                        )}
                        {message.status === "read" && (
                          <CheckCheck className="w-4 h-4 text-yellow-400" />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLawyerTyping && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl rounded-tl-md px-5 py-3">
                <div className="flex items-center gap-1">
                  <div
                    className="w-2 h-2 bg-white/40 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-white/40 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-white/40 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="relative bg-gradient-to-r from-gray-900/95 via-gray-950/95 to-gray-900/95 border-t border-white/10 p-6">
          {chatRequest.status === "pending" ? (
            // Locked Input
            <div className="bg-white/5 border-2 border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center">
                <Lock className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-center">
                <p className="text-white font-semibold mb-1">Chat Locked</p>
                <p className="text-white/60 text-sm">
                  Waiting for lawyer to accept your request...
                </p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />
                <span className="text-yellow-400 text-xs font-medium">
                  Processing request
                </span>
              </div>
            </div>
          ) : (
            // Active Input
            <div className="flex gap-3">
              <div className="flex-1 relative group">
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type your message..."
                  className="min-h-[56px] max-h-32 resize-none bg-black/40 border-2 border-white/10 focus:border-yellow-400/50 rounded-2xl text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-400/20 transition-all px-4 py-3 pr-12"
                  rows={1}
                />
                <div className="absolute bottom-3 right-3 text-xs text-white/30">
                  {inputMessage.length}/1000
                </div>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="h-14 w-14 rounded-2xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-400/30 hover:shadow-xl hover:shadow-yellow-400/50 transition-all duration-300 flex items-center justify-center group p-0"
              >
                <Send className="w-5 h-5 text-black group-hover:scale-110 transition-transform" />
              </Button>
            </div>
          )}

          {/* Quick Actions */}
          {chatRequest.status === "accepted" && (
            <div className="flex items-center gap-2 mt-3">
              <button className="text-xs text-white/60 hover:text-yellow-400 transition-colors">
                📎 Attach Document
              </button>
              <span className="text-white/20">•</span>
              <button className="text-xs text-white/60 hover:text-yellow-400 transition-colors">
                📅 Schedule Call
              </button>
              <span className="text-white/20">•</span>
              <button className="text-xs text-white/60 hover:text-yellow-400 transition-colors">
                💳 Payment Details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
