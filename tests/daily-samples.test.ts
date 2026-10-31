import test from 'node:test';
import assert from 'node:assert/strict';
import { topics, questionMap } from '../src/lib/questions';
import { answerDailySample, parseDailySamples, philippineDate, reconcileDailySamples } from '../src/lib/daily-samples';
const firstDay = '2026-10-30';
const initial = () => reconcileDailySamples(parseDailySamples(null), firstDay, () => 0);

test('Philippine midnight is the daily boundary regardless of device timezone', () => {
  assert.equal(philippineDate(new Date('2026-10-30T15:59:59Z')), '2026-10-30');
  assert.equal(philippineDate(new Date('2026-10-30T16:00:00Z')), '2026-10-31');
});
test('each topic gets one sample and unanswered selections survive refresh and many days', () => {
  const state = initial();
  for (const t of topics) assert.equal(questionMap.get(state.topics[t.id]!.questionId!)!.topic, t.id);
  state.topics.math!.selected = 2;
  const restored = parseDailySamples(JSON.stringify(state));
  assert.deepEqual(restored, state);
  assert.deepEqual(reconcileDailySamples(restored, '2026-12-01'), state);
});
test('submitted answers lock on the same day and advance only answered topics the next day', () => {
  const state = initial(); const id = state.topics.math!.questionId!;
  const answered = answerDailySample(state, 'math', id, 0, firstDay);
  assert.deepEqual(answerDailySample(answered, 'math', id, 1, firstDay), answered);
  assert.deepEqual(reconcileDailySamples(answered, firstDay), answered);
  const next = reconcileDailySamples(parseDailySamples(JSON.stringify(answered)), '2026-10-31', () => 0);
  assert.notEqual(next.topics.math!.questionId, id);
  assert.equal(next.topics.math!.selected, null);
  assert.equal(next.topics.math!.answeredOn, null);
  for (const t of topics.filter(t => t.id !== 'math')) assert.deepEqual(next.topics[t.id], state.topics[t.id]);
});
test('a carried question unlocks based on the day it is answered, not assigned', () => {
  const carried = reconcileDailySamples(initial(), '2026-11-08');
  const id = carried.topics.english!.questionId!;
  const answered = answerDailySample(carried, 'english', id, 2, '2026-11-08');
  assert.equal(reconcileDailySamples(answered, '2026-11-08').topics.english!.questionId, id);
  assert.notEqual(reconcileDailySamples(answered, '2026-11-09').topics.english!.questionId, id);
});
test('daily samples never repeat and report exhaustion instead of recycling questions', () => {
  let state = initial(); const used = new Set<string>();
  for (let day = 0; day < 25; day++) {
    const date = new Date(Date.UTC(2026, 9, 30 + day)).toISOString().slice(0,10);
    state = reconcileDailySamples(state, date, () => 0);
    for (const t of topics) {
      const id = state.topics[t.id]!.questionId!;
      assert.ok(id); assert.ok(!used.has(id)); used.add(id);
      state = answerDailySample(state, t.id, id, 0, date);
    }
  }
  const exhausted = reconcileDailySamples(state, '2026-12-01');
  assert.equal(used.size, topics.length*25);
  for (const t of topics) assert.equal(exhausted.topics[t.id]!.questionId, null);
  assert.deepEqual(reconcileDailySamples(exhausted, '2026-12-02'), exhausted);
});
test('corrupt data, invalid answers and stale question actions cannot break daily samples', () => {
  for (const value of ['null','[]','bad','{"version":99}', '{"version":1,"topics":{"math":{"seen":[null,"e01","missing"],"questionId":"e01","selected":99,"answeredOn":"2026-02-31"}}}']) {
    const state = reconcileDailySamples(parseDailySamples(value), firstDay, () => 0);
    assert.equal(questionMap.get(state.topics.math!.questionId!)!.topic, 'math');
    assert.equal(state.topics.math!.answeredOn, null);
  }
  const state = initial();
  assert.deepEqual(answerDailySample(state, 'math', 'missing', 0, firstDay), state);
  assert.deepEqual(answerDailySample(state, 'math', state.topics.math!.questionId!, 4, firstDay), state);
});
