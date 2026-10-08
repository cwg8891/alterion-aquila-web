/* Alterion solution pockets v5 (2026-10-07, final: Endpoints in the path, Estate sweep scan, Drift Echo, Risk snap to compliance, Cost meter and cap): one looping canvas above "The Solution" on the Endpoints, Agent Estate,
   Agent Drift, Risk & Compliance and Agent Cost pages (Shadow Agents keeps its slab).
   Markup: <canvas class="spk" data-pk="ep|es|dr|rk|co" width="340" height="272" aria-hidden="true"></canvas>  (dr: width="272" height="272").
   Self-starting, pauses when off screen, holds one still frame under prefers-reduced-motion. All orange; opaque fill rgb(87,33,22) like the Shadow slab. */
(function(){
const OR='#D24A2F',HI='#E8543A',LAT='rgba(219,57,38,0.85)',DIM='rgba(210,74,47,0.5)',FILL='rgb(87,33,22)',NODE='#DB3926';
const TILT=42*Math.PI/180,YAW0=-0.62,TAU=Math.PI*2;
const TV=[[0,1,0],[0.943,-0.333,0],[-0.471,-0.333,0.816],[-0.471,-0.333,-0.816]],TE=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
const cl=u=>u<0?0:u>1?1:u,eo=u=>1-Math.pow(1-cl(u),3),eio=u=>{u=cl(u);return u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2},lerp=(a,b,u)=>a+(b-a)*u;
function rot(v,a,b){let x=v[0],y=v[1],z=v[2],t;t=y*Math.cos(a)-z*Math.sin(a);z=y*Math.sin(a)+z*Math.cos(a);y=t;t=x*Math.cos(b)+z*Math.sin(b);z=-x*Math.sin(b)+z*Math.cos(b);x=t;return [x,y,z]}
function along(pts,u){const L=[];let T=0;for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1],pts[i][2]-pts[i-1][2]);L.push(d);T+=d}
  let s=cl(u)*T;for(let i=0;i<L.length;i++){if(s<=L[i]||i===L.length-1){const k=L[i]?Math.min(1,s/L[i]):0,a=pts[i],b=pts[i+1];return [lerp(a[0],b[0],k),lerp(a[1],b[1],k),lerp(a[2],b[2],k)]}s-=L[i]}}

function G(c,cyF,sc){const ctx=c.getContext('2d'),W=c.width,H=c.height,S=Math.min(W,H)*0.34*(sc||1),g={ctx,W,H,yaw:YAW0,pass:'all'};
  const P=g.P=(x,y,z)=>{const cs=Math.cos(g.yaw),sn=Math.sin(g.yaw),X=x*cs-z*sn,Z=x*sn+z*cs;return [W/2+X*S,H*cyF-y*Math.cos(TILT)*S+Z*Math.sin(TILT)*S*0.62]};
  g.depth=p=>p[0]*Math.sin(g.yaw)+p[2]*Math.cos(g.yaw);
  g.poly=(pts,close)=>{ctx.beginPath();pts.forEach((p,i)=>{const q=P(p[0],p[1],p[2]);i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1])});if(close)ctx.closePath()};
  g.ln=(pts,col,lw,dash)=>{if(g.pass==='fill')return;g.poly(pts);ctx.setLineDash(dash||[]);ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.stroke();ctx.setLineDash([])};
  g.face=pts=>{if(g.pass==='line')return;g.poly(pts,true);ctx.fillStyle=FILL;ctx.fill()};
  g.hull=pts3=>{if(g.pass==='line')return;const q=pts3.map(p=>P(p[0],p[1],p[2])).sort((a,b)=>a[0]-b[0]||a[1]-b[1]),cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]),lo=[],up=[];
    for(const p of q){while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],p)<=0)lo.pop();lo.push(p)}
    for(let i=q.length-1;i>=0;i--){const p=q[i];while(up.length>=2&&cr(up[up.length-2],up[up.length-1],p)<=0)up.pop();up.push(p)}
    const h=lo.slice(0,-1).concat(up.slice(0,-1));ctx.beginPath();h.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fillStyle=FILL;ctx.fill()};
  g.node=(p,r,col)=>{if(g.pass==='fill')return;const q=P(p[0],p[1],p[2]);ctx.fillStyle=col||NODE;ctx.fillRect(q[0]-r,q[1]-r,2*r,2*r)};
  g.ringPts=(y,r,n)=>{const o=[];n=n||36;for(let k=0;k<n;k++){const a=k/n*TAU;o.push([Math.cos(a)*r,y,Math.sin(a)*r])}return o};
  g.circ=(cx,y,cz,r,col,lw,fill)=>{const pts=[];for(let k=0;k<=72;k++){const a=k/72*TAU;pts.push([cx+Math.cos(a)*r,y,cz+Math.sin(a)*r])}if(fill)g.face(pts);if(col)g.ln(pts,col,lw)};
  g.ring=(p,r,col,lw)=>g.circ(p[0],p[1],p[2],r,col,lw,false);
  // solid box, every face filled (fill pass) and every edge drawn (line pass): the still-frame "object" style
  g.mbox=(x,y,z,w,h,d,lw)=>{const v=[[x,y,z],[x+w,y,z],[x+w,y,z+d],[x,y,z+d],[x,y+h,z],[x+w,y+h,z],[x+w,y+h,z+d],[x,y+h,z+d]];
    [[0,1,2,3],[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7],[4,5,6,7]].forEach(f=>g.face(f.map(i=>v[i])));
    [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]].forEach(([a,b])=>g.ln([v[a],v[b]],OR,lw||1.6))};
  g.gridH=(x,y,z,w,d,n,m,nodes)=>{for(let i=1;i<n;i++)g.ln([[x+w*i/n,y,z],[x+w*i/n,y,z+d]],LAT,1);for(let j=1;j<m;j++)g.ln([[x,y,z+d*j/m],[x+w,y,z+d*j/m]],LAT,1);if(nodes)for(let i=1;i<n;i++)for(let j=1;j<m;j++)g.node([x+w*i/n,y,z+d*j/m],1.7)};
  // lattice slab for the system scenes (fixed yaw): hidden corner is bottom (x1,z0); lattice on top + the two visible sides
  g.sbox=(x0,y0,z0,w,h,d,o)=>{o=o||{};const x1=x0+w,y1=y0+h,z1=z0+d;
    const v=[[x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1],[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]];g.hull(v);
    const n=o.n||0,m=o.m||0;
    if(n){for(let i=1;i<n;i++){const xx=x0+w*i/n;g.ln([[xx,y1,z0],[xx,y1,z1]],LAT,1);if(h>0.05)g.ln([[xx,y1,z1],[xx,y0,z1]],LAT,0.9)}
      for(let j=1;j<m;j++){const zz=z0+d*j/m;g.ln([[x0,y1,zz],[x1,y1,zz]],LAT,1);if(h>0.05)g.ln([[x0,y1,zz],[x0,y0,zz]],LAT,0.9)}
      if(o.nodes)for(let i=1;i<n;i++)for(let j=1;j<m;j++)g.node([x0+w*i/n,y1,z0+d*j/m],1.5)}
    [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]].forEach(e=>{const hid=e[0]===1||e[1]===1;g.ln([v[e[0]],v[e[1]]],hid?'rgba(210,74,47,0.3)':OR,hid?1:(o.lw||1.5))})};
  // agent: hollow (tumbling, bright edges) or filled (steady)
  g.agent=(p,r,a,b,filled,al)=>{const prev=ctx.globalAlpha;ctx.globalAlpha=prev*(al==null?1:al);
    const V=TV.map(t=>{const q=rot(t,a,b);return [p[0]+q[0]*r,p[1]+q[1]*r,p[2]+q[2]*r]});if(filled)g.hull(V);
    TE.forEach(e=>g.ln([V[e[0]],V[e[1]]],filled?OR:HI,filled?1.5:1.3));ctx.globalAlpha=prev};
  return g}
const tum=(u,k)=>[u*2.4+k*1.3,u*1.7+k*0.7];

const SC={
 /* Endpoints: in the path, on the device: a laptop with a lattice gate fixed to its edge. Prompts, tool calls and uploads
    leave the device on three lanes; most pass the gate, a risky one is stopped there and the gate cell lights. */
 ep:{cy:0.58,two:false,still:1.7,draw(g,t){g.yaw=YAW0;const ctx=g.ctx,y0=-0.3,yk=-0.22,bx0=-1.3,bx1=-0.2,bz0=-0.48,bz1=0.48,GX=0.22,lanes=[-0.28,0,0.28];
   const per=0.55,t1=0.5,t2=0.8,hold=0.75;
   const Pk=[];for(let k=Math.floor(t/per)-4;k<=Math.floor(t/per);k++){const age=t-k*per;if(age<0)continue;const z=lanes[((k%3)+3)%3],bl=((k%5)+5)%5===3;
     if(age>t1+(bl?hold:t2))continue;let x,al=1;if(age<t1)x=lerp(bx1,GX,age/t1);else if(bl)x=GX-0.02;else{const u=(age-t1)/t2;x=lerp(GX,1.3,u);al=1-u*u}Pk.push({x,z,al,bl,age})}
   const yl=y0+0.03,lane=(x0,x1)=>lanes.forEach(z=>g.ln([[x0,yl,z],[x1,yl,z]],OR,1.3));
   lane(GX,1.3);lanes.forEach(z=>g.node([1.3,yl,z],1.6,OR));
   Pk.filter(p=>p.x>GX).forEach(p=>{ctx.globalAlpha=p.al;g.ln([[Math.max(GX,p.x-0.22),yl,p.z],[p.x,yl,p.z]],HI,2);g.node([p.x,yl,p.z],2.7,HI);ctx.globalAlpha=1});
   g.sbox(GX,y0-0.04,-0.5,0.04,0.46,1.0,{lw:1.3});const gy=[y0-0.04,y0+0.42];[-0.14,0.14].forEach(z=>g.ln([[GX,gy[0],z],[GX,gy[1],z]],LAT,1));g.ln([[GX,y0+0.19,-0.5],[GX,y0+0.19,0.5]],LAT,1);
   Pk.filter(p=>p.bl&&p.age>t1).forEach(p=>{const u=(p.age-t1)/hold,f=u<0.6?1:1-(u-0.6)/0.4,c=[[GX,gy[0],p.z-0.14],[GX,gy[1],p.z-0.14],[GX,gy[1],p.z+0.14],[GX,gy[0],p.z+0.14]];
     ctx.globalAlpha=f;g.poly(c,true);ctx.fillStyle='rgba(232,84,58,0.5)';ctx.fill();g.ln(c.concat([c[0]]),HI,2.2);g.node([GX,yl,p.z],3.2,HI);ctx.globalAlpha=1});
   lane(bx1,GX);
   Pk.filter(p=>p.x<=GX&&!(p.bl&&p.age>t1)).forEach(p=>{g.ln([[Math.max(bx1,p.x-0.22),yl,p.z],[p.x,yl,p.z]],HI,2);g.node([p.x,yl,p.z],2.7,HI)});
   const sh=0.78,sb=0.2,scr=[[bx0,yk,bz0],[bx1,yk,bz0],[bx1,yk+sh,bz0-sb],[bx0,yk+sh,bz0-sb]];g.face(scr);
   for(let i=1;i<8;i++){const u=i/8;g.ln([[lerp(bx0,bx1,u),yk,bz0],[lerp(bx0,bx1,u),yk+sh,bz0-sb]],LAT,0.9)}for(let j=1;j<5;j++){const v=j/5;g.ln([[bx0,yk+sh*v,bz0-sb*v],[bx1,yk+sh*v,bz0-sb*v]],LAT,0.9)}
   g.ln(scr.concat([scr[0]]),OR,1.5);
   g.sbox(bx0,y0,bz0,bx1-bx0,yk-y0,bz1-bz0,{n:9,m:6,nodes:true})}},
 /* Agent Estate: the low dome, held still. A straight scan plane sweeps across it (5.2s loop); the cut line and the nodes it crosses
    light up, and every node it has passed stays lit until the sweep resets: one pass covers the whole estate. */
 es:{cy:0.56,two:true,still:2.2,draw(g,t){g.yaw=YAW0;const R=1.42,RV=0.58,y0=-0.22,BAND=0.12,sp=(lat,a)=>[Math.cos(a)*R*Math.cos(lat),y0+RV*Math.sin(lat),Math.sin(a)*R*Math.cos(lat)];
   const pts=g.ringPts(y0-BAND,R,48);for(let m=0;m<24;m++)for(let k=0;k<=8;k++)pts.push(sp(k/8*Math.PI/2,m/24*TAU));g.hull(pts);
   g.circ(0,y0-BAND,0,R,OR,1.4,true);for(let m=0;m<32;m++){const a=m/32*TAU;g.ln([[Math.cos(a)*R,y0-BAND,Math.sin(a)*R],[Math.cos(a)*R,y0,Math.sin(a)*R]],'rgba(219,57,38,0.7)',1)}
   g.circ(0,y0,0,R,OR,1.6);
   for(let k=1;k<6;k++){const lat=k/6*Math.PI/2;g.circ(0,y0+RV*Math.sin(lat),0,R*Math.cos(lat),'rgba(210,74,47,0.5)',1)}
   for(let m=0;m<16;m++){const a=m/16*TAU,mp=[];for(let k=0;k<=12;k++)mp.push(sp(k/12*Math.PI/2,a));g.ln(mp,'rgba(210,74,47,0.45)',1)}
   const C=5.2,u=t%C,sw=u<3?eio(u/3):1,s=lerp(-R-0.05,R+0.05,sw),fade=u>4.5?1-cl((u-4.5)/0.5):1,ctx=g.ctx;
   for(let m=0;m<16;m++)for(let k=1;k<6;k+=2){const p=sp(k/6*Math.PI/2,m/16*TAU+(k%4?0.2:0)),d=p[0]-s,hot=u<3.05&&Math.abs(d)<0.11,done=d<0;
     if(m%2&&!done&&!hot)continue;
     if(hot)g.node(p,2.6,HI);else if(done&&g.pass==='line'){ctx.globalAlpha=fade;g.node(p,1.9,HI);ctx.globalAlpha=1}else g.node(p,1.6,NODE)}
   if(g.pass==='line'){g.node([0,y0+RV,0],2.4,s>0&&u<4.5?HI:NODE);
     if(u<3.3){const pa=u>3?1-(u-3)/0.3:Math.min(1,u/0.25),yT=y0+RV+0.2,yB=y0-BAND;ctx.globalAlpha=pa;
       const zw=Math.sqrt(Math.max(0,R*R-s*s))+0.14;g.ln([[s,yB,-zw],[s,yB,zw],[s,yT,zw],[s,yT,-zw],[s,yB,-zw]],HI,1.3);[0.33,0.66].forEach(f=>g.ln([[s,yB+(yT-yB)*f,-zw],[s,yB+(yT-yB)*f,zw]],LAT,0.8));
       if(Math.abs(s)<R){const zm=Math.sqrt(R*R-s*s),arc=[];for(let i=0;i<=30;i++){const z=-zm+2*zm*i/30;arc.push([s,y0+RV*Math.sqrt(Math.max(0,1-(s*s+z*z)/(R*R))),z])}
         g.ln(arc,HI,2.2);g.ln([[s,yB,-zm],[s,y0,-zm]],HI,2);g.ln([[s,yB,zm],[s,y0,zm]],HI,2);g.ln([[s,yB,-zm],[s,yB,zm]],HI,1.6)}
       ctx.globalAlpha=1}}}},
 /* Agent Drift: Echo. The agent splits from a faint copy of itself, holds, then glides back into one (~9s). Drawn flat, not on the iso grid. */
 dr:{cy:0.5,two:false,still:2,draw(g,t){const c=g.ctx,W=g.W,H=g.H,px=W/136;
   const cyc=9,dr=u=>{u=u%cyc;return u<0.3?0:u<3.3?eo((u-0.3)/3):u<7?1:u<8.6?1-eio((u-7)/1.6):0};
   const edges=(P,alpha,lw)=>{c.lineCap='round';c.lineJoin='round';c.strokeStyle=OR;
     TE.forEach(e=>{const d=(P[e[0]][2]+P[e[1]][2])/2;c.globalAlpha=alpha*(0.78+0.22*(d+1)/2);c.lineWidth=lw*(1.6+0.6*(d+1)/2)*px;
       c.beginPath();c.moveTo(P[e[0]][0],P[e[0]][1]);c.lineTo(P[e[1]][0],P[e[1]][1]);c.stroke()});c.globalAlpha=1};
   const r3=(v,a,b,g2)=>{let x=v[0],y=v[1],z=v[2],q;q=y*Math.cos(a)-z*Math.sin(a);z=y*Math.sin(a)+z*Math.cos(a);y=q;q=x*Math.cos(b)+z*Math.sin(b);z=-x*Math.sin(b)+z*Math.cos(b);x=q;q=x*Math.cos(g2)-y*Math.sin(g2);y=x*Math.sin(g2)+y*Math.cos(g2);x=q;return [x,y,z]};
   const k=dr(t),a=0.9+t*0.55,b=t*0.9,gg=0.4+t*0.3,R=W*0.21,gx=W*0.5-W*0.15*k,gy=H*0.5-H*0.1*k,cx=W*0.5+W*0.15*k,cy=H*0.5+H*0.1*k;
   const Pp=(x,y,lag)=>TV.map(v=>{const q=r3(v,a-lag*0.6,b-lag,gg),s=2.6/(2.6-q[2]);return [x+q[0]*R*s,y-q[1]*R*s,q[2]]});
   const Gh=Pp(gx,gy,0.35*k),A=Pp(cx,cy,0);edges(Gh,0.3*Math.min(1,k*3),0.7);
   c.strokeStyle=OR;c.lineWidth=0.9*px;c.setLineDash([1.5*px,1.5*px]);c.globalAlpha=0.5*Math.min(1,k*2.5);
   for(let i=0;i<4;i++){c.beginPath();c.moveTo(Gh[i][0],Gh[i][1]);c.lineTo(A[i][0],A[i][1]);c.stroke()}c.setLineDash([]);c.globalAlpha=1;edges(A,1,1)}},
 /* Risk & Compliance: snap to compliance. Hollow agents tumble in; each lands on a lattice node, snaps upright, fills and is pinned (8.6s loop). */
 rk:{cy:0.56,two:false,still:7.2,draw(g,t){const C=8.6,u=t%C,fa=u>7.9?1-(u-7.9)/0.7:1,ctx=g.ctx;
   g.sbox(-1.1,-0.24,-0.8,2.2,0.24,1.6,{n:8,m:6});
   const Sl=[];for(let i=0;i<3;i++)for(let j=0;j<3;j++)Sl.push({p:[-0.66+i*0.66,0,-0.5+j*0.5],k:Sl.length});const ord=[4,0,8,2,6,1,7,3,5];
   ctx.globalAlpha=fa;
   Sl.sort((a,b)=>g.depth(a.p)-g.depth(b.p)).forEach(s=>{const ti=0.7+ord.indexOf(s.k)*0.62,hy=0.22,r=0.15;if(u<ti-1.2)return;
     const f=eo((u-(ti-1.2))/1.2),k2=eio((u-ti)/0.35),ang=s.k*2.1,st=[s.p[0]+0.55*Math.cos(ang),hy+1.0,s.p[2]+0.55*Math.sin(ang)];
     const pos=[lerp(st[0],s.p[0],f),lerp(st[1],hy,f),lerp(st[2],s.p[2],f)];let [a,b]=tum(u,s.k);a%=TAU;b%=TAU;
     a=lerp(a,a>Math.PI?TAU:0,k2);b=lerp(b,b>Math.PI?TAU+0.35:0.35,k2);
     if(u>=ti){g.ln([[s.p[0],hy-0.05,s.p[2]],[s.p[0],0,s.p[2]]],OR,1,[2,2]);g.node(s.p,2.3,HI);const q=(u-ti)/0.8;if(q<1){const pa=ctx.globalAlpha;ctx.globalAlpha=pa*(1-q);g.ring(s.p,0.08+0.2*q,HI,1.2);ctx.globalAlpha=pa}}
     g.agent(pos,r,a,b,k2>0.5,Math.min(1,f*2))});ctx.globalAlpha=1}},
 /* Agent Cost: meter and cap. A gate meters each agent; at the cap it drops and the rest reroute to the cheaper lane; then the budget resets (9s loop). */
 co:{cy:0.56,two:false,still:6.2,draw(g,t){const C=9,u=t%C,y=0.004,ctx=g.ctx,gx=0.05,tr=2.8,frac=(gx+1.35)/2.7;
   const spawn=[0,0.9,1.8,2.7,3.6,4.75,5.65],passT=k=>spawn[k]+tr*frac,capT=passT(4),reset=u>8.3;
   let cnt=0;for(let k=0;k<5;k++)if(u>=passT(k))cnt++;const cf=reset?1-cl((u-8.3)/0.5):1,closed=u>=capT&&!reset?eio((u-capT)/0.3):reset?1-cl((u-8.3)/0.4):0;
   g.sbox(-1.3,-0.22,-0.85,2.6,0.22,1.7,{n:10,m:7});
   g.ln([[-1.3,y,-0.1],[1.3,y,-0.1]],OR,1.5);const act=u>=capT&&!reset;g.ln([[-0.75,y,-0.1],[-0.4,y,0.5],[1.3,y,0.5]],act?OR:DIM,act?1.6:1,act?null:[3,3]);
   ctx.globalAlpha=cf;for(let i=0;i<cnt;i++)g.sbox(0.22,0.01+i*0.075,-0.78,0.24,0.06,0.24,{lw:1.2});ctx.globalAlpha=1;
   const capY=5*0.075+0.02;g.ln([[0.18,capY,-0.82],[0.5,capY,-0.82],[0.5,capY,-0.5],[0.18,capY,-0.5]],HI,1.6);
   g.sbox(gx-0.03,0,-0.4,0.06,0.5,0.06,{lw:1.3});g.sbox(gx-0.03,0.5,-0.4,0.06,0.06,0.62,{lw:1.3});
   const by=lerp(0.44,0.1,closed),ags=[];
   spawn.forEach((s0,k)=>{const age=u-s0;if(age<0||age>=tr)return;const uu=age/tr,
     path=k<5?[[-1.35,0.2,-0.1],[1.35,0.2,-0.1]]:[[-1.35,0.2,-0.1],[-0.75,0.2,-0.1],[-0.4,0.2,0.5],[1.35,0.2,0.5]];ags.push({p:along(path,uu),u:uu,k})});
   ags.sort((a,b)=>g.depth(a.p)-g.depth(b.p)).forEach(a=>{const [p,q]=tum(u,a.k);g.agent(a.p,0.13,p,q,false,Math.min(1,a.u*8,(1-a.u)*8))});
   g.sbox(gx-0.03,by,-0.4,0.06,0.05,0.62,{lw:1.4});g.sbox(gx-0.03,0,0.16,0.06,0.5,0.06,{lw:1.3})}}
};

const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,freeze=(new URLSearchParams(location.search)).get('pk-t');
const items=[].map.call(document.querySelectorAll('canvas.spk'),c=>{const sc=SC[c.dataset.pk];return sc?{c,sc,g:G(c,sc.cy,sc.sc),vis:true}:null}).filter(Boolean);
if(!items.length)return;
function paint(o,t){const g=o.g;g.ctx.setTransform(1,0,0,1,0,0);g.ctx.clearRect(0,0,g.W,g.H);g.ctx.globalAlpha=1;
  try{if(o.sc.two){g.pass='fill';o.sc.draw(g,t);g.pass='line';o.sc.draw(g,t)}else{g.pass='all';o.sc.draw(g,t)}}catch(e){}}
if(reduced||freeze!=null){items.forEach(o=>paint(o,freeze!=null?+freeze:o.sc.still));return}
if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{const o=items.find(i=>i.c===e.target);if(o)o.vis=e.isIntersecting}));items.forEach(o=>io.observe(o.c))}
const t0=performance.now();
(function loop(now){const t=(now-t0)/1000;items.forEach(o=>{if(o.vis)paint(o,t)});requestAnimationFrame(loop)})(t0);
})();
