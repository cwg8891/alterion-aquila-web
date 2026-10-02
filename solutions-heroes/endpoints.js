/*! Alterion solutions hero: Secure agents on every endpoint (endpoints). Desktop and mobile in one file: the animation adapts to its container width (phone layout under 520px).
   Embed: <div data-alterion-hero="endpoints" style="aspect-ratio:5/4;width:100%"></div> + this script. */
(function(){
/* ============ Secure Endpoints hero F (2026-10-02): coverage across AI products (layout B, two agents). Whole hero ≤ 2.0s, then it holds.
   The agent estate is already there (grey agents, gently turning, over stars). Two agents get boxed in their status color: one at the
   top right (User warned, amber) and one at the left middle (Action blocked, red). One product window ("Agent activity", the solution
   UI card style) draws into the center, and each box connects to its own row with an elbow line; each row writes in as its line lands:
   status + time, agent name, product, and one line on what happened.
   0.00        estate visible (never drawn in)
   The window is built in two halves, one per agent, and each unfolds differently: the top half (header + agent 1) unfolds
   downward from its top edge; the bottom half (agent 2) unfolds upward from its bottom edge, meeting the top so they finish
   as one window. A thin status-colored edge rides the unfolding edge, then fades.
   0.10–0.50   box 1 draws · 0.25–0.70 top half unfolds down · 0.45–0.75 line 1 · row 1 writes in (0.65–1.05)
   0.70–1.10   box 2 draws · 0.85–1.30 bottom half unfolds up · 0.95–1.25 line 2 · row 2 writes in (1.15–1.55)
   Stars; no glow; Host Grotesk + IBM Plex Mono. One instance per root. ============ */
function EndpointHeroF(root){
const cv=root.querySelector('canvas.stage'),ctx=cv.getContext('2d');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const cl=u=>u<0?0:u>1?1:u, eoc=u=>1-Math.pow(1-cl(u),3);
function rng(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const rs=rng(4471),STARS=[];for(let i=0;i<95;i++)STARS.push({x:rs(),y:rs(),r:0.5+rs()*0.9,b:0.10+rs()*0.30,sp:0.5+rs()*1.4,ph:rs()*6.283});
const TV=[[0,1,0],[0.943,-0.333,0],[-0.471,-0.333,0.816],[-0.471,-0.333,-0.816]],TE=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
const COL={warn:'#D9A427',block:'#E24840'};
// two motion modes (root data-fmode): 'bounce' = each half unfolds then springs past and settles (Chris's direction);
// 'trace' = both halves draw into existence at once, outlines tracing from opposite corners, then fill and write in;
// 'unfurl' = the agent's line lands, a status-colored seed line shoots across the window edge from the agent's side,
// then snaps open into its half with a spring, and the status blinks on like a live alert (Claude's version)
const MODE=root.dataset.fmode||'bounce';
const AG=MODE==='trace'?[{x:.86,y:.27,k:'warn',box:[0.08,0.45],line:[0.50,0.82]},{x:.13,y:.66,k:'block',box:[0.14,0.51],line:[0.56,0.88]}]
        :MODE==='unfurl'?[{x:.86,y:.27,k:'warn',box:[0.10,0.45],line:[0.35,0.60]},{x:.13,y:.66,k:'block',box:[0.60,0.95],line:[0.85,1.10]}]
                         :[{x:.86,y:.27,k:'warn',box:[0.10,0.50],line:[0.45,0.75]},{x:.13,y:.66,k:'block',box:[0.70,1.10],line:[0.95,1.25]}];
const AGN=[{x:.84,y:.1},{x:.16,y:.9}];   // phone: agent 1 top right, agent 2 bottom left; the window runs nearly full width between them
const ROWT=MODE==='trace'?[0.95,1.05]:MODE==='unfurl'?[0.92,1.42]:[0.68,1.28];
// spring settle after an unfold: a damped overshoot on scaleY from the hinge edge
function spring(tau,amp){if(tau<=0)return 1;return 1+amp*Math.exp(-6.5*tau)*Math.sin(tau*19)}
// the estate: grey agents spread across the frame, clear of the two highlighted ones
const rg=rng(91),FIELD=[];for(let j=0;j<40;j++){const ax=0.04+rg()*0.92,ay=0.05+rg()*0.9;
  if(AG.some(a=>Math.hypot(ax-a.x,(ay-a.y)*0.8)<0.1))continue;FIELD.push({x:ax,y:ay,a:rg()*6,b:rg()*6,w:(rg()-0.5)*0.5,mid:ax>0.22&&ax<0.78})}
const PANEL=root.querySelector('.ef'),HALF=[PANEL.querySelector('.ef-a'),PANEL.querySelector('.ef-b')],EDGE=[].slice.call(PANEL.querySelectorAll('.ef-edge')),ROWS=[].slice.call(PANEL.querySelectorAll('.ef-row'));
const UNF=MODE==='unfurl'?[[0.72,1.00],[1.22,1.50]]:[[0.25,0.62],[0.85,1.22]];
const SEED=[[0.55,0.74],[1.05,1.24]];
// trace: both halves draw their outline at once, from opposite corners (top half from top-left, bottom half from bottom-right)
const TRC=[0.30,1.05],TFILL=[0.65,1.17],TRACE=[].slice.call(PANEL.querySelectorAll('.ef-trace'));   // Shadow Agents card timing: outline 0.75s, fill from ~45% of it over 0.52s   // unfurl: the seed line shoots across the edge first
let T0=performance.now();root.addEventListener('hero-replay',()=>{T0=performance.now()});
function rot(v,a,b){let x=v[0],y=v[1],z=v[2],t;t=y*Math.cos(a)-z*Math.sin(a);z=y*Math.sin(a)+z*Math.cos(a);y=t;t=x*Math.cos(b)+z*Math.sin(b);z=-x*Math.sin(b)+z*Math.cos(b);x=t;return [x,y,z]}
function tetra(cx,cy,R,a,b,col,lw,al){const P=TV.map(v=>{const q=rot(v,a,b),s=3/(3-q[2]);return [cx+q[0]*R*s,cy-q[1]*R*s]});
  ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.globalAlpha=al;ctx.lineJoin='round';ctx.beginPath();TE.forEach(e=>{ctx.moveTo(P[e[0]][0],P[e[0]][1]);ctx.lineTo(P[e[1]][0],P[e[1]][1])});ctx.stroke();ctx.globalAlpha=1}
function frame(now){
  const r=root.getBoundingClientRect();if(!r.width){requestAnimationFrame(frame);return}
  const px=devicePixelRatio||1,W=Math.round(r.width*px),H=Math.round(r.height*px);
  if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H}
  const t=reduced?3:Math.max(0,(now-T0)/1000);
  const narrow=r.width<520;root.querySelector('.ehf').classList.toggle('is-narrow',narrow);
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='#EDEDEA';for(const s of STARS){ctx.globalAlpha=s.b*(0.6+0.4*Math.sin(t*s.sp+s.ph));ctx.beginPath();ctx.arc(s.x*W,s.y*H,s.r*px,0,6.283);ctx.fill()}ctx.globalAlpha=1;
  const pk=reduced?1:eoc((t-UNF[0][0])/(UNF[0][1]-UNF[0][0]));
  // estate (dims a little behind the panel once it's up)
  if(!narrow)FIELD.forEach(f=>tetra(f.x*W,f.y*H,W*0.018,f.a+t*f.w*0.3,f.b+t*f.w*0.5,'#8E8B86',1*px,f.mid?0.75-0.4*pk:0.75));
  // the two halves unfold: top half downward, bottom half upward; an edge line rides each unfolding edge, then fades
  if(MODE==='trace'){const k=reduced?1:eoc((t-TRC[0])/(TRC[1]-TRC[0])),fk=reduced?1:eoc((t-TFILL[0])/(TFILL[1]-TFILL[0]));
    HALF.forEach((el,i)=>{el.style.visibility='visible';el.style.clipPath='none';el.classList.add('traced');el.style.setProperty('--fk',fk);
      // a little bounce as each outline closes: a small spring scale from the corner it drew from
      el.style.transform='none';   // no bounce
      const sv=TRACE[i];sv.style.display='block';sv.querySelectorAll('path').forEach(pth=>pth.style.strokeDashoffset=(100-100*k).toFixed(2));
      sv.style.opacity=k>=1?0:1;el.style.borderColor=k>=1?'#2c2c2c':'transparent';
      sv.style.setProperty('--sk',fk)});EDGE.forEach(e=>e.style.opacity=0)}
  else HALF.forEach((el,i)=>{const u=UNF[i],k=reduced?1:eoc((t-u[0])/(u[1]-u[0])),pct=(100-k*100).toFixed(2)+'%';
    el.style.clipPath=i===0?'inset(0 0 '+pct+' 0)':'inset('+pct+' 0 0 0)';
    // the bounce: once open, the half springs past full height and settles, hinged on the edge it unfolded from
    const sp=reduced?1:spring(t-u[1],MODE==='unfurl'?0.045:0.045);el.style.transformOrigin=i===0?'50% 0':'50% 100%';el.style.transform='scaleY('+sp.toFixed(4)+')';
    const e=EDGE[i],agentRight=AG[i].x>0.5,seed=MODE==='unfurl'?(reduced?1:eoc((t-SEED[i][0])/(SEED[i][1]-SEED[i][0]))):1;
    el.style.visibility=(k>0)?'visible':'hidden';
    const y=i===0?el.offsetTop+el.offsetHeight*k:el.offsetTop+el.offsetHeight*(1-k);e.style.top=y+'px';
    e.style.transformOrigin=agentRight?'100% 50%':'0 50%';e.style.transform='scaleX('+seed.toFixed(4)+')';
    const live=MODE==='unfurl'?(t>=SEED[i][0]):(k>0);
    e.style.opacity=reduced?0:(!live?0:k<1?1:Math.max(0,1-(t-u[1])/0.35));e.classList.toggle('thick',MODE==='unfurl'&&k<1)});
  const sr=root.getBoundingClientRect();
  AG.forEach((a,i)=>{
    const pa=narrow?AGN[i]:a,cx=pa.x*W,cy=pa.y*H,R0=W*(narrow?0.028:0.032);tetra(cx,cy,R0,0.5+t*0.15,0.7+cx/W+t*0.25,'#EDEDEA',1.4*px,1);
    const h=R0*1.9,x0=cx-h,y0=cy-h,s=2*h,bk=reduced?1:eoc((t-a.box[0])/(a.box[1]-a.box[0]));
    if(bk>0){ctx.strokeStyle=COL[a.k];ctx.lineWidth=1.3*px;ctx.setLineDash([4*s*bk,4*s]);ctx.beginPath();ctx.rect(x0,y0,s,s);ctx.stroke();ctx.setLineDash([])}
    // elbow line: box edge → row edge
    const row=ROWS[i],er=row.getBoundingClientRect(),ex=(pa.x>0.5?er.right-sr.left:er.left-sr.left)*px,ey=(er.top-sr.top+er.height/2)*px;
    const sx=pa.x>0.5?x0:x0+s,sy=cy,mx=(sx+ex)/2,lk=reduced?1:eoc((t-a.line[0])/(a.line[1]-a.line[0]));
    if(lk>0){const L1=Math.abs(mx-sx),L2=Math.abs(ey-sy),L3=Math.abs(ex-mx),tot=L1+L2+L3,d=tot*lk;
      ctx.strokeStyle=COL[a.k];ctx.globalAlpha=0.9;ctx.lineWidth=1*px;ctx.beginPath();ctx.moveTo(sx,sy);
      const p1=Math.min(d,L1);ctx.lineTo(sx+Math.sign(mx-sx)*p1,sy);
      if(d>L1){const p2=Math.min(d-L1,L2);ctx.lineTo(mx,sy+Math.sign(ey-sy)*p2)}
      if(d>L1+L2){const p3=Math.min(d-L1-L2,L3);ctx.lineTo(mx+Math.sign(ex-mx)*p3,ey)}
      ctx.stroke();ctx.fillStyle=COL[a.k];ctx.beginPath();ctx.arc(sx,sy,2*px,0,6.283);ctx.fill();if(lk>=1){ctx.beginPath();ctx.arc(ex,ey,2*px,0,6.283);ctx.fill()}ctx.globalAlpha=1}
    // row writes in: status, then agent + product, then the event line
    [].slice.call(row.children).forEach((el,j)=>{const dur=MODE==='trace'?0.42:0.25,k=reduced?1:eoc((t-ROWT[i]-j*0.1)/dur);let o=k;
      // unfurl: the status label blinks on (on-off-on) like a live alert before it settles
      if(MODE==='unfurl'&&j===0&&!reduced){const b=t-ROWT[i];o=b<0?0:b<0.06?1:b<0.12?0.15:b<0.18?1:k}
      el.style.opacity=o;el.style.transform='translateY('+((MODE==='trace'?6:4)*(1-k))+'px)'});
    row.classList.toggle('on',(reduced?1:t-ROWT[i])>0);
  });
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
return {T_END:2};
}
EndpointHeroF.CSS=`
.ehf{position:absolute;inset:0;container-type:inline-size;font-family:"Host Grotesk Variable","Host Grotesk",-apple-system,"Helvetica Neue",Arial,sans-serif}
.ehf canvas.stage{position:absolute;inset:0;width:100%;height:100%;display:block}
.ef{position:absolute;left:24%;right:24%;top:19%;bottom:19%;display:flex;flex-direction:column;--l2:#e2e2ea;--l1:#a9a9b3;--hair:#2c2c2c;--mono:"IBM Plex Mono",ui-monospace,Menlo,monospace}
.ef-a,.ef-b{position:relative;display:flex;flex-direction:column;background:#141414;border:1px solid #2c2c2c;visibility:hidden;will-change:clip-path}
.ef-a{flex:1.34;border-radius:2px 2px 0 0}
.ef-b{flex:1;border-top:1px solid #2c2c2c;border-radius:0 0 2px 2px;margin-top:-1px}
.ef-a.traced,.ef-b.traced{background:rgba(20,20,20,var(--fk,0));border-color:transparent}
.ef-a.traced .ef-ph{opacity:var(--fk,0)}
.ef-trace{position:absolute;inset:-1px;width:calc(100% + 2px);height:calc(100% + 2px);overflow:visible;display:none;pointer-events:none}
.ef-trace path{fill:none;stroke-width:1;vector-effect:non-scaling-stroke;stroke-dasharray:100;stroke-dashoffset:100}
.ef-trace path{stroke:#2c2c2c}   /* drawn in exactly like the Shadow Agents card: the #2c2c2c line traces and stays as the border */
.ef-edge{position:absolute;left:-1px;right:-1px;height:1px;opacity:0;pointer-events:none;margin-top:-.5px}
.ef-edge.thick{height:2px;margin-top:-1px}
.ef-edge.warn{background:#D9A427}.ef-edge.block{background:#E24840}
.ef-ph{display:flex;align-items:center;gap:1.2cqw;padding:2.4cqw 3cqw;border-bottom:1px solid var(--hair);font:500 max(10px,1.9cqw)/1 var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--l2)}
.ef-ph i{width:1.2cqw;height:1.2cqw;min-width:5px;min-height:5px;border-radius:50%;background:#47D553}
.ef-ph em{margin-left:auto;font-style:normal;color:var(--l1);font-weight:400;white-space:nowrap}
.ef-row{flex:1;display:flex;flex-direction:column;justify-content:center;gap:1.5cqw;padding:2cqw 3cqw;transition:background .3s}
.ef-row>*{opacity:0}
.ef-row.block.on{background:rgba(226,72,64,.07)}
.ef-st{display:flex;align-items:center;gap:1.4cqw;font-weight:600;font-size:max(15px,3.3cqw);line-height:1;letter-spacing:-.005em}
.ef-st svg{width:3cqw;height:3cqw;min-width:11px;min-height:11px;flex:none}
.ef-st time{margin-left:auto;font:400 max(6.5px,1.35cqw)/1 var(--mono);color:#767c7e;letter-spacing:.06em;text-transform:uppercase;align-self:flex-start}
.ef-row.warn .ef-st{color:#D9A427}.ef-row.block .ef-st{color:#E24840}
.ef-pf{display:flex;align-items:baseline;gap:1cqw;font-weight:500;font-size:max(13px,2.7cqw);line-height:1.1;color:#fff;white-space:nowrap}
.ef-pf span{font:400 max(6.5px,1.35cqw)/1 var(--mono);letter-spacing:.1em;text-transform:uppercase;color:#767c7e}
.ef-ev{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;column-gap:1.6cqw;row-gap:.6cqw;font-size:max(11px,2.1cqw);line-height:1.35;color:var(--l1)}
.ef-ev span{flex:0 0 auto}
.ehf.is-narrow .ef{left:5%;right:5%;top:19%;bottom:19%}
.ef-ev b{margin-left:auto;font:400 max(10px,1.8cqw)/1 var(--mono);color:#8b8f8a;white-space:nowrap;letter-spacing:.02em}`;
EndpointHeroF.HTML=`<div class="ehf"><canvas class="stage"></canvas>
<div class="ef">
 <div class="ef-a"><svg class="ef-trace warn" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0H100V100" pathLength="100"/><path d="M0 0V100H100" pathLength="100"/></svg><div class="ef-ph"><i></i>Agent activity<em>2 agents</em></div>
 <div class="ef-row warn"><div class="ef-st"><svg viewBox="0 0 24 24" fill="none" stroke="#D9A427" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.5L22 20.5H2Z"/><path d="M12 10v4.6" stroke-linecap="round"/><circle cx="12" cy="17.4" r="1" fill="#D9A427" stroke="none"/></svg>User warned</div><div class="ef-pf">Claude in Chrome</div><div class="ef-ev"><span>Pasted customer emails into a prompt</span><b>research-assistant</b></div></div></div>
 <div class="ef-b"><svg class="ef-trace block" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M100 100H0V0" pathLength="100"/><path d="M100 100V0H0" pathLength="100"/></svg><div class="ef-row block"><div class="ef-st"><svg viewBox="0 0 24 24" fill="none" stroke="#E24840" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M5.8 18.2L18.2 5.8"/></svg>Action blocked</div><div class="ef-pf">ChatGPT · Web</div><div class="ef-ev"><span>Upload of q3-forecast.xlsx stopped</span><b>finance-copilot</b></div></div></div>
 <i class="ef-edge warn"></i><i class="ef-edge block"></i>
</div></div>`;











;(function(){var E=EndpointHeroF,BASE="[data-alterion-hero]{position:relative;overflow:hidden;background:#050505}[data-alterion-hero]>.sa-hero{position:absolute;inset:0;overflow:hidden;background:#050505}.sa-hero .fx.sh{left:10%;width:80%}.sa-hero .fx .ro{display:none}",DATA={"fmode": "trace"},WIN=false;
function css(){if(document.getElementById('alterion-hero-base'))return;var s=document.createElement('style');s.id='alterion-hero-base';s.textContent=BASE;document.head.appendChild(s)}
function mount(el){if(el.__alterionHero)return;el.__alterionHero=1;css();
  if(!document.getElementById('alterion-hero-endpoints')){var s=document.createElement('style');s.id='alterion-hero-endpoints';s.textContent=E.CSS||'';document.head.appendChild(s)}
  var host=document.createElement('div');host.className='sa-hero';el.appendChild(host);host.innerHTML=E.HTML;
  for(var k in DATA)host.dataset[k]=DATA[k];if(WIN){var fx=host.querySelector('.fx');if(fx)fx.classList.add('with-window')}
  E(host);
  el.addEventListener('alterion-hero-replay',function(){el.__alterionHero=0;el.innerHTML='';mount(el)})}
function run(){[].forEach.call(document.querySelectorAll('[data-alterion-hero="endpoints"]'),mount)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
})();
