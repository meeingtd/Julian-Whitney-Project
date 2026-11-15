/* The drive from Concord to Logan on a cold clear night: behind the family car on Route 2, heading east. Pines and snowbanks stream past,
   sodium lamps on the median, taillights ahead, headlights coming the other way, the wet road holding every light. Overhead signs pass for
   Boston and then Logan Airport, the city's skyline rises out of its own glow at the end of the road, and the cut goes into the light at the
   end of the road (CUTX .29, into Logan). World: road at y -2, our lanes x 0 to 4, median x -.4 to -1.6, the far lanes to -6. One unit is
   about 1.8 m. Everything that moves is drawn live; only the snowfields are baked. */
(()=>{
const SPD=26,CARX=1,CARZ=-1.2;let ROAD=null;
const trees=[];{let s=9;const r=()=>{s=(s*16807)%2147483647;return s/2147483647;};for(let i=0;i<150;i++){const side=i%2?1:-1;trees.push({x:side>0?6.5+r()*12:-8.5-r()*12,z0:r()*240,h:5+r()*6,k:r(),bare:r()<.3});}}
function pine(c,x,y,h,u,k){
  /* a white pine at night: ragged tiers of boughs, near black, snow lying on the upper side of each tier and lit a little by the road */
  const w=h*.32,n=7;let s=(k*1e6|0)+7;const r=()=>{s=(s*16807)%2147483647;return s/2147483647;};
  c.fillStyle="#0a0f12";c.fillRect(x-h*.015,y-h*.16,h*.03,h*.16);
  for(let i=0;i<n;i++){const t=i/n,ty=y-h*(.12+t*.84),tw=w*(1-t*.8)*(.8+r()*.4),th=h*.18;
    c.fillStyle="#0b1114";c.beginPath();c.moveTo(x-tw,ty);for(let j=0;j<=8;j++){const f=j/8;c.lineTo(x-tw+f*tw*2,ty+(j%2?-th*.18:th*.05)*(1+r()*.5));}c.lineTo(x+tw*.15,ty-th);c.lineTo(x-tw*.1,ty-th*1.05);c.closePath();c.fill();
    c.fillStyle=`rgba(170,178,196,${(.3+k*.25).toFixed(2)})`;c.beginPath();c.moveTo(x-tw*.85,ty-th*.12);c.quadraticCurveTo(x-tw*.2,ty-th*.6,x+tw*.6,ty-th*.18);c.quadraticCurveTo(x-tw*.1,ty-th*.42,x-tw*.85,ty-th*.12);c.fill();}
}
/* the Boston skyline, as it comes up over the trees: Prudential with its mast, the Hancock's thin blue slab, 200 Clarendon, the Financial
   District cluster further right. Drawn in a box (x,y = the base at the road's vanishing point, h = how tall the Prudential stands). */
function skyline(g,x,y,h,T,H){
  const B=[[-1.2,.42,.07,"#1a2230"],[-.95,.55,.06,"#1c2434"],[-.7,1,.1,"#202838",1],[-.5,.62,.08,"#1b2333"],[-.32,.96,.05,"#203a5a",2],[-.12,.5,.09,"#1a2130"],[.3,.6,.07,"#1d2534"],[.42,.78,.06,"#1f2737"],[.55,.7,.08,"#1b2333"],[.7,.82,.05,"#212a3a"],[.82,.56,.09,"#1a2232"],[1.02,.4,.1,"#182030"]];
  B.forEach(([bx,bh,bw,col,kind],i)=>{const x0=x+bx*h-bw*h/2,w=bw*h,top=y-bh*h;
    const q=g.createLinearGradient(0,top,0,y);q.addColorStop(0,col);q.addColorStop(1,"#0c1018");g.fillStyle=q;g.fillRect(x0,top,w,y-top);
    if(kind===2){g.fillStyle="rgba(80,130,190,.35)";g.fillRect(x0,top,w*.45,y-top);}
    /* lit windows in rows, a few on every floor */
    if(h>40){g.fillStyle="rgba(255,214,150,.7)";const rows=Math.floor((y-top)/(h*.025));for(let rI=1;rI<rows;rI++)for(let c=0;c<4;c++){if(((i*7+rI*3+c*5)%9)>3)continue;g.fillRect(x0+w*(.12+c*.22),top+rI*h*.025,Math.max(1,w*.1),Math.max(1,h*.008));}}
    if(kind===1){g.fillStyle=col;g.fillRect(x0+w*.46,top-h*.18,w*.08,h*.18);g.globalCompositeOperation="lighter";H.glow(g,"255,60,50",x0+w/2,top-h*.18,Math.max(2,h*.02),.6+.4*Math.sin(T*3));g.globalCompositeOperation="source-over";
      g.fillStyle="rgba(255,236,190,.55)";g.fillRect(x0,top,w,Math.max(1,h*.012));}
  });
}
/* an overhead sign gantry with one green sign; z is where it stands on the road */
function gantry(g,P,uF,z,text,plane){
  if(z>5.5||z<-200)return;const u=uF(z),a=P(-.6,-2,z),b=P(4.6,-2,z),top=P(0,4.4,z)[1];
  g.fillStyle="#1a1e24";g.fillRect(a[0]-u*.12,top,u*.24,a[1]-top);g.fillRect(b[0]-u*.12,top,u*.24,b[1]-top);g.fillRect(a[0],top,b[0]-a[0],u*.22);
  const s0=P(.6,4.25,z),s1=P(3.6,2.75,z);g.fillStyle="#0e5a36";g.fillRect(s0[0],s0[1],s1[0]-s0[0],s1[1]-s0[1]);
  g.strokeStyle="rgba(235,240,235,.9)";g.lineWidth=Math.max(.6,u*.04);g.strokeRect(s0[0]+u*.07,s0[1]+u*.07,s1[0]-s0[0]-u*.14,s1[1]-s0[1]-u*.14);
  g.fillStyle="#f2f5f0";g.font=`600 ${Math.max(4,u*.46)}px "Helvetica Neue",Arial,sans-serif`;g.textAlign="center";g.textBaseline="middle";
  const cx=(s0[0]+s1[0])/2,cy=(s0[1]+s1[1])/2;g.fillText(text,cx+(plane?u*.3:0),cy-u*.05);
  if(plane){const px=s0[0]+u*.5,py=cy,ps=u*.22;g.beginPath();g.moveTo(px-ps,py);g.lineTo(px+ps,py);g.moveTo(px+ps*.1,py-ps*.8);g.lineTo(px+ps*.3,py);g.lineTo(px+ps*.1,py+ps*.8);g.lineWidth=Math.max(.6,u*.07);g.strokeStyle="#f2f5f0";g.stroke();}
  /* the sign's own lamps, pointing up at it */
  g.globalCompositeOperation="lighter";const q=g.createLinearGradient(0,s1[1],0,s0[1]);q.addColorStop(0,"rgba(255,250,230,.25)");q.addColorStop(1,"rgba(255,250,230,0)");g.fillStyle=q;g.fillRect(s0[0],s0[1],s1[0]-s0[0],s1[1]-s0[1]);g.globalCompositeOperation="source-over";
}
PAINT.scene({id:"p-drive",win:CUTW("drive"),s:[.222,.29],refZ:-40,
  /* light: sodium lamps overhead and the city's glow ahead; mist lies low over the road and thickens with distance */
  look(e,H){const vp=e.P(0,-2,-2000);return{bloom:.38,sun:[vp[0]/e.W,vp[1]/e.H,"255,150,80",.08+.14*e.lp,.6],grade:"rgba(255,170,110,.14)",vig:0,grain:.06};},
  sky(g,e,H){
    const{W,H:Hh,lp,P}=e,hz=P(0,-2,-2000)[1];
    const q=g.createLinearGradient(0,0,0,hz);q.addColorStop(0,"#03060e");q.addColorStop(.7,"#0b1424");q.addColorStop(1,`rgb(${H.lerp(30,70,lp)|0},${H.lerp(34,52,lp)|0},${H.lerp(52,58,lp)|0})`);g.fillStyle=q;g.fillRect(0,0,W,hz+2);
    g.fillStyle="#d8e0f0";for(let k=0;k<120;k++){const x=(k*137.5)%W,y=((k*71.3)%1)*hz*.8;g.globalAlpha=(.15+((k*.37)%1)*.5)*(1-lp*.6);g.fillRect(x,y,1.2,1.2);}g.globalAlpha=1;
    /* the city's glow rises on the horizon as we get closer */
    const vp=P(0,-2,-2000),r=W*(.25+.35*lp);g.globalCompositeOperation="lighter";H.glow(g,"255,160,90",vp[0],vp[1],r,.18+.4*lp);g.globalCompositeOperation="source-over";
  },
  layers:[
    /* snowfields on both sides, out to the dark tree line */
    {z:-40,draw(c,e,r){const{P}=e,poly=PAINT.helpers.poly;
      let q=c.createLinearGradient(0,P(0,-2,-2000)[1],0,P(0,-2,4)[1]);q.addColorStop(0,"#2a3040");q.addColorStop(1,"#5e6678");c.fillStyle=q;
      poly(c,[P(-400,-2,-2000),P(400,-2,-2000),P(400,-2,6),P(-400,-2,6)]);c.fill();
    }}
  ],
  live(g,e,H,i){
    if(i!==0)return;
    const{P,T,lp,W}=e,U=e.u,poly=PAINT.helpers.poly,trav=T*SPD+lp*900;
    /* the road: wet asphalt, salt-grey at the edges */
    g.fillStyle="#14171c";poly(g,[P(-6.4,-2,-2000),P(4.6,-2,-2000),P(4.6,-2,6),P(-6.4,-2,6)]);g.fill();
    /* asphalt: coarse aggregate grain, and the wet sheen in the wheel tracks catching the lamps */
    if(!ROAD){const t=document.createElement("canvas");t.width=t.height=96;const q2=t.getContext("2d"),rr=H.rng(17);for(let k=0;k<1400;k++){q2.fillStyle=rr()<.5?`rgba(0,0,0,${(.2+rr()*.3).toFixed(2)})`:`rgba(150,150,160,${(.06+rr()*.12).toFixed(2)})`;q2.fillRect(rr()*96|0,rr()*96|0,1+(rr()*2|0),1);}ROAD=g.createPattern(t,"repeat");}
    g.fillStyle=ROAD;poly(g,[P(-6.4,-2,-300),P(4.6,-2,-300),P(4.6,-2,6),P(-6.4,-2,6)]);g.fill();
    [.9,3.1,-2.6,-4.4].forEach(x=>{const a=P(x-.35,-2,-300),b=P(x+.35,-2,-300),c2=P(x+.35,-2,6),d=P(x-.35,-2,6),q2=g.createLinearGradient(0,a[1],0,c2[1]);q2.addColorStop(0,"rgba(120,110,110,0)");q2.addColorStop(.6,"rgba(120,110,110,.06)");q2.addColorStop(1,"rgba(150,140,140,.1)");g.fillStyle=q2;poly(g,[a,b,c2,d]);g.fill();});
    let q=g.createLinearGradient(P(-6.4,-2,0)[0],0,P(4.6,-2,0)[0],0);q.addColorStop(0,"rgba(120,126,136,.25)");q.addColorStop(.08,"rgba(0,0,0,0)");q.addColorStop(.92,"rgba(0,0,0,0)");q.addColorStop(1,"rgba(120,126,136,.25)");g.fillStyle=q;poly(g,[P(-6.4,-2,-2000),P(4.6,-2,-2000),P(4.6,-2,6),P(-6.4,-2,6)]);g.fill();
    /* snowbanks along both shoulders */
    [[4.6,5.8],[-6.4,-7.6]].forEach(([a,b])=>{g.fillStyle="#6a7284";poly(g,[P(a,-2,-2000),P(b,-1.6,-2000),P(b,-1.6,6),P(a,-2,6)]);g.fill();});
    /* the median: a concrete barrier with sodium lamps on it */
    g.fillStyle="#3a3e46";poly(g,[P(-.7,-2,-2000),P(-.7,-1.4,-2000),P(-.7,-1.4,6),P(-.7,-2,6)]);g.fill();g.fillStyle="#565b64";poly(g,[P(-.7,-1.4,-2000),P(-1.3,-1.4,-2000),P(-1.3,-1.4,6),P(-.7,-1.4,6)]);g.fill();
    /* lane dashes rushing toward us */
    g.fillStyle="rgba(230,226,210,.75)";for(let k=0;k<60;k++){const z=-((k*7-trav%7)%420)+5;if(z>5.5)continue;const z1=z-2.6;poly(g,[P(1.92,-2,z),P(2.08,-2,z),P(2.08,-2,z1),P(1.92,-2,z1)]);g.fill();}
    g.fillStyle="rgba(230,206,120,.6)";poly(g,[P(-.25,-2,-2000),P(-.12,-2,-2000),P(-.12,-2,6),P(-.25,-2,6)]);g.fill();
    g.fillStyle="rgba(230,226,210,.6)";poly(g,[P(4.2,-2,-2000),P(4.32,-2,-2000),P(4.32,-2,6),P(4.2,-2,6)]);g.fill();
    /* the skyline, rising at the end of the road */
    const vp=P(0,-2,-2000),sh=e.H*H.lerp(.03,.26,H.sm(.15,.95,lp));skyline(g,vp[0]+W*.02,vp[1]+1,sh,T,H);
    /* far tree line over the snowfields, between us and the city */
    g.fillStyle="#070b10";[[-1,-1],[1,1]].forEach(([sd])=>{g.beginPath();const a=P(sd*8,-2,-600);g.moveTo(a[0],a[1]);for(let x=8;x<=200;x+=4){const p=P(sd*x,-2+1.4+Math.sin(x*.3)*.5,-600);g.lineTo(p[0],p[1]);}const b=P(sd*200,-2,-600);g.lineTo(b[0],b[1]);g.fill();});
    /* everything along the road, far to near: trees, median lamps, signs */
    const items=[];
    /* ground mist: a band over the far road that every farther item sits behind */
    items.push([-110,()=>{const y=vp[1],m=e.H*.07,q2=g.createLinearGradient(0,y-m,0,y+m*1.4);q2.addColorStop(0,"rgba(60,56,64,0)");q2.addColorStop(.45,`rgba(${H.lerp(64,110,lp)|0},${H.lerp(62,82,lp)|0},${H.lerp(74,70,lp)|0},.55)`);q2.addColorStop(1,"rgba(40,44,54,0)");g.fillStyle=q2;g.fillRect(0,y-m,W,m*2.4);}]);
    items.push([-40,()=>{const y=vp[1],m=e.H*.12,q2=g.createLinearGradient(0,y-m,0,y+m);q2.addColorStop(0,"rgba(50,50,60,0)");q2.addColorStop(.5,"rgba(70,66,74,.22)");q2.addColorStop(1,"rgba(40,44,54,0)");g.fillStyle=q2;g.fillRect(0,y-m,W,m*2);}]);
    trees.forEach(t=>{const z=-((t.z0*1+trav)%240)+6;items.push([z,()=>{const b=P(t.x,-2,z),u=U(z);H.shadow(g,b[0]+(t.x>0?1:-1)*u*.6,b[1],u*1.4,u*.22,.5,"6,8,12");if(t.bare)PAINT.helpers.tree(g,()=>t.k,b[0],b[1],u*t.h*.9,"rgba(8,10,14,.95)",u*.12,4);else pine(g,b[0],b[1],u*t.h,u,t.k);}]);});
    for(let k=0;k<14;k++){const z=-((k*32-trav%32+448)%448)+6;items.push([z,()=>{const b=P(-1,-1.4,z),tp=P(-1,5.2,z),u=U(z);g.strokeStyle="#20242a";g.lineWidth=Math.max(.6,u*.08);g.beginPath();g.moveTo(b[0],b[1]);g.lineTo(tp[0],tp[1]);g.stroke();
      [-1,1].forEach(sd=>{const h=P(-1+sd*1.4,5.1,z);g.beginPath();g.moveTo(tp[0],tp[1]);g.lineTo(h[0],h[1]);g.stroke();g.globalCompositeOperation="lighter";H.glow(g,"255,184,100",h[0],h[1]+u*.1,u*1.2+2,.9);
        const f=P(-1+sd*2.2,-2,z);g.save();g.translate(f[0],f[1]);g.scale(1,.22);H.glow(g,"255,170,90",0,0,u*3.2,.28);g.restore();g.globalCompositeOperation="source-over";});}]);}
    const sz=lp=>H.lerp(-200,8,lp);
    [[.3,.52,"BOSTON",0],[.66,.9,"Logan Airport",1]].forEach(([a,b,tx,pl])=>{const t=H.clamp((lp-a)/(b-a));if(t<=0||t>=1)return;const z=sz(t);items.push([z,()=>gantry(g,P,U,z,tx,pl)]);});
    items.sort((a,b)=>a[0]-b[0]).forEach(([,f])=>f());
    /* traffic: taillights ahead of us in both our lanes, and headlights coming the other way past the median */
    g.globalCompositeOperation="lighter";
    [[3,-30,.3],[1,-70,.2],[3,-120,.15],[1,-200,.1]].forEach(([x,z0,w],k)=>{const z=z0+Math.sin(T*w+k)*8,u=U(z);[-.6,.6].forEach(sd=>{const p=P(x+sd,-1.3,z);H.glow(g,"255,40,30",p[0],p[1],u*.5+2,.85);
      const rr=P(x+sd,-2,z+2);g.save();g.translate(rr[0],rr[1]);g.scale(.22,1);H.glow(g,"255,40,30",0,0,u*2.2,.25);g.restore();});});
    for(let k=0;k<5;k++){const z=-((k*90+T*SPD*2.6)%420)+6;if(z>5)continue;const u=U(z);[-4.6,-3.4].forEach(x=>{const p=P(x,-1.4,z);H.glow(g,"255,246,226",p[0],p[1],u*.9+2,.95);const rr=P(x,-2,z+3);g.save();g.translate(rr[0],rr[1]);g.scale(.25,1);H.glow(g,"255,240,214",0,0,u*4,.22);g.restore();});}
    /* the light at the end of the road, where Logan is: the cut goes into it */
    H.glow(g,"255,240,214",vp[0],vp[1],e.W*.04*H.sm(.8,1,lp),.8*H.sm(.8,1,lp));
    g.globalCompositeOperation="source-over";
    /* reflectors on the median barrier, catching our headlights as they rush past */
    for(let k=0;k<40;k++){const z=-((k*6-trav%6+240)%240)+5;if(z>4.5)continue;const p=P(-.7,-1.55,z),u=U(z);H.glow(g,"255,226,170",p[0],p[1],u*.12+1,.75);}
    /* spray thrown up behind our tyres off the wet road */
    for(let k=0;k<14;k++){const t=(T*1.8+k/14)%1,sd=k%2?1:-1,pp=P(CARX+sd*.8,-2,CARZ+.4+t*1.5),u=U(CARZ+.4+t*1.5);g.fillStyle=`rgba(170,176,190,${(.12*(1-t)).toFixed(3)})`;g.beginPath();g.arc(pp[0]+sd*u*t*.3,pp[1]-u*(.1+t*.3),u*(.1+t*.25),0,7);g.fill();}
    /* our car: a family wagon from behind, snow on the roof, taillights on, exhaust in the cold */
    const p=P(CARX,-2,CARZ),u=U(CARZ),bob=Math.sin(T*7)*u*.006,R=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(p[0]+x*u,p[1]+y*u+bob,w*u,h*u);};
    g.fillStyle="rgba(0,0,0,.55)";g.beginPath();g.ellipse(p[0],p[1],u*1.1,u*.12,0,0,7);g.fill();
    R(-.92,-.34,.3,.34,"#050608");R(.62,-.34,.3,.34,"#050608");
    q=g.createLinearGradient(0,p[1]-u*.95,0,p[1]-u*.25);q.addColorStop(0,"#2a3442");q.addColorStop(1,"#141a22");g.fillStyle=q;g.fillRect(p[0]-u*.94,p[1]-u*.95+bob,u*1.88,u*.66);
    R(-.86,-1.48,1.72,.54,"#101620");q=g.createLinearGradient(p[0]-u*.8,0,p[0]+u*.8,0);q.addColorStop(0,"rgba(120,140,170,.15)");q.addColorStop(.6,"rgba(255,220,170,.08)");q.addColorStop(1,"rgba(120,140,170,.05)");g.fillStyle=q;g.fillRect(p[0]-u*.78,p[1]-u*1.42+bob,u*1.56,u*.44);
    {const sp=g.createLinearGradient(0,p[1]-u*.95,0,p[1]-u*.8);sp.addColorStop(0,"rgba(255,200,150,.28)");sp.addColorStop(1,"rgba(255,200,150,0)");g.fillStyle=sp;g.fillRect(p[0]-u*.94,p[1]-u*.95+bob,u*1.88,u*.15);}
    R(-.9,-1.56,1.8,.1,"#e8edf4");R(-.25,-.6,.5,.16,"#e6e2d6");
    g.globalCompositeOperation="lighter";[-1,1].forEach(sd=>{R(sd>0?.62:-.88,-.86,.26,.2,"#a01010");H.glow(g,"255,40,30",p[0]+sd*.75*u,p[1]-.76*u+bob,u*.6,.9);
      const rr=P(CARX+sd*.75,-2,CARZ+3);g.save();g.translate(rr[0],rr[1]);g.scale(.2,1);H.glow(g,"255,30,20",0,0,U(CARZ+3)*3,.35);g.restore();});
    H.glow(g,"255,250,230",p[0],p[1]-.52*u+bob,u*.22,.5);g.globalCompositeOperation="source-over";
    for(let k=0;k<10;k++){const t=(T*1.4+k/10)%1;g.fillStyle=`rgba(200,206,220,${(.16*(1-t)).toFixed(3)})`;g.beginPath();g.arc(p[0]+u*(.55+t*.5),p[1]-u*(.2+t*.4),u*(.08+t*.35),0,7);g.fill();}
  },
  grade(g,e){const q=g.createRadialGradient(e.W/2,e.H*.55,e.H*.2,e.W/2,e.H*.55,e.H*1.1);q.addColorStop(0,"rgba(0,0,0,0)");q.addColorStop(1,"rgba(0,0,0,.5)");g.fillStyle=q;g.fillRect(0,0,e.W,e.H);}
});
})();
