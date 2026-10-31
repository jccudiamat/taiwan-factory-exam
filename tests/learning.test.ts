import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons} from '../src/lib/lessons';
import {correctAnswer,emptyLearning,gradeAttempt,hasPassed,lessonProgress,parseLearning,saveLearningAnswer,visitLearningQuestion,startLearningAttempt,submitLearningAttempt,unitKey,unitQuestions,type LearningProgress} from '../src/lib/learning-progress';

function complete(data:LearningProgress,slug:string,section:string,correct=5){
  let next=startLearningAttempt(data,slug,section,()=>.3);const attempt=next.units[unitKey(slug,section)].attempt;const pool=unitQuestions(slug,section);
  for(const [i,id] of attempt.questionIds.entries()){
    next=visitLearningQuestion(next,slug,section,attempt.id,i);
    const q=pool.find(q=>q.id===id)!;const wrong=q.options?q.options.find(o=>o!==q.answer)!:'-999999';
    next=saveLearningAnswer(next,slug,section,attempt.id,id,i<correct?q.answer:wrong);
  }
  return submitLearningAttempt(next,slug,section,attempt.id);
}
test('every curriculum section has substantial teaching, two examples and a valid assessment pool',()=>{
  const ids=new Set<string>();let count=0;
  assert.equal(lessons.find(l=>l.slug==='pemdas')!.sections.length,6);
  assert.deepEqual(Object.fromEntries(lessons.map(l=>[l.slug,l.sections.length])),{arithmetic:3,pemdas:6,'abstract-reasoning':4,'ohms-law':8,'fractions-decimals':6,'percentages-units':4,'patterns-spatial':4,'factory-english':5,'visual-checking':3,'five-s':5,'dexterity-preparation':3});
  for(const l of lessons)for(const s of l.sections){
    assert.ok(s.teaching.flatMap(b=>b.paragraphs).join(' ').split(/\s+/).length>=90,s.id);
    assert.equal(s.examples.length,2,s.id);assert.ok(s.questions.length>=14,s.id);
    assert.equal(new Set(s.questions.map(q=>q.prompt)).size,s.questions.length,s.id);
    for(const q of s.questions){assert.ok(!ids.has(q.id),q.id);ids.add(q.id);count++;
      assert.ok(q.steps.length&&q.steps.every(step=>step.length>5),q.id);
      if(q.options){assert.ok([2,4].includes(q.options.length),q.id);assert.equal(new Set(q.options).size,q.options.length,q.id);assert.ok(q.options.includes(q.answer),q.id);}
      else assert.ok(Number.isFinite(Number(q.answer)),q.id);
      assert.ok(correctAnswer(q,q.answer),q.id);
    }
  }
  assert.ok(count>600);
});
test('opening or visiting a section never records assessment completion',()=>{
  const data=emptyLearning();data.last.pemdas='pemdas-parentheses';
  assert.equal(lessonProgress(data,lessons.find(l=>l.slug==='pemdas')!).percent,0);
  assert.equal(hasPassed(data,'pemdas','pemdas-parentheses'),false);
});
test('PEMDAS numeric answer keys agree with independently evaluated restricted arithmetic',()=>{
  for(const section of lessons.find(l=>l.slug==='pemdas')!.sections)for(const q of section.questions){
    const expression=q.prompt.replace(/^Calculate /,'').replace(/\.$/,'').replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/²/g,'**2').replace(/³/g,'**3').replace(/\[/g,'(').replace(/\]/g,')');
    assert.match(expression,/^[0-9 +*/().-]+$/);
    // Only authored, whitelisted arithmetic is evaluated in this test, never learner input.
    const expected=Function(`"use strict"; return (${expression});`)();
    assert.equal(Number(q.answer),expected,q.prompt);
  }
});
test('fraction and decimal pools assess different subskills with checked answer keys',()=>{
  const pool=lessons.flatMap(l=>l.sections.flatMap(s=>s.questions));
  const examples:Record<string,string>={
    'Simplify 24/28. Enter the numerator in simplest form.':'6',
    'Reduce 20/22 to simplest form. Enter the denominator.':'11',
    'Calculate 6/6 + 1/3. Write the result over 6, before simplifying. Enter its numerator.':'8',
    'Calculate 7/4 − 1/2. Write the result over 4, before simplifying. Enter its numerator.':'5',
    'Round 7.995 to two decimal places.':'8',
    'Round 11.342 to two decimal places.':'11.34',
    'Which decimal is larger: 8.8 or 8.75? Enter the larger value.':'8.8',
    'In 9.472, what value does the digit 7 represent? Enter its decimal value.':'0.07',
    'Calculate 5.20 − 0.35.':'4.85',
    'Calculate 6.5 × 0.4.':'2.6',
    'Calculate 8.4 ÷ 0.3.':'28',
    'Write 0.3 as a fraction in simplest form. Enter the numerator only.':'3',
  };
  for(const [prompt,answer] of Object.entries(examples)){const q=pool.find(q=>q.prompt===prompt);assert.ok(q,prompt);assert.ok(correctAnswer(q,answer),prompt);}
});
test('section assessment requires four correct and is not credited until submitted',()=>{
  let data=startLearningAttempt(emptyLearning(),'pemdas','pemdas-parentheses',()=>.4);
  const a=data.units['pemdas/pemdas-parentheses'].attempt;
  for(const [i,id] of a.questionIds.entries()){data=visitLearningQuestion(data,'pemdas','pemdas-parentheses',a.id,i);const q=unitQuestions('pemdas','pemdas-parentheses').find(q=>q.id===id)!;data=saveLearningAnswer(data,'pemdas','pemdas-parentheses',a.id,id,q.answer);}
  assert.equal(hasPassed(data,'pemdas','pemdas-parentheses'),false);
  data=submitLearningAttempt(data,'pemdas','pemdas-parentheses',a.id);
  assert.equal(hasPassed(data,'pemdas','pemdas-parentheses'),true);
  assert.equal(hasPassed(complete(emptyLearning(),'pemdas','pemdas-exponents',3),'pemdas','pemdas-exponents'),false);
  assert.equal(hasPassed(complete(emptyLearning(),'pemdas','pemdas-exponents',4),'pemdas','pemdas-exponents'),true);
});
test('submitted answers are locked; resubmission and stale actions do not alter completion',()=>{
  const data=complete(emptyLearning(),'pemdas','pemdas-parentheses');const a=data.units['pemdas/pemdas-parentheses'].attempt;
  assert.deepEqual(submitLearningAttempt(data,'pemdas','pemdas-parentheses',a.id),data);
  assert.deepEqual(saveLearningAnswer(data,'pemdas','pemdas-parentheses',a.id,a.questionIds[0],'-99'),data);
  const retry=startLearningAttempt(data,'pemdas','pemdas-parentheses',()=>.8);
  assert.deepEqual(saveLearningAnswer(retry,'pemdas','pemdas-parentheses',a.id,a.questionIds[0],'-99'),retry);
});
test('refresh restores draft answers and an existing draft cannot be reset by starting again',()=>{
  let data=startLearningAttempt(emptyLearning(),'factory-english','english-alphabet');const a=data.units['factory-english/english-alphabet'].attempt;const q=unitQuestions('factory-english','english-alphabet').find(q=>q.id===a.questionIds[0])!;
  data=saveLearningAnswer(data,'factory-english','english-alphabet',a.id,q.id,q.answer);
  const restored=parseLearning(JSON.stringify(data));assert.deepEqual(restored,data);
  assert.deepEqual(startLearningAttempt(restored,'factory-english','english-alphabet'),restored);
});
test('retry gets different section questions and preserves a prior passing result',()=>{
  const first=complete(emptyLearning(),'pemdas','pemdas-parentheses');const previous=first.units['pemdas/pemdas-parentheses'].attempt;
  const retry=startLearningAttempt(first,'pemdas','pemdas-parentheses',()=>.8);
  assert.ok(retry.units['pemdas/pemdas-parentheses'].attempt.questionIds.every(id=>!previous.questionIds.includes(id)));
  const failed=complete(first,'pemdas','pemdas-parentheses',0);
  assert.equal(hasPassed(failed,'pemdas','pemdas-parentheses'),true);
});
test('final is gated by section passes, samples every section, and needs eight correct',()=>{
  const lesson=lessons.find(l=>l.slug==='pemdas')!;let data=emptyLearning();
  assert.deepEqual(startLearningAttempt(data,'pemdas','final-assessment'),data);
  for(const s of lesson.sections)data=complete(data,lesson.slug,s.id);
  assert.equal(lessonProgress(data,lesson).percent,86);
  const started=startLearningAttempt(data,'pemdas','final-assessment',()=>.6);const ids=started.units['pemdas/final-assessment'].attempt.questionIds;
  assert.equal(ids.length,10);assert.equal(new Set(ids).size,10);
  for(const s of lesson.sections)assert.ok(s.questions.some(q=>ids.includes(q.id)),s.id);
  const failed=complete(data,'pemdas','final-assessment',7);assert.equal(lessonProgress(failed,lesson).completed,false);
  const passed=complete(data,'pemdas','final-assessment',8);assert.equal(lessonProgress(passed,lesson).completed,true);assert.equal(lessonProgress(passed,lesson).percent,100);
});
test('unanswered items score zero and numeric validation never evaluates expressions',()=>{
  const data=startLearningAttempt(emptyLearning(),'pemdas','pemdas-parentheses');const a=data.units['pemdas/pemdas-parentheses'].attempt;
  assert.equal(gradeAttempt(a,unitQuestions('pemdas','pemdas-parentheses')),0);
  const q={id:'x',prompt:'number',answer:'12',hint:'',steps:[]};
  assert.equal(correctAnswer(q,'12.0'),true);assert.equal(correctAnswer(q,' 12 '),true);assert.equal(correctAnswer(q,'6+6'),false);assert.equal(correctAnswer(q,''),false);assert.equal(correctAnswer(q,'12abc'),false);
  assert.equal(correctAnswer(q,'1,2'),false);
});
test('invalid and outdated data cannot fabricate passing evidence or crash parsing',()=>{
  for(const raw of [null,'no json','[]','null','{"version":99}','{"version":1,"contentVersion":99,"units":{}}'])assert.deepEqual(parseLearning(raw),emptyLearning());
  const data=complete(emptyLearning(),'pemdas','pemdas-parentheses');const unit=data.units['pemdas/pemdas-parentheses'];
  unit.passed!.answers={};assert.equal(hasPassed(parseLearning(JSON.stringify(data)),'pemdas','pemdas-parentheses'),false);
  unit.attempt.questionIds[0]='unknown';assert.equal(Object.keys(parseLearning(JSON.stringify(data)).units).length,0);
});
