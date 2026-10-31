import test from 'node:test';
import assert from 'node:assert/strict';
import {createSession,answerQuestion,visitQuestion,completeSession,meetsMockPassMark,parseProgress,type Attempt} from '../src/lib/quiz';
import {questionMap} from '../src/lib/questions';
import {isReadinessMock,readinessData} from '../src/lib/readiness';
function mock(correct=90,answered=100,seconds=9,now=1000):Attempt{
  let s=createSession('mock',100,undefined,now);
  for(let i=0;i<answered;i++){
    const start=now+i*(seconds+.01)*1000;s=visitQuestion(s,i,start);
    const q=questionMap.get(s.questionIds[i])!;
    s=answerQuestion(s,i<correct?q.answer:(q.answer+1)%4,start+seconds*1000);
  }
  return completeSession(s,now+answered*(seconds+.01)*1000);
}
test('100-item mock pass boundary is exactly 90; unanswered items remain incorrect',()=>{
  assert.equal(meetsMockPassMark(mock(90,100)),true);
  assert.equal(meetsMockPassMark(mock(89,100)),false);
  const ninety=mock(90,90);assert.equal(ninety.score,90);assert.equal(ninety.total,100);assert.equal(meetsMockPassMark(ninety),true);
});
test('new format survives refresh with 100 unique items and a non-resetting 20-minute deadline',()=>{
  const a=mock(90);const p=parseProgress(JSON.stringify({version:1,attempts:[a],bookmarks:[],active:null}));
  assert.equal(p.attempts.length,1);assert.equal(p.attempts[0].deadline,p.attempts[0].startedAt+1200000);
  assert.equal(p.attempts[0].questionIds.length,100);assert.equal(new Set(p.attempts[0].questionIds).size,100);
  assert.ok(isReadinessMock(p.attempts[0]));
});
test('chart distinguishes full score from answered accuracy and does not inflate an incomplete paper',()=>{
  const data=readinessData([mock(1,1,1)]);
  assert.equal(data.rows[0].scorePercent,1);assert.equal(data.rows[0].accuracy,100);assert.equal(data.rows[0].answered,1);
  assert.equal(data.index,1);assert.equal(data.consistent,false);assert.match(data.status,/Complete 3/);
});
test('readiness is based on three comparable mocks meeting the explicit score and speed targets',()=>{
  const data=readinessData([mock(90,100,9,1000),mock(92,100,10,2000000),mock(94,100,11,4000000)]);
  assert.equal(data.consistent,true);assert.equal(data.averageScore,92);assert.equal(data.index,92);
  assert.equal(data.speed.average,10);assert.equal(data.speed.count,300);
  const slow=readinessData([mock(90,100,9,1000),mock(92,100,9,2000000),mock(90,90,13,4000000)]);
  assert.equal(slow.consistent,false);assert.match(slow.status,/not yet consistent/);
});
test('summary pools individual responses and retains null for missing timing instead of plotting zero',()=>{
  const a=mock(1,1,1),b=mock(3,3,9,2000000),c=mock(0,0,0,4000000);
  const data=readinessData([a,b,c]);assert.equal(data.speed.count,4);assert.equal(data.speed.average,7);
  assert.equal(data.rows[2].speed,null);assert.equal(data.rows[2].accuracy,null);
  assert.equal(readinessData([c]).index,null);
});
test('earlier mock formats keep their history but cannot populate or qualify the new readiness chart',()=>{
  const old=completeSession({...createSession('mixed',50,undefined,1000),scope:'mock',engineVersion:2});
  const restored=parseProgress(JSON.stringify({version:1,attempts:[old],bookmarks:[],active:null}));
  assert.equal(restored.attempts.length,1);assert.equal(restored.attempts[0].total,50);
  const data=readinessData(restored.attempts);assert.equal(data.rows.length,0);assert.equal(data.excludedMockCount,1);assert.equal(data.index,null);
});
test('chart orders retained mocks chronologically, plots ten, and summarizes only the latest five',()=>{
  const attempts=Array.from({length:12},(_,i)=>mock(80+i,100,8,1000+i*2000000)).reverse();
  const data=readinessData(attempts);assert.equal(data.rows.length,10);assert.equal(data.rows[0].number,3);assert.equal(data.rows[9].number,12);
  assert.equal(data.recentCount,5);assert.equal(data.averageScore,89);assert.equal(data.eligibleCount,12);
});
