"use client";

import { useState, useRef, useEffect } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MapPin,
  FileText,
  Building2,
  Paperclip,
  Globe,
  Phone,
  Clock,
  AlertCircle,
  RotateCcw,
  Copy,
  Share2,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  Landmark,
  ChevronRight,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────────────────────────────────────
interface RecommendedAuthority {
  name: string;
  type: string;
  description: string;
}

interface OfficeDetails {
  address: string;
  contact: string;
  working_hours: string;
}

interface OnlinePortal {
  available: boolean;
  link: string;
}

interface LegalNavigatorResult {
  problem_summary: string;
  category: string;
  recommended_authority: RecommendedAuthority;
  action_steps: string[];
  documents_required: string[];
  office_details: OfficeDetails;
  online_portal: OnlinePortal;
  map_link: string;
  legal_note: string;
  turn2law_cta: string;
}

// ─────────────────────────────────────────────────────────────────────────────
//  Category colours
// ─────────────────────────────────────────────────────────────────────────────
const categoryStyles: Record<string, string> = {
  Consumer:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/50",
  Civil:
    "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800/50",
  Labour:
    "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800/50",
  Corporate:
    "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-800/50",
  Criminal:
    "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/50",
  "Public Grievance":
    "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/50",
};

// ─────────────────────────────────────────────────────────────────────────────
//  Loading skeleton
// ─────────────────────────────────────────────────────────────────────────────
const Shimmer = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-md bg-muted/70", className)} />
);

const LoadingSkeleton = () => (
  <div className="space-y-4 mt-10">
    <div className="flex items-center gap-3 mb-8">
      <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      <span className="text-sm text-muted-foreground">Analysing your issue…</span>
    </div>
    <Shimmer className="h-24 w-full" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Shimmer className="h-40 w-full" />
      <Shimmer className="h-40 w-full" />
    </div>
    <Shimmer className="h-52 w-full" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Shimmer className="h-32 w-full" />
      <Shimmer className="h-32 w-full" />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
//  Result section wrapper
// ─────────────────────────────────────────────────────────────────────────────
const ResultSection = ({
  label,
  icon: Icon,
  children,
  accent,
}: {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
  accent?: boolean;
}) => (
  <div
    className={cn(
      "rounded-xl border bg-card p-6",
      accent ? "border-primary/25" : "border-border/60"
    )}
  >
    <div className="flex items-center gap-2 mb-5">
      <Icon className={cn("h-4 w-4", accent ? "text-primary" : "text-muted-foreground")} />
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </div>
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
//  Main Page
// ─────────────────────────────────────────────────────────────────────────────
export default function LegalNavigatorPage() {
  const [problem, setProblem] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LegalNavigatorResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [currentUser, setCurrentUser] = useState<{ id: string; email: string } | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { getSession, getUserProfile } = await import("@/lib/supabase-auth");
        const session = await getSession();
        if (session?.user) {
          const profile = await getUserProfile(session.user.id);
          if (profile) setCurrentUser({ id: profile.id, email: profile.email });
        }
      } catch {
        // unauthenticated — fine
      }
    };
    loadUser();
  }, []);

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3001";

  const handleSubmit = async () => {
    if (!problem.trim() || !location.trim()) {
      setError("Please describe your problem and provide your location.");
      return;
    }
    if (problem.trim().length < 10) {
      setError("Please describe your problem in more detail.");
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${BACKEND_URL}/api/legal-navigator`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem_description: problem.trim(),
          location: location.trim(),
          ...(currentUser && { user_id: currentUser.id, user_email: currentUser.email }),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success)
        throw new Error(json.error || "Something went wrong. Please try again.");

      setResult(json.data);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err: any) {
      setError(err.message || "Failed to get a response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setProblem("");
    setLocation("");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => textareaRef.current?.focus(), 400);
  };

  const handleCopy = async () => {
    if (!result) return;
    const text = `
Legal Navigator — Turn2Law
===========================
Problem: ${result.problem_summary}
Category: ${result.category}
Authority: ${result.recommended_authority.name}

Steps:
${result.action_steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}

Documents:
${result.documents_required.map((d) => `• ${d}`).join("\n")}

Office: ${result.office_details.address}
Contact: ${result.office_details.contact}
Hours: ${result.office_details.working_hours}
Portal: ${result.online_portal.available ? result.online_portal.link : "Not available"}
Map: ${result.map_link}

Note: ${result.legal_note}
    `.trim();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!result) return;
    if (navigator.share) {
      await navigator.share({
        title: "Turn2Law Legal Navigator",
        text: `My legal issue (${result.category}) analysed. Recommended authority: ${result.recommended_authority.name}.`,
        url: window.location.href,
      });
    } else {
      handleCopy();
    }
  };

  const examples = [
    { problem: "Landlord not returning security deposit", location: "Chennai" },
    { problem: "Salary unpaid for 3 months", location: "Bangalore" },
    { problem: "Online fraud via UPI scam", location: "Delhi" },
    { problem: "Defective product, company refusing refund", location: "Mumbai" },
    { problem: "Electricity bill dispute", location: "Pune" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-grow pt-20">

        {/* ── Hero ── */}
        <section className="border-b border-border/40 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-5">
                Legal Navigator
              </p>
              <h1 className="font-headline text-4xl md:text-5xl font-bold text-foreground leading-[1.1] tracking-tight mb-5">
                Find the right legal path,
                <br />
                <span className="text-primary">instantly.</span>
              </h1>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-lg mx-auto">
                Describe your issue in plain language. Get the correct authority, exact
                action steps, and required documents — specific to your location in India.
              </p>
            </div>
          </div>
        </section>

        {/* ── Input ── */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="space-y-4">

                {/* Problem */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Describe your issue
                  </label>
                  <textarea
                    ref={textareaRef}
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder="e.g. My landlord has refused to return my ₹50,000 security deposit two months after I vacated the flat in Chennai."
                    rows={5}
                    className={cn(
                      "w-full rounded-lg border border-border/70 bg-background px-4 py-3",
                      "text-sm text-foreground placeholder:text-muted-foreground/50 leading-relaxed",
                      "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
                      "resize-none transition-all"
                    )}
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground/60 mt-1.5 text-right">
                    {problem.length} / 2000
                  </p>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Your location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, State or PIN code"
                      className={cn(
                        "w-full rounded-lg border border-border/70 bg-background pl-10 pr-4 py-3",
                        "text-sm text-foreground placeholder:text-muted-foreground/50",
                        "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
                        "transition-all"
                      )}
                      disabled={loading}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    {error}
                  </div>
                )}

                {/* Submit */}
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !problem.trim() || !location.trim()}
                  className="w-full h-11 text-sm font-semibold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-all"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-3.5 w-3.5 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" />
                      Analysing…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Get Guidance
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </div>

              {/* Example prompts */}
              {!result && !loading && (
                <div className="mt-8">
                  <p className="text-xs text-muted-foreground/70 mb-3">Common examples</p>
                  <div className="flex flex-wrap gap-2">
                    {examples.map((ex) => (
                      <button
                        key={ex.problem}
                        onClick={() => { setProblem(ex.problem); setLocation(ex.location); }}
                        className="rounded-full border border-border/60 bg-muted/40 px-3.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted hover:border-border/80 transition-all"
                      >
                        {ex.problem}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Loading ── */}
        {loading && (
          <section className="pb-16">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto">
                <LoadingSkeleton />
              </div>
            </div>
          </section>
        )}

        {/* ── Results ── */}
        {result && !loading && (
          <section ref={resultRef} className="pb-20">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto">

                {/* Result header */}
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-semibold text-foreground">Guidance ready</span>
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                      categoryStyles[result.category] || "bg-muted text-muted-foreground border-border"
                    )}>
                      {result.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                    >
                      <Copy className="h-3 w-3" />
                      {copied ? "Copied" : "Copy"}
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                    >
                      <Share2 className="h-3 w-3" />
                      Share
                    </button>
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                    >
                      <RotateCcw className="h-3 w-3" />
                      New
                    </button>
                  </div>
                </div>

                <div className="space-y-4">

                  {/* 1 — Summary */}
                  <ResultSection label="Problem Summary" icon={FileText} accent>
                    <p className="text-sm text-foreground leading-relaxed">
                      {result.problem_summary}
                    </p>
                  </ResultSection>

                  {/* 2 — Authority */}
                  <ResultSection label="Recommended Authority" icon={Landmark} accent>
                    <div className="space-y-1.5">
                      <p className="font-semibold text-foreground text-base leading-snug">
                        {result.recommended_authority.name}
                      </p>
                      <span className={cn(
                        "inline-block text-xs font-medium px-2.5 py-0.5 rounded-full border",
                        categoryStyles[result.category] || "bg-muted text-muted-foreground border-border"
                      )}>
                        {result.recommended_authority.type}
                      </span>
                      <p className="text-sm text-muted-foreground leading-relaxed pt-1">
                        {result.recommended_authority.description}
                      </p>
                    </div>
                  </ResultSection>

                  {/* 3 — Steps */}
                  <ResultSection label="Action Steps" icon={FileText} accent>
                    <ol className="space-y-4">
                      {result.action_steps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-4">
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center mt-0.5 tabular-nums">
                            {idx + 1}
                          </span>
                          <p className="text-sm text-foreground leading-relaxed">{step}</p>
                        </li>
                      ))}
                    </ol>
                  </ResultSection>

                  {/* 4 — Documents */}
                  <ResultSection label="Documents Required" icon={Paperclip}>
                    <ul className="space-y-2.5">
                      {result.documents_required.map((doc, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </ResultSection>

                  {/* 5 — Office + Portal */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ResultSection label="Office Details" icon={Building2}>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-2.5">
                          <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <span className="text-foreground leading-snug">{result.office_details.address}</span>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <span className="text-foreground">{result.office_details.contact}</span>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <span className="text-foreground">{result.office_details.working_hours}</span>
                        </div>
                      </div>
                      <a
                        href={result.map_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                      >
                        <MapPin className="h-3.5 w-3.5" />
                        Open in Maps
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </a>
                    </ResultSection>

                    <ResultSection label="Online Portal" icon={Globe}>
                      {result.online_portal.available ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                            <span className="text-sm font-medium text-green-700 dark:text-green-400">
                              Online filing available
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            File your complaint online — no in-person visit needed.
                          </p>
                          <a
                            href={result.online_portal.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                          >
                            <Globe className="h-3.5 w-3.5" />
                            Go to Official Portal
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                          </a>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-yellow-500" />
                          <span>No online portal available. Physical visit required.</span>
                        </div>
                      )}
                    </ResultSection>
                  </div>

                  {/* 6 — Disclaimer */}
                  <div className="rounded-xl border border-border/60 bg-muted/30 px-5 py-4 text-sm text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground">Disclaimer — </span>
                    {result.legal_note}
                  </div>

                  {/* 7 — CTA */}
                  <div className="rounded-xl border border-primary/20 bg-primary/5 dark:bg-primary/10 p-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary/70 mb-2">
                      Need hands-on help?
                    </p>
                    <h3 className="text-lg font-bold text-foreground leading-snug mb-1.5">
                      We handle it end-to-end for you.
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                      {result.turn2law_cta}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <a href="/consult">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-5 h-10 text-sm font-semibold">
                          Consult a Lawyer
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </a>
                      <a href="/consult">
                        <Button variant="outline" className="rounded-lg px-5 h-10 text-sm font-medium border-border/70">
                          Book a Call
                        </Button>
                      </a>
                    </div>
                  </div>

                  {/* Ask another */}
                  <div className="pt-2 text-center">
                    <button
                      onClick={handleReset}
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Ask another question
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── How it works ── */}
        {!result && !loading && (
          <section className="py-16 border-t border-border/40">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-10 text-center">
                  How it works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border/40 rounded-xl overflow-hidden border border-border/40">
                  {[
                    {
                      n: "01",
                      title: "Describe",
                      body: "Write your issue in plain language. No legal jargon needed.",
                    },
                    {
                      n: "02",
                      title: "Analyse",
                      body: "Our system identifies the right authority and action plan for your location.",
                    },
                    {
                      n: "03",
                      title: "Act",
                      body: "Follow the step-by-step guide or connect with a Turn2Law lawyer.",
                    },
                  ].map(({ n, title, body }) => (
                    <div key={n} className="bg-card px-7 py-8">
                      <p className="text-2xl font-bold text-primary/30 mb-4 tabular-nums">{n}</p>
                      <p className="text-sm font-semibold text-foreground mb-1.5">{title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

      </main>
      <Footer />
    </div>
  );
}
