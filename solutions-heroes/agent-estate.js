/*! Alterion solutions hero: Control your entire agent estate (agent-estate). Desktop and mobile in one file: the animation adapts to its container width (phone layout under 520px).
   Embed: <div data-alterion-hero="agent-estate" style="aspect-ratio:5/4;width:100%"></div> + this script. */
(function(){
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
  const t=reduced?4:Math.max(0,(now-T0)/1000),narrow=r.width<520;root.querySelector('.esh').classList.toggle('is-narrow',narrow);T=narrow?TN:TW;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='#EDEDEA';for(const s of STARS){ctx.globalAlpha=s.b*(0.6+0.4*Math.sin(t*s.sp+s.ph));ctx.beginPath();ctx.arc(s.x*W,s.y*H,s.r*px,0,6.283);ctx.fill()}ctx.globalAlpha=1;
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
    const pos=narrow?AGN[i]:a,cx=pos.x*W,cy=pos.y*H,R0=W*(narrow?0.06:0.036);
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
    const h=R0*1.9,s=2*h,bk=reduced?1:eoc((t-(C?T.box[0]:T.box[0]+i*0.1))/(T.box[1]-T.box[0]));
    if(bk>0){ctx.strokeStyle='#8E8B86';ctx.lineWidth=1.2*px;ctx.setLineDash([4*s*bk,4*s]);ctx.beginPath();ctx.rect(cx-h,cy-h,s,s);ctx.stroke();ctx.setLineDash([])}
    // labels (claude): the platform under each agent
    if(C&&!narrow){ctx.font='500 '+Math.max(8,W/px*0.018)*px+'px "IBM Plex Mono", ui-monospace, monospace';ctx.textAlign='center';ctx.fillStyle='#8E8B86';ctx.globalAlpha=reduced?1:eoc((t-T.box[0])/0.3);
      if('letterSpacing' in ctx)ctx.letterSpacing=(0.08*Math.max(8,W/px*0.018)*px)+'px';ctx.fillText(a.label.toUpperCase(),cx,cy+h+Math.max(12,W/px*0.03)*px);if('letterSpacing' in ctx)ctx.letterSpacing='0px';ctx.globalAlpha=1}
    // propagation line (claude): window edge → agent box; a green pulse travels down it on the tick
    if(C&&wk>=1&&!narrow){const ex=(a.x<0.5?wr.left-sr.left:wr.right-sr.left)*px,row=ROWS[i].getBoundingClientRect(),ey=(row.top-sr.top+row.height/2)*px,bx=a.x<0.5?cx+h:cx-h;
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












;(function(){var E=EstateHeroC,BASE="[data-alterion-hero]{position:relative;overflow:hidden;background:transparent}[data-alterion-hero]>.sa-hero{position:absolute;inset:0;overflow:hidden;background:transparent}.sa-hero .fx.sh{left:10%;width:80%}.sa-hero .fx .ro{display:none}",DATA={"emode": "chris"},WIN=false;
function css(){if(document.getElementById('alterion-hero-base'))return;var s=document.createElement('style');s.id='alterion-hero-base';s.textContent=BASE;document.head.appendChild(s)}
function mount(el){if(el.__alterionHero)return;el.__alterionHero=1;css();
  if(!document.getElementById('alterion-hero-agent-estate')){var s=document.createElement('style');s.id='alterion-hero-agent-estate';s.textContent=E.CSS||'';document.head.appendChild(s)}
  var host=document.createElement('div');host.className='sa-hero';el.appendChild(host);host.innerHTML=E.HTML;
  for(var k in DATA)host.dataset[k]=DATA[k];if(WIN){var fx=host.querySelector('.fx');if(fx)fx.classList.add('with-window')}
  E(host);
  el.addEventListener('alterion-hero-replay',function(){el.__alterionHero=0;el.innerHTML='';mount(el)})}
function run(){[].forEach.call(document.querySelectorAll('[data-alterion-hero="agent-estate"]'),mount)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
})();
