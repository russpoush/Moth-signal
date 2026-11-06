const nest={id:'nest',name:'Home',x:50,y:84};
const spots={A:{name:'Fern',x:20,y:61},B:{name:'Willow',x:20,y:24},C:{name:'Birch',x:80,y:24},D:{name:'Clover',x:80,y:61},E:{name:'Moon',x:50,y:12}};
function level(id,title,word,cycles,edges,lesson){return {id,title,word,lesson,nodes:[nest,...Object.entries(cycles).map(([id,stamps])=>({id,...spots[id],stamps:[...stamps]}))],edges:edges.map(e=>e.split('-'))};}
export const LEVELS=[
 level('hello-post','Say hello','HI',{A:'H',B:'I'},['nest-A','A-B','B-nest'],'Tap H, then I, then Home. The large green button can guide every step. These letters stay the same.'),
 level('cat-post','A little CAT','CAT',{A:'C',B:'A',C:'T'},['nest-A','A-B','B-C','C-nest'],'Collect C, then A, then T. Follow the NEXT marker, then take your moth Home.'),
 level('first-post','A changing letter','MAIL',{A:'MI',B:'A',C:'L'},['nest-A','A-B','A-C','C-nest'],'Fern stamps M first, then I when you return. Start at Fern, visit Willow, then revisit Fern. Finish at Birch and return to the Bureau.'),
 level('wing-shift','A change of wings','WING',{A:'WN',B:'I',D:'G'},['nest-A','A-B','A-D','D-nest'],'A perch remembers your last visit. Watch the small “then” letter to plan your return.'),
 level('double-loop','Two little loops','LETTER',{A:'LT',B:'ET',C:'ER'},['nest-A','A-B','A-C','B-C','C-nest'],'Both Fern and Willow change. The shortest path does not always take the closest-looking perch.'),
 level('moon-mail','Moon mail','MOON',{A:'MO',B:'O',C:'N',D:'OX'},['nest-A','A-B','A-D','A-C','C-nest','D-C'],'Two perches offer O. Explore both routes, and watch Fern change from M to O. Undo is always free.'),
 level('night-route','The night route','NIGHT',{A:'NG',B:'IH',C:'T',D:'GX'},['nest-A','A-B','B-C','C-nest','A-D','D-C'],'A tempting letter can be a dead end. The route after the stamp matters as much as the stamp itself.'),
 level('paper-trail','A paper trail','PAPER',{A:'PP',B:'AE',C:'R',D:'EX'},['nest-A','A-B','B-C','C-nest','A-D'],'A stamp can repeat itself. Revisit Willow after its A changes to E.'),
 level('return-service','Return service','RETURN',{A:'RT',B:'EU',C:'RN',D:'UX'},['nest-A','A-B','A-C','B-C','C-nest','B-D','D-C'],'Three changing perches share one receipt. Plan the last two letters before you take off.'),
 level('bureau-night','Bureau by moonlight','BUREAU',{A:'BR',B:'UA',C:'EU',D:'AX',E:'UX'},['nest-A','A-B','A-C','B-C','C-nest','B-D','D-E','E-C'],'The final delivery needs three return visits. Complete the receipt, then take the last dotted line home.')
];
