// Deterministic puzzle rules. Each perch owns its own cycling stamp state.
export function validateLevel(level){
 if(!level||typeof level.id!=='string'||!/^([A-Z]){2,12}$/.test(level.word))throw Error('Invalid delivery word.');
 const ids=level.nodes.map(n=>n.id);if(new Set(ids).size!==ids.length||!ids.includes('nest'))throw Error('Invalid perches.');
 for(const n of level.nodes){if(!Number.isFinite(n.x)||!Number.isFinite(n.y)||n.x<10||n.x>90||n.y<10||n.y>90)throw Error('Invalid position.');if(n.id!=='nest'&&(!Array.isArray(n.stamps)||n.stamps.length<1||n.stamps.some(x=>!/^[A-Z]$/.test(x))))throw Error('Invalid stamp cycle.');}
 for(const edge of level.edges)if(edge.length!==2||edge[0]===edge[1]||edge.some(id=>!ids.includes(id)))throw Error('Invalid route.');
 return true;
}
export function initialState(level){return {at:'nest',receipt:'',turns:0,cycles:Object.fromEntries(level.nodes.filter(n=>n.id!=='nest').map(n=>[n.id,0]))};}
export function stampAt(level,state,id){const n=level.nodes.find(n=>n.id===id);return n?.stamps?.[state.cycles[id]%n.stamps.length]??null;}
export function isDelivered(level,state){return state.receipt===level.word&&state.at==='nest';}
export function adjacent(level,from,to){return level.edges.some(([a,b])=>(a===from&&b===to)||(b===from&&a===to));}
export function move(level,state,to){
 if(isDelivered(level,state))return {ok:false,reason:'You delivered the word! Try the next one when you are ready.'};
 if(!level.nodes.some(n=>n.id===to))return {ok:false,reason:'That stop is not in this delivery.'};
 if(!adjacent(level,state.at,to))return {ok:false,reason:'That stop is too far away. Follow a dotted line, or use the big green button.'};
 const letter=stampAt(level,state,to);
 if(to!=='nest'&&letter!==level.word[state.receipt.length])return {ok:false,reason:state.receipt.length===level.word.length?'You have every letter! Go Home to finish.':`Next, collect ${level.word[state.receipt.length]}. That stop gives ${letter}. Try the marked stop, or go back.`};
 const next={at:to,receipt:state.receipt+(letter??''),turns:state.turns+1,cycles:{...state.cycles}};
 if(letter){const node=level.nodes.find(n=>n.id===to);next.cycles[to]=(next.cycles[to]+1)%node.stamps.length;}
 return {ok:true,state:next,letter};
}
export function solve(level,start=initialState(level)){
 const key=s=>`${s.at}|${s.receipt.length}|${Object.entries(s.cycles).map(([k,v])=>k+v).join(',')}`;
 const queue=[{state:start,path:[]}],seen=new Set([key(start)]);
 for(let i=0;i<queue.length;i++){const {state,path}=queue[i];if(isDelivered(level,state))return path;
  for(const node of level.nodes){const result=move(level,state,node.id);if(!result.ok)continue;const k=key(result.state);if(seen.has(k))continue;seen.add(k);queue.push({state:result.state,path:[...path,node.id]});}
 }return null;
}
export function loadProgress(raw,levels){
 try{const data=JSON.parse(raw);if(data?.version!==1||!data.best||typeof data.best!=='object')return {version:1,best:{}};const best={};for(const level of levels){const v=data.best[level.id];if(Number.isSafeInteger(v)&&v>0&&v<=1000)best[level.id]=v;}return {version:1,best};}catch{return {version:1,best:{}};}
}
