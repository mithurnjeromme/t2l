"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const navItems = [
  "What is Instant Access to Law ?",
  "Included Services",
  "Key Statistics",
  "Channels of Instant Legal Access",
  "Why choose Turn2Law",
  "Meet the Team",
];

const KnowAboutUs = () => {
  const [activeItem, setActiveItem] = useState(
    "Channels of Instant Legal Access",
  );

  return (
    <section id="know-about-us" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="bg-card dark:bg-[#2A2A2A] rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 relative overflow-hidden border border-border/20">
          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-body font-medium mb-6 sm:mb-8 text-foreground">
            Know about us.
          </h2>

          {/* Responsive Layout */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Sidebar Navigation */}
            <div className="w-full lg:w-[280px] xl:w-[300px] space-y-2">
              {navItems.map((item, index) => (
                <div
                  key={index}
                  className={`cursor-pointer transition-all duration-300 rounded-xl text-left ${
                    activeItem === item
                      ? "bg-secondary text-secondary-foreground dark:bg-[#009E98] dark:text-white py-3 px-4"
                      : "text-foreground hover:text-secondary dark:hover:text-[#009E98] py-3 px-4"
                  }`}
                  onClick={() => setActiveItem(item)}
                >
                  <span className="text-sm sm:text-base font-medium font-body">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 relative">
              <div className="bg-muted dark:bg-[#8B8B8B] rounded-[20px] sm:rounded-[24px] relative h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px] w-full">
                {/* Centered Image Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[#2A2A2A] text-2xl sm:text-3xl font-body font-medium">
                    Image
                  </span>
                </div>

                {/* Button (bottom right) */}
                <div className="absolute bottom-4 right-4">
                  <Button className="bg-white text-black hover:bg-gray-100 px-5 sm:px-6 py-3 rounded-2xl font-medium font-body text-sm sm:text-base flex items-center gap-2 transition-all duration-300 shadow-sm border-0">
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KnowAboutUs;
