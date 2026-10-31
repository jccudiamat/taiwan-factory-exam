import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { SavedQuestions } from "@/components/progress-dashboard";
export const metadata: Metadata = pageMetadata("/saved/", { title: "Saved Questions", robots: { index: false, follow: true } });
export default function SavedPage() { return <SavedQuestions/>; }
