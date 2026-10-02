/*! Alterion solutions hero: Quantify agent risk and prove compliance (risk-compliance). Desktop and mobile in one file: the animation adapts to its container width (phone layout under 520px).
   Embed: <div data-alterion-hero="risk-compliance" style="aspect-ratio:5/4;width:100%"></div> + this script. */
(function(){
/* risk-hero-b.engine.js */
/* ============ Risk hero B, v5 (2026-10-01): aligned to the animation system (Aquila / Endpoints / Shadow scan).
   Aquila perspective camera (yaw −32°, pitch 9°, slow ±1° sway), 95-star field, thin lines, no glows or hazes.
   0.00–0.50  billing-agent: one large red wireframe agent at the center (red #FF4436 + heavier line, like the Endpoints
              target agent), its signal dropping in and out (opacity cuts/fades, an edge dropping now and then).
              Mono-caps label under it:
              BILLING-AGENT / ● RISK DETECTED (red).
   v7: the agent is the focal point. After the hold (0.9s) it eases left and its risk score builds to the right:
              RISK SCORE · 82 (counts up) · ● CRITICAL, then two small detail lines. No window, no leader line.
   The agent stays risky: it keeps flickering red. Beats finish by 2.0s. One instance per root (canvas.stage + .fx.rb). ============ */
function RiskHeroB(root){
const cv=root.querySelector('canvas.stage'), ctx=cv.getContext('2d');
const RED='#FF4436', GREY='#8E8B86', INK='#EDEDEA', SH_FILL='#191716', SH_EDGE='#A5AAB3', MONO="'IBM Plex Mono', ui-monospace, monospace";
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const cl=u=>u<0?0:u>1?1:u, eoc=u=>1-Math.pow(1-cl(u),3), eio=u=>{u=cl(u);return u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2}, lerp=(a,b,t)=>a+(b-a)*t;
function rng(seed){return ()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const rnd=rng(4127);

// ---------- Aquila camera
const CFG={F:1480,D:1650}, cam={yaw:-32*Math.PI/180,pitch:9,cx:0.5,cy:0.46,zoom:1};
let W=1,H=1,px=1;
function proj(x,y,z){const cy=Math.cos(cam.yaw),sy=Math.sin(cam.yaw),cp=Math.cos(cam.pitch*Math.PI/180),sp=Math.sin(cam.pitch*Math.PI/180);
  const xr=x*cy+z*sy,zr=-x*sy+z*cy,yr=y*cp-zr*sp,z2=y*sp+zr*cp,s=CFG.F/(CFG.D-z2)*cam.zoom*(W/810);return [W*cam.cx+xr*s,H*cam.cy-yr*s,s]}
const STARS=[];for(let i=0;i<95;i++)STARS.push({x:rnd(),y:rnd(),r:0.5+rnd()*0.9,b:0.10+rnd()*0.30,sp:0.5+rnd()*1.4,ph:rnd()*6.283});

// ---------- agents
const TV=[[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]].map(v=>v.map(c=>c/Math.sqrt(3))), TE=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
function rot3(v,a){let [x,y,z]=v;const [ax,ay,az]=a;let y2=y*Math.cos(ax)-z*Math.sin(ax),z2=y*Math.sin(ax)+z*Math.cos(ax);y=y2;z=z2;
  let x2=x*Math.cos(ay)+z*Math.sin(ay);z2=-x*Math.sin(ay)+z*Math.cos(ay);x=x2;z=z2;x2=x*Math.cos(az)-y*Math.sin(az);y2=x*Math.sin(az)+y*Math.cos(az);return [x2,y2,z]}
const FIELD=[];   // shadow agents around it, kept clear of the center
while(FIELD.length<16){const x=(rnd()-0.5)*900,y=(rnd()-0.5)*520,z=(rnd()-0.5)*420;if(Math.hypot(x,y*1.4)<230)continue;
  FIELD.push({x,y,z,r:13+rnd()*6,rot:[rnd()*6.283,rnd()*6.283,rnd()*6.283],w:[0.1+rnd()*0.15,0.08+rnd()*0.12,0.06+rnd()*0.1].map(v=>v*(rnd()<0.5?-1:1))})}
const HERO={x:0,y:12,z:0,r:150,rot:[0.6,0.2,0.1]};   // v6: large form, as in the beat-1 sketch
const SH_FACES=[[1,2,3,0],[0,2,3,1],[0,1,3,2],[0,1,2,3]];
const AG_GLYPH=new Path2D('M4 19L12 4l8 15z M4 19l8-6 8 6M12 4v9');   // the agent glyph used on the UI cards
function hull2(P){const p=P.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]),cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]),lo=[],up=[];
  for(const q of p){while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],q)<=0)lo.pop();lo.push(q)}
  for(let i=p.length-1;i>=0;i--){const q=p[i];while(up.length>=2&&cr(up[up.length-2],up[up.length-1],q)<=0)up.pop();up.push(q)}return lo.slice(0,-1).concat(up.slice(0,-1))}
function visEdges(V){const out={};SH_FACES.forEach(f=>{const A=V[f[0]],B=V[f[1]],C=V[f[2]],O=V[f[3]];const den=(B[1]-C[1])*(A[0]-C[0])+(C[0]-B[0])*(A[1]-C[1]);if(Math.abs(den)<1e-9)return;
  const w1=((B[1]-C[1])*(O[0]-C[0])+(C[0]-B[0])*(O[1]-C[1]))/den,w2=((C[1]-A[1])*(O[0]-C[0])+(A[0]-C[0])*(O[1]-C[1]))/den,w3=1-w1-w2;
  if(O[2]<w1*A[2]+w2*B[2]+w3*C[2])[[f[0],f[1]],[f[1],f[2]],[f[0],f[2]]].forEach(e=>{out[Math.min(e[0],e[1])+'-'+Math.max(e[0],e[1])]=e})});return Object.values(out)}

// ---------- signal drop (the risky agent's opacity cuts and fades; never fully gone)
const LOOP=2.4;
const SEG=(()=>{const r=rng(7),s=[];let t=0;while(t<LOOP){const d=0.05+r()*0.12,x=r(),lv=x<0.25?0.22+r()*0.12:(x<0.5?0.45+r()*0.25:0.85+r()*0.15);s.push({t,d,lv,fade:r()<0.5});t+=d}s[s.length-1].d+=LOOP-t;s[s.length-1].lv=s[0].lv;return s})();
function signal(t){t=((t%LOOP)+LOOP)%LOOP;let prev=SEG[SEG.length-1].lv;for(const g of SEG){if(t<g.t+g.d){const k=g.fade?eio((t-g.t)/g.d):1;return prev+(g.lv-prev)*k}prev=g.lv}return prev}
const DROP=(()=>{const r=rng(21),o=[];for(let i=0;i<10;i++)o.push({t:r()*LOOP,d:0.04+r()*0.06,e:Math.floor(r()*6)});return o})();

// ---------- timeline (s)
const T_PAN=0.9, D_PAN=0.4, T_LEAD=99, D_LEAD=0.25, T_UI=1.0, T_END=2.0;   // v7: hold on the large agent until 0.9s, it eases left and the risk score builds to its right (done ~1.7s); no window, no leader line

// ---------- the window (DOM in a shadow root, drawn into existence)
const FX=root.querySelector('.fx'), SR=FX.attachShadow({mode:'open'});
SR.innerHTML='<style>'+RiskHeroB.CARD_CSS+'</style>'+RiskHeroB.CARD_HTML;
const WF=SR.querySelector('.w-frame'), WFILL=SR.querySelector('.w-fill');   // v9: optional window (shown when the host has .with-window)
const NUM=SR.querySelector('.s-num'), ELS=[].slice.call(SR.querySelectorAll('[data-el]')), EL_D=[0,0.06,0.2,0.34,0.42,0.5];
function drawUI(tu){
  if(tu<0){FX.style.opacity=0;return}
  FX.style.opacity=1;
  if(WF){WF.style.strokeDashoffset=100-100*(reduced?1:eoc(tu/0.4));WFILL.style.opacity=reduced?1:eoc((tu-0.15)/0.35)}
  ELS.forEach((el,i)=>{const k=reduced?1:eoc((tu-EL_D[i])/0.25);el.style.opacity=k;el.style.transform='translateX('+(10*(1-k))+'px)'});
  NUM.textContent=Math.round(82*(reduced?1:eoc((tu-0.06)/0.4)));
}

// ---------- frame
let last=null,T0=performance.now(),FROZEN=null,HID=false;
function onRestart(){HERO.rot=[0.6,0.2,0.1]}
function frame(ts){
  const r=cv.getBoundingClientRect();px=devicePixelRatio||1;W=Math.max(1,Math.round(r.width*px));H=Math.max(1,Math.round(r.height*px));
  if(!r.width){HID=true;requestAnimationFrame(frame);return}
  if(HID){HID=false;T0=ts;last=ts;onRestart()}
  if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H}
  if(last===null)last=ts;const dt=reduced?0:Math.min(50,ts-last);last=ts;
  const t=reduced?T_END:(FROZEN!==null?FROZEN:(ts-T0)/1000);
  const narrow=r.width<520, mo=reduced?0:1;
  ctx.clearRect(0,0,W,H);

  // camera: slow sway; pans so the agent sits left of the window
  const pk=eio((t-T_PAN)/D_PAN);
  cam.yaw=(-32+1.0*Math.sin(t*6.283/14)*mo)*Math.PI/180;
  const WIN=FX.classList.contains('with-window');   // v13 mobile + window: same two-column layout as desktop, scaled down
  cam.cx=lerp(0.5,narrow?(WIN?0.27:0.5):0.31,pk); cam.cy=lerp(0.46,narrow?(WIN?0.57:0.2):0.46,pk); cam.zoom=lerp(1,narrow?(WIN?0.5:0.46):0.86,pk);   // v8 mobile: agent moves up, score stacks below
  FX.classList.toggle('is-narrow',narrow);

  // stars
  for(const s of STARS){ctx.globalAlpha=s.b*(0.6+0.4*Math.sin(t*s.sp+s.ph)*mo);ctx.fillStyle=INK;ctx.beginPath();ctx.arc(s.x*W,s.y*H,s.r*px,0,6.283);ctx.fill()}
  ctx.globalAlpha=1;

  // v6: no background agents; the risky agent is alone in the frame
  ctx.lineJoin='round';ctx.lineCap='round';
  const drawn=[].map(a=>{if(mo){a.rot[0]+=a.w[0]*dt/1000;a.rot[1]+=a.w[1]*dt/1000;a.rot[2]+=a.w[2]*dt/1000}
    const V=TV.map(v=>{const q=rot3(v,a.rot);return proj(a.x+q[0]*a.r,a.y+q[1]*a.r,a.z+q[2]*a.r)});return {V,d:V.reduce((s,p)=>s+p[2],0)/4}}).sort((p,q)=>p.d-q.d);
  for(const g of drawn){const dz=cl((g.d-0.5)/0.6);ctx.globalAlpha=0.35+0.4*dz;
    const Hh=hull2(g.V);ctx.fillStyle=SH_FILL;ctx.beginPath();Hh.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fill();
    ctx.strokeStyle=SH_EDGE;ctx.lineWidth=1*px;ctx.setLineDash([3*px,3*px]);ctx.beginPath();for(const [i,j] of visEdges(g.V)){ctx.moveTo(g.V[i][0],g.V[i][1]);ctx.lineTo(g.V[j][0],g.V[j][1])}ctx.stroke();ctx.setLineDash([])}
  ctx.globalAlpha=1;

  // v10 window (host .with-window): one UI window around the agent AND its score, drawn behind both in the last beat
  // v12: the window has a header; the agent's name + RISK DETECTED glide up into it
  let WR=null;
  if(FX.classList.contains('with-window')&&(t>=T_UI||reduced)){
    const tu=reduced?1:t-T_UI, fk=reduced?1:eoc(tu/0.45), fl=reduced?1:eoc((tu-0.15)/0.35);
    const hc=proj(HERO.x,HERO.y,HERO.z), rp=HERO.r*hc[2]*1.1, fr=FX.getBoundingClientRect(), hr=root.getBoundingClientRect();
    const sx0=(fr.left-hr.left)*px, sy0=(fr.top-hr.top)*px, sx1=sx0+fr.width*px, sy1=sy0+fr.height*px, pad=(narrow?12:22)*px, HDR=(narrow?32:46)*px;
    let x0=Math.min(hc[0]-rp,sx0)-pad, y0=Math.min(hc[1]-rp,sy0)-pad-HDR, x1=Math.max(hc[0]+rp,sx1)+pad, y1=Math.max(hc[1]+rp,sy1)+pad;
    x0=Math.max(x0,W*0.03);y0=Math.max(y0,H*0.03);x1=Math.min(x1,W*0.97);y1=Math.min(y1,H*0.97);
    const rr=5*px, ww=x1-x0, hh=y1-y0, per=2*(ww+hh);
    ctx.save();ctx.beginPath();ctx.moveTo(x0+rr,y0);ctx.arcTo(x1,y0,x1,y1,rr);ctx.arcTo(x1,y1,x0,y1,rr);ctx.arcTo(x0,y1,x0,y0,rr);ctx.arcTo(x0,y0,x1,y0,rr);ctx.closePath();
    ctx.globalAlpha=fl;ctx.fillStyle='#111111';ctx.fill();
    ctx.globalAlpha=1;ctx.strokeStyle='#2c2c2c';ctx.lineWidth=1*px;ctx.setLineDash([per*fk,per]);ctx.stroke();ctx.setLineDash([]);
    const rk2=reduced?1:eoc((tu-0.2)/0.3);if(rk2>0){ctx.beginPath();ctx.moveTo(x0,y0+HDR);ctx.lineTo(x0+(x1-x0)*rk2,y0+HDR);ctx.stroke();
      {const xd=sx0-pad*0.9;ctx.beginPath();ctx.moveTo(xd,y0+HDR);ctx.lineTo(xd,y0+HDR+(y1-y0-HDR)*rk2);ctx.stroke()}}   // agent cell | score column (desktop + mobile)   // header rule
    ctx.restore();
    WR={x0,y0,x1,y1,HDR,k:reduced?1:eio((tu-0.08)/0.42),ip:(narrow?12:18)*px};
  }
  // billing-agent: red wireframe, heavier line, uneven spin, signal dropping in and out (no glow)
  // v11: with the window, the agent settles once it's inside: flicker stops and the spin eases to a stop
  const calm=(FX.classList.contains('with-window'))?(reduced?1:eoc((t-T_UI-0.3)/0.4)):0;
  if(mo){const wob=Math.sin(t*19)*0.5+Math.sin(t*31)*0.4,sp=(0.9+0.7*wob)*(1-calm);HERO.rot[0]+=sp*0.5*dt/1000;HERO.rot[1]+=sp*0.85*dt/1000;HERO.rot[2]+=sp*0.25*dt/1000}
  const V=TV.map(v=>{const q=rot3(v,HERO.rot);return proj(HERO.x+q[0]*HERO.r,HERO.y+q[1]*HERO.r,HERO.z+q[2]*HERO.r)});
  const sig=reduced?1:lerp(signal(t)*(0.3+0.7*eoc(t/0.35)),1,calm);
  const dmin=Math.min(...V.map(p=>p[2])),dmax=Math.max(...V.map(p=>p[2])),tm=((t%LOOP)+LOOP)%LOOP;
  TE.forEach((e,i)=>{if(!reduced&&calm<0.5&&DROP.some(d=>d.e===i&&tm>=d.t&&tm<d.t+d.d))return;
    const near=((V[e[0]][2]+V[e[1]][2])/2-dmin)/((dmax-dmin)||1);
    ctx.globalAlpha=sig*(0.55+0.45*near);ctx.strokeStyle=RED;ctx.lineWidth=(1.6+0.8*near)*px;
    ctx.beginPath();ctx.moveTo(V[e[0]][0],V[e[0]][1]);ctx.lineTo(V[e[1]][0],V[e[1]][1]);ctx.stroke()});
  ctx.globalAlpha=1;
  let bx0=1e9,by0=1e9,bx1=-1e9,by1=-1e9;for(const p of V){bx0=Math.min(bx0,p[0]);by0=Math.min(by0,p[1]);bx1=Math.max(bx1,p[0]);by1=Math.max(by1,p[1])}
  const HC=proj(HERO.x,HERO.y,HERO.z), acx=HC[0], RPX=HERO.r*HC[2]*1.1;   // v10: label anchors to the center + spin radius, so it stays put and clear of the agent

  // label (system style: mono caps, 2px tracking)
  const fs=Math.round((narrow?10:11)*px);ctx.font='500 '+fs+'px '+MONO;if('letterSpacing' in ctx)ctx.letterSpacing=(2*px)+'px';ctx.textAlign='center';ctx.textBaseline='top';
  const lk=reduced?1:cl((t-0.15)/0.3),name='BILLING-AGENT',chars=Math.round(name.length*lk),ly=HC[1]+RPX+12*px;
  ctx.textAlign='left';const hk=WR?WR.k:0, hy=WR?WR.y0+(WR.HDR-fs)/2:ly;   // v12: glide into the window header
  const ga=WR?cl((hk-0.6)/0.4):0;
  if(ga>0){const gs=13*px,gx=WR.x0+WR.ip,gy=hy+fs/2-gs/2;ctx.save();ctx.globalAlpha=ga;ctx.translate(gx,gy);ctx.scale(gs/24,gs/24);ctx.strokeStyle=RED;ctx.lineWidth=1.5*24/gs*px;ctx.lineJoin='round';ctx.stroke(AG_GLYPH);ctx.restore()}
  if(chars>0){ctx.globalAlpha=1;ctx.fillStyle=INK;const nw=ctx.measureText(name).width;ctx.fillText(name.slice(0,chars),lerp(acx-nw/2,WR?WR.x0+WR.ip+21*px:0,hk),lerp(ly,hy,hk))}
  const rk=reduced?1:t-0.4;
  if(rk>=0){ctx.globalAlpha=reduced?1:(rk<0.24?((Math.floor(rk/0.06)%2)?0.2:1):lerp(0.65+0.35*signal(t+0.5),1,calm));ctx.fillStyle=RED;
    const txt='RISK DETECTED',w=ctx.measureText(txt).width,tx=lerp(acx+5*px-w/2,WR?WR.x1-WR.ip-w-9*px:0,hk),ty=lerp(ly+16*px,hy,hk);
    if(ga>0){const al=ctx.globalAlpha;ctx.globalAlpha=al*ga;ctx.beginPath();const bx=tx-16*px,by=ty-6*px,bw=w+25*px,bh=fs+12*px,br=3*px;ctx.moveTo(bx+br,by);ctx.arcTo(bx+bw,by,bx+bw,by+bh,br);ctx.arcTo(bx+bw,by+bh,bx,by+bh,br);ctx.arcTo(bx,by+bh,bx,by,br);ctx.arcTo(bx,by,bx+bw,by,br);ctx.closePath();ctx.fillStyle='rgba(255,68,54,.1)';ctx.fill();ctx.strokeStyle='rgba(255,68,54,.6)';ctx.lineWidth=1*px;ctx.stroke();ctx.globalAlpha=al;ctx.fillStyle=RED}   // red tag
    ctx.fillText(txt,tx,ty);ctx.beginPath();ctx.arc(tx-7*px,ty+fs*0.45,2*px,0,6.283);ctx.fill()}
  ctx.globalAlpha=1;if('letterSpacing' in ctx)ctx.letterSpacing='0px';

  // system leader line: dot at the agent → horizontal → 45° jog → into the window
  const fr=FX.getBoundingClientRect(),hr=root.getBoundingClientRect(),CX=(fr.left-hr.left)*px,CY=(fr.top-hr.top)*px,CH=fr.height*px;
  const lk2=reduced?1:eoc((t-T_LEAD)/D_LEAD);
  if(lk2>0){const ax=bx1+8*px,ay=(by0+by1)/2,ex=CX-4*px,ey=Math.max(CY+22*px,Math.min(CY+CH*0.32,ay-26*px)),jog=Math.abs(ey-ay);let xk=ex-jog-14*px;if(xk<ax+10*px)xk=ax+10*px;
    const seg=[[ax,ay],[xk,ay],[Math.min(xk+jog,ex-6*px),ey],[ex,ey]],lens=seg.slice(1).map((p,i)=>Math.hypot(p[0]-seg[i][0],p[1]-seg[i][1])),tot=lens.reduce((a,b)=>a+b,0);let rem=tot*lk2;
    ctx.strokeStyle=GREY;ctx.lineWidth=0.9*px;ctx.beginPath();ctx.moveTo(ax,ay);
    for(let i=1;i<seg.length&&rem>0;i++){const l=lens[i-1],q=Math.min(1,rem/l);ctx.lineTo(seg[i-1][0]+(seg[i][0]-seg[i-1][0])*q,seg[i-1][1]+(seg[i][1]-seg[i-1][1])*q);rem-=l}
    ctx.stroke();ctx.fillStyle=GREY;ctx.beginPath();ctx.arc(ax,ay,1.8*px,0,6.283);ctx.fill()}

  drawUI(t>=T_UI||reduced?Math.min(1,t-T_UI):-1);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
root.addEventListener('hero-replay',function(){T0=performance.now();last=null;onRestart()});
return {seek:s=>{T0=performance.now()-s*1000},freeze:s=>{FROZEN=s},T_END,get t(){return (performance.now()-T0)/1000}};
}
RiskHeroB.CSS=`
.fx.rb{position:absolute;left:55%;width:40%;top:46%;transform:translateY(-50%);pointer-events:none;opacity:0}
canvas.stage{position:absolute;inset:0;width:100%;height:100%;display:block}
.fx.rb.is-narrow{left:9%;width:82%;top:auto;bottom:7%;transform:none}
.fx.rb.is-narrow.with-window{left:49%;width:44%;top:57%;bottom:auto;transform:translateY(-44%)}`;
RiskHeroB.HTML=`<canvas class="stage"></canvas><div class="fx rb"></div>`;
RiskHeroB.CARD_CSS=`
:host{--white:#fff;--light2:#e2e2ea;--light:#a9a9b3;--mute:#767c7e;--line:#2c2c2c;--red:#FF4436;
  --sans:"Host Grotesk Variable","Host Grotesk",-apple-system,"Helvetica Neue",Arial,sans-serif;--mono:"IBM Plex Mono",ui-monospace,Menlo,monospace}
*{box-sizing:border-box}
.s{display:flex;flex-direction:column;align-items:flex-start}
.s [data-el]{opacity:0}
.s-lbl{font:400 max(9px,3.6cqw)/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--light)}
.s-num{margin-top:3cqw;font:600 46cqw/.82 var(--sans);letter-spacing:-.03em;color:#fff;font-variant-numeric:tabular-nums}
.s-lvl{margin-top:4cqw;display:flex;align-items:center;gap:2.4cqw;font:500 max(10px,4.4cqw)/1 var(--mono);letter-spacing:.16em;text-transform:uppercase;color:var(--red)}
.s-lvl:before{content:"";width:2cqw;height:2cqw;min-width:5px;min-height:5px;border-radius:50%;background:var(--red)}
.s-tiers{display:flex;gap:1.4cqw;width:100%;margin:5cqw 0 6cqw}
.s-tiers i{flex:1;height:max(3px,1.3cqw);border-radius:1px;background:#2c2c2c}
.s-tiers i.on{background:var(--red)}
.s-d{display:flex;justify-content:space-between;align-items:baseline;gap:4cqw;width:100%;padding:2.6cqw 0;border-top:1px solid var(--line);font:400 max(9px,3cqw)/1.35 var(--mono);letter-spacing:.08em;text-transform:uppercase}
.s-d span{color:var(--mute);flex:none}
.s-d b{font-weight:400;color:var(--light2);text-align:right}
/* v9 optional window: drawn around the score in the last beat (host .with-window) */
.w{position:relative;container-type:inline-size}
.w-fill,.w-draw{display:none}
:host(.with-window-inner) .w-fill{display:block;position:absolute;inset:0;border-radius:4px;background:#111;opacity:0}
:host(.with-window-inner) .w-draw{display:block;position:absolute;inset:0;width:100%;height:100%;overflow:visible}
:host(.with-window-inner) .w-draw rect{fill:none;stroke:#2c2c2c;stroke-width:1;stroke-dasharray:100;stroke-dashoffset:100}
:host(.with-window-inner) .s{position:relative;padding:7cqw 7cqw 5cqw}
:host(.with-window-inner.is-narrow) .s{padding:4cqw 5cqw 2.5cqw}
:host(.with-window-inner.is-narrow) .s-rule{margin:3cqw 0 2.5cqw}
/* mobile (stacked under the agent): 82 on the left, label + level beside it, details below */
:host(.is-narrow) .s{display:grid;grid-template-columns:auto 1fr;column-gap:4cqw;align-items:end}
:host(.is-narrow) .s-num{grid-column:1;grid-row:1/3;margin:0;font-size:23cqw}
:host(.is-narrow) .s-lbl{grid-column:2;grid-row:1;align-self:end;margin-bottom:2.2cqw;font-size:max(9px,3cqw)}
:host(.is-narrow) .s-lvl{grid-column:2;grid-row:2;align-self:end;margin:0 0 1.4cqw;font-size:max(9px,3.6cqw)}
:host(.is-narrow) .s-tiers{grid-column:1/-1;margin:3.6cqw 0 3cqw}
:host(.is-narrow) .s-d{grid-column:1/-1;font-size:max(9px,2.8cqw);padding:1.8cqw 0}
/* v13 mobile + window: score column beside the agent; details stack label over value */
:host(.is-narrow.with-window) .s{display:flex;flex-direction:column;align-items:flex-start}
:host(.is-narrow.with-window) .s-lbl{margin:0;font-size:max(9px,5cqw);align-self:flex-start}
:host(.is-narrow.with-window) .s-num{margin:2cqw 0 0;font-size:36cqw}
:host(.is-narrow.with-window) .s-lvl{margin:3cqw 0 0;font-size:max(9px,5.4cqw);align-self:flex-start}
:host(.is-narrow.with-window) .s-tiers{margin:4cqw 0 3cqw}
:host(.is-narrow.with-window) .s-d{display:block;padding:2.4cqw 0 2cqw;font-size:max(8.5px,4.6cqw)}
:host(.is-narrow.with-window) .s-d b{display:block;text-align:left;margin-top:1cqw}`;
RiskHeroB.CARD_HTML=`<div class="w"><div class="w-fill"></div><svg class="w-draw" aria-hidden="true"><rect class="w-frame" x="0.5" y="0.5" width="calc(100% - 1px)" height="calc(100% - 1px)" rx="4" pathLength="100"/></svg><div class="s">
  <div class="s-lbl" data-el>Risk score</div>
  <div class="s-num" data-el>0</div>
  <div class="s-lvl" data-el>Critical</div>
  <div class="s-tiers" data-el><i></i><i></i><i></i><i class="on"></i></div>
  <div class="s-d" data-el><span>Data</span><b>Restricted, customer PII</b></div>
  <div class="s-d" data-el><span>Actions</span><b>Writes to external APIs</b></div>
</div></div>`;




;(function(){var E=RiskHeroB,BASE="[data-alterion-hero]{position:relative;overflow:hidden;background:#050505}[data-alterion-hero]>.sa-hero{position:absolute;inset:0;overflow:hidden;background:#050505}.sa-hero .fx.sh{left:10%;width:80%}.sa-hero .fx .ro{display:none}",DATA={},WIN=true;
function css(){if(document.getElementById('alterion-hero-base'))return;var s=document.createElement('style');s.id='alterion-hero-base';s.textContent=BASE;document.head.appendChild(s)}
function mount(el){if(el.__alterionHero)return;el.__alterionHero=1;css();
  if(!document.getElementById('alterion-hero-risk-compliance')){var s=document.createElement('style');s.id='alterion-hero-risk-compliance';s.textContent=E.CSS||'';document.head.appendChild(s)}
  var host=document.createElement('div');host.className='sa-hero';el.appendChild(host);host.innerHTML=E.HTML;
  for(var k in DATA)host.dataset[k]=DATA[k];if(WIN){var fx=host.querySelector('.fx');if(fx)fx.classList.add('with-window')}
  E(host);
  el.addEventListener('alterion-hero-replay',function(){el.__alterionHero=0;el.innerHTML='';mount(el)})}
function run(){[].forEach.call(document.querySelectorAll('[data-alterion-hero="risk-compliance"]'),mount)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
})();
