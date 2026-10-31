import type {AbstractDiagram as Diagram,AbstractToken} from '@/lib/abstract-content';
function SymbolShape({token}:{token:AbstractToken}){
  const props={fill:token.filled?'currentColor':'none',stroke:'currentColor',strokeWidth:1.8};
  return <g transform={`rotate(${token.rotation??0})`}>{token.shape==='circle'?<circle r={8} {...props}/>:token.shape==='square'?<rect x={-8} y={-8} width={16} height={16} {...props}/>:token.shape==='triangle'?<polygon points="0,-10 9,7 -9,7" {...props}/>:<path d="M -4 10 L -4 -1 L -9 -1 L 0 -11 L 9 -1 L 4 -1 L 4 10 Z" {...props}/>}</g>;
}
export function AbstractDiagram({diagram}:{diagram:Diagram|undefined}){
  if(!diagram)return null;
  const cols=diagram.columns??diagram.panels.length,rows=Math.ceil(diagram.panels.length/cols);
  return <figure className="abstract-diagram"><svg viewBox={`0 0 ${cols*86} ${rows*86}`} role="img" aria-label={diagram.caption}>
    {diagram.panels.map((panel,i)=><g key={i} transform={`translate(${i%cols*86},${Math.floor(i/cols)*86})`}><rect x={3} y={3} width={80} height={78} rx={5} fill="none" stroke="currentColor" opacity={.35}/><text x={43} y={19} textAnchor="middle" fontSize={13} fill="currentColor">{panel.label}</text>{panel.token?Array.from({length:panel.token.count??1},(_,j)=>{const count=panel.token!.count??1,colCount=count>4?3:count>1?2:1;const itemRows=Math.ceil(count/colCount);return <g key={j} transform={`translate(${43+(j%colCount-(colCount-1)/2)*21},${49+(Math.floor(j/colCount)-(itemRows-1)/2)*19})`}><SymbolShape token={panel.token!}/></g>;}):<text x={43} y={58} textAnchor="middle" fontSize={25} fill="currentColor">?</text>}</g>)}
  </svg></figure>;
}
