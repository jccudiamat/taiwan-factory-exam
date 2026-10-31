'use client';

import {useEffect,useId,useState} from 'react';
import {Check,Facebook,Link2} from 'lucide-react';
import {facebookShareUrl,hasPageSharing,isLocalShareUrl,pageShareUrl} from '@/lib/sharing';

export function PublicPageShare({path}:{path:string}){
  return hasPageSharing(path)?<PageShare key={path} path={path}/>:null;
}

export function PageShare({path,label='Share this page'}:{path:string;label?:string}){
  const [url,setUrl]=useState<string|null>(null);
  const [busy,setBusy]=useState(false);
  const [notice,setNotice]=useState('');
  const [manual,setManual]=useState(false);
  const localHint=useId();
  useEffect(()=>{
    const configured=process.env.NEXT_PUBLIC_SITE_URL;
    setUrl((configured&&pageShareUrl(path,configured))||pageShareUrl(path,window.location.origin));
    setNotice('');setManual(false);
  },[path]);
  const local=!!url&&isLocalShareUrl(url);
  async function copy(){
    if(!url)return;
    setBusy(true);setNotice('');
    try{
      if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(url);setManual(false);setNotice('Link copied.');
    }catch{setManual(true);setNotice('Automatic copying is unavailable. Select and copy the link below.');}
    finally{setBusy(false);}
  }
  return <div className="page-share" role="group" aria-label={label}>
    <div className="page-share-bar"><span className="page-share-label">Share</span>
      {url&&!local?<a className="share-icon share-facebook" href={facebookShareUrl(url)} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook (opens a new tab)" title="Share on Facebook"><Facebook size={20} strokeWidth={1.7} fill="currentColor" aria-hidden="true"/></a>:<button className="share-icon share-facebook" type="button" disabled aria-label="Share on Facebook" aria-describedby={local?localHint:undefined} title={local?'Facebook sharing is available after publication':'Share on Facebook'}><Facebook size={20} strokeWidth={1.7} fill="currentColor" aria-hidden="true"/></button>}
      <button className="share-icon" type="button" disabled={!url||busy} onClick={copy} aria-label="Copy link" title={notice==='Link copied.'?'Link copied':'Copy link'}>{notice==='Link copied.'?<Check size={20} strokeWidth={1.8} aria-hidden="true"/>:<Link2 size={20} strokeWidth={1.8} aria-hidden="true"/>}</button>
    </div>
    {local?<span id={localHint} className="sr-only">Facebook sharing is available at a public website address. This is a local preview.</span>:null}
    <p className="share-status" role="status">{notice}</p>
    {manual&&url?<label className="share-manual">Page link<input type="url" readOnly value={url} onFocus={event=>event.currentTarget.select()} autoComplete="off" spellCheck={false}/></label>:null}
  </div>;
}
