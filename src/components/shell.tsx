"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Bookmark, ChartNoAxesColumnIncreasing, CircleHelp, ClipboardList, Eye, LibraryBig, Clock3, House, Menu, MessageSquare, PencilLine, X, HardDrive } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { BrandMark } from "./icons";
import { useProgress } from "./progress-provider";
import { PublicPageShare } from "./page-share";

const navigation = [
  { href: "/", label: "Study desk", icon: House },
  { href: "/learn/", label: "Lessons & solutions", icon: BookOpen },
  { href: "/practice/", label: "Practice by topic", icon: PencilLine },
  { href: "/mock-exam/", label: "Mock exam", icon: Clock3 },
  { href: "/saved/", label: "Saved questions", icon: Bookmark },
  { href: "/progress/", label: "My progress", icon: ChartNoAxesColumnIncreasing },
];

const resources = [
  { href: "/guides/", label: "Study guides", icon: LibraryBig },
  { href: "/preparation/", label: "Preparation & tips", icon: ClipboardList },
  { href: "/preparation/interview/", label: "Interview tips", icon: MessageSquare },
  { href: "/color-vision/", label: "Color-vision practice", icon: Eye },
  { href: "/about/", label: "About this project", icon: CircleHelp },
];

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [disclaimerDismissed, setDisclaimerDismissed] = useState(false);
  const main = useRef<HTMLElement>(null);
  const { data, ready, storageIssue } = useProgress();
  useEffect(() => {
    try {
      setDisclaimerDismissed(sessionStorage.getItem('taiwan-factory-exam:disclaimer:v1') === 'dismissed');
    } catch { /* Interface controls still work when browser storage is unavailable. */ }
  }, []);
  function dismissDisclaimer() {
    setDisclaimerDismissed(true);
    try { sessionStorage.setItem('taiwan-factory-exam:disclaimer:v1', 'dismissed'); } catch { /* Optional preference. */ }
    main.current?.focus({ preventScroll: true });
  }
  useEffect(() => { setMenuOpen(false); }, [pathname]);
  const currentPath = `${pathname}/`.replace(/\/+/g, "/");
  const active = (href: string) => href === "/" || href === "/preparation/" ? currentPath === href : currentPath.startsWith(href);
  return <div className="app-shell">
    <a href="#main" className="skip-link">Skip to content</a>
    <aside className="sidebar" id="site-sidebar">
      <div className="brand-row">
        <Link className="brand" href="/" aria-label="Taiwan Factory Exam, study desk"><BrandMark /><span className="brand-wordmark">Taiwan Factory<br/>Exam</span></Link>
        <button className="icon-button mobile-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="site-navigation" aria-label={menuOpen ? "Close navigation" : "Open navigation"}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
      <div className={`sidebar-content ${menuOpen ? "is-open" : ""}`} id="site-navigation">
        <nav aria-label="Main navigation" className="nav-list">{navigation.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={`nav-item ${active(href) ? "active" : ""}`} aria-current={active(href) ? "page" : undefined}><Icon size={19} strokeWidth={1.7} aria-hidden="true"/><span>{label}</span>{href === "/saved/" && ready && data.bookmarks.length > 0 ? <span className="nav-count">{data.bookmarks.length}</span> : null}</Link>)}</nav>
        <div className="nav-divider" />
        <nav aria-label="Resources" className="nav-list">{resources.map(({href,label,icon:Icon})=><Link key={href} href={href} className={`nav-item ${active(href)?"active":""}`} aria-current={active(href)?"page":undefined}><Icon size={19} strokeWidth={1.7} aria-hidden="true"/>{label}</Link>)}</nav>
        <div className="sidebar-bottom"><div className="local-status"><HardDrive size={14} aria-hidden="true"/><span>Progress on this device</span></div></div>
      </div>
    </aside>
    <div className="main-shell">
      {!disclaimerDismissed ? <header className="topbar">
        <section className="site-disclaimer" aria-label="Independent exam preparation disclaimer"><p><strong>Independent Taiwan factory exam preparation.</strong> We are not affiliated with any employer, recruitment agency, or government body. Written exam questions are original practice exercises, not official recruitment exams. Test formats and requirements vary; verify current details with your employer or licensed agency. Practice scores and readiness indicators do not guarantee passing or employment. Color-vision activities are not medical screening or diagnosis. <Link href="/about/">About this project</Link></p><button className="icon-button disclaimer-close" onClick={dismissDisclaimer} aria-label="Dismiss disclaimer"><X size={19} aria-hidden="true"/></button></section>
      </header> : null}
      {storageIssue ? <div className="storage-warning" role="status">Your browser isn’t saving progress. You can still practise, but keep this tab open. Allow site storage to save future changes.</div> : null}
      <main ref={main} id="main" className="main-content" tabIndex={-1}><PublicPageShare path={pathname}/>{children}</main>
      <footer className="footer"><p>Independent practice. No recruitment or employment guarantees.</p><div><Link href="/privacy/">Privacy</Link><Link href="/terms/">Terms</Link><span>Original exam preparation exercises.</span></div></footer>
    </div>
  </div>;
}
