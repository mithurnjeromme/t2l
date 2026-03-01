"use client";

import { useState, useRef, useEffect } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MapPin,
  FileText,
  ChevronRight,
  Building2,
  ListChecks,
  Paperclip,
  Globe,
  Phone,
  Clock,
  AlertCircle,
  Sparkles,
  RotateCcw,
  Copy,
  Share2,
  ExternalLink,
  ArrowRight,
  Scale,
  CheckCircle2,
  Landmark,
  ShieldCheck,
  BadgeCheck,
  CalendarClock,
  Zap,
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
//  Category badge colours
// ─────────────────────────────────────────────────────────────────────────────
const categoryStyles: Record<string, string> = {
  Consumer: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  Civil: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
  Labour: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
  Corporate: "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800",
  Criminal: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
  "Public Grievance": "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
};

// ─────────────────────────────────────────────────────────────────────────────
//  Skeleton loader
// ─────────────────────────────────────────────────────────────────────────────
const SkeletonBlock = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-lg bg-muted/60", className)} />
);

const LoadingSkeleton = () => (
  <div className="space-y-5 mt-8">
    <div className="flex items-center gap-3 mb-6">
      <div className="animate-spin h-6 w-6 rounded-full border-2 border-primary border-t-transparent" />
      <p className="text-muted-foreground font-medium text-sm">
        Analyzing your issue and mapping the right solution...
      </p>
    </div>
    <SkeletonBlock className="h-28 w-full" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <SkeletonBlock className="h-44 w-full" />
      <SkeletonBlock className="h-44 w-full" />
    </div>
    <SkeletonBlock className="h-56 w-full" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <SkeletonBlock className="h-36 w-full" />
      <SkeletonBlock className="h-36 w-full" />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
//  Result Cards
// ─────────────────────────────────────────────────────────────────────────────
const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-shadow hover:shadow-md",
      className
    )}
  >
    {children}
  </div>
);

const SectionTitle = ({
  icon: Icon,
  title,
  accent,
}: {
  icon: React.ElementType;
  title: string;
  accent?: boolean;
}) => (
  <div className="flex items-center gap-2.5 mb-4">
    <div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg",
        accent ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
    </div>
    <h3 className="font-semibold text-base text-foreground">{title}</h3>
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

  // Logged-in user — same pattern as other pages
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string } | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { getSession, getUserProfile } = await import('@/lib/supabase-auth');
        const session = await getSession();
        if (session?.user) {
          const profile = await getUserProfile(session.user.id);
          if (profile) {
            setCurrentUser({ id: profile.id, email: profile.email });
          }
        }
      } catch {
        // not logged in — fine, navigator works without auth
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
          // pass user context if logged in — backend saves to Supabase
          ...(currentUser && {
            user_id: currentUser.id,
            user_email: currentUser.email,
          }),
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Something went wrong. Please try again.");
      }

      setResult(json.data);

      // Scroll to result smoothly
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
  };

  const handleCopy = async () => {
    if (!result) return;
    const text = `
Legal Navigator Result
======================
Problem Summary: ${result.problem_summary}
Category: ${result.category}
Recommended Authority: ${result.recommended_authority.name}
Action Steps:
${result.action_steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}
Documents Required:
${result.documents_required.map((d) => `- ${d}`).join("\n")}
Office: ${result.office_details.address}
Contact: ${result.office_details.contact}
Working Hours: ${result.office_details.working_hours}
Online Portal: ${result.online_portal.available ? result.online_portal.link : "Not available"}
Map: ${result.map_link}
Legal Note: ${result.legal_note}
    `.trim();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!result) return;
    if (navigator.share) {
      await navigator.share({
        title: "Turn2Law Legal Navigator Result",
        text: `My legal issue (${result.category}) has been analyzed. Recommended authority: ${result.recommended_authority.name}. Get guided legal help at Turn2Law.`,
        url: window.location.href,
      });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow pt-20">
        {/* ── Hero Section ── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 to-background py-16 md:py-24 border-b border-border/40">
          {/* Decorative background */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-4 py-1.5 text-xs font-semibold text-primary mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                AI-Powered Legal Guidance
              </div>

              <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4">
                Legal Navigator
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-xl mx-auto">
                Describe your issue and get guided legal action instantly —
                right authority, exact steps, required documents.
              </p>

              {/* Trust signals */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs text-muted-foreground">
                {[
                  { icon: ShieldCheck, label: "Trusted Guidance" },
                  { icon: Zap, label: "Instant Results" },
                  { icon: Scale, label: "6 Legal Categories" },
                  { icon: BadgeCheck, label: "India-Specific Laws" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <Icon className="h-4 w-4 text-primary" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Input Section ── */}
        <section className="py-10 md:py-14">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="rounded-2xl border border-border/60 bg-card shadow-sm p-6 md:p-8">
                {/* Problem Description */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Describe your legal issue
                    <span className="text-primary ml-1">*</span>
                  </label>
                  <textarea
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder="e.g. My landlord is not returning my security deposit of ₹50,000 in Chennai even after I vacated the apartment 2 months ago..."
                    className={cn(
                      "w-full min-h-[140px] rounded-xl border border-border/60 bg-input px-4 py-3",
                      "text-sm text-foreground placeholder:text-muted-foreground/60",
                      "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60",
                      "resize-y transition-all leading-relaxed"
                    )}
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    {problem.length}/2000 characters · Be specific for better results
                  </p>
                </div>

                {/* Location */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Your location
                    <span className="text-primary ml-1">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Chennai, Tamil Nadu or 600001"
                      className={cn(
                        "w-full rounded-xl border border-border/60 bg-input pl-10 pr-4 py-3",
                        "text-sm text-foreground placeholder:text-muted-foreground/60",
                        "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60",
                        "transition-all"
                      )}
                      disabled={loading}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSubmit();
                      }}
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/8 p-3.5 mb-5 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit */}
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !problem.trim() || !location.trim()}
                  className="w-full h-12 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-all"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" />
                      Analyzing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Scale className="h-4 w-4" />
                      Get Solution
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>

                {/* Categories hint */}
                <div className="flex flex-wrap gap-2 mt-5 justify-center">
                  {["Consumer", "Civil", "Labour", "Corporate", "Criminal", "Public Grievance"].map((cat) => (
                    <span
                      key={cat}
                      className={cn(
                        "inline-block px-3 py-1 rounded-full text-xs font-medium border",
                        categoryStyles[cat] || "bg-muted text-muted-foreground border-border"
                      )}
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Loading State ── */}
        {loading && (
          <section className="pb-14">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <LoadingSkeleton />
              </div>
            </div>
          </section>
        )}

        {/* ── Result Section ── */}
        {result && !loading && (
          <section ref={resultRef} className="pb-16">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto space-y-5">

                {/* Header bar */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="font-semibold text-foreground">
                      Solution Found
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border",
                        categoryStyles[result.category] ||
                          "bg-muted text-muted-foreground border-border"
                      )}
                    >
                      {result.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                      className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleShare}
                      className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      Share
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleReset}
                      className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      New Query
                    </Button>
                  </div>
                </div>

                {/* 1. Problem Summary */}
                <Card>
                  <SectionTitle icon={FileText} title="Problem Summary" accent />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {result.problem_summary}
                  </p>
                </Card>

                {/* 2. Recommended Authority */}
                <Card className="border-primary/30 bg-primary/3">
                  <SectionTitle icon={Landmark} title="Recommended Authority" accent />
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-primary/15 flex items-center justify-center">
                      <Scale className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-foreground text-base leading-snug">
                        {result.recommended_authority.name}
                      </h4>
                      <span className="inline-block mt-1 mb-2 text-xs font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                        {result.recommended_authority.type}
                      </span>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {result.recommended_authority.description}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* 3. Action Steps */}
                <Card>
                  <SectionTitle icon={ListChecks} title="Action Steps" accent />
                  <ol className="space-y-3.5">
                    {result.action_steps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3.5">
                        <div className="flex-shrink-0 h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="text-sm text-foreground leading-relaxed pt-0.5">
                          {step}
                        </p>
                      </li>
                    ))}
                  </ol>
                </Card>

                {/* 4. Documents Required */}
                <Card>
                  <SectionTitle icon={Paperclip} title="Documents Required" accent />
                  <ul className="space-y-2.5">
                    {result.documents_required.map((doc, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* 5. Office Details + Online Portal (side-by-side on md+) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Office Details */}
                  <Card>
                    <SectionTitle icon={Building2} title="Office Details" />
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{result.office_details.address}</span>
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

                    {/* Map Button */}
                    <a
                      href={result.map_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border/60 bg-muted/50 px-4 py-2.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      View on Google Maps
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </a>
                  </Card>

                  {/* Online Portal */}
                  <Card>
                    <SectionTitle icon={Globe} title="Online Portal" />
                    {result.online_portal.available ? (
                      <div className="flex flex-col h-[calc(100%-52px)] justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                              <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                            </span>
                            <span className="text-sm font-medium text-green-700 dark:text-green-400">
                              Online filing available
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                            You can file your complaint directly online without visiting the office in person.
                          </p>
                        </div>
                        <a
                          href={result.online_portal.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/30 px-4 py-2.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                        >
                          <Globe className="h-3.5 w-3.5" />
                          Go to Official Portal
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-yellow-500" />
                        <span>No official online portal available. Physical visit required.</span>
                      </div>
                    )}
                  </Card>
                </div>

                {/* 6. Legal Note */}
                <div className="flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 dark:border-yellow-900/40 dark:bg-yellow-900/10 p-4 text-sm text-yellow-800 dark:text-yellow-300">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block mb-0.5">Legal Disclaimer</span>
                    <span className="leading-relaxed">{result.legal_note}</span>
                  </div>
                </div>

                {/* 7. Turn2Law CTA Card */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 via-primary to-primary/80 p-7 text-primary-foreground">
                  {/* Decorative */}
                  <div className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-white/8 blur-2xl" />
                  <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/8 blur-2xl" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-5 w-5" />
                      <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                        Turn2Law Premium
                      </span>
                    </div>
                    <h3 className="font-headline text-xl md:text-2xl font-bold mb-2 leading-tight">
                      Need help with this? We handle it end-to-end for you.
                    </h3>
                    <p className="text-primary-foreground/85 text-sm leading-relaxed mb-6 max-w-xl">
                      {result.turn2law_cta}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <a href="/consult">
                        <Button
                          className="bg-white text-primary hover:bg-white/90 font-semibold rounded-xl px-5 h-11 transition-all"
                        >
                          <Scale className="h-4 w-4 mr-2" />
                          Get Expert Help
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </a>
                      <a href="/consult">
                        <Button
                          variant="outline"
                          className="border-white/40 text-white bg-white/10 hover:bg-white/20 rounded-xl px-5 h-11 transition-all"
                        >
                          <CalendarClock className="h-4 w-4 mr-2" />
                          Book a Call
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Ask Another Query */}
                <div className="text-center pt-2">
                  <Button
                    variant="ghost"
                    onClick={handleReset}
                    className="gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Ask Another Query
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── How it works (shown when no result) ── */}
        {!result && !loading && (
          <section className="pb-16">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                {/* How it works */}
                <div className="text-center mb-10">
                  <h2 className="font-headline text-2xl font-bold text-foreground mb-2">
                    How it works
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Three simple steps to get clear legal guidance
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[
                    {
                      step: "01",
                      title: "Describe Your Issue",
                      desc: "Type your problem in plain language — no legal jargon needed. The more detail you provide, the better.",
                      icon: FileText,
                    },
                    {
                      step: "02",
                      title: "AI Analyses & Maps",
                      desc: "Our system classifies your issue, identifies the correct authority, and generates actionable steps.",
                      icon: Sparkles,
                    },
                    {
                      step: "03",
                      title: "Act with Confidence",
                      desc: "Follow the step-by-step guidance or connect with a Turn2Law expert to get it done for you.",
                      icon: CheckCircle2,
                    },
                  ].map(({ step, title, desc, icon: Icon }) => (
                    <div
                      key={step}
                      className="rounded-2xl border border-border/50 bg-card p-6 text-center hover:shadow-md transition-shadow"
                    >
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-xs font-bold text-primary/60 mb-1">
                        STEP {step}
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Example prompts */}
                <div className="mt-10">
                  <p className="text-xs font-semibold text-muted-foreground mb-3 text-center uppercase tracking-wider">
                    Try an example
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[
                      "Landlord not returning deposit in Chennai",
                      "Salary unpaid for 3 months in Bangalore",
                      "Online fraud / UPI scam in Delhi",
                      "Defective product, company refusing refund in Mumbai",
                      "Electricity bill dispute in Pune",
                    ].map((example) => (
                      <button
                        key={example}
                        onClick={() => {
                          const parts = example.split(" in ");
                          setProblem(parts[0]);
                          if (parts[1]) setLocation(parts[1]);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/50 px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted hover:border-border transition-all"
                      >
                        <ArrowRight className="h-3 w-3" />
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Bottom Conversion Banner ── */}
        {!result && !loading && (
          <section className="pb-20">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent p-7">
                  <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
                  <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                    <div>
                      <h3 className="font-headline text-xl font-bold text-foreground mb-1">
                        Already know your problem?
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-sm">
                        Connect directly with an expert lawyer on Turn2Law and get your issue resolved end-to-end.
                      </p>
                    </div>
                    <div className="flex gap-3 flex-shrink-0">
                      <a href="/consult">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-5 h-10 text-sm font-semibold transition-all">
                          <Scale className="h-4 w-4 mr-2" />
                          Consult a Lawyer
                        </Button>
                      </a>
                    </div>
                  </div>
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
