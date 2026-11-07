import test from 'node:test';
import assert from 'node:assert/strict';
import { MORSE } from '../src/morse.mjs';
let moduleCase=0;
async function setup({deferred=false,reduced=false}={}) {
  const saved=Object.fromEntries(['document','AudioContext','setTimeout','clearTimeout','matchMedia','fetch'].map(k=>[k,globalThis[k]]));
  const nodes=new Map(), timers=new Map(), stats={oscillators:0,stops:0,flashes:0};let resolveResume;
  const element=()=>({value:'',hidden:false,disabled:false,checked:false,textContent:'',innerHTML:'',classList:{add(){stats.flashes++;},remove(){}},append(){},replaceChildren(){},focus(){},scrollIntoView(){}});
  globalThis.document={getElementById(id){if(!nodes.has(id)){const el=element();el.checked=id==='sound';nodes.set(id,el);}return nodes.get(id);},createElement:element,createTextNode:s=>s,addEventListener(){}};
  globalThis.setTimeout=fn=>{const id=timers.size+1;timers.set(id,fn);return id;};globalThis.clearTimeout=id=>timers.delete(id);
  globalThis.matchMedia=()=>({matches:reduced});globalThis.fetch=async()=>({ok:false});
  globalThis.AudioContext=class {currentTime=0;state='running';destination={};async resume(){if(deferred)await new Promise(r=>{resolveResume=r;});}createOscillator(){stats.oscillators++;return{frequency:{value:0},connect(){},start(){},stop(at){if(at===undefined)stats.stops++;}};}createGain(){return{gain:{setValueAtTime(){},linearRampToValueAtTime(){}},connect(){}};}async suspend(){}};
  await import(`../src/app.mjs?controls=${moduleCase++}`);
  const $=id=>document.getElementById(id);$('speed').value='12';
  return {$,stats,timers,resume:()=>resolveResume(),cleanup(){for(const[k,v]of Object.entries(saved)){if(v===undefined)delete globalThis[k];else globalThis[k]=v;}}};
}
test('Sound off immediately stops audio while the lamp transmission continues',async()=>{
 const env=await setup();try{const{$,stats,timers}=env;await $('play').onclick();assert.equal(stats.oscillators,1);const before=timers.size;$('sound').checked=false;$('sound').onchange();assert.equal(stats.stops,1);assert.equal(timers.size,before);assert.equal($('play').disabled,true);}finally{env.cleanup();}
});
test('muting during pending audio resume prevents stale audio from starting',async()=>{
 const env=await setup({deferred:true});try{const{$,stats,timers}=env;const pending=$('play').onclick();$('sound').checked=false;$('sound').onchange();env.resume();await pending;assert.equal(stats.oscillators,0);assert.ok(timers.size>0);}finally{env.cleanup();}
});
test('Flashes off prevents later flash callbacks without stopping sound',async()=>{
 const env=await setup();try{const{$,stats,timers}=env;await $('play').onclick();$('flashes').checked=false;$('flashes').onchange();for(const fn of timers.values())fn();assert.equal(stats.flashes,0);assert.equal(stats.stops,0);assert.equal(stats.oscillators,1);}finally{env.cleanup();}
});
test('reduced-motion defaults to no flashes and written-only mode earns full points',async()=>{
 const env=await setup({reduced:true});try{const{$,stats,timers}=env;assert.equal($('flashes').checked,false);$('sound').checked=false;$('sound').onchange();await $('play').onclick();assert.equal(timers.size,0);assert.equal(stats.oscillators,0);assert.equal($('written').hidden,false);assert.equal($('hint').disabled,true);const inverse=Object.fromEntries(Object.entries(MORSE).map(([a,b])=>[b,a]));$('answer').value=$('written').textContent.split(' ').map(c=>inverse[c]).join('');$('answer-form').onsubmit({preventDefault(){}});assert.equal($('score').innerHTML,'3 <small>POINTS</small>');}finally{env.cleanup();}
});
