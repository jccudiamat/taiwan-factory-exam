import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookmarkCheck } from "lucide-react";
import { guides } from "@/lib/guides";
export function generateStaticParams() { return guides.map((g) => ({ slug: g.slug })); }
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const guide = guides.find((g) => g.slug === slug);
  return guide ? pageMetadata(`/guides/${slug}/`, { title: guide.title, description: guide.description }) : {};
}
export default async function Guide({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const guide = guides.find((g) => g.slug === slug); if (!guide) notFound();
  return <><Link href="/guides/" className="back-link"><ArrowLeft size={16} aria-hidden="true"/>All study guides</Link><article className="guide-article"><header><h1>{guide.title}</h1><div className="article-meta">{guide.topic}<span>·</span>{guide.minutes} min read</div><p className="lead">{guide.intro}</p></header><div className="article-body">{guide.sections.map((section) => <section key={section.title}><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{"example" in section ? <div className="worked-example">{section.example}</div> : null}</section>)}<div className="takeaway"><BookmarkCheck size={24} aria-hidden="true"/><p><strong>Exam preparation takeaway</strong>{guide.takeaway}</p></div></div><div className="article-cta"><h2>Practise these factory exam skills</h2><p>A few questions are a good place to start.</p><Link className="button" href={`/practice/${guide.practice}/`}>Try a practice session <ArrowRight size={17} aria-hidden="true"/></Link></div></article></>;
}
