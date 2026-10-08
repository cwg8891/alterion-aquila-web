/* Alterion Solutions hero: shadow (release solutions-v1, 2026-10-07).
   Engine code is verbatim from the approved prototype (alterion-solutions-hifi-v179-shadow); stars stay visible and are 2x brighter;
   narrow-layout fixes for the 1/3-width hero. Needs <div data-embed="shadow-hero" class="sa-hero"></div> on the page. */
/* assets/shadow-agents/shadow-hero.engine.js */
/* Shadow Agents hero engine, extracted verbatim from shadow-agents-page-v114.html (newer than animation-source). */
/* ============ Shadow Agents hero engine (v7)
   Beat 1 · SCAN (v71): 30 tetrahedron agents in space (Aquila camera + stars); a radar-style orange chevron
   sweeps the animation top-left → bottom-right, diffusing toward its ends; each agent flashes and turns orange as it's passed.
   Beat 2 · the scan-result UI (shadow-faux-ui-v4) is drawn into existence: outline traces on, fill fades
   in behind, contents stagger, the 972 counts up.
   One instance per root element (root holds canvas.stage + .fx). ============ */
function ShadowHero(root){
const cv=root.querySelector('canvas.stage'), ctx=cv.getContext('2d');
const BG='#050505', GREY='#8E8B86', GREYD='#232120', OR='#D24A2F', GREEN='#47D553', BOX='#DDD9D2', MONO="'IBM Plex Mono', ui-monospace, monospace";
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let seed=1337; const rnd=()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};

// ---------- camera (Aquila: perspective, yaw/pitch, F/D)
const CFG={F:1480,D:1650};
const cam={yaw:-32*Math.PI/180,pitch:9,cx:0.5,cy:0.5,zoom:1};
let W=1,H=1,px=1;
function proj(x,y,z){
  const cy=Math.cos(cam.yaw),sy=Math.sin(cam.yaw),cp=Math.cos(cam.pitch*Math.PI/180),sp=Math.sin(cam.pitch*Math.PI/180);
  const xr=x*cy+z*sy, zr=-x*sy+z*cy, yr=y*cp-zr*sp, z2=y*sp+zr*cp;
  const s=CFG.F/(CFG.D-z2)*cam.zoom*(W/810);
  return [W*cam.cx+xr*s, H*cam.cy-yr*s, s];
}
// ---------- stars (Aquila: 95, r .5–1.4, op .10–.40, twinkle)
const STARS=[];for(let i=0;i<95;i++)STARS.push({x:rnd(),y:rnd(),r:0.5+rnd()*0.9,b:0.10+rnd()*0.30,sp:0.5+rnd()*1.4,ph:rnd()*6.283});

// ---------- agents: 30 tetrahedra in a loose cloud with real depth
const N=30, AG=[];
const TV=[[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]].map(v=>v.map(c=>c/Math.sqrt(3)));
const TE=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
for(let i=0;i<N;i++){
  const gx=(i%6)/6, gy=Math.floor(i/6)/5;                       // 6×5 stratified, then jittered
  AG.push({x:(gx-0.5+rnd()*0.16)*820, y:(gy-0.5+rnd()*0.2)*470, z:(rnd()-0.5)*420,
           r:15+rnd()*5, rot:[rnd()*6.283,rnd()*6.283,rnd()*6.283], w:[0.12+rnd()*0.18,0.1+rnd()*0.15,0.08+rnd()*0.12].map(v=>v*(rnd()<0.5?-1:1)),
           vx:0,vy:0,vz:0, t0:0.1+rnd()*1.0});
}
function rot3(v,a){let [x,y,z]=v;const [ax,ay,az]=a;
  let y2=y*Math.cos(ax)-z*Math.sin(ax),z2=y*Math.sin(ax)+z*Math.cos(ax);y=y2;z=z2;
  let x2=x*Math.cos(ay)+z*Math.sin(ay);z2=-x*Math.sin(ay)+z*Math.cos(ay);x=x2;z=z2;
  x2=x*Math.cos(az)-y*Math.sin(az);y2=x*Math.sin(az)+y*Math.cos(az);return [x2,y2,z];}
const cl=u=>u<0?0:u>1?1:u, eoc=u=>1-Math.pow(1-cl(u),3);

// ---------- timeline (seconds)
const UI_SPD=1.95;  // card draw-in runs 1.95× faster (whole hero ≤ 2s)
const T_IND=0.15, T_SCAN=0.25, D_SCAN=0.5, BOX_D=0.24, D_DONE=0.1, D_UI=2.2/UI_SPD, D_UIHOLD=2.0, D_FADE=0.5;
const T_DONE=T_SCAN+D_SCAN, T_UI=T_DONE+D_DONE, T_UIHOLD=T_UI+D_UI, T_FADE=T_UIHOLD+D_UIHOLD, T_LOOP=T_FADE+D_FADE;
// sweep order: left → right by projected x, fixed at first frame so boxes don't reshuffle as agents drift
let ORDER=null;
// v71/v72 scan (v72: faster, wider, more aggressive): radar-style chevron sweep across the animation only (top-left → bottom-right). The line bends at its
// center (apex leads), is hottest at the center and diffuses in color + opacity toward both ends; agents turn orange as it passes.
const SCAN_OR='#FF5A36', FLASH=0.25, TRAIL=230, BEND=36, WK=document.createElement('canvas'), wctx=WK.getContext('2d');

// ---------- Beat 2 DOM
const FX=root.querySelector('.fx'), FR=FX.querySelector('.dr-frame'), RL=FX.querySelector('.dr-rule'), FILL=FX.querySelector('.cfill'), NUM=FX.querySelector('.cnum'), ELS=[].slice.call(FX.querySelectorAll('[data-el]'));
const EL_D=[0.95,1.05,1.10,1.45,1.65];
function drawUI(tu,fadeOp){
  if(tu<0){FX.style.opacity=0;return}
  FX.style.opacity=fadeOp;
  const k=reduced?1:eoc(tu/0.75); FR.style.strokeDashoffset=100-100*k;
  const kr=reduced?1:eoc((tu-0.45)/0.5); RL.style.strokeDashoffset=100-100*kr;
  FILL.style.opacity=reduced?1:eoc((tu-0.35)/0.52);
  ELS.forEach((el,i)=>{const e=reduced?1:eoc((tu-EL_D[i])/0.42);el.style.opacity=e;el.style.transform='translateY('+(6*(1-e))+'px)'});
  const n=reduced?1:eoc((tu-1.1)/0.9); NUM.textContent=Math.round(972*n);
  const h=FX.querySelector('.ctop').offsetHeight; RL.setAttribute('y1',h);RL.setAttribute('y2',h);
}


// shadow-agent rendering helpers: silhouette hull + edges of camera-facing faces (proj()[2] = scale, larger = nearer)
const SH_EDGE='#A5AAB3', SH_FACES=[[1,2,3,0],[0,2,3,1],[0,1,3,2],[0,1,2,3]];
function hull2(P){const p=P.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]),cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]),lo=[],up=[];
  for(const q of p){while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],q)<=0)lo.pop();lo.push(q)}
  for(let i=p.length-1;i>=0;i--){const q=p[i];while(up.length>=2&&cr(up[up.length-2],up[up.length-1],q)<=0)up.pop();up.push(q)}return lo.slice(0,-1).concat(up.slice(0,-1))}
function visEdges(V){const out={};SH_FACES.forEach(f=>{const A=V[f[0]],B=V[f[1]],C=V[f[2]],O=V[f[3]];
  const den=(B[1]-C[1])*(A[0]-C[0])+(C[0]-B[0])*(A[1]-C[1]);if(Math.abs(den)<1e-9)return;
  const w1=((B[1]-C[1])*(O[0]-C[0])+(C[0]-B[0])*(O[1]-C[1]))/den,w2=((C[1]-A[1])*(O[0]-C[0])+(A[0]-C[0])*(O[1]-C[1]))/den,w3=1-w1-w2;
  if(O[2]<w1*A[2]+w2*B[2]+w3*C[2])[[f[0],f[1]],[f[1],f[2]],[f[0],f[2]]].forEach(e=>{out[Math.min(e[0],e[1])+'-'+Math.max(e[0],e[1])]=e})});return Object.values(out)}

// ---------- frame
let last=null, T0=performance.now(), FROZEN=null, HID=false;
function frame(ts){
  const r=cv.getBoundingClientRect();px=devicePixelRatio||1;
  W=Math.max(1,Math.round(r.width*px));H=Math.max(1,Math.round(r.height*px));
  if(!r.width){HID=true;requestAnimationFrame(frame);return}
  if(HID){HID=false;T0=ts;last=ts;if(typeof onRestart==='function')onRestart()}   // restart each time the page is shown
  if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H}
  if(last===null)last=ts;const dt=Math.min(50,ts-last);last=ts;
  let t=Math.min(FROZEN!==null?FROZEN:(ts-T0)/1000,T_UIHOLD);   // plays once and stops on the card (Replay restarts it)
  const mo=reduced?0:1;
  ctx.clearRect(0,0,W,H);   // transparent: the page background shows through, so it can never mismatch
  cam.yaw=(-32+1.0*Math.sin(t*6.283/14)*mo)*Math.PI/180;
  const inUI=t>=T_UI, fadeK=t>=T_FADE?1-eoc((t-T_FADE)/D_FADE):1;
  const dim=inUI?1-eoc((t-T_UI)/0.7):1;             // v99: background fades out completely while the card draws in
  const sceneOp=fadeK*dim;
  const boxOp=(inUI?1-eoc((t-T_UI)/0.7):1)*fadeK;         // the scan rectangles fade out as the UI fades in

  for(const a of AG){ if(!mo)continue;
    a.vx+=(rnd()-0.5)*0.02;a.vy+=(rnd()-0.5)*0.02;a.vz+=(rnd()-0.5)*0.02;
    const sp=Math.hypot(a.vx,a.vy,a.vz),cap=0.06;if(sp>cap){a.vx*=cap/sp;a.vy*=cap/sp;a.vz*=cap/sp}
    a.x+=a.vx*dt*0.06;a.y+=a.vy*dt*0.06;a.z+=a.vz*dt*0.06;
    a.rot[0]+=a.w[0]*dt/1000;a.rot[1]+=a.w[1]*dt/1000;a.rot[2]+=a.w[2]*dt/1000;}

  // stars
  for(const s of STARS){ctx.globalAlpha=Math.min(0.9,s.b*2)*(0.6+0.4*Math.sin(t*s.sp+s.ph)*mo);ctx.fillStyle='#EDEDEA';
    ctx.beginPath();ctx.arc(s.x*W,s.y*H,s.r*px,0,6.283);ctx.fill();}
  ctx.globalAlpha=1;

  // agents
  const drawn=[];
  AG.forEach((a,idx)=>{
    const k=1;
    const pop=1;   // already on screen at t=0
    const V=TV.map(v=>{const q=rot3(v,a.rot);return proj(a.x+q[0]*a.r*pop,a.y+q[1]*a.r*pop,a.z+q[2]*a.r*pop)});
    drawn.push({V,k,idx,d:V.reduce((s,p)=>s+p[2],0)/4});
  });
  drawn.sort((p,q)=>p.d-q.d);
  const bounds={};
  // v71: sweep geometry in stage pixels. Base line x+y=C; P = its point nearest the canvas center; the apex sits BEND ahead of P
  const S2=Math.SQRT1_2, bend=BEND*px, span=Math.hypot(W,H)*0.6;
  const sk=reduced?1:cl((t-T_SCAN)/D_SCAN), C=reduced?1e9:(-TRAIL*px-bend*2+sk*(W+H+2*TRAIL*px+bend*4)), scanning=!reduced&&t>=T_SCAN&&t<=T_SCAN+D_SCAN+0.35;
  const dP=(C-(W/2+H/2))/2, P=[W/2+dP,H/2+dP];
  function passed(qx,qy){const v=((qx-P[0])-(qy-P[1]))*S2, ahead=((qx+qy)-C)*S2;return ahead<=bend*Math.max(0,1-Math.abs(v)/span)}
  for(const g of drawn){
    const dz=cl((g.d-0.55)/0.6);
    let cx=0,cy=0;for(const p of g.V){cx+=p[0]/4;cy+=p[1]/4}
    const a=AG[g.idx];if(a.scanEpoch!==T0){a.scanEpoch=T0;a.passT=null}
    if(a.passT===null&&(t>=T_SCAN||reduced)&&(reduced||passed(cx,cy)))a.passT=reduced?-1:t;
    const hit=a.passT!==null, fl=hit&&!reduced?1-cl((t-a.passT)/FLASH):0;
    // shadow agent: #191716 silhouette, only the visible edges, dashed #A5AAB3 (the supplied shadow-agent SVG, in 3D); orange once the scan passes it
    ctx.globalAlpha=g.k*Math.max(0.45+0.55*dz,hit?0.75+0.25*fl:0)*sceneOp;ctx.lineWidth=(1.0+0.4*dz)*px;ctx.lineJoin='round';ctx.lineCap='round';
    const Hh=hull2(g.V);ctx.fillStyle='#191716';ctx.beginPath();Hh.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fill();
    ctx.strokeStyle=hit?(fl>0.55?'#FFD2C2':fl>0.05?SCAN_OR:OR):SH_EDGE;ctx.setLineDash([3*px,3*px]);ctx.beginPath();
    for(const [i,j] of visEdges(g.V)){ctx.moveTo(g.V[i][0],g.V[i][1]);ctx.lineTo(g.V[j][0],g.V[j][1])}ctx.stroke();ctx.setLineDash([]);
    let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const p of g.V){x0=Math.min(x0,p[0]);y0=Math.min(y0,p[1]);x1=Math.max(x1,p[0]);y1=Math.max(y1,p[1])}bounds[g.idx]=[x0,y0,x1,y1];
  }
  ctx.globalAlpha=1;

  // v71: radar chevron sweep, drawn on the stage canvas only
  if(scanning){
    const fade=(t>T_SCAN+D_SCAN?1-cl((t-T_SCAN-D_SCAN)/0.35):1)*fadeK, apex=[P[0]+bend*S2,P[1]+bend*S2];
    const E1=[P[0]+span*S2,P[1]-span*S2], E2=[P[0]-span*S2,P[1]+span*S2];   // arm ends, along the line
    // trailing wash: band behind the chevron, faded radially from the apex so it diffuses toward the ends
    if(WK.width!==W||WK.height!==H){WK.width=W;WK.height=H}
    wctx.globalCompositeOperation='source-over';wctx.clearRect(0,0,W,H);
    const tail=TRAIL*px, b0=[apex[0]-tail*S2,apex[1]-tail*S2];
    const lg=wctx.createLinearGradient(b0[0],b0[1],apex[0],apex[1]);
    lg.addColorStop(0,'rgba(255,90,54,0)');lg.addColorStop(0.85,'rgba(255,90,54,.34)');lg.addColorStop(1,'rgba(255,90,54,.5)');
    wctx.fillStyle=lg;wctx.beginPath();                         // wash polygon = area just behind both arms
    wctx.moveTo(E1[0],E1[1]);wctx.lineTo(apex[0],apex[1]);wctx.lineTo(E2[0],E2[1]);
    wctx.lineTo(E2[0]-tail*S2,E2[1]-tail*S2);wctx.lineTo(b0[0],b0[1]);wctx.lineTo(E1[0]-tail*S2,E1[1]-tail*S2);wctx.closePath();wctx.fill();
    wctx.globalCompositeOperation='destination-in';
    const rg=wctx.createRadialGradient(apex[0],apex[1],0,apex[0],apex[1],span*0.85);
    rg.addColorStop(0,'rgba(0,0,0,1)');rg.addColorStop(0.55,'rgba(0,0,0,.6)');rg.addColorStop(1,'rgba(0,0,0,0)');
    wctx.fillStyle=rg;wctx.fillRect(0,0,W,H);
    ctx.globalAlpha=fade;ctx.drawImage(WK,0,0);
    // the two arms: hot at the apex, cooling to deep red and fading out toward each end
    ctx.lineCap='round';ctx.lineJoin='round';
    [E1,E2].forEach(function(E){
      const g=ctx.createLinearGradient(apex[0],apex[1],E[0],E[1]);
      g.addColorStop(0,'rgba(255,120,82,1)');g.addColorStop(0.3,'rgba(255,90,54,.92)');g.addColorStop(0.62,'rgba(214,58,40,.5)');g.addColorStop(1,'rgba(150,34,24,0)');
      ctx.strokeStyle=g;ctx.shadowColor='rgba(255,74,47,.95)';ctx.shadowBlur=30*px;ctx.lineWidth=5*px;
      ctx.beginPath();ctx.moveTo(apex[0],apex[1]);ctx.lineTo(E[0],E[1]);ctx.stroke();
    });
    ctx.shadowBlur=0;
    // hot core at the bend
    const cg=ctx.createRadialGradient(apex[0],apex[1],0,apex[0],apex[1],150*px);
    cg.addColorStop(0,'rgba(255,236,226,1)');cg.addColorStop(1,'rgba(255,220,205,0)');
    ctx.strokeStyle=cg;ctx.lineWidth=1.8*px;ctx.beginPath();ctx.moveTo(E1[0],E1[1]);ctx.lineTo(apex[0],apex[1]);ctx.lineTo(E2[0],E2[1]);ctx.stroke();
    ctx.globalAlpha=1;
  }
  drawUI(inUI?Math.min(D_UI,t-T_UI)*UI_SPD:(reduced?D_UI*UI_SPD:-1), fadeK);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
root.addEventListener('hero-replay',function(){T0=performance.now();last=null;if(typeof onRestart==='function')onRestart()});
return {cam,AG,seek:s=>{T0=performance.now()-s*1000},freeze:s=>{FROZEN=s},T_LOOP,get t(){return (performance.now()-T0)/1000}};
}
ShadowHero.CSS=`
.fx.sh .chint{display:none}   /* no time label in the card (final pass) */
.fx.sh{position:absolute;left:16%;width:68%;top:50%;transform:translateY(-50%);pointer-events:none;opacity:0;
    --g1:#111;--g4:#2c2c2c;--white:#fff;--light2:#e2e2ea;--light:#a9a9b3;--cardamom:#1fb41f;--saffron:#d63a32;
    --fsans:"Host Grotesk Variable","Host Grotesk",-apple-system,"Helvetica Neue",Arial,sans-serif;--fmono:"IBM Plex Mono",ui-monospace,Menlo,monospace}
.fx.sh .ui{position:relative;border-radius:4px;display:grid;grid-template-columns:100%;grid-template-rows:auto 1fr auto;container-type:inline-size;color:var(--light2)}
.fx.sh .ui:before{content:"";grid-column:1;grid-row:1/4;padding-bottom:66.667%;pointer-events:none}
.fx.sh .cfill{position:absolute;inset:0;border-radius:4px;background:var(--g1);opacity:0}
.fx.sh .cdraw{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.fx.sh .cdraw rect{fill:none;stroke:var(--g4);stroke-width:1;stroke-dasharray:100;stroke-dashoffset:100}
.fx.sh .cdraw line{stroke:var(--g4);stroke-width:1;stroke-dasharray:100;stroke-dashoffset:100}
.fx.sh .ui>.ctop{grid-column:1;grid-row:1;padding:5.5cqw 6cqw 4cqw;display:flex;justify-content:space-between;align-items:baseline;gap:12px;position:relative}
.fx.sh .ui>.cbody{grid-column:1;grid-row:2;padding:3cqw 6cqw;display:flex;flex-direction:column;justify-content:center;position:relative}
.fx.sh .ui>.cfoot{grid-column:1;grid-row:3;padding:0 6cqw 6cqw;display:flex;position:relative}
.fx.sh .ctitle{display:flex;align-items:center;gap:2.2cqw;font:600 6cqw/1.1 var(--fsans);color:var(--white);white-space:nowrap}
.fx.sh .ctitle .dot{width:2.4cqw;height:2.4cqw;border-radius:50%;background:var(--cardamom);box-shadow:0 0 0 1cqw rgba(31,180,31,.18)}
.fx.sh .chint{font:400 max(9px,2.2cqw)/1 var(--fmono);letter-spacing:.08em;text-transform:uppercase;color:var(--light);white-space:nowrap}
.fx.sh .cnum{font:600 24cqw/1 var(--fsans);color:var(--saffron);letter-spacing:-.03em;font-variant-numeric:tabular-nums}
.fx.sh .csub{font:400 max(12px,4.2cqw)/1.3 var(--fsans);color:var(--light2);margin-top:2cqw}
.fx.sh .fbtn{display:flex;width:100%;justify-content:center;align-items:center;font:600 max(11px,3.6cqw)/1 var(--fmono);letter-spacing:.1em;text-transform:uppercase;padding:4.2cqw 5cqw;border-radius:3px;background:#2e2e2e;color:var(--white);border:1px solid #3a3a3a;white-space:nowrap}
.fx.sh [data-el]{opacity:0;transform:translateY(6px)}
canvas.stage{position:absolute;inset:0;width:100%;height:100%;display:block}`;
ShadowHero.HTML=`<canvas class="stage"></canvas>
<div class="fx sh"><div class="ui">
  <div class="cfill"></div>
  <svg class="cdraw" aria-hidden="true"><rect class="dr-frame" x="0.5" y="0.5" width="calc(100% - 1px)" height="calc(100% - 1px)" rx="4" pathLength="100"/><line class="dr-rule" x1="0" y1="0" x2="100%" y2="0" pathLength="100"/></svg>
  <div class="ctop"><span class="ctitle" data-el="0"><span class="dot"></span>Scan complete</span><span class="chint" data-el="1"><span class="ro">Read-only · </span>4 min 12 s</span></div>
  <div class="cbody"><div><div class="cnum" data-el="2">0</div><div class="csub" data-el="3">Unregistered Agents found running in your environment</div></div></div>
  <div class="cfoot"><span class="fbtn" data-el="4">Start registering agents</span></div>
</div></div>`;
;

/* ---- boot (production): mounts ShadowHero into [data-embed="shadow-hero"] once the DOM is ready. Replaces the prototype's review-only hero switch. ---- */
(function(){
  var CSS2='';
  function boot(){var host=document.querySelector('[data-embed="shadow-hero"]');if(!host||host.getAttribute('data-hero-mounted'))return;
    if(typeof ShadowHero!=='function')return;host.setAttribute('data-hero-mounted','1');var E=ShadowHero;
    var st=document.createElement('style');st.textContent=E.CSS+(CSS2?'\n'+CSS2:'');document.head.appendChild(st);
    host.innerHTML=E.HTML;E(host);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
