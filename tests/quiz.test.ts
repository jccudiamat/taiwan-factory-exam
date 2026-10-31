import test from "node:test";

import assert from "node:assert/strict";

import { questions, topics, questionMap } from "../src/lib/questions";

import { answerQuestion,visitQuestion,drillRepeatIds,MOCK_SECTIONS,createSession, completeSession, scoreSession, parseProgress, validateSession, remainingSeconds, mistakeIds, topicStats, STORAGE_KEY } from "../src/lib/quiz";



test("the question bank has unique IDs, balanced topics, and valid unambiguous choices", () => {

  assert.equal(questions.length, 125);

  assert.equal(questionMap.size, questions.length);

  for (const topic of topics) assert.equal(questions.filter((q) => q.topic === topic.id).length, 25);

  for (const q of questions) {

    assert.equal(new Set(q.options).size, 4, q.id);

    assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length, q.id);

    assert.ok(q.explanation.length > 30, q.id);

  }

});



test("a mock groups 100 questions into five 20-item sections with a 1200 second deadline", () => {

  const session = createSession("mock", 10, undefined, 1000);

  assert.equal(session.questionIds.length, 100);

  assert.equal(new Set(session.questionIds).size, 100);

  let offset=0; for(const section of MOCK_SECTIONS){assert.ok(session.questionIds.slice(offset,offset+section.count).every(id=>questionMap.get(id)!.topic===section.topic));offset+=section.count;}

  assert.equal(session.deadline, 1201000);

  assert.equal(remainingSeconds(session, 1000), 1200);

  assert.equal(remainingSeconds(session, 1201000), 0);

  assert.equal(remainingSeconds(session, 1801000), 0);

});



test("scoring includes unanswered questions in the total and never inflates the score", () => {

  const session = createSession("math", 3, ["m01", "m02", "m03"], 1000);

  session.answers = { m01: 1, m02: 0 };

  assert.equal(scoreSession(session), 1);

  const attempt = completeSession(session, 5000);

  assert.equal(attempt.score, 1); assert.equal(attempt.total, 3);

});



test("saved sessions round-trip including answers and original mock deadline", () => {

  let session = createSession("mock", 50, undefined, 1000);

  session = visitQuestion(session,7,1100); session.answers[session.questionIds[0]] = 2;

  const data = parseProgress(JSON.stringify({ version: 1, attempts: [], active: session, bookmarks: ["m01"] }));

  assert.deepEqual(data.active, session);

  assert.equal(remainingSeconds(data.active!, 101000), 1100);

  assert.ok(STORAGE_KEY.endsWith(":v1"));

});



test("corrupt, unknown-version, and invalid stored data do not crash the app", () => {

  for (const input of [null, "broken json", "null", "[]", JSON.stringify({ version: 99 })]) {

    assert.equal(parseProgress(input).attempts.length, 0); assert.equal(parseProgress(input).active, null);

  }

  const base = createSession("math", 5, undefined, 1000);

  assert.equal(validateSession({ ...base, questionIds: ["missing"] }), null);

  assert.equal(validateSession({ ...base, questionIds: ["m01", "m01"] }), null);

  assert.equal(validateSession({ ...base, scope: "invalid" }), null);

  assert.equal(validateSession({ ...base, startedAt: null }), null);

  assert.equal(validateSession({ ...base, scope: "mock", deadline: null }), null);

  assert.equal(validateSession({ ...base, scope: "mock", deadline: 9999999 }), null);

});



test("stored answer indices, bookmarks, and positions are validated", () => {

  const session = { ...visitQuestion(createSession("math", 2, ["m01", "m02"], 1000),1,1100), position: 999,

    answers: { m01: 20, m02: 2, m03: 0 }, checked: ["m01", "m02", "m03"] };

  const data = parseProgress(JSON.stringify({ version: 1, attempts: [], active: session, bookmarks: ["m01", "m01", "missing", null] }));

  assert.deepEqual(data.bookmarks, ["m01"]);

  assert.equal(data.active?.position, 1);

  assert.deepEqual(data.active?.answers, { m02: 2 });

  assert.deepEqual(data.active?.checked, ["m02"]);

});



test("completed attempts are deduplicated and scores recomputed from answers", () => {

  const session = createSession("math", 1, ["m01"], 1000);

  session.answers.m01 = 1;

  const attempt = { ...completeSession(session, 2000), score: 999 };

  const data = parseProgress(JSON.stringify({ version: 1, attempts: [attempt, attempt], active: session, bookmarks: [] }));

  assert.equal(data.attempts.length, 1); assert.equal(data.attempts[0].score, 1); assert.equal(data.active, null);

});



test("mistake review uses the latest answer and correct reattempts clear mistakes", () => {

  const first = createSession("math", 2, ["m01", "m02"], 1000);

  first.answers = { m01: 0, m02: 2 };

  const attemptA = completeSession(first, 2000);

  const second = createSession("math", 1, ["m01"], 3000);

  second.answers = { m01: 1 };

  const attemptB = completeSession(second, 4000);

  assert.deepEqual(mistakeIds([attemptA]), ["m01"]);

  assert.deepEqual(mistakeIds([attemptB, attemptA]), []);

  assert.deepEqual(topicStats([attemptA, attemptB], "math"), { answered: 3, correct: 2, accuracy: 67 });

});



test("custom review pools ignore missing IDs and cannot repeat questions", () => {

  const session = createSession("saved", 10, ["m01", "m01", "missing", "e01"]);

  assert.equal(session.questionIds.length, 2);

  assert.equal(session.deadline! - session.startedAt, 20000);

  assert.equal(remainingSeconds(session,session.startedAt), 20);

});



test("an exhausted review pool cannot create an empty active session", () => {

  assert.throws(() => createSession("mistakes", 10, []), /at least one/);

  assert.throws(() => createSession("saved", 10, ["missing"]), /at least one/);

  assert.throws(() => createSession("math", 0), /at least one/);

});

