/* Trinity Church and 200 Clarendon from the Copley Square lawn. Reference: portfolio_refs/boston/05-trinity-church-200-clarendon.jpg, read at 1400 x 933 (1920 / 1.3714).
   Every structure below is drawn in that photo's pixels and belongs to ref 05, the only picture this pane draws from. Weights: w 1.6 structure, 1 detail, .7 fine.
   z is depth: larger is nearer. lod is the zoom at which a detail starts to appear. Unnamed buildings stay generic: the log does not verify them. */
window.PANE_DEFS.push({id:"boston-05",city:"boston",ref:"05",w:1400,h:933,color:0x7CC0B6,focus:[640,470],
  trace:[[525,1100],[525,740],[545,640],[570,540],[590,480],[620,505],[705,370],[800,550],[820,510],[838,560],[838,710],[890,705],[955,565],[1005,670],[1030,700],[1030,750],[1042,760],[1040,930],[1095,960],[1095,1100]].map(q=>[q[0]/1.3714,q[1]/1.3714]),peak:6,
  expect:{"portal arches":3,"central upper arcade arches":5,"flanking window pairs":2,"conical turrets":4,"main pyramid roof":1,"reflection of church":1},
  places:[{id:"church",at:[527,600,0],where:"Trinity Church in the City of Boston, Copley Square, Back Bay",means:""},{id:"clarendon",at:[1060,240,-3.5],where:"200 Clarendon Street, Back Bay",means:""}],
  draw(d){
    const {seg,line,fill,arc,S,mark,rnd}=d,TAU=Math.PI*2,PI=Math.PI;
    const L=(x0,y0,x1,y1)=>x=>y0+(y1-y0)*(x-x0)/(x1-x0);
    const lerp=(a,b,u)=>a+(b-a)*u;
    const box=(x0,y0,x1,y1)=>[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
    const quad=(x0,yt0,x1,yt1,yb1,yb0)=>[[x0,yt0],[x1,yt1],[x1,yb1],[x0,yb0]];
    /* Half circle from the left spring to the right spring, with its centre at cx, cy. */
    const semi=(cx,cy,rx,ry=rx,n=22,a0=PI,a1=0)=>{const q=[];for(let i=0;i<=n;i++){const a=a0+(a1-a0)*i/n;q.push([cx+rx*Math.cos(a),cy-ry*Math.sin(a)]);}return q;};

    /* An arched opening: BG fill, outline, optional leaded glass. Ref 05 arcade and flanking windows. */
    const archWin=(x0,x1,top,bot,z,o={})=>{const cx=(x0+x1)/2,r=(x1-x0)/2,cy=top+r,q=[[x0,bot],...semi(cx,cy,r,r,16),[x1,bot]];
      S({z,w:o.w||1.2,t:o.t||.95},()=>{fill(q,z);line(q);});
      if(o.lead)S({z:z+.01,w:.6,t:.5,lod:o.lod||.2},()=>{for(let y=cy+o.lead;y<bot;y+=o.lead)seg(x0,y,x1,y);for(let x=x0+o.lead;x<x1-1;x+=o.lead)seg(x,cy-Math.sqrt(Math.max(0,r*r-(x-cx)*(x-cx)))+.5,x,bot);});
      if(o.fine)S({z:z+.01,w:.5,t:.36,lod:1.2},()=>{for(let y=cy+1.6;y<bot;y+=1.6){seg(x0+1,y,x1-1,y);}for(let x=x0+1.6;x<x1-1;x+=1.6)seg(x,cy-Math.sqrt(Math.max(0,r*r-(x-cx)*(x-cx)))+.5,x,bot);});};

    /* Voussoirs: two arcs and the radial joints between them. Ref 05 hoods over the arcade. */
    const vous=(cx,cy,r0,r1,z,o={})=>{const a0=o.a0===undefined?PI:o.a0,a1=o.a1===undefined?0:o.a1,n=o.n||11;S({z,w:1,t:.85},()=>{line(semi(cx,cy,r0,r0,20,a0,a1));line(semi(cx,cy,r1,r1,20,a0,a1));});
      S({z:z+.01,w:.6,t:.5,lod:o.lod===undefined?.2:o.lod},()=>{for(let k=1;k<n;k++){const a=a0+(a1-a0)*k/n;seg(cx+r0*Math.cos(a),cy-r0*Math.sin(a),cx+r1*Math.cos(a),cy-r1*Math.sin(a));}});};

    /* Rock-faced ashlar: uneven courses, bonded joints, then the pitched faces when zoomed in. Ref 05 stone walls. */
    const ashlar=(x0,x1,topF,bot,z,o={})=>{const h=o.h||5.4,tt=o.t||.34;S({z,w:.6,t:tt,lod:o.lod===undefined?.25:o.lod},()=>{let v=0;for(let y=h;;y+=h*(.8+.4*((v*7)%5)/4),v++){if(topF(x0)+y>bot(x0)&&topF(x1)+y>bot(x1))break;seg(x0,Math.min(topF(x0)+y,bot(x0)),x1,Math.min(topF(x1)+y,bot(x1)));
        const w=o.w||17;for(let x=x0+(v%2?w*.5:w*.15)+rnd()*5;x<x1-2;x+=w*(.6+rnd()*.8)){const a=topF(x)+y;if(a>=bot(x))continue;seg(x,a-h,x,Math.min(a,bot(x)));}}});
      S({z,w:.5,t:.3,lod:1.3},()=>{const n=Math.floor((x1-x0)*(bot(x0)-topF(x0))/26);for(let i=0;i<n;i++){const x=x0+rnd()*(x1-x0),t=topF(x),b=bot(x),y=t+rnd()*(b-t),a=rnd()*TAU;if(y<b-1.5&&y>t+1)seg(x,y,x+1.8*Math.cos(a),y+1.1*Math.sin(a));}});};

    /* A column: shaft, entasis ticks, capital and base. Ref 05 portal and arcade shafts. */
    const col=(x,t,b,hw,z,o={})=>{const q=box(x-hw,t,x+hw,b);S({z,w:o.w||1.2,t:o.t||1},()=>{fill(q,z);seg(x-hw,t,x-hw,b);seg(x+hw,t,x+hw,b);});
      S({z:z+.01,w:.6,t:.5,lod:.25},()=>{seg(x-hw*.3,t+1,x-hw*.3,b-1);seg(x+hw*.5,t+1,x+hw*.5,b-1);});
      S({z:z+.02,w:.9,t:.9},()=>{const c=o.cap||hw*1.9,ch=o.ch||(hw*2.4);const capQ=[[x-c,t-ch],[x+c,t-ch],[x+hw,t],[x-hw,t]];fill(capQ,z+.02);line(capQ,{closed:true});seg(x-c-.8,t-ch-1.2,x+c+.8,t-ch-1.2);seg(x-c-.8,t-ch,x-c-.8,t-ch-1.2);seg(x+c+.8,t-ch,x+c+.8,t-ch-1.2);
        const bq=[[x-hw-.5,b-2],[x+hw+.5,b-2],[x+hw+1.3,b+1.5],[x-hw-1.3,b+1.5]];fill(bq,z+.02);line(bq,{closed:true});});
      S({z:z+.03,w:.6,t:.62,lod:.35},()=>{const c=o.cap||hw*1.9,ch=o.ch||(hw*2.4);for(let k=-2;k<=2;k++){const u=k/2.5;seg(x+u*c,t-ch,x+u*hw,t);}arc(x-c*.7,t-ch*.75,ch*.2,ch*.2,0,TAU,8);arc(x+c*.7,t-ch*.75,ch*.2,ch*.2,0,TAU,8);});};

    /* A tiered stone cone: curved courses with a scalloped lower edge and a cross on top. Ref 05 crops of the four turrets. */
    const cone=(cx,ay,by,xl,xr,z,o={})=>{mark("conical turrets");const n=o.n||22,bow=o.bow||.09,prof=o.prof||.92,X=(u,s)=>{const r=(s<0?cx-xl:xr-cx)*Math.pow(u,prof);return cx+s*r;};
      const bq=[];for(let i=0;i<=20;i++){const u=i/20;bq.push([X(u,-1),lerp(ay,by,u)]);}const bot=[];for(let i=1;i<=12;i++){const a=PI-i/12*PI;bot.push([cx+(cx-xl+xr-cx)/2*Math.cos(a),by+((xr-xl)*bow)*Math.sin(a)]);}const rq=[];for(let i=20;i>=0;i--){const u=i/20;rq.push([X(u,1),lerp(ay,by,u)]);}
      S({z,w:1.5,t:1},()=>{fill([...bq,...bot,...rq],z);line(bq);line(rq);line([bq[20],...bot]);});
      for(let k=1;k<n;k++){const u=Math.pow(k/n,1.08),y=lerp(ay,by,u),a=X(u,-1),b=X(u,1),q=[];for(let i=0;i<=12;i++){const t=i/12;q.push([lerp(a,b,t),y+Math.sin(t*PI)*(b-a)*bow]);}S({z:z+.01,w:k%2?.7:.9,t:k%2?.5:.74,lod:k%2?.15:0},()=>line(q));}
      if(o.hip)S({z:z+.01,w:.7,t:.55},()=>o.hip.forEach(h=>seg(cx,ay+3,h,by+(xr-xl)*bow)));
      S({z:z+.015,w:.5,t:.34,lod:1.2},()=>{for(let k=1;k<n;k++){const u=Math.pow(k/n,1.08),v=Math.pow((k+1)/n,1.08),y=lerp(ay,by,u),y2=lerp(ay,by,v),a=X(u,-1),b=X(u,1);for(let t=(k%2?.04:.09);t<1;t+=Math.max(.06,5/(b-a))){const x=lerp(a,b,t),s=Math.sin(t*PI)*(b-a)*bow;seg(x,y+s,x,y2+s-.4);}}});
      const f=o.fin===undefined?11:o.fin;S({z:z+.02,w:1,t:.95},()=>{seg(cx,ay,cx,ay-f);seg(cx-f*.32,ay-f*.62,cx+f*.32,ay-f*.62);arc(cx,ay-f,1.2,1.2,0,TAU,8);arc(cx-f*.32,ay-f*.62,.9,.9,0,TAU,6);arc(cx+f*.32,ay-f*.62,.9,.9,0,TAU,6);});};

    /* A grid window: mullions and a transom. Ref 05 towers and the stone building right of the church. */
    const gwin=(x0,y0,x1,y1,c,r,z,o={})=>{const s=o.s||0,Y=(x,y)=>y+s*(x-x0),q=[[x0,Y(x0,y0)],[x1,Y(x1,y0)],[x1,Y(x1,y1)],[x0,Y(x0,y1)]];S({z,w:o.w||.9,t:o.t||.8},()=>{fill(q,z);line(q,{closed:true});});
      S({z:z+.01,w:.6,t:o.ft||.5,lod:o.lod===undefined?.25:o.lod},()=>{for(let i=1;i<c;i++){const x=lerp(x0,x1,i/c);seg(x,Y(x,y0),x,Y(x,y1));}for(let j=1;j<r;j++){const y=lerp(y0,y1,j/r);seg(x0,Y(x0,y),x1,Y(x1,y));}});};

    /* A pinnacle: tapered shaft with a knop and crockets. Ref 05 corners of the turret bases. */
    const pinn=(x,t,b,hw,z)=>{const q=[[x,t],[x+hw*.55,t+(b-t)*.3],[x+hw,b],[x-hw,b],[x-hw*.55,t+(b-t)*.3]];S({z,w:1,t:.92},()=>{fill(q,z);line(q,{closed:true});arc(x,t-1,1.3,1.3,0,TAU,8);});S({z:z+.01,w:.6,t:.6,lod:.3},()=>{for(let k=1;k<4;k++){const y=lerp(t,b,k/4);seg(x-hw*.8*k/4-1.5,y,x-hw*.4*k/4,y-2);seg(x+hw*.8*k/4+1.5,y,x+hw*.4*k/4,y-2);}seg(x,t+2,x,b);});};

    /* A generic carved robed figure in a niche, no likeness: drapery lines only. Ref 05 statues between the portals. */
    const robe=(x,t,b,hw,z)=>{const h=b-t,P=(u,v)=>[x+u*hw,t+v*h],q=[P(-.28,0),P(.28,0),P(.42,.1),P(.8,.2),P(.9,.55),P(1,1),P(-1,1),P(-.9,.55),P(-.8,.2),P(-.42,.1)];S({z,w:.9,t:.82},()=>{fill(q,z);line(q,{closed:true});seg(P(-.42,.1)[0],P(-.42,.1)[1],P(.42,.1)[0],P(.42,.1)[1]);});S({z:z+.01,w:.6,t:.52,lod:.3},()=>{[[-.5,.2,-.6,1],[-.15,.22,-.2,1],[.2,.22,.3,1],[.55,.2,.65,1]].forEach(([a,c,e,f])=>{const A=P(a,c),B=P(e,f);seg(A[0],A[1],B[0],B[1]);});const a=P(-.8,.42),c=P(.8,.48);seg(a[0],a[1],c[0],c[1]);});};

    /* Carved frieze panel on the portal cornice: small generic figures in a row. Ref 05 balustrade panels. */
    const frieze=(x0,y0,x1,y1,z,n)=>{S({z,w:1,t:.9},()=>{fill(box(x0,y0,x1,y1),z);line(box(x0,y0,x1,y1),{closed:true});seg(x0-1,y0-1.5,x1+1,y0-1.5);seg(x0-1,y1+1.5,x1+1,y1+1.5);});S({z:z+.01,w:.6,t:.66,lod:.15},()=>{for(let i=0;i<n;i++){const x=lerp(x0,x1,(i+.5)/n),w=(x1-x0)/n*.3;arc(x,y0+2.6,w*.72,1.3,0,TAU,7);line([[x-w,y1-.5],[x-w*.8,y0+4.5],[x+w*.8,y0+4.5],[x+w,y1-.5]]);seg(x,y0+5,x,y1-.5);}});};

    /* Row of hanging tiles: rows along the slope, with the scallops only up close. Ref 05 pyramid roof. */
    const tiles=(xL,xR,y0,y1,z,slope,dy=4.3)=>{S({z,w:.65,t:.4},()=>{let r=0;for(let y=y0;y<y1;y+=dy,r++){const a=xL(y),b=xR(y);if(b>a)seg(a,y+slope*(a-510),b,y+slope*(b-510));}});
      S({z,w:.5,t:.38,lod:.45},()=>{let r=0;for(let y=y0;y<y1;y+=dy,r++){const a=xL(y),b=xR(y);for(let x=a+(r%2?2.2:0);x<b;x+=4.4)seg(x,y+slope*(x-510),x-.3,y+slope*(x-510)+dy);}});
      S({z,w:.5,t:.3,lod:1.5},()=>{let r=0;for(let y=y0;y<y1;y+=dy,r++){const a=xL(y),b=xR(y);for(let x=a+(r%2?2.2:0);x<b;x+=4.4){const p=x+2.2,yy=y+slope*(p-510)+dy*.8;seg(x,yy-1.4,p,yy);seg(p,yy,x+4.4,yy-1.4);}}});};
    const crockets=(x0,y0,x1,y1,n,side,z)=>S({z,w:.9,t:.9},()=>{const dx=x1-x0,dy=y1-y0,l=Math.hypot(dx,dy),nx=-dy/l*side,ny=dx/l*side;for(let i=0;i<=n;i++){const u=i/n,x=lerp(x0,x1,u),y=lerp(y0,y1,u);line([[x,y],[x+nx*3,y+ny*3-1.4],[x+nx*4.4,y+ny*4.4-.4]]);}});

    /* FAR. Tall stone-and-glass tower behind the church to the left, generic. Ref 05 at pane x 285-510: seven floors of tall windows, the top row arched, attic and balustrade. */
    {const z=-5.5;
      S({z,w:1.5,t:.8},()=>{const q=[[286,160],[340,172],[505,214],[510,214],[510,560],[305,560]];fill(q,z);line([[305,560],[286,300]]);seg(338,175,478,207);seg(478,207,510,215);seg(510,215,510,275);});
      S({z:z+.01,w:.9,t:.72},()=>{seg(320,176,478,207);line([[320,182],[475,213]]);line([[335,214],[505,238]]);});
      S({z:z+.01,w:.6,t:.55},()=>{for(let x=322;x<476;x+=2.8){const y=L(320,176,478,207)(x);seg(x,y,x,y+5.5);}});
      S({z:z+.02,w:1,t:.75},()=>{[[320,175],[345,180],[372,186],[401,192],[430,198],[456,203]].forEach(([x,y])=>line(box(x-3.5,y-3,x+3.5,y+5),{closed:true}));});
      /* Attic windows. */
      for(let k=0;k<12;k++){const x=376+k*8.7,y=L(376,201,477,222)(x);gwin(x,y,x+5.5,y+11,1,1,z+.02,{t:.62,lod:9});}
      gwin(490,226,500,236,2,2,z+.02,{t:.62});
      /* Rows of windows read bay by bay; each row steps left going down, the wall tilts. */
      const rows=[[[349,368,228,257],[376,395,227,261],[403,422,231,266],[430,448,236,270],[456,474,241,275],[487,500,244,293]],
        [[316,335,248,314],[344,365,265,300],[372,392,267,305],[400,419,272,309],[426,446,276,313],[453,472,281,318]],
        [[314,333,303,340],[342,361,307,344],[368,389,311,348],[396,417,315,353],[424,443,319,357],[451,470,324,359]],
        [[308,328,348,386],[336,356,352,390],[365,385,355,393],[393,413,359,398]],
        [[305,325,393,432],[333,353,397,436],[361,382,400,439],[390,409,404,442]],
        [[300,320,437,480],[328,348,442,484],[357,378,447,487],[386,403,450,489]],
        [[296,316,488,528],[324,346,492,532],[354,374,495,535],[383,394,497,536]]];
      rows.forEach((row,r)=>row.forEach(([a,b,t,bo],c)=>{if(r===0&&c<6){const cx=(a+b)/2,R=(b-a)/2,q=[[a,bo],...semi(cx,t+R,R,R,14),[b,bo]];S({z:z+.02,w:.95,t:.74},()=>{fill(q,z+.02);line(q);});S({z:z+.03,w:.6,t:.5,lod:.25},()=>{for(let k=1;k<4;k++){const x=lerp(a,b,k/4);seg(x,t+R-Math.sqrt(Math.max(0,R*R-(x-cx)*(x-cx))),x,bo);}line(semi(cx,t+R,R*.6,R*.6,12));seg(a,t+R,b,t+R);seg(a,lerp(t+R,bo,.5),b,lerp(t+R,bo,.5));});}
        else gwin(a,t,b,bo,4,2,z+.02,{s:.03,t:.74,w:.95,ft:.5});}));
      /* Stone piers and spandrels. */
      S({z:z+.015,w:.5,t:.3,lod:.6},()=>{for(let y=240;y<540;y+=9)seg(290+(y-240)*.03,y+8,510,y+58);});
      /* Pale ledge and grey slate roof at its foot, behind the church's left end. */
      S({z:z+.5,w:1,t:.72},()=>{fill([[315,541],[385,548],[385,610],[315,600]],z+.5);seg(315,541,385,548);seg(315,545,385,551);for(let x=324;x<372;x+=7)seg(x,543,x+2,547);});
      S({z:z+.51,w:.6,t:.34,lod:.25},()=>{for(let y=554;y<610;y+=5)seg(315,y,385,y+4);});}

    /* FAR. Stepped tower behind the church with the spire, generic. Ref 05 at pane x 572-752: mast, spire cage, striped setback top, nine bands of windows. */
    {const z=-6;
      S({z,w:1.1,t:.9},()=>{seg(627,178,627,240);seg(626,240,628,240);line([[624,240],[622,262],[620,300],[618,306]]);line([[630,240],[632,262],[634,300],[636,306]]);fill([[624,240],[630,240],[636,306],[618,306]],z);});
      S({z:z+.01,w:.7,t:.72},()=>{for(let y=244;y<304;y+=4.3){const u=(y-240)/66,a=lerp(624,618,u),b=lerp(630,636,u);seg(a,y,b,y);}seg(627,250,627,304);});
      S({z:z+.01,w:.5,t:.45,lod:.3},()=>{for(let y=246;y<304;y+=4.3){const u=(y-240)/66;for(let k=-2;k<=2;k++){const x=627+k*lerp(1.2,3.2,u);seg(x,y,x,y+2.6);}}});
      const top=[[618,302],[665,311],[718,358],[611,342],[570,374]];
      S({z,w:1.4,t:1},()=>{fill([[618,302],[665,311],[718,358],[731,378],[752,446],[752,540],[605,540],[605,362],[570,374]],z);line([[570,374],[618,302],[665,311],[718,358]]);});
      S({z:z+.01,w:.7,t:.7},()=>{seg(640,306,611,342);for(let k=1;k<10;k++){const u=k/10;seg(lerp(640,611,u),lerp(306,342,u),lerp(665,718,u),lerp(311,358,u));}S({w:.6,t:.5},()=>{for(let k=1;k<7;k++){const u=k/7;seg(lerp(618,640,u),lerp(302,306,u),lerp(570,611,u),lerp(374,342,u));}});});
      /* Row of attic openings, then their stone band. */
      S({z:z+.02,w:.8,t:.82},()=>{for(let i=0;i<14;i++){const x=613+i*7.5,y=344+i*1.2;line(box(x,y,x+4.5,y+4),{closed:true});}line([[611,341],[718,358]]);line([[607,353],[730,371]]);line([[607,358],[730,378]]);});
      S({z:z+.02,w:.7,t:.72},()=>{for(let i=0;i<9;i++){const x=621+i*11.2,y=362+i*1.4;line(box(x,y,x+5,y+4.5),{closed:true});}});
      S({z:z+.015,w:.6,t:.45},()=>{for(let x=607;x<731;x+=2.4){const y=358+(x-607)*.163;seg(x,y,x,y+3.5);}});
      /* Nine vertical window bands: alternating glass and pale louvre panels. */
      [[620,626],[632,637.5],[643,648],[654.5,660],[666,671],[677,682.5],[688.5,693],[699.5,704.5],[710,715]].forEach(([a,b],i)=>{const t0=366+i*1.8;S({z:z+.02,w:.9,t:.82},()=>{line(box(a,t0,b,540),{closed:true});fill(box(a,t0,b,540),z+.02);});
        for(let y=t0+4,k=0;y<538;y+=17.4,k++){S({z:z+.03,w:.8,t:.76},()=>{seg(a,y,b,y);seg(a,y+7.6,b,y+7.6);});S({z:z+.03,w:.55,t:.44,lod:.2},()=>{for(let v=y+9.6;v<y+17;v+=1.9)seg(a+.5,v,b-.5,v);});}});
      S({z:z+.02,w:.9,t:.82},()=>{line(box(734.5,450,740,540),{closed:true});for(let y=462;y<538;y+=17.4){seg(734.5,y,740,y);seg(734.5,y+7.6,740,y+7.6);}});
      S({z:z+.015,w:1.2,t:.9},()=>{line([[605,362],[606,540]]);line([[731,378],[731,441],[750,444],[751,540]]);S({w:.6,t:.5},()=>{for(let x=731;x<750;x+=1.5)seg(x,441+(x-731)*.15,x,439+(x-731)*.15);});});
      /* Its dark side face to the left, below the striped top. */
      S({z:z+.01,w:.7,t:.62},()=>{[[586,368],[592,362],[598,358]].forEach(([x,y])=>{line(box(x,y,x+3.5,y+12),{closed:true});});for(let k=0;k<5;k++)seg(574+k*7,376-k*4.2,574+k*7,424);});}

    /* MIDDLE. Rounded office block beyond the church on the right, generic. Ref 05 at pane x 752-858: blank panels above, eleven rows of windows, flag. */
    {const z=-4.2;const top=semi(805,537,53,15,20);
      S({z,w:1.3,t:.92},()=>{fill([[752,600],...top,[858,600]],z);line(top);});
      S({z:z+.01,w:.6,t:.5},()=>{line(semi(805,541,53,15,20));for(let x=759;x<856;x+=8.5){const y=537-15*Math.sqrt(Math.max(0,1-((x-805)/53)**2))+6;line(box(x,y+1,x+5.5,y+18),{closed:true});}});
      for(let j=0;j<5;j++)for(let x=767+(j%2?.0:.0);x<856;x+=8.6){const y=552+j*9.4;gwin(x,y,x+4.6,y+6.2,1,1,z+.02,{t:.72,w:.75,lod:9});}
      S({z:z+.03,w:.9,t:.85},()=>{seg(846,531,846,592);const f=[[846,533],[842,546],[840,553],[845,542]];fill(f,z+.03);line(f,{closed:true});S({w:.5,t:.6},()=>{seg(845,538,841,549);});});
      /* Red hipped roof, a low annexe with three small windows. */
      S({z:z+.2,w:1.3,t:.95},()=>{const q=[[756,560],[768,558],[797,573],[800,600],[756,600]];fill(q,z+.2);line([[756,560],[768,558],[797,573]]);line([[756,573],[797,573]]);});
      S({z:z+.21,w:.6,t:.42},()=>{for(let y=561;y<573;y+=2.6)seg(758,y,757+(y-558)*2.4+11,y);for(let y=577;y<590;y+=3.5)seg(756,y,800,y);});
      [[768,583],[777,583],[786,583]].forEach(([x,y])=>gwin(x,y,x+3.8,y+6,1,1,z+.22,{t:.72,lod:9}));}

    /* MIDDLE. Stone office building right of the church, generic. Ref 05 at pane x 757-870: four rows of windows, pedimented base with shafts, trees at its foot. */
    {const z=-2.8;
      S({z,w:1.4,t:.92},()=>{fill(box(752,596,870,770),z);line([[752,597],[800,600],[838,600],[845,594],[862,594],[868,600],[870,770]]);});
      S({z:z+.01,w:.9,t:.72},()=>{seg(752,604,870,606);seg(752,610,870,612);seg(752,616,870,617);S({w:.6,t:.5},()=>{for(let x=760;x<800;x+=8){seg(x,605,x,610);seg(x+1.6,605,x+1.6,610);seg(x+3.2,605,x+3.2,610);}});});
      const xs=[[760,767],[772,779],[788,795],[800,806.5],[826,833],[842,848],[854,861]],ys=[622,643,664.5,687];
      ys.forEach((y,j)=>xs.forEach(([a,b],i)=>{if(j===3&&(i===0||i===1))return;gwin(a,y,b,y+12.5,2,2,z+.02,{t:.82,lod:.3,ft:.48});}));
      gwin(800,705,807,718,2,2,z+.02,{t:.82,lod:.3});
      S({z:z+.01,w:.6,t:.34,lod:.2},()=>{for(let y=622;y<696;y+=6.5)seg(752,y,870,y+.4);});
      S({z:z+.02,w:1,t:.85},()=>{seg(800,701,870,701);seg(800,726,870,726);line([[818,716],[838,704],[870,704]]);line([[800,726],[818,716]]);S({w:.6,t:.5},()=>{for(let x=812;x<868;x+=3.2)seg(x,702,x,705);});});
      [[817,4],[827,3.5],[848,3.5],[869,3.5]].forEach(([x,hw])=>col(x,737,762,hw,z+.03,{w:.9,t:.82,ch:6,cap:hw*1.7}));
      S({z:z+.02,w:.8,t:.66},()=>{line(box(800,730,811,745),{closed:true});});}

    /* 200 CLARENDON. Glass curtain wall, the notch with its heavy mullion, its long face fading into the light. Ref 05, cropped by the frame as the log notes. */
    {const z=-3.5,E1=y=>835+y*.0525,E2=y=>924+y*.0761,E3=y=>954+y*.0875,E4=y=>959+y*.0924,CC=y=>y<407?1039+y*.1155:1086+(y-407)*.0897;
      /* Face fills, then the floors fitted to the dark lines in the photo, face by face. */
      const FL=[-17,12,41,69,97,126,156,186,218,251,283,317,350,386,421,456,494,531,569,608,648,688,728,768];
      S({z},()=>{fill([[835,0],[1205,0],[1269,400],[1282,480],[1240,470],[1099,552],[1099,812],[878,812]],z);});
      S({z:z+.01,w:1.5,t:1},()=>{seg(835,0,878,812);seg(E3(0),0,E3(800),800);seg(E4(0),0,E4(800),800);seg(1039,0,CC(552),552);});
      S({z:z+.01,w:.9,t:.82},()=>seg(E2(0),0,E2(800),800));
      S({z:z+.015,w:.7,t:.6},()=>{for(let y=0;y<800;y+=3)seg(E3(y),y,E4(y),y+1.5);});
      const run=(Ea,Eb,off,y,s0)=>{const x0=Ea(y)+off,y0=y;let x1=Eb(y);for(let i=0;i<4;i++)x1=Eb(y0+s0*(x1-x0));let a=[x0,y0],b=[x1,y0+s0*(x1-x0)];if(a[1]<0&&b[1]<0)return;if(a[1]<0)a=[x0-y0/s0,0];if(b[1]<0)b=[x0-y0/s0,0];seg(a[0],a[1],b[0],b[1]);};
      /* Left face: floors rise steeply to the slot. */
      S({z:z+.01,w:1.15,t:.92},()=>{[16,40,65,90,115,142,169,196,224,252,281,310,340,370,401,432,464,497,530,563,597,631,666,702,739,777].forEach(y=>run(E1,E2,6,y,-1.1+.00138*y));});
      /* Centre face. */
      S({z:z+.01,w:1.15,t:.92},()=>{[4,34,65,95,127,159,191,224,258,292,329,365,402,439,477,516,556,597,640,685,730].forEach(y=>run(E4,CC,6,y,Math.min(-.08,-.87+.00105*y)));});
      /* Slot floors. */
      S({z:z+.01,w:1.15,t:.92},()=>FL.forEach(y=>{if(y>0)seg(E2(y),y,E3(y),y-1.5);}));
      /* Lights: long straight mullions, every few a heavier one. */
      const mull=(Ea,Eb,n,every,t0,t1)=>{for(let k=1;k<n;k++){const u=k/n,hv=k%every===0;S({z:z+.012,w:hv?1:.7,t:hv?t0:t1},()=>seg(lerp(Ea(0),Eb(0),u),0,lerp(Ea(812),Eb(812),u),812));}};
      mull(E1,E2,10,5,.86,.6);mull(E4,CC,6,3,.86,.6);mull(E2,E3,2,9,.6,.6);
      /* Right face: long floors falling toward the eye line, then dense lights. It takes the light, so it stays thin. */
      {const R=y=>1205+y*.16;
        S({z:z+.01,w:.85,t:.72},()=>{[-250,-222,-195,-168,-142,-117,-92,-66,-40,-12,17,46,78,110,144,178,214,251,288,326,366,407,450].forEach(y=>run(CC,R,4,y,Math.max(.68,1.35-.00148*y)));});
        for(let k=1;k<40;k++){const u=k/40;S(k%2?{z:z+.01,w:.55,t:.36,lod:.35}:{z:z+.01,w:.55,t:.4},()=>seg(lerp(1039,1205,u),0,lerp(1086,1269,u),400));}
        S({z:z+.02,w:1.4,t:.95},()=>seg(1205,0,1269,400));S({z:z+.02,w:1.1,t:.8},()=>seg(1269,400,1280,478));}
      /* Low glass pavilion on its corner, with railing above and two storeys of lights. */
      {const a=z+.1;S({z:a},()=>fill([[1090,446],[1234,472],[1250,580],[1096,580]],a));
        S({z:a+.01,w:1.1,t:.9},()=>{line([[1090,437],[1218,462]]);line([[1090,448],[1236,472]]);line([[1097,500],[1240,515]]);line([[1097,538],[1215,548]]);line([[1097,546],[1215,556]]);seg(1090,437,1090,448);seg(1218,462,1218,472);});
        S({z:a+.01,w:.6,t:.62},()=>{for(let k=1;k<9;k++){const u=k/9;seg(lerp(1090,1236,u),lerp(448,472,u),lerp(1097,1240,u),lerp(500,515,u));seg(lerp(1090,1218,u),lerp(437,462,u),lerp(1090,1218,u),lerp(448,472,u));}for(let k=1;k<7;k++){const u=k/7;seg(lerp(1097,1240,u),lerp(500,515,u),lerp(1097,1215,u),lerp(538,548,u));seg(lerp(1097,1215,u),lerp(546,556,u),lerp(1097,1215,u),lerp(590,590,u));}});
        const hut=[[1166,446],[1198,438],[1210,455],[1208,462],[1170,458]];S({z:a+.02,w:1,t:.85},()=>{fill(hut,a+.02);line(hut,{closed:true});});
        /* Roofs reflected in its upper storey. */
        S({z:a+.02,w:.6,t:.5},()=>{line([[1100,520],[1140,522],[1148,530],[1175,520],[1225,518]]);line([[1100,532],[1215,540]]);for(let x=1108;x<1215;x+=12)seg(x,522,x,538);});}
      /* The church reflected in the glass: roof, turret, tower mass. Ref 05 pane x 1030-1100, y 420-600. */
      {const a=z+.03;mark("reflection of church");S({z:a,w:1,t:.92},()=>{line([[1086,411],[1067,453],[1063,470]]);line([[1086,411],[1097,470],[1099,500]]);line([[1067,458],[1050,505]]);line([[1067,458],[1084,490]]);line([[1026,505],[1033,479],[1044,505]]);seg(1033,479,1033,472);seg(1030,475,1036,475);line([[1047,505],[1053,487],[1060,505]]);seg(1030,510,1030,600);seg(1044,510,1044,600);seg(1026,505,1099,497);});
        S({z:a,w:.7,t:.62},()=>{for(let y=420;y<490;y+=5){const u=(y-411)/70;seg(1086-u*19,y,1086+u*11,y+1);}for(let y=514;y<600;y+=7)seg(1030,y,1044,y+1);for(let y=486;y<504;y+=4){const u=(y-479)/26;seg(1033-u*7,y,1033+u*11,y);}
          [[1060,522],[1076,520],[1090,524]].forEach(([x,y])=>line([[x-5,y+38],[x-5,y+7],...semi(x,y+7,5,6,8),[x+5,y+38]]));line([[1054,478],[1066,466],[1078,478],[1078,497],[1054,500]]);});
        S({z:a,w:.6,t:.42,lod:.2},()=>{for(let i=0;i<60;i++){const x=1048+rnd()*50,y=505+rnd()*92;seg(x,y,x+rnd()*2-1,y+3+rnd()*4);}});}
      /* A square stone tower reflected in the left face. Ref 05 pane x 853-892, y 285-560; unnamed. */
      {const a=z+.03;S({z:a,w:.9,t:.74},()=>{line([[853,288],[878,284],[880,292],[886,300],[892,560]]);seg(853,288,866,560);});
        S({z:a,w:.6,t:.46},()=>{[[866,310],[874,330],[870,360],[876,400],[872,440],[878,480],[875,520]].forEach(([x,y])=>{line([[x-4,y+22],[x-4,y+4],[x,y],[x+4,y+4],[x+4,y+22]]);seg(x,y,x,y+22);seg(x-4,y+11,x+4,y+11);});});}
      /* The block across the square wobbling in the lower left glass. Ref 05 pane x 870-970, y 610-690. */
      {const a=z+.03;S({z:a,w:.6,t:.5},()=>{const wob=(x0,y0,x1,y1,n)=>{const q=[];for(let i=0;i<=n;i++){const u=i/n;q.push([lerp(x0,x1,u)+Math.sin(u*9+x0)*1.2,lerp(y0,y1,u)+Math.cos(u*7+y0)*1.3]);}line(q);};
          for(let k=0;k<5;k++)wob(912,632+k*10-k*2.4,968,614+k*10-k*2.4,10);for(let k=0;k<7;k++){const x=916+k*8;wob(x,620-k*.6,x+1,672-k*1.4,8);}
          for(let j=0;j<3;j++)for(let i=0;i<5;i++){const x=877+i*22,y=650+j*38;wob(x,y,x,y+30,8);wob(x+13,y-2,x+14,y+28,8);wob(x,y,x+13,y-2,4);wob(x,y+14,x+13,y+12,4);}
          S({lod:.5,t:.34},()=>{for(let i=0;i<220;i++){const x=874+rnd()*106,y=640+rnd()*150;seg(x,y,x+rnd()*2-1,y+2+rnd()*5);}});});}
      /* Dark base of the tower and its entrance. Ref 05 pane x 878-1000, y 720-800. */
      S({z:z+.02,w:.9,t:.66},()=>{line([[890,770],[890,740],[905,725],[925,740],[925,770]]);seg(925,772,1000,760);seg(925,782,1000,772);for(let x=934;x<1000;x+=11)seg(x,768,x,800);});}

    /* RIGHT. Stone hotel-like block beyond the trees, generic: eave, carved frieze, windows, arches and awnings at street level. Ref 05 at pane x 1218-1400. */
    {const z=-1.5;const eave=[[1218,412],[1400,357]],F=L(1218,412,1400,357);
      S({z},()=>fill([[1218,412],[1400,357],[1400,800],[1236,800],[1236,422]],z));
      S({z,w:1.5,t:1},()=>{line(eave);seg(1218,412,1224,420);seg(1224,420,1400,368);seg(1236,424,1236,560);});
      S({z:z+.01,w:.9,t:.75},()=>{seg(1236,430,1400,381);seg(1236,437,1400,388);seg(1236,466,1400,420);seg(1236,472,1400,427);S({w:.6,t:.5},()=>{for(let x=1238;x<1400;x+=3.8){const y=F(x)+9;seg(x,y,x,y+3);}[1274,1330,1382].forEach(x=>{const y=F(x)+28;arc(x,y,9,6,0,TAU,14);arc(x,y,5,3,0,TAU,10);});});});
      [[1272,428,1286,455],[1328,408,1345,435],[1385,392,1400,418],[1276,472,1291,503],[1333,455,1348,484],[1389,437,1400,466]].forEach(([a,t,b,bo])=>gwin(a,t,b,bo,2,3,z+.02,{s:-.26,t:.85,lod:.3}));
      S({z:z+.01,w:.6,t:.3,lod:.5},()=>{for(let y=0;y<340;y+=8)seg(1236,478+y,1400,430+y+6);});
      /* Street level: two round-headed bays with dark awnings, stone steps. */
      [[1319,1],[1376,1]].forEach(([x])=>{S({z:z+.05,w:1,t:.85},()=>{line(semi(x,740,28,26,18));line(semi(x,740,22,20,16));line(semi(x,740,14,13,12));seg(x-28,740,x-28,800);seg(x+28,740,x+28,800);});S({z:z+.06,w:.6,t:.55},()=>{for(let k=1;k<6;k++){const a=k/6*PI;seg(x,740,x+14*Math.cos(a),740-13*Math.sin(a));}});
        const aw=[[x-26,764],[x-8,738],[x+26,738],[x+26,764]];S({z:z+.07,w:1.2,t:.95},()=>{fill(aw,z+.07);line(aw,{closed:true});seg(x-26,768,x+26,768);seg(x-8,738,x-8,764);});});
      S({z:z+.08,w:.8,t:.6},()=>{for(let y=795;y<812;y+=4)seg(1290,y,1400,y);[[1299,778],[1341,775]].forEach(([x,y])=>line(box(x,y-12,x+16,y+15),{closed:true}));});
      /* A black lamp standard on its base against the block. */
      S({z:z+.1,w:1.2,t:.9},()=>{seg(1336,728,1343,808);seg(1330,812,1348,812);line([[1336,800],[1332,812]]);line([[1343,800],[1348,812]]);line(box(1330,732,1338,754),{closed:true});});
      /* Flag on its roof pole. Ref 05 pane x 1313-1360. */
      S({z:z,w:1.3,t:.95},()=>{seg(1313,255,1335,382);arc(1313,254,1.6,1.6,0,TAU,8);const f=[[1319,263],[1335,272],[1359,281],[1351,303],[1343,309],[1332,290],[1321,282]];fill(f,z);line(f,{closed:true});S({w:.6,t:.55},()=>{line([[1325,273],[1337,288],[1345,300]]);line([[1339,276],[1350,290]]);arc(1340,286,5,6,0,TAU,12);});});}

    /* STREET, right of the church: dark low block reflected and lamp, far side of the street. Ref 05 pane x 1020-1100, y 700-800. */
    {const z=-1.2;S({z,w:.8,t:.55},()=>{fill(box(1020,710,1100,800),z);for(let y=714;y<800;y+=8)seg(1040,y,1100,y);seg(1042,720,1042,800);seg(1060,748,1100,748);});
      S({z:z+.02,w:1.1,t:.9},()=>{seg(1075,718,1079,800);line(semi(1075,716,5,6,8,0,TAU));line(box(1067,757,1072,775),{closed:true});line(box(1056,764,1067,800),{closed:true});});}

    /* TREE TRUNKS AND LIMBS, right. Ref 05 pane x 1140 and x 1280. */
    {const z=1.2;const trunk=(pts,hw)=>{const a=pts.map(p=>[p[0]-hw,p[1]]),b=pts.map(p=>[p[0]+hw,p[1]]);S({z,w:1.3,t:.9},()=>{for(let i=0;i<pts.length-1;i++)fill([a[i],b[i],b[i+1],a[i+1]],z);line(a);line(b);});S({z:z+.01,w:.6,t:.5,lod:.2},()=>{for(let i=0;i<pts.length-1;i++){for(let k=0;k<7;k++){const u=rnd(),x=lerp(pts[i][0],pts[i+1][0],u)+(rnd()-.5)*hw*1.6,y=lerp(pts[i][1],pts[i+1][1],u);seg(x,y,x+(rnd()-.5)*3,y+3+rnd()*5);}}});};
      trunk([[1140,728],[1139,770],[1142,815]],6);trunk([[1282,700],[1287,760],[1296,812]],8);
      S({z,w:1,t:.8},()=>{line([[1283,720],[1250,700],[1220,692],[1195,685]]);line([[1287,735],[1254,722],[1208,712]]);line([[1283,720],[1300,690],[1320,670]]);line([[1280,700],[1275,660],[1262,630]]);line([[1138,740],[1168,728],[1206,724]]);line([[1138,740],[1118,728],[1098,710]]);});
      S({z:z,w:1,t:.85},()=>{seg(1204,740,1212,808);seg(1198,720,1192,808);});}

    /* BUS. A generic city bus behind the trunks: white body, stripe, front window, plain destination sign. Ref 05 pane x 1097-1262, y 745-812. */
    {const z=.7;const body=[[1097,762],[1115,756],[1250,745],[1258,758],[1262,808],[1097,808]];
      S({z,w:1.4,t:1},()=>{fill(body,z);line(body,{closed:true});});
      S({z:z+.01,w:.9,t:.8},()=>{line([[1104,772],[1200,770],[1205,800],[1104,800]],{closed:true});seg(1100,800,1262,800);seg(1100,806,1262,806);line(box(1198,768,1204,808),{closed:true});line(box(1206,768,1213,808),{closed:true});line([[1215,762],[1252,760],[1258,800],[1215,800]],{closed:true});});
      S({z:z+.02,w:.8,t:.82},()=>{line(box(1212,750,1254,761),{closed:true});for(let x=1216;x<1252;x+=3.6)seg(x,753,x,759);});
      S({z:z+.015,w:.6,t:.5},()=>{for(let x=1116;x<1198;x+=16)seg(x,771,x,799);for(let y=790;y<800;y+=3)seg(1105,y,1198,y);seg(1234,761,1234,800);});}

    /* VAN AND STOP SIGN. A dark van at the kerb; a car on the near side of the block; stop sign on its post. Ref 05 pane x 990-1030 and x 880-900. */
    {const z=.8;const van=[[974,780],[990,772],[1008,770],[1022,790],[1032,800],[1034,812],[974,812]];S({z,w:1.3,t:.95},()=>{fill(van,z);line(van,{closed:true});line([[978,782],[1008,778],[1022,795],[978,795]],{closed:true});arc(986,812,5,5,0,TAU,12);arc(1024,812,5,5,0,TAU,12);seg(978,803,1034,803);});S({z:z+.01,w:.6,t:.5},()=>{for(let x=985;x<1012;x+=7)seg(x,780,x+1.5,795);seg(1022,803,1030,803);seg(1022,807,1030,807);});
      const car=[[840,812],[842,792],[850,785],[880,787],[893,802],[896,812]];S({z:z-.1,w:1.1,t:.8},()=>{fill(car,z-.1);line(car,{closed:true});line([[846,794],[852,788],[878,790],[886,800],[846,800]],{closed:true});});
      S({z:z+.1,w:1,t:.95},()=>{seg(889,755,891,815);arc(889,750,5,5,0,TAU,14);line(box(885,757,893,770),{closed:true});const o=[];for(let k=0;k<8;k++){const a=k/8*TAU+PI/8;o.push([891+6.5*Math.cos(a),791+6.5*Math.sin(a)]);}fill(o,z+.1);line(o,{closed:true});seg(885,791,897,791);seg(885,781,897,781);seg(885,781,891,772);seg(897,781,891,772);});}

    /* Dark trees at the foot of the stone building, between church and tower. Ref 05 pane x 800-880, y 745-790. */
    {const z=-.4;const q=[[800,790],[800,755],[815,745],[835,750],[860,755],[880,772],[880,790]];S({z},()=>fill(q,z));S({z,w:.9,t:.6},()=>line(q));S({z:z+.01,w:.6,t:.38},()=>{for(let i=0;i<300;i++){const x=802+rnd()*76,y=755+rnd()*33,a=rnd()*TAU;seg(x,y,x+2.4*Math.cos(a),y+2.4*Math.sin(a));}});}

    /* LEFT REAR. The long stone church wall and transept running off left behind the trees, low buildings beyond. Ref 05 pane x 20-400, y 700-810. */
    {const z=-.7;S({z},()=>fill(box(0,700,404,812),z));
      S({z:z+.01,w:.9,t:.6},()=>{seg(40,792,404,796);seg(40,778,400,780);seg(350,700,350,800);seg(335,720,335,800);[[345,755,352,775]].forEach(([a,t,b,bo])=>line(box(a,t,b,bo),{closed:true}));line(box(60,774,75,794),{closed:true});line(box(115,784,145,794),{closed:true});});
      ashlar(290,404,()=>705,()=>795,z+.01,{t:.32});ashlar(40,270,()=>770,()=>795,z+.01,{t:.28});}

    /* MAIN ROOF. A steep pyramid of red tile: hip rolls with crockets, inner hips. Ref 05 pane apex 510,268. */
    {const z=-.6;mark("main pyramid roof");const apex=[510,268],q=[[510,268],[587,404],[468,395],[440,400],[458,360]];
      S({z,w:1.7,t:1},()=>{fill(q,z);seg(510,268,587,404);seg(510,268,458,360);});
      const xL=y=>y<360?510-(y-268)*.565:458-(y-360)*.45,xR=y=>510+(y-268)*.566;
      tiles(xL,xR,274,412,z+.005,.1);
      /* Inner hip on the left, double roll on the right. */
      S({z:z+.01,w:1.1,t:.9},()=>{seg(507,274,470,385);seg(510,272,581,398);seg(506,272,577,398);seg(502,283,466,385);});
      S({z:z+.015,w:.6,t:.65},()=>{for(let u=.02;u<1;u+=.025){const x=lerp(510,581,u),y=lerp(272,398,u);seg(x,y,x-4,y);const x2=lerp(507,470,u),y2=lerp(274,385,u);seg(x2,y2,x2-4,y2);}});
      crockets(507,275,464,353,9,1,z+.02);crockets(516,278,586,402,13,-1,z+.02);crockets(500,297,468,385,8,1,z+.02);crockets(508,284,572,392,10,-1,z+.02);
      /* Ridge knob and finial. */
      S({z:z+.02,w:1,t:1},()=>{line([[505,270],[510,262],[515,270]]);seg(510,262,510,255);arc(510,254,1.6,1.6,0,TAU,8);});}

    /* Small rear roof with pale cresting at the far left corner. Ref 05 pane x 430-452, y 360-392. */
    {const z=-.65;const q=[[430,361],[454,366],[442,392],[428,392]];S({z,w:1.1,t:.9},()=>{fill(q,z);line(q,{closed:true});});S({z:z+.01,w:.6,t:.42},()=>{for(let y=368;y<392;y+=4)seg(430,y,452-(y-366)*.5,y);});S({z:z+.01,w:.7,t:.8},()=>{for(let x=431;x<453;x+=2.6){seg(x,361+(x-430)*.2,x,358+(x-430)*.2);}});}

    /* Gabled dormer in the roof: oculus, three small arches, two stone piers. Ref 05 pane apex 529,345. */
    {const z=-.4;const f=[[529,346],[553,381],[555,408],[505,402],[507,372]];
      S({z,w:1.4,t:1},()=>{fill(f,z);line([[507,372],[529,346],[553,381]]);seg(507,376,553,386);});
      S({z:z+.01,w:.9,t:.8},()=>{line([[511,371],[529,351],[549,381]]);seg(511,380,551,388);seg(507,383,555,392);});
      S({z:z+.01,w:.6,t:.34,lod:.25},()=>{for(let y=356;y<382;y+=3.6){const u=(y-346)/35;seg(529-u*17,y,529+u*20,y+2);}});
      /* Finials at the peak and shoulders. */
      S({z:z+.02,w:1,t:.95},()=>{seg(530,347,530,336);seg(527,339,533,339);arc(530,335,1.3,1.3,0,TAU,8);seg(506,372,506,364);seg(503,367,509,367);seg(554,382,554,374);seg(551,377,557,377);});
      /* Oculus: stone ring, glass and a cross. */
      S({z:z+.03,w:1.2,t:1},()=>{fill(semi(529,371,9,9,18,0,TAU),z+.03);arc(529,371,11.5,11.5,0,TAU,26);arc(529,371,8,8,0,TAU,24);S({w:.7,t:.72},()=>{seg(521,371,537,371);seg(529,363,529,379);});S({w:.6,t:.5,lod:.25},()=>{for(let k=0;k<20;k++){const a=k/20*TAU;seg(529+8*Math.cos(a),371+8*Math.sin(a),529+11.5*Math.cos(a),371+11.5*Math.sin(a));}});});
      [[516,389,403],[529,391,405],[541.5,393,407]].forEach(([x,t,b])=>{archWin(x-4.2,x+4.2,t,b,z+.03,{w:1,t:.9});S({z:z+.04,w:.8,t:.8},()=>{line(semi(x,t+4.2,6.6,6.6,12));seg(x-5,b+.6,x+5,b+.6);});});
      S({z:z+.02,w:1,t:.85},()=>{line(box(506,384,511,404),{closed:true});line(box(549,389,555,409),{closed:true});});}

    /* TOWER FRONT above the arcade: cornice, big arch, side pairs, railings, lower windows, long shafts. Ref 05 pane x 468-590, y 396-530. */
    {const z=-.3;const T=L(468,396,590,413);
      S({z},()=>fill([[468,396],[590,413],[590,536],[468,530]],z));
      /* Corbelled cornice with dentils under the roof. */
      S({z:z+.05,w:1.3,t:1},()=>{seg(468,396,590,413);seg(468,400,590,417);});S({z:z+.05,w:.8,t:.72},()=>{seg(468,404,590,421);seg(474,408,510,414);seg(548,419,590,425);S({w:.6,t:.6,lod:.15},()=>{for(let x=470;x<590;x+=2.8){seg(x,T(x)+4.5,x,T(x)+7.5);}});});
      /* Rusticated infill. */
      ashlar(468,478,x=>T(x)+10,()=>460,z+.01,{w:10});ashlar(576,590,x=>T(x)+12,()=>478,z+.01,{w:10});ashlar(511,545,x=>T(x)+14,()=>432,z+.01,{w:12});
      /* Big central arch with its red tile ground and a rail. */
      vous(527.5,431,13,18,z+.03,{n:15});
      {const q=[[518,462],[518,431],...semi(527.5,431,9.5,12,14).slice(1,-1),[537,431],[538,462]];S({z:z+.02,w:1.1,t:.95},()=>{fill(q,z+.02);line(q);});
        S({z:z+.03,w:.65,t:.5},()=>{for(let y=434;y<450;y+=3.3)seg(518,y,538,y+1.4);});S({z:z+.03,w:.5,t:.36,lod:.5},()=>{for(let y=434;y<450;y+=3.3)for(let x=519+((y|0)%2);x<538;x+=2.6)seg(x,y,x,y+3.3);});
        S({z:z+.04,w:.9,t:.85},()=>{seg(517,451,539,453);seg(517,462,539,464);for(let x=519;x<538;x+=3.2)line([[x,452],[x-1,456],[x,462]]);});}
      /* Side pairs. */
      const pair=(xs,t,b,railY,z2)=>{xs.forEach(([a,c,tt])=>{const q=[[a,b],...semi((a+c)/2,tt+(c-a)/2,(c-a)/2,(c-a)/2,12),[c,b]];S({z:z2,w:1,t:.92},()=>{fill(q,z2);line(q);});S({z:z2+.01,w:.6,t:.5},()=>{for(let y=tt+(c-a)/2+2;y<railY;y+=3.3)seg(a,y,c,y);});
          S({z:z2+.02,w:.8,t:.82},()=>{seg(a,railY,c,railY+.8);seg(a,b-1,c,b);for(let x=a+1.5;x<c;x+=2.6)seg(x,railY,x,b);});});};
      pair([[479,488,417],[492,500,420]],0,460,450,z+.02);pair([[552,562,427],[564,573,428]],0,468,457,z+.02);
      vous(490,428,12,19,z+.015,{n:12,a0:PI*.95,a1:PI*.08});vous(563,437,13,19,z+.015,{n:12,a0:PI*.95,a1:PI*.08});
      [[476,426,456,1.8],[490,428,458,1.6],[576,436,462,1.8],[563,436,465,1.6]].forEach(([x,t,b,hw])=>col(x,t,b,hw,z+.04,{ch:4,cap:3}));
      /* Clustered shafts, one running on down the wall. */
      [[505,430,458,1.5],[509,430,458,1.8],[513,431,459,1.5],[540,435,463,1.5],[545,435,464,1.8],[549,436,465,1.5]].forEach(([x,t,b,hw])=>col(x,t,b,hw,z+.04,{ch:5,cap:3}));
      /* Corbel table below the belfry. */
      S({z:z+.05,w:1,t:.88},()=>{seg(476,456,591,472);seg(476,460,591,476);seg(476,467,591,483);});S({z:z+.05,w:.6,t:.6,lod:.15},()=>{for(let x=478;x<590;x+=6.2){const y=L(476,460,591,476)(x);line([[x,y+7],[x+3,y+1],[x+6,y+7]]);}});
      /* Lower windows with stone hoods and transoms. */
      const low=(x0,x1,hT,lightsT,tr,lightsB,bb,z2)=>{S({z:z2,w:.9,t:.8},()=>{line(box(x0-2,hT,x1+2,hT+6),{closed:true});line(box(x0-1,hT+6,x1+1,bb),{closed:true});seg(x0-2,tr,x1+2,tr);seg(x0-2,tr+3,x1+2,tr+3);});S({z:z2,w:.6,t:.55,lod:.2},()=>{for(let x=x0-1;x<x1+1;x+=2.2)seg(x,hT+1.5,x,hT+4.5);});
        const w=(x1-x0)/3;for(let k=0;k<3;k++){const a=x0+w*k+1,c=x0+w*(k+1)-1;gwin(a,lightsT,c,tr-1,1,1,z2+.01,{t:.88,lod:9});}
        const w2=(x1-x0)/2;for(let k=0;k<2;k++){const a=x0+w2*k+1,c=x0+w2*(k+1)-1;gwin(a,tr+4,c,bb-1,2,3,z2+.01,{t:.88,ft:.42});}};
      low(511,535,481,488,502,0,527,z+.03);low(546,570,484,492,507,0,531,z+.03);
      gwin(491,487,498,497,1,1,z+.03,{t:.85,lod:9});gwin(491,505,500,526,2,3,z+.03,{t:.85});
      /* Long shafts running from the belfry to the main cornice. */
      S({z:z+.05,w:1.1,t:.95},()=>{[[508,465,508,512],[512,465,512,512],[540,470,541,530],[545,470,546,532]].forEach(([a,t,c,b])=>seg(a,t,c,b));});
      S({z:z+.05,w:.8,t:.7},()=>{[510,543].forEach(x=>{seg(x-4,500,x+5,500);seg(x-4,503,x+5,503);});});
      /* The stone block at the shafts' foot. */
      S({z:z+.06,w:1,t:.92},()=>{fill(box(498,512,510,528),z+.06);line(box(498,512,510,528),{closed:true});});ashlar(498,510,()=>512,()=>528,z+.07,{h:3.4,w:6,t:.42});
      ashlar(574,590,()=>483,()=>536,z+.02,{w:10,t:.36});ashlar(480,490,()=>480,()=>528,z+.02,{w:8,t:.28});}

    /* FAR-LEFT partial cone and dark wall, behind the front turret. Ref 05 pane x 405-430, y 368-470. It is a fifth, part-hidden cone: not in the log's count of four. */
    {const z=-.42;const q=[[425,368],[430,380],[432,418],[407,418]];S({z,w:1.3,t:.95},()=>{fill(q,z);line([[407,418],[425,368],[432,395]]);});S({z:z+.01,w:.6,t:.55},()=>{for(let y=376;y<418;y+=4.3){const u=(y-368)/50;seg(425-u*18,y,425+u*6,y);}});
      S({z:z+.02,w:1,t:.9},()=>{const b=[[405,418],[432,420],[430,470],[402,470]];fill(b,z+.02);line(b,{closed:true});seg(405,422,432,424);line([[406,465],[406,434],...semi(410,434,4,6,8).slice(1,-1),[414,434],[414,465]]);line([[420,448],[420,437],...semi(424,437,4,6,8).slice(1,-1),[428,437],[428,448]]);});
      /* Tall pinnacle. */
      pinn(431,345,366,3,z+.03);S({z:z+.03,w:1,t:.92},()=>{line([[428,366],[427,395]]);line([[434,366],[434,395]]);});pinn(421,366,380,2.2,z+.03);}

    /* REAR-LEFT round turret: stone drum and cone. Ref 05 pane apex 455,352, drum x 450-472. */
    {const z=-.25;cone(455,352,388,437,470,z,{n:9,bow:.09,fin:8});
      S({z:z+.03,w:1.2,t:.95},()=>{line(semi(453.5,390,17,4,16,PI,2*PI));line(semi(453.5,393,18,4.5,16,PI,2*PI));});
      S({z:z-.01},()=>fill(box(437,392,474,470),z-.01));S({z:z,w:1.1,t:.9},()=>{seg(472,392,475,470);});
      ashlar(453,475,()=>396,()=>470,z,{w:10,h:5.6,t:.42});
      S({z:z,w:.9,t:.8},()=>{seg(470,422,483,424);seg(470,425,478,426);});}

    /* FRONT-LEFT great cone: faceted hips, its aedicule with medallion and louvred pair, pinnacles. Ref 05 pane apex 448,385, base y 470-478. */
    {const z=-.1;cone(448,385,472,416,479,z,{n:22,bow:.035,prof:.98,fin:9,hip:[431,466]});
      /* Base: dark bays either side, stone-framed louvre pair at the centre. */
      S({z:z+.02},()=>fill([[402,478],[498,482],[498,530],[402,522]],z+.02));
      S({z:z+.03,w:1.2,t:.95},()=>{seg(404,516,498,526);seg(404,520,498,530);seg(404,524,498,533);seg(404,484,404,520);});
      /* Aedicule gable and medallion. */
      {const g=[[453,461],[473,481],[473,516],[437,516],[434,481]];S({z:z+.04,w:1.3,t:1},()=>{fill(g,z+.04);line([[432,482],[453,461],[473,481]]);line([[437,484],[453,467],[468,483]]);seg(434,482,473,484);line(box(436,482,473,516));});
        S({z:z+.05,w:1,t:.92},()=>{arc(453,474,5.2,5.2,0,TAU,16);S({w:.6,t:.6},()=>{arc(453,474,3.5,3.5,0,TAU,12);});seg(453,461,453,454);seg(450,457,456,457);});
        const lv=(x)=>{const q=[[x-4,514],[x-4,490],...semi(x,490,4,5,8).slice(1,-1),[x+4,490],[x+4,514]];S({z:z+.05,w:1,t:.9},()=>{fill(q,z+.05);line(q);});S({z:z+.06,w:.7,t:.72},()=>{for(let y=492;y<514;y+=2.7)seg(x-3.6,y,x+3.6,y+.9);});};
        lv(449);lv(459);S({z:z+.06,w:.9,t:.85},()=>{seg(454,486,454,516);line(semi(454,491,10,9,14));seg(445,516,463,516);});
        ashlar(437,444,()=>486,()=>514,z+.05,{w:7,h:3.8,t:.42});ashlar(465,473,()=>486,()=>514,z+.05,{w:7,h:3.8,t:.42});}
      /* Dark openings with shafts. */
      [[411,418,487,517],[421,428,486,517],[430,436,484,517],[477,484,490,520]].forEach(([a,c,t,b])=>archWin(a,c,t,b,z+.035,{w:.9,t:.85}));
      [[419.5,488,518,1.4],[429,486,518,1.3],[476,490,522,1.4],[485,490,524,1.4]].forEach(([x,t,b,hw])=>col(x,t,b,hw,z+.05,{ch:3.5,cap:2.4}));
      pinn(423,466,488,3.8,z+.06);pinn(482,455,491,4.4,z+.07);pinn(404,462,490,3.4,z+.06);pinn(432,470,486,2.4,z+.06);
      S({z:z+.07,w:1,t:.92},()=>{line(box(476,491,488,525),{closed:true});});
      S({z:z+.05,w:.6,t:.55,lod:.3},()=>{for(let i=0;i<55;i++){const x=403+rnd()*90,y=474+rnd()*12;if(x>433&&x<474)continue;const a=rnd()*TAU;seg(x,y,x+2.6*Math.cos(a),y+2.6*Math.sin(a));}});}

    /* RIGHT ROUND TOWER: rock-faced shaft, belt course and cone. Ref 05 pane x 586-612, apex 598,367. */
    {const z=-.2;cone(598.5,367,405,585,613,z,{n:10,bow:.1,fin:10});
      S({z:z+.02,w:1.2,t:.95},()=>{line(semi(599,407,14.5,4,16,PI,2*PI));line(semi(599,410,15.5,4.4,16,PI,2*PI));});
      const q=[[586,413],[612,413],[609,520],[608,548],[592,548],[587,470]];S({z:z-.01},()=>fill(q,z-.01));S({z,w:1.5,t:1},()=>{seg(586,412,587,470);seg(587,470,592,548);seg(612,412,609,520);seg(609,520,608,548);});
      S({z:z+.01,w:.7,t:.56},()=>{for(let y=416;y<540;y+=6.2){const a=y<470?586.5:587+(y-470)*.06,b=612-(y-413)*.03,mx=(a+b)/2,qq=[];for(let i=0;i<=8;i++){const u=i/8;qq.push([lerp(a,b,u),y+Math.sin(u*PI)*2.6]);}line(qq);S({w:.6,t:.42,lod:.2},()=>{for(let k=0;k<3;k++){const u=((y*.13)%1+k)/3,x=lerp(a,b,u);seg(x,y+Math.sin(u*PI)*2.6,x,y+6.2+Math.sin(u*PI)*2.6);}});}});
      S({z:z+.02,w:1,t:.9},()=>{line(semi(598,476,12,2.8,12,PI,2*PI));line(semi(598,480,12,2.8,12,PI,2*PI));});S({z:z+.02,w:.6,t:.6,lod:.15},()=>{for(let k=0;k<9;k++){const x=587+k*2.7;seg(x,478,x,482);}});}

    /* FRONT-RIGHT great cone: hips, aedicule with medallion and louvred pair, small pinnacle groups, gargoyle, chimney block. Ref 05 pane apex 700,420. */
    {const z=-.1;cone(700,420,500,669,736,z,{n:22,bow:.035,prof:.92,fin:12,hip:[685,716]});
      S({z:z+.02},()=>fill([[660,500],[750,510],[750,552],[660,542]],z+.02));
      S({z:z+.03,w:1.2,t:.95},()=>{seg(662,544,750,552);seg(662,547,750,554);});
      {const g=[[719,490],[733,508],[733,541],[706,540],[706,507]];S({z:z+.04,w:1.3,t:1},()=>{fill(g,z+.04);line([[702,508],[719,489],[735,510]]);line(g.slice(2).concat([g[4]]));seg(706,508,733,510);});
        S({z:z+.05,w:1,t:.92},()=>{arc(720,501,4.6,4.6,0,TAU,14);seg(719,488,719,482);seg(716,484,722,484);});
        const lv=x=>{const q=[[x-3.2,539],[x-3.2,516],...semi(x,516,3.2,4,8).slice(1,-1),[x+3.2,516],[x+3.2,539]];S({z:z+.05,w:1,t:.9},()=>{fill(q,z+.05);line(q);});S({z:z+.06,w:.7,t:.72},()=>{for(let y=518;y<539;y+=2.6)seg(x-2.9,y,x+2.9,y+.9);});};
        lv(716.5);lv(725);ashlar(707,713,()=>512,()=>538,z+.05,{w:6,h:3.8,t:.42});ashlar(728,733,()=>512,()=>538,z+.05,{w:6,h:3.8,t:.42});}
      [[683,694,510,538],[696,705,508,538],[736,747,514,540]].forEach(([a,c,t,b])=>archWin(a,c,t,b,z+.035,{w:.9,t:.82}));
      [[687,512,538,1.5],[695,510,541,1.8],[700,510,540,1.4],[741,516,542,1.4],[748,516,544,1.4]].forEach(([x,t,b,hw])=>col(x,t,b,hw,z+.05,{ch:3,cap:2.3}));
      pinn(690,481,508,3.8,z+.06);pinn(741,487,512,4.4,z+.06);pinn(659,500,520,3,z+.06);pinn(675,491,510,3,z+.06);
      /* Left rear bay of the base, in shade. */
      S({z:z+.03,w:1,t:.72},()=>{line([[661,540],[661,512],[668,500],[680,512],[680,540]]);line([[669,538],[669,520],...semi(672,520,3,5,8).slice(1,-1),[675,520],[675,525]]);});
      /* Gargoyle at the corner. */
      S({z:z+.07,w:1,t:.92},()=>{line([[749,510],[753,508],[757,511],[752,513],[749,514]],{closed:true});line([[648,518],[644,516],[641,519],[646,521]],{closed:true});});
      /* Chimney block. */
      S({z:z+.06,w:1.1,t:.95},()=>{fill(box(657,525,672,541),z+.06);line(box(657,525,672,541),{closed:true});seg(655,525,673,525);});ashlar(657,672,()=>527,()=>541,z+.07,{h:3.6,w:7,t:.42});
      S({z:z+.05,w:.6,t:.55,lod:.3},()=>{for(let i=0;i<45;i++){const x=664+rnd()*80,y=497+rnd()*14;if(x>704&&x<733)continue;const a=rnd()*TAU;seg(x,y,x+2.6*Math.cos(a),y+2.6*Math.sin(a));}});}

    /* LEFT SIDE WALL of the crossing tower. Ref 05 pane x 385-403, y 530-680. */
    {const z=-.05;const q=[[386,540],[403,526],[403,800],[385,800]];S({z},()=>fill(q,z));S({z,w:1.5,t:1},()=>{seg(386,540,385,800);});ashlar(386,403,()=>548,()=>780,z+.005,{w:9,t:.36});
      S({z:z+.01,w:1,t:.9},()=>{line([[403,525],[391,530],[382,540],[391,541],[403,533]]);});}

    /* THE UPPER FRONT: cornice, checker and chevron bands, the five-arch arcade, the flanking window pairs. Ref 05 pane x 403-752, y 521-680. */
    {const z=0,Ttop=x=>x<500?521+(x-403)*.062:x<683?526+(x-500)*.0912:543+(x-683)*.2,top=[[403,521],[500,527],[683,543],[750,554]];
      S({z},()=>fill([[403,521],[500,527],[683,543],[752,556],[754,690],[403,690]],z));
      S({z,w:1.7,t:1},()=>{seg(403,521,403,690);seg(752,556,754,690);});
      /* Main cornice: carved band left and right, pale cap and paired dentil panels across the middle. */
      S({z:z+.02,w:1.3,t:1},()=>{line(top);line(top.map(q=>[q[0],q[1]+4]));line(top.map(q=>[q[0],q[1]+9]));});
      S({z:z+.02,w:.9,t:.82},()=>{line(top.map(q=>[q[0],q[1]+13]));line(top.map(q=>[q[0],q[1]+17]));});
      S({z:z+.03,w:.8,t:.72},()=>{for(let i=0;i<19;i++){const x=508+i*9.7,y=L(500,527,683,543)(x)+6;line(box(x,y,x+5,y+5),{closed:true});}});
      S({z:z+.03,w:.6,t:.52,lod:.15},()=>{for(let x=405;x<500;x+=3.2){const y=L(403,521,500,527)(x)+5;seg(x,y,x,y+3);}for(let x=686;x<748;x+=3.2){const y=L(683,543,750,554)(x)+5;seg(x,y,x,y+3);}for(let x=404;x<750;x+=5){const y=(x<500?L(403,521,500,527)(x):x<683?L(500,527,683,543)(x):L(683,543,750,554)(x))+14;seg(x,y,x+2,y+2);}});
      /* Pale checker band on both flanks and the zigzag across the arcade. */
      const chk=(x0,y0,x1,y1,rows)=>{const T=L(x0,y0,x1,y1);S({z:z+.01,w:.8,t:.66},()=>{seg(x0,y0,x1,y1);seg(x0,y0+rows*5.6,x1,y1+rows*5.6);});S({z:z+.012,w:.7,t:.6},()=>{for(let r=0;r<rows;r++)for(let x=x0+(r%2?5.6:0);x<x1-3;x+=11.2){const y=T(x)+r*5.6;line(box(x,y,x+5.6,y+5.6),{closed:true});}});};
      chk(410,536,497,544,4);chk(686,561,747,568,4);
      {const T=L(499,546,686,563);S({z:z+.012,w:.8,t:.7},()=>{for(let r=0;r<3;r++){const q=[];for(let x=499,k=0;x<=686;x+=5.1,k++)q.push([x,T(x)+r*6+(k%2?3.4:0)]);line(q);line(q.map(p=>[p[0],p[1]+2.2]));}});}
      /* Rusticated stone. */
      ashlar(403,505,x=>L(403,628,505,632)(x),()=>690,z+.01,{w:20,h:6.2,t:.38});ashlar(692,754,x=>L(692,644,754,648)(x),()=>690,z+.01,{w:20,h:6.2,t:.38});
      /* Stone quoins beside the arcade. */
      [[490,505,582,650,z+.01],[672,690,590,668,z+.01]].forEach(([a,c,t,b,zz])=>{S({z:zz,w:.8,t:.62},()=>{let k=0;for(let y=t;y<b;y+=8.4,k++){const w=(c-a)*(k%2?.62:1),x0=a===490?c-w:a;line(box(x0,y,x0+w,y+8.4),{closed:true});}});});
      /* Five-arch arcade. Windows in 2 3 4; arches 1 and 5 are blind stone. */
      const A=[[508,530,566,653],[544,565,568,655],[578,598,571,657],[612,632,574,660],[647,668,577,663]];
      A.forEach(([a,c,t,b],i)=>{mark("central upper arcade arches");const cx=(a+c)/2,r=(c-a)/2,cy=t+r;vous(cx,cy,r+1.6,r+11,z+.02,{n:13});
        S({z:z+.015},()=>fill(semi(cx,cy,r+11,r+11,16),z+.015));
        if(i===0||i===4){archWin(a,c,t,b,z+.03,{w:1.2,t:1});ashlar(a+1,c-1,()=>cy+1,()=>b-1,z+.04,{w:11,h:5,t:.34});}
        else{archWin(a,c,t,b,z+.03,{w:1.3,t:1});const g=[[a+3,b-1],...semi(cx,cy+3,r-3,r-3,14),[c-3,b-1]];S({z:z+.04,w:.9,t:.8},()=>line(g));archWin(a+3,c-3,t+3,b-1,z+.04,{lead:3.4,w:.9,t:.8,fine:true,lod:.1});S({z:z+.05,w:.7,t:.66},()=>{seg(cx,cy+3,cx,b-1);for(let k=1;k<4;k++){const y=lerp(cy+3,b-1,k/4);seg(a+3,y,c-3,y);}});}
        S({z:z+.05,w:.9,t:.85},()=>{line([[a-3,b+1],[c+3,b+1],[c+3,b+4],[a-3,b+4]],{closed:true});});});
      /* Column pairs with capitals and bases. */
      [[505,584,649,2],[535,586,652,2.1],[541,586,652,2.1],[569,588,654,2.1],[575,588,654,2.1],[602,591,656,2.1],[608,591,657,2.1],[637,594,659,2.1],[643,594,660,2.1],[671,596,662,2]].forEach(([x,t,b,hw])=>col(x,t,b,hw,z+.06,{ch:7,cap:3.4}));
      /* Pale ledges and stepped sills below the arcade. */
      S({z:z+.07,w:1.1,t:.95},()=>{fill([[497,651],[684,666],[684,690],[497,690]],z+.07);seg(497,651,684,666);seg(497,655,684,669);});S({z:z+.08,w:.7,t:.62},()=>{seg(505,664,686,676);seg(505,668,686,680);S({w:.6,t:.5,lod:.15},()=>{for(let x=508;x<684;x+=4.5){const y=L(505,664,686,676)(x);seg(x,y,x,y+4);}});for(let y=0;y<3;y++)seg(500,658+y*2.4,682,672+y*2.4);});
      /* Carved blocks at the ends of the ledge. */
      [[490,654,504,670],[690,672,705,686]].forEach(([a,t,c,b])=>{S({z:z+.09,w:1,t:.9},()=>{fill(box(a,t,c,b),z+.09);line(box(a,t,c,b),{closed:true});});S({z:z+.1,w:.6,t:.6,lod:.2},()=>{const mx=(a+c)/2,my=(t+b)/2;arc(mx,my,4,4,0,TAU,10);seg(a+2,t+2,mx-3,my-3);seg(c-2,t+2,mx+3,my-3);seg(a+2,b-2,mx-3,my+3);seg(c-2,b-2,mx+3,my+3);});});
      /* The flanking pairs: tall leaded windows, hood arches, shafts, sill and string course. */
      const pairW=(w1,w2,cs,sill,str,zz)=>{mark("flanking window pairs");[w1,w2].forEach(([a,c,t,b])=>{const cx=(a+c)/2,r=(c-a)/2;S({z:zz-.005},()=>fill(semi(cx,t+r,r+7,r+7,14),zz-.005));vous(cx,t+r,r+2,r+7,zz,{n:9});S({z:zz+.005,w:1,t:.9},()=>{line(semi(cx,t+r,r+1,r+1,14));seg(a-1,t+r,a-1,b);seg(c+1,t+r,c+1,b);});archWin(a,c,t,b,zz+.01,{lead:3.1,w:1.3,t:1,fine:true,lod:.1});});
        cs.forEach(([x,t,b])=>col(x,t,b,1.7,zz+.02,{ch:4.5,cap:2.8}));
        S({z:zz+.02,w:1.2,t:.96},()=>{const[a,y0,c,y1]=sill;line([[a,y0],[c,y1],[c,y1+7],[a,y0+7]],{closed:true});seg(a-2,y0+9,c+2,y1+9);const[e,f,g,h]=str;seg(e,f,g,h);seg(e,f+3,g,h+3);seg(e,f+7,g,h+7);});};
      pairW([425,439,561,607],[456,470,565,611],[[418,570,610],[448,572,611],[452,572,611],[479,574,613]],[411,611,487,615],[403,621,497,627],z+.03);
      pairW([694,708,585,626],[724,738,588,629],[[688,592,628],[714,594,630],[718,594,631],[744,596,633]],[684,628,750,632],[684,637,754,642],z+.03);
      /* Wall below the flanking sills is plain stone; lines over the ledge stop at the portal roofs. */}

    /* SMALL FRONT GABLE above the central portal arcade and the block at the shaft foot. Ref 05 pane apex 585,503. */
    {const z=.05;const g=[[556,535],[585,505],[612,538],[612,544],[556,540]];S({z},()=>fill(g,z));S({z,w:1.3,t:1},()=>{line([[550,534],[585,500],[616,538]]);line([[556,535],[585,505],[612,538]]);seg(556,538,612,541);});S({z:z+.01,w:.6,t:.42,lod:.2},()=>{for(let y=512;y<540;y+=4){const h=(y-505)*.93;seg(585-h,y,585+h,y+1);for(let x=585-h+((y|0)%8?2:6);x<585+h-2;x+=9)seg(x,y,x,y+4);}});S({z:z+.01,w:1,t:.92},()=>{seg(584,500,584,490);seg(580,494,588,494);});S({z:z+.01,w:.7,t:.72},()=>{for(let k=0;k<7;k++){const u=k/7;seg(lerp(548,567,u),lerp(530,518,u),lerp(551,570,u),lerp(533,521,u));}});}

    /* PORTAL BLOCK: pale roofs, three gables, three arches, statues, carved friezes, clusters of shafts. Ref 05 pane x 398-802, y 651-803. */
    {const z=.6;const eave=[[397,681],[430,680],[463,658],[503,681],[553,684],[615,651],[680,690],[733,690],[757,673],[783,691],[802,692]];
      /* Pale sloped roofs between the gables, with snow guards. */
      S({z:z-.05},()=>{fill([[503,681],[553,684],[585,668],[505,668]],z-.05);fill([[680,690],[733,690],[752,676],[688,676]],z-.05);fill([[405,681],[430,680],[440,672],[406,672]],z-.05);fill([[783,691],[802,692],[802,686],[775,684]],z-.05);});
      S({z:z-.04,w:.8,t:.72},()=>{seg(505,668,585,668);seg(504,672,578,672);seg(503,676,570,677);seg(688,676,752,676);seg(684,680,747,680);seg(682,685,741,684);seg(406,674,437,674);});
      S({z:z-.03,w:.8,t:.82},()=>{[[510,677],[524,677],[531,677],[541,677],[690,684],[700,684],[710,684],[721,684]].forEach(([x,y])=>{line([[x,y+4],[x,y],[x+3,y-1],[x+3,y+2]]);seg(x-1,y+4,x+4,y+4);});});
      /* Main wall of the block. */
      const q=[...eave,[802,803],[397,803]];
      /* fill by columns, because the eave is not star-shaped from the centre. */
      for(let i=0;i<eave.length-1;i++){const a=eave[i],b=eave[i+1];fill([a,b,[b[0],805],[a[0],805]],z);}
      S({z:z+.05,w:1.8,t:1},()=>line(eave));S({z:z+.05,w:1.1,t:.92},()=>{line(eave.map(p=>[p[0],p[1]+3]));line(eave.map(p=>[p[0],p[1]+6.5]));});
      S({z:z+.06,w:.6,t:.6,lod:.15},()=>{for(let i=0;i<eave.length-1;i++){const a=eave[i],b=eave[i+1],l=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.floor(l/3.2);for(let k=0;k<n;k++){const u=k/n,x=lerp(a[0],b[0],u),y=lerp(a[1],b[1],u);seg(x,y+3,x,y+6.5);}}});
      S({z:z+.06,w:1,t:.92},()=>{seg(615,651,615,642);seg(611,645,619,645);arc(615,641,1.5,1.5,0,TAU,8);seg(463,658,463,651);seg(460,654,466,654);seg(757,673,757,667);seg(754,669,760,669);});
      /* Stone infill in the gable fields. */
      ashlar(400,560,x=>Math.max(662+Math.abs(x-463)*.56,684),()=>715,z+.01,{w:14,h:5,t:.34});ashlar(556,690,x=>Math.max(655+Math.abs(x-615)*.56,684),()=>722,z+.01,{w:14,h:5,t:.34});ashlar(690,800,x=>Math.max(675+Math.abs(x-757)*.7,694),()=>725,z+.01,{w:14,h:5,t:.34});
      {const rows=(cx,ay,by,k)=>{S({z:z+.008,w:.6,t:.36,lod:.2},()=>{let v=0;for(let y=ay+9;y<by;y+=5,v++){const h=(y-ay)*k;seg(cx-h,y,cx+h,y);for(let x=cx-h+(v%2?3:9);x<cx+h-2;x+=13)seg(x,y,x,y+5);}});};rows(463,658,690,1.55);rows(615,651,690,1.65);rows(757,673,698,1.1);}
      /* The three arches: dark opening, moulded rings, voussoirs, a bead course on the centre. */
      const portal=(cx,cy,r,ro,bot,rings,zz,beads)=>{mark("portal arches");const out=semi(cx,cy,ro,ro,28);S({z:zz},()=>fill(out,zz));
        S({z:zz+.01,w:1.6,t:1},()=>line(out));
        rings.forEach(([k,w,t])=>S({z:zz+.01,w,t},()=>line(semi(cx,cy,k,k,26))));
        S({z:zz+.01,w:.6,t:.58,lod:.12},()=>{const n=Math.round(ro*1.1);for(let i=1;i<n;i++){const a=PI-i/n*PI;seg(cx+(ro-1.5)*Math.cos(a),cy-(ro-1.5)*Math.sin(a),cx+(ro-(ro-r)*.32)*Math.cos(a),cy-(ro-(ro-r)*.32)*Math.sin(a));}});
        if(beads)S({z:zz+.02,w:.7,t:.72},()=>{[r+6,r+13].forEach(k=>{const n=Math.round(k*.95);for(let i=1;i<n;i++){const a=PI-i/n*PI;arc(cx+k*Math.cos(a),cy-k*Math.sin(a),1,1,0,TAU,6);}});});
        const hole=[[cx-r,bot],...semi(cx,cy,r,r,26),[cx+r,bot]];S({z:zz+.03,w:1.8,t:1},()=>{fill(hole,zz+.03);line(hole);});
        /* Faint shafts and door leaves deep inside. */
        S({z:zz+.04,w:.7,t:.3},()=>{for(let k=-2;k<=2;k++){const x=cx+k*r*.42;seg(x,cy+18,x,bot);}seg(cx-r+2,cy+18,cx+r-2,cy+18);seg(cx-r+2,cy+22,cx+r-2,cy+22);});};
      portal(461,716,19,33,800,[[31,.9,.82],[27,1,.8],[24,.9,.78],[21,1,.85]],z+.02);
      portal(614,724,33,52,803,[[49,1,.85],[45,.9,.75],[42,.8,.7],[38,1,.8],[35,1,.9]],z+.02,true);
      portal(754,727,19,33,803,[[31,.9,.82],[27,1,.8],[24,.9,.78],[21,1,.85]],z+.02);
      /* Sign at the left door. */
      S({z:z+.08,w:.7,t:.8},()=>line([[445,778],[453,778],[456,781],[453,784],[445,784]],{closed:true}));
      /* Niches with small figures between the arches. */
      const niches=(xs,t,b,zz)=>xs.forEach(x=>{S({z:zz,w:.9,t:.85},()=>{const q=[[x-4.4,b],[x-4.4,t+4],...semi(x,t+4,4.4,4.4,8).slice(1,-1),[x+4.4,t+4],[x+4.4,b]];fill(q,zz);line(q);});robe(x,t+3.5,b,2.6,zz+.01);});
      niches([515,525,535],695,716,z+.1);niches([695,703,712],703,722,z+.1);
      S({z:z+.11,w:.8,t:.72},()=>{seg(509,715,541,717);seg(690,722,717,723);});
      /* Large carved robed figures. Generic, no likeness. */
      [[422,687,728,8],[505,689,730,8.5],[545,691,730,8],[682,695,736,8],[723,697,737,8.5],[790,698,737,8.5]].forEach(([x,t,b,hw])=>{S({z:z+.1,w:.9,t:.75},()=>{const nq=[[x-hw-2,b+1],[x-hw-2,t+6],[x,t-3],[x+hw+2,t+6],[x+hw+2,b+1]];fill(nq,z+.1);line(nq);});robe(x,t+1,b,hw*.85,z+.11);S({z:z+.12,w:.9,t:.8},()=>{arc(x,t+1,2.6,3.2,0,TAU,10);});});
      /* Friezes and the long cornice beneath them. */
      frieze(427,718,442,732,z+.12,3);frieze(480,718,498,732,z+.12,4);frieze(510,720,538,734,z+.12,6);frieze(551,721,585,735,z+.12,8);frieze(648,724,680,738,z+.12,7);frieze(694,727,719,739,z+.12,6);frieze(727,728,741,740,z+.12,3);frieze(772,728,784,739,z+.12,2);
      S({z:z+.13,w:1.3,t:.96},()=>{line([[398,735],[440,736]]);line([[478,737],[588,739]]);line([[644,741],[742,743]]);line([[770,742],[802,743]]);line([[398,739],[440,740]]);line([[478,741],[588,743]]);line([[644,745],[742,747]]);line([[770,746],[802,747]]);});
      /* Long shafts below: paired and clustered, read from the close crops. */
      const shafts=[[407,756,782,3],[414,756,782,2],[421,756,782,2.6],[426,756,782,2.6],[433,752,797,3.6],[484,754,797,3.8],[491,755,781,1.8],[496,755,781,2.2],[503,756,781,2.8],[509,756,781,2.8],[521,755,781,2.2],[533,755,781,2],[542,755,781,2.8],[549,755,781,2.6],[561,755,781,2.2],[575,755,800,3.6],
        [650,757,803,3.8],[664,756,783,2.2],[680,756,783,2.2],[687,756,783,2.6],[701,757,783,2.2],[715,757,783,2],[721,757,783,2.6],[726,757,783,2.2],[733,757,796,2.8],[771,758,798,3.2],[782,758,784,2.6],[791,758,784,2.4],[797,758,784,2.4]];
      S({z:z+.13},()=>{fill(box(488,750,572,783),z+.13);fill(box(656,752,732,784),z+.13);fill(box(398,750,430,784),z+.13);fill(box(776,750,802,784),z+.13);});
      S({z:z+.135,w:.7,t:.3},()=>{for(let x=490;x<572;x+=3.4)seg(x,752,x,782);for(let x=657;x<732;x+=3.4)seg(x,752,x,782);});
      shafts.forEach(([x,t,b,hw])=>col(x,t,b,hw,z+.14,{ch:7,cap:hw*1.5+.8,w:hw>3?1.5:1.1}));
      /* Plinths with medallions. */
      [[398,784,431,800],[488,782,569,804],[656,785,733,804],[776,785,802,804]].forEach(([a,t,c,b])=>{S({z:z+.15,w:1.3,t:1},()=>{fill(box(a,t,c,b),z+.15);line(box(a,t,c,b),{closed:true});seg(a-2,t+2.5,c+2,t+2.5);seg(a-2,t+5,c+2,t+5);});S({z:z+.16,w:.6,t:.42,lod:.25},()=>{for(let x=a+7;x<c;x+=19)seg(x,t+6,x,b);for(let y=t+11;y<b;y+=6)seg(a,y,c,y);});});
      [[418,793],[503,793],[547,793],[724,795],[662,795]].forEach(([x,y])=>S({z:z+.17,w:.8,t:.78},()=>{arc(x,y,4.6,4.6,0,TAU,14);arc(x,y,2.6,2.6,0,TAU,10);}));
      /* Notice boards. */
      S({z:z+.17,w:.9,t:.9},()=>{line(box(697,789,706,801),{closed:true});line(box(708,789,717,801),{closed:true});seg(696,787,718,787);});
      /* Steps. */
      {const zz=z+.3;S({z:zz},()=>fill(box(478,803,812,819),zz));S({z:zz,w:1,t:.85},()=>{for(let y=803,k=0;y<816;y+=2.6,k++)seg(482-k*3,y,808+k*2,y);seg(470,817,812,817);});S({z:zz+.01,w:.6,t:.42,lod:.3},()=>{for(let k=0;k<5;k++)for(let x=500+((k*37)%60);x<800;x+=60)seg(x,803+k*2.6,x,805.6+k*2.6);});
        /* Iron handrails. */
        S({z:zz+.02,w:.9,t:.9},()=>{[[583,808],[588,808],[662,808],[668,808]].forEach(([x,y])=>{line([[x,793],[x+4,797],[x+4,y+5]]);seg(x,793,x,y+3);});});}}

    /* GROUND. Brick plaza and pale path in front of the church, left paths under the trees. Ref 05. */
    {const z=2;const T=x=>x<100?845:x<420?845-(x-100)*.04:x<700?832-(x-420)*.042:x<1000?820-(x-700)*.002:819-(x-1000)*.0075;
      S({z},()=>fill([[0,812],[1400,812],[1400,830],[0,860]],z));
      S({z,w:1,t:.7},()=>{line([[0,806],[1400,811]]);line([[0,843],[120,840],[370,836],[420,833]]);});
      S({z,w:.7,t:.5},()=>{seg(0,833,380,830);seg(20,832,380,826);seg(650,820,1000,819);line([[460,825],[660,822],[1000,819]]);line([[1000,812],[1400,812]]);});
      S({z:z+.01,w:.5,t:.3,lod:.5},()=>{for(let i=0;i<160;i++){const x=450+rnd()*560,y=818+rnd()*8;seg(x,y,x+6,y);}});
      /* Path corner at the lawn's left edge. Ref 05 pane x 0-70, y 843-890. */
      S({z:z+.02,w:1,t:.8},()=>{line([[0,892],[59,848],[105,843]]);line([[0,882],[47,846]]);line([[0,860],[30,843]]);});}

    /* LAWN. Blades in tufts, mown bands; the near grass gets longer. Ref 05. */
    {const z=3;const T=x=>x<105?845:x<420?845-(x-105)*.04:x<700?832-(x-420)*.042:x<1000?820-(x-700)*.002:819-(x-1000)*.0075;
      const edge=[[0,892],[59,848],[105,845],[420,832],[700,820],[1000,819],[1400,816]];
      for(let i=0;i<edge.length-1;i++){const a=edge[i],b=edge[i+1];fill([a,b,[b[0],933],[a[0],933]],z);}
      S({z,w:1.3,t:.9},()=>line(edge));
      const blade=(x,y,l)=>seg(x,y,x+(rnd()-.5)*l*.5,y-l);
      S({z:z+.01,w:.6,t:.42},()=>{for(let i=0;i<2200;i++){const u=rnd(),y=lerp(0,1,Math.sqrt(u)),x=rnd()*1400,t=x<60?892-x*.74:T(x),yy=lerp(t,933,y);if(yy<t+2)continue;blade(x,yy,1.6+(yy-820)*.03);}});
      S({z:z+.015,w:.5,t:.36,lod:.5},()=>{for(let i=0;i<1800;i++){const x=rnd()*1400,t=x<60?892-x*.74:T(x),yy=lerp(t,933,Math.sqrt(rnd()));if(yy<t+2)continue;blade(x,yy,2+(yy-820)*.04);}});
      S({z:z+.015,w:.5,t:.32,lod:1.4},()=>{for(let i=0;i<1000;i++){const x=rnd()*1400,t=x<60?892-x*.74:T(x),yy=lerp(t,933,Math.sqrt(rnd()));if(yy<t+2)continue;blade(x,yy,1.4+(yy-820)*.03);}});}

    /* FIGURES. Generic figures with no likeness, read for position and pose only. Ref 05 crops d_fg, d_fg2, d_fg3. */
    const fig=(x,yT,yB,s=1,z=2.5)=>{const h=yB-yT,P=a=>a.map(([u,v])=>[x+u*h*s,yT+v*h]);S({z,w:1,t:.9},()=>{const hd=P([[-.05,.02],[.05,.02],[.06,.09],[.03,.13],[-.03,.13],[-.06,.09]]),b=P([[-.05,.14],[.05,.14],[.13,.2],[.14,.45],[.08,.55],[.07,1],[.01,1],[0,.58],[-.01,1],[-.07,1],[-.08,.55],[-.14,.45],[-.13,.2]]);fill(b,z);fill(hd,z);line(hd,{closed:true});line(b,{closed:true});if(h>24)S({w:.6,t:.55},()=>{const a=P([[-.09,.52],[.09,.52]]);seg(a[0][0],a[0][1],a[1][0],a[1][1]);});});};
    const sit=(x,yT,yB,s=1,z=2.5)=>{const h=yB-yT,P=a=>a.map(([u,v])=>[x+u*h*s,yT+v*h]);S({z,w:1,t:.9},()=>{const hd=P([[-.08,.03],[.08,.03],[.09,.16],[-.09,.16]]),b=P([[-.1,.2],[.1,.2],[.17,.5],[.45,.6],[.55,.98],[.42,1],[.3,.72],[.08,.75],[-.18,.72],[-.2,.45]]);fill(b,z);fill(hd,z);line(hd,{closed:true});line(b,{closed:true});});};
    /* Figures across the plaza and on the church steps. */
    [[401,787,820,1],[455,782,818,-1],[483,782,830,1,2.6],[494,792,816,-1],[543,790,818,1],[567,795,820,1],[627,786,812,-1],[679,786,818,1],[782,786,826,1],[845,790,824,1],[851,788,824,-1],[864,790,820,1],[907,787,826,-1],[933,795,814,1],[955,790,812,1],[1082,780,815,1],[1125,784,812,1],[1222,768,812,-1],[1314,772,815,1],[1332,772,815,1],[1388,770,818,1],[60,787,812,1],[110,785,810,1],[160,786,810,1],[347,795,815,1]] .forEach(a=>fig(...a));
    /* Cafe tables and chairs, seated figures. Ref 05 pane x 385-505, y 795-825. */
    {const z=2.4;const table=(x,y)=>S({z,w:.9,t:.85},()=>{seg(x-8,y,x+8,y);seg(x,y,x,y+13);seg(x-5,y+14,x+5,y+14);});const chair=(x,y,s)=>S({z,w:.8,t:.8},()=>{line([[x,y],[x,y+14],[x+7*s,y+14]]);seg(x,y+8,x+7*s,y+8);seg(x+7*s,y+8,x+7*s,y+14);});
      [[415,802],[435,804],[470,806],[497,808]].forEach(([x,y])=>table(x,y));[[395,800,1],[405,804,1],[425,804,-1],[445,804,1],[480,806,1],[505,806,-1],[487,808,-1]].forEach(a=>chair(...a));
      [[394,798,818],[408,796,818],[424,797,818],[440,796,819],[461,795,820]].forEach(([x,t,b],i)=>sit(x,t,b,i%2?1:-1,z+.01));[[509,792,804],[552,792,805]].forEach(([x,t,b])=>sit(x,t,b,1,z+.01));}
    /* Long tables or planks in front of the right portal. Ref 05 pane x 680-800. */
    {const z=2.3;S({z,w:1.2,t:.9},()=>{line([[676,808],[778,795],[800,795]]);line([[676,811],[778,798],[800,798]]);line([[690,814],[778,803],[800,803]]);line([[690,817],[778,806],[800,806]]);});S({z,w:.8,t:.72},()=>{[[712,812,706,824],[712,812,720,824],[755,808,750,820],[755,808,762,820],[790,805,785,817],[790,805,796,817]].forEach(([a,b,c,e])=>seg(a,b,c,e));});S({z,w:1,t:.9},()=>line([[817,826],[820,812],[823,826]],{closed:true}));}
    /* Seated groups under the left trees. */
    [[52,796,820,1],[72,800,822,-1],[86,804,822,1],[100,802,822,-1],[115,806,823,1],[175,805,823,1],[190,802,822,-1],[205,803,823,1],[265,804,818,1],[328,800,816,-1],[345,802,816,1],[362,800,816,-1],[375,802,816,1]].forEach(([x,t,b,s])=>sit(x,t,b,s,2.2));
    /* Crowd on and around the benches under the right trees, in front of the bus. Ref 05 pane x 1140-1300, y 780-815. */
    [[1155,785,813,1],[1170,790,813,-1],[1188,788,813,1],[1200,794,813,-1],[1235,780,813,1],[1250,790,813,-1],[1262,786,813,1],[1272,792,813,-1]].forEach(([x,t,b,s])=>sit(x,t,b,s,2.2));
    S({z:2.3,w:1,t:.88},()=>{line([[1042,812],[1046,797],[1100,797],[1100,812]]);seg(1040,803,1102,803);seg(1040,808,1102,808);seg(1050,797,1050,812);seg(1090,797,1090,812);for(let x=1005;x<1040;x+=3.4)seg(x,800,x,811);seg(1005,800,1040,800);seg(1005,806,1040,806);[[1012,795],[1024,795]].forEach(([x,y])=>{line(box(x,y,x+3,y+12),{closed:true});arc(x+1.5,y,1.5,1.5,PI,TAU,6);});});

    /* Person on a blanket on the lawn, back to us. Ref 05 pane x 105-225, y 805-846. */
    {const z=3.3;const b=[[105,844],[122,846],[160,846],[226,843],[195,840],[150,841],[108,840]];S({z,w:1,t:.85},()=>{fill(b,z);line(b,{closed:true});seg(158,841,158,846);seg(198,840,198,844);});
      const p=[[136,805],[142,804],[147,808],[152,815],[155,830],[162,837],[160,842],[125,843],[122,830],[122,815],[128,808]];S({z:z+.01,w:1.2,t:.95},()=>{fill(p,z+.01);line(p,{closed:true});arc(139,801,4.4,4.8,0,TAU,12);fill(semi(139,801,4.4,4.8,10,0,TAU),z+.01);});
      S({z:z+.02,w:.6,t:.55},()=>{seg(132,812,128,838);seg(142,812,145,838);seg(127,826,151,828);seg(137,808,138,842);});}
    /* Standing person at the left edge, in the near foreground, with a shopping bag. Ref 05 pane x 0-25, y 752-855. */
    fig(9,752,855,1,3.6);S({z:3.65,w:.9,t:.85},()=>{const q=[[11,810],[27,808],[27,829],[11,830]];fill(q,3.65);line(q,{closed:true});});

    /* THE READER on the lawn, on her back with knees up and a book held over her: pose only, no likeness. Ref 05 pane x 563-688, y 832-883. */
    {const z=4;const torso=[[598,866],[620,862],[640,868],[652,864],[656,878],[620,880],[600,880]],legs=[[648,868],[660,842],[668,832],[680,834],[684,842],[676,850],[682,866],[688,876],[676,878],[668,858],[664,850],[658,870],[656,878]];
      S({z,w:1.4,t:1},()=>{fill(torso,z);line(torso,{closed:true});fill([[648,868],[660,842],[668,832],[684,842],[676,850],[688,876],[676,878],[664,850],[656,878]],z);line(legs,{closed:true});});
      S({z:z+.01,w:.8,t:.78},()=>{line([[628,866],[636,879]]);line([[640,868],[646,878]]);line([[655,846],[668,868]]);line([[662,838],[672,866],[678,876]]);});
      /* Pack under her head, cap with its brim, arm up holding the book. */
      const pack=[[563,878],[566,864],[578,858],[590,866],[596,879]];S({z:z+.02,w:1.1,t:.92},()=>{fill(pack,z+.02);line(pack,{closed:true});S({w:.6,t:.6},()=>{seg(570,862,575,877);seg(566,872,592,876);});});
      S({z:z+.03,w:1.2,t:.95},()=>{const h=semi(592,863,8,8,14,0,TAU);fill(h,z+.03);line(h);const c=[[574,856],[584,849],[596,850],[601,856],[592,858],[580,860]];fill(c,z+.03);line(c,{closed:true});});
      const arm=[[620,864],[630,852],[633,846],[638,849],[634,856],[626,868]];S({z:z+.04,w:1.1,t:.95},()=>{fill(arm,z+.04);line(arm,{closed:true});});
      const bk=[[633,830],[642,829],[646,832],[648,852],[638,854]];S({z:z+.05,w:1.2,t:1},()=>{fill(bk,z+.05);line(bk,{closed:true});seg(642,829,644,853);});S({z:z+.06,w:.6,t:.6,lod:.2},()=>{for(let y=834;y<851;y+=2.6)seg(644.5,y,647.5,y);});
      /* Shoes. */
      S({z:z+.05,w:.9,t:.9},()=>{const s=[[666,881],[670,872],[682,876],[690,882],[684,884]];fill(s,z+.05);line(s,{closed:true});const s2=[[673,874],[683,868],[694,878],[688,880]];line(s2,{closed:true});});
      /* Shadow on the grass. */
      S({z:z-.05,w:.7,t:.5},()=>{line([[570,884],[640,883],[690,885]]);});}

    /* Pigeon in the foreground and the small birds further back. Ref 05 pane x 975-1012, y 893-918. */
    {const z=4.2;const b=[[978,893],[984,894],[990,902],[1004,904],[1013,910],[1000,912],[988,911],[982,903]];S({z,w:1.3,t:1},()=>{fill(b,z);line(b,{closed:true});});S({z:z+.01,w:.8,t:.78},()=>{arc(980,894,2.4,2.4,0,TAU,8);seg(978,894,975,896);seg(988,911,986,918);seg(992,911,993,917);line([[986,903],[995,908],[1004,908]]);line([[988,906],[998,910]]);});
      S({z:z+.02,w:.6,t:.6,lod:.2},()=>{for(let k=0;k<6;k++){seg(990+k*2,905+k*.4,993+k*2,908+k*.3);}});
      [[1040,822,8],[1080,822,3],[1140,822,4],[1158,823,5],[1148,848,5]].forEach(([x,y,l])=>S({z:z-.8,w:1,t:.9},()=>{const q=[[x-l*.8,y],[x+l*.1,y-l*.5],[x+l,y+.2],[x+l*.2,y+l*.4]];fill(q,z-.8);line(q,{closed:true});}));}

    /* Lamp posts. Ref 05: square-head lamp at pane x 30, globe lamp at pane x 372. */
    {const z=3.2;S({z,w:1.4,t:1},()=>{seg(30,655,20,845);seg(27,655,17,845);});S({z,w:1,t:.92},()=>{const h=[[22,658],[38,658],[42,652],[36,646],[32,642],[27,645],[22,650]];fill(h,z);line(h,{closed:true});S({w:.7,t:.7},()=>{seg(22,658,38,658);seg(28,658,28,668);seg(32,658,32,668);seg(26,668,34,668);seg(25,682,33,682);});});
      const zz=2.2;S({z:zz,w:1.2,t:.95},()=>{seg(372,716,366,830);seg(375,716,369,830);const q=[[361,836],[378,836],[376,825],[372,812],[368,812],[364,825]];fill(q,zz);line(q,{closed:true});line(box(368,752,377,765),{closed:true});});
      S({z:zz+.01,w:1.2,t:1},()=>{fill(semi(375,707,6.5,7.5,14,0,TAU),zz+.01);line(semi(375,707,6.5,7.5,18,0,TAU));seg(372,714,378,714);seg(372,716,378,716);});}

    /* FOLIAGE. The canopy outline, traced from the photo as 6 px cells with a light level per cell. Ref 05 left trees and right trees. Cells hide what is behind them. */
    {const L6="0|6:1,18:6777,48:511111,150:423122122,210:314233222322126,312:4,342:552242333,510:34;6|6:1465,36:422111221,96:233235322222111342,210:75542445213332,330:4,342:321232423,444:323,510:544;12|12:4633841421211,96:1133,126:1,138:4312,168:422244,210:34,234:534423332,306:5,342:4322444333,444:43,510:4;18|18:33552232221422113,138:5512232224,210:3,234:535434233,306:454,342:23,366:332,390:36,444:5343;24|12:3232233242321111211,138:42222112113211,246:3522223,330:15,348:32,366:2333,450:231;30|0:1232232333124241425421,144:123,168:111123212322,246:12,264:2234,324:242,348:2,366:2344444;36|0:34575435342111232234321,156:23212412311132443,264:24,282:32,324:2,342:12211123347;42|0:3364756225224412221241114111,186:421121121323,270:3,282:23,318:3,342:21,360:112224755;48|0:5434564333331134221223,144:1,156:112,180:4,192:411421,240:2,264:23,288:2,330:3,342:321224234335;54|0:4315442352,66:132353,108:22,126:224,156:512444,204:343,258:24,282:42,318:233454142,378:323365;60|0:4315534443224244662224334,156:1221454,204:224,276:13,318:554342335,378:54543;66|0:554,24:454553211354521422127,156:1213322,210:32,270:11242,318:3334434433432;72|0:54433465252223234212543532653213212322,264:3,282:4,318:4446,360:5524333;78|0:41153352243262132112312223622,180:213,210:2334,264:3,282:322,318:5466334564324;84|0:454563224,60:43312121124643413,168:5,180:341,210:222324322,276:22,312:23555646265344,498:55;90|0:521345214244421111353,138:5211233333,216:1123,246:32422222234353333225754323,504:3;96|0:3113464222,66:4321,96:21,114:5,132:2344243243,216:222222313233222344,330:2343483443234,420:5,492:78;102|0:221327346,60:6312341,114:555453334233,222:123232212233342642257434454,390:542,420:3436,456:4,498:68;108|0:34433635555334232543423555211345,216:231234953443646433225543334,396:33,414:265,438:76,456:56,480:885544;114|0:44444363434636453421435253331353,222:242422434463352242,342:8643345,396:41,414:215,438:865663,486:465575;120|0:41344225561323533222434,144:2,156:33274,222:1,234:5,252:131231123323,342:767332652311,426:67865885,480:234634,546:4,564:74;126|0:32235426655554233312634544,162:24454222,240:2,270:21133324,336:565,360:63233,402:332,426:4553694,480:23364,546:3,564:7;132|0:3325425,48:55556443322252579763334545,210:5,240:3,252:32,276:52112222,336:35663,372:231,402:54,426:4335675,480:1126,510:5,534:6,552:445;138|0:4114454553543255341124453647545423,210:44,252:3,264:4,276:23,294:212122335343,372:232,426:3343366,480:245,504:655,534:6444666;144|0:33345453334522431211343313341766,198:654,222:32,264:3323,294:333232253113,420:2244236463254,516:73,546:7465;150|0:344343354465321124223212123456566664,264:52232121134,342:4,360:3,408:4,438:2235985,516:75344778;156|0:343254352432222134422322125324646747,264:533521232223,372:23,390:32,444:4578867873,528:73,546:7439;162|0:23346433342523134434472415621124575,282:411333123,414:55723,450:557866554,528:68454;168|0:43645344733641641224554321311145443,216:5,282:3225,318:4344,408:547,438:43336765665,534:8;174|0:431332565676,78:5422522543337513223557775,282:4,300:6,318:4,438:4412586697,510:5;180|0:343457544756552351233443354242627597755,246:64,300:43253,426:343,468:676,498:7,516:4,534:57,576:5;186|0:466144444455731124313335343236866566654435654,312:55,336:65,438:22,468:375,510:3,534:3,570:754;192|0:555334454544442213224114346535667544533453632,306:4334244,444:3,468:5,504:61,522:5,552:4,570:5,582:46;198|0:54644235345453313113241222553245442546524254,312:46574,348:7,486:554,522:53,540:67,558:7,570:3;204|0:645425364554323442335424223432445533444342567755,300:372269664,360:66,480:36437,552:1,570:6;210|0:535534732323354654456435644356663423435666665655,294:4453567455686,474:444365545,552:224385;216|0:3335456211265445535664341445755966433364554,264:667,300:434,324:377465,480:343,504:5,558:66957;222|0:34433111333655564569756412456576542355555753586,300:2234462,348:46,516:6,564:766,588:86;228|0:111234646745553224,114:676463132866454344233454555,294:3,306:125,330:61,522:56,558:57337,594:65;234|0:3234352456567422247563442272567973555213412127,306:427472,558:325646;240|0:3133453447434574253435323124366332215311512646,294:96,318:633,534:43,558:3245,588:8;246|0:3443234344336542213422523224233332123221412,264:67546477,330:5,522:3,576:57867;252|0:3442333245444432233645222134343611113242235746674376,330:44,588:2457;258|0:232345344255433423273,138:442223367642315623466677,300:62,330:2,342:76,588:15;264|0:3112143424444222334443,138:32111255663222366833454,348:7;270|0:2113121331343113432433534211334475334465772244;276|0:11342243434343244554332232212446658423535624465;282|0:223111124433411332323333541133225666443455343;288|0:4621212133223115462321443432322334656524565587;294|0:5564111222321422431111232111252342267644466955;300|0:4552331111212311411123345223222333686755655;306|0:4433221114211111233223434423211233644365345,264:7776,300:66;312|0:323423443311331213733121552454223426544443776855665466;318|0:3124446411111123136422415524343122464444656567555566566;324|0:211131342332123327754544212344434232445429555634543676676;330|0:111251111121134433333324441323233222233545954755423656686;336|0:2234522112331321432233134323123341222434476585364357553,336:8;342|0:232332132336231123233531432342233335432344566575363354,330:63;348|0:4422334343422545222343432323342234433112335555464512455,342:5;354|0:212223213343443332223223335443334343333333576344336644,330:6555;360|0:22111111431243323211111352323242353433232335433433346765565;366|0:11121222211321433211211233313322233333344554,270:24554113554234;372|0:2111111223232212322113212321333211243334344632555421244,336:23;378|0:11111114331221222442213112111223213212352645354655754412;384|0:111221121111111113211122111412235453321377675654,294:6664444;390|0:1221321112112111111112322233112543121111255575455445433;396|0:2111121111112311311222223211113323211121566677987745;402|0:23232111221211121111112431121122232111222544466579445;408|0:122211122242123222111122121332223321112354426555677566;414|0:221122111112114532121111221321232222223993348835675346;420|0:121111211112111121111112312321223232233544256423888634;426|0:11123112111122441221121111134322323243442644334385446796;432|6:312211122224334543212311111321342233434245465545566665;438|12:31311321111245341222221212231223533335654345566975666;444|0:4221111111121111212116211212113443565645554538757877697,336:57;450|6:31111133111121111111111211221234323354385774675545466646145;456|12:111111112111131122111111113423354545237656445543344753554;462|6:1132123,54:11111111111111111113222143462432546664354334,330:523;468|6:32,24:244,48:232133111111111211122122226653241345535654434,336:2;474|18:132,42:2221111111112111111111212235455422477535965,306:5;480|18:112,42:2311,78:45211111211111121112344323126335455,294:764;486|0:4,12:411,42:211232,84:42111122112221112313544244433647755885;492|0:342,36:2,48:432153421121211122221122344444443463368774,306:8;498|0:13321,54:52,72:3,90:221322211333422234,204:543644544544664446,324:644;504|0:123,24:21,54:64333,108:22223111257331334355664347744155669,324:5;510|0:113321,54:3243111121,120:11113413534326154555463544544365,318:75;516|12:3122,54:1211123124,120:32,138:243534545234556642522233334468;522|12:1133,54:111123344542133312213344222453356433461,552:6;528|0:323435,42:5331121111236413232321233331344321332856,294:6;534|0:1333322632212211134211422352333233212323441134698673;540|0:2441113334122222244,120:12332351334433334344644524543695;546|0:1121211231222112333334474255444234532533243524755,300:7;552|0:332112122322332322232334334433346453345433225347755;558|0:3311223213345454234312553337443453335554,246:54386,282:7966;564|0:11111111122323432346433465677843223355443,252:43632,288:554,318:54;570|0:11211112222121133357654666655654243432344675553,294:548,324:8;576|0:23211111252421113254576355544624322455545357,270:63543555,324:6;582|0:111112212232211136433775433364,186:4634,216:644455586445346355667;588|0:13431223321353112336453434344345542333,240:65674456343446367,366:76,384:321;594|0:34321311132376412335343212634454432323,234:3458,282:253355454777,360:7646552;600|0:22224332355466334215532344565766,216:41,234:345,258:536,282:5123654,330:6766,360:45775578;606|0:11124653111245512112112334355656,198:5,216:5,234:4357634,282:436666557755565356645;612|0:3323233413232321111121114475665756647656544445643244445576546546611;618|0:433212131111212111111111557555,186:665656764445456342323435766645665622;624|0:111111211112111111111112476433476563,222:55356664666445437785765776,384:566;630|0:21111111111111111111113344333347667555553,252:6545787533334433443,378:3244;636|0:3211111111122222123111232221245775544465467653466642245421222323;642|0:2321111112221225453123111112346553565354675865545523236323534455;648|0:112111111122124554423231121453653655366656455434456525633333443346;654|0:1232215222322344421124211122345444443545652466454454332254344667533;660|0:11234,42:554312253211321111112385555464345445455565342352321244,378:64;666|0:22341233322142422111132344234565545543544443456533234232323433353;672|0:2333323321113122222112354643564464555543333445432333325333,360:14342;678|0:333222331111332123211254525442435666523332445433414552214313356656522;684|0:221224352422341231333142235644233676633444444334463344333324453453652;690|0:2211323432223631122111321135555435666476453334555545554444456653453534;696|0:2134243311135443231121432425544446755455443344545643466562243442541453;702|0:22531433211354344433123465366646666453443545554445347653313335,384:34434;708|0:24421343113452335534323555554544657532323564555434234324124544,384:45663;714|0:333323332135322322342223552455434455311234556553334556556565221532452;720|0:3311234222334332212332233324555334452111445555664433457445333,372:222124;726|0:2333256421433322433444442433433345523222544435454644466,336:57342,378:2211;732|0:555345554333122223323434455453134332233643333345444533555;738|0:4562555441342222344334435523442437533355322232354353344544;744|0:4461555444553323433444523432345344433341223444333444333564;750|0:3211564555341122123223442554345563114312422245433454344541;756|0:42113332433312112222333343432354421232333332343222543,324:4552;762|0:2,18:12222122211311222113243541335231133434544535422233,324:6431;768|24:2121131311311212111112431415311213355254313422233,324:243;774|72:125121221,150:1111,180:122111332251322111111;780|90:244,186:11111332331121111,294:11;786|102:1,192:1111111111111,276:21,324:2;792|96:32,198:1,240:11221,324:1;798|66:3,234:11122",R6="450|1356:5,1368:6,1380:4636;456|1344:2465655544;462|1344:5655554245;468|1350:333355334;474|1350:554336563;480|1248:34,1338:56533334555;486|1248:5554,1338:44533445444;492|1230:8,1248:445563,1344:5453365442;498|1212:6,1224:567,1248:3544542,1344:4535433433;504|1206:6766436633236,1296:4,1338:32324223233;510|1206:5544454451146676,1320:55542223334233;516|1200:46542356544245555,1320:53452224333337;522|1188:4654542555335455445,1320:44244433224655;528|1032:23,1170:132254224443442333224546543244322156766;534|1032:2,1176:32442222433322543315545422243342246658;540|1032:2,1182:5532544332422434444545211235433423244;546|1032:11,1104:111111,1146:1,1170:111211356356543323566455312344423221322;552|1032:25,1104:11111121111221112345446443322566565312322444345324;558|1032:11,1104:36522221114565312323332464324345555312233453334433;564|1032:1,1092:1365754653244543322223344442233545544332135563223234;570|1044:4,1086:35666765543355335533433435553464534644431242464342221;576|1038:5,1080:126334455555435421423423234455556334335542321345363221;582|1032:13,1080:144234456666544432232332244446644235645531113424534522;588|1026:5221,1080:225423667665433221232133241445243335443453364333433211;594|1032:33,1056:323,1080:223544567776643332333243245345344434654557523434232111;600|1032:22,1056:3553334553346665554423223343222253545443333235433444222234;606|1032:11235666,1086:34446336766676534766325342144553432445434444233222332;612|1026:124224566653434444674555545657746524224473324544654555325432122;618|1014:35245643357463244455645665443345334531133254223653345566764421122;624|1008:245754753334666344235656634455546555443222223323443344445643312111;630|1008:475565554534345631344547553555444566544214323224444465333433111211;636|1008:156545223422243653233544542363346656664333332234434454435533323411;642|1008:444553334442223454433354542353446445534543112334442346435222222232;648|1008:333434444432112355543323233442244444443442111232233355324443432341;654|1008:222343446322122454444112212223553343554233311233323354344343421311;660|1008:212245432133464662133322112212332333132312122324442342335321232111;666|1014:13224445323445543332422222221112422221121222345433322335331221132;672|1014:13433445632122212212112432111211345453221123332232212121222121112;678|1014:13322221122322221211211221111322332121131234433422112321112122112;684|1014:13322111111111331212111121111232211111112134313333111221221111111;690|1008:3,1020:1222121113111211111111131111111112221112222221111213211111111111;696|1008:322321111122221211111111111111111111113311112121111344222211111111;702|1014:12113321234433352321111111111111111111321111122233,1326:4321211111121;708|1014:1,1032:1111121132111111211111111111111111222111113234,1314:443312221124545;714|1008:1,1050:1,1062:112111111221111111111111111121211111121,1320:32122222222346;720|996:111,1062:12,1086:31111121111111111111221121111121133,1320:113211121112;726|996:1211131,1056:1112333321111111111111121232133211211114,1332:13223211;732|996:1111541,1056:1131,1086:4,1104:32111111111212211111111111111113,1338:2213",C=6;
      const parse=s=>{const o=[];s.split(";").forEach(r=>{if(!r)return;const[y,rest]=r.split("|");rest.split(",").forEach(run=>{const[x,dd]=run.split(":");o.push({y:+y,x:+x,d:dd});});});return o;};
      /* Kite leaf outline, sparse clump of strokes, single stroke. */
      const KITE=[[0,-1],[.5,-.25],[.36,.5],[0,.9],[-.36,.5],[-.5,-.25]];
      const leaf=(x,y,r,shape=KITE)=>{const a=rnd()*TAU,c=Math.cos(a),n=Math.sin(a);return shape.map(([u,v])=>[x+r*(u*c-v*n),y+r*(u*n+v*c)]);};
      const tick=(x,y,l)=>{const a=rnd()*TAU;seg(x,y,x+l*Math.cos(a),y+l*Math.sin(a));};
      const clump=(x,y,r)=>{const a=rnd()*TAU;for(let k=-1;k<=1;k++){const b=a+k*.9;seg(x,y,x+r*Math.cos(b),y+r*Math.sin(b));}};
      /* Depth by zone: the great tree in front of the tower, the lower trees just before the church, the overhanging bough nearest of all. */
      const zOf=(x,y)=>y<290&&x>300?5:y>620?1.6:y<290?4.8:4.4;
      const runs=parse(L6).concat(parse(R6)),has=new Set();runs.forEach(({y,x,d})=>{for(let i=0;i<d.length;i++)has.add((x+i*C)*10000+y);});
      runs.forEach(({y,x,d})=>{const zz=zOf(x,y);fill(box(x-.4,y-.4,x+d.length*C+.4,y+C+.4),zz);});
      runs.forEach(({y,x,d})=>{[...d].forEach((c,i)=>{const v=+c,cx=x+i*C,z=zOf(cx,y)+.02,edge=!has.has((cx-C)*10000+y)||!has.has((cx+C)*10000+y)||!has.has(cx*10000+y-C)||!has.has(cx*10000+y+C),X=()=>cx+rnd()*C,Y=()=>y+rnd()*C;
        if(y<290&&cx>395){for(let k=0;k<2;k++)if(rnd()<.55){const q=leaf(X(),Y(),4+rnd()*2.6);S({z:z+.02,w:.7,t:.62+rnd()*.2},()=>{fill(q,z+.02);line(q,{closed:true});S({w:.6,t:.45,lod:.3},()=>seg(q[0][0],q[0][1],q[3][0],q[3][1]));});}return;}
        S({z,w:.7,t:Math.min(.8,(edge?.34:.2)+v*.055)},()=>{if(v>=6||edge)clump(X(),Y(),3+rnd()*1.2);else if(v>=3){tick(X(),Y(),3);if(rnd()<.2)clump(X(),Y(),2.6);}else if(rnd()<.35)tick(X(),Y(),2.6);});
        if(v>=2&&rnd()<.13)S({z:z+.01,w:.6,t:.3+v*.04,lod:1.05},()=>line(leaf(X(),Y(),2.2+rnd()*1.2),{closed:true}));});});
      /* Limbs of the great tree and the long bough across the top. */
      const limb=(pts,hw,z,t=.8)=>{const a=pts.map((p,i)=>[p[0],p[1]-hw*(1-i/pts.length*.75)]),b=pts.map((p,i)=>[p[0],p[1]+hw*(1-i/pts.length*.75)]);S({z,w:.9,t},()=>{for(let i=0;i<pts.length-1;i++)fill([a[i],a[i+1],b[i+1],b[i]],z);line(a);line(b);});};
      limb([[0,28],[60,28],[95,30],[145,50],[218,97],[292,125],[342,142],[408,164],[474,191],[554,233],[605,255]],3.2,5.06);
      limb([[408,164],[440,130],[470,100]],1,5.05);limb([[474,191],[505,168],[540,150]],1,5.05);limb([[554,233],[570,210],[582,185]],.8,5.05);
      /* Lower limbs sit under the leaf cells, so they only show through the gaps; the trunks stand clear below. */
      limb([[145,50],[190,60],[250,48],[300,40]],1.5,4.3,.6);limb([[292,125],[330,100],[375,74],[430,55]],1.4,4.3,.6);limb([[0,230],[60,215],[120,190],[180,165]],2.2,4.3,.6);
      [[[42,812],[50,770],[56,700],[70,640]],[[92,812],[92,770],[110,730],[130,650]],[[172,806],[172,765],[185,720]],[[275,812],[274,765],[255,700]],[[318,818],[316,770],[310,740],[338,690]]].forEach(p=>limb(p,4,1.5,.72));
      limb([[316,770],[290,720],[265,690]],1.5,1.5,.6);limb([[56,700],[100,680],[150,700]],1.6,1.5,.6);}
  }});
