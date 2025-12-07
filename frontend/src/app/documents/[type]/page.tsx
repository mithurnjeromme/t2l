"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SpotlightCard from "@/components/ui/SpotlightCard";

import { FileText, ClipboardCopy, Download, ArrowLeft } from "lucide-react";
import { S } from "@genkit-ai/googleai";

export default function DocumentCreatePage() {
  const params = useParams<{ type?: string }>();
  const router = useRouter();

  // detect doc from route
  const docRoute = (params?.type || "nda").toLowerCase();

  // NEW: IP AGREEMENT SUPPORT
  let docType = "NDA";
  if (docRoute === "mou") docType = "MOU";
  else if (docRoute === "ip-assignment") docType = "IP_Agreement";
  else if (docRoute === "offer-letter") docType = "Offer_Letter";

  const [generating, setGenerating] = useState(false);
  const [draft, setDraft] = useState("");

  const [formData, setFormData] = useState<Record<string, string>>({
    // NDA
    Name: "",
    Company: "",
    Date: "",
    Term: "",
    Jurisdiction: "",
    DisclosingParty: "",
    ReceivingParty: "",

    // MOU
    PartyA_Name: "",
    PartyB_Name: "",
    Purpose: "",

    // Shared
    UserScenario: "",
    language: "en",

	Position:"",
	Start_Date:"",
	Salary:"",
  });

  const languages: Record<string, string> = {
    en: "English",
    hi: "Hindi",
    es: "Spanish",
    fr: "French",
    de: "German",
    it: "Italian",
    pt: "Portuguese",
    ru: "Russian",
    ja: "Japanese",
    ko: "Korean",
    ar: "Arabic",
    zh: "Chinese",
  };

  /* ------------------ FIELD DEFINITIONS ------------------ */
  const fieldsForDoc = useMemo(() => {
    // OFFER LETTER
    if (docType === "Offer_Letter") {
      return [
        { key: "Name", label: "Name", type: "text" },
        { key: "Company", label: "Company", type: "text" },
        { key: "Position", label: "Position", type: "text" },
        { key: "Start_Date", label: "Start Date", type: "text" },
        { key: "Salary", label: "Salary", type: "text" },
        { key: "UserScenario", label: "Additional Scenario", type: "textarea" },
        { key: "language", label: "Language", type: "select" as const },
      ];
    }
    // NEW: IP AGREEMENT FIELDS
    if (docType === "IP_Agreement") {
      return [
        { key: "Name", label: "Name", type: "text" },
        { key: "Company", label: "Company", type: "text" },
        { key: "Date", label: "Date", type: "text" },
        { key: "Term", label: "Term", type: "text" },
        { key: "Jurisdiction", label: "Jurisdiction", type: "text" },
        { key: "UserScenario", label: "Scenario", type: "textarea" },
        { key: "language", label: "Language", type: "select" as const },
      ];
    }

    if (docType === "MOU") {
      return [
        { key: "PartyA_Name", label: "Party A Name", type: "text" },
        { key: "PartyB_Name", label: "Party B Name", type: "text" },
        { key: "Date", label: "Date", type: "text" },
        { key: "Purpose", label: "Purpose", type: "textarea" },
        { key: "Term", label: "Term", type: "text" },
        { key: "Jurisdiction", label: "Jurisdiction", type: "text" },
        { key: "UserScenario", label: "Additional Scenario", type: "textarea" },
        { key: "language", label: "Language", type: "select" as const },
      ];
    }

    // NDA
    return [
      { key: "Name", label: "Name", type: "text" },
      { key: "Company", label: "Company", type: "text" },
      { key: "Date", label: "Date", type: "text" },
      { key: "Term", label: "Term", type: "text" },
      { key: "Jurisdiction", label: "Jurisdiction", type: "text" },
      { key: "DisclosingParty", label: "Disclosing Party", type: "text" },
      { key: "ReceivingParty", label: "Receiving Party", type: "text" },
      { key: "UserScenario", label: "Additional Scenario", type: "textarea" },
      { key: "language", label: "Language", type: "select" as const },
    ];
  }, [docType]);

  /* ------------------ DOWNLOAD HANDLER ------------------ */
  async function downloadFile(url: string) {
    try {
      const fullUrl = "https://legal-doc-ai-7q8h.onrender.com" + url;
      const res = await fetch(fullUrl);
      if (!res.ok) throw new Error("Failed");

      const blob = await res.blob();
      const tempUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = tempUrl;

      const filename = url.split("/").pop() || `${docType}.docx`;
      a.download = filename;

      a.click();
      URL.revokeObjectURL(tempUrl);
    } catch (err) {
      console.error("Download error", err);
    }
  }

  /* ------------------ GENERATE DOCUMENT ------------------ */
  async function handleGenerate() {
  setGenerating(true);
  setDraft("Please wait… generating document"); // ⭐ SHOW LOADING MESSAGE

  try {
    const form = new FormData();
    form.append("doc_type", docType);
    form.append("language", formData.language || "en");

    let scenarioObject: Record<string, string> = {};

    // OFFER LETTER
    if (docType === "Offer_Letter") {
      scenarioObject = {
        Name: formData.Name,
        Company: formData.Company,
        Position: formData.Position,
        Start_Date: formData.Start_Date,
        Salary: formData.Salary,
        UserScenario: formData.UserScenario,
      };
    }
    // IP AGREEMENT
    else if (docType === "IP_Agreement") {
      scenarioObject = {
        Name: formData.Name,
        Company: formData.Company,
        Date: formData.Date,
        Term: formData.Term,
        Jurisdiction: formData.Jurisdiction,
        UserScenario: formData.UserScenario,
      };
    }
    // MOU
    else if (docType === "MOU") {
      scenarioObject = {
        PartyA_Name: formData.PartyA_Name,
        PartyB_Name: formData.PartyB_Name,
        Date: formData.Date,
        Purpose: formData.Purpose,
        Term: formData.Term,
        Jurisdiction: formData.Jurisdiction,
        UserScenario: formData.UserScenario,
      };
    }
    // NDA
    else {
      scenarioObject = {
        Name: formData.Name,
        Company: formData.Company,
        Date: formData.Date,
        Term: formData.Term,
        Jurisdiction: formData.Jurisdiction,
        DisclosingParty: formData.DisclosingParty,
        ReceivingParty: formData.ReceivingParty,
        UserScenario: formData.UserScenario,
      };
    }

    form.append("scenario", JSON.stringify(scenarioObject));

    const res = await fetch(
      "https://legal-doc-ai-7q8h.onrender.com/api/v1/documents/generate",
      { method: "POST", body: form }
    );

    const json = await res.json();

    if (json.download_url) {
      setDraft(
        ` ${docType.replace("_", " ")} Generated Successfully!\n\nDownload Link:\n${json.download_url}`
      );

      // Auto-download
      downloadFile(json.download_url);
    } else {
      setDraft("Failed to generate document");
    }
  } catch (err) {
    console.error(err);
    setDraft("❌ Error generating document");
  }

  setGenerating(false);
}

  /* ------------------ COPY + TXT ------------------ */
  

  /* ------------------ RENDER INPUT FIELD ------------------ */
  function renderField(field: any, idx: number) {
    const key = field.key;
    const value = formData[key] ?? "";

    if (field.type === "textarea") {
      return (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.04 }}
          className="grid gap-1.5 sm:gap-2"
        >
          <Label className="text-sm sm:text-base">{field.label}</Label>
          <Textarea
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [key]: e.target.value })
            }
            className="rounded-xl min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
          />
        </motion.div>
      );
    }

    if (field.type === "select") {
      return (
        <div key={key} className="grid gap-1.5 sm:gap-2">
          <Label className="text-sm sm:text-base">{field.label}</Label>
          <select
            className="h-10 sm:h-11 rounded-xl border bg-background px-3 text-sm sm:text-base active:scale-[0.98] transition-transform"
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [key]: e.target.value })
            }
          >
            {Object.entries(languages).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.04 }}
        className="grid gap-1.5 sm:gap-2"
      >
        <Label className="text-sm sm:text-base">{field.label}</Label>
        <Input
          value={value}
          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
          className="h-10 sm:h-11 rounded-xl text-sm sm:text-base"
        />
      </motion.div>
    );
  }

  /* ------------------ RENDER UI ------------------ */
  return (
    <section className="relative min-h-screen">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-background to-background" />
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-4 sm:mb-6">
          <Button variant="ghost" asChild className="active:scale-95 transition-transform">
            <a href="/documents" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> 
              <span className="hidden sm:inline">Back to Document Types</span>
              <span className="sm:hidden">Back</span>
            </a>
          </Button>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4 sm:mb-6">
          {docType.replace("_", " ")} Generator
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
          {/* LEFT FORM */}
          <SpotlightCard className="p-4 sm:p-5 rounded-xl sm:rounded-2xl">
            <div className="space-y-3 sm:space-y-4">
              {fieldsForDoc.map((field, idx) => renderField(field, idx))}
            </div>

            <Button
              className="w-full h-11 sm:h-12 mt-4 sm:mt-6 rounded-xl active:scale-95 transition-transform text-sm sm:text-base"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating
                ? "Generating..."
                : `Generate ${docType.replace("_", " ")}`}
            </Button>
          </SpotlightCard>

          {/* RIGHT PREVIEW */}
          <SpotlightCard className="p-4 sm:p-5 rounded-xl sm:rounded-2xl col-span-1 lg:col-span-2">
           
             

              

            {draft ? (
              <pre className="min-h-[240px] sm:min-h-[320px] whitespace-pre-wrap text-xs sm:text-sm bg-muted/30 p-3 sm:p-5 rounded-md leading-relaxed overflow-x-auto">
                {draft}
              </pre>
            ) : (
              <div className="min-h-[240px] sm:min-h-[320px] grid place-items-center text-muted-foreground border border-dashed rounded-md">
                <div className="text-center px-4">
                  <FileText className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2" />
                  <p className="text-sm sm:text-base">Your generated document will appear here.</p>
                </div>
              </div>
            )}
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}
