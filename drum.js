/* The drum behind drum.html. A helix of curved panels seen from inside. Scroll turns it to bring one panel forward at a time; that panel gets color and its real footage. */
(()=>{
const params=new URLSearchParams(location.search),$=i=>document.getElementById(i);
if(params.has("plain")||!window.THREE)return;
let r;try{r=new THREE.WebGLRenderer({canvas:$("c"),antialias:true,powerPreference:"high-performance"});}catch(e){return;}
const ITEMS=window.DRUM.items,N=ITEMS.length,still=matchMedia("(prefers-reduced-motion:reduce)").matches;
const sm=(a,b,t)=>{t=Math.min(1,Math.max(0,(t-a)/(b-a)));return t*t*(3-2*t);};
let stopped=false;
const goFlat=()=>{stopped=true;document.body.classList.add("flat");Object.values(vids).forEach(v=>v.pause());scrollTo(0,0);};
$("c").addEventListener("webglcontextlost",goFlat);$("nPlain").onclick=goFlat;

const s=new THREE.Scene(),cam=new THREE.PerspectiveCamera(50,1,.1,60);s.background=new THREE.Color(0x050a16);
const TAU=Math.PI*2,R=7,STEP=TAU/6.5,DROP=.72,W=6.1,H=3.8,drum=new THREE.Group();s.add(drum);
const vert=`varying vec2 vUv;varying float vD;void main(){vUv=vec2(1.-uv.x,uv.y);vec4 m=modelViewMatrix*vec4(position,1.);vD=-m.z;gl_Position=projectionMatrix*m;}`;
/* Off-focus panels: soft, fringed, sunk into dark blue. The focused panel: sharp, full color, a thin blue edge. */
const frag=`precision highp float;uniform sampler2D map;uniform float focus,shown;varying vec2 vUv;varying float vD;
void main(){vec2 c=vUv-.5;float e=dot(c,c),soft=(1.-focus);vec2 o=c*(.004+.055*e)*soft;float b=.0035*soft;
vec3 t=vec3(0.);for(int i=0;i<4;i++){float a=float(i)*1.5708+.6;vec2 d=vec2(cos(a),sin(a))*b;t+=vec3(texture2D(map,vUv+o+d).r,texture2D(map,vUv+d).g,texture2D(map,vUv-o+d).b);}t*=.25;
float g=dot(t,vec3(.3,.59,.11));vec3 navy=mix(vec3(.018,.04,.1),vec3(.5,.66,.98),g);vec3 col=mix(navy,t,focus);
col*=mix(1.,.55,smoothstep(7.,15.,vD));vec2 q=abs(c)*2.;float rim=step(.988,max(q.x,q.y));col=mix(col,vec3(.29,.49,.922),rim*focus);
gl_FragColor=vec4(col,smoothstep(.5,2.6,vD)*shown);}`;

/* Panels with no footage are built from their own true count: one mark per summer, $1,000, part or week. Blue marks what has been counted. */
const TYPE={};
function drawType(i,p){const {g}=TYPE[i.id],M=i.marks,cols=M>=100?M/10:M<=4?M:M/2,rows=Math.ceil(M/cols),gap=M>=100?5:14,cw=(920-gap*(cols-1))/cols,ch=(352-gap*(rows-1))/rows,lit=Math.floor(p*M+1e-6);
  g.fillStyle="#081226";g.fillRect(0,0,1024,640);
  for(let k=0;k<M;k++){const col=Math.floor(k/rows),row=k%rows,x=52+col*(cw+gap),y=44+row*(ch+gap);g.fillStyle=k<lit?"#4A7DEB":"#13244C";g.fillRect(x,y,cw,ch);
    if(i.markLabels){g.font='700 38px "JetBrains Mono",monospace';g.textBaseline="alphabetic";g.fillStyle=k<lit?"#050A16":"#7F90AD";g.fillText(i.markLabels[k],x+18,y+ch-20);}}
  let size=170;g.font=`700 ${size}px "JetBrains Mono",monospace`;while(g.measureText(i.big).width>920){size-=6;g.font=`700 ${size}px "JetBrains Mono",monospace`;}
  g.fillStyle="#EAF0FA";g.textBaseline="middle";g.fillText(i.perMark?"$"+(lit*i.perMark).toLocaleString("en-US"):i.big,52,516);TYPE[i.id].t.needsUpdate=true;}
function typePanel(i){const c=document.createElement("canvas");c.width=1024;c.height=640;const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.NoColorSpace;TYPE[i.id]={g:c.getContext("2d"),t};drawType(i,1);return t;}
let filling=null,fillAt=0;
const load=new THREE.TextureLoader(),tex={},vids={},vtex={};
const stillOf=(i,k)=>{const key=i.id+(i.stills?k%i.stills:0);if(!tex[key]){tex[key]=i.stills?load.load(`media/stills/${i.id}-${k%i.stills+1}.jpg`):typePanel(i);tex[key].minFilter=THREE.LinearFilter;tex[key].generateMipmaps=false;}return tex[key];};
ITEMS.forEach(i=>{if(!i.video)return;const v=document.createElement("video");v.src=i.video;v.muted=true;v.loop=true;v.playsInline=true;v.preload="none";vids[i.id]=v;const t=new THREE.VideoTexture(v);t.minFilter=THREE.LinearFilter;t.generateMipmaps=false;vtex[i.id]=t;});

/* Extra panels beyond both ends keep the drum full at the first and last stop. */
const panels=[],PAD=26;
function build(){for(let n=-PAD;n<N+PAD;n++){const item=ITEMS[((n%N)+N)%N],th=n*STEP,len=W/R,geo=new THREE.CylinderGeometry(R,R,H,32,1,true,th-len/2,len);
  const mat=new THREE.ShaderMaterial({vertexShader:vert,fragmentShader:frag,side:THREE.BackSide,transparent:true,depthWrite:false,uniforms:{map:{value:stillOf(item,Math.abs(n))},focus:{value:0},shown:{value:1}}});
  const m=new THREE.Mesh(geo,mat);m.position.y=-n*DROP;m.userData={n,item,still:mat.uniforms.map.value,f:0};drum.add(m);panels.push(m);}}

/* Thin structure in the middle of the drum: the place you are standing. */
{const pts=[];for(let k=-4;k<N+4;k++){for(let a=0;a<48;a++){const b=a/48*TAU,c=(a+1)/48*TAU,y=-k*4.68+2.34;pts.push(Math.cos(b)*R*.995,y,Math.sin(b)*R*.995,Math.cos(c)*R*.995,y,Math.sin(c)*R*.995);}}const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(pts,3));const l=new THREE.LineSegments(g,new THREE.LineBasicMaterial({color:0x4a7deb,transparent:true,opacity:.22,depthWrite:false}));l.renderOrder=-1;drum.add(l);}

const size=()=>{const w=innerWidth,h=innerHeight;r.setPixelRatio(Math.min(devicePixelRatio||1,1.75));r.setSize(w,h,false);cam.aspect=w/h;cam.fov=w<h?72:52;cam.position.set(0,0,3);cam.lookAt(0,0,-7);cam.updateProjectionMatrix();};addEventListener("resize",size);size();

/* Scroll maps to a position that rests on each panel. */
const maxS=()=>Math.max(1,document.documentElement.scrollHeight-innerHeight);
const target=()=>{const f=Math.min(1,scrollY/maxS())*(N-1),i=Math.floor(f),k=f-i;return i+sm(.3,.7,k);};
let f=target(),px=0,py=0,mx=0,my=0,on=-1,last=performance.now(),count=0,slow=0;
const scrollToItem=i=>scrollTo({top:i/(N-1)*maxS(),behavior:still?"auto":"smooth"});
/* Labels decode into place. */
const CH="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/$";let timer;
function decode(pairs){clearInterval(timer);if(still){pairs.forEach(([e,t])=>e.textContent=t);return;}let n=0;timer=setInterval(()=>{n++;let done=true;pairs.forEach(([e,t])=>{const k=Math.floor(n*1.6);if(k<t.length)done=false;e.textContent=t.slice(0,k)+[...t.slice(k,k+6)].map(c=>c===" "?" ":CH[Math.floor(Math.random()*CH.length)]).join("");});if(done)clearInterval(timer);},26);}
function setOn(i){if(i===on)return;const prev=on;on=i;const it=ITEMS[i];decode([[$("code"),it.code],[$("tag"),it.tag]]);$("count").textContent=`${String(i+1).padStart(2,"0")} / ${String(N).padStart(2,"0")}`;
  if(filling)drawType(filling,1);filling=TYPE[it.id]&&!still?it:null;fillAt=performance.now();
  if(prev>=0&&vids[ITEMS[prev].id])vids[ITEMS[prev].id].pause();if(vids[it.id]&&!still)vids[it.id].play().catch(()=>{});}
const ray=new THREE.Raycaster(),ptr=new THREE.Vector2();
addEventListener("pointermove",e=>{mx=e.clientX/innerWidth*2-1;my=e.clientY/innerHeight*2-1;});
addEventListener("click",e=>{if(e.target.closest("button,a,dialog,nav"))return;ptr.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1);ray.setFromCamera(ptr,cam);const h=ray.intersectObjects(panels,false).find(x=>x.distance>1.5);if(!h)return;const n=h.object.userData.n;if(n===on)window.openItem(ITEMS[on]);else scrollToItem(Math.min(N-1,Math.max(0,n)));});
addEventListener("keydown",e=>{if($("view").open)return;if(e.key==="ArrowDown"||e.key==="ArrowRight"){e.preventDefault();scrollToItem(Math.min(N-1,on+1));}if(e.key==="ArrowUp"||e.key==="ArrowLeft"){e.preventDefault();scrollToItem(Math.max(0,on-1));}if(e.key==="Enter"&&e.target===document.body)window.openItem(ITEMS[on]);});
$("nWork").onclick=()=>window.openItem(ITEMS[on]);
function frame(now){if(stopped)return;requestAnimationFrame(frame);if($("view").open)return;
  const dt=Math.min((now-last)/1000,.1);last=now;const d=still?1:1-Math.exp(-dt*6);f+=(target()-f)*d;setOn(Math.round(f));
  drum.rotation.y=Math.PI-f*STEP;drum.position.y=f*DROP;
  if(!still){px+=(mx-px)*.05;py+=(my-py)*.05;cam.rotation.y=-px*.05;cam.rotation.x=-py*.03;}
  panels.forEach(m=>{const u=m.material.uniforms,tgt=1-sm(.12,.42,Math.abs(m.userData.n-f));m.userData.f+=(tgt-m.userData.f)*(still?1:.14);u.focus.value=m.userData.f;
    const v=vids[m.userData.item.id],live=m.userData.n===on&&v&&v.readyState>=2&&!still;u.map.value=live?vtex[m.userData.item.id]:m.userData.still;});
  if(filling){const k=Math.min(1,(now-fillAt)/1100);drawType(filling,1-(1-k)**3);if(k===1)filling=null;}
  r.render(s,cam);
  if(!params.has("keep3d")&&!document.hidden&&count<90){count++;if(count>15)slow+=dt;if(count===90&&slow/75>.075)goFlat();}
}
const start=()=>{build();document.body.classList.remove("flat");size();window.__drum={f:()=>f,on:()=>on,vids};requestAnimationFrame(frame);};
try{(document.fonts&&document.fonts.load?document.fonts.load('700 40px "JetBrains Mono"').catch(()=>{}):Promise.resolve()).then(()=>{try{start();}catch(e){console.error(e);}});}catch(e){console.error(e);}
})();
