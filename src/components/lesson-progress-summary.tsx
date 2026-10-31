import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import {lessonSummaries} from '@/lib/progress-guidance';
import type {LearningProgress} from '@/lib/learning-progress';

export function LessonProgressSummary({data}:{data:LearningProgress}){
  const rows=lessonSummaries(data);
  return <section className="lesson-progress-summary" aria-labelledby="lesson-progress-heading"><div className="section-heading"><h2 id="lesson-progress-heading">Factory exam lesson completion</h2><Link className="text-link" href="/learn/">All lessons<ArrowRight size={16} aria-hidden="true"/></Link></div><p className="section-note">Completion counts passed section assessments and the final assessment. Reading alone does not count as a pass.</p><div className="lesson-progress-list">{rows.map(({lesson,progress,touched,href,action})=><article className="lesson-progress-row" key={lesson.slug}><div><h3><Link href={`/learn/${lesson.slug}/`}>{lesson.title}</Link></h3><p>{progress.completed?'Completed':touched?'In progress':'Not started'} · {progress.sections}/{lesson.sections.length} sections passed · {progress.final?'Final passed':'Final pending'}</p></div><div className="lesson-progress-meter"><progress value={progress.percent} max={100} aria-label={`${lesson.title}: ${progress.percent}% complete`}/><span>{progress.percent}%</span></div><Link className="button button-small button-secondary" href={href} aria-label={`${action}: ${lesson.title}`}>{action}<ArrowRight size={16} aria-hidden="true"/></Link></article>)}</div></section>;
}
