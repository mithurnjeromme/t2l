"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Star,
  Phone,
  Mail,
  Calendar,
  X,
  Sparkles,
  Loader2,
  ArrowLeft,
  MapPin,
  Briefcase,
  MessageCircle,
  Video,
  Sliders,
  Search,
} from "lucide-react";
import Header from "@/components/layout/header";
import { FlipWords } from "@/components/ui/flip-words";
import { mlMatchingAPI, LawyerProfile } from "@/lib/ml-matching-api";
import { Slider } from "@/components/ui/slider";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { LawyerChat } from "@/components/ui/lawyer-chat";

// Add custom scrollbar styles
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
      
      {/* Mobile Filters Popup */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-100 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => {
              console.log("📂 Mobile filters backdrop clicked - closing");
              setMobileFiltersOpen(false);
            }}
          />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gradient-to-b from-black via-gray-900 to-black p-4 rounded-2xl border border-yellow-400/20 overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold">Filters</h3>
                <button
                  onClick={() => {
                    console.log("📂 Mobile filters close button clicked");
                    setMobileFiltersOpen(false);
                  }}
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center"
                  aria-label="Close filters"
                >
                  <X className="w-4 h-4 text-white/70" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Price Range (compact) */}
                <div className="p-3 bg-black/40 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/70">Consultation Fee</span>
                    <span className="text-sm font-bold text-yellow-400">₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}</span>
                  </div>
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => setFilters({ ...filters, priceRange: value as [number, number] })}
                    min={0}
                    max={10000}
                    step={500}
                    className="w-full"
                  />
                </div>

                {/* Location */}
                <div className="p-3 bg-black/40 rounded-2xl border border-white/10">
                  <label className="text-xs font-bold text-white mb-2">Location</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => {
                      setSelectedLocation(e.target.value);
                      if (e.target.value) setFilters({ ...filters, locations: [e.target.value] });
                      else setFilters({ ...filters, locations: [] });
                    }}
                    className="w-full bg-black/60 rounded-2xl px-4 py-3 text-white"
                  >
                    <option value="">All Locations</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                {/* Case Type */}
                <div className="p-3 bg-black/40 rounded-2xl border border-white/10">
                  <label className="text-xs font-bold text-white mb-2">Case Type</label>
                  <select
                    value={selectedCaseType}
                    onChange={(e) => {
                      setSelectedCaseType(e.target.value);
                      if (e.target.value) setFilters({ ...filters, caseTypes: [e.target.value] });
                      else setFilters({ ...filters, caseTypes: [] });
                    }}
                    className="w-full bg-black/60 rounded-2xl px-4 py-3 text-white"
                  >
                    <option value="">All Case Types</option>
                    {caseTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Language */}
                <div className="p-3 bg-black/40 rounded-2xl border border-white/10">
                  <label className="text-xs font-bold text-white mb-2">Language</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => {
                      setSelectedLanguage(e.target.value);
                      if (e.target.value) setFilters({ ...filters, languages: [e.target.value] });
                      else setFilters({ ...filters, languages: [] });
                    }}
                    className="w-full bg-black/60 rounded-2xl px-4 py-3 text-white"
                  >
                    <option value="">All Languages</option>
                    {allLanguages.map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      // Apply and close
                      setMobileFiltersOpen(false);
                    }}
                    className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-3 rounded-2xl"
                  >
                    Apply
                  </Button>
                  <Button
                    onClick={() => {
                      // Reset filters
                      setFilters({
                        priceRange: [0, 10000],
                        locations: [],
                        caseTypes: [],
                        minExperience: 0,
                        minRating: 0,
                        minSuccessRate: 0,
                        languages: [],
                        sortBy: "rating",
                        availability: "all",
                        verified: false,
                      });
                      setSelectedLocation("");
                      setSelectedCaseType("");
                      setSelectedLanguage("");
                      setMobileFiltersOpen(false);
                    }}
                    className="flex-1 bg-white/5 text-white py-3 rounded-2xl"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ConsultPage
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(250, 204, 21, 0.3);
      border-radius: 10px;
      transition: background 0.3s;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(250, 204, 21, 0.5);
    }
  `;
  if (!document.querySelector("style[data-scrollbar]")) {
    style.setAttribute("data-scrollbar", "true");
    document.head.appendChild(style);
  }
}

interface Lawyer {
  id: number;
  name: string;
  specialization: string;
  category: string;
  rating: number;
  reviews: number;
  experience: string;
  location: string;
  phone: string;
  email: string;
  consultationFee: string;
  about: string;
  image: string;
  match_score?: number;
  match_reasons?: string[];
}

interface FilterState {
  priceRange: [number, number];
  locations: string[];
  caseTypes: string[];
  minExperience: number;
  minRating: number;
  minSuccessRate: number;
  languages: string[];
  sortBy:
    | "rating"
    | "price-low"
    | "price-high"
    | "experience"
    | "reviews"
    | "cases-handled"
    | "success-rate";
  availability: "all" | "available" | "verified";
  verified: boolean;
}

const TypingEffect = () => (
  <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
    Find the best{" "}
    <span className="text-yellow-400">
      <FlipWords
        className="*:text-yellow-400"
        words={["lawyers", "attorneys", "advocates"]}
      />
    </span>
  </h1>
);

const ConsultPage = () => {
  const router = useRouter();
  const [userPrompt, setUserPrompt] = useState("");
  const [matchedLawyers, setMatchedLawyers] = useState<LawyerProfile[]>([]);
  const [allLawyers, setAllLawyers] = useState<LawyerProfile[]>([]);
  const [filteredLawyers, setFilteredLawyers] = useState<LawyerProfile[]>([]);
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [bookingType, setBookingType] = useState<"call" | "video" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 10000],
    locations: [],
    caseTypes: [],
    minExperience: 0,
    minRating: 0,
    minSuccessRate: 0,
    languages: [],
    sortBy: "rating",
    availability: "all",
    verified: false,
  });

  // Single-select dropdown states
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedCaseType, setSelectedCaseType] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [bookingFormData, setBookingFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    caseDescription: "",
    preferredDateTime: "",
  });
  const [openSections, setOpenSections] = useState({
    price: true,
    locations: true,
    caseTypes: true,
    languages: false,
    experience: false,
    rating: true,
    successRate: false,
    sort: true,
    availability: false,
    verified: false,
  });

  // Mobile filter drawer state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Available options for filters
  const locations = [
    "Chennai",
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Hyderabad",
    "Kolkata",
  ];
  const caseTypes = [
    "Property and Estate",
    "Divorce",
    "Criminal",
    "Tax & Corporate",
    "General Legal",
  ];
  const allLanguages = [
    "English",
    "Hindi",
    "Tamil",
    "Telugu",
    "Bengali",
    "Kannada",
    "Malayalam",
  ];

  // Load all lawyers on component mount
  useEffect(() => {
    loadAllLawyers();
  }, []);

  // Apply filters whenever filters change or lawyers are loaded
  useEffect(() => {
    applyFilters();
  }, [filters, allLawyers]);

  const loadAllLawyers = async () => {
    setLoading(true);
    try {
      // Load all lawyers without any specific filters
      const response = await mlMatchingAPI.matchLawyers({
        case_type: "General Legal",
        case_description: "Looking for legal assistance",
        location: "Chennai",
        urgency: "Medium",
        language_preference: "English",
      });

      if (response.success && response.matched_lawyers.length > 0) {
        setAllLawyers(response.matched_lawyers);
        setFilteredLawyers(response.matched_lawyers);
      }
    } catch (err) {
      console.error("❌ Error loading lawyers:", err);
      setError("Unable to load lawyers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allLawyers];

    // Price filter
    filtered = filtered.filter((lawyer) => {
      const fee = parseInt(
        lawyer.consultation_fee_formatted
          .replace(/[₹,]/g, "")
          .split("/")[0]
          .trim(),
      );
      return fee >= filters.priceRange[0] && fee <= filters.priceRange[1];
    });

    // Location filter
    if (filters.locations.length > 0) {
      filtered = filtered.filter((lawyer) =>
        filters.locations.some(
          (loc) =>
            lawyer.location.toLowerCase().includes(loc.toLowerCase()) ||
            lawyer.city?.toLowerCase().includes(loc.toLowerCase()),
        ),
      );
    }

    // Case type filter
    if (filters.caseTypes.length > 0) {
      filtered = filtered.filter((lawyer) =>
        filters.caseTypes.some(
          (type) =>
            lawyer.specialization.toLowerCase().includes(type.toLowerCase()) ||
            lawyer.category.toLowerCase().includes(type.toLowerCase()),
        ),
      );
    }

    // Experience filter
    if (filters.minExperience > 0) {
      filtered = filtered.filter((lawyer) => {
        const exp = parseInt(lawyer.experience.match(/(\d+)/)?.[1] || "0");
        return exp >= filters.minExperience;
      });
    }

    // Rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter(
        (lawyer) => lawyer.rating >= filters.minRating,
      );
    }

    // Success rate filter
    if (filters.minSuccessRate > 0) {
      filtered = filtered.filter(
        (lawyer) => lawyer.success_rate >= filters.minSuccessRate,
      );
    }

    // Languages filter
    if (filters.languages.length > 0) {
      filtered = filtered.filter((lawyer) =>
        lawyer.languages?.some((lang) => filters.languages.includes(lang)),
      );
    }

    // Availability filter
    if (filters.availability === "available") {
      filtered = filtered.filter((lawyer) => lawyer.available_now === true);
    } else if (filters.availability === "verified") {
      filtered = filtered.filter((lawyer) => lawyer.verified === true);
    }

    // Verified filter
    if (filters.verified) {
      filtered = filtered.filter((lawyer) => lawyer.verified === true);
    }

    // Sorting
    switch (filters.sortBy) {
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "price-low":
        filtered.sort((a, b) => {
          const feeA = parseInt(
            a.consultation_fee_formatted
              .replace(/[₹,]/g, "")
              .split("/")[0]
              .trim(),
          );
          const feeB = parseInt(
            b.consultation_fee_formatted
              .replace(/[₹,]/g, "")
              .split("/")[0]
              .trim(),
          );
          return feeA - feeB;
        });
        break;
      case "price-high":
        filtered.sort((a, b) => {
          const feeA = parseInt(
            a.consultation_fee_formatted
              .replace(/[₹,]/g, "")
              .split("/")[0]
              .trim(),
          );
          const feeB = parseInt(
            b.consultation_fee_formatted
              .replace(/[₹,]/g, "")
              .split("/")[0]
              .trim(),
          );
          return feeB - feeA;
        });
        break;
      case "experience":
        filtered.sort((a, b) => {
          const expA = parseInt(a.experience.match(/(\d+)/)?.[1] || "0");
          const expB = parseInt(b.experience.match(/(\d+)/)?.[1] || "0");
          return expB - expA;
        });
        break;
      case "reviews":
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
      case "success-rate":
        filtered.sort((a, b) => b.success_rate - a.success_rate);
        break;
      case "cases-handled":
        filtered.sort((a, b) => b.cases_handled - a.cases_handled);
        break;
    }

    setFilteredLawyers(filtered);
  };

  const convertToLegacyLawyer = (lawyer: LawyerProfile): Lawyer => {
    return {
      id: lawyer.id,
      name: lawyer.name,
      specialization: lawyer.specialization,
      category: lawyer.category,
      rating: lawyer.rating,
      reviews: lawyer.reviews,
      experience: lawyer.experience,
      location: lawyer.location,
      phone: lawyer.phone,
      email: lawyer.email,
      consultationFee: lawyer.consultation_fee_formatted,
      about: lawyer.about,
      image: lawyer.image,
      match_score: lawyer.match_score,
      match_reasons: lawyer.match_reasons,
    };
  };

  const extractKeywordsFromPrompt = (prompt: string) => {
    const lowerPrompt = prompt.toLowerCase();
    console.log("🔍 Analyzing prompt:", prompt);

    // Extract case type with more specific patterns
    const caseTypePatterns = {
      property: [
        "property",
        "land",
        "real estate",
        "estate planning",
        "tenancy",
      ],
      divorce: ["divorce", "separation", "matrimonial"],
      family: ["family law", "custody", "adoption", "child support"],
      criminal: ["criminal", "crime", "theft", "fraud", "assault"],
      corporate: ["corporate", "business", "company", "startup"],
      tax: ["tax", "gst", "income tax", "taxation"],
    };

    let caseType = "General Legal";
    for (const [key, patterns] of Object.entries(caseTypePatterns)) {
      if (patterns.some((pattern) => lowerPrompt.includes(pattern))) {
        if (key === "property") caseType = "Property and Estate";
        else if (key === "divorce" || key === "family") caseType = "Divorce";
        else if (key === "tax" || key === "corporate")
          caseType = "Tax & Corporate";
        else if (key === "criminal") caseType = "Criminal";
        console.log("✅ Detected case type:", caseType);
        break;
      }
    }

    // Extract location with more variations
    const locationPatterns = [
      "chennai",
      "mumbai",
      "delhi",
      "bangalore",
      "bengaluru",
      "hyderabad",
      "kolkata",
      "calcutta",
    ];
    let location = "Chennai";
    for (const loc of locationPatterns) {
      if (lowerPrompt.includes(loc)) {
        location = loc.charAt(0).toUpperCase() + loc.slice(1);
        if (location === "Bengaluru") location = "Bangalore";
        if (location === "Calcutta") location = "Kolkata";
        console.log("✅ Detected location:", location);
        break;
      }
    }

    // Extract budget with multiple patterns and context
    let budget: number | undefined;
    let budgetOperator: "under" | "above" | "around" | "exact" = "exact";

    // Check for budget context words
    if (
      lowerPrompt.includes("under") ||
      lowerPrompt.includes("below") ||
      lowerPrompt.includes("less than") ||
      lowerPrompt.includes("maximum")
    ) {
      budgetOperator = "under";
    } else if (
      lowerPrompt.includes("above") ||
      lowerPrompt.includes("over") ||
      lowerPrompt.includes("more than") ||
      lowerPrompt.includes("minimum")
    ) {
      budgetOperator = "above";
    } else if (
      lowerPrompt.includes("around") ||
      lowerPrompt.includes("approximately") ||
      lowerPrompt.includes("about")
    ) {
      budgetOperator = "around";
    }

    // Try multiple budget patterns
    const budgetPatterns = [
      /(?:under|below|less than|maximum|max|upto|up to)\s*₹?\s*(\d+(?:,\d+)?)/i,
      /₹?\s*(\d+(?:,\d+)?)\s*(?:or less|maximum|max)/i,
      /(?:around|approximately|about)\s*₹?\s*(\d+(?:,\d+)?)/i,
      /(?:budget|fee|price|cost)\s*(?:is|of)?\s*₹?\s*(\d+(?:,\d+)?)/i,
      /₹\s*(\d+(?:,\d+)?)/,
      /(\d+(?:,\d+)?)\s*rupees?/i,
    ];

    for (const pattern of budgetPatterns) {
      const match = prompt.match(pattern);
      if (match) {
        budget = parseInt(match[1].replace(/,/g, ""));
        console.log(`✅ Detected budget: ₹${budget} (${budgetOperator})`);
        break;
      }
    }

    // Extract urgency with more context
    let urgency: "Low" | "Medium" | "High" = "Medium";
    if (
      lowerPrompt.includes("urgent") ||
      lowerPrompt.includes("asap") ||
      lowerPrompt.includes("immediately") ||
      lowerPrompt.includes("emergency") ||
      lowerPrompt.includes("right now") ||
      lowerPrompt.includes("today")
    ) {
      urgency = "High";
      console.log("✅ Detected urgency: High");
    } else if (
      lowerPrompt.includes("not urgent") ||
      lowerPrompt.includes("flexible") ||
      lowerPrompt.includes("whenever") ||
      lowerPrompt.includes("no hurry")
    ) {
      urgency = "Low";
      console.log("✅ Detected urgency: Low");
    }

    // Extract experience with multiple patterns
    let preferredExperience: number | undefined;
    const expPatterns = [
      /(\d+)\+?\s*(?:years?|yrs?)\s*(?:of)?\s*(?:experience|exp)/i,
      /(?:experience|exp)\s*(?:of)?\s*(\d+)\+?\s*(?:years?|yrs?)/i,
      /(?:with|having)\s*(\d+)\+?\s*(?:years?|yrs?)/i,
      /(?:senior|experienced)\s*(?:with)?\s*(\d+)\+?\s*(?:years?|yrs?)/i,
    ];

    for (const pattern of expPatterns) {
      const match = prompt.match(pattern);
      if (match) {
        preferredExperience = parseInt(match[1]);
        console.log(
          "✅ Detected experience requirement:",
          preferredExperience,
          "years",
        );
        break;
      }
    }

    // Extract language preferences
    const languagePatterns = [
      "tamil",
      "hindi",
      "english",
      "telugu",
      "bengali",
      "kannada",
      "malayalam",
    ];
    const detectedLanguages: string[] = [];
    for (const lang of languagePatterns) {
      if (lowerPrompt.includes(lang)) {
        detectedLanguages.push(lang.charAt(0).toUpperCase() + lang.slice(1));
      }
    }
    const languagePreference =
      detectedLanguages.length > 0 ? detectedLanguages.join(", ") : "English";
    if (detectedLanguages.length > 0) {
      console.log("✅ Detected languages:", languagePreference);
    }

    const extracted = {
      case_type: caseType,
      case_description: prompt,
      location,
      budget,
      urgency,
      preferred_experience: preferredExperience,
      language_preference: languagePreference,
      budget_operator: budgetOperator, // Pass this for strict filtering
    };

    console.log("📊 Final extracted data:", extracted);
    return extracted;
  };

  const handleFindLawyers = async () => {
    if (!userPrompt.trim()) {
      // If no prompt, just show filtered lawyers
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const request = extractKeywordsFromPrompt(userPrompt);
      console.log("🚀 Sending request to backend:", request);

      const response = await mlMatchingAPI.matchLawyers(request);
      console.log("✅ Received response:", response);

      if (response.success && response.matched_lawyers.length > 0) {
        setAllLawyers(response.matched_lawyers);
        setFilteredLawyers(response.matched_lawyers);
      } else {
        setError("No matching lawyers found. Showing all available lawyers.");
        loadAllLawyers();
      }
    } catch (err) {
      console.error("❌ Match error:", err);
      setError("Unable to process search. Showing all available lawyers.");
      loadAllLawyers();
    } finally {
      setLoading(false);
    }
  };

  const handleCallRequest = (lawyer: LawyerProfile, type: "call" | "video") => {
    setSelectedLawyer(convertToLegacyLawyer(lawyer));
    setBookingType(type);
    setIsBookingOpen(true);
  };

  // Hash lawyer name for privacy
  const hashLawyerName = (name: string) => {
    const parts = name.split(" ");
    return parts
      .map((part) => {
        if (part.length <= 2) return part;
        return (
          part.substring(0, 2) +
          "*".repeat(Math.min(part.length - 3, 3)) +
          part[part.length - 1]
        );
      })
      .join(" ");
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedLawyer) return;

    // Close the booking modal
    setIsBookingOpen(false);

    // Redirect to messages with hashed lawyer name and booking details
    const hashedName = hashLawyerName(selectedLawyer.name);
    const params = new URLSearchParams({
      lawyerId: Date.now().toString(),
      caseDescription: bookingFormData.caseDescription,
      specialization: selectedLawyer.specialization,
      lawyerName: hashedName,
    });

    router.push(`/messages?${params.toString()}`);
  };

  const handleBackToSearch = () => {
    setUserPrompt("");
    setError(null);
    loadAllLawyers();
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />

  <div className="flex flex-col lg:flex-row">
        {/* Left Sidebar - Filters */}
  {/* Desktop sidebar: hidden on mobile, visible on lg+ */}
  <div className="hidden lg:block w-full lg:w-96 bg-gradient-to-b from-black via-gray-950 to-black h-auto lg:h-[calc(100vh-80px)] lg:sticky lg:top-20 overflow-y-auto shadow-2xl">
          <div className="p-4 space-y-3">
            {/* Price Range */}
            <div className="bg-gradient-to-br from-white/5 via-white/[0.02] to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-3 hover:border-yellow-400/40 hover:shadow-xl hover:shadow-yellow-400/10 transition-all duration-300">
              <label className="text-xs font-bold text-white mb-2 flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-md shadow-yellow-400/30">
                  <span className="text-black text-xs">₹</span>
                </div>
                <span>Consultation Fee Range</span>
              </label>
              <div className="mb-2 flex items-center justify-between bg-black/40 rounded-xl p-2 border border-white/10">
                <div className="text-center">
                  <p className="text-[10px] text-white/50 mb-0.5">Minimum</p>
                  <span className="text-yellow-400 font-bold text-sm">
                    ₹{filters.priceRange[0]}
                  </span>
                </div>
                <div className="h-6 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                <div className="text-center">
                  <p className="text-[10px] text-white/50 mb-0.5">Maximum</p>
                  <span className="text-yellow-400 font-bold text-sm">
                    ₹{filters.priceRange[1]}
                  </span>
                </div>
              </div>
                {/* mobile filters removed from sidebar - popup will be rendered elsewhere */}
              <Slider
                value={filters.priceRange}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    priceRange: value as [number, number],
                  })
                }
                min={0}
                max={10000}
                step={500}
                className="w-full [&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-yellow-400 [&_[role=slider]]:to-yellow-600 [&_[role=slider]]:border-2 [&_[role=slider]]:border-yellow-300 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-yellow-400/50 [&_.bg-primary]:bg-gradient-to-r [&_.bg-primary]:from-yellow-400 [&_.bg-primary]:to-yellow-600"
              />
            </div>

            {}
            <div className="bg-gradient-to-br from-white/5 via-white/[0.02] to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-3 hover:border-yellow-400/40 hover:shadow-xl hover:shadow-yellow-400/10 transition-all duration-300">
              <label className="text-xs font-bold text-white mb-2 flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-md shadow-yellow-400/30">
                  <MapPin className="w-4 h-4 text-black" />
                </div>
                <span>Location</span>
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value);
                  if (e.target.value) {
                    setFilters({ ...filters, locations: [e.target.value] });
                  } else {
                    setFilters({ ...filters, locations: [] });
                  }
                }}
                className="w-full bg-black/60 border-2 border-yellow-400/30 rounded-2xl px-5 py-4 text-white font-semibold focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 hover:border-yellow-400/50 hover:bg-black/80 transition-all cursor-pointer shadow-lg"
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Case Types */}
            <div className="bg-gradient-to-br from-white/5 via-white/[0.02] to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-3 hover:border-yellow-400/40 hover:shadow-xl hover:shadow-yellow-400/10 transition-all duration-300">
              <label className="text-xs font-bold text-white mb-2 flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-md shadow-yellow-400/30">
                  <Briefcase className="w-4 h-4 text-black" />
                </div>
                <span>Case Type</span>
              </label>
              <select
                value={selectedCaseType}
                onChange={(e) => {
                  setSelectedCaseType(e.target.value);
                  if (e.target.value) {
                    setFilters({ ...filters, caseTypes: [e.target.value] });
                  } else {
                    setFilters({ ...filters, caseTypes: [] });
                  }
                }}
                className="w-full bg-black/60 border-2 border-yellow-400/30 rounded-2xl px-5 py-4 text-white font-semibold focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 hover:border-yellow-400/50 hover:bg-black/80 transition-all cursor-pointer shadow-lg"
              >
                <option value="">All Case Types</option>
                {caseTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Languages */}
            <div className="bg-gradient-to-br from-white/5 via-white/[0.02] to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-3 hover:border-yellow-400/40 hover:shadow-xl hover:shadow-yellow-400/10 transition-all duration-300">
              <label className="text-xs font-bold text-white mb-2 flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-md shadow-yellow-400/30">
                  <MessageCircle className="w-4 h-4 text-black" />
                </div>
                <span>Language</span>
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => {
                  setSelectedLanguage(e.target.value);
                  if (e.target.value) {
                    setFilters({ ...filters, languages: [e.target.value] });
                  } else {
                    setFilters({ ...filters, languages: [] });
                  }
                }}
                className="w-full bg-black/60 border-2 border-yellow-400/30 rounded-2xl px-5 py-4 text-white font-semibold focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 hover:border-yellow-400/50 hover:bg-black/80 transition-all cursor-pointer shadow-lg"
              >
                <option value="">All Languages</option>
                {allLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience */}
            <div className="bg-gradient-to-br from-white/5 via-white/[0.02] to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-3 hover:border-yellow-400/40 hover:shadow-xl hover:shadow-yellow-400/10 transition-all duration-300">
              <label className="text-xs font-bold text-white mb-2 flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-md shadow-yellow-400/30">
                  <Briefcase className="w-4 h-4 text-black" />
                </div>
                <span>Minimum Experience</span>
              </label>
              <div className="mb-4 bg-black/40 rounded-2xl p-4 border border-white/10 text-center">
                <span className="text-yellow-400 font-bold text-2xl">
                  {filters.minExperience}+
                </span>
                <p className="text-white/50 text-xs mt-1">
                  years of experience
                </p>
              </div>
              <Slider
                value={[filters.minExperience]}
                onValueChange={(value) =>
                  setFilters({ ...filters, minExperience: value[0] })
                }
                min={0}
                max={30}
                step={1}
                className="w-full [&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-yellow-400 [&_[role=slider]]:to-yellow-600 [&_[role=slider]]:border-2 [&_[role=slider]]:border-yellow-300 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-yellow-400/50 [&_.bg-primary]:bg-gradient-to-r [&_.bg-primary]:from-yellow-400 [&_.bg-primary]:to-yellow-600"
              />
            </div>

            {/* Rating */}
            <div className="bg-gradient-to-br from-white/5 via-white/[0.02] to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-3 hover:border-yellow-400/40 hover:shadow-xl hover:shadow-yellow-400/10 transition-all duration-300">
              <label className="text-xs font-bold text-white mb-2 flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-md shadow-yellow-400/30">
                  <Star className="w-4 h-4 text-black fill-black" />
                </div>
                <span>Minimum Rating</span>
              </label>
              <div className="mb-4 bg-black/40 rounded-2xl p-4 border border-white/10 flex items-center justify-center gap-3">
                <span className="text-yellow-400 font-bold text-2xl">
                  {filters.minRating}+
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 transition-all duration-200 ${star <= filters.minRating ? "fill-yellow-400 text-yellow-400 scale-110" : "text-white/20"}`}
                    />
                  ))}
                </div>
              </div>
              <Slider
                value={[filters.minRating]}
                onValueChange={(value) =>
                  setFilters({ ...filters, minRating: value[0] })
                }
                min={0}
                max={5}
                step={0.5}
                className="w-full [&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-yellow-400 [&_[role=slider]]:to-yellow-600 [&_[role=slider]]:border-2 [&_[role=slider]]:border-yellow-300 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-yellow-400/50 [&_.bg-primary]:bg-gradient-to-r [&_.bg-primary]:from-yellow-400 [&_.bg-primary]:to-yellow-600"
              />
            </div>

            {/* Sort By */}
            <div className="bg-gradient-to-br from-white/5 via-white/[0.02] to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-3 hover:border-yellow-400/40 hover:shadow-xl hover:shadow-yellow-400/10 transition-all duration-300">
              <label className="text-xs font-bold text-white mb-2 flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-md shadow-yellow-400/30">
                  <Sliders className="w-4 h-4 text-black" />
                </div>
                <span>Sort By</span>
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    sortBy: e.target.value as FilterState["sortBy"],
                  })
                }
                className="w-full bg-black/60 border-2 border-yellow-400/30 rounded-2xl px-5 py-4 text-white font-semibold focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 hover:border-yellow-400/50 hover:bg-black/80 transition-all cursor-pointer shadow-lg"
              >
                <option value="rating">Highest Rating</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="experience">Most Experienced</option>
                <option value="reviews">Most Reviews</option>
                <option value="success-rate">Highest Success Rate</option>
                <option value="cases-handled">Most Cases Handled</option>
              </select>
            </div>

            {/* Availability */}
            <div className="bg-gradient-to-br from-white/5 via-white/[0.02] to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-3 hover:border-yellow-400/40 hover:shadow-xl hover:shadow-yellow-400/10 transition-all duration-300">
              <label className="text-xs font-bold text-white mb-2 flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-md shadow-yellow-400/30">
                  <Calendar className="w-4 h-4 text-black" />
                </div>
                <span>Availability</span>
              </label>
              <select
                value={filters.availability}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    availability: e.target.value as FilterState["availability"],
                  })
                }
                className="w-full bg-black/60 border-2 border-yellow-400/30 rounded-2xl px-5 py-4 text-white font-semibold focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 hover:border-yellow-400/50 hover:bg-black/80 transition-all cursor-pointer shadow-lg"
              >
                <option value="all">All Lawyers</option>
                <option value="available">Available Now</option>
                <option value="verified">Verified Only</option>
              </select>
            </div>

            {/* Verified Only Toggle */}
            <div className="bg-gradient-to-br from-white/5 via-white/[0.02] to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-3 hover:border-yellow-400/40 hover:shadow-xl hover:shadow-yellow-400/10 transition-all duration-300">
              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-md shadow-yellow-400/30">
                    <span className="text-black text-lg">✓</span>
                  </div>
                  <span className="text-sm font-bold text-white">
                    Verified Only
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={filters.verified}
                  onChange={(e) =>
                    setFilters({ ...filters, verified: e.target.checked })
                  }
                  className="w-6 h-6 rounded-lg border-2 border-yellow-400/40 text-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-black cursor-pointer transition-all"
                />
              </label>
            </div>

            {/* Success Rate Filter */}
            <div className="bg-gradient-to-br from-white/5 via-white/[0.02] to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-3 hover:border-yellow-400/40 hover:shadow-xl hover:shadow-yellow-400/10 transition-all duration-300">
              <label className="text-xs font-bold text-white mb-2 flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-md shadow-yellow-400/30">
                  <span className="text-black text-xs font-bold">%</span>
                </div>
                <span>Minimum Success Rate</span>
              </label>
              <div className="mb-4 bg-black/40 rounded-2xl p-4 border border-white/10 text-center">
                <span className="text-yellow-400 font-bold text-2xl">
                  {filters.minSuccessRate}%+
                </span>
                <p className="text-white/50 text-xs mt-1">success rate</p>
              </div>
              <Slider
                value={[filters.minSuccessRate]}
                onValueChange={(value) =>
                  setFilters({ ...filters, minSuccessRate: value[0] })
                }
                min={0}
                max={100}
                step={5}
                className="w-full [&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-yellow-400 [&_[role=slider]]:to-yellow-600 [&_[role=slider]]:border-2 [&_[role=slider]]:border-yellow-300 [&_[role=slider]]:shadow-lg [&_[role=slider]]:shadow-yellow-400/50 [&_.bg-primary]:bg-gradient-to-r [&_.bg-primary]:from-yellow-400 [&_.bg-primary]:to-yellow-600"
              />
            </div>

            {/* Reset Filters */}
            <Button
              onClick={() => {
                setFilters({
                  priceRange: [0, 10000],
                  locations: [],
                  caseTypes: [],
                  minExperience: 0,
                  minRating: 0,
                  minSuccessRate: 0,
                  languages: [],
                  sortBy: "rating",
                  availability: "all",
                  verified: false,
                });
                setSelectedLocation("");
                setSelectedCaseType("");
                setSelectedLanguage("");
              }}
              className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-black font-bold py-4 rounded-2xl shadow-2xl shadow-yellow-400/30 hover:shadow-yellow-400/50 hover:scale-[1.02] transition-all duration-300 border-0 text-base"
            >
              <span className="flex items-center justify-center gap-2">
                <X className="w-5 h-5" />
                Reset All Filters
              </span>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-black">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8">
            {/* Header */}
            <div className="text-center mb-12">
              <TypingEffect />
              <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10">
                Browse our verified lawyers or describe your case for AI-powered
                matches
              </p>

              {/* Search Prompt Box */}
              <div className="max-w-4xl mx-auto mb-8">
                <PlaceholdersAndVanishInput
                  placeholders={[
                    "Property dispute in Chennai, budget ₹2500, 15+ years experience...",
                    "Divorce case in Mumbai, urgent, Hindi speaking lawyer needed...",
                    "Criminal defense in Delhi, experienced advocate required...",
                    "Tax consultation in Bangalore, corporate tax specialist...",
                    "Family law case in Kolkata, immediate consultation needed...",
                  ]}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleFindLawyers();
                  }}
                />
              </div>

              {/* Mobile: Filters toggle button */}
              <div className="lg:hidden flex justify-center mb-6">
                <button
                  onClick={() => {
                    console.log("📂 Filters button clicked (mobile)");
                    setMobileFiltersOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black font-semibold shadow-lg"
                  aria-controls="mobile-filters-drawer"
                  aria-expanded={mobileFiltersOpen}
                >
                  <Sliders className="w-4 h-4" />
                  Filters
                </button>
              </div>

              {error && (
                <div className="mb-6 bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-4 max-w-4xl mx-auto backdrop-blur-sm">
                  <p className="text-red-400 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Results Count */}
              <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-full px-6 py-3 shadow-lg shadow-yellow-400/10">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <p className="text-white/80 text-sm font-medium">
                  Showing{" "}
                  <span className="text-yellow-400 font-bold text-base">
                    {filteredLawyers.length}
                  </span>{" "}
                  qualified lawyers
                </p>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="max-w-2xl mx-auto text-center py-20">
                <div className="relative inline-block mb-8">
                  <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full animate-pulse"></div>
                  <Loader2 className="w-16 h-16 text-yellow-400 animate-spin relative" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Finding perfect matches...
                </h3>
                <p className="text-white/60">
                  Please wait while we search our database
                </p>
              </div>
            )}

            {/* Lawyers Grid */}
            {!loading && filteredLawyers.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
                {filteredLawyers.map((lawyer) => {
                  const maskName = (name: string) => {
                    const parts = name.split(" ");
                    return parts
                      .map((part) => {
                        if (part.length <= 2) return part;
                        const firstChars = part.substring(0, 2);
                        const lastChar = part[part.length - 1];
                        const masked = "*".repeat(Math.min(part.length - 3, 2));
                        return `${firstChars}${masked}${lastChar}`;
                      })
                      .join(" ");
                  };

                  const getExperienceYears = (exp: string) => {
                    const match = exp.match(/(\d+)/);
                    return match ? `${match[1]}y` : exp;
                  };

                  const getConsultationFee = (feeStr: string) => {
                    return feeStr.replace(/[₹,]/g, "").split("/")[0].trim();
                  };

                  return (
                    <div
                      key={lawyer.id}
                      className="group relative flex flex-col h-full"
                    >
                      {/* Glow effect on hover */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-300"></div>

                      {/* Card - Fixed height structure */}
                      <div className="relative flex flex-col h-full bg-gradient-to-br from-gray-950 via-black to-gray-900 border border-white/10 group-hover:border-yellow-400/50 rounded-2xl p-4 transition-all duration-300 shadow-xl group-hover:shadow-2xl">
                        {/* Verified Badge */}
                        {lawyer.verified && (
                          <div className="absolute top-3 right-3 z-10 bg-green-500/20 border border-green-500/40 rounded-full px-2 py-1 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                            <span className="text-green-400 text-xs font-bold">
                              Verified
                            </span>
                          </div>
                        )}

                        {/* Blurred Image - Fixed aspect ratio */}
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl aspect-[3/4] mb-4 overflow-hidden relative flex-shrink-0">
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400 blur-3xl opacity-30"></div>
                          </div>

                          {/* Hover overlay with rating */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                <span className="text-white font-bold text-lg">
                                  {lawyer.rating}
                                </span>
                              </div>
                              <p className="text-white/80 text-xs">
                                {lawyer.reviews} reviews
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Info section - Flex grow to fill space */}
                        <div className="flex flex-col flex-grow space-y-2.5">
                          {/* Name */}
                          <h3 className="text-white font-bold text-base leading-tight group-hover:text-yellow-400 transition-colors line-clamp-2 min-h-[2.5rem]">
                            {maskName(lawyer.name)}
                          </h3>

                          {/* Specialization */}
                          <p className="text-white/70 text-sm font-medium line-clamp-2 min-h-[2.5rem]">
                            {lawyer.specialization}
                          </p>

                          {/* Meta info */}
                          <div className="space-y-1.5 text-xs">
                            <div className="flex items-center gap-1.5 text-white/50">
                              <Briefcase className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                              <span>
                                {getExperienceYears(lawyer.experience)} exp
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 text-white/50">
                              <MapPin className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                              <span className="truncate">
                                {lawyer.city || lawyer.location}
                              </span>
                            </div>

                            {/* Success Rate */}
                            <div className="flex items-center gap-1.5">
                              <div className="flex items-center gap-1 bg-green-500/20 px-2 py-0.5 rounded">
                                <span className="text-green-400 text-xs font-bold">
                                  {lawyer.success_rate}%
                                </span>
                              </div>
                              <span className="text-white/40 text-xs">
                                success
                              </span>
                            </div>

                            {/* Cases Handled */}
                            <div className="flex items-center gap-1.5 text-white/50">
                              <span className="text-xs">
                                {lawyer.cases_handled} cases handled
                              </span>
                            </div>

                            {/* Response Time */}
                            {lawyer.response_time && (
                              <div className="flex items-center gap-1.5 text-white/40">
                                <span className="text-xs truncate">
                                  {lawyer.response_time}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Spacer to push price and buttons to bottom */}
                          <div className="flex-grow"></div>

                          {/* Price & Actions - Always at bottom */}
                          <div className="pt-3 border-t border-white/10 mt-auto">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <p className="text-yellow-400 text-xl font-bold leading-none">
                                  ₹
                                  {(() => {
                                    const baseFee = parseInt(
                                      lawyer.consultation_fee_formatted
                                        .replace(/[₹,]/g, "")
                                        .split("/")[0]
                                        .trim(),
                                    );
                                    const perMinuteRate = Math.round(
                                      baseFee / 30,
                                    );
                                    const roundedRate =
                                      perMinuteRate < 90
                                        ? 88
                                        : perMinuteRate < 95
                                          ? 90
                                          : perMinuteRate < 100
                                            ? 95
                                            : perMinuteRate < 105
                                              ? 102
                                              : Math.round(perMinuteRate / 5) *
                                                5;
                                    return roundedRate;
                                  })()}
                                  /min
                                </p>
                                <p className="text-xs text-white/40 mt-0.5">
                                  consultation fee
                                </p>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <button
                              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 border border-yellow-300/30 hover:border-yellow-300/50 transition-all duration-300 shadow-lg shadow-yellow-400/30 hover:shadow-xl hover:shadow-yellow-400/50 hover:scale-[1.02] active:scale-[0.98] group/btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCallRequest(lawyer, "call");
                              }}
                              title="Book Consultation"
                            >
                              <Calendar className="w-3.5 h-3.5 text-black group-hover/btn:scale-110 transition-transform" />
                              <span className="text-black text-xs font-bold tracking-wide">
                                CONSULT NOW
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* No Results */}
            {!loading && filteredLawyers.length === 0 && (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-400/10 rounded-full mb-6">
                  <Search className="w-10 h-10 text-yellow-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  No lawyers found
                </h3>
                <p className="text-white/60 text-lg mb-8">
                  Try adjusting your filters or search criteria
                </p>
                <Button
                  onClick={() =>
                    setFilters({
                      priceRange: [0, 10000],
                      locations: [],
                      caseTypes: [],
                      minExperience: 0,
                      minRating: 0,
                      minSuccessRate: 0,
                      languages: [],
                      sortBy: "rating",
                      availability: "all",
                      verified: false,
                    })
                  }
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold px-8 py-3 rounded-xl shadow-lg"
                >
                  Reset All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Consultation Request Modal */}
      {isBookingOpen && selectedLawyer && bookingType && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          {/* Animated Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

          <div className="relative bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-900/95 border border-yellow-400/20 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-[0_0_100px_rgba(250,204,21,0.15)] backdrop-blur-2xl animate-in slide-in-from-bottom-8 duration-500">
            {/* Premium Glow Effects */}
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

            {/* Close Button */}
            <button
              onClick={() => {
                setIsBookingOpen(false);
                setSelectedLawyer(null);
                setBookingType(null);
              }}
              className="absolute right-6 top-6 z-20 w-10 h-10 rounded-full bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 flex items-center justify-center transition-all duration-300 group hover:scale-110 hover:rotate-90"
            >
              <X className="w-5 h-5 text-white/60 group-hover:text-red-400 transition-colors" />
            </button>

            {/* Scrollable Content */}
            <div className="relative overflow-y-auto max-h-[92vh] custom-scrollbar">
              {/* Header - No Avatar */}
              <div className="relative p-8 pb-6 border-b border-yellow-400/10">
                <div className="flex items-start justify-between">
                  {/* Lawyer Info */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                      {selectedLawyer.name
                        .split(" ")
                        .map((part) => {
                          if (part.length <= 2) return part;
                          return (
                            part.substring(0, 2) +
                            "*".repeat(Math.min(part.length - 3, 2)) +
                            part[part.length - 1]
                          );
                        })
                        .join(" ")}
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/30">
                        Expert
                      </span>
                      {(() => {
                        const lawyer = allLawyers.find(
                          (l) => l.id === selectedLawyer.id,
                        );
                        return (
                          lawyer?.verified && (
                            <div className="bg-green-500/20 rounded-full p-1.5 border border-green-500/40">
                              <svg
                                className="w-3 h-3 text-green-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )
                        );
                      })()}
                    </h2>
                    <p className="text-white/60 text-sm mb-3">
                      {selectedLawyer.specialization}
                    </p>

                    {/* Quick Stats */}
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-white font-semibold">
                          {selectedLawyer.rating}
                        </span>
                        <span className="text-white/40">
                          ({selectedLawyer.reviews})
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                        <Briefcase className="w-3.5 h-3.5 text-yellow-400" />
                        <span className="text-white/70">
                          {selectedLawyer.experience}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                        <MapPin className="w-3.5 h-3.5 text-yellow-400" />
                        <span className="text-white/70">
                          {selectedLawyer.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium Stats Grid - All Equal Dimensions */}
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {/* Languages */}
                  <div className="relative group h-auto sm:h-[110px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative h-full bg-white/[0.02] border border-white/10 rounded-xl p-4 hover:border-yellow-400/30 transition-all flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <MessageCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                          Languages
                        </span>
                      </div>
                      <p className="text-white font-semibold text-sm flex-1 flex items-center">
                        {(() => {
                          const lawyer = allLawyers.find(
                            (l) => l.id === selectedLawyer.id,
                          );
                          return lawyer?.languages?.join(", ") || "English";
                        })()}
                      </p>
                    </div>
                  </div>

                  {/* Cases Handled */}
                  <div className="relative group h-auto sm:h-[110px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative h-full bg-white/[0.02] border border-white/10 rounded-xl p-4 hover:border-green-400/30 transition-all flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-4 h-4 rounded bg-green-400/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-green-400 text-xs font-bold">
                            📋
                          </span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                          Cases
                        </span>
                      </div>
                      <p className="text-green-400 font-bold text-2xl flex-1 flex items-center">
                        {(() => {
                          const lawyer = allLawyers.find(
                            (l) => l.id === selectedLawyer.id,
                          );
                          return lawyer?.cases_handled || "N/A";
                        })()}
                      </p>
                    </div>
                  </div>

                  {/* Success Rate */}
                  <div className="relative group h-auto sm:h-[110px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative h-full bg-white/[0.02] border border-white/10 rounded-xl p-4 hover:border-green-400/30 transition-all flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-4 h-4 rounded bg-green-400/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-green-400 text-xs font-bold">
                            %
                          </span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                          Success
                        </span>
                      </div>
                      <p className="text-green-400 font-bold text-2xl flex-1 flex items-center">
                        {(() => {
                          const lawyer = allLawyers.find(
                            (l) => l.id === selectedLawyer.id,
                          );
                          return `${lawyer?.success_rate || 0}%`;
                        })()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form Section */}
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  {/* Case Description */}
                  <div className="relative">
                    <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                      <div className="w-7 h-7 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-400/30">
                        <span className="text-black text-sm">📝</span>
                      </div>
                      <span>Describe Your Legal Case</span>
                      <span className="ml-auto text-xs text-white/40 font-normal">
                        Required
                      </span>
                    </label>
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                      <Textarea
                        className="relative min-h-[140px] resize-none bg-black/40 border-2 border-white/10 focus:border-yellow-400/50 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-yellow-400/20 transition-all px-4 py-3"
                        placeholder="Please provide detailed information about your legal matter, including:&#10;• Nature of the issue&#10;• Timeline of events&#10;• Desired outcome&#10;• Any urgent concerns"
                        value={bookingFormData.caseDescription}
                        onChange={(e) =>
                          setBookingFormData({
                            ...bookingFormData,
                            caseDescription: e.target.value,
                          })
                        }
                        required
                      />
                      <div className="absolute bottom-3 right-3 text-xs text-white/30">
                        {bookingFormData.caseDescription.length} characters
                      </div>
                    </div>
                  </div>

                  {/* Date & Time Picker */}
                  <div className="relative">
                    <label className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                      <div className="w-7 h-7 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-400/30">
                        <Calendar className="w-4 h-4 text-black" />
                      </div>
                      <span>Preferred Consultation Time</span>
                      <span className="ml-auto text-xs text-white/40 font-normal">
                        Required
                      </span>
                    </label>
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                      <Input
                        type="datetime-local"
                        value={bookingFormData.preferredDateTime}
                        onChange={(e) =>
                          setBookingFormData({
                            ...bookingFormData,
                            preferredDateTime: e.target.value,
                          })
                        }
                        className="relative bg-black/40 border-2 border-white/10 focus:border-yellow-400/50 rounded-xl text-white focus:ring-2 focus:ring-yellow-400/20 transition-all h-14 text-base px-4 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                        min={new Date().toISOString().slice(0, 16)}
                        required
                      />
                    </div>
                  </div>

                  {/* Premium Pricing Card */}
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/30 via-yellow-500/30 to-yellow-600/30 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition duration-500"></div>
                    <div className="relative bg-gradient-to-br from-yellow-400/10 via-yellow-500/5 to-yellow-600/10 border-2 border-yellow-400/30 rounded-2xl p-6 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center">
                            <span className="text-2xl">💰</span>
                          </div>
                          <div>
                            <p className="text-white/50 text-xs font-semibold uppercase tracking-wider">
                              Consultation Fee
                            </p>
                            <p className="text-white/30 text-xs mt-0.5">
                              Pay per minute • Transparent pricing
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/30 rounded-xl p-4 border border-yellow-400/20">
                          <p className="text-white/40 text-xs mb-1">
                            Rate per minute
                          </p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-yellow-400 text-4xl font-bold">
                              ₹
                              {(() => {
                                const baseFee = parseInt(
                                  selectedLawyer.consultationFee
                                    .replace(/[₹,]/g, "")
                                    .split("/")[0]
                                    .trim(),
                                );
                                const perMinuteRate = Math.round(baseFee / 30);
                                const roundedRate =
                                  perMinuteRate < 90
                                    ? 88
                                    : perMinuteRate < 95
                                      ? 90
                                      : perMinuteRate < 100
                                        ? 95
                                        : perMinuteRate < 105
                                          ? 102
                                          : Math.round(perMinuteRate / 5) * 5;
                                return roundedRate;
                              })()}
                            </span>
                            <span className="text-white/50 text-sm">/min</span>
                          </div>
                        </div>

                        <div className="bg-black/30 rounded-xl p-4 border border-white/10">
                          <p className="text-white/40 text-xs mb-1">
                            Estimated (30 minutes)
                          </p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-white text-3xl font-bold">
                              ₹
                              {(() => {
                                const baseFee = parseInt(
                                  selectedLawyer.consultationFee
                                    .replace(/[₹,]/g, "")
                                    .split("/")[0]
                                    .trim(),
                                );
                                const perMinuteRate = Math.round(baseFee / 30);
                                const roundedRate =
                                  perMinuteRate < 90
                                    ? 88
                                    : perMinuteRate < 95
                                      ? 90
                                      : perMinuteRate < 100
                                        ? 95
                                        : perMinuteRate < 105
                                          ? 102
                                          : Math.round(perMinuteRate / 5) * 5;
                                return (roundedRate * 30).toLocaleString(
                                  "en-IN",
                                );
                              })()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-start gap-2 text-xs text-white/40 bg-black/20 rounded-lg p-3 border border-white/5">
                        <svg
                          className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>
                          Final fee calculated based on actual consultation
                          duration. Payment required before session begins.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-2">
                    <Button
                      type="submit"
                      className="flex-1 relative group bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-black font-bold text-base h-14 rounded-xl shadow-xl shadow-yellow-400/30 hover:shadow-2xl hover:shadow-yellow-400/50 transition-all duration-300 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                      <Calendar className="w-5 h-5 mr-2 relative z-10" />
                      <span className="relative z-10">
                        Book Consultation Now
                      </span>
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setIsBookingOpen(false);
                        setSelectedLawyer(null);
                        setBookingType(null);
                      }}
                      className="px-8 h-14 rounded-xl bg-white/5 hover:bg-white/10 border-2 border-white/10 hover:border-white/20 text-white transition-all duration-300"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lawyer Chat Interface */}
      {isChatOpen && selectedLawyer && (
        <LawyerChat
          isOpen={isChatOpen}
          onClose={() => {
            setIsChatOpen(false);
            setSelectedLawyer(null);
            setBookingType(null);
            setBookingFormData({
              fullName: "",
              phone: "",
              email: "",
              caseDescription: "",
              preferredDateTime: "",
            });
          }}
          lawyerName={selectedLawyer.name}
          lawyerSpecialization={selectedLawyer.specialization}
          initialRequest={{
            caseDescription: bookingFormData.caseDescription,
            preferredDateTime: bookingFormData.preferredDateTime,
          }}
          perMinuteRate={(() => {
            const baseFee = parseInt(
              selectedLawyer.consultationFee
                .replace(/[₹,]/g, "")
                .split("/")[0]
                .trim(),
            );
            const perMinuteRate = Math.round(baseFee / 30);
            return perMinuteRate < 90
              ? 88
              : perMinuteRate < 95
                ? 90
                : perMinuteRate < 100
                  ? 95
                  : perMinuteRate < 105
                    ? 102
                    : Math.round(perMinuteRate / 5) * 5;
          })()}
        />
      )}
    </div>
  );
};

export default ConsultPage
