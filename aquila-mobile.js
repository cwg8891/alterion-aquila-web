/* Webflow Designer safety: mark that JS is live, so the .blk reveal in
   aquila-mobile.css stays inert in the Designer canvas. */
document.documentElement.classList.add('js-anim');

var CFG={"W":390,"H":300,"CX":195,"CY":215,"D":1650.0,"F":780.0,"yaw0":-26,"pitch":8,
"planes":[
 {"name":"ON DEVICE AGENTS","w":450,"h":860,"x":25,"y":0,"z":-430,"stroke":"#4A4845","sop":0.9,"fill":"#131211","fop":0.5,"kind":"endpoint"},
 {"name":"AQUILA CODE","w":330,"h":150,"x":-85,"y":310,"z":40,"stroke":"#6E6B66","sop":0.8,"fill":"#141311","fop":0.45,"kind":"prod","icon":"code"},
 {"name":"AQUILA BROWSER","w":330,"h":150,"x":-85,"y":0,"z":40,"stroke":"#6E6B66","sop":0.85,"fill":"#141311","fop":0.45,"kind":"prod","icon":"browser"},
 {"name":"AQUILA GATEWAY","w":330,"h":150,"x":-85,"y":-310,"z":40,"stroke":"#6E6B66","sop":0.9,"fill":"#141311","fop":0.45,"kind":"prod","icon":"gateway"}],
"paths":[
 {"key":"code","planeIdx":1,"origin":[185,310],"gate":[0,-30],"exit":[-80,44],"block":"BLOCKED · SECRET","acts":["PROMPT","TOOL CALL","COMMIT"],"tag":"CODING TOOL PROTECTION","flag":false},
 {"key":"browser","planeIdx":2,"origin":[185,0],"gate":[0,-30],"exit":[-80,44],"block":"BLOCKED · PII","acts":["PROMPT","PASTE","UPLOAD"],"tag":"BROWSER TOOL PROTECTION","flag":false},
 {"key":"gateway","planeIdx":3,"origin":[185,-310],"gate":[0,-30],"exit":[-80,44],"block":"ACTION BLOCKED","acts":["EGRESS","API CALL","UNKNOWN DEST"],"tag":"BROAD AGENTIC APPLICATION","flag":true,"noAsk":true,"allowTag":"OBSERVED"}]};
var NS='http://www.w3.org/2000/svg';
var msPool=[31,34,38,41,42,44,47,49];
var AGD1='M0.527283 28.0084L11.6482 0.717409C11.7514 0.464044 12.0937 0.422918 12.258 0.641638L29.7885 23.9697C29.9498 24.1844 29.8233 24.4963 29.5573 24.5331L0.901607 28.4902C0.632953 28.5273 0.42494 28.2596 0.527283 28.0084Z';
var AGD2='M0.46516 28.5732L14.8031 16.8075M14.8031 16.8075L29.9821 24.2729M14.8031 16.8075L12.0474 0.334114';
var ICONS={
 code:[[[-13,15],[-28,0],[-13,-15]],[[13,15],[28,0],[13,-15]],[[6,19],[-6,-19]]],
 browser:[[[-30,19],[30,19],[30,-19],[-30,-19]],[[-30,9],[30,9]]],
 gateway:[[[-25.2,14],[-19.7,14],[-12.1,12.1],[-6.3,7],[-0.2,2.4],[3.6,0.6],[7.2,0],[25.2,0]],[[-25.2,-14],[-19.7,-14],[-12.1,-12.1],[-6.3,-7],[-0.2,-2.4],[3.6,-0.6],[7.2,0],[22.4,0]],[[16.8,8.4],[25.2,0],[16.8,-8.4]]]};
function hex2rgb(h){return [parseInt(h.substr(1,2),16),parseInt(h.substr(3,2),16),parseInt(h.substr(5,2),16)]}
function mix(a,b,u){var A=hex2rgb(a),B=hex2rgb(b);
 return 'rgb('+Math.round(A[0]+(B[0]-A[0])*u)+','+Math.round(A[1]+(B[1]-A[1])*u)+','+Math.round(A[2]+(B[2]-A[2])*u)+')'}
function aCl(v){return v<0?0:v>1?1:v}
function eoc(u){u=aCl(u);return 1-Math.pow(1-u,3)}
function txScale(e){
 var t=e.getAttribute('transform')||'';
 var m=t.match(/matrix\(([-0-9.eE]+)[ ,]+([-0-9.eE]+)/);
 if(!m)return 1;
 return Math.hypot(parseFloat(m[1]),parseFloat(m[2]))||1;
}
function fitText(e,avail){
 if(!e.getComputedTextLength)return;
 var m=txScale(e),g=0;
 while(e.textContent.length>1&&e.getComputedTextLength()*m>avail&&g<60){e.textContent=e.textContent.slice(0,-1);g++;}
 if(e.textContent.length>2)e.textContent=e.textContent.slice(0,-2);
}
var CODE_POOL=['const ctx = agent.context()','await aquila.inspect(req)','if (v.block) return deny()','\u00A0\u00A0commit("api/auth.ts")','tool.exec("git push")','const v = policy.verdict(ctx)','\u00A0\u00A0fetch(PROVIDER_URL)','export const guard = aquila()','agent.run({files: 3})','\u00A0\u00A0return allow(ctx)'];
var BRZ_POOL=['prompt: "summarize q3"','paste: customers.csv','aquila: inspecting\u2026','reply: 2,340 tokens','chat.openai.com','upload: deck_v2.pdf'];
var GPOOL=['chrome.exe \u2192 api.openai.com:443','curl \u2192 104.18.32.11:443','python3.11 \u2192 unknown-host.ai','claude-cli \u2192 api.anthropic.com','node \u2192 registry.npmjs.org','Slack \u2192 wss.slack.com:443','ollama \u2192 127.0.0.1:11434','code.exe \u2192 copilot.github','ssh \u2192 10.4.19.220:22','unknown \u2192 45.83.11.7:8443'];
function gPick(){return GPOOL[Math.floor(Math.random()*GPOOL.length)]}

var VCOL={allow:'#47D553',notify:'#D9A427',block:'#E24840',obs:'#47D553',disc:'#B6BCD9',flag:'#E24840'};
var VMSG={allow:['ACCESS ALLOWED','#47D553'],notify:['NOTIFY USER','#D9A427'],block:['ACTION BLOCKED','#E24840'],obs:['ACCESS ALLOWED','#47D553'],disc:['UNCATALOGUED DESTINATION','#B6BCD9'],flag:['ACTION BLOCKED','#E24840']};
var LANES={
 code:[{o:[185,310],cell:[1,2]},{o:[185,310],cell:[3,2]},{o:[185,310],cell:[4,2]}],
 browser:[{o:[185,0],cell:[1,2]},{o:[185,0],cell:[3,2]},{o:[185,0],cell:[4,2]}],
 gateway:[{o:[185,-310],cell:[1,2]},{o:[185,-310],cell:[3,2]},{o:[185,-310],cell:[4,2]}]};
function Scene(rootId, idx){
 var self=this;
 this.visible=false; this.everVis=false; this.hi=0; this.pulses=[]; this.spawnTimer=700+idx*300;
 this.phase=idx*4.7; this.asmT=-1;
 var pp=CFG.paths[idx], P=CFG.planes, pl=P[pp.planeIdx];
 var root=document.getElementById(rootId);
 var bk=root.querySelector('.bk'), scene=root.querySelector('.sc'), fx=root.querySelector('.fx');
 function el(n,at,parent){var e=document.createElementNS(NS,'n'===n?n:n);for(var k in at)e.setAttribute(k,at[k]);(parent||scene).appendChild(e);return e}
 var PANY=0,PANX=0,ZM=1.4;
 var STARS=[];
 (function(){var sd=97+idx*13;function rnd(){sd=(sd*16807)%2147483647;return sd/2147483647}
  for(var i=0;i<40;i++){
   STARS.push({e:el('circle',{cx:(rnd()*390).toFixed(1),cy:(rnd()*300).toFixed(1),r:(0.5+rnd()*0.9).toFixed(2),fill:'#EDEDEA',opacity:0},bk),
    b:0.10+rnd()*0.30,ph:rnd()*6.283,sp:0.5+rnd()*1.4});
  }})();
 var cam={yaw:CFG.yaw0*Math.PI/180};
 function proj(x,y,z){
  var cy=Math.cos(cam.yaw),sy=Math.sin(cam.yaw);
  var cp=Math.cos(CFG.pitch*Math.PI/180),sp=Math.sin(CFG.pitch*Math.PI/180);
  var xr=x*cy+z*sy, zr=-x*sy+z*cy;
  var yr=y*cp-zr*sp, z2=y*sp+zr*cp;
  var s=CFG.F/(CFG.D-z2)*ZM;
  return [CFG.CX+xr*s+PANX, CFG.CY-yr*s+PANY];
 }
 function onPlane(p,lx,ly){return proj(p.x+lx,p.y+ly,p.z)}
 (function(){var c0=proj(pl.x,pl.y,pl.z);PANX=185-c0[0];PANY=142-c0[1];})();
 var PY0=pl.y;
 function rr(p){
  var r=4,n=2,hw=p.w/2,hh=p.h/2,pts=[];
  [[hw-r,hh-r,0],[-hw+r,hh-r,90],[-hw+r,-hh+r,180],[hw-r,-hh+r,270]].forEach(function(c){
   for(var i=0;i<=n;i++){var a=(c[2]+90*i/n)*Math.PI/180;
    pts.push([p.x+c[0]+r*Math.cos(a), p.y+c[1]+r*Math.sin(a)]);}
  });
  return 'M'+pts.map(function(q){var s=proj(q[0],q[1],p.z);return s[0].toFixed(1)+' '+s[1].toFixed(1)}).join(' L')+' Z';
 }
 function planeText(elm,p,lx,ly,px,ls,anchor){
  var o=proj(p.x+lx,p.y+ly,p.z);
  var ex=proj(p.x+lx+10,p.y+ly,p.z);
  var ey=proj(p.x+lx,p.y+ly+10,p.z);
  var ax=(ex[0]-o[0])/10, ay=(ex[1]-o[1])/10;
  var bx=-(ey[0]-o[0])/10, by=-(ey[1]-o[1])/10;
  var vm=Math.hypot(bx,by)||1;
  elm.setAttribute('transform','matrix('+ax.toFixed(4)+' '+ay.toFixed(4)+' '+bx.toFixed(4)+' '+by.toFixed(4)+' '+o[0].toFixed(1)+' '+o[1].toFixed(1)+')');
  elm.setAttribute('x',0);elm.setAttribute('y',0);
  elm.setAttribute('font-size',(px/vm).toFixed(2));
  elm.setAttribute('letter-spacing',(ls/vm).toFixed(2));
  elm.setAttribute('text-anchor',anchor||'start');
 }
 // ---- agent sim (tetrahedra) ----
 var AGS=[],AG_N=14,hotCount=0,escCount=0;
 (function(){var s=11+idx*7;function rnd(){s=(s*16807)%2147483647;return s/2147483647}
  var p=P[0],hw=p.w/2-70,hh=p.h/2-60;
  for(var i=0;i<AG_N;i++){
   AGS.push({x:(rnd()*2-1)*hw,y:(rnd()*2-1)*hh,vx:0,vy:0,
    temp:Math.pow(rnd(),1.6),state:'live',t:rnd()*6000,life:6000+rnd()*9000,
    al:1,hot:0,esc:false,escP:0,ph:rnd()*6.283,rot:rnd()*360,scl:0.26+rnd()*0.08});
  }})();
 function agRespawn(a){
  var p=P[0],hw=p.w/2-70,hh=p.h/2-60;
  a.x=(Math.random()*2-1)*hw;a.y=(Math.random()*2-1)*hh;
  a.vx=0;a.vy=0;a.temp=Math.pow(Math.random(),1.6);
  a.state='in';a.t=0;a.al=0;a.life=6000+Math.random()*9000;
  a.rot=Math.random()*360;a.scl=0.26+Math.random()*0.08;
  if(a.hot)hotCount--;a.hot=0;if(a.esc)escCount--;a.esc=false;a.escP=0;a.cap=false;
 }
 var CAP={on:false,agent:null,phase:'none',heldT:0,tx:pp.origin[0],ty:pp.origin[1]};
 function agStep(a,dt){
  var p=P[0],hw=p.w/2-70,hh=p.h/2-60;
  if(a.cap){
   a.x+=(CAP.tx-a.x)*Math.min(1,dt*0.005);
   a.y+=(CAP.ty-a.y)*Math.min(1,dt*0.005);
   a.vx=0;a.vy=0;a.al=Math.min(1,a.al+dt/300);
   if(CAP.phase=='fly'&&Math.hypot(CAP.tx-a.x,CAP.ty-a.y)<4){
    CAP.phase='held';CAP.heldT=performance.now();a.x=CAP.tx;a.y=CAP.ty;
   }
   return;
  }
  a.t+=dt;
  if(a.state=='in'){a.al=Math.min(1,a.t/600);if(a.al>=1){a.state='live';a.t=0}}
  else if(a.state=='live'&&!a.esc&&a.t>a.life){a.state='out';a.t=0}
  else if(a.state=='out'){a.al=1-a.t/700;if(a.al<=0){agRespawn(a);return}}
  var eff=a.temp+(a.hot?0.4:0);
  a.vx+=(Math.random()-0.5)*eff*0.0026*dt;
  a.vy+=(Math.random()-0.5)*eff*0.002*dt;
  if(Math.random()<eff*0.00035*dt){
   var an=Math.random()*6.283,imp=0.08+Math.random()*0.1;
   a.vx+=Math.cos(an)*imp;a.vy+=Math.sin(an)*imp;
  }
  var dmp=Math.exp(-dt*0.0018);a.vx*=dmp;a.vy*=dmp;
  var sp=Math.hypot(a.vx,a.vy),cap2=0.12;
  if(sp>cap2){a.vx*=cap2/sp;a.vy*=cap2/sp}
  a.x+=a.vx*dt;a.y+=a.vy*dt;
  if(!a.esc){
   if(a.x>hw){a.x=hw;a.vx=-Math.abs(a.vx)}
   if(a.x<-hw){a.x=-hw;a.vx=Math.abs(a.vx)}
   if(a.y>hh){a.y=hh;a.vy=-Math.abs(a.vy)}
   if(a.y<-hh){a.y=-hh;a.vy=Math.abs(a.vy)}
   var nearEdge=Math.abs(a.x)>hw-20||Math.abs(a.y)>hh-16;
   if(nearEdge&&escCount<1&&eff>0.55&&Math.random()<0.00022*dt){
    a.esc=true;escCount++;
    var anx=a.x/hw,any=a.y/hh,m=Math.hypot(anx,any)||1;
    a.vx=anx/m*0.13;a.vy=any/m*0.1;
   }
   if(!a.hot&&hotCount<2&&a.state=='live'&&Math.random()<0.000012*dt){
    a.hot=1;hotCount++;a.hotT=3200+Math.random()*2600;
   }
   if(a.hot){a.hotT-=dt;if(a.hotT<=0){a.hot=0;hotCount--}}
  } else {
   a.escP+=dt/2600;
   if(a.escP>=1){agRespawn(a)}
  }
 }
 // ---- build ----
 var planesEl=[],labels=[],grid=[],gridDots=[],agEls=[],icons={};
 P.forEach(function(p,i){
  var host=(p.kind=='endpoint')?bk:scene;
  planesEl.push(el('path',{fill:p.fill,'fill-opacity':p.fop,stroke:p.stroke,'stroke-opacity':p.sop,'stroke-width':1.1,pathLength:100,'stroke-dasharray':100,'stroke-dashoffset':100},host));
  if(i===pp.planeIdx){
   for(var g=0;g<8;g++)grid.push(el('line',{stroke:'#D24A2F','stroke-opacity':0,'stroke-width':0.8}));
   for(var di=0;di<7;di++)for(var dj=0;dj<5;dj++){
    if((di===0||di===6)&&(dj===0||dj===4))continue;
    gridDots.push(el('circle',{r:1.2,fill:'#E8543A',opacity:0}));
   }
  }
  if(p.kind=='endpoint'){
   AGS.forEach(function(){
    var ag=el('g',{opacity:0.4},bk);
    el('path',{d:AGD1,fill:'none',stroke:'#8E8B86','stroke-width':2.4},ag);
    el('path',{d:AGD2,fill:'none',stroke:'#8E8B86','stroke-width':2.4},ag);
    agEls.push(ag);
   });
  }
  if(p.kind=='prod'){
   var shapes=[];
   ICONS[p.icon].forEach(function(){shapes.push(el('path',{fill:'none',stroke:'#8E8B86','stroke-width':1.1,'stroke-linejoin':'round','stroke-linecap':'round',opacity:0}))});
   if(p.icon=='browser')icons[i+'dot']=el('circle',{r:1.3,fill:'#8E8B86',opacity:0});
   icons[i]=shapes;
  }
  var t=el('text',{fill:'#EDEDEA','letter-spacing':1.5});t.textContent=(p.kind=='endpoint')?'':p.name;
  labels.push(t);
 });
 var epTitle=el('text',{fill:'#EDEDEA'},bk);epTitle.textContent='ON DEVICE AGENTS';
 var tagLab=el('text',{fill:'#FFFFFF',opacity:0});tagLab.textContent=pp.tag;
 var LN=LANES[pp.key].map(function(ln){
  return {cfg:ln,
   line1:el('path',{fill:'none',stroke:'#DDD9D2','stroke-width':0.8,'stroke-linecap':'round','stroke-opacity':0},bk),
   line2:el('path',{fill:'none',stroke:'#DDD9D2','stroke-width':0.8,'stroke-linecap':'round','stroke-opacity':0}),
   cellP:el('polygon',{'fill-opacity':0,'stroke-width':1.1,'stroke-opacity':0}),
   vT:-1e9};
 });
 var VB={t:-1e9,txt:'',col:'#47D553'};
 var vban=el('text',{opacity:0,'font-weight':'500'},fx);
 // ---- v37 floating screen ----
 var M={x:pl.x+235,y:pl.y-92,z:pl.z+150,sc:1.0};
 var mg=el('g',{opacity:0},scene);
 function mel(at){return el('path',at,mg)}
 function mPt(lx,ly,lz){return proj(M.x+lx*M.sc,M.y+ly*M.sc,M.z+(lz||0)*M.sc)}
 function mPath(pts,close){return 'M'+pts.map(function(q){var v=mPt(q[0],q[1],q[2]||0);return v[0].toFixed(1)+' '+v[1].toFixed(1)}).join(' L')+(close?' Z':'')}
 (function(){
  var tgt=[289,206];
  for(var it=0;it<6;it++){
   var c=mPt(0,57,0);
   var dx=tgt[0]-c[0],dy=tgt[1]-c[1];
   if(Math.abs(dx)+Math.abs(dy)<0.5)break;
   var s1=mPt(10,57,0),s2=mPt(0,67,0);
   var ax=(s1[0]-c[0])/(10*M.sc), ay2=(s1[1]-c[1])/(10*M.sc);
   var bx=(s2[0]-c[0])/(10*M.sc), by=(s2[1]-c[1])/(10*M.sc);
   var det=ax*by-ay2*bx; if(!det)break;
   M.x+=(dx*by-dy*bx)/det; M.y+=(ax*dy-ay2*dx)/det;
  }
 })();
 var MP={back:mel({fill:'none',stroke:'#3E3C39','stroke-width':1}),
  c:[mel({fill:'none',stroke:'#4A4845','stroke-width':1}),mel({fill:'none',stroke:'#4A4845','stroke-width':1}),mel({fill:'none',stroke:'#4A4845','stroke-width':1}),mel({fill:'none',stroke:'#4A4845','stroke-width':1})],
  face:mel({fill:'#101010','fill-opacity':0.95,stroke:'#8E8B86','stroke-width':1.2}),
  icon:[mel({fill:'none',stroke:'#EDEDEA','stroke-width':1.3,'stroke-linejoin':'round','stroke-linecap':'round'}),mel({fill:'none',stroke:'#EDEDEA','stroke-width':1.3,'stroke-linejoin':'round','stroke-linecap':'round'}),mel({fill:'none',stroke:'#EDEDEA','stroke-width':1.3,'stroke-linejoin':'round','stroke-linecap':'round'})]};
 var MCH={S:[],last:0,k:0},MROWS=[],MPANES=[],MGH=null;
 if(pp.key==='code'){
  for(var mr=0;mr<5;mr++){MCH.S.push({t:CODE_POOL[mr%CODE_POOL.length]});MROWS.push(el('text',{fill:'#8E8B86',opacity:0},mg));}
 }else if(pp.key==='browser'){
  MP.wB=mel({fill:'none',stroke:'#4A4845','stroke-width':0.9});
  MP.wBt=mel({fill:'none',stroke:'#33312E','stroke-width':0.9});
  MP.wM=mel({fill:'#111010','fill-opacity':0.9,stroke:'#5C5A55','stroke-width':0.9});
  MP.wMt=mel({fill:'none',stroke:'#4A4845','stroke-width':0.9});
  MP.wF=mel({fill:'#141311','fill-opacity':0.96,stroke:'#4A4845','stroke-width':1});
  MP.dots=[0,1,2].map(function(){return el('circle',{r:1.1,fill:'none',stroke:'#4A4845','stroke-width':0.9},mg)});
  MP.url=mel({fill:'none',stroke:'#4A4845','stroke-width':0.9});
  for(var br=0;br<3;br++){MCH.S.push({t:BRZ_POOL[br%BRZ_POOL.length]});MROWS.push(el('text',{fill:'#8E8B86',opacity:0},mg));}
 }else{
  MPANES=[
   {x:-79,y:60,w:44,h:36, rate:820,  rows:3, type:'term'},
   {x:-31,y:66,w:40,h:30, rate:1500, rows:3, type:'app'},
   {x:11, y:62,w:32,h:34, rate:2600, rows:3, type:'idle'},
   {x:-79,y:16,w:38,h:40, rate:1150, rows:4, type:'table'},
   {x:-37,y:16,w:46,h:26, rate:640,  rows:2, type:'meter'}
  ];
  MPANES.forEach(function(p2){
   p2.frame=mel({fill:'#111010','fill-opacity':0.72,stroke:'#4A4845','stroke-width':0.9});
   p2.bar=mel({fill:'none',stroke:'#33312E','stroke-width':0.9});
   p2.deco=mel({fill:'none',stroke:'#5C5A55','stroke-width':0.75,'stroke-linejoin':'round','stroke-linecap':'round'});
   if(p2.type==='meter')p2.mbar=mel({fill:'none',stroke:'#8E8B86','stroke-width':1.4});
   p2.txt=[];for(var r3=0;r3<p2.rows;r3++)p2.txt.push(el('text',{fill:'#8E8B86',opacity:0},mg));
   p2.S=[];for(var r4=0;r4<p2.rows;r4++)p2.S.push(gPick());
   p2.last=performance.now()-Math.random()*p2.rate;
   p2.vT=0;p2.vc='#47D553';
  });
  MGH={x:13,y:16,w:34,h:30,alive:false,t0:0,last:performance.now(),next:performance.now()+2600,S:[gPick(),gPick()]};
  MGH.frame=mel({fill:'#111010','fill-opacity':0,stroke:'#4A4845','stroke-width':0.9,'stroke-opacity':0});
  MGH.txt=[el('text',{fill:'#8E8B86',opacity:0},mg),el('text',{fill:'#8E8B86',opacity:0},mg)];
 }
 function mTxt(T,lx,ly,txt,px,col,op,rEdge){
  T.textContent=txt;
  planeText(T,{x:M.x+lx*M.sc,y:M.y+ly*M.sc,z:M.z},0,0,px*M.sc,0.15);
  T.setAttribute('fill',col);T.setAttribute('opacity',op);
  var a1=mPt(lx,ly,0),a2=mPt(rEdge,ly,0);
  fitText(T,Math.hypot(a2[0]-a1[0],a2[1]-a1[1]));
 }
 function fadeOutEl(elm,ms){
  var t0=performance.now();
  (function f(now){var u2=(now-t0)/ms;if(u2>=1){elm.remove();return}
   elm.setAttribute('opacity',0.9*(1-u2));requestAnimationFrame(f)})(t0);
 }
 function cellRipple(c,r){
  var x0=-pl.w/2+c*pl.w/6, x1=x0+pl.w/6, y0=-pl.h/2+r*pl.h/4, y1=y0+pl.h/4;
  var cx=(x0+x1)/2, cy=(y0+y1)/2, hw=(x1-x0)/2, hh=(y1-y0)/2;
  [0,220].forEach(function(delay){
   var poly=el('polygon',{fill:'none',stroke:'#E24840','stroke-width':delay?0.7:1,opacity:0},fx);
   var t0=performance.now()+delay;
   (function f(now){
    var u2=(now-t0)/900;
    if(u2>=1){poly.remove();return}
    if(u2>0){
     var e=eoc(u2),sc3=1+0.55*e;
     var pts=[[cx-hw*sc3,cy-hh*sc3],[cx+hw*sc3,cy-hh*sc3],[cx+hw*sc3,cy+hh*sc3],[cx-hw*sc3,cy+hh*sc3]];
     poly.setAttribute('points',pts.map(function(q){var v=onPlane(pl,q[0],q[1]);return v[0].toFixed(1)+','+v[1].toFixed(1)}).join(' '));
     poly.setAttribute('opacity',(delay?0.4:0.65)*(1-u2));
    }
    requestAnimationFrame(f);
   })(t0);
  });
 }
 function drawMachine(nowMs,dt,u,A){
  var me=u*eoc(aCl((A-1100)/500));
  mg.setAttribute('opacity',me);
  if(me<0.01)return;
  var x0=-87,x1=87,H2=114,DEP=11;
  MP.back.setAttribute('d',mPath([[x0,0,-DEP],[x1,0,-DEP],[x1,H2,-DEP],[x0,H2,-DEP]],true));
  [[x0,0],[x1,0],[x1,H2],[x0,H2]].forEach(function(c2,i3){MP.c[i3].setAttribute('d',mPath([[c2[0],c2[1],0],[c2[0],c2[1],-DEP]]))});
  MP.face.setAttribute('d',mPath([[x0,0,0],[x1,0,0],[x1,H2,0],[x0,H2,0]],true));
  var icx=59,icy=53;
  if(pp.key==='code'){
   ICONS.code.forEach(function(pts,ii){
    MP.icon[ii].setAttribute('d',mPath(pts.map(function(q){return [icx+q[0]*0.7,icy+q[1]*0.7,0]})));
   });
   if(nowMs-MCH.last>900){MCH.S.shift();MCH.S.push({t:CODE_POOL[MCH.k++%CODE_POOL.length]});MCH.last=nowMs;}
   var cu=Math.min(1,(nowMs-MCH.last)/240);
   for(var r5=0;r5<5;r5++){
    var ln5=MCH.S[r5],full=ln5.t;
    if(r5===4)full=full.substring(0,Math.ceil(full.length*Math.min(1,cu*1.4)));
    var col5='#8E8B86';
    if(ln5.vT){var vu5=eoc(Math.min(1,(nowMs-ln5.vT)/1800));col5=mix(ln5.vc,'#8E8B86',vu5);if(vu5>=1)ln5.vT=0;}
    mTxt(MROWS[r5],-78,88-r5*15.5,full,6.6,col5,0.8*me,30);
   }
  }else if(pp.key==='browser'){
   MP.wB.setAttribute('d',mPath([[-86,26,0],[12,26,0],[12,100,0],[-86,100,0]],true));
   MP.wBt.setAttribute('d',mPath([[-86,90,0],[12,90,0]]));
   MP.wM.setAttribute('d',mPath([[-72,16,0],[24,16,0],[24,90,0],[-72,90,0]],true));
   MP.wMt.setAttribute('d',mPath([[-72,80,0],[24,80,0]]));
   MP.wF.setAttribute('d',mPath([[-56,6,0],[34,6,0],[34,80,0],[-56,80,0]],true));
   MP.dots.forEach(function(d5,i5){var q5=mPt(-51+i5*4.6,73.5,0);d5.setAttribute('cx',q5[0]);d5.setAttribute('cy',q5[1]);d5.setAttribute('opacity',me);});
   MP.url.setAttribute('d',mPath([[-38,70,0],[30,70,0],[30,77,0],[-38,77,0]],true));
   var ic1='',ic2='';
   (function(){
    var r6=13;
    function ring(rx,ry){var pts=[];for(var i6=0;i6<=36;i6++){var a6=i6/36*2*Math.PI;pts.push([icx+rx*Math.sin(a6),icy+ry*Math.cos(a6),0]);}return pts;}
    ic1=mPath(ring(r6,r6));
    ic2=mPath(ring(r6*0.42,r6))+mPath([[icx-r6,icy,0],[icx+r6,icy,0]]);
   })();
   MP.icon[0].setAttribute('d',ic1);MP.icon[1].setAttribute('d',ic2);MP.icon[2].setAttribute('d','M0 0');
   if(nowMs-MCH.last>1000){MCH.S.shift();MCH.S.push({t:BRZ_POOL[MCH.k++%BRZ_POOL.length]});MCH.last=nowMs;}
   var bu=Math.min(1,(nowMs-MCH.last)/240);
   for(var r7=0;r7<3;r7++){
    var ln7=MCH.S[r7],full7=ln7.t;
    if(r7===2)full7=full7.substring(0,Math.ceil(full7.length*Math.min(1,bu*1.4)));
    var col7='#8E8B86';
    if(ln7.vT){var vu7=eoc(Math.min(1,(nowMs-ln7.vT)/1800));col7=mix(ln7.vc,'#8E8B86',vu7);if(vu7>=1)ln7.vT=0;}
    mTxt(MROWS[r7],-52,58-r7*17,full7,6.2,col7,0.8*me,28);
   }
  }else{
   ICONS.gateway.forEach(function(pts,ii){
    MP.icon[ii].setAttribute('d',mPath(pts.map(function(q){return [icx+q[0]*0.62,icy+q[1]*0.62,0]})));
   });
   MPANES.forEach(function(p2){
    if(p2.type!=='idle'&&nowMs-p2.last>p2.rate){p2.S.shift();p2.S.push(gPick());p2.last=nowMs;}
    var u2=(p2.type==='idle')?1:Math.min(1,(nowMs-p2.last)/240);
    var TB={term:[8,9],app:[11,4],table:[10,5],meter:[8,8],idle:[8,9]}[p2.type];
    var lh=(p2.h-TB[0]-TB[1])/p2.rows;
    var slide=(1-eoc(u2))*lh;
    var col='#8E8B86',fop=(p2.type==='idle')?0.42:0.78,sCol='#4A4845',sw=0.9;
    if(p2.vT){
     var vu=eoc(Math.min(1,(nowMs-p2.vT)/1800));
     col=mix(p2.vc,'#8E8B86',vu);sCol=mix(p2.vc,'#4A4845',vu);
     sw=1.5-0.6*vu;fop=1-(1-fop)*vu;
     if(vu>=1)p2.vT=0;
    }
    p2.frame.setAttribute('d',mPath([[p2.x,p2.y,0],[p2.x+p2.w,p2.y,0],[p2.x+p2.w,p2.y+p2.h,0],[p2.x,p2.y+p2.h,0]],true));
    p2.frame.setAttribute('stroke',sCol);p2.frame.setAttribute('stroke-width',sw);
    p2.frame.setAttribute('stroke-opacity',(p2.type==='idle'?0.55:1)*me);
    p2.frame.setAttribute('fill-opacity',0.72*me);
    p2.bar.setAttribute('d',mPath([[p2.x,p2.y+p2.h-5,0],[p2.x+p2.w,p2.y+p2.h-5,0]]));
    p2.bar.setAttribute('stroke-opacity',me);
    var dd='';
    if(p2.type==='term'){
     dd+=mPath([[p2.x+3,p2.y+p2.h-1.6,0],[p2.x+4.6,p2.y+p2.h-1.6,0]])+mPath([[p2.x+6.6,p2.y+p2.h-1.6,0],[p2.x+8.2,p2.y+p2.h-1.6,0]]);
     dd+=mPath([[p2.x+3,p2.y+3,0],[p2.x+5.2,p2.y+4.6,0],[p2.x+3,p2.y+6.2,0]]);
    }else if(p2.type==='app'){
     dd+=mPath([[p2.x+3,p2.y+p2.h-3.6,0],[p2.x+9,p2.y+p2.h-3.6,0]]);
     dd+=mPath([[p2.x+3,p2.y+3,0],[p2.x+p2.w-3,p2.y+3,0],[p2.x+p2.w-3,p2.y+7.5,0],[p2.x+3,p2.y+7.5,0]],true);
    }else if(p2.type==='table'){
     dd+=mPath([[p2.x+2,p2.y+p2.h-8.5,0],[p2.x+p2.w-2,p2.y+p2.h-8.5,0]]);
     dd+=mPath([[p2.x+p2.w-9,p2.y+p2.h-8.5,0],[p2.x+p2.w-9,p2.y+2,0]]);
    }else if(p2.type==='meter'){
     dd+=mPath([[p2.x+3,p2.y+3.4,0],[p2.x+p2.w-3,p2.y+3.4,0]]);
    }else{
     dd+=mPath([[p2.x+p2.w*0.5-3,p2.y+4,0],[p2.x+p2.w*0.5+3,p2.y+4,0]]);
    }
    p2.deco.setAttribute('d',dd);
    p2.deco.setAttribute('stroke-opacity',0.8*me);
    if(p2.mbar){
     var mw=(p2.w-6)*(0.25+0.7*(0.5+0.5*Math.sin(nowMs/1000*1.1+p2.x)));
     p2.mbar.setAttribute('d',mPath([[p2.x+3,p2.y+3.4,0],[p2.x+3+mw,p2.y+3.4,0]]));
     p2.mbar.setAttribute('stroke',sCol==='#4A4845'?'#8E8B86':sCol);
     p2.mbar.setAttribute('stroke-opacity',me);
    }
    var top=p2.y+p2.h-((p2.type==='term'||p2.type==='app')?11:8);
    for(var r8=0;r8<p2.rows;r8++){
     var ys=top-r8*lh-((p2.type==='idle')?0:slide);
     var rEdge=p2.x+p2.w-((p2.type==='table')?12:2);
     mTxt(p2.txt[r8],p2.x+3,ys-2.6,p2.S[r8],4.6,col,fop*me,rEdge);
    }
   });
   (function(){
    if(!MGH.alive&&nowMs>MGH.next){MGH.alive=true;MGH.t0=nowMs;}
    var vis=0;
    if(MGH.alive){
     var age=nowMs-MGH.t0;
     if(age>5200){MGH.alive=false;MGH.next=nowMs+2200+Math.random()*2600;}
     else vis=Math.min(eoc(age/520),Math.min(1,(5200-age)/520));
    }
    MGH.frame.setAttribute('d',mPath([[MGH.x,MGH.y,0],[MGH.x+MGH.w,MGH.y,0],[MGH.x+MGH.w,MGH.y+MGH.h,0],[MGH.x,MGH.y+MGH.h,0]],true));
    MGH.frame.setAttribute('stroke-opacity',0.9*vis*me);
    MGH.frame.setAttribute('fill-opacity',0.72*vis*me);
    if(nowMs-MGH.last>1000){MGH.S.shift();MGH.S.push(gPick());MGH.last=nowMs;}
    for(var r9=0;r9<2;r9++){
     var yy=MGH.y+MGH.h-11-r9*((MGH.h-9)/2);
     mTxt(MGH.txt[r9],MGH.x+3,yy-2.6,MGH.S[r9],4.6,'#8E8B86',0.78*vis*me,MGH.x+MGH.w-2);
    }
   })();
  }
 }
 function cellCenter(c,r){return [-pl.w/2+(c+0.5)*pl.w/6, -pl.h/2+(r+0.5)*pl.h/4];}
 function cellQuad(c,r){
  var x0=-pl.w/2+c*pl.w/6, x1=x0+pl.w/6, y0=-pl.h/2+r*pl.h/4, y1=y0+pl.h/4;
  return [[x0,y0],[x1,y0],[x1,y1],[x0,y1]].map(function(q){var v=onPlane(pl,q[0],q[1]);return v[0].toFixed(1)+','+v[1].toFixed(1)}).join(' ');
 }
 function provKill(){
  LN.forEach(function(L){L.vT=performance.now();L.kcol='#E24840';});
 }
 function sq(p,lx,ly,size){
  var hs=size/2,c=[[lx-hs,ly-hs],[lx+hs,ly-hs],[lx+hs,ly+hs],[lx-hs,ly+hs]];
  return c.map(function(q){var s=onPlane(p,q[0],q[1]);return s[0].toFixed(1)+','+s[1].toFixed(1)}).join(' ');
 }
 var G={};
 function tag(x,y,text,color,life,anchor){
  var t=el('text',{x:x,y:y,fill:color,'font-size':9,'letter-spacing':1.2,'text-anchor':anchor||'start'},fx);
  t.textContent=text;var t0=performance.now();
  (function f(now){var u=(now-t0)/life;if(u>=1){t.remove();return}t.setAttribute('opacity',u<0.15?u/0.15:1-((u-0.15)/0.85));requestAnimationFrame(f)})(t0);
 }
 function burst(x,y,color){
  var ring=el('circle',{cx:x,cy:y,r:2.5,fill:'none',stroke:color,'stroke-width':1.4,opacity:0.9},fx);
  var t0=performance.now();
  (function f(now){var u=(now-t0)/520;if(u>=1){ring.remove();return}ring.setAttribute('r',2.5+u*12);ring.setAttribute('opacity',0.9*(1-u));requestAnimationFrame(f)})(t0);
 }
 var seq=0;
 function spawn(){
  if(!self.visible)return;
  if(self.pulses.length)return;
  var li=seq%3; seq++;
  var kind=(pp.key==='gateway'?['obs','obs','flag']:['allow','notify','block'])[Math.floor(Math.random()*3)];
  self.pulses.push({seg:0,t:0,ln:li,kind:kind,hold:0,c:el('circle',{r:1.8,fill:'#E8E4DD',opacity:0.9},bk)});
  self.pulses[self.pulses.length-1].en=el('path',{fill:'none',stroke:'#E8E4DD','stroke-width':1.7,'stroke-linecap':'round',opacity:0.95},bk);

 }
 function pulseStep(q,dt){
  var LZ=G.L[q.ln], sp=[LZ.o,LZ.g,LZ.ex];
  if(q.hold>0){q.hold-=dt;var a0=sp[q.seg];q.c.setAttribute('cx',a0[0]);q.c.setAttribute('cy',a0[1]);return true}
  var a=sp[q.seg],b=sp[q.seg+1];
  if(q.ret&&q.seg===1){a=sp[1];b=sp[0];}
  var len=Math.hypot(b[0]-a[0],b[1]-a[1]);
  q.t+=dt*0.66/Math.max(60,len);
  var u=Math.min(1,q.t);
  q.c.setAttribute('cx',a[0]+(b[0]-a[0])*u);
  q.c.setAttribute('cy',a[1]+(b[1]-a[1])*u);
  if(q.en){
   var ut=Math.max(0,u-0.14);
   q.en.setAttribute('d','M'+(a[0]+(b[0]-a[0])*ut).toFixed(1)+' '+(a[1]+(b[1]-a[1])*ut).toFixed(1)+
    ' L'+(a[0]+(b[0]-a[0])*u).toFixed(1)+' '+(a[1]+(b[1]-a[1])*u).toFixed(1));
  }
  if(u>=1){
   q.seg++;q.t=0;
   if(q.seg==1){
    fx.appendChild(q.c);
    var n=LZ.g, L=LN[q.ln];
    L.vT=performance.now();L.kcol=VCOL[q.kind];
    var m=VMSG[q.kind];
    VB={t:performance.now(),txt:m[0],col:m[1]};
    if((pp.key==='code'||pp.key==='browser')&&MCH.S.length){var lz2=MCH.S[MCH.S.length-1];lz2.vc=m[1];lz2.vT=performance.now();}
    if(pp.key==='gateway'&&MPANES.length){
     var cand2=MPANES.filter(function(p5){return p5.type!=='idle'});
     var bt=cand2[Math.floor(Math.random()*cand2.length)];
     if(bt){bt.vc=m[1];bt.vT=performance.now();}
    }
    if(q.kind=='block'||q.kind=='flag'){
     cellRipple(L.cfg.cell[0],L.cfg.cell[1]);
     if(q.kind=='flag')provKill();
     fadeOutEl(q.c,420);if(q.en)fadeOutEl(q.en,300);return false;
    } else if(q.kind=='notify'){
     q.ret=true;
    } else if(q.kind=='disc'){
     q.c.setAttribute('fill','#B6BCD9');if(q.en)q.en.setAttribute('stroke','#B6BCD9');
    }
   }
   if(q.seg>=2){
    var t0=performance.now(),c=q.c,en3=q.en;
    (function fade(now){var u2=(now-t0)/260;if(u2>=1){c.remove();if(en3)en3.remove();return}c.setAttribute('opacity',0.9*(1-u2));if(en3)en3.setAttribute('opacity',0.95*(1-u2));requestAnimationFrame(fade)})(t0);
    return false;
   }
  }
  return true;
 }
 var last=performance.now(),start=performance.now();
 this.tick=function(now){
  var t=(now-start)/1000,dt=Math.min(50,now-last);last=now;
  if(!self.everVis&&!self.visible)return;
  if(self.everVis&&self.asmT<0)self.asmT=0;
  if(self.asmT>=0)self.asmT+=dt;
  var A=self.asmT<0?0:self.asmT;
  // dramatic entrance: whole scene fades invisible -> visible over 1.25s
  var fu=aCl(A/2000); root.style.opacity=(fu*fu*(3-2*fu)).toFixed(3);
  var fz=eoc(aCl((A-120)/1000));
  pl.z=-380+420*fz; pl.y=PY0+70*(1-fz);
  var la=A-260;
  var cb=1-eoc(aCl((la-1050)/600));
  var settle=-4*(1-eoc(A/1400));
  cam.yaw=(CFG.yaw0+settle+1.0*Math.sin((t+self.phase)*2*Math.PI/14))*Math.PI/180;
  var target=self.everVis?1:0;   // latched: leaving the viewport pauses runs, never dims the art
  self.hi+=(target-self.hi)*Math.min(1,dt*0.004);
  var u=self.hi;
  STARS.forEach(function(st){st.e.setAttribute('opacity',st.b*(0.6+0.4*Math.sin(t*st.sp+st.ph))*eoc(aCl(A/900)))});
  var capA=eoc(aCl((A-1500)/500));
  P.forEach(function(p,i){
   planesEl[i].setAttribute('d',rr(p));
   var vis=(p.kind=='endpoint'||i===pp.planeIdx)?1:0;
   var af=(p.kind=='endpoint')?aCl(A/700):aCl((A-400-(i-1)*160)/600);
   var frameF=(i===pp.planeIdx)?aCl((A-620)/380):af;
   if(p.kind=='endpoint')frameF=aCl(A*1.35/700);
   planesEl[i].setAttribute('stroke-dashoffset',(100*(1-frameF)).toFixed(1));
   var uu=(i===pp.planeIdx)?u*eoc(aCl((A-1000)/500)):0;
   planesEl[i].setAttribute('stroke',mix(p.stroke,'#E8543A',uu));
   planesEl[i].setAttribute('stroke-opacity',(p.sop+(1-p.sop)*uu)*frameF*vis);
   planesEl[i].setAttribute('stroke-width',1.1+0.5*uu);
   planesEl[i].setAttribute('fill',mix(p.fill,'#C33A24',uu));
   planesEl[i].setAttribute('fill-opacity',(p.fop+(0.38-p.fop)*uu)*((p.kind=='endpoint')?eoc(aCl((A-500-i*100)/500)):eoc(aCl((A-780)/380))*(0.3+0.7*eoc(aCl((la-650)/520))))*vis);
   if(p.kind=='prod'){
    planeText(labels[i],p,-p.w/2+20,p.h/2-34,12,1.6);
    labels[i].setAttribute('fill',mix('#EDEDEA','#FFFFFF',uu));
    labels[i].setAttribute('opacity',eoc(aCl((A-880)/380))*vis);
    // icon
    var icx=p.w/2-p.w/6, icy=-p.h/2+45;
    var iop=0;
    var icol=mix('#8E8B86','#FFFFFF',uu);
    icons[i].forEach(function(pe,ii){
     var pts=ICONS[p.icon][ii];
     var d='M'+pts.map(function(q2){var s2=onPlane(p,icx+q2[0],icy+q2[1]);return s2[0].toFixed(1)+' '+s2[1].toFixed(1)}).join(' L')+((p.icon=='browser'&&ii===0)?' Z':'');
     pe.setAttribute('d',d);pe.setAttribute('stroke',icol);pe.setAttribute('opacity',iop*vis);
    });
    if(icons[i+'dot']){var qd=onPlane(p,icx-24,icy+14);
     icons[i+'dot'].setAttribute('cx',qd[0]);icons[i+'dot'].setAttribute('cy',qd[1]);
     icons[i+'dot'].setAttribute('fill',icol);icons[i+'dot'].setAttribute('opacity',iop*vis);}
   }
  });
  // lattice (active tile only) with icon-region clearing, built center-out
  var gi=0;
  function gline(L,ax,ay,bx,by,delay){
   var g2=eoc(aCl((la-delay)/430));
   var mx=(ax+bx)/2,my=(ay+by)/2;
   var q1=onPlane(pl,mx+(ax-mx)*g2,my+(ay-my)*g2),q2=onPlane(pl,mx+(bx-mx)*g2,my+(by-my)*g2);
   L.setAttribute('x1',q1[0]);L.setAttribute('y1',q1[1]);L.setAttribute('x2',q2[0]);L.setAttribute('y2',q2[1]);
   L.setAttribute('stroke-opacity',Math.max(0.85*u*g2,0.9*(g2>0?Math.min(1,g2*2):0)*Math.max(cb,0)));
  }
  for(var vi=1;vi<6;vi++){
   var y0=-pl.h/2;
   gline(grid[gi++],-pl.w/2+vi*pl.w/6,y0,-pl.w/2+vi*pl.w/6,pl.h/2,Math.abs(vi-3)*150);
  }
  for(var vj=1;vj<4;vj++){
   var xe=pl.w/2;
   gline(grid[gi++],-pl.w/2,-pl.h/2+vj*pl.h/4,xe,-pl.h/2+vj*pl.h/4,230+Math.abs(vj-2)*150);
  }
  var di=0;
  for(var dx=0;dx<7;dx++)for(var dy=0;dy<5;dy++){
   if((dx===0||dx===6)&&(dy===0||dy===4))continue;
   var q=onPlane(pl,-pl.w/2+dx*pl.w/6,-pl.h/2+dy*pl.h/4);
   var C=gridDots[di++];C.setAttribute('cx',q[0]);C.setAttribute('cy',q[1]);
   var dd=Math.max(Math.abs(dx-3)/3,Math.abs(dy-2)/2);
   C.setAttribute('opacity',Math.max(u,0.95*cb)*eoc(aCl((la-560-dd*200)/260)));
  }
  // agents
  AGS.forEach(function(a,i){
   agStep(a,dt);
   var q=onPlane(P[0],a.x,a.y);
   var C=agEls[i];
   C.setAttribute('transform','translate('+q[0].toFixed(1)+' '+q[1].toFixed(1)+') rotate('+a.rot.toFixed(1)+') scale('+a.scl.toFixed(3)+') translate(-15.2 -14.4)');
   var stc=a.hot?'#D33E30':'#8E8B86';
   if(C._stc!==stc){C._stc=stc;var ch=C.childNodes;for(var cn=0;cn<ch.length;cn++)ch[cn].setAttribute('stroke',stc);}
   var op=(0.30+0.16*Math.sin(t*0.8+a.ph))*a.al;
   if(a.hot)op=(0.55+0.2*Math.sin(t*3+a.ph))*a.al;
   if(a.esc)op*=(1-a.escP);
   if(a.cap)op=0.85*a.al;
   C.setAttribute('opacity',op*eoc(aCl((A-350-i*40)/450)));
  });
  var p0=P[0];
  planeText(epTitle,{x:p0.x-30,y:p0.y+p0.h/2+34,z:p0.z},0,0,12,2.4,'middle');
  epTitle.setAttribute('opacity',eoc(aCl((A-450)/500)));
  // lane geometry
  var nowMs=performance.now();
  G.L=[];
  LN.forEach(function(L){
   var o=mPt(-87,[78,56,34][LN.indexOf(L)],-6);
   var cc=cellCenter(L.cfg.cell[0],L.cfg.cell[1]);
   var g=onPlane(pl,cc[0],cc[1]);
   var ex=g;   // line stops at the tile; allow-dots fade at the cell, notify returns along the same line
   G.L.push({o:o,g:g,ex:ex});
   var li2=LN.indexOf(L);
   var act=(self.pulses.length&&self.pulses[0].ln===li2)?1:0;
   L.a=(L.a||0)+(act-(L.a||0))*Math.min(1,dt*(act?0.009:0.004));
   var op=0.28*u*capA*L.a;
   L.line1.setAttribute('d','M'+o[0].toFixed(1)+' '+o[1].toFixed(1)+' L'+g[0].toFixed(1)+' '+g[1].toFixed(1));
   L.line1.setAttribute('stroke-opacity',op);
   L.line2.setAttribute('stroke-opacity',0);
   L.cellP.setAttribute('points',cellQuad(L.cfg.cell[0],L.cfg.cell[1]));
   var age=nowMs-L.vT;
   var va=age<160?age/160:Math.max(0,1-(age-160)/1400);
   var kc=L.kcol||'#47D553';
   L.cellP.setAttribute('fill',kc);L.cellP.setAttribute('stroke',kc);
   L.cellP.setAttribute('fill-opacity',0.46*va*u);
   L.cellP.setAttribute('stroke-opacity',0.95*va*u);
  });
  // verdict banner
  (function(){
   var age=nowMs-VB.t;
   if(age>1750||!self.visible){vban.setAttribute('opacity',0);return}
   vban.textContent=VB.txt;
   vban.setAttribute('fill',VB.col);
   var b0=proj(pl.x,pl.y-pl.h/2,pl.z);
   vban.removeAttribute('transform');
   vban.setAttribute('x',Math.max(80,Math.min(150,b0[0])));
   vban.setAttribute('y',Math.min(b0[1]+22,CFG.H-10));
   vban.setAttribute('font-size',12);vban.setAttribute('letter-spacing',2);vban.setAttribute('text-anchor','middle');
   var bop;
   if(age<260)bop=(Math.floor(age/65)%2)?1:0.12;
   else if(age<1400)bop=1;
   else bop=1-(age-1400)/350;
   vban.setAttribute('opacity',bop*u);
  })();
  planeText(tagLab,{x:pl.x,y:pl.y+pl.h/2+12,z:pl.z},0,0,12,2,'middle');
  tagLab.setAttribute('opacity',0);
  drawMachine(nowMs,dt,u,A);
  if(self.visible&&A>1600){
   self.spawnTimer-=dt;
   if(self.spawnTimer<=0){spawn();self.spawnTimer=900+Math.random()*900;}
  }
  for(var i2=self.pulses.length-1;i2>=0;i2--){if(!pulseStep(self.pulses[i2],dt))self.pulses.splice(i2,1)}
 };
}
function Hero(){
 var self=this; this.visible=true;
 var root=document.getElementById('sth');
 var bk=root.querySelector('.bk'),sc=root.querySelector('.sc');
 function el(n,at,parent){var e=document.createElementNS(NS,n);for(var k in at)e.setAttribute(k,at[k]);(parent||sc).appendChild(e);return e}
 var P=CFG.planes.map(function(p){var q={};for(var k in p)q[k]=p[k];q.y=p.y*0.64;q.zF=q.z;if(q.kind=='endpoint')q.h=p.h*0.78;return q;});
 var cam={yaw:CFG.yaw0*Math.PI/180};
 var CY=222;
 function proj(x,y,z){
  var cy=Math.cos(cam.yaw),sy=Math.sin(cam.yaw);
  var cp=Math.cos(CFG.pitch*Math.PI/180),sp=Math.sin(CFG.pitch*Math.PI/180);
  var xr=x*cy+z*sy, zr=-x*sy+z*cy;
  var yr=y*cp-zr*sp, z2=y*sp+zr*cp;
  var s2=CFG.F/(CFG.D-z2);
  return [200+xr*s2, CY-yr*s2];
 }
 function onPlane(p,lx,ly){return proj(p.x+lx,p.y+ly,p.z)}
 function rr(p){
  var r=4,n=2,pts=[];
  [[p.w/2-r,p.h/2-r,0],[-p.w/2+r,p.h/2-r,90],[-p.w/2+r,-p.h/2+r,180],[p.w/2-r,-p.h/2+r,270]].forEach(function(c){
   for(var i=0;i<=n;i++){var a2=(c[2]+90*i/n)*Math.PI/180;
    pts.push([p.x+c[0]+r*Math.cos(a2),p.y+c[1]+r*Math.sin(a2)]);}
  });
  return 'M'+pts.map(function(q){var s3=proj(q[0],q[1],p.z);return s3[0].toFixed(1)+' '+s3[1].toFixed(1)}).join(' L')+' Z';
 }
 function planeText(elm,p,lx,ly,px,ls,anchor){
  var o=proj(p.x+lx,p.y+ly,p.z);
  var ex=proj(p.x+lx+10,p.y+ly,p.z),ey=proj(p.x+lx,p.y+ly+10,p.z);
  var ax=(ex[0]-o[0])/10,ay=(ex[1]-o[1])/10;
  var bx=-(ey[0]-o[0])/10,by=-(ey[1]-o[1])/10;
  var vm=Math.hypot(bx,by)||1;
  elm.setAttribute('transform','matrix('+ax.toFixed(4)+' '+ay.toFixed(4)+' '+bx.toFixed(4)+' '+by.toFixed(4)+' '+o[0].toFixed(1)+' '+o[1].toFixed(1)+')');
  elm.setAttribute('font-size',(px/vm).toFixed(2));
  elm.setAttribute('letter-spacing',(ls/vm).toFixed(2));
  elm.setAttribute('text-anchor',anchor||'start');
 }
 var AGS=[];
 (function(){var sd=23;function rnd(){sd=(sd*16807)%2147483647;return sd/2147483647}
  var p=P[0],hw=p.w/2-60,hh=p.h/2-70;
  for(var i=0;i<16;i++)AGS.push({x:(rnd()*2-1)*hw,y:(rnd()*2-1)*hh,vx:0,vy:0,temp:Math.pow(rnd(),1.6),ph:rnd()*6.283,rot:rnd()*360,scl:0.22+rnd()*0.08,al:0.25+rnd()*0.2});
 })();
 var HSTARS=[];
 (function(){var sd=57;function rnd(){sd=(sd*16807)%2147483647;return sd/2147483647}
  for(var i=0;i<60;i++){
   HSTARS.push({e:el('circle',{cx:(rnd()*390).toFixed(1),cy:(rnd()*380).toFixed(1),r:(0.5+rnd()*0.9).toFixed(2),fill:'#EDEDEA',opacity:0},bk),
    b:0.10+rnd()*0.30,ph:rnd()*6.283,sp:0.5+rnd()*1.4});
  }})();
 var planesEl=[],labels=[],agEls=[],gridL=[];
 P.forEach(function(p,i){
  var host=(p.kind=='endpoint')?bk:sc;
  planesEl.push(el('path',{fill:p.fill,'fill-opacity':0,stroke:p.stroke,'stroke-opacity':p.sop,'stroke-width':1.1,pathLength:100,'stroke-dasharray':100,'stroke-dashoffset':100},host));
  if(p.kind=='prod'){
   var gl=[];
   for(var g2=0;g2<8;g2++)gl.push(el('line',{stroke:'#D24A2F','stroke-opacity':0,'stroke-width':0.8}));
   gridL.push(gl);
  }
  var t=el('text',{fill:'#EDEDEA','letter-spacing':1.5,opacity:0});t.textContent=(p.kind=='endpoint')?'':p.name;
  labels.push(t);
 });
 AGS.forEach(function(){
  var ag=el('g',{opacity:0},bk);
  el('path',{d:AGD1,fill:'none',stroke:'#8E8B86','stroke-width':2.4},ag);
  el('path',{d:AGD2,fill:'none',stroke:'#8E8B86','stroke-width':2.4},ag);
  agEls.push(ag);
 });
 var epT=el('text',{fill:'#EDEDEA',opacity:0},bk);epT.textContent='ON DEVICE AGENTS';
 var BR={rail:el('line',{stroke:'#E8543A','stroke-width':1.1,'stroke-dasharray':'2 4','stroke-opacity':0}),
  ticks:[],dots:[],nums:[],
  title:el('text',{fill:'#E8543A',opacity:0})};
 BR.title.textContent='AQUILA PRODUCT SUITE';
 for(var bi=0;bi<3;bi++){
  BR.ticks.push(el('line',{stroke:'#E8543A','stroke-width':1.1,'stroke-dasharray':'2 4','stroke-opacity':0}));
  BR.dots.push(el('circle',{r:2.4,fill:'#E8543A',opacity:0}));
  var nt=el('text',{fill:'#F5B29E',opacity:0});nt.textContent='0'+(bi+1);
  BR.nums.push(nt);
 }
 var A=-1,last=performance.now(),start=performance.now();
 this.tick=function(now){
  var t=(now-start)/1000,dt=Math.min(50,now-last);last=now;
  if(!self.visible)return;
  if(A<0)A=0; A+=dt;
  cam.yaw=(CFG.yaw0+1.0*Math.sin(t*2*Math.PI/16))*Math.PI/180;
  HSTARS.forEach(function(st){st.e.setAttribute('opacity',st.b*(0.6+0.4*Math.sin(t*st.sp+st.ph))*eoc(aCl(A/900)))});
  P.forEach(function(p,i){
   if(p.kind=='prod'){var fz=eoc(aCl((A-300-(i-1)*200)/900));p.z=-380+(p.zF+380)*fz;}
   planesEl[i].setAttribute('d',rr(p));
   var af=(p.kind=='endpoint')?aCl(A/700):aCl((A-350-(i-1)*200)/550);
   var frF=(p.kind=='endpoint')?eoc(af):eoc(aCl((A-790-(i-1)*200)/380));
   planesEl[i].setAttribute('stroke-dashoffset',(100*(1-frF)).toFixed(1));
   planesEl[i].setAttribute('fill-opacity',p.fop*eoc(aCl((A-750-i*120)/500)));
   if(p.kind=='prod'){
    var hu=eoc(aCl((A-950-(i-1)*200)/500));
    planesEl[i].setAttribute('stroke',mix(p.stroke,'#E8543A',hu));
    planesEl[i].setAttribute('stroke-opacity',p.sop+(1-p.sop)*hu);
    planesEl[i].setAttribute('stroke-width',1.1+0.5*hu);
    planesEl[i].setAttribute('fill',mix(p.fill,'#C33A24',hu));
    planesEl[i].setAttribute('fill-opacity',(p.fop+(0.38-p.fop)*hu)*eoc(aCl((A-400-i*120)/500)));
    planeText(labels[i],p,-p.w/2+20,p.h/2-34,12,1.6);
    labels[i].setAttribute('fill',mix('#EDEDEA','#FFFFFF',hu));
    labels[i].setAttribute('opacity',eoc(aCl((A-1050-(i-1)*200)/400)));
    var gl=gridL[i-1],gi=0;
    var gop=0.22+0.3*hu;
    var hla=A-430-(i-1)*200;
    var hcb=1-eoc(aCl((hla-1050)/600));
    function hgl(L4,ax,ay,bx,by,delay){
     var g3=eoc(aCl((hla-delay)/430));
     var mx=(ax+bx)/2,my=(ay+by)/2;
     var q5=onPlane(p,mx+(ax-mx)*g3,my+(ay-my)*g3),q6=onPlane(p,mx+(bx-mx)*g3,my+(by-my)*g3);
     L4.setAttribute('x1',q5[0]);L4.setAttribute('y1',q5[1]);L4.setAttribute('x2',q6[0]);L4.setAttribute('y2',q6[1]);
     L4.setAttribute('stroke-opacity',Math.max(gop*g3,0.55*(g3>0?Math.min(1,g3*2):0)*Math.max(hcb,0)));
    }
    for(var vi=1;vi<6;vi++){
     hgl(gl[gi++],-p.w/2+vi*p.w/6,-p.h/2,-p.w/2+vi*p.w/6,p.h/2,Math.abs(vi-3)*150);
    }
    for(var vj=1;vj<4;vj++){
     hgl(gl[gi++],-p.w/2,-p.h/2+vj*p.h/4,p.w/2,-p.h/2+vj*p.h/4,230+Math.abs(vj-2)*150);
    }
   }
  });
  // AQUILA PRODUCT SUITE bracket, left side
  (function(){
   var bf=eoc(aCl((A-1250)/500));
   var railX=-300,tileL=-255;
   var rTop=proj(railX,373,40),rBot=proj(railX,-348,40);
   BR.rail.setAttribute('x1',rTop[0]);BR.rail.setAttribute('y1',rTop[1]);
   BR.rail.setAttribute('x2',rBot[0]);BR.rail.setAttribute('y2',rBot[1]);
   BR.rail.setAttribute('stroke-opacity',0.75*bf);
   [255,0,-255].forEach(function(ty,bi){
    var q1=proj(railX,ty,40),q2=proj(tileL,ty,40);
    BR.ticks[bi].setAttribute('x1',q1[0]);BR.ticks[bi].setAttribute('y1',q1[1]);
    BR.ticks[bi].setAttribute('x2',q2[0]);BR.ticks[bi].setAttribute('y2',q2[1]);
    BR.ticks[bi].setAttribute('stroke-opacity',0.75*bf);
    BR.dots[bi].setAttribute('cx',q2[0]);BR.dots[bi].setAttribute('cy',q2[1]);
    BR.dots[bi].setAttribute('opacity',bf);
    planeText(BR.nums[bi],{x:railX+8,y:ty+26,z:40},0,0,10,1.5);
    BR.nums[bi].setAttribute('opacity',0.9*bf);
   });
   planeText(BR.title,{x:-302,y:383,z:40},0,0,12,2.4);
   BR.title.setAttribute('opacity',bf);
  })();
  var p0=P[0],hw=p0.w/2-60,hh=p0.h/2-70;
  AGS.forEach(function(a2,i){
   a2.vx+=(Math.random()-0.5)*a2.temp*0.002*dt;
   a2.vy+=(Math.random()-0.5)*a2.temp*0.0016*dt;
   var dmp=Math.exp(-dt*0.0018);a2.vx*=dmp;a2.vy*=dmp;
   var sp2=Math.hypot(a2.vx,a2.vy);if(sp2>0.08){a2.vx*=0.08/sp2;a2.vy*=0.08/sp2}
   a2.x+=a2.vx*dt;a2.y+=a2.vy*dt;
   if(a2.x>hw){a2.x=hw;a2.vx=-Math.abs(a2.vx)} if(a2.x<-hw){a2.x=-hw;a2.vx=Math.abs(a2.vx)}
   if(a2.y>hh){a2.y=hh;a2.vy=-Math.abs(a2.vy)} if(a2.y<-hh){a2.y=-hh;a2.vy=Math.abs(a2.vy)}
   var q=onPlane(p0,a2.x,a2.y);
   agEls[i].setAttribute('transform','translate('+q[0].toFixed(1)+' '+q[1].toFixed(1)+') rotate('+a2.rot.toFixed(1)+') scale('+a2.scl.toFixed(3)+') translate(-15.2 -14.4)');
   agEls[i].setAttribute('opacity',(a2.al+0.08*Math.sin(t*0.8+a2.ph))*eoc(aCl((A-300-i*40)/450)));
  });
  planeText(epT,{x:p0.x+70,y:p0.y+p0.h/2+34,z:p0.z},0,0,12,2.4,'middle');
  epT.setAttribute('opacity',eoc(aCl((A-250)/500)));
 };
}
var hero=new Hero();
var scenes=[new Scene('st0',0),new Scene('st1',1),new Scene('st2',2)];
var io=new IntersectionObserver(function(es){
 es.forEach(function(e){
  var i=+e.target.getAttribute('data-idx');
  if(e.isIntersecting){e.target.classList.add('on');scenes[i].visible=true;scenes[i].everVis=true;}
  else scenes[i].visible=false;
 });
},{threshold:0.25});
[].slice.call(document.querySelectorAll('.blk')).forEach(function(b){io.observe(b)});
var ioh=new IntersectionObserver(function(es){es.forEach(function(e){hero.visible=e.isIntersecting})},{threshold:0.1});
ioh.observe(document.getElementById('sth'));
var FADES=[].slice.call(document.querySelectorAll('.gwrap'));
function updFade(){
 var vh=window.innerHeight;
 FADES.forEach(function(g){
  var r=g.getBoundingClientRect();
  if(r.bottom<-40||r.top>vh+40){g.style.opacity=0;return}
  var c=(r.top+r.bottom)/2;
  var fin=aCl((vh*0.98-c)/(vh*0.32));
  var fout=aCl((c-vh*0.04)/(vh*0.30));
  g.style.opacity=Math.min(fin,fout).toFixed(3);
 });
}
window.addEventListener('scroll',function(){requestAnimationFrame(updFade)},{passive:true});
window.addEventListener('resize',updFade);
updFade();
function frame(now){hero.tick(now);scenes.forEach(function(s){s.tick(now)});requestAnimationFrame(frame)}
requestAnimationFrame(frame);
