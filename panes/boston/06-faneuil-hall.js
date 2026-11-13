/* Faneuil Hall, one gable end. Reference: portfolio_refs/boston/06-faneuil-hall-gable.jpg, read at its stored 1920 x 1440.
   Every structure below is drawn in that photo's pixels and cites ref 06, the only picture of this facade in the log. The camera looks up, so verticals lean toward a point near (975,-3550) and courses roll about .005 down to the right.
   Log note: the log estimates about 25 panes per window. The crops show 32: 24 sash panes, 2 in the inner fan, 6 in the outer fan. Drawn as 32.
   Weights: w 1.6 structure, 1 detail, .6 fine. z is depth, lod the zoom at which a detail appears. */
window.PANE_DEFS.push({id:"boston-06",city:"boston",ref:"06",w:1920,h:1440,color:0x7CC0B6,focus:[972,640],
  trace:[[0,1440],[0,522],[922,230],[922,156],[980,156],[1037,156],[1037,235],[1920,525],[1920,1440]],peak:4,
  expect:{"full arched windows":5,"partial arched windows":2,oculi:2,lunette:1,"relieving arch":1,"pilaster capitals":6,chimney:1,"dentil courses":2},
  places:[{id:"hall",at:[975,605,.1],where:"Faneuil Hall, Downtown",means:""}],
  draw(d){
    const {seg,fill,S,mark,rnd}=d,W=1920,H=1440,PI=Math.PI,TAU=PI*2;

    /* Everything is clipped to the photo's frame, so the partial windows stop where the picture stops. */
    const sg=(a,b,c,e)=>{let t0=0,t1=1;const dx=c-a,dy=e-b;for(const[p,q]of[[-dx,a],[dx,W-a],[-dy,b],[dy,H-b]]){if(p===0){if(q<0)return;}else{const r=q/p;if(p<0){if(r>t1)return;if(r>t0)t0=r;}else{if(r<t0)return;if(r<t1)t1=r;}}}seg(a+t0*dx,b+t0*dy,a+t1*dx,b+t1*dy);};
    const ln=(q,closed)=>{for(let i=0;i<q.length-1;i++)sg(q[i][0],q[i][1],q[i+1][0],q[i+1][1]);if(closed)sg(q[q.length-1][0],q[q.length-1][1],q[0][0],q[0][1]);};
    const clip=(q,i,v,s)=>{const o=[];for(let k=0;k<q.length;k++){const a=q[k],b=q[(k+1)%q.length],A=(a[i]-v)*s>=0,B=(b[i]-v)*s>=0;if(A)o.push(a);if(A!==B){const u=(v-a[i])/(b[i]-a[i]);o.push([a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u]);}}return o;};
    const fl=(q,z)=>{let r=clip(clip(clip(q,0,0,1),0,W,-1),1,H,-1);if(r.length>2)fill(r,(z===undefined?0:z)-.004);};
    const quads=(A,B,z)=>{for(let i=0;i<A.length-1;i++)fl([A[i],A[i+1],B[i+1],B[i]],z);};

    /* The wall plane of ref 06: U is the position across the wall, read at y 1150. */
    const X=(U,y)=>975+U*(y+3550)/4700,lean=x=>(x-975)/4700;
    const roll=y=>.0049+.0016*(y-680)/700,cy=(Y,x)=>Y+roll(Y)*(x-975);
    /* Course pitch measured by peak-finding on mortar lines: 4.3 px at y 350, 5.2 at 860, 5.9 at 1145. */
    const pitch=y=>5.03+.0021*(y-800)+1e-6*(y-800)*(y-800);
    const courses=(()=>{const c=[];for(let y=787.7;y>215;y-=pitch(y))c.unshift(y);for(let y=787.7+pitch(787.7);y<1336;y+=pitch(y))c.push(y);return c;})();

    /* Sky line of ref 06, measured on 12 columns. Offsets below it build the raking cornice. */
    const apexX=971.8,skyL=x=>522-.3163*x,skyR=x=>215+.328*(x-973),sky=x=>x<=apexX?skyL(x):skyR(x),rakeBot=69;

    /* Arched windows, read from crops of ref 06. Frame edges at y 1040 and y 1260, outer and glass; bar levels; sill. */
    const WINS=[
      {part:1,L:[-117,-161],iL:[-100,-147],iR:[30,-14],R:[47,3],bars:[1018,1058,1098,1140,1182,1224,1266],sill:[-200,-8,1272,1294]},
      {L:[216,180],iL:[236,201],iR:[367,338],R:[382,353],bars:[1020,1060,1100,1142,1184,1226,1268],sill:[168,356,1274,1296]},
      {L:[552,528],iL:[567,544],iR:[697,683],R:[714,700],bars:[1022,1060,1100,1142,1185,1226,1269],sill:[520,704,1274,1295]},
      {L:[887,885],iL:[901,898],iR:[1033,1034],R:[1051,1054],bars:[1022,1061,1101,1141,1185,1227,1269],sill:[877,1058,1272,1295]},
      {L:[1232,1241],iL:[1247,1258],iR:[1374,1390],R:[1394,1413],bars:[1026,1065,1104,1146,1189,1231,1271],sill:[1238,1418,1277,1299]},
      {dark:1,L:[1562,1588],iL:[1577,1601],iR:[1706,1735],R:[1728,1759],bars:[1032,1071,1111,1152,1195,1238,1280],sill:[1589,1767,1284,1306]},
      {part:1,L:[1897,1941],iL:[1912,1956],iR:[2042,2086],R:[2061,2105],bars:[1036,1075,1116,1157,1200,1243,1286],sill:[1930,2120,1290,1312]}];
    const at=(p,y)=>p[0]+(p[1]-p[0])*(y-1040)/220;
    /* Pilaster edges at y 805 and y 1295, found by searching for the darkest straight line near each capital of ref 06. */
    const PIL=[[136,196,51,112],[463,521,407,469],[774,837,752,819],[1110,1168,1122,1187],[1429,1490,1475,1539],[1747,1808,1825,1889]];
    const pilAt=(a,b,y)=>a+(b-a)*(y-805)/490;
    /* Oculi and lunette, read from crops of ref 06. */
    const OC=[[361,588],[1590,596]],LUN={cx:975,y:665,fa:221,fb:136,ga:192,gb:118,ra:238,rb:158};
    const inEl=(x,y,cx,c,a,b)=>((x-cx)/a)**2+((y-c)/b)**2<1;
    const hidden=(x,y)=>{if((y<LUN.y&&inEl(x,y,LUN.cx,LUN.y,LUN.ra,LUN.rb))||OC.some(o=>inEl(x,y,o[0],o[1],84,68)))return true;if(y>930&&y<1300)return WINS.some(w=>y>w.bars[0]-85&&y<w.sill[3]&&x>at(w.L,y)-1&&x<at(w.R,y)+1);return false;};

    /* Brick: every course, then the Flemish bond the crops show, alternating stretcher and header with each header over the middle of a stretcher. Ref 06 crop at x 560-720. */
    const S_=20.3,H_=10.2,P_=S_+H_;
    const bond=(k,y,y2,a,b,phase)=>{const o=(k%2)*P_/2+phase;for(let u=-1300+o;u<1300;u+=P_){[u,u+S_].forEach(v=>{const j=v+(rnd()-.5)*1.8,x=X(j,y);if(x<=a||x>=b||hidden(x,y))return;const q=cy(y,x);sg(x,q,x+(y2-y)*lean(x),q+y2-y);});}};
    const brickRun=(lo,hi,ax,bx,regions,z)=>{S({z,w:.6,t:.34},()=>{courses.forEach(y=>{if(y<lo||y>hi)return;const a=ax(y),b=bx(y);if(b>a)sg(a,cy(y,a),b,cy(y,b));});});
      S({z,w:.5,t:.38,lod:.62},()=>{courses.forEach((y,k)=>{if(y<lo||y>hi||!courses[k+1])return;const y2=courses[k+1];regions(y).forEach(([a,b,ph])=>bond(k,y,y2,Math.max(a,ax(y)),Math.min(b,bx(y)),ph));});});
      /* Worn faces and dark headers, only up close. */
      S({z,w:.5,t:.2,lod:2.2},()=>{courses.forEach((y,k)=>{if(y<lo||y>hi||!courses[k+1])return;const a=Math.max(0,ax(y)),b=Math.min(W,bx(y)),p=courses[k+1]-y,n=(b-a)/60;for(let i=0;i<n;i++){const x=a+rnd()*(b-a);if(hidden(x,y))continue;const q=cy(y,x)+p*(.3+rnd()*.4);sg(x,q,x+3+rnd()*8,q);}});});};

    /* Chimney with its cap. Ref 06 crop at x 760-1200. */
    mark("chimney");{const z=-1;
      S({z,w:1.6,t:1},()=>{fl([[922,156],[1037,156],[1037,240],[922,240]],z);ln([[922,240],[922,156],[1037,156],[1037,240]]);});
      S({z,w:1,t:.85},()=>{sg(922,168,1037,168);sg(922,171,1037,171);});
      S({z,w:.7,t:.6},()=>{sg(922,158.5,1037,158.5);sg(969,159,969,167);});
      S({z,w:.6,t:.32},()=>{for(let k=0,y=175;y<236;k++,y+=4.75){sg(922,y,1037,y);}});
      S({z,w:.5,t:.38,lod:.62},()=>{for(let k=0,y=175;y<231;k++,y+=4.75)for(let x=922+(k%2?7:0);x<1037;x+=28){sg(x,y,x,y+4.75);if(x+19<1037)sg(x+19,y,x+19,y+4.75);}});}

    /* Gable wall and main wall. Ref 06. */
    S({z:0},()=>{fl([[0,590],[apexX,skyL(apexX)+rakeBot-1],[W,skyR(W)+rakeBot-1],[W,672],[0,665]],0);fl([[0,764],[W,772],[W,1340],[0,1332]],0);});
    brickRun(250,666,y=>(522+rakeBot-y)/.3163,y=>973+(y-215-rakeBot)/.328,()=>[[0,W,0]],0);
    brickRun(767,1329,()=>0,()=>W,y=>{const e=[0];PIL.forEach(p=>e.push(pilAt(p[0],p[2],y),pilAt(p[1],p[3],y)));e.push(W);const r=[];for(let i=0;i<e.length-1;i++)r.push([e[i],e[i+1],i*7.3]);return r;},0);

    /* Six pilasters: brick shafts whose edges are shadow lines. Each right edge is the deep one, as in ref 06. */
    PIL.forEach(p=>{const a=y=>pilAt(p[0],p[2],y),b=y=>pilAt(p[1],p[3],y),t=797,e=1303,lf=p[0]>1000;
      S({z:.02,w:1.5,t:1},()=>sg(b(t),t,b(e),e));S({z:.02,w:.7,t:.55},()=>sg(b(t)+2.5,t,b(e)+2.5,e));
      S({z:.02,w:lf?1.3:1,t:lf?.95:.82},()=>sg(a(t),t,a(e),e));});
    /* Pale mended patches beside window sills. Ref 06 at x 150 and x 1547. */
    S({z:.02,w:.7,t:.7,lod:.5},()=>{ln([[140,1259],[160,1258],[161,1262],[141,1263]],true);ln([[1537,1257],[1557,1256],[1558,1260],[1538,1261]],true);});

    /* Relieving arch: a stone band in stepped mouldings over the lunette. Each edge is an ellipse read from column scans of ref 06. */
    mark("relieving arch");{const z=.06,E=[580,570,987],T=[560,521,949],I=[470,378,822],mix=(p,q,u)=>p.map((v,i)=>v+(q[i]-v)*u),foot=e=>e[0]*Math.sqrt(1-((e[2]-664)/e[1])**2),edge=(e,n=120)=>{const q=[],f=foot(e);for(let i=0;i<=n;i++){const u=-1+2*i/n,x=u*f;q.push([975+x,e[2]-e[1]*Math.sqrt(1-(x/e[0])**2)]);}return q;};
      quads(edge(E),edge(I),z);
      S({z,w:1.4,t:1},()=>{ln(edge(E));ln(edge(I));});
      S({z,w:1,t:.92},()=>ln(edge(T)));
      S({z,w:.8,t:.7},()=>{ln(edge(mix(T,I,.5)));ln(edge(mix(T,I,.75)));});
      S({z,w:.6,t:.55},()=>{ln(edge(mix(E,T,.45)));ln(edge(mix(T,I,.56)));});
      S({z,w:.5,t:.4,lod:.6},()=>{ln(edge(mix(E,T,.72)));ln(edge(mix(T,I,.24)));ln(edge(mix(T,I,.86)));});
      /* Two seams in the band. */
      S({z,w:.6,t:.5,lod:.7},()=>{[-.77,.65].forEach(u=>{const P=e=>{const x=u*foot(e);return[975+x,e[2]-e[1]*Math.sqrt(1-(x/e[0])**2)];};ln([P(E),P(T),P(I)]);});});}

    /* A window of ref 06: a ring of upright bricks, keystone, double frame, sill, sash bars, a meeting rail and two fans. */
    const barRun=(a,b,c,e,o=1.3)=>{const dx=c-a,dy=e-b,l=Math.hypot(dx,dy)||1,nx=-dy/l*o,ny=dx/l*o;sg(a+nx,b+ny,c+nx,e+ny);sg(a-nx,b-ny,c-nx,e-ny);};
    const arched=w=>{const z=.08,yt=w.bars[0],bot=w.bars[6],Lx=y=>at(w.L,y),Rx=y=>at(w.R,y),gL=y=>at(w.iL,y),gR=y=>at(w.iR,y),sh=(w.L[1]-w.L[0]+w.R[1]-w.R[0])/440,xc=(Lx(yt)+Rx(yt))/2,a0=(Rx(yt)-Lx(yt))/2,gc=(gL(yt)+gR(yt))/2,ga=(gR(yt)-gL(yt))/2,gb=ga*.864,b0=a0*.915;
      const EL=(cx,a,b,t)=>{const c=Math.cos(t),s=Math.sin(t);return[cx-a*c-sh*b*s,yt-b*s-.005*a*c];},ARC=(cx,a,b,t0=0,t1=PI,n=36)=>{const q=[];for(let i=0;i<=n;i++)q.push(EL(cx,a,b,t0+(t1-t0)*i/n));return q;};
      /* Upright brick ring and its joints. */
      {const t0=.17,t1=PI-.17,oa=a0+19,ob=b0+22;S({z:.04,w:.8,t:.7},()=>{fl(ARC(xc,oa,ob,t0,t1),.04);ln(ARC(xc,oa,ob,t0,t1));S({w:.6,t:.5},()=>{const n=46;for(let i=0;i<=n;i++){const t=t0+(t1-t0)*i/n,p=EL(xc,a0,b0,t),q=EL(xc,oa,ob,t);sg(p[0],p[1],q[0],q[1]);}});S({w:.5,t:.34,lod:.9},()=>ln(ARC(xc,a0+9.5,b0+11,t0,t1)));});}
      /* Frame: fill, outer edge, returns, glass edge. */
      const out=[...ARC(xc,a0,b0),[Rx(bot+6),bot+6],[Lx(bot+6),bot+6]];
      S({z,w:1.5,t:1},()=>{fl(out,z);ln(ARC(xc,a0,b0));sg(Lx(yt),yt,Lx(bot+6),bot+6);sg(Rx(yt),yt,Rx(bot+6),bot+6);});
      const offs=[[.18,.7,.6],[.82,.7,.6]];offs.forEach(([f,wd,t])=>S({z,w:wd,t},()=>{const a=a0+(ga-a0)*f,b=b0+(gb-b0)*f,c=xc+(gc-xc)*f;ln(ARC(c,a,b));const l=y=>Lx(y)+(gL(y)-Lx(y))*f,r=y=>Rx(y)+(gR(y)-Rx(y))*f;sg(l(yt),yt,l(bot),bot);sg(r(yt),yt,r(bot),bot);}));
      S({z,w:1.1,t:.9},()=>{ln(ARC(gc,ga,gb));sg(gL(yt),yt,gL(bot),bot);sg(gR(yt),yt,gR(bot),bot);sg(gL(bot),bot+.5,gR(bot),bot+.5);});
      /* Sash bars: four panes across, three up and three down. */
      const Bx=(u,y)=>gL(y)+(gR(y)-gL(y))*u,Hy=(y,x)=>y+.005*(x-gc);
      S({z,w:.65,t:.66},()=>{[1,2,4,5].forEach(i=>{const y=w.bars[i];barRun(gL(y),Hy(y,gL(y)),gR(y),Hy(y,gR(y)),1.1);});barRun(gL(yt),Hy(yt,gL(yt)),gR(yt),Hy(yt,gR(yt)),1.1);
        [.25,.5,.75].forEach(u=>barRun(Bx(u,yt),Hy(yt,Bx(u,yt)),Bx(u,bot),Hy(bot,Bx(u,bot)),1.1));});
      /* Meeting rail and sash lift. */
      S({z,w:1,t:.92},()=>{const y=w.bars[3];barRun(gL(y)-2,Hy(y,gL(y)),gR(y)+4,Hy(y,gR(y)),2.2);});
      S({z,w:.6,t:.7,lod:.8},()=>{const y=w.bars[3],x=gR(y)+3;ln([[x,y-2],[x+3,y],[x+3,y+6],[x,y+7]],true);sg(gR(y)+1.5,y+7,gR(bot)+1.5,bot);});
      /* Inner fan of 2 panes, outer fan of 6. */
      S({z,w:.65,t:.66},()=>{const ia=ga/2,ib=gb*.5*1.0,q=[];for(let i=0;i<=20;i++)q.push(EL(gc,ia,ib,PI*i/20));ln(q);const q2=[];for(let i=0;i<=20;i++)q2.push(EL(gc,ia+2,ib+2,PI*i/20));ln(q2);
        const up=EL(gc,0,gb,PI/2),inr=EL(gc,0,0,PI/2);barRun(inr[0],inr[1],up[0],up[1],1.1);
        [PI/6,PI/3,2*PI/3,5*PI/6].forEach(t=>{const p=EL(gc,ia+2,ib+2,t),r=EL(gc,ga,gb,t);barRun(p[0],p[1],r[0],r[1],1);});});
      /* Pale strip of a blind in the second row, seen through the panes of ref 06. */
      S({z,w:.5,t:.3,lod:.5},()=>{const y=w.bars[1]-9;sg(gL(y),Hy(y,gL(y)),gR(y),Hy(y,gR(y)));sg(gL(y+7),Hy(y+7,gL(y)),gR(y+7),Hy(y+7,gR(y)));});
      /* The right-hand window reflects a dark building in ref 06: those panes carry hatching. */
      if(w.dark){const rows=[[.75,1,1,2],[.5,.75,2,3],[.75,1,2,3],[.75,1,3,4],[.25,.5,4,5],[.75,1,4,5],[.25,.5,5,6],[.75,1,5,6],[.25,1,6,7]];S({z,w:.5,t:.34,lod:.3},()=>rows.forEach(([u0,u1,r0,r1])=>{const y0=w.bars[r0-1]+2,y1=w.bars[r1-1]-2;for(let y=y0+3;y<y1;y+=3.4){sg(Bx(u0,y)+2,Hy(y,Bx(u0,y)),Bx(u1,y)-2,Hy(y,Bx(u1,y)));}}));
        S({z,w:.5,t:.34,lod:.3},()=>{for(let k=1;k<30;k++){const t=PI*.5+k/30*PI*.48,p=EL(gc,ga*.55,gb*.55,t),r=EL(gc,ga-1,gb-1,t);sg(p[0],p[1],r[0],r[1]);}});}
      /* Sill. */
      {const[a,b,t,e]=w.sill;S({z:z+.01,w:1.3,t:1},()=>{const q=[[a,t],[b,t],[b,e],[a,e]];fl(q,z+.01);ln(q,true);});S({z:z+.01,w:.7,t:.6},()=>{sg(a,e-5,b,e-5);sg(a+2,t+3.5,b-2,t+3.5);});}
      /* Keystone. */
      {const y0=yt-104,y1=yt-78,cx=y=>xc+sh*(y-yt),q=[[cx(y0)-11,y0],[cx(y0)+11,y0],[cx(y1)+7.5,y1],[cx(y1)-7.5,y1]];S({z:.1,w:1.3,t:1},()=>{fl(q,.1);ln(q,true);S({w:.5,t:.5,lod:.7},()=>{ln([[cx(y0+3)-8,y0+3],[cx(y0+3)+8,y0+3],[cx(y1-3)+5.5,y1-3],[cx(y1-3)-5.5,y1-3]],true);});});}
    };
    WINS.forEach(w=>{mark(w.part?"partial arched windows":"full arched windows");arched(w);});

    /* Oculi: a ring of bricks, a stone surround in steps, a central ring, two crossing bars and 12 spokes. Ref 06 crop at x 270-450. */
    OC.forEach(([cx,c])=>{mark("oculi");const sh=lean(cx),E=(a,b,t)=>{const s=Math.sin(t),k=Math.cos(t);return[cx+a*k+sh*b*s,c+b*s+.005*a*k];},R=(a,b,n=56)=>{const q=[];for(let i=0;i<=n;i++)q.push(E(a,b,i/n*TAU));return q;},z=.08;
      S({z:.04,w:.8,t:.7},()=>{fl(R(86,70),.04);ln(R(86,70));S({w:.6,t:.5},()=>{for(let i=0;i<68;i++){const t=i/68*TAU,p=E(76.5,61,t),q=E(86,70,t);sg(p[0],p[1],q[0],q[1]);}});});
      S({z,w:1.5,t:1},()=>{fl(R(76.5,61),z);ln(R(76.5,61));});
      S({z,w:.7,t:.62},()=>{ln(R(73,58.5));ln(R(65,53));});
      S({z,w:1.1,t:.92},()=>ln(R(60.5,49.5)));
      S({z,w:.65,t:.68},()=>{ln(R(32,25.5));ln(R(34.5,27.5));for(let i=0;i<12;i++){const t=i/12*TAU,p=E(34.5,27.5,t),q=E(60.5,49.5,t);barRun(p[0],p[1],q[0],q[1],1);}
        const a=E(32,25.5,0),b=E(32,25.5,PI),e=E(32,25.5,PI/2),f=E(32,25.5,-PI/2);barRun(a[0],a[1],b[0],b[1],1);barRun(e[0],e[1],f[0],f[1],1);});});

    /* Lunette: brick ring, stone frame, a centre sash between two mullions, and a quarter light each side. Ref 06 crop at x 750-1210. */
    mark("lunette");{const{cx,y:Y,fa,fb,ga,gb,ra,rb}=LUN,z=.08,EL=(a,b,t,x0=cx)=>[x0-a*Math.cos(t),Y-b*Math.sin(t)],ARC=(a,b,x0=cx,n=64)=>{const q=[];for(let i=0;i<=n;i++)q.push(EL(a,b,PI*i/n,x0));return q;},gx=973.5,glassTop=x=>Y-gb*Math.sqrt(Math.max(0,1-((x-gx)/ga)**2)),glassSide=y=>ga*Math.sqrt(Math.max(0,1-((Y-y)/gb)**2));
      S({z:.04,w:.9,t:.75},()=>{fl(ARC(ra,rb),.04);ln(ARC(ra,rb));S({w:.6,t:.5},()=>{const n=100;for(let i=0;i<=n;i++){const t=PI*i/n,p=EL(fa,fb,t),q=EL(ra,rb,t);sg(p[0],p[1],q[0],q[1]);}});S({w:.5,t:.34,lod:.9},()=>ln(ARC((ra+fa)/2,(rb+fb)/2)));});
      S({z,w:1.5,t:1},()=>{fl(ARC(fa,fb),z);ln(ARC(fa,fb));});
      S({z,w:.7,t:.62},()=>{ln(ARC(fa-5,fb-4.5));ln(ARC(fa-13,fb-9));ln(ARC(fa-22,fb-14.5));});
      S({z,w:1.1,t:.9},()=>ln(ARC(ga,gb,gx)));
      /* Mullions and centre sash: 4 panes across, 2 rows up and 2 down. */
      S({z,w:1.2,t:.95},()=>{[905,917,1035,1050].forEach(x=>sg(x,glassTop(x)-2,x,Y));ln([[918,557],[945,551],[977,549],[1008,551],[1036,556]]);});
      S({z,w:1,t:.92},()=>{barRun(918,609,1036,610,2.4);});
      S({z,w:.65,t:.66},()=>{[948,977,1005].forEach(x=>{barRun(x,551,x,607,1.1);barRun(x,613,x,Y,1.1);});barRun(918,578,1036,578,1.1);barRun(918,642,1036,642,1.1);});
      S({z,w:.6,t:.7,lod:.8},()=>{ln([[972,603],[984,603],[984,607],[972,607]],true);sg(915,598,918,600);sg(1036,598,1039,600);});
      /* Quarter lights. */
      S({z,w:.65,t:.66},()=>{[872,842,810].forEach(x=>barRun(x,glassTop(x),x,Y,1.1));[1082,1112,1143].forEach(x=>barRun(x,glassTop(x),x,Y,1.1));
        [582,612,643].forEach(y=>barRun(gx-glassSide(y),y,905,y,1.1));[582,613,645].forEach(y=>barRun(1050,y,gx+glassSide(y),y,1.1));});
      /* Two pigeons on the sill. Ref 06. */
      S({z:.2,w:.9,t:.85,lod:.4},()=>{const a=[[786,664],[790,658],[794,654],[799,654],[803,660],[802,664]],b=[[842,664],[848,660],[853,659],[856,653],[860,651],[863,653],[862,658],[857,662],[852,664]];fl(a,.2);fl(b,.2);ln(a,true);ln(b,true);});}

    /* Raking cornice: slate edge, corona mouldings, a bright fillet, dentils on a shadowed bed, lower mouldings. Offsets measured below the sky line of ref 06. */
    {const z=.5,rake=(off,x0=0,x1=W)=>{const l=x=>skyL(x)+off,r=x=>skyR(x)+off,q=[];if(x0<apexX)q.push([x0,l(x0)]);if(x0<apexX&&x1>apexX)q.push([apexX,l(apexX)]);if(x1>apexX)q.push([x1,r(x1)]);return q;};
      fl([[0,skyL(0)],[apexX,skyL(apexX)],[apexX,skyL(apexX)+rakeBot],[0,skyL(0)+rakeBot]],z);fl([[apexX,skyL(apexX)],[W,skyR(W)],[W,skyR(W)+rakeBot],[apexX,skyL(apexX)+rakeBot]],z);
      S({z,w:1.7,t:1},()=>{ln(rake(0));ln(rake(rakeBot-.5));});
      S({z,w:1.2,t:.95},()=>{ln(rake(27));ln(rake(30));ln(rake(8));});
      S({z,w:.9,t:.8},()=>{ln(rake(56));ln(rake(58.5));ln(rake(66));});
      S({z,w:.7,t:.6},()=>{ln(rake(13));ln(rake(18));ln(rake(23));ln(rake(32));ln(rake(49));ln(rake(53));ln(rake(62));});
      S({z,w:.5,t:.4,lod:.6},()=>{ln(rake(4));ln(rake(15.5));ln(rake(20.5));ln(rake(51));ln(rake(60));});
      /* Slate courses on the roof edge. */
      S({z,w:.5,t:.34,lod:1.3},()=>{for(let x=4;x<W;x+=11){const y=sky(x);sg(x,y+.5,x,y+7.5);}});
      /* Vertical joints in the corona, every sixth dentil or so. */
      S({z,w:.5,t:.34,lod:1.1},()=>{[180,420,660,1240,1480,1720].forEach(x=>{sg(x,sky(x)+8,x,sky(x)+27);});});
      /* Rake dentils at their read positions. */
      mark("dentil courses");
      const LX=[0,34,70,106,141,177,212,247,282,317,352,389,423,459,494,529,564,596,627,658,690,723,756,789,821,852,883,913,944],RX=[1005,1037,1068,1099,1130,1163,1195,1228,1262,1296,1329,1362,1396,1428,1462,1494,1526,1560,1596,1631,1665,1700,1735,1771,1806,1843,1880,1916];
      const dent=(xc,skyF,z2)=>{const P=(dx,dy)=>[xc+dx,skyF(xc+dx)+dy],hw=6.2+xc*0+(Math.abs(xc-apexX)/971.8)*1.2,face=[P(-hw,34),P(hw,34),P(hw-.6,42),P(-hw+.6,42)];
        S({z:z2,w:1.1,t:.98},()=>{fl([P(-hw,33),P(hw,33),P(hw-1,50),P(-hw+1,50)],z2);ln(face,true);});
        S({z:z2,w:.6,t:.6},()=>{ln([P(-hw+.6,42),P(-hw+1,49.5),P(hw-1,49.5),P(hw-.6,42)]);ln([P(-hw-.8,33),P(hw+.8,33)]);});
        S({z:z2,w:.5,t:.45,lod:.9},()=>{ln([P(-hw+2,36.5),P(hw-2,36.5)]);ln([P(hw+1.8,42),P(hw+1.2,50)]);});};
      LX.forEach(x=>dent(x,skyL,z+.02));RX.forEach(x=>dent(x,skyR,z+.02));
      /* The dentil at the apex is folded. */
      {const x=975.6,y=248.5,q=[[x-7,y+1.5],[x,y],[x+7,y+1.5],[x+7,y+8],[x-7,y+8]];S({z:z+.02,w:1.1,t:.98},()=>{fl([[x-8,y],[x+8,y],[x+8,y+15],[x-8,y+15]],z+.02);ln(q,true);});S({z:z+.02,w:.6,t:.6},()=>ln([[x-6.5,y+8],[x-6,y+15],[x+6,y+15],[x+6.5,y+8]]));}}

    /* Horizontal cornice and entablature: dentil course, plain frieze, stepped architrave. Levels from column scans of ref 06, stated at x 40. */
    {const z=.6,hy=(y,x)=>y+.0049*(x-40),hl=(y)=>sg(0,hy(y,0),W,hy(y,W));
      fl([[0,hy(665,0)],[W,hy(665,W)],[W,hy(768,W)],[0,hy(768,0)]],z);
      S({z,w:1.7,t:1},()=>{hl(665.5);hl(767.5);});
      S({z,w:1.2,t:.95},()=>{hl(670);hl(675);hl(711);hl(732);hl(741);hl(756);});
      S({z,w:.8,t:.72},()=>{hl(677);hl(694);hl(703);hl(707);hl(751);hl(764);});
      S({z,w:.6,t:.55},()=>{hl(668);hl(700);hl(709);hl(735);hl(738);hl(753.5);});
      S({z,w:.5,t:.34,lod:1.1},()=>{hl(697);hl(705);hl(746);hl(760);[210,640,1120,1560].forEach(x=>sg(x,hy(712,x),x,hy(732,x)));});
      mark("dentil courses");
      [3,37,72,108,144,180,216,251,286,322,357,393,429,464,500,535,570,604,639,674,710,743,775,808,841,874,906,939,973,1005,1038,1070,1103,1136,1170,1205,1241,1275,1311,1346,1381,1416,1452,1486,1521,1556,1591,1626,1661,1696,1731,1766,1801,1835,1870,1905].forEach(x=>{const y=hy(678,x),z2=z+.02;
        S({z:z2,w:1.1,t:.98},()=>{fl([[x-8,y],[x+8,y],[x+8,y+15.5],[x-8,y+15.5]],z2);ln([[x-7.3,y+1],[x+7.3,y+1],[x+7,y+8.5],[x-7,y+8.5]],true);});
        S({z:z2,w:.6,t:.6},()=>{ln([[x-6.6,y+8.5],[x-6.4,y+15.5],[x+7.6,y+15.5],[x+7.4,y+8.5]]);});
        S({z:z2,w:.5,t:.45,lod:.9},()=>{sg(x-5.5,y+3.2,x+5.5,y+3.2);sg(x+8.2,y+9,x+8.5,y+15.5);});});}

    /* Six Ionic pilaster capitals: abacus, two volutes, central palmette, bead band, bell, stepped collar. Template read from ref 06 at x 168, stated from that centre. */
    PIL.forEach(p=>{mark("pilaster capitals");const c=(pilAt(p[0],p[2],795)+pilAt(p[1],p[3],795))/2+1.5,dy0=.0049*(c-168),sh=lean(c),z=.8,Pt=(dx,dy)=>[c+dx+sh*dy,770+dy+dy0],V=a=>a.map(q=>Pt(q[0],q[1]));
      const body=V([[-44,-14],[-30,-10],[-10,-7],[0,-12],[10,-7],[30,-10],[44,-14],[44,-6],[39,6],[34,13],[29,20],[33,21],[33,27],[-33,27],[-34,21],[-29,20],[-34,13],[-39,6],[-44,-6]]);
      S({z,w:1.3,t:1},()=>{fl(body,z);ln(V([[-44,-14],[-30,-10],[-10,-6]]));ln(V([[10,-6],[30,-10],[44,-14]]));ln(V([[-44,-14],[-41,-9]]));ln(V([[44,-14],[41,-9]]));
        /* Collar. */
        const collar=V([[-34,20],[33,20],[33,23],[-34,23]]);ln(collar,true);ln(V([[-31,24.5],[30,24.5],[28,27],[-30,27]]),true);
        /* Bell under the volutes. */
        ln(V([[-20,11],[-27,20]]));ln(V([[20,11],[27,20]]));});
      S({z,w:.7,t:.68},()=>{ln(V([[-20,11],[20,11]]));ln(V([[-22,14],[22,14]]));});
      /* Volutes: a spiral and its groove. */
      const spiral=(cx,cy,R,turns,sgn,off,n=46)=>{const q=[];for(let i=0;i<=n;i++){const u=i/n,r=R*(1-.86*u),a=off+sgn*u*turns*TAU;q.push(Pt(cx+r*Math.cos(a),cy+r*Math.sin(a)*.92));}return q;};
      [[-29,1.5,1],[26.5,1.5,-1]].forEach(([vx,vy,sg0])=>{S({z,w:1.15,t:.98},()=>ln(spiral(vx,vy,11,2.1,sg0,sg0>0?-PI*.75:-PI*.25)));S({z,w:.6,t:.58},()=>ln(spiral(vx,vy,8.4,1.8,sg0,sg0>0?-PI*.75:-PI*.25)));S({z,w:.6,t:.7},()=>{const q=[];for(let i=0;i<=8;i++){const a=i/8*TAU;q.push(Pt(vx+1.5*Math.cos(a),vy+1.5*Math.sin(a)));}ln(q);});});
      /* Palmette and the two small buds beside it. */
      S({z,w:.9,t:.85},()=>{ln(V([[-11,3],[-6,-5],[-1,-12],[4,-12.5],[9,-7],[12,3]]));ln(V([[-11,3],[12,3]]));});
      S({z,w:.6,t:.62,lod:.35},()=>{ln(V([[-6,3],[-3,-4],[1,-9],[5,-5],[7,3]]));ln(V([[-2,3],[-.5,-3],[1,-5],[2.5,-2],[3.5,3]]));ln(V([[-14,5],[-12,-1],[-15,-4]]));ln(V([[15,5],[14,-1],[17,-4]]));[[-16,1,2.4],[16.5,1,2.4]].forEach(([x,y,r])=>{const q=[];for(let i=0;i<=10;i++){const a=i/10*TAU;q.push(Pt(x+r*Math.cos(a),y+r*Math.sin(a)));}ln(q);});});
      S({z,w:.5,t:.5,lod:.95},()=>{for(let k=-8;k<=8;k++){const x=k*2.3,q=[];for(let i=0;i<=6;i++){const a=i/6*TAU;q.push(Pt(x+.9*Math.cos(a),12.5+.9*Math.sin(a)));}ln(q);}for(let k=-3;k<=3;k++)sg(...Pt(k*7,15),...Pt(k*7.4,19.5));});});

    /* Pilaster bases: three stepped tiers of stone on the flashing, with bolts. Read from ref 06 at x 72, stated from each base's centre. */
    [[70,0],[432,0],[782,0],[1155,1],[1510,5],[1862,8]].forEach(([c,dy],i)=>{const z=.6,top=c+[5,3,.5,-1,-3,-5][i],Q=(x0,x1,y0,y1)=>[[x0,y0+dy],[x1,y0+dy],[x1,y1+dy],[x0,y1+dy]];
      const o=[[top-36,1301+dy],[top+36,1301+dy],[top+37,1308+dy],[top+33,1310+dy],[c+40,1314+dy],[c+41,1322+dy],[c+45,1324+dy],[c+47,1333+dy],[c-44,1333+dy],[c-42,1324+dy],[c-40,1322+dy],[c-38,1314+dy],[top-33,1310+dy],[top-37,1308+dy]];
      S({z,w:1.4,t:1},()=>{fl(o,z);ln(o,true);});
      S({z,w:.8,t:.75},()=>{sg(top-37,1308+dy,top+37,1308+dy);sg(c-38,1314+dy,c+40,1314+dy);sg(c-42,1324+dy,c+45,1324+dy);});
      S({z,w:.5,t:.44,lod:.8},()=>{sg(top-35,1304+dy,top+35,1304+dy);sg(c-40,1318+dy,c+41,1318+dy);sg(c-43,1328+dy,c+46,1328+dy);[-17,20].forEach(x=>{const q=[];for(let k=0;k<=8;k++)q.push([c+x+2.5*Math.cos(PI+k/8*PI),1333+dy+2.2*Math.sin(PI+k/8*PI)]);ln(q);});});});

    /* Lower entablature: flashing and clips on the ledge, moulded cornice, a frieze of panels with two-grooved tablets and small blocks beneath. Ref 06 crop at y 1290-1440. */
    {const z=.9,hy=(y,x)=>y+.0058*(x-40),hl=y=>sg(0,hy(y,0),W,hy(y,W));
      S({z:.03,w:.8,t:.7},()=>sg(0,hy(1325,0),W,hy(1325,W)));
      S({z:.03,w:.5,t:.5,lod:1.15},()=>{for(let x=20;x<W;x+=37.2){const y=hy(1333,x),q=[];for(let k=0;k<=7;k++)q.push([x+3*Math.cos(PI+k/7*PI),y+3*Math.sin(PI+k/7*PI)]);ln(q);}});
      fl([[0,hy(1334,0)],[W,hy(1334,W)],[W,H],[0,H]],z);
      S({z,w:1.7,t:1},()=>{hl(1334);hl(1339.5);});
      S({z,w:1.1,t:.92},()=>{hl(1360);hl(1375);});
      S({z,w:.8,t:.72},()=>{hl(1345);hl(1352);hl(1357);hl(1365);hl(1370);});
      S({z,w:.5,t:.38,lod:.9},()=>{hl(1348);hl(1362);hl(1372.5);});
      S({z,w:1,t:.85},()=>hl(1425));S({z,w:.7,t:.58},()=>hl(1428.5));
      const G=[-21,52,125,198,271,343,418,489,560,631,702,772,849,924,1000,1075,1150,1221,1293,1365,1437,1509,1581,1653,1725,1797,1869,1941];
      G.forEach((g,i)=>{const sh=lean(g)*.9,xa=(x,y)=>x+sh*(y-1402),Y=(y,x)=>hy(y,x),next=G[i+1];
        const col=(x,y0,y1)=>sg(xa(x,y0),Y(y0,x),xa(x,y1),Y(y1,x));
        /* Tablet: side edges, cap, and its two grooves. */
        S({z,w:1.2,t:.92},()=>col(g+21,1379,1425));S({z,w:.8,t:.66},()=>col(g-6,1383,1425));
        S({z,w:.8,t:.72},()=>[0,9.5].forEach(o=>{col(g+o-1.6,1386,1424);col(g+o+1.6,1386,1424);sg(xa(g+o-1.6,1424),Y(1424,g),xa(g+o+1.6,1424),Y(1424,g));sg(xa(g+o-1.6,1386),Y(1386,g),xa(g+o+1.6,1386),Y(1386,g));}));
        /* Block under the tablet and its row of drops. */
        S({z,w:.9,t:.8},()=>{ln([[g-15,Y(1429,g)],[g+15,Y(1429,g)],[g+15,Y(1436,g)],[g-15,Y(1436,g)]],true);});
        S({z,w:.5,t:.55,lod:.95},()=>{for(let k=-2;k<=2;k++){const x=g+k*5.2,y=Y(1432.5,g),q=[];for(let a=0;a<=6;a++)q.push([x+1.3*Math.cos(a/6*TAU),y+1.3*Math.sin(a/6*TAU)]);ln(q);}});
        /* Panel to the right: shadowed head and a raised strip above it. */
        if(next!==undefined){const a=g+22,b=next-7;S({z,w:1,t:.85},()=>sg(xa(a,1382),Y(1382,a),xa(b,1382),Y(1382,b)));S({z,w:.7,t:.62},()=>sg(xa(a+3,1376.5),Y(1376.5,a),xa(b-4,1376.5),Y(1376.5,b)));S({z,w:.5,t:.42,lod:.9},()=>{sg(xa(a+1,1384.5),Y(1384.5,a),xa(b,1384.5),Y(1384.5,b));sg(xa(a+2,1423),Y(1423,a),xa(b,1423),Y(1423,b));});}});}
  }});
