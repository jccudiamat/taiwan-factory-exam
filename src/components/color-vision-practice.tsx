'use client';
import Image from 'next/image';
import {useEffect,useRef,useState} from 'react';
import {ishiharaPlates,OTHER_PATH} from '@/lib/ishihara';

export function ColorVisionPractice(){
  const [index,setIndex]=useState(0);
  const [answer,setAnswer]=useState('');
  const [detail,setDetail]=useState('');
  const [observations,setObservations]=useState<string[]>([]);
  const [imageState,setImageState]=useState<'loading'|'ready'|'error'>('loading');
  const heading=useRef<HTMLHeadingElement>(null);
  const done=index===ishiharaPlates.length;
  const plate=ishiharaPlates[index];
  useEffect(()=>{if(index)heading.current?.focus({preventScroll:true});},[index]);
  function record(value:string){
    if(imageState!=='ready'||!value.trim())return;
    setObservations(previous=>[...previous,value.trim()]);
    setIndex(index+1);setAnswer('');setDetail('');setImageState('loading');
  }
  function reset(){setIndex(0);setAnswer('');setDetail('');setObservations([]);setImageState('loading');}
  if(done)return <section className="color-exercise"><h2 ref={heading} tabIndex={-1}>Your 28-plate observation summary</h2><p>You completed {ishiharaPlates.length} items. These observations and reference readings are for familiarization only. No clinical score, diagnosis, or employment passing result is calculated.</p><ol className="color-observations">{observations.map((value,i)=><li key={ishiharaPlates[i].plate}><strong>Item {i+1} · Source plate {ishiharaPlates[i].plate}</strong><p>Your observation: {value}</p><p>Reference reading: {ishiharaPlates[i].reference}.</p></li>)}</ol><p>Different readings on a screen cannot establish the presence or type of a color-vision deficiency. Speak with an eye-care professional if you have concerns.</p><button className="button" onClick={reset}>View the 28 plates again</button></section>;
  return <section className="color-exercise" aria-labelledby="color-heading"><div className="section-heading"><h2 ref={heading} tabIndex={-1} id="color-heading">Ishihara plate familiarization</h2><span>Item {index+1} of {ishiharaPlates.length}</span></div><progress value={index} max={ishiharaPlates.length} aria-label={`${index} of ${ishiharaPlates.length} observations recorded`}/><p>{plate.kind==='path'?'Follow the lines between the edge marks, then choose the description closest to what you see. Choose “Another pattern” if you need to describe something different.':'Enter the numeral you see. If no numeral is visible, choose “No number or path visible”.'}</p>
    <Image key={plate.plate} className="color-plate" src={plate.src} width={400} height={400} unoptimized loading="eager" alt={`Ishihara dot plate for item ${index+1}; ${plate.kind==='path'?'path observation':'number observation'}`} onLoad={()=>setImageState('ready')} onError={()=>setImageState('error')}/>
    {imageState==='error'?<p role="alert">The plate could not load. Reload this page to restart; no observations have been saved.</p>:imageState==='loading'?<p role="status">Loading plate…</p>:null}
    <form onSubmit={event=>{event.preventDefault();record(answer===OTHER_PATH?`Another pattern: ${detail.trim()}`:answer);}}>
      {plate.choices?<><fieldset className="color-path-options" disabled={imageState!=='ready'}><legend>What pattern can you follow?</legend>{plate.choices.map(choice=><label className={`color-path-option ${answer===choice?'selected':''}`} key={choice}><input type="radio" name="plate-pattern" value={choice} checked={answer===choice} onChange={()=>setAnswer(choice)}/><span>{choice}</span></label>)}</fieldset>{answer===OTHER_PATH?<><label htmlFor="plate-detail">Describe the pattern you see</label><input id="plate-detail" className="text-input" name="plate-detail" value={detail} onChange={event=>setDetail(event.target.value)} maxLength={100} autoComplete="off" required disabled={imageState!=='ready'}/></>:null}</>:<><label htmlFor="plate-answer">What can you see?</label><input className="text-input" id="plate-answer" name="plate-observation" value={answer} onChange={event=>setAnswer(event.target.value)} maxLength={100} autoComplete="off" disabled={imageState!=='ready'}/></>}
      <div className="button-row"><button className="button" type="submit" disabled={!answer.trim()||(answer===OTHER_PATH&&!detail.trim())||imageState!=='ready'}>{index===ishiharaPlates.length-1?'Finish and view observations':'Record and continue'}</button>{!plate.choices?<><button className="button button-secondary" type="button" disabled={imageState!=='ready'} onClick={()=>record('No number or path visible')}>No number or path visible</button><button className="text-button" type="button" disabled={imageState!=='ready'} onClick={()=>record('I can’t tell')}>I can’t tell</button></>:null}</div></form><p className="section-note">Reference readings appear after all 28 items. Record what you see without searching for answers. Responses are kept only while this page remains open.</p></section>;
}
