import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {ohmsLawLesson} from '../src/lib/curriculum-electrical';
import {ishiharaPlates,OTHER_PATH} from '../src/lib/ishihara';

test('Ohm’s law sections teach eight separate skills and numeric keys match independent calculations',()=>{
  assert.equal(ohmsLawLesson.sections.length,8);
  const questions=ohmsLawLesson.sections.flatMap(s=>s.questions).filter(q=>!q.options);
  for(const q of questions){
    const values=q.prompt.match(/\d+(?:\.\d+)?/g)!.map(Number);
    let expected:number;
    if(q.prompt.startsWith('Convert'))expected=q.prompt.includes('mA')?values[0]/1000:values[0]*1000;
    else if(q.prompt.startsWith('Current is initially'))expected=values[0]/2;
    else if(q.prompt.startsWith('Two'))expected=1/(1/values[0]+1/values[0]);
    else if(q.prompt.includes('are in series'))expected=values[2]/(values[0]+values[1]);
    else if(q.prompt.includes('Find power'))expected=values[0]*values[1];
    else if(q.prompt.includes('Find R'))expected=values[0]/values[1];
    else if(q.prompt.includes('Find voltage'))expected=values[0]*values[1];
    else expected=values[1]/values[0];
    assert.ok(Math.abs(Number(q.answer)-expected)<1e-9,q.prompt);
  }
  assert.ok(ohmsLawLesson.sections[0].questions.some(q=>q.options?.includes('Do not divide by zero')));
});
test('all 28 color plates are distinct 400px source images with intact pixels and recorded provenance',()=>{
  assert.equal(ishiharaPlates.length,28);
  assert.equal(new Set(ishiharaPlates.map(p=>p.plate)).size,28);
  assert.ok(ishiharaPlates.some(p=>p.kind==='path'));
  const manifest=JSON.parse(readFileSync('public/images/ishihara/provenance.json','utf8'));
  for(const plate of ishiharaPlates){
    const bytes=readFileSync(`public${plate.src}`);
    const entry=manifest.plates.find((p:{plate:number})=>p.plate===plate.plate);
    assert.equal(createHash('sha256').update(bytes).digest('hex'),entry.sha256);
    const payloads:Buffer[]=[];
    for(let offset=8;offset<bytes.length;){const length=bytes.readUInt32BE(offset);if(bytes.toString('ascii',offset+4,offset+8)==='IDAT')payloads.push(bytes.subarray(offset+8,offset+8+length));offset+=length+12;}
    assert.equal(createHash('sha256').update(Buffer.concat(payloads)).digest('hex'),entry.imageDataSha256);
    assert.equal(bytes.readUInt32BE(16),400);
    assert.equal(bytes.readUInt32BE(20),400);
  }
});

test('only the seven path plates have distinct observation choices, including uncertainty and an open description',()=>{
  const paths=ishiharaPlates.filter(plate=>plate.kind==='path');
  assert.deepEqual(paths.map(plate=>plate.plate),[26,28,30,32,34,36,38]);
  for(const plate of paths){
    assert.ok(plate.choices&&plate.choices.length>=5&&plate.choices.length<=7);
    assert.equal(new Set(plate.choices).size,plate.choices.length);
    for(const choice of ['No continuous line visible','I can’t tell',OTHER_PATH])assert.ok(plate.choices.includes(choice));
  }
  for(const plate of ishiharaPlates.filter(plate=>plate.kind==='number'))assert.equal(plate.choices,undefined);
  assert.ok(paths.find(plate=>plate.plate===26)!.choices!.includes('Both purple and red lines'));
  assert.ok(paths.find(plate=>plate.plate===34)!.choices!.includes('Blue-green joined to yellow-green'));
  assert.ok(paths.find(plate=>plate.plate===36)!.choices!.includes('Red / purple joined to orange'));
});
