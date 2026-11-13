/* Rowes Wharf from the harbor. Reference: portfolio_refs/boston/02-rowes-wharf-from-harbor.jpg, read at its stored 1920 x 1061.
   Every structure below is drawn in that photo's pixels and cites ref 02, the only picture of this view in the log. Window rows and columns were measured from luminance profiles of the photo.
   The boat looks up from the water, so round towers' floors bow upward by (870-y)/3000 of their radius; 870 is the horizon.
   Log re-check of estimated counts: 6 tall windows above the arch; 10 dormers on the right wing before the white block hides the rest.
   Only Rowes Wharf is named: the log sources no name for any tower. Weights: w 1.6 structure, 1 detail, .6 fine. */
window.PANE_DEFS.push({id:"boston-02",city:"boston",ref:"02",w:1920,h:1061,color:0x7CC0B6,focus:[975,640],
  trace:[[0,885],[0,545],[100,541],[150,548],[150,492],[203,464],[275,472],[278,414],[300,360],[398,373],[400,420],[424,418],[428,383],[488,392],[492,300],[504,100],[530,85],[570,79],[610,80],[640,110],[674,108],[679,119],[674,342],[718,372],[718,386],[760,386],[761,245],[783,221],[784,196],[810,180],[833,175],[856,161],[880,175],[899,180],[927,198],[928,224],[957,240],[958,440],[1029,435],[1062,450],[1062,545],[1103,553],[1103,578],[1152,580],[1157,424],[1248,427],[1250,440],[1413,443],[1419,525],[1450,527],[1450,505],[1530,510],[1555,535],[1558,600],[1581,579],[1556,208],[1600,173],[1648,142],[1763,157],[1776,184],[1808,187],[1840,552],[1867,560],[1920,565],[1920,885]],peak:17,
  expect:{"great arch":1,domes:2,"white boats at piers":4,"pale glazed bay blocks":2,"towers behind":3,"windows above arch":6,"dormers on right wing":10},
  places:[{id:"arch",at:[979,740,-1.5],where:"Rowes Wharf, Downtown",means:""}],
  draw(d){
    const {seg,line,fill,arc,S,mark,rnd}=d,PI=Math.PI,TAU=PI*2;
    const mix=(a,b,u)=>a+(b-a)*u,L=(x0,y0,x1,y1)=>x=>y0+(y1-y0)*(x-x0)/(x1-x0);
    /* A facade is a bilinear map of the unit square, so windows inherit its perspective. */
    const Q=(a,b,c,e)=>(u,v)=>{const x0=mix(a[0],b[0],u),y0=mix(a[1],b[1],u),x1=mix(e[0],c[0],u),y1=mix(e[1],c[1],u);return[mix(x0,x1,v),mix(y0,y1,v)];};
    const R=(x0,x1,y0,y1,s=0)=>Q([x0,y0],[x1,y0+s*(x1-x0)],[x1,y1+s*(x1-x0)],[x0,y1]);
    const sub=(F,u0,u1,v0,v1)=>(u,v)=>F(mix(u0,u1,u),mix(v0,v1,v));
    const poly=(pts,z,w=1.4,t=1,closed=true)=>S({z,w,t},()=>{fill(pts,z);line(pts,{closed});});
    const FL=(F,u0,v0,u1,v1)=>{const a=F(u0,v0),b=F(u1,v1);seg(a[0],a[1],b[0],b[1]);};

    /* A window: fill, frame, reveal, mullions and transoms, sill. c panes across, r down; rv reveal, sl sill; lod sets when the fine parts appear. */
    const win=(F,o={})=>{const z=o.z||0,t=o.t===undefined?.8:o.t,c=o.c||2,r=o.r||1,b=o.lod||0,o4=[F(0,0),F(1,0),F(1,1),F(0,1)];
      S({z,w:o.w||.8,t,lod:b},()=>{fill(o4,z);line(o4,{closed:true});});
      S({z:z+.01,w:.6,t:t*.72,lod:b+.5},()=>{for(let i=1;i<c;i++)FL(F,i/c,0,i/c,1);for(let j=1;j<r;j++)FL(F,0,j/r,1,j/r);});
      if(o.rv)S({z:z+.01,w:.6,t:t*.6,lod:b+.9},()=>{const p=o.rv;line([F(p,p),F(1-p,p),F(1-p,1-p),F(p,1-p)],{closed:true});});
      if(o.sl)S({z:z+.01,w:.7,t:t*.9,lod:b+.3},()=>{const e=o.sl;FL(F,-e,1.14,1+e,1.14);FL(F,-e,1.32,1+e,1.32);FL(F,-e,1.14,-e,1.32);FL(F,1+e,1.14,1+e,1.32);});
      if(o.hd)S({z:z+.01,w:.7,t:t*.9,lod:b+.3},()=>{FL(F,-.1,-.16,1.1,-.16);FL(F,-.1,-.3,1.1,-.3);});};
    /* Lit blinds: short pale rules in about a third of a tower's windows, as the crop shows. */
    const blind=(F,z,t)=>S({z:z+.02,w:.6,t,lod:1.1},()=>{if(rnd()<.35){const n=1+Math.floor(rnd()*3);for(let i=1;i<=n;i++)FL(F,.1,i/(n+1)*.8,.9,i/(n+1)*.8);}});
    /* Brick coursing, then bonded joints close up. */
    const brick=(F,n,m,z,t=.26)=>{S({z,w:.5,t,lod:.5},()=>{for(let j=1;j<n;j++)FL(F,0,j/n,1,j/n);});if(m)S({z,w:.5,t:t*.9,lod:1.5},()=>{for(let j=0;j<n;j++)for(let i=(j%2?.5:0);i<m;i++)FL(F,i/m,j/n,i/m,(j+1)/n);});};
    /* Stepped mouldings along a run: offsets in px below the line. */
    const cornice=(x0,y0,x1,y1,offs,z,t=.85)=>{const T=L(x0,y0,x1,y1);offs.forEach((o,i)=>S({z,w:i===0?1.2:.7,t:i===0?t:t*.72,lod:i===0?0:.2},()=>seg(x0,T(x0)+o,x1,T(x1)+o)));};
    /* Round tower: longitude and silhouette-edge height to photo pixels. */
    const cyl=(cx,Rf)=>(lon,y)=>{const r=Rf(y);return[cx+r*Math.sin(lon),y-r*(870-y)/3000*Math.cos(lon)];};
    const ringArc=(P,y,a=-PI/2,b=PI/2,n=26)=>{const q=[];for(let i=0;i<=n;i++)q.push(P(mix(a,b,i/n),y));line(q);};
    const cylWin=(P,l0,l1,y0,y1)=>Q(P(l0,y0),P(l1,y0),P(l1,y1),P(l0,y1));
    /* A dark pile with its white cap. Ref 02 wharf crops. */
    const pile=(x,yT,yB,z,hw=2.4)=>{S({z,w:1,t:.85},()=>{const q=[[x-hw,yT],[x+hw,yT],[x+hw,yB],[x-hw,yB]];fill(q,z);line(q,{closed:true});});S({z:z+.01,w:.9,t:1},()=>{fill([[x-hw-.6,yT],[x+hw+.6,yT],[x,yT-5]],z+.01);arc(x,yT-1,hw+.6,3.8,PI,TAU,8);seg(x-hw-.6,yT,x+hw+.6,yT);});};
    const globe=(x,y,r,z)=>S({z,w:.9,t:1},()=>{const q=[];for(let i=0;i<12;i++)q.push([x+r*Math.cos(i/12*TAU),y+r*Math.sin(i/12*TAU)]);fill(q,z);line(q,{closed:true});seg(x,y+r,x,y+r+6);});

    /* ---------- Far towers, left. Ref 02 crop x 150-490. ---------- */
    {const z=-6;
      /* Pale office block with banded windows. Ref 02: roof 150,492 203,464 275,472; rows every 10. */
      poly([[150,492],[203,464],[275,472],[277,575],[150,575]],z,1.1,.6);
      S({z:z+.01,w:.8,t:.5},()=>{seg(203,464,203,560);seg(150,500,203,472);seg(203,472,276,480);});
      const lf=Q([150,500],[203,472],[203,566],[150,570]),rf=Q([203,472],[276,480],[276,572],[203,570]);
      for(let j=0;j<8;j++){for(let i=0;i<5;i++)win(sub(lf,(i+.18)/5,(i+.82)/5,(j+.3)/8,(j+.82)/8),{z:z+.02,t:.4,c:2});for(let i=0;i<7;i++)win(sub(rf,(i+.18)/7,(i+.82)/7,(j+.3)/8,(j+.82)/8),{z:z+.02,t:.4,c:2});}
      /* Dark tower with a plain cap and stepped shoulder. Ref 02: cap 300,360 398,373. */
      poly([[300,360],[398,373],[400,412],[298,398]],z,1.2,.75);
      S({z:z+.01,w:.6,t:.32,lod:.4},()=>{const f=Q([300,360],[398,373],[400,412],[298,398]);for(let i=1;i<8;i++)FL(f,i/8,0,i/8,1);for(let j=1;j<3;j++)FL(f,0,j/3,1,j/3);});
      const fr=Q([298,398],[400,412],[402,680],[300,680]),ls=Q([278,414],[298,398],[300,600],[278,600]);
      poly([[298,398],[400,412],[402,680],[300,680]],z,1.2,.72);poly([[278,414],[298,398],[300,600],[278,600]],z-.01,1.1,.65);
      const roof=x=>x<100?541:541+(x-100)*.168;
      for(let j=0;j<20;j++){const v=j/20;S({z:z+.01,w:.6,t:.34},()=>FL(fr,0,v,1,v));for(let i=0;i<6;i++){const F=sub(fr,(i+.16)/6,(i+.84)/6,v+.012,v+.036),c=F(.5,.5);if(c[0]<352&&c[1]>roof(c[0]))continue;win(F,{z:z+.02,t:.4,c:3});}
        for(let i=0;i<2;i++){const F=sub(ls,(i+.15)/2,(i+.85)/2,v+.012,v+.036),c=F(.5,.5);if(c[1]<roof(c[0]))win(F,{z:z+.02,t:.36,c:1});}}
      /* Dark glass tower and its setback. Ref 02: 428,383 488,392, shoulder 400,420. */
      poly([[428,383],[488,392],[490,420],[424,420]],z-.1,1.1,.7);poly([[400,420],[490,420],[490,680],[400,680]],z-.1,1.1,.62);
      S({z:z-.09,w:.6,t:.3},()=>{for(let y=432;y<660;y+=13)seg(400,y,490,y);});for(let y=434;y<655;y+=13)for(let x=403;x<486;x+=13.4)win(R(x,x+9.5,y,y+7),{z:z-.08,t:.36,c:2});S({z:z-.09,w:.5,t:.26,lod:.5},()=>{for(let x=412;x<490;x+=13)seg(x,420,x,660);for(let y=392;y<420;y+=9)seg(430,y,488,y+2);for(let x=440;x<488;x+=12)seg(x,386,x,420);});
    }

    /* ---------- Taller round tower with its slab. Ref 02 crop x 480-680; rows every 15 from y 92, columns at 509 522 536 553 572 591. ---------- */
    {mark("towers behind");const z=-5,Rf=y=>71+.0385*(y-100),P=cyl(575,Rf),rim=[];for(let i=0;i<=30;i++)rim.push(P(-PI/2+i/30*PI*.76,99));
      S({z},()=>fill([[484,640],...rim.slice(0,27),[640,110],[620,120],[620,640]],z));S({z,w:1.6,t:1},()=>line([[484,640],...rim.slice(0,27),[640,110]]));
      S({z,w:.7,t:.5},()=>{ringArc(P,104,-PI/2,.72);ringArc(P,108,-PI/2,.72);});
      S({z:z+.01,w:.9,t:.9},()=>{[[548,80],[568,79],[588,79]].forEach(([x,y])=>seg(x,y,x,y+3));});
      const lons=[-1.29,-1.04,-.79,-.54,-.29,-.04,.21,.46];
      for(let k=0;k<36;k++){const yc=92+k*15.05,yE=yc+71*(870-yc)/3000*1.02;
        S({z:z+.005,w:.6,t:.3},()=>ringArc(P,yE+8,-PI/2,.5,16));
        lons.forEach((l,i)=>{const dl=.1,c=P(l,yE);if(c[1]>445&&c[0]>512)return;const F=cylWin(P,l-dl,l+dl,yE-4.5,yE+4.5);win(F,{z:z+.02,t:.56,c:2,r:1});
          S({z:z+.015,w:.5,t:.3,lod:.9},()=>{const G=cylWin(P,l-dl*1.25,l+dl*1.25,yE-6.5,yE+6.5);line([G(0,0),G(1,0),G(1,1),G(0,1)],{closed:true});});});}
      /* Vertical piers between the bays. */
      S({z:z+.015,w:.5,t:.28,lod:.3},()=>{lons.forEach(l=>{const q=[];for(let y=104;y<448;y+=16)q.push(P(l+.125,y));line(q);});});
      /* The glass parapet and slab. Ref 02: 610,80 to 640,110; slab roof 608,113 to 678,119. */
      S({z:z+.06,w:.5,t:.42,lod:.2},()=>{for(let k=1;k<7;k++)seg(609+k*4.4,84+k*3.8,607,84+k*3.8);for(let k=1;k<6;k++)seg(609+k*2,86,608+k*1.8,110+k*.2);});
      const slab=Q([608,113],[678,119],[672,345],[600,345]);poly([[608,113],[640,110],[674,108],[679,119],[672,345],[600,345]],z+.1,1.5,.95);
      S({z:z+.11,w:.9,t:.7},()=>{seg(641,111,679,119);seg(661,128,657,345);});
      S({z:z+.11,w:.55,t:.34},()=>{for(let j=1;j<15;j++)FL(slab,0,j/15,1,j/15);});
      S({z:z+.11,w:.5,t:.3,lod:.5},()=>{for(let j=1;j<46;j++)FL(slab,0,j/46,1,j/46);for(let i=1;i<18;i++)FL(slab,i/18,0,i/18,1);});
    }

    /* Arch-windowed block between the round towers, and the stub beside it. Ref 02: roof 585,348 680,342 718,372; rows 365 381 398 413. */
    {const z=-4.8;poly([[719,386],[760,386],[762,470],[719,470]],z-.05,1,.6);S({z:z-.04,w:.5,t:.3},()=>{for(let y=398;y<470;y+=12)seg(719,y,762,y);});
      poly([[585,348],[680,342],[718,372],[718,445],[585,445]],z,1.4,.9);S({z:z+.01,w:.9,t:.75},()=>{seg(680,342,680,445);seg(585,353,680,347);seg(680,347,718,377);});
      [357,373,389,405,421].forEach(y=>{[598,616,634,652,670].forEach(x=>{const w=6.5,q=[[x-w,y+11],[x-w,y+3]];for(let i=0;i<=8;i++){const a=PI-i/8*PI;q.push([x+w*Math.cos(a),y+3-w*Math.sin(a)*.9]);}q.push([x+w,y+11]);S({z:z+.02,w:.8,t:.62},()=>{fill(q,z+.02);line(q,{closed:true});});S({z:z+.03,w:.5,t:.42,lod:.6},()=>{seg(x,y-3,x,y+11);seg(x-w,y+4,x+w,y+4);});});
        [686,703].forEach(x=>{const dy=(x-680)*.1;win(R(x-5,x+5,y+dy,y+dy+12),{z:z+.02,t:.5,c:2});});});
      brick(Q([585,353],[680,347],[680,445],[585,445]),30,0,z+.005);}

    /* ---------- Lower round tower with stepped crown. Ref 02 crop x 760-960; rows every 15.7 from y 245, columns every .16 rad. ---------- */
    {mark("towers behind");const z=-4.5,P=cyl(859,()=>98),C=(lon,y)=>[856+72*Math.sin(lon),y-23*Math.cos(lon)];
      const edge=[];for(let i=0;i<=28;i++)edge.push(P(-PI/2+i/28*PI,240));
      poly([[761,600],...edge,[957,600]],z,1.6,1,false);
      /* Crown drum with slots, four windows on the shoulder, battlement and pyramid cap. */
      const rim=[];for(let i=0;i<=24;i++)rim.push(C(-PI/2+i/24*PI,197));
      poly([[784,224],...rim,[928,224]],z+.05,1.5,1,false);
      S({z:z+.055,w:1.2,t:.95},()=>{line([[784,222],[761,242]]);line([[928,224],[957,240]]);ringArc(C,226);});
      S({z:z+.06,w:.8,t:.6},()=>{ringArc(C,201);});
      for(let k=-6;k<=6;k++){const l=k*.235,F=cylWin(C,l-.07,l+.07,205,223);win(F,{z:z+.07,t:.62,c:1,w:.8});S({z:z+.08,w:.6,t:.9},()=>{const a=C(l+.117,197),b=C(l+.117,204);seg(a[0],a[1],b[0],b[1]);});
        S({z:z+.07,w:.5,t:.4,lod:.7},()=>{const a=C(l+.117,205),b=C(l+.117,223);seg(a[0],a[1],b[0],b[1]);});}
      S({z:z+.09,w:1.3,t:1},()=>{fill([[833,177],[856,161],[880,177],[856,184]],z+.09);line([[829,177],[856,161],[884,177]]);});S({z:z+.1,w:.5,t:.45,lod:.5},()=>{for(let k=1;k<6;k++){seg(856-k*4,161+k*2.6,856-k*4,175);seg(856+k*4,161+k*2.6,856+k*4,175);}});
      [816,827,847,858].forEach(x=>win(R(x-4.5,x+4.5,227,237),{z:z+.07,t:.65,c:2,r:2}));
      /* Floors and paired windows. */
      const lons=[];for(let k=-9;k<=9;k++)lons.push(k*.16-.01);
      for(let k=0;k<21;k++){const yc=245+k*15.7,yE=yc+98*(870-yc)/3000;
        S({z:z+.01,w:.55,t:.32},()=>ringArc(P,yE+8.5,-PI/2,PI/2,22));
        lons.forEach(l=>{const F=cylWin(P,l-.052,l+.052,yE-5,yE+5);win(F,{z:z+.02,t:.6,c:2,r:2,lod:0});});
        S({z:z+.015,w:.5,t:.3,lod:1},()=>{lons.forEach((l,i)=>{if(i%2){const a=P(l+.08,yE-7),b=P(l+.08,yE+7);seg(a[0],a[1],b[0],b[1]);}});ringArc(P,yE-6.5,-PI/2,PI/2,22);});}
      /* Pale pilaster strips, every other bay, full height. */
      S({z:z+.015,w:.6,t:.42,lod:.1},()=>{for(let i=1;i<lons.length;i+=2){const q=[];for(let y=262;y<600;y+=18)q.push(P(lons[i]+.08,y));line(q);}});
      /* Pale pier grid at the upper floors, as in the crop. */
      S({z:z+.015,w:.5,t:.3,lod:.7},()=>{for(let i=0;i<lons.length;i+=2){const q=[];for(let y=262;y<600;y+=18)q.push(P(lons[i]+.08,y));line(q);}});
    }

    /* White curved block behind the left hotel tower. Ref 02: 698,420 788,420, step at 795,490. */
    {const z=-4.2;poly([[698,420],[788,420],[788,490],[795,490],[796,590],[698,590]],z,1.3,.85);
      S({z:z+.01,w:.9,t:.7},()=>{seg(698,431,788,431);seg(698,435,788,435);});S({z:z+.01,w:1.3,t:.85},()=>seg(698,420,788,420));
      const rows=[445,463,481,499,517,535,553,571];rows.forEach(y=>{S({z:z+.01,w:.7,t:.55},()=>{line([[754,y-2],[772,y-5],[794,y-1]]);line([[754,y+10],[772,y+7],[794,y+11]]);});S({z:z+.01,w:.5,t:.4,lod:.3},()=>{[758,763,768,773,778,783,788,792].forEach(x=>seg(x,y-4,x,y+9));});});}

    /* ---------- Right-hand far blocks. Ref 02 crop x 960-1250. ---------- */
    {const z=-5.5;
      poly([[960,444],[968,440],[1029,435],[1045,448],[1061,450],[1061,546],[960,546]],z,1.3,.8);S({z:z+.01,w:.8,t:.55},()=>{seg(960,450,1029,444);seg(1029,435,1029,546);});
      for(let j=0;j<7;j++)[966,982,998,1014]/*left face*/.forEach(x=>win(R(x,x+11,453+j*12.2,461+j*12.2,-.04),{z:z+.02,t:.44,c:2}));
      for(let j=0;j<7;j++)[1033,1045].forEach(x=>win(R(x,x+9,456+j*12.2,464+j*12.2,.03),{z:z+.02,t:.4,c:2}));
      poly([[1013,541],[1075,547],[1101,552],[1103,582],[1013,582]],z+.3,1.1,.7);S({z:z+.31,w:.8,t:.55},()=>{seg(1013,546,1075,552);seg(1075,547,1075,582);});
      [1022,1038,1054].forEach(x=>win(R(x,x+11,555,570,.09),{z:z+.32,t:.5,c:3}));[1079,1090].forEach(x=>win(R(x,x+8,560,574),{z:z+.32,t:.44,c:2}));
      /* White curved block. Ref 02: 1157,424 1248,427; green finial 1184,415; faint mast 1235. */
      S({z:z+.4,w:.8,t:.55},()=>{seg(1235,385,1235,425);seg(1231,398,1239,398);});
      poly([[1180,424],[1184,414],[1188,424]],z+.4,.8,.8);
      poly([[1157,424],[1248,427],[1250,590],[1152,590],[1156,490],[1160,490]],z+.45,1.3,.85);
      S({z:z+.46,w:.9,t:.7},()=>{seg(1157,434,1248,437);seg(1157,438,1248,441);seg(1152,490,1200,490);});
      for(let y=446;y<590;y+=15.5){S({z:z+.46,w:.65,t:.5},()=>{const q=[];for(let i=0;i<=8;i++){const x=1155+i*6;q.push([x,y-Math.sin(i/8*PI*.8)*5]);}line(q);});S({z:z+.46,w:.5,t:.4,lod:.3},()=>{for(let x=1159;x<1200;x+=7)seg(x,y-4,x,y+9);});}
      /* Pale gridded block and dark block with its stepped head, right of the hotel. Ref 02: 1418-1450 y 525; 1450,505 1530,510 1555,535. */
      poly([[1418,526],[1450,529],[1450,620],[1418,620]],z,1,.6);for(let j=0;j<6;j++)for(let i=0;i<4;i++)win(R(1421+i*7.3,1426.5+i*7.3,534+j*13,543+j*13),{z:z+.01,t:.42,c:1});
      poly([[1450,505],[1530,510],[1543,530],[1552,535],[1558,620],[1450,620]],z-.1,1.2,.72);S({z:z-.09,w:.8,t:.5},()=>{seg(1482,507,1482,620);seg(1482,520,1537,524);seg(1482,512,1530,516);});
      for(let j=0;j<7;j++)for(let i=0;i<3;i++)win(R(1454+i*9.3,1461+i*9.3,520+j*12.6,529+j*12.6),{z:z-.08,t:.38,c:1});
      S({z:z-.09,w:.55,t:.28},()=>{for(let y=534;y<612;y+=13)seg(1482,y,1553,y);});for(let y=536;y<612;y+=13)for(let x=1486;x<1546;x+=10.2)win(R(x,x+7.2,y,y+8),{z:z-.08,t:.36,c:1});S({z:z-.09,w:.5,t:.24,lod:.5},()=>{for(let x=1492;x<1553;x+=10)seg(x,528,x,612);});}

    /* ---------- Residential slab tower, far right. Ref 02: 1556,208 1600,173 1648,142 1763,157 1808,187 1840,552; floors every 14.8, seven paired bays. ---------- */
    {mark("towers behind");const z=-5.2,lf=Q([1557,207],[1628,172],[1663,600],[1584,600]),rf=Q([1648,142],[1808,187],[1842,600],[1677,600]);
      poly([[1556,208],[1600,173],[1648,142],[1763,157],[1765,173],[1776,174],[1776,184],[1808,187],[1842,600],[1584,600]],z,1.6,1);
      S({z:z+.01,w:1.1,t:.85},()=>{seg(1648,142,1677,600);seg(1628,172,1663,600);seg(1628,172,1648,142);});
      /* Left face: three bays, balconies stacked on its right edge. */
      for(let j=0;j<29;j++){const v=(j+.1)/29,h=.022;S({z:z+.01,w:.5,t:.3},()=>FL(lf,0,v+.03,1,v+.03));
        for(let i=0;i<3;i++){const F=sub(lf,.05+i*.25,.05+i*.25+.2,v,v+h);win(F,{z:z+.02,t:.6,c:2,r:1});blind(F,z,.4);}
        const G=sub(lf,.8,1,v-.003,v+h);S({z:z+.03,w:.8,t:.78},()=>{const q=[G(0,.1),G(.85,0),G(1,.5),G(.85,1),G(0,1)];fill(q,z+.03);line(q,{closed:true});});S({z:z+.04,w:.5,t:.5,lod:.8},()=>{FL(G,.05,.5,.92,.5);FL(G,.3,.1,.3,1);FL(G,.6,.1,.6,1);});}
      /* The roofline's plain corner glazing. */
      S({z:z+.02,w:.5,t:.4,lod:.3},()=>{for(let k=1;k<5;k++){seg(1557+k*15,207-k*7,1557+k*15,195-k*2+k*5);}});
      /* Right face. */
      S({z:z+.015,w:.8,t:.55},()=>{FL(rf,.89,.03,.89,1);});
      for(let j=0;j<28;j++){const v=(j+.42)/29;S({z:z+.01,w:.5,t:.28},()=>FL(rf,0,v+.024,.89,v+.024));
        for(let i=0;i<7;i++){const a=.03+i*.122,F=sub(rf,a,a+.098,v,v+.021);win(F,{z:z+.02,t:.6,c:2,r:1});blind(F,z,.42);}
        S({z:z+.02,w:.65,t:.7},()=>{const G=sub(rf,.89,.93,v-.003,v+.021);line([G(0,0),G(1,0),G(1,1),G(0,1)],{closed:true});});}
      S({z:z+.012,w:.5,t:.26,lod:.8},()=>{for(let i=1;i<7;i++){const a=.03+i*.122-.012;FL(rf,a,.03,a,1);}});
    }

    /* ---------- Hotel: two brick towers, the rear wings, a shared attic of tan panels. Ref 02 crops; window centres from the luminance profile. ---------- */
    {const z=-3;
      /* Hotel left tower. Ref 02: roof 525,442 719,437, stepping back through 754,454 762,500 774,576. */
      S({z},()=>fill([[525,442],[719,437],[754,454],[762,500],[766,541],[766,582],[516,582],[520,520]],z));S({z,w:1.6,t:1},()=>line([[516,582],[520,520],[525,442],[719,437],[744,437],[754,454],[754,500],[762,500],[762,541],[766,541],[766,578]]));
      S({z},()=>fill([[516,578],[880,578],[880,815],[516,815]],z));
      /* Right hotel tower. Ref 02: roof 1200,443 1229,437 1413,443 1424,600. */
      poly([[1200,443],[1229,437],[1413,443],[1419,525],[1426,620],[1184,620],[1189,483],[1197,483]],z,1.6,1);
      S({z},()=>fill([[1060,582],[1426,582],[1426,835],[1060,835]],z));
      S({z:z+.005,w:1.1,t:.9},()=>{cornice(525,448,719,443,[0,3,6],z+.01);cornice(1200,449,1413,449,[0,3,6],z+.01);seg(1190,484,1198,484);
        /* Roof rail, right tower. */
        S({w:.5,t:.5,lod:.2},()=>{seg(1236,433,1412,437);for(let x=1238;x<1412;x+=11)seg(x,433,x,439);});});
      /* The tan attic panels, 6 left and 7 right. Ref 02 at y 459-482. */
      const panel=(x,y0,y1,w)=>{const a=z+.02;S({z:a,w:1.1,t:.85},()=>{const q=[[x-w,y0],[x+w,y0],[x+w,y1],[x-w,y1]];fill(q,a);line(q,{closed:true});});S({z:a+.01,w:.7,t:.62},()=>{line([[x-w+3.5,y0+3],[x+w-3.5,y0+3],[x+w-3.5,y1-3],[x-w+3.5,y1-3]],{closed:true});seg(x,y0+3,x,y1-3);});S({z:a+.01,w:.5,t:.42,lod:.7},()=>{seg(x-w+3.5,y0+3,x-w+6,y0+6);seg(x+w-3.5,y0+3,x+w-6,y0+6);seg(x-w+6,y0+6,x+w-6,y0+6);seg(x-w+3.5,mix(y0,y1,.5),x+w-3.5,mix(y0,y1,.5));S({t:.42},()=>{seg(x-w-4,y0-3,x+w+4,y0-3);seg(x-w-4,y1+3,x+w+4,y1+3);});});};
      [543,580,617,655,690,727].forEach(x=>panel(x,459,482,12));[1221,1251,1280,1309,1338,1367,1396].forEach(x=>panel(x,458,482,11));
      /* Window rows. Each sits in a brick reveal with a stone sill and lintel. */
      const W=(x,y,w,h,t,zz=z+.02)=>win(R(x-w,x+w,y-h,y+h),{z:zz,t,c:2,r:2,rv:.14,sl:.1,hd:1,lod:.3,w:.9});
      const rowsL=[497,518,537,557,577,597,618,641,664,688,713,738,762],colsL=[540,564,590,616,642,667,692,718,746,773,800,828,855],hL=[6.5,6.5,7,7,7,7,7.5,7.5,8,8,8,8,8];
      rowsL.forEach((y,j)=>colsL.forEach(x=>{if(y<560&&x>725)return;if(y<500&&(x>700))return;if(y<585&&x>740)return;W(x,y,8.5,hL[j],.66);}));
      /* Left tower's own brick, with bond close up, and the band courses between floors. */
      brick(Q([520,452],[745,452],[745,578],[520,578]),30,45,z+.005);brick(R(516,878,578,812),80,0,z+.005);
      S({z:z+.01,w:.6,t:.42},()=>{[508,527,547,567,586,608,629,652,676,701,726,750].forEach(y=>seg(516,y,y<570?755:872,y));});
      const rowsR=[497,518,537,557,575,592],colsR=[1231,1255,1281,1306,1331,1356,1381,1405];
      rowsR.forEach(y=>colsR.forEach(x=>W(x,y,8.5,y<500?6:7,.66)));
      brick(R(1200,1419,452,612),30,50,z+.005);
      S({z:z+.01,w:.6,t:.42},()=>{[508,527,547,566,583].forEach(y=>seg(1190,y,1420,y));});
      /* The right tower's left stub, windows from the crop. */
      [[1205,518],[1205,537],[1205,557]].forEach(([x,y])=>W(x,y,7,7,.6));
      /* Lower right wing below the sky line, seen past the white block. Ref 02 crop x 1330-1426. */
      [612,635,660,685,710,735,760].forEach(y=>[1340,1362,1384,1406].forEach(x=>W(x,y,8,7.5,.46)));
      brick(R(1330,1426,600,835),60,0,z+.005,.2);
      /* Roof ridges beside the flat dome and the short rear-wing windows. Ref 02: green coping y 574-580. */
      S({z:z+.02,w:1.3,t:.9},()=>{line([[774,578],[830,573],[897,573]]);line([[1054,574],[1128,580],[1190,584]]);});
      S({z:z+.02,w:.7,t:.6},()=>{seg(830,577,897,577);seg(1054,578,1128,584);});
      [1072,1096,1120,1144,1168].forEach(x=>win(R(x-8,x+8,590,604),{z:z+.02,t:.62,c:2,rv:.14}));
    }

    /* ---------- The arch block: flat dome, drum, loggia, six tall windows, the great arch. Ref 02 crop x 840-1130. ---------- */
    {const z=-2,bx=[867,1090];mark("domes");
      /* The saucer dome and small cap. Seen from below, so its rim bows upward: edges 897,571 and 1056,572, front 976,553; crown 952,542 to 997,542. Ref 02 crop. */
      const curve=(f,n=40)=>{const q=[];for(let i=0;i<=n;i++)q.push(f(i/n));return q;},rim=dy=>curve(u=>[mix(897,1056,u),572+dy-19*Math.sin(u*PI)**.62]),crown=curve(u=>[mix(897,1056,u),572-30*Math.sin(u*PI)**.5]);
      poly([[955,543],[965,537],[975,533],[986,537],[997,543]],z+.05,1.1,.9,false);
      S({z:z+.06,w:.5,t:.42,lod:.5},()=>{for(let x=959;x<996;x+=4)seg(x,537+Math.abs(x-975)*.22,x,543);seg(960,539,991,539);});
      /* Drum: fill first, then the small square windows that follow the rim. */
      poly([[900,566],[1052,566],[1050,590],[902,590]],z-.01,1.1,.85);
      [914,925,938,954,970,986,1002,1016,1029,1042].forEach(x=>win(R(x-2.6,x+2.6,567,573),{z:z+.015,t:.72,c:1,w:.7}));
      S({z:z+.005,w:.45,t:.3,lod:.6},()=>{for(let y=576;y<590;y+=3.4)seg(901,y,1051,y);});
      S({z:z+.02},()=>fill([...crown,...rim(0).reverse()],z+.02));
      S({z:z+.03,w:1.7,t:1},()=>line(crown));S({z:z+.03,w:1.5,t:1},()=>line(rim(0)));S({z:z+.03,w:.9,t:.8},()=>{line(rim(-3));line(rim(-7));line(rim(2.5));});
      S({z:z+.03,w:.55,t:.42,lod:.2},()=>{for(let k=1;k<36;k++){const u=k/36,x=mix(897,1056,u),a=572-30*Math.sin(u*PI)**.5,b=572-7-19*Math.sin(u*PI)**.62;seg(x,a,mix(976.5,x,1.04),b);}});
      S({z:z+.03,w:.5,t:.34,lod:.8},()=>{for(let v=.25;v<.9;v+=.2){const q=curve(u=>{const a=572-30*Math.sin(u*PI)**.5,b=572-7-19*Math.sin(u*PI)**.62;return[mix(897,1056,u),mix(a,b,v)];},30);line(q);}});
      /* Upper storey: body top, loggia glazing of 4 bays. Ref 02: x 940-1015, y 585-614. */
      poly([[867,590],[1090,590],[1090,840],[867,840]],z-.02,1.5,1);
      S({z:z,w:.9,t:.8},()=>{cornice(867,590,1090,590,[0,3],z,.9);cornice(867,616,1090,616,[0,3,6],z,.85);});
      S({z:z+.02,w:1,t:.85},()=>{const q=[[940,588],[1015,588],[1015,614],[940,614]];fill(q,z+.02);line(q,{closed:true});[958,977,996].forEach(x=>S({w:1,t:.85},()=>seg(x,588,x,614)));seg(940,599,1015,599);});
      S({z:z+.03,w:.6,t:.55},()=>{for(let x=940+4.7;x<1015;x+=4.7)seg(x,589,x,613);seg(940,593,1015,593);seg(940,607,1015,607);});
      /* Flanking short windows of the loggia storey. */
      [881,906,1045,1067].forEach(x=>win(R(x-9,x+9,594,608),{z:z+.02,t:.72,c:2,rv:.14}));
      /* Six tall windows. Ref 02 centres 910 938 966 993 1021 1048, y 627-669; twin panes, three lights. */
      [910,938,966,993,1021,1048].forEach(x=>{mark("windows above arch");win(R(x-8,x+8,627,669),{z:z+.02,t:1,c:2,r:3,rv:.1,w:1.1,lod:0});S({z:z+.03,w:.8,t:.8},()=>{seg(x-10,625,x+10,625);seg(x-10,671,x+10,671);seg(x-10,674,x+10,674);seg(x-10,671,x-10,674);seg(x+10,671,x+10,674);});});
      /* Two small pale windows at the block's corners. */
      [880,1078].forEach(x=>win(R(x-7,x+7,629,642),{z:z+.02,t:.9,c:2,r:2,rv:.12}));
      /* Sawn stone: long courses, joints close up. */
      S({z:z+.005,w:.5,t:.3,lod:.3},()=>{for(let y=621;y<770;y+=6.2)seg(867,y,1090,y);});
      S({z:z+.005,w:.45,t:.26,lod:1.1},()=>{for(let v=0,y=621;y<770;y+=6.2,v++)for(let x=867+(v%2?7:0);x<1090;x+=14)seg(x,y,x,y+6.2);});
      S({z:z+.006,w:.5,t:.34,lod:.3},()=>{for(let y=772;y<840;y+=11){seg(867,y,922,y);seg(1036,y,1090,y);}});
      /* Corner quoins and tiny lit squares in the piers. Ref 02 crop at x 880, 1078 down y 680-720. */
      [[880,686],[880,709],[1078,686],[1078,709]].forEach(([x,y])=>win(R(x-3.5,x+3.5,y-4,y+4),{z:z+.02,t:.65,c:1}));
      /* The rectangular panel the arch sits in. Ref 02: x 890-1069, y 683, down to y 763, then the string course. */
      const zA=z+.05;
      S({z:zA,w:1.1,t:.9},()=>{line([[890,764],[890,683],[1069,683],[1069,764]]);seg(893,686,1066,686);seg(893,686,893,764);seg(1066,686,1066,764);});
      S({z:zA,w:1.2,t:.95},()=>{seg(867,764,902,764);seg(1057,764,1090,764);seg(867,769,902,769);seg(1057,769,1090,769);});
      /* Five stepped rings and voussoirs of the arch. Centre 979,768; opening radius 57, outer radius 78. */
      mark("great arch");const cx=979,cy=768,ring=(r,w,t,zz)=>{const q=[];for(let i=0;i<=56;i++){const a=PI-i/56*PI;q.push([cx+r*Math.cos(a),cy-r*Math.sin(a)]);}S({z:zz,w,t},()=>line(q));};
      {const q=[];for(let i=0;i<=56;i++){const a=PI-i/56*PI;q.push([cx+78*Math.cos(a),cy-78*Math.sin(a)]);}S({z:zA+.01},()=>{fill([[cx-78,840],...q,[cx+78,840]],zA+.01);});}
      ring(78,1.7,1,zA+.02);ring(75,.8,.65,zA+.02);ring(70,1.1,.82,zA+.02);ring(66,.7,.6,zA+.02);ring(60,1.1,.85,zA+.02);ring(57,1.7,1,zA+.02);
      S({z:zA+.02,w:.6,t:.55},()=>{for(let i=1;i<40;i++){const a=PI*i/40;seg(cx+70*Math.cos(a),cy-70*Math.sin(a),cx+75*Math.cos(a),cy-75*Math.sin(a));}});
      S({z:zA+.02,w:.6,t:.5,lod:.3},()=>{for(let i=1;i<60;i++){const a=PI*i/60;seg(cx+60*Math.cos(a),cy-60*Math.sin(a),cx+66*Math.cos(a),cy-66*Math.sin(a));}});
      S({z:zA+.02,w:.5,t:.42,lod:.9},()=>{for(let i=1;i<20;i++){const a=PI*i/20;for(let r=61;r<66;r+=2.5){const q=[];for(let k=0;k<=2;k++){const an=a-PI/60+k*PI/60/2;q.push([cx+r*Math.cos(an),cy-r*Math.sin(an)]);}line(q);}}});
      /* Keystone. */
      S({z:zA+.03,w:1,t:.95},()=>{const q=[[cx-5,cy-81],[cx+5,cy-81],[cx+3,cy-57],[cx-3,cy-57]];fill(q,zA+.03);line(q,{closed:true});});
      /* Piers below the springing. */
      S({z:zA+.02,w:1.4,t:1},()=>{seg(cx-78,cy,cx-78,840);seg(cx+78,cy,cx+78,840);seg(cx-57,cy,cx-57,840);seg(cx+57,cy,cx+57,840);seg(cx-80,cy,cx-54,cy);seg(cx+54,cy,cx+80,cy);seg(cx-80,cy+4,cx-54,cy+4);seg(cx+54,cy+4,cx+80,cy+4);});
      S({z:zA+.02,w:.5,t:.36,lod:.3},()=>{for(let y=778;y<840;y+=7){seg(cx-78,y,cx-57,y);seg(cx+57,y,cx+78,y);}});
      /* Inside the arch: the soffit receding, then a far building, the hanging banner, lamps. Ref 02 crop. */
      const zI=zA+.015;
      S({z:zI,w:.6,t:.42},()=>{for(let i=1;i<14;i++){const a=PI*i/14;seg(cx+57*Math.cos(a),cy-57*Math.sin(a),cx+50*Math.cos(a),cy-49*Math.sin(a));}const q=[];for(let i=0;i<=30;i++){const a=PI-i/30*PI;q.push([cx+50*Math.cos(a),cy-49*Math.sin(a)]);}line(q);seg(cx-50,cy,cx-50,830);seg(cx+50,cy,cx+50,830);});
      S({z:zI,w:.5,t:.3,lod:.5},()=>{for(let r=52;r<57;r+=2){const q=[];for(let i=0;i<=24;i++){const a=PI-i/24*PI;q.push([cx+r*Math.cos(a),cy-r*.98*Math.sin(a)]);}line(q);}});
      [[947,727],[947,745],[947,763],[959,727],[959,745],[959,763]].forEach(([x,y])=>win(R(x-3.5,x+3.5,y-6,y+6),{z:zI,t:.48,c:1}));
      S({z:zI,w:.5,t:.3},()=>{seg(940,716,940,830);seg(968,716,968,830);});
      S({z:zI+.001,w:.8,t:.55},()=>{line([[967,722],[974,735],[978,752],[984,772]]);line([[986,730],[992,745],[997,762],[1002,778]]);seg(967,722,986,730);seg(984,772,1002,778);S({w:.5,t:.42,lod:.3},()=>{line([[973,725],[979,740],[983,757],[990,774]]);line([[980,728],[986,743],[990,760],[996,776]]);});});
      [[952,798],[1013,798]].forEach(([x,y])=>S({z:zI,w:.7,t:.72},()=>{seg(x,y,x,830);seg(x-5,y+3,x+5,y+3);arc(x,y-1,1.6,1.6,0,TAU,8);arc(x-5,y+4,1.2,1.2,0,TAU,6);arc(x+5,y+4,1.2,1.2,0,TAU,6);}));
      /* Ground beyond the arch. */
      S({z:zI,w:.6,t:.5},()=>{seg(922,830,1036,830);for(let k=0;k<26;k++){const x=926+rnd()*106;seg(x,826+rnd()*3,x,831);}});
    }

    /* ---------- Warehouse block, far left, shaded after x 100. Ref 02: roof 0,545 100,541 352,584; columns 12 27 44 62 78, then groups to 327. ---------- */
    {const z=-1.6,roof=x=>x<100?545-(x)*.04:541+(x-100)*.171;
      poly([[0,545],[100,541],[352,584],[352,835],[0,835]],z,1.6,.95);
      S({z:z+.01,w:1,t:.8},()=>{seg(0,552,100,548);seg(100,548,352,591);seg(100,541,100,835);seg(0,566,100,563);});
      S({z:z+.01,w:.55,t:.4,lod:.3},()=>{for(let x=8;x<352;x+=8){seg(x,roof(x),x,roof(x)+7);}});
      /* Sunlit bays: pale-framed window pairs. */
      for(let j=0;j<8;j++){const y=590+j*29.6;[6,21,44,62,78].forEach((x,i)=>{const F=R(x,x+(i<2?11:12),y,y+21);win(F,{z:z+.02,t:.86,c:2,r:3,rv:.08,w:1,sl:.05});S({z:z+.015,w:.7,t:.5},()=>{line([[x-2.5,y-3],[x+(i<2?13.5:14.5),y-3],[x+(i<2?13.5:14.5),y+24],[x-2.5,y+24]],{closed:true});});});}
      /* Shaded side, four storeys of tall grouped windows up to the roofline. */
      const xs=[108,121,134,160,173,186,212,225,238,264,277,290,316,329,342];
      for(let j=0;j<9;j++){const y=566+j*29.6;xs.forEach(x=>{if(y<roof(x)+16)return;win(R(x,x+9,y,y+20),{z:z+.02,t:.5,c:1,r:3});});}
      brick(R(100,352,590,835),40,0,z+.005,.2);brick(R(0,100,565,835),44,0,z+.005,.22);
      /* Masonry piers between sunlit bays. */
      S({z:z+.01,w:.8,t:.6},()=>{[38,96].forEach(x=>seg(x,566,x,835));});
      /* Roof clutter at left: a crane boom and vent. Ref 02 at 22,540 and 110,538. */
      S({z,w:.6,t:.5},()=>{seg(22,545,22,538);seg(112,538,125,533);seg(120,540,132,534);});
    }

    /* ---------- Teal glazed roof and its brick building. Ref 02: glass 202,677 397,671 397,691 202,696; 14 window columns. ---------- */
    {const z=-1.4;
      poly([[245,652],[292,652],[292,674],[245,674]],z-.05,1,.75);S({z:z-.04,w:.6,t:.5},()=>{seg(245,658,292,658);seg(265,658,265,674);});
      poly([[352,650],[440,655],[440,762],[352,762]],z-.08,1,.55);[[405,745],[420,745]].forEach(([x,y])=>win(R(x,x+9,y,y+10),{z:z-.07,t:.5,c:2}));
      S({z},()=>fill([[175,696],[418,690],[418,835],[175,835]],z));S({z,w:1.2,t:.85},()=>{seg(175,696,202,696);seg(397,691,418,690);seg(418,690,418,760);seg(175,696,175,835);});
      const g=Q([202,677],[397,671],[397,691],[202,696]);poly([[202,677],[397,671],[397,691],[202,696]],z+.01,1.4,1);
      S({z:z+.02,w:.75,t:.72},()=>{for(let i=1;i<22;i++)FL(g,i/22,0,i/22-.015,1);FL(g,0,.5,1,.5);});
      S({z:z+.02,w:.5,t:.45,lod:.8},()=>{for(let i=0;i<22;i++)FL(g,(i+.5)/22,0,(i+.5)/22-.015,1);FL(g,0,.25,1,.25);FL(g,0,.75,1,.75);});
      [707,728,755,783].forEach((y,j)=>{for(let i=0;i<14;i++){const x=188+i*15.2,sl=rnd()<.5;win(R(x,x+9,y,y+(j>1?16:13)),{z:z+.02,t:j<2?.66:.5,c:2,r:2,sl:.05,hd:0,rv:.12});}});
      brick(R(175,418,698,835),44,0,z+.005,.2);
      S({z:z+.01,w:.6,t:.42},()=>{[699,723,748,776,806].forEach(y=>seg(176,y,418,y));});
    }

    /* ---------- Low hotel wing, base of the left bay block, tall ground windows. Ref 02 crop y 760-860. ---------- */
    {const z=-1.2;
      S({z},()=>fill([[390,758],[700,758],[700,862],[390,862]],z));S({z,w:1.2,t:.9},()=>{seg(390,758,690,758);seg(390,758,390,862);});
      [405,430,458,485,510,535,560,590,615,640,665].forEach(x=>win(R(x-8,x+8,772,793),{z:z+.02,t:.72,c:2,r:3,rv:.12,w:.9,hd:1}));
      cornice(390,795,700,795,[0,3,6],z+.01,.85);S({z:z+.01,w:.6,t:.42},()=>{for(let x=398;x<700;x+=26)seg(x,801,x,862);});S({z:z+.01,w:.5,t:.3,lod:.3},()=>{for(let y=808;y<862;y+=8)seg(390,y,700,y);});
      brick(R(390,700,762,794),12,70,z+.005,.24);
      /* Brown stone wing stepping away right of the bay block. Ref 02: 570,650 640,668; windows 582-640. */
      poly([[570,648],[640,668],[640,762],[545,762],[545,700],[570,700]],z-.02,1.1,.7);S({z:z-.01,w:.7,t:.5},()=>{seg(570,653,640,673);});
      [[582,662],[604,670],[622,676],[582,690],[604,694],[622,700],[556,716],[580,716],[604,718],[622,720],[556,738],[580,738],[604,740],[622,742]].forEach(([x,y])=>win(R(x,x+11,y,y+15,.14),{z:z,t:.5,c:2,r:2}));brick(R(545,640,672,762),26,0,z-.005,.22);
    }

    /* ---------- Pale glazed bay block, left. Ref 02 crop x 418-570, y 626-760: pyramid roof, attic, three storeys of glass, wrapping balconies. ---------- */
    {const z=-1;mark("pale glazed bay blocks");
      poly([[438,641],[490,629],[510,626],[548,640],[570,646]],z+.03,1.5,1);
      S({z:z+.031,w:.5,t:.45,lod:.4},()=>{for(let k=1;k<10;k++){seg(438+k*13.2,641+k*.5,mix(438,510,k/10),mix(641,626,k/10));}});
      poly([[438,641],[570,646],[569,660],[569,678],[438,678]],z,1.5,1);
      S({z:z+.01,w:.8,t:.75},()=>{seg(438,655,568,658);seg(445,658,568,661);});
      S({z},()=>{fill([[418,678],[569,678],[566,700],[548,700],[548,760],[418,760]],z);});
      S({z,w:1.5,t:1},()=>{seg(418,678,438,678);seg(418,678,418,760);seg(418,760,548,760);seg(569,680,566,700);seg(566,700,548,705);seg(548,705,548,760);});
      /* Glass bands: floor plates, slabs, mullions. */
      const band=(y0,y1,xs,sl,tb)=>{const a=z+.01;S({z:a,w:1,t:.85},()=>{seg(xs[0],y0,xs[xs.length-1],y0+sl);seg(xs[0],y1,xs[xs.length-1],y1+sl);});S({z:a,w:.9,t:.82},()=>xs.forEach((x,i)=>{const yy=mix(y0,y0+sl,i/(xs.length-1));seg(x,yy,x,yy+(y1-y0));}));S({z:a,w:.6,t:.66,lod:.1},()=>{for(let i=0;i<xs.length-1;i++){const m=(xs[i]+xs[i+1])/2,yy=mix(y0,y0+sl,i/(xs.length-1));seg(m,yy,m,yy+(y1-y0));}});
        S({z:a,w:.55,t:.5},()=>{seg(xs[0],y0+(y1-y0)*.68,xs[xs.length-1],y0+(y1-y0)*.68+sl);});S({z:a,w:.5,t:.4,lod:.7},()=>{for(let x=xs[0];x<xs[xs.length-1];x+=2.7){const u=(x-xs[0])/(xs[xs.length-1]-xs[0]);seg(x,y0+(y1-y0)*.74+sl*u,x,y1+sl*u);}});};
      band(660,678,[447,462,476,490,503,517,531,545,556,568],2,1);band(684,700,[420,437,450,463,478,498,516,531,548,558,567],0,1);band(712,732,[420,436,449,463,478,498,526,540,548],0,1);band(740,758,[420,436,449,463,478,498,528,546],0,1);
      /* Balcony slabs. Each is two lines with its thickness. */
      [[418,568,680,683],[420,560,701,705],[420,548,708,711],[420,548,733,737]].forEach(([a,b,y0,y1])=>S({z:z+.02,w:1.1,t:1},()=>{const q=[[a,y0],[b,y0],[b,y1],[a,y1]];fill(q,z+.02);line(q,{closed:true});}));
      /* Open sash in the top glass bands. Ref 02 at 460,690 and 490,722. */
      [[455,685,462,700],[474,717,497,730]].forEach(([a,y0,b,y1])=>S({z:z+.015,w:.8,t:.9},()=>{const q=[[a,y0],[b,y0],[b,y1],[a,y1]];line(q,{closed:true});seg((a+b)/2,y0,(a+b)/2,y1);}));
    }

    /* ---------- Small copper dome on its kiosk. Ref 02 crop x 690-810: lantern top 703, dome 706-790 base 767, cornice 771-779, two storeys of glazed piers. ---------- */
    {const z=-.6,cx=750;mark("domes");
      const q=[];for(let i=0;i<=36;i++){const a=PI-i/36*PI;q.push([cx+42.5*Math.cos(a),768-46*Math.pow(Math.sin(a),.92)]);}
      poly(q,z,1.6,1,false);
      S({z:z+.01,w:.6,t:.55},()=>{for(let k=-7;k<=7;k++){if(!k)continue;const l=k/8*PI/2,r=[];for(let i=0;i<=12;i++){const lat=i/12*PI/2*.96;r.push([cx+42.5*Math.sin(l)*Math.cos(lat),768-46*Math.sin(lat)]);}line(r);}});
      S({z:z+.01,w:.5,t:.34,lod:.5},()=>{for(let j=1;j<7;j++){const lat=j/7*PI/2,r=[];for(let i=0;i<=20;i++){const l=-PI/2+i/20*PI;r.push([cx+42.5*Math.sin(l)*Math.cos(lat),768-46*Math.sin(lat)+Math.cos(l)*1.5*Math.cos(lat)]);}line(r);}});
      S({z:z+.01,w:.5,t:.3,lod:1.2},()=>{for(let k=-15;k<=15;k+=1){if(k%2===0)continue;const l=k/16*PI/2,r=[];for(let i=0;i<=8;i++){const lat=i/8*PI/2*.8;r.push([cx+42.5*Math.sin(l)*Math.cos(lat),768-46*Math.sin(lat)]);}line(r);}});
      /* Lantern. */
      {const a=[[745,723],[745,710]];for(let i=0;i<=10;i++){const an=PI-i/10*PI;a.push([751.5+6.5*Math.cos(an),710-7*Math.sin(an)]);}a.push([758,723]);poly(a,z+.02,1.2,1);S({z:z+.03,w:.6,t:.6},()=>{seg(743,721,760,721);seg(751.5,703,751.5,721);seg(745,712,758,712);});}
      /* Cornice, drum base. */
      poly([[704,768],[796,768],[796,772],[704,772]],z+.02,1.1,.95);poly([[694,773],[806,773],[808,780],[692,780]],z+.02,1.4,1);S({z:z+.03,w:.6,t:.6},()=>{seg(693,776,807,776);});
      S({z:z+.03,w:.5,t:.45,lod:.5},()=>{for(let x=696;x<806;x+=3.4)seg(x,776,x,779.5);});
      poly([[695,780],[806,780],[810,852],[691,852]],z,1.4,.95);
      S({z:z+.01,w:1.1,t:.85},()=>{seg(693,800,808,800);seg(691,804,810,804);seg(693,808,808,808);seg(691,852,810,852);});
      /* Two storeys of bays between piers. Ref 02 upper y 783-798, lower y 811-850. */
      const piers=[698,716,738,760,782,804];S({z:z+.01,w:1,t:.85},()=>piers.forEach(x=>{seg(x,780,x,800);seg(x,808,x,852);seg(x+4,780,x+4,800);seg(x+4,808,x+4,852);}));
      for(let i=0;i<piers.length-1;i++){const a=piers[i]+6,b=piers[i+1]-2;win(R(a,b,783,798),{z:z+.02,t:.75,c:3,r:2,w:.9});win(R(a,b,811,850),{z:z+.02,t:.8,c:3,r:5,rv:.05,w:.9});}
      S({z:z+.02,w:.6,t:.6},()=>{for(let i=0;i<piers.length;i++){const x=piers[i]+2;arc(x,806,2,2,0,TAU,6);}});
      /* The wall right of the kiosk with its large window and blue awning. Ref 02: 820-840 y 780-790; awning y 815-825. */
      S({z:z-.05},()=>fill([[806,770],[867,770],[867,850],[806,850]],z-.05));win(R(818,842,778,791),{z:z-.04,t:.7,c:3,r:2,rv:.08});win(R(818,860,795,810),{z:z-.04,t:.7,c:5,r:1,rv:.05});
      S({z:z-.03,w:.9,t:.75},()=>{line([[815,825],[825,816],[854,816],[862,825]],{closed:true});});S({z:z-.03,w:.5,t:.5,lod:.5},()=>{for(let x=828;x<854;x+=4)seg(x,816,x-.8,825);});
      /* Globe lamps. Ref 02 at 687,811 737,811 795,810 810,809 823,811. */
      [[687,811],[737,811],[795,810],[810,809],[823,811],[780,828],[835,830]].forEach(([x,y])=>globe(x,y,2.8,z+.05));
    }

    /* ---------- Pale glazed bay block, right, with its brick and stone base. Ref 02 crop x 1190-1330. ---------- */
    {const z=-1;mark("pale glazed bay blocks");
      /* Stone base: ground floor piers and glass. Ref 02: y 779-848, x 1180-1400. */
      S({z},()=>fill([[1180,740],[1400,740],[1400,850],[1180,850]],z));S({z,w:1.2,t:.9},()=>{seg(1400,740,1400,850);seg(1180,740,1400,740);});
      [[1187,1205],[1235,1250],[1268,1283],[1300,1312],[1323,1336],[1353,1366]].forEach(([a,b])=>win(R(a,b,757,777),{z:z+.02,t:.86,c:2,r:2,rv:.1,w:1,hd:1,sl:.05}));
      brick(R(1180,1400,742,778),12,74,z+.005,.24);
      cornice(1180,780,1400,780,[0,3,6,10],z+.01,.9);
      [1185,1208,1250,1296,1344,1372].forEach(x=>S({z:z+.02,w:1,t:.85},()=>{const q=[[x-5,790],[x+5,790],[x+6,850],[x-6,850]];fill(q,z+.02);line(q,{closed:true});}));
      S({z:z+.025,w:.5,t:.4,lod:.5},()=>{[1185,1208,1250,1296,1344,1372].forEach(x=>{for(let y=796;y<850;y+=6)seg(x-5,y,x+5,y);});});
      S({z:z+.01,w:.7,t:.55},()=>{[[1214,1244],[1256,1290],[1302,1338],[1350,1366]].forEach(([a,b])=>{line([[a,794],[b,794],[b,848],[a,848]],{closed:true});for(let x=a+(b-a)/4;x<b-1;x+=(b-a)/4)seg(x,794,x,848);seg(a,812,b,812);seg(a,830,b,830);});});
      /* Roof and glass. */
      poly([[1193,600],[1248,581],[1300,596],[1305,606]],z+.03,1.5,1);
      S({z:z+.031,w:.5,t:.45,lod:.4},()=>{for(let k=1;k<10;k++)seg(1193+k*11.2,600+k*.6,mix(1205,1290,k/10),mix(590,590,k/10));});
      S({z},()=>fill([[1191,600],[1305,606],[1326,630],[1330,700],[1330,740],[1206,740],[1190,690],[1191,640]],z));
      S({z,w:1.6,t:1},()=>{line([[1193,600],[1191,640],[1190,682],[1206,716],[1206,740],[1330,740],[1330,700],[1326,632],[1305,632],[1305,606]]);});
      const bow=(y,a,b,h)=>{const q=[];for(let i=0;i<=12;i++){const u=i/12;q.push([mix(a,b,u),y-Math.sin(u*PI)*h]);}return q;};
      [[612,1195,1305,3],[636,1192,1326,4],[641,1192,1326,4],[672,1190,1330,3],[678,1192,1330,3],[708,1202,1330,2],[714,1204,1330,2],[738,1206,1330,0]].forEach(([y,a,b,h])=>S({z:z+.01,w:1,t:.88},()=>line(bow(y,a,b,h))));
      /* Mullions and the narrower middle sash. */
      const rows=[[644,668,[1195,1213,1236,1258,1280,1303,1322]],[680,705,[1195,1218,1240,1262,1285,1305,1327]],[716,738,[1208,1225,1245,1266,1287,1306,1327]]];
      rows.forEach(([a,b,xs])=>{S({z:z+.01,w:.85,t:.78},()=>xs.forEach(x=>seg(x,a-2,x,b)));S({z:z+.01,w:.6,t:.66,lod:.1},()=>{for(let i=0;i<xs.length-1;i++){const m=(xs[i]+xs[i+1])/2;seg(m,a-2,m,b);}});S({z:z+.01,w:.55,t:.5},()=>{const q=bow(a+(b-a)*.68,xs[0],xs[xs.length-1],2);line(q);});S({z:z+.01,w:.5,t:.4,lod:.7},()=>{for(let x=xs[0];x<xs[xs.length-1];x+=2.7)seg(x,a+(b-a)*.74,x,b);});});
      /* Top window group. Ref 02: x 1240-1290, y 612-632. */
      [[1240,1254],[1258,1272],[1276,1290]].forEach(([a,b])=>win(R(a,b,614,632),{z:z+.02,t:.85,c:2,r:2,w:.9}));
      /* Open sash, ref 02 at 1222,700. */
      S({z:z+.02,w:.9,t:1},()=>{line([[1219,693],[1229,693],[1229,705],[1219,705]],{closed:true});line([[1222,668],[1236,668],[1236,672],[1222,672]],{closed:true});});
    }

    /* ---------- Near red-brick block, receding steeply. Ref 02 crop x 1089-1195. Top 1089,650 1149,611 1191,600; floor rows measured at two points each. ---------- */
    {const z=-.7,rows=[[1100,666,1145,640],[1095,692,1152,669],[1104,719,1155,704],[1104,745,1168,734],[1107,767,1176,767]],rights=[1158,1158,1165,1173,1180];
      /* Dark brick return with its stair-stepped edge and pairs of tall windows. */
      S({z:z-.05},()=>fill([[1149,611],[1191,600],[1197,625],[1200,740],[1180,782],[1150,782]],z-.05));
      S({z:z-.05,w:1.2,t:.85},()=>{line([[1160,607],[1191,600],[1192,640],[1190,684],[1205,716],[1205,740]]);});
      [[1163,1177,630,642],[1163,1178,660,678],[1172,1188,688,702],[1183,1198,724,740]].forEach(([a,b,y0,y1])=>win(R(a,b,y0,y1),{z:z-.04,t:.86,c:2,r:2,rv:.1,w:1,sl:.05}));
      brick(R(1160,1195,610,740),36,8,z-.045,.22);
      /* Facade fill, cornice, attic band. */
      S({z},()=>fill([[1089,650],[1149,611],[1160,607],[1160,690],[1167,690],[1167,720],[1176,720],[1176,755],[1183,755],[1183,852],[1094,852],[1092,700]],z));
      S({z,w:1.6,t:1},()=>{line([[1089,650],[1149,611],[1160,607],[1160,692],[1167,692],[1167,722],[1176,722],[1176,755],[1183,755],[1183,852],[1094,852],[1094,770],[1090,700],[1089,650]]);});
      S({z:z+.01,w:1,t:.85},()=>{line([[1090,656],[1149,617],[1160,613]]);line([[1090,660],[1149,621],[1160,617]]);});
      /* Rows. */
      const cols=[1094,1102,1110,1118,1127,1136,1145,1153,1161,1170];
      rows.forEach(([x0,y0,x1,y1],j)=>{const T=L(x0,y0,x1,y1),s=(y1-y0)/(x1-x0);cols.forEach(x=>{if(x>=rights[j]-3)return;win(R(x,x+5.2,T(x)-8,T(x)+8,s),{z:z+.02,t:.82,c:1,r:2,w:.8,sl:.1,hd:1});});
        /* Pale stone band under each floor, with bricks close up. */
        S({z:z+.01,w:.7,t:.6},()=>{const e=rights[j];seg(1093,T(1093)+13,e,T(e)+13);seg(1093,T(1093)+15,e,T(e)+15);});
        S({z:z+.005,w:.45,t:.24,lod:.6},()=>{for(let k=1;k<4;k++){const e=rights[j],o=-13+k*4.2;seg(1093,T(1093)+o,e,T(e)+o);}});});
      /* Stone ground floor. Ref 02: y 782-851, bays at 1100 1120 1165, dark entry 1141-1158. */
      cornice(1094,780,1183,780,[0,3,7],z+.02,.95);
      [[1098,1112],[1118,1136],[1162,1176]].forEach(([a,b])=>win(R(a,b,790,838),{z:z+.02,t:.86,c:2,r:4,rv:.05,w:1}));
      S({z:z+.02,w:1,t:.85},()=>{const q=[[1141,788],[1158,788],[1158,850],[1141,850]];fill(q,z+.02);line(q,{closed:true});});
      S({z:z+.01,w:.45,t:.34,lod:.3},()=>{for(let y=787;y<850;y+=7)seg(1094,y,1183,y);});
    }

    /* ---------- Long right wing: five storeys of framed windows, dormers on the slate roof, chimneys, townhouse entries. Ref 02 crop x 1395-1920. ---------- */
    {const z=-1.1,X=[1469,1487,1507,1527,1547,1570,1591,1613,1637,1663,1688,1714,1739,1769,1799,1829,1862,1895];
      const rw=[[655,591],[679,621],[704,652],[727,688],[750,721],[773,754]],Y=(r,x)=>mix(rw[r][0],rw[r][1],(x-1460)/460);
      /* Red roof behind, and shaded left block. Ref 02: 1440,616 1504,597 1570,603. */
      poly([[1440,616],[1504,597],[1570,603],[1570,640],[1440,640]],z-.1,1.1,.75);S({z:z-.09,w:.5,t:.34,lod:.5},()=>{for(let y=603;y<630;y+=3.2)seg(1450,y+6,1565,y);});
      poly([[1395,622],[1462,622],[1462,840],[1395,840]],z-.06,1.2,.68);
      [640,662,684,706,728,750].forEach(y=>[1408,1426,1444].forEach(x=>win(R(x-6,x+6,y-7,y+7),{z:z-.05,t:.5,c:2,r:2,sl:.05})));cornice(1395,772,1462,772,[0,3,6],z-.05,.6);
      [1433].forEach(c=>{S({z:z-.05,w:.8,t:.6},()=>{line([[c-20,782],[c+20,782],[c+20,828],[c-20,828]],{closed:true});seg(c-20,800,c+20,800);for(let k=-3;k<=3;k++)seg(c+k*5.5,783,c+k*5.5,828);});});
      /* The slate roof band, whose upper edge climbs to the right. */
      const ridge=[[1457,633],[1559,611],[1648,595],[1707,584],[1787,573],[1813,563],[1867,560],[1920,565]];
      const eave=x=>Y(0,x)+12;
      /* Chimneys, behind the roof. Ref 02: 1573-1592, 1637-1672, 1707-1744, 1787-1827, 1856-1875. */
      [[1573,1592,589],[1637,1672,582],[1707,1744,571],[1787,1827,555],[1856,1875,551]].forEach(([a,b,y])=>{const q=[[a,y],[b,y],[b,y+26],[a,y+26]];poly(q,z-.04,1.2,.9);S({z:z-.03,w:.8,t:.65},()=>{seg(a-1,y+3,b+1,y+3);});S({z:z-.03,w:.45,t:.34,lod:.5},()=>{for(let v=y+6;v<y+26;v+=3.2)seg(a,v,b,v);});[.3,.7].forEach(u=>S({z:z-.03,w:.8,t:.7},()=>{const x=mix(a,b,u);line([[x-2,y],[x-2,y-4],[x+2,y-4],[x+2,y]]);}));});
      /* Wall fill. */
      S({z},()=>fill([...ridge.map(q=>q),[1920,855],[1457,855]],z));
      S({z,w:1.7,t:1},()=>line(ridge));S({z,w:1.3,t:.95},()=>{seg(1459,633,1459,855);});
      S({z:z+.005,w:.5,t:.36,lod:.4},()=>{for(let k=1;k<5;k++){const q=ridge.slice(0,5).map(p=>[p[0],mix(p[1],eave(p[0]),k/5)]);line(q);}});
      /* Cornice along the top of the brick. */
      S({z:z+.01,w:1.3,t:.95},()=>{seg(1459,eave(1459),1920,eave(1920));});S({z:z+.01,w:.8,t:.7},()=>{seg(1459,eave(1459)+3,1920,eave(1920)+3);seg(1459,eave(1459)+5.5,1920,eave(1920)+5.5);});
      S({z:z+.015,w:.5,t:.45,lod:.5},()=>{for(let x=1460;x<1920;x+=4.4){const y=eave(x)+3;seg(x,y,x,y+2.5);}});
      /* Dormers in five pairs, each pair roofed as one. */
      [[1469,1488],[1527,1547],[1591,1613],[1660,1685],[1738,1765]].forEach(([a,b])=>{const w=mix(7,11,(a-1460)/360),yA=Y(0,a),yB=Y(0,b),pad=w+4,top=-13-w*.1;
        const box=[[a-pad,yA+top+2],[b+pad,yB+top-2],[b+pad,yB+11],[a-pad,yA+11]];poly(box,z+.02,1.2,.95);
        S({z:z+.025,w:.9,t:.8},()=>{line([[a-pad-5,yA+11],[a-pad,yA+top+2],[b+pad,yB+top-2],[b+pad+5,yB+11]]);line([[a-pad-2,yA+top],[b+pad+1,yB+top-4]]);});
        [a,b].forEach(x=>{mark("dormers on right wing");const y=Y(0,x),s=-.14;win(R(x-w,x+w,y-8.5,y+7.5,s),{z:z+.03,t:.95,c:2,r:2,rv:.1,w:1});});});
      /* Five storeys of framed windows. Each frame is a stone surround, a bowed head, a reveal, twin sashes and a sill. */
      for(let r=1;r<6;r++){X.forEach((x0,i)=>{const yb=Y(r,x0),x=x0+.066*(yb-675),sp=(X[i+1]||x0+33)-x0,hw=sp*.31,h=mix(7,10,(x0-1460)/460);if(r<3&&x>1818)return;const y=Y(r,x),s=(rw[r][1]-rw[r][0])/460,F=R(x-hw,x+hw,y-h,y+h,s);
          const G=R(x-hw*1.42,x+hw*1.42,y-h*1.34,y+h*1.42,s);S({z:z+.015,w:.8,t:.62},()=>{const q=[G(0,0),G(1,0),G(1,1),G(0,1)];fill(q,z+.015);line(q,{closed:true});});
          win(F,{z:z+.02,t:.92,c:2,r:2,rv:.1,w:1.05,sl:.12});
          S({z:z+.03,w:.55,t:.55,lod:.8},()=>{FL(G,.12,.08,.5,.03);FL(G,.5,.03,.88,.08);});
        });}
      /* Brick between. */
      brick(Q([1459,668],[1920,604],[1920,772],[1459,782]),38,80,z+.005,.22);
      /* String course. */
      cornice(1459,779,1920,772,[0,3,7,11],z+.02,1);
      S({z:z+.025,w:.5,t:.42,lod:.5},()=>{for(let x=1462;x<1920;x+=5){const y=L(1459,779,1920,772)(x)+4;seg(x,y,x,y+2.6);}});
      /* Townhouse entries. Ref 02 centres 1484 1543 1610 1682 1765 1856. */
      const ent=[[1484,32,.6],[1543,36,.8],[1610,42,.95],[1682,45,1],[1765,51,1],[1856,54,1]];
      ent.forEach(([c,w,t])=>{const a=c-w/2,b=c+w/2,y0=788,y1=830,zz=z+.03;
        poly([[a,y0],[b,y0],[b,y1],[a,y1]],zz,1.3,t);
        S({z:zz+.01,w:.9,t:t*.85},()=>{seg(a-2,y0-2,b+2,y0-2);seg(a,802,b,802);seg(a,805,b,805);line([[a+3,812],[a+3,y1]]);line([[b-3,812],[b-3,y1]]);});
        const n=w>40?7:5;win(R(a+3,b-3,y0+3,y0+12),{z:zz+.01,t:t*.92,c:n,r:1,w:.8});
        S({z:zz+.01,w:.8,t:t*.8},()=>{line([[c-w*.36,812],[c,805],[c+w*.36,812]]);seg(c-w*.36,812,c+w*.36,812);});
        win(R(a+5,c-3,813,826),{z:zz+.01,t:t*.9,c:3,r:3,w:.8});win(R(c+3,b-5,813,826),{z:zz+.01,t:t*.9,c:3,r:3,w:.8});
        S({z:zz+.01,w:.8,t:t*.8},()=>{seg(c-3,812,c-3,y1);seg(c+3,812,c+3,y1);seg(c,812,c,y1);});
        /* Twin stairs. */
        S({z:zz,w:.9,t:t*.72},()=>{line([[a,y1],[a-14,842]]);line([[b,y1],[b+14,842]]);seg(a,y1,b,y1);line([[a+4,y1],[a-8,842]]);line([[b-4,y1],[b+8,842]]);});
        S({z:zz,w:.5,t:t*.5,lod:.5},()=>{for(let k=1;k<6;k++){const u=k/6,y=mix(y1,842,u);seg(mix(a,a-14,u),y,mix(a+4,a-8,u),y);seg(mix(b,b+14,u),y,mix(b-4,b+8,u),y);}});});
      /* Shaded bays between the entries. */
      [[1575,14],[1647,15],[1722,17],[1810,20],[1905,14]].forEach(([x,w])=>win(R(x-w/2,x+w/2,788,808),{z:z+.03,t:.62,c:2,r:2,rv:.1}));
      S({z:z+.01,w:.45,t:.3,lod:.3},()=>{for(let y=786;y<838;y+=7)seg(1459,y,1920,y);});
    }

    /* Long pale glazed end block, cut by the frame. Ref 02: hip 1815,568 1860,558 1920,570. Not counted among the log's 2 bay blocks. */
    {const z=-.9;
      S({z},()=>fill([[1815,572],[1860,562],[1920,570],[1920,655],[1860,656],[1815,646]],z));
      S({z,w:1.5,t:1},()=>{line([[1815,646],[1815,572],[1860,562],[1920,570]]);line([[1815,646],[1838,650],[1860,656],[1920,650]]);});
      S({z:z+.01,w:.9,t:.8},()=>{line([[1815,578],[1860,569],[1920,577]]);line([[1815,582],[1860,573],[1920,581]]);line([[1818,612],[1860,611],[1920,612]]);line([[1818,616],[1860,615],[1920,616]]);});
      S({z:z+.01,w:.85,t:.72},()=>{for(let x=1822;x<1920;x+=14){seg(x,586,x,610);seg(x,620,x,648);}});
      S({z:z+.01,w:.5,t:.5,lod:.2},()=>{for(let x=1829;x<1920;x+=14){seg(x,586,x,610);seg(x,620,x,648);}seg(1818,600,1920,600);seg(1818,634,1920,634);});
      /* Its brick stub with tall dark windows. Ref 02: 1830-1880, y 625-655. */
      [1840,1852,1868].forEach(x=>win(R(x-4,x+4,628,648),{z:z+.02,t:.72,c:1,r:2}));
    }

    /* ---------- Wharf deck and timber face. Ref 02: deck y 838-860, timber face x 1136-1493 y 852-884, float 1037,861 to 1136,883. ---------- */
    {const z=.6;
      /* Paved plaza, balusters and posts along the right wing. */
      S({z},()=>fill([[1395,838],[1920,838],[1920,862],[1395,862]],z));S({z,w:1.2,t:.95},()=>{seg(1460,840,1920,838);seg(1460,844,1920,842);seg(1460,858,1920,862);});
      S({z:z+.01,w:.6,t:.55},()=>{for(let x=1464;x<1920;x+=4.2)seg(x,844,x,858);});
      for(let x=1460;x<1920;x+=19.5)S({z:z+.02,w:1,t:.92},()=>{const q=[[x-2.5,834],[x+2.5,834],[x+2.5,858],[x-2.5,858]];fill(q,z+.02);line(q,{closed:true});arc(x,833,3,2.5,PI,TAU,8);});
      /* Timber wharf face. */
      S({z},()=>fill([[1136,852],[1500,852],[1495,884],[1136,884]],z));S({z,w:1.3,t:.9},()=>{seg(1100,852,1500,852);seg(1136,884,1495,884);seg(1495,884,1500,852);seg(1136,852,1136,884);});
      S({z:z+.01,w:.6,t:.44},()=>{seg(1136,858,1498,858);for(let x=1148;x<1495;x+=24)seg(x,852,x,884);});S({z:z+.01,w:.45,t:.34,lod:.6},()=>{for(let x=1140;x<1495;x+=4)seg(x,858,x,884);});
      [[1285,866,877],[1416,864,877]].forEach(([x,a,b])=>S({z:z+.02,w:1.5,t:1},()=>{line([[x-1.8,a],[x+1.8,a],[x+1.8,b],[x-1.8,b]],{closed:true});}));
      /* Plaza edge and low wall under the arch block. */
      S({z:z-.05},()=>fill([[812,838],[1136,838],[1136,852],[812,852]],z-.05));S({z:z-.04,w:1.1,t:.85},()=>{seg(935,840,1136,840);});
      /* Railed gangway to the plaza. Ref 02: 936,855 to 1040,835. */
      S({z:z+.05,w:1,t:.9},()=>{const a=[936,853],b=[1040,835];seg(a[0],a[1],b[0],b[1]);seg(a[0],a[1]+6,b[0],b[1]+6);S({w:.55,t:.65},()=>{for(let u=0;u<=1;u+=.05)seg(mix(a[0],b[0],u),mix(a[1],b[1],u),mix(a[0],b[0],u),mix(a[1],b[1],u)+6);});});
      /* Float and stair to the wharf. */
      poly([[1037,861],[1047,859],[1136,877],[1136,884],[1110,881]],z+.1,1.2,1);
      S({z:z+.11,w:.5,t:.5,lod:.4},()=>{for(let u=.08;u<1;u+=.08)seg(mix(1040,1110,u),mix(861,880,u),mix(1048,1136,u),mix(860,878,u));});
      S({z:z+.12,w:1,t:.95},()=>{seg(1050,840,1075,862);seg(1060,840,1085,862);S({w:.5,t:.6},()=>{for(let u=.1;u<1;u+=.1)seg(mix(1050,1075,u),mix(840,862,u),mix(1060,1085,u),mix(840,862,u));});});
      /* Near piles and the lamps of the plaza. Ref 02: 1073 1088 1100 1113 1126 1157 and 1248, 1343. */
      [1073,1088,1100,1113,1126,1157,1158].forEach(x=>pile(x,822,870,z+.2));
      [[1216,838],[1248,838],[1343,840]].forEach(([x,y])=>{pile(x,y-6,y+22,z+.15,2);});
      /* Pier-side dock under the kiosk. Ref 02: 736,872 to 848,873. */
      S({z:z+.05,w:1.2,t:.9},()=>{seg(736,870,850,871);seg(736,878,850,879);S({w:.5,t:.4,lod:.4},()=>{for(let x=740;x<850;x+=6)seg(x,871,x,878);});});
      S({z:z,w:.5,t:.3},()=>{for(let x=736;x<850;x+=8)seg(x,852,x,870);});
      [[780,830],[704,820],[835,830]].forEach(([x,y])=>pile(x,y,870,z+.05,2.2));
    }

    /* ---------- Small boats moored along the right wing, and their piles. Ref 02 crop x 1481-1920. ---------- */
    {const z=1.4,boat=(a,b,y,h,cab,zz)=>{const c=[[a,y],[mix(a,b,.08),y-h*.5],[mix(a,b,.72),y-h*.5],[b,y-h*.85],[mix(a,b,.88),y+h*.5],[a+4,y+h*.6]];poly(c,zz,1.2,1);S({z:zz+.01,w:.6,t:.65},()=>{seg(a+2,y+h*.1,mix(a,b,.9),y+h*.1-1);});
        const C=[[mix(a,b,cab[0]),y-h*.5],[mix(a,b,cab[0]+.03),y-h*1.1],[mix(a,b,cab[1]-.05),y-h*1.2],[mix(a,b,cab[1]),y-h*.5]];poly(C,zz+.01,1,.9);S({z:zz+.02,w:.5,t:.55,lod:.3},()=>{for(let k=1;k<5;k++){const x=mix(C[0][0],C[3][0],k/5);seg(x,y-h*.5,x,y-h*1.15);}seg(a+4,y-h*.5-3,mix(a,b,cab[0]),y-h*.5-3);seg(mix(a,b,cab[1]),y-h*.5-3,mix(a,b,.72),y-h*.5-3);for(let x=a+6;x<mix(a,b,.72);x+=7)seg(x,y-h*.5,x,y-h*.5-3);});};
      boat(1481,1562,862,6,[.45,.72],z);boat(1562,1664,868,7,[.3,.6],z+.02);boat(1668,1740,872,7,[.2,.55],z+.04);boat(1670,1781,882,6,[.5,.8],z+.1);boat(1781,1898,878,12,[.25,.6],z+.12);boat(1860,1920,870,8,[.15,.55],z+.06);
      [1587,1604,1648,1673,1703,1760,1775,1814,1823,1852,1868,1910].forEach((x,i)=>pile(x,823+(i%3)*2,882,z+.2,2.3));
    }

    /* ---------- Left ferry, the red and white boat behind it, the covered gangway. Ref 02 crop x 0-420. ---------- */
    {const z=1.2;
      /* Red and white boat behind. Ref 02: x 0-115, red tube y 833-838, cabin windows y 822. */
      poly([[0,818],[80,815],[115,817],[115,878],[0,882]],z-.2,1.1,.72);
      S({z:z-.19,w:.9,t:.85},()=>{seg(55,832,115,832);seg(55,839,115,839);seg(0,822,60,822);});
      [86,100,112].forEach(x=>win(R(x,x+6,823,829),{z:z-.18,t:.7,c:1}));
      S({z:z-.19,w:.6,t:.58},()=>{for(let y=846;y<870;y+=7)seg(4,y,96,y);for(let x=8;x<96;x+=11)seg(x,846,x,870);line([[55,815],[60,805],[75,807],[78,815]]);});
      pile(65,822,878,z-.1,2.6);S({z:z-.15,w:.8,t:.7},()=>{seg(20,884,92,878);seg(0,878,40,877);seg(0,884,20,884);});
      /* The covered gangway to the ferry slip. Ref 02: 278,835 to 350,823. */
      poly([[278,832],[350,820],[352,827],[282,842]],z-.3,1.1,.8);S({z:z-.29,w:.5,t:.5},()=>{seg(280,837,351,823);S({lod:.4},()=>{for(let u=.08;u<1;u+=.08)seg(mix(278,350,u),mix(832,820,u),mix(282,352,u),mix(842,827,u));});});
      poly([[360,838],[415,850],[415,858],[360,846]],z-.3,1,.7);S({z:z-.29,w:.8,t:.7},()=>{seg(366,866,420,866);});
      [[370,822],[386,824],[398,826]].forEach(([x,y])=>pile(x,y,866,z-.28,1.8));pile(290,815,850,z-.28,1.8);
      /* The ferry. Mark it. */
      mark("white boats at piers");
      poly([[92,862],[186,859],[270,855],[296,852],[288,862],[262,870],[210,878],[130,881],[92,880]],z,1.6,1);
      S({z:z+.01,w:1.2,t:.9},()=>{seg(92,875,210,873);seg(210,873,262,866);});
      S({z:z+.01,w:1.1,t:.92},()=>{seg(188,864,270,860);seg(188,866,270,862);});
      /* Lower deck and aft A-frame. */
      poly([[110,862],[110,842],[125,829],[190,828],[247,826],[261,818],[270,826],[276,852],[270,856],[186,859]],z-.02,1.5,1);
      S({z:z+.01,w:.9,t:.85},()=>{seg(125,829,140,862);seg(125,829,110,842);seg(135,829,158,862);seg(150,829,170,862);seg(110,850,187,850);seg(187,829,187,860);seg(160,829,160,860);});
      S({z:z+.01,w:.55,t:.6},()=>{for(let x=114;x<187;x+=6.2)seg(x,851,x,860);});
      /* Windows: 7 upper, 5 lower, 2 forward. Ref 02 crop. */
      for(let i=0;i<7;i++)win(R(202+i*6.7,207.5+i*6.7,831,838),{z:z+.02,t:1,c:1,w:.9});
      for(let i=0;i<5;i++)win(R(208+i*8,214+i*8,853,859.5,-.02),{z:z+.02,t:1,c:1,w:.9});
      [[262,850],[270,850]].forEach(([x,y])=>win(R(x,x+6,y,y+6),{z:z+.02,t:.95,c:1,w:.9}));
      S({z:z+.01,w:.7,t:.72},()=>{seg(190,842,262,840);seg(190,845,262,843);});
      /* Upper decks, mast, flag. */
      poly([[150,829],[150,820],[200,816],[240,815],[244,826]],z-.03,1.2,.92);
      poly([[150,820],[158,806],[200,804],[225,808],[227,816]],z-.04,1.2,.9);
      S({z:z-.03,w:.6,t:.65},()=>{seg(158,812,226,811);for(let x=162;x<226;x+=8)seg(x,812,x,816);});
      S({z:z+.02,w:1,t:.92},()=>{seg(200,804,200,787);seg(192,789,208,789);seg(183,806,181,790);seg(202,800,204,792);line([[204,793],[219,795],[219,801],[204,800]],{closed:true});seg(220,812,220,795);});
      S({z:z+.01,w:.55,t:.65,lod:.2},()=>{for(let x=190;x<262;x+=4)seg(x,824-(x-190)*.02,x,828-(x-190)*.02);seg(190,824,250,823);for(let x=128;x<150;x+=4)seg(x,822,x,829);seg(126,822,150,821);});
      /* Lifebelts, stern text panel, without lettering: the crop does not resolve it. */
      S({z:z+.02,w:.7,t:.7},()=>{seg(108,868,136,868);seg(108,871,132,871);seg(202,851,240,850);});
    }

    /* ---------- Barge with its dark shed, ramp and tent. Ref 02 crop x 422-587. ---------- */
    {const z=1.3;
      poly([[422,900],[587,900],[587,916],[422,916]],z-.02,1.2,.75);
      S({z:z-.01,w:.5,t:.34,lod:.3},()=>{for(let x=426;x<587;x+=8)seg(x,901,x,916);});
      poly([[426,856],[500,856],[560,862],[580,885],[580,900],[426,900]],z,1.5,1);
      S({z:z+.01,w:.8,t:.7},()=>{seg(426,879,560,879);seg(426,883,580,883);seg(470,856,470,900);seg(520,862,520,900);line([[470,871],[500,858],[530,866]]);});
      S({z:z+.01,w:.5,t:.4,lod:.3},()=>{for(let x=432;x<470;x+=6)seg(x,858,x,878);});
      /* Dark shed: boarded walls, a door, a stovepipe, the pale barrel roof with rounded corners. Ref 02 crops h and i. */
      poly([[426,813],[471,813],[471,856],[426,856]],z+.02,1.4,.95);
      S({z:z+.03,w:.55,t:.42},()=>{for(let x=431;x<471;x+=5)seg(x,815,x,856);});
      S({z:z+.035,w:.9,t:.8},()=>{const q=[[438,856],[438,828],[456,828],[456,856]];fill(q,z+.035);line(q);seg(447,828,447,856);arc(442.5,842,1,1,0,TAU,6);S({w:.5,t:.5},()=>{line([[440,830],[445,830],[445,838],[440,838]],{closed:true});line([[449,830],[454,830],[454,838],[449,838]],{closed:true});});});
      {const rf=[[426,813],[428,810],[434,806],[447,802],[485,800],[481,805],[476,810],[471,813]];poly(rf,z+.04,1.5,1);S({z:z+.05,w:.55,t:.55},()=>{for(let u=.1;u<1;u+=.1)seg(mix(426,471,u),812,mix(447,485,u),mix(802,800,u)+1);line([[430,810],[448,805],[481,803]]);});S({z:z+.06,w:1,t:.9},()=>{line([[454,801],[454,793],[458,793],[458,801]]);seg(452,793,460,793);});}
      /* Tarped deck load, stanchions, lifebuoy. Ref 02 at 475-530 y 855-862; buoy 509,886. */
      S({z:z+.015,w:.9,t:.82},()=>{line([[473,866],[482,858],[500,855],[520,857],[532,866]]);S({w:.5,t:.5},()=>{for(let x=478;x<530;x+=6)seg(x,858,x-1,866);});});
      S({z:z+.015,w:.8,t:.8},()=>{arc(509,886,3,3,0,TAU,12);arc(509,886,1.4,1.4,0,TAU,8);[434,456,482,504,528,552].forEach(x=>seg(x,868,x,879));seg(430,868,556,868);seg(430,873,556,873);});
      /* Ramp, dark mass, pile, tent. */
      poly([[471,806],[500,800],[535,800],[535,856],[471,856]],z-.05,1,.6);S({z:z-.04,w:.5,t:.28},()=>{for(let y=806;y<856;y+=6)seg(473,y,535,y);});
      poly([[506,816],[559,832],[559,838],[506,823]],z+.04,1.1,.9);
      pile(538,800,896,z+.05,2.6);
      {const q=[[552,842],[552,828],[562,823],[575,826],[583,842]];poly(q,z+.04,1.1,.85);S({z:z+.05,w:.5,t:.5,lod:.3},()=>{for(let x=556;x<583;x+=5)seg(x,826,x,842);});}
      /* Rails towards the white yacht. */
      S({z:z+.06,w:.6,t:.65},()=>{seg(540,860,578,842);seg(540,866,578,850);for(let u=.1;u<1;u+=.12)seg(mix(540,578,u),mix(860,842,u),mix(540,578,u),mix(884,850,u));});
      globe(420,830,2.6,z);
    }

    /* The red-canopied boat, far right of the moored group. Ref 02: x 854-935, canopy y 819-826, deck rail y 842-863. */
    {const z=1;mark("white boats at piers");
      poly([[856,862],[934,862],[934,870],[928,879],[862,880],[854,872]],z,1.5,1);
      S({z:z+.01,w:.9,t:.85},()=>{seg(855,868,934,868);seg(856,872,932,872);});
      poly([[858,840],[932,840],[934,862],[856,862]],z-.01,1.2,.95);
      S({z:z,w:1,t:.9},()=>{seg(857,845,933,845);seg(857,848,933,848);});
      [866,875,884,893,902,911,920,928].forEach(x=>S({z:z,w:.95,t:.85},()=>{seg(x,848,x,861);seg(x+3,848,x+3,861);}));
      S({z:z,w:.5,t:.55,lod:.4},()=>{for(let k=0;k<7;k++){const x=[869,878,887,896,905,914,923][k];seg(x,852,x+6,852);seg(x,858,x+6,858);}});
      /* Open upper deck and canopy. */
      poly([[860,826],[930,826],[932,840],[858,840]],z-.015,1,.8);S({z:z-.01,w:.7,t:.7},()=>{for(let x=868;x<930;x+=9)seg(x,827,x,840);seg(859,836,931,836);});
      poly([[854,823],[860,819],[930,819],[935,823],[935,827],[854,827]],z+.01,1.4,1);S({z:z+.02,w:.55,t:.62},()=>{for(let x=860;x<932;x+=8)seg(x,820,x-2,827);});
      /* Pilot house, stack, flag. */
      poly([[873,819],[873,807],[910,807],[910,819]],z,1.2,.95);[878,887,896].forEach(x=>win(R(x,x+7,810,816),{z:z+.01,t:.9,c:1,w:.8}));
      S({z:z+.01,w:.9,t:.9},()=>{seg(892,807,892,780);line([[892,781],[880,787],[880,795],[892,792]],{closed:true});});
      S({z:z+.02,w:.5,t:.5},()=>{seg(880,790,892,786);});
    }

    /* The boat tucked behind the yacht. Ref 02: x 682-736, y 821-886. */
    {const z=1.5;mark("white boats at piers");
      poly([[682,858],[728,858],[736,868],[728,882],[700,888],[682,886]],z,1.4,1);
      S({z:z+.01,w:.7,t:.75},()=>{seg(696,870,733,869);seg(696,874,730,873);});
      poly([[682,821],[720,824],[728,858],[682,858]],z-.01,1.3,.95);
      S({z:z,w:.8,t:.8},()=>{seg(682,834,724,836);});
      [[695,843,708,852],[712,843,724,852]].forEach(([a,y0,b,y1])=>win(R(a,b,y0,y1),{z:z+.01,t:.95,c:2,w:.9}));
      for(let i=0;i<5;i++)win(R(685+i*7.5,691+i*7.5,825,833),{z:z+.01,t:.9,c:1,w:.8});
    }

    /* The white yacht, the largest boat at the piers. Ref 02 crop: hull 580,872 599,912 649,909 699,891; flag pole x 590; mast x 636. */
    {const z=2;mark("white boats at piers");
      S({z:z-.2,w:1,t:.9},()=>{seg(590,770,590,812);seg(585,799,594,799);line([[583,778],[590,776],[590,785],[584,786]],{closed:true});});
      S({z:z-.19,w:.5,t:.55},()=>{seg(584,781,590,780);seg(584,783.5,590,783);});
      S({z:z+.02,w:1.2,t:1},()=>{seg(636,772,636,804);seg(629,786,646,786);seg(631,791,644,792);line([[634,772],[637,770],[639,775],[636,780]],{closed:true});seg(628,786,624,795);});
      /* Upper house. */
      poly([[602,804],[658,804],[660,819],[593,819]],z-.02,1.4,1);
      S({z:z-.01,w:.8,t:.75},()=>{seg(602,808,659,808);line([[596,816],[612,812],[645,812],[660,816]]);});
      /* Main saloon level, windows. */
      poly([[592,821],[683,821],[690,840],[584,853],[590,840]],z-.01,1.5,1);
      S({z,w:1,t:.92},()=>{seg(590,821,686,821);seg(590,824,686,824);seg(594,838,684,838);});
      [[606,612],[615,624],[627,636],[638,645]].forEach(([a,b])=>win(R(a,b,825,836),{z:z+.01,t:1,c:1,w:1}));
      [664,670,676,682].forEach(x=>win(R(x,x+4.5,825,835,.05),{z:z+.01,t:.95,c:1,w:.8}));
      /* Lower deck. */
      poly([[584,853],[590,840],[690,840],[693,875],[580,874]],z,1.6,1);
      S({z:z+.01,w:1,t:.9},()=>{seg(586,856,692,854);seg(590,852,690,851);});
      [[594,604],[608,618],[624,636]].forEach(([a,b])=>win(R(a,b,859,868),{z:z+.01,t:1,c:1,w:1}));
      for(let i=0;i<7;i++)win(R(664+i*4,667+i*4,857-i*.2,867-i*.2),{z:z+.01,t:.95,c:1,w:.75});
      /* Hull. */
      poly([[579,871],[693,875],[699,890],[688,897],[649,910],[599,913],[592,900]],z+.02,1.7,1);
      S({z:z+.03,w:1,t:.9},()=>{seg(579,875,694,878);seg(581,878,696,882);});
      S({z:z+.03,w:.55,t:.55},()=>{seg(588,897,688,893);seg(592,904,680,900);});
      S({z:z+.03,w:.5,t:.38,lod:.6},()=>{for(let k=1;k<9;k++){const u=k/9;seg(mix(585,690,u),881,mix(598,684,u),mix(910,896,u));}});
      arc(617,881,1.3,1.3,0,TAU,8);arc(653,882,1.3,1.3,0,TAU,8);
    }

    /* ---------- The harbor: ripples lengthening toward the viewer, glitter under the boats and off the left wake. Ref 02 lower third. ---------- */
    {const z=3,tick=(x,y,l)=>seg(x,y,x+l,y+(rnd()-.5)*.6);
      /* Waterline. */
      S({z,w:1.1,t:.75},()=>{line([[0,890],[92,884],[210,880],[420,876],[422,916],[587,916],[600,914],[700,892],[850,882],[1136,885],[1495,885],[1920,892]]);});
      S({z,w:.6,t:.34},()=>{for(let i=0;i<1500;i++){const u=rnd(),y=893+Math.pow(u,1.4)*168,x=rnd()*1920,l=3+u*16+rnd()*6;if(x>420&&x<700&&y<918)continue;tick(x,y,l);}});
      S({z,w:.5,t:.28,lod:.8},()=>{for(let i=0;i<1700;i++){const u=rnd(),y=890+u*171,x=rnd()*1920,l=1.5+u*9;if(x>420&&x<700&&y<918)continue;tick(x,y,l);}});
      S({z,w:.5,t:.24,lod:1.7},()=>{for(let i=0;i<2800;i++){const u=rnd(),y=888+u*173,x=rnd()*1920,l=1+u*5;if(x>420&&x<700&&y<918)continue;const m=(rnd()-.5)*.9;seg(x,y,x+l,y+m);seg(x+l,y+m,x+l*2,y);}});
      /* Glitter off the left wake. Ref 02: x 0-540, y 885-970. */
      S({z,w:.7,t:.62},()=>{for(let i=0;i<340;i++){const x=rnd()*560,y=884+rnd()*rnd()*90;if(y<880+(x>420?40:0))continue;tick(x,y,2+rnd()*9);}});
      /* Reflections: boats drop bright horizontal strokes below them. */
      [[92,296,882,28],[600,696,914,48],[855,932,880,26],[1640,1900,892,22],[1040,1136,886,16],[1200,1400,886,24]].forEach(([a,b,y,h])=>S({z,w:.65,t:.5},()=>{for(let i=0;i<h*4;i++){const v=rnd(),n=(b-a)*(.3+.7*(1-v)),x=mix(a,b,.5)+(rnd()-.5)*n;tick(x,y+v*h,2+rnd()*10);}}));
    }
  }});
