/* Boston, leaving from Logan on a winter night. Snow is falling; across the harbour the downtown towers are lit (Custom House Tower floodlit
   with its clock, Millennium Tower, One Financial, the Federal Reserve, Harbor Towers, Rowes Wharf's arch, the Prudential and 200 Clarendon
   behind, the Zakim Bridge to the right) and their lights run down the black water. On the field: Terminal E with tails at the gates, the
   tower, light masts, plows working a taxiway, and the runway in front of us. His plane rolls in from the left, rotates, lifts off and
   climbs out off the right edge of the frame as the reader scrolls (lp), landing lights cutting cones through the snow. Then the camera follows it up.
   Geometry stays at z < 2.5: the camera opens at z 3.6 and pulls back to 9.4. */
(()=>{
const G=-2,ZR=-4,ZW0=-30.3,ZW1=-12.6,ZTX=-1;
/* the skyline, west across the harbour, left (south) to right (north) */
const TOW=[];{const r=PAINT.helpers.rng(77);
  for(let i=0;i<70;i++){const x=-38+r()*76;if(Math.abs(x-15.5)<5)continue;TOW.push({x,z:-38-r()*6,w:.7+r()*1.3,h:1+Math.pow(r(),1.7)*4.2,col:"#1a2131",lit:.12+r()*.25});}
  for(let i=0;i<46;i++){const x=-34+r()*68;TOW.push({x,z:-31-r()*1.5,w:.6+r()*1.4,h:.4+r()*1.4,col:"#161c28",lit:.2+r()*.3});}
  TOW.sort((a,b)=>a.z-b.z);
  [{x:-16,z:-44,w:1.7,h:8.8,kind:"pru",col:"#252c3c",lit:.3},{x:-12.4,z:-44,w:1.2,h:9.3,kind:"hancock",col:"#33435e",lit:.08},
   {x:-8.8,z:-35,w:1.4,h:6.4,kind:"fed",col:"#4a5260",lit:.22},{x:-6,z:-34,w:1.6,h:6.1,kind:"intl",col:"#2b3140",lit:.3},
   {x:-3.6,z:-36,w:1.35,h:8.3,kind:"mill",col:"#2a3850",lit:.42},{x:-.6,z:-35,w:1.5,h:7.4,kind:"onefin",col:"#252b38",lit:.3},
   {x:1.7,z:-36,w:1.1,h:6.7,kind:"bplace",col:"#1c212c",lit:.25},{x:5,z:-34,w:1.1,h:5.2,col:"#262d3b",lit:.3},{x:6.8,z:-35,w:1.3,h:4.7,col:"#222836",lit:.3},
   {x:-2.5,z:-31.5,w:.8,h:4.1,kind:"harbor",col:"#2c3038",lit:.4},{x:-1.3,z:-31.6,w:.8,h:4.1,kind:"harbor",col:"#2a2e36",lit:.4},
   {x:3.3,z:-32,w:.82,h:5.5,kind:"custom",col:"#c9bfa8",lit:.5}].forEach(t=>{const k=TOW.findIndex(q=>q.z>t.z);TOW.splice(k<0?TOW.length:k,0,t);});}
const MAST=[-15,-8,-1,6,13].map(x=>[x,-11.6]);
const GATES=[-11.4,-9,-6.6,-4.2];
/* snow: depth d in 0..1 (near is 1), screen-space so it reads at every width */
const FLAKE=[];{const r=PAINT.helpers.rng(5);for(let i=0;i<950;i++)FLAKE.push([r(),r(),Math.pow(r(),1.5),r()]);}

function tower(c,e,r,t){const{P}=e,u=e.u(t.z),a=P(t.x-t.w/2,G,t.z),b=P(t.x+t.w/2,G+t.h,t.z),x0=a[0],x1=b[0],y0=b[1],y1=a[1],w=x1-x0;
  if(x1<-e.W*.1||x0>e.W*1.1)return;
  let gr=c.createLinearGradient(x0,0,x1,0);gr.addColorStop(0,t.col);gr.addColorStop(1,"#0b0f17");
  if(t.kind==="custom"){gr=c.createLinearGradient(x0,0,x1,0);gr.addColorStop(0,"#e6dcc4");gr.addColorStop(.6,"#b9ac90");gr.addColorStop(1,"#7a6f5c");}
  if(t.kind==="hancock"){gr=c.createLinearGradient(x0,y0,x1,y1);gr.addColorStop(0,"#5d7396");gr.addColorStop(.5,"#2d3c58");gr.addColorStop(1,"#1a2236");}
  c.fillStyle=gr;
  if(t.kind==="mill"){PAINT.helpers.poly(c,[[x0,y1],[x0,y0+u*.9],[x1,y0],[x1,y1]]);c.fill();}
  else if(t.kind==="hancock"){PAINT.helpers.poly(c,[[x0,y1],[x0,y0+u*.05],[x1-w*.12,y0],[x1,y0+u*.1],[x1,y1]]);c.fill();}
  else c.fillRect(x0,y0,w,y1-y0);
  /* floors of windows */
  const fh=Math.max(2.2,u*.13),cw=Math.max(1.5,u*.07),top=t.kind==="mill"?y0+u*.95:y0+fh*.7;
  for(let y=top;y<y1-fh*.6;y+=fh){const full=r()<.05,rate=full?.95:t.lit*(t.kind==="fed"&&y>y1-u*1.1?0:1);
    if(t.kind==="fed"&&y>y1-u*1.1&&y<y1-u*.55){continue;}
    for(let x=x0+cw*.5;x<x1-cw*.9;x+=cw*1.55){if(r()>rate)continue;const v=r();c.fillStyle=v<.7?`rgba(255,${206+r()*24|0},${140+r()*40|0},${(.55+r()*.4).toFixed(2)})`:`rgba(205,${222+r()*20|0},255,${(.45+r()*.35).toFixed(2)})`;c.fillRect(x,y,cw*.8,fh*.55);}}
  /* glass: the upper floors hold the night sky, the lower floors the city's sodium glow */
  if(t.kind!=="custom"){const rg=c.createLinearGradient(0,y0,0,y1);rg.addColorStop(0,"rgba(120,140,190,.16)");rg.addColorStop(.5,"rgba(0,0,0,0)");rg.addColorStop(1,"rgba(255,170,110,.12)");c.fillStyle=rg;c.fillRect(x0,y0,w,y1-y0);}
  /* rim light from the city glow on the left face */
  c.fillStyle="rgba(255,190,140,.10)";c.fillRect(x0,y0,Math.max(1,w*.08),y1-y0);
  const P2=(x,y)=>P(x,y,t.z);
  if(t.kind==="pru"){const m=P2(t.x,G+t.h);c.fillStyle="rgba(255,236,200,.85)";c.fillRect(x0,y0+u*.05,w,u*.12);c.strokeStyle="#9aa2ae";c.lineWidth=Math.max(1,u*.04);c.beginPath();c.moveTo(m[0]+w*.2,m[1]);c.lineTo(m[0]+w*.2,m[1]-u*1.2);c.stroke();}
  if(t.kind==="fed"){/* the open slot near the base and the curved crown */c.fillStyle="#0b0f17";c.fillRect(x0+w*.1,y1-u*1.05,w*.8,u*.45);c.fillStyle="#6c7482";c.beginPath();c.ellipse((x0+x1)/2,y0,w/2,u*.22,0,Math.PI,0);c.fill();
    c.strokeStyle="rgba(190,198,210,.35)";c.lineWidth=1;for(let y=y0+u*.3;y<y1-u*1.1;y+=u*.26){c.beginPath();c.moveTo(x0,y);c.lineTo(x1,y);c.stroke();}}
  if(t.kind==="intl"){const m=P2(t.x,G+t.h);c.fillStyle="#2b3140";PAINT.helpers.poly(c,[[x0+w*.15,y0],[m[0],y0-u*.55],[x1-w*.15,y0]]);c.fill();c.fillStyle="rgba(255,226,170,.9)";c.fillRect(x0+w*.3,y0-u*.2,w*.4,u*.12);}
  if(t.kind==="onefin"){c.fillStyle="#0e121b";c.fillRect(x0,y0,w*.22,u*.5);c.fillRect(x1-w*.22,y0,w*.22,u*.5);c.fillStyle="rgba(255,236,200,.7)";c.fillRect(x0+w*.22,y0,w*.56,u*.06);}
  if(t.kind==="bplace"){c.strokeStyle="#0a0d13";c.lineWidth=Math.max(1,u*.05);for(let y=y0;y<y1-u*1.4;y+=u*1.4){c.beginPath();c.moveTo(x0,y);c.lineTo(x1,y+u*1.4);c.moveTo(x1,y);c.lineTo(x0,y+u*1.4);c.stroke();}}
  if(t.kind==="harbor"){c.strokeStyle="rgba(10,12,16,.6)";c.lineWidth=1;for(let x=x0;x<x1;x+=w/6){c.beginPath();c.moveTo(x,y0);c.lineTo(x,y1);c.stroke();}}
  if(t.kind==="custom"){/* the clock stage, its faces lit, then the stepped pyramid and the lantern */
    const cs=P2(t.x-t.w*.62,G+t.h),ce=P2(t.x+t.w*.62,G+t.h+.75);c.fillStyle="#d8ccb2";c.fillRect(cs[0],ce[1],ce[0]-cs[0],cs[1]-ce[1]);
    const m=P2(t.x,G+t.h+.38);c.fillStyle="#f6f2e6";c.beginPath();c.arc(m[0],m[1],u*.27,0,7);c.fill();c.strokeStyle="#2a2620";c.lineWidth=Math.max(1,u*.03);c.beginPath();c.moveTo(m[0],m[1]);c.lineTo(m[0]-u*.04,m[1]-u*.19);c.moveTo(m[0],m[1]);c.lineTo(m[0]+u*.13,m[1]+u*.04);c.stroke();
    PAINT.helpers.glow(c,"255,246,224",m[0],m[1],u*.7,.5);
    const p0=P2(t.x-t.w*.56,G+t.h+.75),p1=P2(t.x+t.w*.56,G+t.h+.75),pk=P2(t.x,G+t.h+2.1);let q=c.createLinearGradient(p0[0],0,p1[0],0);q.addColorStop(0,"#d2c6ac");q.addColorStop(1,"#6e6554");c.fillStyle=q;PAINT.helpers.poly(c,[p0,pk,p1]);c.fill();
    c.strokeStyle="rgba(60,52,40,.5)";c.lineWidth=1;for(let k=1;k<5;k++){const f=k/5;c.beginPath();c.moveTo(p0[0]+(pk[0]-p0[0])*f,p0[1]+(pk[1]-p0[1])*f);c.lineTo(p1[0]+(pk[0]-p1[0])*f,p1[1]+(pk[1]-p1[1])*f);c.stroke();}
    c.strokeStyle="#cfc6b2";c.beginPath();c.moveTo(pk[0],pk[1]);c.lineTo(pk[0],pk[1]-u*.35);c.stroke();
    /* floodlights wash the shaft from below */q=c.createLinearGradient(0,y1,0,y0);q.addColorStop(0,"rgba(255,230,180,.35)");q.addColorStop(1,"rgba(255,230,180,0)");c.fillStyle=q;c.fillRect(x0,y0,w,y1-y0);}
}
function zakim(c,e){const{P}=e,z=-38,u=e.u(z),deck=G+.55,col="rgba(200,226,255,.9)";
  const d0=P(11,deck,z),d1=P(21,deck,z);c.strokeStyle="#20283a";c.lineWidth=Math.max(1.5,u*.12);c.beginPath();c.moveTo(d0[0],d0[1]);c.lineTo(d1[0],d1[1]);c.stroke();
  c.strokeStyle="rgba(170,200,255,.55)";c.lineWidth=Math.max(1,u*.03);c.beginPath();c.moveTo(d0[0],d0[1]-u*.05);c.lineTo(d1[0],d1[1]-u*.05);c.stroke();
  [[14.2,3.9],[18.6,3.4]].forEach(([x,h])=>{const a=P(x-.35,G,z),b=P(x+.35,G,z),m=P(x,deck+.3,z),t=P(x,G+h,z);
    c.strokeStyle="#c9d6ea";c.lineWidth=Math.max(1.5,u*.09);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(m[0],m[1]);c.lineTo(b[0],b[1]);c.moveTo(m[0],m[1]);c.lineTo(t[0],t[1]);c.stroke();
    c.strokeStyle=col;c.lineWidth=Math.max(.5,u*.012);for(let k=1;k<=10;k++){[-1,1].forEach(s=>{const f=P(x+s*k*.42,deck,z),o=P(x,G+h-.15-k*.11,z);c.beginPath();c.moveTo(o[0],o[1]);c.lineTo(f[0],f[1]);c.stroke();});}
    PAINT.helpers.glow(c,"190,214,255",t[0],t[1]+u*.6,u*1.2,.35);});}
/* a widebody parked nose-in at the terminal, seen from behind: fuselage, tail fin, stabilisers, wings and engines */
function tailView(c,e,r,x,z,tint){const{P}=e,u=e.u(z),f=P(x,G+.32,z),s=u*.2;
  c.fillStyle="#3d434e";c.beginPath();c.ellipse(f[0],f[1],s,s,0,0,7);c.fill();
  c.strokeStyle="#4b525e";c.lineWidth=Math.max(1,u*.05);c.beginPath();c.moveTo(f[0]-u*1.25,f[1]+s*.6);c.lineTo(f[0]+u*1.25,f[1]+s*.6);c.stroke();
  [-1,1].forEach(k=>{c.fillStyle="#30353e";c.beginPath();c.ellipse(f[0]+k*u*.5,f[1]+s*1.15,s*.5,s*.5,0,0,7);c.fill();c.fillStyle="#12151a";c.beginPath();c.ellipse(f[0]+k*u*.5,f[1]+s*1.15,s*.3,s*.3,0,0,7);c.fill();});
  c.strokeStyle="#59606b";c.lineWidth=Math.max(1,u*.035);c.beginPath();c.moveTo(f[0]-u*.45,f[1]-s*.3);c.lineTo(f[0]+u*.45,f[1]-s*.3);c.stroke();
  const tp=P(x,G+1.05,z);c.fillStyle=tint;PAINT.helpers.poly(c,[[f[0]-u*.07,f[1]-s*.8],[tp[0]-u*.04,tp[1]],[tp[0]+u*.05,tp[1]],[f[0]+u*.08,f[1]-s*.8]]);c.fill();
  PAINT.helpers.glow(c,"255,240,214",tp[0],(tp[1]+f[1])/2,u*.45,.3);}

PAINT.scene({id:"p-bos",win:CUTW("bos"),s:[.293,.347],refZ:-8,
  /* light: sodium masts on the field and the city's glow over the harbour; snow in the air greys the far shore */
  air:{rgb:"58,64,86",k:.34,z0:-20},
  look:{bloom:.36,sun:[.42,.5,"255,186,130",.07,.8],grade:"rgba(120,150,240,.12)",vig:0,grain:.07},
  sky(g,e,H){const{P,T,W}=e,poly=H.poly,hz=P(0,G,-400)[1];
    let gr=g.createLinearGradient(0,0,0,hz);gr.addColorStop(0,"#05080f");gr.addColorStop(.45,"#121828");gr.addColorStop(.8,"#30293a");gr.addColorStop(1,"#5a4034");g.fillStyle=gr;g.fillRect(0,0,W,e.H);
    /* the low overcast, lit orange from under by the city */
    for(let i=0;i<9;i++){const x=((i*311+T*4)%(W*1.6))-W*.3,y=hz*(.08+.1*(i%5)),w=W*(.22+.06*(i%3));g.save();g.translate(x,y);g.scale(1,.2);const cg=g.createRadialGradient(0,0,0,0,0,w);
      cg.addColorStop(0,i%2?"rgba(92,70,66,.28)":"rgba(18,22,34,.5)");cg.addColorStop(1,"rgba(18,22,34,0)");g.fillStyle=cg;g.fillRect(-w,-w,2*w,2*w);g.restore();}
    /* an arrival far out on approach, its landing light slowly coming down */
    {const ph=((T/38)%1),p=[W*(.04+.12*ph),hz*(.55+.38*ph)];H.glow(g,"255,250,236",p[0],p[1],e.u(-60)*.9+4,.75*H.sm(0,.1,ph)*(1-H.sm(.9,1,ph)));}
    g.fillStyle="#5c6476";g.fillRect(0,hz,W,e.H-hz);
    const Q=(x,z)=>P(x,G,z),zn=Math.min(2.5,e.cam.z-.6);
    /* the harbour */
    poly(g,[Q(-90,ZW0),Q(90,ZW0),Q(90,ZW1),Q(-90,ZW1)]);gr=g.createLinearGradient(0,Q(0,ZW0)[1],0,Q(0,ZW1)[1]);gr.addColorStop(0,"#1a1c26");gr.addColorStop(1,"#080b12");g.fillStyle=gr;g.fill();
    /* the field under snow, cold blue, warmer where the masts light it */
    poly(g,[Q(-90,ZW1),Q(90,ZW1),Q(90,zn),Q(-90,zn)]);gr=g.createLinearGradient(0,Q(0,ZW1)[1],0,Q(0,zn)[1]);gr.addColorStop(0,"#6d7486");gr.addColorStop(.35,"#8e95a6");gr.addColorStop(1,"#5c6476");g.fillStyle=gr;g.fill();
    /* the seawall edge, plowed snow piled along it */
    poly(g,[Q(-90,ZW1),Q(90,ZW1),Q(90,ZW1+.25),Q(-90,ZW1+.25)]);g.fillStyle="#a9afbd";g.fill();
    MAST.forEach(([x,z])=>{const p=Q(x,z+1.6),u=e.u(z+1.6);g.save();g.translate(p[0],p[1]);g.scale(1,.22);const q=g.createRadialGradient(0,0,0,0,0,u*4.5);q.addColorStop(0,"rgba(255,196,120,.45)");q.addColorStop(1,"rgba(255,196,120,0)");g.fillStyle=q;g.fillRect(-u*4.5,-u*4.5,u*9,u*9);g.restore();});
    /* a taxiway behind the runway, cleared, with the plows on it */
    poly(g,[Q(-90,-9.4),Q(90,-9.4),Q(90,-8.6),Q(-90,-8.6)]);g.fillStyle="#2a2e38";g.fill();
    /* the runway: wet black asphalt, snow banked on the shoulders, centreline and touchdown marks */
    poly(g,[Q(-90,ZR-1.25),Q(90,ZR-1.25),Q(90,ZR+1.25),Q(-90,ZR+1.25)]);g.fillStyle="#b7bccb";g.fill();
    poly(g,[Q(-90,ZR-1),Q(90,ZR-1),Q(90,ZR+1),Q(-90,ZR+1)]);gr=g.createLinearGradient(0,Q(0,ZR-1)[1],0,Q(0,ZR+1)[1]);gr.addColorStop(0,"#15181f");gr.addColorStop(1,"#20232b");g.fillStyle=gr;g.fill();
    g.fillStyle="rgba(214,220,232,.5)";for(let x=-60;x<60;x+=1.6){poly(g,[Q(x,ZR-.04),Q(x+.8,ZR-.04),Q(x+.8,ZR+.04),Q(x,ZR+.04)]);g.fill();}
    [-1,1].forEach(s=>{for(let x=-14;x<-6;x+=1.2)poly(g,[Q(x,ZR+s*.45),Q(x+.7,ZR+s*.45),Q(x+.7,ZR+s*.6),Q(x,ZR+s*.6)]),g.fill();});
    /* tyre streaks of rubber and slush */
    g.strokeStyle="rgba(60,64,74,.5)";g.lineWidth=Math.max(1,e.u(ZR)*.05);[-.3,.3].forEach(o=>{const a=Q(-90,ZR+o),b=Q(90,ZR+o);g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke();});
    /* the near taxiway, plowed */
    poly(g,[Q(-90,ZTX-.45),Q(90,ZTX-.45),Q(90,ZTX+.45),Q(-90,ZTX+.45)]);g.fillStyle="#3a3f4a";g.fill();
    g.strokeStyle="rgba(230,190,60,.7)";g.lineWidth=Math.max(1,e.u(ZTX)*.03);{const a=Q(-90,ZTX),b=Q(90,ZTX);g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke();}
  },
  layers:[
    {z:-36,draw(c,e,r){const{P}=e;
      /* the far shore: a dark band of low city, then every tower in depth order */
      const s0=P(-90,G+.35,-33),s1=P(90,G,-33);c.fillStyle="#0f141e";c.fillRect(s0[0],s0[1],s1[0]-s0[0],s1[1]-s0[1]+2);
      TOW.forEach(t=>{if(t.z<-37.5)tower(c,e,r,t);});zakim(c,e);TOW.forEach(t=>{if(t.z>=-37.5)tower(c,e,r,t);});
      /* Rowes Wharf on the water: brick, the great arch lit gold, the dome above it */
      {const z=-30.6,u=e.u(z),a=P(-8.1,G,z),b=P(-5.7,G+1.7,z);c.fillStyle="#5a3428";c.fillRect(a[0],b[1],b[0]-a[0],a[1]-b[1]);
        for(let y=b[1]+u*.15;y<a[1]-u*.1;y+=u*.16)for(let x=a[0]+u*.08;x<b[0]-u*.08;x+=u*.12)if(r()<.45){c.fillStyle="rgba(255,214,160,.8)";c.fillRect(x,y,u*.06,u*.08);}
        const m=P(-6.9,G+.95,z);c.fillStyle="rgba(255,206,130,.95)";c.beginPath();c.moveTo(m[0]-u*.35,a[1]);c.lineTo(m[0]-u*.35,m[1]);c.arc(m[0],m[1],u*.35,Math.PI,0);c.lineTo(m[0]+u*.35,a[1]);c.fill();
        const d=P(-6.9,G+1.7,z);c.fillStyle="#7a8a8c";c.beginPath();c.arc(d[0],d[1],u*.28,Math.PI,0);c.fill();PAINT.helpers.glow(c,"255,214,150",m[0],m[1],u*1.2,.4);}
      /* the Harborwalk lights along the shore */
      for(let x=-40;x<40;x+=.35){const p=P(x,G+.1,-30.4);PAINT.helpers.glow(c,r()<.8?"255,206,140":"220,232,255",p[0],p[1],e.u(-30.4)*.12,.55+r()*.4);}
    }},
    {z:-22,draw(c,e,r){const{P}=e;
      /* the reflections: broken into ripples, clipped to the water */
      c.save();PAINT.helpers.poly(c,[P(-90,G,ZW0),P(90,G,ZW0),P(90,G,ZW1),P(-90,G,ZW1)]);c.clip();
      const sh=P(0,G,ZW0)[1],dy=Math.max(1.5,e.dpr*1.4);
      TOW.forEach(t=>{const a=P(t.x,G,t.z),b=P(t.x,G-t.h*.9,t.z),w=e.u(t.z)*t.w,warm=t.kind==="custom"?"255,236,200":t.kind==="hancock"?"150,180,230":"255,210,150",k=t.kind==="custom"?.5:.16+t.lit*.3;
        for(let y=sh;y<b[1];y+=dy){const f=(y-sh)/(b[1]-sh+1);if(r()>.75-f*.4)continue;c.fillStyle=`rgba(${warm},${(k*(1-f)*(.4+r()*.6)).toFixed(3)})`;const ww=w*(.4+r()*.7);c.fillRect(a[0]-ww/2+(r()-.5)*w*.5,y,ww,dy*.6);}});
      for(let x=-40;x<40;x+=.35){const a=P(x,G,-30.4),L=e.u(-30.4)*(1.5+r()*2.5);for(let y=sh;y<sh+L;y+=dy*1.3){if(r()<.4)continue;c.fillStyle=`rgba(255,206,140,${(.35*(1-(y-sh)/L)).toFixed(3)})`;c.fillRect(a[0]-1.5+(r()-.5)*4,y,3+r()*3,dy*.6);}}
      [[14.2,3.9],[18.6,3.4]].forEach(([x,h])=>{const a=P(x,G,-38),u=e.u(-38);for(let y=sh;y<sh+u*h*.8;y+=dy){if(r()<.5)continue;c.fillStyle="rgba(190,214,255,.18)";c.fillRect(a[0]-u*.3+(r()-.5)*u*.4,y,u*.6,dy*.6);}});
      c.restore();}},
    {z:-14,draw(c,e,r){const{P}=e,poly=PAINT.helpers.poly,z=-14.2,u=e.u(z);
      /* Terminal E: a long low hall of lit glass under a white roof, the jet bridges reaching out to the tails */
      {const a=P(-13,G,z),b=P(-2.6,G+.75,z);c.fillStyle="#1d2330";c.fillRect(a[0],b[1],b[0]-a[0],a[1]-b[1]);
        let q=c.createLinearGradient(0,b[1],0,a[1]);q.addColorStop(0,"rgba(255,226,180,.85)");q.addColorStop(1,"rgba(255,206,150,.55)");c.fillStyle=q;c.fillRect(a[0],b[1]+u*.18,b[0]-a[0],u*.34);
        c.fillStyle="rgba(20,24,32,.7)";for(let x=a[0];x<b[0];x+=u*.22)c.fillRect(x,b[1]+u*.18,Math.max(1,u*.03),u*.34);
        c.fillStyle="#d7dce6";c.fillRect(a[0]-u*.1,b[1]-u*.08,b[0]-a[0]+u*.2,u*.1);
        GATES.forEach(x=>{const j0=P(x,G+.35,z+.1),j1=P(x+.1,G+.33,z+2.2);c.strokeStyle="#4b515c";c.lineWidth=Math.max(2,u*.13);c.beginPath();c.moveTo(j0[0],j0[1]);c.lineTo(j1[0],j1[1]);c.stroke();});}
      GATES.forEach((x,i)=>tailView(c,e,r,x+.1,z+2.9,["#2a3550","#5b2c2c","#2b4a44","#3a3a46"][i]));
      /* the control tower: a tall shaft, the glass cab lit, antennas and the red light on top */
      {const x=7.4,zt=-15.5,ut=e.u(zt),a=P(x-.2,G,zt),b=P(x+.2,G+4.4,zt);let q=c.createLinearGradient(a[0],0,b[0],0);q.addColorStop(0,"#a8acb4");q.addColorStop(1,"#4c5058");c.fillStyle=q;c.fillRect(a[0],b[1],b[0]-a[0],a[1]-b[1]);
        const base=P(x-.9,G+.6,zt),be=P(x+.9,G,zt);c.fillStyle="#2b303a";c.fillRect(base[0],base[1],be[0]-base[0],be[1]-base[1]);c.fillStyle="rgba(255,220,170,.7)";for(let k=0;k<6;k++)c.fillRect(base[0]+ut*(.15+k*.27),base[1]+ut*.2,ut*.14,ut*.12);
        const c0=P(x-.55,G+4.4,zt),c1=P(x+.55,G+4.95,zt);c.fillStyle="#5d636d";PAINT.helpers.poly(c,[[c0[0]+ut*.15,c0[1]+ut*.2],[c1[0]-ut*.15,c0[1]+ut*.2],[c1[0],c0[1]],[c0[0],c0[1]]]);c.fill();
        q=c.createLinearGradient(0,c1[1],0,c0[1]);q.addColorStop(0,"rgba(150,220,200,.9)");q.addColorStop(1,"rgba(90,160,150,.8)");c.fillStyle=q;PAINT.helpers.poly(c,[[c0[0],c0[1]],[c1[0],c0[1]],[c1[0]+ut*.08,c1[1]],[c0[0]-ut*.08,c1[1]]]);c.fill();
        c.fillStyle="rgba(20,30,34,.6)";for(let k=1;k<6;k++){const xx=c0[0]+(c1[0]-c0[0])*k/6;c.fillRect(xx,c1[1],Math.max(1,ut*.02),c0[1]-c1[1]);}
        c.fillStyle="#3b4049";c.fillRect(c0[0]-ut*.12,c1[1]-ut*.12,c1[0]-c0[0]+ut*.24,ut*.14);c.strokeStyle="#8a8f98";c.lineWidth=Math.max(1,ut*.02);c.beginPath();c.moveTo(P(x+.2,0,zt)[0],c1[1]-ut*.1);c.lineTo(P(x+.2,0,zt)[0],c1[1]-ut*.8);c.stroke();}
      /* hangars and maintenance sheds to the right, floodlit */
      [[10,13.8,.85],[14.5,18,1.05],[18.6,22,.8]].forEach(([x0,x1,h])=>{const a=P(x0,G,z),b=P(x1,G+h,z),m=P((x0+x1)/2,G+h+.35,z);c.fillStyle="#272c36";c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(a[0],b[1]);c.quadraticCurveTo(m[0],m[1],b[0],b[1]);c.lineTo(b[0],a[1]);c.fill();
        c.fillStyle="#cfd4de";c.beginPath();c.moveTo(a[0],b[1]);c.quadraticCurveTo(m[0],m[1],b[0],b[1]);c.quadraticCurveTo(m[0],m[1]+u*.08,a[0],b[1]);c.fill();
        c.fillStyle="rgba(255,226,170,.55)";c.fillRect(a[0]+(b[0]-a[0])*.15,a[1]-(a[1]-b[1])*.7,(b[0]-a[0])*.7,(a[1]-b[1])*.7);});
      /* light masts */
      /* pools of mast light on the snow, and soft shadows at the foot of every building */
      MAST.forEach(([x,zm])=>{const a=P(x,G,zm),um=e.u(zm);c.save();c.translate(a[0],a[1]);c.scale(1,.18);c.globalCompositeOperation="lighter";PAINT.helpers.glow(c,"255,196,130",0,0,um*3.2,.22);c.restore();});
      {const a=P(-13,G,z),b=P(-2.6,G,z);PAINT.helpers.shadow(c,(a[0]+b[0])/2,a[1]+u*.04,(b[0]-a[0])*.58,u*.12,.5);}
      [[10,13.8],[14.5,18],[18.6,22]].forEach(([x0,x1])=>{const a=P(x0,G,z),b=P(x1,G,z);PAINT.helpers.shadow(c,(a[0]+b[0])/2,a[1]+u*.03,(b[0]-a[0])*.6,u*.1,.5);});
      {const a=P(7.4,G,-15.5);PAINT.helpers.shadow(c,a[0],a[1]+u*.03,e.u(-15.5)*1.2,u*.1,.5);}
      MAST.forEach(([x,zm])=>{const a=P(x,G,zm),b=P(x,G+2.6,zm),um=e.u(zm);c.strokeStyle="#2a2e36";c.lineWidth=Math.max(1,um*.04);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();c.fillStyle="#3a3e46";c.fillRect(b[0]-um*.22,b[1]-um*.04,um*.44,um*.1);});
      /* a lit sign over the terminal road and a stand of bare trees by the seawall */
      for(let i=0;i<16;i++){const x=-24+r()*8,p=P(x,G,-13),h=e.u(-13)*(.7+r()*.6);PAINT.helpers.tree(c,r,p[0],p[1],h,"rgba(30,34,44,.9)",Math.max(1,h*.03),5);}
      for(let i=0;i<12;i++){const x=24+r()*10,p=P(x,G,-13),h=e.u(-13)*(.7+r()*.6);PAINT.helpers.tree(c,r,p[0],p[1],h,"rgba(30,34,44,.9)",Math.max(1,h*.03),5);}
      /* snow on the roofs and drifts against the buildings */
      c.fillStyle="rgba(220,226,238,.9)";for(let x=-13;x<22;x+=.12){const p=P(x,G,z+.05);c.beginPath();c.arc(p[0],p[1],u*(.05+r()*.07),Math.PI,0);c.fill();}
    }},
    {z:1.2,draw(c,e,r){const{P}=e,poly=PAINT.helpers.poly,u=e.u(1.2);
      /* the plowed bank along our edge of the taxiway: lumpy, blue in shadow, lit gold on its crest by the masts */
      const pts=[P(-30,G-.6,1.2)];for(let x=-30;x<=30;x+=.25)pts.push(P(x,G+.2+.13*Math.sin(x*1.7)+.08*Math.sin(x*4.3+1)+r()*.04,1.2));pts.push(P(30,G-.6,1.2));
      poly(c,pts);let q=c.createLinearGradient(0,P(0,G+.35,1.2)[1],0,P(0,G-.5,1.2)[1]);q.addColorStop(0,"#c3c8d6");q.addColorStop(.3,"#8e95aa");q.addColorStop(1,"#3a4052");c.fillStyle=q;c.fill();
      c.strokeStyle="rgba(255,220,180,.35)";c.lineWidth=Math.max(1,u*.02);c.beginPath();pts.slice(1,-1).forEach((p,i)=>i?c.lineTo(p[0],p[1]-1):c.moveTo(p[0],p[1]-1));c.stroke();
      /* dry grass through the snow */
      c.strokeStyle="rgba(120,104,80,.8)";c.lineWidth=Math.max(.6,u*.006);for(let i=0;i<260;i++){const x=-30+r()*60,p=P(x,G+.2+.13*Math.sin(x*1.7),1.2),h=u*(.05+r()*.12);c.beginPath();c.moveTo(p[0],p[1]);c.quadraticCurveTo(p[0]+(r()-.5)*h*.4,p[1]-h*.6,p[0]+(r()-.5)*h*.8,p[1]-h);c.stroke();}
      /* the taxiway guidance signs: location B on black, runway 4R-22L on red, lit from inside, snow on their tops */
      const sign=(x,z,parts)=>{const us=e.u(z),y0=G+.18,hh=.32;let x0=x;parts.forEach(([txt,bg,fg,w])=>{const a=P(x0,y0,z),b=P(x0+w,y0+hh,z);c.fillStyle=bg;c.fillRect(a[0],b[1],b[0]-a[0],a[1]-b[1]);
          c.fillStyle=fg;c.font=`700 ${Math.round(us*.22)}px system-ui,-apple-system,Helvetica,Arial,sans-serif`;c.textAlign="center";c.textBaseline="middle";c.fillText(txt,(a[0]+b[0])/2,(a[1]+b[1])/2+us*.01);x0+=w;});
        const a=P(x,y0,z),b=P(x0,y0+hh,z);c.strokeStyle="#15171b";c.lineWidth=Math.max(1,us*.025);c.strokeRect(a[0],b[1],b[0]-a[0],a[1]-b[1]);
        c.fillStyle="#0e1014";[x+.1,x0-.1].forEach(xx=>{const p=P(xx,G,z),t=P(xx,y0,z);c.fillRect(p[0]-us*.02,t[1],us*.04,p[1]-t[1]);});
        c.fillStyle="#eef1f7";c.beginPath();c.moveTo(a[0]-us*.02,b[1]);for(let k=0;k<=10;k++){const xx=a[0]+(b[0]-a[0])*k/10;c.lineTo(xx,b[1]-us*(.025+r()*.035));}c.lineTo(b[0]+us*.02,b[1]);c.fill();};
      sign(1.4,.9,[["B","#16181c","#f2c230",.42],["4R-22L","#b8121b","#fff",1.25]]);
      /* the stalks of the blue taxiway edge lights in front */
      for(let x=-30;x<30;x+=1.8){const p=P(x,G+.05,.3),t=P(x,G+.24,.3),us=e.u(.3);c.strokeStyle="#c9a11c";c.lineWidth=Math.max(1,us*.025);c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(t[0],t[1]);c.stroke();c.fillStyle="#2a4fd0";c.beginPath();c.arc(t[0],t[1],us*.03,0,7);c.fill();}
    }},
  ],
  live(g,e,H,i){const{P,T,lp,W}=e;
    if(i===0){/* red obstruction lights on the tower tops, slow and out of step */
      TOW.forEach((t,k)=>{if(t.h<5)return;const p=P(t.x+(t.kind==="pru"?t.w*.2:0),G+t.h+(t.kind==="pru"?1.2:t.kind==="custom"?2.4:.05),t.z),on=Math.sin(T*2.1+k*1.7)>.2;if(on)H.glow(g,"255,60,50",p[0],p[1],e.u(t.z)*.25+2,.85);});}
    if(i===0){/* a plane on final approach over the harbour, landing lights on, slowly descending toward the far runway */
      const t=(T*.025)%1,x=-34+t*30,y=G+7-t*5.5,p=P(x,y,-26),u=e.u(-26);H.glow(g,"255,250,235",p[0],p[1],u*.5+3,.85*(1-H.sm(.85,1,t)));H.glow(g,"255,60,50",p[0]-u*.2,p[1]-u*.08,u*.12+1,Math.sin(T*6)>.6?.9:0);}
    if(i===1){/* the water moves: a few glints slide on the reflections */
      for(let k=0;k<40;k++){const x=((k*.618)%1)*W,y=P(0,G,ZW0)[1]+((k*.371)%1)*(P(0,G,ZW1)[1]-P(0,G,ZW0)[1])*.8,a=Math.max(0,Math.sin(T*1.7+k*2.3));g.fillStyle=`rgba(255,220,170,${(a*a*.25).toFixed(3)})`;g.fillRect(x+Math.sin(T+k)*6,y,8+((k*7)%10),1.2*e.dpr);}}
    if(i===2){
      /* mast light, the tower's rotating beacon (white then green), the cab glow */
      MAST.forEach(([x,z])=>{const p=P(x,G+2.6,z),u=e.u(z);H.glow(g,"255,200,130",p[0],p[1],u*1.1,.7);});
      {const p=P(7.4,G+5.1,-15.5),ph=(T*.8)%1;H.glow(g,ph<.5?"240,246,255":"90,255,140",p[0],p[1],e.u(-15.5)*.4,Math.pow(Math.max(0,Math.sin(ph*Math.PI*2*2)),6)*.9);
        const r=P(7.6,G+5.75,-15.5);if(Math.sin(T*1.6)>0)H.glow(g,"255,50,40",r[0],r[1],e.u(-15.5)*.18+2,.9);}
      /* plows working the far taxiway in echelon, amber lights turning */
      for(let k=0;k<3;k++){const z=-9+k*.12,x=-26+((T*.35+k*1.1)%52),u=e.u(z),p=P(x,G,z);
        g.fillStyle="#d8dce6";g.globalAlpha=.6;g.beginPath();g.ellipse(p[0]-u*.45,p[1]-u*.08,u*.35,u*.1,0,0,7);g.fill();g.globalAlpha=1;
        g.fillStyle="#7a4512";g.fillRect(p[0]-u*.4,p[1]-u*.26,u*.55,u*.22);g.fillStyle="#9a5a18";g.fillRect(p[0]+u*.15,p[1]-u*.34,u*.22,u*.3);g.fillStyle="rgba(255,226,170,.7)";g.fillRect(p[0]+u*.19,p[1]-u*.3,u*.14,u*.1);
        g.fillStyle="#c9a11c";H.poly(g,[[p[0]+u*.37,p[1]-u*.2],[p[0]+u*.52,p[1]-u*.12],[p[0]+u*.48,p[1]],[p[0]+u*.37,p[1]-u*.02]]);g.fill();
        g.fillStyle="#141619";[[-.28],[.25]].forEach(([o])=>{g.beginPath();g.arc(p[0]+u*o,p[1]-u*.03,u*.05,0,7);g.fill();});
        H.glow(g,"255,246,226",p[0]+u*.4,p[1]-u*.14,u*.35,.7);const fl=Math.pow(Math.max(0,Math.sin(T*7+k*2)),4);H.glow(g,"255,160,30",p[0]+u*.26,p[1]-u*.38,u*.5,fl*.95);}
      /* runway edge lights, the centreline, and their streaks on the wet surface */
      [ZR-1.05,ZR+1.05].forEach(z=>{const u=e.u(z);for(let x=-60;x<60;x+=1.1){const p=P(x,G+.04,z);if(p[0]<-20||p[0]>W+20)continue;H.glow(g,"255,248,230",p[0],p[1],u*.14+1.5,.9);}});
      {const u=e.u(ZR);for(let x=-60;x<60;x+=.55){const p=P(x,G,ZR);if(p[0]<-10||p[0]>W+10)continue;H.glow(g,"255,252,240",p[0],p[1],u*.06+1,.5);g.fillStyle="rgba(255,240,220,.12)";g.fillRect(p[0]-1,p[1],2,u*.25);}}
      /* the near taxiway: blue edges, green centreline */
      [ZTX-.48,ZTX+.48].forEach(z=>{const u=e.u(z);for(let x=-40;x<40;x+=1.8){const p=P(x+(z>ZTX?0:.9),G+.06,z);if(p[0]<-20||p[0]>W+20)continue;H.glow(g,"80,120,255",p[0],p[1],u*.12+1.5,.9);}});
      {const u=e.u(ZTX);for(let x=-40;x<40;x+=.6){const p=P(x,G,ZTX);if(p[0]<-10||p[0]>W+10)continue;H.glow(g,"90,255,150",p[0],p[1],u*.05+1,.6);}}
      jet(g,e,H);
      snow(g,e,H,0,.72);
    }
    if(i===3){[.3].forEach(()=>{});for(let x=-30;x<30;x+=1.8){const t=P(x,G+.24,.3);H.glow(g,"90,130,255",t[0],t[1],e.u(.3)*.22,.9);}
      snow(g,e,H,.72,1);}
  },
  grade(g,e){let gr=g.createLinearGradient(0,0,0,e.H);gr.addColorStop(0,"rgba(20,30,60,.18)");gr.addColorStop(1,"rgba(20,30,60,0)");g.fillStyle=gr;g.fillRect(0,0,e.W,e.H);
    gr=g.createRadialGradient(e.W/2,e.H*.48,e.H*.32,e.W/2,e.H*.5,e.H*.95);gr.addColorStop(0,"rgba(6,8,14,0)");gr.addColorStop(1,"rgba(6,8,14,.5)");g.fillStyle=gr;g.fillRect(0,0,e.W,e.H);}
});

/* where his plane is at scene progress lp: rolling, rotating at .42-.5, off at .5, then climbing out to the right, east toward Doha, at the runway's depth so it leaves the frame instead of shrinking into the sky */
let JET=null;
function jetAt(e){const{P,lp,W}=e,u0=e.u(ZR),hw=W/2/u0,cx=(P(0,G,ZR)[0]-W/2)/u0;
  let x,h=0,z=ZR;if(lp<.5)x=cx-hw*1.3+hw*1.42*Math.pow(lp/.5,1.6);else{const d=(lp-.5)/.5,hh=e.H/2/u0;x=cx+hw*.12+hw*2.1*Math.pow(d,1.5);h=hh*1.25*Math.pow(d,1.3);z=ZR-2.5*d;}
  return{x,h,z,pitch:.17*PAINT.helpers.sm(.41,.5,lp)+.03*PAINT.helpers.sm(.5,.7,lp),gear:PAINT.helpers.sm(.58,.7,lp),spd:Math.min(1,lp/.5)};}
function jet(g,e,H){const{P,T}=e,J=jetAt(e),u=e.u(J.z),Lp=Math.min(3.2*u,e.W*.42),p=P(J.x,G+J.h,J.z);JET=null;
  if(p[0]<-Lp*.7||p[0]>e.W+Lp*.7)return;
  const th=-J.pitch,cs=Math.cos(th),sn=Math.sin(th),M=(px,py)=>[px+.05,-py-.084],S=(px,py)=>{const[X,Y]=M(px,py);return[p[0]+Lp*(cs*X-sn*Y),p[1]+Lp*(sn*X+cs*Y)];};
  /* the glow it throws on the runway ahead while it is still low */
  const low=1-H.sm(0,2.2,J.h);if(low>.01){const a=P(J.x+3.2,G,J.z);g.save();g.globalCompositeOperation="lighter";g.translate(a[0],a[1]);g.scale(1,.16);const q=g.createRadialGradient(0,0,0,0,0,Lp*1.3);q.addColorStop(0,`rgba(255,250,236,${(.32*low).toFixed(3)})`);q.addColorStop(1,"rgba(255,250,236,0)");g.fillStyle=q;g.fillRect(-Lp*1.3,-Lp*1.3,Lp*2.6,Lp*2.6);g.restore();}
  /* snow blown off the runway by the engines */
  if(low>.01&&J.spd>.05)for(let k=0;k<26;k++){const f=((k*.37+T*1.3)%1),b=S(-.02-f*.9,-.075+f*.06*((k%3)-1)*.6);H.glow(g,"226,232,244",b[0],b[1]+f*Lp*.02,Lp*(.02+f*.09),(1-f)*.28*J.spd*low);}
  g.save();g.translate(p[0],p[1]);g.rotate(th);g.scale(Lp,Lp);g.translate(.05,-.084);g.scale(1,-1);
  const poly=(pts)=>{g.beginPath();pts.forEach((q,i)=>i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.closePath();};
  /* far engine, a little higher and darker behind the fuselage */
  g.fillStyle="#2f343d";g.beginPath();g.ellipse(.09,-.055,.085,.022,0,0,7);g.fill();
  /* tail fin, lit by its logo lights */
  poly([[-.3,.046],[-.43,.205],[-.476,.205],[-.5,.03]]);let q=g.createLinearGradient(0,.04,0,.2);q.addColorStop(0,"#3a4a6c");q.addColorStop(1,"#1c2438");g.fillStyle=q;g.fill();
  q=g.createRadialGradient(-.41,.06,0,-.41,.06,.16);q.addColorStop(0,"rgba(255,240,214,.45)");q.addColorStop(1,"rgba(255,240,214,0)");g.fillStyle=q;poly([[-.3,.046],[-.43,.205],[-.476,.205],[-.5,.03]]);g.fill();
  g.strokeStyle="rgba(230,236,246,.5)";g.lineWidth=.0025;g.beginPath();g.moveTo(-.3,.046);g.lineTo(-.43,.205);g.stroke();
  /* fuselage */
  g.beginPath();g.moveTo(.5,-.004);g.quadraticCurveTo(.495,.032,.43,.0475);g.lineTo(-.36,.0475);g.lineTo(-.49,.035);g.lineTo(-.5,.028);g.lineTo(-.5,.02);g.quadraticCurveTo(-.36,-.045,-.18,-.0475);g.lineTo(.42,-.0475);g.quadraticCurveTo(.49,-.04,.5,-.004);g.closePath();
  q=g.createLinearGradient(0,.0475,0,-.0475);q.addColorStop(0,"#c3c9d4");q.addColorStop(.45,"#a2a9b6");q.addColorStop(1,"#3c424d");g.fillStyle=q;g.fill();
  q=g.createLinearGradient(0,-.0475,0,-.01);q.addColorStop(0,"rgba(255,226,180,.18)");q.addColorStop(1,"rgba(255,226,180,0)");g.fillStyle=q;g.fill();
  /* the cabin windows, lit; doors; the cockpit glass */
  g.fillStyle="rgba(255,224,176,.95)";for(let x=.37;x>-.31;x-=.0105){if([.4,.27,.02,-.19].some(d=>Math.abs(x-d)<.012))continue;g.fillRect(x-.0022,.008,.0044,.0075);}
  g.strokeStyle="rgba(40,44,52,.55)";g.lineWidth=.0012;[.4,.27,.02,-.19].forEach(d=>{g.strokeRect(d-.006,-.022,.012,.042);});
  g.fillStyle="#141924";poly([[.458,.012],[.479,.012],[.49,.0],[.468,-.001]]);g.fill();g.strokeStyle="rgba(200,220,255,.4)";g.lineWidth=.0012;g.beginPath();g.moveTo(.462,.009);g.lineTo(.484,.004);g.stroke();
  /* horizontal stabiliser, the near one */
  poly([[-.36,.012],[-.47,.03],[-.506,.03],[-.46,0]]);g.fillStyle="#7d8592";g.fill();
  /* near wing and its flap fairings */
  poly([[.13,-.022],[-.06,-.03],[-.235,-.058],[-.272,-.057],[-.24,-.048],[-.09,-.012]]);q=g.createLinearGradient(0,-.012,0,-.058);q.addColorStop(0,"#9aa2ae");q.addColorStop(1,"#545b67");g.fillStyle=q;g.fill();
  g.fillStyle="#4a505b";[-.02,-.08,-.14].forEach(x=>{poly([[x,-.033+x*.12],[x-.035,-.04+x*.12],[x-.03,-.046+x*.12]]);g.fill();});
  /* near engine under the wing: pylon, nacelle, intake, exhaust */
  poly([[.12,-.045],[.02,-.047],[-.02,-.028],[.07,-.024]]);g.fillStyle="#8a919d";g.fill();
  g.beginPath();g.moveTo(.19,-.042);g.lineTo(.02,-.05);g.quadraticCurveTo(-.005,-.072,.02,-.094);g.lineTo(.19,-.102);g.quadraticCurveTo(.2,-.072,.19,-.042);
  q=g.createLinearGradient(0,-.042,0,-.102);q.addColorStop(0,"#d3d8e0");q.addColorStop(.5,"#9da4b0");q.addColorStop(1,"#4a505c");g.fillStyle=q;g.fill();
  g.fillStyle="#1a1e25";g.beginPath();g.ellipse(.19,-.072,.0065,.029,0,0,7);g.fill();g.strokeStyle="#e4e8ee";g.lineWidth=.002;g.beginPath();g.ellipse(.19,-.072,.0065,.029,0,0,7);g.stroke();
  g.fillStyle="#5c626c";poly([[.02,-.058],[-.03,-.068],[-.03,-.076],[.02,-.086]]);g.fill();
  /* gear, folding away after lift-off */
  if(J.gear<1){g.globalAlpha=1-J.gear;const up=J.gear*.035;g.strokeStyle="#2a2e35";g.lineWidth=.005;
    g.beginPath();g.moveTo(-.05,-.045);g.lineTo(-.05,-.075+up);g.moveTo(.41,-.045);g.lineTo(.41,-.076+up);g.stroke();
    g.fillStyle="#0f1115";[[-.064,-.0765,.0075],[-.036,-.0765,.0075],[.41,-.078,.006]].forEach(([x,y,r])=>{g.beginPath();g.arc(x,y+up,r,0,7);g.fill();});g.globalAlpha=1;}
  g.restore();
  /* lights: landing lights and their cones through the snow, strobes, beacons, navigation */
  const fwd=[cs,sn],ll=[S(.12,-.028),J.gear<.9?S(.41,-.062):null].filter(Boolean),glare=.9;
  g.save();g.globalCompositeOperation="lighter";
  ll.forEach(o=>{const L=Lp*1.9,a1=Math.atan2(fwd[1],fwd[0]),sp=.16;g.beginPath();g.moveTo(o[0],o[1]);g.lineTo(o[0]+Math.cos(a1-sp)*L,o[1]+Math.sin(a1-sp)*L);g.lineTo(o[0]+Math.cos(a1+sp)*L,o[1]+Math.sin(a1+sp)*L);g.closePath();
    const cq=g.createRadialGradient(o[0],o[1],0,o[0],o[1],L);cq.addColorStop(0,"rgba(255,250,236,.28)");cq.addColorStop(1,"rgba(255,250,236,0)");g.fillStyle=cq;g.fill();});
  g.restore();
  ll.forEach(o=>H.glow(g,"255,252,244",o[0],o[1],Lp*.16,glare));
  const ph=T%1.3,str=(ph<.05||(ph>.12&&ph<.17))?1:0,bc=(T*1.1)%1<.12;
  const tip=S(-.268,-.057),tail=S(-.5,.025);H.glow(g,"120,255,150",tip[0],tip[1],Lp*.03,.9);
  if(str){H.glow(g,"255,255,255",tip[0],tip[1],Lp*.16,1);H.glow(g,"255,255,255",tail[0],tail[1],Lp*.1,.9);}
  if(bc){const b1=S(-.02,.05),b2=S(0,-.05);H.glow(g,"255,40,30",b1[0],b1[1],Lp*.07,1);H.glow(g,"255,40,30",b2[0],b2[1],Lp*.06,.8);}
  JET={o:ll[0],dir:Math.atan2(fwd[1],fwd[0]),L:Lp*1.9};}
/* snow in two bands of depth: the far and middle flakes fall in front of the field, the near ones across everything; flakes inside a
   landing-light cone light up */
function snow(g,e,H,d0,d1){const{T,W}=e,Hh=e.H,dp=e.dpr,in_=(x,y)=>{if(!JET)return 0;const dx=x-JET.o[0],dy=y-JET.o[1],r=Math.hypot(dx,dy);if(r>JET.L||r<1)return 0;const a=Math.abs(Math.atan2(dy,dx)-JET.dir);return a<.17?(1-r/JET.L):0;};
  FLAKE.forEach(([fx,fy,d,s])=>{if(d<d0||d>=d1)return;const sp=.25+d*1.4,x=((fx*W*1.2+T*(-14-24*d)*dp+Math.sin(T*.8+s*9)*12*d*dp)%(W*1.2)+W*1.2)%(W*1.2)-W*.1,y=((fy*Hh+T*sp*80*dp)%(Hh*1.05))-Hh*.02,r=(.8+d*d*4.2)*dp,lit=in_(x,y);
    if(d>.85){H.glow(g,"230,236,250",x,y,r*3.4,.5+.4*lit);return;}g.globalAlpha=1;
    g.fillStyle=`rgba(${lit?"255,252,240":"220,228,244"},${(.45+d*.45+lit*.5).toFixed(3)})`;g.beginPath();g.ellipse(x,y,r*.6,r*(.9+d*1.2),-.2,0,7);g.fill();});}
})();
