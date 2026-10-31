import test from 'node:test';
import assert from 'node:assert/strict';
import {answerQuestion,visitQuestion,drillRepeatIds,createSession,completeSession,parseProgress,remainingSeconds,formatTime,validateSession} from '../src/lib/quiz';
import {timingStats,formatAnswerTime} from '../src/lib/answer-timing';
import {questionMap} from '../src/lib/questions';
import {emptyLearning,startLearningAttempt,saveLearningAnswer,visitLearningQuestion,submitLearningAttempt,parseLearning,gradeAttempt,unitQuestions} from '../src/lib/learning-progress';

test('practice keeps a 150-second total budget and lets the first question be answered and revised after 10 seconds',()=>{
  let s=createSession('math',15,undefined,1000);assert.equal(s.deadline,151000);assert.equal(formatTime(150),'02:30');assert.equal(formatTime(500),'08:20');
  const id=s.questionIds[0],answer=questionMap.get(id)!.answer;
  s=answerQuestion(s,(answer+1)%4,12000);assert.equal(s.answers[id],(answer+1)%4);
  s=answerQuestion(s,answer,14000);assert.equal(s.answers[id],answer);assert.equal(s.timing!.answerMs[id],13000);
  assert.equal(s.deadline,151000);
  const result=completeSession(s,15000);assert.equal(result.score,1);
  assert.ok(drillRepeatIds(result).includes(id),'a correct but slow final answer still needs speed practice');
  assert.equal(answerQuestion(s,0,151000),s,'answers close at the exact total deadline');
});
test('practice revisions survive navigation and refresh without resetting the total deadline or answer exposure',()=>{
  let s=createSession('detail',3,undefined,1000);const id=s.questionIds[0];
  s=answerQuestion(s,0,1500);
  s=visitQuestion(s,1,2000);s=visitQuestion(s,0,8000);
  let restored=parseProgress(JSON.stringify({version:1,attempts:[],bookmarks:[],active:s})).active!;
  assert.equal(restored.timing!.firstSeenAt[id],1000);assert.equal(restored.deadline,31000);
  restored=answerQuestion(restored,2,12000);assert.equal(restored.answers[id],2);
  assert.equal(restored.timing!.answerMs[id],5000);
  const roundTrip=parseProgress(JSON.stringify({version:1,attempts:[],bookmarks:[],active:restored})).active!;
  assert.deepEqual(roundTrip,restored);
  assert.equal(remainingSeconds(restored,40000),0);assert.equal(completeSession(restored,40000).completedAt,31000);
  assert.equal(answerQuestion(restored,0,40000),restored);
});
test('legacy practice item locks do not prevent answering or changing resumed questions',()=>{
  for(const previouslyAnswered of [false,true]){
    const s=createSession('english',5,undefined,1000),id=s.questionIds[0];
    const stored={...s,checked:[id],answers:previouslyAnswered?{[id]:0}:{}};
    const restored=parseProgress(JSON.stringify({version:1,attempts:[],bookmarks:[],active:stored})).active!;
    const updated=answerQuestion(restored,2,22000);
    assert.equal(updated.answers[id],2);assert.equal(updated.timing!.answerMs[id],21000);
    assert.equal(updated.deadline,51000);assert.equal(remainingSeconds(updated,22000),29);
  }
});
test('mock answer time accumulates exposure across revisits and measures the final selection',()=>{
  let s=createSession('mock',50,undefined,1000);const first=s.questionIds[0];
  s=answerQuestion(s,0,4000);s=visitQuestion(s,1,6000);const second=s.questionIds[1];
  s=answerQuestion(s,1,9000);s=visitQuestion(s,0,11000);s=answerQuestion(s,2,13000);
  assert.equal(s.timing!.answerMs[first],7000);assert.equal(s.timing!.answerMs[second],3000);
  const roundTrip=parseProgress(JSON.stringify({version:1,attempts:[],bookmarks:[],active:s})).active!;
  assert.deepEqual(roundTrip,s);assert.equal(roundTrip.deadline,1201000);
});
test('averages weight individual timed answers, exclude historical and unanswered items, and reject corrupt timing',()=>{
  let a=createSession('math',1,undefined,1000);a=answerQuestion(a,0,9900);
  let b=createSession('math',2,undefined,20000);b=answerQuestion(b,0,21000);b=visitQuestion(b,1,22000);b=answerQuestion(b,1,25000);
  const stats=timingStats([a,b]);assert.equal(stats.count,3);assert.equal(stats.average,4.3);assert.equal(formatAnswerTime(timingStats([a]).average),'8.9 s');
  assert.deepEqual(timingStats([{questionIds:['m01']}]),{count:0,average:null});
  assert.equal(validateSession({...a,timing:{...a.timing,answerMs:{[a.questionIds[0]]:-1}}}),null);
  assert.equal(validateSession({...a,deadline:999999}),null);
  assert.equal(validateSession({...a,timing:{...a.timing,firstSeenAt:{}}}),null);
});
test('old untimed history and original 20-minute mocks survive migration with no invented speed',()=>{
  const legacy={id:'legacy',scope:'math',questionIds:['m01'],answers:{m01:1},checked:['m01'],position:0,startedAt:1000,deadline:null};
  const saved=parseProgress(JSON.stringify({version:1,attempts:[{...legacy,completedAt:2000}],bookmarks:['m01'],active:null}));
  assert.equal(saved.attempts.length,1);assert.equal(saved.attempts[0].score,1);assert.equal(timingStats(saved.attempts).average,null);
  assert.ok(validateSession({...legacy,scope:'mock',deadline:1201000}));
});
test('lesson assessment deadlines, drafts, item exposure and expiry scoring persist without restart',()=>{
  let d=startLearningAttempt(emptyLearning(),'pemdas','pemdas-parentheses',()=>.4,1000);const a=d.units['pemdas/pemdas-parentheses'].attempt;
  assert.equal(a.deadline,51000);const pool=unitQuestions('pemdas','pemdas-parentheses'),q=pool.find(q=>q.id===a.questionIds[0])!;
  d=saveLearningAnswer(d,'pemdas','pemdas-parentheses',a.id,q.id,q.answer,9900);
  d=visitLearningQuestion(d,'pemdas','pemdas-parentheses',a.id,1,10000);
  d=parseLearning(JSON.stringify(d));assert.equal(d.units['pemdas/pemdas-parentheses'].attempt.position,1);
  assert.equal(d.units['pemdas/pemdas-parentheses'].attempt.timing!.answerMs[q.id],8900);
  assert.deepEqual(startLearningAttempt(d,'pemdas','pemdas-parentheses',()=>.1,20000),d);
  const late=saveLearningAnswer(d,'pemdas','pemdas-parentheses',a.id,a.questionIds[1],'123',51000);assert.deepEqual(late,d);
  d=submitLearningAttempt(d,'pemdas','pemdas-parentheses',a.id);assert.equal(gradeAttempt(d.units['pemdas/pemdas-parentheses'].attempt,pool),1);
});
