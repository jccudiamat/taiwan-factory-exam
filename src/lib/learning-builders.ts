import type { LearningQuestion, LearningSection } from './learning-types';
export type SectionCopy = Omit<LearningSection, 'questions'>;
export function numericSection(copy: SectionCopy, make: (n: number) => Omit<LearningQuestion, 'id'>): LearningSection {
  return { ...copy, questions: Array.from({length: 18}, (_, i) => ({ ...make(i + 2), id: `${copy.id}-${i}` })) };
}
export type Case = [prompt: string, correct: string, wrong: [string,string,string], reasoning: string];
export function conceptSection(copy: SectionCopy, cases: Case[]): LearningSection {
  return { ...copy, questions: cases.flatMap(([prompt, answer, wrong, reasoning], i) => [
    { id: `${copy.id}-${i}-apply`, prompt, options: [answer, ...wrong].map((_,j,all)=>all[(j+i)%all.length]), answer, hint: copy.objective, steps: [reasoning] },
    { id: `${copy.id}-${i}-explain`, prompt: `Check a learner’s response. Question: ${prompt} Their response: “${i%2?answer:wrong[0]}”. Is that response correct?`, options: ['Correct','Incorrect'], answer: i%2?'Correct':'Incorrect', hint: 'Compare the response with the exact instruction, definition, or evidence.', steps: [reasoning, `The supported answer to the original question is: ${answer}.`] },
  ]) };
}
