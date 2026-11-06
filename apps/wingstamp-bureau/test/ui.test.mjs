import test from 'node:test';
import assert from 'node:assert/strict';
import { LEVELS } from '../src/levels.mjs';

test('guided play completes every word and safely helps a player back from independent-play dead ends', async () => {
  class Element {
    constructor(tag, ns) { this.tagName=tag; this.namespaceURI=ns; this.children=[]; this.attributes={}; this.style={}; this.disabled=false; this.hidden=false; this.textContent=''; this.checked=false; }
    setAttribute(k,v) { this.attributes[k]=v; }
    append(...els) { this.children.push(...els); }
    replaceChildren(...els) { this.children=[...els]; }
    focus() { this.focused=true; }
    scrollIntoView() {}
  }
  const els=new Map();
  globalThis.document={getElementById(id){if(!els.has(id))els.set(id,new Element('div'));return els.get(id);},createElement:tag=>new Element(tag),createElementNS:(ns,tag)=>new Element(tag,ns)};
  const saved=new Map([['wingstamp-bureau:v1',JSON.stringify({version:1,best:{'first-post':5}})]]);
  globalThis.localStorage={getItem:k=>saved.get(k)??null,setItem:(k,v)=>saved.set(k,v)};
  await import('../src/app.mjs');
  const $=id=>els.get(id);
  const perch=id=>$('board').children.find(el=>el.attributes['data-node']===id);
  assert.equal($('guided').checked,true);
  assert.match($('step-title').textContent,/collect H/);
  assert.match($('go-next').textContent,/H.*Fern/);
  assert.match(perch('A').attributes['aria-label'],/Next stop/);
  assert.equal($('hint').hidden,true);
  assert.equal($('move-count').hidden,true);
  assert.equal($('progress').textContent,'1 of 10 delivered'); // Earlier progress survives.
  perch('B').onclick(); // An unconnected stop must not lose a letter or move.
  assert.match($('receipt-status').textContent,/Collect H/);
  $('go-next').onclick();
  assert.match($('step-title').textContent,/collect I/);
  assert.equal($('go-next').focused,true);
  $('undo').onclick();
  assert.match($('step-title').textContent,/collect H/);
  $('reset').onclick();
  for(let i=0;i<LEVELS.length;i++) {
    let steps=0;
    while($('complete').hidden && steps++<30) {
      assert.equal($('go-next').hidden,false);
      assert.equal($('go-next').disabled,false);
      $('go-next').onclick();
    }
    assert.ok(steps<30,LEVELS[i].id);
    assert.equal($('complete').hidden,false);
    assert.match($('feedback').textContent,/Delivered/);
    assert.doesNotMatch($('result').textContent,/Best|Shortest|hops/);
    if(i<LEVELS.length-1)$('next').onclick();
  }
  assert.equal($('progress').textContent,'10 of 10 delivered');
  assert.equal(Object.keys(JSON.parse(saved.get('wingstamp-bureau:v1')).best).length,10);

  // Guided play avoids a trap instead of leaving the player stuck.
  const paperIndex=LEVELS.findIndex(l=>l.word==='PAPER');
  $('levels').children[paperIndex].onclick();
  for(let i=0;i<3;i++)$('go-next').onclick(); // Collect PAP.
  const before=$('receipt-status').textContent;
  perch('D').onclick();
  assert.equal($('receipt-status').textContent,before);
  assert.match($('feedback').textContent,/will get us stuck/);

  // Independent mode permits exploration; turning guidance back on offers undo.
  $('guided').checked=false;
  $('guided').onchange();
  assert.equal($('go-next').hidden,true);
  assert.equal($('hint').hidden,false);
  assert.equal(saved.get('wingstamp-bureau:guided'),'off');
  perch('D').onclick();
  assert.match($('receipt-status').textContent,/Collect R/);
  $('guided').checked=true;
  $('guided').onchange();
  assert.match($('go-next').textContent,/Go back/);
  $('go-next').onclick();
  assert.match($('go-next').textContent,/Go to E/);
  assert.equal(saved.get('wingstamp-bureau:guided'),'on');
  delete globalThis.document;
  delete globalThis.localStorage;
});
