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
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/header";
import { useMessages } from "@/lib/messages-context";

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
  isPending?: boolean;
  lawyerDetails?: {
    fullName?: string;
    phone?: string;
    email?: string;
    rating?: number;
  };
}

const initialChats: Chat[] = [];

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { chats, addChat, markAsRead, updateChat } = useMessages();
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pendingLawyerId = searchParams.get("lawyerId");
    const caseDesc = searchParams.get("caseDescription");
    const lawyerSpec = searchParams.get("specialization");
    const hashedName = searchParams.get("lawyerName");

    if (pendingLawyerId && caseDesc && lawyerSpec) {
      const chatId = parseInt(pendingLawyerId);
      const existingChat = chats.find((c) => c.id === chatId);
      if (existingChat) {
        setSelectedChat(chatId);
        window.history.replaceState({}, "", "/messages");
        return;
      }

      const pendingChat: Chat = {
        id: chatId,
        lawyerName: hashedName || "Lawyer (Pending Acceptance)",
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
      window.history.replaceState({}, "", "/messages");
    }
  }, [searchParams, chats, addChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat, chats]);

  useEffect(() => {
    if (selectedChat) markAsRead(selectedChat);
  }, [selectedChat, markAsRead]);

  const filteredChats = chats.filter(
    (chat) =>
      chat.lawyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lawyerSpecialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentChat = chats.find((chat) => chat.id === selectedChat);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;
    const chat = chats.find((c) => c.id === selectedChat);
    if (chat?.isPending) return;

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
      <div className="fixed inset-0 top-[72px] bg-background flex">
        {/* Sidebar toggle button (mobile only) */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden absolute top-4 left-4 z-20 bg-white/10 p-2 rounded-lg border border-white/20 hover:bg-white/20"
        >
          <Menu className="h-5 w-5 text-white" />
        </button>

        {/* Overlay for mobile (click outside to close) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={cn(
            "fixed md:static inset-y-0 left-0 z-50 w-80 md:w-96 bg-card border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out",
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          )}
        >
          {/* Close button (mobile only) */}
          <div className="md:hidden flex justify-end p-3 border-b border-white/10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="p-0 h-8 w-8"
            >
              <X className="h-5 w-5 text-gray-300" />
            </Button>
          </div>

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
            {filteredChats.length === 0 ? (
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
            ) : (
              <div className="divide-y divide-white/5">
                {filteredChats.map((chat) => (
                  <button
                    key={chat.id}
                    className={cn(
                      "w-full p-4 transition-all cursor-pointer flex items-start gap-3 text-left",
                      selectedChat === chat.id
                        ? "bg-primary/10 border-l-2 border-primary"
                        : "hover:bg-white/5 border-l-2 border-transparent"
                    )}
                    onClick={() => {
                      setSelectedChat(chat.id);
                      setSidebarOpen(false);
                    }}
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
                        <h4
                          className={cn(
                            "font-semibold text-sm truncate",
                            selectedChat === chat.id
                              ? "text-white"
                              : "text-gray-200"
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
                      <p className="text-xs text-gray-400 truncate">
                        {chat.lastMessage}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-background mt-0 md:mt-0">
          {currentChat ? (
            <>
              <div className="p-4 border-b border-white/10 bg-card flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                      <span className="text-lg">{currentChat.avatar}</span>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-white font-semibold text-base">
                      {currentChat.lawyerName}
                    </h2>
                    <p className="text-xs text-gray-400">
                      {currentChat.online
                        ? "Online"
                        : currentChat.lawyerSpecialization}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {currentChat.messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.sender === "client"
                        ? "justify-end"
                        : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[75%] md:max-w-[70%] rounded-2xl px-4 py-2",
                        message.sender === "client"
                          ? "bg-primary text-black"
                          : "bg-card text-white border border-white/10"
                      )}
                    >
                      <p className="text-sm break-words">{message.text}</p>
                      <div
                        className={cn(
                          "flex items-center gap-1 mt-1",
                          message.sender === "client"
                            ? "justify-end text-black/60"
                            : "justify-start text-gray-400"
                        )}
                      >
                        <span className="text-xs">{message.timestamp}</span>
                        {message.sender === "client" &&
                          getMessageStatusIcon(message.status)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 border-t border-white/10 bg-card">
                <div className="flex items-end gap-2">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-primary/50 resize-none max-h-32"
                    rows={1}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="h-11 w-11 p-0 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-40 transition-all"
                  >
                    <Send className="h-4 w-4 text-black" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
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
