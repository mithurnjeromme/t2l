"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useActionState, useEffect, useRef, useState } from "react";
import { findLawyerAction, sendContactFormAction, type FormState, type ContactFormState } from "@/app/actions";
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
  const contactInitialState: ContactFormState = { message: "" };
  const [contactState, contactFormAction] = useActionState(sendContactFormAction, contactInitialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const contactFormRef = useRef<HTMLFormElement>(null);

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

  useEffect(() => {
    if (contactState.message) {
      toast({
        title: contactState.error ? "Error" : "Success",
        description: contactState.message,
        variant: contactState.error ? "destructive" : "default",
      });
      if (contactState.success) {
        contactFormRef.current?.reset();
      }
    }
  }, [contactState, toast]);

  return (
    <section id="find-lawyer" className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-6">
        {state.lawyers && state.lawyers.length > 0 ? (
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-body font-bold mb-4">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Side - Send us a message Form */}
            <div>
              {/* Section Header */}
              <div className="mb-8">
                <h2 className="text-3xl lg:text-4xl font-body font-bold text-foreground mb-4 leading-tight">
                  Send us a <span className="text-primary">message</span>
                </h2>
                <p className="text-muted-foreground text-base font-body">
                  Have a question or something to share? Send us a message and
                  we'll get back to you shortly.
                </p>
              </div>

              <form ref={contactFormRef} action={contactFormAction} className="space-y-5">
                {/* First Name & Last Name Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First name"
                      className="w-full bg-muted/30 dark:bg-[#0E0E0E] border border-border/20 rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-colors duration-200"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last name"
                      className="w-full bg-muted/30 dark:bg-[#0E0E0E] border border-border/20 rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-colors duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Email Address & Phone Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      className="w-full bg-muted/30 dark:bg-[#0E0E0E] border border-border/20 rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-colors duration-200"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="mobile"
                      placeholder="Phone number"
                      className="w-full bg-muted/30 dark:bg-[#0E0E0E] border border-border/20 rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 transition-colors duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <Textarea
                    name="message"
                    placeholder="Your message"
                    className="w-full bg-muted/30 dark:bg-[#0E0E0E] border border-border/20 rounded-xl px-4 py-3 min-h-[140px] text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 resize-none transition-colors duration-200"
                    rows={5}
                    required
                  />
                </div>

                {contactState?.error && (
                  <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4">
                    <p className="text-destructive text-sm">{contactState.error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-start pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 rounded-full"
                  >
                    Send Message
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>

            {/* Right Side - Contact Info */}
            <div className="lg:pl-8">
              {/* Section Header */}
              <div className="mb-8">
                <h3 className="text-3xl lg:text-4xl font-body font-bold text-foreground mb-4 leading-tight">
                  Get in <span className="text-primary">touch</span>
                </h3>
                <p className="text-muted-foreground mt-4">
                  We&apos;re here to help and answer any question you might have.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4 mb-8">
                {/* Email Card */}
                <a
                  href="mailto:turntwolaw@gmail.com"
                  className="flex items-start gap-4 group cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-xl flex-shrink-0 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg font-body text-foreground mb-1">
                      What&apos;s next?
                    </h4>
                    <p className="text-muted-foreground text-sm group-hover:text-primary transition-colors">
                      turntwolaw@gmail.com
                    </p>
                  </div>
                </a>

                {/* Phone Card */}
                <a
                  href="tel:+919906102527"
                  className="flex items-start gap-4 group cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-xl flex-shrink-0 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg font-body text-foreground mb-1">
                      Phone
                    </h4>
                    <p className="text-muted-foreground text-sm group-hover:text-primary transition-colors">
                      +91 9906102527
                    </p>
                  </div>
                </a>

                {/* Address Card */}
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-xl flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg font-body text-foreground mb-1">
                      Address
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Chennai, India
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media Section */}
              <div className="pt-6 border-t border-border/20">
                <h4 className="text-lg font-semibold font-body text-foreground mb-4">
                  Connect with us
                </h4>
                <div className="flex gap-3">
                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/turn2law"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-muted/30 dark:bg-[#0E0E0E] hover:bg-primary/10 dark:hover:bg-primary/20 border border-border/20 hover:border-primary/30 rounded-xl p-3 transition-all duration-200"
                    aria-label="Follow us on Instagram"
                  >
                    <svg
                      className="w-5 h-5 text-foreground"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="https://www.linkedin.com/company/turn2law"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-muted/30 dark:bg-[#0E0E0E] hover:bg-primary/10 dark:hover:bg-primary/20 border border-border/20 hover:border-primary/30 rounded-xl p-3 transition-all duration-200"
                    aria-label="Follow us on LinkedIn"
                  >
                    <svg
                      className="w-5 h-5 text-foreground"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
