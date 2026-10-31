import {MOCK_COUNT,MOCK_PASS_PERCENT,MOCK_SECONDS_PER_ITEM,scoreSession,type Attempt} from './quiz';
import {timingStats} from './answer-timing';
export function isReadinessMock(a:Attempt){
  return a.scope==='mock'&&a.engineVersion===3&&a.questionIds.length===MOCK_COUNT&&a.deadline===a.startedAt+MOCK_COUNT*MOCK_SECONDS_PER_ITEM*1000;
}
export function readinessData(attempts:Attempt[]){
  const eligible=attempts.filter(isReadinessMock).sort((a,b)=>a.completedAt-b.completedAt);
  const all=eligible.map((a,i)=>{
    const score=scoreSession(a),answered=a.questionIds.filter(id=>a.answers[id]!==undefined).length,speed=timingStats([a]);
    return {id:a.id,number:i+1,completedAt:a.completedAt,score,scorePercent:score/MOCK_COUNT*100,answered,
      accuracy:answered?score/answered*100:null,speed:speed.average,timedAnswers:speed.count};
  });
  const recent=eligible.slice(-5),rows=all.slice(-10);
  const correct=recent.reduce((n,a)=>n+scoreSession(a),0),answered=recent.reduce((n,a)=>n+a.questionIds.filter(id=>a.answers[id]!==undefined).length,0);
  const averageScore=recent.length?correct/(recent.length*MOCK_COUNT)*100:null,accuracy=answered?correct/answered*100:null,speed=timingStats(recent);
  // A conservative training index, not a probability of passing an employer's exam.
  const index=averageScore!==null&&accuracy!==null&&speed.average!==null?Math.min(averageScore,accuracy,speed.average===0?100:MOCK_SECONDS_PER_ITEM/speed.average*100,100):null;
  const consistent=all.length>=3&&all.slice(-3).every(r=>r.scorePercent>=MOCK_PASS_PERCENT&&r.accuracy!==null&&r.accuracy>=MOCK_PASS_PERCENT&&r.speed!==null&&r.speed<=MOCK_SECONDS_PER_ITEM&&r.timedAnswers===r.answered);
  return {rows,eligibleCount:eligible.length,excludedMockCount:attempts.filter(a=>a.scope==='mock'&&!isReadinessMock(a)).length,
    recentCount:recent.length,averageScore,accuracy,speed,index,consistent,
    status:eligible.length<3?'Complete 3 current-format mocks':consistent?'Practice targets met in the last 3 mocks':'Practice targets not yet consistent'};
}
