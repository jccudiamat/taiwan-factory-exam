import { questions, questionMap, topics, type TopicId } from './questions';

export const DAILY_KEY = 'taiwan-factory-exam:daily:v1';
export type DailySample = { questionId: string | null; seen: string[]; selected: number | null; answeredOn: string | null };
export type DailySamples = { version: 1; topics: Partial<Record<TopicId, DailySample>> };
export function philippineDate(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  return ['year', 'month', 'day'].map(type => parts.find(p => p.type === type)!.value).join('-');
}
function validDate(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0,10) === value;
}
export function parseDailySamples(raw: string | null): DailySamples {
  const result: DailySamples = { version: 1, topics: {} };
  try {
    const data = JSON.parse(raw ?? 'null');
    if (data?.version !== 1 || !data.topics || typeof data.topics !== 'object') return result;
    for (const topic of topics) {
      const item = data.topics[topic.id];
      if (!item || typeof item !== 'object') continue;
      const seen = Array.isArray(item.seen) ? [...new Set<string>(item.seen.filter((id: unknown) => typeof id === 'string' && questionMap.get(id)?.topic === topic.id))] : [];
      const questionId = typeof item.questionId === 'string' && questionMap.get(item.questionId)?.topic === topic.id ? item.questionId : null;
      if (questionId && !seen.includes(questionId)) seen.push(questionId);
      const selected = questionId && Number.isInteger(item.selected) && item.selected >= 0 && item.selected < 4 ? item.selected : null;
      result.topics[topic.id] = { questionId, seen, selected, answeredOn: selected !== null && validDate(item.answeredOn) ? item.answeredOn : null };
    }
  } catch { /* Invalid browser data is discarded, never executed. */ }
  return result;
}
export function reconcileDailySamples(state: DailySamples, today = philippineDate(), random = Math.random): DailySamples {
  const next: DailySamples = { version: 1, topics: { ...state.topics } };
  for (const topic of topics) {
    const previous = next.topics[topic.id];
    if (previous?.questionId && (!previous.answeredOn || previous.answeredOn >= today)) continue;
    const seen = previous?.seen ?? [];
    const pool = questions.filter(q => q.topic === topic.id && !seen.includes(q.id));
    const questionId = pool.length ? pool[Math.min(pool.length - 1, Math.floor(random() * pool.length))].id : null;
    next.topics[topic.id] = { questionId, seen: questionId ? [...seen, questionId] : [...seen], selected: null, answeredOn: null };
  }
  return next;
}
export function answerDailySample(state: DailySamples, topic: TopicId, questionId: string, option: number, today = philippineDate()): DailySamples {
  const sample = state.topics[topic];
  if (!sample || sample.questionId !== questionId || sample.answeredOn || !Number.isInteger(option) || option < 0 || option > 3) return state;
  return { ...state, topics: { ...state.topics, [topic]: { ...sample, selected: option, answeredOn: today } } };
}
