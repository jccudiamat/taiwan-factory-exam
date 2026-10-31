import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("/", { title: { absolute: "Taiwan Factory Exam | Practice & Prep" }, description: "Free Taiwan factory worker exam reviewer for Filipino applicants: math, English, logic, visual checking, worked solutions, preparation tips, and timed mock exams." });
import { StudyDesk } from "@/components/study-desk";
export default function Home() { return <StudyDesk/>; }
