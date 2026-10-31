import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export default function NotFound() { return <section className="empty-state"><h1>Exam preparation page not found</h1><p>The address may have changed. Your next practice session is still waiting.</p><Link href="/" className="button"><ArrowLeft size={17} aria-hidden="true"/>Back to your study desk</Link></section>; }
