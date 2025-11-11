"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useActionState, useEffect, useRef } from "react";
import { findLawyerAction, type FormState } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const LawyerCard = ({
  lawyer,
}: {
  lawyer: {
    name: string;
    specialty: string;
    experienceYears: number;
    profileUrl: string;
  };
}) => (
  <div className="bg-card border border-border rounded-lg p-4 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:shadow-lg">
    <Image
      src="https://placehold.co/100x100.png"
      alt={lawyer.name}
      width={80}
      height={80}
      className="rounded-full mb-4"
    />
    <h3 className="font-bold text-lg">{lawyer.name}</h3>
    <p className="text-primary">{lawyer.specialty}</p>
    <p className="text-sm text-muted-foreground">
      {lawyer.experienceYears} years experience
    </p>
    <Button asChild variant="link" className="mt-2">
      <Link href={lawyer.profileUrl} target="_blank">
        View Profile
      </Link>
    </Button>
  </div>
);

export default function ContactForm() {
  const initialState: FormState = { message: "" };
  const [state, formAction] = useActionState(findLawyerAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message && !state.lawyers) {
      toast({
        title: state.error ? "Error" : "Success",
        description: state.message,
        variant: state.error ? "destructive" : "default",
      });
    }
    if (state.lawyers && state.lawyers.length > 0) {
      formRef.current?.reset();
    }
  }, [state, toast]);

  return (
    <section id="find-lawyer" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        {state.lawyers && state.lawyers.length > 0 ? (
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-headline font-semibold mb-4">
              {state.message}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
              {state.lawyers.map((lawyer, index) => (
                <LawyerCard key={index} lawyer={lawyer} />
              ))}
            </div>
            <Button
              onClick={() => window.location.reload()}
              className="mt-10 sm:mt-12"
            >
              Find More Lawyers
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-black rounded-[30px] sm:rounded-[40px] overflow-hidden">
            {/* Left Side - Image Section */}
            <div className="bg-primary p-8 sm:p-12 flex items-center justify-center">
              <div className="w-full h-56 sm:h-80 bg-primary flex items-center justify-center text-black text-lg sm:text-xl font-body font-semibold">
                Image
              </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="bg-card dark:bg-[#2A2A2A] p-8 sm:p-12 relative border border-border/20 rounded-2xl">
              <h2 className="text-2xl sm:text-3xl font-headline font-bold mb-2 text-foreground">
                Consult us
              </h2>
              <p className="text-muted-foreground dark:text-white/60 mb-6 sm:mb-8 font-body text-sm sm:text-base">
                Tell us about your legal needs and we'll connect you with the
                right lawyer.
              </p>

              <form
                ref={formRef}
                action={formAction}
                className="space-y-5 sm:space-y-6"
              >
                <div className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="w-full bg-input dark:bg-white/5 border border-border dark:border-white/20 rounded-xl px-4 py-3 text-foreground dark:text-white placeholder-muted-foreground dark:placeholder-white/50 focus:bg-muted dark:focus:bg-white/10 focus:border-primary dark:focus:border-white/40 outline-none font-body text-sm sm:text-base"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full bg-input dark:bg-white/5 border border-border dark:border-white/20 rounded-xl px-4 py-3 text-foreground dark:text-white placeholder-muted-foreground dark:placeholder-white/50 focus:bg-muted dark:focus:bg-white/10 focus:border-primary dark:focus:border-white/40 outline-none font-body text-sm sm:text-base"
                    required
                  />

                  {/* Mobile Number Section */}
                  <div className="flex items-center overflow-hidden rounded-xl border border-border dark:border-white/20 bg-input dark:bg-white/5 focus-within:border-primary dark:focus-within:border-white/40 transition">
                    <span className="px-4 py-3 bg-muted dark:bg-white/10 text-foreground dark:text-white text-sm sm:text-base border-r border-border dark:border-white/20">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="mobile"
                      placeholder="Mobile Number"
                      className="flex-1 bg-transparent px-4 py-3 text-foreground dark:text-white placeholder-muted-foreground dark:placeholder-white/50 focus:outline-none font-body text-sm sm:text-base"
                      required
                    />
                  </div>

                  <Textarea
                    name="message"
                    placeholder="Message"
                    className="bg-input dark:bg-white/5 border border-border dark:border-white/20 rounded-xl min-h-[100px] sm:min-h-[120px] text-foreground dark:text-white placeholder-muted-foreground dark:placeholder-white/50 focus:bg-muted dark:focus:bg-white/10 focus:border-primary dark:focus:border-white/40 resize-none font-body text-sm sm:text-base"
                    rows={4}
                    required
                  />
                </div>

                {state?.error && (
                  <p className="text-red-400 text-sm">{state.error}</p>
                )}

                <Button
                  type="submit"
                  className="w-full bg-white text-black rounded-xl py-3 sm:py-4 text-base sm:text-lg font-body font-semibold hover:bg-gray-200 transition-colors"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
