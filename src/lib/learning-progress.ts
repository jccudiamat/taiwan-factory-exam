import { lessons } from './lessons';
import type { LearningQuestion, LearningLesson } from './learning-types';
import {answerTiming,ITEM_MS,startTiming,validateTiming,visitTiming,type AnswerTiming} from './answer-timing';
export const LEARNING_KEY = 'taiwan-factory-exam:learning:v1';
export const CONTENT_VERSION = 1;
export type LearningAttempt = { id:string; questionIds:string[]; answers:Record<string,string>; submitted:boolean; startedAt?:number; deadline?:number; position?:number; timing?:AnswerTiming };
export type UnitProgress = { attempt:LearningAttempt; passed:LearningAttempt|null; attempts:number };
export type LearningProgress = { version:1; contentVersion:1; units:Record<string,UnitProgress>; last:Record<string,string>; stages:Record<string,number> };
export function emptyLearning():LearningProgress{return {version:1,contentVersion:1,units:{},last:{},stages:{}};}
export function unitKey(slug:string,section:string){return `${slug}/${section}`;}
export function unitQuestions(slug:string,section:string):LearningQuestion[]{
  const lesson=lessons.find(l=>l.slug===slug);
  return section==='final-assessment'?lesson?.sections.flatMap(s=>s.questions.slice(4))??[]:lesson?.sections.find(s=>s.id===section)?.questions.slice(4)??[];
}
export function correctAnswer(q:LearningQuestion,value:string|undefined):boolean{
  if(value===undefined||!value.trim())return false;
  if(q.options)return value===q.answer;
  // Compare numeric answers without evaluating arbitrary expressions or accepting missing values.
  const input=value.trim();
  if(input.includes(',')&&!/^[-+]?\d{1,3}(?:,\d{3})+(?:\.\d+)?$/.test(input))return false;
  const text=input.replace(/,/g,'');
  return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(text)&&Math.abs(Number(text)-Number(q.answer))<1e-8;
}
export function gradeAttempt(attempt:LearningAttempt,pool:LearningQuestion[]){const map=new Map(pool.map(q=>[q.id,q]));return attempt.questionIds.reduce((sum,id)=>sum+(map.has(id)&&correctAnswer(map.get(id)!,attempt.answers[id])?1:0),0);}
export function hasPassed(data:LearningProgress,slug:string,section:string){
  const passed=data.units[unitKey(slug,section)]?.passed;
  return Boolean(passed?.submitted&&gradeAttempt(passed,unitQuestions(slug,section))>=Math.ceil(passed.questionIds.length*.8));
}
export function lessonProgress(data:LearningProgress,lesson:LearningLesson){
  const sections=lesson.sections.filter(s=>hasPassed(data,lesson.slug,s.id)).length;
  const final=hasPassed(data,lesson.slug,'final-assessment');
  return {sections,final,completed:sections===lesson.sections.length&&final,percent:Math.round((sections+(final?1:0))/(lesson.sections.length+1)*100)};
}
function shuffle<T>(array:T[],random:()=>number){const a=[...array];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function startLearningAttempt(data:LearningProgress,slug:string,section:string,random=Math.random,now=Date.now()):LearningProgress{
  const lesson=lessons.find(l=>l.slug===slug);if(!lesson)return data;
  if(section==='final-assessment'&&!lesson.sections.every(s=>hasPassed(data,slug,s.id)))return data;
  const pool=unitQuestions(slug,section);const count=section==='final-assessment'?10:5;if(pool.length<count)return data;
  const key=unitKey(slug,section);const previous=data.units[key];
  if(previous?.attempt&&!previous.attempt.submitted)return data;
  const lastIds=new Set(previous?.attempt.questionIds??[]);
  // Prefer unseen-in-last-attempt items; a finite pool may repeat after intervening attempts.
  const ordered=[...shuffle(pool.filter(q=>!lastIds.has(q.id)),random),...shuffle(pool.filter(q=>lastIds.has(q.id)),random)];
  let selected=ordered.slice(0,count);
  if(section==='final-assessment'){
    // Round-robin across sections ensures a mixed assessment covers the whole lesson.
    const groups=lesson.sections.map(s=>ordered.filter(q=>s.questions.some(sq=>sq.id===q.id)));
    selected=[];for(let round=0;selected.length<count;round++)for(const group of groups){if(group[round]&&selected.length<count)selected.push(group[round]);}
    selected=shuffle(selected,random);
  }
  return {...data,units:{...data.units,[key]:{attempt:{id:globalThis.crypto.randomUUID(),questionIds:selected.map(q=>q.id),answers:{},submitted:false,startedAt:now,deadline:now+count*ITEM_MS,position:0,timing:startTiming(selected[0].id,now)},passed:previous?.passed??null,attempts:Math.min(9999,(previous?.attempts??0)+1)}}};
}
export function visitLearningQuestion(data:LearningProgress,slug:string,section:string,attemptId:string,position:number,now=Date.now()):LearningProgress{
  const key=unitKey(slug,section),unit=data.units[key],a=unit?.attempt;
  if(!a||a.submitted||a.id!==attemptId||position<0||position>=a.questionIds.length||position===(a.position??0)||a.deadline&&now>=a.deadline)return data;
  return {...data,units:{...data.units,[key]:{...unit,attempt:{...a,position,timing:a.timing?visitTiming(a.timing,a.questionIds[a.position??0],a.questionIds[position],now):undefined}}}};
}
export function saveLearningAnswer(data:LearningProgress,slug:string,section:string,attemptId:string,questionId:string,value:string,now=Date.now()):LearningProgress{
  const key=unitKey(slug,section);const unit=data.units[key];
  if(!unit||unit.attempt.submitted||unit.attempt.id!==attemptId||!unit.attempt.questionIds.includes(questionId)||value.length>500)return data;
  if(unit.attempt.deadline&&now>=unit.attempt.deadline)return data;
  if(unit.attempt.timing&&unit.attempt.questionIds[unit.attempt.position??0]!==questionId)return data;
  const q=unitQuestions(slug,section).find(q=>q.id===questionId);if(!q||(q.options&&value&&!q.options.includes(value)))return data;
  let timing=unit.attempt.timing?answerTiming(unit.attempt.timing,questionId,now):undefined;
  if(timing&&!value.trim()){timing={...timing,answerMs:{...timing.answerMs}};delete timing.answerMs[questionId];}
  return {...data,units:{...data.units,[key]:{...unit,attempt:{...unit.attempt,answers:{...unit.attempt.answers,[questionId]:value},timing}}}};
}
export function submitLearningAttempt(data:LearningProgress,slug:string,section:string,attemptId:string):LearningProgress{
  const key=unitKey(slug,section);const unit=data.units[key];if(!unit||unit.attempt.id!==attemptId||unit.attempt.submitted)return data;
  const attempt={...unit.attempt,submitted:true};const passed=gradeAttempt(attempt,unitQuestions(slug,section))>=Math.ceil(attempt.questionIds.length*.8);
  return {...data,units:{...data.units,[key]:{...unit,attempt,passed:passed?attempt:unit.passed}}};
}
export function parseLearning(raw:string|null):LearningProgress{
  const result=emptyLearning();try{
    const data=JSON.parse(raw??'null');if(data?.version!==1||data?.contentVersion!==CONTENT_VERSION||!data.units||typeof data.units!=='object')return result;
    for(const lesson of lessons)for(const section of [...lesson.sections.map(s=>s.id),'final-assessment']){
      const key=unitKey(lesson.slug,section);const item=data.units[key];if(!item||typeof item!=='object')continue;
      const pool=unitQuestions(lesson.slug,section);const ids=new Set(pool.map(q=>q.id));const count=section==='final-assessment'?10:5;
      const validate=(a:unknown):LearningAttempt|null=>{
        if(!a||typeof a!=='object')return null;const v=a as LearningAttempt;
        if(typeof v.id!=='string'||v.id.length>100||!Array.isArray(v.questionIds)||v.questionIds.length!==count||new Set(v.questionIds).size!==count||!v.questionIds.every(id=>ids.has(id))||typeof v.submitted!=='boolean'||!v.answers||typeof v.answers!=='object')return null;
        const answers:Record<string,string>={};for(const id of v.questionIds){const answer=v.answers[id];const q=pool.find(q=>q.id===id)!;if(typeof answer==='string'&&answer.length<=500&&(!q.options||q.options.includes(answer)))answers[id]=answer;}
        let timed:Partial<LearningAttempt>={};
        if(v.startedAt!==undefined||v.deadline!==undefined||v.timing!==undefined){
          if(!Number.isFinite(v.startedAt)||Number(v.startedAt)<=0||v.deadline!==Number(v.startedAt)+count*ITEM_MS||!Number.isInteger(v.position)||Number(v.position)<0||Number(v.position)>=count)return null;
          const timing=validateTiming(v.timing,v.questionIds,v.startedAt!,v.deadline!);if(!timing||timing.firstSeenAt[v.questionIds[v.position!]]===undefined)return null;
          for(const id of Object.keys(timing.answerMs))if(!answers[id]?.trim())delete timing.answerMs[id];
          timed={startedAt:v.startedAt,deadline:v.deadline,position:v.position,timing};
        }
        return {id:v.id,questionIds:v.questionIds,answers,submitted:v.submitted,...timed};
      };
      const attempt=validate(item.attempt);if(!attempt)continue;const passed=validate(item.passed);
      result.units[key]={attempt,passed:passed?.submitted&&gradeAttempt(passed,pool)>=Math.ceil(count*.8)?passed:null,attempts:Number.isInteger(item.attempts)?Math.max(1,Math.min(9999,item.attempts)):1};
    }
    for(const lesson of lessons){const section=data.last?.[lesson.slug];if(lesson.sections.some(s=>s.id===section)||section==='final-assessment')result.last[lesson.slug]=section;}
    for(const lesson of lessons)for(const section of lesson.sections){const key=unitKey(lesson.slug,section.id);const stage=data.stages?.[key];if(Number.isInteger(stage)&&stage>=0&&stage<=3)result.stages[key]=stage;}
    // A final passing result is meaningful only with passing evidence for every section.
    for(const lesson of lessons)if(!lesson.sections.every(s=>hasPassed(result,lesson.slug,s.id))){const final=result.units[unitKey(lesson.slug,'final-assessment')];if(final)final.passed=null;}
  }catch{/* Safe empty state for malformed or old browser data. */}return result;
}
