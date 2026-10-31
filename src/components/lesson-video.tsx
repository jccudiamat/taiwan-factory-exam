'use client';

import {useId,useState} from 'react';
import {ExternalLink,Play,X} from 'lucide-react';
import type {LessonVideo} from '@/lib/lesson-videos';

export function LessonVideoPlayer({video,focus}:{video:LessonVideo;focus:string}){
  const [open,setOpen]=useState(true);
  const playerId=useId();
  const url=`https://www.youtube.com/watch?v=${video.id}`;
  return <article className="lesson-video">
    <div className="lesson-video-heading"><Play size={23} strokeWidth={1.7} aria-hidden="true"/><div><h3><a href={url} target="_blank" rel="noopener noreferrer">{video.title}</a></h3><p className="lesson-video-source">{video.channel} · YouTube</p></div></div>
    <p>{focus}</p>
    <div className="button-row"><button type="button" className="button button-small button-secondary" aria-expanded={open} aria-controls={playerId} onClick={()=>setOpen(!open)}>{open?<X size={16} aria-hidden="true"/>:<Play size={16} aria-hidden="true"/>}{open?'Close video player':'Show video player'}</button><a className="text-link" href={url} target="_blank" rel="noopener noreferrer">Open on YouTube<ExternalLink size={15} aria-hidden="true"/><span className="sr-only"> (opens a new tab)</span></a></div>
    <div id={playerId} hidden={!open}>{open?<><iframe className="lesson-video-player" width="560" height="315" src={`https://www.youtube-nocookie.com/embed/${video.id}?playsinline=1&rel=0`} title={`${video.title} — ${video.channel}`} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen/><p className="section-note">If the player is unavailable, use “Open on YouTube” above.</p></>:null}</div>
  </article>;
}
