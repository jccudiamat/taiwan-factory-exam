import {AbstractDiagram} from '@/components/abstract-diagram';
import {notFound} from 'next/navigation';
import {lessons} from '@/lib/lessons';
import {pageMetadata} from '@/lib/seo';
import {FinalLearning,SectionLearning} from '@/components/learning-ui';
import {LessonVideos} from '@/components/lesson-videos';
export const dynamicParams=false;
export function generateStaticParams(){return lessons.flatMap(l=>[...l.sections.map(s=>({slug:l.slug,section:s.id})),{slug:l.slug,section:'final-assessment'}]);}
export async function generateMetadata({params}:{params:Promise<{slug:string;section:string}>}){const {slug,section}=await params;const lesson=lessons.find(l=>l.slug===slug);const item=lesson?.sections.find(s=>s.id===section);if(!lesson)return{};return pageMetadata(`/learn/${slug}/${section}/`,{title:section==='final-assessment'?`${lesson.title}: Final Assessment`:item?.title,description:item?.objective??`Check your understanding of ${lesson.title.toLowerCase()} with a mixed learning assessment.`});}
export default async function LearningSectionPage({params}:{params:Promise<{slug:string;section:string}>}){
  const {slug,section:id}=await params;const lesson=lessons.find(l=>l.slug===slug);if(!lesson)notFound();
  if(id==='final-assessment')return <FinalLearning key={slug} slug={slug}/>;
  const section=lesson.sections.find(s=>s.id===id);if(!section)notFound();
  return <SectionLearning key={`${slug}/${id}`} slug={slug} sectionId={id} videos={<LessonVideos sectionId={id} title={section.title}/> }>
    <div className="learning-teaching">{section.teaching.map(block=><section key={block.title}><h2>{block.title}</h2>{block.paragraphs.map(p=><p key={p}>{p}</p>)}</section>)}
    <section><h2>Step-by-step worked examples</h2>{section.examples.map(example=><div className="learning-example" key={example.prompt}><h3>{example.prompt}</h3><AbstractDiagram diagram={example.diagram}/><ol>{example.steps.map((step,i)=><li key={i}>{step}</li>)}</ol><p><strong>Answer: {example.answer}</strong></p></div>)}</section>
    <section className="learning-misconception"><h2>Common mistake to avoid</h2><p>{section.misconception}</p></section>
    {slug==='ohms-law'?<p className="section-note">Concept reference: <a href="https://openstax.org/books/college-physics-2e/pages/20-2-ohms-law-resistance-and-simple-circuits">OpenStax: Ohm’s law and simple circuits</a> and <a href="https://openstax.org/books/college-physics-2e/pages/20-4-electric-power-and-energy">electric power and energy</a>. Teaching, examples, and questions here are original educational exercises.</p>:null}
    {slug==='five-s'?<p className="section-note">Further reading: <a href="https://www.epa.gov/sustainability/lean-thinking-and-methods-5s">US EPA: 5S workplace organization</a>.</p>:null}
    </div>
  </SectionLearning>;
}
