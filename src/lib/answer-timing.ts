export const ITEM_SECONDS = 10;
export const ITEM_MS = ITEM_SECONDS * 1000;
export type AnswerTiming = {
  enteredAt: number;
  firstSeenAt: Record<string, number>;
  spentMs: Record<string, number>;
  answerMs: Record<string, number>;
};
export function startTiming(id: string, now: number): AnswerTiming {
  return { enteredAt: now, firstSeenAt: { [id]: now }, spentMs: {}, answerMs: {} };
}
export function exposureMs(timing: AnswerTiming, id: string, now: number) {
  return (timing.spentMs[id] ?? 0) + Math.max(0, now - timing.enteredAt);
}
export function visitTiming(timing: AnswerTiming, previous: string, next: string, now: number): AnswerTiming {
  return { ...timing, enteredAt: now,
    spentMs: { ...timing.spentMs, [previous]: exposureMs(timing, previous, now) },
    firstSeenAt: { ...timing.firstSeenAt, [next]: timing.firstSeenAt[next] ?? now } };
}
export function answerTiming(timing: AnswerTiming, id: string, now: number): AnswerTiming {
  return { ...timing, answerMs: { ...timing.answerMs, [id]: exposureMs(timing, id, now) } };
}
// Aggregate individual answers, never averages of session averages. Old untimed records stay excluded.
export function timingStats(items: { questionIds: string[]; timing?: AnswerTiming }[], include?: (id: string) => boolean) {
  const values = items.flatMap(item => item.questionIds.filter(id => !include || include(id))
    .flatMap(id => item.timing?.answerMs[id] === undefined ? [] : [item.timing.answerMs[id]]));
  return { count: values.length, average: values.length ? values.reduce((a,b) => a+b,0) / values.length / 1000 : null };
}
export function formatAnswerTime(seconds: number | null) { return seconds === null ? '—' : `${seconds.toFixed(1)} s`; }
export function validateTiming(value: unknown, ids: string[], start: number, end: number): AnswerTiming | null {
  if (!value || typeof value !== 'object') return null;
  const t = value as AnswerTiming;
  if (!Number.isFinite(t.enteredAt) || t.enteredAt < start || t.enteredAt > end) return null;
  const clean = (map: unknown, timestamps = false): Record<string,number> | null => {
    if (!map || typeof map !== 'object' || Array.isArray(map)) return null;
    const result: Record<string,number> = {};
    for (const [id,n] of Object.entries(map)) {
      if (!ids.includes(id) || !Number.isFinite(n) || n < (timestamps ? start : 0) || n > (timestamps ? end : end-start)) return null;
      result[id] = n;
    }
    return result;
  };
  const firstSeenAt = clean(t.firstSeenAt,true), spentMs = clean(t.spentMs), answerMs = clean(t.answerMs);
  return firstSeenAt && spentMs && answerMs && Object.keys(answerMs).every(id => firstSeenAt[id] !== undefined)
    ? { enteredAt:t.enteredAt, firstSeenAt, spentMs, answerMs } : null;
}
