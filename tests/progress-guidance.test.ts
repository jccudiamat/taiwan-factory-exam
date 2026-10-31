import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons} from '../src/lib/lessons';
import {emptyLearning,startLearningAttempt,saveLearningAnswer,visitLearningQuestion,submitLearningAttempt,unitQuestions,unitKey,type LearningProgress} from '../src/lib/learning-progress';
import {lessonSummaries,nextStudyStep} from '../src/lib/progress-guidance';
import {createSession} from '../src/lib/quiz';

function pass(data:LearningProgress,section:string){
  let next=startLearningAttempt(data,'arithmetic',section,()=>.3);
  const attempt=next.units[unitKey('arithmetic',section)].attempt;
  for(const [position,id] of attempt.questionIds.entries()){
    next=visitLearningQuestion(next,'arithmetic',section,attempt.id,position);
    next=saveLearningAnswer(next,'arithmetic',section,attempt.id,id,unitQuestions('arithmetic',section).find(q=>q.id===id)!.answer);
  }
  return submitLearningAttempt(next,'arithmetic',section,attempt.id);
}
test('progress starts honestly empty and recommends lessons before a first mock',()=>{
  const data=emptyLearning(),before=JSON.stringify(data),rows=lessonSummaries(data);
  assert.equal(rows.length,lessons.length);
  assert.ok(rows.every(row=>row.progress.percent===0&&!row.progress.completed));
  assert.equal(nextStudyStep([],null,data).href,'/learn/arithmetic/arithmetic-counting/');
  assert.equal(nextStudyStep([],null,data,false).href,'/learn/');
  assert.equal(JSON.stringify(data),before);
});
test('reading retains resume position without earning completion and locked finals are not recommended',()=>{
  const data=emptyLearning();data.last.pemdas='pemdas-exponents';
  const row=lessonSummaries(data).find(r=>r.lesson.slug==='pemdas')!;
  assert.equal(row.progress.percent,0);assert.equal(row.action,'Resume lesson');
  assert.equal(nextStudyStep([],null,data).href,'/learn/pemdas/pemdas-exponents/');
  data.last.pemdas='final-assessment';
  assert.equal(lessonSummaries(data).find(r=>r.lesson.slug==='pemdas')!.href,'/learn/pemdas/pemdas-parentheses/');
});
test('completed sections still require a final and a saved retake resumes without losing earlier completion',()=>{
  let data=emptyLearning();for(const section of lessons.find(l=>l.slug==='arithmetic')!.sections)data=pass(data,section.id);
  let row=lessonSummaries(data)[0];assert.equal(row.progress.sections,3);assert.equal(row.progress.completed,false);assert.equal(row.progress.percent,75);
  assert.equal(row.href,'/learn/arithmetic/final-assessment/');
  data=pass(data,'final-assessment');row=lessonSummaries(data)[0];assert.equal(row.progress.percent,100);assert.equal(row.action,'Review lesson');
  data=startLearningAttempt(data,'arithmetic','arithmetic-counting');row=lessonSummaries(data)[0];
  assert.equal(row.progress.completed,true);assert.equal(row.action,'Resume assessment');assert.equal(row.href,'/learn/arithmetic/arithmetic-counting/');
  assert.equal(nextStudyStep([],null,data).href,row.href);
});
test('an active timed session takes priority over lesson recommendations',()=>{
  const data=startLearningAttempt(emptyLearning(),'arithmetic','arithmetic-counting');
  const active=createSession('mock',100);
  assert.equal(nextStudyStep([],active,data).href,'/mock-exam/');
  assert.equal(nextStudyStep([],null,data).href,'/learn/arithmetic/arithmetic-counting/');
});
