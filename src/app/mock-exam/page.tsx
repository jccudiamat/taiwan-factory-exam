import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { QuizPlayer } from "@/components/quiz-player";
export const metadata: Metadata = pageMetadata("/mock-exam/", { title: "Free Taiwan Factory Worker Mock Exam", description: "Try a 100-question, 20-minute practice exam with five sections covering math, English, logic, abstract reasoning, and attention to detail. Aim for this site’s 90% passing mark; review original questions and explanations afterward." });
export default function MockExam() { return <QuizPlayer scope="mock"/>; }
