'use client';
import {AbstractDiagram} from '@/components/abstract-diagram';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
import { questionMap, topics, type TopicId } from '@/lib/questions';
import { DAILY_KEY, answerDailySample, parseDailySamples, philippineDate, reconcileDailySamples, type DailySamples } from '@/lib/daily-samples';

export function DailySamplesCard() {
  const [data, setData] = useState<DailySamples | null>(null);
  const current = useRef<DailySamples | null>(null);
  const [topic, setTopic] = useState<TopicId>('math');
  const [storageIssue, setStorageIssue] = useState(false);
  const refresh = useCallback((change?: (value: DailySamples) => DailySamples) => {
    let stored = current.current ?? parseDailySamples(null);
    let failed = false;
    try { const raw = localStorage.getItem(DAILY_KEY); if (raw !== null) stored = parseDailySamples(raw); }
    catch { failed = true; }
    let next = reconcileDailySamples(stored);
    if (change) next = change(next);
    try { localStorage.setItem(DAILY_KEY, JSON.stringify(next)); } catch { failed = true; }
    current.current = next; setData(next); setStorageIssue(failed);
  }, []);
  useEffect(() => {
    refresh();
    const check = () => { if (document.visibilityState === 'visible') refresh(); };
    const sync = (event: StorageEvent) => { if (event.key === DAILY_KEY || event.key === null) { current.current = null; refresh(); } };
    const interval = window.setInterval(check, 60_000);
    document.addEventListener('visibilitychange', check);
    window.addEventListener('focus', check);
    window.addEventListener('storage', sync);
    return () => { clearInterval(interval); document.removeEventListener('visibilitychange', check); window.removeEventListener('focus', check); window.removeEventListener('storage', sync); };
  }, [refresh]);
  const sample = data?.topics[topic];
  const question = sample?.questionId ? questionMap.get(sample.questionId) : null;
  const answered = Boolean(sample?.answeredOn);
  const topicName = topics.find(t => t.id === topic)!.title;
  const completed = topics.filter(t => data?.topics[t.id]?.answeredOn === philippineDate()).length;
  return <section className="warmup daily-samples" aria-labelledby="warmup-heading">
    <div className="warmup-heading"><h2 id="warmup-heading">Daily factory exam sample questions</h2><span>{completed} of {topics.length} answered today</span></div>
    <div className="daily-topics" role="group" aria-label="Sample question topic">{topics.map(t => <button key={t.id} className={topic === t.id ? 'selected' : ''} aria-pressed={topic === t.id} onClick={() => setTopic(t.id)}>{t.shortTitle}{data?.topics[t.id]?.answeredOn === philippineDate() ? <Check size={13} aria-label="Answered today"/> : null}</button>)}</div>
    {!data ? <p role="status" className="daily-note">Loading your daily sample questions…</p> : question && sample ? <>
      <p className="warmup-question" id="daily-prompt">{question.prompt}</p><AbstractDiagram diagram={question.diagram}/>
      <fieldset key={question.id} className="warmup-options" disabled={answered} aria-describedby="daily-prompt"><legend className="sr-only">Choose an answer</legend>{question.options.map((option, index) => <label key={index} className={`warmup-option ${sample.selected === index ? 'selected' : ''} ${answered && index === question.answer ? 'correct' : ''}`}><input type="radio" name="daily-sample" checked={sample.selected === index} onChange={() => refresh(value => {
        const latest = value.topics[topic];
        return latest?.questionId === question.id && !latest.answeredOn ? { ...value, topics: { ...value.topics, [topic]: { ...latest, selected: index } } } : value;
      })}/><span>{option}</span>{answered && index === question.answer ? <Check size={16} aria-hidden="true"/> : null}</label>)}</fieldset>
      <div className="warmup-bottom" aria-live="polite">{answered ? <div className="daily-feedback"><p><strong>{sample.selected === question.answer ? 'Correct.' : `Correct answer: ${question.options[question.answer]}.`}</strong> {question.explanation}</p><p>Answered on {sample.answeredOn}. A different question unlocks the next Philippine day.</p></div> : <><span>Unanswered questions stay until you answer.</span><button className="text-button" disabled={sample.selected === null} onClick={() => refresh(value => answerDailySample(value, topic, question.id, sample.selected!, philippineDate()))}>Check answer <ArrowRight size={16} aria-hidden="true"/></button></>}</div>
    </> : <div className="daily-empty"><p>You’ve completed all {topicName.toLowerCase()} sample questions currently available. Completed samples won’t repeat; new questions will appear when added.</p><Link className="text-link" href={`/practice/${topic}/`}>Continue with topic practice <ArrowRight size={16} aria-hidden="true"/></Link></div>}
    {storageIssue ? <p className="daily-storage-warning" role="status">Your browser cannot save these samples. Keep this page open; daily locks and unanswered questions may reset after closing or refreshing.</p> : null}
  </section>;
}
