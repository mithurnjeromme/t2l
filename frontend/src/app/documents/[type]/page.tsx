"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SpotlightCard from "@/components/ui/SpotlightCard";

import { FileText, ClipboardCopy, Download, ArrowLeft, Loader2 } from "lucide-react";

export default function NDAGeneratorPage() {
	const params = useParams<{ type: string }>();
	const router = useRouter();

	/** ---------------- FORM STATE ---------------- */
	const [generating, setGenerating] = useState(false);
	const [draft, setDraft] = useState("");

	const [formData, setFormData] = useState({
		Name: "",
		Company: "",
		Date: "",
		Term: "",
		Jurisdiction: "",
		DisclosingParty: "",
		ReceivingParty: "",
		UserScenario: "",
		language: "en",
	});

	const languages = {
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

	/** ---------------- AUTO DOWNLOAD ---------------- */
	async function downloadFile(url: string) {
		try {
			const fullUrl = "http://localhost:8000" + url;
			const res = await fetch(fullUrl);
			const blob = await res.blob();

			const tempUrl = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = tempUrl;
			a.download = "Generated_NDA.docx";

			document.body.appendChild(a);
			a.click();
			a.remove();

			URL.revokeObjectURL(tempUrl);
		} catch (err) {
			console.error("Download failed", err);
		}
	}

	/** ---------------- GENERATE DOCUMENT ---------------- */
	async function handleGenerate() {
		setGenerating(true);

		try {
			const form = new FormData();
			form.append("doc_type", "NDA");
			form.append("language", formData.language);
			form.append("scenario", JSON.stringify(formData));

			const res = await fetch("http://localhost:8000/api/v1/documents/generate", {
				method: "POST",
				body: form,
			});

			const json = await res.json();

			if (json.download_url) {
				setDraft(
					`NDA Generated Successfully.\n\nDownload URL:\n${json.download_url}\n\nMetadata:\n${JSON.stringify(
						json.metadata,
						null,
						2
					)}`
				);

				downloadFile(json.download_url);
			} else {
				setDraft("Failed to generate NDA.");
			}
		} catch (error) {
			setDraft("Error generating document.");
		} finally {
			setGenerating(false);
		}
	}

	/** ---------------- COPY + DOWNLOAD TXT ---------------- */
	function handleCopy() {
		if (draft) navigator.clipboard.writeText(draft);
	}

	function handleDownloadTxt() {
		if (!draft) return;

		const blob = new Blob([draft], { type: "text/plain" });
		const url = URL.createObjectURL(blob);

		const a = document.createElement("a");
		a.href = url;
		a.download = "NDA_Preview.txt";
		a.click();

		URL.revokeObjectURL(url);
	}

	/** ---------------- UI ---------------- */
	return (
		<section className="relative min-h-screen">
			<div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-background to-background" />

			<div className="container mx-auto px-6 py-12 md:py-16">
				{/* BACK BUTTON */}
				<div className="mb-6">
					<Button variant="ghost" asChild>
						<a href="/documents" className="inline-flex items-center gap-2">
							<ArrowLeft className="h-4 w-4" /> Back to Document Types
						</a>
					</Button>
				</div>

				{/* HEADER */}
				<div className="mb-8">
					<h1 className="text-3xl md:text-4xl font-headline font-semibold tracking-tight">
						NDA Generator
					</h1>
					<p className="text-muted-foreground mt-2 max-w-2xl">
						Fill in details and generate a professional NDA instantly.
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* ---------------- LEFT FORM ---------------- */}
					<motion.div
						className="col-span-1"
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
					>
						<SpotlightCard className="rounded-2xl shadow-lg">
							<div className="pb-3">
								<div className="text-lg font-medium">Document Details</div>
								<p className="text-sm text-muted-foreground">
									Provide details; we format everything automatically.
								</p>
							</div>

							<div className="space-y-4">
								{Object.keys(formData).map((field, idx) => {
									if (field === "UserScenario") {
										return (
											<motion.div
												key={field}
												initial={{ opacity: 0, y: 6 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: idx * 0.04 }}
												className="grid gap-2"
											>
												<Label>Additional Scenario</Label>
												<Textarea
													value={formData.UserScenario}
													onChange={(e) =>
														setFormData({ ...formData, UserScenario: e.target.value })
													}
													className="rounded-xl"
												/>
											</motion.div>
										);
									}

									if (field === "language") {
										return (
											<div key={field} className="grid gap-2">
												<Label>Language</Label>

												<select
													className="h-11 rounded-xl border bg-background px-3"
													value={formData.language}
													onChange={(e) =>
														setFormData({ ...formData, language: e.target.value })
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
											key={field}
											initial={{ opacity: 0, y: 6 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: idx * 0.04 }}
											className="grid gap-2"
										>
											<Label>{field}</Label>
											<Input
												className="h-11 rounded-xl"
												value={(formData as any)[field]}
												onChange={(e) =>
													setFormData({ ...formData, [field]: e.target.value })
												}
											/>
										</motion.div>
									);
								})}

								<Button
									className="w-full h-11 rounded-xl"
									onClick={handleGenerate}
									disabled={generating}
								>
									{generating ? <Loader2 className="animate-spin" /> : "Generate NDA"}
								</Button>
							</div>
						</SpotlightCard>
					</motion.div>

					{/* ---------------- RIGHT PREVIEW ---------------- */}
					<motion.div
						className="col-span-1 lg:col-span-2"
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
					>
						<SpotlightCard className="rounded-2xl shadow-lg overflow-hidden">
							<div className="pb-3 flex items-center gap-2 text-lg font-medium">
								<FileText className="h-5 w-5 text-primary" />
								Preview
							</div>

							{/* ACTION BUTTONS */}
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

							{/* PREVIEW AREA */}
							<AnimatePresence>
								{draft ? (
									<motion.pre
										className="min-h-[320px] whitespace-pre-wrap text-sm bg-muted/30 p-5 rounded-md leading-6"
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
									>
										{draft}
									</motion.pre>
								) : (
									<motion.div
										className="min-h-[320px] grid place-items-center rounded-md border border-dashed text-center p-8 text-muted-foreground"
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
									>
										<div className="flex flex-col items-center gap-2">
											<FileText className="h-8 w-8 text-muted-foreground" />
											<p>Your generated NDA will appear here.</p>
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
