"use client";

import React, { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FileText, ClipboardCopy, Download, ArrowLeft } from "lucide-react";
import { useDocumentsStore } from "@/hooks/use-documents-store";
import { DocumentType, slugToDocumentType } from "@/lib/documents";
import SpotlightCard from "@/components/ui/SpotlightCard";

type Field =
	| { key: string; label: string; type: "text"; placeholder?: string }
	| { key: string; label: string; type: "textarea"; placeholder?: string }
	| { key: string; label: string; type: "array"; placeholder?: string }
	| { key: string; label: string; type: "number"; placeholder?: string; min?: number; max?: number; step?: number }
	| { key: string; label: string; type: "date" }
	| { key: string; label: string; type: "time" };

const typeToFields: Record<DocumentType, Field[]> = {
	[DocumentType.MOM]: [
		{ key: "meetingTitle", label: "Meeting Title", type: "text" },
		{ key: "meetingDate", label: "Meeting Date", type: "date" },
		{ key: "meetingTime", label: "Meeting Time", type: "time" },
		{ key: "location", label: "Location", type: "text" },
		{ key: "attendees", label: "Attendees (comma separated)", type: "array", placeholder: "Name1, Name2" },
		{ key: "agendaPoints", label: "Agenda Points (comma separated)", type: "array", placeholder: "Point1, Point2" },
		{ key: "notes", label: "Notes", type: "textarea" },
		{ key: "preparedBy", label: "Prepared By", type: "text" },
		{ key: "actionItems", label: "Action Items (optional)", type: "textarea", placeholder: "task|owner|dueDate per line" },
	],
	[DocumentType.NDA]: [
		{ key: "disclosingParty", label: "Disclosing Party", type: "text" },
		{ key: "receivingParty", label: "Receiving Party", type: "text" },
		{ key: "effectiveDate", label: "Effective Date", type: "date" },
		{ key: "termMonths", label: "Term (months)", type: "number", min: 1, step: 1 },
		{ key: "governingLaw", label: "Governing Law", type: "text" },
		{ key: "purpose", label: "Purpose", type: "textarea" },
	],
	[DocumentType.MOU]: [
		{ key: "partyA", label: "Party A", type: "text" },
		{ key: "partyB", label: "Party B", type: "text" },
		{ key: "effectiveDate", label: "Effective Date", type: "date" },
		{ key: "scope", label: "Scope", type: "textarea" },
		{ key: "responsibilitiesA", label: "Responsibilities of Party A", type: "textarea" },
		{ key: "responsibilitiesB", label: "Responsibilities of Party B", type: "textarea" },
		{ key: "termMonths", label: "Term (months)", type: "number", min: 1, step: 1 },
		{ key: "governingLaw", label: "Governing Law", type: "text" },
	],
	[DocumentType.IP_ASSIGNMENT]: [
		{ key: "assignor", label: "Assignor", type: "text" },
		{ key: "assignee", label: "Assignee", type: "text" },
		{ key: "effectiveDate", label: "Effective Date", type: "date" },
		{ key: "ipDescription", label: "IP Description", type: "textarea" },
		{ key: "consideration", label: "Consideration", type: "text" },
		{ key: "governingLaw", label: "Governing Law", type: "text" },
	],
	[DocumentType.OFFER_LETTER]: [
		{ key: "candidateName", label: "Candidate Name", type: "text" },
		{ key: "position", label: "Position", type: "text" },
		{ key: "joiningDate", label: "Joining Date", type: "date" },
		{ key: "CTC", label: "CTC", type: "text", placeholder: "e.g., ₹12,00,000" },
		{ key: "location", label: "Location", type: "text" },
		{ key: "reportingManager", label: "Reporting Manager", type: "text" },
		{ key: "companyName", label: "Company Name", type: "text" },
	],
};

function parseArrayInput(value: string): string[] {
	return value
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean);
}

function parseActionItems(value: string) {
	return value
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean)
		.map((line) => {
			const [task, owner, dueDate] = line.split("|").map((s) => s.trim());
			return { task, owner, dueDate };
		})
		.filter((x) => x.task && x.owner && x.dueDate);
}

export default function DocumentCreatePage(): JSX.Element {
	const params = useParams<{ type: string }>();
	const router = useRouter();
	const { selectedType, setType, formData, updateField, setDraft, draft, isGenerating, setGenerating } =
		useDocumentsStore();

	// Set the selected type from the dynamic route
	useEffect(() => {
		const t = slugToDocumentType(params.type);
		if (!t) {
			router.replace("/documents");
			return;
		}
		if (selectedType !== t) setType(t);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.type]);

	const fields = useMemo(() => (selectedType ? typeToFields[selectedType] : []), [selectedType]);

	async function handleGenerate(): Promise<void> {
		if (!selectedType) return;
		setGenerating(true);
		try {
			let data: Record<string, unknown> = { ...formData };
			if (selectedType === DocumentType.MOM) {
				data = {
					...data,
					attendees: parseArrayInput(String(formData["attendees"] || "")),
					agendaPoints: parseArrayInput(String(formData["agendaPoints"] || "")),
					actionItems: parseActionItems(String(formData["actionItems"] || "")),
					notes: String(formData["notes"] || ""),
				};
			}
			if (selectedType === DocumentType.NDA || selectedType === DocumentType.MOU) {
				const tm = Number(formData["termMonths"]);
				if (!Number.isNaN(tm)) data["termMonths"] = tm;
			}
			const res = await fetch("/api/documents/generate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ type: selectedType, data }),
			});
			const json = (await res.json()) as { ok: boolean; draft?: string; error?: string };
			if (json.ok && json.draft) {
				setDraft(json.draft);
			} else {
				setDraft(json.error ?? "Failed to generate");
			}
		} catch {
			setDraft("Failed to generate");
		} finally {
			setGenerating(false);
		}
	}

	function handleCopy(): void {
		if (!draft) return;
		void navigator.clipboard.writeText(draft);
	}

	function handleDownload(): void {
		if (!draft) return;
		const blob = new Blob([draft], { type: "text/plain;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = (selectedType ?? "document") + ".txt";
		document.body.appendChild(a);
		a.click();
		a.remove();
		URL.revokeObjectURL(url);
	}

	return (
		<section className="relative min-h-screen">
			<div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-background to-background" />
			<div className="container mx-auto px-6 py-12 md:py-16">
				<div className="mb-6">
					<Button variant="ghost" asChild>
						<a href="/documents" className="inline-flex items-center gap-2">
							<ArrowLeft className="h-4 w-4" />
							Back to Document Types
						</a>
					</Button>
				</div>
				<div className="mb-8">
					<h1 className="text-3xl md:text-4xl font-headline font-semibold tracking-tight">
						{selectedType ?? "Create Document"}
					</h1>
					<p className="text-muted-foreground mt-2 max-w-2xl">
						Fill in details and generate a professional first draft instantly.
					</p>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<motion.div className="col-span-1" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
						<SpotlightCard className="rounded-2xl shadow-lg">
							<div className="pb-3">
								<div className="text-lg font-medium">Document Details</div>
								<p className="text-sm text-muted-foreground">Provide the necessary fields; we’ll format the draft cleanly.</p>
							</div>
							<div className="space-y-4">
								{fields.map((f, idx) => (
									<motion.div key={f.key} className="grid gap-2" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 * idx }}>
										<Label htmlFor={f.key}>{f.label}</Label>
										{f.type === "text" && (
											<Input
												id={f.key}
												placeholder={f.placeholder}
												value={String((formData[f.key] as string) ?? "")}
												onChange={(e) => updateField(f.key, e.target.value)}
												className="h-11 rounded-xl"
											/>
										)}
										{f.type === "number" && (
											<Input
												id={f.key}
												type="number"
												placeholder={f.placeholder}
												min={f.min}
												max={f.max}
												step={f.step ?? 1}
												value={String((formData[f.key] as number | string) ?? "")}
												onChange={(e) => updateField(f.key, e.target.value)}
												className="h-11 rounded-xl"
											/>
										)}
										{f.type === "date" && (
											<Input
												id={f.key}
												type="date"
												value={String((formData[f.key] as string) ?? "")}
												onChange={(e) => updateField(f.key, e.target.value)}
												className="h-11 rounded-xl"
											/>
										)}
										{f.type === "time" && (
											<Input
												id={f.key}
												type="time"
												value={String((formData[f.key] as string) ?? "")}
												onChange={(e) => updateField(f.key, e.target.value)}
												className="h-11 rounded-xl"
											/>
										)}
										{f.type === "textarea" && (
											<Textarea
												id={f.key}
												placeholder={f.placeholder}
												value={String((formData[f.key] as string) ?? "")}
												onChange={(e) => updateField(f.key, e.target.value)}
												rows={4}
												className="rounded-xl"
											/>
										)}
										{f.type === "array" && (
											<Input
												id={f.key}
												placeholder={f.placeholder}
												value={String((formData[f.key] as string) ?? "")}
												onChange={(e) => updateField(f.key, e.target.value)}
												className="h-11 rounded-xl"
											/>
										)}
									</motion.div>
								))}
								<div className="pt-2">
									<Button className="w-full h-11 rounded-xl" onClick={handleGenerate} disabled={isGenerating}>
										{isGenerating ? "Generating..." : "Generate Draft"}
									</Button>
								</div>
							</div>
						</SpotlightCard>
					</motion.div>
					<motion.div className="col-span-1 lg:col-span-2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}>
						<SpotlightCard className="rounded-2xl shadow-lg overflow-hidden">
							<div className="pb-3">
								<div className="flex items-center gap-2 text-lg font-medium">
									<FileText className="h-5 w-5 text-primary" />
									Preview
								</div>
							</div>
							<div className="mb-3 sticky top-0 z-10 -mx-5 px-5 py-3 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40 border-b border-border/50">
								<div className="flex items-center gap-2">
									<Button variant="secondary" onClick={handleCopy} disabled={!draft} className="gap-2 rounded-xl h-10">
										<ClipboardCopy className="h-4 w-4" />
										Copy
									</Button>
									<Button onClick={handleDownload} disabled={!draft} className="gap-2 rounded-xl h-10">
										<Download className="h-4 w-4" />
										Download .txt
									</Button>
								</div>
							</div>
								<AnimatePresence mode="wait">
									{draft ? (
										<motion.pre
											key="draft"
											className="min-h-[320px] whitespace-pre-wrap text-sm bg-muted/30 p-5 rounded-md leading-6"
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -10 }}
											transition={{ duration: 0.35 }}
										>
											{draft}
										</motion.pre>
									) : (
										<motion.div
											key="empty"
											className="min-h-[320px] grid place-items-center rounded-md border border-dashed text-center p-8 text-muted-foreground"
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -10 }}
											transition={{ duration: 0.35 }}
										>
											<div className="flex flex-col items-center gap-2">
												<FileText className="h-8 w-8 text-muted-foreground" />
												<p className="text-sm">Your generated draft will appear here.</p>
												<p className="text-xs">Fill the form and click Generate to preview.</p>
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


