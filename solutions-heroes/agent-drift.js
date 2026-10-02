/*! Alterion solutions hero: Stop agent drift (agent-drift). Desktop and mobile in one file: the animation adapts to its container width (phone layout under 520px).
   Embed: <div data-alterion-hero="agent-drift" style="aspect-ratio:5/4;width:100%"></div> + this script. */
(function(){
/* drift-hero-b.engine.js */
/* ============ Drift hero B (2026-10-01): an agent drifts out of line → anomaly window. Whole hero ≤ 2.0s.
   System language: Aquila camera (yaw −32°, pitch 9°, slow ±1° sway), 95-star field, thin grey wireframe agents, no glows.
   0.00–1.00  six agents sit in line on a shallow arc (the old Risk & Compliance opening); one drifts out of line and eases
              down to the bottom of the frame, turning from grey to amber (#C9931F, system turmeric) as it goes.
   0.85–1.65  above it, a UI window draws into existence (outline traces, fill fades, contents stagger):
              ⚠ Anomaly detected · billing-agent / rule / ✕ Cost inefficiency + 1–2 line explainer / CTA (copy TBD).
   0.95–1.25  a thin line drops from the window to the drifted agent; the agents still in line dim back.
   One instance per root (root holds canvas.stage + .fx.db). ============ */
function DriftHeroB(root){
const cv=root.querySelector('canvas.stage'), ctx=cv.getContext('2d');
const GREY='#8E8B86', INK='#EDEDEA', AMBER='#C9931F';
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const cl=u=>u<0?0:u>1?1:u, eoc=u=>1-Math.pow(1-cl(u),3), eio=u=>{u=cl(u);return u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2}, lerp=(a,b,t)=>a+(b-a)*t;
function rng(seed){return ()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const rnd=rng(9182);
function hex(h){return [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]}
function mix(a,b,t){const A=hex(a),B=hex(b);return 'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*cl(t))).join(',')+')'}

// ---------- Aquila camera
const CFG={F:1480,D:1650}, cam={yaw:-32*Math.PI/180,pitch:9,cx:0.5,cy:0.3,zoom:1};
let W=1,H=1,px=1;
function proj(x,y,z){const cy=Math.cos(cam.yaw),sy=Math.sin(cam.yaw),cp=Math.cos(cam.pitch*Math.PI/180),sp=Math.sin(cam.pitch*Math.PI/180);
  const xr=x*cy+z*sy,zr=-x*sy+z*cy,yr=y*cp-zr*sp,z2=y*sp+zr*cp,s=CFG.F/(CFG.D-z2)*cam.zoom*(W/810);return [W*cam.cx+xr*s,H*cam.cy-yr*s,s]}
const STARS=[];for(let i=0;i<95;i++)STARS.push({x:rnd(),y:rnd(),r:0.5+rnd()*0.9,b:0.10+rnd()*0.30,sp:0.5+rnd()*1.4,ph:rnd()*6.283});

// ---------- six agents on a shallow arc (the old Risk & Compliance line); index 3 drifts
const N=6, AG=[], ARC_R=1100, DRIFTER=3;
const TV=[[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]].map(v=>v.map(c=>c/Math.sqrt(3))), TE=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
for(let i=0;i<N;i++){const x=-330+i*132,y=Math.sqrt(ARC_R*ARC_R-x*x)-ARC_R+20;
  AG.push({x,y,z:0,hx:x,hy:y,r:24,rot:[rnd()*6.283,rnd()*6.283,rnd()*6.283],w:[0.12+rnd()*0.18,0.1+rnd()*0.15,0.08+rnd()*0.12].map(v=>v*(rnd()<0.5?-1:1))})}
function rot3(v,a){let [x,y,z]=v;const [ax,ay,az]=a;let y2=y*Math.cos(ax)-z*Math.sin(ax),z2=y*Math.sin(ax)+z*Math.cos(ax);y=y2;z=z2;
  let x2=x*Math.cos(ay)+z*Math.sin(ay);z2=-x*Math.sin(ay)+z*Math.cos(ay);x=x2;z=z2;x2=x*Math.cos(az)-y*Math.sin(az);y2=x*Math.sin(az)+y*Math.cos(az);return [x2,y2,z]}

// ---------- timeline (s)
const T_DRIFT=0.15, D_DRIFT=1.6, T_UI=1.45, T_LEAD=1.6, D_LEAD=0.3, T_END=2.6;   // longer drift (Chris, final pass)

// ---------- the window (DOM in a shadow root, drawn into existence)
const FX=root.querySelector('.fx'), SR=FX.attachShadow({mode:'open'});
SR.innerHTML='<style>'+DriftHeroB.CARD_CSS+'</style>'+DriftHeroB.CARD_HTML;
const FR=SR.querySelector('.dr-frame'), RL=SR.querySelector('.dr-rule'), FILL=SR.querySelector('.dr-fill'), TOP=SR.querySelector('.a-top');
const ELS=[].slice.call(SR.querySelectorAll('[data-el]')), EL_D=[0.2,0.24,0.34,0.42,0.52];
function drawUI(tu){
  if(tu<0){FX.style.opacity=0;return}
  FX.style.opacity=1;
  FR.style.strokeDashoffset=100-100*(reduced?1:eoc(tu/0.38));
  RL.style.strokeDashoffset=100-100*(reduced?1:eoc((tu-0.2)/0.28));
  FILL.style.opacity=reduced?1:eoc((tu-0.14)/0.3);
  ELS.forEach((el,i)=>{const k=reduced?1:eoc((tu-EL_D[i])/0.24);el.style.opacity=k;el.style.transform='translateY('+(5*(1-k))+'px)'});
  RL.setAttribute('y1',TOP.offsetHeight);RL.setAttribute('y2',TOP.offsetHeight);
}

// ---------- frame
let last=null,T0=performance.now(),FROZEN=null,HID=false;
function onRestart(){AG.forEach(a=>{a.x=a.hx;a.y=a.hy})}
function frame(ts){
  const r=cv.getBoundingClientRect();px=devicePixelRatio||1;W=Math.max(1,Math.round(r.width*px));H=Math.max(1,Math.round(r.height*px));
  if(!r.width){HID=true;requestAnimationFrame(frame);return}
  if(HID){HID=false;T0=ts;last=ts;onRestart()}
  if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H}
  if(last===null)last=ts;const dt=reduced?0:Math.min(50,ts-last);last=ts;
  const t=reduced?T_END:(FROZEN!==null?FROZEN:(ts-T0)/1000), mo=reduced?0:1, narrow=r.width<520;
  FX.classList.toggle('is-narrow',narrow);
  ctx.clearRect(0,0,W,H);
  cam.yaw=(-32+1.0*Math.sin(t*6.283/14)*mo)*Math.PI/180;
  cam.cy=narrow?0.06:0.16; cam.zoom=narrow?0.9:1;

  // stars
  for(const s of STARS){ctx.globalAlpha=s.b*(0.6+0.4*Math.sin(t*s.sp+s.ph)*mo);ctx.fillStyle=INK;ctx.beginPath();ctx.arc(s.x*W,s.y*H,s.r*px,0,6.283);ctx.fill()}
  ctx.globalAlpha=1;

  // the drift: eases out of line and straight down to the bottom of the frame, a slight sideways wander on the way
  const D=AG[DRIFTER], dk=eio((t-T_DRIFT)/D_DRIFT), wob=Math.sin(t*2.1)*5*dk*(1-dk)*4;
  const p0=proj(D.hx,D.hy,0), p1=proj(D.hx,D.hy-100,0), ppu=(p1[1]-p0[1])/100;   // screen px per world unit, downward
  const LAND=H*(narrow?0.93:0.84), dy=(LAND-p0[1])/ppu;
  D.y=D.hy-dy*dk; D.x=D.hx+wob;
  // the window sits above where the agent lands, centered on it (clamped inside the frame)
  const land=proj(D.hx,D.hy-dy,0), aR=D.r*land[2]*1.15, fw=FX.offsetWidth*px, fh=FX.offsetHeight*px, m=W*0.04;
  const fl=Math.max(m,Math.min(W-m-fw,land[0]-fw/2)), ft=land[1]-aR-(narrow?18:34)*px-fh;
  FX.style.left=(fl/px)+'px'; FX.style.top=(ft/px)+'px';
  AG.forEach((a,i)=>{if(!mo)return;const ws=i===DRIFTER?1+1.6*dk:1;a.rot[0]+=a.w[0]*dt/1000*ws;a.rot[1]+=a.w[1]*dt/1000*ws;a.rot[2]+=a.w[2]*dt/1000*ws});

  const uiK=reduced?1:eoc((t-T_UI)/0.5);
  let db=null;
  AG.forEach((a,idx)=>{
    const V=TV.map(v=>{const q=rot3(v,a.rot);return proj(a.x+q[0]*a.r,a.y+q[1]*a.r,a.z+q[2]*a.r)});
    const isD=idx===DRIFTER;
    ctx.strokeStyle=isD?mix(GREY,AMBER,dk):GREY;
    ctx.globalAlpha=isD?1:lerp(1,0.35,uiK);ctx.lineWidth=(isD?1.3+0.5*dk:1.3)*px;ctx.lineJoin='round';ctx.lineCap='round';
    ctx.beginPath();for(const [i,j] of TE){ctx.moveTo(V[i][0],V[i][1]);ctx.lineTo(V[j][0],V[j][1])}ctx.stroke();
    if(isD){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const p of V){x0=Math.min(x0,p[0]);y0=Math.min(y0,p[1]);x1=Math.max(x1,p[0]);y1=Math.max(y1,p[1])}db=[x0,y0,x1,y1]}
  });
  ctx.globalAlpha=1;

  // a thin line from the window down to the drifted agent
  const FB=ft+fh;
  const lk=reduced?1:eoc((t-T_LEAD)/D_LEAD);
  if(db&&lk>0&&FX.style.opacity==='1'){const ax=Math.max(fl+12*px,Math.min(fl+fw-12*px,land[0])),ay=land[1]-aR-6*px,ty=FB+2*px;   // fixed to the landing spot, so the pointer never bobs
    if(ay>ty){ctx.strokeStyle=GREY;ctx.lineWidth=0.9*px;ctx.beginPath();ctx.moveTo(ax,ty);ctx.lineTo(ax,ty+(ay-ty)*lk);ctx.stroke();
      ctx.fillStyle=GREY;ctx.beginPath();ctx.arc(ax,ty+(ay-ty)*lk,1.8*px,0,6.283);ctx.fill()}}

  drawUI(t>=T_UI||reduced?Math.min(1.2,t-T_UI):-1);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
root.addEventListener('hero-replay',function(){T0=performance.now();last=null;onRestart()});
return {seek:s=>{T0=performance.now()-s*1000},freeze:s=>{FROZEN=s},T_END,get t(){return (performance.now()-T0)/1000}};
}
DriftHeroB.CSS=`
.fx.db{position:absolute;left:0;top:0;width:min(62%,360px);pointer-events:none;opacity:0}
.fx.db.is-narrow{width:min(76%,300px)}
canvas.stage{position:absolute;inset:0;width:100%;height:100%;display:block}`;
DriftHeroB.HTML=`<canvas class="stage"></canvas><div class="fx db"></div>`;
DriftHeroB.CARD_CSS=`
:host{--g1:#111;--g4:#2c2c2c;--white:#fff;--light2:#e2e2ea;--light:#a9a9b3;--amber:#C9931F;
  --sans:"Host Grotesk Variable","Host Grotesk",-apple-system,"Helvetica Neue",Arial,sans-serif;--mono:"IBM Plex Mono",ui-monospace,Menlo,monospace}
*{box-sizing:border-box}
.a-ui{position:relative;border-radius:4px;container-type:inline-size;color:var(--light2)}
.dr-fill{position:absolute;inset:0;border-radius:4px;background:var(--g1);opacity:0}
.dr-draw{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.dr-draw rect{fill:none;stroke:var(--g4);stroke-width:1;stroke-dasharray:100;stroke-dashoffset:100}
.dr-draw line{stroke:var(--g4);stroke-width:1;stroke-dasharray:100;stroke-dashoffset:100}
[data-el]{position:relative;opacity:0}
.a-top{position:relative;display:flex;align-items:center;justify-content:space-between;gap:3cqw;padding:4.4cqw 5cqw 3.8cqw}
.a-title{display:flex;align-items:center;gap:2.2cqw;font:500 max(13px,4.4cqw)/1.1 var(--sans);color:var(--white);white-space:nowrap}
.a-title svg{width:5cqw;height:5cqw;min-width:15px;min-height:15px;flex:none;display:block}
.a-meta{font:400 max(9px,2.5cqw)/1 var(--mono);letter-spacing:.1em;text-transform:uppercase;color:var(--light);white-space:nowrap}
.a-body{position:relative;padding:4.6cqw 5cqw 4.4cqw}
.a-row{display:flex;gap:3cqw;align-items:flex-start}
.a-x{flex:none;width:6.4cqw;height:6.4cqw;min-width:20px;min-height:20px;border:1px solid rgba(201,147,31,.6);border-radius:3px;background:rgba(201,147,31,.1);display:grid;place-items:center}
.a-x svg{width:56%;height:56%;display:block}
.a-h{font:500 max(13px,4.2cqw)/1.15 var(--sans);color:var(--white);margin:.4cqw 0 1.6cqw}
.a-p{font:400 max(11px,3.1cqw)/1.45 var(--sans);color:var(--light);margin:0}
.a-foot{position:relative;padding:0 5cqw 5cqw}
.a-btn{display:flex;width:100%;justify-content:center;align-items:center;font:500 max(10px,3cqw)/1 var(--mono);letter-spacing:.12em;text-transform:uppercase;padding:3.6cqw 4cqw;border-radius:3px;background:#2e2e2e;color:var(--white);border:1px solid #3a3a3a;white-space:nowrap}`;
DriftHeroB.CARD_HTML=`<div class="a-ui"><div class="dr-fill"></div><svg class="dr-draw" aria-hidden="true"><rect class="dr-frame" x="0.5" y="0.5" width="calc(100% - 1px)" height="calc(100% - 1px)" rx="4" pathLength="100"/><line class="dr-rule" x1="0" y1="0" x2="100%" y2="0" pathLength="100"/></svg>
  <div class="a-top"><span class="a-title" data-el><svg viewBox="0 0 24 24" fill="none" stroke="#C9931F" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.5L22 20.5H2Z"/><path d="M12 10v4.6" stroke-linecap="round"/><circle cx="12" cy="17.4" r=".9" fill="#C9931F" stroke="none"/></svg>Anomaly detected</span><span class="a-meta" data-el>billing-agent</span></div>
  <div class="a-body"><div class="a-row" data-el><span class="a-x"><svg viewBox="0 0 16 16" fill="none" stroke="#C9931F" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8"/></svg></span>
    <div><div class="a-h">Cost inefficiency</div><p class="a-p">Running a frontier model on tasks a small model handles. Spend is up 3.8× this week.</p></div></div></div>
  <div class="a-foot"><span class="a-btn" data-el>Review agent</span></div>
</div>`;




;(function(){var E=DriftHeroB,BASE="[data-alterion-hero]{position:relative;overflow:hidden;background:transparent}[data-alterion-hero]>.sa-hero{position:absolute;inset:0;overflow:hidden;background:transparent}.sa-hero .fx.sh{left:10%;width:80%}.sa-hero .fx .ro{display:none}",DATA={},WIN=false;
function css(){if(document.getElementById('alterion-hero-base'))return;var s=document.createElement('style');s.id='alterion-hero-base';s.textContent=BASE;document.head.appendChild(s)}
function mount(el){if(el.__alterionHero)return;el.__alterionHero=1;css();
  if(!document.getElementById('alterion-hero-agent-drift')){var s=document.createElement('style');s.id='alterion-hero-agent-drift';s.textContent=E.CSS||'';document.head.appendChild(s)}
  var host=document.createElement('div');host.className='sa-hero';el.appendChild(host);host.innerHTML=E.HTML;
  for(var k in DATA)host.dataset[k]=DATA[k];if(WIN){var fx=host.querySelector('.fx');if(fx)fx.classList.add('with-window')}
  E(host);
  el.addEventListener('alterion-hero-replay',function(){el.__alterionHero=0;el.innerHTML='';mount(el)})}
function run(){[].forEach.call(document.querySelectorAll('[data-alterion-hero="agent-drift"]'),mount)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
})();
