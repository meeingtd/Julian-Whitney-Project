/* Opening scene, "night flight": the window seat at cruise, on a clear night above a moonlit cloud deck. A town glows through gaps in the
   clouds, a storm flickers on the horizon, another jet crosses with its strobes. Same camera and beats as the Logan version: the eye opens,
   one blink, the window grows past the screen, the camera falls into one star and that star becomes the globe. AIRPORT.set(u) and punch().
   Beats (u): .00 eye opens (clock, once) | .00-.14 slow push toward the glass | .105-.15 one blink | .15-.52 window fills the screen | .45-.9 fall into the star | .935-1 hand over to the globe. */
window.AIRPORT=(()=>{
  const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
  const sm=(a,b,t)=>{t=clamp((t-a)/(b-a));return t*t*(3-2*t);};
  const lerp=(a,b,t)=>a+(b-a)*t;
  const rngMake=seed=>()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
  const CX=800,CY=450,SX=800,SY=214,HZ=520;            /* window centre, hero star, horizon (all in the 1600x900 scene space) */
  const HOLE={x:565,y:130,w:470,h:640,r:190};
  const still=matchMedia("(prefers-reduced-motion: reduce)").matches;
  let box,cv,g,W=0,H=0,dpr=1,s=1,k=1,world=null,fore=null,foreMode=false,built=false,t0=0;
  let boomAt=-1,armed=true,lastU=0,bcv=null,bg=null,hero=[0,0,0];
  const sprites={};
  const lights=[];           /* live lights: x,y,size,sprite,pattern,phase,gain */
  const stars=[];
  const scratches=[];
  let bl1=null,bl2=null,grainPat=null;

  /* ---- small helpers ---- */
  function rr(c,x,y,w,h,r){c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
  function glowSprite(rgb){
    const c=document.createElement("canvas");c.width=c.height=128;const q=c.getContext("2d"),gr=q.createRadialGradient(64,64,0,64,64,64);
    gr.addColorStop(0,`rgba(${rgb},1)`);gr.addColorStop(.07,`rgba(${rgb},.95)`);gr.addColorStop(.2,`rgba(${rgb},.34)`);gr.addColorStop(.5,`rgba(${rgb},.08)`);gr.addColorStop(1,`rgba(${rgb},0)`);
    q.fillStyle=gr;q.fillRect(0,0,128,128);return c;
  }
  function makeSprites(){
    sprites.white=glowSprite("255,246,230");sprites.sodium=glowSprite("255,196,120");sprites.red=glowSprite("255,70,56");
    sprites.green=glowSprite("90,255,160");sprites.blue=glowSprite("70,130,255");sprites.amber=glowSprite("255,170,40");sprites.cool=glowSprite("190,225,255");
  }
  const glow=(c,sp,x,y,size,a)=>{if(a<=.004)return;c.globalAlpha=Math.min(1,a);c.drawImage(sprites[sp],x-size,y-size,size*2,size*2);};
  /* A light that is drawn into the still picture and, if it blinks, drawn live instead. pat: steady | beacon | strobe | rotate | rabbit | twinkle */
  function lamp(c,sp,x,y,size,a,pat,phase,reflect){
    if(pat&&pat!=="steady")lights.push({sp,x,y,size,a,pat,phase:phase||0,fore:foreMode});
    else if(c){glow(c,sp,x,y,size,a);if(reflect&&y>HZ){c.globalAlpha=a*.22;const len=Math.min(60,size*(1.2+(y-HZ)/60));c.drawImage(sprites[sp],x-size*.28,y,size*.56,len);}}
  }
  function pattern(p,t,ph){
    switch(p){
      case "beacon":{const x=((t+ph)%1.05);return Math.exp(-x/.11)*.95+.04;}
      case "strobe":{const x=(t+ph)%1.45;const f=v=>v>=0&&v<.06?1-v/.06:0;return Math.max(f(x),f(x-.17))*1+.02;}
      case "rotate":{const v=.5+.5*Math.cos((t+ph)*5.2);return v*v*v*.95+.05;}
      case "twinkle":return .72+.28*Math.sin(t*2.3+ph*9)*Math.sin(t*.7+ph*3);
      case "rabbit":{const i=Math.floor(t*9)%14;return i===ph?1:.16;}
      default:return 1;
    }
  }

  const MX=330,MY=150;                                   /* the moon */
  const WING=[496,636,616,316];                          /* our wing's own small canvas: x, y, w, h */
  const BW=2400;                                         /* cloud bands are this wide in scene px and wrap */
  const BANDS=[{v:1.2,r0:0,r1:.25},{v:4,r0:.2,r1:.72,holes:1},{v:10,r0:.7,r1:1}];
  const HOLES=[[1040,604,210,52],[460,572,110,26],[1880,590,160,36]];
  function paintWorld(){
    const rng=rngMake(11);
    k=clamp(s*dpr*1.9,1,2.6);
    world=document.createElement("canvas");world.width=Math.round(1600*k);world.height=Math.round(900*k);
    const c=world.getContext("2d");c.scale(k,k);lights.length=0;foreMode=false;
    /* night at cruise: black overhead, deep blue lower, a thin band of airglow on the horizon */
    let gr=c.createLinearGradient(0,-300,0,HZ+6);
    gr.addColorStop(0,"#010208");gr.addColorStop(.5,"#040a1a");gr.addColorStop(.82,"#0c1830");gr.addColorStop(.95,"#1c3044");gr.addColorStop(1,"#2a4048");
    c.fillStyle=gr;c.fillRect(0,-300,1600,HZ+310);
    gr=c.createLinearGradient(0,HZ-40,0,HZ+4);gr.addColorStop(0,"rgba(90,160,140,0)");gr.addColorStop(.8,"rgba(90,160,140,.12)");gr.addColorStop(1,"rgba(90,160,140,0)");c.fillStyle=gr;c.fillRect(0,HZ-40,1600,44);
    /* the Milky Way, faint, tilted */
    c.save();c.translate(800,120);c.rotate(-.42);for(let i=0;i<60;i++){const x=(rng()-.5)*2400,w=80+rng()*200;const q=c.createRadialGradient(x,0,0,x,0,w);q.addColorStop(0,"rgba(170,180,210,.035)");q.addColorStop(1,"rgba(170,180,210,0)");c.fillStyle=q;c.save();c.scale(1,.28);c.fillRect(x-w,-w,w*2,w*2);c.restore();}c.restore();
    /* the moon, high on the left: it lights the cloud tops */
    gr=c.createRadialGradient(MX,MY,0,MX,MY,260);gr.addColorStop(0,"rgba(200,215,240,.22)");gr.addColorStop(1,"rgba(200,215,240,0)");c.fillStyle=gr;c.fillRect(MX-260,MY-260,520,520);
    c.fillStyle="#e9edf2";c.beginPath();c.arc(MX,MY,17,0,7);c.fill();c.fillStyle="rgba(150,160,175,.35)";[[-5,-4,5],[6,3,4],[-2,7,3]].forEach(([x,y,r])=>{c.beginPath();c.arc(MX+x,MY+y,r,0,7);c.fill();});
    /* the ground far below: dark farmland, seen only through gaps; the lit town lives in the moving middle band */
    gr=c.createLinearGradient(0,HZ,0,900);gr.addColorStop(0,"#0b1118");gr.addColorStop(1,"#04070a");c.fillStyle=gr;c.fillRect(-100,HZ,1800,420);
    /* a storm on the horizon far to the right: a tall anvil, lit from inside by lightning (live) */
    c.fillStyle="#141c2a";c.beginPath();c.moveTo(1180,HZ+4);c.bezierCurveTo(1200,HZ-60,1240,HZ-120,1300,HZ-128);c.bezierCurveTo(1380,HZ-136,1470,HZ-120,1520,HZ-118);c.bezierCurveTo(1460,HZ-100,1420,HZ-70,1420,HZ+4);c.fill();
    gr=c.createLinearGradient(0,HZ-130,0,HZ);gr.addColorStop(0,"rgba(150,165,195,.25)");gr.addColorStop(1,"rgba(150,165,195,0)");c.fillStyle=gr;c.fill();
    /* thin haze over the far deck */
    gr=c.createLinearGradient(0,HZ-30,0,HZ+80);gr.addColorStop(0,"rgba(60,80,100,0)");gr.addColorStop(.4,"rgba(60,80,100,.25)");gr.addColorStop(1,"rgba(60,80,100,0)");c.fillStyle=gr;c.fillRect(0,HZ-30,1600,110);

    paintBands();
    /* our own wing, on its own canvas: lower right, lit by the strobe, red navigation light at the tip */
    fore=document.createElement("canvas");fore.width=Math.round(WING[2]*k);fore.height=Math.round(WING[3]*k);
    const f=fore.getContext("2d");f.scale(k,k);f.translate(-WING[0],-WING[1]);foreMode=true;
    f.beginPath();f.moveTo(578,716);f.lineTo(660,704);f.lineTo(1110,640);f.lineTo(1110,950);f.lineTo(500,950);f.closePath();
    const wg=f.createLinearGradient(0,640,0,900);wg.addColorStop(0,"#2c333b");wg.addColorStop(.18,"#1b2128");wg.addColorStop(1,"#0a0d11");f.fillStyle=wg;f.fill();
    f.save();f.clip();
    f.strokeStyle="rgba(210,225,240,.28)";f.lineWidth=1.5;f.beginPath();f.moveTo(578,716);f.lineTo(660,704);f.lineTo(1110,640);f.stroke();
    f.strokeStyle="rgba(0,0,0,.45)";f.lineWidth=1;for(let i=1;i<7;i++){f.beginPath();f.moveTo(600+i*70,712-i*5);f.lineTo(520+i*110,950);f.stroke();}
    f.strokeStyle="rgba(255,255,255,.06)";f.beginPath();f.moveTo(560,790);f.lineTo(1110,730);f.moveTo(540,850);f.lineTo(1110,800);f.stroke();
    f.fillStyle="rgba(255,255,255,.1)";for(let i=0;i<150;i++)f.fillRect(600+rng()*500,722+rng()*190,1,1);
    const sg=f.createRadialGradient(780,790,0,780,790,420);sg.addColorStop(0,"rgba(170,190,225,.12)");sg.addColorStop(1,"rgba(170,190,225,0)");f.fillStyle=sg;f.fillRect(480,640,700,320);
    f.restore();
    lamp(f,"red",578,716,10,.55,"steady");lamp(null,"red",578,716,16,1,"steady");
    lamp(null,"white",582,714,14,.9,"strobe",.4);
    foreMode=false;
  }

  /* live traffic: a baggage tug with three carts working along the taxilane, and an arrival on approach far off to the right */
  /* ---- the cloud deck: three bands of puffs in perspective, each on its own wrapping canvas so it drifts past at its own depth ---- */
  function puff(c,x,y,r,moon,tops){
    const q=c.createLinearGradient(0,y-r*.45,0,y+r*.45);
    q.addColorStop(0,`rgba(${158*moon|0},${172*moon|0},${200*moon|0},.58)`);q.addColorStop(.4,`rgba(${78*moon|0},${90*moon|0},${116*moon|0},.5)`);q.addColorStop(1,"rgba(12,18,30,.55)");
    c.fillStyle=q;c.beginPath();c.ellipse(x,y,r,r*.42,0,0,7);c.fill();
    /* the moon is up to the left: each billow's upper left edge catches it */
    const h=c.createRadialGradient(x-r*.25,y-r*.2,0,x-r*.25,y-r*.2,r*.7);h.addColorStop(0,`rgba(205,215,235,${(.16*moon).toFixed(3)})`);h.addColorStop(1,"rgba(205,215,235,0)");
    c.fillStyle=h;c.beginPath();c.ellipse(x-r*.12,y-r*.1,r*.8,r*.32,0,0,7);c.fill();
    if(tops)for(let i=0;i<3;i++){const a=-2.6+i*.8,tx=x+Math.cos(a)*r*.62,ty=y+Math.sin(a)*r*.3,tr=r*(.28+.08*i);c.fillStyle=`rgba(${150*moon|0},${165*moon|0},${195*moon|0},.3)`;c.beginPath();c.ellipse(tx,ty,tr,tr*.5,0,0,7);c.fill();}
  }
  /* a town under a gap in the clouds: a black river, a street grid squashed by our height, a brighter centre, a highway leaving it */
  function town(c,cx,cy,rx,ry,rng){
    c.strokeStyle="rgba(2,4,8,.9)";c.lineWidth=ry*.18;c.beginPath();c.moveTo(cx-rx*1.1,cy+ry*.2);c.bezierCurveTo(cx-rx*.3,cy-ry*.4,cx+rx*.2,cy+ry*.7,cx+rx*1.1,cy+ry*.1);c.stroke();
    c.save();c.translate(cx,cy);c.scale(1,ry/rx);c.rotate(.35);c.lineWidth=1.2;
    for(let i=-6;i<=6;i++)for(let j=-6;j<=6;j++){if(i*i+j*j>40||rng()<.25)continue;const x=i*rx*.16,y=j*rx*.16;
      c.strokeStyle=`rgba(255,${170+rng()*40|0},100,${(.08+rng()*.14).toFixed(2)})`;c.beginPath();c.moveTo(x,y);c.lineTo(x+rx*.16,y);c.moveTo(x,y);c.lineTo(x,y+rx*.16);c.stroke();}
    c.restore();
    for(let i=0;i<340;i++){const a=rng()*6.28,r=Math.pow(rng(),.8),x=cx+Math.cos(a)*r*rx,y=cy+Math.sin(a)*r*ry;glow(c,rng()<.8?"sodium":"white",x,y,1+rng()*1.8,.3+rng()*.55);}
    {const q=c.createRadialGradient(0,0,0,0,0,rx*.6);q.addColorStop(0,"rgba(255,180,100,.3)");q.addColorStop(1,"rgba(255,180,100,0)");c.save();c.translate(cx,cy);c.scale(1,ry/rx);c.globalAlpha=1;c.fillStyle=q;c.fillRect(-rx,-rx,rx*2,rx*2);c.restore();}
    c.globalAlpha=1;c.lineWidth=1.4;c.strokeStyle="rgba(255,236,200,.6)";c.beginPath();c.moveTo(cx,cy);c.quadraticCurveTo(cx+rx*.8,cy+ry*.5,cx+rx*1.6,cy+ry*.2);c.stroke();
    c.strokeStyle="rgba(255,80,60,.5)";c.lineWidth=1;c.beginPath();c.moveTo(cx,cy+1.5);c.quadraticCurveTo(cx+rx*.8,cy+ry*.5+1.5,cx+rx*1.6,cy+ry*.2+1.5);c.stroke();
  }
  function paintBands(){
    const rng=rngMake(31),kb=Math.min(k,2);
    BANDS.forEach((b,bi)=>{
      /* the band's canvas reaches past its puffs on every side, so no billow is ever cut flat */
      const rowY=t=>HZ+2+t*t*420,rowR=t=>(5+Math.pow(t,1.5)*190)*1.3;
      b.y0=Math.floor(rowY(b.r0)-rowR(b.r0)*.6-8);b.y1=Math.min(980,Math.ceil(rowY(b.r1)+rowR(b.r1)*.6+8));
      const h=b.y1-b.y0;b.cv=document.createElement("canvas");b.cv.width=Math.round(BW*kb);b.cv.height=Math.round(h*kb);
      const c=b.cv.getContext("2d");c.scale(kb,kb);c.translate(0,-b.y0);
      const wrap=(x,r,f)=>{f(x);if(x<r)f(x+BW);if(x>BW-r)f(x-BW);};
      if(b.holes)HOLES.forEach(([hx,hy,rx,ry])=>wrap(hx,rx*1.7,x=>{c.globalAlpha=1;c.fillStyle="#070b10";c.beginPath();c.ellipse(x,hy,rx*1.25,ry*1.3,0,0,7);c.fill();town(c,x,hy,rx*.9,ry*.85,rngMake(7+hx|0));}));
      c.globalAlpha=1;
      for(let i=0;i<=60;i++){const t=lerp(b.r0,b.r1,i/60),y=HZ+2+t*t*420,sz=5+Math.pow(t,1.5)*190,n=Math.ceil(BW/sz*1.6);
        for(let j=0;j<n;j++){const x=rng()*BW,yy=y+(rng()-.5)*sz*.25;
          if(b.holes&&HOLES.some(([hx,hy,rx,ry])=>{const dx=Math.min(Math.abs(x-hx),BW-Math.abs(x-hx));return(dx/rx)**2+((yy-hy)/ry)**2<1+rng()*.5;}))continue;
          const r=sz*(.6+rng()*.7),mx=Math.min(Math.abs(x-MX-200),BW-Math.abs(x-MX-200)),moon=Math.exp(-Math.pow(mx/800,2))*.5+.34;
          wrap(x,r,xx=>puff(c,xx,yy,r,moon,bi===2&&rng()<.5));}}
      if(b.holes)HOLES.forEach(([hx,hy,rx,ry])=>wrap(hx,rx*2,x=>{const q=c.createRadialGradient(0,0,0,0,0,rx*1.9);q.addColorStop(0,"rgba(255,170,90,.2)");q.addColorStop(1,"rgba(255,170,90,0)");c.save();c.translate(x,hy);c.scale(1,ry/rx);c.fillStyle=q;c.fillRect(-rx*2,-rx*2,rx*4,rx*4);c.restore();}));
    });
  }
  /* the deck slides left (we look out the left side; the nose is to the right), near bands faster than far ones */
  function drawBands(c,T,a){
    BANDS.forEach(b=>{if(!b.cv)return;const off=-((T*b.v+400)%BW);c.globalAlpha=a;
      for(let x=off;x<1700+BW;x+=BW)c.drawImage(b.cv,x-100,b.y0,BW,b.y1-b.y0);});
    c.globalAlpha=1;
  }

  /* live: lightning inside the far storm, and another jet crossing high on the right with its strobes */
  function traffic(c,T,a){
    if(a<.01)return;
    c.globalCompositeOperation="lighter";
    const fl=(t=>{const x=t%5.3;return x<.08?1:x>.2&&x<.26?.6:x>2.9&&x<2.95?.45:0;})(T);
    if(fl>0){c.globalAlpha=fl*a*.6;const q=c.createRadialGradient(1330,HZ-70,0,1330,HZ-70,170);q.addColorStop(0,"rgba(210,220,255,.9)");q.addColorStop(1,"rgba(210,220,255,0)");c.fillStyle=q;c.fillRect(1160,HZ-240,340,260);}
    const tA=(T/38)%1,ax=lerp(1500,980,tA),ay=lerp(250,300,tA),fa=sm(0,.1,tA)*(1-sm(.85,1,tA))*a;
    const st=pattern("strobe",T,.9),be=pattern("beacon",T,.6);
    glow(c,"red",ax,ay,4,be*fa);glow(c,"white",ax-6,ay,5,st*fa);glow(c,"white",ax+6,ay,5,st*fa);glow(c,"green",ax+5,ay+.5,2.5,.7*fa);
    c.globalCompositeOperation="source-over";c.globalAlpha=1;
  }

  /* ---- stars ---- */
  function makeStars(){
    const rng=rngMake(5);stars.length=0;
    for(let i=0;i<420;i++){
      const x=-500+rng()*2600,y=-380+rng()*(HZ+380),ext=1-Math.pow(clamp((y-80)/(HZ-80)),2.4);
      if(Math.hypot(x-SX,y-SY)<26)continue;
      if(y>HZ-3||Math.hypot(x-330,y-150)<40||(x>1180&&x<1520&&y>HZ-130))continue;
      const m=Math.pow(rng(),3.2);
      stars.push({x,y,a:(.22+.78*m)*ext,r:.5+m*1.5,c:rng()<.2?"255,226,200":rng()<.4?"200,222,255":"255,255,255",ph:rng()*9});
    }
  }

  /* ---- cabin: the wall, the plastic reveal, the glass ---- */
  function makeScratches(){
    const rng=rngMake(23);scratches.length=0;
    for(let i=0;i<26;i++){const x=HOLE.x+30+rng()*(HOLE.w-60),y=HOLE.y+30+rng()*(HOLE.h-60),a=rng()*6.28,l=5+rng()*18;scratches.push([x,y,x+Math.cos(a)*l,y+Math.sin(a)*l,(x+Math.cos(a)*l*.5)+(rng()-.5)*8,(y+Math.sin(a)*l*.5)+(rng()-.5)*8,.03+rng()*.05]);}
    for(let i=0;i<40;i++)scratches.push([HOLE.x+20+rng()*(HOLE.w-40),HOLE.y+20+rng()*(HOLE.h-40),0,0,0,0,-(.12+rng()*.2)]);
  }
  function drawCabin(c){
    const o=[-3000,-3000,7600,6900];
    let gr=c.createLinearGradient(0,0,1600,900);gr.addColorStop(0,"#34322d");gr.addColorStop(.5,"#25231f");gr.addColorStop(1,"#171612");
    c.beginPath();c.rect(o[0],o[1],o[2],o[3]);rr(c,HOLE.x,HOLE.y,HOLE.w,HOLE.h,HOLE.r);c.fillStyle=gr;c.fill("evenodd");
    gr=c.createRadialGradient(320,160,0,320,160,620);gr.addColorStop(0,"rgba(255,226,180,.10)");gr.addColorStop(1,"rgba(255,226,180,0)");
    c.save();c.beginPath();c.rect(o[0],o[1],o[2],o[3]);rr(c,HOLE.x,HOLE.y,HOLE.w,HOLE.h,HOLE.r);c.clip("evenodd");c.fillStyle=gr;c.fillRect(-400,-400,2400,1600);
    /* moonlight through the glass: a cool soft patch of the window's shape thrown down and right onto the side wall, and the bezel's own shadow */
    {const mx=150,my=110;c.save();c.translate(mx,my);c.beginPath();rr(c,HOLE.x+20,HOLE.y+20,HOLE.w-40,HOLE.h-40,HOLE.r-20);c.restore();
      const mg=c.createRadialGradient(CX+mx,CY+my,60,CX+mx,CY+my,420);mg.addColorStop(0,"rgba(170,196,230,.10)");mg.addColorStop(1,"rgba(170,196,230,0)");c.fillStyle=mg;c.fill();
      const ao=c.createRadialGradient(CX,CY+40,330,CX,CY+40,470);ao.addColorStop(0,"rgba(0,0,0,.28)");ao.addColorStop(1,"rgba(0,0,0,0)");c.fillStyle=ao;c.fillRect(CX-600,CY-600,1200,1200);}
    c.fillStyle="rgba(0,0,0,.35)";c.fillRect(1240,-3000,3,6900);c.fillStyle="rgba(255,240,220,.06)";c.fillRect(1243,-3000,1.5,6900);
    c.fillStyle="rgba(0,0,0,.4)";for(let i=0;i<5;i++)c.fillRect(1320,360+i*9,120,3.5);
    c.restore();
    /* bezel: raised plastic ring, top edge lit, bottom edge in shadow */
    const ring=(x,y,w,h,r,top,bot,edge)=>{
      c.beginPath();rr(c,x,y,w,h,r);rr(c,HOLE.x,HOLE.y,HOLE.w,HOLE.h,HOLE.r);
      const q=c.createLinearGradient(0,y,0,y+h);q.addColorStop(0,top);q.addColorStop(1,bot);c.fillStyle=q;c.fill("evenodd");
      c.beginPath();rr(c,x,y,w,h,r);c.strokeStyle=edge;c.lineWidth=1.4;c.stroke();
    };
    ring(512,76,576,748,236,"#45433d","#1b1a17","rgba(255,244,226,.18)");
    ring(540,104,520,692,214,"#201f1c","#2b2a26","rgba(0,0,0,.55)");
    c.beginPath();rr(c,HOLE.x,HOLE.y,HOLE.w,HOLE.h,HOLE.r);gr=c.createLinearGradient(HOLE.x,HOLE.y,HOLE.x+HOLE.w,HOLE.y+HOLE.h);gr.addColorStop(0,"rgba(255,244,226,.40)");gr.addColorStop(.5,"rgba(255,244,226,.05)");gr.addColorStop(1,"rgba(0,0,0,.6)");c.strokeStyle=gr;c.lineWidth=3;c.stroke();
    /* the glass */
    c.save();c.beginPath();rr(c,HOLE.x,HOLE.y,HOLE.w,HOLE.h,HOLE.r);c.clip();
    gr=c.createRadialGradient(CX,CY,170,CX,CY,420);gr.addColorStop(0,"rgba(0,0,0,0)");gr.addColorStop(.7,"rgba(40,60,76,.12)");gr.addColorStop(1,"rgba(6,10,16,.62)");c.fillStyle=gr;c.fillRect(HOLE.x,HOLE.y,HOLE.w,HOLE.h);
    gr=c.createLinearGradient(HOLE.x,HOLE.y,HOLE.x+HOLE.w,HOLE.y+HOLE.h);gr.addColorStop(0,"rgba(255,236,206,0)");gr.addColorStop(.36,"rgba(255,236,206,0)");gr.addColorStop(.46,"rgba(255,236,206,.07)");gr.addColorStop(.52,"rgba(255,236,206,.02)");gr.addColorStop(.6,"rgba(255,236,206,.045)");gr.addColorStop(1,"rgba(255,236,206,0)");c.fillStyle=gr;c.fillRect(HOLE.x,HOLE.y,HOLE.w,HOLE.h);
        c.lineCap="round";scratches.forEach(q=>{if(q[6]>0){c.strokeStyle=`rgba(255,255,255,${q[6].toFixed(3)})`;c.lineWidth=.8;c.beginPath();c.moveTo(q[0],q[1]);c.quadraticCurveTo(q[4],q[5],q[2],q[3]);c.stroke();}else{c.fillStyle=`rgba(255,255,255,${(-q[6]).toFixed(3)})`;c.fillRect(q[0],q[1],1.2,1.2);}});
    /* the pulled-up shade: a dark band with a lit lip */
    const sh=38;c.fillStyle="#201f1c";c.fillRect(HOLE.x-2,HOLE.y-2,HOLE.w+4,sh+2);
    gr=c.createLinearGradient(0,HOLE.y+sh-8,0,HOLE.y+sh+2);gr.addColorStop(0,"#37352f");gr.addColorStop(1,"#0d0c0a");c.fillStyle=gr;c.fillRect(HOLE.x-2,HOLE.y+sh-8,HOLE.w+4,10);
    c.fillStyle="rgba(255,244,226,.22)";c.fillRect(HOLE.x-2,HOLE.y+sh-8,HOLE.w+4,1.3);
    c.fillStyle="rgba(0,0,0,.3)";for(let i=0;i<5;i++)c.fillRect(HOLE.x,HOLE.y+6+i*6,HOLE.w,1);
    c.restore();
  }

  /* ---- the eye ---- */
  function lidShape(c,amt){
    if(amt<=.002)return;
    const bend=H*.16*Math.sin(Math.PI*clamp(amt))*.9;
    const edge=amt*(H/2+bend*.6);
    c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;
    const w=cv.width,h=cv.height,sc=h/H;
    [1,0].forEach(top=>{
      const y=(top?edge:H-edge)*sc,cv2=(top?bend*.9:-bend*.9)*sc;
      c.beginPath();c.moveTo(-4,top?-4:h+4);c.lineTo(w+4,top?-4:h+4);c.lineTo(w+4,y);c.quadraticCurveTo(w/2,y+cv2,-4,y);c.closePath();
      c.fillStyle="#000";c.fill();
      const pen=h*.09,pg=c.createLinearGradient(0,y,0,y+(top?1:-1)*pen);pg.addColorStop(0,"rgba(0,0,0,.7)");pg.addColorStop(1,"rgba(0,0,0,0)");
      c.fillStyle=pg;c.fillRect(0,top?y:y-pen,w,pen);
    });
  }
  function layout(){
    W=innerWidth;H=innerHeight;dpr=Math.min(2,devicePixelRatio||1);
    cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);cv.style.cssText="position:absolute;inset:0;width:100%;height:100%";
    s=W<H?W/640:Math.max(W/1600,H/900);
    world=null;
  }
  function build(){
    box=document.getElementById("air");if(!box)return false;
    cv=document.createElement("canvas");box.appendChild(cv);g=cv.getContext("2d");
    makeSprites();makeStars();makeScratches();layout();addEventListener("resize",layout);
    return true;
  }

  /* ---- one frame ---- */
  const BG="#0E1214";
  function set(u,live){
    if(!built){built=build();t0=performance.now();if(u>.02)t0-=4000;}
    if(!built)return;
    if(u<.85)armed=true;
    if(armed&&!still&&lastU<.925&&u>=.925){armed=false;boomAt=performance.now();boomLoop();}
    lastU=u;
    if(u>=1){box.style.display="none";return;}
    box.style.display="block";
    box.style.opacity=1-sm(.935,1,u);
    if(!world)paintWorld();
    const T=still?0:(performance.now()-t0)/1000;

    /* camera: the cabin grows faster than the world beyond it, which is what depth looks like */
    const lc12=Math.log(1.08)*sm(0,.14,u)+Math.log(3.4/1.08)*sm(.15,.52,u);
    const lc=lc12+Math.log(8)*sm(.52,.7,u),Zc=Math.exp(lc);
    const lw=.5*lc12+Math.log(40)*sm(.45,.9,u),Zw=Math.exp(lw);
    const m=sm(.15,.7,u),Fx=lerp(CX,SX,m),Fy=lerp(CY,SY,m);
    const drift=.5*Math.sin(T*.6)*(1-sm(.1,.2,u));
    const setT=(c,Z)=>{const z=s*Z*dpr;c.setTransform(z,0,0,z,dpr*(W/2+drift*s)-Fx*z,dpr*(H/2)-Fy*z);};

    g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.globalCompositeOperation="source-over";g.fillStyle=BG;g.fillRect(0,0,cv.width,cv.height);

    /* the world outside */
    const worldA=1-sm(.58,.74,u);
    if(worldA>.002){
      setT(g,Zw);
      g.globalAlpha=worldA;g.drawImage(world,0,0,1600,900);
      let wingFlash=0;
      drawBands(g,T,worldA);
      traffic(g,T,worldA);
      g.globalCompositeOperation="source-over";g.globalAlpha=worldA;g.drawImage(fore,WING[0],WING[1],WING[2],WING[3]);g.globalCompositeOperation="lighter";
      lights.forEach(l=>{
        if(l.x<-100||l.x>1700)return;
        const v=pattern(l.pat,T,l.phase);
        if(l.pat==="strobe"&&l.size>=14)wingFlash=v;
        glow(g,l.sp,l.x,l.y,l.size*(.6+.4*v),l.a*v*worldA);
        if(l.pat==="strobe"||l.pat==="beacon")glow(g,l.sp,l.x,l.y,l.size*.28,Math.min(1,v)*worldA);
      });
      if(wingFlash>.05){g.globalAlpha=.16*wingFlash*worldA;g.fillStyle="#cfe0f0";g.beginPath();g.moveTo(578,716);g.lineTo(660,704);g.lineTo(1110,640);g.lineTo(1110,950);g.lineTo(500,950);g.closePath();g.fill();}
      g.globalCompositeOperation="source-over";g.globalAlpha=1;
    }

    /* the stars: drawn live, so the fall into one stays sharp */
    {
      const sa=1-sm(.55,.7,u),z=s*Zw*dpr,ox=dpr*(W/2+drift*s)-Fx*z,oy=dpr*(H/2)-Fy*z;
      g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation="lighter";
      if(sa>.002)stars.forEach(a=>{
        const x=a.x*z+ox,y=a.y*z+oy;if(x<-20||x>cv.width+20||y<-20||y>cv.height+20)return;
        const al=a.a*(.8+.2*Math.sin(T*1.7+a.ph))*sa;
        const r=Math.max(.45*dpr,a.r*s*dpr*(.55+.45*Math.min(3,Zw)));
        g.fillStyle=`rgba(${a.c},${al.toFixed(3)})`;g.beginPath();g.arc(x,y,r,0,7);g.fill();
      });
      /* the one star */
      const hx=SX*z+ox,hy=SY*z+oy,d=sm(.66,.92,u);
      const rLin=1.9*s*Zw*dpr,hull=(W<H?Math.min(.28*H,.279*W):.28*H)*dpr;
      const R=Math.exp(lerp(Math.log(rLin),Math.log(hull),d))*punch(),pulse=.88+.12*Math.sin(T*2.1);
      const halo=R*(3.2+4*(1-d)),ha=.5*(1-.55*d)*pulse;
      let gr=g.createRadialGradient(hx,hy,0,hx,hy,halo);gr.addColorStop(0,`rgba(214,236,255,${ha.toFixed(3)})`);gr.addColorStop(.25,`rgba(160,205,235,${(ha*.3).toFixed(3)})`);gr.addColorStop(1,"rgba(120,180,220,0)");
      g.fillStyle=gr;g.beginPath();g.arc(hx,hy,halo,0,7);g.fill();
      if(d<.5){const L=R*14*(1-d*2);g.globalAlpha=.4*(1-d*2);g.strokeStyle="rgba(214,236,255,.9)";g.lineWidth=Math.max(.6,R*.25);g.beginPath();g.moveTo(hx-L,hy);g.lineTo(hx+L,hy);g.moveTo(hx,hy-L);g.lineTo(hx,hy+L);g.stroke();g.globalAlpha=1;}
      g.globalCompositeOperation="source-over";hero=[hx/dpr,hy/dpr,R/dpr];
      /* body: a white point that turns into a dark disc rimmed in the globe's teal */
      const c0=[lerp(244,16,d),lerp(250,30,d),lerp(255,34,d)],c1=[lerp(176,12,d),lerp(214,22,d),lerp(236,26,d)];
      gr=g.createRadialGradient(hx-R*.25,hy-R*.25,0,hx,hy,R);gr.addColorStop(0,`rgb(${c0.map(Math.round)})`);gr.addColorStop(1,`rgb(${c1.map(Math.round)})`);
      g.fillStyle=gr;g.beginPath();g.arc(hx,hy,R,0,7);g.fill();
      if(d>.15){g.strokeStyle=`rgba(124,192,182,${(.62*sm(.15,.8,d)).toFixed(3)})`;g.lineWidth=Math.max(1.2,2.4*dpr);g.beginPath();g.arc(hx,hy,R,0,7);g.stroke();}
    }

    /* bloom: a blurred copy of the world and stars laid back over it, so the town, the strobes and the moon breathe light */
    {g.setTransform(1,0,0,1,0,0);if(!bl1){bl1=document.createElement("canvas");bl2=document.createElement("canvas");}const w1=Math.max(8,cv.width>>3),h1=Math.max(8,cv.height>>3);
      if(bl1.width!==w1){bl1.width=w1;bl1.height=h1;bl2.width=Math.max(4,w1>>2);bl2.height=Math.max(4,h1>>2);}const q1=bl1.getContext("2d"),q2=bl2.getContext("2d");
      q1.globalCompositeOperation="copy";q1.drawImage(cv,0,0,w1,h1);q1.globalCompositeOperation="multiply";q1.drawImage(bl1,0,0);q2.globalCompositeOperation="copy";q2.drawImage(bl1,0,0,bl2.width,bl2.height);q1.drawImage(bl2,0,0,w1,h1);
      g.globalCompositeOperation="screen";g.globalAlpha=.55;g.drawImage(bl1,0,0,cv.width,cv.height);g.globalAlpha=1;g.globalCompositeOperation="source-over";}
    /* the cabin around the glass */
    const cabA=1-sm(.5,.62,u);
    if(cabA>.002){setT(g,Zc);g.globalAlpha=cabA;drawCabin(g);g.globalAlpha=1;}

    /* the eye: opens once on the clock, blinks once on the scroll */
    const open0=still?0:1-sm(.12,.5,T);
    lidShape(g,Math.max(open0,sm(.112,.12,u)*(1-sm(.12,.13,u))));
    /* fine film grain over the whole frame */
    if(!grainPat){const t=document.createElement("canvas");t.width=t.height=160;const q=t.getContext("2d"),id=q.createImageData(160,160),r=rngMake(97);for(let i=0;i<id.data.length;i+=4){const v=r()*255|0;id.data[i]=id.data[i+1]=id.data[i+2]=v;id.data[i+3]=255;}q.putImageData(id,0,0);grainPat=g.createPattern(t,"repeat");}
    {g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation="overlay";g.globalAlpha=.05;const ox=still?0:(Math.random()*160|0),oy=still?0:(Math.random()*160|0);g.translate(-ox,-oy);g.fillStyle=grainPat;g.fillRect(ox,oy,cv.width,cv.height);g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.globalCompositeOperation="source-over";}
    g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;
  }
  /* ---- the boom: when the star becomes the globe, the disc punches out past its size and settles, a flash, two rings of light ----
     It runs on the clock for about a second once the reader's scroll crosses the hand-over, on its own layer so it outlives the window. */
  function punch(){if(boomAt<0)return 1;const t=(performance.now()-boomAt)/1000;if(t>1.4)return 1;const q=t/.085;return 1+.32*q*Math.exp(1-q);}
  function boomLoop(){
    if(!bcv){bcv=document.createElement("canvas");bcv.setAttribute("aria-hidden","true");bcv.style.cssText="position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:2";document.body.appendChild(bcv);bg=bcv.getContext("2d");}
    bcv.width=Math.round(W*dpr);bcv.height=Math.round(H*dpr);
    const step=()=>{
      const t=(performance.now()-boomAt)/1000,c=bg;c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,W,H);
      if(t>1.5){bcv.width=1;bcv.height=1;return;}
      const[x,y]=W<H?[W/2,H/2]:[hero[0]||W/2,hero[1]||H/2],R=(W<H?Math.min(.28*H,.279*W):.28*H),D=Math.hypot(W,H);
      c.globalCompositeOperation="lighter";
      const fl=.5*Math.exp(-t/.1);
      if(fl>.004){let q=c.createRadialGradient(x,y,R*.5,x,y,D*.8);q.addColorStop(0,`rgba(235,246,255,${fl})`);q.addColorStop(.35,`rgba(170,215,230,${fl*.45})`);q.addColorStop(1,`rgba(120,170,200,${fl*.12})`);c.fillStyle=q;c.fillRect(0,0,W,H);}
      [[0,.9],[.12,.45]].forEach(([d,g])=>{const v=clamp((t-d)/1.25);if(v<=0||v>=1)return;const e=1-Math.pow(1-v,2),r=R*1.02+e*D*.7,a=g*Math.pow(1-v,1.4);
        const w=R*(.14*(1-v)+.03);let q=c.createRadialGradient(x,y,Math.max(0,r-w),x,y,r+w*.4);q.addColorStop(0,"rgba(124,192,182,0)");q.addColorStop(.7,`rgba(214,240,236,${a*.9})`);q.addColorStop(1,"rgba(124,192,182,0)");
        const ri=Math.max(0,r-w);c.fillStyle=q;c.beginPath();c.arc(x,y,r+w*.4,0,7);c.moveTo(x+ri,y);c.arc(x,y,ri,0,7,true);c.fill();});
      requestAnimationFrame(step);
    };
    step();
  }
  return{set,punch};
})();
