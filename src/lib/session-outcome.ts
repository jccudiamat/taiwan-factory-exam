import {ITEM_MS} from './answer-timing';
import {meetsMockPassMark,MOCK_PASS_PERCENT,scoreSession,type Attempt} from './quiz';

export function sessionOutcome(attempt:Attempt){
  if(attempt.scope==='mock')return meetsMockPassMark(attempt)
    ?{label:'Passed',tone:'passed',reason:`Met the ${MOCK_PASS_PERCENT}% mock practice mark.`}
    :{label:'Failed',tone:'failed',reason:`Below the ${MOCK_PASS_PERCENT}% mock practice mark; blanks count as incorrect.`};
  if(scoreSession(attempt)<attempt.questionIds.length)return {label:'Failed',tone:'failed',reason:'One or more drill items were incorrect or unanswered.'};
  const times=attempt.questionIds.map(id=>attempt.timing?.answerMs[id]);
  if(times.some(time=>time!==undefined&&time>=ITEM_MS))return {label:'Failed',tone:'failed',reason:'One or more drill answers did not meet the under-10-second target.'};
  if(times.some(time=>time===undefined))return {label:'Not assessed',tone:'unassessed',reason:'All answers are correct, but individual answer timing is unavailable.'};
  return {label:'Passed',tone:'passed',reason:'Every drill item was correct in under 10 seconds.'};
}
