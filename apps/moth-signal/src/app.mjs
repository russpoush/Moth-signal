import {MORSE,WORDS,encode,timeline,isCorrect,scoreRound} from './morse.mjs';
const $=id=>document.getElementById(id);let deck=[],round=0,score=0,hinted=false,solved=false,busy=false,context,oscillator,timers=[],generation=0,writtenFree=false,flashesForRun=false;
function stop(){generation++;timers.forEach(clearTimeout);timers=[];try{oscillator?.stop()}catch{}oscillator=null;busy=false;flashesForRun=false;$('lamp').classList.remove('on');$('play').disabled=round===5;$('play').textContent='▶ Play signal';}
function render(){ $('progress').textContent=`SIGNAL ${Math.min(round+1,5)} / 5`;$('score').innerHTML=`${score} <small>POINTS</small>`;$('title').textContent=round===5?'Your shift is complete.':'The night is listening.';$('answer').disabled=solved||round===5;$('submit').disabled=solved||round===5;$('hint').disabled=solved||round===5||writtenFree;$('next').hidden=!solved||round===5;$('next').textContent=round===4?'Finish shift →':'Next signal →';}
function newRound(){stop();writtenFree=false;hinted=false;solved=false;$('written').hidden=true;$('answer').value='';$('feedback').textContent='Press Play signal to start. Replays are free.';render();}
function restart(){deck=[...WORDS];for(let i=deck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]]}deck=deck.slice(0,5);round=0;score=0;newRound();}
function silence(){try{oscillator?.stop()}catch{}oscillator=null;}
function showWrittenMode(){
 if(solved||round>=5)return;
 stop();writtenFree=true;hinted=false;
 $('written').textContent=encode(deck[round]);$('written').hidden=false;
 render();$('feedback').textContent='Written-only play: decode these dots and dashes. A correct answer earns 3 points.';
}
$('flashes').checked=!(globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
$('sound').onchange=()=>{
 if(!$('sound').checked){silence();if(busy)$('feedback').textContent='Sound off. The lamp can continue; sound returns on your next replay.';}
 else if(busy)$('feedback').textContent='Sound is enabled for the next replay.';
 if(!$('sound').checked&&!$('flashes').checked)showWrittenMode();
};
$('flashes').onchange=()=>{
 if(!$('flashes').checked){flashesForRun=false;$('lamp').classList.remove('on');}
 if(!$('sound').checked&&!$('flashes').checked)showWrittenMode();
 else if(busy)$('feedback').textContent=$('flashes').checked?'Flashes are enabled for the next replay.':'Flashes off. Sound can continue.';
};
$('play').onclick=async()=>{
 if(busy||round===5)return;
 if(!$('sound').checked&&!$('flashes').checked){showWrittenMode();return;}
 busy=true;$('play').disabled=true;
 const run=generation,plan=timeline(deck[round],Number($('speed').value));let origin=0;
 try{
  if($('sound').checked){
   context??=new AudioContext();await context.resume();if(run!==generation)return;
   // A user may mute while resume() is pending. Re-check before scheduling audio.
   if($('sound').checked){
    origin=context.currentTime+.12;oscillator=context.createOscillator();const gain=context.createGain();
    oscillator.frequency.value=600;gain.gain.value=0;oscillator.connect(gain);gain.connect(context.destination);
    for(const pulse of plan.pulses){const s=origin+pulse.start,e=s+pulse.duration;gain.gain.setValueAtTime(0,s);gain.gain.linearRampToValueAtTime(.12,s+.005);gain.gain.setValueAtTime(.12,e-.005);gain.gain.linearRampToValueAtTime(0,e);}
    oscillator.start(origin);oscillator.stop(origin+plan.duration+.02);
   }
  }
 }catch{if(run!==generation)return;$('feedback').textContent='Audio unavailable. Use the lamp, or switch off Sound and Flashes for written-only play.';}
 if(run!==generation)return;
 flashesForRun=$('flashes').checked;
 const delay=origin?Math.max(0,(origin-context.currentTime)*1000):100;
 $('play').textContent='● Transmitting…';
 for(const pulse of plan.pulses){
  timers.push(setTimeout(()=>{if(flashesForRun&&$('flashes').checked)$('lamp').classList.add('on');},delay+pulse.start*1000));
  timers.push(setTimeout(()=>$('lamp').classList.remove('on'),delay+(pulse.start+pulse.duration)*1000));
 }
 timers.push(setTimeout(()=>{busy=false;$('play').disabled=false;$('play').textContent='↻ Replay signal';},delay+plan.duration*1000+30));
};
$('answer-form').onsubmit=e=>{e.preventDefault();if(solved||round===5)return;if(!$('answer').value.trim()){$('feedback').textContent='Enter a decoded word first.';return}if(isCorrect($('answer').value,deck[round])){stop();solved=true;const points=scoreRound(true,hinted);score+=points;$('feedback').textContent=`Message received: ${deck[round]}. +${points} ${points===1?'point':'points'}. The tower glows a little brighter.`;render();$('next').focus();}else{$('feedback').textContent='A little static. Try again, replay, or reveal the written signal.';}};
$('hint').onclick=()=>{if(solved||round===5||writtenFree)return;hinted=true;$('written').textContent=encode(deck[round]);$('written').hidden=false;$('feedback').textContent='Written signal revealed. This round is now worth 1 point.';};
$('next').onclick=()=>{if(!solved)return;round++;newRound();if(round===5){$('feedback').textContent=`Five messages delivered. You earned ${score} of 15 points. A fine night at the tower.`;$('play').disabled=true;$('restart').focus();}else {$('play').focus();$('play').scrollIntoView({block:'center'});}};$('restart').onclick=restart;
$('alphabet').replaceChildren(...Object.entries(MORSE).map(([letter,code])=>{const span=document.createElement('span');const b=document.createElement('b');b.textContent=letter;span.append(b,document.createTextNode(code));return span;}));
$('environment').textContent=' / MOBILE TEST';
document.addEventListener('visibilitychange',()=>{
 if(!document.hidden)return;
 const wasPlaying=busy;
 stop();
 if(context?.state==='running')context.suspend().catch(()=>{});
 if(wasPlaying)$('feedback').textContent='Signal paused while you were away. Tap Play signal to hear it again.';
});
restart();
