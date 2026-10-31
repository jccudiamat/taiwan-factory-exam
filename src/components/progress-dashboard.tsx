"use client";
import {AbstractDiagram} from '@/components/abstract-diagram';

import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Bookmark, HardDrive, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useProgress } from "./progress-provider";
import { topics, questionMap, scopeTitle, topicTitle } from "@/lib/questions";
import { mistakeIds, topicStats, type Attempt } from "@/lib/quiz";
import {formatAnswerTime,timingStats} from '@/lib/answer-timing';
import {LearningSpeedSummary} from './learning-speed-summary';
import {emptyLearning,LEARNING_KEY,parseLearning} from '@/lib/learning-progress';
import {lessonSummaries,nextStudyStep} from '@/lib/progress-guidance';
import {sessionOutcome} from '@/lib/session-outcome';
import {isReadinessMock} from '@/lib/readiness';
import {LessonProgressSummary} from './lesson-progress-summary';
import {ReadinessChart} from './readiness-chart';
import { Results } from "./quiz-player";
import { TopicIcon } from "./icons";

export function ProgressDashboard() {
  const {data,ready,clear,storageIssue}=useProgress();
  const [reset,setReset]=useState(false);
  const [view,setView]=useState<Attempt|null>(null);
  const [cleared,setCleared]=useState(false);
  const [learning,setLearning]=useState(emptyLearning);
  const [learningReady,setLearningReady]=useState(false);
  const [learningIssue,setLearningIssue]=useState(false);
  useEffect(()=>{
    const read=()=>{try{setLearning(parseLearning(localStorage.getItem(LEARNING_KEY)));setLearningIssue(false);}catch{setLearning(emptyLearning());setLearningIssue(true);}setLearningReady(true);};
    const sync=(event:StorageEvent)=>{if(event.key===LEARNING_KEY||event.key===null)read();};
    const visible=()=>{if(document.visibilityState==='visible')read();};
    read();window.addEventListener('storage',sync);document.addEventListener('visibilitychange',visible);
    return()=>{window.removeEventListener('storage',sync);document.removeEventListener('visibilitychange',visible);};
  },[data]);
  const total=data.attempts.reduce((n,a)=>n+a.total,0);
  const correct=data.attempts.reduce((n,a)=>n+a.score,0);
  const mistakes=mistakeIds(data.attempts);
  const speed=timingStats(data.attempts);
  const lessonRows=lessonSummaries(learning);
  const completedLessons=lessonRows.filter(row=>row.progress.completed).length;
  const completedSections=lessonRows.reduce((sum,row)=>sum+row.progress.sections,0);
  const allSections=lessonRows.reduce((sum,row)=>sum+row.lesson.sections.length,0);
  const latestMock=data.attempts.filter(isReadinessMock).sort((a,b)=>b.completedAt-a.completedAt)[0];
  const next=nextStudyStep(data.attempts,data.active,learning,!learningIssue);
  const loaded=ready&&learningReady;
  if(view)return <><button className="back-link text-button" onClick={()=>setView(null)}><ArrowLeft size={16} aria-hidden="true"/>Back to progress</button><Results attempt={view}/></>;
  return <>
    <div className="page-heading"><h1>Taiwan Factory Exam Preparation Progress</h1><p>Review your lesson completion, exam practice results, and the next skills to work on.</p></div>
    <div className="device-note"><HardDrive size={18} aria-hidden="true"/><span>Progress is stored only in this browser. It won’t follow you to another device.</span></div>
    {!loaded?<div className="loading-state" role="status">Loading your progress…</div>:<>
      <section className="preparation-overview" aria-labelledby="overview-heading"><h2 id="overview-heading">Your exam preparation overview</h2>
        <div className="progress-overview">
          <div><span>Latest 100-item mock</span><strong>{latestMock?`${latestMock.score}%`:'—'}</strong><span>{latestMock?`${latestMock.score}/100 correct`:'No current-format mock yet'}</span></div>
          <div><span>Overall practice accuracy</span><strong>{total?`${Math.round(correct/total*100)}%`:'—'}</strong><span>{total?`${correct} correct · ${total} items`:'No completed practice yet'}</span></div>
          <div><span>Average answer time</span><strong className="answer-speed-value">{formatAnswerTime(speed.average)}</strong><span>{speed.count} timed practice answers</span></div>
          <div><span>Lessons completed</span><strong>{learningIssue?'—':`${completedLessons}/${lessonRows.length}`}</strong><span>{learningIssue?'Lesson data unavailable':`${completedSections}/${allSections} sections passed`}</span></div>
        </div><p className="progress-activity">{data.attempts.length} completed practice &amp; mock sessions · {total} questions attempted</p><details className="progress-metric-method"><summary>How overview metrics are calculated</summary><p className="section-note">Practice accuracy includes unanswered items as incorrect. Answer time averages individual recorded answers; unanswered and older untimed items are excluded. Lesson completion requires all section passes and the final assessment.</p></details>
      </section>
      {learningIssue?<p className="storage-warning" role="status">Your saved lesson data could not be read. Lesson completion is unavailable; your practice results are shown below.</p>:null}
      <section className="progress-next-step" aria-labelledby="next-step-heading"><div><h2 id="next-step-heading">Next exam preparation step</h2><h3>{next.title}</h3><p>{next.description}</p></div><div className="progress-next-actions"><Link className="button" href={next.href}>{next.label}<ArrowRight size={17} aria-hidden="true"/></Link>{!data.active&&mistakes.length>0&&next.kind!=='mistakes'?<Link className="text-link" href="/practice/mistakes/">Review {mistakes.length} practice mistakes<ArrowRight size={16} aria-hidden="true"/></Link>:null}</div></section>
      <ReadinessChart attempts={data.attempts}/>
      <section className="topic-breakdown" aria-labelledby="topic-progress-heading"><div className="section-heading"><h2 id="topic-progress-heading">Exam practice accuracy by topic</h2><span>Completed practice &amp; mocks</span></div>
        {data.attempts.length?topics.map(topic=>{const stats=topicStats(data.attempts,topic.id);return <div className="breakdown-row" key={topic.id}><span className={`topic-icon ${topic.color}`}><TopicIcon topic={topic.id}/></span><div><h3>{topic.title}</h3><p>{stats.answered?`${stats.correct} correct out of ${stats.answered} attempts · ${formatAnswerTime(timingStats(data.attempts,id=>questionMap.get(id)?.topic===topic.id).average)}`:'No questions attempted'}</p></div><div className="accuracy-track"><progress value={stats.accuracy??0} max={100} aria-label={`${topic.title} accuracy`}/><span>{stats.accuracy===null?'—':`${stats.accuracy}%`}</span></div><Link href={`/practice/${topic.id}/`} className="text-link" aria-label={`Practise ${topic.title}`}>Practise<ArrowRight size={16} aria-hidden="true"/></Link></div>;}):<div className="progress-empty-row"><p>No completed practice sessions yet. Topic accuracy will appear after your first session.</p><Link className="button button-small button-secondary" href="/practice/">Browse practice topics<ArrowRight size={16} aria-hidden="true"/></Link></div>}
      </section>
      {!learningIssue?<><LessonProgressSummary data={learning}/><details className="lesson-speed-details"><summary>View lesson assessment answer times</summary><LearningSpeedSummary data={learning}/></details></>:null}
      <section className="session-history" aria-labelledby="session-history-heading"><h2 id="session-history-heading">Your recent exam practice sessions</h2>{data.attempts.length?<><p className="section-note">{data.attempts.length} completed sessions · Results and answer reviews</p><p className="section-note">Mock pass: at least 90%. Drill pass: every item correct in under 10 seconds. Missing timing can leave an earlier drill unassessed. These are this site’s practice targets.</p><p className="session-scroll-hint">Scroll horizontally to view every column.</p><div className="history-table-wrap session-history-table" tabIndex={0} role="region" aria-label="Recent exam practice sessions table"><table><thead><tr><th scope="col">Session</th><th scope="col">Completed</th><th scope="col">Score</th><th scope="col">Accuracy</th><th scope="col">Result</th><th scope="col">Avg answer time</th><th scope="col"><span className="sr-only">Review</span></th></tr></thead><tbody>{data.attempts.map(attempt=>{const outcome=sessionOutcome(attempt);return <tr key={attempt.id}><th scope="row">{scopeTitle(attempt.scope)}</th><td>{new Intl.DateTimeFormat('en-PH',{month:'short',day:'numeric',year:'numeric'}).format(attempt.completedAt)}</td><td className="session-score">{attempt.score}/{attempt.total}</td><td className="session-accuracy">{new Intl.NumberFormat('en-PH',{style:'percent',maximumFractionDigits:1}).format(attempt.score/attempt.total)}</td><td><span className={`session-result session-result-${outcome.tone}`} aria-label={`${outcome.label}: ${outcome.reason}`}>{outcome.label}</span></td><td>{formatAnswerTime(timingStats([attempt]).average)}</td><td><button className="text-button" onClick={()=>{setView(attempt);window.scrollTo({top:0,behavior:'instant'});}} aria-label={`Review ${scopeTitle(attempt.scope)} session, score ${attempt.score} out of ${attempt.total}`}>Review<ArrowRight size={15} aria-hidden="true"/></button></td></tr>;})}</tbody></table></div></>:<p className="section-note">Completed practice and mock sessions will appear here.</p>}</section>
    </>}
    <section className="data-settings"><div><h2>Manage saved exam practice data</h2><p>Keep up to 100 completed sessions on this device, or clear your history, saved questions, and current session.</p></div>{reset?<div className="confirmation" role="alert"><strong>Clear all practice data on this device?</strong><p>This can’t be undone.</p><div className="button-row"><button className="button button-danger" onClick={()=>{clear();setReset(false);setCleared(true);}}>Clear all data</button><button className="button button-secondary" onClick={()=>setReset(false)}>Keep my data</button></div></div>:<button className="text-button danger-text" onClick={()=>{setReset(true);setCleared(false);}}><Trash2 size={16} aria-hidden="true"/>Clear local data</button>}{cleared?<p role="status">{storageIssue?'Cleared for this tab. Browser storage could not be updated; clear this site’s data in browser settings too.':'Your local practice data has been cleared.'}</p>:null}</section>
  </>;
}

export function SavedQuestions() {
  const { data, ready, toggleBookmark } = useProgress();
  return <><div className="page-heading"><h1>Saved Factory Exam Practice Questions</h1><p>Your saved questions, ready for another look whenever you need them.</p></div>{!ready ? <div className="loading-state" role="status">Loading saved questions…</div> : !data.bookmarks.length ? <section className="empty-state"><Bookmark size={38} strokeWidth={1.3} aria-hidden="true"/><h2>No saved practice questions</h2><p>Tap Save beside any question during practice. You’ll find it here, along with its explanation.</p><Link className="button" href="/practice/">Explore practice topics <ArrowRight size={17} aria-hidden="true"/></Link></section> : <><div className="saved-toolbar"><span>{data.bookmarks.length} saved question{data.bookmarks.length === 1 ? "" : "s"}</span><Link className="button button-small" href="/practice/saved/">Practise saved questions <ArrowRight size={16} aria-hidden="true"/></Link></div><div className="saved-list">{data.bookmarks.map((id) => { const q = questionMap.get(id)!; return <article className="saved-item" key={id}><div className="saved-item-header"><span>{topicTitle(q.topic)}</span><button className="icon-button" aria-label={`Remove saved question: ${q.prompt}`} onClick={() => toggleBookmark(id)}><Bookmark size={19} fill="currentColor" aria-hidden="true"/></button></div><h2>{q.prompt}</h2><AbstractDiagram diagram={q.diagram}/>{data.active?<p className="section-note">Answers unlock after the active session is submitted.</p>:<details><summary><BookOpen size={16} aria-hidden="true"/>Show answer and explanation</summary><p><strong>{q.options[q.answer]}</strong></p><p>{q.explanation}</p></details>}</article>; })}</div></>}
  </>;
}
