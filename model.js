/* The white scale model behind model.html. Scroll moves only the camera and the brass wire, and it redraws only when something changes.
   All geometry is generated here. Words live in world-content.js; visual rules in ~/design/DESIGN.md. */
(()=>{
const params=new URLSearchParams(location.search);
if(params.has("plain")||!window.THREE)return;
const canvas=document.getElementById("c");let r;
try{r=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:"high-performance"});}catch(e){return;}
const ids=window.WORLD.stops.map(s=>s.id),still=matchMedia("(prefers-reduced-motion:reduce)").matches;
const sm=(a,b,t)=>{t=Math.min(1,Math.max(0,(t-a)/(b-a)));return t*t*(3-2*t);},mix=(a,b,t)=>a+(b-a)*t;
let seed=11;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
let stopped=false,dirty=true;
const goFlat=()=>{const here=stopNow();document.body.classList.add("flat");stopped=true;document.getElementById(ids[here]).scrollIntoView();};
canvas.addEventListener("webglcontextlost",goFlat);document.getElementById("plain").addEventListener("click",goFlat);

const phone=()=>innerWidth<=760;
r.shadowMap.enabled=true;r.shadowMap.type=THREE.PCFSoftShadowMap;
const s=new THREE.Scene();s.background=new THREE.Color(0xc7cfd3);const cam=new THREE.PerspectiveCamera(30,1,1,600);
s.add(new THREE.HemisphereLight(0xffffff,0x9aa5ab,2.1));
const sun=new THREE.DirectionalLight(0xfff4e6,2.7);sun.position.set(-46,62,34);sun.castShadow=true;sun.shadow.mapSize.setScalar(phone()?1024:2048);Object.assign(sun.shadow.camera,{left:-72,right:72,top:50,bottom:-50,near:10,far:190});sun.shadow.bias=-.0006;sun.shadow.radius=5;s.add(sun);
const WHITE=new THREE.MeshStandardMaterial({color:0xf1f0ea,roughness:.92}),CARD=new THREE.MeshStandardMaterial({color:0xe3e2da,roughness:.95}),BRASS=new THREE.MeshStandardMaterial({color:0xb6892f,roughness:.4,metalness:.65});
const add=(geo,m,x,y,z)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;s.add(o);return o;};

/* Terrain: stacked contour layers. */
const blob=a=>1+.13*Math.sin(a*3+.6)+.08*Math.sin(a*5+2)+.05*Math.sin(a*8),RX=60,RZ=25,KS=[1,.84,.67,.5,.32],LH=.75;
KS.forEach((k,i)=>{const sh=new THREE.Shape();for(let n=0;n<=96;n++){const a=n/96*Math.PI*2,q=blob(a+i*.12)*k,x=Math.cos(a)*RX*q,y=Math.sin(a)*RZ*q;n?sh.lineTo(x,y):sh.moveTo(x,y);}const g=new THREE.ExtrudeGeometry(sh,{depth:LH,bevelEnabled:false,curveSegments:1});g.rotateX(-Math.PI/2);add(g,i%2?CARD:WHITE,0,i*LH,0);});
const top=(x,z)=>{const a=Math.atan2(-z,x);let n=0;KS.forEach((k,i)=>{const q=blob(a+i*.12)*k;if(Math.hypot(x/(RX*q),z/(RZ*q))<1)n=i+1;});return n*LH;};
add(new THREE.BoxGeometry(170,3,90),new THREE.MeshStandardMaterial({color:0xaab4b9,roughness:.8}),0,-1.5,0);

/* Stops: a pin on the wire, with its building just behind it. side moves the camera to the left or right of the stop. */
const STOPS=[{id:"plaza",x:-46,z:6,side:-1},{id:"davis",x:-30,z:-1,side:-1},{id:"atlas",x:-11,z:9,side:-1},{id:"lab",x:7,z:0,side:-1},{id:"desk",x:23,z:9,side:1},{id:"ai",x:38,z:-1,side:1},{id:"contact",x:50,z:6,side:1}];
const box=(w,h,d,x,z,y0)=>{const b=y0??top(x,z)-.8;return add(new THREE.BoxGeometry(w,h,d),WHITE,x,b+h/2,z);};
const LAND={
  plaza(x,z){for(let i=0;i<7;i++){const a=i/7*6.28,q=4.6+rnd();box(1.6+rnd()*1.4,2+rnd()*1.8,1.6+rnd()*1.2,x+Math.cos(a)*q,z-4+Math.sin(a)*q*.7);}add(new THREE.CylinderGeometry(.4,.55,5,12),WHITE,x,top(x,z-4)+2.5,z-4);},
  davis(x,z){for(let i=0;i<6;i++)box(6.4-i*.9,2.4+i*1.5,5-i*.6,x+i*.12,z-5.2-i*.1);},
  atlas(x,z){const c=z-6,y=top(x,c);box(15,3.6,7,x,c,y-.8);const sh=new THREE.Shape();sh.moveTo(0,0);sh.lineTo(3,0);sh.lineTo(0,1.8);sh.closePath();for(let i=0;i<5;i++)add(new THREE.ExtrudeGeometry(sh,{depth:7,bevelEnabled:false}),WHITE,x-7.5+i*3,y+2.8,c-3.5);for(const q of[-5,-3.3])add(new THREE.CylinderGeometry(.32,.42,8,12),WHITE,q+x,y+4,c-2.4);box(3.4,4.4,3.2,x+9.4,c+1,y-.8);},
  lab(x,z){const c=z-5.5,y=top(x,c);box(10,.5,6,x,c,y-.2);[1,1.8,2.7,3.8,5.2].forEach((h,i)=>box(1.2,h,1.2,x-3.4+i*1.7,c,y+.3));for(const[q,w]of[[-4.7,-2.8],[4.7,-2.8],[-4.7,2.8],[4.7,2.8]])add(new THREE.BoxGeometry(.14,6.6,.14),WHITE,x+q,y+3.3,c+w);add(new THREE.BoxGeometry(9.54,.14,5.74),WHITE,x,y+6.6,c);},
  desk(x,z){const c=z-5.5,y=top(x,c);box(11,2.3,5.4,x,c,y-.8);const roof=new THREE.Mesh(new THREE.CylinderGeometry(2.8,2.8,11,16,1,false,0,Math.PI),WHITE);roof.rotation.z=Math.PI/2;roof.rotation.y=0;roof.scale.set(.55,1,1);roof.position.set(x,y+1.5,c);roof.castShadow=roof.receiveShadow=true;s.add(roof);for(let i=0;i<6;i++)box(2.6-(i%2)*.2,.28,3.4-(i%2)*.2,x+7.6,c+1.4,y+i*.3);},
  ai(x,z){const c=z-5,y=top(x,c);box(8,.5,5.4,x,c,y-.2);add(new THREE.SphereGeometry(1.25,24,16),WHITE,x,y+4.6,c);add(new THREE.CylinderGeometry(.09,.09,4.2,8),BRASS,x,y+2.2,c);for(let i=0;i<6;i++){const a=i/6*6.283,p=x+Math.cos(a)*3.5,q=c+Math.sin(a)*2.2,h=1.5+(i%3)*.75;add(new THREE.SphereGeometry(.48,18,12),WHITE,p,y+h+.5,q);add(new THREE.CylinderGeometry(.04,.04,h,6),BRASS,p,y+h/2+.3,q);}},
  contact(x,z){const c=z-4.6,y=top(x,c);add(new THREE.CylinderGeometry(2.6,3,.6,20),WHITE,x,y+.1,c);add(new THREE.CylinderGeometry(.55,1.15,8.5,18),WHITE,x,y+4.5,c);add(new THREE.CylinderGeometry(.9,.9,.2,18),WHITE,x,y+8.8,c);add(new THREE.SphereGeometry(.55,18,12),BRASS,x,y+9.45,c);}
};
STOPS.forEach(q=>LAND[q.id](q.x,q.z));

/* Trees: spheres on pins, kept clear of the stops. */
{const spots=[];let tries=0;while(spots.length<100&&tries++<2000){const x=-56+rnd()*112,z=-24+rnd()*48,y=top(x,z);if(y<=0||STOPS.some(q=>Math.hypot(q.x-x,(q.z-5-z)*1.1)<10.5))continue;spots.push([x,y,z,.55+rnd()*.6]);}
  const d=new THREE.Object3D(),balls=new THREE.InstancedMesh(new THREE.SphereGeometry(1,14,10),WHITE,spots.length),pins=new THREE.InstancedMesh(new THREE.CylinderGeometry(.04,.04,1,5),WHITE,spots.length);
  spots.forEach(([x,y,z,R],i)=>{d.scale.setScalar(R);d.position.set(x,y+1.4+R*.5,z);d.updateMatrix();balls.setMatrixAt(i,d.matrix);d.scale.set(1,1.4,1);d.position.set(x,y+.7,z);d.updateMatrix();pins.setMatrixAt(i,d.matrix);});
  balls.castShadow=balls.receiveShadow=pins.castShadow=true;s.add(balls,pins);}

/* The brass wire. */
const pts=STOPS.map(q=>new THREE.Vector3(q.x,top(q.x,q.z)+.3,q.z)),flat=new THREE.CatmullRomCurve3(pts,false,"catmullrom",.3).getSpacedPoints(360),curve=new THREE.CatmullRomCurve3(flat.map((p,i)=>{/* Ride just above the highest terrace nearby, so the wire never cuts through a step. */let h=0;for(let n=Math.max(0,i-5);n<=Math.min(360,i+5);n++)h=Math.max(h,top(flat[n].x,flat[n].z));return new THREE.Vector3(p.x,h+.26,p.z);}));curve.arcLengthDivisions=1400;
const SEG=480,SIDES=6,wire=add(new THREE.TubeGeometry(curve,SEG,.09,SIDES,false),BRASS,0,0,0);wire.castShadow=false;
const spaced=curve.getSpacedPoints(600);STOPS.forEach((q,i)=>{let b=0,bd=1e9;spaced.forEach((p,n)=>{const v=Math.hypot(p.x-pts[i].x,p.z-pts[i].z);if(v<bd){bd=v;b=n;}});q.u=b/600;q.pin=add(new THREE.SphereGeometry(.36,16,12),BRASS,spaced[b].x,spaced[b].y,spaced[b].z);q.pin.visible=false;});

/* Camera for each stop. The first and last pull back to show the whole model. */
const WIDE={pos:[-18,70,118],look:[0,0,-2]},WIDE_P={pos:[-30,120,210],look:[0,0,-4]};
const view=i=>{const q=STOPS[i],p=phone();if(i===0||i===STOPS.length-1)return p?WIDE_P:WIDE;const y=top(q.x,q.z),k=p?1.75:1;return{pos:[q.x+q.side*-14*k-2,y+14*k,q.z+34*k],look:[q.x,y+3.4,q.z-3.5]};};

/* Labels stuck to the model, shown only in the wide views. */
const tags=STOPS.map(q=>{const e=document.createElement("a");e.className="tag";e.href="#"+q.id;e.tabIndex=-1;e.setAttribute("aria-hidden","true");e.textContent=window.WORLD.stops.find(o=>o.id===q.id).nav;document.body.appendChild(e);return{e,v:new THREE.Vector3(q.x,top(q.x,q.z)+({plaza:7,davis:12,atlas:10,lab:10,desk:7,ai:9,contact:12})[q.id],q.z-5)};});

/* Scroll maps to a place. */
let holds=[];
function measure(){holds=ids.map(id=>{const t=document.getElementById(id).getBoundingClientRect(),a=t.top+scrollY;return[a,a+t.height-innerHeight];});}
function fromScroll(){const y=scrollY;for(let i=0;i<holds.length;i++){const[a,b]=holds[i];if(y<a){if(!i)return{i:0,j:0,k:0};const k=sm(holds[i-1][1],a,y);return{i:i-1,j:i,k};}if(y<=b)return{i,j:i,k:0};}const n=holds.length-1;return{i:n,j:n,k:0};}
function stopNow(){const q=fromScroll();return q.k>.5?q.j:q.i;}
const links=[...document.querySelectorAll("#navl a")];let on=-1;
const setNav=i=>{if(i===on)return;on=i;links.forEach((a,n)=>a.setAttribute("aria-current",n===i));if(phone())links[i].scrollIntoView({block:"nearest",inline:"center"});};

let W=0,H=0,pr=Math.min(devicePixelRatio||1,1.75),wide=1;
function offset(){if(phone())cam.setViewOffset(W,H,0,-H*.24,W,H);else cam.setViewOffset(W,H,mix(-Math.min(W*.17,250),0,wide),-H*mix(.03,.17,wide),W,H);cam.updateProjectionMatrix();}
const size=()=>{W=innerWidth;H=innerHeight;r.setPixelRatio(pr);r.setSize(W,H,false);cam.aspect=W/H;measure();dirty=true;};

const P=new THREE.Vector3(),L=new THREE.Vector3(),wP=new THREE.Vector3(),wL=new THREE.Vector3(),tmp=new THREE.Vector3();
let ready=false,uW=0,last=performance.now(),count=0,slow=0;
function draw(now){
  const dt=Math.min((now-last)/1000,.1);last=now;
  const q=fromScroll(),a=view(q.i),b=view(q.j),k=q.k;setNav(stopNow());
  wP.fromArray(a.pos).lerp(tmp.fromArray(b.pos),k);wP.y+=Math.sin(k*Math.PI)*(phone()?0:7);wL.fromArray(a.look).lerp(tmp.fromArray(b.look),k);
  const wantU=mix(STOPS[q.i].u,STOPS[q.j].u,k),last_=STOPS.length-1,wantWide=Math.max(q.i===0?1-k:0,q.j===last_?(q.i===last_?1:k):0);
  const damp=still||!ready?1:1-Math.exp(-dt*5);
  const before=P.distanceTo(wP)+L.distanceTo(wL)+Math.abs(uW-wantU)*50+Math.abs(wide-wantWide)*20;
  if(before<.004&&!dirty)return;
  P.lerp(wP,damp);L.lerp(wL,damp);uW+=(wantU-uW)*damp;wide+=(wantWide-wide)*damp;if(!ready){P.copy(wP);L.copy(wL);uW=wantU;wide=wantWide;ready=true;}
  cam.position.copy(P);offset();cam.lookAt(L);cam.updateMatrixWorld();
  wire.geometry.setDrawRange(0,Math.floor(uW*SEG)*SIDES*6);STOPS.forEach(z=>z.pin.visible=z.u<=uW+.004);
  r.render(s,cam);if(sun.shadow.autoUpdate)sun.shadow.autoUpdate=false;dirty=false;
  tags.forEach(t=>{const o=sm(.55,.95,wide);t.e.style.opacity=o;t.e.style.pointerEvents=o>.8?"auto":"none";if(o>0){const p=tmp.copy(t.v).project(cam);t.e.style.transform=`translate(${(p.x+1)/2*W-24}px,${(1-p.y)/2*H-12}px)`;}});
  /* Weak machines step down, then fall back to the plain page. */
  if(!params.has("keep3d")&&!document.hidden&&count<70){count++;if(count>10)slow+=dt;if(count===70){const avg=slow/60;if(avg>.075)goFlat();else if(avg>.03){pr=1;size();}}}
}
function frame(now){if(stopped)return;requestAnimationFrame(frame);try{draw(now);}catch(e){console.error(e);goFlat();}}
window.__model={holds:()=>holds,uW:()=>uW};
/* The page stays plain until everything above has built without error. */
document.body.classList.remove("flat");
addEventListener("resize",size);addEventListener("scroll",()=>dirty=true,{passive:true});size();
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{measure();dirty=true;});
addEventListener("load",()=>{measure();dirty=true;});
requestAnimationFrame(frame);
})();
