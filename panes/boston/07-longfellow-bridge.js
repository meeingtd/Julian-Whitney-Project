/* Longfellow Bridge, broadside from the river. Reference: portfolio_refs/boston/07-longfellow-bridge.jpg, read at its stored 1920 x 960.
   Every structure below is drawn in that photo's pixels and cites ref 07, the only picture of this place in the log. The background buildings stay unnamed: the log could not verify them.
   Long lens, so verticals stay vertical; the deck climbs to the right at about .038 and everything on it grows about 18 percent from x 500 to x 1850.
   Log check: the car count was estimated at 6. The crops show gaps at x 678, 867, 1058, 1255, 1462 and ends at 498 and 1675, so 6 is confirmed.
   The temporary orange signs in the photo are left out on purpose. The scaffolding that carries them is drawn.
   Weights: w 1.6 structure, 1 detail, .6 fine. z is depth, lod the zoom at which a detail appears. */
window.PANE_DEFS.push({id:"boston-07",city:"boston",ref:"07",w:1920,h:960,color:0x7CC0B6,focus:[1000,640],
  trace:[[0,770],[0,287],[45,290],[50,440],[136,440],[136,230],[140,182],[185,182],[190,228],[186,440],[228,440],[232,362],[243,343],[258,343],[266,352],[309,303],[357,310],[357,278],[438,282],[438,320],[483,323],[567,368],[567,497],[592,497],[593,348],[620,348],[622,412],[655,400],[657,377],[829,377],[838,405],[950,425],[968,443],[1165,443],[1245,450],[1245,380],[1345,376],[1345,363],[1408,363],[1408,377],[1533,377],[1533,600],[1543,486],[1646,481],[1646,447],[1800,447],[1800,470],[1860,469],[1920,482],[1920,770]],peak:6,
  expect:{piers:4,"arch spans":4,"train on deck":1,"train cars":6,smokestacks:4,cranes:2,"pier caps":4},
  places:[{id:"bridge",at:[1140,668,.5],where:"Longfellow Bridge, Charles River",means:""}],
  draw(d){
    const {seg,fill,S,mark,rnd}=d,W=1920,H=960,PI=Math.PI,TAU=PI*2;

    /* Everything is clipped to the photo's frame. */
    const sg=(a,b,c,e)=>{let t0=0,t1=1;const dx=c-a,dy=e-b;for(const[p,q]of[[-dx,a],[dx,W-a],[-dy,b],[dy,H-b]]){if(p===0){if(q<0)return;}else{const r=q/p;if(p<0){if(r>t1)return;if(r>t0)t0=r;}else{if(r<t0)return;if(r<t1)t1=r;}}}seg(a+t0*dx,b+t0*dy,a+t1*dx,b+t1*dy);};
    const ln=(q,closed)=>{for(let i=0;i<q.length-1;i++)sg(q[i][0],q[i][1],q[i+1][0],q[i+1][1]);if(closed)sg(q[q.length-1][0],q[q.length-1][1],q[0][0],q[0][1]);};
    const clip=(q,i,v,s)=>{const o=[];for(let k=0;k<q.length;k++){const a=q[k],b=q[(k+1)%q.length],A=(a[i]-v)*s>=0,B=(b[i]-v)*s>=0;if(A)o.push(a);if(A!==B){const u=(v-a[i])/(b[i]-a[i]);o.push([a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u]);}}return o;};
    const fl=(q,z)=>{const r=clip(clip(q,0,0,1),0,W,-1);if(r.length>2)fill(r,z-.004);};
    const R=(a,b,c,e)=>[[a,b],[c,b],[c,e],[a,e]];
    const box=(a,b,c,e,z,w=1,t=.8)=>S({z,w,t},()=>{fl(R(a,b,c,e),z);ln(R(a,b,c,e),true);});
    const lerp=(a,b,u)=>a+(b-a)*u;
    /* Smooth curve through read points, sampled by distance. */
    const curve=(p,step=4)=>{const o=[];for(let i=0;i<p.length-1;i++){const a=p[Math.max(0,i-1)],b=p[i],c=p[i+1],e=p[Math.min(p.length-1,i+2)],n=Math.max(2,Math.ceil(Math.hypot(c[0]-b[0],c[1]-b[1])/step));for(let k=0;k<n;k++){const t=k/n,t2=t*t,t3=t2*t;o.push([.5*(2*b[0]+(c[0]-a[0])*t+(2*a[0]-5*b[0]+4*c[0]-e[0])*t2+(3*b[0]-a[0]-3*c[0]+e[0])*t3),.5*(2*b[1]+(c[1]-a[1])*t+(2*a[1]-5*b[1]+4*c[1]-e[1])*t2+(3*b[1]-a[1]-3*c[1]+e[1])*t3)]);}}o.push(p[p.length-1]);return o;};
    const yAt=(q,x)=>{if(x<=q[0][0])return q[0][1];for(let i=0;i<q.length-1;i++)if(x<=q[i+1][0])return lerp(q[i][1],q[i+1][1],(x-q[i][0])/((q[i+1][0]-q[i][0])||1));return q[q.length-1][1];};

    /* Value noise, used for water, smoke and foliage so that nothing repeats. */
    const hash=(i,j)=>{const s=Math.sin(i*127.1+j*311.7)*43758.5453;return s-Math.floor(s);};
    const vn=(x,y)=>{const i=Math.floor(x),j=Math.floor(y),u=x-i,v=y-j,a=u*u*(3-2*u),b=v*v*(3-2*v);return lerp(lerp(hash(i,j),hash(i+1,j),a),lerp(hash(i,j+1),hash(i+1,j+1),a),b);};
    const inside=(q,x,y)=>{let c=false;for(let i=0,j=q.length-1;i<q.length;j=i++){if((q[i][1]>y)!==(q[j][1]>y)&&x<(q[j][0]-q[i][0])*(y-q[i][1])/(q[j][1]-q[i][1])+q[i][0])c=!c;}return c;};

    /* A window on a wall: solid, framed, with mullions, and a sill up close. */
    const wn=(x,y,w,h,z,o={})=>{const q=R(x,y,x+w,y+h);S({z:z+.01,w:o.w||.8,t:o.t||.62},()=>{fl(q,z+.01);ln(q,true);if(o.m)S({w:.5,t:(o.t||.62)*.7,lod:o.ml===undefined?.9:o.ml},()=>{for(let i=1;i<=o.m;i++){const a=x+w*i/(o.m+1);sg(a,y,a,y+h);}});if(o.r)S({w:.5,t:(o.t||.62)*.7,lod:1},()=>{for(let i=1;i<=o.r;i++){const a=y+h*i/(o.r+1);sg(x,a,x+w,a);}});if(o.sill!==0)S({w:.5,t:(o.t||.62)*.85,lod:1.2},()=>{sg(x-.8,y+h+1,x+w+.8,y+h+1);});});};
    /* Shade is a hatch: closer lines read darker, against the bright lines of the structure. */
    const hatch=(a,b,c,e,step,t,z,lod=0,sl=0)=>S({z,w:.5,t,lod},()=>{for(let y=b+step*.5;y<e;y+=step)sg(a,y,c,y+sl*(c-a));});
    /* Brick: courses, then bonded joints only when zoomed in. */
    const brick=(a,b,c,e,z,step=2.6,t=.2,lod=1.3)=>{step=Math.max(step,3.1);S({z,w:.5,t,lod},()=>{for(let y=b+step;y<e;y+=step)sg(a,y,c,y);});S({z,w:.5,t:t*.95,lod:lod+1.3},()=>{let k=0;for(let y=b;y<e;y+=step,k++)for(let x=a+(k%2?4:0);x<c;x+=8)sg(x,y,x,Math.min(e,y+step));});};
    /* A lattice jib: two chords and a zigzag. */
    const truss=(a,b,c,e,h,n,z,t=.75)=>{S({z,w:1,t},()=>{sg(a,b,c,e);sg(a,b+h,c,e+h);});S({z,w:.55,t:t*.72},()=>{for(let i=0;i<n;i++){const u0=i/n,u1=(i+.5)/n,u2=(i+1)/n;sg(lerp(a,c,u0),lerp(b,e,u0)+h,lerp(a,c,u1),lerp(b,e,u1));sg(lerp(a,c,u1),lerp(b,e,u1),lerp(a,c,u2),lerp(b,e,u2)+h);}});};

    /* Foliage: a lumpy silhouette filled with short curling marks that follow a noise field and gather in clumps, with hollows left open. No radial or repeated mark. */
    const foliage=(pts,z,o={})=>{const q=curve(pts,5),xs=q.map(p=>p[0]),ys=q.map(p=>p[1]),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys),seed=rnd()*90,t=o.t||.5,dens=(o.d||.16)*.68,grain=o.g||.07;
      S({z},()=>fl(q,z));
      const n=(x1-x0)*(y1-y0)*dens;
      /* Tiny turning dabs: direction changes every few pixels, tone follows soft clumps lit from upper right. */
      S({z,w:.55},()=>{for(let i=0;i<n;i++){const x=x0+rnd()*(x1-x0),y=y0+rnd()*(y1-y0);if(!inside(q,x,y))continue;const c=vn(x*grain+seed,y*grain),f=vn(x*.22+seed,y*.22);if(c+f*.5<.55)continue;const a=rnd()*TAU,l=1.1+rnd()*1.7,b=a+(rnd()>.5?1:-1)*(.8+rnd()),mx=x+Math.cos(a)*l,my=y+Math.sin(a)*l;
        S({t:t*(.32+.8*c),lod:i%3===2?1.3:0},()=>{sg(x,y,mx,my);sg(mx,my,mx+Math.cos(b)*l,my+Math.sin(b)*l);});}});
      /* A broken edge: dabs along the silhouette, never a closed line. */
      S({z,w:.55,t:t*.7},()=>{q.forEach((p,i)=>{if(vn(i*.33+seed,3)<.45)return;const a=rnd()*TAU,l=1+rnd()*2;sg(p[0]+(rnd()-.5)*3,p[1]+(rnd()-.5)*3,p[0]+Math.cos(a)*l,p[1]+Math.sin(a)*l);});});};
    /* A bare crown: limbs split and thin as they climb. */
    const limb=(x,y,a,l,k,t,z)=>{if(k<=0||l<1)return;const x1=x+Math.cos(a)*l,y1=y+Math.sin(a)*l;S({z,w:k>2?.8:.5,t:t*(k>2?1:.75),lod:k>2?0:k>1?.6:1.5},()=>sg(x,y,x1,y1));const kids=k>4?3:2;for(let i=0;i<kids;i++)limb(x1,y1,a+(i-(kids-1)/2)*(.55+rnd()*.5)+(rnd()-.5)*.25,l*(.66+rnd()*.14),k-1,t,z);};

    /* Smoke: the outer edge of a chain of overlapping puffs. Each puff is hidden where another covers it. */
    const smoke=(path,z,t=.7)=>{const c=[];path.forEach(([x,y,r])=>{c.push([x,y,r]);for(let i=0;i<2;i++){const a=rnd()*TAU;c.push([x+Math.cos(a)*r*.7,y+Math.sin(a)*r*.7,r*(.5+rnd()*.3)]);}});
      S({z},()=>c.forEach(([x,y,r])=>{const q=[];for(let i=0;i<12;i++){const a=i/12*TAU;q.push([x+r*Math.cos(a),y+r*Math.sin(a)]);}fl(q,z);}));
      S({z,w:.55,t},()=>c.forEach(([x,y,r],i)=>{const n=Math.max(8,Math.ceil(r*2.4));for(let k=0;k<n;k++){const a=k/n*TAU,b=(k+1)/n*TAU,w=f=>1+.28*(vn(x*.7+f*2.1,y*.7+i)-.5),p=[x+r*w(k)*Math.cos(a),y+r*w(k)*Math.sin(a)],e=[x+r*w(k+1)*Math.cos(b),y+r*w(k+1)*Math.sin(b)];if(c.some((o,j)=>j!==i&&Math.hypot(p[0]-o[0],p[1]-o[1])<o[2]*.96)||vn(x*.3+k*.8,y*.3+i)<.32)continue;sg(p[0],p[1],e[0],e[1]);}}));
      /* Soft curls inside the puffs, seen only up close. */
      S({z:z+.001,w:.5,t:t*.5,lod:.8},()=>c.forEach(([x,y,r],i)=>{if(r<3.5)return;const a0=vn(x,y+i)*TAU,n=6;for(let k=0;k<n;k++){const a=a0+k/n*2.4,e=a0+(k+1)/n*2.4,rr=r*.55;sg(x+rr*Math.cos(a),y+rr*Math.sin(a),x+rr*Math.cos(e),y+rr*Math.sin(e));}}));};

    /* A smokestack: rim, rings, galleries with railing and brackets. Measured by column scans of ref 07. */
    const stack=(s)=>{mark("smokestacks");const z=s.z,{a,b}=s,lean=s.lean||0,A=y=>a-lean*(y-s.top),B=y=>b+lean*(y-s.top);
      S({z,w:1.5,t:s.t||1},()=>{fl([[A(s.top),s.top],[B(s.top),s.top],[B(s.bot),s.bot],[A(s.bot),s.bot]],z);ln([[A(s.top),s.top],[A(s.bot),s.bot]]);ln([[B(s.top),s.top],[B(s.bot),s.bot]]);sg(A(s.top),s.top,B(s.top),s.top);});
      S({z,w:.8,t:.62},()=>s.rings.forEach(y=>sg(A(y),y,B(y),y)));
      S({z,w:.5,t:.32,lod:1},()=>s.rings.forEach(y=>sg(A(y),y+1.6,B(y),y+1.6)));
      /* Shaded side: curved faces read as thinner, closer verticals toward the right. */
      S({z,w:.5,t:.3,lod:.5},()=>{const w=b-a;[.62,.74,.84,.92].forEach(u=>{const x=a+w*u;sg(x,s.top+6,x,s.bot);});});
      if(s.brick)S({z,w:.5,t:.28,lod:.9},()=>{for(let y=s.top+7,k=0;y<s.bot;y+=2.2,k++){sg(A(y),y,B(y),y);}});
      if(s.brick)S({z,w:.5,t:.24,lod:2},()=>{let k=0;for(let y=s.top+7;y<s.bot;y+=2.2,k++)for(let x=A(y)+(k%2?2:0);x<B(y);x+=4)sg(x,y,x,y+2.2);});
      (s.gal||[]).forEach(g=>{const p=g.x0,e=g.x1,y=g.y;
        S({z:z+.02,w:1.2,t:.92},()=>{fl(R(p,y,e,y+g.h),z+.02);ln(R(p,y,e,y+g.h),true);});
        S({z:z+.02,w:.65,t:.68},()=>{sg(p,y-g.rail,e,y-g.rail);for(let x=p;x<=e;x+=(e-p)/8)sg(x,y-g.rail,x,y);});
        S({z:z+.02,w:.5,t:.5,lod:.9},()=>{sg(p,y-g.rail*.5,e,y-g.rail*.5);for(let x=p;x<=e;x+=(e-p)/24)sg(x,y-g.rail,x,y);});
        S({z:z+.02,w:.8,t:.7},()=>{sg(p+2,y+g.h,a+2,y+g.h+g.br);sg(e-2,y+g.h,b-2,y+g.h+g.br);sg(a,y+g.h+g.br,b,y+g.h+g.br);});
        S({z:z+.02,w:.5,t:.5,lod:.8},()=>{for(let x=a+3;x<b;x+=4)sg(x,y+g.h,x,y+g.h+g.br);});});};

    /* Sky: long high cloud bands of ref 07, kept dim. */
    S({z:-7,w:.5},()=>{for(let i=0;i<60;i++){const y=Math.pow(rnd(),1.3)*150+rnd()*30,x=rnd()*W,l=160+rnd()*420,t=.09+rnd()*.07,sl=-.02+rnd()*.02;S({t,lod:i%2?.7:0},()=>{let px=x,py=y;for(let k=1;k<=6;k++){const nx=x+l*k/6,ny=y+sl*l*k/6+(vn(nx*.01,y*.03)-.5)*5;sg(px,py,nx,ny);px=nx;py=ny;}});}
      [[1400,92,1700,86],[1420,96,1640,92],[240,104,360,118],[260,130,350,126],[840,285,1240,290],[900,296,1180,300]].forEach(([a,b,c,e])=>S({t:.17},()=>sg(a,b,c,e)));});

    /* Far construction seen beside the tall stack: frame, floor slabs and braces. Ref 07 crop at x 183-228, y 440-510. */
    {const z=-5.4;S({z},()=>fl(R(183,444,228,505),z));
      S({z,w:.8,t:.6},()=>{[446,462,478,495].forEach(y=>sg(183,y,228,y));[185,198,212,226].forEach(x=>sg(x,444,x,505));});
      S({z,w:.5,t:.4},()=>{[450,466,482].forEach(y=>sg(183,y,228,y));sg(198,446,206,462);sg(212,462,204,478);sg(186,478,198,495);});
      /* Tanks and pipes on the far roofs. Ref 07 at x 50-140, y 438-455. */
      S({z,w:.7,t:.5},()=>{ln(R(52,441,66,456));ln(R(66,439,80,456));sg(84,441,130,441);sg(84,446,130,446);sg(100,441,100,455);sg(115,441,115,455);sg(186,439,226,439);sg(186,442,226,442);});
      S({z,w:.5,t:.3,lod:.9},()=>{[55,58,61,69,72,75].forEach(x=>sg(x,441,x,456));});}

    /* Dark tall block behind the left crane, cut by the frame. Ref 07 at x 0-45. */
    {const z=-4.6;S({z,w:1.5,t:.95},()=>{fl(R(0,287,44,610),z);sg(0,287,43,288);sg(43,288,43,605);});
      [303,331,359,388,417,445,473,503,533,561].forEach((y,i)=>{S({z,w:.7,t:.52},()=>{ln(R(0,y,16,y+19));ln(R(27,y-3,41,y+17));});S({z,w:.5,t:.32},()=>{sg(0,y+9,16,y+9);sg(27,y+7,41,y+7);sg(34,y-3,34,y+17);if(i%2)sg(8,y,8,y+19);});S({z,w:.5,t:.22,lod:1.2},()=>{sg(0,y+4,16,y+4);sg(0,y+14,16,y+14);sg(27,y+2,41,y+2);sg(27,y+12,41,y+12);sg(4,y,4,y+19);sg(12,y,12,y+19);});});
      brick(0,288,44,610,z,3,.15,1.5);}

    /* Crane left: mast against the block, head, jib, tie lines, hook and two flags. Ref 07 crop at x 0-345, y 230-320. */
    mark("cranes");{const z=-4.2;
      S({z,w:.9,t:.8},()=>{sg(43,292,43,440);sg(48,292,50,440);});S({z,w:.5,t:.55},()=>{for(let y=292,k=0;y<438;y+=7,k++)sg(k%2?43:48.5,y,k%2?49:43,y+7);});
      S({z,w:1.1,t:.85},()=>{ln([[22,240],[31,285],[43,285],[34,240],[22,240]]);ln([[34,240],[45,282]]);});S({z,w:.5,t:.55},()=>{for(let k=0;k<7;k++){const y=244+k*6;sg(23+(y-240)*.2,y,36+(y-240)*.22,y+3);}});
      /* Jib to x 343, its counter jib to the frame. */
      truss(48,277,342,256,9,30,z,.85);truss(0,283,48,279,8,5,z,.7);
      S({z,w:1,t:.9},()=>{ln([[342,256],[343,261],[341,265]]);});
      S({z,w:.55,t:.6},()=>{sg(38,241,140,241);sg(40,243,124,268);sg(183,242,270,257);sg(36,241,0,258);sg(22,252,0,265);});
      S({z,w:.5,t:.42},()=>{sg(46,287,140,292);ln(curve([[183,292],[250,285],[340,266]],14));});
      /* Hook block and flags. */
      S({z,w:.9,t:.8},()=>{ln([[53,286],[56,298],[54,308],[57,314]]);ln(R(52,285,60,290));});S({z,w:.6,t:.6},()=>{ln([[56,316],[62,318],[61,323],[56,322]],true);ln([[28,232],[33,233],[32,236],[28,236]],true);sg(28,232,28,240);});
      S({z,w:.5,t:.4,lod:1.2},()=>{sg(57,318,61,319);sg(57,320,61,321);sg(29,234,32,234.5);});}

    /* Crane right: mast above the green roof and a second jib, read at x 510-718. Ref 07 crop b. */
    mark("cranes");{const z=-4.3;truss(510,352,717,335,7,22,z,.8);
      S({z,w:.9,t:.82},()=>{sg(549,322,549,352);sg(553,322,553,352);ln([[716,334],[718,338],[716,342]]);});
      S({z,w:.5,t:.55},()=>{for(let y=324,k=0;y<351;y+=5,k++)sg(k%2?549:553,y,k%2?553:549,y+5);sg(551,321,470,320);sg(551,321,640,340);sg(552,322,508,351);ln(curve([[560,358],[640,350],[717,341]],14));});}

    /* Dark far building beyond the laboratory: open roof steel and a glazed side. Ref 07 crop at x 838-952, y 386-560. */
    {const z=-4;S({z},()=>fl([[838,406],[950,425],[950,445],[915,445],[915,560],[838,560]],z));
      S({z,w:1,t:.7},()=>{ln([[838,406],[950,425],[950,442]]);sg(838,420,950,437);});
      S({z,w:.6,t:.5},()=>{for(let x=846;x<950;x+=11){const y=407.5+(x-838)*.17;sg(x,y,x,y+17);sg(x,y,x+11,y+15.5);}});
      S({z,w:.8,t:.7},()=>{sg(899,386,899,416);sg(901,392,901,416);sg(909,398,909,418);sg(896,405,905,405);});
      S({z,w:.6,t:.42},()=>{for(let x=866;x<915;x+=8)sg(x,448,x,560);for(let y=470;y<560;y+=20)sg(860,y,915,y);ln([[860,437],[899,438],[918,455],[915,478],[860,478]]);});
      hatch(838,470,915,560,3,.17,z);S({z,w:.5,t:.32,lod:1},()=>{for(let y=441;y<478;y+=3.2)sg(860,y,915,y);});}

    /* The stepped brick block with a glass top and green roof. Ref 07 crops a and b, x 225-567. */
    {const z=-3.7;
      /* Two tall roof blocks. */
      S({z,w:1.5,t:1},()=>{fl(R(357,278,416,345),z);ln([[357,312],[357,278],[416,278],[416,345]]);fl(R(416,282,438,340),z);ln([[416,282],[438,282],[438,336]]);});
      S({z,w:.5,t:.42},()=>{sg(416,289,420,289);sg(426,282,426,340);});hatch(416,283,438,338,2.4,.22,z);brick(357,278,416,345,z,2.6,.18,1.1);
      /* Mechanical top on the second block. */
      S({z,w:.7,t:.55},()=>{ln([[416,290],[422,284],[428,284],[428,290]]);});
      /* Standing-seam roof: main slope, then the long fall to the right eave. */
      S({z,w:1.5,t:1},()=>{fl([[309,303],[357,310],[438,320],[483,323],[567,368],[350,356]],z+.02);ln([[309,303],[357,310]]);ln([[438,320],[483,323],[567,368]]);});
      S({z:z+.02,w:.5,t:.34,lod:.5},()=>{for(let i=0;i<34;i++){const u=i/34,x=lerp(322,480,u);sg(x,lerp(305,322,u),x+lerp(32,62,u),lerp(354,362,u));}});
      S({z:z+.02,w:.5,t:.26,lod:1.5},()=>{for(let i=0;i<102;i++){const u=i/102,x=lerp(322,480,u);if(i%3)sg(x,lerp(305,322,u),x+lerp(32,62,u),lerp(354,362,u));}});
      S({z:z+.03,w:.6,t:.45},()=>{sg(350,345,490,354);sg(355,350,500,357);for(let x=358;x<480;x+=14)sg(x,345+(x-350)*.064,x,353+(x-350)*.05);});
      /* Gable: bright rakes, dark loggia, dishes and a railing. */
      S({z:z+.05,w:1.4,t:1},()=>{const g=[[267,352],[309,303],[351,352]];fl(g,z+.05);ln(g,true);ln([[272,350],[309,309],[346,350]]);});
      S({z:z+.06,w:.6,t:.55},()=>{sg(309,309,309,350);sg(288,332,330,332);ln(R(283,342,291,350));[[293,339,3.2],[305,337,3],[316,339,3.2],[323,342,2.2]].forEach(([x,y,r])=>{const q=[];for(let k=0;k<=10;k++)q.push([x+r*Math.cos(k/10*TAU),y+r*Math.sin(k/10*TAU)*.8]);ln(q);sg(x,y+r*.8,x,350);});});
      S({z:z+.06,w:.5,t:.34,lod:.9},()=>{for(let x=274;x<346;x+=4)sg(x,346,x,350);sg(274,346,346,346);for(let i=1;i<7;i++){sg(272+i*3,350-i*5.4,346-i*3,350-i*5.4);}});
      /* Fascia over the glass. */
      S({z:z+.04,w:1.3,t:.95},()=>{ln([[225,362],[267,352],[440,356],[567,368]]);ln([[225,365],[268,358],[440,360],[566,372]]);sg(225,362,225,365);});
      S({z:z+.04,w:.5,t:.5,lod:.8},()=>{sg(268,355,440,358);sg(440,358,566,370);});
      /* Top floor of glass. */
      S({z},()=>fl([[270,360],[567,372],[567,520],[227,530],[227,388],[270,388]],z));
      S({z,w:1,t:.78},()=>{sg(278,393,567,393);sg(278,396,567,396);});
      S({z,w:.6,t:.5},()=>{for(let x=282;x<566;x+=8.3){sg(x,yAt([[270,360],[440,361],[567,372]],x)+1,x,392);}sg(278,378,567,378);});
      S({z,w:.5,t:.3,lod:1.3},()=>{for(let x=286;x<566;x+=8.3)sg(x,367,x,392);sg(278,368,567,368);sg(278,385,567,385);});
      /* Glazed bay with balcony floors. */
      S({z,w:1.2,t:.9},()=>{sg(278,362,278,505);sg(325,362,325,505);});
      [374,393,420,447,473].forEach(y=>S({z,w:.8,t:.72},()=>{sg(278,y,325,y);sg(278,y+2.5,325,y+2.5);}));
      S({z,w:.6,t:.45},()=>{for(let x=285;x<325;x+=8){sg(x,396,x,420);sg(x,423,x,447);sg(x,450,x,473);sg(x,476,x,505);}});
      S({z,w:.5,t:.3,lod:1.1},()=>{[408,435,461,490].forEach(y=>sg(278,y,325,y));for(let x=289;x<325;x+=8){sg(x,396,x,505);}});
      /* Left wing and main brick face. */
      S({z,w:1.3,t:.95},()=>{sg(227,388,278,388);sg(227,388,227,533);sg(327,376,327,520);sg(327,376,380,376);sg(566,396,566,520);});
      brick(227,389,278,533,z,2.6,.18,1.2);brick(327,396,566,520,z,2.6,.18,1.2);hatch(380,400,456,520,3.2,.13,z,.6);
      [[235,398],[235,425],[235,453],[235,480],[235,510],[267,398],[267,425],[267,453],[267,480],[267,510]].forEach(([x,y])=>wn(x-3,y-6,6,12,z,{t:.55,r:1}));
      const rows=[[398,410],[425,432],[453,455],[478,483],[510,512]];
      [335,352,372,384,396,416,431,445,490,500,511,522,533,544,555].forEach(x=>{const lit=x===335||x===352||x===416||x===396,w=lit?9:6.4;rows.forEach(([a,b])=>{const c=lerp(a,b,Math.min(1,(x-335)/210));wn(x,c-6.5,w,13,z,{t:lit?.9:.5,w:lit?.9:.7,m:lit?1:0,r:1});});});
      /* Roof machine box and a low parapet at its foot. */
      box(290,483,343,505,z+.1,.9,.6);S({z:z+.1,w:.5,t:.32,lod:.9},()=>{for(let x=296;x<343;x+=6)sg(x,484,x,505);});}

    /* The laboratory with eight exhaust stacks. Ref 07 crop b, x 620-850. Fin positions come from row scans at y 428 and y 500. */
    {const z=-3.4;
      S({z,w:1.5,t:1},()=>{fl(R(620,413,843,560),z);ln([[622,560],[622,415],[840,412],[840,465]]);});
      /* Eight stacks in four pairs, each a flaring cowl on a collar over a pointed housing. */
      S({z:z-.05},()=>fl(R(640,405,838,416),z-.05));
      S({z:z-.05,w:.8,t:.65},()=>{sg(640,406,838,404);ln([[838,404],[843,412]]);});
      [662,679,705,723,762,779,806,823].forEach(c=>{const v=[[c-9,378],[c+9,377],[c+6.5,395],[c+5.5,399],[c+4.5,401],[c+9,410],[c+9,416],[c-9,416],[c-9,410],[c-4.5,401],[c-5.5,399],[c-6.5,395]];const k=z+.05;
        S({z:k,w:1.2,t:1},()=>{fl(v,k);ln(v,true);});S({z:k,w:.8,t:.8},()=>{const r=[];for(let a=0;a<=10;a++)r.push([c-9+18*a/10,378-.1+2.4*Math.sin(a/10*PI)]);ln(r);});S({z:k,w:.7,t:.7},()=>{sg(c-8.5,384,c+8.5,383.5);sg(c-6.5,395,c+6.5,395);sg(c-5,399,c+5,399);sg(c-9,410,c+9,410);sg(c,401,c-9,410);sg(c,401,c+9,410);});S({z:k,w:.5,t:.4,lod:.7},()=>{for(let u=-.6;u<=.61;u+=.3)sg(c+u*8.5,381,c+u*6.3,395);sg(c-5.5,397,c+5.5,397);sg(c,401,c,416);});S({z:k,w:.5,t:.28,lod:1.5},()=>{for(let y=384;y<395;y+=2.5)sg(c-8+(y-381)*.1,y,c+8-(y-381)*.1,y);});});
      /* Band of white fins: read as alternating thick and thin. */
      S({z,w:.9,t:.82},()=>{[623,628,636,643,650,655,664,672,680,688,696,704,712,720,728,736,744,752,760,768,775,783,791,799,807,815,822,833,841].forEach((x,i)=>sg(x,414.5-(x-622)*.012,x,438.5));sg(622,438.5,842,438);sg(622,416,842,413.5);});
      S({z,w:.5,t:.42,lod:.8},()=>{for(let x=625;x<840;x+=4)sg(x,415,x,438);});
      /* Louvre band. */
      S({z,w:.9,t:.72},()=>{ln(R(645,440,838,463));});S({z,w:.5,t:.42},()=>{for(let x=652;x<838;x+=8.7)sg(x,441,x,463);sg(645,451,838,451);});S({z,w:.5,t:.24,lod:1.1},()=>{for(let y=443;y<463;y+=2.2)sg(645,y,838,y);});
      /* Strip of a long cornice, then pale fins and dark slots. */
      S({z,w:1.4,t:.95},()=>{ln([[631,467],[843,462]]);ln([[631,469.5],[843,464.5]]);});
      const fins=[[633,642],[654,660],[664,671],[680,687],[700,705],[713,717],[732,737],[746,756],[763,771],[783,787],[796,803],[815,824],[833,844]];
      fins.forEach(([a,b])=>S({z,w:.85,t:.72},()=>{sg(a,469,a,560);sg(b,467,b,560);}));
      S({z,w:.5,t:.34},()=>{for(let x=634;x<843;x+=21)sg(x,483,x,560);sg(633,483,844,483);sg(633,486,844,486);sg(633,510,844,510);sg(633,512,844,512);sg(633,535,844,535);});
      hatch(760,470,845,560,3.1,.15,z);
      S({z,w:.5,t:.24,lod:1.3},()=>{fins.forEach(([a,b])=>{for(let y=472;y<560;y+=5)sg(a,y,b,y);});});
      /* Fin ends past the corner. */
      S({z,w:.9,t:.8},()=>{sg(620,440,620,490);sg(626,440,626,490);sg(632,440,632,480);});S({z,w:.5,t:.4},()=>{for(let y=444;y<490;y+=6)sg(620,y,632,y);});}

    /* Glass and stone building. Ref 07 crop c, x 912-1315. */
    {const z=-3.3;
      /* Roof plant: cowls and pipes. */
      S({z:z-.1},()=>fl(R(975,432,1160,444),z-.1));
      S({z:z-.1,w:.8,t:.7},()=>{ln([[984,443],[985,433],[997,431],[1000,443]]);ln([[1032,443],[1034,433],[1050,431],[1052,443]]);ln([[1066,443],[1071,430],[1084,429],[1085,441]]);ln([[1097,441],[1102,429],[1115,428],[1117,441]]);ln([[1130,441],[1136,429],[1148,429],[1150,441]]);ln(R(1040,438,1066,443));sg(937,438,1000,437);sg(1150,441,1225,444);});
      S({z:z-.1,w:.5,t:.4,lod:.9},()=>{sg(1036,437,1050,437);sg(1120,440,1145,437);sg(1060,441,1100,439);sg(1104,433,1113,433);sg(1072,434,1082,434);sg(1138,433,1147,433);sg(1160,441,1240,445);});
      /* Tan penthouse and glass top. */
      box(925,450,968,481,z,1.2,.9);brick(925,450,968,481,z,3,.16,1.3);
      S({z},()=>fl([[968,443],[1165,443],[1315,453],[1315,612],[912,612],[912,483],[968,483]],z));
      S({z,w:1.4,t:1},()=>{ln([[968,443],[1165,443],[1315,453]]);ln([[1315,453],[1315,612]]);ln([[1165,443],[1165,478]]);});
      S({z,w:.8,t:.62},()=>{sg(968,478,968,445);sg(968,446,1165,446);sg(1165,446,1315,456);});
      S({z,w:.5,t:.42},()=>{for(let x=975;x<1165;x+=7.4)sg(x,447,x,477);});
      S({z,w:.5,t:.32},()=>{for(let x=1172;x<1315;x+=7.8){const y=447+(x-1165)*.066;sg(x,y,x,y+29);}});
      S({z,w:.5,t:.2,lod:1.2},()=>{for(let y=450;y<478;y+=4){sg(968,y,1165,y);sg(1165,y,1315,y+10);}});
      /* Bright bands. */
      S({z,w:1.4,t:1},()=>{sg(915,478,1165,478);sg(915,482,1165,482);sg(1165,481,1300,490);sg(912,501,1138,501);sg(912,504,1138,504);});
      S({z,w:.6,t:.5},()=>{for(let x=925;x<1138;x+=5.3)sg(x,483,x,500);sg(915,487,1138,487);});
      S({z,w:.5,t:.3,lod:1},()=>{sg(915,497,1138,497);for(let x=1140;x<1300;x+=6)sg(x,482+(x-1165)*.066,x,510);});
      /* Stone wall with tall glazed slots in pairs, and a recessed shadow column. */
      S({z,w:1.3,t:.9},()=>{sg(912,504,912,612);sg(1138,504,1138,612);});
      brick(912,505,1138,612,z,2.7,.17,1.15);
      S({z:z+.01,w:1,t:.72},()=>{ln(R(951,483,962,590));});hatch(951,484,962,590,2.3,.3,z+.01);
      const up=[[914,922],[928,938],[970,977],[1003,1010],[1013,1019],[1024,1031],[1038,1048],[1057,1064],[1067,1073],[1078,1085],[1092,1102],[1112,1118],[1122,1128]];
      up.forEach(([a,b])=>{wn(a,512,b-a,41,z,{t:.68,w:.9,r:2,m:b-a>8?1:0,ml:.7});wn(a,562,b-a,17,z,{t:.56,r:1});});
      /* Glazed return with its lit slabs. */
      const fy=(y,x)=>y+(x-1140)*.024;
      S({z,w:.55,t:.42},()=>{[505,528,552,578,600].forEach(y=>sg(1140,fy(y,1140),1298,fy(y,1298)));for(let x=1147;x<1298;x+=8.2)sg(x,fy(508,x),x,fy(612,x));});
      S({z,w:1.5,t:1},()=>{sg(1140,528,1195,528);sg(1140,578,1210,578);sg(1140,506,1195,506);});
      S({z,w:.5,t:.24,lod:1.1},()=>{[517,540,565,590].forEach(y=>sg(1140,fy(y,1140),1298,fy(y,1298)));for(let x=1151;x<1298;x+=8.2)sg(x,fy(508,x),x,fy(612,x));});
      hatch(1140,508,1298,612,3.3,.12,z);
      /* Pale end panel. */
      box(1300,506,1315,612,z+.02,1,.75);S({z:z+.02,w:.5,t:.42},()=>{[520,535,550,565,580,595].forEach(y=>sg(1300,y,1315,y));sg(1307,506,1307,612);});}

    /* Tall ribbed tower with its red floor. Ref 07 crop c. Rib positions from a row scan at y 420. */
    {const z=-4.4;
      /* Penthouse, plant, antennas. */
      box(1345,364,1408,381,z-.05,1.3,.92);S({z:z-.05,w:.5,t:.34,lod:.8},()=>{for(let x=1350;x<1408;x+=5)sg(x,366,x,381);});
      S({z:z-.05,w:.8,t:.72},()=>{[1352,1358,1367,1378,1387,1398].forEach((x,i)=>sg(x,364,x,357-(i%3)*3));ln(R(1268,376,1292,383));ln(R(1292,378,1322,383));ln(R(1450,374,1490,379));});
      S({z:z-.05,w:.5,t:.45,lod:.9},()=>{for(let x=1272;x<1292;x+=4)sg(x,376,x,383);for(let x=1454;x<1490;x+=5)sg(x,374,x,379);});
      S({z},()=>fl(R(1245,379,1533,620),z));
      S({z,w:1.6,t:1},()=>{ln([[1245,620],[1245,380],[1488,376],[1533,378],[1533,600]]);});
      S({z,w:1,t:.85},()=>{sg(1488,377,1488,600);sg(1245,456,1533,456);});
      /* Ribs: pairs of lines to read as projecting fins. */
      const RIB=[1252,1261,1270,1281,1290,1299,1308,1318,1327,1336,1345,1352,1359,1371,1377,1386,1392,1400,1409,1418,1424,1432,1439,1446,1455,1461,1469,1477,1484];
      S({z,w:.75,t:.68},()=>RIB.forEach(x=>sg(x,380,x,455)));
      S({z,w:.5,t:.34,lod:.7},()=>RIB.forEach(x=>sg(x+3.6,380,x+3.6,455)));
      S({z,w:.5,t:.2,lod:1.6},()=>{for(let y=386;y<455;y+=6.2)sg(1246,y,1487,y);});
      /* Dark right face. */
      hatch(1489,381,1532,455,2.8,.22,z);
      S({z,w:.55,t:.36},()=>{for(let x=1492;x<1533;x+=6.5)sg(x,457,x,600);[469,484,499,515,530,546,562,577,592].forEach(y=>sg(1489,y,1532,y));});
      hatch(1489,458,1532,600,3.1,.14,z,.7);
      /* The floor with red panels: lit blocks read as dense hatch. */
      S({z,w:.9,t:.8},()=>{sg(1316,458,1533,458);sg(1316,470,1533,470);});
      [[1316,1344],[1388,1401],[1412,1422],[1425,1444],[1450,1460],[1463,1485]].forEach(([a,b])=>{hatch(a,459,b,470,1.8,.72,z+.01);S({z:z+.01,w:.6,t:.72},()=>ln(R(a,459,b,470),true));});
      S({z,w:.6,t:.5},()=>{[1350,1361,1372].forEach(x=>{ln(R(x,460,x+6,469));});ln(R(1520,459,1530,470));});
      /* Stone lower floors: four rows of slits, then blank bays and small canted openings. */
      S({z},()=>fl(R(1316,470,1488,620),z+.01));
      S({z:z+.01,w:1.2,t:.92},()=>{sg(1316,470,1316,612);});brick(1316,471,1488,612,z+.01,2.8,.18,1.2);
      S({z:z+.01,w:.5,t:.42},()=>{[499,531,562,593].forEach(y=>{sg(1316,y,1344,y);sg(1356,y,1396,y);sg(1450,y,1488,y);});});
      const SL=[1320,1326,1336,1342,1356,1362,1368,1374,1381,1387,1392,1399,1405,1412,1418,1424,1430,1436,1442,1450,1457,1463,1469,1476,1482];
      [473,487].forEach(y=>SL.forEach(x=>{S({z:z+.02,w:.75,t:.68},()=>{ln(R(x,y,x+3.2,y+10),true);});}));
      const SL2=[1358,1363,1370,1376,1384,1390,1452,1457,1464,1470,1477,1483];
      [505,520,537,552,568,583,599].forEach(y=>SL2.forEach(x=>S({z:z+.02,w:.75,t:.66},()=>ln(R(x,y,x+3.2,y+9.5),true))));
      /* Shadowed recesses. */
      [[1343,1354],[1447,1451]].forEach(([a,b])=>{S({z:z+.02,w:1,t:.8},()=>{fl(R(a,501,b,614),z+.02);ln(R(a,501,b,614),true);});hatch(a,503,b,614,2.3,.3,z+.02);});
      /* Canted openings in the blank bays. */
      [[1329,510],[1329,541],[1329,573],[1329,605],[1387,510],[1387,541],[1387,573],[1387,605]].forEach(([x,y])=>S({z:z+.02,w:.8,t:.72},()=>{const q=[[x,y-5],[x+8,y-6],[x+5,y+5],[x+1,y+5]];fl(q,z+.02);ln(q,true);sg(x+4,y-5,x+3,y+5);}));}

    /* Residential block on the right: top band, set-back penthouse, brick face, pale bays. Ref 07 crop d, x 1543-1800. */
    {const z=-3.9,fy=x=>486-(x-1543)*.045;
      /* Penthouse faces. */
      S({z},()=>fl(R(1646,447,1801,490),z));
      S({z,w:1.4,t:.95},()=>{ln([[1646,482],[1646,447],[1695,447],[1695,450],[1735,450],[1735,448],[1801,448],[1801,472]]);});
      S({z,w:.8,t:.62},()=>{sg(1695,447,1695,481);sg(1735,450,1735,470);sg(1766,450,1766,482);});
      hatch(1695,452,1735,482,3,.18,z);hatch(1766,451,1800,482,3,.18,z);brick(1646,448,1695,482,z,3,.17,1.2);
      S({z,w:.7,t:.6},()=>{ln([[1733,450],[1733,444],[1738,443],[1740,448]]);ln([[1755,448],[1755,444],[1760,444],[1760,448]]);sg(1700,456,1718,456);sg(1700,470,1730,470);});
      /* Far stepped apartments, grey and tan terraces, each storey a little different. Ref 07 crop d, x 1787-1920. */
      S({z:z-.1},()=>fl([[1787,481],[1800,472],[1830,478],[1860,482],[1920,484],[1920,640],[1787,640]],z-.1));
      S({z:z-.1,w:1.1,t:.82},()=>{ln([[1800,482],[1802,470],[1812,473],[1818,478],[1838,480],[1860,469],[1880,482],[1898,484],[1920,486]]);ln([[1845,481],[1860,469]]);});
      S({z:z-.1,w:.6,t:.5},()=>{sg(1860,469,1860,482);sg(1860,469,1871,482);sg(1832,472,1832,480);sg(1843,465,1843,479);ln([[1842,465],[1845,465]]);sg(1838,473,1838,480);});
      for(let f=0;f<9;f++){const y=495+f*16.5;for(let x=1798+(f%2)*5;x<1916;x+=17+(f*7+x)%5){const ww=7+vn(x*.3,f)*4;wn(x,y,ww,10,z-.09,{t:.42,w:.6,m:1,ml:1.1});}
        S({z:z-.09,w:.6,t:.5},()=>{const a=1795+vn(f,1)*14,b=a+18+vn(f,2)*32,c=b+24+vn(f,3)*20,e=c+18+vn(f,4)*16;sg(a,y-3,b,y-3);sg(c,y-4,e,y-4);sg(b,y-3,b,y+13);sg(c,y-4,c,y+13);S({w:.5,t:.3,lod:1},()=>{for(let x=a;x<b;x+=3)sg(x,y-3,x,y-7);for(let x=c;x<e;x+=3)sg(x,y-4,x,y-8);});});}
      /* Main block. */
      S({z},()=>fl([[1543,fy(1543)],[1800,fy(1800)],[1800,612],[1543,612]],z));
      S({z,w:1.5,t:1},()=>{ln([[1543,612],[1543,486],[1646,481]]);ln([[1646,481],[1787,479]]);});
      S({z,w:1.1,t:.8},()=>{ln([[1543,511],[1800,509]]);sg(1787,480,1787,510);sg(1800,510,1800,612);});
      brick(1543,512,1800,612,z,2.6,.17,1.2);brick(1543,487,1787,510,z,3,.12,1.5);
      const cols=[1552,1570,1582,1600,1612,1632,1650,1695,1730,1748,1785],rows=[497,516,534,553,571,589,606];
      cols.forEach(x=>rows.forEach((y,j)=>{const g=vn(x,y)>.5;if(y>600&&x>1700)return;wn(x,y-(x-1543)*.012,x===1632||x===1650?11:7,14,z,{t:g?.72:.56,m:1,ml:.7,r:1});}));
      /* Pale bays. */
      [1664,1705,1757].forEach(x=>{S({z:z+.02,w:1,t:.85},()=>{fl(R(x,490,x+17,612),z+.02);ln(R(x,490,x+17,612),true);});
        [495,520,538,557,576,594].forEach(y=>{wn(x+2,y,13,12,z+.02,{t:.72,m:1,ml:.5,r:1});S({z:z+.03,w:.5,t:.5,lod:.9},()=>{sg(x,y+14,x+17,y+14);sg(x,y+16,x+17,y+16);});});
        S({z:z+.03,w:.6,t:.55},()=>{ln([[x,490],[x+3,484],[x+14,484],[x+17,490]]);});});}

    /* Long power plant wall: the upper block, two low parapets, the stepped tower at its right end and the window strips. Ref 07 crops a and b, x 42-678. */
    {const z=-2.6;
      /* Panel block behind the stack, cut by the left block. */
      S({z:z-.1,w:1.2,t:.85},()=>{fl(R(42,456,142,610),z-.1);ln([[42,610],[42,470],[142,478]]);ln([[42,470],[42,458],[108,458],[122,470],[142,472]]);});
      S({z:z-.1,w:.5,t:.34},()=>{for(let x=52;x<142;x+=14.4)sg(x,472,x,558);for(let y=484;y<558;y+=12.4)sg(42,y,142,y);});
      S({z:z-.1,w:.6,t:.45},()=>{ln(R(42,546,63,566));ln(R(42,570,63,595));sg(50,546,50,566);sg(50,570,50,595);sg(42,556,63,556);sg(42,582,63,582);});
      S({z},()=>fl([[255,505],[352,505],[352,525],[545,527],[545,640],[68,640],[68,533],[255,533]],z-.02));
      S({z,w:1,t:.78},()=>{ln([[254,533],[254,505],[352,505],[352,525],[540,525]]);sg(352,505,352,527);});brick(254,506,352,533,z,2.6,.18,1);
      S({z,w:.7,t:.55},()=>{sg(358,518,443,520);sg(358,506,358,525);sg(362,506,362,525);});
      /* Gold wall. */
      S({z:z+.01},()=>fl(R(68,533,545,600),z+.01));
      S({z:z+.01,w:1.5,t:1},()=>{ln([[68,591],[68,535],[545,527]]);sg(68,538,545,530);});
      S({z:z+.01,w:1,t:.85},()=>{sg(68,591,545,591);sg(68,594,545,594);sg(68,597,238,597);sg(238,600,545,600);});
      S({z:z+.01,w:.5,t:.3,lod:.5},()=>{for(let x=100;x<545;x+=32){const y=535-(x-68)*.017;sg(x,y,x,591);}});
      /* Shadow of the tall stack and the shaded remainder. */
      S({z:z+.01,w:.6,t:.55},()=>{sg(240,533,239,591);});hatch(241,533,543,590,3.4,.2,z+.01,0,-.0);
      S({z:z+.01,w:.5,t:.18,lod:1.4},()=>{for(let y=540;y<590;y+=3.4)sg(70,y,238,y);});
      /* Base course and lower wall. */
      S({z:z+.02},()=>fl(R(65,597,545,650),z+.02));
      S({z:z+.02,w:1,t:.78},()=>{sg(165,607,545,607);sg(165,609.5,545,609.5);sg(165,607,165,630);});
      brick(165,610,545,655,z+.02,2.6,.14,1.3);
      /* Two blank panels. Ref 07 at x 80-158, y 610-620. */
      S({z:z+.02,w:.9,t:.7},()=>{ln(R(80,610,112,620),true);ln(R(120,610,158,620),true);});S({z:z+.02,w:.5,t:.3,lod:.9},()=>{for(let x=122;x<158;x+=3)sg(x,611,x,619);for(let y=612;y<620;y+=2)sg(82,y,110,y);});
      /* Pipe bend and small cage. */
      S({z:z+.03,w:.8,t:.7},()=>{ln(curve([[197,607],[197,600],[202,597],[207,600],[207,607]],2));ln(R(166,599,177,607));});S({z:z+.03,w:.5,t:.42,lod:1},()=>{sg(166,603,177,603);sg(171,599,171,607);});
      /* Window strips in two rows, read from a row scan at y 637. */
      S({z:z+.03,w:.8,t:.62},()=>{[[183,214],[219,262],[266,310],[315,359],[363,408],[413,440]].forEach(([a,b])=>{ln(R(a,627,b,636),true);ln(R(a,638,b,647),true);});});
      S({z:z+.03,w:.5,t:.32,lod:.8},()=>{[[183,214],[219,262],[266,310],[315,359],[363,408],[413,440]].forEach(([a,b])=>{for(let x=a+7.2;x<b;x+=7.2){sg(x,627,x,636);sg(x,638,x,647);}});});
      S({z:z+.03,w:.8,t:.55},()=>{[[219,262],[266,310],[315,359]].forEach(([a,b])=>ln(R(a,672,b,690),true));});
      /* Stepped tower with slot windows. Ref 07 crop b. */
      S({z:z+.05},()=>{fl(R(540,495,613,660),z+.05);fl(R(613,520,678,660),z+.05);});
      S({z:z+.05,w:1.4,t:.95},()=>{ln([[540,650],[540,495],[615,495],[615,520],[678,522],[678,660]]);sg(613,520,613,660);});
      S({z:z+.05,w:.9,t:.75},()=>{sg(540,500,615,499);sg(615,525,678,526);});
      brick(541,500,613,660,z+.05,2.5,.2,1);brick(614,526,677,660,z+.05,2.5,.2,1);
      [[563,537],[563,565],[563,593],[563,621]].forEach(([x,y])=>wn(x,y,8,y===621?11:14,z+.05,{t:.8,r:1,w:.9}));
      /* Tall window: four dark mullioned strips. */
      S({z:z+.06,w:1,t:.82},()=>ln(R(622,567,655,655),true));S({z:z+.06,w:.7,t:.65},()=>{[630,638,647].forEach(x=>sg(x,567,x,655));});S({z:z+.06,w:.5,t:.3,lod:.8},()=>{for(let y=575;y<655;y+=8)sg(622,y,655,y);});
      /* Curved stone sweep at its foot. */
      S({z:z+.07,w:.9,t:.75},()=>{fl([[500,633],[540,632],[590,636],[590,660],[500,660]],z+.07);ln([[500,633],[540,632],[590,636]]);sg(500,636,590,638);});
      brick(500,638,590,660,z+.07,2.5,.17,1.2);
      /* Pipe on the block's top. */
      S({z:z+.07,w:.8,t:.7},()=>{sg(632,505,632,520);sg(635,505,635,520);});}

    /* Four stacks. Rings from column scans of ref 07. */
    {
      /* Tall stack, ref 07 crop a. */
      const z=-3;stack({a:142,b:183,top:190,bot:533,z,t:1,rings:[261,287,316,343,369,394,478,493,505,517],gal:[{x0:136,x1:190,y:226,h:5,rail:7,br:7},{x0:131,x1:188,y:441,h:6,rail:9,br:9}]});
      /* Crown: flared rim, dark band, bolted ring. */
      S({z:z+.01,w:1.5,t:1},()=>{const q=[[140,184],[143,182],[182,182],[185,184],[185,194],[183,197],[142,197],[140,194]];fl(q,z+.01);ln(q,true);sg(140,188,185,188);});
      S({z:z+.01,w:1,t:.85},()=>{ln(R(141,209,184,226),true);});hatch(141,210,184,226,2.2,.34,z+.01);S({z:z+.01,w:.6,t:.55,lod:.6},()=>{for(let x=146;x<183;x+=5)sg(x,209,x,226);});
      S({z:z+.01,w:.5,t:.42,lod:1},()=>{sg(142,204,183,204);sg(142,207,183,207);sg(142,192,183,192);[156,170].forEach(x=>{ln(R(x,212,x+3,216),true);});});
      /* Lower gallery drum. */
      S({z:z+.02,w:1,t:.8},()=>{ln(R(142,424,183,441),true);});hatch(142,425,183,441,2.3,.3,z+.02);S({z:z+.02,w:.8,t:.6},()=>{sg(196,424,196,441);sg(193,420,193,441);sg(191,428,197,428);});
      /* Shaft in sun above, shade below: a hatch from the crane down. */
      hatch(143,292,182,422,4,.16,z,.3);
      S({z,w:.9,t:.75},()=>{sg(142,284,183,284);});
      /* Pale white stack in front of the brick block, ref 07 crop a. */
      stack({a:240,b:261,top:350,bot:533,z:-3.3,t:1,rings:[397,428,508],gal:[{x0:232,x1:270,y:414,h:3,rail:6,br:9}]});
      {const q=[[243,343],[258,343],[261,351],[240,351]],k=-3.29;S({z:k,w:1.3,t:1},()=>{fl(q,k);ln(q,true);});hatch(243,344,258,350,1.6,.36,k);S({z:k,w:.6,t:.6},()=>{sg(241,354,260,354);sg(241,359,260,359);});}
      /* Brick stack, ref 07 crops a and b. */
      stack({a:457,b:483,top:358,bot:522,z:-3.25,t:.95,brick:1,rings:[366,405,414,450],gal:[{x0:449,x1:491,y:410,h:4,rail:7,br:8}]});
      S({z:-3.24,w:1.1,t:.9},()=>{ln([[455,366],[455,360],[458,358],[482,358],[485,360],[485,366]]);sg(455,366,485,366);});
      /* Brick stack, ref 07 crop b. */
      stack({a:593,b:620,top:348,bot:497,z:-3.2,t:.95,brick:1,rings:[358,388,425,459],gal:[{x0:583,x1:630,y:404,h:4,rail:9,br:10}]});
      S({z:-3.19,w:1.1,t:.9},()=>{ln([[592,356],[592,350],[594,348],[619,348],[621,350],[621,356]]);sg(592,356,621,356);});}

    /* Steam: from the roof past the brick block, by the brick stack and at the laboratory corner. Ref 07 crop a and b. */
    smoke([[351,492,3.5],[360,487,4.5],[371,484,5.5],[382,487,6],[393,481,6.5],[402,484,6],[411,473,7],[408,461,5],[420,456,7],[431,446,7.5],[424,441,5]],-3.05,.6);
    smoke([[466,448,7],[474,449,6],[482,447,5]],-3.05,.38);
    smoke([[641,502,6],[650,496,7],[660,500,6],[669,497,4]],-3,.42);

    /* Low building with a stepped parapet, its roof sign, dish, and the storey below. Ref 07 crop b, x 680-975. The sign in the photo is illegible at this size, so it is drawn only as a mark, not lettered. */
    {const z=-2.4;
      S({z},()=>fl([[680,572],[706,562],[760,553],[790,548],[848,552],[855,548],[905,565],[910,600],[970,602],[970,655],[680,655]],z));
      S({z,w:1.2,t:.85},()=>{ln([[680,572],[706,563],[712,552],[745,552],[760,560],[790,562],[798,555],[835,558],[848,552],[855,549],[880,558],[900,559],[909,566],[909,596]]);});
      S({z,w:.6,t:.5},()=>{ln([[706,568],[790,567],[909,570]]);ln([[706,572],[909,573]]);});
      /* Roof units. */
      S({z:z-.05,w:.7,t:.55},()=>{ln(R(790,545,832,558));[800,812,824].forEach(x=>sg(x,545,x,558));});
      /* Sign: a short scribble with no letters. */
      S({z:z+.01,w:.8,t:.8},()=>{ln([[848,556],[851,562],[854,556],[857,562],[860,556],[864,561]]);});
      /* Upper windows. */
      [[718,748,1],[763,775,0],[780,790,0],[790,812,1],[827,849,0],[853,860,0],[864,878,1],[888,905,1]].forEach(([a,b,k])=>{wn(a,573,b-a,18,z,{t:k?.7:.55,m:Math.max(1,Math.round((b-a)/6)),ml:.6,r:1,sill:0});});
      S({z,w:1.2,t:.85},()=>{ln([[680,600],[718,596],[770,594],[910,595],[972,602]]);sg(690,600,970,604);});
      /* Lower storey. */
      [[735,750],[757,770],[790,803],[807,820],[827,837],[851,862],[875,883],[894,903],[911,923],[928,946],[952,962]].forEach(([a,b])=>wn(a,607,b-a,20,z,{t:.62,m:b-a>11?1:0,ml:.5,r:1,sill:0}));
      S({z,w:.6,t:.45},()=>{ln(R(684,610,716,632));sg(906,600,906,650);sg(925,600,925,650);sg(684,632,970,634);});brick(684,634,970,655,z,2.8,.14,1.3);
      /* Dish and box. */
      S({z:z+.02,w:1,t:.85},()=>{const q=[];for(let k=0;k<=18;k++){const a=k/18*TAU;q.push([916+6.5*Math.cos(a)-2*Math.sin(a),583+5*Math.sin(a)]);}fl(q,z+.02);ln(q);sg(916,588,920,595);});box(926,579,939,594,z+.02,.9,.8);}

    /* Low brick with a small green gable, the statue above it, and the long dark roofs behind the train. Ref 07 crop c and d. */
    {const z=-2.3;
      S({z},()=>fl([[970,582],[1082,582],[1117,563],[1148,587],[1160,590],[1690,596],[1690,640],[970,650]],z));
      S({z,w:1,t:.72},()=>{sg(970,582,1082,582);ln([[1082,582],[1117,563],[1148,587]]);ln([[1100,582],[1117,571],[1132,582]]);sg(1100,582,1132,582);});
      S({z:z-.01,w:.7,t:.6},()=>{ln([[1113,560],[1113,547],[1115,533],[1118,547],[1118,560]]);sg(1115,533,1115,528);ln(R(1043,562,1054,574));sg(1043,568,1054,568);});
      S({z,w:.8,t:.6},()=>{sg(970,610,1160,612);sg(970,613,1160,615);});S({z,w:.5,t:.3,lod:.8},()=>{for(let x=975;x<1160;x+=4.2)sg(x,608,x,612);});
      [975,990,1010,1030,1050,1075,1085,1100,1115,1130,1145].forEach(x=>wn(x,618,8,16,z,{t:.42,w:.6,r:1,sill:0}));
      [1062,1075,1090,1105,1120].forEach(x=>wn(x,590,6,13,z,{t:.4,w:.6,sill:0}));
      brick(970,583,1160,640,z,2.8,.13,1.4);
      /* Long low roofs. */
      S({z,w:1,t:.7},()=>{ln([[1160,614],[1500,610],[1500,600],[1690,596]]);});
      S({z,w:.6,t:.48},()=>{ln(R(1500,601,1549,620));for(let x=1505;x<1549;x+=6)sg(x,602,x,620);sg(1550,620,1690,620);sg(1160,622,1500,618);});
      brick(1160,615,1500,640,z,2.8,.13,1.4);brick(1550,600,1690,630,z,2.8,.13,1.4);
      S({z,w:.6,t:.5},()=>{[[1205,8],[1248,5],[1302,9],[1345,6],[1372,11],[1402,7],[1430,5],[1442,8],[1472,4],[1491,6]].forEach(([x,w])=>{ln([[x,613],[x+.8,608.5],[x+w,608],[x+w+.8,613]]);});});
      /* Lamp standing against the tower base. */
      S({z:z+.1,w:.8,t:.7},()=>{sg(1330,612,1330,640);});}

    /* Trees in front of the buildings. Bare crowns over the low building, the red tree by the plant, the two autumn masses at far left. Ref 07 crops a, b and i. */
    for(let i=0;i<34;i++){const x=690+rnd()*175,h=vn(x*.03,4);limb(x,657,-PI/2+(rnd()-.5)*.9,4+h*8+rnd()*3,4+(rnd()>.6?1:0),.26+rnd()*.26,-1.9);}
    limb(225,700,-1.5,12,6,.36,-1.9);limb(240,700,-1.8,10,5,.32,-1.9);limb(218,696,-1.2,9,5,.3,-1.9);
    foliage([[0,602],[18,600],[42,605],[64,618],[80,626],[96,632],[105,650],[100,672],[102,700],[60,706],[0,706]],-1.7,{t:.34,d:.2});
    S({z:-1.69},()=>{limb(30,705,-1.5,20,6,.3,-1.69);limb(60,705,-1.7,18,6,.3,-1.69);limb(82,705,-1.35,14,5,.28,-1.69);});
    foliage([[110,660],[122,642],[136,628],[150,625],[158,632],[158,700],[108,700]],-1.6,{t:.44,d:.3});
    foliage([[205,668],[212,655],[220,660],[222,685],[216,700],[205,694]],-1.6,{t:.34,d:.24});
    foliage([[378,660],[382,644],[396,632],[414,634],[428,648],[438,660],[430,682],[388,682]],-1.6,{t:.44,d:.3});
    foliage([[570,660],[574,644],[586,636],[598,638],[606,648],[612,660],[604,668],[576,668]],-1.6,{t:.36,d:.3});

    /* Two stone kiosks at the bridge's far approach: pyramid roofs, a lit face and a shaded face, a slit window, a door. Ref 07 crops a and i. */
    const kiosk=(a,m,b,top,eave,bot,z,slit,door)=>{S({z,w:1.3,t:.95},()=>{const roof=[[a-2,eave],[m,top],[b+2,eave]];fl(roof,z);fl(R(a,eave,b,bot),z);ln(roof,true);sg(a,eave,a,bot);sg(b,eave,b,bot);sg(a,bot,b,bot);});
      S({z,w:1,t:.8},()=>{sg(m,top,m,bot);sg(a-2,eave+3,b+2,eave+3);});
      S({z,w:.6,t:.55},()=>{sg(a,eave+13,b,eave+13);ln(R(a+(m-a)*.55,slit,a+(m-a)*.55+2.5,slit+10),true);if(door)ln(R(a+(m-a)*.38,door,a+(m-a)*.74,bot),true);sg(m+(b-m)*.6,slit,m+(b-m)*.6,slit+10);});
      hatch(m+1,eave+4,b,bot,2.6,.2,z);
      S({z,w:.5,t:.32,lod:.8},()=>{for(let y=eave+6;y<bot;y+=4.2)sg(a,y,m,y);});S({z,w:.5,t:.28,lod:1.6},()=>{let k=0;for(let y=eave+6;y<bot-4;y+=4.2,k++)for(let x=a+(k%2?3:0);x<m;x+=7)sg(x,y,x,y+4.2);});};
    kiosk(155,175,203,628,643,719,-1.2,656,706);kiosk(347,366,391,633,650,690,-1.3,658);

    /* Approach: walls, ramps, far railing, lamps and two yellow diamond signs. Ref 07 crop i. */
    {const z=-1;
      S({z},()=>fl([[0,715],[140,715],[150,706],[160,720],[280,720],[280,770],[0,770]],z));
      S({z:z-.02},()=>fl(R(210,695,285,720),z-.02));
      /* Far railing behind the kiosk. */
      S({z:z-.02,w:.7,t:.55},()=>{sg(0,702,155,702);sg(0,711,155,711);[8,34,58,88,126,147].forEach(x=>sg(x,698,x,712));});S({z:z-.02,w:.5,t:.32,lod:1},()=>{for(let x=2;x<150;x+=3.4)sg(x,703,x,711);});
      /* Ramps and pale stair edges. */
      S({z,w:.9,t:.78},()=>{ln([[132,720],[146,702],[153,702],[153,720]]);ln([[176,720],[205,708],[220,696],[256,696],[256,720]]);ln([[0,716],[132,716]]);});
      S({z,w:1.3,t:.95},()=>{sg(82,735,100,720);sg(115,735,133,720);sg(208,708,222,696);sg(136,712,146,702);});
      S({z,w:.5,t:.36,lod:.9},()=>{for(let k=1;k<7;k++){sg(82+k*3,735-k*2.5,88+k*3,735-k*2.5);sg(115+k*3,735-k*2.5,121+k*3,735-k*2.5);}});
      /* A small blue-roofed shed. */
      S({z,w:.8,t:.65},()=>{ln(R(20,720,73,736));ln(R(23,720,38,732),true);ln(R(47,720,54,732),true);sg(30,723,30,732);});
      /* Yellow shrubs. */
      foliage([[186,718],[193,714],[204,712],[213,716],[222,714],[232,718],[245,712],[256,707],[268,706],[276,712],[284,706],[294,703],[304,708],[310,716],[300,732],[186,733]],z+.02,{t:.56,d:.34,g:.14});
      /* Lower green fence with its bright posts: positions read one by one. */
      [21,44,66,88,99,113,134,155,175,195,214,233,251,269,286,303,320].forEach(x=>S({z:z+.05,w:1,t:.85},()=>sg(x,726,x,744)));
      S({z:z+.05,w:.6,t:.5},()=>{sg(20,728,340,730);sg(20,742,340,745);});S({z:z+.05,w:.5,t:.24,lod:1.1},()=>{for(let x=20;x<340;x+=3)sg(x,729,x,743);});
      /* Road slab along the water. */
      S({z:z+.06},()=>fl([[0,745],[275,748],[500,748],[500,770],[0,770]],z+.06));
      S({z:z+.06,w:1.2,t:.82},()=>{sg(0,742,270,747);sg(0,761,270,762);sg(0,768,540,768);});S({z:z+.06,w:.6,t:.5},()=>{sg(0,745,270,750);sg(120,748,120,761);sg(128,748,128,761);sg(270,748,270,768);sg(278,748,278,768);});
      S({z:z+.06,w:.5,t:.28,lod:1},()=>{for(let y=751;y<761;y+=2.6)sg(0,y,120,y+.5);for(let y=751;y<761;y+=2.6)sg(128,y,270,y+.5);for(let y=750;y<767;y+=3)sg(278,y,500,y);});
      /* Parked van by the path. */
      S({z:z+.03,w:.7,t:.65},()=>{ln([[237,696],[241,692],[248,692],[250,696]]);sg(237,696,250,696);});S({z:z+.06,w:.5,t:.4},()=>{ln([[250,746],[256,742],[270,742],[276,746]]);});
      /* Lamps and diamonds. */
      S({z:z+.08,w:1,t:.9},()=>{sg(106,652,106,738);ln(curve([[106,652],[102,650],[93,650]],2));});
      [[105,713,6.5],[320,730,7]].forEach(([x,y,r])=>{const q=[[x,y-r],[x+r*.8,y],[x,y+r],[x-r*.8,y]];S({z:z+.09,w:1,t:1},()=>{fl(q,z+.09);ln(q,true);sg(x,y+r,x,y+r+11);});S({z:z+.09,w:.5,t:.55,lod:.9},()=>{sg(x,y-3,x,y+3);sg(x-2,y+1,x+2,y-1);});});
      S({z:z+.08,w:.8,t:.7},()=>{sg(258,662,258,700);sg(302,664,302,687);ln(curve([[302,664],[305,661],[310,661]],2));sg(302,672,296,670);ln(R(294,728,301,735),true);});
      /* Far upper fence and flag. */
      S({z:z+.02,w:.8,t:.65},()=>{[227,262,300,337,372,400,437,473].forEach(x=>sg(x,668,x,700));ln([[227,670],[300,668],[372,668],[473,666],[497,666]]);});
      S({z:z+.02,w:.6,t:.45},()=>{sg(232,678,497,676);});S({z:z+.02,w:.5,t:.22,lod:1.2},()=>{for(let x=228;x<497;x+=3.5)sg(x,670,x,690);});
      S({z:z+.02,w:.8,t:.75},()=>{sg(461,655,461,700);ln([[461,656],[472,665],[461,667]],true);S({w:.5,t:.5,lod:.9},()=>{sg(462,660,470,665);sg(462,663,469,666);});});}

    /* The river's far wall, cars and a dock, seen under the spans. Ref 07 crops c, d and h. */
    const Dt=x=>686-.0384*(x-575),Db=x=>697.5-.031*(x-575);
    {const z=-.5;
      S({z},()=>fl([[285,Db(285)],[1860,Db(1860)],[1860,770],[285,770]],z));
      S({z:z+.05,w:.6,t:.32},()=>{[[596,875,752],[965,1320,750],[1410,1835,749]].forEach(([a,b,y])=>{sg(a,y,b,y);sg(a,y+15,b,y+15);});});
      S({z:z+.05,w:.5,t:.2,lod:.8},()=>{[[596,875,752],[965,1320,750],[1410,1835,749]].forEach(([a,b,y])=>{for(let k=3;k<15;k+=3)sg(a,y+k,b,y+k);});});
      /* Far brick wall and shed roof seen through span 4. */
      S({z:z+.05,w:.5,t:.2},()=>{ln([[1560,712],[1620,708],[1680,712],[1730,738]]);sg(1565,725,1690,725);});
      [[1590,738,16],[1652,739,14],[1680,739,14],[1170,737,16],[1195,737,13],[1222,739,12],[1250,740,12]].forEach(([x,y,l])=>S({z:z+.06,w:.55,t:.3},()=>{ln([[x-l,y+4],[x-l,y+.8],[x-l*.62,y],[x-l*.34,y-4],[x+l*.22,y-4],[x+l*.5,y],[x+l*.96,y+.8],[x+l,y+4]]);sg(x-l,y+4,x+l,y+4);sg(x-l*.06,y-4,x-l*.06,y);sg(x-l*.62,y,x+l*.5,y);S({w:.5,t:.3,lod:1},()=>{[-.62,.6].forEach(f=>{const q=[];for(let a=0;a<=6;a++)q.push([x+l*f+l*.16*Math.cos(a/6*TAU),y+4+l*.16*Math.sin(a/6*TAU)]);ln(q);});});}));
      /* White van. Ref 07 crop d. */
      S({z:z+.06,w:.9,t:.85},()=>{ln([[1722,746],[1722,741],[1729,734],[1758,733],[1760,744],[1760,746],[1722,746]]);});S({z:z+.06,w:.6,t:.55},()=>{sg(1729,739,1758,738);sg(1737,734,1737,746);});
      /* Workboat. Ref 07 crop h. */
      S({z:z+.08,w:.8,t:.7},()=>{ln([[1528,767],[1540,756],[1566,755],[1566,767]]);sg(1535,761,1566,760);[1542,1549,1556,1562].forEach(x=>sg(x,755,x,767));});
      /* Floating dock under span 1. Ref 07 crop e. */
      S({z:z+.1,w:1.1,t:.92},()=>sg(500,760,552,767));S({z:z+.1,w:.6,t:.55},()=>{ln(R(505,752,545,760));[515,525,535].forEach(x=>sg(x,752,x,762));});}

    /* Deck steel: spandrel columns that drop from the deck to the rib, a dim second row behind, and floor beams. Column x from a row scan under the deck. */
    const SPANS=[
      {cols:[321,339,358,377,395,415,434,453,472,491,510],rib:[[322,727],[340,720],[377,715],[413,715],[440,718],[473,725],[520,737]],th:11,pan:8},
      {cols:[577,597,617,636,656,676,696,716,735,755,775,796,816,836,856,877],rib:[[578,748],[600,734],[625,722],[650,714],[675,706],[700,703],[725,702],[750,702.5],[775,705],[800,712],[825,719],[850,726],[875,735],[892,743]],th:11,pan:9.6,catL:[[585,760],[620,749],[647,730]],catR:[[800,727],[835,750],[870,762]],plat:[650,800,728]},
      {cols:[952,973,994,1015,1036,1057,1077,1098,1119,1141,1162,1183,1204,1226,1247,1269,1291,1312],rib:[[953,741],[997,715],[1047,700],[1093,690],[1140,687],[1187,690],[1233,698],[1277,713],[1328,736]],th:12,pan:10.6,catL:[[965,762],[1000,747],[1048,712]],catR:[[1212,708],[1267,743],[1310,763]],plat:[1050,1212,715]},
      {cols:[1400,1422,1445,1467,1488,1511,1534,1556,1578,1600,1624,1646,1670,1693,1716,1738,1761,1785,1808,1831],rib:[[1402,748],[1437,718],[1470,703],[1502,690],[1533,682],[1558,675],[1592,671],[1625,670],[1660,672],[1700,680],[1733,690],[1767,700],[1800,714],[1833,727],[1850,735]],th:12.5,pan:11.4,catL:[[1410,761],[1458,742],[1492,723],[1528,702]],catR:[[1702,700],[1740,727],[1783,747],[1827,762]],plat:[1528,1702,702]}];
    SPANS.forEach(sp=>{mark("arch spans");const top=curve(sp.rib,3),z=.15;
      /* Columns. */
      sp.cols.forEach((x,i)=>{const y0=Db(x),y1=yAt(top,x);S({z,w:1.1,t:.78},()=>{sg(x-.9,y0,x-.9,y1);sg(x+.9,y0,x+.9,y1);});S({z,w:.5,t:.5,lod:1.2},()=>{sg(x-2,y0+2,x+2,y0+2);sg(x-2,y1-2,x+2,y1-2);});});
      S({z:z-.05,w:.7,t:.36},()=>{sp.cols.forEach((x,i)=>{if(i===sp.cols.length-1)return;const c=x+(sp.cols[i+1]-x)/2;sg(c,Db(c),c,yAt(top,c));});});
      S({z:z-.05,w:.5,t:.24},()=>{const a=sp.cols[0],b=sp.cols[sp.cols.length-1];sg(a,Db(a)+6,b,Db(b)+6);});
      /* Rib in riveted box panels. */
      const zr=.3,th=sp.th,bot=top.map(p=>[p[0]-.1*th,p[1]+th]);
      for(let i=0;i<top.length-1;i++)fl([top[i],top[i+1],bot[i+1],bot[i]],zr);
      S({z:zr,w:1.5,t:1},()=>ln(top));S({z:zr,w:1.2,t:.9},()=>ln(bot));
      S({z:zr,w:.5,t:.5,lod:.7},()=>ln(top.map(p=>[p[0],p[1]+1.8])));S({z:zr,w:.5,t:.42,lod:.7},()=>ln(top.map(p=>[p[0]-.05,p[1]+th-1.8])));
      let run=0;for(let i=0;i<top.length-1;i++){const dx=top[i+1][0]-top[i][0],dy=top[i+1][1]-top[i][1],l=Math.hypot(dx,dy);run+=l;if(run>=sp.pan){run-=sp.pan;const n=[-dy/l,dx/l],p=top[i],sn=n[1]>0?1:-1,q=[p[0]+n[0]*sn*th,p[1]+n[1]*sn*th],u=[dx/l,dy/l];
          /* Joint: a dark gap with a bright cover plate on its left, then bolts. */
          S({z:zr,w:1.05,t:.86},()=>sg(p[0],p[1],q[0],q[1]));S({z:zr,w:.6,t:.55},()=>sg(p[0]+u[0]*1.8,p[1]+u[1]*1.8,q[0]+u[0]*1.8,q[1]+u[1]*1.8));
          S({z:zr,w:.5,t:.5,lod:2},()=>{for(let k=1;k<4;k++){const f=k/4,a=p[0]+(q[0]-p[0])*f+u[0]*3.5,b=p[1]+(q[1]-p[1])*f+u[1]*3.5;sg(a-.5,b,a+.5,b);}});
          S({z:zr,w:.5,t:.28,lod:1.6},()=>{const a=sp.pan*.5,x0=p[0]+u[0]*a,y0=p[1]+u[1]*a;sg(x0+n[0]*sn*th*.2,y0+n[1]*sn*th*.2,x0+n[0]*sn*th*.8,y0+n[1]*sn*th*.8);});}}
      /* Catwalks under the rib: a bright lower chord, a rail above, plank and diagonal hangers. */
      if(sp.catL){[sp.catL,sp.catR].forEach(c=>{const q=curve(c,4),zc=.42,up=9;
        S({z:zc,w:1.5,t:1},()=>ln(q));S({z:zc,w:.8,t:.7},()=>ln(q.map(p=>[p[0],p[1]-up])));S({z:zc,w:.6,t:.5},()=>ln(q.map(p=>[p[0],p[1]-up*.45])));S({z:zc,w:.5,t:.3,lod:1.1},()=>{ln(q.map(p=>[p[0],p[1]-up*.3]));ln(q.map(p=>[p[0],p[1]-up*.7]));});
        for(let i=2;i<q.length-1;i+=4){const p=q[i];S({z:zc,w:.8,t:.82},()=>sg(p[0]-1.4,p[1]-up-2,p[0]+1.2,p[1]+1));}
        S({z:zc,w:.5,t:.3,lod:1.2},()=>{for(let i=1;i<q.length;i+=2){const p=q[i];sg(p[0],p[1],p[0],p[1]-up);}});});
        /* Long hangers below the catwalk. */
        const c=sp.catL;S({z:.42,w:.7,t:.62},()=>{sg(c[1][0]-4,c[1][1]-14,c[1][0]+3,c[1][1]+14);});
        /* Short guard rails at each pier. */
        const a=sp.catL[0],b=sp.catR[sp.catR.length-1];S({z:.42,w:.7,t:.6},()=>{ln(R(a[0]-8,a[1]-14,a[0]+1,a[1]));ln(R(b[0],b[1]-14,b[0]+13,b[1]));sg(b[0],b[1]-7,b[0]+13,b[1]-7);sg(a[0]-8,a[1]-7,a[0],a[1]-7);});
        /* Platform carrying the signs: rail, posts, and a zigzag truss. The signs themselves are left out. */
        const[pa,pb,py]=sp.plat,zp=.44;
        S({z:zp},()=>fl(R(pa,py,pb,py+6),zp));
        S({z:zp,w:1.3,t:1},()=>{sg(pa,py,pb,py);sg(pa,py+6,pb,py+6);});
        S({z:zp,w:.75,t:.72},()=>{const s=(pb-pa)/40;for(let i=0;i<40;i++){const x=pa+s*i;sg(x,py+6,x+s/2,py);sg(x+s/2,py,x+s,py+6);}});
        S({z:zp,w:.9,t:.82},()=>{sg(pa,py-11,pa+.5,py);sg(pb,py-11,pb-.5,py);for(let k=1;k<6;k++){const x=pa+(pb-pa)*k/6;sg(x,py-11,x,py);}});
        S({z:zp,w:.75,t:.68},()=>{sg(pa,py-10,pb,py-10);sg(pa,py-5,pb,py-5);});
        S({z:zp,w:.5,t:.3,lod:1.3},()=>{for(let x=pa+4;x<pb;x+=6){sg(x,py-10,x,py-5);}});
        /* Stored gear glinting on the platform. */
        S({z:zp,w:.7,t:.6},()=>{const x=pa+(pb-pa)*.62;ln(R(x,py-14,x+6,py-11));});}});

    /* Lit lamps seen behind the last span. Ref 07 crop d, x 1810-1845. */
    S({z:.1,w:.7,t:.7,lod:.6},()=>{[1812,1820,1835,1843].forEach(x=>ln(R(x-2,672,x+2,676),true));});

    /* Six train cars. Car ends from the gaps in the crops; window, door and pair positions are fractions of one car measured on two cars of ref 07. */
    {const z=.32,top=x=>667-.04*(x-497),bot=x=>687-.0375*(x-497),Y=(x,v)=>lerp(top(x),bot(x),v);
      mark("train on deck");const E=[498,678,867,1058,1255,1462,1675];
      const doors=[[.105,.16],[.325,.385],[.545,.6],[.767,.818]],pairs=[[.2,.278],[.42,.5],[.64,.72],[.86,.955]];
      S({z},()=>fl([[E[0],top(E[0])-2],[E[6],top(E[6])-2],[E[6],bot(E[6])],[E[0],bot(E[0])]],z));
      for(let c=0;c<6;c++){mark("train cars");const a=E[c]+1.5,b=E[c+1]-1.5,L=b-a,X=u=>a+L*u;
        /* Body. */
        S({z,w:1.4,t:1},()=>{sg(a,top(a),b,top(b));sg(a,bot(a),b,bot(b));sg(a,top(a),a,bot(a));sg(b,top(b),b,bot(b));});
        S({z,w:.8,t:.75},()=>{sg(a,Y(a,.14),b,Y(b,.14));});
        /* Red band: a dense hatch for colour's weight. */
        S({z,w:1,t:.85},()=>{sg(a,Y(a,.83),b,Y(b,.83));});
        S({z,w:.5,t:.5},()=>{for(let v=.87;v<1;v+=.045)sg(a,Y(a,v),b,Y(b,v));});
        /* Roof line, conduit and small hatches. */
        S({z,w:.7,t:.72},()=>{sg(X(.02),top(X(.02))-3,X(.97),top(X(.97))-3);for(let k=1;k<5;k++){const u=k/5,x=X(u);ln([[x-3,top(x)],[x-2,top(x)-3.5],[x+2,top(x)-3.5],[x+3,top(x)]]);}});
        S({z,w:.5,t:.4,lod:1},()=>{for(let u=.03;u<.97;u+=.022){const x=X(u);sg(x,top(x)-3,x,top(x));}});
        /* End window. */
        {const u0=.03,u1=.082,x0=X(u0),x1=X(u1);S({z,w:.9,t:.85},()=>ln([[x0,Y(x0,.24)],[x1,Y(x1,.24)],[x1,Y(x1,.78)],[x0,Y(x0,.78)]],true));}
        /* Doors, double leafed, with their slim windows. */
        doors.forEach(([u0,u1])=>{const x0=X(u0),x1=X(u1),m=(x0+x1)/2;
          S({z,w:.95,t:.9},()=>{sg(x0,Y(x0,.18),x0,bot(x0));sg(x1,Y(x1,.18),x1,bot(x1));sg(x0,Y(x0,.18),x1,Y(x1,.18));});
          S({z,w:.7,t:.72},()=>{sg(m,Y(m,.18),m,bot(m));ln([[x0+1.2,Y(x0,.25)],[m-1,Y(m,.25)],[m-1,Y(m,.72)],[x0+1.2,Y(x0,.72)]],true);ln([[m+1,Y(m,.25)],[x1-1.2,Y(x1,.25)],[x1-1.2,Y(x1,.72)],[m+1,Y(m,.72)]],true);});});
        /* Window pairs. */
        pairs.forEach(([u0,u1])=>{const x0=X(u0),x1=X(u1),m=(x0+x1)/2;
          S({z,w:.95,t:.9},()=>{ln([[x0,Y(x0,.24)],[m-.9,Y(m,.24)],[m-.9,Y(m,.78)],[x0,Y(x0,.78)]],true);ln([[m+.9,Y(m,.24)],[x1,Y(x1,.24)],[x1,Y(x1,.78)],[m+.9,Y(m,.78)]],true);});
          S({z,w:.5,t:.4,lod:1.2},()=>{sg(x0+.8,Y(x0,.3),m-1.7,Y(m,.3));sg(m+1.7,Y(m,.3),x1-.8,Y(x1,.3));});});
        /* Band joints and side panels up close. */
        S({z,w:.5,t:.42,lod:1},()=>{doors.forEach(([u0])=>{[u0-.04,u0+.1].forEach(u=>{const x=X(u);sg(x,Y(x,.83),x,bot(x));});});});
        S({z,w:.5,t:.3,lod:1.5},()=>{pairs.forEach(([u0,u1])=>{const x=X(u1+.012);sg(x,Y(x,.3),x,Y(x,.7));const y=X(u0-.015);sg(y,Y(y,.3),y,Y(y,.7));});});
        /* Gangway to the next car. */
        if(c<5)S({z,w:.8,t:.6},()=>{const x=E[c+1];ln([[x-1.5,Y(x,.2)],[x+1.5,Y(x,.2)],[x+1.5,bot(x)],[x-1.5,bot(x)]],true);sg(x,Y(x,.2),x,bot(x));});
      }}

    /* Deck: ornamental band in two rows of panels and a heavy bottom moulding. Panels follow the columns. */
    {const z=.5,x0=285,x1=1854,up=(x,v)=>lerp(Dt(x),Db(x),v);
      /* The band left of the train and right of it rises past the train's skirt. */
      S({z},()=>fl([[x0,Dt(x0)],[x1,Dt(x1)],[x1,Db(x1)],[x0,Db(x0)]],z));
      S({z,w:1.3,t:.95},()=>{sg(x0,Dt(x0),x1,Dt(x1));});
      S({z,w:1.7,t:1},()=>{sg(x0,Db(x0),x1,Db(x1));});
      S({z,w:1.1,t:.9},()=>{sg(x0,up(x0,.72),x1,up(x1,.72));});
      S({z,w:.8,t:.72},()=>{sg(x0,up(x0,.42),x1,up(x1,.42));sg(x0,up(x0,.86),x1,up(x1,.86));});
      S({z,w:.5,t:.42,lod:.6},()=>{sg(x0,up(x0,.14),x1,up(x1,.14));sg(x0,up(x0,.5),x1,up(x1,.5));});
      /* Panel posts over each column, intermediate posts between, little arcades up close. */
      const all=[];SPANS.forEach(s=>s.cols.forEach(c=>all.push(c)));all.sort((a,b)=>a-b);
      all.forEach((x,i)=>{S({z,w:.8,t:.78},()=>sg(x,up(x,0),x,up(x,.72)));const nx=all[i+1];if(nx===undefined||nx-x>30)return;const g=nx-x;
        S({z,w:.5,t:.45},()=>{const m=x+g/2;sg(m,up(m,.14),m,up(m,.42));sg(m,up(m,.5),m,up(m,.72));});
        S({z,w:.5,t:.48,lod:.75},()=>{for(let k=1;k<6;k++){const a=x+g*k/6;sg(a,up(a,.14),a,up(a,.42));}});
        S({z,w:.5,t:.4,lod:1.5},()=>{for(let k=0;k<6;k++){const a=x+g*k/6,b=x+g*(k+1)/6,m=(a+b)/2,ya=up(a,.14),yb=up(b,.14);ln([[a,ya+1.4],[m,up(m,.14)+.1],[b,yb+1.4]]);}for(let k=0;k<4;k++){const a=x+g*(k+.5)/4,h=.9;ln([[a-h,up(a,.6)],[a,up(a,.5)],[a+h,up(a,.6)],[a,up(a,.7)]],true);}});
        S({z,w:.5,t:.42,lod:1.5},()=>{const b=x+g*.5;sg(b-g*.12,up(b,.78),b+g*.12,up(b,.78));sg(x+1,up(x,.93),x+1,up(x,1));});});
      /* Beyond the train: parapet rail and its fence and lamps. Ref 07 crop d. */
      S({z:z-.02},()=>fl([[1675,Dt(1675)-8],[1854,Dt(1854)-8],[1854,Dt(1854)],[1675,Dt(1675)]],z-.02));
      S({z:z-.02,w:.9,t:.78},()=>{sg(1675,Dt(1675)-8,1854,Dt(1854)-8);});
      S({z:z-.02,w:.5,t:.5,lod:.6},()=>{for(let x=1677;x<1854;x+=5)sg(x,Dt(x)-8,x,Dt(x));sg(1675,Dt(1675)-4,1854,Dt(1854)-4);});
      S({z:z-.03,w:.9,t:.72},()=>{sg(1677,616,1908,606);sg(1677,622,1850,622);});
      S({z:z-.03,w:.5,t:.24},()=>{for(let y=626;y<637;y+=3.6)sg(1680,y,1850,y-5);});
      [1679,1723,1757,1801,1830,1891,1908].forEach(x=>S({z:z-.02,w:1,t:.88},()=>sg(x,616-(x-1677)*.044,x,Dt(Math.min(x,1854))-1)));
      /* Yellow boom raised over the rail. */
      S({z:z-.04,w:1,t:.88},()=>{const q=[[1790,590],[1794,587],[1834,620],[1829,622]];fl(q,z-.04);ln(q,true);sg(1791,590,1788,600);});S({z:z-.04,w:.5,t:.5,lod:.9},()=>{sg(1802,600,1806,596);sg(1812,607,1816,603);});
      /* Lamp posts standing in front of the train. */
      [[570,650,682],[890,635,670],[1330,611,654],[1851,596,637]].forEach(([x,a,b])=>S({z:z+.02,w:1.2,t:1},()=>{sg(x,a,x,b);sg(x-1.5,a,x+1.5,a);}));}

    /* Four stone piers: a moulded cap with a roundel below, rock-faced shaft, shaded return, a rounded cutwater and a plinth. Read from ref 07 crop at x 1310-1420. */
    const PIERS=[{a:522,b:563,top:685,cap:696,rd:[541,699,6],dome:733,fl:517,fr:572,py:757,bot:765},{a:892,b:937,top:671,cap:688,rd:[915,690,7],dome:727,fl:881,fr:946,py:760,bot:769},{a:1331,b:1386,top:654,cap:675,rd:[1358,673,8.2],dome:723,fl:1322,fr:1395,py:756,bot:769},{a:1854,b:1920,top:636,cap:656,rd:[1887,657,9.5],dome:720,fl:1845,fr:1945,py:757,bot:770}];
    PIERS.forEach((p,pi)=>{mark("piers");mark("pier caps");const z=.75,s=(p.b-p.a)/55,side=pi===3?0:s*10.5;
      /* Shaded return. */
      if(side){S({z:z-.1,w:.8,t:.55},()=>{fl(R(p.b,p.top+1,p.b+side,p.py+6),z-.1);sg(p.b+side,p.top+1,p.b+side,p.py+6);sg(p.b,p.top+1,p.b+side,p.top+1);});S({z:z-.1,w:.5,t:.2},()=>{for(let y=p.top+3;y<p.py;y+=2.6)sg(p.b+.5,y,p.b+side-.5,y);});}
      /* Shaft. */
      S({z,w:1.6,t:1},()=>{fl(R(p.a,p.top,p.b,p.py+2),z);ln([[p.a+1,p.cap],[p.a+1,p.dome+10]]);ln([[p.b,p.cap],[p.b,p.dome+6]]);});
      /* Rock-faced courses: each course its own block breaks, joints a little irregular. Quoins alternate at both edges. */
      const cs=7.6*s;
      S({z,w:.6,t:.48,lod:.45},()=>{for(let y=p.cap+cs;y<p.dome+4;y+=cs){sg(p.a+1,y+(vn(y,1)-.5),p.b,y+(vn(y,2)-.5));}});
      S({z,w:.55,t:.42,lod:.8},()=>{let k=0;for(let y=p.cap;y<p.dome+4;y+=cs,k++){let x=p.a+1+((k%2)?10*s:6*s);while(x<p.b-3){sg(x,y,x,y+cs);x+=(8+vn(x*.3,y*.3)*11)*s;}}});
      S({z,w:.5,t:.32,lod:1.5},()=>{let k=0;for(let y=p.cap+1;y<p.dome+3;y+=cs,k++){for(let i=0;i<(p.b-p.a)/5;i++){const x=p.a+2+rnd()*(p.b-p.a-4),q=y+rnd()*(cs-1.5),l=1+rnd()*2.4;sg(x,q,x+l,q+(rnd()-.5)*1.2);}}});
      /* Cap: stepped mouldings, flat top course. */
      S({z:z+.01,w:1.5,t:1},()=>{const q=[[p.a,p.top],[p.b,p.top],[p.b,p.cap-3.4],[p.b+1.3,p.cap-3.4],[p.b+1.3,p.cap],[p.a-1.3,p.cap],[p.a-1.3,p.cap-3.4],[p.a,p.cap-3.4]];fl(q,z+.01);ln(q,true);});
      S({z:z+.01,w:.8,t:.72},()=>{sg(p.a,p.cap-3.4,p.b,p.cap-3.4);sg(p.a,p.top+1.6,p.b,p.top+1.6);sg(p.a-1,p.cap-1.5,p.b+1,p.cap-1.5);});
      S({z:z+.01,w:.55,t:.45},()=>{const y=lerp(p.top,p.cap,.42);sg(p.a,y,p.b,y);sg(p.a+(p.b-p.a)*.34,p.top,p.a+(p.b-p.a)*.34,y);sg(p.a+(p.b-p.a)*.72,p.top,p.a+(p.b-p.a)*.72,y);});
      S({z:z+.01,w:.5,t:.3,lod:1.4},()=>{for(let i=0;i<(p.b-p.a)/2.2;i++){const x=p.a+1+rnd()*(p.b-p.a-2),y=p.top+1+rnd()*(p.cap-p.top-4);sg(x,y,x+1+rnd()*2,y+(rnd()-.5));}});
      /* Roundel: a raised half disc, a dark crescent at lower right. */
      {const[cx,cy,r]=p.rd,zr=z+.02,q=[];for(let k=0;k<=24;k++){const a=k/24*PI;q.push([cx+r*Math.cos(a),cy+r*Math.sin(a)]);}
        S({z:zr,w:1.1,t:.92},()=>{fl(q,zr);ln(q);sg(cx-r,cy,cx+r,cy);});
        const cres=[];for(let k=0;k<=12;k++){const a=-.1+k/12*1.35;cres.push([cx+r*.95*Math.cos(a),cy+r*.95*Math.sin(a)]);}for(let k=12;k>=0;k--){const a=-.1+k/12*1.35;cres.push([cx-.8+r*.72*Math.cos(a),cy-.6+r*.72*Math.sin(a)]);}
        S({z:zr,w:.8,t:.72},()=>ln(cres,true));
        S({z:zr,w:.5,t:.3,lod:.9},()=>{for(let k=0;k<7;k++){const a=-.05+k*.2;sg(cx+r*.75*Math.cos(a),cy+r*.75*Math.sin(a),cx+r*.93*Math.cos(a),cy+r*.93*Math.sin(a));}});}
      /* Rounded cutwater: stone courses wrapping a dome, bright on the sun side, dim on the shade side. */
      {const zd=z+.03,cx=(p.fl+p.fr)/2,a=(p.fr-p.fl)/2,b=p.py-p.dome,E=(f,u)=>{const y=p.dome+b*f,hw=a*Math.sqrt(1-(1-f)*(1-f));return[cx+hw*u,y+b*.05*(1-u*u)*f];};
        const o=[];for(let k=0;k<=40;k++){const t=k/40*PI;o.push([cx-a*Math.cos(t),p.py-b*Math.sin(t)]);}
        S({z:zd,w:1.5,t:1},()=>{fl([...o,[p.fr,p.py+1],[p.fl,p.py+1]],zd);o.forEach((q,i)=>{if(i===o.length-1)return;S({t:i<26?1:.62},()=>sg(q[0],q[1],o[i+1][0],o[i+1][1]));});});
        [.14,.3,.48,.68,.88].forEach((f,j)=>{for(let k=0;k<18;k++){const u0=-1+2*k/18,u1=u0+2/18,A=E(f,u0),B=E(f,u1),sun=(u0+u1)/2<.15;S({z:zd,w:sun?.7:.55,t:sun?.62:.3,lod:j%2?.5:0},()=>sg(A[0],A[1],B[0],B[1]));}});
        S({z:zd,w:.5,t:.34,lod:1},()=>{const F=[0.02,.14,.3,.48,.68,.88,1];for(let j=0;j<F.length-1;j++){for(let k=0;k<5+j*2;k++){const u=-1+2*(k+.5+(vn(k*1.7,j*2.3+pi)-.5)*.8)/(5+j*2);if(Math.abs(u)>.97)continue;const A=E(F[j],u),B=E(F[j+1],u);S({t:u<.15?.34:.18},()=>sg(A[0],A[1],B[0],B[1]));}}});
        /* Plinth and tide-stained foot. */
        S({z:zd,w:1.3,t:.92},()=>{const q=R(p.fl-1,p.py,Math.min(W,p.fr+1),p.bot);fl(q,zd);ln(q,true);});
        S({z:zd,w:.6,t:.5},()=>{sg(p.fl-1,p.py+(p.bot-p.py)*.5,Math.min(W,p.fr+1),p.py+(p.bot-p.py)*.5);});
        S({z:zd,w:.5,t:.32,lod:.9},()=>{let k=0;for(let x=p.fl+3;x<Math.min(W,p.fr);x+=5.5,k++){sg(x,p.py+(k%2?0:(p.bot-p.py)*.5),x,p.py+(k%2?(p.bot-p.py)*.5:p.bot-p.py));}});
        S({z:zd,w:.5,t:.3,lod:1.5},()=>{for(let i=0;i<(p.fr-p.fl)*.7;i++){const x=p.fl+rnd()*(Math.min(W,p.fr)-p.fl),y=p.py+rnd()*(p.bot-p.py);sg(x,y,x+1.5*rnd(),y+1+rnd()*2);}});}});

    /* Abutment wall: the last pier's flat cap carries into the land. Ref 07 crop d. */
    S({z:.76,w:1,t:.85},()=>{sg(1854,636,1920,634);sg(1854,640,1920,638);});

    /* Water: short curling chop, finer and denser at the far edge, longer and looser near the viewer. Follows noise, never a pattern. */
    {const z=.95;S({z},()=>fl(R(0,769.5,W,H),z));
      S({z,w:1.1,t:.9},()=>{sg(0,770,520,770);sg(520,770.3,1920,770);});
      /* Warm glint along the waterline. Ref 07 crop e, x 560-880. */
      S({z,w:.9,t:.85},()=>{ln([[560,769],[620,769.6],[700,769],[800,769.4],[880,769]]);});
      const chop=(n,t0,w,lod,yp,one)=>S({z,w,lod},()=>{for(let i=0;i<n;i++){const u=Math.pow(rnd(),yp),y=772+u*186,x=rnd()*W,sc=.5+u*2.2,c=vn(x*.009+3,y*.06),e=vn(x*.05+9,y*.2);if(e<.3)continue;const l=(3.5+rnd()*8)*sc,k=(vn(x*.02,y*.02)-.5)*2.4,bend=(rnd()-.3)*1.2*sc;S({t:t0*(.7+c*.7)},()=>{if(one)sg(x-l,y+k,x+l,y+k+bend*.3);else{sg(x-l,y+k-bend*.3,x,y+k+bend*.5);sg(x,y+k+bend*.5,x+l,y+k-bend*.3);}});}});
      chop(2800,.36,.55,0,1.7);chop(2600,.22,.5,1.2,1.4,true);chop(2400,.2,.5,1.9,1.1);
      /* A few bright crests. */
      S({z,w:.6,t:.5},()=>{for(let i=0;i<90;i++){const u=rnd(),y=774+u*180,x=rnd()*W,l=(2.5+rnd()*4)*(.6+u*1.6);sg(x-l,y,x,y-.8);sg(x,y-.8,x+l,y+.2);}});
      /* Red marker buoy at the frame's edge. Ref 07 crop d. */
      S({z:z+.02,w:1,t:.9},()=>{ln([[1900,779],[1902,766],[1905,766],[1906,779]],true);ln([[1907,779],[1910,768],[1912,764],[1913,779]],true);});}
  }});
