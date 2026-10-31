import { Calculator, Languages, Shapes, ScanLine, Puzzle } from "lucide-react";
import Image from "next/image";
import type { TopicId } from "@/lib/questions";

const icons = { math: Calculator, english: Languages, reasoning: Shapes, abstract: Puzzle, detail: ScanLine };
export function TopicIcon({ topic, size = 22 }: { topic: TopicId; size?: number }) {
  const Icon = icons[topic];
  return <Icon size={size} strokeWidth={1.7} aria-hidden="true" />;
}
export function BrandMark() {
  return <Image src="/brand/taiwan-philippines-crossed-flags.png" className="brand-mark" width={56} height={56} alt="" unoptimized />;
}
