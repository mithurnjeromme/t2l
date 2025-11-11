"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { DocumentType, documentTypeToSlug } from "@/lib/documents";
import { Sparkles, Shield, Handshake, Copyright, BadgeCheck, FileText } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDocumentsStore } from "@/hooks/use-documents-store";
import ShinyText from "@/components/ui/ShinyText";
import SpotlightCard from "@/components/ui/SpotlightCard";

const typeCards: Array<{
	type: DocumentType;
	title: string;
	subtitle: string;
	icon: React.ReactNode;
	accentClass: string;
}> = [
	{
		type: DocumentType.MOM,
		title: "Memorandum of Meeting (MOM)",
		subtitle: "Create meeting minutes and action items",
		icon: <FileText className="h-5 w-5" />,
		accentClass: "from-primary/15 to-primary/5",
	},
	{
		type: DocumentType.NDA,
		title: "Non‑Disclosure Agreement (NDA)",
		subtitle: "Protect confidential information between parties",
		icon: <Shield className="h-5 w-5" />,
		accentClass: "from-yellow-400/15 to-yellow-400/5",
	},
	{
		type: DocumentType.MOU,
		title: "Memorandum of Understanding (MOU)",
		subtitle: "Outline cooperation and expectations",
		icon: <Handshake className="h-5 w-5" />,
		accentClass: "from-emerald-400/15 to-emerald-400/5",
	},
	{
		type: DocumentType.IP_ASSIGNMENT,
		title: "IP Assignment Agreement",
		subtitle: "Transfer ownership of intellectual property",
		icon: <Copyright className="h-5 w-5" />,
		accentClass: "from-sky-400/15 to-sky-400/5",
	},
	{
		type: DocumentType.OFFER_LETTER,
		title: "Offer Letter",
		subtitle: "Formalize a role, compensation, and start date",
		icon: <BadgeCheck className="h-5 w-5" />,
		accentClass: "from-pink-400/15 to-pink-400/5",
	},
];

function parseArrayInput(value: string): string[] {
	return value
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean);
}

function parseActionItems(value: string) {
	// expects lines like: task|owner|dueDate
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

export default function DocumentsPage(): JSX.Element {
	const { selectedType, setType, formData, updateField, setDraft, draft, isGenerating, setGenerating } =
		useDocumentsStore();
	const formRef = useRef<HTMLDivElement | null>(null);
	const params = useSearchParams();
	const router = useRouter();

	// Preselect type via ?type=nda etc.
	useEffect(() => {
		const t = (params.get("type") || "").toUpperCase();
		const values = Object.values(DocumentType);
		if (t && values.includes(t as DocumentType)) {
			if (!selectedType || selectedType !== (t as DocumentType)) {
				setType(t as DocumentType);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params]);

	function selectTypeAndScroll(t: DocumentType): void {
		setType(t);
		// Update URL for shareability
		const qs = new URLSearchParams(Array.from(params.entries()));
		qs.set("type", t.toLowerCase());
		router.replace(`/documents?${qs.toString()}`);
		// Smooth scroll
		setTimeout(() => {
			formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
		}, 50);
	}

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
			<motion.div
				aria-hidden
				className="pointer-events-none absolute -top-20 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.8, ease: "easeOut" }}
			/>
			<motion.div
				aria-hidden
				className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-secondary/10 blur-3xl"
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
			/>
			<div className="container mx-auto px-6 py-12 md:py-16 pb-24">
				<motion.div
					className="mb-8"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: "easeOut" }}
				>
					<motion.div
						className="inline-flex items-center gap-2 rounded-full border bg-background/60 backdrop-blur px-3 py-1 text-xs text-muted-foreground shadow-sm"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.1, duration: 0.4 }}
					>
						<Sparkles className="h-3.5 w-3.5 text-primary" />
						Pillar 2 · Document Drafting
					</motion.div>
					<motion.h1
						className="text-3xl md:text-4xl font-headline font-semibold mt-3 tracking-tight"
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.05, duration: 0.5 }}
					>
						<ShinyText text="Automated Document Drafting" speed={4.5} />
					</motion.h1>
					<motion.p
						className="text-muted-foreground mt-2 max-w-2xl"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.15, duration: 0.5 }}
					>
						Generate elegant, professional drafts for MOM, NDA, MOU, IP Assignment, and Offer Letters in minutes.
					</motion.p>
				</motion.div>
				<motion.div
					className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 auto-rows-fr gap-6"
					initial="hidden"
					animate="show"
					variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
				>
					{typeCards.map((card) => (
						<motion.div
							key={card.type}
							className="transition-all"
							whileHover={{ y: -2 }}
							whileTap={{ scale: 0.995 }}
							variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
						>
							<SpotlightCard className="group text-left h-full rounded-2xl shadow-lg hover:shadow-xl">
								<Link href={`/documents/${documentTypeToSlug(card.type)}`} className="block">
									<div
										className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-b ${card.accentClass} text-primary shadow-inner`}
									>
										{card.icon}
									</div>
									<div className="mt-3">
										<div className="text-base font-semibold">{card.title}</div>
										<div className="text-sm text-muted-foreground mt-1">{card.subtitle}</div>
									</div>
									<div className="mt-4">
										<span className="inline-flex items-center rounded-full bg-primary text-primary-foreground text-xs px-3 py-1 transition-colors group-hover:bg-primary/90">
											Create Document
										</span>
									</div>
								</Link>
							</SpotlightCard>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}


