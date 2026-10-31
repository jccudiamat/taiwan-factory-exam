import {lessons} from './lessons';
import {hasPassed,lessonProgress,unitKey,type LearningProgress} from './learning-progress';
import {mistakeIds,type Attempt,type Session} from './quiz';
import {scopeTitle} from './questions';

export function lessonSummaries(data:LearningProgress){
  return lessons.map(lesson=>{
    const progress=lessonProgress(data,lesson);
    const allSectionsPassed=progress.sections===lesson.sections.length;
    const draft=[...lesson.sections.map(section=>section.id),...(allSectionsPassed?['final-assessment']:[])].find(id=>{
      const attempt=data.units[unitKey(lesson.slug,id)]?.attempt;
      return attempt&&!attempt.submitted;
    });
    const firstUnpassed=lesson.sections.find(section=>!hasPassed(data,lesson.slug,section.id))?.id;
    const last=data.last[lesson.slug];
    const lastCanResume=last&&(last!=='final-assessment'||allSectionsPassed)&&!hasPassed(data,lesson.slug,last);
    const target=draft||(lastCanResume?last:undefined)||firstUnpassed||'final-assessment';
    const touched=Boolean(last)||Object.keys(data.units).some(key=>key.startsWith(`${lesson.slug}/`));
    return {lesson,progress,touched,draft,href:draft?`/learn/${lesson.slug}/${draft}/`:progress.completed?`/learn/${lesson.slug}/`:`/learn/${lesson.slug}/${target}/`,action:draft?'Resume assessment':progress.completed?'Review lesson':touched?'Resume lesson':'Start lesson'};
  });
}

export function nextStudyStep(attempts:Attempt[],active:Session|null,learning:LearningProgress,learningAvailable=true){
  if(active)return {kind:'session',title:'Resume your timed exam practice',description:`Your ${scopeTitle(active.scope).toLowerCase()} session is still open. Its deadline continues while you are away.`,label:'Resume active session',href:active.scope==='mock'?'/mock-exam/':`/practice/${active.scope}/`};
  const rows=learningAvailable?lessonSummaries(learning):[];
  const draft=rows.find(row=>row.draft);
  if(draft)return {kind:'lesson',title:'Return to your lesson assessment',description:`${draft.lesson.title}. Open the saved assessment to continue or view its result if time has expired.`,label:'Return to assessment',href:draft.href};
  const started=rows.find(row=>row.touched&&!row.progress.completed);
  if(started)return {kind:'lesson',title:'Continue your factory exam lesson',description:`${started.lesson.title} · ${started.progress.sections}/${started.lesson.sections.length} sections passed.`,label:'Resume lesson',href:started.href};
  const mistakes=mistakeIds(attempts);
  if(mistakes.length)return {kind:'mistakes',title:'Review your exam practice mistakes',description:`Revisit ${mistakes.length} questions based on your latest answer to each, then practise the related lessons.`,label:'Review mistakes',href:'/practice/mistakes/'};
  if(!learningAvailable)return {kind:'lesson',title:'Open your factory exam lessons',description:'Saved lesson completion is unavailable. You can still open the teaching and practice sections.',label:'Browse lessons',href:'/learn/'};
  const first=rows.find(row=>!row.progress.completed);
  if(first)return {kind:'lesson',title:'Start your factory exam lessons',description:`Begin with ${first.lesson.title.toLowerCase()}, then use the section assessments to check your understanding.`,label:'Start lesson',href:first.href};
  return {kind:'mock',title:'Check your skills in a timed mock exam',description:'Complete a 100-item mock in 20 minutes to record your score, accuracy, and answer speed.',label:'Start a mock exam',href:'/mock-exam/'};
}
