"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqData = [
  {
    question: "What is Turn2Law and how does it work?",
    answer:
      "Turn2Law is a next-generation legal platform designed to simplify access to legal services for everyone. We connect you to trusted legal professionals and AI-powered resources instantly. Whether you're facing an emergency, drafting critical documents, or seeking legal advice, Turn2Law provides on-demand lawyer matching, automated document drafting, and AI-powered legal chatbot assistance to make justice accessible, affordable, and efficient.",
  },
  {
    question: "How does the AI-powered lawyer matching system work?",
    answer:
      "Our intelligent matching system uses advanced ML algorithms to pair you with qualified lawyers based on your specific legal needs and case requirements. Simply describe your legal situation, and our system analyzes your requirements to connect you with the most suitable legal expert from our network of over 200+ verified lawyers. The matching considers specialization, experience, location, and case complexity to ensure you get the right legal support.",
  },
  {
    question: "What legal services does Turn2Law offer?",
    answer:
      "Turn2Law offers three core services: (1) Online Client-Lawyer Matchmaking - Connect with expert lawyers tailored to your specific legal needs, (2) Automated Document Drafting - Generate professional legal documents like NDAs, contracts, and agreements in minutes using our AI-powered system, and (3) Legal Services with AI Chatbot Access - Get instant legal guidance 24/7 from our AI-powered chatbot that provides immediate answers to your legal questions.",
  },
  {
    question: "Is my data secure and confidential on Turn2Law?",
    answer:
      "Absolutely. We take data security and client confidentiality very seriously. All communications, documents, and personal information are encrypted and protected using industry-standard security protocols. Our platform complies with legal confidentiality requirements, and all lawyers on our network are bound by professional ethics and attorney-client privilege. Your legal matters remain completely private and secure.",
  },
  {
    question: "Can I consult a lawyer virtually through Turn2Law?",
    answer:
      "Yes! Virtual consulting is one of our core features. You can access expert legal advice and consultations anytime, anywhere, from the comfort of your home. Our platform supports video consultations, secure messaging, and document sharing, making it convenient to get professional legal support without the need for in-person meetings. This saves you time and travel costs while ensuring you get quality legal assistance.",
  },
];

const KnowAboutUs = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="know-about-us" className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-3xl lg:text-4xl font-body font-semibold text-foreground mb-4">
            Know about <span className="text-primary">us</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl font-body">
            Get answers to frequently asked questions about our platform and
            services
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3 max-w-4xl">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                activeIndex === index
                  ? "bg-muted/30 dark:bg-[#0E0E0E] border-border/40"
                  : "bg-background border-border/20 hover:border-border/40"
              }`}
            >
              {/* Question Header */}
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full text-left px-6 py-5 flex items-center gap-4"
              >
                {/* Question Number Badge */}
                <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-xl flex-shrink-0">
                  <span className="text-primary font-semibold text-sm">
                    {index + 1}
                  </span>
                </div>

                {/* Question Text */}
                <span className="flex-1 font-semibold text-base font-body text-foreground">
                  {faq.question}
                </span>

                {/* Chevron Icon */}
                <div
                  className={`flex-shrink-0 text-muted-foreground transition-transform duration-300 ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                >
                  <ChevronDown className="w-5 h-5" />
                </div>
              </button>

              {/* Answer Content */}
              <div
                className={`transition-all duration-300 ease-in-out ${
                  activeIndex === index
                    ? "max-h-[500px] opacity-100"
                    : "max-h-0 opacity-0"
                } overflow-hidden`}
              >
                <div className="px-6 pb-5 pt-2">
                  <div className="pl-16 pr-4 pt-3 border-t border-border/20">
                    <p className="text-muted-foreground text-sm leading-relaxed font-body">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KnowAboutUs;
