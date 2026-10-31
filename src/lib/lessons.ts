import {ohmsLawLesson} from './curriculum-electrical';
import { mathLessons } from "./curriculum-math";
import { conceptLessons } from "./curriculum-concepts";
import { abstractLesson } from './curriculum-abstract';
export type { LearningLesson as Lesson, LearningSection, LearningQuestion } from "./learning-types";
export const lessons = [...mathLessons, ohmsLawLesson, abstractLesson, ...conceptLessons];
