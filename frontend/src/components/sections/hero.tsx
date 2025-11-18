"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();

  const handleConsultClick = async () => {
    // Check if user is logged in using Supabase Auth
    try {
      const { getSession } = await import('@/lib/supabase-auth');
      const session = await getSession();
      
      if (session && session.user) {
        // User is logged in, redirect to consult page
        router.push("/consult");
      } else {
        // User is not logged in, redirect to login page
        router.push("/login");
      }
    } catch (error) {
      // If error checking auth, redirect to login to be safe
      router.push("/login");
    }
  };

  return (
    <section
      id="hero"
      className="bg-background pt-32 pb-8 relative overflow-hidden"
    >
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div className="text-foreground z-10 relative">
          <h1 className="text-5xl md:text-6xl font-headline font-semibold mb-6 leading-tight">
            We Simplify Legal Access for{" "}
            <span className="text-primary">Everyone.</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg font-body">
            Find high-quality lawyers which suits you, with help of AI tools
            that get the justice right on time.
          </p>
          <Button
            size="lg"
            className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg font-body"
            onClick={handleConsultClick}
          >
            Consult a Lawyer
          </Button>
        </div>

        <div className="relative h-[450px] w-full">
          {/* Integrated Image Container */}
          <div className="relative w-full h-full group">
            {/* Clean background - no yellow around image edges */}
            <div className="absolute -inset-8 bg-gradient-to-br from-foreground/3 via-transparent to-foreground/1 rounded-3xl blur-3xl opacity-40 dark:from-white/3 dark:to-white/1"></div>

            {/* Main image container - clean edges, no yellow borders */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-border/30 backdrop-blur-sm">
              <Image
                src="/images/landingpagephoto.png"
                alt="Professional Legal Services"
                fill
                className="object-cover object-center transition-all duration-700 group-hover:scale-[1.02] group-hover:brightness-110"
                priority
              />

              {/* Clean overlay - no yellow tints */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-background/5 to-background/15 dark:via-black/3 dark:to-black/15"></div>

              {/* Clean border */}
              <div className="absolute inset-0 rounded-2xl border border-border/20 shadow-inner"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced subtle yellow ambient glow for the overall hero section */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,193,7,0.12),transparent_60%)] pointer-events-none"></div>
      <div className="absolute top-1/3 left-0 w-full h-1/3 bg-gradient-to-r from-transparent via-primary/4 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default Hero;
