// Plain public pages shared by the shell. Quiz introductions and teaching
// sections own their controls, keeping active attempts and results unshared.
const publicPages=new Set([
  '/','/learn/','/practice/','/guides/','/preparation/','/preparation/interview/',
  '/color-vision/','/about/','/privacy/','/terms/',
  ...['arithmetic','pemdas','fractions-decimals','percentages-units','ohms-law','abstract-reasoning','patterns-spatial','factory-english','visual-checking','five-s','dexterity-preparation'].map(slug=>`/learn/${slug}/`),
  ...['math-basics','study-routine','reading-instructions','check-your-work'].map(slug=>`/guides/${slug}/`),
]);

export function hasPageSharing(path:string){return publicPages.has(`${path}/`.replace(/\/+/g,'/'));}

export function pageShareUrl(path:string,origin:string):string|null{
  try{
    if(!path.startsWith('/')||path.startsWith('//'))return null;
    const base=new URL(origin);
    if(!['https:','http:'].includes(base.protocol)||base.username||base.password)return null;
    const url=new URL(path,base.origin);
    if(url.origin!==base.origin)return null;
    url.search='';url.hash='';
    url.pathname=`${url.pathname.replace(/\/+$/,'')}/`;
    return url.href;
  }catch{return null;}
}

export function isLocalShareUrl(value:string){
  const host=new URL(value).hostname.toLowerCase().replace(/^\[|\]$/g,'');
  const privateV4=(address:string)=>/^(0|127|10)\./.test(address)||/^192\.168\./.test(address)||/^172\.(1[6-9]|2\d|3[01])\./.test(address)||/^169\.254\./.test(address)||/^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(address);
  const mapped=host.match(/^::ffff:([a-f\d]+):([a-f\d]+)$/);
  if(mapped){const high=parseInt(mapped[1],16),low=parseInt(mapped[2],16);return privateV4(`${high>>8}.${high&255}.${low>>8}.${low&255}`);}
  return host==='::1'||host==='::'||/^(fc|fd)[a-f\d]{2}:/.test(host)||/^fe[89ab][a-f\d]:/.test(host)||(!host.includes('.')&&!host.includes(':'))||/\.(localhost|local|lan|home|internal|test|invalid)$/.test(host)||privateV4(host);
}

export function facebookShareUrl(url:string){return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;}
