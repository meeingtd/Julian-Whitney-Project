/* Story progress: the departures board under the name says where you are and flips letter by letter at each cut (open it for the
   whole route), and a video timeline runs along the top edge of the page: each chapter a segment as long as its share of the scroll,
   hover to see a frame's print, drag or tap to seek. */
window.PROGRESS=api=>{
  const{FR,PRE,STORY,pAtStory,scrollMax,getP,busy}=api,N=FR.length,still=matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* The page picks the mode a frame lives in (intro, a place, the hub) and scrolls inside it. */
  const go=i=>api.goFrame(i);
  const where=(s,q)=>{const p=getP(),o=api.cur(s,q),cur=o!=null?o:p<PRE?0:q>0?N-1:Math.max(1,FR.findIndex((f,i)=>i>0&&f[1]!==null&&s>=f[1]&&s<f[2]));
    const fr=cur===0?Math.min(1,p/PRE):cur===N-1?Math.min(1,q):Math.min(1,Math.max(0,(s-FR[cur][1])/(FR[cur][2]-FR[cur][1])));return{p,cur,fr};};
  /* prints: a picture cut from each frame's live view once it is fully up */
  const prints=FR.map(()=>{const c=document.createElement("canvas");c.width=192;c.height=112;return{c,has:false,n:0};});
  let tick=0;
  function capture(s,q){if(tick%24!==0||busy())return;const{cur}=where(s,q),src=api.source({src:FR[cur][3]},q);if(!src||!src.width)return;
    const P=prints[cur],tw=P.c.width,th=P.c.height,sw=src.width*.62,sh=sw*th/tw;P.c.getContext("2d").drawImage(src,(src.width-sw)/2,Math.max(0,(src.height-sh)*.42),sw,sh,0,0,tw,th);P.has=true;P.n++;}
  const css=t=>{const st=document.createElement("style");st.textContent=t;document.head.appendChild(st);};
  const board=(()=>{
  css(`.pv3{position:fixed;z-index:5;left:max(20px,env(safe-area-inset-left,0px));top:50px;font:500 var(--t-xs)/1 var(--f-mono)}
.pv3{pointer-events:none} /* the closed list still has a box: only the row and the open list take clicks */
.pv3 > button{pointer-events:auto;display:block;padding:0;margin:0;border:0;background:none;cursor:pointer;color:var(--ink)}
.pv3 .fl{display:flex;gap:2px}
.pv3 .fl span{position:relative;display:block;width:17px;height:25px;line-height:25px;font-size:14px;text-align:center;background:#1A2125;border-radius:2px;color:var(--ink);box-shadow:inset 0 -1px 0 rgba(0,0,0,.45)}
.pv3 .fl span::after{content:"";position:absolute;left:0;right:0;top:50%;height:1px;background:rgba(0,0,0,.55)}
.pv3 .fl span.e{background:#151B1E}
.pv3 .ln{height:2px;margin-top:6px;background:rgba(232,236,236,.12)}
.pv3 .ln i{display:block;height:100%;background:var(--accent);transform-origin:0 50%;transform:scaleX(0)}
.pv3 ol{list-style:none;margin:10px 0 0;padding:10px 0;background:rgba(14,18,20,.92);border-radius:3px;min-width:244px;opacity:0;transform:translateY(-4px) scale(.98);transform-origin:0 0;pointer-events:none;transition:opacity .12s ease-out,transform .18s cubic-bezier(.2,.7,.2,1);box-shadow:0 14px 40px rgba(0,0,0,.5)}
.pv3.open ol{opacity:1;transform:none;pointer-events:auto}
.pv3 ol button{display:flex;width:100%;gap:10px;align-items:center;padding:7px 14px;border:0;background:none;font:inherit;color:var(--muted);cursor:pointer;text-align:left;text-transform:uppercase;letter-spacing:.04em}
.pv3 ol button.past{color:#5d6a6c}.pv3 ol button.cur{color:var(--ink)}.pv3 ol button.cur::before{content:"+";color:var(--accent);margin-left:-10px;width:0}
.pv3 ol button:hover{color:var(--ink)}
@media (max-width:760px){.pv3{left:12px;top:56px;font-size:11px}.pv3 .fl span{width:12px;height:18px;line-height:18px}}
@media (prefers-reduced-motion:reduce){.pv3 *{transition:none!important}}`);
  const W=15,CH=" ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const root=document.createElement("nav");root.className="pv3";root.dataset.variateSection="progress";root.setAttribute("aria-label","Story progress");
  root.innerHTML=`<button type="button" aria-expanded="false"><span class="fl"></span></button><ol></ol>`;document.body.appendChild(root);
  const tg=root.firstElementChild,fl=root.querySelector(".fl"),ol=root.querySelector("ol");
  const cells=Array.from({length:W},()=>{const s=document.createElement("span");s.textContent=" ";fl.append(s);return s;});
  const rows=FR.map((f,i)=>{const li=document.createElement("li"),b=document.createElement("button");b.type="button";b.textContent=f[0];b.addEventListener("click",()=>{go(i);setOpen(false);});li.append(b);ol.append(li);return b;});
  const setOpen=v=>{root.classList.toggle("open",v);tg.setAttribute("aria-expanded",v);};
  tg.addEventListener("click",()=>setOpen(!root.classList.contains("open")));
  addEventListener("keydown",e=>{if(e.key==="Escape")setOpen(false);});
  addEventListener("pointerdown",e=>{if(!root.contains(e.target))setOpen(false);});
  addEventListener("scroll",()=>{if(root.classList.contains("open")&&!root.matches(":hover"))setOpen(false);},{passive:true});
  /* the flap: each cell turns through the alphabet to its letter, staggered left to right */
  let want=" ".repeat(W),have=" ".repeat(W).split(""),lastCur=-1,lastT=0,start=0;
  const flip=t=>{if(t-lastT<32)return;lastT=t;cells.forEach((c,i)=>{if(t-start<i*28)return;const a=have[i],b=want[i];if(a===b)return;
    have[i]=CH[(CH.indexOf(a)+1)%CH.length];c.textContent=have[i];c.classList.toggle("e",have[i]===" ");});};
  function frame(s,q){const{cur,fr}=where(s,q);
    if(cur!==lastCur){lastCur=cur;start=performance.now();want=FR[cur][0].toUpperCase().slice(0,W).padEnd(W," ");tg.setAttribute("aria-label",FR[cur][0]+", open the route");
      rows.forEach((b,i)=>{b.className=i<cur?"past":i===cur?"cur":"";});
      if(still){have=want.split("");cells.forEach((c,i)=>{c.textContent=have[i];c.classList.toggle("e",have[i]===" ");});}}
    if(!still)flip(performance.now());
  }
    return{frame,root};})();
  const bar=(()=>{
  css(`.pv2{position:fixed;z-index:5;left:0;right:0;top:0;height:22px;touch-action:none;cursor:pointer}
.pv2 .tr{position:absolute;left:0;right:0;top:0;height:3px;display:flex;gap:2px;transition:height .15s cubic-bezier(.2,.7,.2,1)}
.pv2:hover .tr,.pv2.drag .tr{height:6px}
.pv2 .sg{position:relative;height:100%;background:rgba(232,236,236,.14);overflow:hidden}
.pv2 .sg b{position:absolute;inset:0;background:var(--ink2);transform-origin:0 50%;transform:scaleX(0)}
.pv2 .sg.cur b{background:var(--accent)}
.pv2 .hd{position:absolute;top:-3px;width:12px;height:12px;margin-left:-6px;border-radius:50%;background:var(--accent);opacity:0;transform:scale(.6);transition:opacity .15s,transform .15s cubic-bezier(.2,.7,.2,1)}
.pv2:hover .hd,.pv2.drag .hd{opacity:1;transform:none}
.pv2 .pr{position:absolute;top:14px;width:176px;margin-left:-88px;opacity:0;transform:translateY(-4px) scale(.96);transform-origin:50% 0;transition:opacity .12s ease-out,transform .15s cubic-bezier(.2,.7,.2,1);pointer-events:none}
.pv2 .pr.on{opacity:1;transform:none}
.pv2 .pr canvas{display:block;width:176px;height:103px;border-radius:3px;background:var(--panel);box-shadow:0 10px 30px rgba(0,0,0,.55)}
.pv2 .nw{position:absolute;top:8px;left:0;white-space:nowrap;font:500 var(--t-xs)/1 var(--f-mono);letter-spacing:.02em;color:var(--ink);background:rgba(14,18,20,.78);padding:4px 7px;border-radius:2px;pointer-events:none; /* a dark backing: the label sits over pale scenes (sand, snow) */transition:opacity .2s ease-out}
.pv2:hover .nw,.pv2.drag .nw{opacity:0}
.pv2 .nw{display:none} /* Round 10: the board under the name is the one place label; this second one collided with the header */
@media (max-width:760px){.pv2 .nw{top:110px;left:12px;transform:none!important;font-size:var(--t-xs)}}
.pv2 .pr span{display:block;margin-top:6px;font:500 var(--t-xs)/1.3 var(--f-mono);color:var(--ink);text-align:center;text-shadow:0 0 8px var(--bg)}
.pv2 .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
@media (prefers-reduced-motion:reduce){.pv2 *{transition:none!important}}`);
  const root=document.createElement("nav");root.className="pv2";root.setAttribute("aria-label","Story timeline");
  root.innerHTML=`<div class="tr"></div><span class="nw" aria-hidden="true"></span><i class="hd"></i><div class="pr"><canvas width="192" height="112"></canvas><span></span></div><ol class="sr"></ol>`;document.body.appendChild(root);
  const nw=root.querySelector(".nw"),tr=root.querySelector(".tr"),hd=root.querySelector(".hd"),pr=root.querySelector(".pr"),pc=pr.querySelector("canvas"),pn=pr.querySelector("span"),sr=root.querySelector(".sr");
  /* screen-reader and keyboard route: a plain list of jump buttons */
  FR.forEach((f,i)=>{const li=document.createElement("li"),b=document.createElement("button");b.type="button";b.textContent=f[0];b.addEventListener("click",()=>go(i));li.append(b);sr.append(li);});
  /* segments: only the frames inside the current mode's scroll, each as long as its share of it (api.span, in 0..1 of the page) */
  let E=null,segs=[];const edges=()=>{const sp=api.span();if(E&&E.key===sp.key)return E.list;E=sp;tr.innerHTML="";
    segs=sp.list.map(k=>{const d=document.createElement("div");d.className="sg";d.innerHTML="<b></b>";d.style.flex=`${Math.max(.004,k.b-k.a)} 1 0`;tr.append(d);return d;});
    root.style.display=sp.list.length?"":"none";lastCur=-1;return sp.list;};
  const frameAt=x=>{const e=edges();for(let j=0;j<e.length;j++)if(x<e[j].b)return e[j].i;return e.length?e[e.length-1].i:0;};
  const pAt=x=>x;
  let hover=-1,drag=false,shown=-1,shownN=-1,lastCur=-1,overall=0;
  const show=(i,x)=>{hover=i;if(i<0){pr.classList.remove("on");return;}const bw=box().width,bl=box().left;pr.style.left=Math.min(innerWidth-96-bl,Math.max(96-bl,x))+"px";pn.textContent=FR[i][4]||FR[i][0];pr.classList.add("on");
    if(shown!==i||shownN!==prints[i].n){shown=i;shownN=prints[i].n;const g=pc.getContext("2d");g.fillStyle="#161C1F";g.fillRect(0,0,192,112);if(prints[i].has)g.drawImage(prints[i].c,0,0);}};
  const box=()=>root.getBoundingClientRect(),xOf=e=>{const r=box();return Math.min(1,Math.max(0,(e.clientX-r.left)/r.width));};
  root.addEventListener("pointermove",e=>{const x=xOf(e);show(frameAt(x),x*box().width);if(drag)scrollTo(0,pAt(x)*scrollMax());});
  root.addEventListener("pointerleave",()=>{if(!drag)show(-1);});
  root.addEventListener("pointerdown",e=>{drag=true;root.classList.add("drag");root.setPointerCapture(e.pointerId);const x=xOf(e);show(frameAt(x),x*box().width);scrollTo(0,pAt(x)*scrollMax());});
  ["pointerup","pointercancel"].forEach(n=>root.addEventListener(n,e=>{drag=false;root.classList.remove("drag");if(e.pointerType!=="mouse")show(-1);}));
  function frame(s,q){const e=edges();if(!e.length)return;const{cur}=where(s,q);
    overall=api.u();hd.style.left=(overall*100).toFixed(3)+"%";
    let j=e.findIndex(k=>overall>=k.a&&overall<k.b);if(j<0)j=overall>=e[e.length-1].a?e.length-1:0;
    if(cur!==lastCur){lastCur=cur;nw.textContent=FR[cur][4]||FR[cur][0];}
    segs.forEach((d,i)=>d.classList.toggle("cur",i===j));
    /* the place you are in, always named under its own segment, kept on screen */
    {const bw=box().width,x=Math.max(12,Math.min(bw-nw.offsetWidth-12,e[j].a*bw));nw.style.transform=`translateX(${x.toFixed(1)}px)`;}
    segs.forEach((d,i)=>{const k=e[i],v=i<j?1:i>j?0:Math.min(1,Math.max(0,(overall-k.a)/(k.b-k.a)));d.firstChild.style.transform=`scaleX(${v.toFixed(4)})`;});}
    return{frame};})();
  function frame(s,q){tick++;board.frame(s,q);bar.frame(s,q);}
  return{frame,capture};
};
