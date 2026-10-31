import test from 'node:test';
import assert from 'node:assert/strict';
import {createSession,completeSession,type Attempt} from '../src/lib/quiz';
import {questionMap} from '../src/lib/questions';
import {sessionOutcome} from '../src/lib/session-outcome';

function attempt(mock:boolean,correct:number):Attempt{
  const session=createSession(mock?'mock':'math',mock?100:5,undefined,1000);
  session.answers=Object.fromEntries(session.questionIds.slice(0,correct).map(id=>[id,questionMap.get(id)!.answer]));
  if(session.timing)session.timing.answerMs=Object.fromEntries(session.questionIds.slice(0,correct).map(id=>[id,8900]));
  return completeSession(session,20000);
}
test('session history uses the exact 90% mock boundary and supports earlier mock sizes',()=>{
  assert.equal(sessionOutcome(attempt(true,89)).label,'Failed');
  assert.equal(sessionOutcome(attempt(true,90)).label,'Passed');
  const earlier=attempt(true,100);earlier.questionIds=earlier.questionIds.slice(0,20);earlier.answers=Object.fromEntries(earlier.questionIds.slice(0,18).map(id=>[id,questionMap.get(id)!.answer]));earlier.timing=undefined;
  assert.equal(sessionOutcome(earlier).label,'Passed');
  delete earlier.answers[earlier.questionIds[0]];assert.equal(sessionOutcome(earlier).label,'Failed');
});
test('drill history requires every correct answer under ten seconds and preserves unknown legacy timing',()=>{
  assert.equal(sessionOutcome(attempt(false,4)).label,'Failed');
  const full=attempt(false,5);assert.equal(sessionOutcome(full).label,'Passed');
  full.timing!.answerMs[full.questionIds[0]]=10000;assert.equal(sessionOutcome(full).label,'Failed');
  delete full.timing!.answerMs[full.questionIds[0]];assert.equal(sessionOutcome(full).label,'Not assessed');
  full.timing=undefined;assert.equal(sessionOutcome(full).label,'Not assessed');
});
