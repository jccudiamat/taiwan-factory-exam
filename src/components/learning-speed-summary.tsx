'use client';
import type {LearningProgress} from '@/lib/learning-progress';
import {formatAnswerTime,timingStats} from '@/lib/answer-timing';
import {lessons} from '@/lib/lessons';

export function LearningSpeedSummary({data}:{data:LearningProgress}){
  const completed=Object.entries(data.units).filter(([,u])=>u.attempt.submitted);
  const stats=timingStats(completed.map(([,u])=>u.attempt));
  return <section className="assessment-speed-summary"><h2>Lesson assessment answer speed</h2><p><strong>{formatAnswerTime(stats.average)}</strong> average · {stats.count} timed answers</p><p className="section-note">Based on the latest completed attempt for each section or final assessment. Guided lesson practice is untimed. Earlier assessments without timing and unanswered items are excluded.</p>{completed.length?<div className="history-table-wrap"><table><thead><tr><th scope="col">Lesson assessment</th><th scope="col">Avg answer time</th><th scope="col">Timed answers</th></tr></thead><tbody>{completed.map(([key,u])=>{const [slug,id]=key.split('/'),lesson=lessons.find(l=>l.slug===slug)!;const speed=timingStats([u.attempt]);return <tr key={key}><th scope="row">{lesson.title}: {id==='final-assessment'?'Final assessment':lesson.sections.find(s=>s.id===id)?.title}</th><td>{formatAnswerTime(speed.average)}</td><td>{speed.count}</td></tr>;})}</tbody></table></div>:<p>No completed lesson assessments yet.</p>}</section>;
}
