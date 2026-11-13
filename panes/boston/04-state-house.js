/* Massachusetts State House. Reference: portfolio_refs/boston/04-massachusetts-state-house.jpg, read at 1400 x 943.
   Every structure below is drawn in that photo's pixels, so the rest view lands on the photo. Weights: w 1.6 structure, 1 detail, .7 fine.
   z is depth: larger is nearer. lod is the zoom at which a detail starts to appear. */
window.PANE_DEFS.push({id:"boston-04",city:"boston",ref:"04",w:1400,h:943,color:0x7CC0B6,focus:[720,430],
  trace:[[135,1205],[140,985],[280,960],[300,650],[295,608],[315,585],[555,575],[540,555],[555,530],[745,520],[745,455],[730,450],[843,395],[860,335],[960,245],[958,215],[975,145],[1015,85],[1060,145],[1060,210],[1075,240],[1170,330],[1183,405],[1230,430],[1230,490],[1370,490],[1385,545],[1710,522],[1725,560],[1780,1205]].map(q=>[q[0]/1.3714,q[1]/1.3714]),peak:17,
  expect:{"portico columns":12,"ground arches":7,"wing arched windows":6,statues:2,flagpole:1},
  places:[{id:"dome",at:[738,230,-3],where:"Massachusetts State House, Beacon Hill",means:""}],
  draw(d){
    const {seg,line,fill,arc,S,mark,rnd,text}=d,TAU=Math.PI*2;
    const L=(x0,y0,x1,y1)=>x=>y0+(y1-y0)*(x-x0)/(x1-x0);
    const roll=-.038;

    /* A window: fill, double frame, sashes and muntins, sill. Ref 04 upper floors. */
    const win=(x0,x1,y0,y1,c,r,z,o={})=>{const s=o.s===undefined?roll:o.s,Y=(x,y)=>y+s*(x-x0),cx=(x0+x1)/2,W=x1-x0,top=o.arch?W/2:0;
      const out=[];if(o.arch){out.push([x0,Y(x0,y0+top)]);for(let i=1;i<14;i++){const a=Math.PI-i/14*Math.PI;out.push([cx+W/2*Math.cos(a),Y(cx+W/2*Math.cos(a),y0+top-top*Math.sin(a))]);}out.push([x1,Y(x1,y0+top)]);}else out.push([x0,Y(x0,y0)],[x1,Y(x1,y0)]);out.push([x1,Y(x1,y1)],[x0,Y(x0,y1)]);
      S({z,w:1.2,t:.95},()=>{fill(out,z);line(out,{closed:true});});
      S({z:z+.01,w:.7,t:.62},()=>{const p=2.2;seg(x0+p,Y(x0,y1-p),x1-p,Y(x1,y1-p));seg(x0+p,Y(x0,y0+top),x0+p,Y(x0,y1-p));seg(x1-p,Y(x1,y0+top),x1-p,Y(x1,y1-p));
        for(let i=1;i<c;i++){const x=x0+W*i/c;seg(x,Y(x,y0+top),x,Y(x,y1));}for(let j=0;j<=r;j++){const y=y0+top+(y1-y0-top)*j/r;seg(x0,Y(x0,y),x1,Y(x1,y));}
        if(o.arch){for(let k=1;k<4;k++){const rr=W/2*k/4,q=[];for(let i=0;i<=10;i++){const a=Math.PI-i/10*Math.PI;q.push([cx+rr*Math.cos(a),Y(cx,y0+top)-rr*Math.sin(a)]);}line(q);}for(let k=1;k<6;k++){const a=Math.PI*k/6;seg(cx,Y(cx,y0+top),cx+W/2*Math.cos(a),Y(cx,y0+top)-W/2*Math.sin(a));}}});
      if(o.sill!==0)S({z:z+.02,w:1,t:.9},()=>{const e=o.sill||3;line([[x0-e,Y(x0,y1+1)],[x1+e,Y(x1,y1+1)],[x1+e,Y(x1,y1+4)],[x0-e,Y(x0,y1+4)]],{closed:true});});};

    /* A balustrade: rails, vase balusters, piers. Ref 04 roof lines. */
    const balustrade=(x0,yt0,x1,yt1,h,n,z,piers=6)=>{mark("balustrade runs");const T=L(x0,yt0,x1,yt1);S({z,w:1.1,t:.95},()=>{fill([[x0,T(x0)],[x1,T(x1)],[x1,T(x1)+h],[x0,T(x0)+h]],z);seg(x0,T(x0),x1,T(x1));seg(x0,T(x0)+2,x1,T(x1)+2);seg(x0,T(x0)+h,x1,T(x1)+h);});
      S({z:z+.01,w:.7,t:.68,lod:.4},()=>{for(let i=0;i<n;i++){const x=x0+(x1-x0)*(i+.5)/n,y=T(x),b=(x1-x0)/n*.3,a=y+2,c=y+h;[-1,1].forEach(sd=>{const q=[];for(let j=0;j<=8;j++){const u=j/8,wd=b*(.42+.62*Math.sin(Math.PI*Math.min(1,u/.62))*(u<.62?1:0)+(u>=.62?.28*(u-.62)/.38:0));q.push([x+sd*wd,a+(c-a)*u]);}line(q);});}});
      S({z:z+.02,w:1,t:.9},()=>{for(let k=0;k<=piers;k++){const x=x0+(x1-x0)*k/piers;line([[x-3,T(x)-1],[x+3,T(x)-1],[x+3,T(x)+h],[x-3,T(x)+h]],{closed:true});}});};

    /* Cornice: stacked mouldings, optional dentils. */
    const cornice=(x0,y0,x1,y1,offs,z,dent)=>{const T=L(x0,y0,x1,y1);S({z,w:1,t:.9},()=>offs.forEach((o,i)=>{S({w:i===0||i===offs.length-1?1.3:.8,t:i===0?1:.7},()=>seg(x0,T(x0)+o,x1,T(x1)+o));}));if(dent)S({z:z+.01,w:.7,t:.6,lod:.5},()=>{for(let x=x0+2;x<x1;x+=(x1-x0)/dent.n){seg(x,T(x)+dent.y,x,T(x)+dent.y+dent.h);seg(x+1.6,T(x)+dent.y,x+1.6,T(x)+dent.y+dent.h);seg(x,T(x)+dent.y+dent.h,x+1.6,T(x)+dent.y+dent.h);}});};

    /* Brick: coursing, then bonded joints only when zoomed in. Clipped by the fills in front of it. */
    const brick=(x0,x1,topF,botF,z,lx=()=>x0,rx=()=>x1)=>{S({z,w:.6,t:.3,lod:.3},()=>{for(let v=0;;v++){const y0=topF(x0)+v*3.1;if(y0>botF(x0))break;const a=lx(y0),b=rx(y0);seg(a,topF(a)+v*3.1,b,topF(b)+v*3.1);}});
      S({z,w:.5,t:.3,lod:1.7},()=>{for(let v=0;;v++){const y0=topF(x0)+v*3.1;if(y0>botF(x0))break;const a=lx(y0),b=rx(y0);for(let x=a+(v%2?4.5:0);x<b;x+=9){const y=topF(x)+v*3.1;seg(x,y,x,y+3.1);}}});};

    /* Far white wings. Ref 04 left x 118-215, right x 1255-1400. */
    S({z:-4.5,w:1,t:.5},()=>{const a=-4.5;
      fill([[118,520],[218,516],[218,735],[118,735]],a);line([[118,735],[118,520],[218,516]]);balustrade(118,519,218,516,12,16,a);cornice(118,532,218,528,[0,5,10],a);
      win(118,138,567,593,3,4,a,{sill:2});win(163,186,565,593,3,4,a,{sill:2});win(156,180,615,650,3,5,a,{sill:2});
      fill([[1255,490],[1400,478],[1400,650],[1255,650]],a);balustrade(1255,476,1400,472,14,20,a);cornice(1255,492,1400,488,[0,6,12],a);
      win(1283,1310,530,560,3,4,a,{sill:2});win(1345,1372,528,558,3,4,a,{sill:2});win(1288,1318,587,637,3,5,a,{sill:2});win(1352,1382,585,635,3,5,a,{sill:2});
      S({w:.6,t:.25,lod:.8},()=>{for(let y=540;y<650;y+=9)seg(1255,y,1400,y-5);for(let y=540;y<735;y+=9)seg(118,y,218,y-3);});});

    /* Dome: gilded hemisphere with ribs and sheathing seams, lantern and finial. Ref 04 crown crop. */
    {const cx=738,by=296,R=124,Rh=126,z=-3,Pt=(lon,lat)=>[cx+R*Math.sin(lon)*Math.cos(lat),by-Rh*Math.sin(lat)];const edge=[];for(let i=0;i<=48;i++){const a=i/48*Math.PI;edge.push([cx-R*Math.cos(a),by-Rh*Math.sin(a)]);}
      S({z,w:1.7,t:1},()=>{fill(edge,z);line(edge);});
      S({z:z+.01,w:.7,t:.48},()=>{for(let k=1;k<9;k++){const lat=k/9*Math.PI/2,q=[];for(let i=0;i<=30;i++)q.push(Pt(-Math.PI/2+i/30*Math.PI,lat));line(q);}for(let k=-10;k<=10;k++){const lon=k/11*Math.PI/2,q=[];for(let i=0;i<=20;i++)q.push(Pt(lon,i/20*Math.PI/2*.97));line(q);}});
      S({z:z+.02,w:.5,t:.34,lod:1.2},()=>{for(let k=0;k<36;k++){const lat=k/36*Math.PI/2*.95;for(let j=-16;j<16;j++){const a=Pt((j+(k%2?.5:0))/17*Math.PI/2,lat),b=Pt((j+(k%2?.5:0)+.45)/17*Math.PI/2,lat);seg(a[0],a[1],b[0],b[1]);}}});
      /* Lantern balcony, drum, cornice, gold cap with urns, finial. */
      const ring=(x,y,rx,ry,zz,n=26)=>{const q=[];for(let i=0;i<=n;i++){const a=Math.PI*i/n;q.push([x-rx*Math.cos(a),y+ry*Math.sin(a)]);}line(q,{z:zz});};
      S({z:z+.1,w:1.2,t:1},()=>{const a=z+.1;fill([[698,160],[783,160],[783,174],[770,180],[712,180],[698,174]],a);ring(740,160,43,10,a);ring(740,174,43,10,a);ring(740,178,43,10,a);seg(698,160,698,174);seg(783,160,783,174);
        const n=28;S({w:.7,t:.72},()=>{for(let i=1;i<n;i++){const t=i/n*Math.PI,x=740-43*Math.cos(t);seg(x,155+10*Math.sin(t)-1,x,170+10*Math.sin(t));}});ring(740,152,41,9,a);
        fill([[712,110],[772,110],[772,155],[712,155]],a+.05);S({z:a+.05},()=>{seg(712,110,712,152);seg(772,110,772,152);[722,732,750,762].forEach(x=>S({w:.8},()=>seg(x,112,x,154)));});
        win(729,745,123,152,2,3,a+.07,{arch:true,s:0,sill:0});
        S({z:a+.08,w:1.2},()=>{ring(742,105,34,7,a+.08);ring(742,110,31,6,a+.08);line([[708,105],[716,99],[768,99],[776,105]]);});
        S({z:a+.1,w:1.2},()=>{line([[727,98],[733,88],[738,84],[746,84],[751,88],[757,98]]);seg(727,98,757,98);S({w:.7,t:.7},()=>{for(let x=731;x<755;x+=4)seg(x,97,742+(x-742)*.5,85);});
          [[720,97],[764,97]].forEach(([x,y])=>{line([[x-3,y],[x-4,y-5],[x-2,y-10],[x,y-13],[x+2,y-10],[x+4,y-5],[x+3,y]],{closed:true});});
          line([[738,84],[740,76],[737,72],[739,67],[742,61],[745,67],[747,72],[744,76],[746,84]]);S({w:.6,t:.7},()=>{seg(737,72,747,72);seg(739,67,745,67);seg(738,70,746,75);seg(746,70,738,75);});});});}

    /* Pediment and attic storey above the portico. Ref 04. */
    {const z=-2;
      S({z,w:1.7,t:1},()=>{const tri=[[533,331],[715,257],[893,318],[895,342],[541,352]];fill(tri,z);line([[533,331],[715,257],[893,318]]);seg(533,331,893,318);});
      S({z:z+.01,w:1,t:.85},()=>{line([[552,330],[715,265],[873,317]]);line([[578,328],[715,272],[848,316]]);seg(578,328,848,316);seg(552,330,873,317);});
      brickTri();function brickTri(){S({z:z,w:.6,t:.3,lod:.3},()=>{for(let v=0;v<16;v++){const y=274+v*3.2,hx=(y-272)*2.45;seg(715-hx,y+0,715+hx*.97,y-(hx*.04));}});}
      S({z:z+.02,w:.7,t:.62,lod:.3},()=>{for(let i=0;i<60;i++){const t=i/60,x=536+t*176,y=330-t*72;seg(x,y,x+2,y+5);const x2=893-t*176,y2=317-t*59;seg(x2,y2,x2-2,y2+5);}});
      cornice(541,331,895,318,[0,4,9,14,20],z+.02,{n:70,y:5,h:4});
      S({z,w:1,t:.9},()=>{fill([[543,350],[895,340],[895,378],[543,384]],z);});
      brick(543,895,L(543,352,895,342),L(543,380,895,370),z);
      [550,611,677,743,808,876].forEach(x=>S({z:z+.02,w:1,t:.9},()=>{const t=L(543,350,895,340)(x),b=t+30;fill([[x-6,t],[x+6,t],[x+6,b],[x-6,b]],z+.02);line([[x-6,b],[x-6,t],[x+6,t],[x+6,b]]);S({w:.7,t:.6},()=>{seg(x-7,t+3,x+7,t+3);seg(x-2,t+4,x-2,b);seg(x+2,t+4,x+2,b);});}));
      win(568,595,359,377,3,2,z+.03,{arch:true,s:0,sill:0});win(630,660,358,376,4,2,z+.03,{sill:0});win(695,725,356,374,4,2,z+.03,{sill:0});win(758,788,355,373,4,2,z+.03,{sill:0});win(826,853,353,371,3,2,z+.03,{arch:true,s:0,sill:0});}

    /* Portico: rear wall z=-1, its windows, the balcony railings. Ref 04. */
    {const z=-1,topW=L(403,446,1005,422),botW=L(405,584,1005,572);
      S({z,w:1,t:.8},()=>fill([[403,446],[1005,422],[1005,572],[405,584]],z));
      brick(405,1005,topW,botW,z);
      S({z:z+.02,w:1,t:.85},()=>{[450,535,600,668,736,808,902].forEach(x=>{const t=topW(x),b=botW(x);fill([[x-8,t],[x+8,t],[x+8,b],[x-8,b]],z+.02);line([[x-8,b],[x-8,t],[x+8,t],[x+8,b]]);S({w:.6,t:.5,lod:.4},()=>{for(let k=-2;k<=2;k++)seg(x+k*2.6,t+8,x+k*2.6,b);});S({w:.7,t:.7},()=>{seg(x-10,t+3,x+10,t+3);seg(x-9,t+7,x+9,t+7);});});});
      /* Upper square windows and ovals. */
      win(553,580,461,484,3,2,z+.03,{sill:0});win(820,855,451,472,4,2,z+.03,{sill:0});win(912,948,447,470,4,2,z+.03,{sill:0});
      [[635,463],[700,461],[768,458]].forEach(([x,y])=>S({z:z+.03,w:1,t:.85},()=>{arc(x,y,16,8,0,TAU,22);arc(x,y,12,5.5,0,TAU,18);}));
      /* Tall windows with flat hoods. */
      [[552,578,505,568,3,5],[618,648,503,566,3,5],[686,718,500,564,4,5],[752,786,497,562,4,5],[822,858,496,560,4,5]].forEach(([a,b,t,bo,c,r])=>{win(a,b,t,bo,c,r,z+.03,{sill:0});S({z:z+.04,w:1,t:.9},()=>{const yh=t-8;line([[a-5,yh+4+roll*-5],[a+2,yh],[b-2,yh+roll*(b-a)],[b+5,yh+4+roll*(b-a)]]);seg(a-5,yh+5,b+5,yh+5+roll*(b-a));});});
      /* The two tall doors at the ends. */
      [[459,487,505,582],[914,950,497,572]].forEach(([a,b,t,bo])=>{win(a,b,t,bo,2,6,z+.03,{sill:0});S({z:z+.04,w:1,t:.9},()=>{line([[a-6,t-4],[(a+b)/2,t-12],[b+6,t-6]]);seg(a-6,t-4,b+6,t-6);seg((a+b)/2,t,(a+b)/2,bo);});});
      /* Iron balcony rails between the columns. */
      S({z:z+.5,w:.7,t:.72},()=>{const T=L(438,566,950,558),B=L(438,579,950,570);seg(438,T(438),950,T(950));seg(438,B(438),950,B(950));for(let x=438;x<950;x+=3.4)seg(x,T(x),x,B(x));});}

    /* Main cornice and roof balustrade. */
    {const z=.4;S({z},()=>fill([[395,405],[1008,377],[1005,413],[403,438]],z));
      balustrade(405,386,1000,358,19,72,z+.02,10);S({z,w:1,t:.9},()=>{line([[405,405],[395,405]]);});
      cornice(395,405,1008,377,[0,3,6,10,15,20,26,32],z+.02,{n:120,y:6,h:4});}

    /* Twelve Corinthian columns. Centres from ref 04: 410 432, 495 518, 585, 655, 726, 797, 870 895, 967 992. */
    {const z=1.2,capT=L(405,443,992,418),base=L(405,583,992,572);
      [410,432,495,518,585,655,726,797,870,895,967,992].forEach(x=>{mark("portico columns");const t=capT(x)+18,b=base(x),w0=8.6,w1=7,lean=(x-700)*.006;const xt=x-lean;
        S({z,w:1.6,t:1},()=>{fill([[xt-w1,t],[xt+w1,t],[x+w0,b],[x-w0,b]],z);seg(xt-w1,t,x-w0,b);seg(xt+w1,t,x+w0,b);});
        S({z:z+.01,w:.6,t:.55,lod:.1},()=>{for(let k=1;k<8;k++){const u=k/8;seg(xt-w1+2*w1*u,t+2,x-w0+2*w0*u,b-7);}});
        S({z:z+.02,w:1,t:.95},()=>{const ct=capT(x);fill([[xt-12,ct],[xt+12,ct],[xt+8,t],[xt-8,t]],z+.02);line([[xt-12,ct],[xt+12,ct],[xt+12.5,ct+3],[xt-12.5,ct+3]],{closed:true});arc(xt-10,ct+6,2.8,2.8,0,TAU,10);arc(xt+10,ct+6,2.8,2.8,0,TAU,10);seg(xt-7,t,xt+7,t);seg(xt-7,t-2,xt+7,t-2);
          S({w:.7,t:.72,lod:.2},()=>{for(let k=-3;k<=3;k++){const lx=xt+k*2.5;line([[lx-1.6,t-2],[lx-1.8,t-8],[lx,t-11],[lx+1.8,t-8],[lx+1.6,t-2]]);line([[lx-1.6+1.2,t-9],[lx-1.4+1.2,t-14],[lx+1.2,t-16],[lx+1.5+1.2,t-14],[lx+1.5+1.2,t-9]]);}});});
        S({z:z+.02,w:1,t:.95},()=>{fill([[x-11,b-7],[x+11,b-7],[x+12,b+1],[x-12,b+1]],z+.02);line([[x-9,b-7],[x+9,b-7]]);line([[x-10.5,b-4],[x+10.5,b-4]]);line([[x-12,b+1],[x+12,b+1]]);seg(x-12,b+1,x-10.5,b-4);seg(x+12,b+1,x+10.5,b-4);});});}

    /* Floor between portico and arcade. */
    {const z=.8,T=L(385,585,1012,566);S({z},()=>fill([[385,585],[1012,566],[1012,578],[385,598]],z));cornice(385,585,1012,566,[0,3,7,12],z+.02,{n:110,y:3.5,h:3});}

    /* Arcade: seven brick arches, medallions, keystones, impost bands, sash windows inside. Ref 04. */
    {const z=.6,top=L(385,597,1012,578),bot=L(388,724,1010,712),imp=L(388,640,1010,630);
      S({z},()=>fill([[385,597],[1012,578],[1010,712],[388,724]],z));brick(388,1010,top,bot,z);
      S({z,w:1.5,t:1},()=>{seg(388,top(388),388,724);seg(1010,top(1010),1010,712);seg(388,724,1010,712);});
      S({z:z+.02,w:1,t:.9},()=>{const a=[388,1010];seg(a[0],imp(a[0]),a[1],imp(a[1]));seg(a[0],imp(a[0])+3.5,a[1],imp(a[1])+3.5);});
      [450,541,614,687,760,836,935].forEach((x,i)=>{mark("ground arches");const R=i===6?27:25,sp=imp(x)+1,b=bot(x),q=[[x-R,b]];for(let k=0;k<=20;k++){const an=Math.PI-k/20*Math.PI;q.push([x+R*Math.cos(an),sp-R*Math.sin(an)]);}q.push([x+R,b]);
        const zz=z+.05;S({z:zz,w:1.5,t:1},()=>{fill(q,zz);line(q);});
        S({z:zz+.01,w:.7,t:.72},()=>{const r2=[];for(let k=0;k<=20;k++){const an=Math.PI-k/20*Math.PI;r2.push([x+(R+3.5)*Math.cos(an),sp-(R+3.5)*Math.sin(an)]);}line(r2);for(let k=0;k<=18;k++){const an=Math.PI-k/18*Math.PI;seg(x+R*Math.cos(an),sp-R*Math.sin(an),x+(R+3.5)*Math.cos(an),sp-(R+3.5)*Math.sin(an));}});
        /* Keystone above the arch. */
        S({z:zz+.02,w:1,t:.9},()=>{const ky=sp-R-7;line([[x-4,ky],[x+4,ky],[x+3,ky+7],[x-3,ky+7]],{closed:true});});
        /* Recess: inner arch with its window or door. */
        S({z:zz+.02,w:.8,t:.55},()=>{const r=R*.68,iy=sp+5;seg(x-R,sp,x-R+4,iy);seg(x+R,sp,x+R-4,iy);seg(x-R+4,iy,x-R+4,b-1);seg(x+R-4,iy,x+R-4,b-1);});
        if(i===3){S({z:zz+.03,w:1,t:.85},()=>{const q2=[[x-16,b],[x-16,sp+6]];for(let k=0;k<=12;k++){const an=Math.PI-k/12*Math.PI;q2.push([x+16*Math.cos(an),sp+6-16*Math.sin(an)]);}q2.push([x+16,b]);line(q2);seg(x,sp+6,x,b);seg(x-16,sp+24,x+16,sp+24);S({w:.7,t:.6},()=>{for(let k=1;k<5;k++){const an=k/5*Math.PI;seg(x,sp+6,x+16*Math.cos(an),sp+6-16*Math.sin(an));}});});}
        else if(i>0&&i<6)win(x-16,x+16,sp-10,b-14,4,6,zz+.03,{arch:true,s:0,sill:0});});
      /* Roundels and keystones over the piers. Ref 04: left 406 496, right 885 984. Plain rectangular tablets between. */
      [[406,618],[496,615],[885,605],[984,603]].forEach(([x,y])=>S({z:z+.03,w:1,t:.95},()=>{arc(x,y,9,9,0,TAU,20);arc(x,y,6,6,0,TAU,16);S({w:.6,t:.6},()=>{for(let k=0;k<8;k++){const an=k/8*TAU;seg(x+2*Math.cos(an),y+2*Math.sin(an),x+6*Math.cos(an),y+6*Math.sin(an));}});}));
      [578,650,723,798].forEach((x,i)=>{const y=[612,610,608,607][i];S({z:z+.03,w:1,t:.9},()=>line([[x-5,y-3],[x+5,y-3],[x+5,y+3],[x-5,y+3]],{closed:true}));});}

    /* Wings. Ref 04: three arched upper windows each side in brick recesses, tall lower windows, stone base. */
    const wing=(x0,x1,topY0,topY1,midY0,midY1,botY0,botY1,z,arches,lowers,base,xt0,xt1)=>{const T=L(x0,topY0,x1,topY1),M=L(x0,midY0,x1,midY1),B=L(x0,botY0,x1,botY1),lx=y=>xt0+(x0-xt0)*(y-topY0)/(botY0-topY0),rx=y=>xt1+(x1-xt1)*(y-topY1)/(botY1-topY1);
      S({z},()=>fill([[xt0,topY0],[xt1,topY1],[x1,botY1],[x0,botY0]],z));brick(x0,x1,T,B,z,lx,rx);
      S({z,w:1.5,t:1},()=>{seg(xt0,topY0,x0,botY0);seg(xt1,topY1,x1,botY1);seg(x0,botY0,x1,botY1);});
      S({z:z+.02,w:1,t:.9},()=>{[0,5].forEach(o=>{const a=lx(M(x0)),b=rx(M(x1));seg(a,M(a)+o,b,M(b)+o);});const u=M(x0)-72,a=lx(u),b=rx(u);seg(a,M(a)-72,b,M(b)-72);});
      arches.forEach(([cx,wW,t,b])=>{mark("wing arched windows");const a=cx-wW/2,c=cx+wW/2,RR=wW/2+8;S({z:z+.02,w:1,t:.85},()=>{const q=[];for(let k=0;k<=18;k++){const an=Math.PI-k/18*Math.PI;q.push([cx+RR*Math.cos(an),t+wW/2-RR*Math.sin(an)]);}line(q);fill(q,z+.015);});
        win(a,c,t,b,4,4,z+.03,{arch:true,s:0,sill:5});S({z:z+.04,w:.8,t:.7},()=>{line([[a-8,b+6],[c+8,b+6],[c+8,b+22],[a-8,b+22]],{closed:true});for(let x=a-4;x<c+4;x+=4)seg(x,b+10,x,b+20);});});
      lowers.forEach(([a,c,t,b])=>win(a,c,t,b,3,6,z+.03,{sill:4}));
      S({z:z+.01,w:1,t:.8},()=>{fill(base.q,z+.01);line(base.q,{closed:true});S({w:.7,t:.45},()=>{const[l,r,y]=[base.q[0][0],base.q[1][0],base.q[0][1]];for(let k=1;k<4;k++)seg(l,y+k*9,r,y+k*9-1);});});};
    wing(205,405,470,462,612,605,735,727,-.3,[[267,36,510,590],[333,36,508,588],[390,24,507,586]],[[237,272,632,705],[305,340,630,703],[372,386,630,700]],{q:[[205,736],[388,728],[388,765],[205,768]]},224,405);
    wing(1007,1278,443,435,598,590,725,722,-.3,[[1040,36,485,568],[1116,38,484,566],[1195,38,481,564]],[[1025,1065,617,700],[1105,1145,616,699],[1187,1228,614,697]],{q:[[1012,725],[1278,722],[1278,768],[1012,768]]},1007,1256);
    /* Wing roofs. */
    balustrade(228,424,405,417,14,28,-.2,6);cornice(215,445,405,436,[0,4,9,16,24],-.2,{n:60,y:5,h:3.5});S({z:-.2},()=>fill([[215,445],[405,436],[405,462],[225,470]],-.2));
    balustrade(1010,392,1248,381,16,36,-.2,6);cornice(1007,407,1255,399,[0,4,9,16,26,36],-.2,{n:80,y:5,h:3.5});S({z:-.2},()=>fill([[1007,407],[1255,399],[1255,435],[1007,443]],-.2));
    /* Low arched basement windows, right. */
    [[1048,742],[1131,741],[1215,740]].forEach(([x,y])=>win(x-17,x+17,y-8,y+22,4,2,.1,{arch:true,s:0,sill:0}));
    /* Low arched basement window, left. Ref 04 gate crop. */
    win(228,258,742,772,4,2,.1,{arch:true,s:0,sill:0});

    /* Terrace, central stairs, side balustrades. Ref 04. */
    {const z=1.5;balustrade(780,708,1010,704,18,34,z,6);balustrade(388,712,605,716,14,30,z,4);
      S({z,w:1,t:.8},()=>{fill([[780,726],[1012,723],[1012,768],[780,768]],z);seg(780,726,1012,723);win(810,842,742,765,4,2,z+.02,{sill:0});});
      S({z:z+.1,w:.9,t:.7},()=>{fill([[605,728],[745,726],[752,795],[600,795]],z+.1);for(let k=0;k<20;k++){const y=728+k*3.3,e=k*.35;seg(605-e,y,745+e,y);}line([[620,780],[650,728]]);line([[623,770],[652,728]]);line([[688,790],[696,728]]);line([[740,780],[712,728]]);line([[735,776],[708,728]]);});
      /* Side rails of the central stairs, iron stair runs and pale stringers. Ref 04 terrace crop. */
      const run=(pts,h,zz)=>S({z:zz,w:.9,t:.85},()=>{for(let i=0;i<pts.length-1;i++)fill([pts[i],pts[i+1],[pts[i+1][0],pts[i+1][1]+h],[pts[i][0],pts[i][1]+h]],zz);line(pts);line(pts.map(q=>[q[0],q[1]+h]));S({w:.6,t:.65},()=>{for(let i=0;i<pts.length-1;i++){const[a,c]=[pts[i],pts[i+1]],n=Math.ceil(Math.hypot(c[0]-a[0],c[1]-a[1])/3.2);for(let k=0;k<=n;k++){const u=k/n,x=a[0]+(c[0]-a[0])*u,y=a[1]+(c[1]-a[1])*u;seg(x,y,x,y+h);}}});});
      run([[650,790],[668,762],[711,774],[745,731]],16,z+.3);run([[447,739],[495,761]],15,z+.3);run([[495,752],[524,722]],14,z+.3);
      S({z:z+.31,w:.8,t:.75},()=>{[[[721,799],[748,770]],[[772,739],[784,724]]].forEach(([a,c])=>{seg(a[0],a[1],c[0],c[1]);seg(a[0]+7,a[1]+3,c[0]+7,c[1]+3);S({w:.6,t:.6},()=>{for(let u=0;u<=1;u+=.08)seg(a[0]+(c[0]-a[0])*u,a[1]+(c[1]-a[1])*u,a[0]+7+(c[0]-a[0])*u,a[1]+3+(c[1]-a[1])*u);});});});
      /* Grey stone terrace walls, left and right of the stairs. */
      S({z:z-.02},()=>fill([[388,728],[606,728],[606,790],[388,790]],z-.02));
      S({z:z-.01,w:1,t:.85},()=>{seg(388,728,606,728);seg(388,733,606,733);});
      S({z:z-.01,w:.6,t:.34,lod:.2},()=>{for(let y=743,v=0;y<790;y+=10,v++){seg(388,y,606,y);for(let x=392+(v%2?17:0);x<606;x+=34)seg(x,y,x,y+10);}});
      S({z:z+.01,w:.6,t:.34,lod:.2},()=>{for(let y=736,v=0;y<768;y+=10,v++){seg(780,y,1012,y-1);for(let x=784+(v%2?19:0);x<1012;x+=38)seg(x,y,x,y+10);}});}


    /* Clipped hedge in lobes, ground cover and flowers behind the fence. Ref 04 lawn crop. */
    {const z=2.4,top=x=>x<790?765+(790-x)*.5:764+Math.sin(x*.07)*2.5+Math.sin(x*.19)*1.1,tick=(x,y,l)=>{const a=rnd()*TAU;seg(x,y,x+l*Math.cos(a),y+l*.55*Math.sin(a));};const q=[[745,800]];for(let x=750;x<=1290;x+=6)q.push([x,top(x)]);q.push([1290,800]);
      S({z},()=>fill([[700,872],[745,800],...q.slice(1),[1400,800],[1400,872]],z));S({z,w:1.1,t:.85},()=>line(q));
      S({z:z+.01,w:.6,t:.3,lod:.2},()=>{[13,27].forEach(o=>{let x=752;while(x<1285){const w=26+rnd()*34,r=[];for(let k=0;k<=8;k++){const an=Math.PI-k/8*Math.PI;r.push([x+w/2+w/2*Math.cos(an),top(x+w/2)+o-5*Math.sin(an)]);}line(r);x+=w;}});});
      S({z:z+.01,w:.6,t:.4},()=>{for(let i=0;i<1100;i++){const x=752+rnd()*535;tick(x,top(x)+3+rnd()*33,2.8);}for(let i=0;i<700;i++){const x=702+rnd()*698,y=800+rnd()*62;tick(x,y,2.8);}});
      S({z:z+.01,w:.5,t:.36,lod:.9},()=>{for(let i=0;i<2600;i++){const x=752+rnd()*535;tick(x,top(x)+3+rnd()*33,1.8);}for(let i=0;i<2200;i++){const x=702+rnd()*698,y=800+rnd()*62;tick(x,y,1.8);}});
      /* Flowers along the foot of the fence, and the pale clump near the flagpole. */
      const bloom=(x,y,r,tt)=>S({w:.6,t:tt},()=>arc(x,y,r,r*.85,0,TAU,6));
      S({z:z+.02,w:.7,t:.72},()=>{for(let i=0;i<190;i++){const x=640+rnd()*760,y=861+rnd()*11;seg(x-1,y,x+1,y);}for(let i=0;i<34;i++){const x=1250+rnd()*110,y=786+rnd()*12;seg(x-1,y,x+1,y);}});
      S({z:z+.02,lod:.8},()=>{for(let i=0;i<300;i++)bloom(640+rnd()*760,861+rnd()*11,1.5+rnd()*.7,.68);for(let i=0;i<50;i++)bloom(1250+rnd()*110,786+rnd()*12,1.5,.68);});
      /* Planting seen through the left gates. */
      S({z:z+.01,w:.6,t:.36},()=>{[[0,98,790,862,420],[176,243,782,870,520],[200,247,765,790,130],[305,410,767,782,150]].forEach(([a,c,y0,y1,n])=>{for(let i=0;i<n;i++)tick(a+rnd()*(c-a),y0+rnd()*(y1-y0),2.4);});for(let i=0;i<60;i++){const x=rnd()*98,y=855+rnd()*11;seg(x-1,y,x+1,y);}});
      S({z:z+.01,w:.9,t:.7},()=>{[[200,247,778,14],[305,410,778,9]].forEach(([a,c,b,h])=>{const r=[];for(let k=0;k<=14;k++){const u=k/14;r.push([a+(c-a)*u,b-h*Math.sin(u*Math.PI)**.6]);}line(r);});});}


    /* The two bronze statues on plinths: silhouettes only, no invented likeness. Ref 04 at x 312 and x 945. */
    const statue=(x,yTop,yFoot,s)=>{mark("statues");const z=2.2,k=(yFoot-yTop)/64,P=a=>a.map(([u,v])=>[x+u*k*s,yTop+v*k]);const body=P([[0,0],[4,2],[5,8],[3,12],[9,16],[12,30],[10,42],[11,62],[-10,62],[-9,42],[-12,30],[-9,16],[-3,12],[-5,8],[-4,2]]);
      S({z,w:1.3,t:1},()=>{fill(body,z);line(body,{closed:true});S({w:.7,t:.7},()=>{line(P([[-3,14],[-6,30],[-5,44]]));line(P([[3,14],[6,30],[3,48]]));line(P([[-9,40],[9,44]]));line(P([[0,44],[-2,62]]));line(P([[5,47],[6,62]]));});});};
    statue(312,634,700,1);statue(945,620,690,-1);
    const plinth=(x,t,b,w1,w2,z)=>{S({z,w:1.2,t:.95},()=>{fill([[x-w2,t],[x+w2,t],[x+w2,b],[x-w2,b]],z);line([[x-w1,t],[x+w1,t],[x+w1,t+6],[x-w1,t+6]],{closed:true});seg(x-w2*.8,t+6,x-w2*.8,b-12);seg(x+w2*.8,t+6,x+w2*.8,b-12);line([[x-w2,b-12],[x+w2,b-12],[x+w2,b],[x-w2,b]],{closed:true});S({w:.6,t:.5},()=>line([[x-w2*.6,t+14],[x+w2*.6,t+14],[x+w2*.6,b-20],[x-w2*.6,b-20]],{closed:true}));});};
    plinth(310,700,762,24,28,2.1);plinth(946,690,768,16,32,2.1);

    /* Flagpole and flag. Ref 04. */
    mark("flagpole");S({z:3,w:1.6,t:1},()=>{seg(1243,140,1294,795);seg(1243,140,1236,140);arc(1243,137,3,3,0,TAU,10);});S({z:3,w:1,t:.9},()=>{const f=[[1250,178],[1270,200],[1290,235],[1333,293],[1305,298],[1272,262],[1252,235]];fill(f,3);line(f,{closed:true});S({w:.6,t:.5},()=>{line([[1258,190],[1275,230],[1300,280]]);line([[1252,210],[1272,245]]);arc(1285,250,6,8,0,TAU,12);});});

    /* Left tree: trunk, limbs, leaf masses. Ref 04 x 0-140. */
    S({z:-.8,w:.6,t:.26},()=>{const branch=(x,y,a,l,dp)=>{const x2=x+l*Math.cos(a),y2=y-l*Math.sin(a);seg(x,y,x2,y2);if(dp>0){const n=2+(rnd()<.3?1:0);for(let k=0;k<n;k++)branch(x2,y2,a+(rnd()-.5)*1.1,l*(.62+rnd()*.2),dp-1);}};branch(52,790,Math.PI/2+.03,96,6);branch(26,785,Math.PI/2+.22,78,5);branch(78,780,Math.PI/2-.24,70,5);});
    S({z:-.75,w:.6,t:.38},()=>{for(let i=0;i<900;i++){const a=rnd()*TAU,r=Math.sqrt(rnd()),x=60+r*90*Math.cos(a),y=600+r*155*Math.sin(a);if(x<0)continue;const c=rnd()*TAU;seg(x,y,x+3*Math.cos(c),y+3*Math.sin(c));}});
    S({z:-.75,w:.6,t:.38},()=>{for(let i=0;i<260;i++){const a=rnd()*TAU,r=Math.sqrt(rnd()),x=165+r*40*Math.cos(a),y=672+r*30*Math.sin(a),c=rnd()*TAU;seg(x,y,x+2.6*Math.cos(c),y+2.6*Math.sin(c));}});
    S({z:-.75,w:.6,t:.36},()=>{for(let i=0;i<420;i++){const a=rnd()*TAU,r=Math.sqrt(rnd()),x=1355+r*60*Math.cos(a),y=710+r*62*Math.sin(a),c=rnd()*TAU;if(x>1400)continue;seg(x,y,x+3*Math.cos(c),y+3*Math.sin(c));}});

    /* Iron arch with its Greek key band and the lettered name. Ref 04 gate crop. */
    S({z:3.5,w:1,t:.9},()=>{const A=(u,o)=>[262+u*238,757-Math.sin(u*Math.PI)*(52-o)],n=44,q=[],q2=[];for(let k=0;k<=n;k++){q.push(A(k/n,0));q2.push(A(k/n,11));}line(q);S({w:.7,t:.72},()=>line(q2));
      S({w:.6,t:.62,lod:.25},()=>{for(let k=0;k<n;k++){const u=k/n,v=(k+1)/n,a=A(u,0),b=A(v,0),c=A(u,11),e=A(v,11),f=A(u+.6/n,3),g=A(u+.6/n,8);line([c,a]);line([[a[0]+(b[0]-a[0])*.3,a[1]+3],f,g,[c[0]+(e[0]-c[0])*.3,c[1]-2]]);}});
      S({w:.8,t:.85,lod:.1},()=>text("MASSACHUSETTS STATE HOUSE",356,743,8,{w:.42,gap:.2}));});
    /* Street lanterns: tapered glazed head, cap, finial, post. Ref 04 gate and terrace crops. */
    const lantern=(x,yT,H,W,z,foot)=>S({z,w:1.1,t:.95},()=>{const y=u=>yT+H*u,g=[[x-W,y(.3)],[x+W,y(.3)],[x+W*.62,y(.82)],[x-W*.62,y(.82)]];fill([[x,yT],[x+W*1.05,y(.3)],...g.slice(1),[x-W*1.05,y(.3)]],z);line(g,{closed:true});
      line([[x-W*1.12,y(.3)],[x-W*.72,y(.17)],[x+W*.72,y(.17)],[x+W*1.12,y(.3)]]);line([[x-W*.34,y(.17)],[x,y(.05)],[x+W*.34,y(.17)]]);seg(x,y(.05),x,yT);
      line([[x-W*.62,y(.82)],[x-W*.28,y(.95)],[x+W*.28,y(.95)],[x+W*.62,y(.82)]]);seg(x,y(.95),x,foot);
      S({w:.6,t:.65,lod:.2},()=>{seg(x-W*.42,y(.3),x-W*.26,y(.82));seg(x+W*.42,y(.3),x+W*.26,y(.82));seg(x-W*.82,y(.56),x+W*.82,y(.56));seg(x-W*.98,y(.34),x+W*.98,y(.34));seg(x-W*.65,y(.78),x+W*.65,y(.78));seg(x-W*.34,y(.17),x+W*.34,y(.17));});});
    lantern(362,655,72,15,4,790);lantern(383,700,32,7,3,742);lantern(500,686,32,7,3,745);lantern(675,698,32,7,3,790);lantern(731,684,32,7,3,760);

    /* Gate piers named Bulfinch Entrance: stepped cap, moulded cornice, lettered frieze, recessed shaft, plaques. Ref 04 gate crop. */
    const pier=(o,z)=>{const{c,w1,w2,w3,w4,L:l,R,side,rec,t,b,tc}=o,box=(x0,x1,y0,y1)=>{const q=[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];fill(q,z);line(q,{closed:true});};
      S({z,w:1.6,t:1},()=>{box(l,side,t+60,b);S({w:1.1,t:.85},()=>seg(R,t+68,R,b-8));box(c-w4,c+w4,t+33,t+60);
        box(c-w2,c+w2,t+11,t+24);line([[c-w3,t+33],[c-w3+1,t+29],[c-w2+1,t+24],[c+w2-1,t+24],[c+w3-1,t+29],[c+w3,t+33]]);fill([[c-w3,t+33],[c-w2,t+24],[c+w2,t+24],[c+w3,t+33]],z);seg(c-w3,t+33,c+w3,t+33);line([[c-w1-6,t+11],[c-w1,t],[c+w1,t],[c+w1+6,t+11]]);fill([[c-w1-6,t+11],[c-w1,t],[c+w1,t],[c+w1+6,t+11]],z);});
      S({z:z+.01,w:.9,t:.8},()=>{seg(c-w3+1,t+29,c+w3-1,t+29);seg(c-w4,t+36,c+w4,t+36);seg(l-2,t+60,side+2,t+60);seg(l-1,t+64,side+1,t+64);seg(l,t+68,side,t+68);seg(l-3,b-8,side+3,b-8);seg(l-3,b,side+3,b);seg(l-3,b-8,l-3,b);seg(side+3,b-8,side+3,b);
        line([[rec[0],b-8],[rec[0],t+68],[rec[1],t+68],[rec[1],b-8]]);});
      S({z:z+.01,w:.6,t:.5,lod:.2},()=>{seg(rec[0]+2,b-8,rec[0]+2,t+70);seg(rec[1]-2,b-8,rec[1]-2,t+70);seg(rec[0]+2,t+70,rec[1]-2,t+70);seg(c-w2,t+15,c+w2,t+15);seg(c-w2,t+20,c+w2,t+20);seg(c-w1-3,t+6,c+w1+3,t+6);seg(l-3,b-5,side+3,b-5);seg(c-w4,t+57,c+w4,t+57);});
      S({z:z+.01,w:.6,t:.4,lod:.5},()=>{[[l,rec[0]],[rec[1],R],[R,side]].forEach(([a,e])=>{for(let y=t+79;y<b-8;y+=22)seg(a,y,e,y);});});
      S({z:z+.02,w:.7,t:.8,lod:.45},()=>{text("BULFINCH",tc,t+38,5.4);text("ENTRANCE",tc,t+49,5.4);});};
    const post=(o,z)=>{const{L:l,R,side,cl,cr,t,b}=o;S({z,w:1.5,t:1},()=>{const q=[[l,t+22],[side,t+22],[side,b],[l,b]];fill(q,z);line(q,{closed:true});S({w:1,t:.8},()=>seg(R,t+24,R,b-8));const cap=[[cl+3,t],[cr-3,t],[cr,t+6],[cr,t+15],[side+1,t+22],[l-1,t+22],[cl,t+15],[cl,t+6]];fill(cap,z);line(cap,{closed:true});
        S({w:.9,t:.8},()=>{seg(cl,t+6,cr,t+6);seg(cl,t+15,cr,t+15);seg(l-3,b-8,side+3,b-8);seg(l-3,b,side+3,b);seg(l-3,b-8,l-3,b);seg(side+3,b-8,side+3,b);});
        S({w:.6,t:.4,lod:.5},()=>{for(let y=t+44;y<b-8;y+=22)seg(l,y,side,y);});});};
    /* Iron: spear pickets, rails, optional band of rosettes. dt tilts the top rail to follow the slope. */
    const rosette=(x,y,r)=>{arc(x,y,r,r,0,TAU,18);arc(x,y,r*.28,r*.28,0,TAU,8);for(let k=0;k<12;k++){const a=k/12*TAU;seg(x+r*.28*Math.cos(a),y+r*.28*Math.sin(a),x+r*Math.cos(a),y+r*Math.sin(a));}};
    const iron=(x0,x1,t,b,gap,z,o={})=>{const Y=x=>t+(o.dt||0)*(x-x0)/(x1-x0);S({z,w:.8,t:.85},()=>{seg(x0,Y(x0)+6,x1,Y(x1)+6);seg(x0,b,x1,b);if(o.rail)seg(x0,Y(x0)+o.rail,x1,Y(x1)+o.rail);if(o.band){seg(x0,o.band[0],x1,o.band[0]);seg(x0,o.band[1],x1,o.band[1]);}
        for(let x=x0;x<=x1;x+=gap){const y=Y(x),end=o.band?o.band[0]:b;seg(x,y,x,end);S({w:.7,t:.85},()=>line([[x,y-5],[x+1.7,y-1],[x+.8,y+2],[x-.8,y+2],[x-1.7,y-1]],{closed:true}));}
        if(o.band){S({w:.6,t:.6,lod:.25},()=>{const[a,c]=o.band;for(let x=x0+3;x<x1;x+=6){seg(x,a+1.5,x+3,a+1.5);seg(x,c-1.5,x+3,c-1.5);seg(x+1.5,a+1.5,x+1.5,c-1.5);}});S({w:.65,t:.72},()=>o.rose.forEach(x=>rosette(x,o.band[1]+15,11)));}});if(o.stile)o.stile.forEach(x=>S({z,w:1.2,t:.95},()=>seg(x,Y(x)-2,x,b)));};
    iron(0,98,790,866,7,4.2,{rail:22});iron(176,243,783,878,7,4.2,{rail:22});
    iron(276,420,782,878,5.6,4.25,{band:[836,843],rose:[294,332,363,385,407],stile:[350]});
    iron(456,524,785,880,6,4.25,{band:[840,847],rose:[469,491,513]});
    iron(610,1400,791,872,8.6,4.2,{dt:-7,rail:22});
    pier({c:159,w1:17,w2:45,w3:58,w4:48,L:99,R:186,side:200,rec:[128,150],t:692,b:878,tc:143},4.5);
    pier({c:569,w1:23,w2:37,w3:50,w4:41,L:529,R:593,side:604,rec:[546,568],t:690,b:885,tc:560},4.5);
    post({L:245,R:276,side:283,cl:241,cr:296,t:760,b:880},4.45);post({L:423,R:455,side:459,cl:416,cr:469,t:760,b:883},4.45);
    /* Plaques and the accessible-entry sign on the piers. */
    S({z:4.6,w:.8,t:.8},()=>{line([[546,779],[569,779],[569,795],[546,795]],{closed:true});line([[550,807],[565,807],[565,830],[550,830]],{closed:true});line([[126,803],[143,803],[143,824],[126,824]],{closed:true});S({w:.6,t:.6,lod:.8},()=>{for(let y=783;y<794;y+=2.6)seg(549,y,566,y);line([[553,825],[562,825],[559,822]]);seg(562,825,559,828);});});

    /* Granite steps, whose right ends step down against the wall, then coping and ashlar. Ref 04 step crop. */
    {const z=5,risers=[[878,95,604],[885,95,604],[900,0,689],[912,0,730],[924,0,758],[936,0,785]];
      S({z},()=>fill([[0,868],[95,868],[95,878],[604,878],[604,875],[1400,875],[1400,943],[0,943]],z));
      S({z,w:1.1,t:.9},()=>{risers.forEach(([y,a,c],i)=>S({t:.92-i*.04},()=>seg(a,y,c,y)));line([[604,878],[604,887]]);[[604,885,887],[689,900,912],[730,912,924],[758,924,936],[785,936,943]].forEach(([x,y0,y1])=>seg(x,y0,x,y1));seg(604,887,689,887);seg(689,900,689,887);
        /* Left low wall and its coping. */
        line([[0,868],[95,868],[95,893],[0,893]]);seg(0,882,95,882);
        /* Coping along the fence. */
        seg(604,875,1400,875);seg(604,887,1400,887);S({w:.8,t:.7},()=>{seg(689,889,1400,889);});});
      S({z:z+.01,w:.8,t:.62},()=>{[687,728,831,999,1180,1330].forEach(x=>seg(x,875,x,887));seg(730,912,1400,912);seg(785,936,1400,936);[906,1110,1290].forEach(x=>seg(x,889,x,912));[824,870,929,967,1040,1110,1190,1260,1340].forEach(x=>seg(x,912,x,936));});
      /* Tread joints: long uneven granite slabs. */
      S({z:z+.01,w:.6,t:.45,lod:.2},()=>{risers.forEach(([y,a,c],i)=>{const n=i<5?[885,900,912,924,936,943][i]:943;if(i===0)return;let x=a+20+rnd()*60;while(x<c-12){seg(x,y,x,n);x+=46+rnd()*90;}});});
      S({z:z+.01,w:.5,t:.3,lod:1.2},()=>{for(let i=0;i<900;i++){const y=880+rnd()*62,x=rnd()*780;seg(x,y,x+1.6,y);}for(let i=0;i<1300;i++){const x=604+rnd()*796,y=876+rnd()*66,l=1+rnd()*1.6;if(y>887+(x<790?900-887+(x-604)*.17:0))seg(x,y,x+l,y);else if(y<887)seg(x,y,x+l,y);}});}


    /* People: generic figures, no likenesses. Ref 04 foreground. */
    const fig=(x,yT,yB,s)=>{const z=6,h=yB-yT,P=a=>a.map(([u,v])=>[x+u*h*s,yT+v*h]);S({z,w:1.1,t:.9},()=>{const hd=P([[-.05,.03],[.05,.03],[.06,.1],[.03,.14],[-.03,.14],[-.06,.1]]),b=P([[-.05,.15],[.05,.15],[.13,.2],[.14,.45],[.08,.55],[.07,1],[.01,1],[0,.58],[-.01,1],[-.07,1],[-.08,.55],[-.14,.45],[-.13,.2]]);fill(b,z);fill(hd,z);line(hd,{closed:true});line(b,{closed:true});S({w:.6,t:.55},()=>{seg(P([[-.1,.5]])[0][0],P([[-.1,.5]])[0][1],P([[.1,.5]])[0][0],P([[.1,.5]])[0][1]);});});};
    [[122,858,943,1],[146,862,943,-1],[180,842,943,1],[672,830,925,1],[721,826,922,-1],[777,858,943,-1],[180,802,840,1]].forEach(a=>fig(...a));
  }});
