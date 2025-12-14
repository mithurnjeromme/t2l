"use client";

import React from "react";
import Link from "next/link";
import { WobbleCard } from "@/components/ui/wobble-card";

export default function ThreePillarsSection() {
  return (
    <section className="pt-12 md:pt-16 pb-24 md:pb-32 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-headline font-semibold text-foreground mb-4">
            Our <span className="text-primary">Three Pillars</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-body">
            Turn2Law revolutionizes legal services through three innovative solutions
          </p>
        </div>

        {/* Wobble Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 max-w-7xl mx-auto w-full">
          {/* Pillar 1: Client-Lawyer Matchmaking */}
          <Link href="/consult" className="block h-full transition-transform hover:scale-[1.02]">
            <WobbleCard
              containerClassName="col-span-1 h-full bg-gradient-to-br from-[#6DBDB7] to-[#5DA9A4] dark:from-[#6DBDB7] dark:to-[#5DA9A4] cursor-pointer"
              className=""
            >
              <div className="flex flex-col py-6 h-full">
                <h2 className="text-left text-balance text-xl lg:text-2xl font-semibold tracking-[-0.015em] text-gray-900 dark:text-gray-900 font-headline mb-4">
                  Online Client-Lawyer Matchmaking
                </h2>
                <p className="text-left text-sm lg:text-base text-gray-800 dark:text-gray-800 font-body leading-relaxed">
                  Connect with the right legal expert instantly. Our intelligent matching system pairs you with qualified lawyers based on your specific legal needs and case requirements.
                </p>
              </div>
            </WobbleCard>
          </Link>

          {/* Pillar 2: Legal Services & Chatbot */}
          <Link href="/lawgpt" className="block h-full transition-transform hover:scale-[1.02]">
            <WobbleCard containerClassName="col-span-1 h-full bg-gradient-to-br from-[#DF9C49] to-[#C88539] dark:from-[#DF9C49] dark:to-[#C88539] cursor-pointer">
              <div className="flex flex-col py-6 h-full">
                <h2 className="text-left text-balance text-xl lg:text-2xl font-semibold tracking-[-0.015em] text-gray-900 dark:text-gray-900 font-headline mb-4">
                  Legal Services with AI Chatbot Access
                </h2>
                <p className="text-left text-sm lg:text-base text-gray-800 dark:text-gray-800 font-body leading-relaxed">
                  Get instant legal guidance 24/7. Our AI-powered legal chatbot provides immediate answers to your legal questions and helps you understand complex legal concepts.
                </p>
              </div>
            </WobbleCard>
          </Link>

          {/* Pillar 3: Document Drafting */}
          <Link href="/documents" className="block h-full transition-transform hover:scale-[1.02]">
            <WobbleCard containerClassName="col-span-1 h-full bg-gradient-to-br from-[#F5C563] to-[#E8B54D] dark:from-[#F5C563] dark:to-[#E8B54D] cursor-pointer">
              <div className="flex flex-col py-6 h-full">
                <h2 className="text-left text-balance text-xl lg:text-2xl font-semibold tracking-[-0.015em] text-gray-900 dark:text-gray-900 font-headline mb-4">
                  Automated Document Drafting
                </h2>
                <p className="text-left text-sm lg:text-base text-gray-800 dark:text-gray-800 font-body leading-relaxed">
                  Generate professional legal documents in minutes. Our AI-powered system creates accurate, customized legal documents tailored to your needs.
                </p>
              </div>
            </WobbleCard>
          </Link>
        </div>
      </div>
    </section>
  );
}
