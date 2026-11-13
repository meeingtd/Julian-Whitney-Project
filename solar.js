/* Solar system hub, step 4 (detail). Direction A (orrery) from SOLAR_PLAN.md with the interaction of the step 3 prototype kept as is.
   The sun is a Lego brick globe coloured from the real land map (the page's own globe takes its place at wiring time). Each planet is a
   place he lived, with a procedural surface in the palette of its scene. One light: the sun. A faint cool fill from the camera side
   stands in for starlight so the near face of a planet still reads. Lens as in desk.js: depth of field, bloom on the sun only, grain,
   vignette. Only the visitor moves the system: drag turns it, keys step it, click or Enter flies in.
   API (unchanged): SOLAR.set(dt), .anchors(), .focus(id), .step(n), .fly(id,done), .back(done), .jump(id), .seen(id), .focusId(),
   .at, .flying, .dragged, .planets */
import * as THREE from "three";
import {RoundedBoxGeometry} from "three/addons/geometries/RoundedBoxGeometry.js";
import {EffectComposer} from "three/addons/postprocessing/EffectComposer.js";
import {RenderPass} from "three/addons/postprocessing/RenderPass.js";
import {BokehPass} from "three/addons/postprocessing/BokehPass.js";
import {UnrealBloomPass} from "three/addons/postprocessing/UnrealBloomPass.js";
import {OutputPass} from "three/addons/postprocessing/OutputPass.js";
import {ShaderPass} from "three/addons/postprocessing/ShaderPass.js";
const RM=matchMedia("(prefers-reduced-motion: reduce)").matches,TAU=Math.PI*2;
const ease=t=>1-Math.pow(1-Math.min(1,Math.max(0,t)),4); /* the project's one curve */
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const rng=seed=>()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
const small=()=>Math.min(innerWidth,innerHeight)<600;

/* ---------- 3D value noise, so planet maps wrap seamlessly round the equator ---------- */
const ih=(x,y,z)=>{let h=(x*1597334677)^(y*3812015801)^(z*2798796415);h=Math.imul(h^(h>>>15),2246822519);h=Math.imul(h^(h>>>13),3266489917);return((h^(h>>>16))>>>0)/4294967296;};
function vnoise3(x,y,z){const xi=Math.floor(x),yi=Math.floor(y),zi=Math.floor(z),xf=x-xi,yf=y-yi,zf=z-zi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf),w=zf*zf*(3-2*zf);
  const l=(a,b,t)=>a+(b-a)*t;
  return l(l(l(ih(xi,yi,zi),ih(xi+1,yi,zi),u),l(ih(xi,yi+1,zi),ih(xi+1,yi+1,zi),u),v),l(l(ih(xi,yi,zi+1),ih(xi+1,yi,zi+1),u),l(ih(xi,yi+1,zi+1),ih(xi+1,yi+1,zi+1),u),v),w);}
function fbm3(x,y,z,o=5){let s=0,a=.5,f=1;for(let i=0;i<o;i++){s+=a*vnoise3(x*f+i*17.3,y*f+i*9.1,z*f+i*3.7);f*=2;a*=.5;}return s;}
/* sample noise on a cylinder of circumference k so longitude wraps; v spans half that (equirect 2:1) */
const sph=(u,v,k,o)=>{const la=(.5-v)*Math.PI,cl=Math.cos(la),f=k/Math.PI;return fbm3(cl*Math.cos(u*TAU)*f+7,Math.sin(la)*f+3,cl*Math.sin(u*TAU)*f+5,o);};

/* a height field → colour, roughness, normal (and emissive) textures, equirectangular */
function surface(W,H,fn,{normal=2.2}={}){
  const col=new Uint8ClampedArray(W*H*4),rou=new Uint8ClampedArray(W*H*4),emi=new Uint8ClampedArray(W*H*4),hgt=new Float32Array(W*H);let hasE=false;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const o=fn((x+.5)/W,(y+.5)/H),i=y*W+x;hgt[i]=o.h;col[i*4]=o.c[0];col[i*4+1]=o.c[1];col[i*4+2]=o.c[2];col[i*4+3]=255;
    const r=o.r*255;rou[i*4]=rou[i*4+1]=rou[i*4+2]=r;rou[i*4+3]=255;if(o.e){hasE=true;emi[i*4]=o.e[0];emi[i*4+1]=o.e[1];emi[i*4+2]=o.e[2];}emi[i*4+3]=255;}
  const nor=new Uint8ClampedArray(W*H*4);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x,hx=hgt[y*W+(x+1)%W]-hgt[y*W+(x-1+W)%W],hy=hgt[Math.min(H-1,y+1)*W+x]-hgt[Math.max(0,y-1)*W+x];
    let nx=-hx*normal,ny=hy*normal,nz=1;const l=Math.hypot(nx,ny,nz);nor[i*4]=(nx/l*.5+.5)*255;nor[i*4+1]=(ny/l*.5+.5)*255;nor[i*4+2]=(nz/l*.5+.5)*255;nor[i*4+3]=255;}
  const tex=(d,srgb)=>{const t=new THREE.DataTexture(d,W,H);t.wrapS=THREE.RepeatWrapping;t.wrapT=THREE.ClampToEdgeWrapping;t.anisotropy=8;t.generateMipmaps=true;t.minFilter=THREE.LinearMipmapLinearFilter;t.magFilter=THREE.LinearFilter;if(srgb)t.colorSpace=THREE.SRGBColorSpace;t.needsUpdate=true;return t;};
  return{map:tex(col,true),roughnessMap:tex(rou),normalMap:tex(nor),emissiveMap:hasE?tex(emi,true):null};}
const mix=(a,b,t)=>[0,1,2].map(i=>a[i]+(b[i]-a[i])*t);

/* ---------- the places, in time order from the sun outward ---------- */
export const PLANETS=[
  {id:"concord",name:"Concord",r:.21,tilt:.18,atmo:[.62,.74,.9],atmoK:1.1},
  {id:"doha",name:"Doha",r:.26,tilt:-.1,atmo:[1,.72,.42],atmoK:.9},
  {id:"wake-forest",name:"Wake Forest",r:.23,tilt:.3,atmo:[.55,.7,.6],atmoK:.8},
  {id:"barcelona",name:"Barcelona",r:.24,tilt:-.22,atmo:[.95,.75,.5],atmoK:.9},
  {id:"new-york",name:"New York",r:.27,tilt:.12,atmo:[.6,.7,.9],atmoK:1},
  {id:"projects",name:"Projects",r:.2,tilt:.4,atmo:[.8,.85,.9],atmoK:.5}];
/* each planet's surface, in the colours of its scene (painted/*.js): a function of (u,v) → colour, roughness, height, emissive */
const PX=small()?256:512;
const SURF={
  concord(u,v){ /* December: snow over dark pine, frozen ponds, a few bare hills */
    const n=sph(u,v,6,5),f=sph(u+.3,v,22,3),p=sph(u+.7,v+.2,9,4);const pine=clamp((n-.46)*6),pond=clamp((.36-p)*9)*(1-pine);
    let c=mix([186,196,206],[214,222,228],f);c=mix(c,[30,42,38],pine*.92);c=mix(c,[150,172,186],pond);
    return{c,r:.75-pond*.3+pine*.2,h:n*.4+pine*.3-pond*.3+f*.05};},
  doha(u,v){ /* the dunes at sunset: long ridges, sand from pale gold to burnt shadow, a dark coast of water */
    const r=Math.abs(sph(u,v,7,4)-.5)*2,ridge=Math.pow(1-r,2.2),f=sph(u+.5,v,40,3),sea=clamp((.3-sph(u+.2,v+.4,5,3))*10);
    let c=mix([168,116,74],[224,190,138],ridge*.8+f*.2);c=mix(c,[42,76,92],sea);
    return{c,r:.92-sea*.4,h:ridge*.7+f*.06-sea*.3};},
  "wake-forest"(u,v){ /* the campus woods: magnolia green, autumn gold in clusters, black and old gold */
    const n=sph(u,v,8,5),g=sph(u+.4,v+.1,14,3),gold=clamp((g-.55)*6),dark=clamp((.4-n)*6);
    let c=mix([36,58,42],[70,92,50],n);c=mix(c,[201,162,77],gold*.85);c=mix(c,[20,20,20],dark*.9);
    return{c,r:.85-gold*.15,h:n*.5+gold*.2-dark*.2};},
  barcelona(u,v){ /* the Eixample from above: terracotta blocks on a grid, the sea, the sand of the beach between */
    const land=sph(u,v,5,4),L=clamp((land-.42)*8),f=sph(u+.1,v+.6,30,3);
    const gx=Math.abs(((u*140)%1)-.5)*2,gy=Math.abs(((v*70)%1)-.5)*2,street=clamp((Math.max(gx,gy)-.86)*7)*L*Math.sin(v*Math.PI);
    let c=mix([190,112,64],[214,140,88],f);c=mix(c,[88,60,44],street*.8);c=mix(c,[46,110,138],1-L);c=mix(c,[228,200,150],clamp(1-Math.abs(land-.42)*40)*.7);
    return{c,r:.72-(1-L)*.3,h:L*.5+f*.05-street*.3};},
  "new-york"(u,v){ /* Manhattan before sunrise: slate and glass, dark water, the grid lit by windows */
    const land=sph(u,v,4,4),L=clamp((land-.42)*9),f=sph(u+.6,v,36,3),blk=sph(u+.2,v+.8,60,2);
    const gx=Math.abs(((u*180)%1)-.5)*2,gy=Math.abs(((v*90)%1)-.5)*2,street=clamp((Math.max(gx,gy)-.8)*5)*L*Math.sin(v*Math.PI);
    let c=mix([62,70,80],[86,94,104],f);c=mix(c,[34,40,48],street*.8);c=mix(c,[22,30,40],1-L);
    const lit=L*(1-street)*clamp((blk-.3)*3)*(.5+.5*f);const e=[255*lit,214*lit,150*lit];
    return{c,r:.64-(1-L)*.1+street*.1,h:L*.5+blk*L*.4-street*.4,e};}};

/* ---------- Lego, at the sun's scale (the realism recipe: rounded bricks, stud lathe, 2% colour variation, tiny jitter) ---------- */
const LC={blue:0x0055BF,dkblue:0x0A3463,mdazure:0x36AEBF,azure:0x078BC9,green:0x237841,dkgreen:0x184632,olive:0x9B9A5A,tan:0xE4CD9E,dktan:0x958A73,brown:0x582A12,white:0xF4F4F4,ltgrey:0xA0A5A9,dkgrey:0x6C6E68,red:0xC91A09,yellow:0xF2CD37,orange:0xFE8A18,black:0x1B2A34};
const LANDC=["green","dkgreen","olive","tan","dktan","brown","white","ltgrey"].map(k=>[k,new THREE.Color(LC[k])]);
const smudge=surface(128,64,(u,v)=>{const s=fbm3(u*5,v*5,1,4);return{c:[255,255,255],r:clamp(.26+Math.max(0,s-.55)*.6),h:fbm3(u*60,v*60,2,2)*.06};});
const plasticM=(o={})=>new THREE.MeshPhysicalMaterial(Object.assign({color:0xffffff,roughness:1,roughnessMap:smudge.roughnessMap,normalMap:smudge.normalMap,normalScale:new THREE.Vector2(.2,.2),ior:1.53,specularIntensity:.5,clearcoat:.12,clearcoatRoughness:.3,envMapIntensity:.6},o));
const boxG=new RoundedBoxGeometry(1,1,1,2,.07);
const studG=pitch=>{const r=.3*pitch,h=.2125*pitch,e=.05*pitch;return new THREE.LatheGeometry([new THREE.Vector2(r,0),new THREE.Vector2(r,h-e),new THREE.Vector2(r-e*.25,h-e*.25),new THREE.Vector2(r-e,h),new THREE.Vector2(0,h)],20);};
/* bricks tiled over a sphere of radius R at one stud pitch; colourAt(lat,lon,rand) gives each brick's colour */
function brickSphere(R,pitch,colourAt,mat,seed=19){const r=rng(seed),g=new THREE.Group(),S=pitch/R,bands=Math.round(Math.PI/S),H=.6*pitch,bricks=[];
  for(let b=0;b<bands;b++){const lat=-90+(b+.5)*180/bands,cl=Math.cos(lat*Math.PI/180),n=Math.max(2,Math.round(TAU*cl/(2*S))),off=r()*360;
    for(let i=0;i<n;i++){const lon=-180+((i+.5)/n*360+off)%360,w=TAU*R*cl/n,d=Math.PI*R/bands;
      bricks.push({lat,lon,w:w-.02*pitch,d:d-.02*pitch,c:colourAt(lat,lon,r).offsetHSL(0,(r()-.5)*.02,(r()-.5)*.025),yaw:(r()-.5)*.012,tilt:(r()-.5)*.008,lift:r()<.03?.25*pitch*r():0});}}
  const mB=new THREE.InstancedMesh(boxG,mat,bricks.length),mS=new THREE.InstancedMesh(studG(pitch),mat,bricks.length*2);
  const M=new THREE.Matrix4(),Q=new THREE.Quaternion(),Qj=new THREE.Quaternion(),P=new THREE.Vector3(),SC=new THREE.Vector3(),up=new THREE.Vector3(),east=new THREE.Vector3(),sth=new THREE.Vector3(),B=new THREE.Matrix4(),E=new THREE.Euler();
  let si=0;bricks.forEach((k,i)=>{const la=k.lat*Math.PI/180,lo=k.lon*Math.PI/180;up.set(Math.cos(la)*Math.sin(lo),Math.sin(la),Math.cos(la)*Math.cos(lo));east.set(Math.cos(lo),0,-Math.sin(lo));sth.crossVectors(east,up);B.makeBasis(east,up,sth);Q.setFromRotationMatrix(B);
    Qj.setFromEuler(E.set(k.tilt,k.yaw,k.tilt*.7));Q.multiply(Qj);P.copy(up).multiplyScalar(R+H/2+k.lift);M.compose(P,Q,SC.set(k.w,H,k.d));mB.setMatrixAt(i,M);mB.setColorAt(i,k.c);
    const sx=Math.min(k.w*.25,pitch*.5);for(const s of[-1,1]){P.copy(up).multiplyScalar(R+H+k.lift).addScaledVector(east,s*sx);M.compose(P,Q,SC.set(1,1,1));mS.setMatrixAt(si,M);mS.setColorAt(si,k.c);si++;}});
  g.add(mB,mS,new THREE.Mesh(new THREE.SphereGeometry(R-.2*pitch,64,40),plasticM({color:0x161718,roughness:.6,clearcoat:0})));return g;}

/* ---------- renderer, scene, camera ---------- */
const host=document.getElementById("solar");
if("live" in host.dataset&&!document.documentElement.classList.contains("live"))throw new Error("solar: static page"); /* in the site, only when the 3D page runs */
const R=new THREE.WebGLRenderer({antialias:false,powerPreference:"high-performance"});R.setPixelRatio(Math.min(1.75,devicePixelRatio));
R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.15;host.appendChild(R.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color(0x07080c);
const cam=new THREE.PerspectiveCamera(32,1,.05,160);
const sys=new THREE.Group();scene.add(sys);
/* what the plastic and the glass reflect: deep space, with a faint band of the Milky Way and a warm glow from the sun's side */
{const env=new THREE.Scene();env.add(new THREE.Mesh(new THREE.BoxGeometry(40,40,40),new THREE.MeshBasicMaterial({color:new THREE.Color(.004,.005,.008),side:THREE.BackSide})));
  const band=new THREE.Mesh(new THREE.TorusGeometry(15,2.2,8,48),new THREE.MeshBasicMaterial({color:new THREE.Color(.05,.06,.09)}));band.rotation.x=Math.PI/2-.5;env.add(band);
  const sun=new THREE.Mesh(new THREE.SphereGeometry(1.6,24,12),new THREE.MeshBasicMaterial({color:new THREE.Color(3,2.1,1.3)}));sun.position.set(0,-6,-12);env.add(sun);
  scene.environment=new THREE.PMREMGenerator(R).fromScene(env,0).texture;}

/* ---------- the sun: the Lego globe, lit from inside ---------- */
const GR=.62;
const land=await new Promise((res,rej)=>{if(!window.EARTH)return rej("earth_data.js missing");const im=new Image();im.onload=()=>{const c=document.createElement("canvas");c.width=im.width;c.height=im.height;const g=c.getContext("2d");g.drawImage(im,0,0);res({d:g.getImageData(0,0,c.width,c.height).data,W:c.width,H:c.height});};im.onerror=()=>rej("land map");im.src=EARTH.land;});
const px=(lat,lon)=>{lon=((lon+180)%360+360)%360-180;const x=Math.floor((lon+180)/360*land.W)%land.W,y=clamp(Math.floor((90-lat)/180*land.H),0,land.H-1),i=(y*land.W+x)*4;return[land.d[i],land.d[i+1],land.d[i+2]];};
const isLand=(lat,lon)=>{const p=px(lat,lon);return p[0]+p[1]+p[2]>=12;};
function earthColour(lat,lon,r){
  if(!isLand(lat,lon)){let coast=0;for(let a=0;a<8;a++){const t=a/8*TAU;if(isLand(lat+Math.sin(t)*1.3,lon+Math.cos(t)*1.3/Math.max(.2,Math.cos(lat*Math.PI/180))))coast++;}
    return new THREE.Color(coast>3?LC.mdazure:coast>1?LC.azure:(r()<.12?LC.dkblue:LC.blue));}
  if(Math.abs(lat)>66&&r()<.7)return new THREE.Color(LC.white);
  const[Rr,G,B]=px(lat,lon),c=new THREE.Color().setRGB(Rr/255,G/255,B/255,THREE.SRGBColorSpace);let best=null,bd=9;
  LANDC.forEach(([k,q])=>{const d=(c.r-q.r)**2+(c.g-q.g)**2*1.3+(c.b-q.b)**2;if(d<bd){bd=d;best=q;}});return best.clone();}
/* the sun's bricks glow with their own colour: the globe is the light source, so nothing else lights it */
const GLOW={value:.95};
const sunM=plasticM({clearcoat:.05,envMapIntensity:.3,specularIntensity:.3});
sunM.onBeforeCompile=s=>{s.uniforms.uGlow=GLOW;s.fragmentShader=s.fragmentShader.replace("uniform vec3 emissive;","uniform vec3 emissive;uniform float uGlow;").replace("#include <emissivemap_fragment>","#include <emissivemap_fragment>\ntotalEmissiveRadiance+=diffuseColor.rgb*uGlow;");};
/* finer than the planets' Lego: the desk globe ends its push in fine bricks and dissolves into this, so the jump in brick size stays small; still reads as Lego in the hub */
const sun=brickSphere(GR,.022,earthColour,sunM,19);sun.rotation.y=THREE.MathUtils.degToRad(98);sun.rotation.x=-.08;sys.add(sun);
/* corona: a warm halo, the light's colour, strongest at the limb */
const haloSh={transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.BackSide,
  vertexShader:`varying vec3 vN,vV,vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;vN=normalize(mat3(modelMatrix)*normal);vV=normalize(cameraPosition-w.xyz);gl_Position=projectionMatrix*viewMatrix*w;}`};
const limb=new THREE.Mesh(new THREE.SphereGeometry(GR*1.09,64,40),new THREE.ShaderMaterial(Object.assign({},haloSh,{uniforms:{},
  fragmentShader:`varying vec3 vN,vV;void main(){float d=abs(dot(vN,vV));gl_FragColor=vec4(vec3(1.,.8,.55)*pow(1.-d,6.)*1.2,1.);}`})));sys.add(limb);
const CS=GR*5.2,corona=new THREE.Mesh(new THREE.PlaneGeometry(CS,CS),new THREE.ShaderMaterial({transparent:true,depthWrite:false,depthTest:false,blending:THREE.AdditiveBlending,uniforms:{uR:{value:GR},uS:{value:CS}},
  vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  fragmentShader:`uniform float uR,uS;varying vec2 vUv;void main(){float r=length(vUv-.5)*uS;float a=smoothstep(uR*.92,uR*1.04,r)*exp(-(r-uR)/(uR*.3))*smoothstep(uS*.5,uS*.26,r);gl_FragColor=vec4(vec3(1.,.76,.5)*a*.6,1.);}`}));
corona.renderOrder=5;scene.add(corona); /* faces the camera every frame */
const key=new THREE.PointLight(0xffeedd,16,0,1.2); /* a gentle fall-off, so the inner planets do not burn out and the outer ones still read */scene.add(key); /* the sun lights the planets */
const starlight=new THREE.DirectionalLight(0x9fb4d8,.16);scene.add(starlight); /* a faint cool fill from the camera side */
scene.add(new THREE.HemisphereLight(0x55637a,0x14161c,1.15)); /* the glow of the band and the dust: the night sides stay readable */
const fill=new THREE.PointLight(0xfff1dc,0,0,2);scene.add(fill); /* arrival: a fill from the camera side, so the planet's lit face meets the visitor */

/* ---------- rings: thin dust bands, lit grey; the focused one brighter; a visited one carries the accent ---------- */
const ringMat=()=>new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,uniforms:{uCol:{value:new THREE.Color(0x8f9d9f)},uA:{value:.35},uIn:{value:1},uOut:{value:1}},
  vertexShader:`uniform float uIn,uOut;varying float vR;void main(){vR=(length(position.xy)-uIn)/(uOut-uIn);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  fragmentShader:`uniform vec3 uCol;uniform float uA;varying float vR;void main(){float t=vR*2.-1.;float a=1.-t*t;a*=a;gl_FragColor=vec4(uCol*a*uA,1.);}`});
/* ---------- planets ---------- */
const atmoM=(col,k)=>new THREE.ShaderMaterial(Object.assign({},haloSh,{uniforms:{uCol:{value:new THREE.Vector3(...col)},uK:{value:k}},
  fragmentShader:`uniform vec3 uCol;uniform float uK;varying vec3 vN,vV,vW;void main(){float d=abs(dot(vN,vV));float f=pow(1.-d,3.2);float day=smoothstep(-.35,.45,dot(vN,normalize(-vW)));gl_FragColor=vec4(uCol*f*uK*(.12+.88*day)*.9,1.);}`}));
const planets=PLANETS.map((P,i)=>{const dist=1.3+i*.52,a=Math.PI/2+[0,55,-55,110,-110,165][i]*Math.PI/180; /* home view: Concord front, the rest fan out to the sides and back */
  const g=new THREE.Group();let m;
  if(P.id==="projects"){ /* a small world built of loose Lego, the colours of a bag of bricks */
    const pal=["red","yellow","blue","green","white","orange","ltgrey","black","mdazure","tan"].map(k=>new THREE.Color(LC[k]));
    m=brickSphere(P.r,.021,(lat,lon,r)=>{const n=fbm3(Math.cos(lon*Math.PI/180)*2,Math.sin(lon*Math.PI/180)*2,lat/45,3);return pal[Math.floor(clamp(n*1.6-.3)*pal.length)%pal.length].clone();},plasticM({envMapIntensity:.7}),7);}
  else{const s=surface(PX,PX/2,SURF[P.id]);
    m=new THREE.Mesh(new THREE.SphereGeometry(P.r,96,64),new THREE.MeshStandardMaterial({map:s.map,roughnessMap:s.roughnessMap,normalMap:s.normalMap,normalScale:new THREE.Vector2(.45,.45),roughness:1,envMapIntensity:.25,
      emissiveMap:s.emissiveMap,emissive:s.emissiveMap?new THREE.Color(1,1,1):new THREE.Color(0),emissiveIntensity:2.2}));}
  m.rotation.z=P.tilt;g.add(m);
  const atmo=new THREE.Mesh(new THREE.SphereGeometry(P.r*1.07,64,40),atmoM(P.atmo,P.atmoK));g.add(atmo);
  const rm=ringMat();rm.uniforms.uIn.value=dist-.007;rm.uniforms.uOut.value=dist+.007;
  const ring=new THREE.Mesh(new THREE.RingGeometry(dist-.007,dist+.007,320,1),rm);ring.rotation.x=-Math.PI/2;sys.add(ring);
  g.position.set(Math.cos(a)*dist,0,Math.sin(a)*dist);sys.add(g);
  return{...P,i,m:g,spin:m,ring,a,dist,v:new THREE.Vector3(),seen:false,hot:0};});

/* ---------- stars: still, far, thicker along one tilted band ---------- */
{const n=small()?1400:3200,pos=new Float32Array(n*3),st=new Float32Array(n*2),r=rng(48271),tilt=.5,cT=Math.cos(tilt),sT=Math.sin(tilt);
  for(let i=0;i<n;i++){let x,y,z;if(i%5<3){const a=r()*TAU,h=(r()+r()+r()-1.5)*.16;x=Math.cos(a);y=h;z=Math.sin(a);const X=x*cT-y*sT,Y=x*sT+y*cT;x=X;y=Y;}else{const u=r()*2-1,a=r()*TAU,q=Math.sqrt(1-u*u);x=q*Math.cos(a);y=u;z=q*Math.sin(a);}
    const l=Math.hypot(x,y,z),Rr=60+r()*30,b=r();pos.set([x/l*Rr,y/l*Rr,z/l*Rr],i*3);st.set([b>.985?3:b>.82?2:1.4,b>.985?2:b>.82?1:.4+r()*.35],i*2);}
  const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.BufferAttribute(pos,3));g.setAttribute("st",new THREE.BufferAttribute(st,2));
  const stars=new THREE.Points(g,new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{dpr:{value:R.getPixelRatio()}},
    vertexShader:`attribute vec2 st;uniform float dpr;varying float vB;varying vec3 vC;void main(){vB=st.y;vC=mix(vec3(1.,.9,.78),vec3(.78,.86,1.),fract(st.x*7.1));gl_PointSize=st.x*dpr;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`varying float vB;varying vec3 vC;void main(){vec2 c=gl_PointCoord-.5;float a=smoothstep(.5,.1,length(c));gl_FragColor=vec4(vC*a*vB,1.);}`}));
  scene.add(stars);}

/* ---------- lens ---------- */
let W=1,H=1,portrait=false;
const comp=new EffectComposer(R);comp.addPass(new RenderPass(scene,cam));
const bokeh=new BokehPass(scene,cam,{focus:9,aperture:.0022,maxblur:.011});comp.addPass(bokeh);
const bloom=new UnrealBloomPass(new THREE.Vector2(1,1),.3,.5,1.7);comp.addPass(bloom);
comp.addPass(new OutputPass());
const film=new ShaderPass({uniforms:{tDiffuse:{value:null},uTime:{value:0},uRes:{value:new THREE.Vector2(1,1)},uVig:{value:1}},
  vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  fragmentShader:`uniform sampler2D tDiffuse;uniform float uTime,uVig;uniform vec2 uRes;varying vec2 vUv;
    float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
    void main(){vec2 c=vUv-.5;float r2=dot(c,c);vec2 off=c*r2*.005;
      vec3 col=vec3(texture2D(tDiffuse,vUv+off).r,texture2D(tDiffuse,vUv).g,texture2D(tDiffuse,vUv-off).b);
      col*=mix(1.,mix(1.,.45,uVig),smoothstep(.08,.62,r2*1.6));
      float g=h(vUv*uRes+fract(uTime*7.13)*100.)-.5;float l=dot(col,vec3(.299,.587,.114));col+=g*.045*(1.-l*.6);
      gl_FragColor=vec4(col,1.);}`});
comp.addPass(film);

/* ---------- camera and interaction (as in the step 3 prototype) ---------- */
const HUB={dist:10.3,el:.62}; /* camera: 35 degrees above the plane */
let turn=0,turnT=0,turnV=0,tilt=0,tiltT=0,focusI=0,dragging=false,pxx=0,pyy=0,moved=0;
let fly=null,at=0; /* fly: {k,t,d,dir,done}; at: 0 hub .. 1 at a planet */
/* the intro hand-off: sk 1 = the camera close on the sun, centred, its disc .4 of the long side (where the desk's globe ends), 0 = the hub */
let sk=0,pull=null;const _q=new THREE.Quaternion(),_m=new THREE.Matrix4(),_e=new THREE.Vector3(),_o=new THREE.Vector3(),_up=new THREE.Vector3(0,1,0);
function sunPose(out){const f=H/2/Math.tan(cam.fov*Math.PI/360),r=.4*Math.max(W,H);return out.copy(hp).normalize().multiplyScalar(Math.sqrt((f*GR/r)**2+GR*GR));}
const _p=new THREE.Vector3(),_l=new THREE.Vector3(),hp=new THREE.Vector3(),hl=new THREE.Vector3(),_d=new THREE.Vector3(),_c=new THREE.Vector3();
function hubPose(){const d=HUB.dist*(portrait?Math.max(1.34,.78/(W/H)):1) /* narrow phones pull back further so the outer planets stay on screen */,el=HUB.el+(portrait?.36:0)+tilt;hp.set(0,Math.sin(el)*d,Math.cos(el)*d);hl.set(0,portrait?.1:-.5,0);} /* landscape: the system sits a little high, so the outer ring clears the bottom edge when turned */ {}
const frontAngleOf=k=>k.a-Math.PI/2;
function nearestFront(){let best=0,bd=9;planets.forEach(k=>{k.m.getWorldPosition(k.v);const d=Math.abs(Math.atan2(k.v.x,k.v.z));if(k.v.z>0&&d<bd){bd=d;best=k.i;}});return best;}
function size(){W=innerWidth;H=innerHeight;portrait=W<H;R.setSize(W,H,false);comp.setSize(W,H);cam.aspect=W/H;cam.fov=portrait?48:32;cam.updateProjectionMatrix();film.uniforms.uRes.value.set(W*R.getPixelRatio(),H*R.getPixelRatio());}
addEventListener("resize",size);size();
const down=e=>{if(at>0||fly)return;dragging=true;moved=0;pxx=e.clientX;pyy=e.clientY;};
const move=e=>{if(!dragging)return;const dx=e.clientX-pxx,dy=e.clientY-pyy;pxx=e.clientX;pyy=e.clientY;moved+=Math.abs(dx)+Math.abs(dy);turnT+=dx*.006;turnV=dx*.006;tiltT=Math.max(-.12,Math.min(.18,tiltT-dy*.0015));};
const up=()=>{dragging=false;setTimeout(()=>{moved=0;},60);};
host.addEventListener("pointerdown",down);addEventListener("pointermove",move);addEventListener("pointerup",up);addEventListener("pointercancel",up);
const ACC=new THREE.Color(0x7cc0b6),GREY=new THREE.Color(0x8f9d9f);
let time=0;
window.SOLAR={
  ready:true,planets,
  get at(){return at;},get flying(){return !!fly;},get dragged(){return moved>6;},
  focusId(){return planets[focusI].id;},
  focus(id){const k=planets.find(q=>q.id===id);if(!k)return;focusI=k.i;turnT=frontAngleOf(k);turnV=0;},
  step(n){this.focus(planets[(focusI+n+planets.length)%planets.length].id);},
  seen(id){const k=planets.find(q=>q.id===id);if(k)k.seen=true;},
  fly(id,done){const k=planets.find(q=>q.id===id);if(!k)return;focusI=k.i;turnT=frontAngleOf(k);fly={k,t:0,d:RM?0:1.2,dir:1,done};},
  back(done){const k=planets[focusI];fly={k,t:0,d:RM?0:.9,dir:-1,done};},
  hold(){sk=1;pull=null;fly=null;at=0;},
  pull(d){if(sk>0)pull={t:0,d:RM?0:d,s0:sk};},
  home(){fly=null;at=0;},
  pose(){hubPose();sunPose(_e);_m.lookAt(_e,_o.set(0,0,0),_up);_q.setFromRotationMatrix(_m).invert();sun.updateMatrixWorld();const sq=new THREE.Quaternion();sun.getWorldQuaternion(sq);
    return{cx:W/2,cy:H/2,r:.4*Math.max(W,H),q:_q.multiply(sq).toArray()};},
  get sk(){return sk;},
  jump(id){const k=planets.find(q=>q.id===id);if(!k)return;focusI=k.i;turn=turnT=frontAngleOf(k);at=1;},
  anchors(){ /* screen positions and state; a planet passing behind the sun's disc is hidden, label and button */
    const f=(H/2)/Math.tan(cam.fov*Math.PI/360),sd=cam.position.length(),rs=GR*f/sd;_c.set(0,0,0).project(cam);const sx=(_c.x*.5+.5)*W,sy=(-_c.y*.5+.5)*H;
    return planets.map(k=>{k.m.getWorldPosition(k.v);const z=k.v.z,dist=cam.position.distanceTo(k.v);k.v.project(cam);const rp=k.r*f/Math.max(.1,dist),x=(k.v.x*.5+.5)*W,y=(-k.v.y*.5+.5)*H;
      return{id:k.id,name:k.name,x,y:y+rp+6,cx:x,cy:y,rp,near:z>-.4,hidden:dist>sd&&(Math.hypot(x-sx,y-sy)<rs*1.25+rp*.5||Math.hypot(x-sx,y+rp+12-sy)<rs*1.5), /* behind the sun, or its label would sit on the sun */focus:k.i===focusI,seen:k.seen,r:k.r};});},
  set(dt){time+=dt;
    if(!dragging){turnT+=turnV;turnV*=Math.exp(-dt*4);}
    turn+=(turnT-turn)*(1-Math.exp(-dt*6));tilt+=(tiltT-tilt)*(1-Math.exp(-dt*6));sys.rotation.y=turn;
    if(!dragging&&!fly&&at===0&&Math.abs(turnV)<1e-4)focusI=nearestFront();
    planets.forEach(k=>{k.spin.rotation.y+=dt*.12;const want=k.i===focusI?1:0;k.hot+=(want-k.hot)*(1-Math.exp(-dt*8));
      k.ring.material.uniforms.uA.value=.22+.5*k.hot;k.ring.material.uniforms.uCol.value.copy(k.seen?ACC:GREY);});
    if(fly){fly.t+=dt;const e=fly.d?ease(fly.t/fly.d):1;at=fly.dir>0?e:1-e;if(fly.t>=fly.d){const f=fly;fly=null;at=f.dir>0?1:0;if(f.done)f.done();}}
    if(pull){pull.t+=dt;const e=pull.d?ease(pull.t/pull.d):1;sk=pull.s0*(1-e);if(e>=1){sk=0;pull=null;}}
    hubPose();const k=planets[focusI];k.m.getWorldPosition(_p);
    /* close pose: the planet fills the view (its radius spans about 92% of the half height) */
    const dClose=k.r/Math.sin(cam.fov*Math.PI/360)*1.08;_d.copy(_p).sub(hp).normalize();_c.copy(_p).addScaledVector(_d,-dClose);
    cam.position.lerpVectors(hp,_c,at);_l.lerpVectors(hl,_p,at);
    if(sk>0){sunPose(_e);cam.position.lerp(_e,sk);_l.lerp(_o.set(0,0,0),sk);} /* sk is already eased by pull */
    cam.lookAt(_l);cam.updateMatrixWorld();
    fill.position.copy(cam.position);fill.intensity=at*at*1.3*dClose*dClose;
    starlight.position.copy(cam.position).normalize().multiplyScalar(10).add(new THREE.Vector3(0,3,0));starlight.intensity=.16*(1-at*.7);corona.quaternion.copy(cam.quaternion);
    /* the lens: in the hub the focus sits on the focused planet, with a small aperture so the far side only softens; flying in, the aperture opens */
    const dFoc=(cam.position.distanceTo(_p)-k.r*at)*(1-sk)+(cam.position.length()-GR)*sk;bokeh.uniforms.focus.value=dFoc;bokeh.uniforms.aperture.value=.0022+.0015*at;bokeh.uniforms.maxblur.value=.0012+.005*at;
    film.uniforms.uVig.value=1-.35*at;film.uniforms.uTime.value=time;
    comp.render();
  }};
