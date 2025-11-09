"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

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

interface MessagesContextType {
  chats: Chat[];
  addChat: (chat: Chat) => void;
  updateChat: (chatId: number, updates: Partial<Chat>) => void;
  getTotalUnread: () => number;
  markAsRead: (chatId: number) => void;
}

const MessagesContext = createContext<MessagesContextType | undefined>(
  undefined,
);

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);

  // Load chats from localStorage on mount
  useEffect(() => {
    const savedChats = localStorage.getItem("turn2law-chats");
    if (savedChats) {
      try {
        setChats(JSON.parse(savedChats));
      } catch (error) {
        console.error("Failed to load chats:", error);
      }
    }
  }, []);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem("turn2law-chats", JSON.stringify(chats));
    }
  }, [chats]);

  const addChat = useCallback((chat: Chat) => {
    setChats((prev) => {
      // Check if chat already exists
      const exists = prev.find((c) => c.id === chat.id);
      if (exists) {
        return prev.map((c) => (c.id === chat.id ? chat : c));
      }
      return [chat, ...prev];
    });
  }, []);

  const updateChat = useCallback((chatId: number, updates: Partial<Chat>) => {
    setChats((prev) =>
      prev.map((chat) => (chat.id === chatId ? { ...chat, ...updates } : chat)),
    );
  }, []);

  const getTotalUnread = useCallback(() => {
    return chats.reduce((total, chat) => total + chat.unread, 0);
  }, [chats]);

  const markAsRead = useCallback((chatId: number) => {
    setChats((prev) =>
      prev.map((chat) => (chat.id === chatId ? { ...chat, unread: 0 } : chat)),
    );
  }, []);

  return (
    <MessagesContext.Provider
      value={{ chats, addChat, updateChat, getTotalUnread, markAsRead }}
    >
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error("useMessages must be used within a MessagesProvider");
  }
  return context;
}
