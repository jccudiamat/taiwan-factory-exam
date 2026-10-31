"use client";
import {PageShare} from './page-share';
import {AbstractDiagram} from '@/components/abstract-diagram';

import Link from "next/link";
import { ArrowLeft, ArrowRight, Bookmark, Check, CheckCircle2, Clock3, Flag, RotateCcw, X, ListChecks } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useProgress } from "./progress-provider";
import { questions, questionMap, scopeTitle, topicTitle, topics, type Scope } from "@/lib/questions";
import { answerQuestion, expireDrillItem, visitQuestion, drillRepeatIds, MOCK_SECTIONS, MOCK_PASS_PERCENT, meetsMockPassMark, completeSession, createSession, formatTime, mistakeIds, remainingSeconds, type Attempt, type Session } from "@/lib/quiz";

import { formatAnswerTime, timingStats, ITEM_MS } from '@/lib/answer-timing';

function sessionUrl(scope: Scope) { return scope === "mock" ? "/mock-exam/" : `/practice/${scope}/`; }

export function AnswerReview({ attempt }: { attempt: Attempt }) {
  const [onlyMistakes, setOnlyMistakes] = useState(false);
  const { data, toggleBookmark } = useProgress();
  const reviewIds = attempt.questionIds.filter((id) => !onlyMistakes || attempt.answers[id] !== questionMap.get(id)!.answer);
  if(data.active)return <section className="answer-review"><h2>Answer review is locked</h2><p>Submit the active practice or mock session before opening answers and solutions.</p></section>;
  return <section className="answer-review"><div className="section-heading"><h2>Exam practice answers & explanations</h2><label className="checkbox-label"><input type="checkbox" checked={onlyMistakes} onChange={(event) => setOnlyMistakes(event.target.checked)}/>Only mistakes</label></div>
    {reviewIds.length ? <div className="review-list">{reviewIds.map((id) => {
      const question = questionMap.get(id)!; const given = attempt.answers[id]; const correct = given === question.answer;
      return <details key={id} className="review-item"><summary><span className={`review-status ${correct ? "is-correct" : "is-incorrect"}`}>{correct ? <Check size={17} aria-label="Correct"/> : <X size={17} aria-label={given === undefined ? "Unanswered" : "Incorrect"}/>}</span><span>{question.prompt}</span><span className="review-toggle">View answer</span></summary><div className="review-content"><AbstractDiagram diagram={question.diagram}/><p><span className="muted">Your answer: </span>{given === undefined ? "Not answered" : question.options[given]}</p><p>Time to answer: {formatAnswerTime(attempt.timing?.answerMs[id] === undefined ? null : attempt.timing.answerMs[id]/1000)}{given === undefined ? " · Unanswered" : ""}</p><p><strong>Correct answer: {question.options[question.answer]}</strong></p><p>{question.explanation}</p><button className="text-button" aria-pressed={data.bookmarks.includes(id)} onClick={() => toggleBookmark(id)}><Bookmark size={16} fill={data.bookmarks.includes(id) ? "currentColor" : "none"} aria-hidden="true"/>{data.bookmarks.includes(id) ? "Saved for later" : "Save this question"}</button></div></details>;
    })}</div> : <div className="empty-inline"><CheckCircle2 size={22} aria-hidden="true"/><p>No mistakes in this session. Nicely done.</p></div>}
  </section>;
}

export function Results({ attempt, onRetry, onRepeat }: { attempt: Attempt; onRetry?: () => void; onRepeat?: () => void }) {
  const { storageIssue } = useProgress();
  const resultHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { resultHeading.current?.focus({ preventScroll: true }); }, [attempt.id]);
  const percent = Math.round(attempt.score / attempt.total * 100);
  const incorrect = attempt.total - attempt.score;
  const speed=timingStats([attempt]); const repeat=drillRepeatIds(attempt);
  const elapsed = Math.min(Math.max(0, Math.floor((attempt.completedAt - attempt.startedAt) / 1000)), attempt.deadline ? (attempt.deadline-attempt.startedAt)/1000 : Infinity);
  return <div className="results"><section className="result-summary"><div className="result-copy"><CheckCircle2 size={30} strokeWidth={1.5} aria-hidden="true"/><h1 ref={resultHeading} tabIndex={-1}>{attempt.scope === "mock" ? "Taiwan Factory Mock Exam Results" : "Factory Exam Practice Results"}</h1><p>{attempt.scope === "mock" ? "Review accuracy and answer speed by section, then practise missed or slow questions." : !attempt.timing ? "This earlier session has no item timing. Complete a new timed drill to measure speed." : repeat.length ? `${repeat.length} items still need a correct answer in under 10 seconds. Repeat the drill to meet both targets.` : "Every item was answered correctly within the speed target."}</p><>{attempt.scope==='mock'?<p className="mock-pass-result"><strong>{meetsMockPassMark(attempt)?'Practice passing mark met':'Below the practice passing mark'}</strong> · {MOCK_PASS_PERCENT}% required{attempt.total!==100?' · Earlier mock format':' (90/100)'}</p>:null}</><span className="result-save-note">{storageIssue ? "This result could not be saved to your browser." : "Session completed · Saved on this device"}</span></div><div className="result-score"><strong>{attempt.score}<span> / {attempt.total}</span></strong><span>answers correct</span><span className="score-percentage">{percent}% accuracy</span></div></section><div className="result-metrics"><span><Clock3 size={17} aria-hidden="true"/>{formatTime(elapsed)} elapsed</span><span><ListChecks size={17} aria-hidden="true"/>{incorrect} to revisit</span><span>{scopeTitle(attempt.scope)}</span><span><strong>{formatAnswerTime(speed.average)}</strong> average answer time</span></div><p className="section-note">Based on {speed.count} timed answers. Unanswered items count as incorrect and have no answer time. Older sessions without item timing are excluded.</p>{attempt.scope === "mock" ? <section className="mock-section-results"><h2>Mock exam results by section</h2>{topics.map(t=>{const ids=attempt.questionIds.filter(id=>questionMap.get(id)?.topic===t.id);const times=timingStats([attempt],id=>ids.includes(id));return <div key={t.id}><strong>{t.title}</strong><span>{ids.filter(id=>attempt.answers[id]===questionMap.get(id)?.answer).length}/{ids.length} correct</span><span>{formatAnswerTime(times.average)}</span></div>;})}</section>:null}<div className="result-actions">{onRepeat && repeat.length ? <button className="button" onClick={onRepeat}>Repeat {repeat.length} missed or slow items<RotateCcw size={17} aria-hidden="true"/></button>:null}{onRetry ? <button className="button" onClick={onRetry}>Practise again <RotateCcw size={17} aria-hidden="true"/></button> : <Link className="button" href={sessionUrl(attempt.scope)}>Practise again <ArrowRight size={17} aria-hidden="true"/></Link>}<Link className="button button-secondary" href="/progress/">View my progress</Link></div><p className="section-note">This is practice feedback, not an official pass mark or prediction of hiring success.</p><AnswerReview attempt={attempt}/></div>;
}

export function QuizPlayer({ scope }: { scope: Scope }) {
  const { data, ready, saveSession, finish, storageIssue } = useProgress();
  const [count, setCount] = useState(15);
  const [result, setResult] = useState<Attempt | null>(null);
  const [confirmFinish, setConfirmFinish] = useState(false);
  const previousSession = useRef<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const heading = useRef<HTMLHeadingElement>(null);
  const header = useRef<HTMLDivElement>(null);
  const completed = useRef<string | null>(null);
  const session = ready && data.active?.scope === scope ? data.active : null;
  const isMock = scope === "mock";
  const poolIds = scope === "mistakes" ? mistakeIds(data.attempts) : scope === "saved" ? data.bookmarks : undefined;
  const poolSize = poolIds ? poolIds.length : scope === "mixed" || isMock ? questions.length : questions.filter((q) => q.topic === scope).length;
  const seconds = session ? remainingSeconds(session, now) : null;

  const submit = useCallback((target: Session) => {
    if (completed.current === target.id) return;
    completed.current = target.id;
    const finished = completeSession(target, target.deadline && Date.now() >= target.deadline ? target.deadline : Date.now());
    finish(finished); setResult(finished); setConfirmFinish(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [finish]);

  useEffect(() => {
    if (!session?.deadline) return;
    const tick = () => {
      const time = Date.now(); setNow(time);
      if (time >= session.deadline!) submit(session);
      else {const expired=expireDrillItem(session,time);if(expired!==session)saveSession(expired);}
    };
    tick();
    const timer = window.setInterval(tick, 200);
    document.addEventListener("visibilitychange", tick);
    return () => { window.clearInterval(timer); document.removeEventListener("visibilitychange", tick); };
  }, [session, submit, saveSession]);
  useEffect(()=>{if(session)previousSession.current=session.id;else if(previousSession.current){const ended=data.attempts.find(a=>a.id===previousSession.current);if(ended)setResult(ended);}},[session,data.attempts]);
  useLayoutEffect(() => {
    if(!session)return;
    const prompt=heading.current;if(!prompt)return;
    prompt.focus({preventScroll:true});
    const top=window.scrollY+prompt.getBoundingClientRect().top-(header.current?.getBoundingClientRect().height??0)-16;
    window.scrollTo({top:Math.max(0,top),behavior:'instant'});
  }, [session?.id, session?.position]);
  useEffect(() => {
    if (!session) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [session?.id]);

  function begin(repeatIds?:string[]) {
    // Successful review can exhaust the pool, and saved items can be removed from results.
    // Return to the empty intro rather than constructing a zero-question session.
    if (poolSize === 0) { setResult(null); setConfirmFinish(false); return; }
    if (data.active) return;
    completed.current = null; setResult(null); setConfirmFinish(false);  setNow(Date.now());
    saveSession(createSession(scope, repeatIds?.length ?? Math.min(count, poolSize), repeatIds ?? poolIds));
  }

  function start(){begin();}
  if (result) return <Results attempt={result} onRetry={start} onRepeat={!isMock ? ()=>begin(drillRepeatIds(result)) : undefined}/>;

  if (!session) return <div className="quiz-intro">
    <div className="page-heading-tools"><Link className="back-link" href="/practice/"><ArrowLeft size={16} aria-hidden="true"/>All practice topics</Link>{scope!=="saved"&&scope!=="mistakes"?<PageShare path={sessionUrl(scope)} label={isMock?"Share this mock exam":"Share this practice topic"}/>:null}</div>
    <div className="intro-layout"><section className="intro-main"><div className={`intro-symbol ${isMock ? "forest" : "sage"}`}>{isMock ? <Clock3 size={30} strokeWidth={1.5} aria-hidden="true"/> : <ListChecks size={30} strokeWidth={1.5} aria-hidden="true"/>}</div><h1>{scopeTitle(scope)}</h1><p className="lead">{isMock ? "A 100-item pressure simulation in five topic sections: math, English, logic, abstract reasoning, and attention to detail. The fixed time limit is 20 minutes." : scope === "mistakes" ? "Give your tricky questions another go. This list uses your most recent answer to each question." : scope === "saved" ? "A practice session made from the questions you’ve kept for later." : "Rapid-fire drills for factory exam speed and precision. Answer each item correctly in under 10 seconds, then repeat missed items until both targets are met."}</p>
      
      <div className="intro-facts"><span><ListChecks size={18} aria-hidden="true"/>{isMock ? "100 questions · 5 sections" : `${poolSize} questions available`}</span><span><Clock3 size={18} aria-hidden="true"/>{isMock ? "20:00 total · 12 seconds/item budget · 90% passing mark" : `${formatTime(Math.min(count,poolSize)*10)} total · 10 seconds per item`}</span><span><CheckCircle2 size={18} aria-hidden="true"/>Answers and solutions after submission</span></div>
      {!isMock && poolSize > 0 ? <fieldset className="count-picker"><legend>How many questions?</legend><div>{[...new Set([5, 10, 15, Math.min(15, poolSize)])].filter((n) => n <= poolSize).sort((a, b) => a - b).map((n) => <label key={n}><input type="radio" name="question-count" value={n} checked={Math.min(count, poolSize) === n} onChange={() => setCount(n)}/><span>{n}</span></label>)}</div></fieldset> : null}
      {!ready ? <div className="loading-state" role="status">Loading your practice…</div> : poolSize === 0 ? <div className="empty-inline"><p>{scope === "saved" ? "Save questions using the bookmark button during practice. They’ll be ready here when you need them." : "No mistakes to review yet. Finish a practice session to see what to work on."}</p><Link className="button" href="/practice/mixed/">Start a mixed practice <ArrowRight size={17} aria-hidden="true"/></Link></div> : <>
        {data.active ? <div className="confirmation" role="status"><strong>A timed session is already running.</strong><p>Finish it before starting another session. Its timer cannot be paused or reset.</p><Link className="button" href={sessionUrl(data.active.scope)}>Resume active session</Link></div> : <button className="button button-large" onClick={start}>{isMock ? "Start the mock exam" : "Start timed drill"}<ArrowRight size={18} aria-hidden="true"/></button>}
        <p className="section-note">{isMock ? "The timer starts when you begin and keeps running if you leave or refresh. Your answers are submitted when time runs out." : "The total timer keeps running if you leave this page. Each question also expires 10 seconds after its first display. Returning does not reset it."}</p>
      </>}
    </section><aside className="intro-aside"><h2>{isMock ? "Mock exam instructions" : "How to use exam practice"}</h2><ol><li>Prepare blank paper and a pen for working out calculations. Use your own reasoning: no calculator, internet searches, AI tools, notes, cheat sheets, or help from another person. Attempt every item honestly so your results reflect what you can do independently.</li><li>{isMock ? "Allow 20 minutes without interruptions. There is no pause." : "Choose an answer within 10 seconds. Your first selection locks immediately."}</li><li>{isMock ? "Answer in any order. Use the question list to revisit an answer." : "Move on promptly. Answers and solutions are hidden until you submit or time expires."}</li><li>{isMock ? "Submit when you’re ready. Unanswered questions count as incorrect." : "Repeat missed or slow questions from the results until every item meets the target."}</li></ol><div className="aside-disclaimer">{isMock ? <><p>Section 1: Math · 20 items<br/>Section 2: English · 20 items<br/>Section 3: Logic · 20 items<br/>Section 4: Abstract reasoning · 20 items<br/>Section 5: Attention to detail · 20 items</p><p>Browsers allow you to leave. Leaving, closing, or refreshing does not pause this exam; expiry is enforced when the page is active again.</p></>:null}These are original learning exercises. This format is for practice and does not reproduce any employer’s actual exam.</div></aside></div>
    </div>;

  const question = questionMap.get(session.questionIds[session.position])!;
  const selected = session.answers[question.id];
  const checked = !isMock && session.checked.includes(question.id);
  
  const answeredCount = Object.keys(session.answers).length;
  const checkedCount = session.checked.length;
  const last = session.position === session.questionIds.length - 1;
  function jump(position:number){if(!session)return;const updated=visitQuestion(expireDrillItem(session),position);saveSession(updated);setConfirmFinish(false);}
  function next() { if (last) setConfirmFinish(true); else jump(session!.position + 1); }

  return <div className="quiz-workspace"><div className="quiz-header" ref={header}><div><Link className="back-link" href="/practice/"><ArrowLeft size={16} aria-hidden="true"/>Practice topics</Link><h1>{scopeTitle(scope)}</h1></div>{seconds !== null ? <div className={`timer ${seconds <= 30 ? "timer-warning" : ""}`} role="timer" aria-label={`${formatTime(seconds)} remaining`}><Clock3 size={19} aria-hidden="true"/><strong>{formatTime(seconds)}</strong><span>remaining</span></div> : <span className="untimed"><LeafIcon/>At your own pace</span>}</div>
    <div className="quiz-layout"><section className="question-panel"><div className="question-topline"><span>Question {session.position + 1} of {session.questionIds.length}</span><BookmarkControl id={question.id}/></div><progress className="session-progress" value={isMock ? answeredCount : checkedCount} max={session.questionIds.length} aria-label={isMock ? "Questions answered" : "Items closed"}/><span className="question-topic">{isMock ? `Section ${MOCK_SECTIONS.findIndex(s=>s.topic===question.topic)+1} of ${MOCK_SECTIONS.length} · ` : ""}{topicTitle(question.topic)}</span>{session.timing ? <p className="item-speed">{isMock ? session.engineVersion===3 ? "Pace budget: 12 seconds per item · Passing mark: 90%" : "Earlier mock format · Original time limit retained" : checked ? selected===undefined ? "Item closed without an answer" : session.timing.answerMs[question.id]===undefined?"Answer locked · timing unavailable":`Answer locked · ${(session.timing.answerMs[question.id]/1000).toFixed(1)} seconds` : `${Math.min(10,Math.max(0,Math.ceil(((session.timing.firstSeenAt[question.id]??now)+ITEM_MS-now)/1000)))} seconds left for this item`}</p>:null}<h2 ref={heading} tabIndex={-1} className="question-heading">{question.prompt}</h2><AbstractDiagram diagram={question.diagram}/>
      <fieldset className="answer-options" disabled={checked}><legend className="sr-only">Choose one answer</legend>{question.options.map((option, index) => <label key={index} className={`answer-option ${selected === index ? "selected" : ""}`}><input type="radio" name={`answer-${question.id}`} checked={selected === index} value={index} onChange={() => {if(session.deadline && Date.now()>=session.deadline){submit(session);return;}saveSession(answerQuestion(session,index));}}/><span className="option-letter" aria-hidden="true">{String.fromCharCode(65 + index)}</span><span>{option}</span></label>)}</fieldset>
      <p className="session-integrity">Use blank paper and a pen. No calculator, searches, AI, notes, or cheat sheets.</p><p className="deferred-feedback">Answers, correctness, and solutions are shown only after submission or time expiry.</p>
      <div className="question-actions"><button className="button button-quiet" disabled={session.position===0} onClick={()=>jump(session.position-1)}><ArrowLeft size={17} aria-hidden="true"/>Previous</button><button className="button" onClick={next}>{last?'Finish session':'Next question'}<ArrowRight size={17} aria-hidden="true"/></button></div>
      {confirmFinish ? <div className="confirmation" role="alert"><h3>{isMock ? "Submit your mock exam?" : "Finish this practice session?"}</h3><p>{session.questionIds.length - answeredCount > 0 ? `${session.questionIds.length - answeredCount} unanswered ${session.questionIds.length - answeredCount === 1 ? "question will" : "questions will"} count as incorrect.` : "You’ve answered every question. Your results and explanations are ready."} You can’t change answers after submitting.</p><div className="button-row"><button className="button" onClick={() => submit(session)}>Submit and see results</button><button className="button button-secondary" onClick={() => setConfirmFinish(false)}>Keep practising</button></div></div> : null}
    </section><aside className="question-sidebar"><h2>{isMock ? "Mock exam sections" : "Drill questions"}</h2>{isMock ? <div className="mock-section-nav">{MOCK_SECTIONS.map((section,i)=>{const first=session.questionIds.findIndex(id=>questionMap.get(id)?.topic===section.topic);return <button key={section.topic} aria-current={question.topic===section.topic?"step":undefined} onClick={()=>jump(first)}><span>{i+1}. {topicTitle(section.topic)}</span><small>{session.questionIds.filter(id=>questionMap.get(id)?.topic===section.topic).length} items</small></button>;})}</div>:null}<p>{answeredCount} of {session.questionIds.length} answered</p><nav className="question-grid" aria-label={isMock?'Jump to a question in this section':'Jump to a question'}>{session.questionIds.map((id,index)=>({id,index})).filter(({id})=>!isMock||questionMap.get(id)?.topic===question.topic).map(({id,index}) => <button key={id} className={`${index === session.position ? "current" : ""} ${session.answers[id] !== undefined ? "answered" : ""}`} aria-current={index === session.position ? "step" : undefined} aria-label={`Question ${index + 1}, ${session.answers[id] !== undefined ? "answered" : "unanswered"}`} onClick={() => jump(index)}>{index + 1}</button>)}</nav><div className="question-legend"><span><i className="answered-dot"/>Answered</span><span><i/>Not yet</span></div><div className="question-sidebar-note"><Bookmark size={17} aria-hidden="true"/><p>Save any question to revisit it later.</p></div><button className="text-button" onClick={() => setConfirmFinish(true)}><Flag size={16} aria-hidden="true"/>Finish session</button></aside></div>
    <p className="session-save-status">{storageIssue ? "Progress is not saving. Keep this tab open to continue." : "Your progress saves in this browser as you go."}{" No pause. The timer continues if you leave this page."}</p>
  </div>;
}

function LeafIcon() { return <Clock3 size={17} aria-hidden="true"/>; }
export function BookmarkControl({ id }: { id: string }) {
  const { data, toggleBookmark } = useProgress();
  const saved = data.bookmarks.includes(id);
  return <button className={`bookmark-button ${saved ? "is-saved" : ""}`} aria-label={saved ? "Remove saved question" : "Save question for later"} aria-pressed={saved} onClick={() => toggleBookmark(id)}><Bookmark size={19} fill={saved ? "currentColor" : "none"} aria-hidden="true"/><span>{saved ? "Saved" : "Save"}</span></button>;
}
