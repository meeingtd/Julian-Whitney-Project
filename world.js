/* The 3D world behind world.html. Scrolling moves the character along the line; each stop holds him while its card is pinned.
   All geometry is generated here, so there are no asset files. Words live in world-content.js. */
(()=>{
const params=new URLSearchParams(location.search);
const stopIds=window.WORLD.stops.map(s=>s.id);
if(params.has("plain")||!window.THREE)return;
const canvas=document.getElementById("c");let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:"high-performance"});}catch(e){return;}
const goFlat=()=>{const here=currentStop();document.body.classList.add("flat");stopped=true;document.getElementById(stopIds[here]).scrollIntoView();};
let stopped=false;
const reduced=matchMedia("(prefers-reduced-motion:reduce)").matches;
canvas.addEventListener("webglcontextlost",()=>goFlat());
document.getElementById("plain").addEventListener("click",()=>goFlat());

const sm=(a,b,t)=>{t=Math.min(1,Math.max(0,(t-a)/(b-a)));return t*t*(3-2*t);},mix=(a,b,t)=>a+(b-a)*t;
let seed=7;const rnd=()=>{seed=(seed+0x6D2B79F5)|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
const col=h=>new THREE.Color(h);
const mat=(c,o={})=>new THREE.MeshLambertMaterial({color:c,flatShading:true,...o});
const glowMat=c=>new THREE.MeshBasicMaterial({color:c});

const scene=new THREE.Scene();scene.fog=new THREE.Fog(0x182328,75,210);
const camera=new THREE.PerspectiveCamera(38,1,.5,520);
renderer.outputColorSpace=THREE.SRGBColorSpace;
let pr=Math.min(devicePixelRatio||1,1.75),VW=0,VH=0;
const size=()=>{VW=innerWidth;VH=innerHeight;renderer.setPixelRatio(pr);renderer.setSize(VW,VH,false);camera.aspect=VW/VH;
  /* Leave room for the card: the scene shifts left on wide screens, up on phones. */
  if(VW>760)camera.setViewOffset(VW,VH,Math.min(VW*.15,240),0,VW,VH);else camera.setViewOffset(VW,VH,0,VH*.27,VW,VH);
  camera.updateProjectionMatrix();measure();};

/* Sky: night at the start of the line, dawn at the end. */
const skyU={dawn:{value:0}};
scene.add(new THREE.Mesh(new THREE.SphereGeometry(480,24,16),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,uniforms:skyU,
  vertexShader:"varying vec3 d;void main(){d=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
  fragmentShader:`varying vec3 d;uniform float dawn;void main(){float h=clamp(d.y*2.2,0.,1.),e=max(d.x,0.);
    vec3 top=mix(vec3(.035,.05,.06),vec3(.07,.1,.14),dawn),mid=mix(vec3(.07,.1,.12),vec3(.25,.25,.28),dawn),low=mix(vec3(.09,.12,.14),vec3(.87,.58,.36),dawn*(.35+.65*e));
    gl_FragColor=vec4(pow(mix(mix(low,mid,smoothstep(0.,.3,h)),top,smoothstep(.2,1.,h)),vec3(1./1.)),1.);}`})));
const hemi=new THREE.HemisphereLight(0xa9c6cc,0x2a3436,1.6);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffd2a0,1.5);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
Object.assign(sun.shadow.camera,{left:-26,right:26,top:26,bottom:-26,near:1,far:120});sun.shadow.bias=-.0015;scene.add(sun,sun.target);
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;

/* Ground: an island tilted gently up to the right, so the walk climbs. */
const bump=(x,z)=>Math.sin(x*.21+z*.13)*.2+Math.sin(z*.37-x*.11)*.14+Math.sin(x*.53+1.3)*.07;
const ground=(x,z)=>{const d=Math.hypot(x/104,z/36),rise=(x+100)/200*5;return (rise+bump(x,z))*(1-sm(.74,1,d))-sm(.84,1.08,d)*2.6;};
{const geo=new THREE.PlaneGeometry(232,92,128,52).rotateX(-Math.PI/2).toNonIndexed(),P=geo.attributes.position,C=new Float32Array(P.count*3),a=col(0x2a3c3c),b=col(0x3e5650),s=col(0x4a4c44),c=new THREE.Color();
  for(let i=0;i<P.count;i++)P.setY(i,ground(P.getX(i),P.getZ(i))+(rnd()-.5)*.1);
  for(let i=0;i<P.count;i+=3){const y=(P.getY(i)+P.getY(i+1)+P.getY(i+2))/3;c.copy(a).lerp(b,rnd()*.75);if(y<.25)c.lerp(s,.8);for(let k=0;k<3;k++)c.toArray(C,(i+k)*3);}
  geo.setAttribute("color",new THREE.BufferAttribute(C,3));geo.computeVertexNormals();
  const m=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({vertexColors:true,flatShading:true}));m.receiveShadow=true;scene.add(m);
  const water=new THREE.Mesh(new THREE.PlaneGeometry(1000,1000).rotateX(-Math.PI/2),new THREE.MeshLambertMaterial({color:0x10201f}));water.position.y=-.9;scene.add(water);}
/* Chart gridlines lying on the land. */
{const v=[];const seg=(x0,z0,x1,z1)=>{const n=Math.ceil(Math.hypot(x1-x0,z1-z0)/3);for(let i=0;i<n;i++){const ax=mix(x0,x1,i/n),az=mix(z0,z1,i/n),bx=mix(x0,x1,(i+1)/n),bz=mix(z0,z1,(i+1)/n);if(Math.hypot(ax/104,az/36)<.8&&Math.hypot(bx/104,bz/36)<.8)v.push(ax,ground(ax,az)+.07,az,bx,ground(bx,bz)+.07,bz);}};
  for(let x=-96;x<=96;x+=16)seg(x,-34,x,34);for(let z=-32;z<=32;z+=8)seg(-100,z,100,z);
  scene.add(new THREE.LineSegments(new THREE.BufferGeometry().setAttribute("position",new THREE.Float32BufferAttribute(v,3)),new THREE.LineBasicMaterial({color:0x7cc0b6,transparent:true,opacity:.1})));}

/* The line. Zone points with a jog between each pair, so it winds like a chart. */
const ZONES=[{id:"plaza",x:-74,z:6,side:1},{id:"davis",x:-46,z:-9,side:-1},{id:"atlas",x:-18,z:7,side:1},{id:"lab",x:10,z:-8,side:-1},{id:"desk",x:36,z:7,side:1},{id:"ai",x:60,z:-8,side:-1},{id:"contact",x:82,z:4,side:1}];
const path=(()=>{const k=[new THREE.Vector3(-82,0,10)];ZONES.forEach((z,i)=>{k.push(new THREE.Vector3(z.x,0,z.z));const n=ZONES[i+1];if(n){k.push(new THREE.Vector3(mix(z.x,n.x,.36),0,mix(z.z,n.z,.36)+(i%2?3.4:-3.4)));k.push(new THREE.Vector3(mix(z.x,n.x,.66),0,mix(z.z,n.z,.66)+(i%2?-3:3)));}});k.push(new THREE.Vector3(90,0,2));
  const flat=new THREE.CatmullRomCurve3(k,false,"centripetal"),pts=flat.getSpacedPoints(420);pts.forEach(p=>p.y=ground(p.x,p.z)+.12);const c=new THREE.CatmullRomCurve3(pts);c.arcLengthDivisions=1400;return c;})();
const LEN=path.getLength();
const samples=path.getSpacedPoints(1200);
ZONES.forEach(z=>{let b=0,bd=1e9;samples.forEach((p,i)=>{const d=Math.hypot(p.x-z.x,p.z-z.z);if(d<bd){bd=d;b=i;}});z.u=b/1200;z.p=samples[b].clone();const t=path.getTangentAt(z.u);z.n=new THREE.Vector3(t.z,0,-t.x).normalize().multiplyScalar(z.side);});
const TUBE=700,RAD=6;
const tube=r=>new THREE.TubeGeometry(path,TUBE,r,RAD,false);
scene.add(new THREE.Mesh(tube(.07),glowMat(0x38524f)));
const lit=new THREE.Mesh(tube(.1),glowMat(0xf2c47a)),halo=new THREE.Mesh(tube(.3),new THREE.MeshBasicMaterial({color:0xe8a860,transparent:true,opacity:.2,depthWrite:false,blending:THREE.AdditiveBlending}));scene.add(lit,halo);

/* Soft glow sprites stand in for real lights. */
const glowTex=(()=>{const c=document.createElement("canvas");c.width=c.height=64;const g=c.getContext("2d"),q=g.createRadialGradient(32,32,0,32,32,32);q.addColorStop(0,"rgba(255,255,255,1)");q.addColorStop(.25,"rgba(255,255,255,.4)");q.addColorStop(1,"rgba(255,255,255,0)");g.fillStyle=q;g.fillRect(0,0,64,64);return new THREE.CanvasTexture(c);})();
const glow=(c,s,o=.7)=>{const m=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:c,transparent:true,opacity:o,depthWrite:false,blending:THREE.AdditiveBlending,fog:false}));m.scale.setScalar(s);return m;};
const sunDisc=glow(0xffc98a,70,0);sunDisc.position.set(300,22,-40);scene.add(sunDisc);

const box=(g,w,h,d,c,x=0,y=0,z=0,ry=0)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),typeof c==="number"?mat(c):c);m.position.set(x,y+h/2,z);m.rotation.y=ry;m.castShadow=m.receiveShadow=true;g.add(m);return m;};
const cyl=(g,rt,rb,h,c,seg,x=0,y=0,z=0)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg),typeof c==="number"?mat(c):c);m.position.set(x,y+h/2,z);m.castShadow=m.receiveShadow=true;g.add(m);return m;};
const UP=0x6fb3a8,DN=0xb9645f,STONE=0x56636a,DARK=0x263236,WARM=glowMat(0xffd59a);
const candle=(g,w,h,c,x,y,z)=>{cyl(g,.06*w,.06*w,h*1.5,0xd8dee0,5,x,y-h*.25,z);box(g,w,h,w,c,x,y,z);};
const anim=[];

const LAND={
  plaza(g){cyl(g,6.2,6.7,.34,STONE,8);cyl(g,4,4.2,.3,0x65737a,8,0,.34);candle(g,1.5,5.6,UP,0,.64+1,0);
    for(let i=0;i<6;i++){const a=i/6*Math.PI*2+.3,x=Math.cos(a)*5.3,z=Math.sin(a)*5.3;cyl(g,.05,.08,2.5,DARK,5,x,.3,z);const b=new THREE.Mesh(new THREE.IcosahedronGeometry(.18,0),WARM);b.position.set(x,2.9,z);g.add(b);const s=glow(0xffc47a,2.2,.6);s.position.copy(b.position);g.add(s);}},
  davis(g){/* A tower of stacked documents: the CIMs. */
    let y=0;for(let i=0;i<9;i++){const w=7-i*.28+rnd()*.5,h=.5+rnd()*1.2;box(g,w,h,w*.76,i%3===2?0xc9c4b4:i%3===1?0x8d9599:0xe2ddcd,(rnd()-.5)*.5,y,(rnd()-.5)*.5,(rnd()-.5)*.28);y+=h;}
    const l=new THREE.Mesh(new THREE.IcosahedronGeometry(.3,0),WARM);l.position.y=y+.4;g.add(l);const s=glow(0xffc47a,4,.7);s.position.y=y+.4;g.add(s);},
  atlas(g){/* A saw-tooth factory with a working stamping press. */
    box(g,15,4.8,8,0x3a4a50,-1.5);
    const shape=new THREE.Shape();shape.moveTo(0,0);shape.lineTo(2.9,0);shape.lineTo(0,2);shape.closePath();
    for(let i=0;i<5;i++){const m=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:8,bevelEnabled:false}),mat(0x4d5f64));m.position.set(-9+i*3,4.8,-4);m.castShadow=true;g.add(m);}
    for(let x=-7.5;x<=4.5;x+=2.4){const w=new THREE.Mesh(new THREE.PlaneGeometry(1.3,1.5),WARM);w.position.set(x,2.5,4.02);g.add(w);const b=w.clone();b.position.z=-4.02;b.rotation.y=Math.PI;g.add(b);}
    cyl(g,.5,.7,10,DARK,7,-6.5,0,-2);cyl(g,.45,.65,8.5,DARK,7,-4.5,0,-2);
    const px=8.8;box(g,.7,6,2.2,0x5e6d73,px-1.8,0);box(g,.7,6,2.2,0x5e6d73,px+1.8,0);box(g,4.4,1,2.6,0x6d7d83,px,6);box(g,3.2,.6,2.2,STONE,px,0);
    const ram=box(g,2.6,1.1,1.9,UP,px,4);anim.push(t=>{const k=(t*.55)%1;ram.position.y=4.55-(k<.18?k/.18:k<.3?1-(k-.18)/.12:0)*3.2;});
    /* The aerospace part it makes: a tail fin on a stand. */
    const fin=new THREE.Shape();fin.moveTo(0,0);fin.lineTo(3.2,0);fin.lineTo(3.8,3.4);fin.lineTo(2.6,3.4);fin.closePath();const f=new THREE.Mesh(new THREE.ExtrudeGeometry(fin,{depth:.2,bevelEnabled:false}),mat(0xc3ccd0));f.position.set(4.4,1.1,5.6);f.castShadow=true;g.add(f);cyl(g,.1,.16,1.2,DARK,5,6,0,5.7);},
  lab(g){/* A glass pavilion with bars that keep recalculating. */
    box(g,10,.4,7.4,STONE);
    const glass=new THREE.MeshLambertMaterial({color:0x9fd8d0,transparent:true,opacity:.14,depthWrite:false});
    const shell=new THREE.Mesh(new THREE.BoxGeometry(9.4,6,6.8),glass);shell.position.y=3.4;g.add(shell);
    shell.add(new THREE.LineSegments(new THREE.EdgesGeometry(shell.geometry),new THREE.LineBasicMaterial({color:0x7cc0b6})));
    box(g,9.8,.25,7.2,0x667a7c,0,6.4);
    [1.3,2,2.7,3.5,4.6].forEach((h,i)=>{const b=box(g,1.1,1,1.1,i===4?glowMat(0xf2c47a):UP,-3.2+i*1.6,.4);const bh=()=>h;anim.push(t=>{const v=bh()*(1+.09*Math.sin(t*1.1+i));b.scale.y=v;b.position.y=.4+v/2;});b.scale.y=h;b.position.y=.4+h/2;});},
  desk(g){/* An oversized research desk: screen, lamp, a printed report. */
    box(g,11,.45,5,0x5a4636,0,3.2);for(const[x,z]of[[-5,-2],[5,-2],[-5,2],[5,2]])box(g,.45,3.2,.45,0x3a2c22,x,0,z);
    box(g,.7,1.1,.7,DARK,-1.4,3.65,-1.2);box(g,5,2.9,.25,DARK,-1.4,4.5,-1.3);
    const scr=new THREE.Mesh(new THREE.PlaneGeometry(4.6,2.5),glowMat(0x18302f));scr.position.set(-1.4,5.95,-1.16);g.add(scr);
    for(let i=0;i<8;i++){const h=.4+rnd()*1.3,up=i>4?0:1;const b=new THREE.Mesh(new THREE.PlaneGeometry(.3,h),glowMat(up?0x7cc0b6:0xe08a84));b.position.set(-3+i*.46,5.4+rnd()*.5+h/2-.3,-1.14);g.add(b);}
    for(let i=0;i<4;i++)box(g,2,.13,2.7,i===3?0xe2ddcd:0xbcb7a8,3.2,3.65+i*.13,.3,.14);
    cyl(g,.42,.5,.14,DARK,8,3.8,3.65,-1.5);cyl(g,.05,.05,2.6,DARK,5,3.8,3.8,-1.5);cyl(g,.25,.8,.8,0x7d6a44,8,3.8,6.3,-1.5);const s=glow(0xffc47a,6,.55);s.position.set(3.8,6.1,-1.5);g.add(s);},
  ai(g){/* A small network of agents around one coordinator. */
    cyl(g,4.6,5.2,.35,STONE,7);
    const hub=new THREE.Mesh(new THREE.IcosahedronGeometry(1.5,0),glowMat(0x7cc0b6));hub.position.y=5.6;g.add(hub);const hs=glow(0x7cc0b6,8,.6);hs.position.y=5.6;g.add(hs);cyl(g,.1,.25,4.2,DARK,6,0,.3);
    const v=[];const nodes=[];for(let i=0;i<6;i++){const a=i/6*Math.PI*2,r=3.8+(i%2)*.7,x=Math.cos(a)*r,z=Math.sin(a)*r,y=2.6+((i*2)%3)*1.4;const n=new THREE.Mesh(new THREE.IcosahedronGeometry(.42,0),i%2?WARM:glowMat(0xa8dcd4));n.position.set(x,y,z);g.add(n);nodes.push(n);v.push(0,5.6,0,x,y,z);cyl(g,.05,.08,y-.3,DARK,5,x,.3,z);const p=glow(i%2?0xffc47a:0x7cc0b6,1.8,.5);p.position.copy(n.position);g.add(p);anim.push(t=>{p.material.opacity=.3+.35*Math.max(0,Math.sin(t*1.6+i*1.05));});}
    g.add(new THREE.LineSegments(new THREE.BufferGeometry().setAttribute("position",new THREE.Float32BufferAttribute(v,3)),new THREE.LineBasicMaterial({color:0x7cc0b6,transparent:true,opacity:.65})));
    anim.push(t=>{hub.rotation.y=t*.35;hub.rotation.x=t*.2;});},
  contact(g){/* A beacon at the end of the line. */
    cyl(g,3.6,4.3,.5,STONE,7);cyl(g,1,1.7,8.5,0xc6cbc6,8,0,.5);cyl(g,1.12,1.12,.7,DN,8,0,3.4);cyl(g,1.12,1.12,.7,DN,8,0,6);
    cyl(g,1.4,1.4,.2,DARK,8,0,9);const l=new THREE.Mesh(new THREE.CylinderGeometry(.62,.62,1.2,8),WARM);l.position.y=9.8;g.add(l);cyl(g,.15,1.3,.8,DARK,8,0,10.4);const s=glow(0xffc47a,12,.8);s.position.y=9.8;g.add(s);anim.push(t=>{s.material.opacity=.6+.2*Math.sin(t*1.4);});}
};
ZONES.forEach(z=>{const g=new THREE.Group(),off=z.id==="atlas"?11:z.id==="desk"?8.5:z.id==="lab"?8.5:8;z.b=z.p.clone().addScaledVector(z.n,off);z.b.y=ground(z.b.x,z.b.z)-.08;g.position.copy(z.b);g.rotation.y=Math.atan2(-z.n.x,-z.n.z);LAND[z.id](g);scene.add(g);z.top=g;});

/* Scenery: small candlesticks and conifers, kept off the line and the zones. */
{const clear=(x,z,r)=>{for(let i=0;i<samples.length;i+=6)if(Math.hypot(samples[i].x-x,samples[i].z-z)<r)return false;return ZONES.every(q=>{if(Math.hypot(q.b.x-x,q.b.z-z)<=12)return false;/* keep the stop camera's view clear */for(const k of[3,8,13,18,23])if(Math.hypot(q.p.x-q.n.x*k-x,q.p.z-q.n.z*k-z)<3+k*.42)return false;return true;});};
  const d=new THREE.Object3D(),spots=[];let tries=0;while(spots.length<110&&tries++<3000){const x=-92+rnd()*184,z=-30+rnd()*60;if(Math.hypot(x/104,z/36)<.72&&clear(x,z,3.2))spots.push([x,z]);}
  const bodies=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),mat(0xffffff),70),wicks=new THREE.InstancedMesh(new THREE.CylinderGeometry(.5,.5,1,5),mat(0xc8d0d2),70),c=new THREE.Color();
  for(let i=0;i<70;i++){const[x,z]=spots[i],y=ground(x,z),w=.5+rnd()*.5,h=.8+rnd()*3.2,up=rnd()>.38;d.position.set(x,y+h/2+.25,z);d.scale.set(w,h,w);d.rotation.set(0,0,0);d.updateMatrix();bodies.setMatrixAt(i,d.matrix);bodies.setColorAt(i,c.setHex(up?0x5e9a90:0x9a5a56));d.scale.set(.09,h+1.1,.09);d.updateMatrix();wicks.setMatrixAt(i,d.matrix);}
  bodies.castShadow=wicks.castShadow=true;scene.add(bodies,wicks);
  const n=spots.length-70,trees=new THREE.InstancedMesh(new THREE.ConeGeometry(1,3,6),mat(0x233a35),n*2);let k=0;
  for(let i=70;i<spots.length;i++){const[x,z]=spots[i],y=ground(x,z),s=.9+rnd()*1.1;for(let t=0;t<2;t++){d.position.set(x,y+(1.1+t*1.5)*s,z);d.scale.set(s*(1.25-t*.35),s*(1-t*.1),s*(1.25-t*.35));d.rotation.y=rnd()*3;d.updateMatrix();trees.setMatrixAt(k++,d.matrix);}}
  trees.castShadow=true;scene.add(trees);}

/* Julian: a tapered low-poly figure about 7.5 heads tall, facing +Z. Curly black hair, sharp suit, keychain. */
const SUIT=mat(0x4a5f85),PANT=mat(0x3d4f70),SKIN=mat(0xc99a7a),BLACK=mat(0x0d0d10),SHOE=mat(0x17120f),SHIRT=mat(0xeef0f0),TIE=mat(0x8a2b36);
const seg=(rt,rb,len,m,sides=7)=>{const g=new THREE.CylinderGeometry(rt,rb,len,sides);g.translate(0,-len/2,0);const o=new THREE.Mesh(g,m);o.castShadow=true;return o;};
const man=new THREE.Group(),body=new THREE.Group();man.add(body);scene.add(man);
const pivot=(parent,x,y,z)=>{const p=new THREE.Group();p.position.set(x,y,z);parent.add(p);return p;};
const legs=[-1,1].map(s=>{const hip=pivot(body,s*.13,1.28,0);hip.add(seg(.135,.095,.64,PANT));const knee=pivot(hip,0,-.64,0);knee.add(seg(.09,.065,.58,PANT));const ank=pivot(knee,0,-.58,0);const f=new THREE.Mesh(new THREE.BoxGeometry(.15,.08,.36),SHOE);f.position.set(0,-.02,.08);f.castShadow=true;ank.add(f);return{hip,knee,ank};});
const torso=pivot(body,0,1.24,0);
{const t=new THREE.Mesh(new THREE.CylinderGeometry(.31,.215,.78,8),SUIT);t.scale.z=.68;t.position.y=.41;t.castShadow=true;torso.add(t);
  const skirt=new THREE.Mesh(new THREE.CylinderGeometry(.215,.235,.18,8),SUIT);skirt.scale.z=.72;skirt.position.y=-.03;torso.add(skirt);
  const sh=new THREE.Mesh(new THREE.ConeGeometry(.095,.36,3),SHIRT);sh.rotation.z=Math.PI;sh.position.set(0,.62,.17);sh.scale.z=.3;torso.add(sh);
  const ti=new THREE.Mesh(new THREE.ConeGeometry(.032,.3,4),TIE);ti.rotation.z=Math.PI;ti.position.set(0,.62,.2);ti.scale.z=.4;torso.add(ti);}
const arms=[-1,1].map(s=>{const sh=pivot(torso,s*.33,.76,0);sh.add(seg(.085,.065,.46,SUIT));const el=pivot(sh,0,-.46,0);el.add(seg(.062,.048,.42,SUIT));const h=new THREE.Mesh(new THREE.IcosahedronGeometry(.055,0),SKIN);h.position.y=-.47;h.scale.set(1,1.3,1);el.add(h);return{sh,el};});
{const neck=new THREE.Mesh(new THREE.CylinderGeometry(.06,.07,.14,6),SKIN);neck.position.y=.87;torso.add(neck);
  var head=pivot(torso,0,1.06,0);const sk=new THREE.Mesh(new THREE.IcosahedronGeometry(.16,1),SKIN);sk.scale.set(.92,1.12,1);sk.castShadow=true;head.add(sk);
  const nose=new THREE.Mesh(new THREE.ConeGeometry(.024,.06,4),SKIN);nose.rotation.x=Math.PI/2;nose.position.set(0,-.01,.16);head.add(nose);
  for(let i=0;i<38;i++){const y=.25+rnd()*.75,a=rnd()*Math.PI*2;if(Math.cos(a)>.3&&y<.82)continue;const r=Math.sqrt(1-y*y),q=new THREE.Mesh(new THREE.IcosahedronGeometry(.062+rnd()*.035,0),BLACK);q.position.set(Math.sin(a)*r*.165,.03+y*.17,Math.cos(a)*r*.17-.015);q.castShadow=true;head.add(q);}
  /* The keychain, in his left hand. */
  const key=new THREE.Mesh(new THREE.TorusGeometry(.035,.009,5,8),new THREE.MeshBasicMaterial({color:0xe8c468}));key.position.y=-.57;arms[1].el.add(key);const bit=new THREE.Mesh(new THREE.BoxGeometry(.016,.075,.016),key.material);bit.position.y=-.64;arms[1].el.add(bit);}
{const blob=new THREE.Mesh(new THREE.CircleGeometry(.5,14).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:.28,depthWrite:false}));blob.position.y=.03;man.add(blob);}
man.scale.setScalar(1.25);

/* Scroll maps to a place on the line. */
let holds=[];
function measure(){
  /* On phones a tall card rises as far as it needs, so nothing inside it gets cut off. */
  document.querySelectorAll(".stop").forEach(e=>{const c=e.querySelector(".card"),phone=innerWidth<=760&&!document.body.classList.contains("flat");if(!phone){e.style.paddingTop=c.style.top="";return;}const top=Math.max(84,Math.min(innerHeight*.5,innerHeight-c.offsetHeight-8));e.style.paddingTop=c.style.top=top+"px";});
  holds=stopIds.map(id=>{const e=document.getElementById(id),r=e.getBoundingClientRect(),top=r.top+scrollY;return[top,top+r.height-innerHeight];});}
function fromScroll(){const y=scrollY;for(let i=0;i<holds.length;i++){const[a,b]=holds[i];if(y<a){if(i===0)return{u:ZONES[0].u,hold:1,i:0,j:0,k:0};const[,pb]=holds[i-1],k=sm(pb,a,y);return{u:mix(ZONES[i-1].u,ZONES[i].u,k),hold:0,i:i-1,j:i,k};}if(y<=b)return{u:ZONES[i].u,hold:1,i,j:i,k:0};}const n=holds.length-1;return{u:ZONES[n].u,hold:1,i:n,j:n,k:0};}
function currentStop(){const s=fromScroll();return s.k>.5?s.j:s.i;}
const links=[...document.querySelectorAll("#navl a")];let navOn=-1;
function setNav(i){if(i===navOn)return;navOn=i;links.forEach((a,n)=>a.setAttribute("aria-current",n===i));const a=links[i];if(a.parentElement.parentElement.parentElement.scrollWidth>a.parentElement.parentElement.parentElement.clientWidth)a.scrollIntoView({block:"nearest",inline:"center"});}

let uNow=0,holdK=1,yaw=0,waveAt=-9,lastHeld=-1,last=performance.now(),frames=0,slow=0;
const camPos=new THREE.Vector3(),camLook=new THREE.Vector3(),wantPos=new THREE.Vector3(),wantLook=new THREE.Vector3(),T=new THREE.Vector3(),N=new THREE.Vector3(),P=new THREE.Vector3(),A=new THREE.Vector3(),B=new THREE.Vector3();
let camReady=false;

function frame(now){
  if(stopped)return;requestAnimationFrame(frame);
  try{draw(now);}catch(e){console.error(e);goFlat();}
}
function draw(now){
  const dt=Math.min((now-last)/1000,.1);last=now;const t=now/1000;const s=fromScroll();setNav(currentStop());
  const damp=r=>reduced?1:1-Math.exp(-dt*r);
  const du=s.u-uNow;uNow+=du*damp(Math.abs(du)>.12?14:6);
  const settled=s.hold&&Math.abs(s.u-uNow)<.0015;holdK+=((settled?1:0)-holdK)*damp(2.6);
  path.getPointAt(Math.min(1,Math.max(0,uNow)),P);path.getTangentAt(uNow,T);
  const d=uNow*LEN,moving=Math.min(1,Math.abs(du)*260);
  /* Sky and light follow the line from night to dawn. */
  const dawn=sm(.3,1,uNow);skyU.dawn.value=dawn;hemi.intensity=mix(1.9,1.8,dawn);sun.intensity=mix(2,2.6,dawn);sun.color.setHex(0xffc896).lerp(col(0x9fc0d0),1-dawn);sunDisc.material.opacity=dawn*.75;
  sun.position.set(P.x+22,P.y+mix(34,20,dawn),P.z+mix(14,-8,dawn));sun.target.position.copy(P);
  const dr=Math.floor(uNow*TUBE)*RAD*6;lit.geometry.setDrawRange(0,dr);halo.geometry.setDrawRange(0,dr);

  /* Camera: behind him on the walk, off to the side looking across him at the building when he stops. */
  const zi=s.k>.5?s.j:s.i,Z=ZONES[zi],side=mix(ZONES[s.i].side,ZONES[s.j].side,s.k);N.set(T.z,0,-T.x).normalize();
  const far=(VW/VH<.8?1.42:1)*1;
  A.copy(P).addScaledVector(T,-15*far).addScaledVector(N,-4*side*far);A.y+=14*far;
  B.copy(Z.p).addScaledVector(Z.n,-18*far).addScaledVector(T,-1.5*far);B.y=Math.max(ground(B.x,B.z),Z.p.y)+6*far;
  wantPos.copy(A).lerp(B,holdK);
  A.copy(P).addScaledVector(T,6);A.y+=1.5;B.copy(Z.p).lerp(Z.b,.45);B.y=Z.p.y+4.4;wantLook.copy(A).lerp(B,holdK);
  if(!camReady){camPos.copy(wantPos);camLook.copy(wantLook);camReady=true;}
  camPos.lerp(wantPos,damp(3.2));camLook.lerp(wantLook,damp(4));camera.position.copy(camPos);camera.lookAt(camLook);

  /* Him. */
  man.position.copy(P);man.position.y-=.12;
  const faceWalk=Math.atan2(T.x,T.z),faceCam=Math.atan2(camPos.x-P.x,camPos.z-P.z);let want=holdK>.5?faceCam:faceWalk,dy=((want-yaw+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI;yaw+=dy*damp(5.5);man.rotation.y=yaw;
  if(settled&&lastHeld!==s.i){lastHeld=s.i;waveAt=t;}if(!s.hold)lastHeld=-1;
  const ph=d*2.3,w=Math.min(1,moving),sw=Math.sin(ph)*.62*w;
  legs[0].hip.rotation.x=-sw;legs[1].hip.rotation.x=sw;
  legs[0].knee.rotation.x=Math.max(0,Math.sin(ph+1.5))*1.05*w+.03;legs[1].knee.rotation.x=Math.max(0,-Math.sin(ph+1.5))*1.05*w+.03;
  legs.forEach(l=>l.ank.rotation.x=-l.knee.rotation.x*.32-l.hip.rotation.x*.5);
  body.position.y=-(1-Math.abs(Math.cos(ph)))*.05*w*0+Math.abs(Math.sin(ph))*-.045*w;
  const breathe=reduced?0:Math.sin(t*1.5)*.012;torso.rotation.x=.04*w+breathe;torso.rotation.y=Math.sin(ph)*.1*w;head.rotation.y=-torso.rotation.y;
  arms[0].sh.rotation.x=sw*.8;arms[1].sh.rotation.x=-sw*.8;arms[0].el.rotation.x=-.28;arms[1].el.rotation.x=-.28;
  arms[0].sh.rotation.z=-.1;arms[1].sh.rotation.z=.1;arms[0].el.rotation.z=0;
  /* A short wave on arrival, with the right arm. */
  const wa=reduced?0:sm(0,.3,t-waveAt)*(1-sm(1.7,2.1,t-waveAt));
  if(wa>0){arms[0].sh.rotation.z=mix(-.1,-2.25,wa);arms[0].sh.rotation.x=mix(arms[0].sh.rotation.x,0,wa);arms[0].el.rotation.x=mix(-.28,0,wa);arms[0].el.rotation.z=mix(0,-.55+Math.sin(t*9)*.32,wa);}
  if(!reduced)for(const f of anim)f(t);
  const h=document.getElementById("hint");if(h)h.style.opacity=scrollY>40?0:1;
  renderer.render(scene,camera);
  /* Weak machines step down, then fall back to the plain page. */
  if(!params.has("keep3d")&&!document.hidden&&frames<150){frames++;if(frames>20)slow+=dt;if(frames===150){const avg=slow/130;if(avg>.075)goFlat();else if(avg>.03){pr=1;renderer.shadowMap.enabled=false;sun.castShadow=false;size();}}}
}
window.__world={ZONES,uNow:()=>uNow,holds:()=>holds,fromScroll};
/* The page stays plain until everything above has built without error. */
document.body.classList.remove("flat");
addEventListener("resize",size);size();uNow=fromScroll().u;
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(measure);
addEventListener("load",measure);
requestAnimationFrame(frame);
})();
