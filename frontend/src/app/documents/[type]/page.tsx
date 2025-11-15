"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SpotlightCard from "@/components/ui/SpotlightCard";

import {
	FileText,
	ClipboardCopy,
	Download,
	ArrowLeft,
	Loader2,
} from "lucide-react";

/**
 * This page supports both NDA and MOU:
 * - Route /documents/nda  -> NDA form
 * - Route /documents/mou  -> MOU form
 *
 * Scenario is sent as JSON string in the `scenario` form field (Option A).
 */

export default function DocumentCreatePage() {
	const params = useParams<{ type?: string }>();
	const router = useRouter();

	// derive document type from route param, default to 'nda'
	const docRoute = (params?.type || "nda").toLowerCase();
	const docType = docRoute === "mou" ? "MOU" : "NDA"; // only support NDA or MOU here

	/** ---------------- form state (contains keys for both NDA & MOU) ---------------- */
	const [generating, setGenerating] = useState(false);
	const [draft, setDraft] = useState("");

	const [formData, setFormData] = useState<Record<string, string>>({
		// NDA fields
		Name: "",
		Company: "",
		Date: "",
		Term: "",
		Jurisdiction: "",
		DisclosingParty: "",
		ReceivingParty: "",
		// MOU fields (overlap Name fields optionally)
		PartyA_Name: "",
		PartyB_Name: "",
		Purpose: "",
		// Shared
		UserScenario: "",
		language: "en",
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

	/** ---------------- field definitions per doc type ---------------- */
	const fieldsForDoc = useMemo(() => {
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

	/** ---------------- auto-download helper ---------------- */
	async function downloadFile(url: string) {
		try {
			const fullUrl = "http://localhost:8000" + url;
			const res = await fetch(fullUrl);
			if (!res.ok) throw new Error("Failed to fetch file");
			const blob = await res.blob();

			const tempUrl = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = tempUrl;
			// try to derive a filename from url else fallback
			const filename = url.split("/").pop() || `${docType}_document.docx`;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(tempUrl);
		} catch (err) {
			console.error("Download failed", err);
		}
	}

	/** ---------------- generate (NDA / MOU) ----------------
	 * We send doc_type (NDA/MOU), language and scenario (JSON-string) as FormData
	 */
	async function handleGenerate() {
		setGenerating(true);
		try {
			const form = new FormData();
			form.append("doc_type", docType);
			form.append("language", String(formData.language || "en"));

			// prepare scenario object based on doc type
			let scenarioObject: Record<string, string> = {};

			if (docType === "MOU") {
				scenarioObject = {
					PartyA_Name: formData.PartyA_Name || "",
					PartyB_Name: formData.PartyB_Name || "",
					Date: formData.Date || "",
					Purpose: formData.Purpose || formData.UserScenario || "",
					Term: formData.Term || "",
					Jurisdiction: formData.Jurisdiction || "",
					UserScenario: formData.UserScenario || "",
				};
			} else {
				// NDA
				scenarioObject = {
					Name: formData.Name || "",
					Company: formData.Company || "",
					Date: formData.Date || "",
					Term: formData.Term || "",
					Jurisdiction: formData.Jurisdiction || "",
					DisclosingParty: formData.DisclosingParty || "",
					ReceivingParty: formData.ReceivingParty || "",
					UserScenario: formData.UserScenario || "",
				};
			}

			form.append("scenario", JSON.stringify(scenarioObject));

			const res = await fetch("http://localhost:8000/api/v1/documents/generate", {
				method: "POST",
				body: form,
			});

			const json = await res.json();

			if (json.download_url) {
				// Set draft preview to metadata + info (keeps UI consistent)
				setDraft(
					`${docType} Generated Successfully.\n\nDownload URL:\n${json.download_url}\n\nMetadata:\n${JSON.stringify(
						json.metadata,
						null,
						2
					)}`
				);

				// start automatic download
				downloadFile(json.download_url);
			} else {
				setDraft(`Failed to generate ${docType}.`);
			}
		} catch (err) {
			console.error(err);
			setDraft("Error generating document.");
		} finally {
			setGenerating(false);
		}
	}

	/** ---------------- copy + download text helpers ---------------- */
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

	/** ---------------- small utility to render each input ---------------- */
	function renderField(field: { key: string; label: string; type: string }, idx: number) {
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
					<Label htmlFor={key}>{field.label}</Label>
					<Textarea
						id={key}
						value={value}
						onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
						className="rounded-xl"
					/>
				</motion.div>
			);
		}

		if (field.type === "select") {
			return (
				<div key={key} className="grid gap-2">
					<Label htmlFor={key}>{field.label}</Label>
					<select
						id={key}
						className="h-11 rounded-xl border bg-background px-3"
						value={value}
						onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
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

		// default: text input
		return (
			<motion.div
				key={key}
				initial={{ opacity: 0, y: 6 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: idx * 0.04 }}
				className="grid gap-2"
			>
				<Label htmlFor={key}>{field.label}</Label>
				<Input
					id={key}
					className="h-11 rounded-xl"
					value={value}
					onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
				/>
			</motion.div>
		);
	}

	/** ---------------- render ---------------- */
	return (
		<section className="relative min-h-screen">
			<div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-background to-background" />
			<div className="container mx-auto px-6 py-12 md:py-16">
				{/* back button */}
				<div className="mb-6">
					<Button variant="ghost" asChild>
						<a href="/documents" className="inline-flex items-center gap-2">
							<ArrowLeft className="h-4 w-4" />
							Back to Document Types
						</a>
					</Button>
				</div>

				{/* header */}
				<div className="mb-8">
					<h1 className="text-3xl md:text-4xl font-headline font-semibold tracking-tight">
						{docType === "MOU" ? "MOU Generator" : "NDA Generator"}
					</h1>
					<p className="text-muted-foreground mt-2 max-w-2xl">
						Fill details and generate a professional {docType} draft instantly.
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* left form */}
					<motion.div className="col-span-1" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
						<SpotlightCard className="rounded-2xl shadow-lg">
							<div className="pb-3">
								<div className="text-lg font-medium">Document Details</div>
								<p className="text-sm text-muted-foreground">Provide the necessary fields; we’ll format the draft cleanly.</p>
							</div>

							<div className="space-y-4">
								{fieldsForDoc.map((f, idx) => renderField(f as any, idx))}

								<div className="pt-2">
									<Button className="w-full h-11 rounded-xl" onClick={handleGenerate} disabled={generating}>
										{generating ? "Generating..." : `Generate ${docType}`}
									</Button>
								</div>
							</div>
						</SpotlightCard>
					</motion.div>

					{/* right preview */}
					<motion.div className="col-span-1 lg:col-span-2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
						<SpotlightCard className="rounded-2xl shadow-lg overflow-hidden">
							<div className="pb-3 flex items-center gap-2 text-lg font-medium">
								<FileText className="h-5 w-5 text-primary" />
								Preview
							</div>

							<div className="mb-3 sticky top-0 -mx-5 px-5 py-3 bg-background/60 backdrop-blur border-b">
								<div className="flex items-center gap-2">
									<Button variant="secondary" onClick={handleCopy} disabled={!draft} className="gap-2 rounded-xl h-10">
										<ClipboardCopy className="h-4 w-4" /> Copy
									</Button>
									<Button onClick={handleDownloadTxt} disabled={!draft} className="gap-2 rounded-xl h-10">
										<Download className="h-4 w-4" /> Download .txt
									</Button>
								</div>
							</div>

							<AnimatePresence>
								{draft ? (
									<motion.pre
										key="draft"
										className="min-h-[320px] whitespace-pre-wrap text-sm bg-muted/30 p-5 rounded-md leading-6"
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
									>
										{draft}
									</motion.pre>
								) : (
									<motion.div
										key="empty"
										className="min-h-[320px] grid place-items-center rounded-md border border-dashed text-center p-8 text-muted-foreground"
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
									>
										<div className="flex flex-col items-center gap-2">
											<FileText className="h-8 w-8 text-muted-foreground" />
											<p>Your generated document will appear here.</p>
											<p className="text-xs">Fill the form and click Generate.</p>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</SpotlightCard>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
