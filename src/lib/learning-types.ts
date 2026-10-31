import type {AbstractDiagram} from './abstract-content';
export type LearningQuestion = { id: string; prompt: string; options?: string[]; answer: string; hint: string; steps: string[]; diagram?:AbstractDiagram };
export type LearningSection = {
  id: string; title: string; objective: string;
  teaching: { title: string; paragraphs: string[] }[];
  examples: { prompt: string; steps: string[]; answer: string; diagram?:AbstractDiagram }[];
  misconception: string; questions: LearningQuestion[];
};
export type LearningLesson = { slug: string; title: string; description: string; subject: string; practice: string; sections: LearningSection[] };
