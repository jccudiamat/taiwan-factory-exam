import type { Metadata } from "next";

/** Only emit production URLs when the owner has configured the real origin. */
export function pageMetadata(path: string, metadata: Metadata): Metadata {
  const origin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const url = origin ? `${origin}${path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}/`}` : undefined;
  const title = typeof metadata.title === "string" ? metadata.title : "Taiwan Factory Exam Practice & Preparation";
  return {
    ...metadata,
    ...(url ? { alternates: { canonical: url } } : {}),
    openGraph: { type: "website", locale: "en_PH", siteName: "Taiwan Factory Exam", title, description: metadata.description ?? undefined, ...(url ? { url } : {}) },
    twitter: { card: "summary", title, description: metadata.description ?? undefined },
  };
}
