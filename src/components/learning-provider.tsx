'use client';
import {createContext,useCallback,useContext,useEffect,useRef,useState,type ReactNode} from 'react';
import {emptyLearning,LEARNING_KEY,parseLearning,submitLearningAttempt,type LearningProgress} from '@/lib/learning-progress';
type Store={data:LearningProgress;ready:boolean;storageIssue:boolean;update:(fn:(p:LearningProgress)=>LearningProgress)=>void};
const Context=createContext<Store|null>(null);
export function LearningProvider({children}:{children:ReactNode}){
  const [data,setData]=useState(emptyLearning);const current=useRef(data);const [ready,setReady]=useState(false);const [storageIssue,setIssue]=useState(false);
  const memoryOnly=useRef(false);
  useEffect(()=>{try{current.current=parseLearning(localStorage.getItem(LEARNING_KEY));setData(current.current);}catch{setIssue(true);}setReady(true);
    const sync=(e:StorageEvent)=>{if(e.key===LEARNING_KEY||e.key===null){current.current=parseLearning(e.newValue);setData(current.current);}};window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync);
  },[]);
  const update=useCallback((fn:(p:LearningProgress)=>LearningProgress)=>{let prior=current.current;if(!memoryOnly.current)try{const raw=localStorage.getItem(LEARNING_KEY);if(raw)prior=parseLearning(raw);}catch{memoryOnly.current=true;}const next=fn(prior);current.current=next;setData(next);try{localStorage.setItem(LEARNING_KEY,JSON.stringify(next));memoryOnly.current=false;setIssue(false);}catch{memoryOnly.current=true;setIssue(true);}},[]);
  useEffect(()=>{if(!ready)return;const sweep=()=>{if(!Object.values(current.current.units).some(u=>!u.attempt.submitted&&u.attempt.deadline&&Date.now()>=u.attempt.deadline))return;update(p=>{let next=p;for(const [key,u] of Object.entries(p.units))if(!u.attempt.submitted&&u.attempt.deadline&&Date.now()>=u.attempt.deadline){const [slug,section]=key.split('/');next=submitLearningAttempt(next,slug,section,u.attempt.id);}return next;});};sweep();const id=window.setInterval(sweep,250);document.addEventListener('visibilitychange',sweep);return()=>{clearInterval(id);document.removeEventListener('visibilitychange',sweep);};},[ready,update]);
  return <Context.Provider value={{data,ready,storageIssue,update}}>{storageIssue?<p className="storage-warning" role="status">Your browser cannot save lesson progress. You can learn in this tab, but assessments and completion may reset after refresh.</p>:null}{children}</Context.Provider>;
}
export function useLearning(){const value=useContext(Context);if(!value)throw new Error('LearningProvider missing');return value;}
