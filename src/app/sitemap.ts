import type { MetadataRoute } from "next";
import { topics } from "@/lib/questions";
import { guides } from "@/lib/guides";
import { lessons } from "@/lib/lessons";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (!origin) return [];
  return ["", "/practice", "/practice/mixed", "/mock-exam", "/learn", "/preparation", "/preparation/interview", "/color-vision", "/guides", "/about", "/privacy", "/terms", ...lessons.flatMap((l) => [`/learn/${l.slug}`, ...l.sections.map(s => `/learn/${l.slug}/${s.id}`), `/learn/${l.slug}/final-assessment`]), ...topics.map((t) => `/practice/${t.id}`), ...guides.map((g) => `/guides/${g.slug}`)].map((path) => ({ url: `${origin}${path}/` }));
}
