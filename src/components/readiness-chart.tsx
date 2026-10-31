'use client';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import type {Attempt} from '@/lib/quiz';
import {readinessData} from '@/lib/readiness';
import {formatAnswerTime} from '@/lib/answer-timing';
const percent=(n:number|null)=>n===null?'—':`${n.toFixed(1)}%`;
const series=[{id:'score',label:'Mock score (%)',dash:undefined},{id:'accuracy',label:'Answered accuracy (%)',dash:'7 4'},{id:'speed',label:'Answer speed (s/item)',dash:'2 4'}] as const;
export function ReadinessChart({attempts}:{attempts:Attempt[]}){
  const data=readinessData(attempts),hasRows=data.rows.length>0;
  const [visible,setVisible]=useState({score:true,accuracy:true,speed:true});
  const [selected,setSelected]=useState<string|null>(null),[width,setWidth]=useState(700);const host=useRef<HTMLDivElement>(null);
  useEffect(()=>{if(!host.current)return;const observer=new ResizeObserver(entries=>{const w=entries[0]?.contentRect.width;if(w)setWidth(Math.max(250,w));});observer.observe(host.current);return()=>observer.disconnect();},[hasRows]);
  const current=data.rows.find(r=>r.id===selected)??data.rows.at(-1);
  const left=38,right=48,top=38,bottom=257,height=294,plotWidth=width-left-right;
  const x=(i:number)=>left+(data.rows.length===1?plotWidth/2:i*plotWidth/(data.rows.length-1));
  const y=(value:number)=>bottom-value/100*(bottom-top);
  const maxSpeed=Math.max(15,Math.ceil(Math.max(...data.rows.map(r=>r.speed??0),12)/5)*5);
  const sy=(value:number)=>bottom-value/maxSpeed*(bottom-top);
  const pointLabelEvery=width<500?Math.max(1,Math.ceil(data.rows.length/3)):1;
  return <section className={`readiness ${hasRows?'':'readiness-compact'}`} aria-labelledby="readiness-heading"><div className="section-heading"><h2 id="readiness-heading">Taiwan factory mock exam readiness</h2><span>100 items · 20 minutes · 90% passing mark</span></div>
  {hasRows?<p className="readiness-intro">Track scores, answer accuracy, and speed across completed 100-item mocks. These are this site’s practice targets; the chart does not predict an employer’s result.</p>:null}
  {!data.rows.length?<div className="readiness-empty"><p>No 100-item mock results yet. Complete a current-format mock to begin tracking your trend. Earlier formats stay in your session history.</p><Link className="button button-small button-secondary" href="/mock-exam/">Start a 100-item mock</Link></div>:<>
    <div className="readiness-metrics"><div><span>Avg mock score</span><strong>{percent(data.averageScore)}</strong></div><div><span>Answered accuracy</span><strong>{percent(data.accuracy)}</strong></div><div><span>Avg answer speed</span><strong>{formatAnswerTime(data.speed.average)}</strong></div><div><span>Practice readiness index</span><strong>{data.index===null?'—':`${Math.floor(data.index)}/100`}</strong></div></div>
    <p className="readiness-status"><strong>{data.status}.</strong> Summary uses the latest {data.recentCount} eligible mock{data.recentCount===1?'':'s'}. Consistency requires at least 90% score and accuracy, complete timing for recorded answers, and average answer time of 12 seconds or less in each of the last three mocks.</p>
    <div className="chart-legend" aria-label="Visible chart metrics">{series.map(s=><button key={s.id} aria-pressed={visible[s.id]} onClick={()=>setVisible(v=>({...v,[s.id]:!v[s.id]}))}><span className={`series-swatch series-${s.id}`} aria-hidden="true"/>{s.label}</button>)}</div>
    <div className="readiness-plot" ref={host}><svg role="img" aria-labelledby="readiness-chart-title readiness-chart-desc" viewBox={`0 0 ${width} ${height}`} width="100%" height={height}>
      <title id="readiness-chart-title">Mock score, answered accuracy, and answer speed over time</title><desc id="readiness-chart-desc">Up to ten completed current-format mocks, oldest to newest. Percentages use the left axis; seconds per answered item use the right. Lower answer time is better. Select a mock below or open the data table for exact values.</desc>
      {[0,25,50,75,100].map(t=><g key={t}><line x1={left} y1={y(t)} x2={width-right} y2={y(t)} className="chart-grid"/><text x={left-8} y={y(t)+4} textAnchor="end">{t}</text><text x={width-right+8} y={y(t)+4}>{(t/100*maxSpeed).toFixed(0)}s</text></g>)}
      <text x={left} y={18}>Score / accuracy (%)</text><text x={width-right} y={width<500?32:18} textAnchor="end">Seconds/item ↓</text>
      {visible.score?<><line x1={left} x2={width-right} y1={y(90)} y2={y(90)} className="chart-target"/><text x={left+4} y={y(90)-6}>90% target</text></>:null}
      {visible.speed?<><line x1={left} x2={width-right} y1={sy(12)} y2={sy(12)} className="chart-speed-target"/><text x={width-right-4} y={sy(12)-6} textAnchor="end">12s target</text></>:null}
      {series.map(s=>{
        if(!visible[s.id])return null;
        let path='';let open=false;
        data.rows.forEach((r,i)=>{const value=s.id==='score'?r.scorePercent:s.id==='accuracy'?r.accuracy:r.speed;if(value===null){open=false;return;}path+=`${open?'L':'M'}${x(i)},${s.id==='speed'?sy(value):y(value)} `;open=true;});
        return <g className={`series-${s.id}`} key={s.id}><path d={path} fill="none" stroke="currentColor" strokeWidth={2.5} strokeDasharray={s.dash}/>{data.rows.map((r,i)=>{const value=s.id==='score'?r.scorePercent:s.id==='accuracy'?r.accuracy:r.speed;return value===null?null:<circle key={r.id} cx={x(i)} cy={s.id==='speed'?sy(value):y(value)} r={r.id===current?.id?5:3.5} fill="currentColor"/>;})}</g>;
      })}
      {data.rows.map((r,i)=>i%pointLabelEvery===0||i===data.rows.length-1?<text key={r.id} x={x(i)} y={height-8} textAnchor="middle">Mock {r.number}</text>:null)}
    </svg></div>
    <div className="chart-point-picker" aria-label="Select a mock result">{data.rows.map(r=><button key={r.id} aria-pressed={r.id===current?.id} onClick={()=>setSelected(r.id)}>Mock {r.number}</button>)}</div>
    {current?<p className="chart-selected" role="status"><strong>Mock {current.number}</strong> · {new Intl.DateTimeFormat('en-PH',{month:'short',day:'numeric'}).format(current.completedAt)} · {current.score}/100 score · {percent(current.accuracy)} answered accuracy · {formatAnswerTime(current.speed)} · {current.answered}/100 answered</p>:null}
    <details className="readiness-method"><summary>View chart data and readiness calculation</summary><p>Mock score = correct ÷ 100; blanks count as incorrect. Answered accuracy = correct ÷ answered. Speed averages individual recorded answer times, including revisits; unanswered items have no answer time. Summary accuracy and speed pool individual answers, not session averages.</p><p>The practice index is the lowest of average mock score (%), answered accuracy (%), and speed attainment (12 ÷ average seconds per answer × 100, capped at 100). It is a training index, not a validated probability of passing or a hiring recommendation. Earlier formats and incomplete attempts are excluded.</p><div className="history-table-wrap"><table><caption>Latest ten eligible mocks; — means no recorded answers or timing.</caption><thead><tr><th scope="col">Mock</th><th scope="col">Score</th><th scope="col">Answered</th><th scope="col">Accuracy</th><th scope="col">Speed</th></tr></thead><tbody>{data.rows.map(r=><tr key={r.id}><th scope="row">Mock {r.number}</th><td>{r.score}/100</td><td>{r.answered}/100</td><td>{percent(r.accuracy)}</td><td>{formatAnswerTime(r.speed)}</td></tr>)}</tbody></table></div></details>
  </>}
  {data.excludedMockCount?<p className="section-note">{data.excludedMockCount} earlier-format mock{data.excludedMockCount===1?' is':'s are'} excluded; recorded history is preserved.</p>:null}
  </section>;
}
