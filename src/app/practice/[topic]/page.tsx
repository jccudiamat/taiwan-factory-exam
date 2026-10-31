import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuizPlayer } from "@/components/quiz-player";
import { topics, scopeTitle, type Scope } from "@/lib/questions";

const scopes = [...topics.map((t) => t.id), "mixed", "mistakes", "saved"];
export function generateStaticParams() { return scopes.map((topic) => ({ topic })); }
export const dynamicParams = false;
export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic } = await params;
  if (!scopes.includes(topic)) return {};
  return pageMetadata(`/practice/${topic}/`, { title: `${scopeTitle(topic as Scope)} Practice`, description: `Original ${scopeTitle(topic as Scope).toLowerCase()} exercises with answer explanations. Independent preparation for Taiwan factory-job applicants.`, ...(["saved", "mistakes"].includes(topic) ? { robots: { index: false, follow: true } } : {}) });
}
export default async function PracticeTopic({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  if (!scopes.includes(topic)) notFound();
  return <QuizPlayer scope={topic as Scope}/>;
}
