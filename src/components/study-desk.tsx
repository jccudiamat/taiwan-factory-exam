"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2, Clock3, Leaf, ShieldCheck } from "lucide-react";
import { DailySamplesCard } from "./daily-samples";
import { PageShare } from "./page-share";
import { useProgress } from "./progress-provider";
import { TopicIcon } from "./icons";
import { questions, topics, scopeTitle } from "@/lib/questions";
import { mistakeIds, topicStats } from "@/lib/quiz";

export function TopicList() {
  const { data, ready } = useProgress();
  return <div className="topic-list">{topics.map((topic) => {
    const stats = topicStats(data.attempts, topic.id);
    return <Link className="topic-row" key={topic.id} href={`/practice/${topic.id}/`}><span className={`topic-icon ${topic.color}`}><TopicIcon topic={topic.id}/></span><div className="topic-copy"><h3>{topic.title}</h3><p>{topic.description}</p></div><div className="topic-meta"><span>{questions.filter((q) => q.topic === topic.id).length} questions</span><small>{ready && stats.accuracy !== null ? `${stats.accuracy}% practice accuracy` : "10-second item drills"}</small></div><ArrowUpRight className="topic-arrow" size={19} aria-hidden="true"/></Link>;
  })}</div>;
}

export function StudyDesk() {
  const { data, ready } = useProgress();
  const total = data.attempts.reduce((sum, attempt) => sum + attempt.total, 0);
  const correct = data.attempts.reduce((sum, attempt) => sum + attempt.score, 0);
  const mistakes = mistakeIds(data.attempts);
  const activeUrl = data.active?.scope === "mock" ? "/mock-exam/" : `/practice/${data.active?.scope}/`;
  return <>
    <div className="page-top"><span className="page-context">Taiwan factory exam practice</span><div className="study-desk-actions"><Link className="text-link" href="/progress/">View my progress <ArrowRight size={16} aria-hidden="true"/></Link><PageShare path="/" label="Share this study desk"/></div></div>
    {ready && data.active ? <div className="resume-banner"><div><strong>Pick up where you left off</strong><span>{scopeTitle(data.active.scope)} · Question {data.active.position + 1} of {data.active.questionIds.length}{data.active.deadline ? " · Timer is still running" : ""}</span></div><Link className="button button-small" href={activeUrl}>Resume <ArrowRight size={16} aria-hidden="true"/></Link></div> : null}
    <div className="desk-hero"><div className="hero-copy"><h1>Taiwan Factory Exam<br/>{" "}<span>Practice & Preparation</span></h1><p>Free Taiwan factory worker exam practice for Filipino applicants. Start with lessons and worked solutions, practise math, English, logic, and visual checking, then take a timed mock exam.</p><div className="button-row hero-actions"><Link className="button" href="/learn/">Start with exam lessons <ArrowRight size={18} aria-hidden="true"/></Link><Link className="text-link" href="/practice/">Go to practice <ArrowRight size={16} aria-hidden="true"/></Link></div><div className="hero-footnote"><CheckCircle2 size={15} aria-hidden="true"/>Free to practise. No sign-up needed.</div></div><DailySamplesCard/></div>
    <div className="study-summary"><div><span className="summary-label">Your practice so far</span><strong>{ready && total ? `${total} questions completed` : "No completed practice sessions"}</strong></div><div className="summary-detail"><span>{ready && total ? `${Math.round(correct / total * 100)}% overall accuracy` : "Start with just 10 questions"}</span><span className="summary-separator"/><span>{ready && data.attempts.length ? `${data.attempts.length} completed sessions` : "10 seconds per drill item"}</span></div><Leaf size={22} strokeWidth={1.5} aria-hidden="true"/></div>
    <div className="desk-grid"><section><div className="section-heading"><h2>Taiwan factory exam practice topics</h2><span>5 core skills</span></div><TopicList/><p className="section-note">Original practice questions. Actual employer assessments may differ.</p></section><aside className="study-aside"><section className="mock-promo"><div className="mock-promo-top"><Clock3 size={26} strokeWidth={1.5} aria-hidden="true"/></div><h2>Taiwan factory<br/>{" "}mock exam</h2><p>Put your skills together in one timed practice session.</p><div className="mock-details"><span><strong>100</strong> questions</span><span><strong>20:00</strong> time limit</span></div><Link className="button button-light" href="/mock-exam/">Take a mock exam <ArrowRight size={17} aria-hidden="true"/></Link><small>Answers and explanations at the end.</small></section><div className="study-tip"><ShieldCheck size={21} strokeWidth={1.6} aria-hidden="true"/><div><h3>Free exam practice with local progress</h3><p>Timed drills and mock exams. Your progress stays in this browser.</p></div></div></aside></div>
    {ready && mistakes.length ? <section className="mistake-banner"><div><h2>Review incorrect exam practice answers</h2><p>You have {mistakes.length} question{mistakes.length === 1 ? "" : "s"} to revisit from your latest answers.</p></div><Link className="button button-secondary" href="/practice/mistakes/">Review mistakes <ArrowRight size={17} aria-hidden="true"/></Link></section> : null}
    <section className="guides-preview"><div className="section-heading"><h2>Taiwan factory exam study guides</h2><Link href="/guides/" className="text-link">All study guides <ArrowRight size={16} aria-hidden="true"/></Link></div><div className="guide-preview-grid"><Link className="guide-preview" href="/guides/math-basics/"><div className="guide-spine sage"/><div><span className="reading-time">5 min read</span><h3>Factory exam math basics</h3><p>Simple methods you can use, one calculation at a time.</p></div><ArrowUpRight size={20} aria-hidden="true"/></Link><Link className="guide-preview" href="/guides/study-routine/"><div className="guide-spine sand"/><div><span className="reading-time">4 min read</span><h3>Taiwan factory exam study routine</h3><p>A manageable routine for your next few weeks.</p></div><ArrowUpRight size={20} aria-hidden="true"/></Link></div></section>
  </>;
}
