import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Shell } from "@/components/shell";
import { ProgressProvider } from "@/components/progress-provider";
import "./globals.css";

const publicSans = localFont({ src: "./fonts/PublicSans.ttf", variable: "--font-public-sans", display: "swap", weight: "100 900" });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: { default: "Taiwan Factory Exam | Practice & Prep", template: "%s | Taiwan Factory Exam" },
  description: "Free, independent Taiwan factory worker exam practice. Build math, English, logic, abstract reasoning, and attention-to-detail skills with original questions and clear explanations.",
  applicationName: "Taiwan Factory Exam",
  openGraph: { type: "website", locale: "en_PH", siteName: "Taiwan Factory Exam", title: "Taiwan Factory Exam Practice & Preparation", description: "Original practice questions, timed mock exams, and clear explanations for Filipino applicants." },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f8f9f5" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-PH" className={publicSans.variable}><body><ProgressProvider><Shell>{children}</Shell></ProgressProvider></body></html>;
}
