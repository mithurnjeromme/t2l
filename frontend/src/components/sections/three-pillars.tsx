"use client";

import React from "react";
import { WobbleCard } from "@/components/ui/wobble-card";
import { Users, FileText, MessageSquare } from "lucide-react";

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
          {/* Pillar 1: Client-Lawyer Matchmaking - Large Card */}
          <WobbleCard
            containerClassName="col-span-1 lg:col-span-2 h-full bg-gradient-to-br from-secondary to-secondary/80 min-h-[500px] lg:min-h-[300px]"
            className=""
          >
            <div className="max-w-xs">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white font-headline">
                Online Client-Lawyer Matchmaking
              </h2>
              <p className="mt-4 text-left text-base/6 text-white/90 font-body">
                Connect with the right legal expert instantly. Our intelligent matching system pairs you with qualified lawyers based on your specific legal needs and case requirements.
              </p>
            </div>
            
          </WobbleCard>

          {/* Pillar 2: Document Drafting - Small Card */}
          <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-gradient-to-br from-primary to-primary/80">
            <div className="w-12 h-12 bg-black/20 rounded-2xl flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-black" />
            </div>
            <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-black font-headline">
              Automated Document Drafting
            </h2>
            <p className="mt-4 max-w-[26rem] text-left text-base/6 text-black/80 font-body">
              Generate professional legal documents in minutes. Our AI-powered system creates accurate, customized legal documents tailored to your needs.
            </p>
          </WobbleCard>

          {/* Pillar 3: Legal Services & Chatbot - Full Width Card */}
          <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-gradient-to-br from-card via-card/90 to-card/70 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px] border border-border/50">
            <div className="max-w-sm">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h2 className="max-w-sm md:max-w-lg text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-foreground font-headline">
                Legal Services with AI Chatbot Access
              </h2>
              <p className="mt-4 max-w-[26rem] text-left text-base/6 text-muted-foreground font-body">
                Get instant legal guidance 24/7. Our AI-powered legal chatbot provides immediate answers to your legal questions and helps you understand complex legal concepts.
              </p>
            </div>
           
          </WobbleCard>
        </div>
      </div>
    </section>
  );
}
