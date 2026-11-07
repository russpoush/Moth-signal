import test from 'node:test';
import assert from 'node:assert/strict';

test('mobile backgrounding cancels stale audio startup, stops pulses and allows replay', async () => {
  const nodes = new Map(), events = new Map(), timers = new Map();
  const element = () => ({ value:'', hidden:false, disabled:false, checked:false, textContent:'', innerHTML:'', classList:{add(){},remove(){}}, append(){}, replaceChildren(){}, focus(){},scrollIntoView(){} });
  const previous = { setTimeout:globalThis.setTimeout, clearTimeout:globalThis.clearTimeout, AudioContext:globalThis.AudioContext };
  globalThis.document = { hidden:false, addEventListener:(name,fn)=>events.set(name,fn), getElementById(id){if(!nodes.has(id))nodes.set(id,element());return nodes.get(id);}, createElement:element, createTextNode:s=>s };
  let timerId=0, resolveFirst, first=true, oscillatorCount=0, manualStops=0, suspends=0;
  globalThis.setTimeout = fn => { const id=++timerId; timers.set(id,fn); return id; };
  globalThis.clearTimeout = id => timers.delete(id);
  globalThis.AudioContext = class {
    state='suspended'; currentTime=0; destination={};
    async resume(){if(first){first=false;await new Promise(resolve=>{resolveFirst=resolve;});}this.state='running';}
    async suspend(){this.state='suspended';suspends++;}
    createOscillator(){oscillatorCount++;return {frequency:{value:0},connect(){},start(){},stop(at){if(at===undefined)manualStops++;}};}
    createGain(){return {gain:{value:0,setValueAtTime(){},linearRampToValueAtTime(){}},connect(){}};}
  };
  try {
    await import('../src/app.mjs');
    const $=id=>document.getElementById(id);
    $('speed').value='12';$('sound').checked=true;
    const pending=$('play').onclick();
    document.hidden=true;events.get('visibilitychange')();
    resolveFirst();await pending;
    assert.equal(oscillatorCount,0);
    assert.equal(timers.size,0);
    assert.equal($('play').disabled,false);
    assert.match($('feedback').textContent,/paused/);
    document.hidden=false;await $('play').onclick();
    assert.equal(oscillatorCount,1);assert.ok(timers.size>0);
    document.hidden=true;events.get('visibilitychange')();
    assert.equal(timers.size,0);assert.equal(manualStops,1);assert.equal(suspends,1);
    document.hidden=false;await $('play').onclick();
    assert.equal(oscillatorCount,2);assert.ok(timers.size>0);
    $('restart').onclick();assert.equal(timers.size,0);assert.equal($('play').disabled,false);
  } finally {
    globalThis.setTimeout=previous.setTimeout;globalThis.clearTimeout=previous.clearTimeout;
    if(previous.AudioContext)globalThis.AudioContext=previous.AudioContext;else delete globalThis.AudioContext;
    delete globalThis.document;
  }
});
