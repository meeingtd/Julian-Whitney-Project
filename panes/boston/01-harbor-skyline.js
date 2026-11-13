/* Boston skyline from East Boston. Reference: portfolio_refs/boston/01-harbor-skyline-panorama.jpg, read at its stored 3840 x 768.
   Every structure below is drawn in that photo's pixels and cites ref 01, the only picture of this whole front in the log. The log names only Custom House Tower, so the rest stay unnamed.
   Log notes: the crops show 4 flags, not 1, and 3 sailboat groups whose masts are drawn one by one from the crops.
   The whole front fits the width, so a photo pixel is about a third of a screen pixel at rest: floors wait for a little zoom, windows for more. A phone already opens far closer in, so nothing waits there.
   Weights: w 1.4 structure, 1 detail, .5 fine. z is depth, larger is nearer. lod is the zoom at which a detail starts to appear. */
window.PANE_DEFS.push({id:"boston-01",city:"boston",ref:"01",w:3840,h:768,color:0x7CC0B6,focus:[2052,400],
  trace:[[0,655],[0,575],[438,495],[553,312],[745,232],[823,222],[823,425],[908,425],[908,100],[1040,98],[1178,390],[1370,190],[1553,180],[1553,360],[1720,202],[1928,243],[1960,179],[2052,150],[2099,167],[2270,167],[2305,297],[2500,153],[2565,153],[2835,258],[2835,497],[3050,376],[3248,356],[3455,356],[3455,497],[3840,655]],peak:17,
  expect:{"clock faces":2,"pointed tower cap":1,"pyramid-capped round tower":1,"roof mast":1,flags:4,waterline:1,"rooftop-to-water layers":3},
  places:[{id:"harbor",at:[2052,269,-3],where:"Boston skyline, from East Boston",means:""}],
  draw(d){
    const {seg,line,fill,S,mark,rnd}=d,PI=Math.PI,TAU=PI*2,near=innerWidth<760?0:1,L=v=>v*near,WL=655;

    /* A solid block: fill, then left, top and right edges. Bottoms are hidden by what stands in front. */
    const block=(x0,y0,x1,y1,z,o={})=>S({z,w:o.w||1.4,t:o.t||.95},()=>{fill([[x0,y0],[x1,y0],[x1,y1],[x0,y1]],z);line([[x0,y1],[x0,y0],[x1,y0],[x1,y1]]);});
    const poly=(q,z,o={})=>S({z,w:o.w||1.2,t:o.t||.9},()=>{fill(q,z);line(q,{closed:true});});
    const hline=(x0,x1,y,z,w,t,lod=0)=>S({z,w,t,lod},()=>seg(x0,y,x1,y));
    const vline=(x,y0,y1,z,w,t,lod=0)=>S({z,w,t,lod},()=>seg(x,y0,x,y1));
    /* Punched windows: a floor line per row, then each window as its own small frame. */
    const punched=(x0,y0,x1,y1,z,rows,cols,o={})=>{const dy=(y1-y0)/rows,dx=(x1-x0)/cols,ix=o.ix===undefined?.22:o.ix,iy=o.iy===undefined?.24:o.iy;
      S({z:z+.01,w:.5,t:o.ft||.42,lod:L(o.fl===undefined?.5:o.fl)},()=>{for(let j=0;j<=rows;j++)seg(x0,y0+j*dy,x1,y0+j*dy);});
      S({z:z+.02,w:.5,t:o.wt||.6,lod:L(o.wl||1.35)},()=>{for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const a=x0+i*dx+dx*ix,b=x0+(i+1)*dx-dx*ix,c=y0+j*dy+dy*iy,e=y0+(j+1)*dy-dy*iy;seg(a,c,b,c);seg(b,c,b,e);seg(b,e,a,e);seg(a,e,a,c);}});};
    /* Ribbon windows: a double line per floor, cut by piers once zoomed. */
    const ribbon=(x0,y0,x1,y1,z,rows,cols,o={})=>{const dy=(y1-y0)/rows,dx=(x1-x0)/cols;
      S({z:z+.01,w:.6,t:o.ft||.5,lod:L(o.fl===undefined?.45:o.fl)},()=>{for(let j=0;j<=rows;j++)seg(x0,y0+j*dy,x1,y0+j*dy);});
      S({z:z+.02,w:.5,t:o.wt||.5,lod:L(1.1)},()=>{for(let j=0;j<rows;j++)seg(x0,y0+j*dy+dy*.55,x1,y0+j*dy+dy*.55);});
      S({z:z+.02,w:.5,t:o.wt||.5,lod:L(1.7)},()=>{for(let j=0;j<rows;j++)for(let i=0;i<=cols;i++){const x=x0+i*dx;seg(x,y0+j*dy,x,y0+j*dy+dy*.55);}});};
    /* Curtain wall: mullions first, then spandrels. */
    const curtain=(x0,y0,x1,y1,z,cols,rows,o={})=>{const dy=(y1-y0)/rows,dx=(x1-x0)/cols;
      S({z:z+.01,w:.6,t:o.t||.5,lod:L(o.fl===undefined?.3:o.fl)},()=>{for(let i=1;i<cols;i++)seg(x0+i*dx,y0,x0+i*dx,y1);});
      S({z:z+.01,w:.5,t:(o.t||.5)*.8,lod:L(1.25)},()=>{for(let j=1;j<rows;j++)seg(x0,y0+j*dy,x1,y0+j*dy);});};
    /* Round bay: edges, curved floor bands, mullions bunching toward the sides. */
    const rotunda=(cx,rx,y0,y1,z,n,m=8)=>{const ry=rx*.14;S({z,w:1.2,t:.95},()=>{const q=[];for(let i=0;i<=20;i++){const a=PI-i/20*PI;q.push([cx+rx*Math.cos(a),y0-ry*Math.sin(a)]);}fill([...q,[cx+rx,y1],[cx-rx,y1]],z);line(q);seg(cx-rx,y0,cx-rx,y1);seg(cx+rx,y0,cx+rx,y1);});
      S({z:z+.01,w:.6,t:.6,lod:L(.5)},()=>{for(let j=0;j<=n;j++){const y=y0+(y1-y0)*j/n;let p=null;for(let i=0;i<=16;i++){const a=PI*i/16,q=[cx-rx*Math.cos(a),y+ry*Math.sin(a)];if(p)seg(p[0],p[1],q[0],q[1]);p=q;}}});
      S({z:z+.01,w:.5,t:.5,lod:L(1.35)},()=>{for(let i=1;i<m;i++){const x=cx-rx*Math.cos(PI*i/m);seg(x,y0+ry*.8,x,y1);}});};
    const dome=(cx,rx,yb,yt,z,ribs=10)=>{S({z,w:1.1,t:.95},()=>{const q=[];for(let i=0;i<=24;i++){const a=PI-i/24*PI;q.push([cx+rx*Math.cos(a),yb-(yb-yt)*Math.sin(a)]);}fill(q,z);line(q);seg(cx-rx,yb,cx+rx,yb);});
      S({z:z+.01,w:.5,t:.55,lod:L(1)},()=>{for(let k=1;k<ribs;k++){const u=Math.cos(PI*k/ribs);let p=[cx+rx*u,yb];for(let i=1;i<=8;i++){const a=i/8*PI/2,q=[cx+rx*u*Math.cos(a),yb-(yb-yt)*Math.sin(a)];seg(p[0],p[1],q[0],q[1]);p=q;}}});};
    const gable=(x0,yb,xa,ya,x1,z,o={})=>poly([[x0,yb],[xa,ya],[x1,yb],[x1,o.y1||WL-4],[x0,o.y1||WL-4]],z,o);
    /* A row of arches at a shopfront or arcade. */
    const arches=(x0,x1,yt,yb,n,z,t=.75)=>S({z,w:.6,t,lod:L(.8)},()=>{const dx=(x1-x0)/n,r=dx*.36;for(let i=0;i<n;i++){const c=x0+(i+.5)*dx;let p=[c-r,yb];const q=[[c-r,yt+r]];for(let k=1;k<=7;k++){const a=PI-k/7*PI;q.push([c+r*Math.cos(a),yt+r-r*Math.sin(a)]);}q.push([c+r,yb]);q.forEach(v=>{seg(p[0],p[1],v[0],v[1]);p=v;});}});
    /* Sailboat at its mooring: mast and stays, hull, cabin. */
    const mast=(x,top,o={})=>{const b=o.b||WL-3,lean=o.lean||0;mark("sailboat masts");S({z:1.2,w:.7,t:.85},()=>seg(x,b,x+lean,top));S({z:1.2,w:.5,t:.45,lod:L(.9)},()=>{const h=b-top;seg(x+lean,top,x-h*.14,b);seg(x+lean,top,x+h*.16,b);seg(x+lean*.75,top+h*.65,x+h*.1,top+h*.68);});
      if(o.hull!==0){const r=o.hull||18;S({z:1.2,w:.8,t:.9},()=>{const q=[[x-r,b-4],[x+r,b-5],[x+r-5,b+2],[x-r+3,b+2]];fill(q,1.2);line(q,{closed:true});});S({z:1.21,w:.5,t:.6,lod:L(1)},()=>{line([[x-r*.5,b-4],[x-r*.4,b-8],[x+r*.25,b-8],[x+r*.4,b-5]]);});}};
    /* Motor yacht: stacked decks tapering up, a window line on each. */
    const yacht=(x0,x1,yb,h,decks=3,z=1.3)=>{for(let k=0;k<decks;k++){const a=x0+(x1-x0)*(.04+k*.1),b=x1-(x1-x0)*(.14+k*.1),t=yb-h*(k+1)/decks,u=yb-h*k/decks;poly(k?[[a,u],[a+3,t],[b-5,t],[b,u]]:[[x0,t+2],[x1,t],[x1-(x1-x0)*.07,u],[x0+2,u]],z+k*.01,{w:1,t:.92});S({z:z+k*.01+.005,w:.5,t:.6,lod:L(1)},()=>seg(a+3,(u+t)/2,b-5,(u+t)/2));}};
    const flag=(x,y,w,h,z,pole)=>{mark("flags");S({z,w:.7,t:.85},()=>seg(x,y,x,pole));poly([[x,y],[x-w,y+h*.28],[x-w,y+h*1.1],[x,y+h*.8]],z,{w:.7,t:.9});S({z:z+.01,w:.5,t:.6,lod:L(.9)},()=>{for(let k=1;k<4;k++)seg(x,y+h*.8*k/4,x-w,y+h*.28+h*.82*k/4);});};
    /* Irregular crown of a tree: ragged outline and a few inner sprigs. */
    const tree=(cx,cy,rx,ry,z,base)=>{const q=[];for(let i=0;i<30;i++){const a=i/30*TAU,k=.62+.2*Math.abs(Math.sin(a*3+cx))+rnd()*.34;q.push([cx+rx*k*Math.cos(a),cy+ry*k*Math.sin(a)]);}S({z,w:.6,t:.55},()=>{fill(q,z);line(q,{closed:true});});S({z:z+.01,w:.5,t:.5,lod:L(.7)},()=>{seg(cx,base,cx,cy);for(let i=0;i<14;i++){const a=-rnd()*PI,r=.3+rnd()*.5,x=cx+rx*r*Math.cos(a),y=cy+ry*r*Math.sin(a)*.8;seg(cx+(x-cx)*.2,cy+ry*.5,x,y);}});};

    /* FAR ROW. Everything here stands behind the mid towers. */

    /* Glass block, tilted roof, far left of the towers: ref 01 x 549-720. Pale band and lower glass stand in front of it. */
    poly([[552,312],[618,317],[720,332],[720,497],[549,497],[549,447],[552,447]],-7);curtain(554,330,720,447,-7,7,14,{t:.6});S({z:-6.99,w:.8,t:.7},()=>{seg(554,330,720,342);seg(554,338,720,350);});
    block(711,362,730,452,-6.8);curtain(712,362,729,452,-6.8,3,12);
    block(582,410,700,450,-6.6,{w:1});ribbon(582,418,700,450,-6.6,3,16);
    block(549,447,660,497,-6.5,{w:1});curtain(549,447,660,497,-6.5,12,7,{t:.55});
    vline(736,312,452,-7.2,.8,.7);S({z:-7.2,w:.5,t:.5,lod:L(.8)},()=>{for(let y=340;y<452;y+=18){seg(731,y,741,y);}});

    /* Slim pale tower with the louvred slot: ref 01 x 745-824. */
    block(745,232,760,497,-6.4);block(759,221,824,497,-6.3);S({z:-6.25,w:.7,t:.8},()=>{seg(770,221,770,218);seg(795,221,795,218);seg(770,218,795,218);});
    S({z:-6.38,w:.6,t:.65,lod:L(.35)},()=>{for(let y=240;y<497;y+=10.5)seg(745,y,760,y);});
    S({z:-6.25,w:.8,t:.8},()=>line([[775,272],[802,272],[802,382],[775,382]],{closed:true}));S({z:-6.24,w:.6,t:.6,lod:L(.4)},()=>{for(let y=282;y<382;y+=10)seg(775,y,802,y);});
    S({z:-6.26,w:.5,t:.32,lod:L(1.2)},()=>{for(let x=772;x<824;x+=13)seg(x,221,x,272);for(let y=236;y<272;y+=12)seg(759,y,824,y);for(let x=772;x<824;x+=13)seg(x,382,x,497);for(let y=394;y<497;y+=12)seg(759,y,824,y);});

    /* The tall round-cornered tower behind the beige one, brick below and grid above: ref 01 x 909-1042. */
    block(909,99,1042,590,-7);S({z:-6.99,w:1,t:.8},()=>{seg(980,99,980,300);seg(1012,99,1012,250);seg(909,302,982,302);});
    punched(909,108,980,302,-7,24,8,{fl:.45});curtain(980,108,1012,270,-7,3,14,{t:.45});punched(1012,108,1042,190,-7,10,4,{fl:.45});punched(909,308,970,590,-7,34,7,{fl:.5});

    /* Beige slab with the pyramid-capped drum: ref 01 x 970-1167. Saw-tooth balconies run down its front corner. */
    poly([[1027,165],[1062,137],[1100,165]],-5.6);S({z:-5.59,w:.8,t:.8},()=>seg(1062,137,1064,165));mark("pyramid-capped round tower");
    block(1007,165,1117,200,-5.65);S({z:-5.6,w:.6,t:.65,lod:L(.5)},()=>{for(let x=1013;x<1117;x+=9)seg(x,171,x,188);seg(1007,188,1117,188);});
    poly([[1105,205],[1132,202],[1142,220],[1165,242],[1167,585],[1105,585]],-5.9);punched(1107,250,1165,580,-5.9,38,7,{fl:.5,ft:.36});
    block(1167,305,1177,392,-6.1,{w:.9});block(1165,387,1197,478,-6.2);punched(1167,392,1196,478,-6.2,10,4);
    block(995,190,1045,640,-5.45);block(970,210,1000,642,-5.5);block(1045,205,1105,642,-5.4);
    punched(973,218,995,640,-5.5,48,2,{fl:.45,ix:.14});
    punched(1000,204,1022,640,-5.45,50,2,{fl:.45,ix:.14});
    S({z:-5.44,w:.7,t:.72,lod:L(.45)},()=>{for(let y=204;y<640;y+=17.4)line([[1022,y],[1037,y+2],[1037,y+11],[1022,y+11]]);});
    punched(1048,214,1103,640,-5.4,49,7,{fl:.42,ix:.16});

    /* The dark stepped tower right of the beige slab and its pale pier: ref 01 x 1205-1282. */
    poly([[1205,390],[1235,390],[1235,337],[1272,337],[1272,352],[1282,352],[1282,560],[1205,560]],-7);curtain(1207,395,1280,560,-7,6,18,{t:.4});curtain(1236,340,1270,392,-7,3,6,{t:.4});
    block(1220,477,1235,560,-6.8,{w:1});

    /* Tower with the dormered mansard and black right face: ref 01 x 1369-1553. */
    block(1500,186,1553,358,-7);block(1452,180,1500,462,-6.95);block(1369,190,1452,300,-7.05);
    S({z:-6.9,w:1,t:.85},()=>{for(let k=0;k<4;k++){const a=1410+k*17;line([[a,217],[a+7,205],[a+14,217]]);}line([[1400,205],[1418,188],[1480,188]]);seg(1400,205,1480,205);});
    ribbon(1372,222,1452,300,-7.05,6,7);ribbon(1452,222,1500,462,-6.95,22,4,{wt:.56});punched(1502,202,1551,355,-7,8,5,{fl:.45,wt:.42,ft:.3,ix:.1,iy:.12});

    /* Brown banded tower, flat-topped crown: ref 01 x 1282-1457. */
    block(1296,232,1444,260,-6);S({z:-5.99,w:.6,t:.6,lod:L(.4)},()=>{for(let x=1296+29.6;x<1444;x+=29.6)seg(x,236,x,256);seg(1296,236,1444,236);seg(1296,251,1444,251);});
    block(1282,260,1430,540,-6);block(1430,260,1457,540,-6.02,{t:.85});ribbon(1284,268,1430,540,-6,31,14);ribbon(1431,268,1456,540,-6.02,31,2,{wt:.36,ft:.32});

    /* Lower mid block in front of it, with the mirrored fin: ref 01 x 1277-1422, then x 1485-1642 with the large band windows. */
    block(1277,385,1422,540,-5.2,{t:.85});ribbon(1279,395,1405,540,-5.2,14,11,{wt:.4,ft:.34});S({z:-5.18,w:.8,t:.7},()=>line([[1407,385],[1425,420],[1425,520],[1412,540]]));S({z:-5.17,w:.5,t:.42,lod:L(1)},()=>{for(let k=0;k<10;k++){seg(1408+k,395+k*14,1422,398+k*14);}});
    block(1485,361,1642,500,-5.2);S({z:-5.18,w:.7,t:.72},()=>{seg(1487,378,1592,378);seg(1487,395,1592,395);seg(1592,366,1592,500);});S({z:-5.17,w:.6,t:.55,lod:L(.5)},()=>{for(let x=1487;x<1592;x+=13.2)seg(x,378,x,395);});ribbon(1487,402,1590,500,-5.2,10,9,{wt:.42,ft:.34});ribbon(1593,372,1640,500,-5.2,13,4,{wt:.4,ft:.32});

    /* Dark slab with stepped crown and its narrow side slab, then the tan slab: ref 01 x 1637-1929. */
    block(1637,295,1660,500,-6.2);ribbon(1638,300,1659,500,-6.2,22,2,{wt:.42,ft:.36});
    block(1717,202,1765,217,-6.1);S({z:-6.08,w:.6,t:.7},()=>{for(let k=0;k<5;k++)seg(1727+k*7,202,1727+k*7,196);});block(1699,217,1780,243,-6.1);punched(1701,220,1779,243,-6.1,3,8);
    block(1660,243,1780,472,-6.1);ribbon(1662,250,1778,472,-6.1,25,10,{wt:.38,ft:.32});S({z:-6.08,w:.8,t:.55},()=>seg(1760,332,1760,470));
    block(1780,239,1885,497,-6.3);block(1885,239,1929,497,-6.32,{t:.88});S({z:-6.29,w:.7,t:.75},()=>{seg(1780,262,1929,262);seg(1780,250,1885,250);});S({z:-6.28,w:.6,t:.6,lod:L(.5)},()=>{for(let k=0;k<8;k++)line([[1786+k*12.5,264],[1792+k*12.5,264],[1792+k*12.5,271],[1786+k*12.5,271]],{closed:true});});punched(1781,274,1884,497,-6.3,25,9,{fl:.42});ribbon(1886,270,1928,497,-6.32,25,3,{wt:.35,ft:.3});

    /* Curved blue glass behind the clock tower, and its dark low shoulder: ref 01 x 1960-2109. */
    S({z:-7.3,w:1.3,t:.85},()=>{const q=[[1960,328],[1960,186],[1972,173],[2045,167],[2100,167],[2100,215],[2109,215],[2109,500],[1960,500]];fill(q,-7.3);line(q.slice(0,-1));});curtain(1962,185,2050,328,-7.3,7,20,{t:.55});
    block(1929,322,2010,437,-7);curtain(1931,330,2009,437,-7,6,12,{t:.42});

    /* Mosaic of the brick tower with the arched top band: ref 01 x 2082-2200. */
    block(2082,288,2178,422,-6.4);block(2108,333,2200,422,-6.3);S({z:-6.38,w:.7,t:.7,lod:L(.45)},()=>{for(let k=0;k<11;k++){const a=2085+k*8.5;d.arc(a+3.4,298,3.4,4,PI,TAU,6);seg(a,298,a,303);seg(a+6.8,298,a+6.8,303);}seg(2082,306,2178,306);});punched(2084,309,2108,422,-6.4,12,3);punched(2110,342,2198,422,-6.3,9,10);

    /* Blue glass tower, stepped crown, dark right face: ref 01 x 2160-2305. */
    S({z:-6.8,w:.7,t:.75},()=>{[2222,2233,2244,2262].forEach(x=>seg(x,166,x,155));seg(2220,158,2236,158);});
    poly([[2160,500],[2160,202],[2180,197],[2180,182],[2207,180],[2207,166],[2279,166],[2279,186],[2305,190],[2305,500]],-6.8);
    S({z:-6.78,w:1,t:.8},()=>{seg(2277,187,2277,500);seg(2238,202,2238,495);seg(2207,180,2207,202);seg(2180,202,2279,202);});curtain(2162,205,2238,495,-6.8,7,30,{t:.55});curtain(2239,205,2277,495,-6.8,3,30,{t:.55});curtain(2278,190,2304,495,-6.8,2,28,{t:.34});

    /* Pale tower, arched top band, dark grid: ref 01 x 2305-2405. */
    block(2312,288,2350,302,-6.5,{w:1});block(2305,302,2405,505,-6.45);S({z:-6.43,w:.6,t:.65,lod:L(.5)},()=>{for(let k=0;k<7;k++)d.arc(2317+k*11,320,4,6,PI,TAU,6);seg(2305,328,2405,328);});ribbon(2306,334,2404,505,-6.45,23,13,{wt:.42,ft:.36});S({z:-6.42,w:.8,t:.65},()=>seg(2378,302,2378,500));

    /* Big brown tower with the square roof block and the chamfered glazed crown: ref 01 x 2408-2605. */
    block(2500,155,2565,197,-6.6);S({z:-6.58,w:.5,t:.6,lod:L(.4)},()=>{for(let x=2505;x<2565;x+=5.4)seg(x,157,x,195);});S({z:-6.58,w:.6,t:.7},()=>{seg(2525,155,2525,151);seg(2537,155,2537,150);});
    poly([[2410,252],[2455,237],[2455,203],[2465,197],[2605,197],[2605,540],[2410,540]],-6.55);S({z:-6.53,w:.9,t:.8},()=>{seg(2455,240,2605,232);seg(2510,250,2510,540);seg(2510,250,2605,212);});curtain(2457,205,2565,236,-6.55,12,3,{t:.5});curtain(2410,256,2510,272,-6.55,20,2,{t:.45});
    punched(2410,280,2510,530,-6.55,28,9,{fl:.5,ix:.2,iy:.2,wt:.62});punched(2512,222,2604,530,-6.55,35,8,{fl:.5,ix:.2,iy:.2,wt:.62});

    /* Twin slabs, right of it. The second carries the roof mast: ref 01 x 2605-2835. */
    block(2605,209,2725,558,-6.7);S({z:-6.68,w:.9,t:.75},()=>seg(2650,209,2650,558));ribbon(2606,255,2649,558,-6.7,26,4,{wt:.46,ft:.38});S({z:-6.66,w:.6,t:.6,lod:L(.5)},()=>{for(let k=0;k<4;k++)line([[2612+k*9,256],[2618+k*9,256],[2618+k*9,270],[2612+k*9,270]],{closed:true});[2632,2652,2680].forEach(x=>line([[x,240],[x+5,240],[x+5,245],[x,245]],{closed:true}));});ribbon(2651,258,2724,558,-6.7,38,7,{wt:.42,ft:.36});
    S({z:-6.9,w:.9,t:.85},()=>{seg(2740,175,2740,252);seg(2733,252,2747,252);});mark("roof mast");S({z:-6.9,w:.5,t:.65,lod:L(.5)},()=>{for(let y=200;y<250;y+=7){seg(2736,y,2744,y+3.5);seg(2744,y,2736,y+3.5);}});
    block(2725,252,2835,525,-6.85);S({z:-6.83,w:.7,t:.7},()=>seg(2725,268,2835,268));punched(2727,272,2833,525,-6.85,28,10,{fl:.45,ix:.14,iy:.22,ft:.36});

    /* MID ROW. Between the towers and the waterfront. */

    /* The small dark tower, the double-dished dark tower and the brown one behind it: ref 01 x 2861-3194. */
    block(2861,450,2928,510,-5);punched(2863,458,2926,510,-5,6,7,{ft:.34,wt:.42});
    /* Low roofs under it, and the small wind turbine: ref 01 x 2835-3135. */
    S({z:-2.4,w:1,t:.82},()=>{const q=[[2835,565],[2835,520],[2860,510],[2935,510],[2935,500],[2985,505],[2985,520],[3026,518],[3026,565]];fill(q,-2.4);line(q);});punched(2838,525,3024,565,-2.4,4,20,{ft:.32,wt:.42});
    S({z:-2.3,w:.6,t:.75},()=>{seg(3062,492,3062,518);seg(3062,492,3056,487);seg(3062,492,3070,490);seg(3062,492,3061,500);});
    block(3040,515,3085,545,-2.35,{w:1});block(3087,520,3135,545,-2.32,{w:1});
    block(3137,382,3194,478,-6);ribbon(3140,392,3193,478,-6,10,5,{wt:.42,ft:.34});S({z:-5.98,w:.6,t:.75},()=>{d.arc(3160,381,3,3,0,TAU,8);d.arc(3168,379,3,3,0,TAU,8);});
    poly([[3026,545],[3026,392],[3057,392],[3057,382],[3080,377],[3115,377],[3140,385],[3157,396],[3157,545]],-5.5);S({z:-5.48,w:.8,t:.7},()=>{seg(3043,392,3043,520);seg(3043,404,3157,412);});S({z:-5.47,w:.6,t:.7},()=>{d.arc(3060,381,3,3,0,TAU,8);});S({z:-5.47,w:.6,t:.5,lod:L(.5)},()=>{for(let x=3055;x<3155;x+=15)seg(x,430,x,520);for(let k=0;k<7;k++)line([[3058+k*14,410],[3058+k*14,422]]);});punched(3045,420,3156,520,-5.5,11,12,{fl:.8,ft:.3,wt:.45,iy:.3});

    /* The big fin-topped slab, with the set-back left part: ref 01 x 3247-3456. */
    block(3247,356,3305,552,-6.4);block(3305,352,3456,552,-6.3);S({z:-6.28,w:.6,t:.68,lod:L(.3)},()=>{for(let x=3312;x<3456;x+=7.5)seg(x,357,x,386);for(let x=3252;x<3305;x+=7.5)seg(x,360,x,386);seg(3247,387,3456,387);});punched(3249,392,3304,552,-6.4,16,7,{fl:.42,iy:.28,ix:.2});punched(3306,392,3455,552,-6.3,16,19,{fl:.42,iy:.28,ix:.2});

    /* Low block with balcony bays: ref 01 x 3136-3342. */
    poly([[3136,547],[3136,470],[3180,470],[3180,465],[3225,465],[3225,470],[3342,470],[3342,547]],-3.5);block(3136,470,3155,547,-3.45);S({z:-3.44,w:.5,t:.55,lod:L(.6)},()=>{for(let y=476;y<547;y+=3.8)seg(3136,y,3155,y);});S({z:-3.43,w:.8,t:.8},()=>{[3197,3237,3280].forEach(x=>line([[x-16,471],[x,484],[x+18,471]]));});for(let j=0;j<3;j++)for(let k=0;k<4;k++){const a=3158+k*33,c=485+j*21;S({z:-3.42,w:.6,t:.72,lod:L(.4)},()=>line([[a,c],[a+26,c],[a+26,c+16],[a,c+16]],{closed:true}));S({z:-3.41,w:.5,t:.5,lod:L(1.2)},()=>{seg(a+8,c,a+8,c+16);seg(a+16,c,a+16,c+16);seg(a,c+9,a+26,c+9);});}block(3295,470,3342,547,-3.45,{t:.8});punched(3297,478,3340,547,-3.45,4,3);

    /* Mid blocks, x 1455-1645: orange block, gold pinnacle, the pointed Victorian block. */
    block(1455,490,1485,540,-3.6);punched(1456,496,1484,540,-3.6,6,3);
    S({z:-3.7,w:1,t:.85},()=>line([[1530,480],[1530,464],[1540,464],[1542,460],[1548,460],[1550,470],[1557,470],[1557,480]]));block(1500,480,1595,540,-3.65);punched(1502,488,1594,540,-3.65,6,10);
    block(1530,527,1595,560,-3.2);punched(1532,533,1594,560,-3.2,3,7);
    poly([[1595,600],[1595,535],[1600,535],[1606,522],[1613,535],[1645,540],[1645,600]],-3.1);arches(1598,1644,575,598,4,-3.09);punched(1598,540,1644,573,-3.09,3,5);

    /* The set-back top and the striped beige block, with its pole: ref 01 x 1642-1810. */
    poly([[1710,495],[1712,462],[1770,460],[1770,478],[1805,478],[1805,495]],-3.4,{w:1});S({z:-3.5,w:.6,t:.7},()=>seg(1685,450,1685,495));
    block(1756,495,1830,600,-3.3,{t:.85});punched(1758,502,1829,600,-3.3,11,8,{ft:.34,wt:.42});
    block(1642,495,1756,625,-3);S({z:-2.98,w:.9,t:.9},()=>{seg(1638,497,1760,497);seg(1640,502,1758,502);});punched(1644,506,1755,622,-3,13,11,{fl:.42,ix:.18});

    /* The pale towered block, low left of the clock: ref 01 x 1920-2007, then the clock tower itself. */
    S({z:-4,w:1,t:.9},()=>{const q=[[1920,530],[1920,440],[1945,437],[1960,420],[1995,420],[2007,436],[2007,530]];fill(q,-4);line(q);});S({z:-3.98,w:.5,t:.55,lod:L(.7)},()=>{for(let x=1930;x<2005;x+=8)seg(x,442,x,488);});

    /* Custom House Tower. The only named landmark in this photo: ref 01, apex (2052,150). */
    {const z=-3.6;mark("pointed tower cap");
      poly([[2052,150],[2075,217],[2028,217]],z);S({z:z+.01,w:.9,t:.8},()=>{seg(2052,150,2064,217);seg(2052,150,2052,144);line([[2049,152],[2052,144],[2055,152]]);});
      S({z:z+.02,w:.6,t:.7,lod:L(.5)},()=>{[[2047,178,5,10],[2042,197,8,16],[2050,197,5,16]].forEach(g=>line([[g[0]-g[2],g[1]+g[3]],[g[0],g[1]],[g[0]+g[2],g[1]+g[3]]],{closed:true}));for(let k=1;k<5;k++)seg(2052-k*5,150+k*13,2052+k*4.6,150+k*13);});
      block(2022,217,2082,243,z);S({z:z+.01,w:.6,t:.7,lod:L(.5)},()=>{seg(2022,224,2082,224);seg(2022,236,2082,236);for(let x=2026;x<2082;x+=5)seg(x,224,x,236);});
      block(2025,243,2082,305,z);S({z:z+.01,w:.8,t:.85},()=>{seg(2020,246,2086,246);seg(2020,250,2086,250);seg(2065,250,2065,305);});
      S({z:z+.02,w:.9,t:.95},()=>{d.arc(2042,269,9,9,0,TAU,24);d.arc(2071,269,4,8,0,TAU,16);});mark("clock faces",2);S({z:z+.03,w:.5,t:.65,lod:L(.7)},()=>{d.arc(2042,269,7,7,0,TAU,20);for(let k=0;k<12;k++){const a=k/12*TAU;seg(2042+7*Math.cos(a),269+7*Math.sin(a),2042+8.6*Math.cos(a),269+8.6*Math.sin(a));}});
      S({z:z+.02,w:.6,t:.7,lod:L(.5)},()=>{for(let k=0;k<4;k++){const a=2032+k*6;d.arc(a+2.2,292,2.2,3,PI,TAU,6);seg(a,292,a,300);seg(a+4.4,292,a+4.4,300);seg(a,300,a+4.4,300);}});
      poly([[2025,305],[2082,305],[2095,318],[2012,318]],z,{w:1});S({z:z+.01,w:.6,t:.75,lod:L(.5)},()=>{line([[2016,318],[2018,311],[2024,311],[2026,318]]);line([[2086,318],[2088,311],[2093,311],[2095,318]]);});
      block(2010,318,2094,345,z);S({z:z+.01,w:.6,t:.65,lod:L(.5)},()=>{seg(2010,326,2094,326);seg(2010,338,2094,338);for(let x=2014;x<2094;x+=7)seg(x,326,x,338);});
      block(2007,345,2095,396,z);S({z:z+.01,w:1,t:.9},()=>{seg(2005,345,2097,345);seg(2005,349,2097,349);seg(2005,392,2097,392);seg(2005,396,2097,396);seg(2065,349,2065,392);});
      S({z:z+.02,w:.8,t:.82,lod:L(.3)},()=>{[[2022,2030],[2033,2042],[2046,2054],[2071,2078],[2080,2086]].forEach(g=>line([[g[0],392],[g[0],354],[g[1],354],[g[1],392]],{closed:true}));});
      block(2008,396,2094,525,z);S({z:z+.01,w:.9,t:.8},()=>seg(2065,396,2065,525));punched(2011,400,2064,525,z,11,6,{fl:.5,wt:.72,ix:.25,iy:.2});punched(2066,400,2093,525,z,11,3,{fl:.5,wt:.62,ix:.25,iy:.2});}

    /* Near glass block, gabled front and the lower right wing: ref 01 x 2075-2255. */
    poly([[2092,600],[2092,442],[2135,405],[2180,430],[2180,600]],-3);S({z:-2.98,w:1,t:.85},()=>{seg(2135,405,2227,435);line([[2180,430],[2227,435],[2250,440],[2255,470],[2255,600],[2180,600]]);seg(2075,460,2092,460);seg(2075,460,2075,600);});
    fill([[2180,430],[2227,435],[2250,440],[2255,470],[2255,600],[2180,600]],-3);fill([[2075,460],[2092,460],[2092,600],[2075,600]],-3);fill([[2135,405],[2227,435],[2180,430]],-3);
    S({z:-2.97,w:.8,t:.75},()=>{for(let x=2110;x<2180;x+=19)seg(x,425,x,600);seg(2092,442,2180,442);seg(2092,468,2180,468);seg(2092,520,2180,520);});curtain(2092,472,2180,600,-2.98,12,16,{t:.55});curtain(2182,472,2254,600,-2.98,9,18,{t:.5});S({z:-2.97,w:.5,t:.5,lod:L(.8)},()=>{for(let k=1;k<9;k++)seg(2097+k*9.4,442,2097+k*9.4,468);seg(2180,453,2252,453);});

    /* Low stone blocks behind the row houses: ref 01 x 2255-2530. */
    block(2255,505,2337,560,-2.6,{t:.8});punched(2257,512,2336,560,-2.6,5,8,{ft:.34,wt:.45});S({z:-2.5,w:.8,t:.75},()=>line([[2337,560],[2337,515],[2350,515],[2350,560]]));
    block(2368,525,2482,560,-2.5);S({z:-2.48,w:.8,t:.8},()=>{seg(2368,530,2482,530);});S({z:-2.6,w:.8,t:.7},()=>line([[2398,525],[2398,512],[2424,512],[2424,525]]));punched(2370,533,2480,560,-2.5,3,13,{wt:.6});block(2482,520,2530,560,-2.48);punched(2484,526,2529,560,-2.48,4,6);

    /* LOW LEFT. The far shore, the crane and the Rowes Wharf group. */

    /* Crane: mast, jib, counter-jib, ties. Ref 01 x 32-148. */
    S({z:-2,w:.8,t:.85},()=>{seg(113,542,113,590);seg(116,542,116,590);seg(32,552,148,555);seg(32,554,110,557);});S({z:-2,w:.5,t:.6,lod:L(.6)},()=>{seg(113,542,60,552);seg(113,542,140,554);for(let x=36;x<148;x+=8){seg(x,552.3,x+4,556);seg(x+4,556,x+8,552.5);}for(let y=546;y<590;y+=6){seg(113,y,116,y+3);seg(116,y+3,113,y+6);}});
    /* Far shore blocks and stack: ref 01 x 0-260. */
    block(0,570,28,650,-2,{w:1});punched(2,578,27,625,-2,5,3,{ft:.32,wt:.42});
    block(28,595,40,650,-1.9,{w:.9});
    block(50,586,140,650,-1.8,{w:1});punched(52,592,138,648,-1.8,6,12,{ft:.32,wt:.42});block(140,575,207,650,-1.7,{w:1});punched(142,582,205,620,-1.7,4,8,{ft:.32,wt:.42});
    block(72,570,77,652,-1.5,{w:.9});
    flag(172,562,7,5,-1.6,575);
    /* Black truss on the far pier: ref 01 x 200-260. */
    S({z:-1.5,w:.8,t:.82},()=>{seg(200,606,260,606);seg(200,650,200,606);seg(260,650,260,606);});S({z:-1.5,w:.5,t:.6,lod:L(.5)},()=>{seg(200,614,260,614);for(let x=210;x<260;x+=10){seg(x,606,x,650);seg(x-10,614,x,606);}});
    /* Pale saw-tooth blocks, far: ref 01 x 322-432. */
    S({z:-2,w:1,t:.85},()=>{const q=[[322,620],[322,604],[343,604],[343,575],[358,575],[358,581],[365,574],[378,574],[378,580],[395,575],[395,568],[432,566],[432,620]];fill(q,-2);line(q);});S({z:-1.99,w:.5,t:.5,lod:L(.7)},()=>{for(let y=588;y<620;y+=7)seg(396,y,432,y);seg(322,611,395,611);});
    flag(417,526,6,5,-1.5,600);

    /* Green glass block with its band on top, then the brick block: ref 01 x 437-629. */
    S({z:-2.5,w:1,t:.8},()=>line([[500,495],[500,484],[590,484],[590,495]]));
    block(437,497,629,635,-2.4);curtain(439,512,497,635,-2.4,6,18,{t:.55});S({z:-2.38,w:.7,t:.72},()=>{seg(437,512,629,512);seg(437,504,629,504);});curtain(500,497,628,512,-2.38,16,2,{t:.5});
    block(496,513,629,636,-2.2);S({z:-2.18,w:.5,t:.5,lod:L(.6)},()=>{for(let y=516;y<522;y+=2)seg(496,y,510,y);});punched(512,525,628,635,-2.2,8,13,{ft:.36,wt:.5});punched(498,525,511,635,-2.2,8,1,{ft:.36});
    /* Brick masses behind the wharf and the white bay tower: ref 01 x 630-937. */
    rotunda(715,30,438,530,-2.8,10);
    block(630,452,700,545,-2.5);punched(632,458,699,545,-2.5,8,7,{fl:.42,ix:.2});
    poly([[820,437],[819,422],[870,422],[870,437]],-2.4,{w:1});block(805,435,930,590,-2.5);S({z:-2.48,w:.8,t:.8},()=>seg(805,441,930,441));punched(807,445,928,590,-2.5,13,11,{fl:.42,ix:.2});S({z:-2.45,w:1,t:.85},()=>line([[930,590],[930,550],[937,552],[937,590]]));
    /* Teal dome and its drum, on the hotel: ref 01 x 730-802. */
    dome(767,36,512,492,-2);block(690,516,808,548,-1.9);punched(692,520,806,548,-1.9,3,16,{ix:.25});
    /* Rowes Wharf hotel block, chimney line, rotundas, arcade. */
    S({z:-1.3,w:1,t:.9},()=>{const q=[[700,650],[700,546],[712,546],[712,538],[722,538],[722,546],[745,546],[745,538],[757,538],[757,546],[790,544],[790,537],[804,537],[804,544],[840,548],[862,568],[862,650]];fill(q,-1.3);line(q);});punched(702,556,860,632,-1.3,7,16,{fl:.5,ix:.26});arches(702,860,634,650,15,-1.28,.7);
    S({z:-1.6,w:1,t:.85},()=>{const q=[[528,600],[528,568],[548,557],[580,557],[640,547],[712,548],[712,620],[528,620]];fill(q,-1.6);line(q.slice(0,5));});
    rotunda(558,20,562,600,-1.5,6);rotunda(610,30,552,607,-1.4,7);rotunda(684,28,548,607,-1.35,7);
    dome(550,16,617,600,-1.2,6);
    block(562,607,700,644,-1.1,{w:1});arches(564,698,618,644,10,-1.09);S({z:-1.08,w:.7,t:.75},()=>seg(562,612,700,612));

    /* Foreground podium and aquarium block, canopy, pier panels: ref 01 x 866-1250. */
    S({z:-1,w:.8,t:.8},()=>{[[866,884],[900,922],[934,955]].forEach(g=>line([[g[0],645],[g[0]+4,630],[g[1]+4,630],[g[1],645]],{closed:true}));});
    block(1087,572,1250,630,-1.2);S({z:-1.18,w:.9,t:.85},()=>{line([[1092,580],[1132,580],[1132,595],[1092,595]],{closed:true});d.arc(1099,587,4,3,0,TAU,10);});S({z:-1.17,w:.6,t:.7,lod:L(.6)},()=>{for(let x=1140;x<1250;x+=22)seg(x,597,x,630);seg(1087,597,1250,597);});S({z:-1.3,w:.8,t:.8},()=>line([[1130,572],[1130,558],[1180,555],[1180,570]]));
    S({z:-.9,w:1,t:.9},()=>{const q=[[1045,601],[1090,601],[1135,615],[1050,612]];fill(q,-.9);line(q,{closed:true});seg(1055,612,1055,645);seg(1125,614,1125,645);});
    flag(1187,503,31,17,-.6,647);
    yacht(1105,1245,650,38,3,1.1);

    /* LOW RIGHT OF AQUARIUM. Warehouses, brick gables, skylight roof, the ziggurat: ref 01 x 1250-2100. */
    block(1250,537,1345,620,-1.8,{t:.8});S({z:-1.75,w:1,t:.85},()=>{const q=[[1280,572],[1296,555],[1382,555],[1370,572]];fill(q,-1.75);line(q,{closed:true});});S({z:-1.74,w:.5,t:.5,lod:L(.8)},()=>{for(let x=1300;x<1382;x+=9)seg(x,556,x-8,571);});ribbon(1252,575,1344,620,-1.8,4,8,{ft:.32,wt:.4});
    gable(1346,595,1395,559,1440,-1.1,{y1:640});S({z:-1.08,w:.6,t:.65,lod:L(.5)},()=>{for(let j=0;j<4;j++)for(let k=0;k<5;k++){const a=1356+k*16,c=586+j*13;if(j===0&&(k===0||k===4))continue;line([[a,c],[a+6,c],[a+6,c+8],[a,c+8]],{closed:true});}});
    gable(1265,632,1284,617,1305,-.9,{y1:652});arches(1267,1303,636,652,3,-.88);
    /* Dark low row behind the boats, roofline and one chimney: ref 01 x 1441-1600. */
    S({z:-1,w:1,t:.8},()=>{const q=[[1441,640],[1441,578],[1478,572],[1478,553],[1486,553],[1486,572],[1530,566],[1600,572],[1600,640]];fill(q,-1);line(q.slice(0,-1));});punched(1444,584,1598,638,-1,4,13,{ft:.3,wt:.42});
    S({z:-1.5,w:.8,t:.7,lod:L(.3)},()=>{hline(1600,1640,597,-1.5,.8,.7);});
    /* Ziggurat: stepped brick on the great sloping roof. */
    S({z:-2.2,w:1.3,t:.92},()=>{const q=[[1800,512],[1860,512],[2075,522],[2100,565],[2100,600],[1905,640],[1800,640]];fill(q,-2.2);line(q.slice(0,4));});
    S({z:-2.18,w:.5,t:.55,lod:L(.45)},()=>{for(let j=0;j<7;j++){const y=530+j*10;seg(1860,y,2090-j*2,y+4);}});
    S({z:-2.17,w:.5,t:.48,lod:L(1.2)},()=>{for(let j=0;j<7;j++)for(let x=1868;x<2082;x+=15){const y=526+j*10+(x-1860)*.018;line([[x,y+6],[x+4,y],[x+8,y+6]]);}});
    poly([[1800,535],[1860,535],[1850,512],[1812,512]],-1.9,{w:1});S({z:-1.88,w:.6,t:.7,lod:L(.5)},()=>{for(let y=518;y<535;y+=5)seg(1810,y,1852,y);line([[1824,512],[1824,520],[1836,520],[1836,512]]);});
    poly([[1757,625],[1800,566],[1860,566],[1905,630],[1905,645],[1757,645]],-1.6);S({z:-1.58,w:.8,t:.85},()=>{for(let k=0;k<4;k++){const y=566+k*16;seg(1798-k*7,y+14,1862+k*7,y+14);}});punched(1800,546,1860,566,-1.6,3,10,{ix:.15});
    S({z:-1.6,w:1,t:.9},()=>{line([[1800,566],[1800,535],[1860,535],[1860,566]]);});curtain(1802,572,1860,600,-1.58,8,2,{t:.6});
    /* Low brick base at the wharf: ref 01 x 1725-1850. */
    block(1725,620,1850,650,-.9);arches(1727,1848,630,650,9,-.88);

    /* Pavilion on the pier, double-gabled: ref 01 x 2020-2200. */
    S({z:-.8,w:1.1,t:.92},()=>{const q=[[2020,645],[2020,606],[2052,585],[2090,590],[2110,572],[2135,588],[2200,600],[2200,645]];fill(q,-.8);line(q);seg(2020,606,2200,612);});S({z:-.78,w:.6,t:.7,lod:L(.5)},()=>{for(let x=2030;x<2120;x+=11)line([[x,612],[x+7,612],[x+7,622],[x,622]],{closed:true});seg(2020,625,2125,625);seg(2020,630,2125,630);for(let x=2024;x<2124;x+=5)seg(x,625,x,630);});

    /* Long dark row house and shed roof: ref 01 x 2257-2800. */
    gable(2200,597,2230,555,2258,-.7,{y1:645});S({z:-.68,w:.7,t:.8},()=>{d.arc(2229,576,5,5,0,TAU,12);});S({z:-.67,w:.5,t:.6,lod:L(.6)},()=>{for(let k=0;k<3;k++){seg(2208,604+k*12,2252,604+k*12);seg(2208,608+k*12,2252,608+k*12);for(let x=2212;x<2252;x+=8)seg(x,600+k*12,x,604+k*12);}});
    S({z:-1.4,w:1,t:.85},()=>{const q=[[2625,560],[2650,538],[2795,538],[2805,560]];fill(q,-1.4);line(q,{closed:true});});S({z:-1.38,w:.5,t:.55,lod:L(.5)},()=>{for(let x=2655;x<2800;x+=12){seg(x,540,x-14,558);}});
    S({z:-1,w:1.3,t:.9},()=>{const q=[[2258,650],[2258,560],[2800,560],[2800,650]];fill(q,-1);line(q.slice(0,4));});S({z:-.98,w:.7,t:.7},()=>{seg(2258,566,2800,566);seg(2258,640,2800,640);});S({z:-.97,w:.5,t:.6,lod:L(.4)},()=>{for(let x=2262;x<2800;x+=15.5)seg(x,560,x+6,553);});punched(2260,572,2798,638,-1,5,35,{fl:.5,ix:.25,iy:.2,wt:.55});

    /* Roof, arcaded block, stone mansard block, then the long row to the marina: ref 01 x 2750-3395. */
    S({z:-1.3,w:1,t:.85},()=>{const q=[[2750,562],[2780,537],[2845,537],[2870,572],[2870,620],[2750,620]];fill(q,-1.3);line(q.slice(0,4));});
    block(2847,532,2980,566,-1.8,{w:1});punched(2849,538,2978,566,-1.8,3,14,{ix:.14,wt:.65});
    block(2855,566,2912,640,-1.2,{t:.75});punched(2857,572,2910,640,-1.2,6,6,{ft:.34,wt:.45});
    S({z:-.6,w:1.3,t:.95},()=>{const q=[[2912,648],[2912,565],[2925,540],[3002,540],[3015,565],[3015,648]];fill(q,-.6);line(q);seg(2912,565,3015,565);});punched(2916,546,3011,564,-.58,2,8,{fl:9,ix:.18});punched(2915,568,3013,642,-.6,6,7,{fl:.5,ix:.26,wt:.7});
    S({z:-.57,w:.5,t:.68,lod:L(.6)},()=>{[584,616].forEach(y=>{seg(2935,y,2990,y);for(let x=2935;x<=2990;x+=5)seg(x,y,x,y-5);seg(2935,y-5,2990,y-5);});});
    S({z:-.9,w:1.2,t:.88},()=>{const q=[[3015,648],[3015,540],[3395,540],[3395,648]];fill(q,-.9);line(q.slice(0,4));});S({z:-.88,w:.7,t:.68},()=>seg(3015,546,3395,546));punched(3017,552,3393,646,-.9,7,30,{fl:.5,ix:.26,iy:.22,wt:.55});

    /* Brick hall with the three rows of arched windows, and its rear wing: ref 01 x 3375-3710. */
    S({z:-2,w:1,t:.85},()=>{const q=[[3442,520],[3442,503],[3465,497],[3500,497],[3512,503],[3512,520]];fill(q,-2);line(q);const r=[[3520,527],[3525,500],[3585,500],[3590,527]];fill(r,-2);line(r);});
    S({z:-1.5,w:1,t:.85},()=>{const q=[[3515,640],[3515,525],[3540,525],[3585,552],[3585,640]];fill(q,-1.5);line(q);});punched(3518,560,3584,638,-1.5,4,5,{ft:.34,wt:.5,ix:.3});
    S({z:-1.45,w:1,t:.85},()=>{const q=[[3585,640],[3585,552],[3710,556],[3710,640]];fill(q,-1.45);line(q);seg(3585,530,3640,530);seg(3640,530,3690,540);seg(3690,540,3710,556);seg(3585,530,3585,552);});fill([[3585,530],[3640,530],[3690,540],[3710,556],[3585,552]],-1.46);punched(3590,558,3708,630,-1.45,5,11,{ft:.34,wt:.5,ix:.28});
    S({z:-.7,w:1.3,t:.95},()=>{const q=[[3430,642],[3430,558],[3472,530],[3515,558],[3515,642]];fill(q,-.7);line(q);});
    S({z:-.68,w:.7,t:.82,lod:L(.3)},()=>{[[3459,3473,3488,556],[3443,3472,3488,576],[3443,3472,3488,596]].forEach((g,j)=>[g[0],g[1],g[2]].forEach(c=>{const y=g[3],r=4;d.arc(c,y,r,r*1.2,PI,TAU,8);seg(c-r,y,c-r,y+11);seg(c+r,y,c+r,y+11);seg(c-r,y+11,c+r,y+11);}));});
    gable(3375,622,3397,600,3420,-.5,{y1:647});S({z:-.48,w:.6,t:.7,lod:L(.5)},()=>{d.arc(3397,630,6,8,PI,TAU,8);seg(3391,630,3391,647);seg(3403,630,3403,647);});

    /* Far right: pale modern block, small block with balconies: ref 01 x 3692-3840. */
    block(3692,535,3825,600,-1.8,{w:1});ribbon(3694,542,3823,570,-1.8,3,10,{ft:.4});
    block(3737,572,3805,625,-1.4,{w:1});punched(3739,578,3804,625,-1.4,5,6,{ft:.38});
    block(3805,560,3840,640,-1.5,{w:.9});

    /* Trees along the wall, and the bare one against the row. */
    [[3430,620,14,18],[3460,622,18,24],[3610,620,20,24],[3640,628,22,20],[3715,625,24,18],[3742,630,18,14],[3360,620,14,20],[3235,612,16,22],[3512,630,12,14]].forEach(q=>tree(q[0],q[1],q[2],q[3],-.3,WL-4));

    /* THE WATER'S EDGE. Three layers meet here: rooftops, wharf, water. Ref 01 waterline y about 655. */
    mark("rooftop-to-water layers",3);mark("waterline");
    S({z:.4,w:1.3,t:.9},()=>{const q=[[0,WL],[3840,WL],[3840,WL-6],[0,WL-6]];fill(q,.4);seg(0,WL,3840,WL);});
    S({z:.42,w:.6,t:.65},()=>{seg(980,WL-4,1240,WL-4);seg(1635,WL-4,2050,WL-4);seg(3345,WL-6,3750,WL-6);});
    /* Seawall posts on the right, pilings on the piers. */
    S({z:.42,w:.6,t:.7,lod:L(.5)},()=>{for(let x=3350;x<3750;x+=19)seg(x,WL-13,x,WL-6);for(let x=1640;x<2050;x+=34)seg(x,WL-14,x,WL-4);for(let x=2010;x<2200;x+=16)seg(x,WL-22,x,WL-6);});
    S({z:.3,w:.6,t:.7},()=>{[[3685,590],[3787,588]].forEach(g=>{seg(g[0],WL-6,g[0],g[1]);seg(g[0]-3,g[1],g[0]+3,g[1]);});});

    flag(1458,543,6,5,-.5,560);

    /* Masts, read one by one from the crops. Left marina: ref 01 x 30-500. */
    [[30,590,14],[55,595,12],[105,590,26],[160,588,18],[175,593,0],[223,588,22],[270,587,24],[308,586,20],[365,590,18],[395,588,16],[450,600,22],[500,592,24]].forEach(g=>mast(g[0],g[1],{hull:g[2]||0}));
    /* Middle pier: x 1465-1650 and the raking one. */
    mast(1465,545,{lean:35,hull:40});[[1590,590,14],[1625,595,14]].forEach(g=>mast(g[0],g[1],{hull:g[2]}));
    /* Row-house moorings: x 2242-2800. */
    mast(2242,552,{hull:28});mast(2327,565,{hull:14});mast(2453,552,{hull:34});mast(2657,560,{hull:26});
    [2750,2758,2766,2775,2790,2797].forEach((x,i)=>mast(x,570+(i%3)*9,{hull:i%2?0:10}));
    /* Marina, ref 01 x 3067-3318. */
    [3067,3076,3090,3100,3109,3125,3136,3149,3163,3189,3202,3215,3227,3240,3245,3258,3266,3274,3282,3292,3300,3309,3318].forEach((x,i)=>mast(x,575+((i*7)%4)*9,{hull:i%3?7:12}));
    /* Motor boats on the piers: x 1370-1985, 2200-2270. */
    [[1400,1450,28],[1530,1590,34],[1630,1670,26],[1780,1830,22],[1900,1985,32],[2200,2270,28],[2462,2525,24],[735,790,16],[3090,3130,10]].forEach(g=>yacht(g[0],g[1],WL-1,g[2],2,1.1));
    /* Moored hulls, the left marina, the long white pair. */
    [[135,192],[255,290],[340,395],[500,535]].forEach(g=>poly([[g[0],WL-6],[g[1],WL-7],[g[1]-6,WL],[g[0]+4,WL]],1.15,{w:.8,t:.9}));

    /* Water. Ripples lengthen and fade toward the viewer; mooring balls sit near the far edge. */
    S({z:1.6,w:.5,t:near?.3:.46},()=>{for(let i=0;i<70;i++){const u=rnd(),y=WL+6+u*u*104,x=rnd()*3840,l=20+u*150+rnd()*70;seg(x,y,x+l,y);}});
    S({z:1.6,w:.5,t:.34,lod:L(.75)},()=>{for(let i=0;i<340;i++){const u=rnd(),y=WL+4+u*u*108,x=rnd()*3840,l=8+u*70+rnd()*26;seg(x,y,x+l,y);}});
    S({z:1.6,w:.5,t:.28,lod:L(1.5)},()=>{for(let i=0;i<620;i++){const u=rnd(),y=WL+3+u*108,x=rnd()*3840,l=4+u*30+rnd()*10;seg(x,y,x+l,y);}});
    S({z:1.65,w:.6,t:.75,lod:L(.8)},()=>{[[410,662],[425,664],[520,660],[620,660],[632,662],[765,659],[782,660],[1000,660],[1020,659],[1060,660],[1310,661],[1600,661],[3100,662],[3180,663],[3300,664],[3450,662],[3480,664],[3610,663]].forEach(g=>d.arc(g[0],g[1],1.6,1.4,0,TAU,6));});
  }});
