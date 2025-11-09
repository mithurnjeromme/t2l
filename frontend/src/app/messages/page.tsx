"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  MoreVertical,
  Send,
  CheckCheck,
  Check,
  MessageCircle,
  Lock,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/header";
import { useMessages } from "@/lib/messages-context";

// Chat type definition
interface Message {
  id: number;
  sender: "client" | "lawyer";
  text: string;
  timestamp: string;
  status?: "sent" | "delivered" | "read";
}

interface Chat {
  id: number;
  lawyerName: string;
  lawyerSpecialization: string;
  avatar: string;
  online: boolean;
  verified: boolean;
  lastMessage: string;
  timestamp: string;
  unread: number;
  messages: Message[];
  caseDescription?: string;
  isPending?: boolean; // New: indicates if lawyer hasn't accepted yet
  lawyerDetails?: {
    // Hidden until lawyer accepts
    fullName?: string;
    phone?: string;
    email?: string;
    rating?: number;
  };
}

// Empty chats by default - will be populated when client adds a lawyer
const initialChats: Chat[] = [];

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { chats, addChat, markAsRead, updateChat } = useMessages();
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if redirected from consult page with pending lawyer chat
  useEffect(() => {
    const pendingLawyerId = searchParams.get("lawyerId");
    const caseDesc = searchParams.get("caseDescription");
    const lawyerSpec = searchParams.get("specialization");
    const hashedName = searchParams.get("lawyerName"); // Hashed lawyer name

    if (pendingLawyerId && caseDesc && lawyerSpec) {
      const chatId = parseInt(pendingLawyerId);

      // Check if this chat already exists to prevent duplicates
      const existingChat = chats.find((c) => c.id === chatId);
      if (existingChat) {
        setSelectedChat(chatId);
        window.history.replaceState({}, "", "/messages");
        return;
      }

      // Create a pending chat with hidden lawyer details
      const pendingChat: Chat = {
        id: chatId,
        lawyerName: hashedName || "Lawyer (Pending Acceptance)", // Use hashed name
        lawyerSpecialization: lawyerSpec,
        avatar: "⚖️",
        online: false,
        verified: false,
        lastMessage: `Consultation request sent`,
        timestamp: "Just now",
        unread: 0,
        isPending: true,
        messages: [
          {
            id: Date.now(),
            sender: "client",
            text: caseDesc,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            status: "sent",
          },
          {
            id: Date.now() + 1,
            sender: "client",
            text: "✅ Your consultation request has been sent. Waiting for the lawyer to accept...",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            status: "delivered",
          },
        ],
        caseDescription: caseDesc,
      };

      addChat(pendingChat);
      setSelectedChat(pendingChat.id);

      // Clean up URL params
      window.history.replaceState({}, "", "/messages");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Only depend on searchParams, not addChat

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat, chats]);

  useEffect(() => {
    if (selectedChat) {
      markAsRead(selectedChat);
    }
  }, [selectedChat, markAsRead]);

  const filteredChats = chats.filter(
    (chat: Chat) =>
      chat.lawyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lawyerSpecialization
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  const currentChat = chats.find((chat: Chat) => chat.id === selectedChat);

  // Function to add a new lawyer chat (will be called when client adds a lawyer)
  const addLawyerChat = (
    lawyerName: string,
    specialization: string,
    caseDescription: string,
  ) => {
    const newChat: Chat = {
      id: Date.now(),
      lawyerName,
      lawyerSpecialization: specialization,
      avatar: "⚖️",
      online: true,
      verified: true,
      lastMessage: `Case: ${caseDescription.substring(0, 50)}...`,
      timestamp: "Just now",
      unread: 0,
      messages: [
        {
          id: Date.now(),
          sender: "lawyer",
          text: `Hello! I've received your case regarding: ${caseDescription}. I'll review the details and get back to you shortly.`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ],
      caseDescription,
    };

    addChat(newChat);
    setSelectedChat(newChat.id);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;

    // Check if chat is pending - prevent sending messages
    const chat = chats.find((c) => c.id === selectedChat);
    if (chat?.isPending) {
      return; // Cannot send messages while pending
    }

    const newMessage: Message = {
      id: Date.now(),
      sender: "client",
      text: messageInput,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sent",
    };

    const currentChatData = chats.find((c) => c.id === selectedChat);
    if (currentChatData) {
      updateChat(selectedChat, {
        messages: [...currentChatData.messages, newMessage],
        lastMessage: messageInput,
        timestamp: "Just now",
      });
    }

    setMessageInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageStatusIcon = (status?: string) => {
    if (!status) return null;
    switch (status) {
      case "sent":
        return <Check className="h-3 w-3" />;
      case "delivered":
      case "read":
        return <CheckCheck className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <div className="fixed inset-0 top-[72px] bg-background">
        <div className="w-full h-full flex">
          {/* Chat List Sidebar */}
          <div className="w-96 border-r border-white/10 flex flex-col bg-card">
            {/* Sidebar Header */}
            <div className="p-5 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h1 className="font-bold text-white text-xl">Messages</h1>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 hover:bg-white/5 rounded-lg"
                >
                  <MoreVertical className="h-4 w-4 text-gray-400" />
                </Button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {chats.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-center px-6">
                  <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                    <MessageCircle className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">
                    No Conversations Yet
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 max-w-xs">
                    Connect with a lawyer to start discussing your case.
                  </p>
                  <Button
                    onClick={() => router.push("/consult")}
                    className="bg-primary hover:bg-primary/90 text-black font-semibold"
                  >
                    Find a Lawyer
                  </Button>
                </div>
              ) : filteredChats.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-white text-sm font-medium mb-1">
                    No results found
                  </p>
                  <p className="text-xs text-gray-400">
                    Try different keywords
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {filteredChats.map((chat: Chat) => (
                    <button
                      key={chat.id}
                      className={cn(
                        "w-full p-4 transition-all cursor-pointer flex items-start gap-3 text-left",
                        selectedChat === chat.id
                          ? "bg-primary/10 border-l-2 border-primary"
                          : "hover:bg-white/5 border-l-2 border-transparent",
                      )}
                      onClick={() => setSelectedChat(chat.id)}
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                          <span className="text-xl">{chat.avatar}</span>
                        </div>
                        {chat.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-card"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center gap-1.5 min-w-0 flex-1">
                            <h4
                              className={cn(
                                "font-semibold text-sm truncate",
                                selectedChat === chat.id
                                  ? "text-white"
                                  : "text-gray-200",
                              )}
                            >
                              {chat.isPending ? (
                                <span className="flex items-center gap-1.5">
                                  <Lock className="h-3 w-3" />
                                  {chat.lawyerName}
                                </span>
                              ) : (
                                chat.lawyerName
                              )}
                            </h4>
                            {chat.verified && !chat.isPending && (
                              <div className="flex-shrink-0 w-4 h-4 rounded-full bg-secondary/20 border border-secondary flex items-center justify-center">
                                <svg
                                  className="w-2.5 h-2.5 text-secondary"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                            {chat.timestamp}
                          </span>
                        </div>

                        <p className="text-xs text-gray-400 mb-1.5">
                          {chat.isPending ? (
                            <span className="flex items-center gap-1 text-yellow-400">
                              <Clock className="h-3 w-3" />
                              Awaiting lawyer acceptance
                            </span>
                          ) : (
                            chat.lawyerSpecialization
                          )}
                        </p>

                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-400 truncate flex-1 pr-2">
                            {chat.lastMessage}
                          </p>
                          {chat.unread > 0 && (
                            <span className="flex-shrink-0 h-5 min-w-[20px] px-1.5 bg-secondary text-black rounded-full text-xs flex items-center justify-center font-semibold">
                              {chat.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Window */}
          {currentChat ? (
            <div className="flex-1 flex flex-col bg-background">
              {/* Chat Header */}
              <div className="p-4 border-b border-white/10 bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                        <span className="text-lg">{currentChat.avatar}</span>
                      </div>
                      {currentChat.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-card"></div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-white font-bold text-base">
                          {currentChat.isPending ? (
                            <span className="flex items-center gap-2">
                              <Lock className="h-4 w-4 text-yellow-400" />
                              {currentChat.lawyerName}
                            </span>
                          ) : (
                            currentChat.lawyerName
                          )}
                        </h2>
                        {currentChat.verified && !currentChat.isPending && (
                          <div className="w-4 h-4 rounded-full bg-secondary/20 border border-secondary flex items-center justify-center">
                            <svg
                              className="w-2.5 h-2.5 text-secondary"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        {currentChat.isPending ? (
                          <span className="text-yellow-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Pending lawyer acceptance
                          </span>
                        ) : currentChat.online ? (
                          <span className="text-secondary">Online</span>
                        ) : (
                          currentChat.lawyerSpecialization
                        )}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 hover:bg-white/5 rounded-lg"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-400" />
                  </Button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {currentChat.isPending && (
                  <div className="mb-6 p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Lock className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-yellow-400 font-semibold mb-1">
                          Waiting for Lawyer Acceptance
                        </h4>
                        <p className="text-gray-300 text-sm">
                          Your case has been sent to the lawyer. Once they
                          accept, you'll be able to start chatting. The lawyer's
                          identity remains private for confidentiality. This
                          typically takes a few hours.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-center mb-6">
                  <div className="bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
                    <p className="text-xs text-gray-400">Today</p>
                  </div>
                </div>

                {currentChat.messages.map((message: Message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex animate-fade-in",
                      message.sender === "client"
                        ? "justify-end"
                        : "justify-start",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[70%] rounded-2xl px-4 py-3",
                        message.sender === "client"
                          ? "bg-primary text-black"
                          : "bg-card text-white border border-white/10",
                      )}
                    >
                      <p className="text-sm leading-relaxed break-words">
                        {message.text}
                      </p>
                      <div
                        className={cn(
                          "flex items-center gap-1 mt-1.5",
                          message.sender === "client"
                            ? "justify-end"
                            : "justify-start",
                        )}
                      >
                        <span
                          className={cn(
                            "text-xs",
                            message.sender === "client"
                              ? "text-black/60"
                              : "text-gray-400",
                          )}
                        >
                          {message.timestamp}
                        </span>
                        {message.sender === "client" && (
                          <span className="text-black/60">
                            {getMessageStatusIcon(message.status)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-white/10 bg-card">
                {currentChat.isPending ? (
                  <div className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 border border-white/10 rounded-xl">
                    <Lock className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-400 text-sm">
                      Messaging locked until lawyer accepts your request
                    </p>
                  </div>
                ) : (
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <textarea
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none max-h-32"
                        rows={1}
                      />
                    </div>

                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      className="h-11 w-11 p-0 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <Send className="h-4 w-4 text-black" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-background">
              <div className="text-center max-w-md px-6">
                <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 mx-auto">
                  <MessageCircle className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-white font-semibold text-xl mb-2">
                  Select a Conversation
                </h3>
                <p className="text-gray-400 text-sm">
                  Choose a conversation from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="text-[#e5c454]">Loading messages...</div>
        </div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}
