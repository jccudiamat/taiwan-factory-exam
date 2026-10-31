import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { ProgressDashboard } from "@/components/progress-dashboard";
export const metadata: Metadata = pageMetadata("/progress/", { title: "My Practice Progress", robots: { index: false, follow: true } });
export default function ProgressPage() { return <ProgressDashboard/>; }
