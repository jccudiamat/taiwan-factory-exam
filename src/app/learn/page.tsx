import {PageHeader} from "@/components/page-header";
import {pageMetadata} from "@/lib/seo";
import {LearningCatalog} from "@/components/learning-ui";
export const metadata=pageMetadata("/learn/",{title:"Taiwan Factory Exam Lessons, Practice & Assessments",description:"Study factory exam math, PEMDAS, Ohm’s law, English, reasoning, visual checking and 5S through detailed sections, guided practice, and assessments with saved lesson progress."});
export default function LearnPage(){return <><PageHeader path="/learn/" className="page-heading"><h1>Taiwan Factory Exam Lessons & Solutions</h1><p>Learn each skill in focused sections, practise with explanations, and pass assessments to track your understanding.</p></PageHeader><p className="learning-catalog-note">Open any section directly, or follow the guided order. Progress includes passed section assessments and a final mixed assessment for each lesson. Saved only in this browser.</p><LearningCatalog/></>;}
