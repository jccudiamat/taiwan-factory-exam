import {PageHeader} from "@/components/page-header";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { guides } from "@/lib/guides";
export const metadata: Metadata = pageMetadata("/guides/", { title: "Study Guides for Taiwan Factory Exam Practice", description: "Clear, practical guides to math, reading instructions, checking details, and building a manageable exam-preparation routine." });
export default function GuidesPage() {
  return <><PageHeader path="/guides/" className="page-heading"><h1>Taiwan Factory Exam Study Guides</h1><p>Study factory exam math, workplace English, visual checking, and preparation routines for Taiwan factory-job assessments.</p></PageHeader><div className="guide-index">{guides.map((guide) => <Link href={`/guides/${guide.slug}/`} className="guide-index-row" key={guide.slug}><span className={`guide-book ${guide.color}`}><BookOpen size={32} strokeWidth={1.3} aria-hidden="true"/></span><div><h2>{guide.title}</h2><p>{guide.description}</p><span className="reading-time">{guide.topic} · {guide.minutes} min read</span></div><ArrowUpRight size={22} aria-hidden="true"/></Link>)}</div><p className="section-note">Original learning material for foundational skills. Always follow the instructions given by your actual assessment organizer.</p></>;
}
