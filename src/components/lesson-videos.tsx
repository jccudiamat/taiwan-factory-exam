import {LessonVideoPlayer} from './lesson-video';
import {sectionVideos} from '@/lib/lesson-videos';

export function LessonVideos({sectionId,title}:{sectionId:string;title:string}){
  const videos=sectionVideos(sectionId);
  if(!videos.length)return null;
  return <section className="lesson-videos" aria-labelledby={`videos-${sectionId}`}><h2 id={`videos-${sectionId}`}>Video explanation: {title}</h2><p className="section-note">Optional extra study. Pause to solve the examples on paper, then try this section’s practice questions. Watching does not count as assessment completion.</p>{videos.map(({video,focus})=><LessonVideoPlayer key={video.id} video={video} focus={focus}/>)}<p className="section-note">Players are shown by default. Press Play to watch, or close the player above. YouTube’s own privacy practices apply when its preview loads. Videos may include ads or course promotions.</p></section>;
}
