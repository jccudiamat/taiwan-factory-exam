import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons} from '../src/lib/lessons';
import {guides} from '../src/lib/guides';
import {facebookShareUrl,hasPageSharing,isLocalShareUrl,pageShareUrl} from '../src/lib/sharing';

test('public navigation, every lesson overview, and guides get sharing without exposing private or timed views',()=>{
  for(const path of ['/','/learn','/practice/','/preparation/','/preparation/interview/','/color-vision/','/about/','/privacy/','/terms/',...lessons.map(l=>`/learn/${l.slug}/`),...guides.map(g=>`/guides/${g.slug}/`)])assert.equal(hasPageSharing(path),true,path);
  // These views either own an instruction-only control or have no sharing at all.
  for(const path of ['/progress/','/saved/','/practice/saved/','/practice/mistakes/','/practice/math/','/mock-exam/','/learn/pemdas/pemdas-parentheses/','/learn/pemdas/final-assessment/','/not-a-page/'])assert.equal(hasPageSharing(path),false,path);
});

test('shared links contain only a canonical public route, never query data or in-page result state',()=>{
  assert.equal(pageShareUrl('/learn/pemdas?answer=private#result','https://example.org/path?token=private'),'https://example.org/learn/pemdas/');
  assert.equal(pageShareUrl('/','https://example.org/'), 'https://example.org/');
  for(const path of ['//outside.invalid/page','/\\outside.invalid/page','https://outside.invalid/page'])assert.equal(pageShareUrl(path,'https://example.org'),null);
  for(const origin of ['javascript:alert(1)','not-an-origin','https://name:secret@example.org'])assert.equal(pageShareUrl('/learn/',origin),null);
  const shared=pageShareUrl('/practice/math/','https://example.org')!;
  const facebook=new URL(facebookShareUrl(shared));
  assert.equal(facebook.origin,'https://www.facebook.com');
  assert.equal(facebook.searchParams.get('u'),shared);
  assert.equal([...facebook.searchParams.keys()].join(','),'u');
});

test('local preview URLs are not offered as Facebook destinations',()=>{
  for(const origin of ['http://localhost:3000','http://127.0.0.1:4173','http://[::1]:3000','http://192.168.1.4','http://10.0.0.2','http://172.20.1.2','https://demo.local','http://169.254.12.3','http://[fc00::1]:3000','http://[fd12:3456::1]','http://[fe80::1]','http://[febf::1]','http://[::ffff:192.168.1.4]','http://100.64.0.1','http://study.internal'])assert.equal(isLocalShareUrl(origin),true,origin);
  for(const origin of ['https://example.org','https://study.example.org','http://172.32.0.1','https://[2606:4700::1111]','http://169.253.1.2','http://100.128.0.1'])assert.equal(isLocalShareUrl(origin),false,origin);
});
