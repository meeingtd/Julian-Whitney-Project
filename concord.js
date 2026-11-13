/* Concord: the Minute Man at the Old North Bridge, at dawn in April, painted. Driven by story time s and a projector from the live 3D camera,
   so the bronze figure sits exactly on the outline the globe's limb turns into (SIL.statue) and every layer moves with the camera at its own depth.
   Layers are flat painted cards at a world depth (sky, far woods, bridge and river, near bank, statue, foreground), with live mist, water shimmer,
   geese and a rising sun between them. Coordinates are the statue's drawing space: x 250-505, ground at y 460. Nothing here reads input. */
window.CONCORD=(()=>{
  const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
  const sm=(a,b,t)=>{t=clamp((t-a)/(b-a));return t*t*(3-2*t);};
  const lerp=(a,b,t)=>a+(b-a)*t;
  const rngMake=seed=>()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
  const [IN0,IN1,OUT0,OUT1]=CUTW("statue"),S0=.178,S1=.204;
  const still=matchMedia("(prefers-reduced-motion: reduce)").matches;
  let box,cv,g,W=0,H=0,dpr=1,built=false,t0=0,stamp="";
  const cards=[];

  /* The statue, from the same points as the outline (SIL.statue) and the old line scene. */
  const SIL=[[250,460],[250,445],[320,425],[320,245],[335,237],[361,233],[356,190],[340,118],[346,85],[362,60],[352,58],[357,45],[366,41],[378,44],[384,58],[380,72],[405,85],[404,112],[392,170],[390,233],[418,233],[435,245],[435,425],[505,445],[505,460]];
  const BODY=[[362,60],[362,72],[346,85],[340,118],[349,128],[355,140],[356,190],[361,233],[373,233],[375,170],[381,233],[390,233],[392,170],[395,140],[404,112],[405,85],[380,72],[380,60]];
  const HAT=[[352,58],[357,45],[366,41],[378,44],[384,58]],COAT=[[396,172],[414,168],[428,234],[390,234]],PLOW=[[450,153],[432,165],[425,195],[415,232]];

  /* ---- painting helpers ---- */
  const poly=(c,pts)=>{c.beginPath();pts.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.closePath();};
  /* A bare April tree: tapering limbs, fine twigs, the faintest red of buds at the tips. */
  function tree(c,rng,x,y,h,col,w0,bud,depth=7){
    const limb=(x,y,a,len,w,d)=>{
      const x2=x+Math.cos(a)*len,y2=y+Math.sin(a)*len,mx=(x+x2)/2+(rng()-.5)*len*.18,my=(y+y2)/2+(rng()-.5)*len*.12;
      c.strokeStyle=col;c.lineWidth=Math.max(.35,w);c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(mx,my,x2,y2);c.stroke();
      if(d<=0||len<2.2){if(bud&&rng()<.5){c.fillStyle=bud;c.fillRect(x2-.6,y2-.6,1.2,1.2);}return;}
      const n=rng()<.35?3:2;
      for(let i=0;i<n;i++){const spread=.28+rng()*.42,na=a+(i-(n-1)/2)*spread*1.4+(rng()-.5)*.25-.04;limb(x2,y2,na,len*(.66+rng()*.16),w*.66,d-1);}
    };
    const trunkH=h*(.28+rng()*.1);
    c.strokeStyle=col;c.lineWidth=w0;c.lineCap="round";c.beginPath();c.moveTo(x,y);c.lineTo(x+(rng()-.5)*w0,y-trunkH);c.stroke();
    const k=3+Math.floor(rng()*2);for(let i=0;i<k;i++)limb(x,y-trunkH*(.8+rng()*.2),-Math.PI/2+(i-(k-1)/2)*.42+(rng()-.5)*.3,h*(.26+rng()*.1),w0*.62,depth);
  }
  function grain(c,rng,x0,y0,x1,y1,n,a,col){for(let i=0;i<n;i++){c.fillStyle=`rgba(${col},${(rng()*a).toFixed(3)})`;c.fillRect(x0+rng()*(x1-x0),y0+rng()*(y1-y0),1+rng()*1.5,1);}}

  /* ---- cards: each is painted once into a bitmap in its own depth plane ---- */
  /* z: world depth. b: content bounds in drawing space [x0,y0,x1,y1]. q: resolution factor. */
  const CARDS=[
    {id:"far",z:-46,b:[-4200,-900,5000,470],q:.7,draw(c,r){
      /* far woods across the meadows, blue with distance */
      for(let i=0;i<150;i++){const x=-4200+r()*9200,h=200+Math.pow(r(),1.5)*700;tree(c,r,x,462,h,`rgba(92,104,126,${(.55+r()*.3).toFixed(2)})`,3+r()*3,null,4);}
      const gr=c.createLinearGradient(0,300,0,470);gr.addColorStop(0,"rgba(150,150,170,0)");gr.addColorStop(1,"rgba(170,160,170,.55)");c.fillStyle=gr;c.fillRect(-4200,300,9200,170);
      c.fillStyle="#6b6f80";c.fillRect(-4200,458,9200,12);
    }},
    {id:"bridge",z:-24,b:[-2600,-300,3400,640],q:.85,draw(c,r){
      /* the river: a band of sky-coloured water with a darker far bank */
      let gr=c.createLinearGradient(0,452,0,640);gr.addColorStop(0,"#8e8a98");gr.addColorStop(.25,"#a29a9e");gr.addColorStop(1,"#5c6478");c.fillStyle=gr;c.fillRect(-2600,452,6000,190);
      /* far bank trees: darker, closer, a few with the first green haze */
      for(let i=0;i<120;i++){const x=-2600+r()*6000,h=300+r()*360;tree(c,r,x,456,h,`rgba(48,52,64,${(.75+r()*.25).toFixed(2)})`,4+r()*4,"rgba(150,90,80,.6)",5);}
      c.fillStyle="#2c3038";c.beginPath();c.moveTo(-2600,448);for(let x=-2600;x<=3400;x+=40)c.lineTo(x,446+Math.sin(x*.013)*3+r()*4);c.lineTo(3400,462);c.lineTo(-2600,462);c.fill();
      /* reflections of that bank, broken by ripples */
      for(let y=462;y<560;y+=2){const a=.22*(1-(y-462)/100);c.fillStyle=`rgba(40,44,56,${a.toFixed(3)})`;for(let x=-2600;x<3400;x+=60+r()*80)c.fillRect(x+(r()-.5)*20,y,40+r()*90,1.4);}
      /* the banks: the river runs away from us under the bridge, so land closes in on both sides and the span reaches from one to the other */
      const wl=y=>lerp(-1310,-1760,(y-452)/188),wr=y=>lerp(-380,140,(y-452)/188);
      [[-1,wl],[1,wr]].forEach(([sd,edge])=>{const out=sd<0?-2600:3400,top=y=>y;
        c.beginPath();c.moveTo(out,440);c.lineTo(sd<0?-1570:-120,436);c.lineTo(sd<0?-1410:-280,420);c.lineTo(edge(462)+sd*-10,452);c.lineTo(edge(470),470);
        for(let y=470;y<=640;y+=10)c.lineTo(edge(y)+Math.sin(y*.3)*4,y);c.lineTo(out,640);c.closePath();
        let bg=c.createLinearGradient(0,420,0,640);bg.addColorStop(0,"#6a6650");bg.addColorStop(.3,"#4d4c3c");bg.addColorStop(1,"#3a3b30");c.fillStyle=bg;c.fill();
        c.strokeStyle="rgba(255,214,170,.25)";c.lineWidth=2;c.beginPath();c.moveTo(sd<0?-1570:-120,436);c.lineTo(sd<0?-1410:-280,420);c.stroke();
        for(let i=0;i<260;i++){const y=452+r()*186,x=edge(y)+sd*(10+r()*60);c.strokeStyle=`rgba(${120+r()*40|0},${110+r()*30|0},${80+r()*20|0},.55)`;c.lineWidth=1.4;c.beginPath();c.moveTo(x,y);c.lineTo(x+(r()-.5)*6,y-8-r()*16);c.stroke();}
        for(let i=0;i<500;i++){const y=440+r()*200,x=out+(edge(Math.max(452,y))-out)*r();c.fillStyle=`rgba(${r()<.5?"255,230,190":"20,22,18"},${(.03+r()*.06).toFixed(3)})`;c.fillRect(x,y,3+r()*8,1.5);}});
      /* the North Bridge: a long low timber span on paired piles with a gentle arch, set on stone abutments at both banks */
      const L=-1450,R=-250,deck=x=>402-38*Math.sin(Math.PI*clamp((x-L)/(R-L)));
      const wood="#3a2f27",woodLit="#7a5d43";
      [[L-70,L+60],[R-60,R+70]].forEach(([a,b])=>{c.fillStyle="#6b6a66";c.fillRect(a,deck(clamp((a+b)/2,L,R))+14,b-a,474-deck(clamp((a+b)/2,L,R))-14);
        for(let y=deck(clamp((a+b)/2,L,R))+18;y<472;y+=11)for(let x=a+((y/11|0)%2)*14;x<b;x+=28){c.fillStyle=`rgba(${r()<.5?"230,215,200":"30,30,34"},${(.12+r()*.12).toFixed(2)})`;c.fillRect(x+1,y,26,9);}
        c.fillStyle="rgba(255,214,170,.22)";c.fillRect(a,deck(clamp((a+b)/2,L,R))+14,b-a,2);});
      for(let x=L+95;x<=R-95;x+=95){const y=deck(x);c.fillStyle=wood;c.fillRect(x-7,y,14,470-y);c.fillRect(x+16,y,12,470-y);
        c.fillStyle="rgba(255,200,150,.18)";c.fillRect(x+4,y,3,470-y);
        c.strokeStyle="rgba(40,30,24,.9)";c.lineWidth=3;c.beginPath();c.moveTo(x-7,y+10);c.lineTo(x+28,470);c.moveTo(x+28,y+10);c.lineTo(x-7,470);c.stroke();}
      c.beginPath();for(let x=L-40;x<=R+40;x+=10){const y=deck(clamp(x,L,R));x===L-40?c.moveTo(x,y):c.lineTo(x,y);}for(let x=R+40;x>=L-40;x-=10)c.lineTo(x,deck(clamp(x,L,R))+16);c.closePath();c.fillStyle=wood;c.fill();
      c.strokeStyle=woodLit;c.lineWidth=2;c.beginPath();for(let x=L-40;x<=R+40;x+=10){const y=deck(clamp(x,L,R));x===L-40?c.moveTo(x,y):c.lineTo(x,y);}c.stroke();
      /* railing: posts, top rail and the X-braced panels */
      c.strokeStyle="#2e251f";c.lineWidth=5;c.beginPath();for(let x=L-40;x<=R+40;x+=10){const y=deck(clamp(x,L,R))-58;x===L-40?c.moveTo(x,y):c.lineTo(x,y);}c.stroke();
      c.strokeStyle="rgba(255,206,160,.35)";c.lineWidth=1.4;c.beginPath();for(let x=L-40;x<=R+40;x+=10){const y=deck(clamp(x,L,R))-60;x===L-40?c.moveTo(x,y):c.lineTo(x,y);}c.stroke();
      for(let x=L-40;x<=R+40;x+=52){const x2=Math.min(R+40,x+52),y1=deck(clamp(x,L,R)),y2=deck(clamp(x2,L,R));c.strokeStyle="#2e251f";c.lineWidth=4;c.beginPath();c.moveTo(x,y1);c.lineTo(x,y1-58);c.stroke();c.lineWidth=2.4;c.beginPath();c.moveTo(x,y1-56);c.lineTo(x2,y2-2);c.moveTo(x,y1-2);c.lineTo(x2,y2-56);c.stroke();}
      /* the bridge's reflection, darker and softened by the current */
      c.save();c.beginPath();c.moveTo(wl(470),470);c.lineTo(wr(470),470);c.lineTo(wr(640),640);c.lineTo(wl(640),640);c.closePath();c.clip();c.globalAlpha=.32;c.translate(0,940);c.scale(1,-1);
      for(let x=L+95;x<=R-95;x+=95){const y=deck(x);c.fillStyle="#2a2420";c.fillRect(x-7,y,14,470-y);c.fillRect(x+16,y,12,470-y);}
      c.beginPath();for(let x=L-40;x<=R+40;x+=10)x===L-40?c.moveTo(x,deck(clamp(x,L,R))):c.lineTo(x,deck(clamp(x,L,R)));for(let x=R+40;x>=L-40;x-=10)c.lineTo(x,deck(clamp(x,L,R))+16);c.closePath();c.fillStyle="#2a2420";c.fill();
      c.restore();
      for(let y=474;y<600;y+=3){c.fillStyle=`rgba(200,190,200,${(.06+r()*.05).toFixed(3)})`;for(let x=wl(y)+10;x<wr(y)-50;x+=30+r()*60)c.fillRect(x,y,10+r()*40,1);}
      /* far bank to the right of the bridge: a white farmhouse in the trees, one window lit */
      c.fillStyle="#cfc8bd";c.fillRect(900,384,190,70);c.fillStyle="#3b3a40";poly(c,[[886,386],[995,330],[1104,386]]);c.fill();
      c.fillStyle="#2a2a30";[920,960,1030,1060].forEach(x=>c.fillRect(x,402,14,20));c.fillStyle="#ffcf8a";c.fillRect(1000,402,14,20);
      c.fillStyle="rgba(255,207,138,.18)";c.fillRect(992,462,30,60);
      c.fillStyle="#3b3a40";c.fillRect(1040,318,14,40);
    }},
    {id:"bank",z:-7,b:[-1800,380,2600,1500],q:1,draw(c,r){
      /* the near bank: wet April grass, a gravel path to the statue, a split-rail fence */
      const top=x=>470+Math.sin(x*.006)*6;
      let gr=c.createLinearGradient(0,460,0,760);gr.addColorStop(0,"#4a4a3a");gr.addColorStop(.3,"#2f3326");gr.addColorStop(1,"#191c15");
      c.fillStyle=gr;c.beginPath();c.moveTo(-1800,1500);for(let x=-1800;x<=2600;x+=20)c.lineTo(x,top(x));c.lineTo(2600,1500);c.fill();
      for(let i=0;i<7000;i++){const x=-1800+r()*4400,y=top(x)+Math.pow(r(),.8)*290,l=2+r()*6*((y-460)/300+.3);c.strokeStyle=r()<.5?`rgba(120,130,80,${(.15+r()*.25).toFixed(2)})`:`rgba(20,24,16,${(.3+r()*.3).toFixed(2)})`;c.lineWidth=.8;c.beginPath();c.moveTo(x,y);c.lineTo(x+(r()-.5)*2,y-l);c.stroke();}
      /* dew catching the low sun */
      for(let i=0;i<500;i++){const x=-1800+r()*4400,y=top(x)+r()*280;c.fillStyle=`rgba(255,226,180,${(r()*.35).toFixed(2)})`;c.fillRect(x,y,1,1);}
      /* gravel path */
      c.fillStyle="#6c6458";poly(c,[[340,470],[420,470],[900,1500],[-120,1500]]);c.fill();grain(c,r,-120,470,900,1500,6000,.35,"30,26,22");grain(c,r,-120,470,900,1500,3000,.25,"230,210,180");
      c.fillStyle="rgba(255,214,160,.12)";poly(c,[[380,470],[420,470],[900,1500],[520,1500]]);c.fill();
      /* split-rail fence along the water */
      for(let x=-1700;x<2500;x+=150){if(x>140&&x<620)continue;const y=top(x)+18;c.fillStyle="#2a241f";c.fillRect(x-4,y-56,8,58);c.strokeStyle="#3a3129";c.lineWidth=5;c.beginPath();c.moveTo(x,y-46);c.lineTo(x+150,top(x+150)+18-44);c.moveTo(x,y-22);c.lineTo(x+150,top(x+150)+18-20);c.stroke();c.strokeStyle="rgba(255,200,150,.25)";c.lineWidth=1.2;c.beginPath();c.moveTo(x,y-48);c.lineTo(x+150,top(x+150)+18-46);c.stroke();}
      /* two big old trees at the edges of the bank */
      tree(c,r,-900,560,1100,"#16181a",22,"rgba(170,90,70,.7)",8);tree(c,r,1650,580,1200,"#16181a",24,"rgba(170,90,70,.7)",8);
    }},
    {id:"statue",z:0,b:[200,20,560,480],q:1.6,draw(c,r){
      /* granite: plinth, cap and base slab, cut into courses, speckled */
      const granite=(pts,top,bot)=>{poly(c,pts);const q=c.createLinearGradient(0,pts[0][1],0,pts[2][1]);q.addColorStop(0,top);q.addColorStop(1,bot);c.fillStyle=q;c.fill();};
      granite([[250,445],[505,445],[505,460],[250,460]],"#8d8a84","#5a5853");
      granite([[290,425],[465,425],[505,445],[250,445]],"#7e7b75","#5f5d58");
      granite([[320,245],[435,245],[435,425],[320,425]],"#8a877f","#55534e");
      granite([[335,237],[418,237],[435,245],[320,245]],"#a29e95","#6e6b65");
      c.save();poly(c,[[320,245],[435,245],[435,425],[320,425]]);c.clip();
      grain(c,r,320,245,435,425,2600,.28,"20,20,20");grain(c,r,320,245,435,425,1400,.25,"240,236,226");
      c.strokeStyle="rgba(30,28,26,.45)";c.lineWidth=1;[300,360].forEach(y=>{c.beginPath();c.moveTo(320,y);c.lineTo(435,y);c.stroke();});
      /* low sun on the right face of the plinth */
      const lg=c.createLinearGradient(320,0,435,0);lg.addColorStop(0,"rgba(0,0,0,.25)");lg.addColorStop(.6,"rgba(0,0,0,0)");lg.addColorStop(1,"rgba(255,196,130,.22)");c.fillStyle=lg;c.fillRect(320,245,115,180);
      c.restore();
      /* the inscription panel: Emerson's Concord Hymn, cut into the stone */
      c.fillStyle="rgba(40,38,34,.18)";c.fillRect(337,275,78,125);c.strokeStyle="rgba(30,28,26,.5)";c.lineWidth=.8;c.strokeRect(337,275,78,125);
      c.fillStyle="rgba(35,32,28,.75)";c.textAlign="center";c.font="600 4.2px Georgia,serif";
      ["1775","","BY THE RUDE BRIDGE","THAT ARCHED THE FLOOD","THEIR FLAG TO APRIL'S","BREEZE UNFURLED","HERE ONCE THE EMBATTLED","FARMERS STOOD","AND FIRED THE SHOT","HEARD ROUND THE WORLD","","1875"].forEach((t,i)=>{c.fillText(t,376,292+i*8.4);});
      c.fillStyle="rgba(240,234,220,.25)";["1775","","BY THE RUDE BRIDGE","THAT ARCHED THE FLOOD","THEIR FLAG TO APRIL'S","BREEZE UNFURLED","HERE ONCE THE EMBATTLED","FARMERS STOOD","AND FIRED THE SHOT","HEARD ROUND THE WORLD","","1875"].forEach((t,i)=>{c.fillText(t,376.4,292.5+i*8.4);});
      /* edges of each block catch the light */
      c.strokeStyle="rgba(255,232,200,.4)";c.lineWidth=1;c.beginPath();c.moveTo(335,237);c.lineTo(418,237);c.moveTo(320,245);c.lineTo(435,245);c.moveTo(290,425);c.lineTo(465,425);c.moveTo(250,445);c.lineTo(505,445);c.stroke();
      /* the bronze: a farmer stepping off his plough, musket in his right hand, left hand on the plough handle, coat thrown over it */
      const BZ="#26301f",BZd="#141a12",LIT="rgba(255,186,118,",PAT="rgba(120,160,128,";
      /* a sculpted limb: dark core, patina on the shadow side, warm sun on the right edge */
      const limb=(pts,w0,w1)=>{const path=(dx,k)=>{c.beginPath();pts.forEach((q,i)=>{const w=lerp(w0,w1,i/(pts.length-1));i?c.lineTo(q[0]+dx*w,q[1]):c.moveTo(q[0]+dx*w,q[1]);});};
        c.lineCap="round";c.lineJoin="round";path(0);c.strokeStyle=BZ;c.lineWidth=w0;c.stroke();
        path(-.18);c.strokeStyle="rgba(10,14,9,.35)";c.lineWidth=w0*.5;c.stroke();
        path(.36);c.strokeStyle=LIT+".32)";c.lineWidth=Math.max(.8,w0*.14);c.stroke();};
      const blob=(pts,fill)=>{c.beginPath();const n=pts.length;for(let i=0;i<n;i++){const p=pts[i],q=pts[(i+1)%n],mx=(p[0]+q[0])/2,my=(p[1]+q[1])/2;i?c.quadraticCurveTo(p[0],p[1],mx,my):c.moveTo(mx,my);}const p=pts[0],q=pts[1];c.quadraticCurveTo(p[0],p[1],(p[0]+q[0])/2,(p[1]+q[1])/2);c.closePath();c.fillStyle=fill;c.fill();};
      /* the small bronze base he stands on */
      c.fillStyle="#1d241a";c.fillRect(340,228,92,7);c.fillStyle=LIT+".4)";c.fillRect(340,228,92,1.2);
      /* plough: beam and handles behind him, the coat draped over */
      c.strokeStyle="#1a2016";c.lineWidth=5;c.lineCap="round";c.beginPath();c.moveTo(450,153);c.quadraticCurveTo(432,166,426,196);c.lineTo(418,232);c.stroke();
      c.lineWidth=4;c.beginPath();c.moveTo(440,150);c.quadraticCurveTo(424,166,420,198);c.lineTo(412,232);c.stroke();
      c.strokeStyle=LIT+".5)";c.lineWidth=1.1;c.beginPath();c.moveTo(452,152);c.quadraticCurveTo(434,166,428,196);c.stroke();
      blob([[404,168],[421,159],[432,174],[434,198],[441,232],[427,229],[416,233],[405,230],[399,233],[398,206]],"#202a1b");
      c.strokeStyle=BZd;c.lineWidth=1.2;[[[408,172],[412,200],[410,232]],[[418,170],[422,204],[420,232]]].forEach(l=>{c.beginPath();c.moveTo(l[0][0],l[0][1]);c.quadraticCurveTo(l[1][0],l[1][1],l[2][0],l[2][1]);c.stroke();});
      c.strokeStyle=LIT+".4)";c.beginPath();c.moveTo(416,165);c.quadraticCurveTo(430,190,429,232);c.stroke();
      /* legs: the back leg straight, the front leg stepping forward, breeches to the knee, stockings, buckled shoes */
      limb([[366,146],[362,170],[361,190],[364,212],[366,226]],14,8.5);
      limb([[386,146],[392,168],[394,188],[392,210],[391,226]],14,8.5);
      c.fillStyle=BZd;c.beginPath();c.ellipse(362,229,9,3.6,0,0,7);c.fill();c.beginPath();c.ellipse(396,229,10,3.6,0,0,7);c.fill();
      c.fillStyle=LIT+".6)";c.fillRect(398,227,4,1.2);c.fillRect(363,227,3,1.2);
      c.strokeStyle=BZd;c.lineWidth=1.4;[[355,188,368,190],[386,188,400,188]].forEach(([a,b,cc,d])=>{c.beginPath();c.moveTo(a,b);c.lineTo(cc,d);c.stroke();});
      /* torso: shirt open at the neck, waistcoat with a row of buttons, shirt sleeves */
      blob([[355,92],[364,83],[384,83],[395,92],[398,108],[392,128],[391,150],[359,150],[357,128],[352,108]],BZ);
      blob([[364,92],[385,92],[389,118],[388,148],[362,148],[360,118]],"#1e2719");
      c.fillStyle=LIT+".6)";for(let i=0;i<6;i++){c.beginPath();c.arc(375.5,97+i*8.6,1.1,0,7);c.fill();}
      c.strokeStyle=BZd;c.lineWidth=1.2;[[[364,96],[368,146]],[[386,96],[383,146]],[[360,150],[392,150]]].forEach(l=>{c.beginPath();c.moveTo(l[0][0],l[0][1]);c.lineTo(l[1][0],l[1][1]);c.stroke();});
      c.strokeStyle=LIT+".5)";c.lineWidth=1.6;c.beginPath();c.moveTo(399,88);c.quadraticCurveTo(404,110,396,132);c.lineTo(394,150);c.stroke();
      c.strokeStyle=PAT+".2)";c.lineWidth=1;for(let i=0;i<14;i++){const x=356+r()*36,y=90+r()*50;c.beginPath();c.moveTo(x,y);c.lineTo(x+(r()-.5)*2,y+6+r()*12);c.stroke();}
      /* right arm down at his side, gripping the musket; left arm reaching back to the plough handle */
      limb([[356,92],[348,106],[343,121],[349,136]],9.5,6.5);
      limb([[394,92],[404,106],[412,124],[424,138]],9.5,6);
      c.fillStyle="#2f3a27";c.beginPath();c.arc(349,138,4.2,0,7);c.fill();c.beginPath();c.arc(425,140,3.8,0,7);c.fill();
      c.fillStyle=LIT+".5)";c.beginPath();c.arc(350.5,137,1.8,0,7);c.fill();c.beginPath();c.arc(426.5,139,1.6,0,7);c.fill();
      /* the musket, upright, stock on the base, a glint along the barrel */
      c.strokeStyle="#161b14";c.lineWidth=3;c.beginPath();c.moveTo(347,62);c.lineTo(350,228);c.stroke();
      c.lineWidth=5;c.beginPath();c.moveTo(349,170);c.lineTo(351,228);c.stroke();
      c.strokeStyle=LIT+".55)";c.lineWidth=.8;c.beginPath();c.moveTo(348.4,64);c.lineTo(351.2,170);c.stroke();
      /* head: neck, jaw turned a little to his right, hair tied back, tricorn hat */
      limb([[372,74],[373,84]],8,9);
      blob([[364,60],[372,56],[380,60],[381,70],[376,78],[369,77],[364,70]],"#2b3624");
      c.fillStyle=LIT+".45)";blob([[376,60],[381,63],[381,70],[377,76],[378,66]],LIT+".45)");
      c.fillStyle=BZd;c.fillRect(366,66,3,1.2);c.fillRect(372,66,3,1.2);c.fillRect(368,72,5,1);
      c.strokeStyle="#1d241a";c.lineWidth=3;c.beginPath();c.moveTo(381,64);c.quadraticCurveTo(386,70,383,78);c.stroke();
      blob([[350,58],[358,50],[366,42],[378,44],[386,52],[392,58],[372,61]],"#1a2116");
      c.strokeStyle=LIT+".6)";c.lineWidth=1.2;c.beginPath();c.moveTo(366,42);c.quadraticCurveTo(380,44,386,52);c.lineTo(392,58);c.stroke();
      c.strokeStyle=BZd;c.lineWidth=1;c.beginPath();c.moveTo(352,58);c.quadraticCurveTo(372,63,391,58);c.stroke();
      /* a soft shadow from the base across the gravel */
      c.fillStyle="rgba(0,0,0,.35)";c.beginPath();c.ellipse(330,462,140,7,0,0,7);c.fill();
    }},
    {id:"front",z:3.2,b:[-1400,-200,2200,900],q:.4,draw(c,r){
      /* foreground: a dark overhanging branch at the top left and tall grass at the bottom edge, out of focus */
      const br=(x,y,a,len,w,d)=>{const x2=x+Math.cos(a)*len,y2=y+Math.sin(a)*len;[[2.2,.25],[1.4,.45],[1,.9]].forEach(([k,al])=>{c.strokeStyle=`rgba(11,12,12,${al})`;c.lineWidth=w*k;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo((x+x2)/2,(y+y2)/2+len*.12,x2,y2);c.stroke();});if(d>0&&len>6)for(let i=0;i<2;i++)br(x2,y2,a+(i?.45:-.35)+(r()-.5)*.3,len*.7,w*.62,d-1);};
      br(-1400,-160,.32,520,30,7);
      for(let i=0;i<900;i++){const x=-1400+r()*3600,y=700+r()*70,l=30+r()*90;c.strokeStyle=`rgba(${r()<.3?"40,46,30":"12,14,10"},${(.6+r()*.4).toFixed(2)})`;c.lineWidth=2+r()*3;c.beginPath();c.moveTo(x,y+60);c.quadraticCurveTo(x+(r()-.5)*20,y,x+(r()-.5)*40,y-l);c.stroke();}
    }}
  ];

  /* ---- live atmosphere ---- */
  const MIST=[];(()=>{const r=rngMake(9);for(let i=0;i<16;i++)MIST.push({x:-1600+r()*3600,y:430+r()*60,w:300+r()*500,h:16+r()*26,v:4+r()*8,a:.07+r()*.08,z:r()<.5?-20:-9});})();
  const GEESE=[[0,0],[-14,-6],[-28,-12],[-14,6],[-28,12],[-42,18]];

  function bake(card,proj){
    const P0=proj(378,460,card.z),P1=proj(478,460,card.z),sc=(P1[0]-P0[0])/100;
    const ox=P0[0]-378*sc,oy=P0[1]-460*sc;
    /* the part of the card that can be on screen, with room for the camera to move */
    const x0=Math.max(card.b[0],(-.25*W-ox)/sc),x1=Math.min(card.b[2],(1.25*W-ox)/sc),y0=Math.max(card.b[1],(-.25*H-oy)/sc),y1=Math.min(card.b[3],(1.25*H-oy)/sc);
    const res=Math.min(4,sc*dpr*card.q);
    const bw=Math.max(1,Math.ceil((x1-x0)*res)),bh=Math.max(1,Math.ceil((y1-y0)*res));
    const bmp=document.createElement("canvas");bmp.width=Math.min(5200,bw);bmp.height=Math.min(3600,bh);
    const c=bmp.getContext("2d"),rx=bmp.width/(x1-x0),ry=bmp.height/(y1-y0);
    c.setTransform(rx,0,0,ry,-x0*rx,-y0*ry);c.lineCap="round";c.lineJoin="round";
    card.draw(c,rngMake(card.id.length*977+13));
    return{bmp,x0,y0,x1,y1};
  }

  function layout(){
    W=innerWidth;H=innerHeight;dpr=Math.min(1.5,devicePixelRatio||1);
    cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);
    stamp="";
  }
  function build(){
    box=document.getElementById("concord");if(!box)return false;
    cv=document.createElement("canvas");cv.style.cssText="position:absolute;inset:0;width:100%;height:100%";box.appendChild(cv);g=cv.getContext("2d");
    layout();addEventListener("resize",layout);return true;
  }

  function sky(lp,T){
    /* dawn: night blue at the top, a band of rose, gold where the sun is about to clear the trees */
    const gr=g.createLinearGradient(0,0,0,cv.height*.62);
    gr.addColorStop(0,"#16213a");gr.addColorStop(.38,"#3f4a6b");gr.addColorStop(.7,"#a88a96");gr.addColorStop(.88,"#e6b48e");gr.addColorStop(1,"#f4d0a2");
    g.fillStyle=gr;g.fillRect(0,0,cv.width,cv.height);
    /* the last stars, fading as the light comes */
    const r=rngMake(3);g.fillStyle="#fff";
    for(let i=0;i<70;i++){const x=r()*cv.width,y=r()*cv.height*.3,a=(.15+r()*.5)*(1-lp*.7)*(1-y/(cv.height*.3));g.globalAlpha=a*(.8+.2*Math.sin(T*1.5+i));g.fillRect(x,y,dpr,dpr);}
    g.globalAlpha=1;
    /* thin cloud bars lit from below */
    for(let i=0;i<7;i++){const y=cv.height*(.12+r()*.28),x=(r()*1.4-.2)*cv.width+T*2*dpr,w=cv.width*(.2+r()*.35),h=cv.height*(.006+r()*.012);const cg=g.createLinearGradient(0,y-h,0,y+h);cg.addColorStop(0,"rgba(120,90,110,0)");cg.addColorStop(.5,`rgba(${i%2?"240,170,140":"200,140,140"},${(.25+r()*.25).toFixed(2)})`);cg.addColorStop(1,"rgba(255,200,150,0)");g.fillStyle=cg;g.beginPath();g.ellipse(x,y,w/2,h,0,0,7);g.fill();}
  }

  function set(s,proj){
    if(!built){built=build();t0=performance.now();}
    if(!built)return;
    const a=sm(IN0,IN1,s)*(1-sm(OUT0,OUT1,s));
    if(a<=.002||!proj){box.style.display="none";return;}
    box.style.display="block";box.style.opacity=a.toFixed(3);
    const T=still?0:(performance.now()-t0)/1000,lp=clamp((s-S0)/(S1-S0));
    /* re-paint the cards when the size or the camera's distance changes enough to matter */
    const P0=proj(378,460,0),P1=proj(478,460,0),sc0=(P1[0]-P0[0])/100,key=W+"x"+H+":"+Math.round(Math.log(sc0)*6);
    if(key!==stamp){stamp=key;cards.length=0;CARDS.forEach(c=>cards.push(Object.assign({card:c},bake(c,proj))));}

    g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.globalCompositeOperation="source-over";
    sky(lp,T);
    /* the sun behind the woods to the right, rising a little over the beat */
    const sp=proj(1500,452-60*lp,-46),sx=sp[0]*dpr,sy=sp[1]*dpr,sr=cv.height*.5;
    let gr=g.createRadialGradient(sx,sy,0,sx,sy,sr);gr.addColorStop(0,"rgba(255,236,190,.95)");gr.addColorStop(.06,"rgba(255,214,150,.6)");gr.addColorStop(.3,"rgba(255,170,110,.18)");gr.addColorStop(1,"rgba(255,150,100,0)");
    g.globalCompositeOperation="lighter";g.fillStyle=gr;g.fillRect(0,0,cv.width,cv.height);g.globalCompositeOperation="source-over";

    const draw=(k)=>{const c=k.card,Q0=proj(378,460,c.z),Q1=proj(478,460,c.z),sc=(Q1[0]-Q0[0])/100,z=sc*dpr;
      g.setTransform(z,0,0,z,(Q0[0]-378*sc)*dpr,(Q0[1]-460*sc)*dpr);g.drawImage(k.bmp,k.x0,k.y0,k.x1-k.x0,k.y1-k.y0);return{sc,Q0};};
    const mist=(zf)=>{MIST.forEach(m=>{if(m.z!==zf)return;const Q0=proj(378,460,m.z),Q1=proj(478,460,m.z),sc=(Q1[0]-Q0[0])/100,z=sc*dpr;g.setTransform(z,0,0,z,(Q0[0]-378*sc)*dpr,(Q0[1]-460*sc)*dpr);
      const x=((m.x+T*m.v+1600)%3600)-1600,mg=g.createRadialGradient(x,m.y,0,x,m.y,m.w);mg.addColorStop(0,`rgba(236,222,214,${(m.a*(1-lp*.4)).toFixed(3)})`);mg.addColorStop(1,"rgba(236,222,214,0)");
      g.save();g.translate(x,m.y);g.scale(1,m.h/m.w);g.translate(-x,-m.y);g.fillStyle=mg;g.fillRect(x-m.w,m.y-m.w,m.w*2,m.w*2);g.restore();});};

    cards.forEach(k=>{
      if(k.card.id==="bank")mist(-20);
      const o=draw(k);
      if(k.card.id==="bridge"){
        /* shimmer on the water: thin bright lines that drift with the current */
        const r=rngMake(17);g.globalCompositeOperation="lighter";
        for(let i=0;i<120;i++){const x=-1800+r()*3800,y=478+Math.pow(r(),1.4)*130,l=8+r()*40,ph=r()*6.28,v=.5+.5*Math.sin(T*1.3+ph);g.fillStyle=`rgba(255,226,190,${(v*.16).toFixed(3)})`;g.fillRect(x+Math.sin(T*.4+ph)*6,y,l,1.1);}
        g.globalCompositeOperation="source-over";
        /* geese crossing high, wings beating */
        const gx=-1600+((T*60)%5200),gy=-120+Math.sin(T*.2)*10;
        g.strokeStyle="rgba(30,30,40,.85)";g.lineWidth=2.6;
        GEESE.forEach(([dx,dy],i)=>{const f=Math.sin(T*6+i*.9)*7,x=gx+dx*3,y=gy+dy*3;g.beginPath();g.moveTo(x-12,y+f*.5);g.quadraticCurveTo(x-5,y-f,x,y);g.quadraticCurveTo(x+5,y-f,x+12,y+f*.5);g.stroke();});
      }
      if(k.card.id==="statue")mist(-9);
    });

    /* light: a warm wash from the sun side, darker at the bottom so the line of text reads */
    g.setTransform(1,0,0,1,0,0);
    gr=g.createLinearGradient(cv.width,0,0,0);gr.addColorStop(0,"rgba(255,180,120,.12)");gr.addColorStop(.6,"rgba(255,180,120,0)");g.fillStyle=gr;g.fillRect(0,0,cv.width,cv.height);
    gr=g.createLinearGradient(0,cv.height*.6,0,cv.height);gr.addColorStop(0,"rgba(14,18,20,0)");gr.addColorStop(1,"rgba(14,18,20,.78)");g.fillStyle=gr;g.fillRect(0,cv.height*.6,cv.width,cv.height*.4);
    gr=g.createRadialGradient(cv.width/2,cv.height*.45,cv.height*.3,cv.width/2,cv.height*.45,cv.height*1.1);gr.addColorStop(0,"rgba(0,0,0,0)");gr.addColorStop(1,"rgba(0,0,0,.45)");g.fillStyle=gr;g.fillRect(0,0,cv.width,cv.height);
  }
  return{set};
})();
