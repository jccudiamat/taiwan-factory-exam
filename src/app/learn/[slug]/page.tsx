import {notFound} from "next/navigation";
import {lessons} from "@/lib/lessons";
import {pageMetadata} from "@/lib/seo";
import {LessonOverview} from "@/components/learning-ui";
export const dynamicParams=false;
export function generateStaticParams(){return lessons.map(l=>({slug:l.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const lesson=lessons.find(l=>l.slug===slug);return lesson?pageMetadata(`/learn/${slug}/`,{title:`${lesson.title}: Lessons & Assessments`,description:lesson.description}):{};}
export default async function LearningLessonPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!lessons.some(l=>l.slug===slug))notFound();return <LessonOverview slug={slug}/>;}
