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
      const fullUrl = "http://localhost:8000" + url;
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
      "http://localhost:8000/api/v1/documents/generate",
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
  function handleCopy() {
    if (draft) navigator.clipboard.writeText(draft);
  }

  function handleDownloadTxt() {
    if (!draft) return;
    const blob = new Blob([draft], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${docType}_Preview.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

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
          className="grid gap-2"
        >
          <Label>{field.label}</Label>
          <Textarea
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [key]: e.target.value })
            }
            className="rounded-xl"
          />
        </motion.div>
      );
    }

    if (field.type === "select") {
      return (
        <div key={key} className="grid gap-2">
          <Label>{field.label}</Label>
          <select
            className="h-11 rounded-xl border bg-background px-3"
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
        className="grid gap-2"
      >
        <Label>{field.label}</Label>
        <Input
          value={value}
          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
          className="h-11 rounded-xl"
        />
      </motion.div>
    );
  }

  /* ------------------ RENDER UI ------------------ */
  return (
    <section className="relative min-h-screen">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-background to-background" />
      <div className="container mx-auto px-6 py-12">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <a href="/documents">
              <ArrowLeft className="h-4 w-4" /> Back to Document Types
            </a>
          </Button>
        </div>

        <h1 className="text-3xl font-semibold">
          {docType.replace("_", " ")} Generator
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* LEFT FORM */}
          <SpotlightCard className="p-5 rounded-2xl">
            {fieldsForDoc.map((field, idx) => renderField(field, idx))}

            <Button
              className="w-full h-11 mt-4 rounded-xl"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating
                ? "Generating..."
                : `Generate ${docType.replace("_", " ")}`}
            </Button>
          </SpotlightCard>

          {/* RIGHT PREVIEW */}
          <SpotlightCard className="p-5 rounded-2xl col-span-1 lg:col-span-2">
            <div className="flex items-center gap-2 mb-3 sticky top-0 bg-background/60 p-3 backdrop-blur border-b -mx-5 px-5">
              <Button
                variant="secondary"
                disabled={!draft}
                onClick={handleCopy}
                className="gap-2 rounded-xl h-10"
              >
                <ClipboardCopy className="h-4 w-4" /> Copy
              </Button>

              <Button
                disabled={!draft}
                onClick={handleDownloadTxt}
                className="gap-2 rounded-xl h-10"
              >
                <Download className="h-4 w-4" /> Download TXT
              </Button>
            </div>

            {draft ? (
              <pre className="min-h-[320px] whitespace-pre-wrap text-sm bg-muted/30 p-5 rounded-md leading-6">
                {draft}
              </pre>
            ) : (
              <div className="min-h-[320px] grid place-items-center text-muted-foreground border border-dashed rounded-md">
                <div className="text-center">
                  <FileText className="h-8 w-8 mx-auto mb-2" />
                  <p>Your generated document will appear here.</p>
                </div>
              </div>
            )}
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}
