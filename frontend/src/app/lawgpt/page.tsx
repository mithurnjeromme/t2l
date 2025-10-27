"use client";

import React, { useRef, useEffect, useState } from "react";
import Header from '@/components/layout/header';
import WowAhhAnimation from "./Animation";
import { getLegalAIResponse, type ChatMessage as AIMessage } from '@/lib/nebius-ai';

// Simple skeleton loader component
function SkeletonLoader() {
  return (
    <div className="flex flex-col gap-3 mt-4">
      <div className="h-3 rounded bg-neutral-400/60 animate-pulse" style={{ width: '80%' }} />
      <div className="h-3 rounded bg-neutral-400/40 animate-pulse" style={{ width: '60%' }} />
      <div className="h-3 rounded bg-neutral-400/50 animate-pulse" style={{ width: '70%' }} />
      <div className="h-3 rounded bg-neutral-400/30 animate-pulse" style={{ width: '40%' }} />
      <div className="h-3 rounded bg-neutral-400/20 animate-pulse" style={{ width: '30%' }} />
    </div>
  );
}

// Custom LawGPT Sidebar
function LawGPTSidebar({ onClose }: { onClose: () => void }) {
  const mockChats = [
    "Chat title",
    "Chat title",
    "Chat title",
    "Chat title",
    "Chat title",
    "Chat title",
    "Chat title"
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-[340px] z-[100] bg-[#202020] border-r border-[#232323] flex flex-col shadow-2xl" style={{minWidth:340}}>
      {/* Header with LawGPT icon and close button */}
      <div className="flex items-center justify-between px-7 pt-3 pb-2" style={{ minHeight: 56 }}>
        <div className="flex items-center gap-3">
          <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.35028 11.6585C5.38323 9.62556 8.67069 9.61698 10.693 11.6393L14.0619 15.0082L10.7122 18.3579C8.67927 20.3908 5.39181 20.3994 3.36946 18.377L0.000606868 15.0082L3.35028 11.6585Z" fill="#3C9B97" fillOpacity="0.6"/>
            <path d="M18.3581 3.34931C20.391 5.38225 20.3996 8.66971 18.3773 10.6921L15.0084 14.0609L11.6587 10.7112C9.6258 8.6783 9.61722 5.39083 11.6396 3.36848L15.0084 -0.000370287L18.3581 3.34931Z" fill="#3C9B97" fillOpacity="0.6"/>
            <path d="M19.3044 11.6585C21.3373 9.62556 24.6248 9.61698 26.6471 11.6393L30.016 15.0082L26.6663 18.3579C24.6334 20.3908 21.3459 20.3994 19.3236 18.377L15.9547 15.0082L19.3044 11.6585Z" fill="#3C9B97" fillOpacity="0.6"/>
            <path d="M18.4934 19.1696C20.5263 21.2026 20.5033 24.5216 18.4421 26.5828L15.0085 30.0164L11.6588 26.6668C9.62585 24.6338 9.64879 21.3148 11.71 19.2536L15.1437 15.8199L18.4934 19.1696Z" fill="#3C9B97" fillOpacity="0.6"/>
          </svg>
          <span className="font-bold text-2xl text-white/80" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>LawGPT</span>
        </div>
        <button
          onClick={onClose}
          className="ml-2 flex items-center justify-center h-[45px] w-[45px] transition-colors focus:outline-none"
          style={{ boxShadow: 'none', background: 'none', borderRadius: 9999, padding: 0 }}
          aria-label="Close sidebar"
        >
          {/* Double chevron (>>) icon for closing, as provided */}
          <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M17.0484 8.0849C17.3881 8.42467 17.3881 8.97551 17.0484 9.31527L11.8635 14.5001L17.0484 19.6849C17.3881 20.0246 17.3881 20.5754 17.0484 20.9153C16.7086 21.255 16.1577 21.255 15.818 20.9153L10.018 15.1153C9.85484 14.9521 9.76318 14.7308 9.76318 14.5001C9.76318 14.2693 9.85484 14.0481 10.018 13.8849L15.818 8.0849C16.1577 7.74514 16.7086 7.74514 17.0484 8.0849Z" fill="white" style={{fill:'white',fillOpacity:1}}/>
            <path fillRule="evenodd" clipRule="evenodd" d="M10.2852 8.0849C10.6249 8.42467 10.6249 8.97551 10.2852 9.31527L5.10035 14.5001L10.2852 19.6849C10.6249 20.0246 10.6249 20.5754 10.2852 20.9153C9.94542 21.255 9.39456 21.255 9.05481 20.9153L3.25481 15.1153C3.09166 14.9521 3 14.7308 3 14.5001C3 14.2693 3.09166 14.0481 3.25481 13.8849L9.05481 8.0849C9.39456 7.74514 9.94542 7.74514 10.2852 8.0849Z" fill="white" style={{fill:'white',fillOpacity:1}}/>
          </svg>
        </button>
      </div>

      {/* Chat history mockups */}
      <div className="flex-1 overflow-y-auto px-7 pt-6">
        {/* No label, just chat titles */}
        <div className="flex flex-col gap-4">
          {mockChats.map((chat, i) => (
            <div
              key={i}
              className={
                `font-bold text-[1.18rem] text-white flex items-center transition-colors cursor-pointer select-none ` +
                (i === 0
                  ? 'bg-[#3A3A3A] text-white'
                  : 'hover:bg-[#232323] text-white/90')
              }
              style={{
                width: 239,
                height: 42,
                borderRadius: 13,
                paddingLeft: 22,
                paddingRight: 22,
                fontFamily: 'Instrument Sans, sans-serif',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                background: i === 0 ? '#3A3A3A' : 'none',
                display: 'flex',
                alignItems: 'center',
                marginLeft: 0,
                marginRight: 0,
                boxSizing: 'border-box',
              }}
            >
              {chat}
            </div>
          ))}
        </div>
      </div>

      {/* No new chat button at bottom, just spacing */}
      <div className="py-6" />
    </div>
  );
}

// Auto-sizing chat bubble component
function AutoBubble({ message, messageId }: { message: string; messageId: string }) {
  const textRef = useRef<HTMLDivElement>(null);
  const [bubbleSize, setBubbleSize] = useState({ width: 120, height: 60 });
  const [pop, setPop] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);

  useEffect(() => {
    const calculateSize = () => {
      const padding = 36;
      const verticalPadding = 36;
      const minWidth = 120;
      const minHeight = 60;
      const maxSingleLineWidth = 400;
      const wrapWidth = 380;

      const measureContainer = document.createElement('div');
      measureContainer.style.position = 'absolute';
      measureContainer.style.visibility = 'hidden';
      measureContainer.style.top = '-9999px';
      measureContainer.style.left = '-9999px';
      measureContainer.style.pointerEvents = 'none';
      measureContainer.id = `bubble-measure-${messageId}`;
      document.body.appendChild(measureContainer);

      try {
        const singleLineDiv = document.createElement('div');
        singleLineDiv.style.fontSize = '20px';
        singleLineDiv.style.fontFamily = 'Instrument Sans, sans-serif';
        singleLineDiv.style.fontWeight = '600';
        singleLineDiv.style.lineHeight = '24px';
        singleLineDiv.style.whiteSpace = 'nowrap';
        singleLineDiv.style.display = 'inline-block';
        singleLineDiv.textContent = message;
        measureContainer.appendChild(singleLineDiv);

        const naturalWidth = singleLineDiv.offsetWidth;
        const singleLineWidth = naturalWidth + padding;

        let finalWidth, finalHeight;

        if (singleLineWidth > maxSingleLineWidth) {
          const wrappedDiv = document.createElement('div');
          wrappedDiv.style.fontSize = '20px';
          wrappedDiv.style.fontFamily = 'Instrument Sans, sans-serif';
          wrappedDiv.style.fontWeight = '600';
          wrappedDiv.style.lineHeight = '24px';
          wrappedDiv.style.whiteSpace = 'pre-wrap';
          wrappedDiv.style.wordBreak = 'break-word';
          wrappedDiv.style.overflowWrap = 'break-word';
          wrappedDiv.style.width = `${wrapWidth}px`;
          wrappedDiv.textContent = message;
          measureContainer.appendChild(wrappedDiv);

          const wrappedHeight = wrappedDiv.offsetHeight;
          finalWidth = wrapWidth + padding;
          finalHeight = Math.max(minHeight, wrappedHeight + verticalPadding);
        } else {
          finalWidth = Math.max(singleLineWidth, minWidth);
          finalHeight = minHeight;
        }

        setBubbleSize({ width: finalWidth, height: finalHeight });
        setIsCalculated(true);
        setPop(true);
        setTimeout(() => setPop(false), 200);
      } finally {
        document.body.removeChild(measureContainer);
      }
    };

    if (message && messageId) {
      setIsCalculated(false);
      setBubbleSize({ width: 120, height: 60 });
      
      requestAnimationFrame(() => {
        calculateSize();
      });
    }
  }, [message, messageId]);

  return (
    <div className="inline-block">
      <svg
        key={`${messageId}-${isCalculated}`}
        width={bubbleSize.width}
        height={bubbleSize.height}
        viewBox={`0 0 ${bubbleSize.width} ${bubbleSize.height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`pointer-events-auto transition-all duration-300 ${pop ? 'scale-105' : 'scale-100'}`}
        style={{
          filter: 'drop-shadow(0 4px 16px rgba(60,155,151,0.18))',
          borderRadius: 32,
          transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
          display: 'block'
        }}
      >
        <path d={`M0 28C0 12.536 12.536 0 28 0H${bubbleSize.width-28}C${bubbleSize.width-12.536} 0 ${bubbleSize.width} 12.536 ${bubbleSize.width} 28V${bubbleSize.height-28}C${bubbleSize.width} ${bubbleSize.height-12.536} ${bubbleSize.width-12.536} ${bubbleSize.height} ${bubbleSize.width-28} ${bubbleSize.height}H28C12.536 ${bubbleSize.height} 0 ${bubbleSize.height-12.536} 0 ${bubbleSize.height-28}V28Z`} fill="#3C9B97" fillOpacity="0.8" />
        <foreignObject x="18" y="18" width={bubbleSize.width - 36} height={bubbleSize.height - 36}>
          <div
            ref={textRef}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: bubbleSize.height <= 60 ? 'center' : 'flex-start',
              justifyContent: 'flex-start',
              color: 'white',
              fontWeight: 600,
              fontSize: 20,
              lineHeight: '24px',
              fontFamily: 'Instrument Sans, sans-serif',
              textAlign: 'left',
              wordBreak: 'break-word',
              padding: '0',
              margin: '0',
              boxSizing: 'border-box',
              overflow: 'visible',
              whiteSpace: bubbleSize.width > 400 ? 'pre-wrap' : 'nowrap',
              overflowWrap: 'break-word',
              maxWidth: '100%'
            }}
          >
            <span style={{
              width: '100%', 
              display: 'block',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: bubbleSize.width > 400 ? 'pre-wrap' : 'nowrap'
            }}>
              {message}
            </span>
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}

interface LawGPTHeaderProps {
  onSidebarOpen: () => void;
  sidebarOpen: boolean;
}

function LawGPTHeader({ onSidebarOpen, sidebarOpen }: LawGPTHeaderProps) {
  return (
    <Header
      leftElement={
        <div className="flex items-center relative">
          <button
            className="mr-2 flex items-center focus:outline-none"
            onClick={onSidebarOpen}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? (
              <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'scaleX(-1)' }}>
                <path fillRule="evenodd" clipRule="evenodd" d="M11.9516 20.9151C11.6119 20.5753 11.6119 20.0245 11.9516 19.6847L17.1365 14.4999L11.9516 9.31508C11.6119 8.97539 11.6119 8.42458 11.9516 8.0847C12.2914 7.74502 12.8423 7.74502 13.182 8.0847L18.982 13.8847C19.1452 14.0479 19.2368 14.2692 19.2368 14.4999C19.2368 14.7307 19.1452 14.9519 18.982 15.1151L13.182 20.9151C12.8423 21.2549 12.2914 21.2549 11.9516 20.9151Z" fill="white" style={{fill:'white',fillOpacity:1}}/>
                <path fillRule="evenodd" clipRule="evenodd" d="M19.2549 20.9151C18.9151 20.5753 18.9151 20.0245 19.2549 19.6847L24.4397 14.4999L19.2549 9.31508C18.9151 8.97539 18.9151 8.42458 19.2549 8.0847C19.5946 7.74502 20.1455 7.74502 20.4852 8.0847L26.2852 13.8847C26.4484 14.0479 26.54 14.2692 26.54 14.4999C26.54 14.7307 26.4484 14.9519 26.2852 15.1151L20.4852 20.9151C20.1455 21.2549 19.5946 21.2549 19.2549 20.9151Z" fill="white" style={{fill:'white',fillOpacity:1}}/>
              </svg>
            ) : (
              <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M11.9516 20.9151C11.6119 20.5753 11.6119 20.0245 11.9516 19.6847L17.1365 14.4999L11.9516 9.31508C11.6119 8.97539 11.6119 8.42458 11.9516 8.0847C12.2914 7.74502 12.8423 7.74502 13.182 8.0847L18.982 13.8847C19.1452 14.0479 19.2368 14.2692 19.2368 14.4999C19.2368 14.7307 19.1452 14.9519 18.982 15.1151L13.182 20.9151C12.8423 21.2549 12.2914 21.2549 11.9516 20.9151Z" fill="white" style={{fill:'white',fillOpacity:1}}/>
                <path fillRule="evenodd" clipRule="evenodd" d="M19.2549 20.9151C18.9151 20.5753 18.9151 20.0245 19.2549 19.6847L24.4397 14.4999L19.2549 9.31508C18.9151 8.97539 18.9151 8.42458 19.2549 8.0847C19.5946 7.74502 20.1455 7.74502 20.4852 8.0847L26.2852 13.8847C26.4484 14.0479 26.54 14.2692 26.54 14.4999C26.54 14.7307 26.4484 14.9519 26.2852 15.1151L20.4852 20.9151C20.1455 21.2549 19.5946 21.2549 19.2549 20.9151Z" fill="white" style={{fill:'white',fillOpacity:1}}/>
              </svg>
            )}
          </button>

          <svg
            width="2"
            height="45"
            viewBox="0 0 2 45"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: 'fixed',
              right: -17,
              top: -7,
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Separator"
          >
            <path d="M1 1V44" stroke="#FEFEFE" strokeOpacity="0.4" style={{stroke:'#FEFEFE',strokeOpacity:0.4}} />
          </svg>

          <svg
            width="31"
            height="31"
            viewBox="0 0 31 31"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: 'fixed',
              right: -65,
              top: 0,
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingRight: '0px',
            }}
            aria-label="LawGPT logo"
          >
            <path d="M3.3498 11.6585C5.38274 9.62556 8.6702 9.61698 10.6926 11.6393L14.0614 15.0082L10.7117 18.3579C8.67879 20.3908 5.39132 20.3994 3.36897 18.377L0.000118587 15.0082L3.3498 11.6585Z" fill="#3C9B97" fillOpacity="0.6" />
            <path d="M18.3581 3.35028C20.391 5.38323 20.3996 8.67069 18.3773 10.693L15.0084 14.0619L11.6587 10.7122C9.6258 8.67927 9.61722 5.39181 11.6396 3.36946L15.0084 0.000606276L18.3581 3.35028Z" fill="#3C9B97" fillOpacity="0.6" />
            <path d="M19.3044 11.6585C21.3373 9.62556 24.6248 9.61698 26.6471 11.6393L30.016 15.0082L26.6663 18.3579C24.6334 20.3908 21.3459 20.3994 19.3236 18.377L15.9547 15.0082L19.3044 11.6585Z" fill="#3C9B97" fillOpacity="0.6" />
            <path d="M18.4929 19.1696C20.5258 21.2026 20.5029 24.5216 18.4416 26.5828L15.008 30.0164L11.6583 26.6668C9.62536 24.6338 9.64831 21.3148 11.7096 19.2536L15.1432 15.8199L18.4929 19.1696Z" fill="#3C9B97" fillOpacity="0.6" />
          </svg>
        </div>
      }
    />
  );
}


interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  title?: string;
  timestamp: Date;
}

export default function LawGPTPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomTextareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    if (chatHistory.length > 0 && chatContainerRef.current) {
      const scrollToBottom = () => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      };
      
      scrollToBottom();
      const timeoutId1 = setTimeout(scrollToBottom, 50);
      const timeoutId2 = setTimeout(scrollToBottom, 200);
      const timeoutId3 = setTimeout(scrollToBottom, 500);
      
      return () => {
        clearTimeout(timeoutId1);
        clearTimeout(timeoutId2);
        clearTimeout(timeoutId3);
      };
    }
  }, [chatHistory.length]);

  useEffect(() => {
    if (chatHistory.length > 0) return;
    
    const preventScroll = (e: Event) => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };
    
    window.addEventListener('scroll', preventScroll, { passive: false });
    
    const timeoutId = setTimeout(() => {
      window.removeEventListener('scroll', preventScroll);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 500);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', preventScroll);
    };
  }, [chatHistory]);

  useEffect(() => {
    const ensureTopPosition = () => {
      if (window.scrollY === 0) return;
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };
    
    const interval = setInterval(ensureTopPosition, 100);
    const timeout = setTimeout(() => clearInterval(interval), 2000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const handleSidebarToggle = () => setSidebarOpen((open) => !open);

  const getAiResponse = async (userMessage: string): Promise<string> => {
    try {
      const conversationHistory: AIMessage[] = chatHistory.map(chat => ({
        role: chat.type === 'user' ? 'user' as const : 'assistant' as const,
        content: chat.content
      }));

      const aiResponse = await getLegalAIResponse(userMessage, conversationHistory);
      return aiResponse;
    } catch (error) {
      console.error('AI response error:', error);
      return "I'm experiencing technical difficulties right now. For immediate legal assistance, please book a consultation with one of our qualified lawyers through our platform. They can provide personalized advice for your specific situation.";
    }
  };

  const generateTitle = (msg: string): string => {
    const lowerMsg = msg.toLowerCase();
    if (lowerMsg.includes("copyright") || lowerMsg.includes("intellectual property")) return "Intellectual Property Law";
    if (lowerMsg.includes("divorce") || lowerMsg.includes("marriage")) return "Family Law";
    if (lowerMsg.includes("property") || lowerMsg.includes("real estate")) return "Property Law";
    if (lowerMsg.includes("criminal") || lowerMsg.includes("crime")) return "Criminal Law";
    if (lowerMsg.includes("contract") || lowerMsg.includes("agreement")) return "Contract Law";
    if (lowerMsg.includes("employment") || lowerMsg.includes("workplace")) return "Employment Law";
    if (lowerMsg.includes("tax") || lowerMsg.includes("taxation")) return "Tax Law";
    if (lowerMsg.includes("consumer") || lowerMsg.includes("rights")) return "Consumer Law";
    return "Legal Guidance";
  };

  const handleSend = async () => {
    if (message.trim() !== "") {
      const currentMessage = message.trim();
      
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: currentMessage,
        timestamp: new Date()
      };
      
      setChatHistory(prev => [...prev, userMessage]);
      setAiLoading(true);
      
      try {
        const aiResponseContent = await getAiResponse(currentMessage);
        
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: aiResponseContent,
          title: generateTitle(currentMessage),
          timestamp: new Date()
        };
        
        setChatHistory(prev => [...prev, aiMessage]);
      } catch (error) {
        console.error('Error getting AI response:', error);
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: "I'm experiencing technical difficulties. For immediate legal assistance, please book a consultation with one of our qualified lawyers. You can find experienced lawyers in your area through our consultation booking system.",
          title: "Service Unavailable",
          timestamp: new Date()
        };
        
        setChatHistory(prev => [...prev, aiMessage]);
      } finally {
        setAiLoading(false);
      }
      
      setMessage("");
      const currentTextarea = chatHistory.length === 0 ? textareaRef.current : bottomTextareaRef.current;
      if (currentTextarea) {
        currentTextarea.style.height = '24px';
      }
      
      const scrollToBottom = () => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      };
      
      setTimeout(scrollToBottom, 10);
      setTimeout(scrollToBottom, 100);
      setTimeout(scrollToBottom, 300);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <LawGPTHeader onSidebarOpen={handleSidebarToggle} sidebarOpen={sidebarOpen} />
      <WowAhhAnimation />

      {sidebarOpen && (
        <LawGPTSidebar onClose={() => setSidebarOpen(false)} />
      )}

      {chatHistory.length === 0 ? (
        <div className="relative w-full h-full bg-background font-body flex flex-col items-center justify-start overflow-hidden" style={{ paddingTop: '240px' }}>
          <div className="flex flex-row items-center justify-center gap-3 mb-4">
            <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.35028 11.6585C5.38323 9.62556 8.67069 9.61698 10.693 11.6393L14.0619 15.0082L10.7122 18.3579C8.67927 20.3908 5.39181 20.3994 3.36946 18.377L0.000606868 15.0082L3.35028 11.6585Z" fill="#3C9B97" fillOpacity="0.6"/>
              <path d="M18.3581 3.34931C20.391 5.38225 20.3996 8.66971 18.3773 10.6921L15.0084 14.0609L11.6587 10.7112C9.6258 8.6783 9.61722 5.39083 11.6396 3.36848L15.0084 -0.000370287L18.3581 3.34931Z" fill="#3C9B97" fillOpacity="0.6"/>
              <path d="M19.3044 11.6585C21.3373 9.62556 24.6248 9.61698 26.6471 11.6393L30.016 15.0082L26.6663 18.3579C24.6334 20.3908 21.3459 20.3994 19.3236 18.377L15.9547 15.0082L19.3044 11.6585Z" fill="#3C9B97" fillOpacity="0.6"/>
              <path d="M18.4934 19.1696C20.5263 21.2026 20.5033 24.5216 18.4421 26.5828L15.0085 30.0164L11.6588 26.6668C9.62585 24.6338 9.64879 21.3148 11.71 19.2536L15.1437 15.8199L18.4934 19.1696Z" fill="#3C9B97" fillOpacity="0.6"/>
            </svg>
            <span className="font-semibold text-[20px] leading-6 text-white/60" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>LawGPT</span>
          </div>
          
          <h1 className="font-bold text-[40px] leading-[48px] text-white mb-8 text-center" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>What can I help with</h1>
          
          <div 
            className="relative mx-auto" 
            style={{ 
              width: '537px', 
              height: Math.max(132, textareaRef.current ? textareaRef.current.scrollHeight + 80 : 132),
              minHeight: '132px'
            }}
          >
            <svg 
              width="537" 
              height={Math.max(132, textareaRef.current ? textareaRef.current.scrollHeight + 80 : 132)}
              viewBox={`0 0 537 ${Math.max(132, textareaRef.current ? textareaRef.current.scrollHeight + 80 : 132)}`}
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              className="absolute inset-0"
            >
              <rect 
                width="537" 
                height={Math.max(132, textareaRef.current ? textareaRef.current.scrollHeight + 80 : 132)}
                rx="28" 
                fill="#232323" 
              />
            </svg>
            
            <div className="absolute inset-0 flex flex-col justify-start px-8 pt-6">
              <div className="flex items-start">
                <div className="flex-1">
                  <textarea
                    ref={textareaRef}
                    className="w-full bg-transparent border-none outline-none text-white resize-none"
                    placeholder="Ask me anything about law"
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      const textarea = e.target;
                      textarea.style.height = 'auto';
                      const newHeight = Math.max(24, textarea.scrollHeight);
                      textarea.style.height = newHeight + 'px';
                    }}
                    onKeyDown={handleKeyDown}
                    style={{ 
                      fontSize: '18px',
                      lineHeight: '1.44',
                      fontFamily: 'Instrument Sans, sans-serif',
                      fontWeight: '400',
                      color: 'rgba(255, 255, 255, 0.8)',
                      padding: '0',
                      margin: '0',
                      minHeight: '24px',
                      maxHeight: 'none',
                      overflowY: 'hidden',
                      overflowX: 'hidden',
                      wordWrap: 'break-word',
                      whiteSpace: 'pre-wrap',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
              
              <div className="absolute bottom-4 right-4">
                <button
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={handleSend}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path 
                      fillRule="evenodd" 
                      clipRule="evenodd" 
                      d="M8 13C7.86739 13 7.74021 12.9473 7.64645 12.8536C7.55268 12.7598 7.5 12.6326 7.5 12.5L7.5 4.914L5.35355 7.06066C5.30631 7.1079 5.25 7.14504 5.1879 7.17025C5.12581 7.19547 5.05901 7.20826 4.99155 7.20826C4.92409 7.20826 4.85729 7.19547 4.7952 7.17025C4.7331 7.14504 4.67678 7.1079 4.62955 7.06066C4.58231 7.01343 4.54517 6.95711 4.51995 6.89502C4.49474 6.83292 4.48195 6.76612 4.48195 6.69866C4.48195 6.6312 4.49474 6.5644 4.51995 6.50231C4.54517 6.44021 4.58231 6.38389 4.62955 6.33666L7.62955 3.33666C7.67678 3.28942 7.7331 3.25228 7.7952 3.22707C7.85729 3.20185 7.92409 3.18906 7.99155 3.18906C8.05901 3.18906 8.12581 3.20185 8.1879 3.22707C8.25 3.25228 8.30632 3.28942 8.35355 3.33666L11.3536 6.33666C11.4008 6.38389 11.4379 6.44021 11.4632 6.50231C11.4884 6.5644 11.5012 6.6312 11.5012 6.69866C11.5012 6.76612 11.4884 6.83292 11.4632 6.89502C11.4379 6.95711 11.4008 7.01343 11.3536 7.06066C11.2598 7.15443 11.1326 7.20711 11 7.20711C10.9325 7.20711 10.8657 7.19432 10.8036 7.16911C10.7415 7.14389 10.6852 7.10675 10.638 7.05952L8.5 4.914L8.5 12.5C8.5 12.6326 8.44732 12.7598 8.35355 12.8536C8.25979 12.9473 8.13261 13 8 13Z" 
                      fill="#0E0E0E" 
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full bg-background font-body flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col" style={{ paddingTop: '100px', paddingBottom: '140px' }}>
            <div 
              ref={chatContainerRef} 
              className="w-full max-w-4xl mx-auto px-8 flex-1 overflow-y-auto scrollbar-hide" 
              style={{ 
                paddingBottom: '60px',
                maxHeight: 'calc(100vh - 240px)'
              }}
            >
              <div className="space-y-8">
                {chatHistory.map((chat, index) => (
                  <div key={chat.id} className="w-full">
                    {chat.type === 'user' ? (
                      <div className="flex justify-end w-full">
                        <div className="max-w-lg">
                          <AutoBubble message={chat.content} messageId={chat.id} />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4 w-full">
                        {chat.title && (
                          <h2 className="text-white text-[2.5rem] font-bold" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                            {chat.title}
                          </h2>
                        )}
                        <div className="text-white/90 text-lg leading-7" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                          {chat.content}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {aiLoading && (
                  <div className="flex flex-col gap-4 w-full">
                    <SkeletonLoader />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="fixed bottom-0 left-0 right-0 p-6 flex justify-center z-50">
            <div className="relative" style={{ width: '537px', height: '62px' }}>
              <svg width="537" height="62" viewBox="0 0 537 62" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
                <rect width="537" height="62" rx="31" fill="#D9D9D9" fillOpacity="0.1" />
              </svg>
              
              <div className="absolute inset-0 flex items-center px-6">
                <textarea
                  ref={bottomTextareaRef}
                  className="flex-1 bg-transparent border-none outline-none text-white font-medium resize-none"
                  placeholder="Ask me anything about law"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                  onKeyDown={handleKeyDown}
                  style={{ 
                    fontSize: '18px',
                    lineHeight: '1.5',
                    fontFamily: 'Instrument Sans, sans-serif',
                    color: '#FEFEFE',
                    opacity: 0.5,
                    padding: '0',
                    margin: '0',
                    height: '24px',
                    maxHeight: '24px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                  }}
                />
                
                <button
                  className="ml-4 w-9 h-9 bg-white rounded-full flex items-center justify-center cursor-pointer flex-shrink-0"
                  onClick={handleSend}
                  style={{ marginLeft: '16px' }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M8 13C7.86739 13 7.74021 12.9473 7.64645 12.8536C7.55268 12.7598 7.5 12.6326 7.5 12.5L7.5 4.914L5.35355 7.06066C5.30631 7.1079 5.25 7.14504 5.1879 7.17025C5.12581 7.19547 5.05901 7.20826 4.99155 7.20826C4.92409 7.20826 4.85729 7.19547 4.7952 7.17025C4.7331 7.14504 4.67678 7.1079 4.62955 7.06066C4.58231 7.01343 4.54517 6.95711 4.51995 6.89502C4.49474 6.83292 4.48195 6.76612 4.48195 6.69866C4.48195 6.6312 4.49474 6.5644 4.51995 6.50231C4.54517 6.44021 4.58231 6.38389 4.62955 6.33666L7.62955 3.33666C7.67678 3.28942 7.7331 3.25228 7.7952 3.22707C7.85729 3.20185 7.92409 3.18906 7.99155 3.18906C8.05901 3.18906 8.12581 3.20185 8.1879 3.22707C8.25 3.25228 8.30632 3.28942 8.35355 3.33666L11.3536 6.33666C11.4008 6.38389 11.4379 6.44021 11.4632 6.50231C11.4884 6.5644 11.5012 6.6312 11.5012 6.69866C11.5012 6.76612 11.4884 6.83292 11.4632 6.89502C11.4379 6.95711 11.4008 7.01343 11.3536 7.06066C11.2598 7.15443 11.1326 7.20711 11 7.20711C10.9325 7.20711 10.8657 7.19432 10.8036 7.16911C10.7415 7.14389 10.6852 7.10675 10.638 7.05952L8.5 4.914L8.5 12.5C8.5 12.6326 8.44732 12.7598 8.35355 12.8536C8.25979 12.9473 8.13261 13 8 13Z" fill="#0E0E0E" fillOpacity="0.933333" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


