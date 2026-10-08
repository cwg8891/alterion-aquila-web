/* Alterion Solutions hero: estate (release solutions-v1, 2026-10-07).
   Engine code is verbatim from the approved prototype (alterion-solutions-hifi-v179-estate); stars stay visible and are 2x brighter;
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
  for(const s of STARS){ctx.globalAlpha=Math.min(0.9,s.b*2)*(0.6+0.4*Math.sin(t*s.sp+s.ph)*mo)*fadeK*dim;ctx.fillStyle='#EDEDEA';
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
/* prototype hero engines (from alterion-solutions-hifi-v29): UI fonts Host Grotesk, whole hero compressed to 2.0s */
/* ============ Shadow Agents hero engine (v7)
   Beat 1 · SCANNING: 30 tetrahedron agents in space (Aquila camera + stars); a left→right sweep draws a
   rectangle around every one of them over 1.5s while the orange progress bar fills.
   Beat 2 · the scan-result UI (shadow-faux-ui-v4) is drawn into existence: outline traces on, fill fades
   in behind, contents stagger, the 972 counts up.
   One instance per root element (root holds canvas.stage + .fx). ============ */
function ShadowHeroProto(root){
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
const T_IND=1.2, T_SCAN=1.4, D_SCAN=0.9, BOX_D=0.24, D_DONE=0.7, D_UI=2.2, D_UIHOLD=2.0, D_FADE=0.5;
const T_DONE=T_SCAN+D_SCAN, T_UI=T_DONE+D_DONE, T_UIHOLD=T_UI+D_UI, T_FADE=T_UIHOLD+D_UIHOLD, T_LOOP=T_FADE+D_FADE;
// sweep order: left → right by projected x, fixed at first frame so boxes don't reshuffle as agents drift
let ORDER=null;

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
  const dim=inUI?1-0.6*eoc((t-T_UI)/1.2):1;             // background recedes to 40% as the card draws in
  const sceneOp=fadeK*dim;
  const boxOp=(inUI?1-eoc((t-T_UI)/1.2):1)*fadeK;         // the scan rectangles fade out as the UI fades in

  for(const a of AG){ if(!mo)continue;
    a.vx+=(rnd()-0.5)*0.02;a.vy+=(rnd()-0.5)*0.02;a.vz+=(rnd()-0.5)*0.02;
    const sp=Math.hypot(a.vx,a.vy,a.vz),cap=0.06;if(sp>cap){a.vx*=cap/sp;a.vy*=cap/sp;a.vz*=cap/sp}
    a.x+=a.vx*dt*0.06;a.y+=a.vy*dt*0.06;a.z+=a.vz*dt*0.06;
    a.rot[0]+=a.w[0]*dt/1000;a.rot[1]+=a.w[1]*dt/1000;a.rot[2]+=a.w[2]*dt/1000;}

  // stars
  for(const s of STARS){ctx.globalAlpha=Math.min(0.9,s.b*2)*(0.6+0.4*Math.sin(t*s.sp+s.ph)*mo)*fadeK*dim;ctx.fillStyle='#EDEDEA';
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
  for(const g of drawn){
    const dz=cl((g.d-0.55)/0.6);
    ctx.strokeStyle=GREY;ctx.globalAlpha=g.k*(0.45+0.55*dz)*sceneOp;ctx.lineWidth=(1.0+0.6*dz)*px;ctx.lineJoin='round';ctx.lineCap='round';
    ctx.beginPath();for(const [i,j] of TE){ctx.moveTo(g.V[i][0],g.V[i][1]);ctx.lineTo(g.V[j][0],g.V[j][1])}ctx.stroke();
    let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const p of g.V){x0=Math.min(x0,p[0]);y0=Math.min(y0,p[1]);x1=Math.max(x1,p[0]);y1=Math.max(y1,p[1])}bounds[g.idx]=[x0,y0,x1,y1];
  }
  ctx.globalAlpha=1;

  // scan sweep: every agent gets a rectangle, left → right, over D_SCAN; each rectangle grows from its edge midpoints
  if(!ORDER&&Object.keys(bounds).length===N){ORDER=Object.keys(bounds).map(Number).sort((a,b)=>bounds[a][0]-bounds[b][0])}
  if(ORDER&&t>=T_SCAN){
    ORDER.forEach((idx,o)=>{const b=bounds[idx];if(!b)return;const st=T_SCAN+o*(D_SCAN-BOX_D)/(N-1);const k=reduced?1:eoc((t-st)/BOX_D);if(k<=0)return;
      const pad=6*px,[x0,y0,x1,y1]=[b[0]-pad,b[1]-pad,b[2]+pad,b[3]+pad];
      if(boxOp<=0.005)return;ctx.strokeStyle=GREEN;ctx.globalAlpha=0.8*boxOp;ctx.lineWidth=0.7*px;ctx.lineCap='butt';ctx.beginPath();
      for(const [ax,ay,bx,by] of [[x0,y0,x1,y0],[x1,y0,x1,y1],[x1,y1,x0,y1],[x0,y1,x0,y0]]){const mx=(ax+bx)/2,my=(ay+by)/2;ctx.moveTo(mx+(ax-mx)*k,my+(ay-my)*k);ctx.lineTo(mx+(bx-mx)*k,my+(by-my)*k)}
      ctx.stroke();});
    ctx.globalAlpha=1;
  }

  // indicator: SCANNING bottom-left + full-width orange progress bar (fills over the sweep)
  const ti=t-T_IND;
  if(ti>0||reduced){
    const age=ti*1000;const quiet=inUI?0.45:1;const op=(reduced?1:(age<260?((Math.floor(age/65)%2)?1:0.12):1))*fadeK*quiet;
    const fs=Math.round(13*px), M=32*px, y=H-40*px;
    ctx.font='500 '+fs+'px '+MONO;if('letterSpacing' in ctx)ctx.letterSpacing=(3*px)+'px';ctx.textBaseline='middle';ctx.textAlign='left';
    const done=t>=T_DONE;const txt=done?'SCAN COMPLETE':'SCANNING';
    ctx.fillStyle=done?GREEN:'#EDEDEA';ctx.globalAlpha=op;ctx.fillText(txt,M,y);
    const tw=ctx.measureText(txt).width+3*px, bx=M+tw+20*px, bw=W-M-bx;
    ctx.fillStyle=GREYD;ctx.fillRect(bx,y-1*px,bw,2*px);
    const pr=reduced?1:cl((t-T_SCAN)/D_SCAN);
    ctx.fillStyle=GREEN;ctx.fillRect(bx,y-1*px,bw*pr,2*px);
    if(pr>0&&pr<1){ctx.beginPath();ctx.arc(bx+bw*pr,y,2.5*px,0,6.283);ctx.fill()}
    ctx.globalAlpha=1;if('letterSpacing' in ctx)ctx.letterSpacing='0px';
  }
  drawUI(inUI?Math.min(D_UI,t-T_UI):(reduced?D_UI:-1), fadeK);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
root.addEventListener('hero-replay',function(){T0=performance.now();last=null;if(typeof onRestart==='function')onRestart()});
return {cam,AG,seek:s=>{T0=performance.now()-s*1000},freeze:s=>{FROZEN=s},T_LOOP,get t(){return (performance.now()-T0)/1000}};
}
ShadowHeroProto.CSS=`
.fx.sh{position:absolute;left:16%;width:68%;top:50%;transform:translateY(-50%);pointer-events:none;opacity:0;
    --g1:#111;--g4:#2c2c2c;--white:#fff;--light2:#e2e2ea;--light:#a9a9b3;--cardamom:#1fb41f;--saffron:#d63a32;
    --fsans:"Host Grotesk Variable",-apple-system,"Helvetica Neue",Arial,sans-serif;--fmono:"IBM Plex Mono",ui-monospace,Menlo,monospace}
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
ShadowHeroProto.HTML=`<canvas class="stage"></canvas>
<div class="fx sh"><div class="ui">
  <div class="cfill"></div>
  <svg class="cdraw" aria-hidden="true"><rect class="dr-frame" x="0.5" y="0.5" width="calc(100% - 1px)" height="calc(100% - 1px)" rx="4" pathLength="100"/><line class="dr-rule" x1="0" y1="0" x2="100%" y2="0" pathLength="100"/></svg>
  <div class="ctop"><span class="ctitle" data-el="0"><span class="dot"></span>Scan complete</span><span class="chint" data-el="1"><span class="ro">Read-only · </span>4 min 12 s</span></div>
  <div class="cbody"><div><div class="cnum" data-el="2">0</div><div class="csub" data-el="3">Unregistered Agents found running in your environment</div></div></div>
  <div class="cfoot"><span class="fbtn" data-el="4">Start registering agents</span></div>
</div></div>`;

/* ============ Secure Every Endpoint hero engine (v5)
   Same world as the Shadow Agents hero (Aquila camera + stars, 30 tetrahedron agents).
   Beat 1 · one agent is red from the start; the camera flies in and lands it bottom-left of the frame
            (same composition as the Risk hero); a rectangle draws around it.
   Beat 2 · a leader line runs from the box to the violation card (endpoint-faux-ui-v10), which draws in
            above and to the right: saffron outline traces on, fill fades in, contents stagger. Holds 2s, fades, loops.
   One instance per root element (root holds canvas.stage + .fx). ============ */
function EndpointHero(root){
const cv=root.querySelector('canvas.stage'), ctx=cv.getContext('2d');
const GREY='#8E8B86', RED='#FF4436', GREEN='#47D553', BOX='#DDD9D2', MONO="'IBM Plex Mono', ui-monospace, monospace";
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let seed=2024; const rnd=()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
function hex(h){return [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]}
function mix(a,b,t){const A=hex(a),B=hex(b);return 'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(',')+')'}
const cl=u=>u<0?0:u>1?1:u, eoc=u=>1-Math.pow(1-cl(u),3), yank=u=>1-Math.pow(1-cl(u),5), lerp=(a,b,t)=>a+(b-a)*t;

// ---------- camera (Aquila: perspective, yaw/pitch, F/D)
const CFG={F:1480,D:1650};
const cam={yaw:-32*Math.PI/180,pitch:9,cx:0.5,cy:0.5,zoom:1,tx:0,ty:0,tz:0};
let W=1,H=1,px=1;
function proj(x,y,z){
  x-=cam.tx;y-=cam.ty;z-=cam.tz;
  const cy=Math.cos(cam.yaw),sy=Math.sin(cam.yaw),cp=Math.cos(cam.pitch*Math.PI/180),sp=Math.sin(cam.pitch*Math.PI/180);
  const xr=x*cy+z*sy, zr=-x*sy+z*cy, yr=y*cp-zr*sp, z2=y*sp+zr*cp;
  const s=CFG.F/(CFG.D-z2)*cam.zoom*(W/810);
  return [W*cam.cx+xr*s, H*cam.cy-yr*s, s];
}
// ---------- stars
const STARS=[];for(let i=0;i<95;i++)STARS.push({x:rnd(),y:rnd(),r:0.5+rnd()*0.9,b:0.10+rnd()*0.30,sp:0.5+rnd()*1.4,ph:rnd()*6.283,d:0.15+rnd()*0.5});

// ---------- agents
const N=30, AG=[];
const TV=[[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]].map(v=>v.map(c=>c/Math.sqrt(3)));
const TE=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
for(let i=0;i<N;i++){const gx=(i%6)/6, gy=Math.floor(i/6)/5;
  AG.push({x:(gx-0.5+rnd()*0.16)*820, y:(gy-0.5+rnd()*0.2)*600, z:(rnd()-0.5)*420, r:15+rnd()*5,
           rot:[rnd()*6.283,rnd()*6.283,rnd()*6.283], w:[0.12+rnd()*0.18,0.1+rnd()*0.15,0.08+rnd()*0.12].map(v=>v*(rnd()<0.5?-1:1)),
           vx:0,vy:0,vz:0,t0:0.1+rnd()*1.0});}
const TARGET=15;                   // the agent the camera flies to (middle of the field)
AG[TARGET].z=Math.max(AG[TARGET].z,40);   // keep it in front of its neighbours
function rot3(v,a){let [x,y,z]=v;const [ax,ay,az]=a;
  let y2=y*Math.cos(ax)-z*Math.sin(ax),z2=y*Math.sin(ax)+z*Math.cos(ax);y=y2;z=z2;
  let x2=x*Math.cos(ay)+z*Math.sin(ay);z2=-x*Math.sin(ay)+z*Math.cos(ay);x=x2;z=z2;
  x2=x*Math.cos(az)-y*Math.sin(az);y2=x*Math.sin(az)+y*Math.cos(az);return [x2,y2,z];}

// ---------- timeline (seconds)
const T_IN=1.5, D_IN=0.8, D_BOX=0.45, T_LABEL=T_IN+D_IN+0.3, D_HOLD=1.0, D_UI=2.2, D_UIHOLD=2.0, D_FADE=0.5;
const T_BOX=T_IN+D_IN, T_UI=T_BOX+D_BOX+D_HOLD, T_UIHOLD=T_UI+D_UI, T_FADE=T_UIHOLD+D_UIHOLD, T_LOOP=T_FADE+D_FADE;
const TK=T_UIHOLD/2;   // whole hero compressed to 2.0s
const ZOOM_IN=2.6, CX_IN=0.19, CY_IN=0.82;   // same landing spot as the Risk hero: agent bottom-left, card above-right

// ---------- Beat 2 DOM: the violation card (endpoint-faux-ui-v10) in a shadow root, with draw-in layers on top
const FX=root.querySelector('.fx'), SR=FX.attachShadow({mode:'open'});
SR.innerHTML='<style>'+EndpointHero.CARD_CSS+EndpointHero.DRAW_CSS+'</style>'+EndpointHero.CARD_HTML;
const UI=SR.querySelector('.ui'); UI.style.position='relative'; UI.style.background='transparent'; UI.style.borderColor='transparent';
UI.insertAdjacentHTML('beforeend','<div class="foot"><span class="qbtn">Quarantine agent</span></div>');   // the card's one action
UI.insertAdjacentHTML('afterbegin','<div class="dr-fill"></div><svg class="dr-draw" aria-hidden="true"><rect class="dr-frame" x="0.5" y="0.5" width="calc(100% - 1px)" height="calc(100% - 1px)" rx="4" pathLength="100"/><line class="dr-rule" x1="0" y1="0" x2="100%" y2="0" pathLength="100"/></svg>');
const FR=SR.querySelector('.dr-frame'), RL=SR.querySelector('.dr-rule'), FILL=SR.querySelector('.dr-fill'), TOP=SR.querySelector('.top');
TOP.style.borderBottomColor='transparent';
const ELS=[SR.querySelector('.st'),SR.querySelector('.nm'),SR.querySelector('.ctl')].concat([].slice.call(SR.querySelectorAll('.r'))).concat([SR.querySelector('.foot')]);
ELS.forEach(el=>{el.style.opacity=0;el.style.transform='translateY(6px)';el.style.position='relative'});
const EL_D=[0.95,1.1,1.3,1.5,1.65,1.85];
function drawUI(tu,fadeOp){
  if(tu<0){FX.style.opacity=0;return}
  FX.style.opacity=fadeOp;
  const k=reduced?1:eoc(tu/0.75); FR.style.strokeDashoffset=100-100*k;
  const kr=reduced?1:eoc((tu-0.45)/0.5); RL.style.strokeDashoffset=100-100*kr;
  FILL.style.opacity=reduced?1:eoc((tu-0.35)/0.52);
  ELS.forEach((el,i)=>{const e=reduced?1:eoc((tu-EL_D[i])/0.42);el.style.opacity=e;el.style.transform='translateY('+(6*(1-e))+'px)'});
  const h=TOP.offsetHeight; RL.setAttribute('y1',h);RL.setAttribute('y2',h);
}

// ---------- frame
let last=null,T0=performance.now(),FROZEN=null,HID=false;
function frame(ts){
  const r=cv.getBoundingClientRect();px=devicePixelRatio||1;
  W=Math.max(1,Math.round(r.width*px));H=Math.max(1,Math.round(r.height*px));
  if(!r.width){HID=true;requestAnimationFrame(frame);return}
  if(HID){HID=false;T0=ts;last=ts;if(typeof onRestart==='function')onRestart()}   // restart each time the page is shown
  if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H}
  if(last===null)last=ts;const dt=Math.min(50,ts-last);last=ts;
  let t=Math.min(FROZEN!==null?FROZEN:(ts-T0)/1000*TK,T_UIHOLD);   // plays once and stops on the card (Replay restarts it)
  const mo=reduced?0:1;
  ctx.clearRect(0,0,W,H);
  cam.yaw=(-32+1.0*Math.sin(t*6.283/14)*mo)*Math.PI/180;
  const inUI=t>=T_UI, fadeK=t>=T_FADE?1-eoc((t-T_FADE)/D_FADE):1;
  const dim=inUI?1-0.6*eoc((t-T_UI)/1.2):1;             // background recedes to 40% as the card draws in
  const boxOp=(inUI?1-eoc((t-T_UI)/1.2):1)*fadeK;

  // drift + tumble (the target agent holds still once the camera arrives, so the box and label stay put)
  AG.forEach((a,i)=>{ if(!mo)return; const still=(i===TARGET&&t>=T_IN);
    if(!still){a.vx+=(rnd()-0.5)*0.02;a.vy+=(rnd()-0.5)*0.02;a.vz+=(rnd()-0.5)*0.02;
      const sp=Math.hypot(a.vx,a.vy,a.vz),cap=0.06;if(sp>cap){a.vx*=cap/sp;a.vy*=cap/sp;a.vz*=cap/sp}
      a.x+=a.vx*dt*0.06;a.y+=a.vy*dt*0.06;a.z+=a.vz*dt*0.06;}
    const ws=still?0.35:1;a.rot[0]+=a.w[0]*dt/1000*ws;a.rot[1]+=a.w[1]*dt/1000*ws;a.rot[2]+=a.w[2]*dt/1000*ws;});

  // camera: fly in on the target (quintic yank), then hold
  const A=AG[TARGET];
  const narrow=W/px<600, ZI=narrow?2.0:ZOOM_IN, CXI=narrow?0.12:CX_IN, CYI=narrow?0.56:CY_IN;
  if(reduced){cam.tx=A.x;cam.ty=A.y;cam.tz=A.z;cam.zoom=ZI;cam.cx=CXI;cam.cy=CYI}
  else if(t<T_IN){cam.tx=0;cam.ty=0;cam.tz=0;cam.zoom=1;cam.cx=0.5;cam.cy=0.5}
  else{const e=yank((t-T_IN)/D_IN);cam.tx=lerp(0,A.x,e);cam.ty=lerp(0,A.y,e);cam.tz=lerp(0,A.z,e);cam.zoom=lerp(1,ZI,e);cam.cx=lerp(0.5,CXI,e);cam.cy=lerp(0.5,CYI,e)}

  // stars: parallax against the camera target, scale gently with zoom
  const zf=1+(cam.zoom-1)*0.06;
  for(const s of STARS){ctx.globalAlpha=Math.min(0.9,s.b*2)*(0.6+0.4*Math.sin(t*s.sp+s.ph)*mo)*fadeK*dim;ctx.fillStyle='#EDEDEA';
    const sx=(s.x-0.5)*zf+0.5-cam.tx*0.00035*s.d, sy=(s.y-0.5)*zf+0.5+cam.ty*0.00035*s.d;
    ctx.beginPath();ctx.arc(sx*W,sy*H,s.r*px,0,6.283);ctx.fill();}
  ctx.globalAlpha=1;

  // agents
  const drawn=[];
  AG.forEach((a,idx)=>{const k=1;const pop=1;   // already on screen at t=0
    const V=TV.map(v=>{const q=rot3(v,a.rot);return proj(a.x+q[0]*a.r*pop,a.y+q[1]*a.r*pop,a.z+q[2]*a.r*pop)});
    drawn.push({V,k,idx,d:V.reduce((s,p)=>s+p[2],0)/4});});
  drawn.sort((p,q)=>p.d-q.d);
  let tb=null;
  for(const g of drawn){const dz=cl((g.d/cam.zoom-0.55)/0.6);
    const redK=g.idx===TARGET?1:0;   // the offending agent is red from the start
    ctx.strokeStyle=redK>0?mix(GREY,RED,redK):GREY;ctx.globalAlpha=g.idx===TARGET?fadeK:g.k*(0.45+0.55*dz)*fadeK*dim;ctx.lineWidth=(1.0+0.6*dz)*px*Math.min(1.6,Math.sqrt(cam.zoom))*(g.idx===TARGET?2.1:1);ctx.lineJoin='round';ctx.lineCap='round';
    ctx.beginPath();for(const [i,j] of TE){ctx.moveTo(g.V[i][0],g.V[i][1]);ctx.lineTo(g.V[j][0],g.V[j][1])}ctx.stroke();
    if(g.idx===TARGET){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const p of g.V){x0=Math.min(x0,p[0]);y0=Math.min(y0,p[1]);x1=Math.max(x1,p[0]);y1=Math.max(y1,p[1])}tb=[x0,y0,x1,y1]}}
  ctx.globalAlpha=1;ctx.lineCap='butt';

  // the box around the target (edges grow from midpoints); it stays, a little quieter, once the card is up
  const boxK=(inUI?1-0.4*eoc((t-T_UI)/1.2):1)*fadeK;
  let bx1=null;
  if(tb&&t>=T_BOX&&boxK>0.005){const k=reduced?1:eoc((t-T_BOX)/D_BOX), pad=14*px;
    const [x0,y0,x1,y1]=[tb[0]-pad,tb[1]-pad,tb[2]+pad,tb[3]+pad];bx1=[x1,(y0+y1)/2];
    ctx.strokeStyle=GREEN;ctx.globalAlpha=0.95*boxK;ctx.lineWidth=1.2*px;ctx.beginPath();
    for(const [ax,ay,bx,by] of [[x0,y0,x1,y0],[x1,y0,x1,y1],[x1,y1,x0,y1],[x0,y1,x0,y0]]){const mx=(ax+bx)/2,my=(ay+by)/2;ctx.moveTo(mx+(ax-mx)*k,my+(ay-my)*k);ctx.lineTo(mx+(bx-mx)*k,my+(by-my)*k)}
    ctx.stroke();ctx.globalAlpha=1}
  // leader line: box → horizontal → 45° jog → into the card's left edge (draws on as the card starts)
  const tagK=reduced?1:eoc((t-T_UI+0.15)/0.45);
  if(bx1&&tagK>0){const fr=FX.getBoundingClientRect(), hr=root.getBoundingClientRect();const R=[(fr.left-hr.left)*px,(fr.top-hr.top)*px,fr.width*px,fr.height*px];
    const [ax,ay]=bx1, ex=R[0], ey=Math.min(R[1]+R[3]-10*px,ay-30*px), jog=Math.abs(ey-ay);let xk=ex-jog-14*px;if(xk<ax+10*px)xk=ax+10*px;
    const seg=[[ax,ay],[xk,ay],[Math.min(xk+jog,ex-6*px),ey],[ex-2*px,ey]];const lens=seg.slice(1).map((p,i)=>Math.hypot(p[0]-seg[i][0],p[1]-seg[i][1]));const tot=lens.reduce((a,b)=>a+b,0);let rem=tot*tagK;
    ctx.strokeStyle=GREY;ctx.lineWidth=0.9*px;ctx.globalAlpha=tagK*fadeK;ctx.beginPath();ctx.moveTo(ax,ay);
    for(let i=1;i<seg.length&&rem>0;i++){const l=lens[i-1];const q=Math.min(1,rem/l);ctx.lineTo(seg[i-1][0]+(seg[i][0]-seg[i-1][0])*q,seg[i-1][1]+(seg[i][1]-seg[i-1][1])*q);rem-=l}
    ctx.stroke();ctx.fillStyle=GREY;ctx.beginPath();ctx.arc(ax,ay,1.8*px,0,6.283);ctx.fill();ctx.globalAlpha=1}

  drawUI(inUI?Math.min(D_UI,t-T_UI):(reduced?D_UI:-1), fadeK);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
root.addEventListener('hero-replay',function(){T0=performance.now();last=null;if(typeof onRestart==='function')onRestart()});
return {cam,AG,seek:s=>{T0=performance.now()-s*1000},freeze:s=>{FROZEN=s},T_LOOP,get t(){return (performance.now()-T0)/1000}};
}
EndpointHero.DRAW_CSS=`
.dr-fill{position:absolute;inset:0;border-radius:4px;background:#141414;opacity:0}
.dr-draw{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.dr-draw rect{fill:none;stroke:var(--saffron);stroke-width:1;stroke-dasharray:100;stroke-dashoffset:100}
.dr-draw line{stroke:#262626;stroke-width:1;stroke-dasharray:100;stroke-dashoffset:100}
*,*:before,*:after{box-sizing:border-box}
.ui>.top,.ui>.body{position:relative}
.ui{aspect-ratio:auto;grid-template-rows:auto auto auto}
.body{padding:1.6cqw 6cqw 1.2cqw}
.foot{position:relative;padding:1.2cqw 6cqw 5.4cqw}
.qbtn{display:flex;width:100%;justify-content:center;align-items:center;font:600 max(11px,3.6cqw)/1 var(--mono);letter-spacing:.1em;text-transform:uppercase;padding:4.2cqw 5cqw;border-radius:3px;background:#2e2e2e;color:#fff;border:1px solid #3a3a3a;white-space:nowrap}`;
EndpointHero.CSS=`
.fx.ep{position:absolute;left:31%;width:64%;top:6%;transform:none;pointer-events:none;opacity:0}
canvas.stage{position:absolute;inset:0;width:100%;height:100%;display:block}`;
EndpointHero.HTML=`<canvas class="stage"></canvas><div class="fx ep"></div>`;
EndpointHero.CARD_CSS="  :host{--g4:#2c2c2c;--white:#fff;--light2:#e2e2ea;--light:#a9a9b3;--saffron:#d63a32;\n        --sans:\"Host Grotesk Variable\",-apple-system,\"Helvetica Neue\",Arial,sans-serif;--mono:\"IBM Plex Mono\",ui-monospace,Menlo,monospace}\n  .ui{width:100%;aspect-ratio:3/2;background:#141414;border:1px solid var(--saffron);border-radius:4px;overflow:hidden;container-type:inline-size;display:grid;grid-template-rows:auto 1fr}\n  .top{padding:5.4cqw 6cqw 4.4cqw;border-bottom:1px solid #262626}\n  .st{display:flex;align-items:center;gap:1.8cqw;font:500 max(9px,2.6cqw)/1 var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--light2)}\n  .st i{width:1.8cqw;height:1.8cqw;min-width:6px;min-height:6px;border-radius:50%;background:var(--saffron)}\n  .nm{display:flex;align-items:center;gap:2.2cqw;margin-top:2.6cqw;font:600 max(15px,5.6cqw)/1.1 var(--mono);color:var(--white);white-space:nowrap}\n  .nm .g{width:5.4cqw;height:5.4cqw;flex:none} .nm .g svg{width:100%;height:100%;display:block}\n  .body{display:flex;flex-direction:column;justify-content:center;padding:1.6cqw 6cqw 4cqw}\n  .ctl{display:flex;flex-direction:column;gap:1.4cqw;padding:3cqw 0}\n  .ctl span,.r span{font:400 max(9px,2.5cqw)/1.2 var(--mono);letter-spacing:.1em;text-transform:uppercase;color:var(--light)}\n  .ctl b{font:600 max(14px,5cqw)/1.15 var(--sans);color:var(--saffron)}\n  .r{display:flex;justify-content:space-between;align-items:baseline;gap:3cqw;padding:2.6cqw 0;border-top:1px solid #262626}\n  .r b{font:500 max(12px,3.8cqw)/1.2 var(--sans);color:var(--light2);white-space:nowrap}\n  .r b.dev{display:flex;align-items:center;gap:1.6cqw}\n  .r b.dev .lap{width:4.2cqw;height:4.2cqw;min-width:14px;min-height:14px;flex:none}\n:host{display:block;font:15px/1.5 var(--sans);color:var(--white);-webkit-font-smoothing:antialiased}\n";
EndpointHero.CARD_HTML="<div class=\"ui\">\n  <div class=\"top\">\n    <div class=\"st\"><i></i>Violation</div>\n    <div class=\"nm\"><span class=\"g\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#d63a32\" stroke-width=\"1.6\" stroke-linejoin=\"round\"><path d=\"M5 5 L20 12 L5 19 L9 12 Z\"/></svg></span>chatgpt-desktop</div>\n  </div>\n  <div class=\"body\">\n    <div class=\"ctl\"><span>Control broken</span><b>Prevent Data Exfiltration</b></div>\n    <div class=\"r\"><span>Endpoint</span><b class=\"dev\"><svg class=\"lap\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#a9a9b3\" stroke-width=\"1.6\" stroke-linejoin=\"round\"><rect x=\"4.5\" y=\"5\" width=\"15\" height=\"10\" rx=\"1\"/><path d=\"M2.5 18.5h19\"/></svg>Margaret C\u2019s Laptop</b></div>\n    <div class=\"r\"><span>State</span><b>Blocked</b></div>\n  </div>\n</div>";


/* ============ Control Your Entire Agent Estate hero engine (v1)
   Same world as the other solution heroes (Aquila camera + stars, 30 tetrahedron agents).
   Beat 1 · agents fade in fast and drift agitated; the "Prevent Data Exfiltration" control card
            (picks v8) draws in and holds.
   Beat 2 · Apply control is pressed (brief pressed state); the card fades out; every agent snaps
            into one even ring and orbits together, turning orange (Draco beat 3); a headline appears
            in the center. Plays once and holds.
   The card lives in a shadow root (its own CSS from the picks file), so nothing on the page can restyle it. ============ */
function EstateHero(root){
const cv=root.querySelector('canvas.stage'), ctx=cv.getContext('2d');
const GREY='#8E8B86', OR='#D24A2F', INK='#EDEDEA', MONO="'IBM Plex Mono', ui-monospace, monospace", SANS="'Host Grotesk', 'Host Grotesk Variable', Arial, sans-serif";
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let seed=777; const rnd=()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const cl=u=>u<0?0:u>1?1:u, eoc=u=>1-Math.pow(1-cl(u),3), lerp=(a,b,t)=>a+(b-a)*t;
function hex(h){return [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]}
function mix(a,b,t){const A=hex(a),B=hex(b);return 'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(',')+')'}

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
// ---------- stars
const STARS=[];for(let i=0;i<95;i++)STARS.push({x:rnd(),y:rnd(),r:0.5+rnd()*0.9,b:0.10+rnd()*0.30,sp:0.5+rnd()*1.4,ph:rnd()*6.283});

// ---------- agents: 30, agitated until the control is applied
const N=30, AG=[];
const TV=[[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]].map(v=>v.map(c=>c/Math.sqrt(3)));
const TE=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
for(let i=0;i<N;i++){const gx=(i%6)/6, gy=Math.floor(i/6)/5;
  AG.push({x:(gx-0.5+rnd()*0.16)*820, y:(gy-0.5+rnd()*0.2)*470, z:(rnd()-0.5)*420, r:15+rnd()*5,
           rot:[rnd()*6.283,rnd()*6.283,rnd()*6.283], w:[0.12+rnd()*0.18,0.1+rnd()*0.15,0.08+rnd()*0.12].map(v=>v*(rnd()<0.5?-1:1)),
           vx:(rnd()-0.5)*0.2,vy:(rnd()-0.5)*0.2,vz:(rnd()-0.5)*0.1,t0:rnd()*0.45, ang:0, sx:0,sy:0,sz:0});}
// agents start scattered at random across the frame (and re-scatter on every replay), then snap into the ring
function scatter(a){a.x=(rnd()-0.5)*820;a.y=(rnd()-0.5)*470;a.z=(rnd()-0.5)*420;a.vx=(rnd()-0.5)*0.2;a.vy=(rnd()-0.5)*0.2;a.vz=(rnd()-0.5)*0.1;a.rot=[rnd()*6.283,rnd()*6.283,rnd()*6.283]}
AG.forEach(scatter);
function rot3(v,a){let [x,y,z]=v;const [ax,ay,az]=a;
  let y2=y*Math.cos(ax)-z*Math.sin(ax),z2=y*Math.sin(ax)+z*Math.cos(ax);y=y2;z=z2;
  let x2=x*Math.cos(ay)+z*Math.sin(ay);z2=-x*Math.sin(ay)+z*Math.cos(ay);x=x2;z=z2;
  x2=x*Math.cos(az)-y*Math.sin(az);y2=x*Math.sin(az)+y*Math.cos(az);return [x2,y2,z];}

// ---------- timeline (seconds)
const T_UI=0.15, D_UI=2.2, T_PRESS=0.15+2.2+2.6, D_PRESS=0.28, T_OUT=T_PRESS+0.3, D_OUT=0.5, T_RING=T_PRESS+0.35, D_RING=1.1, D_COL=1.2, T_HEAD=T_RING+0.9, T_END=T_HEAD+0.8;
const TK=T_END/2;   // whole hero compressed to 2.0s
const RING_R=420, ORBIT=0.16*1.5;   // Draco: ring radius 36 (of 100) → ~300 of our 820-wide field; 1.5× orbit speed once governed

// ---------- Beat 1 DOM: the control card in a shadow root, with the draw-in layers added on top
const FX=root.querySelector('.fx'), SR=FX.attachShadow({mode:'open'});
SR.innerHTML='<style>'+EstateHero.CARD_CSS+EstateHero.DRAW_CSS+'</style>'+EstateHero.CARD_HTML;
const UI=SR.querySelector('.p-ui'); UI.style.position='relative'; UI.style.background='transparent'; UI.style.borderColor='transparent';
UI.insertAdjacentHTML('afterbegin','<div class="dr-fill"></div><svg class="dr-draw" aria-hidden="true"><rect class="dr-frame" x="0.5" y="0.5" width="calc(100% - 1px)" height="calc(100% - 1px)" rx="4" pathLength="100"/><line class="dr-rule" x1="0" y1="0" x2="100%" y2="0" pathLength="100"/></svg>');
const FR=SR.querySelector('.dr-frame'), RL=SR.querySelector('.dr-rule'), FILL=SR.querySelector('.dr-fill'), TOP=SR.querySelector('.p-top'), BTN=SR.querySelector('.p-btn');
TOP.style.borderBottomColor='transparent';   // the rule is drawn in by the svg line instead
const ELS=[SR.querySelector('.p-crumb'),SR.querySelector('.p-title'),SR.querySelectorAll('.p-panel')[0],SR.querySelectorAll('.p-panel')[1],BTN];
ELS.forEach(el=>{el.style.opacity=0;el.style.transform='translateY(6px)';el.style.position='relative'});
const EL_D=[0.95,1.05,1.3,1.45,1.7];
function drawUI(tu,fadeOp){
  if(tu<0){FX.style.opacity=0;return}
  FX.style.opacity=fadeOp;
  const k=reduced?1:eoc(tu/0.75); FR.style.strokeDashoffset=100-100*k;
  const kr=reduced?1:eoc((tu-0.45)/0.5); RL.style.strokeDashoffset=100-100*kr;
  FILL.style.opacity=reduced?1:eoc((tu-0.35)/0.52);
  ELS.forEach((el,i)=>{const e=reduced?1:eoc((tu-EL_D[i])/0.42);el.style.opacity=e;el.style.transform='translateY('+(6*(1-e))+'px)'});
  const h=TOP.offsetHeight; RL.setAttribute('y1',h);RL.setAttribute('y2',h);
}

// ---------- frame
let last=null,T0=performance.now(),FROZEN=null,ringSet=false,HID=false;
function onRestart(){ringSet=false;AG.forEach(scatter)}
function frame(ts){
  const r=cv.getBoundingClientRect();px=devicePixelRatio||1;
  W=Math.max(1,Math.round(r.width*px));H=Math.max(1,Math.round(r.height*px));
  if(!r.width){HID=true;requestAnimationFrame(frame);return}
  if(HID){HID=false;T0=ts;last=ts;if(typeof onRestart==='function')onRestart()}   // restart each time the page is shown
  if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H}
  if(last===null)last=ts;const dt=Math.min(50,ts-last);last=ts;
  let t=FROZEN!==null?FROZEN:(ts-T0)/1000; if(t>T_END+2)t=T_END+2+((ts-T0)/1000-T_END-2)*0; // clock keeps running for orbit; scene state holds
  let tt=FROZEN!==null?FROZEN:(ts-T0)/1000*TK;
  cv.style.opacity=1;   // plays once and stops on the ring (Replay restarts it)
  const mo=reduced?0:1;
  ctx.clearRect(0,0,W,H);
  cam.yaw=(-32+1.0*Math.sin(tt*6.283/14)*mo)*Math.PI/180;
  const ringK=reduced?1:eoc((tt-T_RING)/D_RING), colK=reduced?1:eoc((tt-T_RING)/D_COL), governed=tt>=T_RING;

  // ---- agents: agitated brownian before the control; snap to an even ring after
  if(governed&&!ringSet){ringSet=true;AG.forEach((a,i)=>{a.sx=a.x;a.sy=a.y;a.sz=a.z;a.ang=i/N*6.283})}
  AG.forEach((a,i)=>{ if(!mo)return;
    if(!governed){
      a.vx+=(rnd()-0.5)*0.05;a.vy+=(rnd()-0.5)*0.05;a.vz+=(rnd()-0.5)*0.03;
      const sp=Math.hypot(a.vx,a.vy,a.vz),cap=0.16;if(sp>cap){a.vx*=cap/sp;a.vy*=cap/sp;a.vz*=cap/sp}
      a.x+=a.vx*dt*0.06;a.y+=a.vy*dt*0.06;a.z+=a.vz*dt*0.06;
      // keep the swarm in frame
      if(Math.abs(a.x)>430)a.vx*=-1;if(Math.abs(a.y)>250)a.vy*=-1;if(Math.abs(a.z)>230)a.vz*=-1;
      a.rot[0]+=a.w[0]*dt/1000*2.6;a.rot[1]+=a.w[1]*dt/1000*2.6;a.rot[2]+=a.w[2]*dt/1000*2.6;
    }else{
      a.ang+=ORBIT*dt/1000;
      const rx=Math.cos(a.ang)*RING_R, ry=Math.sin(a.ang)*RING_R*0.62, rz=Math.sin(a.ang)*RING_R*0.45;   // a tilted ring, like Draco's belt
      a.x=lerp(a.sx,rx,ringK);a.y=lerp(a.sy,ry,ringK);a.z=lerp(a.sz,rz,ringK);
      const ws=lerp(2.6,0.9,ringK);a.rot[0]+=a.w[0]*dt/1000*ws;a.rot[1]+=a.w[1]*dt/1000*ws;a.rot[2]+=a.w[2]*dt/1000*ws;
    }});

  // ---- stars
  for(const s of STARS){ctx.globalAlpha=Math.min(0.9,s.b*2)*(0.6+0.4*Math.sin(tt*s.sp+s.ph)*mo);ctx.fillStyle=INK;ctx.beginPath();ctx.arc(s.x*W,s.y*H,s.r*px,0,6.283);ctx.fill()}
  ctx.globalAlpha=1;

  // ---- agents (drawn far → near)
  const drawn=[];
  AG.forEach((a,idx)=>{const k=1,pop=1;   // agents are already on screen at t=0 (no fade/pop-in on this hero)
    const V=TV.map(v=>{const q=rot3(v,a.rot);return proj(a.x+q[0]*a.r*pop,a.y+q[1]*a.r*pop,a.z+q[2]*a.r*pop)});
    drawn.push({V,k,d:V.reduce((s,p)=>s+p[2],0)/4});});
  drawn.sort((p,q)=>p.d-q.d);
  const col=mix(GREY,OR,colK);
  for(const g of drawn){const dz=cl((g.d-0.55)/0.6);
    ctx.strokeStyle=col;ctx.globalAlpha=g.k*(0.45+0.55*dz);ctx.lineWidth=(1.0+0.6*dz)*px;ctx.lineJoin='round';ctx.lineCap='round';
    ctx.beginPath();for(const [i,j] of TE){ctx.moveTo(g.V[i][0],g.V[i][1]);ctx.lineTo(g.V[j][0],g.V[j][1])}ctx.stroke();}
  ctx.globalAlpha=1;ctx.lineCap='butt';

  // ---- headline in the center once the ring has formed
  const hk=reduced?1:eoc((tt-T_HEAD)/0.5);
  if(hk>0){ctx.textAlign='center';ctx.textBaseline='middle';ctx.globalAlpha=hk;
    ctx.font='500 '+Math.round(12*px)+'px '+MONO;if('letterSpacing' in ctx)ctx.letterSpacing=(3*px)+'px';ctx.fillStyle=OR;
    ctx.fillText('CONTROL APPLIED',W/2,H/2-0.035*W+(1-hk)*6*px);
    if('letterSpacing' in ctx)ctx.letterSpacing='0px';
    ctx.font='300 '+Math.round(W*0.04)+'px '+SANS;ctx.fillStyle=INK;
    ctx.fillText('One policy. Every agent.',W/2,H/2+0.01*W+(1-hk)*6*px);
    ctx.globalAlpha=1}

  // ---- card: draws in, holds, button presses, fades out
  const pressed=tt>=T_PRESS&&tt<T_PRESS+D_PRESS;
  BTN.style.transform=pressed?'scale(0.965)':'';BTN.style.background=pressed?'#161616':'';BTN.style.borderColor=pressed?'#262626':'';
  const outK=tt>=T_OUT?1-eoc((tt-T_OUT)/D_OUT):1;
  drawUI(tt>=T_UI?Math.min(D_UI,tt-T_UI):(reduced?D_UI:-1), reduced?0:outK);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
root.addEventListener('hero-replay',function(){T0=performance.now();last=null;if(typeof onRestart==='function')onRestart()});
return {cam,AG,seek:s=>{T0=performance.now()-s*1000},freeze:s=>{FROZEN=s},get t(){return (performance.now()-T0)/1000}};
}
EstateHero.DRAW_CSS=`
.dr-fill{position:absolute;inset:0;border-radius:4px;background:var(--g1);opacity:0}
.dr-draw{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.dr-draw rect{fill:none;stroke:var(--g4);stroke-width:1;stroke-dasharray:100;stroke-dashoffset:100}
.dr-draw line{stroke:var(--g4);stroke-width:1;stroke-dasharray:100;stroke-dashoffset:100}
.p-ui>.p-top,.p-ui>.p-body,.p-ui>.p-foot{position:relative}
.p-btn{transition:transform .12s,background .12s}`;
EstateHero.CSS=`
.fx.es{position:absolute;left:16%;width:68%;top:50%;transform:translateY(-50%);pointer-events:none;opacity:0}
canvas.stage{position:absolute;inset:0;width:100%;height:100%;display:block}`;
EstateHero.HTML=`<canvas class="stage"></canvas><div class="fx es"></div>`;

EstateHero.CARD_CSS="\n  :host{\n    /* neutrals from the system */\n    --bg:#000; --g1:#111111; --g2:#181818; --g3:#232323; --g4:#2c2c2c; --g5:#444444;\n    --white:#ffffff; --light2:#e2e2ea; --light:#a9a9b3;\n    /* primary */\n    --cardamom:#1fb41f; --turmeric:#c9931f; --saffron:#d63a32; --paprika:#d4641e;\n    /* secondary */\n    --moon:#c8b59b; --blue2:#3b6fc6; --blue1:#2b5aa6;\n    --sans:\"Host Grotesk Variable\",-apple-system,BlinkMacSystemFont,\"Helvetica Neue\",Arial,sans-serif;\n    --mono:\"IBM Plex Mono\",ui-monospace,\"SF Mono\",Menlo,monospace;\n  }\n  *{box-sizing:border-box}\n\n  header.page{max-width:1120px;margin:0 auto 36px}\n  header.page h1{font:600 32px/1.15 var(--sans);margin:0 0 8px;color:var(--white)}\n  header.page p{margin:0;color:var(--light);max-width:680px}\n  .grid{max-width:1120px;margin:0 auto;display:grid;grid-template-columns:repeat(2,1fr);gap:40px 32px}\n  @media (max-width:820px){.grid{grid-template-columns:1fr}body{padding:24px 16px 56px}}\n\n  .sol .meta{display:flex;justify-content:space-between;gap:12px;font:500 11px/1 var(--mono);color:var(--light);letter-spacing:.06em;text-transform:uppercase;margin-bottom:10px}\n  .sol h2{font:600 20px/1.25 var(--sans);margin:0 0 4px;color:var(--white)}\n  .sol .sub{color:var(--light);font-size:14px;margin:0 0 16px}\n  .sol .sub b{color:var(--white);font-weight:500}\n\n  /* ---------- frame: 3:2 minimum ---------- */\n  .ui{width:100%;background:var(--g1);border:1px solid var(--g4);border-radius:4px;overflow:hidden;\n      display:grid;grid-template-columns:100%;grid-template-rows:auto 1fr auto;font:13px/1.4 var(--sans);color:var(--light2);container-type:inline-size}\n  .ui:before{content:\"\";grid-column:1;grid-row:1/4;padding-bottom:66.667%;pointer-events:none}\n  .ui>.top{grid-column:1;grid-row:1;padding:14px 18px 10px;display:flex;justify-content:space-between;align-items:baseline;gap:10px;border-bottom:1px solid var(--g4)}\n  .ui>.body{grid-column:1;grid-row:2;padding:14px 18px;display:flex;flex-direction:column;justify-content:center;gap:12px}\n  .ui>.foot{grid-column:1;grid-row:3;padding:10px 18px 16px;display:flex;justify-content:flex-end;gap:8px;align-items:center}\n  .top .title{font:600 15px/1.2 var(--sans);color:var(--white)}\n  .top .title .desc{font:400 12px var(--sans);color:var(--light);margin-left:8px}\n  .top .hint{font:400 10px/1 var(--mono);color:var(--light);letter-spacing:.06em;text-transform:uppercase;white-space:nowrap}\n\n  /* mono label */\n  .lbl{font:400 10px/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light)}\n\n  /* buttons per system */\n  .btn{display:inline-flex;align-items:center;gap:6px;font:500 11px/1 var(--mono);letter-spacing:.06em;text-transform:uppercase;\n       padding:9px 14px;border-radius:3px;border:1px solid var(--g5);color:var(--light2);background:transparent;white-space:nowrap}\n  .btn.primary{background:var(--g3);border-color:var(--g3);color:var(--white)}\n  .btn.subtle{border:0;padding:9px 0;color:var(--light2)}\n  .btn.subtle:after{content:\"\u203a\";font-size:14px;line-height:0}\n  .btn.green{border-color:var(--cardamom)}\n  .btn.red{border-color:var(--saffron)}\n  .btn.orange{border-color:var(--paprika)}\n\n  /* tags per system (small mono, 1px stroke) */\n  .tag{display:inline-block;font:500 10px/1 var(--mono);letter-spacing:.04em;text-transform:uppercase;padding:4px 6px;border-radius:2px;border:1px solid var(--g5);color:var(--light2);background:var(--g2);white-space:nowrap}\n  .tag.green{border-color:var(--cardamom)}\n  .tag.gold{border-color:var(--turmeric)}\n  .tag.red{border-color:var(--saffron)}\n  .tag.blue{border-color:var(--blue2)}\n  /* framework pill: bold prefix */\n  .fw{display:inline-block;font:400 11px/1 var(--sans);padding:4px 6px;border-radius:2px;border:1px solid var(--g5);background:var(--g2);color:var(--light2);white-space:nowrap}\n  .fw b{font-weight:600;color:var(--white)}\n  .fw.blue{border-color:var(--blue2)}\n\n  /* rows */\n  .row{display:flex;align-items:center;gap:12px;padding:9px 0;border-bottom:1px solid var(--g4)}\n  .row:last-child{border-bottom:0}\n  .row .name{flex:1;min-width:0;font-weight:500;color:var(--white);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n  .row .name small{display:block;font-weight:400;color:var(--light);font-size:11px}\n  .row .val{font:400 12px var(--mono);color:var(--light2)}\n\n  /* agent glyph (triangle mark from hover cards) */\n  .glyph{width:22px;height:22px;flex:none}\n  .glyph svg{width:100%;height:100%;display:block}\n\n  /* stat cards (Banners + Cards) */\n  .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}\n  .stat{background:var(--g2);border-radius:3px;padding:12px 14px}\n  .stat b{display:block;font:600 26px/1.05 var(--sans);color:var(--white)}\n  .stat b.gold{color:var(--turmeric)}\n  .stat span{display:block;font-size:11px;color:var(--light2);margin-top:4px}\n  .stat i{display:block;font-style:normal;font-size:10px;color:var(--light);margin-top:2px}\n  .stat i.up{color:var(--saffron)}\n  .stat i.down{color:var(--cardamom)}\n\n  .hero-num{font:600 44px/1 var(--sans);color:var(--white);letter-spacing:-.01em}\n  .hero-num small{display:block;font:400 12px/1.4 var(--sans);color:var(--light);margin-top:6px;letter-spacing:0}\n\n  /* bars */\n  .bar{height:8px;background:var(--g3);border-radius:2px;overflow:hidden;flex:1;position:relative}\n  .bar i{display:block;height:100%;background:var(--light2)}\n  .bar i.gold{background:var(--turmeric)}\n  .bar i.green{background:var(--cardamom)}\n  .bar.cap:after{content:\"\";position:absolute;left:70%;top:-3px;bottom:-3px;border-left:1px dashed var(--light)}\n\n  /* policy panel + tiles */\n  .policy{background:var(--g2);border-radius:3px;padding:12px 14px;display:flex;justify-content:space-between;align-items:center;gap:10px}\n  .policy .t{font:600 15px/1.2 var(--sans);color:var(--white)}\n  .policy .t small{display:block;font:400 11px var(--sans);color:var(--light);margin-top:2px}\n  .link{display:flex;align-items:center;gap:10px;font:400 10px/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light)}\n  .link:before,.link:after{content:\"\";flex:1;border-top:1px dashed var(--g5)}\n  .tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}\n  .tile{background:var(--g2);border:1px solid var(--g4);border-radius:3px;padding:10px 6px 9px;text-align:center}\n  .tile .dot{width:8px;height:8px;border-radius:50%;background:var(--cardamom);margin:0 auto 8px}\n  .tile b{display:block;font:500 12px/1.2 var(--sans);color:var(--white)}\n  .tile span{display:block;font:400 9px/1 var(--mono);letter-spacing:.06em;text-transform:uppercase;color:var(--light);margin-top:4px}\n\n  /* chart */\n  .chart{width:100%}\n  .chart svg{width:100%;height:auto;display:block}\n  .legend{display:flex;gap:16px;font-size:11px;color:var(--light2)}\n  .legend i{display:inline-block;width:7px;height:7px;border-radius:50%;vertical-align:middle;margin-right:5px}\n  .flag{display:flex;align-items:center;gap:10px;background:var(--g2);border:1px solid var(--saffron);border-radius:3px;padding:10px 12px}\n  .flag .k{font:500 10px/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--saffron);display:flex;align-items:center;gap:6px}\n  .flag .k:before{content:\"\";width:6px;height:6px;border-radius:50%;background:var(--saffron)}\n  .flag .t{font-weight:500;color:var(--white);flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n\n  /* score */\n  .score{display:flex;align-items:center;gap:18px}\n  .ring{width:84px;height:84px;border-radius:50%;flex:none;display:grid;place-items:center;position:relative;\n        background:conic-gradient(var(--saffron) 0 82%,var(--g3) 82% 100%)}\n  .ring:after{content:\"\";position:absolute;inset:7px;border-radius:50%;background:var(--g1)}\n  .ring b{position:relative;z-index:1;font:600 28px/1 var(--sans);color:var(--white)}\n  .score .txt{flex:1;min-width:0}\n  .score .txt .lead{font:600 16px/1.2 var(--sans);color:var(--saffron)}\n  .score .txt .why{color:var(--light);font-size:12px;margin-top:4px}\n  .chips{display:flex;gap:6px;flex-wrap:wrap}\n\n  .spend{display:flex;align-items:center;gap:10px;font-size:12px}\n  .spend .l{width:88px;color:var(--light);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n  .spend .v{width:48px;text-align:right;font:400 11px var(--mono);color:var(--light2)}\n  .spend .v.orange{color:var(--paprika)}\n\n  @container (max-width:380px){\n    .ui{font-size:12px}\n    .top .hint{display:none}\n    .btn{padding:8px 11px;font-size:10px}\n    .stats{gap:6px}.stat{padding:10px}.stat b{font-size:22px}\n    .tiles{gap:6px}.tile b{font-size:11px}.tile span{display:none}\n    .ring{width:72px;height:72px}.ring b{font-size:24px}\n    .hero-num{font-size:38px}\n    .spend .l{width:72px}\n  }\n\n  .sol{max-width:1120px;margin:0 auto 56px}\n  .sol .head{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:14px;border-bottom:1px solid var(--g4);padding-bottom:10px}\n  .sol h2{font:600 22px/1.2 var(--sans);margin:0;color:var(--white)}\n  .sol .head .num{font:400 11px var(--mono);letter-spacing:.06em;text-transform:uppercase;color:var(--light)}\n  .opts{display:grid;grid-template-columns:1fr;gap:0}\n  @media (max-width:960px){.opts{grid-template-columns:1fr}}\n  .card{border:0;padding:0;background:#000;max-width:600px}\n  \n  .card .opt{font:500 10px/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light);margin-bottom:6px;display:flex;justify-content:space-between}\n  \n  .card h3{display:none}\n  .card .sub{color:var(--light);font-size:14px;margin:0 0 16px;max-width:640px}\n  .card .note{margin:10px 0 0;font-size:12px;color:var(--light);border-top:1px dashed var(--g4);padding-top:8px}\n\n  /* blocked action card */\n  .event{background:var(--g2);border:1px solid var(--saffron);border-radius:3px;padding:10px 12px}\n  .event .h{display:flex;justify-content:space-between;align-items:center;gap:8px}\n  .event .h .t{font:600 14px/1.2 var(--sans);color:var(--white)}\n  .event .why{font-size:11px;color:var(--light);margin-top:4px}\n\n  /* faux browser */\n  .browser{border:1px solid var(--g5);border-radius:4px;overflow:hidden;background:var(--g2)}\n  .browser .chrome{display:flex;align-items:center;gap:8px;padding:7px 10px;border-bottom:1px solid var(--g4);background:var(--g3)}\n  .browser .chrome i{width:8px;height:8px;border-radius:50%;background:var(--g5);display:block}\n  .browser .chrome .url{flex:1;background:var(--g2);border:1px solid var(--g4);border-radius:3px;padding:3px 8px;font:400 11px var(--mono);color:var(--light)}\n  .browser .page{padding:10px 12px}\n  .browser .field{background:var(--g1);border:1px solid var(--g4);border-radius:3px;padding:8px 10px;font-size:12px;color:var(--light);display:flex;gap:8px;align-items:center}\n  .browser .field .chip{border:1px solid var(--blue2);border-radius:2px;padding:2px 6px;font:400 10px var(--mono);color:var(--light2);white-space:nowrap}\n  .banner{display:flex;align-items:center;gap:10px;background:var(--g3);border-top:1px solid var(--saffron);padding:8px 12px;font-size:12px;color:var(--white)}\n  .banner .k{font:500 10px/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--saffron)}\n  .banner small{color:var(--light);font-size:11px}\n\n  /* toggle switch */\n  .switch{width:30px;height:16px;border-radius:8px;background:var(--cardamom);position:relative;flex:none}\n  .switch:after{content:\"\";position:absolute;right:2px;top:2px;width:12px;height:12px;border-radius:50%;background:#fff}\n\n  /* coverage bars */\n  .cov{display:flex;align-items:center;gap:10px;font-size:12px}\n  .cov .l{width:78px;color:var(--light)}\n  .cov .bar{height:12px;border-radius:2px;display:flex;overflow:hidden}\n  .cov .bar i{display:block;height:100%}\n  .cov .bar i.you{background:var(--light2)}\n  .cov .bar i.alt{background:repeating-linear-gradient(45deg,var(--cardamom) 0 3px,transparent 3px 6px)}\n\n  /* timeline */\n  .tl .step{display:flex;align-items:center;gap:12px;padding:7px 0;border-bottom:1px solid var(--g4)}\n  .tl .step:last-child{border-bottom:0}\n  .tl .dot{width:10px;height:10px;border-radius:50%;border:1.5px solid var(--cardamom);flex:none}\n  .tl .dot.bad{background:var(--saffron);border-color:var(--saffron)}\n  .tl .name{flex:1;min-width:0;color:var(--light2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n  .tl .name.strong{font-weight:600;color:var(--white)}\n  .tl .ok{font:400 10px var(--mono);letter-spacing:.06em;text-transform:uppercase;color:var(--light)}\n\n  /* compare */\n  .cmp{display:grid;grid-template-columns:1fr 1fr;gap:10px}\n  .cmp .box{background:var(--g2);border:1px solid var(--g4);border-radius:3px;padding:10px 12px}\n  .cmp .box.bad{border-color:var(--saffron)}\n  .cmp .box .k{font:400 10px/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light)}\n  .cmp .box.bad .k{color:var(--saffron)}\n  .cmp .box .v{font:600 13px/1.3 var(--sans);color:var(--white);margin-top:6px}\n\n  /* ranked */\n  .ranked .r{display:flex;align-items:center;gap:10px;padding:7px 0;font-size:12px;border-bottom:1px solid var(--g4)}\n  .ranked .r:last-child{border-bottom:0}\n  .ranked .r .n{width:96px;color:var(--light2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n  .ranked .r.top .n{font-weight:600;color:var(--white)}\n  .ranked .r .s{width:26px;text-align:right;font:400 11px var(--mono);color:var(--light2)}\n  .ranked .r.top .s{color:var(--saffron)}\n\n  /* checklist */\n  .chk{display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--g4);font-size:12.5px;color:var(--light2)}\n  .chk:last-child{border-bottom:0}\n  .chk .bx{width:14px;height:14px;border-radius:2px;background:var(--white);flex:none;display:grid;place-items:center;color:#111;font-size:10px;font-weight:700}\n  .chk .t{flex:1}\n  .chk .d{font:400 10px var(--mono);color:var(--light);letter-spacing:.04em}\n\n  /* route */\n  .route{display:flex;align-items:center;gap:10px}\n  .route .m{flex:1;background:var(--g2);border:1px solid var(--g4);border-radius:3px;padding:10px;text-align:center}\n  .route .m .n{font-weight:600;color:var(--white);font-size:13px}\n  .route .m .p{font:400 11px var(--mono);color:var(--light);margin-top:3px}\n  .route .m.off{border-style:dashed;opacity:.55}\n  .route .m.off .n,.route .m.off .p{text-decoration:line-through}\n  .route .m.on{border-color:var(--cardamom)}\n  .route .arr{color:var(--light);font-size:18px}\n  .save{background:var(--g2);border-radius:3px;padding:10px 12px;text-align:center}\n  .save b{display:block;font:600 18px/1.1 var(--sans);color:var(--cardamom)}\n  .save span{font-size:11px;color:var(--light)}\n  @container (max-width:380px){.ranked .r .n{width:80px}.cov .l{width:66px}}\n\n  /* ---- centrepiece frames (scaled by container width) ---- */\n  .ui.big>.top{padding:5.5cqw 6cqw 4cqw;border-bottom:1px solid var(--g4);align-items:baseline}\n  .ui.big>.body{padding:3cqw 6cqw;gap:3.2cqw}\n  .ui.big>.foot{padding:2cqw 6cqw 6cqw;display:flex}\n  .ui.big .btitle{font:600 6cqw/1.1 var(--sans);color:var(--white)}\n  .ui.big .btitle small{display:block;font:400 max(11px,3.2cqw)/1.5 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light);margin-top:1cqw}\n  .ui.big .btitle.dotted{display:flex;align-items:center;gap:2.2cqw}\n  .ui.big .btitle .dot{width:2.4cqw;height:2.4cqw;border-radius:50%;background:var(--cardamom);box-shadow:0 0 0 1cqw rgba(31,180,31,.18)}\n  .ui.big .bhint{font:400 max(9px,2.2cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light);white-space:nowrap}\n  .ui.big .bbtn{display:flex;width:100%;justify-content:center;align-items:center;font:600 max(11px,3.6cqw)/1 var(--mono);letter-spacing:.1em;text-transform:uppercase;\n       padding:4.2cqw 5cqw;border-radius:3px;background:#2e2e2e;color:var(--white);border:1px solid #3a3a3a;white-space:nowrap}\n  /* shadow */\n  .ui.big .bnum{font:600 24cqw/1 var(--sans);color:var(--saffron);letter-spacing:-.03em}\n  .ui.big .bsub{font:400 max(12px,4.2cqw)/1.3 var(--sans);color:var(--light2);margin-top:2cqw}\n  /* endpoint */\n  .ui.big .brow{display:flex;align-items:center;flex-wrap:wrap;gap:3.4cqw;padding:2cqw 0}\n  .ui.big .bglyph{width:11cqw;height:11cqw;flex:none}\n  .ui.big .bglyph svg{width:100%;height:100%;display:block}\n  .ui.big .bname{flex:1 1 auto;min-width:0;font:600 max(15px,6cqw)/1.15 var(--sans);color:var(--saffron);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n  .ui.big .bname small{display:block;font:400 max(11px,3.4cqw)/1.5 var(--sans);color:var(--light);margin-top:.6cqw}\n  .ui.big .btag{display:inline-block;font:600 max(10px,3cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;padding:2cqw 2.6cqw;border-radius:2px;border:1px solid var(--saffron);background:var(--g2);color:var(--saffron);white-space:nowrap;margin-left:calc(11cqw + 3.4cqw)}\n  /* estate */\n  .ui.big .btagg{display:inline-flex;align-items:center;gap:1.4cqw;font:600 max(10px,2.6cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;padding:1.8cqw 2.4cqw;border-radius:2px;border:1px solid var(--cardamom);background:var(--g2);color:var(--cardamom);white-space:nowrap}\n  .ui.big .btagg .dot{width:1.6cqw;height:1.6cqw;border-radius:50%;background:var(--cardamom)}\n  .ui.big .blink{display:flex;align-items:center;gap:2.4cqw;font:400 max(9px,2.4cqw)/1 var(--mono);letter-spacing:.1em;text-transform:uppercase;color:var(--light)}\n  .ui.big .blink:before,.ui.big .blink:after{content:\"\";flex:1;border-top:1px dashed var(--g5)}\n  .ui.big .btiles{display:grid;grid-template-columns:repeat(4,1fr);gap:2.4cqw}\n  .ui.big .btile{background:var(--g2);border:1px solid var(--g4);border-radius:3px;padding:3.6cqw 1.2cqw 3.2cqw;text-align:center}\n  .ui.big .btile .dot{width:2.2cqw;height:2.2cqw;border-radius:50%;background:var(--cardamom);margin:0 auto 2.4cqw}\n  .ui.big .btile b{display:block;font:600 max(11px,3.4cqw)/1.15 var(--sans);color:var(--white)}\n  .ui.big .btile span{display:block;font:400 max(8px,2.1cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light);margin-top:1.6cqw}\n  .ui.big .btile.alt{border:1px dashed var(--cardamom);background:transparent}\n  .ui.big .btile.alt .dot{background:transparent;border:1px solid var(--cardamom)}\n  .ui.big .btile.alt b{color:var(--cardamom)}\n\n  /* estate v5 */\n  .ui.big>.body.split{flex-direction:row;align-items:center;justify-content:space-between;gap:6cqw}\n  .ui.big .bstat{flex:1;min-width:0}\n  .ui.big .bnum2{font:600 17cqw/1 var(--sans);color:var(--white);letter-spacing:-.03em}\n  .ui.big .blbl{font:400 max(11px,3.6cqw)/1.3 var(--sans);color:var(--light2);margin-top:1.4cqw}\n  .ui.big .bprio{display:flex;align-items:center;gap:2cqw;margin-top:3.6cqw;font:400 max(9px,2.6cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light)}\n  .ui.big .bprio b{font-weight:600;color:var(--saffron)}\n  .ui.big .bringwrap{display:flex;flex-direction:column;align-items:center;gap:2cqw;flex:none}\n  .ui.big .bring{width:30cqw;height:30cqw;border-radius:50%;display:grid;place-items:center;position:relative;background:conic-gradient(var(--cardamom) 0 67%,var(--turmeric) 67% 100%)}\n  .ui.big .bring:after{content:\"\";position:absolute;inset:3.2cqw;border-radius:50%;background:var(--g1)}\n  .ui.big .bring b{position:relative;z-index:1;font:600 7.5cqw/1 var(--sans);color:var(--white);letter-spacing:-.02em}\n  .ui.big .bring b i{font-style:normal;font-size:4cqw;color:var(--light2)}\n  .ui.big .bringlbl{font:400 max(9px,2.6cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light)}\n  .ui.big .bringlbl b{color:var(--turmeric);font-weight:600}\n  .ui>.body.split{flex-direction:row;align-items:center;gap:6cqw}\n  .b-title{display:flex;align-items:center;gap:2.6cqw;font:600 6cqw/1.1 var(--sans);color:var(--white);flex-wrap:wrap}\n  .b-title .b-glyph{width:7cqw;height:7cqw;flex:none}\n  .b-title .b-glyph svg{width:100%;height:100%;display:block}\n  .b-title small{display:block;flex-basis:100%;font:400 max(11px,3.2cqw)/1.5 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light);margin-top:1cqw}\n  .b-flag{display:inline-block;font:600 max(10px,2.4cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;padding:1.6cqw 2cqw;border-radius:2px;border:1px solid var(--saffron);background:var(--g2);color:var(--saffron);white-space:nowrap}\n  .b-btn{display:flex;width:100%;justify-content:center;align-items:center;font:600 max(12px,3.6cqw)/1 var(--mono);letter-spacing:.1em;text-transform:uppercase;\n       padding:4.2cqw 5cqw;border-radius:3px;background:#2e2e2e;color:var(--white);border:1px solid #3a3a3a;white-space:nowrap}\n  .b-mono{font:400 max(9px,2.4cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light)}\n\n  /* risk A */\n  .r-ringwrap{flex:none;display:flex;flex-direction:column;align-items:center;gap:2cqw}\n  .r-ring{width:32cqw;height:32cqw;border-radius:50%;border:1.5px solid var(--light);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.6cqw}\n  .r-ring b{font:600 10cqw/1 var(--sans);color:var(--paprika);letter-spacing:-.02em}\n  .r-ring span{font:600 max(11px,3.2cqw)/1 var(--sans);color:var(--paprika)}\n  .r-tiers{display:flex;gap:.8cqw;margin-top:1.4cqw}\n  .r-tiers i{display:block;width:5cqw;height:.9cqw;border-radius:1px;background:var(--g4)}\n  .r-tiers i.on{background:var(--paprika)}\n  .r-stat{flex:1;min-width:0}\n  .r-eyebrow{display:flex;align-items:center;gap:1.6cqw;font:600 max(10px,2.6cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--paprika)}\n  .r-eyebrow:before{content:\"\";width:1.6cqw;height:1.6cqw;border-radius:50%;background:var(--paprika)}\n  .r-cat{font:600 max(16px,6.4cqw)/1.1 var(--sans);color:var(--white);margin-top:2.2cqw}\n  .r-cat small{display:block;font:400 max(11px,3.2cqw)/1.4 var(--sans);color:var(--light);margin-top:.8cqw}\n  .r-why{font:400 max(11px,3cqw)/1.4 var(--sans);color:var(--light2);margin-top:2.4cqw}\n  .r-why b{color:var(--paprika);font-weight:600}\n  /* risk B */\n  .r-maphead,.r-maprow{display:grid;grid-template-columns:1fr 12cqw repeat(4,7cqw);gap:1.6cqw;align-items:center}\n  .r-maphead{font:400 max(8px,2cqw)/1 var(--mono);letter-spacing:.06em;text-transform:uppercase;color:var(--light);padding-bottom:1.6cqw;border-bottom:1px solid var(--g4)}\n  .r-maphead span:nth-child(n+2){text-align:center}\n  .r-maprow{padding:2.4cqw 0;border-bottom:1px solid var(--g4)}\n  .r-maprow:last-child{border-bottom:0}\n  .r-maprow .n{font:600 max(12px,3.8cqw)/1.2 var(--sans);color:var(--white);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n  .r-maprow .s{text-align:center;font:600 max(13px,4.4cqw)/1 var(--sans)}\n  .r-maprow .s.hi{color:var(--paprika)}.r-maprow .s.md{color:var(--turmeric)}.r-maprow .s.lo{color:var(--cardamom)}\n  .r-maprow .c{height:5.4cqw;border-radius:2px;display:block}\n  .r-maprow .c.lo{background:var(--cardamom)}.r-maprow .c.md{background:var(--turmeric)}.r-maprow .c.hi{background:var(--paprika)}.r-maprow .c.cr{background:var(--saffron)}\n  .r-maprow.top{background:linear-gradient(90deg,rgba(212,100,30,.08),transparent);margin:0 -6cqw;padding-left:6cqw;padding-right:6cqw}\n  /* risk C */\n  .r-donutwrap{flex:none;display:flex;flex-direction:column;align-items:center;gap:2cqw}\n  .r-donut{width:32cqw;height:32cqw;border-radius:50%;position:relative;display:grid;place-items:center;\n         background:conic-gradient(var(--saffron) 0 24%,var(--g1) 24% 25%,var(--saffron) 25% 49%,var(--g1) 49% 50%,var(--turmeric) 50% 74%,var(--g1) 74% 75%,var(--saffron) 75% 99%,var(--g1) 99% 100%)}\n  .r-donut:after{content:\"\";position:absolute;inset:4cqw;border-radius:50%;background:var(--g1)}\n  .r-donut div{position:relative;z-index:1;text-align:center}\n  .r-donut div small{display:block;font:400 max(8px,2.2cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light);margin-bottom:.8cqw}\n  .r-donut div b{font:600 6.6cqw/1 var(--sans);color:var(--white)}\n  .r-trend b{color:var(--cardamom);font-weight:600}\n  .r-fw{flex:1;min-width:0}\n  .r-fw .lbl{font:400 max(9px,2.4cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light);margin-bottom:2.4cqw}\n  .r-fw .row{display:flex;align-items:center;justify-content:space-between;gap:2cqw;padding:2.2cqw 0;border-bottom:1px solid var(--g4);font:600 max(12px,3.8cqw)/1.2 var(--sans);color:var(--white)}\n  .r-fw .row:last-child{border-bottom:0}\n  .r-fw .row .pct{font:600 max(11px,3.4cqw)/1 var(--mono);color:var(--cardamom)}\n  .r-fw .row .pct.md{color:var(--turmeric)}\n\n  /* cost A \u00b7 global spend */\n  .k-num{font:600 15cqw/1 var(--sans);color:var(--white);letter-spacing:-.03em}\n  .k-num small{font:600 5cqw/1 var(--sans);color:var(--light2);margin-left:1.6cqw;letter-spacing:0}\n  .k-lbl{font:400 max(11px,3.2cqw)/1.3 var(--sans);color:var(--light);margin-top:1.2cqw}\n  .k-bar{height:2.2cqw;border-radius:1.1cqw;background:var(--g3);overflow:hidden;position:relative;margin-top:3cqw}\n  .k-bar i{display:block;height:100%;width:100%;background:var(--saffron)}\n  .k-bar:after{content:\"\";position:absolute;left:15%;top:0;bottom:0;border-left:1.5px dashed var(--white);opacity:.7}\n  .k-over{display:flex;justify-content:space-between;gap:2cqw;margin-top:2cqw;font:400 max(11px,3.1cqw)/1.3 var(--sans);color:var(--light2)}\n  .k-over b{color:var(--saffron);font-weight:600}\n  .k-over .k-vs{color:var(--turmeric);font-weight:600}\n  /* cost B \u00b7 shadow spend */\n  .k-row{display:flex;align-items:center;gap:3cqw;padding:2.6cqw 0;border-bottom:1px solid var(--g4)}\n  .k-row:last-child{border-bottom:0}\n  .k-row .n{flex:1;min-width:0;font:600 max(12px,4cqw)/1.2 var(--sans);color:var(--white);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n  .k-row .n small{display:block;font:400 max(10px,2.6cqw)/1.4 var(--sans);color:var(--turmeric)}\n  .k-row .v{font:600 max(12px,4cqw)/1 var(--sans);color:var(--white)}\n  .k-spark{width:26cqw;height:9cqw;flex:none}\n  .k-spark svg{width:100%;height:100%;display:block}\n  /* cost C \u00b7 optimization */\n  .k-rec{display:flex;justify-content:space-between;align-items:flex-start;gap:3cqw}\n  .k-rec .t{font:600 max(14px,5.2cqw)/1.15 var(--sans);color:var(--white)}\n  .k-rec .t small{display:block;font:400 max(10px,2.8cqw)/1.4 var(--sans);color:var(--light);margin-top:1cqw}\n  .k-rec .sv{text-align:right;flex:none}\n  .k-rec .sv b{display:block;font:600 max(18px,8cqw)/1 var(--sans);color:var(--cardamom);letter-spacing:-.02em}\n  .k-rec .sv span{display:block;font:400 max(9px,2.3cqw)/1.4 var(--mono);letter-spacing:.06em;text-transform:uppercase;color:var(--light);margin-top:.8cqw}\n  .k-swap{display:grid;grid-template-columns:1fr auto 1fr;gap:2.4cqw;align-items:center;background:var(--g2);border-radius:3px;padding:3cqw 3.4cqw}\n  .k-swap .m small{display:block;font:400 max(8px,2.1cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light);margin-bottom:1.2cqw}\n  .k-swap .m b{display:block;font:600 max(11px,3.4cqw)/1.2 var(--sans);color:var(--white);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n  .k-swap .m i{display:block;font:400 max(9px,2.6cqw)/1.4 var(--mono);color:var(--light);font-style:normal}\n  .k-swap .m.new b{color:var(--cardamom)}\n  .k-swap .arr{color:var(--light);font-size:4cqw}\n  .opts{display:flex;gap:40px;align-items:flex-start}\n  .opts>.card{flex:0 1 600px}\n  .fb{flex:1 1 320px;border-left:2px solid var(--turmeric);padding:4px 0 4px 20px;margin-top:40px}\n  .fb .k{font:500 10px/1 var(--mono);letter-spacing:.1em;text-transform:uppercase;color:var(--turmeric);margin-bottom:10px}\n  .fb p{margin:0;font:400 15px/1.55 var(--sans);color:var(--light2)}\n  @media (max-width:960px){.opts{flex-direction:column;gap:20px}.fb{margin-top:0}}\n\n  .x-ui{background:var(--g1);border:1px solid var(--g4);border-radius:4px;overflow:hidden;\n      display:grid;grid-template-columns:100%;grid-template-rows:auto 1fr auto;container-type:inline-size;color:var(--light2)}\n  .x-ui:before{content:\"\";grid-column:1;grid-row:1/4;padding-bottom:66.667%;pointer-events:none}\n  .x-ui>.x-top{grid-column:1;grid-row:1;padding:5.5cqw 6cqw 4cqw;border-bottom:1px solid var(--g4)}\n  .x-ui>.x-body{grid-column:1;grid-row:2;padding:4cqw 6cqw 2cqw;display:flex;flex-direction:column;justify-content:center;gap:4.4cqw}\n  .x-ui>.x-foot{grid-column:1;grid-row:3;padding:2cqw 6cqw 6cqw;display:flex}\n  .x-title{display:block;font:600 6cqw/1.1 var(--sans);color:var(--white)}\n  .x-title small{display:block;font:400 max(11px,3.2cqw)/1.5 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light);margin-top:1cqw}\n  .x-stat{display:flex;align-items:center;justify-content:space-between;gap:4cqw}\n  .x-stat .l{font:400 max(12px,4.2cqw)/1.25 var(--sans);color:var(--light2)}\n  .x-stat .n{font:600 17cqw/1 var(--sans);color:var(--white);letter-spacing:-.03em}\n  .x-checks{display:grid;grid-template-columns:1fr 1fr;gap:2.8cqw 4cqw}\n  .x-chk{display:flex;align-items:center;gap:2.4cqw;font:400 max(12px,3.8cqw)/1.2 var(--sans);color:var(--white);white-space:nowrap}\n  .x-chk .bx{width:4.2cqw;height:4.2cqw;min-width:14px;min-height:14px;border-radius:2px;background:var(--white);flex:none;display:grid;place-items:center}\n  .x-chk .bx svg{width:72%;height:72%;display:block}\n  .x-btn{display:flex;width:100%;justify-content:center;align-items:center;font:600 max(12px,3.6cqw)/1 var(--mono);letter-spacing:.1em;text-transform:uppercase;\n       padding:4.2cqw 5cqw;border-radius:3px;background:#2e2e2e;color:var(--white);border:1px solid #3a3a3a;white-space:nowrap}\n/* frame */\n  .p-ui{background:var(--g1);border:1px solid var(--g4);border-radius:4px;overflow:hidden;\n      display:grid;grid-template-columns:100%;grid-template-rows:auto 1fr auto;container-type:inline-size;color:var(--light2)}\n  .p-ui:before{content:\"\";grid-column:1;grid-row:1/4;padding-bottom:66.667%;pointer-events:none}\n  .p-ui>.p-top{grid-column:1;grid-row:1;padding:5cqw 6cqw 4cqw;border-bottom:1px solid var(--g4)}\n  .p-ui>.p-body{grid-column:1;grid-row:2;padding:4cqw 6cqw 2cqw;display:flex;flex-direction:column;justify-content:center;gap:3.6cqw}\n  .p-ui>.p-foot{grid-column:1;grid-row:3;padding:2cqw 6cqw 6cqw;display:flex}\n\n  /* shared parts */\n  .p-crumb{font:400 max(10px,2.6cqw)/1 var(--sans);color:var(--moon);margin-bottom:2.4cqw}\n  .p-crumb span{color:var(--light);margin:0 1.2cqw}\n  .p-title{display:flex;align-items:center;gap:2.4cqw;font:600 6cqw/1.1 var(--sans);color:var(--white);flex-wrap:wrap}\n  .p-title .p-pen{width:4cqw;height:4cqw;flex:none;opacity:.7}\n  .p-title .p-pen svg{width:100%;height:100%;display:block}\n  .p-title small{display:block;flex-basis:100%;font:400 max(10px,3cqw)/1.5 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light);margin-top:.8cqw}\n  .p-tag{display:inline-block;font:500 max(9px,2.3cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;padding:1.4cqw 1.8cqw;border-radius:2px;border:1px solid var(--g5);background:var(--g2);color:var(--light2);white-space:nowrap}\n  .p-tag.p-red{border-color:var(--saffron);color:var(--saffron)}\n  .p-panel{background:var(--g2);border-radius:3px;padding:3.4cqw 3.6cqw}\n  .p-phead{font:500 max(10px,2.8cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--white)}\n  .p-phead small{display:block;font:400 max(10px,2.6cqw)/1.4 var(--sans);letter-spacing:0;text-transform:none;color:var(--light);margin-top:1cqw}\n  .p-checks{display:grid;grid-template-columns:1fr 1fr;gap:2.6cqw 3.6cqw;margin-top:3cqw}\n  .p-checks.p-one{grid-template-columns:1fr}\n  .p-chk{display:flex;align-items:center;gap:2.2cqw;font:500 max(11px,3.5cqw)/1.2 var(--sans);color:var(--white);white-space:nowrap}\n  .p-chk .p-bx{width:3.8cqw;height:3.8cqw;min-width:13px;min-height:13px;border-radius:2px;background:var(--white);flex:none;display:grid;place-items:center}\n  .p-chk .p-bx svg{width:72%;height:72%;display:block}\n  .p-scope{display:flex;align-items:center;justify-content:space-between;gap:3cqw}\n  .p-scope .p-l{font:400 max(10px,2.8cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light)}\n  .p-scope .p-l b{display:block;font:500 max(12px,3.8cqw)/1.3 var(--sans);letter-spacing:0;text-transform:none;color:var(--white);margin-top:1.2cqw}\n  .p-scope .p-n{font:600 14cqw/1 var(--sans);color:var(--white);letter-spacing:-.03em}\n  .p-scope .p-n small{display:block;font:400 max(9px,2.4cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light);text-align:right;margin-top:1.4cqw}\n  .p-btn{display:flex;width:100%;justify-content:center;align-items:center;font:600 max(12px,3.6cqw)/1 var(--mono);letter-spacing:.1em;text-transform:uppercase;\n       padding:4.2cqw 5cqw;border-radius:3px;background:#2e2e2e;color:var(--white);border:1px solid #3a3a3a;white-space:nowrap}\n\n  /* B \u00b7 config split */\n  .p-split{display:grid;grid-template-columns:1fr 1.25fr;gap:2.4cqw}\n  .p-split .p-panel.p-big{display:flex;flex-direction:column;justify-content:space-between}\n  .p-split .p-big .p-n{font:600 13cqw/1 var(--sans);color:var(--white);letter-spacing:-.03em;margin-top:3cqw}\n  .p-split .p-big .p-n small{display:block;font:400 max(10px,2.8cqw)/1.3 var(--sans);letter-spacing:0;color:var(--light2);margin-top:1.4cqw}\n\n  .d-ui{position:relative;width:100%;aspect-ratio:3/2;background:var(--g1);border:1px solid var(--g4);border-radius:4px;overflow:hidden;container-type:inline-size;display:grid;grid-template-rows:auto 1fr auto}\n  .d-top{display:flex;align-items:center;gap:2.4cqw;padding:4.4cqw 5cqw 0}\n  .d-name{display:flex;align-items:center;gap:2cqw;font:600 max(15px,5cqw)/1.1 var(--sans);color:var(--white)}\n  .d-glyph{width:5cqw;height:5cqw;flex:none}.d-glyph svg{width:100%;height:100%;display:block}\n  .d-flag{font:600 max(9px,2.4cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;padding:1.3cqw 1.8cqw;border-radius:2px;border:1px solid var(--saffron);color:var(--saffron)}\n  .d-fan{min-height:0;display:flex;align-items:center;justify-content:center;padding:2cqw 5cqw 1cqw}\n  .d-fan svg{height:100%;width:auto;max-width:100%;display:block}\n  .d-bot{padding:0 5cqw 4.4cqw;font:400 max(13px,4.4cqw)/1.2 var(--sans);color:var(--light2)}\n  .d-bot b{color:var(--saffron);font-weight:600}\n:host{--paprika:#d4641e;--cardamom:#1fb41f;--saffron:#d63a32}\n.r-ui{width:100%;aspect-ratio:3/2;background:var(--g1);border:1px solid var(--g4);border-radius:4px;overflow:hidden;container-type:inline-size;display:grid;grid-template-rows:auto 1fr}\n  .r-top{display:flex;align-items:center;justify-content:space-between;gap:3cqw;padding:4.4cqw 5cqw 3.4cqw;border-bottom:1px solid var(--g4)}\n  .r-name{display:flex;align-items:center;gap:2cqw;font:600 max(15px,5cqw)/1.1 var(--sans);color:var(--white)}\n  .r-glyph{width:5cqw;height:5cqw;flex:none}.r-glyph svg{width:100%;height:100%;display:block}\n  .r-meta{font:400 max(9px,2.4cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light)}\n  /* A */\n  .r-mapbody{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.6cqw;padding:2cqw 5cqw}\n  .r-mid{display:flex;align-items:center;justify-content:center;gap:4cqw;width:100%}\n  .r-ring{position:relative;width:30cqw;flex:none} .r-ring svg{width:100%;height:auto;display:block}\n  .r-sc{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.6cqw}\n  .r-sc b{font:600 10cqw/1 var(--sans);color:var(--paprika)}\n  .r-sc span{font:600 max(12px,3.8cqw)/1 var(--sans);color:var(--paprika)}\n  .r-tiers{display:flex;gap:.8cqw;margin-top:1.2cqw} .r-tiers i{width:4cqw;height:.8cqw;border-radius:1px;background:var(--g4)} .r-tiers i.r-on{background:var(--paprika)}\n  .r-cat{display:flex;flex-direction:column;align-items:center;gap:.8cqw;text-align:center}\n  .r-cat.r-l,.r-cat.r-r{flex:1;min-width:0}\n  .r-cat b{font:600 max(11px,3.3cqw)/1.1 var(--sans);color:var(--white);white-space:nowrap}\n  .r-cat em{font:500 max(9px,2.4cqw)/1 var(--mono);font-style:normal;letter-spacing:.08em;text-transform:uppercase}\n  .r-cat em.r-hi{color:var(--paprika)} .r-cat em.r-lo{color:var(--cardamom)}\n  /* B */\n  .r-tier{font:500 max(10px,3cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--paprika)}\n  .r-pbody{display:flex;flex-direction:column;justify-content:center;gap:3cqw;padding:3.6cqw 5cqw 4.4cqw}\n  .r-lbl{font:400 max(9px,2.4cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light)}\n  .r-sum{margin:-1.4cqw 0 0;font:400 max(12px,3.9cqw)/1.35 var(--sans);color:var(--light2)}\n  .r-ladder{display:grid;grid-template-columns:repeat(4,1fr);gap:1.6cqw}\n  .r-ladder i{display:block;height:1.3cqw;min-height:4px;border-radius:1px;background:var(--g4)}\n  .r-ladder span{display:block;text-align:center;margin-top:1.4cqw;font:400 max(9px,2.4cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light)}\n  .r-ladder .r-on i{background:var(--paprika)} .r-ladder .r-on span{color:var(--paprika)}\n  .r-factor{display:flex;justify-content:space-between;align-items:center;gap:3cqw;background:var(--g2);border-radius:3px;padding:3cqw 3.6cqw}\n  .r-fn{font:600 max(12px,3.8cqw)/1 var(--sans);color:var(--white)}\n  .r-fv{font:500 max(9px,2.6cqw)/1 var(--mono);letter-spacing:.06em;text-transform:uppercase;color:var(--paprika);white-space:nowrap}\n\n  .r-ui{grid-template-rows:auto 1fr auto;overflow:visible}\n  .r-name .r-flag{margin-left:1.4cqw;font:600 max(8px,2cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;padding:1.1cqw 1.5cqw;border-radius:2px;border:1px solid var(--saffron);color:var(--saffron)}\n  .r-sc b,.r-sc span{color:var(--saffron)} .r-tiers i.r-on{background:var(--saffron)}\n  .r-cat em.r-cr,.r-cat small.r-cr{color:var(--saffron)}\n  .r-cat small{font:400 max(9px,2.4cqw)/1.2 var(--sans);color:var(--light);white-space:nowrap}\n  .r-foot{display:flex;justify-content:center;gap:6cqw;padding:2.4cqw 5cqw 3.4cqw;border-top:1px solid var(--g4);font:400 max(8px,2.2cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light)}\n  .r-foot b{color:var(--light2);font-weight:500}\n  .r-tier{color:var(--saffron)}\n  .r-ladder .r-on i{background:var(--saffron)} .r-ladder .r-on span{color:var(--saffron)}\n  .r-ladder small{font-size:.85em;letter-spacing:0;opacity:.85}\n  .r-factors{display:flex;flex-direction:column;gap:1.6cqw}\n  .r-factor{padding:2.4cqw 3.6cqw}\n  .r-fv.r-cr{color:var(--saffron)}\n  .r-share{font:400 max(10px,2.8cqw)/1.3 var(--sans);color:var(--light)} .r-share b{color:var(--white)}\n  .r-pbody{gap:2.4cqw}\n  .r-mapbody{gap:1.4cqw;padding:2.4cqw 5cqw}\n\n  .r-ui .r-ring{width:34cqw;height:auto;border:0;display:block;border-radius:0}\n  .r-ui .r-sc b{font-size:10cqw}\n  .r-ui .r-sc span{font-size:max(11px,3.4cqw)}\n  .r-ui .r-tiers{gap:.7cqw}\n  .r-ui .r-tiers i{width:2.9cqw;height:.8cqw}\n  .r-ui .r-tiers i:nth-child(1){background:#1d3a1d}\n  .r-ui .r-tiers i:nth-child(2){background:#3d311a}\n  .r-ui .r-tiers i:nth-child(3){background:#3e2718}\n  .r-ui .r-tiers i:nth-child(4){background:#3e1f1d}\n  .r-ui .r-tiers i.r-on{background:#d63a32}\n";
EstateHero.CARD_HTML="<div class=\"p-ui\">\n      <div class=\"p-top\">\n        <div class=\"p-crumb\">Controls<span>/</span>New control</div>\n        <span class=\"p-title\">Prevent Data Exfiltration<span class=\"p-pen\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#a9a9b3\" stroke-width=\"1.6\"><path d=\"M4 20h4L19 9l-4-4L4 16z\"/><path d=\"M13.5 6.5l4 4\"/></svg></span><small>Endpoint control</small></span>\n      </div>\n      <div class=\"p-body\">\n        <div class=\"p-split\">\n          <div class=\"p-panel p-big\">\n            <div class=\"p-phead\">Scope<small>Where it applies</small></div>\n            <div class=\"p-n\">1,284<small>Endpoints affected</small></div>\n          </div>\n          <div class=\"p-panel\">\n            <div class=\"p-phead\">Detect<small>What it looks for</small></div>\n            <div class=\"p-checks p-one\">\n              <span class=\"p-chk\"><span class=\"p-bx\"><svg viewBox=\"0 0 12 12\" fill=\"none\" stroke=\"#111\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M2.5 6.2l2.4 2.4 4.6-5\"/></svg></span>SSNs</span>\n              <span class=\"p-chk\"><span class=\"p-bx\"><svg viewBox=\"0 0 12 12\" fill=\"none\" stroke=\"#111\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M2.5 6.2l2.4 2.4 4.6-5\"/></svg></span>Credit card numbers</span>\n              <span class=\"p-chk\"><span class=\"p-bx\"><svg viewBox=\"0 0 12 12\" fill=\"none\" stroke=\"#111\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M2.5 6.2l2.4 2.4 4.6-5\"/></svg></span>Phone numbers</span>\n              <span class=\"p-chk\"><span class=\"p-bx\"><svg viewBox=\"0 0 12 12\" fill=\"none\" stroke=\"#111\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M2.5 6.2l2.4 2.4 4.6-5\"/></svg></span>Email addresses</span>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class=\"p-foot\"><span class=\"p-btn\">Apply control</span></div>\n    </div>";

var ALT_CARD_CSS="\n  :host{\n    /* neutrals from the system */\n    --bg:#000; --g1:#111111; --g2:#181818; --g3:#232323; --g4:#2c2c2c; --g5:#444444;\n    --white:#ffffff; --light2:#e2e2ea; --light:#a9a9b3;\n    /* primary */\n    --cardamom:#1fb41f; --turmeric:#c9931f; --saffron:#d63a32; --paprika:#d4641e;\n    /* secondary */\n    --moon:#c8b59b; --blue2:#3b6fc6; --blue1:#2b5aa6;\n    --sans:\"Host Grotesk Variable\",-apple-system,BlinkMacSystemFont,\"Helvetica Neue\",Arial,sans-serif;\n    --mono:\"IBM Plex Mono\",ui-monospace,\"SF Mono\",Menlo,monospace;\n  }\n  *{box-sizing:border-box}\n\n  header.page{max-width:1120px;margin:0 auto 36px}\n  header.page h1{font:600 32px/1.15 var(--sans);margin:0 0 8px;color:var(--white)}\n  header.page p{margin:0;color:var(--light);max-width:680px}\n  .grid{max-width:1120px;margin:0 auto;display:grid;grid-template-columns:repeat(2,1fr);gap:40px 32px}\n  @media (max-width:820px){.grid{grid-template-columns:1fr}body{padding:24px 16px 56px}}\n\n  .sol .meta{display:flex;justify-content:space-between;gap:12px;font:500 11px/1 var(--mono);color:var(--light);letter-spacing:.06em;text-transform:uppercase;margin-bottom:10px}\n  .sol h2{font:600 20px/1.25 var(--sans);margin:0 0 4px;color:var(--white)}\n  .sol .sub{color:var(--light);font-size:14px;margin:0 0 16px}\n  .sol .sub b{color:var(--white);font-weight:500}\n\n  /* ---------- frame: 3:2 minimum ---------- */\n  .ui{width:100%;background:var(--g1);border:1px solid var(--g4);border-radius:4px;overflow:hidden;\n      display:grid;grid-template-columns:100%;grid-template-rows:auto 1fr auto;font:13px/1.4 var(--sans);color:var(--light2);container-type:inline-size}\n  .ui:before{content:\"\";grid-column:1;grid-row:1/4;padding-bottom:66.667%;pointer-events:none}\n  .ui>.top{grid-column:1;grid-row:1;padding:14px 18px 10px;display:flex;justify-content:space-between;align-items:baseline;gap:10px;border-bottom:1px solid var(--g4)}\n  .ui>.body{grid-column:1;grid-row:2;padding:14px 18px;display:flex;flex-direction:column;justify-content:center;gap:12px}\n  .ui>.foot{grid-column:1;grid-row:3;padding:10px 18px 16px;display:flex;justify-content:flex-end;gap:8px;align-items:center}\n  .top .title{font:600 15px/1.2 var(--sans);color:var(--white)}\n  .top .title .desc{font:400 12px var(--sans);color:var(--light);margin-left:8px}\n  .top .hint{font:400 10px/1 var(--mono);color:var(--light);letter-spacing:.06em;text-transform:uppercase;white-space:nowrap}\n\n  /* mono label */\n  .lbl{font:400 10px/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light)}\n\n  /* buttons per system */\n  .btn{display:inline-flex;align-items:center;gap:6px;font:500 11px/1 var(--mono);letter-spacing:.06em;text-transform:uppercase;\n       padding:9px 14px;border-radius:3px;border:1px solid var(--g5);color:var(--light2);background:transparent;white-space:nowrap}\n  .btn.primary{background:var(--g3);border-color:var(--g3);color:var(--white)}\n  .btn.subtle{border:0;padding:9px 0;color:var(--light2)}\n  .btn.subtle:after{content:\"\u203a\";font-size:14px;line-height:0}\n  .btn.green{border-color:var(--cardamom)}\n  .btn.red{border-color:var(--saffron)}\n  .btn.orange{border-color:var(--paprika)}\n\n  /* tags per system (small mono, 1px stroke) */\n  .tag{display:inline-block;font:500 10px/1 var(--mono);letter-spacing:.04em;text-transform:uppercase;padding:4px 6px;border-radius:2px;border:1px solid var(--g5);color:var(--light2);background:var(--g2);white-space:nowrap}\n  .tag.green{border-color:var(--cardamom)}\n  .tag.gold{border-color:var(--turmeric)}\n  .tag.red{border-color:var(--saffron)}\n  .tag.blue{border-color:var(--blue2)}\n  /* framework pill: bold prefix */\n  .fw{display:inline-block;font:400 11px/1 var(--sans);padding:4px 6px;border-radius:2px;border:1px solid var(--g5);background:var(--g2);color:var(--light2);white-space:nowrap}\n  .fw b{font-weight:600;color:var(--white)}\n  .fw.blue{border-color:var(--blue2)}\n\n  /* rows */\n  .row{display:flex;align-items:center;gap:12px;padding:9px 0;border-bottom:1px solid var(--g4)}\n  .row:last-child{border-bottom:0}\n  .row .name{flex:1;min-width:0;font-weight:500;color:var(--white);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n  .row .name small{display:block;font-weight:400;color:var(--light);font-size:11px}\n  .row .val{font:400 12px var(--mono);color:var(--light2)}\n\n  /* agent glyph (triangle mark from hover cards) */\n  .glyph{width:22px;height:22px;flex:none}\n  .glyph svg{width:100%;height:100%;display:block}\n\n  /* stat cards (Banners + Cards) */\n  .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}\n  .stat{background:var(--g2);border-radius:3px;padding:12px 14px}\n  .stat b{display:block;font:600 26px/1.05 var(--sans);color:var(--white)}\n  .stat b.gold{color:var(--turmeric)}\n  .stat span{display:block;font-size:11px;color:var(--light2);margin-top:4px}\n  .stat i{display:block;font-style:normal;font-size:10px;color:var(--light);margin-top:2px}\n  .stat i.up{color:var(--saffron)}\n  .stat i.down{color:var(--cardamom)}\n\n  .hero-num{font:600 44px/1 var(--sans);color:var(--white);letter-spacing:-.01em}\n  .hero-num small{display:block;font:400 12px/1.4 var(--sans);color:var(--light);margin-top:6px;letter-spacing:0}\n\n  /* bars */\n  .bar{height:8px;background:var(--g3);border-radius:2px;overflow:hidden;flex:1;position:relative}\n  .bar i{display:block;height:100%;background:var(--light2)}\n  .bar i.gold{background:var(--turmeric)}\n  .bar i.green{background:var(--cardamom)}\n  .bar.cap:after{content:\"\";position:absolute;left:70%;top:-3px;bottom:-3px;border-left:1px dashed var(--light)}\n\n  /* policy panel + tiles */\n  .policy{background:var(--g2);border-radius:3px;padding:12px 14px;display:flex;justify-content:space-between;align-items:center;gap:10px}\n  .policy .t{font:600 15px/1.2 var(--sans);color:var(--white)}\n  .policy .t small{display:block;font:400 11px var(--sans);color:var(--light);margin-top:2px}\n  .link{display:flex;align-items:center;gap:10px;font:400 10px/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light)}\n  .link:before,.link:after{content:\"\";flex:1;border-top:1px dashed var(--g5)}\n  .tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}\n  .tile{background:var(--g2);border:1px solid var(--g4);border-radius:3px;padding:10px 6px 9px;text-align:center}\n  .tile .dot{width:8px;height:8px;border-radius:50%;background:var(--cardamom);margin:0 auto 8px}\n  .tile b{display:block;font:500 12px/1.2 var(--sans);color:var(--white)}\n  .tile span{display:block;font:400 9px/1 var(--mono);letter-spacing:.06em;text-transform:uppercase;color:var(--light);margin-top:4px}\n\n  /* chart */\n  .chart{width:100%}\n  .chart svg{width:100%;height:auto;display:block}\n  .legend{display:flex;gap:16px;font-size:11px;color:var(--light2)}\n  .legend i{display:inline-block;width:7px;height:7px;border-radius:50%;vertical-align:middle;margin-right:5px}\n  .flag{display:flex;align-items:center;gap:10px;background:var(--g2);border:1px solid var(--saffron);border-radius:3px;padding:10px 12px}\n  .flag .k{font:500 10px/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--saffron);display:flex;align-items:center;gap:6px}\n  .flag .k:before{content:\"\";width:6px;height:6px;border-radius:50%;background:var(--saffron)}\n  .flag .t{font-weight:500;color:var(--white);flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n\n  /* score */\n  .score{display:flex;align-items:center;gap:18px}\n  .ring{width:84px;height:84px;border-radius:50%;flex:none;display:grid;place-items:center;position:relative;\n        background:conic-gradient(var(--saffron) 0 82%,var(--g3) 82% 100%)}\n  .ring:after{content:\"\";position:absolute;inset:7px;border-radius:50%;background:var(--g1)}\n  .ring b{position:relative;z-index:1;font:600 28px/1 var(--sans);color:var(--white)}\n  .score .txt{flex:1;min-width:0}\n  .score .txt .lead{font:600 16px/1.2 var(--sans);color:var(--saffron)}\n  .score .txt .why{color:var(--light);font-size:12px;margin-top:4px}\n  .chips{display:flex;gap:6px;flex-wrap:wrap}\n\n  .spend{display:flex;align-items:center;gap:10px;font-size:12px}\n  .spend .l{width:88px;color:var(--light);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n  .spend .v{width:48px;text-align:right;font:400 11px var(--mono);color:var(--light2)}\n  .spend .v.orange{color:var(--paprika)}\n\n  @container (max-width:380px){\n    .ui{font-size:12px}\n    .top .hint{display:none}\n    .btn{padding:8px 11px;font-size:10px}\n    .stats{gap:6px}.stat{padding:10px}.stat b{font-size:22px}\n    .tiles{gap:6px}.tile b{font-size:11px}.tile span{display:none}\n    .ring{width:72px;height:72px}.ring b{font-size:24px}\n    .hero-num{font-size:38px}\n    .spend .l{width:72px}\n  }\n\n  .sol{max-width:1120px;margin:0 auto 56px}\n  .sol .head{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:14px;border-bottom:1px solid var(--g4);padding-bottom:10px}\n  .sol h2{font:600 22px/1.2 var(--sans);margin:0;color:var(--white)}\n  .sol .head .num{font:400 11px var(--mono);letter-spacing:.06em;text-transform:uppercase;color:var(--light)}\n  .opts{display:grid;grid-template-columns:1fr;gap:0}\n  @media (max-width:960px){.opts{grid-template-columns:1fr}}\n  .card{border:0;padding:0;background:#000;max-width:600px}\n  \n  .card .opt{font:500 10px/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light);margin-bottom:6px;display:flex;justify-content:space-between}\n  \n  .card h3{display:none}\n  .card .sub{color:var(--light);font-size:14px;margin:0 0 16px;max-width:640px}\n  .card .note{margin:10px 0 0;font-size:12px;color:var(--light);border-top:1px dashed var(--g4);padding-top:8px}\n\n  /* blocked action card */\n  .event{background:var(--g2);border:1px solid var(--saffron);border-radius:3px;padding:10px 12px}\n  .event .h{display:flex;justify-content:space-between;align-items:center;gap:8px}\n  .event .h .t{font:600 14px/1.2 var(--sans);color:var(--white)}\n  .event .why{font-size:11px;color:var(--light);margin-top:4px}\n\n  /* faux browser */\n  .browser{border:1px solid var(--g5);border-radius:4px;overflow:hidden;background:var(--g2)}\n  .browser .chrome{display:flex;align-items:center;gap:8px;padding:7px 10px;border-bottom:1px solid var(--g4);background:var(--g3)}\n  .browser .chrome i{width:8px;height:8px;border-radius:50%;background:var(--g5);display:block}\n  .browser .chrome .url{flex:1;background:var(--g2);border:1px solid var(--g4);border-radius:3px;padding:3px 8px;font:400 11px var(--mono);color:var(--light)}\n  .browser .page{padding:10px 12px}\n  .browser .field{background:var(--g1);border:1px solid var(--g4);border-radius:3px;padding:8px 10px;font-size:12px;color:var(--light);display:flex;gap:8px;align-items:center}\n  .browser .field .chip{border:1px solid var(--blue2);border-radius:2px;padding:2px 6px;font:400 10px var(--mono);color:var(--light2);white-space:nowrap}\n  .banner{display:flex;align-items:center;gap:10px;background:var(--g3);border-top:1px solid var(--saffron);padding:8px 12px;font-size:12px;color:var(--white)}\n  .banner .k{font:500 10px/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--saffron)}\n  .banner small{color:var(--light);font-size:11px}\n\n  /* toggle switch */\n  .switch{width:30px;height:16px;border-radius:8px;background:var(--cardamom);position:relative;flex:none}\n  .switch:after{content:\"\";position:absolute;right:2px;top:2px;width:12px;height:12px;border-radius:50%;background:#fff}\n\n  /* coverage bars */\n  .cov{display:flex;align-items:center;gap:10px;font-size:12px}\n  .cov .l{width:78px;color:var(--light)}\n  .cov .bar{height:12px;border-radius:2px;display:flex;overflow:hidden}\n  .cov .bar i{display:block;height:100%}\n  .cov .bar i.you{background:var(--light2)}\n  .cov .bar i.alt{background:repeating-linear-gradient(45deg,var(--cardamom) 0 3px,transparent 3px 6px)}\n\n  /* timeline */\n  .tl .step{display:flex;align-items:center;gap:12px;padding:7px 0;border-bottom:1px solid var(--g4)}\n  .tl .step:last-child{border-bottom:0}\n  .tl .dot{width:10px;height:10px;border-radius:50%;border:1.5px solid var(--cardamom);flex:none}\n  .tl .dot.bad{background:var(--saffron);border-color:var(--saffron)}\n  .tl .name{flex:1;min-width:0;color:var(--light2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n  .tl .name.strong{font-weight:600;color:var(--white)}\n  .tl .ok{font:400 10px var(--mono);letter-spacing:.06em;text-transform:uppercase;color:var(--light)}\n\n  /* compare */\n  .cmp{display:grid;grid-template-columns:1fr 1fr;gap:10px}\n  .cmp .box{background:var(--g2);border:1px solid var(--g4);border-radius:3px;padding:10px 12px}\n  .cmp .box.bad{border-color:var(--saffron)}\n  .cmp .box .k{font:400 10px/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light)}\n  .cmp .box.bad .k{color:var(--saffron)}\n  .cmp .box .v{font:600 13px/1.3 var(--sans);color:var(--white);margin-top:6px}\n\n  /* ranked */\n  .ranked .r{display:flex;align-items:center;gap:10px;padding:7px 0;font-size:12px;border-bottom:1px solid var(--g4)}\n  .ranked .r:last-child{border-bottom:0}\n  .ranked .r .n{width:96px;color:var(--light2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n  .ranked .r.top .n{font-weight:600;color:var(--white)}\n  .ranked .r .s{width:26px;text-align:right;font:400 11px var(--mono);color:var(--light2)}\n  .ranked .r.top .s{color:var(--saffron)}\n\n  /* checklist */\n  .chk{display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--g4);font-size:12.5px;color:var(--light2)}\n  .chk:last-child{border-bottom:0}\n  .chk .bx{width:14px;height:14px;border-radius:2px;background:var(--white);flex:none;display:grid;place-items:center;color:#111;font-size:10px;font-weight:700}\n  .chk .t{flex:1}\n  .chk .d{font:400 10px var(--mono);color:var(--light);letter-spacing:.04em}\n\n  /* route */\n  .route{display:flex;align-items:center;gap:10px}\n  .route .m{flex:1;background:var(--g2);border:1px solid var(--g4);border-radius:3px;padding:10px;text-align:center}\n  .route .m .n{font-weight:600;color:var(--white);font-size:13px}\n  .route .m .p{font:400 11px var(--mono);color:var(--light);margin-top:3px}\n  .route .m.off{border-style:dashed;opacity:.55}\n  .route .m.off .n,.route .m.off .p{text-decoration:line-through}\n  .route .m.on{border-color:var(--cardamom)}\n  .route .arr{color:var(--light);font-size:18px}\n  .save{background:var(--g2);border-radius:3px;padding:10px 12px;text-align:center}\n  .save b{display:block;font:600 18px/1.1 var(--sans);color:var(--cardamom)}\n  .save span{font-size:11px;color:var(--light)}\n  @container (max-width:380px){.ranked .r .n{width:80px}.cov .l{width:66px}}\n\n  /* ---- centrepiece frames (scaled by container width) ---- */\n  .ui.big>.top{padding:5.5cqw 6cqw 4cqw;border-bottom:1px solid var(--g4);align-items:baseline}\n  .ui.big>.body{padding:3cqw 6cqw;gap:3.2cqw}\n  .ui.big>.foot{padding:2cqw 6cqw 6cqw;display:flex}\n  .ui.big .btitle{font:600 6cqw/1.1 var(--sans);color:var(--white)}\n  .ui.big .btitle small{display:block;font:400 max(11px,3.2cqw)/1.5 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light);margin-top:1cqw}\n  .ui.big .btitle.dotted{display:flex;align-items:center;gap:2.2cqw}\n  .ui.big .btitle .dot{width:2.4cqw;height:2.4cqw;border-radius:50%;background:var(--cardamom);box-shadow:0 0 0 1cqw rgba(31,180,31,.18)}\n  .ui.big .bhint{font:400 max(9px,2.2cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light);white-space:nowrap}\n  .ui.big .bbtn{display:flex;width:100%;justify-content:center;align-items:center;font:600 max(11px,3.6cqw)/1 var(--mono);letter-spacing:.1em;text-transform:uppercase;\n       padding:4.2cqw 5cqw;border-radius:3px;background:#2e2e2e;color:var(--white);border:1px solid #3a3a3a;white-space:nowrap}\n  /* shadow */\n  .ui.big .bnum{font:600 24cqw/1 var(--sans);color:var(--saffron);letter-spacing:-.03em}\n  .ui.big .bsub{font:400 max(12px,4.2cqw)/1.3 var(--sans);color:var(--light2);margin-top:2cqw}\n  /* endpoint */\n  .ui.big .brow{display:flex;align-items:center;flex-wrap:wrap;gap:3.4cqw;padding:2cqw 0}\n  .ui.big .bglyph{width:11cqw;height:11cqw;flex:none}\n  .ui.big .bglyph svg{width:100%;height:100%;display:block}\n  .ui.big .bname{flex:1 1 auto;min-width:0;font:600 max(15px,6cqw)/1.15 var(--sans);color:var(--saffron);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n  .ui.big .bname small{display:block;font:400 max(11px,3.4cqw)/1.5 var(--sans);color:var(--light);margin-top:.6cqw}\n  .ui.big .btag{display:inline-block;font:600 max(10px,3cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;padding:2cqw 2.6cqw;border-radius:2px;border:1px solid var(--saffron);background:var(--g2);color:var(--saffron);white-space:nowrap;margin-left:calc(11cqw + 3.4cqw)}\n  /* estate */\n  .ui.big .btagg{display:inline-flex;align-items:center;gap:1.4cqw;font:600 max(10px,2.6cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;padding:1.8cqw 2.4cqw;border-radius:2px;border:1px solid var(--cardamom);background:var(--g2);color:var(--cardamom);white-space:nowrap}\n  .ui.big .btagg .dot{width:1.6cqw;height:1.6cqw;border-radius:50%;background:var(--cardamom)}\n  .ui.big .blink{display:flex;align-items:center;gap:2.4cqw;font:400 max(9px,2.4cqw)/1 var(--mono);letter-spacing:.1em;text-transform:uppercase;color:var(--light)}\n  .ui.big .blink:before,.ui.big .blink:after{content:\"\";flex:1;border-top:1px dashed var(--g5)}\n  .ui.big .btiles{display:grid;grid-template-columns:repeat(4,1fr);gap:2.4cqw}\n  .ui.big .btile{background:var(--g2);border:1px solid var(--g4);border-radius:3px;padding:3.6cqw 1.2cqw 3.2cqw;text-align:center}\n  .ui.big .btile .dot{width:2.2cqw;height:2.2cqw;border-radius:50%;background:var(--cardamom);margin:0 auto 2.4cqw}\n  .ui.big .btile b{display:block;font:600 max(11px,3.4cqw)/1.15 var(--sans);color:var(--white)}\n  .ui.big .btile span{display:block;font:400 max(8px,2.1cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light);margin-top:1.6cqw}\n  .ui.big .btile.alt{border:1px dashed var(--cardamom);background:transparent}\n  .ui.big .btile.alt .dot{background:transparent;border:1px solid var(--cardamom)}\n  .ui.big .btile.alt b{color:var(--cardamom)}\n\n  /* estate v5 */\n  .ui.big>.body.split{flex-direction:row;align-items:center;justify-content:space-between;gap:6cqw}\n  .ui.big .bstat{flex:1;min-width:0}\n  .ui.big .bnum2{font:600 17cqw/1 var(--sans);color:var(--white);letter-spacing:-.03em}\n  .ui.big .blbl{font:400 max(11px,3.6cqw)/1.3 var(--sans);color:var(--light2);margin-top:1.4cqw}\n  .ui.big .bprio{display:flex;align-items:center;gap:2cqw;margin-top:3.6cqw;font:400 max(9px,2.6cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light)}\n  .ui.big .bprio b{font-weight:600;color:var(--saffron)}\n  .ui.big .bringwrap{display:flex;flex-direction:column;align-items:center;gap:2cqw;flex:none}\n  .ui.big .bring{width:30cqw;height:30cqw;border-radius:50%;display:grid;place-items:center;position:relative;background:conic-gradient(var(--cardamom) 0 67%,var(--turmeric) 67% 100%)}\n  .ui.big .bring:after{content:\"\";position:absolute;inset:3.2cqw;border-radius:50%;background:var(--g1)}\n  .ui.big .bring b{position:relative;z-index:1;font:600 7.5cqw/1 var(--sans);color:var(--white);letter-spacing:-.02em}\n  .ui.big .bring b i{font-style:normal;font-size:4cqw;color:var(--light2)}\n  .ui.big .bringlbl{font:400 max(9px,2.6cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light)}\n  .ui.big .bringlbl b{color:var(--turmeric);font-weight:600}\n  .ui>.body.split{flex-direction:row;align-items:center;gap:6cqw}\n  .b-title{display:flex;align-items:center;gap:2.6cqw;font:600 6cqw/1.1 var(--sans);color:var(--white);flex-wrap:wrap}\n  .b-title .b-glyph{width:7cqw;height:7cqw;flex:none}\n  .b-title .b-glyph svg{width:100%;height:100%;display:block}\n  .b-title small{display:block;flex-basis:100%;font:400 max(11px,3.2cqw)/1.5 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light);margin-top:1cqw}\n  .b-flag{display:inline-block;font:600 max(10px,2.4cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;padding:1.6cqw 2cqw;border-radius:2px;border:1px solid var(--saffron);background:var(--g2);color:var(--saffron);white-space:nowrap}\n  .b-btn{display:flex;width:100%;justify-content:center;align-items:center;font:600 max(12px,3.6cqw)/1 var(--mono);letter-spacing:.1em;text-transform:uppercase;\n       padding:4.2cqw 5cqw;border-radius:3px;background:#2e2e2e;color:var(--white);border:1px solid #3a3a3a;white-space:nowrap}\n  .b-mono{font:400 max(9px,2.4cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light)}\n\n  /* risk A */\n  .r-ringwrap{flex:none;display:flex;flex-direction:column;align-items:center;gap:2cqw}\n  .r-ring{width:32cqw;height:32cqw;border-radius:50%;border:1.5px solid var(--light);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.6cqw}\n  .r-ring b{font:600 10cqw/1 var(--sans);color:var(--paprika);letter-spacing:-.02em}\n  .r-ring span{font:600 max(11px,3.2cqw)/1 var(--sans);color:var(--paprika)}\n  .r-tiers{display:flex;gap:.8cqw;margin-top:1.4cqw}\n  .r-tiers i{display:block;width:5cqw;height:.9cqw;border-radius:1px;background:var(--g4)}\n  .r-tiers i.on{background:var(--paprika)}\n  .r-stat{flex:1;min-width:0}\n  .r-eyebrow{display:flex;align-items:center;gap:1.6cqw;font:600 max(10px,2.6cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--paprika)}\n  .r-eyebrow:before{content:\"\";width:1.6cqw;height:1.6cqw;border-radius:50%;background:var(--paprika)}\n  .r-cat{font:600 max(16px,6.4cqw)/1.1 var(--sans);color:var(--white);margin-top:2.2cqw}\n  .r-cat small{display:block;font:400 max(11px,3.2cqw)/1.4 var(--sans);color:var(--light);margin-top:.8cqw}\n  .r-why{font:400 max(11px,3cqw)/1.4 var(--sans);color:var(--light2);margin-top:2.4cqw}\n  .r-why b{color:var(--paprika);font-weight:600}\n  /* risk B */\n  .r-maphead,.r-maprow{display:grid;grid-template-columns:1fr 12cqw repeat(4,7cqw);gap:1.6cqw;align-items:center}\n  .r-maphead{font:400 max(8px,2cqw)/1 var(--mono);letter-spacing:.06em;text-transform:uppercase;color:var(--light);padding-bottom:1.6cqw;border-bottom:1px solid var(--g4)}\n  .r-maphead span:nth-child(n+2){text-align:center}\n  .r-maprow{padding:2.4cqw 0;border-bottom:1px solid var(--g4)}\n  .r-maprow:last-child{border-bottom:0}\n  .r-maprow .n{font:600 max(12px,3.8cqw)/1.2 var(--sans);color:var(--white);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n  .r-maprow .s{text-align:center;font:600 max(13px,4.4cqw)/1 var(--sans)}\n  .r-maprow .s.hi{color:var(--paprika)}.r-maprow .s.md{color:var(--turmeric)}.r-maprow .s.lo{color:var(--cardamom)}\n  .r-maprow .c{height:5.4cqw;border-radius:2px;display:block}\n  .r-maprow .c.lo{background:var(--cardamom)}.r-maprow .c.md{background:var(--turmeric)}.r-maprow .c.hi{background:var(--paprika)}.r-maprow .c.cr{background:var(--saffron)}\n  .r-maprow.top{background:linear-gradient(90deg,rgba(212,100,30,.08),transparent);margin:0 -6cqw;padding-left:6cqw;padding-right:6cqw}\n  /* risk C */\n  .r-donutwrap{flex:none;display:flex;flex-direction:column;align-items:center;gap:2cqw}\n  .r-donut{width:32cqw;height:32cqw;border-radius:50%;position:relative;display:grid;place-items:center;\n         background:conic-gradient(var(--saffron) 0 24%,var(--g1) 24% 25%,var(--saffron) 25% 49%,var(--g1) 49% 50%,var(--turmeric) 50% 74%,var(--g1) 74% 75%,var(--saffron) 75% 99%,var(--g1) 99% 100%)}\n  .r-donut:after{content:\"\";position:absolute;inset:4cqw;border-radius:50%;background:var(--g1)}\n  .r-donut div{position:relative;z-index:1;text-align:center}\n  .r-donut div small{display:block;font:400 max(8px,2.2cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light);margin-bottom:.8cqw}\n  .r-donut div b{font:600 6.6cqw/1 var(--sans);color:var(--white)}\n  .r-trend b{color:var(--cardamom);font-weight:600}\n  .r-fw{flex:1;min-width:0}\n  .r-fw .lbl{font:400 max(9px,2.4cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light);margin-bottom:2.4cqw}\n  .r-fw .row{display:flex;align-items:center;justify-content:space-between;gap:2cqw;padding:2.2cqw 0;border-bottom:1px solid var(--g4);font:600 max(12px,3.8cqw)/1.2 var(--sans);color:var(--white)}\n  .r-fw .row:last-child{border-bottom:0}\n  .r-fw .row .pct{font:600 max(11px,3.4cqw)/1 var(--mono);color:var(--cardamom)}\n  .r-fw .row .pct.md{color:var(--turmeric)}\n\n  /* cost A \u00b7 global spend */\n  .k-num{font:600 15cqw/1 var(--sans);color:var(--white);letter-spacing:-.03em}\n  .k-num small{font:600 5cqw/1 var(--sans);color:var(--light2);margin-left:1.6cqw;letter-spacing:0}\n  .k-lbl{font:400 max(11px,3.2cqw)/1.3 var(--sans);color:var(--light);margin-top:1.2cqw}\n  .k-bar{height:2.2cqw;border-radius:1.1cqw;background:var(--g3);overflow:hidden;position:relative;margin-top:3cqw}\n  .k-bar i{display:block;height:100%;width:100%;background:var(--saffron)}\n  .k-bar:after{content:\"\";position:absolute;left:15%;top:0;bottom:0;border-left:1.5px dashed var(--white);opacity:.7}\n  .k-over{display:flex;justify-content:space-between;gap:2cqw;margin-top:2cqw;font:400 max(11px,3.1cqw)/1.3 var(--sans);color:var(--light2)}\n  .k-over b{color:var(--saffron);font-weight:600}\n  .k-over .k-vs{color:var(--turmeric);font-weight:600}\n  /* cost B \u00b7 shadow spend */\n  .k-row{display:flex;align-items:center;gap:3cqw;padding:2.6cqw 0;border-bottom:1px solid var(--g4)}\n  .k-row:last-child{border-bottom:0}\n  .k-row .n{flex:1;min-width:0;font:600 max(12px,4cqw)/1.2 var(--sans);color:var(--white);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n  .k-row .n small{display:block;font:400 max(10px,2.6cqw)/1.4 var(--sans);color:var(--turmeric)}\n  .k-row .v{font:600 max(12px,4cqw)/1 var(--sans);color:var(--white)}\n  .k-spark{width:26cqw;height:9cqw;flex:none}\n  .k-spark svg{width:100%;height:100%;display:block}\n  /* cost C \u00b7 optimization */\n  .k-rec{display:flex;justify-content:space-between;align-items:flex-start;gap:3cqw}\n  .k-rec .t{font:600 max(14px,5.2cqw)/1.15 var(--sans);color:var(--white)}\n  .k-rec .t small{display:block;font:400 max(10px,2.8cqw)/1.4 var(--sans);color:var(--light);margin-top:1cqw}\n  .k-rec .sv{text-align:right;flex:none}\n  .k-rec .sv b{display:block;font:600 max(18px,8cqw)/1 var(--sans);color:var(--cardamom);letter-spacing:-.02em}\n  .k-rec .sv span{display:block;font:400 max(9px,2.3cqw)/1.4 var(--mono);letter-spacing:.06em;text-transform:uppercase;color:var(--light);margin-top:.8cqw}\n  .k-swap{display:grid;grid-template-columns:1fr auto 1fr;gap:2.4cqw;align-items:center;background:var(--g2);border-radius:3px;padding:3cqw 3.4cqw}\n  .k-swap .m small{display:block;font:400 max(8px,2.1cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light);margin-bottom:1.2cqw}\n  .k-swap .m b{display:block;font:600 max(11px,3.4cqw)/1.2 var(--sans);color:var(--white);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n  .k-swap .m i{display:block;font:400 max(9px,2.6cqw)/1.4 var(--mono);color:var(--light);font-style:normal}\n  .k-swap .m.new b{color:var(--cardamom)}\n  .k-swap .arr{color:var(--light);font-size:4cqw}\n  .opts{display:flex;gap:40px;align-items:flex-start}\n  .opts>.card{flex:0 1 600px}\n  .fb{flex:1 1 320px;border-left:2px solid var(--turmeric);padding:4px 0 4px 20px;margin-top:40px}\n  .fb .k{font:500 10px/1 var(--mono);letter-spacing:.1em;text-transform:uppercase;color:var(--turmeric);margin-bottom:10px}\n  .fb p{margin:0;font:400 15px/1.55 var(--sans);color:var(--light2)}\n  @media (max-width:960px){.opts{flex-direction:column;gap:20px}.fb{margin-top:0}}\n\n  .x-ui{background:var(--g1);border:1px solid var(--g4);border-radius:4px;overflow:hidden;\n      display:grid;grid-template-columns:100%;grid-template-rows:auto 1fr auto;container-type:inline-size;color:var(--light2)}\n  .x-ui:before{content:\"\";grid-column:1;grid-row:1/4;padding-bottom:66.667%;pointer-events:none}\n  .x-ui>.x-top{grid-column:1;grid-row:1;padding:5.5cqw 6cqw 4cqw;border-bottom:1px solid var(--g4)}\n  .x-ui>.x-body{grid-column:1;grid-row:2;padding:4cqw 6cqw 2cqw;display:flex;flex-direction:column;justify-content:center;gap:4.4cqw}\n  .x-ui>.x-foot{grid-column:1;grid-row:3;padding:2cqw 6cqw 6cqw;display:flex}\n  .x-title{display:block;font:600 6cqw/1.1 var(--sans);color:var(--white)}\n  .x-title small{display:block;font:400 max(11px,3.2cqw)/1.5 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light);margin-top:1cqw}\n  .x-stat{display:flex;align-items:center;justify-content:space-between;gap:4cqw}\n  .x-stat .l{font:400 max(12px,4.2cqw)/1.25 var(--sans);color:var(--light2)}\n  .x-stat .n{font:600 17cqw/1 var(--sans);color:var(--white);letter-spacing:-.03em}\n  .x-checks{display:grid;grid-template-columns:1fr 1fr;gap:2.8cqw 4cqw}\n  .x-chk{display:flex;align-items:center;gap:2.4cqw;font:400 max(12px,3.8cqw)/1.2 var(--sans);color:var(--white);white-space:nowrap}\n  .x-chk .bx{width:4.2cqw;height:4.2cqw;min-width:14px;min-height:14px;border-radius:2px;background:var(--white);flex:none;display:grid;place-items:center}\n  .x-chk .bx svg{width:72%;height:72%;display:block}\n  .x-btn{display:flex;width:100%;justify-content:center;align-items:center;font:600 max(12px,3.6cqw)/1 var(--mono);letter-spacing:.1em;text-transform:uppercase;\n       padding:4.2cqw 5cqw;border-radius:3px;background:#2e2e2e;color:var(--white);border:1px solid #3a3a3a;white-space:nowrap}\n/* frame */\n  .p-ui{background:var(--g1);border:1px solid var(--g4);border-radius:4px;overflow:hidden;\n      display:grid;grid-template-columns:100%;grid-template-rows:auto 1fr auto;container-type:inline-size;color:var(--light2)}\n  .p-ui:before{content:\"\";grid-column:1;grid-row:1/4;padding-bottom:66.667%;pointer-events:none}\n  .p-ui>.p-top{grid-column:1;grid-row:1;padding:5cqw 6cqw 4cqw;border-bottom:1px solid var(--g4)}\n  .p-ui>.p-body{grid-column:1;grid-row:2;padding:4cqw 6cqw 2cqw;display:flex;flex-direction:column;justify-content:center;gap:3.6cqw}\n  .p-ui>.p-foot{grid-column:1;grid-row:3;padding:2cqw 6cqw 6cqw;display:flex}\n\n  /* shared parts */\n  .p-crumb{font:400 max(10px,2.6cqw)/1 var(--sans);color:var(--moon);margin-bottom:2.4cqw}\n  .p-crumb span{color:var(--light);margin:0 1.2cqw}\n  .p-title{display:flex;align-items:center;gap:2.4cqw;font:600 6cqw/1.1 var(--sans);color:var(--white);flex-wrap:wrap}\n  .p-title .p-pen{width:4cqw;height:4cqw;flex:none;opacity:.7}\n  .p-title .p-pen svg{width:100%;height:100%;display:block}\n  .p-title small{display:block;flex-basis:100%;font:400 max(10px,3cqw)/1.5 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light);margin-top:.8cqw}\n  .p-tag{display:inline-block;font:500 max(9px,2.3cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;padding:1.4cqw 1.8cqw;border-radius:2px;border:1px solid var(--g5);background:var(--g2);color:var(--light2);white-space:nowrap}\n  .p-tag.p-red{border-color:var(--saffron);color:var(--saffron)}\n  .p-panel{background:var(--g2);border-radius:3px;padding:3.4cqw 3.6cqw}\n  .p-phead{font:500 max(10px,2.8cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--white)}\n  .p-phead small{display:block;font:400 max(10px,2.6cqw)/1.4 var(--sans);letter-spacing:0;text-transform:none;color:var(--light);margin-top:1cqw}\n  .p-checks{display:grid;grid-template-columns:1fr 1fr;gap:2.6cqw 3.6cqw;margin-top:3cqw}\n  .p-checks.p-one{grid-template-columns:1fr}\n  .p-chk{display:flex;align-items:center;gap:2.2cqw;font:500 max(11px,3.5cqw)/1.2 var(--sans);color:var(--white);white-space:nowrap}\n  .p-chk .p-bx{width:3.8cqw;height:3.8cqw;min-width:13px;min-height:13px;border-radius:2px;background:var(--white);flex:none;display:grid;place-items:center}\n  .p-chk .p-bx svg{width:72%;height:72%;display:block}\n  .p-scope{display:flex;align-items:center;justify-content:space-between;gap:3cqw}\n  .p-scope .p-l{font:400 max(10px,2.8cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light)}\n  .p-scope .p-l b{display:block;font:500 max(12px,3.8cqw)/1.3 var(--sans);letter-spacing:0;text-transform:none;color:var(--white);margin-top:1.2cqw}\n  .p-scope .p-n{font:600 14cqw/1 var(--sans);color:var(--white);letter-spacing:-.03em}\n  .p-scope .p-n small{display:block;font:400 max(9px,2.4cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light);text-align:right;margin-top:1.4cqw}\n  .p-btn{display:flex;width:100%;justify-content:center;align-items:center;font:600 max(12px,3.6cqw)/1 var(--mono);letter-spacing:.1em;text-transform:uppercase;\n       padding:4.2cqw 5cqw;border-radius:3px;background:#2e2e2e;color:var(--white);border:1px solid #3a3a3a;white-space:nowrap}\n\n  /* B \u00b7 config split */\n  .p-split{display:grid;grid-template-columns:1fr 1.25fr;gap:2.4cqw}\n  .p-split .p-panel.p-big{display:flex;flex-direction:column;justify-content:space-between}\n  .p-split .p-big .p-n{font:600 13cqw/1 var(--sans);color:var(--white);letter-spacing:-.03em;margin-top:3cqw}\n  .p-split .p-big .p-n small{display:block;font:400 max(10px,2.8cqw)/1.3 var(--sans);letter-spacing:0;color:var(--light2);margin-top:1.4cqw}\n\n  .d-ui{position:relative;width:100%;aspect-ratio:3/2;background:var(--g1);border:1px solid var(--g4);border-radius:4px;overflow:hidden;container-type:inline-size;display:grid;grid-template-rows:auto 1fr auto}\n  .d-top{display:flex;align-items:center;gap:2.4cqw;padding:4.4cqw 5cqw 0}\n  .d-name{display:flex;align-items:center;gap:2cqw;font:600 max(15px,5cqw)/1.1 var(--sans);color:var(--white)}\n  .d-glyph{width:5cqw;height:5cqw;flex:none}.d-glyph svg{width:100%;height:100%;display:block}\n  .d-flag{font:600 max(9px,2.4cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;padding:1.3cqw 1.8cqw;border-radius:2px;border:1px solid var(--saffron);color:var(--saffron)}\n  .d-fan{min-height:0;display:flex;align-items:center;justify-content:center;padding:2cqw 5cqw 1cqw}\n  .d-fan svg{height:100%;width:auto;max-width:100%;display:block}\n  .d-bot{padding:0 5cqw 4.4cqw;font:400 max(13px,4.4cqw)/1.2 var(--sans);color:var(--light2)}\n  .d-bot b{color:var(--saffron);font-weight:600}\n:host{--paprika:#d4641e;--cardamom:#1fb41f;--saffron:#d63a32}\n.r-ui{width:100%;aspect-ratio:3/2;background:var(--g1);border:1px solid var(--g4);border-radius:4px;overflow:hidden;container-type:inline-size;display:grid;grid-template-rows:auto 1fr}\n  .r-top{display:flex;align-items:center;justify-content:space-between;gap:3cqw;padding:4.4cqw 5cqw 3.4cqw;border-bottom:1px solid var(--g4)}\n  .r-name{display:flex;align-items:center;gap:2cqw;font:600 max(15px,5cqw)/1.1 var(--sans);color:var(--white)}\n  .r-glyph{width:5cqw;height:5cqw;flex:none}.r-glyph svg{width:100%;height:100%;display:block}\n  .r-meta{font:400 max(9px,2.4cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light)}\n  /* A */\n  .r-mapbody{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.6cqw;padding:2cqw 5cqw}\n  .r-mid{display:flex;align-items:center;justify-content:center;gap:4cqw;width:100%}\n  .r-ring{position:relative;width:30cqw;flex:none} .r-ring svg{width:100%;height:auto;display:block}\n  .r-sc{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.6cqw}\n  .r-sc b{font:600 10cqw/1 var(--sans);color:var(--paprika)}\n  .r-sc span{font:600 max(12px,3.8cqw)/1 var(--sans);color:var(--paprika)}\n  .r-tiers{display:flex;gap:.8cqw;margin-top:1.2cqw} .r-tiers i{width:4cqw;height:.8cqw;border-radius:1px;background:var(--g4)} .r-tiers i.r-on{background:var(--paprika)}\n  .r-cat{display:flex;flex-direction:column;align-items:center;gap:.8cqw;text-align:center}\n  .r-cat.r-l,.r-cat.r-r{flex:1;min-width:0}\n  .r-cat b{font:600 max(11px,3.3cqw)/1.1 var(--sans);color:var(--white);white-space:nowrap}\n  .r-cat em{font:500 max(9px,2.4cqw)/1 var(--mono);font-style:normal;letter-spacing:.08em;text-transform:uppercase}\n  .r-cat em.r-hi{color:var(--paprika)} .r-cat em.r-lo{color:var(--cardamom)}\n  /* B */\n  .r-tier{font:500 max(10px,3cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--paprika)}\n  .r-pbody{display:flex;flex-direction:column;justify-content:center;gap:3cqw;padding:3.6cqw 5cqw 4.4cqw}\n  .r-lbl{font:400 max(9px,2.4cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light)}\n  .r-sum{margin:-1.4cqw 0 0;font:400 max(12px,3.9cqw)/1.35 var(--sans);color:var(--light2)}\n  .r-ladder{display:grid;grid-template-columns:repeat(4,1fr);gap:1.6cqw}\n  .r-ladder i{display:block;height:1.3cqw;min-height:4px;border-radius:1px;background:var(--g4)}\n  .r-ladder span{display:block;text-align:center;margin-top:1.4cqw;font:400 max(9px,2.4cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light)}\n  .r-ladder .r-on i{background:var(--paprika)} .r-ladder .r-on span{color:var(--paprika)}\n  .r-factor{display:flex;justify-content:space-between;align-items:center;gap:3cqw;background:var(--g2);border-radius:3px;padding:3cqw 3.6cqw}\n  .r-fn{font:600 max(12px,3.8cqw)/1 var(--sans);color:var(--white)}\n  .r-fv{font:500 max(9px,2.6cqw)/1 var(--mono);letter-spacing:.06em;text-transform:uppercase;color:var(--paprika);white-space:nowrap}\n\n  .r-ui{grid-template-rows:auto 1fr auto;overflow:visible}\n  .r-name .r-flag{margin-left:1.4cqw;font:600 max(8px,2cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;padding:1.1cqw 1.5cqw;border-radius:2px;border:1px solid var(--saffron);color:var(--saffron)}\n  .r-sc b,.r-sc span{color:var(--saffron)} .r-tiers i.r-on{background:var(--saffron)}\n  .r-cat em.r-cr,.r-cat small.r-cr{color:var(--saffron)}\n  .r-cat small{font:400 max(9px,2.4cqw)/1.2 var(--sans);color:var(--light);white-space:nowrap}\n  .r-foot{display:flex;justify-content:center;gap:6cqw;padding:2.4cqw 5cqw 3.4cqw;border-top:1px solid var(--g4);font:400 max(8px,2.2cqw)/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--light)}\n  .r-foot b{color:var(--light2);font-weight:500}\n  .r-tier{color:var(--saffron)}\n  .r-ladder .r-on i{background:var(--saffron)} .r-ladder .r-on span{color:var(--saffron)}\n  .r-ladder small{font-size:.85em;letter-spacing:0;opacity:.85}\n  .r-factors{display:flex;flex-direction:column;gap:1.6cqw}\n  .r-factor{padding:2.4cqw 3.6cqw}\n  .r-fv.r-cr{color:var(--saffron)}\n  .r-share{font:400 max(10px,2.8cqw)/1.3 var(--sans);color:var(--light)} .r-share b{color:var(--white)}\n  .r-pbody{gap:2.4cqw}\n  .r-mapbody{gap:1.4cqw;padding:2.4cqw 5cqw}\n\n  .r-ui .r-ring{width:34cqw;height:auto;border:0;display:block;border-radius:0}\n  .r-ui .r-sc b{font-size:10cqw}\n  .r-ui .r-sc span{font-size:max(11px,3.4cqw)}\n  .r-ui .r-tiers{gap:.7cqw}\n  .r-ui .r-tiers i{width:2.9cqw;height:.8cqw}\n  .r-ui .r-tiers i:nth-child(1){background:#1d3a1d}\n  .r-ui .r-tiers i:nth-child(2){background:#3d311a}\n  .r-ui .r-tiers i:nth-child(3){background:#3e2718}\n  .r-ui .r-tiers i:nth-child(4){background:#3e1f1d}\n  .r-ui .r-tiers i.r-on{background:#d63a32}\n\n:host{display:block;font:15px/1.5 var(--sans);color:var(--white);-webkit-font-smoothing:antialiased}\n";
/* ============ Stop Agent Drift hero engine (v3)
   World: Aquila camera + stars, 30 tetrahedron agents (5:4 frame).
   Beat 1 · the Behavior Wheel card is already on screen; its dots wander for 2s.
   Beat 2 · the card drops away and the camera flies onto one agent tumbling fast.
   Beat 3 · the agent snaps still at the frame's focal point, turns orange, and Helix-style signal
            streaks run along its own edges (powered up, full capacity); a headline draws in above it.
   Holds 2s, fades, loops. Restarts whenever its page is shown. ============ */
function DriftHero(root){
const cv=root.querySelector('canvas.stage'), ctx=cv.getContext('2d');
const GREY='#8E8B86', OR='#D24A2F', INK='#EDEDEA', LANE='#DDD9D2', SIG='#FF7A4A', SIGH='#FFB08A';
const MONO="'IBM Plex Mono', ui-monospace, monospace", SANS="'Host Grotesk', 'Host Grotesk Variable', Arial, sans-serif";
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let seed=4471; const rnd=()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const cl=u=>u<0?0:u>1?1:u, eoc=u=>1-Math.pow(1-cl(u),3), yank=u=>1-Math.pow(1-cl(u),5), lerp=(a,b,t)=>a+(b-a)*t;
function hex(h){return [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]}
function mix(a,b,t){const A=hex(a),B=hex(b);return 'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(',')+')'}

// ---------- camera
const CFG={F:1480,D:1650};
const cam={yaw:-32*Math.PI/180,pitch:9,cx:0.5,cy:0.5,zoom:1,tx:0,ty:0,tz:0};
let W=1,H=1,px=1;
function proj(x,y,z){
  x-=cam.tx;y-=cam.ty;z-=cam.tz;
  const cy=Math.cos(cam.yaw),sy=Math.sin(cam.yaw),cp=Math.cos(cam.pitch*Math.PI/180),sp=Math.sin(cam.pitch*Math.PI/180);
  const xr=x*cy+z*sy, zr=-x*sy+z*cy, yr=y*cp-zr*sp, z2=y*sp+zr*cp;
  const s=CFG.F/(CFG.D-z2)*cam.zoom*(W/810);
  return [W*cam.cx+xr*s, H*cam.cy-yr*s, s];
}
const STARS=[];for(let i=0;i<95;i++)STARS.push({x:rnd(),y:rnd(),r:0.5+rnd()*0.9,b:0.10+rnd()*0.30,sp:0.5+rnd()*1.4,ph:rnd()*6.283,d:0.15+rnd()*0.5});

// ---------- agents
const N=30, AG=[];
const TV=[[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]].map(v=>v.map(c=>c/Math.sqrt(3)));
const TE=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
for(let i=0;i<N;i++){const gx=(i%6)/6, gy=Math.floor(i/6)/5;
  AG.push({x:(gx-0.5+rnd()*0.16)*820, y:(gy-0.5+rnd()*0.2)*470, z:(rnd()-0.5)*420, r:15+rnd()*5,
           rot:[rnd()*6.283,rnd()*6.283,rnd()*6.283], w:[0.12+rnd()*0.18,0.1+rnd()*0.15,0.08+rnd()*0.12].map(v=>v*(rnd()<0.5?-1:1)),
           vx:0,vy:0,vz:0});}
const TARGET=15; AG[TARGET].z=Math.max(AG[TARGET].z,40);
function rot3(v,a){let [x,y,z]=v;const [ax,ay,az]=a;
  let y2=y*Math.cos(ax)-z*Math.sin(ax),z2=y*Math.sin(ax)+z*Math.cos(ax);y=y2;z=z2;
  let x2=x*Math.cos(ay)+z*Math.sin(ay);z2=-x*Math.sin(ay)+z*Math.cos(ay);x=x2;z=z2;
  x2=x*Math.cos(az)-y*Math.sin(az);y2=x*Math.sin(az)+y*Math.cos(az);return [x2,y2,z];}

// ---------- timeline (s)
const T_OUT=2.0, D_OUT=0.35, T_IN=2.1, D_IN=0.8, T_SNAP=T_IN+D_IN, T_LANES=T_SNAP+0.35, T_HEAD=T_SNAP+1.1, T_END=T_HEAD+1.0, T_HOLD=2.0, D_FADE=0.5, T_LOOP=T_END+T_HOLD+D_FADE;
const TK=T_END/2;   // whole hero compressed to 2.0s
const ZOOM_IN=6.2, CY_IN=0.4;   // the focal agent sits above the headline   // the focal agent sits a little below center so the headline has room above it

// ---------- Helix memory-beat signals, confined to the focal agent: once it snaps still and turns orange, streaks
// with a bright head run along its own six edges (staggered periods, some reversed) — powered up, at full capacity.
// the focal agent once it snaps: blends from its tumbling pose into a perfectly upright tetrahedron (apex up,
// base level, slow turn about the vertical axis) and fills solid orange, faces shaded like the Helix slabs.
const TF=[[0,1,2],[0,1,3],[0,2,3],[1,2,3]], LIGHT=(()=>{const l=[-0.35,0.85,0.45],m=Math.hypot(...l);return l.map(v=>v/m)})();
function uprightV(spin){const R=Math.sqrt(8)/3;const out=[[0,1,0]];for(let k=0;k<3;k++){const a=spin+k*2.0944;out.push([Math.cos(a)*R,-1/3,Math.sin(a)*R])}return out}
function solidAgent(g,dz){const a=AG[TARGET],k=snapK,spin=(typeof tSpin!=='undefined'?tSpin:0);
  const U=uprightV(spin),W0=TV.map(v=>rot3(v,a.rot));const Wv=W0.map((p,i)=>[0,1,2].map(j=>p[j]+(U[i][j]-p[j])*k));
  const S=Wv.map(p=>[a.x+p[0]*a.r*1.15,a.y+p[1]*a.r*1.15,a.z+p[2]*a.r*1.15]);const V=S.map(p=>proj(p[0],p[1],p[2]));
  const faces=TF.map(f=>{const [A1,B1,C1]=f.map(i=>Wv[i]);const u=[0,1,2].map(j=>B1[j]-A1[j]),v=[0,1,2].map(j=>C1[j]-A1[j]);let n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
    const c=[0,1,2].map(j=>(A1[j]+B1[j]+C1[j])/3);if(n[0]*c[0]+n[1]*c[1]+n[2]*c[2]<0)n=n.map(x=>-x);const m=Math.hypot(...n)||1;n=n.map(x=>x/m);
    return {f,lum:0.35+0.65*Math.max(0,n[0]*LIGHT[0]+n[1]*LIGHT[1]+n[2]*LIGHT[2]),d:f.reduce((s,i)=>s+V[i][2],0)/3}}).sort((p,q)=>p.d-q.d);
  ctx.lineJoin='round';
  // no fill: wireframe only, stroked in the Helix orange at full strength
  ctx.globalAlpha=fadeK;ctx.strokeStyle=mix(GREY,OR,colK);ctx.lineWidth=2.6*px;ctx.lineCap='round';ctx.beginPath();for(const [i,j] of TE){ctx.moveTo(V[i][0],V[i][1]);ctx.lineTo(V[j][0],V[j][1])}ctx.stroke();ctx.globalAlpha=1;ctx.lineCap='butt';
  return V}
const EDGE_SIG=TE.map((e,i)=>({e,P:0.5+((i*7)%6)*0.08,ph:((i*0.617)%1),flip:i%3===0}));

// ---------- Beat 1 DOM: the Behavior Wheel card (already on screen), dots wander
const FX=root.querySelector('.fx'), SR=FX.attachShadow({mode:'open'});
SR.innerHTML='<style>'+DriftHero.CARD_CSS+'</style>'+DriftHero.CARD_HTML;
const DOTS=[].slice.call(SR.querySelectorAll('.d-fan circle')).filter(c=>parseFloat(c.getAttribute('r'))<20).map(c=>{
  const red=c.getAttribute('fill')==='#d63a32';
  return {el:c,cx:parseFloat(c.getAttribute('cx')),cy:parseFloat(c.getAttribute('cy')),amp:red?7:4.5,a1:rnd()*6.283,a2:rnd()*6.283,s1:0.6+rnd()*0.8,s2:0.5+rnd()*0.9}});
function wander(t){DOTS.forEach(d=>{d.el.setAttribute('cx',(d.cx+Math.sin(t*d.s1+d.a1)*d.amp).toFixed(1));d.el.setAttribute('cy',(d.cy+Math.cos(t*d.s2+d.a2)*d.amp*0.8).toFixed(1))})}

// ---------- frame
let last=null,T0=performance.now(),FROZEN=null,HID=false, snapped=false,snapK=0,colK=0,tSpin=0,fadeK=1;
function onRestart(){AG[TARGET].rot=[rnd()*6.283,rnd()*6.283,rnd()*6.283];AG[TARGET].snapRot=null}
function frame(ts){
  const r=cv.getBoundingClientRect();px=devicePixelRatio||1;
  W=Math.max(1,Math.round(r.width*px));H=Math.max(1,Math.round(r.height*px));
  if(!r.width){HID=true;requestAnimationFrame(frame);return}
  if(HID){HID=false;T0=ts;last=ts;onRestart()}
  if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H}
  if(last===null)last=ts;const dt=Math.min(50,ts-last);last=ts;
  const traw=FROZEN!==null?FROZEN:(ts-T0)/1000; let t=Math.min(traw*TK,T_END);   // plays once and stops on the end state (Replay restarts it)
  const mo=reduced?0:1;
  ctx.clearRect(0,0,W,H);
  cam.yaw=(-32+1.0*Math.sin(t*6.283/14)*mo)*Math.PI/180;
  snapped=t>=T_SNAP; snapK=reduced?1:eoc((t-T_SNAP)/0.6); colK=reduced?1:eoc((t-T_SNAP)/0.5); tSpin=reduced?0.6:0.6+0.35*Math.max(0,traw-T_SNAP); fadeK=t>=T_END+T_HOLD?1-eoc((t-T_END-T_HOLD)/D_FADE):1;

  // agents: gentle drift; the target tumbles fast until it snaps still
  AG.forEach((a,i)=>{ if(!mo)return;
    const isT=i===TARGET;
    if(!isT||t<T_IN){a.vx+=(rnd()-0.5)*0.02;a.vy+=(rnd()-0.5)*0.02;a.vz+=(rnd()-0.5)*0.02;
      const sp=Math.hypot(a.vx,a.vy,a.vz),cap=0.06;if(sp>cap){a.vx*=cap/sp;a.vy*=cap/sp;a.vz*=cap/sp}
      a.x+=a.vx*dt*0.06;a.y+=a.vy*dt*0.06;a.z+=a.vz*dt*0.06;}
    const ws=isT?(snapped?4.5*(1-snapK):4.5):1;
    a.rot[0]+=a.w[0]*dt/1000*ws;a.rot[1]+=a.w[1]*dt/1000*ws;a.rot[2]+=a.w[2]*dt/1000*ws;
    if(isT&&snapped){ // settle into a three-quarter view so all four faces read, not a flat triangle
      if(!a.snapRot)a.snapRot=a.rot.slice();
      const REST=[0.62,0.78,0.35];a.rot=a.rot.map((v,i)=>{let d=((REST[i]-a.snapRot[i])%6.283+9.42)%6.283-3.14;return a.snapRot[i]+d*snapK})}});

  // camera: fly onto the target
  const A=AG[TARGET];
  if(reduced||t>=T_IN+D_IN){cam.tx=A.x;cam.ty=A.y;cam.tz=A.z;cam.zoom=ZOOM_IN;cam.cy=CY_IN}
  else if(t<T_IN){cam.tx=0;cam.ty=0;cam.tz=0;cam.zoom=1;cam.cy=0.5}
  else{const e=yank((t-T_IN)/D_IN);cam.tx=lerp(0,A.x,e);cam.ty=lerp(0,A.y,e);cam.tz=lerp(0,A.z,e);cam.zoom=lerp(1,ZOOM_IN,e);cam.cy=lerp(0.5,CY_IN,e)}

  // stars
  const zf=1+(cam.zoom-1)*0.06;
  for(const s of STARS){ctx.globalAlpha=Math.min(0.9,s.b*2)*(0.6+0.4*Math.sin(t*s.sp+s.ph)*mo)*fadeK;ctx.fillStyle=INK;
    const sx=(s.x-0.5)*zf+0.5-cam.tx*0.00035*s.d, sy=(s.y-0.5)*zf+0.5+cam.ty*0.00035*s.d;
    ctx.beginPath();ctx.arc(sx*W,sy*H,s.r*px,0,6.283);ctx.fill();}
  ctx.globalAlpha=1;

  const tb=traw-T_LANES;   // signals keep running after the animation stops (drawn after the agents, below)

  // agents (far → near)
  const drawn=[];
  AG.forEach((a,idx)=>{const V=TV.map(v=>{const q=rot3(v,a.rot);return proj(a.x+q[0]*a.r,a.y+q[1]*a.r,a.z+q[2]*a.r)});
    drawn.push({V,idx,d:V.reduce((s,p)=>s+p[2],0)/4});});
  drawn.sort((p,q)=>p.d-q.d);
  let TV_T=null;   // the focal agent's projected vertices (shared with the edge signals)
  for(const g of drawn){const dz=cl((g.d/cam.zoom-0.55)/0.6), isT=g.idx===TARGET;
    if(isT&&snapped){TV_T=solidAgent(g,dz);continue}
    ctx.strokeStyle=isT?mix(GREY,OR,colK):GREY;ctx.globalAlpha=(0.45+0.55*dz)*fadeK*(isT?1:(t>=T_IN?1-eoc((t-T_IN)/D_IN):1));
    ctx.lineWidth=(1.0+0.6*dz)*px*Math.min(1.9,Math.sqrt(cam.zoom))*(isT&&snapped?1.2:1);ctx.lineJoin='round';ctx.lineCap='round';
    ctx.beginPath();for(const [i,j] of TE){ctx.moveTo(g.V[i][0],g.V[i][1]);ctx.lineTo(g.V[j][0],g.V[j][1])}ctx.stroke();}
  ctx.globalAlpha=1;ctx.lineCap='butt';

  // edge signals on the focal agent only
  if(tb>0&&!reduced&&TV_T){const on=eoc(tb/0.4);const V=TV_T;
    EDGE_SIG.forEach((S,i)=>{const D=0.42;const c=((tb+S.ph*S.P)%S.P);if(c>D)return;let u=c/D;const dir=S.flip?-1:1;const u0=dir>0?u:1-u,u1=Math.max(0,Math.min(1,u0-dir*0.38));
      const P=(f)=>[V[S.e[0]][0]+(V[S.e[1]][0]-V[S.e[0]][0])*f,V[S.e[0]][1]+(V[S.e[1]][1]-V[S.e[0]][1])*f];const h=P(u0),tl=P(u1);
      const al=Math.pow(Math.sin(Math.PI*u),0.6)*on*fadeK;ctx.strokeStyle='#FFD9C9';ctx.lineWidth=3.4*px;ctx.lineCap='round';ctx.globalAlpha=0.95*al;ctx.beginPath();ctx.moveTo(tl[0],tl[1]);ctx.lineTo(h[0],h[1]);ctx.stroke();
      ctx.fillStyle='#FFFFFF';ctx.beginPath();ctx.arc(h[0],h[1],3*px,0,6.283);ctx.fill();});
    ctx.globalAlpha=1;ctx.lineCap='butt'}

  // headline above the agent (same treatment as the Estate hero)
  const hk=reduced?1:eoc((t-T_HEAD)/0.5);
  if(hk>0){ctx.textAlign='center';ctx.textBaseline='middle';ctx.globalAlpha=hk*fadeK;
    ctx.font='500 '+Math.round(12*px)+'px '+MONO;if('letterSpacing' in ctx)ctx.letterSpacing=(3*px)+'px';ctx.fillStyle=OR;
    ctx.fillText('DRIFT DETECTED',W/2,0.6*H+(1-hk)*6*px);if('letterSpacing' in ctx)ctx.letterSpacing='0px';
    ctx.font='300 '+Math.round(W*0.04)+'px '+SANS;ctx.fillStyle=INK;
    ctx.fillText('Caught the moment it drifts.',W/2,0.6*H+0.045*W+(1-hk)*6*px);ctx.globalAlpha=1}

  // card: on screen from t=0, dots wander, drops away at T_OUT
  if(!reduced)wander(t);
  const cardOp=t<T_OUT?1:1-eoc((t-T_OUT)/D_OUT);
  FX.style.opacity=reduced?0:cardOp*fadeK;
  FX.style.transform='translateY(-50%) scale('+(1-0.04*(1-cardOp))+')';
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
root.addEventListener('hero-replay',function(){T0=performance.now();last=null;if(typeof onRestart==='function')onRestart()});
return {cam,AG,seek:s=>{T0=performance.now()-s*1000},freeze:s=>{FROZEN=s},T_LOOP,get t(){return (performance.now()-T0)/1000}};
}
DriftHero.CSS=`
.fx.dr{position:absolute;left:16%;width:68%;top:50%;transform:translateY(-50%);pointer-events:none;opacity:1;transform-origin:50% 50%}
canvas.stage{position:absolute;inset:0;width:100%;height:100%;display:block}`;
DriftHero.HTML=`<canvas class="stage"></canvas><div class="fx dr"></div>`;

DriftHero.CARD_CSS=ALT_CARD_CSS;
DriftHero.CARD_HTML="<div class=\"d-ui\">\n      <div class=\"d-top\"><span class=\"d-name\"><span class=\"d-glyph\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#d63a32\" stroke-width=\"1.4\"><path d=\"M4 19L12 4l8 15z\"/><path d=\"M4 19l8-6 8 6M12 4v9\"/></svg></span>billing-agent</span><span class=\"d-flag\">Flagged</span></div>\n      <div class=\"d-fan\"><svg viewBox=\"0 0 384 251\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M30,125.69317251543328 L351.5,15.0 A340,340 0 0 1 351.5,236.4 Z\" fill=\"#171717\"/><path d=\"M30,125.69317251543328 L228.6,57.3 A210,210 0 0 1 228.6,194.1 Z\" fill=\"#252525\"/><path d=\"M228.6,57.3 A210,210 0 0 1 228.6,194.1\" fill=\"none\" stroke=\"#8a8a92\" stroke-width=\"1.8\" stroke-dasharray=\"6 5\"/><text x=\"233\" y=\"42\" text-anchor=\"middle\" font-family=\"IBM Plex Mono, monospace\" font-size=\"15\" letter-spacing=\"1.5\" fill=\"#a9a9b3\">BASELINE</text><circle cx=\"182.4\" cy=\"107.6\" r=\"5.2\" fill=\"#c4c4cc\" opacity=\"0.35\"/><circle cx=\"199.8\" cy=\"88.4\" r=\"5.2\" fill=\"#c4c4cc\" opacity=\"0.35\"/><circle cx=\"193.8\" cy=\"91.4\" r=\"5.2\" fill=\"#c4c4cc\" opacity=\"0.41\"/><circle cx=\"113.4\" cy=\"127.1\" r=\"5.2\" fill=\"#c4c4cc\" opacity=\"0.41\"/><circle cx=\"220.8\" cy=\"111.8\" r=\"5.2\" fill=\"#c4c4cc\" opacity=\"0.46\"/><circle cx=\"213.0\" cy=\"160.7\" r=\"5.2\" fill=\"#c4c4cc\" opacity=\"0.46\"/><circle cx=\"164.3\" cy=\"142.4\" r=\"5.2\" fill=\"#c4c4cc\" opacity=\"0.52\"/><circle cx=\"174.1\" cy=\"120.5\" r=\"5.2\" fill=\"#c4c4cc\" opacity=\"0.52\"/><circle cx=\"110.8\" cy=\"136.9\" r=\"5.2\" fill=\"#c4c4cc\" opacity=\"0.57\"/><circle cx=\"140.6\" cy=\"102.9\" r=\"5.2\" fill=\"#c4c4cc\" opacity=\"0.57\"/><circle cx=\"198.0\" cy=\"153.9\" r=\"5.2\" fill=\"#c4c4cc\" opacity=\"0.62\"/><circle cx=\"201.4\" cy=\"156.3\" r=\"5.2\" fill=\"#c4c4cc\" opacity=\"0.62\"/><circle cx=\"180.3\" cy=\"153.4\" r=\"5.2\" fill=\"#c4c4cc\" opacity=\"0.68\"/><circle cx=\"108.9\" cy=\"111.2\" r=\"5.2\" fill=\"#c4c4cc\" opacity=\"0.68\"/><circle cx=\"133.7\" cy=\"140.2\" r=\"5.2\" fill=\"#c4c4cc\" opacity=\"0.73\"/><circle cx=\"222.7\" cy=\"90.2\" r=\"5.2\" fill=\"#c4c4cc\" opacity=\"0.73\"/><circle cx=\"141.2\" cy=\"100.2\" r=\"5.2\" fill=\"#c4c4cc\" opacity=\"0.79\"/><circle cx=\"173.1\" cy=\"113.2\" r=\"5.2\" fill=\"#c4c4cc\" opacity=\"0.79\"/><circle cx=\"131.8\" cy=\"103.4\" r=\"5.2\" fill=\"#c4c4cc\" opacity=\"0.84\"/><circle cx=\"187.3\" cy=\"89.2\" r=\"5.2\" fill=\"#c4c4cc\" opacity=\"0.84\"/><circle cx=\"214.6\" cy=\"143.9\" r=\"5.2\" fill=\"#c4c4cc\" opacity=\"0.90\"/><circle cx=\"151.0\" cy=\"145.6\" r=\"5.2\" fill=\"#c4c4cc\" opacity=\"0.90\"/><circle cx=\"125.0\" cy=\"146.2\" r=\"5.2\" fill=\"#c4c4cc\" opacity=\"0.95\"/><circle cx=\"145.4\" cy=\"119.9\" r=\"5.2\" fill=\"#c4c4cc\" opacity=\"0.95\"/><circle cx=\"268.2\" cy=\"96.4\" r=\"8.5\" fill=\"#d63a32\"/><circle cx=\"282.8\" cy=\"165.7\" r=\"8.5\" fill=\"#d63a32\"/><circle cx=\"303.6\" cy=\"111.4\" r=\"8.5\" fill=\"#d63a32\"/><circle cx=\"314.5\" cy=\"191.4\" r=\"8.5\" fill=\"#d63a32\"/><circle cx=\"330.4\" cy=\"67.3\" r=\"8.5\" fill=\"#d63a32\"/><circle cx=\"351.6\" cy=\"142.5\" r=\"8.5\" fill=\"#d63a32\"/><circle cx=\"30\" cy=\"125.69317251543328\" r=\"22\" fill=\"#111\" stroke=\"#555\" stroke-width=\"1.5\"/><path d=\"M21,114.69317251543328 L42,125.69317251543328 L21,136.69317251543328 L27,125.69317251543328 Z\" fill=\"none\" stroke=\"#d63a32\" stroke-width=\"2\" stroke-linejoin=\"round\"/></svg></div>\n      <div class=\"d-bot\"><b>6 tool calls</b> outside baseline</div>\n    </div>";
/* ============ Quantify Agent Risk hero engine (v2)
   World: Aquila camera + stars (5:4 frame).
   Beat 1 · six agents sit on a shallow downward arc (the bottom of a large circle); one drops out of line.
   Beat 2 · fast zoom onto the fallen agent (bottom-left of the frame). A leader tag names it and points to a
            skeletal card: frame, ring and four category slots, drawn on.
   Beat 3 · the skeleton grows to fill the frame and resolves into the full risk profile card. Holds 2s, fades, loops. ============ */
function RiskHero(root){
const cv=root.querySelector('canvas.stage'), ctx=cv.getContext('2d');
const GREY='#8E8B86', OR='#D24A2F', INK='#EDEDEA', SK='#4A4845', SK2='#6E6B66', MONO="'IBM Plex Mono', ui-monospace, monospace";
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let seed=9182; const rnd=()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const cl=u=>u<0?0:u>1?1:u, eoc=u=>1-Math.pow(1-cl(u),3), eio=u=>{u=cl(u);return u<0.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2}, yank=u=>1-Math.pow(1-cl(u),5), lerp=(a,b,t)=>a+(b-a)*t;

// ---------- camera
const CFG={F:1480,D:1650};
const cam={yaw:-32*Math.PI/180,pitch:9,cx:0.5,cy:0.5,zoom:1,tx:0,ty:0,tz:0};
let W=1,H=1,px=1;
function proj(x,y,z){
  x-=cam.tx;y-=cam.ty;z-=cam.tz;
  const cy=Math.cos(cam.yaw),sy=Math.sin(cam.yaw),cp=Math.cos(cam.pitch*Math.PI/180),sp=Math.sin(cam.pitch*Math.PI/180);
  const xr=x*cy+z*sy, zr=-x*sy+z*cy, yr=y*cp-zr*sp, z2=y*sp+zr*cp;
  const s=CFG.F/(CFG.D-z2)*cam.zoom*(W/810);
  return [W*cam.cx+xr*s, H*cam.cy-yr*s, s];
}
const STARS=[];for(let i=0;i<95;i++)STARS.push({x:rnd(),y:rnd(),r:0.5+rnd()*0.9,b:0.10+rnd()*0.30,sp:0.5+rnd()*1.4,ph:rnd()*6.283,d:0.15+rnd()*0.5});

// ---------- six agents on a shallow arc
const N=6, AG=[], ARC_R=1100, FALLER=3;
const TV=[[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]].map(v=>v.map(c=>c/Math.sqrt(3)));
const TE=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
for(let i=0;i<N;i++){const x=-330+i*132, y=Math.sqrt(ARC_R*ARC_R-x*x)-ARC_R+20;   // bottom of a big circle, bowed down
  AG.push({x,y,z:0,hx:x,hy:y,r:24,rot:[rnd()*6.283,rnd()*6.283,rnd()*6.283],w:[0.12+rnd()*0.18,0.1+rnd()*0.15,0.08+rnd()*0.12].map(v=>v*(rnd()<0.5?-1:1))});}
function rot3(v,a){let [x,y,z]=v;const [ax,ay,az]=a;
  let y2=y*Math.cos(ax)-z*Math.sin(ax),z2=y*Math.sin(ax)+z*Math.cos(ax);y=y2;z=z2;
  let x2=x*Math.cos(ay)+z*Math.sin(ay);z2=-x*Math.sin(ay)+z*Math.cos(ay);x=x2;z=z2;
  x2=x*Math.cos(az)-y*Math.sin(az);y2=x*Math.sin(az)+y*Math.cos(az);return [x2,y2,z];}

// ---------- timeline (s)
const T_FALL=1.0, D_FALL=0.9, FALL_DY=150, T_ZOOM=2.1, D_ZOOM=0.6, T_TAG=T_ZOOM+D_ZOOM+0.1, T_CARD=T_TAG+0.3, D_CARD=2.0, T_END=T_CARD+D_CARD, T_HOLD=2.0, D_FADE=0.5, T_LOOP=T_END+T_HOLD+D_FADE;
const TK=T_END/2;   // whole hero compressed to 2.0s
const ZOOM_IN=2.6, CX_IN=0.19, CY_IN=0.82;

// ---------- Beat 3 DOM: the full risk card in a shadow root
const FX=root.querySelector('.fx'), SR=FX.attachShadow({mode:'open'});
SR.innerHTML='<style>'+RiskHero.CARD_CSS+RiskHero.DRAW_CSS+'</style>'+RiskHero.CARD_HTML;
const UI=SR.querySelector('.r-ui'); UI.style.position='relative'; UI.style.background='transparent'; UI.style.borderColor='transparent';
UI.insertAdjacentHTML('afterbegin','<div class="dr-fill"></div><svg class="dr-draw" aria-hidden="true"><rect class="dr-frame" x="0.5" y="0.5" width="calc(100% - 1px)" height="calc(100% - 1px)" rx="4" pathLength="100"/><line class="dr-rule" x1="0" y1="0" x2="100%" y2="0" pathLength="100"/></svg>');
const FR=SR.querySelector('.dr-frame'), RL=SR.querySelector('.dr-rule'), FILL=SR.querySelector('.dr-fill'), TOP=SR.querySelector('.r-top');
TOP.style.borderBottomColor='transparent';
const ELS=[TOP,SR.querySelector('.r-mapbody'),SR.querySelector('.r-foot')];
ELS.forEach(el=>{el.style.opacity=0;el.style.transform='translateY(6px)';el.style.position='relative'});
const EL_D=[0.95,1.15,1.45];
function drawUI(tu,fadeOp){
  if(tu<0){FX.style.opacity=0;return}
  FX.style.opacity=fadeOp;
  const k=reduced?1:eoc(tu/0.75); FR.style.strokeDashoffset=100-100*k;
  const kr=reduced?1:eoc((tu-0.45)/0.5); RL.style.strokeDashoffset=100-100*kr;
  FILL.style.opacity=reduced?1:eoc((tu-0.35)/0.52);
  ELS.forEach((el,i)=>{const e=reduced?1:eoc((tu-EL_D[i])/0.42);el.style.opacity=e;el.style.transform='translateY('+(6*(1-e))+'px)'});
  const h=TOP.offsetHeight; RL.setAttribute('y1',h);RL.setAttribute('y2',h);
}

// ---------- frame
let last=null,T0=performance.now(),FROZEN=null,HID=false;
function onRestart(){AG.forEach(a=>{a.y=a.hy})}
function frame(ts){
  const r=cv.getBoundingClientRect();px=devicePixelRatio||1;
  W=Math.max(1,Math.round(r.width*px));H=Math.max(1,Math.round(r.height*px));
  if(!r.width){HID=true;requestAnimationFrame(frame);return}
  if(HID){HID=false;T0=ts;last=ts;onRestart()}
  if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H}
  if(last===null)last=ts;const dt=Math.min(50,ts-last);last=ts;
  const traw=FROZEN!==null?FROZEN:(ts-T0)/1000; let t=Math.min(traw*TK,T_END);   // plays once and stops on the end state (Replay restarts it)
  const mo=reduced?0:1;
  ctx.clearRect(0,0,W,H);
  cam.yaw=(-32+1.0*Math.sin(t*6.283/14)*mo)*Math.PI/180;
  const fadeK=t>=T_END+T_HOLD?1-eoc((t-T_END-T_HOLD)/D_FADE):1;

  // the faller drops out of line (gravity: ease-in), then hangs there
  const F=AG[FALLER];
  const fk=reduced?1:cl((t-T_FALL)/D_FALL);F.y=F.hy-FALL_DY*fk*fk;
  AG.forEach((a,i)=>{if(!mo)return;const ws=(i===FALLER&&t>=T_FALL)?1+2.2*fk:1;a.rot[0]+=a.w[0]*dt/1000*ws;a.rot[1]+=a.w[1]*dt/1000*ws;a.rot[2]+=a.w[2]*dt/1000*ws});

  // camera: rapid zoom onto the faller, which lands bottom-left
  const narrow=W/px<600, ZI=narrow?2.0:ZOOM_IN, CXI=narrow?0.12:CX_IN, CYI=narrow?0.56:CY_IN;   // phone: the card runs tall, so the agent sits left-middle beside it   // phone: card runs taller than 3:2, keep the agent clear of it
  if(reduced||t>=T_ZOOM+D_ZOOM){cam.tx=F.x;cam.ty=F.y;cam.tz=F.z;cam.zoom=ZI;cam.cx=CXI;cam.cy=CYI}
  else if(t<T_ZOOM){cam.tx=0;cam.ty=0;cam.tz=0;cam.zoom=1;cam.cx=0.5;cam.cy=0.5}
  else{const e=yank((t-T_ZOOM)/D_ZOOM);cam.tx=lerp(0,F.x,e);cam.ty=lerp(0,F.y,e);cam.tz=0;cam.zoom=lerp(1,ZI,e);cam.cx=lerp(0.5,CXI,e);cam.cy=lerp(0.5,CYI,e)}

  const worldOp=fadeK;

  // stars
  const zf=1+(cam.zoom-1)*0.06;
  for(const s of STARS){ctx.globalAlpha=Math.min(0.9,s.b*2)*(0.6+0.4*Math.sin(t*s.sp+s.ph)*mo)*fadeK*(t>=T_CARD?0.5:1);ctx.fillStyle=INK;
    const sx=(s.x-0.5)*zf+0.5-cam.tx*0.00035*s.d, sy=(s.y-0.5)*zf+0.5+cam.ty*0.00035*s.d;
    ctx.beginPath();ctx.arc(sx*W,sy*H,s.r*px,0,6.283);ctx.fill();}
  ctx.globalAlpha=1;

  // agents
  let fb=null;
  AG.forEach((a,idx)=>{const k=1;   // already on screen at t=0
    const V=TV.map(v=>{const q=rot3(v,a.rot);return proj(a.x+q[0]*a.r,a.y+q[1]*a.r,a.z+q[2]*a.r)});
    const isF=idx===FALLER, hot=isF?cl((t-T_FALL)/D_FALL):0;
    ctx.strokeStyle=isF?`rgb(${Math.round(142+68*hot)},${Math.round(139-65*hot)},${Math.round(134-87*hot)})`:GREY;
    ctx.globalAlpha=k*worldOp*(isF||t<T_ZOOM?1:0.5);ctx.lineWidth=1.3*px*Math.min(1.6,Math.sqrt(cam.zoom));ctx.lineJoin='round';ctx.lineCap='round';
    ctx.beginPath();for(const [i,j] of TE){ctx.moveTo(V[i][0],V[i][1]);ctx.lineTo(V[j][0],V[j][1])}ctx.stroke();
    if(isF){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const p of V){x0=Math.min(x0,p[0]);y0=Math.min(y0,p[1]);x1=Math.max(x1,p[0]);y1=Math.max(y1,p[1])}fb=[x0,y0,x1,y1]}});
  ctx.globalAlpha=1;ctx.lineCap='butt';

  // the card's box (upper right; the agent stays in view bottom-left) and the leader tag into it
  const fr=FX.getBoundingClientRect(), hr=root.getBoundingClientRect();
  const R=[(fr.left-hr.left)*px,(fr.top-hr.top)*px,fr.width*px,fr.height*px];
  const tagK=reduced?1:eoc((t-T_TAG)/0.45);
  if(fb&&tagK>0){const ax=fb[2]+8*px,ay=(fb[1]+fb[3])/2,ex=R[0],ey=Math.min(R[1]+R[3]-10*px,ay-30*px),jog=Math.abs(ey-ay);let xk=ex-jog-14*px;if(xk<ax+10*px)xk=ax+10*px;
    ctx.strokeStyle=GREY;ctx.lineWidth=0.9*px;ctx.globalAlpha=worldOp*tagK;ctx.beginPath();ctx.moveTo(ax,ay);
    const seg=[[ax,ay],[xk,ay],[Math.min(xk+jog,ex-6*px),ey],[ex-4*px,ey]];const lens=seg.slice(1).map((p,i)=>Math.hypot(p[0]-seg[i][0],p[1]-seg[i][1]));const tot=lens.reduce((a,b)=>a+b,0);let rem=tot*tagK;
    for(let i=1;i<seg.length&&rem>0;i++){const l=lens[i-1];const q=Math.min(1,rem/l);ctx.lineTo(seg[i-1][0]+(seg[i][0]-seg[i-1][0])*q,seg[i-1][1]+(seg[i][1]-seg[i-1][1])*q);rem-=l}
    ctx.stroke();ctx.fillStyle=GREY;ctx.beginPath();ctx.arc(ax,ay,1.8*px,0,6.283);ctx.fill();
    ctx.font='500 '+Math.round(11*px)+'px '+MONO;if('letterSpacing' in ctx)ctx.letterSpacing=(2*px)+'px';ctx.textAlign='center';ctx.textBaseline='top';ctx.fillStyle=INK;ctx.globalAlpha=worldOp*tagK;
    const lw=ctx.measureText('BILLING-AGENT').width, lx=Math.max(lw/2+8*px,(fb[0]+fb[2])/2);   // keep the label inside the frame on narrow screens
    ctx.fillText('BILLING-AGENT',lx,fb[3]+12*px);ctx.fillStyle=OR;ctx.fillText('FLAGGED',lx,fb[3]+28*px);if('letterSpacing' in ctx)ctx.letterSpacing='0px';ctx.globalAlpha=1}
  drawUI(t>=T_CARD?t-T_CARD:(reduced?D_CARD:-1), fadeK);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
root.addEventListener('hero-replay',function(){T0=performance.now();last=null;if(typeof onRestart==='function')onRestart()});
return {cam,AG,seek:s=>{T0=performance.now()-s*1000},freeze:s=>{FROZEN=s},T_LOOP,get t(){return (performance.now()-T0)/1000}};
}
RiskHero.DRAW_CSS=`
.dr-fill{position:absolute;inset:0;border-radius:4px;background:var(--g1);opacity:0}
.dr-draw{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.dr-draw rect{fill:none;stroke:var(--g4);stroke-width:1;stroke-dasharray:100;stroke-dashoffset:100}
.dr-draw line{stroke:var(--g4);stroke-width:1;stroke-dasharray:100;stroke-dashoffset:100}
.r-ui>.r-top,.r-ui>.r-mapbody,.r-ui>.r-foot{position:relative}`;
RiskHero.CSS=`
.fx.rk{position:absolute;left:31%;width:64%;top:6%;transform:none;pointer-events:none;opacity:0}
canvas.stage{position:absolute;inset:0;width:100%;height:100%;display:block}`;
RiskHero.HTML=`<canvas class="stage"></canvas><div class="fx rk"></div>`;

RiskHero.CARD_CSS=ALT_CARD_CSS;
RiskHero.CARD_HTML="<div class=\"r-ui\">\n  <div class=\"r-top\"><span class=\"r-name\"><span class=\"r-glyph\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#d63a32\" stroke-width=\"1.4\"><path d=\"M4 19L12 4l8 15z\"/><path d=\"M4 19l8-6 8 6M12 4v9\"/></svg></span>billing-agent<span class=\"r-flag\">Flagged</span></span><span class=\"r-meta\">Inherent risk</span></div>\n  <div class=\"r-mapbody\">\n    <div class=\"r-cat r-t\"><b>Users &amp; Input</b><em class=\"r-hi\">High</em><small>Internal-External</small></div>\n    <div class=\"r-mid\">\n      <div class=\"r-cat r-l\"><b>Channels</b><em class=\"r-lo\">Low</em><small>Internal only</small></div>\n      <div class=\"r-ring\"><svg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M45.1,39.1 A82,82 0 0 1 154.9,39.1\" fill=\"none\" stroke=\"#d4641e\" stroke-width=\"26\"/><path d=\"M160.9,45.1 A82,82 0 0 1 160.9,154.9\" fill=\"none\" stroke=\"#d63a32\" stroke-width=\"26\"/><path d=\"M154.9,160.9 A82,82 0 0 1 45.1,160.9\" fill=\"none\" stroke=\"#d63a32\" stroke-width=\"26\"/><path d=\"M39.1,154.9 A82,82 0 0 1 39.1,45.1\" fill=\"none\" stroke=\"#1fb41f\" stroke-width=\"26\"/></svg><div class=\"r-sc\"><b>82</b><span>Critical</span><div class=\"r-tiers\"><i></i><i></i><i></i><i class=\"r-on\"></i></div></div></div>\n      <div class=\"r-cat r-r\"><b>Data</b><em class=\"r-cr\">Critical</em><small class=\"r-cr\">Restricted</small></div>\n    </div>\n    <div class=\"r-cat r-b\"><b>Actions</b><em class=\"r-cr\">Critical</em><small class=\"r-cr\">Admin \u00b7 Broad</small></div>\n  </div>\n  <div class=\"r-foot\"><span>Score version <b>53</b></span><span>Last scored <b>Sep 24, 2026</b></span></div>\n</div>";
/* ============ Optimize Agent Cost hero engine (v2)
   World: Aquila camera + stars (5:4 frame).
   Beat 1 · a chart in space: cost up the y-axis, model along the x-axis. Four agents rise left→right from
            cheapest to most expensive, each on a dotted drop line with its name above. Holds a few seconds.
   Beat 2 · the chart recedes and the Global spend card draws in; every number counts up from zero and the
            budget bar fills. Holds 2s, fades, loops. ============ */
function CostHero(root){
const cv=root.querySelector('canvas.stage'), ctx=cv.getContext('2d');
const GREY='#8E8B86', DIM='#5C5A55', OR='#D24A2F', INK='#EDEDEA', LANE='#DDD9D2', MONO="'IBM Plex Mono', ui-monospace, monospace";
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let seed=2718; const rnd=()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const cl=u=>u<0?0:u>1?1:u, eoc=u=>1-Math.pow(1-cl(u),3), eio=u=>{u=cl(u);return u<0.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2}, lerp=(a,b,t)=>a+(b-a)*t;

// ---------- camera
const CFG={F:1480,D:1650};
const cam={yaw:-32*Math.PI/180,pitch:9,cx:0.5,cy:0.5,zoom:1};
let W=1,H=1,px=1;
function proj(x,y,z){
  const cy=Math.cos(cam.yaw),sy=Math.sin(cam.yaw),cp=Math.cos(cam.pitch*Math.PI/180),sp=Math.sin(cam.pitch*Math.PI/180);
  const xr=x*cy+z*sy, zr=-x*sy+z*cy, yr=y*cp-zr*sp, z2=y*sp+zr*cp;
  const s=CFG.F/(CFG.D-z2)*cam.zoom*(W/810);
  return [W*cam.cx+xr*s, H*cam.cy-yr*s, s];
}
const STARS=[];for(let i=0;i<95;i++)STARS.push({x:rnd(),y:rnd(),r:0.5+rnd()*0.9,b:0.10+rnd()*0.30,sp:0.5+rnd()*1.4,ph:rnd()*6.283});
// text laid on the z=0 plane (playbook §4.4): matrix from the projected basis; font size divided by the basis scale
function planeText(lx,ly,str,fs,col,op,ls,anchor){
  const o=proj(lx,ly,0),ex=proj(lx+10,ly,0),ey=proj(lx,ly+10,0);
  const ax=(ex[0]-o[0])/10,ay=(ex[1]-o[1])/10,bx=-(ey[0]-o[0])/10,by=-(ey[1]-o[1])/10,vm=Math.hypot(bx,by)||1;
  ctx.save();ctx.setTransform(ax,ay,bx,by,o[0],o[1]);ctx.font='500 '+(fs*px/vm)+'px '+MONO;if('letterSpacing' in ctx)ctx.letterSpacing=(ls||0)*px/vm+'px';
  ctx.textBaseline='middle';ctx.textAlign=anchor||'left';ctx.fillStyle=col;ctx.globalAlpha=op;ctx.fillText(str,0,0);ctx.restore();ctx.globalAlpha=1}

// ---------- the chart (world units, z=0 plane)
const AX0=-330, AX1=330, AY0=-200, AY1=220;   // axes
const BARS=[{name:'SUPPORT-AGENT',model:'HAIKU',h:70},{name:'CONTENT-AGENT',model:'SONNET',h:150},{name:'RESEARCH-AGENT',model:'GPT-4O',h:250},{name:'BILLING-AGENT',model:'OPUS',h:360}];
const XS=[-200,-40,120,280];
const TV=[[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]].map(v=>v.map(c=>c/Math.sqrt(3)));
const TE=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
const AG=BARS.map((b,i)=>({x:XS[i],y:AY0+b.h,z:0,r:21,rot:[rnd()*6.283,rnd()*6.283,rnd()*6.283],w:[0.12+rnd()*0.18,0.1+rnd()*0.15,0.08+rnd()*0.12].map(v=>v*(rnd()<0.5?-1:1))}));
function rot3(v,a){let [x,y,z]=v;const [ax,ay,az]=a;
  let y2=y*Math.cos(ax)-z*Math.sin(ax),z2=y*Math.sin(ax)+z*Math.cos(ax);y=y2;z=z2;
  let x2=x*Math.cos(ay)+z*Math.sin(ay);z2=-x*Math.sin(ay)+z*Math.cos(ay);x=x2;z=z2;
  x2=x*Math.cos(az)-y*Math.sin(az);y2=x*Math.sin(az)+y*Math.cos(az);return [x2,y2,z];}

// ---------- timeline (s)
const T_AX=0.2, D_AX=0.6, T_BAR=0.7, BAR_GAP=0.3, D_BAR=0.45, T_MORPH=3.6, D_MORPH=0.9, T_UI=T_MORPH+0.55, D_UI=2.2, T_COUNT=T_UI+1.05, D_COUNT=1.3, T_END=T_COUNT+D_COUNT, T_HOLD=2.0, D_FADE=0.5, T_LOOP=T_END+T_HOLD+D_FADE;
const TK=T_END/2;   // whole hero compressed to 2.0s

// ---------- Beat 2 DOM: the Global spend card, drawn in like the other solution cards
const FX=root.querySelector('.fx'), SR=FX.attachShadow({mode:'open'});
SR.innerHTML='<style>'+CostHero.CARD_CSS+CostHero.DRAW_CSS+'</style>'+CostHero.CARD_HTML;
const UI=SR.querySelector('.ui'); UI.style.position='relative'; UI.style.background='transparent'; UI.style.borderColor='transparent';
UI.insertAdjacentHTML('afterbegin','<div class="dr-fill"></div><svg class="dr-draw" aria-hidden="true"><rect class="dr-frame" x="0.5" y="0.5" width="calc(100% - 1px)" height="calc(100% - 1px)" rx="4" pathLength="100"/><line class="dr-rule" x1="0" y1="0" x2="100%" y2="0" pathLength="100"/></svg>');
const FR=SR.querySelector('.dr-frame'), RL=SR.querySelector('.dr-rule'), FILL=SR.querySelector('.dr-fill'), TOP=SR.querySelector('.top');
TOP.style.borderBottomColor='transparent';
const BODY=SR.querySelector('.body'), ELS=[TOP.querySelector('.b-title'),BODY.children[0],BODY.children[1],BODY.children[2]];
ELS.forEach(el=>{el.style.opacity=0;el.style.transform='translateY(6px)';el.style.position='relative'});
const EL_D=[0.95,1.1,1.35,1.5];
const NUM={spend:SR.querySelector('.c-spend'),pct:SR.querySelector('.c-pct'),bud:SR.querySelector('.c-bud'),proj:SR.querySelector('.c-proj'),bar:SR.querySelector('.k-bar i')};
const fmt=n=>Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,',');
function drawUI(tu,fadeOp){
  if(tu<0){FX.style.opacity=0;return}
  FX.style.opacity=fadeOp;
  const k=reduced?1:eoc(tu/0.75); FR.style.strokeDashoffset=100-100*k;
  const kr=reduced?1:eoc((tu-0.45)/0.5); RL.style.strokeDashoffset=100-100*kr;
  FILL.style.opacity=reduced?1:eoc((tu-0.35)/0.52);
  ELS.forEach((el,i)=>{const e=reduced?1:eoc((tu-EL_D[i])/0.42);el.style.opacity=e;el.style.transform='translateY('+(6*(1-e))+'px)'});
  const c=reduced?1:eoc((tu-(T_COUNT-T_UI))/D_COUNT);   // the count-up
  NUM.spend.textContent='$'+fmt(65730*c);NUM.pct.textContent=Math.round(662*c)+'%';NUM.bud.textContent='$'+fmt(9929*c);NUM.proj.textContent='$'+fmt(82162*c);
  NUM.bar.style.width=(100*c)+'%';
  const h=TOP.offsetHeight; RL.setAttribute('y1',h);RL.setAttribute('y2',h);
}

// ---------- frame
let last=null,T0=performance.now(),FROZEN=null,HID=false;
function frame(ts){
  const r=cv.getBoundingClientRect();px=devicePixelRatio||1;
  W=Math.max(1,Math.round(r.width*px));H=Math.max(1,Math.round(r.height*px));
  if(!r.width){HID=true;requestAnimationFrame(frame);return}
  if(HID){HID=false;T0=ts;last=ts}
  if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H}
  if(last===null)last=ts;const dt=Math.min(50,ts-last);last=ts;
  let t=Math.min(FROZEN!==null?FROZEN:(ts-T0)/1000*TK,T_END);   // plays once and stops on the card (Replay restarts it)
  const mo=reduced?0:1;
  ctx.clearRect(0,0,W,H);
  cam.yaw=(-32+1.0*Math.sin(t*6.283/14)*mo)*Math.PI/180;
  const fadeK=t>=T_END+T_HOLD?1-eoc((t-T_END-T_HOLD)/D_FADE):1;
  const mk=reduced?1:eio((t-T_MORPH)/D_MORPH);           // 0 chart … 1 card frame
  const chartOp=(1-eoc(mk/0.55))*fadeK;                     // bars, labels and agents fold away as the axes become the frame

  // stars (dim a little under the card)
  for(const s of STARS){ctx.globalAlpha=Math.min(0.9,s.b*2)*(0.6+0.4*Math.sin(t*s.sp+s.ph)*mo)*fadeK*(t>=T_UI?0.5:1);ctx.fillStyle=INK;ctx.beginPath();ctx.arc(s.x*W,s.y*H,s.r*px,0,6.283);ctx.fill()}
  ctx.globalAlpha=1;

  // the card's box in canvas pixels
  const fr=FX.getBoundingClientRect(), hr=root.getBoundingClientRect();
  const R=[(fr.left-hr.left)*px,(fr.top-hr.top)*px,fr.width*px,fr.height*px];
  {
    // axes grow out of the origin, then (mk) slide into the card's left and bottom edges
    const ak=reduced?1:eoc((t-T_AX)/D_AX);const o=proj(AX0,AY0,0),xe=proj(AX0+(AX1-AX0)*ak,AY0,0),ye=proj(AX0,AY0+(AY1-AY0)*ak,0);
    const O=[lerp(o[0],R[0],mk),lerp(o[1],R[1]+R[3],mk)], XE=[lerp(xe[0],R[0]+R[2],mk),lerp(xe[1],R[1]+R[3],mk)], YE=[lerp(ye[0],R[0],mk),lerp(ye[1],R[1],mk)];
    const handK=reduced?1:eoc((t-T_UI-0.75)/0.3);            // canvas frame hands over to the card's own outline
    ctx.strokeStyle=mk<0.5?GREY:'#2c2c2c';ctx.lineWidth=1.1*px;ctx.globalAlpha=(0.9-0.4*mk)*fadeK*(1-handK);ctx.beginPath();ctx.moveTo(O[0],O[1]);ctx.lineTo(XE[0],XE[1]);ctx.moveTo(O[0],O[1]);ctx.lineTo(YE[0],YE[1]);
    if(mk>0.6){const g=eoc((mk-0.6)/0.4);const mx=R[0]+R[2]/2,my=R[1];ctx.moveTo(mx-R[2]/2*g,my);ctx.lineTo(mx+R[2]/2*g,my);const ry=R[1]+R[3]/2,rx=R[0]+R[2];ctx.moveTo(rx,ry-R[3]/2*g);ctx.lineTo(rx,ry+R[3]/2*g)}
    ctx.stroke();ctx.globalAlpha=1;
  }
  if(chartOp>0.005){
    const ak=reduced?1:eoc((t-T_AX)/D_AX);const o=proj(AX0,AY0,0);
    // ticks on the y-axis
    ctx.globalAlpha=0.6*chartOp*ak;[0.33,0.66,1].forEach(f=>{const ty=AY0+(AY1-AY0)*f-20;const a=proj(AX0-8,ty,0),b=proj(AX0,ty,0);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke()});
    const lk=eoc((t-T_AX-0.35)/0.4);
    if(lk>0){planeText(AX0-16,AY1+6,'COST / MO',11,GREY,0.9*lk*chartOp,1.5,'right');planeText(AX1+10,AY0,'MODEL',11,GREY,0.9*lk*chartOp,1.5,'left');
      planeText(AX0-14,AY0+(AY1-AY0)*0.33-20,'$25K',9.5,DIM,lk*chartOp,1,'right');planeText(AX0-14,AY0+(AY1-AY0)*0.66-20,'$50K',9.5,DIM,lk*chartOp,1,'right');planeText(AX0-14,AY0+(AY1-AY0)-20,'$75K',9.5,DIM,lk*chartOp,1,'right');}
    // bars: dotted drop line draws up, the agent pops in at the top, name above, model below the axis
    BARS.forEach((b,i)=>{const bk=reduced?1:eoc((t-T_BAR-i*BAR_GAP)/D_BAR);if(bk<=0)return;const a=AG[i];
      if(mo){a.rot[0]+=a.w[0]*dt/1000;a.rot[1]+=a.w[1]*dt/1000;a.rot[2]+=a.w[2]*dt/1000}
      const p0=proj(a.x,AY0,0),p1=proj(a.x,AY0+(b.h-24)*bk*(1-mk),0);   // drop lines sink back into the axis as it becomes the frame
      ctx.setLineDash([2*px,5*px]);ctx.lineCap='round';ctx.strokeStyle=LANE;ctx.lineWidth=1.2*px;ctx.globalAlpha=0.5*chartOp;ctx.beginPath();ctx.moveTo(p0[0],p0[1]);ctx.lineTo(p1[0],p1[1]);ctx.stroke();ctx.setLineDash([]);
      const pk=eoc((bk-0.6)/0.4);if(pk>0){const pop=1+0.35*(1-eoc((bk-0.6)/0.3));
        const V=TV.map(v=>{const q=rot3(v,a.rot);return proj(a.x+q[0]*a.r*pop,a.y+q[1]*a.r*pop,a.z+q[2]*a.r*pop)});
        const hot=i/(BARS.length-1);ctx.strokeStyle=`rgb(${Math.round(142+68*hot)},${Math.round(139-65*hot)},${Math.round(134-87*hot)})`;   // grey → orange as cost rises
        ctx.lineWidth=1.3*px;ctx.lineJoin='round';ctx.globalAlpha=pk*chartOp;ctx.beginPath();for(const [m,n] of TE){ctx.moveTo(V[m][0],V[m][1]);ctx.lineTo(V[n][0],V[n][1])}ctx.stroke();
        planeText(a.x,a.y+38,b.name,11,INK,0.9*pk*chartOp,1.5,'center');planeText(a.x,AY0-18,b.model,10,GREY,0.9*pk*chartOp,1.5,'center');}
      ctx.globalAlpha=1;ctx.lineCap='butt'});
  }

  drawUI(t>=T_UI?t-T_UI:(reduced?D_UI+D_COUNT:-1), fadeK);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
root.addEventListener('hero-replay',function(){T0=performance.now();last=null;if(typeof onRestart==='function')onRestart()});
return {cam,AG,seek:s=>{T0=performance.now()-s*1000},freeze:s=>{FROZEN=s},T_LOOP,get t(){return (performance.now()-T0)/1000}};
}
CostHero.DRAW_CSS=`
.dr-fill{position:absolute;inset:0;border-radius:4px;background:var(--g1);opacity:0}
.dr-draw{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.dr-draw rect{fill:none;stroke:var(--g4);stroke-width:1;stroke-dasharray:100;stroke-dashoffset:100}
.dr-draw line{stroke:var(--g4);stroke-width:1;stroke-dasharray:100;stroke-dashoffset:100}
.ui>.top,.ui>.body,.ui>.foot{position:relative}
.k-num{font-variant-numeric:tabular-nums}`;
CostHero.CSS=`
.fx.co{position:absolute;left:16%;width:68%;top:50%;transform:translateY(-50%);pointer-events:none;opacity:0}
canvas.stage{position:absolute;inset:0;width:100%;height:100%;display:block}`;
CostHero.HTML=`<canvas class="stage"></canvas><div class="fx co"></div>`;

CostHero.CARD_CSS=ALT_CARD_CSS;
CostHero.CARD_HTML="<div class=\"ui big\">\n      <div class=\"top\"><span class=\"b-title\">Global spend<small>Month to date \u00b7 Resets Sep 30</small></span></div>\n      <div class=\"body\">\n        <div><div class=\"k-num c-spend\">$65,730</div><div class=\"k-lbl\">Spent this month</div></div>\n        <div class=\"k-bar\"><i></i></div>\n        <div class=\"k-over\"><span><b class=\"c-pct\">662%</b> of <span class=\"c-bud\">$9,929</span> budget</span><span class=\"k-vs\"><span class=\"c-proj\">$82,162</span> projected</span></div>\n      </div>\n    </div>";
;
/* estate-hero-c.engine.js */
/* ============ Agent Estate hero C (2026-10-02): create a control, apply it across the estate. Two modes (root data-emode):
   'chris'  (Chris's spec, ~3.0s): three red, flickering agents on the perimeter; grey boxes draw around each; the "Create control"
            window draws into existence in the center; the user types "Block sensitive credentials like API keys or passwords in
            prompts.", presses enter (the send arrow brightens to white); a checklist of the three agents ticks off one by one
            (Enforced), each agent turning from red to green as its row ticks; then "Control applied to 3 agents" with a checkmark. Helix chat styling; no breadcrumb.
   'claude' (Claude's version, ≤2.0s): the same agents, labeled with three different platforms. The window draws in and a shorter
            prompt types fast; as the words land, the control compiles live into chips (Detects · Action · Scope). The grey boxes
            draw at the moment the Scope chip appears (the boxes ARE the scope). Send lights; a checklist of the three agents ticks
            off one by one, each tick sending a pulse down a line to its agent, which stops flickering and settles to white.
            Ends on "Control applied to 3 agents". Green is used only for the checkmarks.
   Window draw-in = the Shadow Agents card: #2c2c2c line traces and stays as the border, fill fades, contents rise 6px, plus a light
   spring as the outline closes. Red flicker = the Risk hero's signal-drop track. Stars; no glow; Host Grotesk + IBM Plex Mono. ============ */
function EstateHeroC(root){
const MODE=root.dataset.emode||'claude',C=MODE==='claude';
const cv=root.querySelector('canvas.stage'),ctx=cv.getContext('2d'),WIN=root.querySelector('.es-win');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const cl=u=>u<0?0:u>1?1:u, eoc=u=>1-Math.pow(1-cl(u),3), eio=u=>{u=cl(u);return u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2};
function rng(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const rs=rng(4471),STARS=[];for(let i=0;i<95;i++)STARS.push({x:rs(),y:rs(),r:0.5+rs()*0.9,b:0.10+rs()*0.30,sp:0.5+rs()*1.4,ph:rs()*6.283});
const TV=[[0,1,0],[0.943,-0.333,0],[-0.471,-0.333,0.816],[-0.471,-0.333,-0.816]],TE=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
// signal-drop flicker (the Risk hero's track): irregular hard cuts and fades, plus the odd edge dropping out
const LOOP=2.4,SEG=(function(){const r=rng(7),s=[];let t=0;while(t<LOOP){const d=0.04+r()*0.11,x=r(),lv=x<0.28?0.08+r()*0.1:(x<0.55?0.35+r()*0.3:0.8+r()*0.2);s.push({t,d,lv,fade:r()<0.5});t+=d}s[s.length-1].d+=LOOP-t;s[s.length-1].lv=s[0].lv;return s})();
function signal(t){t=((t%LOOP)+LOOP)%LOOP;let prev=SEG[SEG.length-1].lv;for(const g of SEG){if(t<g.t+g.d){const k=g.fade?eio((t-g.t)/g.d):1;return prev+(g.lv-prev)*k}prev=g.lv}return prev}
const DROP=(function(){const r=rng(21),o=[];for(let i=0;i<12;i++)o.push({t:r()*LOOP,d:0.04+r()*0.07,e:Math.floor(r()*6)});return o})();
function hex(h){return [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]}
function mix(a,b,u){const A=hex(a),B=hex(b);return 'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*cl(u))).join(',')+')'}
// ---------- the three agents on the perimeter, clear of the center window
const AG=[{x:.12,y:.24,ph:0.0,label:'marketing-agent-claude'},{x:.88,y:.5,ph:0.8,label:'gemini-research-agent'},{x:.12,y:.78,ph:1.6,label:'codex-deploy-agent'}];
// on a phone the window is the centerpiece: the agents move to a row along the top and the window runs nearly full width below
const AGN=[{x:.2,y:.5},{x:.5,y:.5},{x:.8,y:.5}];
// ---------- timeline
const TW=C?{win:[0.12,0.62],type:[0.5,1.08],chips:[0.74,0.9,1.06],box:[1.06,1.36],send:1.14,tick:[1.32,1.48,1.64],done:1.82,settle:0.3}
         :{box:[0.25,0.75],win:[0.55,1.30],type:[1.05,2.25],send:2.38,tick:[2.56,2.72,2.88],done:3.06,settle:0.3};
function shift(o,d,keep){const n={};for(const k in o){const v=o[k];n[k]=keep.indexOf(k)>=0?v:Array.isArray(v)?v.map(a=>a+d):(typeof v==='number'&&k!=='settle'?v+d:v)}return n}
const TN=Object.assign(shift(TW,0.45,['box']),{box:[0.15,0.55]});   // phone: agents first, boxes, then the UI covers them
let T=TW;
const PROMPT=C?'Block API keys and passwords in prompts':'Block sensitive credentials like API keys or passwords in prompts.';
// ---------- window markup
const CHECK='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7"/></svg>';
const CCHK='<svg viewBox="0 0 24 24" fill="none" stroke="#47D553" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path class="es-ck" d="M7.5 12.4l3 3 6-6.8" pathLength="1"/></svg>';
const SENDSVG='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.2 2.6l11.6 5.1c.3.1.3.5 0 .6L2.2 13.4c-.3.1-.6-.2-.5-.5L3.4 8.6 9 8 3.4 7.4 1.7 3.1c-.1-.3.2-.6.5-.5z" fill="currentColor"/></svg>';
if(!C){WIN.innerHTML='<div class="es-fill"></div><svg class="es-draw" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0H100V100" pathLength="100"/><path d="M0 0V100H100" pathLength="100"/></svg>'+
 '<div class="hx">'+
 '<div class="hx-hd" data-el><span class="hx-title">Create control</span></div>'+
 '<div class="hx-body"><div class="es-field hx-field" data-el><span class="hx-ph">Write a message…</span><span class="es-txt"></span><i class="es-caret"></i><b class="es-send hx-send">'+SENDSVG+'</b></div>'+
 '<ul class="es-list hx-list">'+AG.map(a=>'<li><span class="es-box">'+CHECK+'</span>'+a.label+'<em>Enforced</em></li>').join('')+'</ul>'+
 '<div class="es-done hx-ai">'+CCHK+'<span>Control applied to <b>3 agents</b>.</span></div></div>'+
 '</div>'}
else WIN.innerHTML='<div class="es-fill"></div><svg class="es-draw" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0H100V100" pathLength="100"/><path d="M0 0V100H100" pathLength="100"/></svg>'+
 '<div class="es-in">'+
 '<div class="es-hd" data-el><span class="es-k">Controls · New</span><span class="es-t">Create control</span></div>'+
 '<div class="es-field" data-el><span class="es-txt"></span><i class="es-caret"></i><b class="es-send"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 13V3M3.5 7.5L8 3l4.5 4.5"/></svg></b></div>'+
 (C?'<div class="es-chips"><span class="es-chip"><em>Detects</em>Secrets · API keys, passwords</span><span class="es-chip"><em>Action</em><b class="no">Block</b></span><span class="es-chip"><em>Scope</em>3 agents</span></div>'+
    '<ul class="es-list">'+AG.map(a=>'<li><span class="es-box">'+CHECK+'</span>'+a.label+'<em>Enforced</em></li>').join('')+'</ul>':'')+
 '<div class="es-done">'+CCHK+'<span>Control applied to 3 agents</span></div>'+
 '</div>';
const FILL=WIN.querySelector('.es-fill'),DRAW=[].slice.call(WIN.querySelectorAll('.es-draw path')),ELS=[].slice.call(WIN.querySelectorAll('[data-el]'));
const TXT=WIN.querySelector('.es-txt'),CARET=WIN.querySelector('.es-caret'),SEND=WIN.querySelector('.es-send'),DONE=WIN.querySelector('.es-done'),CK=WIN.querySelector('.es-ck');
const CHIPS=[].slice.call(WIN.querySelectorAll('.es-chip')),ROWS=[].slice.call(WIN.querySelectorAll('.es-list li'));
const ME=WIN.querySelector('.hx-me'),PH=WIN.querySelector('.hx-ph');if(ME)ME.textContent=PROMPT;
WIN.classList.toggle('is-claude',C);WIN.classList.toggle('is-chris',!C);
let T0=performance.now();root.addEventListener('hero-replay',()=>{T0=performance.now()});
function rot(v,a,b){let x=v[0],y=v[1],z=v[2],t;t=y*Math.cos(a)-z*Math.sin(a);z=y*Math.sin(a)+z*Math.cos(a);y=t;t=x*Math.cos(b)+z*Math.sin(b);z=-x*Math.sin(b)+z*Math.cos(b);x=t;return [x,y,z]}
function spring(tau,amp){if(tau<=0)return 1;return 1+amp*Math.exp(-6.5*tau)*Math.sin(tau*19)}
function frame(now){
  const r=root.getBoundingClientRect();if(!r.width){requestAnimationFrame(frame);return}
  const px=devicePixelRatio||1,W=Math.round(r.width*px),H=Math.round(r.height*px);
  if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H}
  const t=reduced?4:Math.max(0,(now-T0)/1000),narrow=r.width<520;root.querySelector('.esh').classList.toggle('is-narrow',narrow);T=TW;if(narrow){WIN.style.top=Math.max(0,(r.height-WIN.offsetHeight)/2)+'px'}else WIN.style.top='';
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='#EDEDEA';for(const s of STARS){ctx.globalAlpha=Math.min(0.9,s.b*2)*(0.6+0.4*Math.sin(t*s.sp+s.ph));ctx.beginPath();ctx.arc(s.x*W,s.y*H,s.r*px,0,6.283);ctx.fill()}ctx.globalAlpha=1;
  // ---------- window: Shadow Agents draw-in (+ a light spring when the outline closes)
  const wk=reduced?1:eoc((t-T.win[0])/(T.win[1]-T.win[0]));
  WIN.style.visibility=wk>0?'visible':'hidden';
  DRAW.forEach(p=>p.style.strokeDashoffset=(100-100*wk).toFixed(2));
  FILL.style.opacity=reduced?1:eoc((t-(T.win[0]+(T.win[1]-T.win[0])*0.45))/0.5);
  WIN.style.transform='none';   // no bounce on the window
  WIN.classList.toggle('drawn',wk>=1);DRAW.forEach(p=>p.style.opacity=wk>=1?0:1);   // the traced line hands over to an even 1px border
  ELS.forEach((el,i)=>{const k=reduced?1:eoc((t-(T.win[0]+0.3+i*0.1))/0.42);el.style.opacity=k;el.style.transform='translateY('+(6*(1-k))+'px)'});
  // typing, caret, send
  const tk=reduced?1:cl((t-T.type[0])/(T.type[1]-T.type[0])),sent=reduced||t>=T.send+0.05;
  TXT.textContent=PROMPT.slice(0,Math.ceil(PROMPT.length*tk));
  if(PH)PH.style.opacity=tk<=0?1:0;
  if(ME){const mk=reduced?1:eoc((t-T.send-0.05)/0.3);ME.style.opacity=mk;ME.style.transform='translateY('+(10*(1-mk))+'px)'}
  CARET.style.opacity=(tk<1&&t>T.type[0]-0.2)?((Math.floor(t*6)%2)?0.2:1):(t<T.send?((Math.floor(t*3)%2)?0:1):0);
  const sk=reduced?1:cl((t-T.send)/0.12);SEND.classList.toggle('lit',t>=T.send||reduced);SEND.style.transform='scale('+(t>=T.send&&t<T.send+0.14&&!reduced?0.88:1)+')';
  // chips (claude) compile in as the words land
  CHIPS.forEach((c,i)=>{const k=reduced?1:eoc((t-T.chips[i])/0.22);c.style.opacity=k;c.style.transform='translateY('+(5*(1-k))+'px)'});
  // checklist (claude): rows appear after send, then tick one by one
  ROWS.forEach((li,i)=>{const k=reduced?1:eoc((t-(T.send+0.05+i*0.05))/0.25);li.style.opacity=k;li.classList.toggle('ticked',reduced||t>=T.tick[i])});
  // final confirmation + checkmark stroke
  const dk=reduced?1:eoc((t-T.done)/0.3);DONE.style.opacity=dk;DONE.style.transform='translateY('+(5*(1-dk))+'px)';CK.style.strokeDashoffset=(1-(reduced?1:eoc((t-T.done-0.05)/0.3))).toFixed(3);
  // ---------- agents, boxes, lines
  const wr=WIN.getBoundingClientRect(),sr=root.getBoundingClientRect();
  AG.forEach((a,i)=>{
    const pos=narrow?AGN[i]:a;let cx=pos.x*W,cy=pos.y*H,R0=W*(narrow?0.06:0.036),wTop=0,wBot=0;if(narrow){wTop=(wr.top-sr.top)*px;wBot=(wr.bottom-sr.top)*px;const up=i<2,gap=up?wTop:H-wBot;R0=Math.max(4*px,Math.min(W*0.021,gap*0.2));cy=up?wTop/2:(wBot+H)/2;cx=(up?(i===0?0.3:0.7):0.5)*W;}
    // state: red + flickering until the control reaches this agent, then settled
    const settleAt=T.tick[i]+0.12,gk=reduced?1:eoc((t-settleAt)/T.settle);   // each agent settles as its checklist row ticks
    const goal=C?'#EDEDEA':'#47D553',col=mix('#FF4436',goal,gk);
    const sig=1-(1-signal(t+a.ph))*(1-gk),spin=t*(0.9-0.6*gk);
    const P=TV.map(v=>{const q=rot(v,0.6+spin*0.55+a.ph,0.3+spin*0.9),s=3/(3-q[2]);return [cx+q[0]*R0*s,cy-q[1]*R0*s,q[2]]});
    const tm=((t+a.ph)%LOOP+LOOP)%LOOP;
    ctx.strokeStyle=col;ctx.lineCap='round';ctx.lineJoin='round';
    TE.forEach((e,ei)=>{if(gk<0.5&&!reduced&&DROP.some(d=>d.e===ei&&tm>=d.t&&tm<d.t+d.d))return;const d=(P[e[0]][2]+P[e[1]][2])/2;
      ctx.globalAlpha=sig*(0.6+0.4*(d+1)/2);ctx.lineWidth=(1.6+0.8*(d+1)/2)*px;ctx.beginPath();ctx.moveTo(P[e[0]][0],P[e[0]][1]);ctx.lineTo(P[e[1]][0],P[e[1]][1]);ctx.stroke()});
    ctx.globalAlpha=1;
    // grey box: chris = after the agents appear; claude = when the Scope chip lands
    const h=R0*(narrow?1.55:1.9),s=2*h,bk=reduced?1:eoc((t-(C?T.box[0]:T.box[0]+i*0.1))/(T.box[1]-T.box[0]));
    if(bk>0){ctx.strokeStyle='#8E8B86';ctx.lineWidth=1.2*px;ctx.setLineDash([4*s*bk,4*s]);ctx.beginPath();ctx.rect(cx-h,cy-h,s,s);ctx.stroke();ctx.setLineDash([])}
    // labels (claude): the platform under each agent
    if(C&&!narrow){ctx.font='500 '+Math.max(8,W/px*0.018)*px+'px "IBM Plex Mono", ui-monospace, monospace';ctx.textAlign='center';ctx.fillStyle='#8E8B86';ctx.globalAlpha=reduced?1:eoc((t-T.box[0])/0.3);
      if('letterSpacing' in ctx)ctx.letterSpacing=(0.08*Math.max(8,W/px*0.018)*px)+'px';ctx.fillText(a.label.toUpperCase(),cx,cy+h+Math.max(12,W/px*0.03)*px);if('letterSpacing' in ctx)ctx.letterSpacing='0px';ctx.globalAlpha=1}
    // propagation line (claude): window edge → agent box; a green pulse travels down it on the tick
    if(wk>=1&&narrow){const lk=reduced?1:eoc((t-(T.tick[i]-0.12))/0.14);if(lk>0){const up=i<2,sy=up?cy+h:cy-h,ey=up?wTop:wBot,dd=(ey-sy)*lk;ctx.globalAlpha=0.9;ctx.strokeStyle='#8E8B86';ctx.lineWidth=1*px;ctx.beginPath();ctx.moveTo(cx,sy);ctx.lineTo(cx,sy+dd);ctx.stroke();ctx.fillStyle='#8E8B86';ctx.beginPath();ctx.arc(cx,sy,1.8*px,0,6.283);ctx.fill();if(lk>=1){ctx.beginPath();ctx.arc(cx,ey,1.8*px,0,6.283);ctx.fill()}ctx.globalAlpha=1}}if(C&&wk>=1&&!narrow){const ex=(a.x<0.5?wr.left-sr.left:wr.right-sr.left)*px,row=ROWS[i].getBoundingClientRect(),ey=(row.top-sr.top+row.height/2)*px,bx=a.x<0.5?cx+h:cx-h;
      const lk=reduced?1:eoc((t-(T.tick[i]-0.12))/0.14);if(lk>0){ctx.strokeStyle='#4A4845';ctx.lineWidth=1*px;ctx.beginPath();ctx.moveTo(ex,ey);const mx=(ex+bx)/2;ctx.lineTo(mx,ey);ctx.lineTo(mx,cy);ctx.lineTo(ex+(bx-ex)*lk,cy);ctx.stroke();
        const pk=reduced?2:(t-T.tick[i])/0.16;if(pk>0&&pk<1){const L1=Math.abs(mx-ex),L2=Math.abs(cy-ey),L3=Math.abs(bx-mx),d=(L1+L2+L3)*pk;let qx,qy;
          if(d<L1){qx=ex+Math.sign(mx-ex)*d;qy=ey}else if(d<L1+L2){qx=mx;qy=ey+Math.sign(cy-ey)*(d-L1)}else{qx=mx+Math.sign(bx-mx)*(d-L1-L2);qy=cy}
          ctx.fillStyle='#47D553';ctx.beginPath();ctx.arc(qx,qy,2.4*px,0,6.283);ctx.fill()}}}
  });
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
return {T_END:C?2:3};
}
EstateHeroC.CSS=`
.esh{position:absolute;inset:0;container-type:inline-size;font-family:"Host Grotesk Variable","Host Grotesk",-apple-system,"Helvetica Neue",Arial,sans-serif}
.esh canvas.stage{position:absolute;inset:0;width:100%;height:100%;display:block}
.es-win{position:absolute;left:25%;right:25%;top:20%;visibility:hidden;transform-origin:0 0;border:1px solid transparent;border-radius:2px;--l2:#e2e2ea;--l1:#a9a9b3;--hair:#2c2c2c;--mono:"IBM Plex Mono",ui-monospace,Menlo,monospace}
.es-win.is-claude{top:9%}
.es-fill{position:absolute;inset:0;background:#141414;border-radius:1px;opacity:0}
.es-win.drawn{border-color:#2c2c2c}
.es-draw{position:absolute;inset:-1px;width:calc(100% + 2px);height:calc(100% + 2px);overflow:visible;pointer-events:none}
.es-draw path{fill:none;stroke:#2c2c2c;stroke-width:1;vector-effect:non-scaling-stroke;stroke-dasharray:100;stroke-dashoffset:100}
.es-in{position:relative;padding:3cqw 3.2cqw 3cqw;display:flex;flex-direction:column;gap:2.2cqw}
.es-hd{display:flex;flex-direction:column;gap:1.1cqw}
.es-k{font:500 max(7px,1.35cqw)/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:#767c7e}
.es-t{font-weight:600;font-size:max(13px,3.2cqw);line-height:1.05;color:#fff}
.es-field{display:flex;align-items:center;gap:.6cqw;min-height:6.4cqw;padding:1.3cqw 1.3cqw 1.3cqw 2cqw;border:1px solid #2c2c2c;border-radius:2px;background:#0f0f0f;font-size:max(9px,1.9cqw);line-height:1.35;color:var(--l2)}
.es-txt{flex:1;min-width:0}
.es-caret{display:inline-block;width:2px;height:2.3cqw;background:#e2e2ea;margin-left:-.3cqw;flex:none}
.es-send{flex:none;margin-left:auto;width:4.6cqw;height:4.6cqw;min-width:18px;min-height:18px;border-radius:2px;border:1px solid #2c2c2c;display:grid;place-items:center;color:#767c7e;transition:background .12s,color .12s,border-color .12s}
.es-send svg{width:55%;height:55%}
.es-send.lit{background:#d24a2f;border-color:#d24a2f;color:#fff}
.es-chips{display:flex;flex-wrap:wrap;gap:1cqw}
.es-chip{opacity:0;display:inline-flex;align-items:baseline;gap:.9cqw;padding:.9cqw 1.2cqw;border:1px solid #2c2c2c;border-radius:2px;font-size:max(8px,1.55cqw);color:var(--l2);white-space:nowrap}
.es-chip em{font:500 max(6.5px,1.15cqw)/1 var(--mono);font-style:normal;letter-spacing:.12em;text-transform:uppercase;color:#767c7e}
.es-chip b{font-weight:500}.es-chip b.no{color:#E24840}
.es-list{list-style:none;margin:0;padding:0;border-top:1px solid var(--hair)}
.es-list li{opacity:0;display:flex;align-items:center;gap:1.4cqw;padding:1.1cqw 0;border-bottom:1px solid var(--hair);font:500 max(8px,1.7cqw)/1.2 var(--mono);color:var(--l2)}
.es-list li em{margin-left:auto;font:500 max(6.5px,1.15cqw)/1 var(--mono);font-style:normal;letter-spacing:.12em;text-transform:uppercase;color:#47D553;opacity:0;transition:opacity .15s}
.es-list li.ticked em{opacity:1}
.es-box{width:2.4cqw;height:2.4cqw;min-width:10px;min-height:10px;border:1px solid #4A4845;border-radius:2px;display:grid;place-items:center;color:#050505;flex:none;transition:background .12s,border-color .12s}
.es-box svg{width:80%;height:80%;opacity:0}
.es-list li.ticked .es-box{background:#47D553;border-color:#47D553}
.es-list li.ticked .es-box svg{opacity:1}
.es-done{opacity:0;display:flex;align-items:center;gap:1.4cqw;font-weight:500;font-size:max(11px,2.3cqw);line-height:1.15;color:#fff}
.es-done svg{width:3.6cqw;height:3.6cqw;min-width:14px;min-height:14px;flex:none}
.es-ck{stroke-dasharray:1;stroke-dashoffset:1}
.esh.is-narrow .es-win,.esh.is-narrow .es-win.is-chris,.esh.is-narrow .es-win.is-claude{left:5%;right:5%;top:8%}
.esh.is-narrow .hx-hd{gap:6px;padding:9px 14px 8px}
.esh.is-narrow .hx-crumb{font-size:11px}
.esh.is-narrow .hx-title{font-size:18px}
.esh.is-narrow .hx-body{gap:7px;padding:8px 14px 9px}
.esh.is-narrow .hx-field{font-size:14px;line-height:1.3;min-height:40px;padding:7px 8px 7px 11px}
.esh.is-narrow .hx-field .es-caret{height:17px}
.esh.is-narrow .hx-list li{font-size:12px;padding:3px 0}
.esh.is-narrow .hx-list .es-box{width:12px;height:12px}
.esh.is-narrow .hx-send{width:24px;height:24px}
.esh.is-narrow .es-done.hx-ai{font-size:15px;gap:8px}
.esh.is-narrow .es-done.hx-ai svg{width:19px;height:19px}
.esh.is-narrow .es-in{padding:12px 14px;gap:9px}.esh.is-narrow .es-t{font-size:18px}.esh.is-narrow .es-field{font-size:14px}.esh.is-narrow .es-list li{font-size:12px;padding:5px 0}.esh.is-narrow .es-chip{font-size:11px}
/* Chris's version: compact card with the Helix chat styling (breadcrumb, condensed uppercase title over a rule, dark message bar, paper-plane send) */
.es-win.is-chris{top:13%;left:24%;right:24%}
.hx{position:relative;display:flex;flex-direction:column}
.hx-hd{display:flex;flex-direction:column;gap:1.2cqw;padding:3cqw 3.4cqw 2.8cqw;border-bottom:1px solid #2c2c2c}
.hx-crumb{font-size:max(9px,1.75cqw);line-height:1;color:#a9a9b3}
.hx-title{font:700 max(16px,4.6cqw)/1 var(--mono);letter-spacing:.01em;text-transform:uppercase;color:#e2e2ea}
.hx-body{display:flex;flex-direction:column;gap:2.6cqw;padding:3cqw 3.4cqw 3.2cqw}
.hx-field{position:relative;background:#121212;min-height:8cqw;padding:1.8cqw 1.6cqw 1.8cqw 2.2cqw;font-size:max(11px,2.3cqw);line-height:1.35;color:#e2e2ea}
.hx-field .es-caret{height:2.8cqw}
.hx-ph{position:absolute;left:2.2cqw;top:50%;transform:translateY(-50%);color:#6c6f6c;pointer-events:none}
.hx-send{border:0;background:transparent;color:#bfb6a8;width:4.8cqw;height:4.8cqw}
.hx-send svg{width:62%;height:62%}
.hx-send.lit{background:transparent;color:#fff;border:0}
.hx-list li{font-size:max(10px,2cqw);padding:1.2cqw 0}
.hx-list .es-box{width:2.6cqw;height:2.6cqw}
.hx-list li{font-size:max(10px,2cqw);padding:1.2cqw 0}
.hx-list .es-box{width:2.6cqw;height:2.6cqw}
.es-done.hx-ai{font-weight:400;font-size:max(12px,2.6cqw);color:#e2e2ea;gap:1.4cqw}
.es-done.hx-ai b{font-weight:600;color:#fff}
.es-done.hx-ai svg{width:3.8cqw;height:3.8cqw}`;
EstateHeroC.HTML=`<div class="esh"><canvas class="stage"></canvas><div class="es-win"></div></div>`;
;

/* ---- boot (production): mounts EstateHeroC into [data-embed="shadow-hero"] once the DOM is ready. Replaces the prototype's review-only hero switch. ---- */
(function(){
  var CSS2='/* v171: Agent Estate window spacing tightened in the narrow (desktop 1/3 + phone) layout so the agents above and below can match the Endpoints agents. Content unchanged. */\n.esh.is-narrow .es-win .hx-hd{padding:7px 14px 6px!important;gap:4px!important}\n.esh.is-narrow .es-win .hx-body{gap:5px!important;padding:6px 14px 7px!important}\n.esh.is-narrow .es-win .hx-field{padding:5px 8px 5px 11px!important;min-height:34px!important}\n.esh.is-narrow .es-win .hx-list li{padding:2px 0!important}';
  function boot(){var host=document.querySelector('[data-embed="shadow-hero"]');if(!host||host.getAttribute('data-hero-mounted'))return;
    if(typeof EstateHeroC!=='function')return;host.setAttribute('data-hero-mounted','1');var E=EstateHeroC;
    var st=document.createElement('style');st.textContent=E.CSS+(CSS2?'\n'+CSS2:'');document.head.appendChild(st);
    host.innerHTML=E.HTML;host.dataset.emode='chris';E(host);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
