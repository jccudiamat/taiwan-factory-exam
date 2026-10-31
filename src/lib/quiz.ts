import { questions, questionMap, topics, type Scope, type TopicId } from "./questions";
import { answerTiming, ITEM_MS, startTiming, validateTiming, visitTiming, type AnswerTiming } from './answer-timing';
export const MOCK_COUNT=100;
export const MOCK_SECONDS_PER_ITEM=12;
export const MOCK_PASS_PERCENT=90;
export const MOCK_SECTIONS = [{topic:'math',count:20},{topic:'english',count:20},{topic:'reasoning',count:20},{topic:'abstract',count:20},{topic:'detail',count:20}] as const;

export type Session = {
  id: string;
  scope: Scope;
  questionIds: string[];
  answers: Record<string, number>;
  checked: string[];
  position: number;
  startedAt: number;
  deadline: number | null;
  engineVersion?: 2|3;
  timing?: AnswerTiming;
};
export type Attempt = Session & { completedAt: number; score: number; total: number };
export type Progress = { version: 1; attempts: Attempt[]; bookmarks: string[]; active: Session | null };
export const emptyProgress: Progress = { version: 1, attempts: [], bookmarks: [], active: null };
export const STORAGE_KEY = "taiwan-factory-exam:v1";

export function shuffled<T>(items: readonly T[], random = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function createSession(scope: Scope, count = 10, ids?: string[], now = Date.now()): Session {
  let pool: string[];
  if (ids) pool = shuffled([...new Set(ids)].filter((id) => questionMap.has(id)));
  else if (scope === "mock") {
    pool = MOCK_SECTIONS.flatMap(section => shuffled(questions.filter(q => q.topic === section.topic)).slice(0,section.count).map(q => q.id));
  } else pool = shuffled(questions.filter((q) => scope === "mixed" || q.topic === scope).map((q) => q.id));
  if (pool.length === 0 || count < 1) throw new Error("A practice session needs at least one available question.");
  const questionIds = pool.slice(0, scope === 'mock' ? MOCK_COUNT : count);
  if(scope==='mock'&&(ids||questionIds.length!==MOCK_COUNT))throw new Error('A mock needs 100 distinct questions in five complete sections.');
  return {
    id: globalThis.crypto.randomUUID(), scope,
    questionIds,
    answers: {}, checked: [], position: 0, startedAt: now,
    deadline: now + questionIds.length * (scope==='mock'?MOCK_SECONDS_PER_ITEM*1000:ITEM_MS), engineVersion:3, timing:startTiming(questionIds[0],now),
  };
}

export function visitQuestion(session:Session, position:number, now=Date.now()):Session {
  if(position<0||position>=session.questionIds.length||position===session.position||session.deadline!==null&&now>=session.deadline)return session;
  return {...session,position,timing:session.timing?visitTiming(session.timing,session.questionIds[session.position],session.questionIds[position],now):undefined};
}
export function answerQuestion(session:Session, answer:number, now=Date.now()):Session {
  const id=session.questionIds[session.position];
  if(!Number.isInteger(answer)||answer<0||answer>=questionMap.get(id)!.options.length||session.deadline!==null&&now>=session.deadline)return session;
  // Legacy checked IDs must not lock resumed practice. Only the total deadline
  // closes answers; timing records exposure until the learner's final selection.
  return {...session,answers:{...session.answers,[id]:answer},
    timing:session.timing?answerTiming(session.timing,id,now):undefined};
}
export function drillRepeatIds(attempt:Attempt):string[] {
  return attempt.questionIds.filter(id=>attempt.answers[id]!==questionMap.get(id)?.answer||attempt.timing?.answerMs[id]!==undefined&&attempt.timing.answerMs[id]>=ITEM_MS);
}

export function scoreSession(session: Session): number {
  return session.questionIds.reduce((sum, id) => sum + (session.answers[id] === questionMap.get(id)?.answer ? 1 : 0), 0);
}
export function meetsMockPassMark(session:Session){return session.scope==='mock'&&scoreSession(session)>=Math.ceil(session.questionIds.length*MOCK_PASS_PERCENT/100);}
export function completeSession(session: Session, now = Date.now()): Attempt {
  return { ...session, completedAt: Math.max(session.startedAt,Math.min(now,session.deadline??now)), score: scoreSession(session), total: session.questionIds.length };
}
export function remainingSeconds(session: Session, now = Date.now()): number | null {
  return session.deadline === null ? null : Math.max(0, Math.ceil((session.deadline - now) / 1000));
}
export function formatTime(seconds: number): string {
  return `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
}
export function mistakeIds(attempts: Attempt[]): string[] {
  const latest = new Map<string, boolean>();
  for (const attempt of [...attempts].sort((a, b) => a.completedAt - b.completedAt)) {
    for (const id of attempt.questionIds) latest.set(id, attempt.answers[id] === questionMap.get(id)?.answer);
  }
  return [...latest].filter(([, correct]) => !correct).map(([id]) => id);
}
export function topicStats(attempts: Attempt[], topic: TopicId) {
  let answered = 0; let correct = 0;
  for (const attempt of attempts) for (const id of attempt.questionIds) {
    const q = questionMap.get(id);
    if (q?.topic === topic) { answered++; if (attempt.answers[id] === q.answer) correct++; }
  }
  return { answered, correct, accuracy: answered ? Math.round(correct / answered * 100) : null };
}

function isRecord(value: unknown): value is Record<string, unknown> { return !!value && typeof value === "object" && !Array.isArray(value); }
const scopes: string[] = [...topics.map((t) => t.id), "mixed", "mock", "mistakes", "saved"];
export function validateSession(value: unknown): Session | null {
  if (!isRecord(value) || typeof value.id !== "string" || value.id.length > 100 || !scopes.includes(String(value.scope))) return null;
  if (!Array.isArray(value.questionIds) || !value.questionIds.length || value.questionIds.length > questions.length) return null;
  const ids = value.questionIds;
  if (!ids.every((id): id is string => typeof id === "string" && questionMap.has(id)) || new Set(ids).size !== ids.length) return null;
  if (!isRecord(value.answers) || !Array.isArray(value.checked)) return null;
  const answers: Record<string, number> = {};
  const rejectedAnswers=new Set<string>();
  for (const [id, answer] of Object.entries(value.answers)) {
    if (ids.includes(id) && Number.isInteger(answer) && Number(answer) >= 0 && Number(answer) <= 3) answers[id] = Number(answer);
    else rejectedAnswers.add(id);
  }
  if (!Number.isFinite(value.startedAt) || Number(value.startedAt) <= 0) return null;
  const mock = value.scope === "mock"; const timed=value.engineVersion===2||value.engineVersion===3;
  // Never accept a saved mock without its original time boundary.
  const perItem=value.engineVersion===3&&mock?MOCK_SECONDS_PER_ITEM*1000:ITEM_MS;
  if (timed && Number(value.deadline)!==Number(value.startedAt)+ids.length*perItem) return null;
  if(value.engineVersion===3&&mock){let offset=0;if(ids.length!==MOCK_COUNT)return null;for(const section of MOCK_SECTIONS){if(!ids.slice(offset,offset+section.count).every(id=>questionMap.get(id)?.topic===section.topic))return null;offset+=section.count;}}
  if (!timed && mock && (!Number.isFinite(value.deadline) || Number(value.deadline) !== Number(value.startedAt) + 1_200_000)) return null;
  if (value.engineVersion!==undefined&&!timed)return null;
  const timing=timed?validateTiming(value.timing,ids,Number(value.startedAt),Number(value.deadline)):null;
  if(timed&&!timing)return null;
  const position=Math.max(0, Math.min(ids.length - 1, Number.isInteger(value.position) ? Number(value.position) : 0));
  if(timing&&timing.firstSeenAt[ids[position]]===undefined)return null;
  if(timing)for(const id of Object.keys(timing.answerMs))if(answers[id]===undefined)delete timing.answerMs[id];
  return { id: value.id, scope: value.scope as Scope, questionIds: ids, answers,
    checked: [...new Set(value.checked.filter((id): id is string => typeof id === "string" && ids.includes(id) && (timed ? !rejectedAnswers.has(id) : answers[id] !== undefined)))],
    position,
    startedAt: Number(value.startedAt), deadline: timed||mock ? Number(value.deadline) : null,
    ...(timed?{engineVersion:value.engineVersion as 2|3,timing:timing!}:{}) };
}

export function parseProgress(raw: string | null): Progress {
  if (!raw) return { ...emptyProgress };
  try {
    const data: unknown = JSON.parse(raw);
    if (!isRecord(data) || data.version !== 1) return { ...emptyProgress };
    const attempts: Attempt[] = [];
    const seen = new Set<string>();
    if (Array.isArray(data.attempts)) for (const item of data.attempts.slice(0, 100)) {
      const session = validateSession(item);
      if (session && isRecord(item) && Number.isFinite(item.completedAt) && Number(item.completedAt) >= session.startedAt && !seen.has(session.id)) {
        attempts.push(completeSession(session, Number(item.completedAt))); seen.add(session.id);
      }
    }
    const active = validateSession(data.active);
    return { version: 1, attempts,
      bookmarks: Array.isArray(data.bookmarks) ? [...new Set(data.bookmarks.filter((id): id is string => typeof id === "string" && questionMap.has(id)))] : [],
      active: active && !seen.has(active.id) ? active : null };
  } catch { return { ...emptyProgress }; }
}
