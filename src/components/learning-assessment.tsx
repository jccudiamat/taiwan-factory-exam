'use client';
import {AbstractDiagram} from '@/components/abstract-diagram';
import Link from 'next/link';
import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,Clock3,RotateCcw} from 'lucide-react';
import {lessons} from '@/lib/lessons';
import {gradeAttempt,hasPassed,saveLearningAnswer,startLearningAttempt,submitLearningAttempt,unitKey,unitQuestions,visitLearningQuestion,correctAnswer} from '@/lib/learning-progress';
import {formatAnswerTime,timingStats} from '@/lib/answer-timing';
import {formatTime} from '@/lib/quiz';
import {useLearning} from './learning-provider';
import {AnswerInput} from './learning-answer-input';

export function LearningAssessment({slug,sectionId}:{slug:string;sectionId:string}){
  const {data,ready,update}=useLearning();const lesson=lessons.find(l=>l.slug===slug)!;
  const final=sectionId==='final-assessment',count=final?10:5,required=final?8:4;
  const attempt=data.units[unitKey(slug,sectionId)]?.attempt;
  const allowed=!final||lesson.sections.every(s=>hasPassed(data,slug,s.id));
  const passed=hasPassed(data,slug,sectionId),pool=unitQuestions(slug,sectionId);
  const score=attempt?gradeAttempt(attempt,pool):0,position=attempt?.position??0;
  const selected=attempt?.questionIds.map(id=>pool.find(q=>q.id===id)!).filter(Boolean)??[];
  const question=selected[position],answered=selected.filter(q=>attempt?.answers[q.id]?.trim()).length;
  const index=lesson.sections.findIndex(s=>s.id===sectionId),next=lesson.sections[index+1]?.id??'final-assessment';
  const [now,setNow]=useState(Date.now),[confirm,setConfirm]=useState(false);const resultRef=useRef<HTMLHeadingElement>(null);
  const questionRef=useRef<HTMLHeadingElement>(null),timerRef=useRef<HTMLDivElement>(null);
  const seconds=attempt?.deadline?Math.max(0,Math.ceil((attempt.deadline-now)/1000)):null;
  const speed=timingStats(attempt?[attempt]:[]);
  useEffect(()=>{if(!attempt||attempt.submitted)return;const tick=()=>{const time=Date.now();setNow(time);if(attempt.deadline&&time>=attempt.deadline)update(p=>submitLearningAttempt(p,slug,sectionId,attempt.id));};tick();const timer=setInterval(tick,200);document.addEventListener('visibilitychange',tick);const warn=(e:BeforeUnloadEvent)=>e.preventDefault();window.addEventListener('beforeunload',warn);return()=>{clearInterval(timer);document.removeEventListener('visibilitychange',tick);window.removeEventListener('beforeunload',warn);};},[attempt?.id,attempt?.submitted,attempt?.deadline,slug,sectionId,update]);
  useEffect(()=>{if(attempt?.submitted)resultRef.current?.focus();},[attempt?.submitted]);
  useLayoutEffect(()=>{
    if(!attempt||attempt.submitted)return;
    const prompt=questionRef.current;if(!prompt)return;
    prompt.focus({preventScroll:true});
    const top=window.scrollY+prompt.getBoundingClientRect().top-(timerRef.current?.getBoundingClientRect().height??0)-16;
    window.scrollTo({top:Math.max(0,top),behavior:'instant'});
  },[attempt?.id,position,attempt?.submitted]);
  function jump(to:number){if(!attempt)return;update(p=>visitLearningQuestion(p,slug,sectionId,attempt.id,to));setConfirm(false);}
  if(!ready)return <p role="status">Loading assessment progress…</p>;
  if(!allowed)return <section className="learning-assessment"><h2>Final assessment prerequisites</h2><p>Pass every section assessment before starting the mixed assessment. Every section can be opened directly.</p><ul>{lesson.sections.filter(s=>!hasPassed(data,slug,s.id)).map(s=><li key={s.id}><Link href={`/learn/${slug}/${s.id}/`}>{s.title}</Link></li>)}</ul></section>;
  return <section className="learning-assessment" aria-label={final?'Final lesson assessment':'Section assessment'}><h2>{final?'Final mixed assessment':'Section assessment'}</h2><p>{count} questions · {required} correct required · {formatTime(count*10)} total. Target: under 10 seconds per item.</p><p className="learning-threshold-note">These are this website’s learning thresholds, not employer passing criteria. Teaching and guided practice stay untimed. Timed assessments have no pause; leaving or refreshing keeps the deadline.</p>
  {!attempt?<button className="button" onClick={()=>{setNow(Date.now());update(p=>startLearningAttempt(p,slug,sectionId));}}>Start {final?'final':'section'} assessment</button>:attempt.submitted?<>
    <div className={`learning-result ${score>=required?'is-correct':'needs-review'}`}><h3 ref={resultRef} tabIndex={-1}>{score>=required?'Assessment passed':'Review needed'}: {score}/{count}</h3><p>{passed&&score<required?'Your earlier passing result is preserved. ':''}Review the solutions and retry with a new set to improve accuracy and speed.</p><p><strong>{formatAnswerTime(speed.average)}</strong> average answer time · {speed.count} timed answers. Unanswered items have no answer time.</p><button className="button button-secondary" onClick={()=>{setNow(Date.now());setConfirm(false);update(p=>startLearningAttempt(p,slug,sectionId));}}><RotateCcw size={16} aria-hidden="true"/>Try a new timed assessment</button></div>
    <ol className="assessment-questions">{selected.map(q=><li key={q.id}><h3>{q.prompt}</h3><AbstractDiagram diagram={q.diagram}/><div className="assessment-solution"><strong>{correctAnswer(q,attempt.answers[q.id])?'Correct':'Incorrect'} · Correct answer: {q.answer}</strong><p>Your answer: {attempt.answers[q.id]||'Unanswered'} · {formatAnswerTime(attempt.timing?.answerMs[q.id]===undefined?null:attempt.timing.answerMs[q.id]/1000)}</p><ol>{q.steps.map((step,i)=><li key={i}>{step}</li>)}</ol></div></li>)}</ol>
  </>:<>
    {seconds!==null?<div ref={timerRef} className={`timer ${seconds<=10?'timer-warning':''}`} role="timer" aria-label={`${formatTime(seconds)} remaining`}><Clock3 size={18} aria-hidden="true"/><strong>{formatTime(seconds)}</strong><span>remaining · no pause</span></div>:<p>Resumed assessment from the previous untimed format. New attempts use 10 seconds per item.</p>}
    <p className="learning-assessment-count">Question {position+1} of {count} · {answered} answered</p>
    <div className="learning-check"><h3 ref={questionRef} tabIndex={-1}>{question.prompt}</h3><AbstractDiagram diagram={question.diagram}/><AnswerInput question={question} value={attempt.answers[question.id]??''} onChange={value=>update(p=>saveLearningAnswer(p,slug,sectionId,attempt.id,question.id,value))} disabled={seconds===0} name={`${attempt.id}-${question.id}`}/></div>
    <div className="button-row"><button className="button button-secondary" disabled={position===0} onClick={()=>jump(position-1)}><ArrowLeft size={16} aria-hidden="true"/>Previous</button>{position<count-1?<button className="button" onClick={()=>jump(position+1)}>Next item<ArrowRight size={16} aria-hidden="true"/></button>:<button className="button" onClick={()=>setConfirm(true)}>Finish assessment</button>}</div>
    <nav className="assessment-item-nav" aria-label="Assessment questions">{selected.map((q,i)=><button key={q.id} aria-current={position===i?'step':undefined} aria-label={`Question ${i+1}${attempt.answers[q.id]?.trim()?', answered':', unanswered'}`} onClick={()=>jump(i)}>{i+1}</button>)}</nav><button className="text-button" onClick={()=>setConfirm(true)}>Submit assessment</button>
    {confirm?<div className="confirmation" role="alert"><h3>Submit and lock this assessment?</h3><p>{count-answered} unanswered items count as incorrect. The countdown continues during confirmation.</p><div className="button-row"><button className="button" onClick={()=>{update(p=>submitLearningAttempt(p,slug,sectionId,attempt.id));setConfirm(false);}}>Submit and see results</button><button className="button button-secondary" onClick={()=>setConfirm(false)}>Keep answering</button></div></div>:null}
  </>}
  {passed?<div className="learning-next">{final?<><h3>Lesson requirements completed</h3><Link className="button" href="/learn/">All lessons<ArrowRight size={16} aria-hidden="true"/></Link></>:<Link className="button" href={`/learn/${slug}/${next}/`}>Continue to {next==='final-assessment'?'final assessment':'next section'}<ArrowRight size={16} aria-hidden="true"/></Link>}</div>:<p className="learning-next-note">Pass to enable guided progression. All individual sections remain accessible from the outline.</p>}
  </section>;
}
