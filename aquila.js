/* Aquila desktop engine — v9 (from desktop v44)
 * Structure: panels live inside the four .sec blocks; there is no #copy wrapper.
 * Adds: visibility guard, .js-anim for Designer gating, lazy Lottie data load.
 */
(function(){
var __ds=(function(){try{var s=document.currentScript&&document.currentScript.src;
  return s?s.replace(/aquila\.js(\?.*)?$/,'aquila-data.js'):null}catch(e){return null}})();
var __started=false;
function __visible(){var e=document.getElementById('pin');return !!(e&&e.getClientRects().length)}
function __boot(){
  if(__started||!__visible())return;
  __started=true;
  if(typeof LOT_OUT!=='undefined'){__start();return}
  if(!__ds){__start();return}
  var s=document.createElement('script');
  s.src=__ds; s.onload=__start;
  s.onerror=function(){try{window.lottie=undefined}catch(e){} __start()};
  document.head.appendChild(s);
}
function __start(){
document.documentElement.classList.add('js-anim');

var CFG={"W": 1440, "H": 810, "CX": 1030, "CY": 350, "D": 1650.0, "F": 1480.0, "yaw0": -32, "pitch": 9, "planes": [{"name": "ENDPOINT AGENTS", "w": 1104.0, "h": 340.0, "x": -200.0, "y": -2.4000000000000004, "z": -430, "stroke": "#4A4845", "sop": 0.9, "fill": "#131211", "fop": 0.5, "lab": "#8E8B86", "kind": "endpoint"}, {"name": "AQUILA CODE", "w": 304.0, "h": 200.0, "x": -416.0, "y": -36.0, "z": 40, "stroke": "#6E6B66", "sop": 0.8, "fill": "#141311", "fop": 0.45, "lab": "#EDEDEA", "kind": "prod"}, {"name": "AQUILA BROWSER", "w": 304.0, "h": 200.0, "x": -44.0, "y": -36.0, "z": 40, "stroke": "#6E6B66", "sop": 0.85, "fill": "#141311", "fop": 0.45, "lab": "#EDEDEA", "kind": "prod"}, {"name": "AQUILA LOCAL GATEWAY", "w": 304.0, "h": 200.0, "x": 300.0, "y": -36.0, "z": 40, "stroke": "#6E6B66", "sop": 0.9, "fill": "#141311", "fop": 0.45, "lab": "#EDEDEA", "kind": "prod"}], "paths": [{"key": "code", "planeIdx": 1, "origin": [-496.0, -30.0], "gate": [8.0, -30.0], "exit": [-130, 72], "block": "BLOCKED \u00b7 SECRET", "acts": ["PROMPT", "TOOL CALL", "COMMIT"], "verdict": "ALLOW \u00b7 NOTIFY \u00b7 ASK \u00b7 BLOCK \u2014 BEFORE IT EXECUTES", "flag": false}, {"key": "browser", "planeIdx": 2, "origin": [-96.0, -75.0], "gate": [0.0, -30.0], "exit": [-130, 72], "block": "BLOCKED \u00b7 PII", "acts": ["PROMPT", "PASTE", "UPLOAD"], "verdict": "ALLOW \u00b7 NOTIFY \u00b7 ASK \u00b7 BLOCK \u2014 BEFORE DATA LEAVES THE TAB", "flag": false}, {"key": "gateway", "planeIdx": 3, "origin": [340.0, -95.0], "gate": [-8.0, -30.0], "exit": [-130, 72], "block": "FLAGGED \u00b7 UNKNOWN DEST", "acts": ["EGRESS", "API CALL", "UNKNOWN DEST"], "verdict": "DISCOVER \u00b7 CLASSIFY \u00b7 GOVERN \u2014 AT OS EGRESS", "flag": true, "noAsk": true, "allowTag": "OBSERVED"}], "camPan": [0, -30, 0, 20]};
var LREADY=false;
(function(){
 if(!window.lottie)return;
 var loaded=0;function done(){loaded++;if(loaded>=4)LREADY=true}
 function prep(cid,data,gid,tint,fillTint,startF){
  var c=document.getElementById(cid);
  var an=lottie.loadAnimation({container:c,renderer:'svg',loop:true,autoplay:true,animationData:data});
  an.addEventListener('DOMLoaded',function(){
   var svg=c.querySelector('svg');
   function recolor(){
    svg.querySelectorAll('path').forEach(function(p){
     var st=p.getAttribute('stroke');if(st&&st!=='none'){p.style.setProperty('stroke',tint,'important');p.style.setProperty('stroke-width','0.95px','important');p.setAttribute('vector-effect','non-scaling-stroke');}
     var fl=p.getAttribute('fill');if(fl&&fl!=='none'){p.style.setProperty('fill',fillTint||tint,'important');}
    });
   }
   recolor();setTimeout(recolor,300);setTimeout(recolor,1200);
   var g=svg.querySelector('g');if(g)g.setAttribute('id',gid);
   an.goToAndPlay(startF,true);done();
  });
 }
 prep('lot0',LOT_OUT,'lotG0','#8E8B86',null,0);
 prep('lot1',LOT_OUT,'lotG1','#8E8B86',null,150);
 prep('lot2',LOT_OUT,'lotG2','#8E8B86',null,300);
 prep('lot3',LOT_FILL,'lotBad','#D33E30','#D33E30',200);
})();
var NS='http://www.w3.org/2000/svg';
function $(id){return document.getElementById(id)}
function el(n,at,parent){var e=document.createElementNS(NS,n);for(var k in at)e.setAttribute(k,at[k]);(parent||scene).appendChild(e);return e}
var scene=$('scene'),fx=$('fx');
var STARS=[];
(function(){
 var g=$('bgGrid');
 var X0=580;
 var sd=97;function rnd(){sd=(sd*16807)%2147483647;return sd/2147483647}
 for(var i=0;i<95;i++){
  var st={x:X0+rnd()*(CFG.W-X0),y:rnd()*CFG.H,r:0.5+rnd()*0.9,b:0.10+rnd()*0.30,ph:rnd()*6.283,sp:0.3+rnd()*0.9,dp:0.4+rnd()*0.6};
  var e=document.createElementNS(NS,'circle');
  e.setAttribute('r',st.r);e.setAttribute('fill','#EDEDEA');e.setAttribute('opacity',st.b);
  g.appendChild(e);st.el=e;STARS.push(st);
 }
 STARS.X0=X0;
})();

var cam={yaw:CFG.yaw0*Math.PI/180, cx:CFG.CX, pitch:CFG.pitch};
var VIEW={z:1,tx:0,ty:0};
function projRaw(x,y,z){
 var cy=Math.cos(cam.yaw),sy=Math.sin(cam.yaw);
 var cp=Math.cos(cam.pitch*Math.PI/180),sp=Math.sin(cam.pitch*Math.PI/180);
 var xr=x*cy+z*sy, zr=-x*sy+z*cy;
 var yr=y*cp-zr*sp, z2=y*sp+zr*cp;
 var s=CFG.F/(CFG.D-z2);
 return [cam.cx+xr*s, CFG.CY-yr*s, s];
}
function proj(x,y,z){
 var p=projRaw(x,y,z);
 return [p[0]*VIEW.z+VIEW.tx, p[1]*VIEW.z+VIEW.ty, p[2]*VIEW.z];
}
function onPlane(p,lx,ly){return proj(p.x+lx,p.y+ly,p.z)}
function rr(p){
 var r=4,n=2,hw=p.w/2,hh=p.h/2,pts=[];
 [[hw-r,hh-r,0],[-hw+r,hh-r,90],[-hw+r,-hh+r,180],[hw-r,-hh+r,270]].forEach(function(c){
  for(var i=0;i<=n;i++){var a=(c[2]+90*i/n)*Math.PI/180;
   pts.push([p.x+c[0]+r*Math.cos(a), p.y+c[1]+r*Math.sin(a)]);}
 });
 return 'M'+pts.map(function(q){var s=proj(q[0],q[1],p.z);return s[0].toFixed(1)+' '+s[1].toFixed(1)}).join(' L')+' Z';
}
function planeTX(p,lx,ly,px,ls){
 var o=proj(p.x+lx,p.y+ly,p.z);
 var ex=proj(p.x+lx+10,p.y+ly,p.z);
 var ey=proj(p.x+lx,p.y+ly+10,p.z);
 var ax=(ex[0]-o[0])/10, ay=(ex[1]-o[1])/10;
 var bx=-(ey[0]-o[0])/10, by=-(ey[1]-o[1])/10;
 var mag=Math.hypot(ax,ay)||1;
 return {m:'matrix('+ax.toFixed(4)+' '+ay.toFixed(4)+' '+bx.toFixed(4)+' '+by.toFixed(4)+' '+o[0].toFixed(1)+' '+o[1].toFixed(1)+')',
         fs:(px/mag).toFixed(2), ls:(ls/mag).toFixed(2)};
}
function setPlaneText(elm,p,lx,ly,px,ls,anchor){
 var t=planeTX(p,lx,ly,px,ls);
 elm.setAttribute('transform',t.m);
 elm.setAttribute('x',0);elm.setAttribute('y',0);
 elm.setAttribute('font-size',t.fs);
 elm.setAttribute('letter-spacing',t.ls);
 elm.setAttribute('text-anchor',anchor||'start');
}
function hex2rgb(h){return [parseInt(h.substr(1,2),16),parseInt(h.substr(3,2),16),parseInt(h.substr(5,2),16)]}
function mix(a,b,u){var A=hex2rgb(a),B=hex2rgb(b);
 return 'rgb('+Math.round(A[0]+(B[0]-A[0])*u)+','+Math.round(A[1]+(B[1]-A[1])*u)+','+Math.round(A[2]+(B[2]-A[2])*u)+')'}

var P=CFG.planes, refs={planes:[],dots:[],labels:[],prodGrids:{},prodDots:{}}, hiCur=[0,0,0,0];
P[1].icon='code';P[2].icon='browser';P[3].icon='gateway';
var RD=[-1,-1,-1,-1],prevOn=[false,false,false,false];
var AGS=[],AG_N=24,hotCount=0,escCount=0;
(function(){var s=11;function rnd(){s=(s*16807)%2147483647;return s/2147483647}
 var p=P[0],hw=p.w/2-55,hh=p.h/2-48;
 for(var i=0;i<AG_N;i++){
  AGS.push({x:(rnd()*2-1)*hw,y:(rnd()*2-1)*hh,vx:0,vy:0,
   temp:Math.pow(rnd(),1.6),state:'live',t:rnd()*6000,life:6000+rnd()*9000,
   al:1,hot:0,esc:false,escP:0,ph:rnd()*6.283,rot:rnd()*360,scl:0.30+rnd()*0.10});
 }})();
function agRespawn(a){
 var p=P[0],hw=p.w/2-55,hh=p.h/2-48;
 a.x=(Math.random()*2-1)*hw;a.y=(Math.random()*2-1)*hh;
 a.vx=0;a.vy=0;a.temp=Math.pow(Math.random(),1.6);
 a.state='in';a.t=0;a.al=0;a.life=6000+Math.random()*9000;
 a.rot=Math.random()*360;a.scl=0.30+Math.random()*0.10;
 if(a.hot)hotCount--;a.hot=0;if(a.esc)escCount--;a.esc=false;a.escP=0;
}
function agStep(a,dt){
 var p=P[0],hw=p.w/2-55,hh=p.h/2-48;
 if(a.cap){
  var L=a.capL;
  if(!L){a.cap=false;return;}
  a.x+=(L.cfg.o[0]-a.x)*Math.min(1,dt*0.005);
  a.y+=(L.cfg.o[1]-a.y)*Math.min(1,dt*0.005);
  a.vx=0;a.vy=0;a.al=Math.min(1,a.al+dt/300);
  if(!L.held&&Math.hypot(L.cfg.o[0]-a.x,L.cfg.o[1]-a.y)<2.5){
   L.held=true;L.heldT=performance.now();a.x=L.cfg.o[0];a.y=L.cfg.o[1];
  }
  return;
 }
 a.t+=dt;
 if(a.state=='in'){a.al=Math.min(1,a.t/600);if(a.al>=1){a.state='live';a.t=0}}
 else if(a.state=='live'&&!a.esc&&a.t>a.life){a.state='out';a.t=0}
 else if(a.state=='out'){a.al=1-a.t/700;if(a.al<=0){agRespawn(a);return}}
 var eff=a.temp;
 a.vx+=(Math.random()-0.5)*eff*0.0016*dt;
 a.vy+=(Math.random()-0.5)*eff*0.0012*dt;
 if(Math.random()<eff*0.00035*dt){
  var an=Math.random()*6.283,imp=0.05+Math.random()*0.07;
  a.vx+=Math.cos(an)*imp;a.vy+=Math.sin(an)*imp;
 }
 var dmp=Math.exp(-dt*0.0018);a.vx*=dmp;a.vy*=dmp;
 var sp=Math.hypot(a.vx,a.vy),cap=0.075;
 if(sp>cap){a.vx*=cap/sp;a.vy*=cap/sp}
 a.x+=a.vx*dt;a.y+=a.vy*dt;
 if(!a.esc){
  if(a.x>hw){a.x=hw;a.vx=-Math.abs(a.vx)}
  if(a.x<-hw){a.x=-hw;a.vx=Math.abs(a.vx)}
  if(a.y>hh){a.y=hh;a.vy=-Math.abs(a.vy)}
  if(a.y<-hh){a.y=-hh;a.vy=Math.abs(a.vy)}
  var nearEdge=Math.abs(a.x)>hw-14||Math.abs(a.y)>hh-12;
  if(nearEdge&&escCount<1&&eff>0.55&&Math.random()<0.00022*dt){
   a.esc=true;escCount++;
   var anx=a.x/hw,any=a.y/hh,m=Math.hypot(anx,any)||1;
   a.vx=anx/m*0.09;a.vy=any/m*0.07;
  }
 } else {
  a.escP+=dt/2600;
  if(a.escP>=1){agRespawn(a)}
 }
 if(!a.esc){
  if(!a.hot&&hotCount<2&&a.state=='live'&&Math.random()<0.000012*dt){
   a.hot=1;hotCount++;a.hotT=3200+Math.random()*2600;
  }
  if(a.hot){a.hotT-=dt;if(a.hotT<=0){a.hot=0;hotCount--}}
 }
}
var driftT=0;
var asmStarted=false,asmT=0;
function aCl(v){return v<0?0:v>1?1:v}
function eoc(u){u=aCl(u);return 1-Math.pow(1-u,3)}
var ASM_D=[0,520,690,860],ASM_DUR=[750,620,620,620];
function asmF(i){return aCl((asmT-ASM_D[i])/ASM_DUR[i])}
function brF(){return eoc((asmT-1350)/550)}
function asmDone(){return asmT>1750}
P.forEach(function(p,i){
 p.by=p.y;
 refs.planes.push(el('path',{fill:p.fill,'fill-opacity':p.fop,stroke:p.stroke,'stroke-opacity':p.sop,'stroke-width':1.2,pathLength:100,'stroke-dasharray':100,'stroke-dashoffset':100}));
 if(p.kind=='prod'){
  var pg=[];
  for(var pi=1;pi<6;pi++)pg.push(el('line',{stroke:'#D24A2F','stroke-opacity':0,'stroke-width':0.9}));
  for(var pj=1;pj<4;pj++)pg.push(el('line',{stroke:'#D24A2F','stroke-opacity':0,'stroke-width':0.9}));
  refs.prodGrids[i]=pg;
  var pd=[];
  for(var di=0;di<7;di++)for(var dj=0;dj<5;dj++){
   if((di===0||di===6)&&(dj===0||dj===4))continue;
   pd.push(el('circle',{r:1.5,fill:'#E8543A',opacity:0}));
  }
  refs.prodDots[i]=pd;
 }
 if(p.kind=='endpoint'){
  AGS.forEach(function(){
   var ag=el('g',{opacity:0.4});
   var st=document.createElementNS(NS,'g');st.setAttribute('transform','translate(-15.2 -14.4)');ag.appendChild(st);
   el('path',{d:'M0.527283 28.0084L11.6482 0.717409C11.7514 0.464044 12.0937 0.422918 12.258 0.641638L29.7885 23.9697C29.9498 24.1844 29.8233 24.4963 29.5573 24.5331L0.901607 28.4902C0.632953 28.5273 0.42494 28.2596 0.527283 28.0084Z',fill:'none',stroke:'#8E8B86','stroke-width':2.2},st);
   el('path',{d:'M0.46516 28.5732L14.8031 16.8075M14.8031 16.8075L29.9821 24.2729M14.8031 16.8075L12.0474 0.334114',fill:'none',stroke:'#8E8B86','stroke-width':2.2},st);
   var us=document.createElementNS(NS,'use');
   us.setAttribute('transform','scale(0.55) translate(-40 -40)');
   us.setAttribute('display','none');ag.appendChild(us);
   ag._st=st;ag._use=us;
   refs.dots.push(ag);
  });
 }
 var t=el('text',{fill:p.lab,'letter-spacing':2});t.textContent=p.name;
 refs.labels.push(t);
 if(p.icon){
  p.iconEls=[];
  var nsh=(p.icon=='code')?3:(p.icon=='browser')?2:3;
  for(var si=0;si<nsh;si++)p.iconEls.push(el('path',{fill:'none',stroke:p.lab,'stroke-width':1.25,'stroke-linejoin':'round','stroke-linecap':'round',opacity:0}));
  if(p.icon=='browser')p.iconDot=el('circle',{r:1.6,fill:p.lab,opacity:0});
 }
});
var backfx=(function(){var g=document.createElementNS(NS,'g');scene.insertBefore(g,refs.planes[1]);return g})();
var BR={rail:el('line',{stroke:'#E8543A','stroke-width':1.1,'stroke-dasharray':'2 4','stroke-opacity':0}),
 t1:el('line',{stroke:'#E8543A','stroke-width':1.1,'stroke-dasharray':'2 4','stroke-opacity':0}),
 t2:el('line',{stroke:'#E8543A','stroke-width':1.1,'stroke-dasharray':'2 4','stroke-opacity':0}),
 drops:[],dots:[],nums:[],
 title:el('text',{fill:'#E8543A',opacity:0}),};
for(var bi=0;bi<3;bi++){
 BR.drops.push(el('line',{stroke:'#E8543A','stroke-width':1.1,'stroke-dasharray':'2 4','stroke-opacity':0}));
 BR.dots.push(el('circle',{r:2.6,fill:'#E8543A',opacity:0}));
 BR.nums.push(el('text',{fill:'#F5B29E',opacity:0}));
}
BR.title.textContent='AQUILA PRODUCT SUITE';
BR.nums.forEach(function(t,i){t.textContent='0'+(i+1)});
var EB={title:el('text',{fill:'#EDEDEA'})};
EB.title.textContent='ON DEVICE AGENTS';
var TAGS=['CODING TOOL PROTECTION','BROWSER TOOL PROTECTION','BROAD AGENTIC APPLICATION'];
var TB={rail:el('line',{stroke:'#E8543A','stroke-width':1.1,'stroke-dasharray':'2 4','stroke-opacity':0}),
 t1:el('line',{stroke:'#E8543A','stroke-width':1.1,'stroke-dasharray':'2 4','stroke-opacity':0}),
 t2:el('line',{stroke:'#E8543A','stroke-width':1.1,'stroke-dasharray':'2 4','stroke-opacity':0}),
 drop:el('line',{stroke:'#E8543A','stroke-width':1.1,'stroke-dasharray':'2 4','stroke-opacity':0}),
 dot:el('circle',{r:2.6,fill:'#E8543A',opacity:0}),
 label:el('text',{fill:'#E8543A',opacity:0})};
var tagEm=0;
var VCOL={allow:'#47D553',notify:'#D9A427',block:'#E24840',obs:'#47D553',disc:'#B6BCD9',flag:'#E24840'};
var VMSG={allow:['ACCESS ALLOWED','#47D553'],notify:['NOTIFY USER','#D9A427'],block:['ACTION BLOCKED','#E24840'],obs:['ACCESS ALLOWED','#47D553'],disc:['UNCATALOGUED DESTINATION','#B6BCD9'],flag:['ACTION BLOCKED','#E24840']};
var LANES={
 code:[
  {o:[-238,-62],cell:[1,2],kind:'allow',exit:[-118,66]},
  {o:[-70,-14],cell:[3,2],kind:'notify',exit:[-100,80]},
  {o:[58,-56],cell:[4,2],kind:'block',exit:[-86,84]}],
 browser:[
  {o:[-205,-22],cell:[1,2],kind:'allow',exit:[-118,66]},
  {o:[-98,-66],cell:[3,2],kind:'notify',exit:[-100,80]},
  {o:[74,-28],cell:[4,2],kind:'block',exit:[-86,84]}],
 gateway:[
  {o:[-248,-46],cell:[1,2],kind:'obs',exit:[-118,66]},
  {o:[-42,-12],cell:[3,2],kind:'disc',exit:[-100,80]},
  {o:[92,-70],cell:[4,2],kind:'flag',exit:[-86,84]}]
};
var CONV={off:0};
CFG.planes.forEach(function(p){if(p.kind=='prod')p.bx=p.x;});
var CAPK=null;
var PA=CFG.paths, pr={};
PA.forEach(function(pp){
 var Ls=LANES[pp.key].map(function(ln,li){
  var isB=false;
  return {
   cfg:ln,
   line1:el('path',{fill:'none',stroke:'#DDD9D2','stroke-width':0.8,'stroke-linecap':'round','stroke-opacity':0},backfx),
   line2:isB?null:el('path',{fill:'none',stroke:'#DDD9D2','stroke-width':0.8,'stroke-linecap':'round','stroke-opacity':0}),
   exitArrow:null,
   cellP:el('polygon',{fill:VCOL[ln.kind],'fill-opacity':0,stroke:VCOL[ln.kind],'stroke-width':1.3,'stroke-opacity':0}),
   sag:15+li*8,vT:-1e9,agent:null,held:false,heldT:0
  };
 });
 pr[pp.key]={lanes:Ls,em:0};
});
// ---- endpoint monitor (code section) ----
var MON={x:268,y:-152,z:235,sc:1};
var monG=el('g',{opacity:0});
function mel(at){var e=el('path',at,monG);return e}
var MONP={};
MONP.back=mel({fill:'none',stroke:'#3E3C39','stroke-width':1.1});
MONP.c=[mel({fill:'none',stroke:'#4A4845','stroke-width':1.1}),mel({fill:'none',stroke:'#4A4845','stroke-width':1.1}),mel({fill:'none',stroke:'#4A4845','stroke-width':1.1}),mel({fill:'none',stroke:'#4A4845','stroke-width':1.1})];
MONP.face=mel({fill:'#141311','fill-opacity':0.92,stroke:'#8E8B86','stroke-width':1.3});
MONP.bez=mel({fill:'none',stroke:'#4A4845','stroke-width':1});
MONP.chr=mel({fill:'none',stroke:'#4A4845','stroke-width':1});
MONP.dots=[0,1,2].map(function(){return el('circle',{r:1.3,fill:'none',stroke:'#6E6B66','stroke-width':1},monG)});
MONP.gut=[];MONP.bar=[];MONP.txt=[];
for(var mt=0;mt<6;mt++)MONP.txt.push(el('text',{fill:'#8E8B86',opacity:0},monG));
for(var mr=0;mr<6;mr++){
 MONP.gut.push(mel({fill:'none',stroke:'#4A4845','stroke-width':1}));
 MONP.bar.push(mel({fill:'none',stroke:(mr===2||mr===5)?'#E8543A':'#5C5A55','stroke-width':(mr===2||mr===5)?1.4:1,'stroke-opacity':(mr===2||mr===5)?0.9:0.7}));
}
MONP.g1=mel({fill:'none',stroke:'#EDEDEA','stroke-width':1.5,'stroke-linecap':'round','stroke-linejoin':'round'});
MONP.g2=mel({fill:'none',stroke:'#EDEDEA','stroke-width':1.5,'stroke-linecap':'round','stroke-linejoin':'round'});
MONP.g3=mel({fill:'none',stroke:'#EDEDEA','stroke-width':1.5,'stroke-linecap':'round'});
MONP.st1=mel({fill:'none',stroke:'#E8543A','stroke-width':1.2,'stroke-opacity':0.85});
MONP.st2=mel({fill:'none',stroke:'#33312E','stroke-width':1});
MONP.stand=mel({fill:'#131211','fill-opacity':0.8,stroke:'#6E6B66','stroke-width':1.1});
MONP.base=mel({fill:'#141311','fill-opacity':0.7,stroke:'#8E8B86','stroke-width':1.1});
MONP.kb=mel({fill:'#131211','fill-opacity':0.6,stroke:'#4A4845','stroke-width':1.1});
MONP.kr=[mel({fill:'none',stroke:'#33312E','stroke-width':1}),mel({fill:'none',stroke:'#33312E','stroke-width':1}),mel({fill:'none',stroke:'#33312E','stroke-width':1})];
var MCH={S:[],last:0,k:0},BCH={S:[],last:0,k:0};
var CODE_POOL=[
 'const ctx = agent.context()',
 'await aquila.inspect(req)',
 'if (v.block) return deny()',
 '\u00A0\u00A0commit("api/auth.ts")',
 'tool.exec("git push")',
 'const v = policy.verdict(ctx)',
 '\u00A0\u00A0fetch(PROVIDER_URL)',
 'export const guard = aquila()',
 'agent.run({files: 3})',
 '\u00A0\u00A0return allow(ctx)'];
var BRZ_POOL=[
 'prompt: "summarize q3"',
 'paste: customers.csv',
 'aquila: inspecting\u2026',
 'reply: 2,340 tokens',
 'chat.openai.com',
 'upload: deck_v2.pdf'];
function mkLine(k){
 var ai=(k%2===1);
 var w=ai?(38+Math.random()*20):(15+Math.random()*16);
 var c=ai?'#8E8B86':'#5C5A55';
 return {w:w,c:c,tc:CODE_POOL[Math.floor(Math.random()*CODE_POOL.length)],tb:BRZ_POOL[Math.floor(Math.random()*BRZ_POOL.length)]};
}
function chatStep(C,n,period){
 var now=performance.now();
 if(C.S.length===0){for(var i=0;i<n;i++){C.S.push(mkLine(C.k));C.k++;}C.last=now;}
 if(now-C.last>period){C.S.shift();C.S.push(mkLine(C.k));C.k++;C.last=now;}
 return Math.min(1,(now-C.last)/280);
}
function cLerp(a2,b2,u){return a2+(b2-a2)*u}
function cBlend(C,idx,ax,ay,az){
 var se=pr[PA[idx-1].key].em,su=suiteEm;
 var wb=se/((se+su)||1);
 C.sc=cLerp(0.92,1.35,wb);
 C.tsc=C.sc*cLerp(0.86,1,wb);
 C.x=cLerp(P[idx].x+124,ax-28,wb);
 C.y=cLerp(-148,ay-14,wb);
 C.z=cLerp(90,az,wb);
 return Math.max(se,su);
}
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
function monPt(lx,ly,lz){return proj(MON.x+lx*MON.sc,MON.y+ly*MON.sc,MON.z+(lz||0)*MON.sc)}
function monPath(pts,close){return 'M'+pts.map(function(q){var v=monPt(q[0],q[1],q[2]);return v[0].toFixed(1)+' '+v[1].toFixed(1)}).join(' L')+(close?' Z':'')}
function drawMon(){
 var me=cBlend(MON,1,268,-152,235);
 monG.setAttribute('opacity',me);
 if(me<0.01)return;
 var x0=-87,x1=87,H=114,DEP=11,b=6;
 MONP.back.setAttribute('d',monPath([[x0,0,-DEP],[x1,0,-DEP],[x1,H,-DEP],[x0,H,-DEP]],true));
 [[x0,0],[x1,0],[x1,H],[x0,H]].forEach(function(c,i){MONP.c[i].setAttribute('d',monPath([[c[0],c[1],0],[c[0],c[1],-DEP]]))});
 MONP.face.setAttribute('d',monPath([[x0,0,0],[x1,0,0],[x1,H,0],[x0,H,0]],true));
 MONP.bez.setAttribute('display','none');
 MONP.chr.setAttribute('display','none');
 MONP.dots.forEach(function(dd){dd.setAttribute('display','none')});
 var gx=x0+b+9;
 var cu=chatStep(MCH,6,1000);
 var slide=(1-eoc(cu))*11.5;
 for(var r2=0;r2<6;r2++){
  var yy=H-b-19-r2*11.5;
  MONP.gut[r2].setAttribute('d',monPath([[gx,yy,0],[gx+4.5,yy,0]]));
  var ln2=MCH.S[r2];
  var ys=yy - slide;
  MONP.bar[r2].setAttribute('display','none');
  var col2=ln2.c,op2=(ln2.c==='#5C5A55'?0.7:0.85);
  if(ln2.vT){
   var vu=eoc(Math.min(1,(performance.now()-ln2.vT)/2000));
   col2=mix(ln2.vc,ln2.c,vu);op2=1-(1-op2)*vu;
   if(vu>=1)ln2.vT=0;
  }
  var T=MONP.txt[r2];
  var full=ln2.tc||'';
  var iconL=(x1-b-22)-17.2-2;
  var pA=monPt(gx+9,ys,0),pB=monPt(iconL,ys,0);
  var avail=Math.hypot(pB[0]-pA[0],pB[1]-pA[1]);
  T.textContent=(r2===5)?full.substring(0,Math.ceil(full.length*Math.min(1,cu*1.4))):full;
  setPlaneText(T,{x:MON.x+(gx+9)*MON.sc,y:MON.y+(ys-3)*MON.sc,z:MON.z},0,0,6.6*(MON.tsc||MON.sc),0.2,'start');
  fitText(T,avail);
  T.setAttribute('fill',col2);
  T.setAttribute('opacity',op2*me);
 }
 var cx2=x1-b-22,cy2=H/2-4,s2=0.78;
 MONP.g1.setAttribute('d',monPath([[cx2-10*s2,cy2+12*s2,0],[cx2-22*s2,cy2,0],[cx2-10*s2,cy2-12*s2,0]]));
 MONP.g2.setAttribute('d',monPath([[cx2+10*s2,cy2+12*s2,0],[cx2+22*s2,cy2,0],[cx2+10*s2,cy2-12*s2,0]]));
 MONP.g3.setAttribute('d',monPath([[cx2+5*s2,cy2+15*s2,0],[cx2-5*s2,cy2-15*s2,0]]));
 MONP.st1.setAttribute('d',monPath([[x0+b,b+6,0],[x0+b+40,b+6,0]]));
 MONP.st2.setAttribute('d',monPath([[x0+b+46,b+6,0],[x1-b,b+6,0]]));
 MONP.stand.setAttribute('display','none');
 MONP.base.setAttribute('display','none');
 MONP.kb.setAttribute('display','none');
 MONP.kr.forEach(function(k2){k2.setAttribute('display','none')});
}
// ---- browser: computer with lifted window ----
var BRW={x:268,y:-152,z:235,sc:1};
var brwG=el('g',{opacity:0});
function brwel(at){return el('path',at,brwG)}
var BRWP={};
BRWP.back=brwel({fill:'none',stroke:'#3E3C39','stroke-width':1.1});
BRWP.c=[brwel({fill:'none',stroke:'#4A4845','stroke-width':1.1}),brwel({fill:'none',stroke:'#4A4845','stroke-width':1.1}),brwel({fill:'none',stroke:'#4A4845','stroke-width':1.1}),brwel({fill:'none',stroke:'#4A4845','stroke-width':1.1})];
BRWP.face=brwel({fill:'#141311','fill-opacity':0.92,stroke:'#8E8B86','stroke-width':1.3});
BRWP.winB=brwel({fill:'none',stroke:'#4A4845','stroke-width':1});
BRWP.winBt=brwel({fill:'none',stroke:'#33312E','stroke-width':1});
BRWP.winM=brwel({fill:'#111010','fill-opacity':0.9,stroke:'#5C5A55','stroke-width':1});
BRWP.winMt=brwel({fill:'none',stroke:'#4A4845','stroke-width':1});
BRWP.win=brwel({fill:'#141311','fill-opacity':0.96,stroke:'#4A4845','stroke-width':1.1});
BRWP.gl1=brwel({fill:'none',stroke:'#EDEDEA','stroke-width':1.5,'stroke-linejoin':'round','stroke-linecap':'round'});
BRWP.gl2=brwel({fill:'none',stroke:'#EDEDEA','stroke-width':1.1,'stroke-opacity':0.85,'stroke-linecap':'round'});
BRWP.gld=el('circle',{r:1.2,fill:'#EDEDEA'},brwG);
BRWP.kr=[brwel({fill:'none',stroke:'#33312E','stroke-width':1}),brwel({fill:'none',stroke:'#33312E','stroke-width':1}),brwel({fill:'none',stroke:'#33312E','stroke-width':1})];
BRWP.chr=brwel({fill:'none',stroke:'#4A4845','stroke-width':1});
BRWP.dots=[0,1,2].map(function(){return el('circle',{r:1.3,fill:'none',stroke:'#4A4845','stroke-width':1},brwG)});
BRWP.url=brwel({fill:'none',stroke:'#4A4845','stroke-width':1});
BRWP.lines=[brwel({fill:'none'}),brwel({fill:'none'}),brwel({fill:'none'})];
BRWP.ltxt=[el('text',{fill:'#8E8B86',opacity:0},brwG),el('text',{fill:'#8E8B86',opacity:0},brwG),el('text',{fill:'#8E8B86',opacity:0},brwG)];
BRWP.stand=brwel({fill:'#131211','fill-opacity':0.8,stroke:'#6E6B66','stroke-width':1.1});
BRWP.base=brwel({fill:'#141311','fill-opacity':0.7,stroke:'#8E8B86','stroke-width':1.1});
BRWP.kb=brwel({fill:'#131211','fill-opacity':0.6,stroke:'#4A4845','stroke-width':1.1});
function brwPt(lx,ly,lz){return proj(BRW.x+lx*BRW.sc,BRW.y+ly*BRW.sc,BRW.z+(lz||0)*BRW.sc)}
function brwPath(pts,close){return 'M'+pts.map(function(q){var v=brwPt(q[0],q[1],q[2]);return v[0].toFixed(1)+' '+v[1].toFixed(1)}).join(' L')+(close?' Z':'')}
var BW_W={x0:-56,x1:34,y0:6,y1:80,z:0};
function drawBrw(){
 var me=cBlend(BRW,2,268,-152,235);
 brwG.setAttribute('opacity',me);
 if(me<0.01)return;
 var x0=-87,x1=87,H=114,DEP=11,b=6;
 BRWP.back.setAttribute('d',brwPath([[x0,0,-DEP],[x1,0,-DEP],[x1,H,-DEP],[x0,H,-DEP]],true));
 [[x0,0],[x1,0],[x1,H],[x0,H]].forEach(function(c,i){BRWP.c[i].setAttribute('d',brwPath([[c[0],c[1],0],[c[0],c[1],-DEP]]))});
 BRWP.face.setAttribute('d',brwPath([[x0,0,0],[x1,0,0],[x1,H,0],[x0,H,0]],true));
 BRWP.winB.setAttribute('d',brwPath([[-86,26,0],[12,26,0],[12,100,0],[-86,100,0]],true));
 BRWP.winBt.setAttribute('d',brwPath([[-86,90,0],[12,90,0]]));
 BRWP.winM.setAttribute('d',brwPath([[-72,16,0],[24,16,0],[24,90,0],[-72,90,0]],true));
 BRWP.winMt.setAttribute('d',brwPath([[-72,80,0],[24,80,0]]));
 var w=BW_W;
 BRWP.win.setAttribute('d',brwPath([[w.x0,w.y0,w.z],[w.x1,w.y0,w.z],[w.x1,w.y1,w.z],[w.x0,w.y1,w.z]],true));
 BRWP.chr.setAttribute('d',brwPath([[w.x0+5,w.y1-13,w.z],[w.x1-5,w.y1-13,w.z]]));
 BRWP.dots.forEach(function(dd,i){var q=brwPt(w.x0+9+i*7,w.y1-7,w.z);dd.setAttribute('cx',q[0]);dd.setAttribute('cy',q[1])});
 BRWP.url.setAttribute('d',brwPath([[w.x0+28,w.y1-11,w.z],[w.x1-6,w.y1-11,w.z],[w.x1-6,w.y1-4,w.z],[w.x0+28,w.y1-4,w.z]],true));
 var bu=chatStep(BCH,3,1150);
 var bslide=(1-eoc(bu))*15;
 BRWP.lines.forEach(function(le){le.setAttribute('display','none')});
 BRWP.ltxt.forEach(function(T3,i){
  var yy=w.y1-30-i*15;
  var ln3=BCH.S[i];
  var ys=yy - bslide;
  var col3=ln3.c,op3=(ln3.c==='#5C5A55'?0.7:0.85);
  if(ln3.vT){
   var vu3=eoc(Math.min(1,(performance.now()-ln3.vT)/2000));
   col3=mix(ln3.vc,ln3.c,vu3);op3=1-(1-op3)*vu3;
   if(vu3>=1)ln3.vT=0;
  }
  var full3=ln3.tb||'';
  var iconL3=Math.min(w.x1-6,59-17.2-2);
  var qA=brwPt(w.x0+8,ys,w.z),qB=brwPt(iconL3,ys,w.z);
  var avail3=Math.hypot(qB[0]-qA[0],qB[1]-qA[1]);
  T3.textContent=(i===2)?full3.substring(0,Math.ceil(full3.length*Math.min(1,bu*1.4))):full3;
  setPlaneText(T3,{x:BRW.x+(w.x0+8)*BRW.sc,y:BRW.y+(ys-3)*BRW.sc,z:BRW.z},0,0,5.8*(BRW.tsc||BRW.sc),0.2,'start');
  fitText(T3,avail3);
  T3.setAttribute('fill',col3);
  T3.setAttribute('opacity',op3*me);
 });
 BRWP.stand.setAttribute('display','none');
 BRWP.base.setAttribute('display','none');
 BRWP.kb.setAttribute('display','none');
 BRWP.kr.forEach(function(k2){k2.setAttribute('display','none')});
 BRWP.gl1.setAttribute('d',brwPath([[59.0,70.2,0],[62.0,69.9,0],[64.9,69.2,0],[67.6,67.9,0],[70.1,66.2,0],[72.2,64.1,0],[73.9,61.6,0],[75.2,58.9,0],[75.9,56.0,0],[76.2,53.0,0],[75.9,50.0,0],[75.2,47.1,0],[73.9,44.4,0],[72.2,41.9,0],[70.1,39.8,0],[67.6,38.1,0],[64.9,36.8,0],[62.0,36.1,0],[59.0,35.8,0],[56.0,36.1,0],[53.1,36.8,0],[50.4,38.1,0],[47.9,39.8,0],[45.8,41.9,0],[44.1,44.4,0],[42.8,47.1,0],[42.1,50.0,0],[41.8,53.0,0],[42.1,56.0,0],[42.8,58.9,0],[44.1,61.6,0],[45.8,64.1,0],[47.9,66.2,0],[50.4,67.9,0],[53.1,69.2,0],[56.0,69.9,0],[59.0,70.2,0]]));
 BRWP.gl2.setAttribute('d',brwPath([[59.0,70.2,0],[60.3,69.9,0],[61.5,69.2,0],[62.6,67.9,0],[63.6,66.2,0],[64.5,64.1,0],[65.3,61.6,0],[65.8,58.9,0],[66.1,56.0,0],[66.2,53.0,0],[66.1,50.0,0],[65.8,47.1,0],[65.3,44.4,0],[64.5,41.9,0],[63.6,39.8,0],[62.6,38.1,0],[61.5,36.8,0],[60.3,36.1,0],[59.0,35.8,0],[57.7,36.1,0],[56.5,36.8,0],[55.4,38.1,0],[54.4,39.8,0],[53.5,41.9,0],[52.7,44.4,0],[52.2,47.1,0],[51.9,50.0,0],[51.8,53.0,0],[51.9,56.0,0],[52.2,58.9,0],[52.7,61.6,0],[53.5,64.1,0],[54.4,66.2,0],[55.4,67.9,0],[56.5,69.2,0],[57.7,69.9,0],[59.0,70.2,0]])+brwPath([[41.8,53.0,0],[76.2,53.0,0]]));
 BRWP.gld.setAttribute('opacity',0);
}
// ---- gateway: the perimeter, a separate layer ----
var GA={x:298,y:-214,z:225};
var GM={x:268,y:-158,z:235,sc:1};
var GPANES=[
 {x:-79,y:60,w:44,h:36, rate:820,  rows:3, type:'term'},
 {x:-31,y:66,w:40,h:30, rate:1500, rows:3, type:'app'},
 {x:11, y:62,w:32,h:34, rate:2600, rows:3, type:'idle'},
 {x:-79,y:16,w:38,h:40, rate:1150, rows:4, type:'table'},
 {x:-37,y:16,w:46,h:26, rate:640,  rows:2, type:'meter'}
];
var GPOOL=['chrome.exe \u2192 api.openai.com:443','curl \u2192 104.18.32.11:443','python3.11 \u2192 unknown-host.ai','claude-cli \u2192 api.anthropic.com','node \u2192 registry.npmjs.org:443','Slack \u2192 wss.slack.com:443','ollama \u2192 127.0.0.1:11434','code.exe \u2192 copilot.github.com','ssh \u2192 10.4.19.220:22','unknown \u2192 45.83.11.7:8443'];
function gPick(){return GPOOL[Math.floor(Math.random()*GPOOL.length)]}
GPANES.forEach(function(p){
 p.S=[];for(var r=0;r<p.rows;r++)p.S.push(gPick());
 p.last=performance.now()-Math.random()*p.rate;
 p.vT=0;p.vc='#47D553';
});
var GGH={x:13,y:16,w:34,h:30,alive:false,t0:0,last:performance.now(),next:performance.now()+2600,S:[gPick(),gPick()]};
var gmG=el('g',{opacity:0});
function gmel(at){return el('path',at,gmG)}
var GMP={};
GMP.back=gmel({fill:'none',stroke:'#3E3C39','stroke-width':1.1});
GMP.c=[gmel({fill:'none',stroke:'#4A4845','stroke-width':1.1}),gmel({fill:'none',stroke:'#4A4845','stroke-width':1.1}),gmel({fill:'none',stroke:'#4A4845','stroke-width':1.1}),gmel({fill:'none',stroke:'#4A4845','stroke-width':1.1})];
GMP.face=gmel({fill:'#101010','fill-opacity':0.95,stroke:'#8E8B86','stroke-width':1.3});
GMP.led=el('circle',{r:1.4,fill:'#C2491F',opacity:0},gmG);
GMP.stand=gmel({fill:'#131211','fill-opacity':0.8,stroke:'#6E6B66','stroke-width':1.1});
GMP.base=gmel({fill:'#141311','fill-opacity':0.7,stroke:'#8E8B86','stroke-width':1.1});
GMP.kb=gmel({fill:'#131211','fill-opacity':0.6,stroke:'#4A4845','stroke-width':1.1});
GMP.kr=[gmel({fill:'none',stroke:'#33312E','stroke-width':1}),gmel({fill:'none',stroke:'#33312E','stroke-width':1}),gmel({fill:'none',stroke:'#33312E','stroke-width':1})];
GPANES.forEach(function(p){
 p.frame=gmel({fill:'#111010','fill-opacity':0.72,stroke:'#4A4845','stroke-width':1});
 p.bar=gmel({fill:'none',stroke:'#33312E','stroke-width':1});
 p.deco=gmel({fill:'none',stroke:'#5C5A55','stroke-width':0.85,'stroke-linejoin':'round','stroke-linecap':'round'});
 if(p.type==='meter')p.mbar=gmel({fill:'none',stroke:'#8E8B86','stroke-width':1.6});
 p.txt=[];
 for(var r=0;r<p.rows;r++)p.txt.push(el('text',{fill:'#8E8B86',opacity:0.75,'font-family':"'IBM Plex Mono',monospace"},gmG));
});
GGH.frame=gmel({fill:'#111010','fill-opacity':0,stroke:'#4A4845','stroke-width':1,'stroke-opacity':0});
GGH.bar=gmel({fill:'none',stroke:'#33312E','stroke-width':1,'stroke-opacity':0});
GGH.txt=[el('text',{fill:'#8E8B86',opacity:0,'font-family':"'IBM Plex Mono',monospace"},gmG),el('text',{fill:'#8E8B86',opacity:0,'font-family':"'IBM Plex Mono',monospace"},gmG)];
GMP.ga1=gmel({fill:'none',stroke:'#EDEDEA','stroke-width':1.5,'stroke-linejoin':'round','stroke-linecap':'round'});
GMP.ga2=gmel({fill:'none',stroke:'#EDEDEA','stroke-width':1.5,'stroke-linejoin':'round','stroke-linecap':'round'});
GMP.ga3=gmel({fill:'none',stroke:'#EDEDEA','stroke-width':1.5,'stroke-linejoin':'round','stroke-linecap':'round'});
GMP.merge=el('circle',{r:2.2,fill:'none',stroke:'#8E8B86','stroke-width':1.1,opacity:0},gmG);
function gmPt(lx,ly,lz){return proj(GM.x+lx*GM.sc,GM.y+ly*GM.sc,GM.z+(lz||0)*GM.sc)}
function gmPath(pts,close){return 'M'+pts.map(function(q){var v=gmPt(q[0],q[1],q[2]);return v[0].toFixed(1)+' '+v[1].toFixed(1)}).join(' L')+(close?' Z':'')}
function drawGMon(){
 var me=cBlend(GM,3,268,-158,235);
 gmG.setAttribute('opacity',me);
 if(me<0.01)return;
 var x0=-87,x1=87,H=114,DEP=11;
 GMP.back.setAttribute('d',gmPath([[x0,0,-DEP],[x1,0,-DEP],[x1,H,-DEP],[x0,H,-DEP]],true));
 [[x0,0],[x1,0],[x1,H],[x0,H]].forEach(function(c,i){GMP.c[i].setAttribute('d',gmPath([[c[0],c[1],0],[c[0],c[1],-DEP]]))});
 GMP.face.setAttribute('d',gmPath([[x0,0,0],[x1,0,0],[x1,H,0],[x0,H,0]],true));
 var lq=gmPt(x1-8,6,0);GMP.led.setAttribute('cx',lq[0]);GMP.led.setAttribute('cy',lq[1]);GMP.led.setAttribute('opacity',0.9*me);
 GMP.stand.setAttribute('display','none');
 GMP.base.setAttribute('display','none');
 GMP.kb.setAttribute('display','none');
 GMP.kr.forEach(function(k2){k2.setAttribute('display','none')});
 var nowMs=performance.now();
 GMP.ga1.setAttribute('d',gmPath([[41.7,62.6,0],[45.5,62.6,0],[50.7,61.3,0],[54.7,57.8,0],[58.8,54.6,0],[61.5,53.4,0],[64.0,53.0,0],[76.3,53.0,0]]));
 GMP.ga2.setAttribute('d',gmPath([[41.7,43.4,0],[45.5,43.4,0],[50.7,44.7,0],[54.7,48.2,0],[58.8,51.4,0],[61.5,52.6,0],[64.0,53.0,0],[74.4,53.0,0]]));
 GMP.ga3.setAttribute('d',gmPath([[70.5,58.8,0],[76.3,53.0,0],[70.5,47.2,0]]));
 function gTxt(T,lx,ly,txt,col,op){
  T.textContent=txt;
  setPlaneText(T,{x:GM.x+lx*GM.sc,y:GM.y+ly*GM.sc,z:GM.z},0,0,4.6*GM.sc,0.15,'start');
  T.setAttribute('fill',col);T.setAttribute('opacity',op*me);
 }
 GPANES.forEach(function(p){
  if(p.type!=='idle'&&nowMs-p.last>p.rate){p.S.shift();p.S.push(gPick());p.last=nowMs;}
  var u=(p.type==='idle')?1:Math.min(1,(nowMs-p.last)/240);
  var TB={term:[8,9],app:[11,4],table:[10,5],meter:[8,8],idle:[8,9]}[p.type];
  var lh=(p.h-TB[0]-TB[1])/p.rows;
  var slide=(1-eoc(u))*lh;
  var col='#8E8B86',fop=(p.type==='idle')?0.42:0.78,sCol='#4A4845',sw=1;
  if(p.vT){
   var vu=eoc(Math.min(1,(nowMs-p.vT)/1800));
   col=mix(p.vc,'#8E8B86',vu);sCol=mix(p.vc,'#4A4845',vu);
   sw=1.6-0.6*vu;fop=1-(1-fop)*vu;
   if(vu>=1)p.vT=0;
  }
  p.frame.setAttribute('d',gmPath([[p.x,p.y,0],[p.x+p.w,p.y,0],[p.x+p.w,p.y+p.h,0],[p.x,p.y+p.h,0]],true));
  p.frame.setAttribute('stroke',sCol);p.frame.setAttribute('stroke-width',sw);
  p.frame.setAttribute('stroke-opacity',(p.type==='idle'?0.55:1)*me);
  p.frame.setAttribute('fill-opacity',0.72*me);
  p.bar.setAttribute('d',gmPath([[p.x,p.y+p.h-5,0],[p.x+p.w,p.y+p.h-5,0]]));
  p.bar.setAttribute('stroke-opacity',me);
  var dd='';
  if(p.type==='term'){
   dd+=gmPath([[p.x+3,p.y+p.h-1.6,0],[p.x+4.6,p.y+p.h-1.6,0]])+gmPath([[p.x+6.6,p.y+p.h-1.6,0],[p.x+8.2,p.y+p.h-1.6,0]])+gmPath([[p.x+10.2,p.y+p.h-1.6,0],[p.x+11.8,p.y+p.h-1.6,0]]);
   dd+=gmPath([[p.x+3,p.y+3,0],[p.x+5.2,p.y+4.6,0],[p.x+3,p.y+6.2,0]]);
   dd+=gmPath([[p.x+7,p.y+4.6,0],[p.x+p.w*0.55,p.y+4.6,0]]);
  }else if(p.type==='app'){
   dd+=gmPath([[p.x+3,p.y+p.h-3.6,0],[p.x+9,p.y+p.h-3.6,0]]);
   dd+=gmPath([[p.x+p.w-8,p.y+p.h-4.4,0],[p.x+p.w-3,p.y+p.h-4.4,0],[p.x+p.w-3,p.y+p.h-1.4,0],[p.x+p.w-8,p.y+p.h-1.4,0]],true);
  }else if(p.type==='table'){
   dd+=gmPath([[p.x+2,p.y+p.h-8.5,0],[p.x+p.w-2,p.y+p.h-8.5,0]]);
   dd+=gmPath([[p.x+p.w-9,p.y+p.h-8.5,0],[p.x+p.w-9,p.y+2,0]]);
  }else if(p.type==='meter'){
   dd+=gmPath([[p.x+3,p.y+3.4,0],[p.x+p.w-3,p.y+3.4,0]]);
  }else{
   dd+=gmPath([[p.x+p.w*0.5-3,p.y+4,0],[p.x+p.w*0.5+3,p.y+4,0]]);
  }
  p.deco.setAttribute('d',dd);
  p.deco.setAttribute('stroke-opacity',0.8*me);
  if(p.mbar){
   var mw=(p.w-6)*(0.25+0.7*(0.5+0.5*Math.sin(nowMs/1000*1.1+p.x)));
   p.mbar.setAttribute('d',gmPath([[p.x+3,p.y+3.4,0],[p.x+3+mw,p.y+3.4,0]]));
   p.mbar.setAttribute('stroke',sCol==='#4A4845'?'#8E8B86':sCol);
   p.mbar.setAttribute('stroke-opacity',me);
  }
  var top=p.y+p.h-TB[0];
  for(var r=0;r<p.rows;r++){
   var ys=top-r*lh-((p.type==='idle')?0:slide);
   gTxt(p.txt[r],p.x+3,ys-2.6,p.S[r],col,fop);
   var rEdge=p.x+p.w-((p.type==='table')?12:2);
   var a1=gmPt(p.x+3,ys,0),a2=gmPt(rEdge,ys,0);
   fitText(p.txt[r],Math.hypot(a2[0]-a1[0],a2[1]-a1[1]));
  }
 });
 (function(){
  if(!GGH.alive&&nowMs>GGH.next){GGH.alive=true;GGH.t0=nowMs;}
  var vis=0;
  if(GGH.alive){
   var age=nowMs-GGH.t0;
   if(age>5200){GGH.alive=false;GGH.next=nowMs+2200+Math.random()*2600;}
   else vis=Math.min(eoc(age/520),Math.min(1,(5200-age)/520));
  }
  GGH.frame.setAttribute('d',gmPath([[GGH.x,GGH.y,0],[GGH.x+GGH.w,GGH.y,0],[GGH.x+GGH.w,GGH.y+GGH.h,0],[GGH.x,GGH.y+GGH.h,0]],true));
  GGH.frame.setAttribute('stroke-opacity',0.9*vis*me);
  GGH.frame.setAttribute('fill-opacity',0.72*vis*me);
  GGH.bar.setAttribute('d',gmPath([[GGH.x,GGH.y+GGH.h-5,0],[GGH.x+GGH.w,GGH.y+GGH.h-5,0]]));
  GGH.bar.setAttribute('stroke-opacity',vis*me);
  if(nowMs-GGH.last>1000){GGH.S.shift();GGH.S.push(gPick());GGH.last=nowMs;}
  for(var r=0;r<2;r++){
   var yy=GGH.y+GGH.h-11-r*((GGH.h-9)/2);
   gTxt(GGH.txt[r],GGH.x+3,yy-2.6,GGH.S[r],'#8E8B86',0.78*vis);
   var a1=gmPt(GGH.x+3,yy,0),a2=gmPt(GGH.x+GGH.w-2,yy,0);
   fitText(GGH.txt[r],Math.hypot(a2[0]-a1[0],a2[1]-a1[1]));
  }
 })();

}
var gpG=el('g',{opacity:0});
function gpel(at){return el('path',at,gpG)}
var GPP={};
GPP.plane=gpel({fill:'#141311','fill-opacity':0.6,stroke:'#8E8B86','stroke-width':1.3});
GPP.grid=[gpel({fill:'none',stroke:'#33312E','stroke-width':1}),gpel({fill:'none',stroke:'#33312E','stroke-width':1}),gpel({fill:'none',stroke:'#33312E','stroke-width':1}),gpel({fill:'none',stroke:'#33312E','stroke-width':1}),gpel({fill:'none',stroke:'#33312E','stroke-width':1})];
GPP.door=gpel({fill:'#0D0C0B','fill-opacity':0.55,stroke:'#E8543A','stroke-width':2});
GPP.feeds=[gpel({fill:'none',stroke:'#5C5A55','stroke-width':1.1,'stroke-dasharray':'2 5','stroke-opacity':0.6}),gpel({fill:'none',stroke:'#5C5A55','stroke-width':1.1,'stroke-dasharray':'2 5','stroke-opacity':0.6}),gpel({fill:'none',stroke:'#5C5A55','stroke-width':1.1,'stroke-dasharray':'2 5','stroke-opacity':0.6})];
var GFEED=null;
function gpPt(lx,ly){return proj(GA.x+lx,GA.y+ly,GA.z)}
function gpPath(pts,close){return 'M'+pts.map(function(q){var v=gpPt(q[0],q[1]);return v[0].toFixed(1)+' '+v[1].toFixed(1)}).join(' L')+(close?' Z':'')}
function drawGate(){
 var me=pr.gateway.em;
 gpG.setAttribute('opacity',me);
 if(me<0.01)return;
 GPP.plane.setAttribute('d',gpPath([[-70,0],[70,0],[70,150],[-70,150]],true));
 for(var i=1;i<3;i++)GPP.grid[i-1].setAttribute('d',gpPath([[-70+i*46.7,0],[-70+i*46.7,150]]));
 for(var j2=1;j2<4;j2++)GPP.grid[1+j2].setAttribute('d',gpPath([[-70,j2*37.5],[70,j2*37.5]]));
 GPP.door.setAttribute('d',gpPath([[-70,56],[-42,56],[-42,110],[-70,110]],true));
 var dm=gpPt(-56,83);
 GPP.feeds.forEach(function(fe,i){
  var q=gmPt(90,[26,58,90][i],0);
  fe.setAttribute('d','M'+q[0].toFixed(1)+' '+q[1].toFixed(1)+' L'+dm[0].toFixed(1)+' '+dm[1].toFixed(1));
 });
}
var VBAN=el('text',{opacity:0,'font-weight':'500'});
var VBAN2=el('text',{opacity:0,fill:'#8E8B86'});
var VB={t:-1e9,txt:'',col:'#47D553'};
var suiteEm=0;

function sq(p,lx,ly,size){
 var hs=size/2,c=[[lx-hs,ly-hs],[lx+hs,ly-hs],[lx+hs,ly+hs],[lx-hs,ly+hs]];
 return c.map(function(q){var s=onPlane(p,q[0],q[1]);return s[0].toFixed(1)+','+s[1].toFixed(1)}).join(' ');
}
function cellCenter(pl,c,r){return [-pl.w/2+(c+0.5)*pl.w/6, -pl.h/2+(r+0.5)*pl.h/4];}
function cellQuad(pl,c,r){
 var x0=-pl.w/2+c*pl.w/6, x1=x0+pl.w/6, y0=-pl.h/2+r*pl.h/4, y1=y0+pl.h/4;
 var pts=[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
 return pts.map(function(q){var v=onPlane(pl,q[0],q[1]);return v[0].toFixed(1)+','+v[1].toFixed(1)}).join(' ');
}
var G={pts:{}};

var ZOOM={f:1.42,fx:1005,fy:392};
var STAGE={x:-44,y:-36,z:40};
function layout(dt){
 var ai=activeIdx();
 (function(){
  var tz,ttx,tty;
  if(ai>=0){
   var c=projRaw(STAGE.x,STAGE.y,STAGE.z);
   tz=ZOOM.f; ttx=ZOOM.fx-c[0]*tz; tty=ZOOM.fy-c[1]*tz;
  } else { tz=1; ttx=0; tty=0; }
  var e=Math.min(1,(dt||16)*0.0032);
  VIEW.z+=(tz-VIEW.z)*e; VIEW.tx+=(ttx-VIEW.tx)*e; VIEW.ty+=(tty-VIEW.ty)*e;
 })();
 (function(){
  var tOff=0;
  if(ai>=0)tOff=STAGE.x-P[ai+1].bx;
  var e=Math.min(1,(dt||16)*0.0032);
  CONV.off+=(tOff-CONV.off)*e;
  P.forEach(function(p){if(p.kind=='prod'){if(p.bx===undefined)p.bx=p.x;p.x=p.bx+CONV.off;}});
 })();
 P.forEach(function(p,i){
  var af=asmF(i),la=asmT-ASM_D[i],bf=1-brF();
  if(p.kind=='prod'){
   var onNow=(ai>=0&&i===ai+1);
   if(onNow&&!prevOn[i]&&asmDone())RD[i]=0;
   prevOn[i]=onNow;
   if(RD[i]>=0)RD[i]+=(dt||16);
  }
  var lt=(RD[i]>=0)?RD[i]:la;
  var cb=1-eoc(aCl((lt-1050)/600));
  var vis=1;
  if(p.kind=='prod'&&ai>=0&&(i-1)<ai)vis=0;
  if(p._vis===undefined)p._vis=1;
  p._vis+=(vis-p._vis)*Math.min(1,(dt||16)*0.006);
  vis=p._vis;
  refs.planes[i].setAttribute('d',rr(p));
  var frameF=(p.kind=='prod')?aCl((la-360)/380):aCl(af*1.35);
  refs.planes[i].setAttribute('stroke-dashoffset',(100*(1-frameF)).toFixed(1));
  var suiteOn=(ai<0&&ctaP<0.5);
  var target=(((ai>=0&&i===ai+1)||(suiteOn&&p.kind=='prod'))?1:0)*brF();
  hiCur[i]+=(target-hiCur[i])*Math.min(1,(dt||16)*0.005);
  var u=hiCur[i];
  refs.planes[i].setAttribute('stroke',mix(p.stroke,'#E8543A',u));
  refs.planes[i].setAttribute('stroke-opacity',(p.sop+(1-p.sop)*u)*frameF*vis);
  refs.planes[i].setAttribute('stroke-width',1.2+0.5*u);
  refs.planes[i].setAttribute('fill',mix(p.fill,'#C33A24',u));
  refs.planes[i].setAttribute('fill-opacity',(p.fop+(0.38-p.fop)*u)*((p.kind=='prod')?eoc(aCl((la-520)/380))*(0.3+0.7*eoc(aCl((lt-650)/520))):eoc(aCl((af-0.35)/0.65)))*vis);
  if(refs.prodGrids[i]){
   var pg=refs.prodGrids[i],gi=0;
   function gline(L,ax,ay,bx,by,delay){
    var g=eoc(aCl((lt-delay)/430));
    var mx=(ax+bx)/2,my=(ay+by)/2;
    var q1=onPlane(p,mx+(ax-mx)*g,my+(ay-my)*g),q2=onPlane(p,mx+(bx-mx)*g,my+(by-my)*g);
    L.setAttribute('x1',q1[0]);L.setAttribute('y1',q1[1]);L.setAttribute('x2',q2[0]);L.setAttribute('y2',q2[1]);
    L.setAttribute('stroke-opacity',Math.max(0.85*u*g,0.9*(g>0?Math.min(1,g*2):0)*Math.max(bf,cb))*vis);
   }
   for(var vi=1;vi<6;vi++){
    var y0=-p.h/2;
    gline(pg[gi++],-p.w/2+vi*p.w/6,y0,-p.w/2+vi*p.w/6,p.h/2,Math.abs(vi-3)*150);
   }
   for(var vj=1;vj<4;vj++){
    var xe=p.w/2;
    gline(pg[gi++],-p.w/2,-p.h/2+vj*p.h/4,xe,-p.h/2+vj*p.h/4,230+Math.abs(vj-2)*150);
   }
   var pd=refs.prodDots[i],di=0;
   for(var dx=0;dx<7;dx++)for(var dy=0;dy<5;dy++){
    if((dx===0||dx===6)&&(dy===0||dy===4))continue;
    var q=onPlane(p,-p.w/2+dx*p.w/6,-p.h/2+dy*p.h/4);
    var C=pd[di++];C.setAttribute('cx',q[0]);C.setAttribute('cy',q[1]);
    var dd=Math.max(Math.abs(dx-3)/3,Math.abs(dy-2)/2);
    var hide=1;
    C.setAttribute('opacity',Math.max(u,0.95*Math.max(bf,cb))*eoc(aCl((lt-560-dd*200)/260))*hide*vis);
   }
  }
  if(p.kind=='prod')setPlaneText(refs.labels[i],p,-p.w/2+30,p.h/2-32,14,2.2);
  else {setPlaneText(refs.labels[i],p,-p.w/2+34,p.h/2-46,11.5,2);refs.labels[i].setAttribute('opacity',0);}
  refs.labels[i].setAttribute('fill',mix(p.lab,'#FFFFFF',u));
  if(p.kind=='prod')refs.labels[i].setAttribute('opacity',eoc(aCl((la-620)/380))*vis);
  if(p.iconEls){
   var icx=p.w/2-p.w/6, icy=-p.h/2+45;
   var ip=function(pts,close){return 'M'+pts.map(function(q){var s2=onPlane(p,icx+q[0],icy+q[1]);return s2[0].toFixed(1)+' '+s2[1].toFixed(1)}).join(' L')+(close?' Z':'')};
   var defs=(p.icon=='code')?[[[-10,12],[-22,0],[-10,-12]],[[10,12],[22,0],[10,-12]],[[5,15],[-5,-15]]]
    :(p.icon=='browser')?[[[-24,15],[24,15],[24,-15],[-24,-15]],[[-24,7],[24,7]]]
    :[[[-21.6,12],[-16.9,12],[-10.4,10.4],[-5.4,6],[-0.2,2],[3.1,0.5],[6.2,0],[21.6,0]],[[-21.6,-12],[-16.9,-12],[-10.4,-10.4],[-5.4,-6],[-0.2,-2],[3.1,-0.5],[6.2,0],[19.2,0]],[[14.4,7.2],[21.6,0],[14.4,-7.2]]];
   var iop=0, icol=mix('#8E8B86','#FFFFFF',u);
   p.iconEls.forEach(function(pe,ii){
    pe.setAttribute('d',ip(defs[ii],p.icon=='browser'&&ii===0));
    pe.setAttribute('stroke',icol);pe.setAttribute('opacity',iop);
   });
   if(p.iconDot){var qd=onPlane(p,icx-19.5,icy+11);p.iconDot.setAttribute('cx',qd[0]);p.iconDot.setAttribute('cy',qd[1]);p.iconDot.setAttribute('fill',icol);p.iconDot.setAttribute('opacity',iop);}
  }
 });
 (function(){
  var t=performance.now()/1000,X0=STARS.X0,SW=CFG.W-X0;
  for(var i=0;i<STARS.length;i++){
   var st=STARS[i];
   st.el.setAttribute('cx',X0+(((st.x-X0) - mX*10*st.dp)%SW+SW)%SW);
   st.el.setAttribute('cy',((st.y - mY*7*st.dp)%CFG.H+CFG.H)%CFG.H);
   st.el.setAttribute('opacity',st.b*(0.55+0.45*Math.sin(t*st.sp+st.ph)));
  }
 })();
 var p0=P[0];
 AGS.forEach(function(a,i){
  agStep(a,dt||16);
  var q=onPlane(p0,a.x,a.y);
  var C=refs.dots[i];
  C.setAttribute('transform','translate('+q[0].toFixed(1)+' '+q[1].toFixed(1)+') rotate('+a.rot.toFixed(1)+') scale('+a.scl.toFixed(3)+')');
  if(LREADY&&!C._lot){C._lot=1;C._st.setAttribute('display','none');C._use.setAttribute('display','');}
  if(C._lot){
   var href=a.hot?'#lotBad':'#lotG'+(i%3);
   if(C._h!==href){C._h=href;C._use.setAttribute('href',href);}
  } else {
   var stc=a.hot?'#D33E30':'#8E8B86';
   if(C._stc!==stc){C._stc=stc;var ch=C._st.childNodes;for(var cn=0;cn<ch.length;cn++)ch[cn].setAttribute('stroke',stc);}
  }
  var op=(0.46+0.16*Math.sin(driftT*0.8+a.ph))*a.al;
  if(a.hot)op=(0.55+0.2*Math.sin(driftT*3+a.ph))*a.al;
  if(a.esc)op*=(1-a.escP);
  C.setAttribute('opacity',op*eoc(aCl((asmT-420-i*36)/480)));
 });
 var sT=((ai<0&&ctaP<0.5)?1:0)*brF();
 suiteEm+=(sT-suiteEm)*Math.min(1,(dt||16)*0.004);
 (function(){
  var e0=P[0],EZ=e0.z,etop=e0.y+e0.h/2,xM=e0.x;
  setPlaneText(EB.title,{x:xM,y:etop+22,z:EZ},0,0,14,3.5,'middle');
  var ef=eoc(aCl((asmT-560)/500));
  EB.title.setAttribute('opacity',ef);
 })();
 (function(){
  var pr1=P[1],pr3=P[3],TZ=40,topY=80,railY=122;
  var xL=pr1.x-pr1.w/2,xR=pr3.x+pr3.w/2,xM=(xL+xR)/2;
  function pj(x,y){return proj(x,y,TZ)}
  var a=pj(xL,railY),b=pj(xR,railY);
  BR.rail.setAttribute('x1',a[0]);BR.rail.setAttribute('y1',a[1]);BR.rail.setAttribute('x2',b[0]);BR.rail.setAttribute('y2',b[1]);
  var t1a=pj(xL,railY),t1b=pj(xL,railY-14),t2a=pj(xR,railY),t2b=pj(xR,railY-14);
  BR.t1.setAttribute('x1',t1a[0]);BR.t1.setAttribute('y1',t1a[1]);BR.t1.setAttribute('x2',t1b[0]);BR.t1.setAttribute('y2',t1b[1]);
  BR.t2.setAttribute('x1',t2a[0]);BR.t2.setAttribute('y1',t2a[1]);BR.t2.setAttribute('x2',t2b[0]);BR.t2.setAttribute('y2',t2b[1]);
  [BR.rail,BR.t1,BR.t2].forEach(function(L){L.setAttribute('stroke-opacity',0.9*suiteEm)});
  for(var k2=1;k2<=3;k2++){
   var tp=P[k2],d1=pj(tp.x,railY),d2=pj(tp.x,topY+6);
   var L=BR.drops[k2-1];
   L.setAttribute('x1',d1[0]);L.setAttribute('y1',d1[1]);L.setAttribute('x2',d2[0]);L.setAttribute('y2',d2[1]);
   L.setAttribute('stroke-opacity',0.9*suiteEm);
   var c=pj(tp.x,topY+3);
   BR.dots[k2-1].setAttribute('cx',c[0]);BR.dots[k2-1].setAttribute('cy',c[1]);
   BR.dots[k2-1].setAttribute('opacity',suiteEm);
   if(tp.icon)setPlaneText(BR.nums[k2-1],tp,-tp.w/2+26,-tp.h/2+26,10,2,'start');
   else setPlaneText(BR.nums[k2-1],tp,tp.w/2-26,-tp.h/2+26,10,2,'end');
   BR.nums[k2-1].setAttribute('opacity',suiteEm);
  }
  setPlaneText(BR.title,{x:xM,y:railY+18,z:TZ},0,0,14,3.5,'middle');
  BR.title.setAttribute('opacity',suiteEm);
 })();
 var tT=0;
 tagEm+=(tT-tagEm)*Math.min(1,(dt||16)*0.005);
 (function(){
  if(tagEm<0.01){[TB.rail,TB.t1,TB.t2,TB.drop].forEach(function(L){L.setAttribute('stroke-opacity',0)});
   TB.dot.setAttribute('opacity',0);TB.label.setAttribute('opacity',0);return}
  var idx=(ai>=0)?ai:0, tp=P[idx+1], TZ=40, topY=80, railY=122;
  var xL=tp.x-tp.w/2+18, xR=tp.x+tp.w/2-18, xM=tp.x;
  function pj(x,y){return proj(x,y,TZ)}
  var a=pj(xL,railY),b=pj(xR,railY);
  TB.rail.setAttribute('x1',a[0]);TB.rail.setAttribute('y1',a[1]);TB.rail.setAttribute('x2',b[0]);TB.rail.setAttribute('y2',b[1]);
  var q1=pj(xL,railY),q2=pj(xL,railY-14),q3=pj(xR,railY),q4=pj(xR,railY-14);
  TB.t1.setAttribute('x1',q1[0]);TB.t1.setAttribute('y1',q1[1]);TB.t1.setAttribute('x2',q2[0]);TB.t1.setAttribute('y2',q2[1]);
  TB.t2.setAttribute('x1',q3[0]);TB.t2.setAttribute('y1',q3[1]);TB.t2.setAttribute('x2',q4[0]);TB.t2.setAttribute('y2',q4[1]);
  var d1=pj(xM,railY),d2=pj(xM,topY+6);
  TB.drop.setAttribute('x1',d1[0]);TB.drop.setAttribute('y1',d1[1]);TB.drop.setAttribute('x2',d2[0]);TB.drop.setAttribute('y2',d2[1]);
  var c=pj(xM,topY+3);
  TB.dot.setAttribute('cx',c[0]);TB.dot.setAttribute('cy',c[1]);
  [TB.rail,TB.t1,TB.t2,TB.drop].forEach(function(L){L.setAttribute('stroke-opacity',0)});
  TB.dot.setAttribute('opacity',0);
  TB.label.textContent=TAGS[idx];
  setPlaneText(TB.label,{x:xM,y:topY+4,z:TZ},0,0,13,2.6,'middle');
  TB.label.setAttribute('opacity',tagEm);
 })();
 function relLanes(key){pr[key].lanes.forEach(function(L){if(L.agent){L.agent.cap=false;L.agent.capL=null;L.agent=null;}L.held=false;});}
 if(ai<0&&CAPK){relLanes(CAPK);CAPK=null;}
 PA.forEach(function(pp,k){
  var r=pr[pp.key];
  if(ai===k&&CAPK!==pp.key){
   if(CAPK)relLanes(CAPK);
   r.lanes.forEach(function(L){
    var best=null,bd=1e9;
    AGS.forEach(function(a2){if(a2.esc||a2.state!='live'||a2.cap)return;
     if(a2.usedK&&a2.usedK!==pp.key)return;
     var d2=Math.hypot(a2.x-L.cfg.o[0],a2.y-L.cfg.o[1]);if(d2<bd){bd=d2;best=a2}});
    if(best){best.cap=true;best.capL=L;best.usedK=pp.key;if(best.hot){best.hot=0;hotCount--;}
     L.agent=best;L.held=false;L.heldT=0;}
   });
   CAPK=pp.key;r.seq=0;
  }
  var tEm=(ai===k)?1:0;
  r.em+=(tEm-r.em)*Math.min(1,(dt||16)*0.005);
  var pl=P[pp.planeIdx];
  var now=performance.now();
  G.pts[pp.key]=[];
  r.lanes.forEach(function(L){
   var o=onPlane(P[0],L.cfg.o[0],L.cfg.o[1]); o=[o[0],o[1]+9];
   var cc=cellCenter(pl,L.cfg.cell[0],L.cfg.cell[1]);
   var g=onPlane(pl,cc[0],cc[1]);
   var ex=L.cfg.exit?[g[0]+L.cfg.exit[0],g[1]+L.cfg.exit[1]]:null;
   if(L.cfg.exit){
    var mi=r.lanes.indexOf(L),lq;
    if(pp.key==='code')lq=monPt(-87,[38,64,90][mi],-6);
    else if(pp.key==='browser')lq=brwPt(-87,[30,55,80][mi],0);
    else lq=gmPt(-87,[88,96,104][mi],-6);
    ex=[lq[0],lq[1]];
   }
   G.pts[pp.key].push(ex?{o:ex,g:g,ex:o}:{o:o,g:g,ex:null});
   var capA=L.held?Math.min(1,(now-L.heldT)/450):0;
   var op=0.28*r.em*capA;
   L.line1.setAttribute('d','M'+o[0].toFixed(1)+' '+o[1].toFixed(1)+' L'+g[0].toFixed(1)+' '+g[1].toFixed(1));
   L.line1.setAttribute('stroke-opacity',op);
   if(L.line2){
    L.line2.setAttribute('d','M'+g[0].toFixed(1)+' '+g[1].toFixed(1)+' L'+ex[0].toFixed(1)+' '+ex[1].toFixed(1));
    L.line2.setAttribute('stroke-opacity',op);
   }
   L.cellP.setAttribute('points',cellQuad(pl,L.cfg.cell[0],L.cfg.cell[1]));
   var age=now-L.vT;
   var va=age<160?age/160:Math.max(0,1-(age-160)/1400);
   L.cellP.setAttribute('fill-opacity',0.46*va*r.em);
   L.cellP.setAttribute('stroke-opacity',0.95*va*r.em);
  });
 });
 drawMon();
 drawBrw();
 drawGMon();
 (function(){
  var now=performance.now(),age=now-VB.t;
  if(ai<0||age>1750){VBAN.setAttribute('opacity',0);return}
  var pl=P[PA[ai].planeIdx];
  VBAN.textContent=VB.txt;
  VBAN.setAttribute('fill',VB.col);
  setPlaneText(VBAN,{x:pl.x-70,y:pl.y-pl.h/2-30,z:pl.z},0,0,14,2.6,'middle');
  var op;
  if(age<260)op=(Math.floor(age/65)%2)?1:0.12;
  else if(age<1400)op=1;
  else op=1-(age-1400)/350;
  VBAN.setAttribute('opacity',op*pr[PA[ai].key].em);
 })();
}

var sections=[].slice.call(document.querySelectorAll('#pin .sec'));
var panels=[].slice.call(document.querySelectorAll('.panel'));
var active=0,ctaP=0;
function activeIdx(){return (active>=1&&active<=3&&ctaP<0.5)?active-1:-1}
function onScroll(){
 var mid=innerHeight*0.5,best=0;
 sections.forEach(function(sec,i){var r=sec.getBoundingClientRect();if(r.top<=mid&&r.bottom>mid)best=i});
 active=best;
 var cr=$('cta').getBoundingClientRect();
 ctaP=Math.min(1,Math.max(0,(innerHeight*0.85-cr.top)/(innerHeight*0.55)));
 $('pinner').style.opacity=1-ctaP;
 // copy scrolls at 0.6x page speed (tightens the gap between blocks) and
 // ramps continuously to full opacity as it reaches the centre line
 var vh=innerHeight, R=0.6;
 panels.forEach(function(pn,i){
  var o=sections[i].getBoundingClientRect().top;   // 0 when this block is centred
  var eff=o*R;
  pn.style.transform='translateY(-50%) translateY('+(eff-o).toFixed(1)+'px)';
  var dn=Math.min(1,Math.abs(eff)/(vh*0.5));
  var op=Math.max(0,1-Math.pow(dn,1.5));
  pn.style.opacity=(op*(1-ctaP)).toFixed(3);
 });

}
addEventListener('scroll',onScroll,{passive:true});

var TAL={ins:11840+Math.floor(Math.random()*900),blk:0,ntf:0,tick:2200};
TAL.blk=Math.floor(TAL.ins*0.021)+Math.floor(Math.random()*8);
TAL.ntf=Math.floor(TAL.ins*0.046)+Math.floor(Math.random()*12);
var talIns=null,talBlk=null,talNtf=null;
function talDraw(){}
function talBump(elm){}
talDraw();
var pulses=[],spawnTimer=600;
function verdict(pp){var r=Math.random();
 if(pp&&pp.noAsk)return r<0.70?'allow':'block';
 return r<0.62?'allow':(r<0.84?'block':'ask')}
function tag(x,y,text,color,life,anchor){
 var t=el('text',{x:x,y:y,fill:color,'font-size':9,'letter-spacing':1.5,'text-anchor':anchor||'start'},fx);
 t.textContent=text;var t0=performance.now();
 (function f(now){var u=(now-t0)/life;if(u>=1){t.remove();return}t.setAttribute('opacity',u<0.15?u/0.15:1-((u-0.15)/0.85));requestAnimationFrame(f)})(t0);
}
function burst(x,y,color){
 var ring=el('circle',{cx:x,cy:y,r:3,fill:'none',stroke:color,'stroke-width':1.6,opacity:0.9},fx);
 var t0=performance.now();
 (function f(now){var u=(now-t0)/520;if(u>=1){ring.remove();return}ring.setAttribute('r',3+u*15);ring.setAttribute('opacity',0.9*(1-u));requestAnimationFrame(f)})(t0);
}
var msPool=[31,34,38,41,42,44,47,49];
function spawn(){
 var ai=activeIdx();
 if(ai<0)return;
 var pp=PA[ai], r=pr[pp.key];
 if(r.seq===undefined)r.seq=0;
 var li=r.seq%3;
 if(!r.lanes[li].held)return;
 r.seq++;
 pulses.push({k:ai,ln:li,seg:0,t:0,kind:(pp.key==='gateway'?['obs','obs','flag']:['allow','notify','block'])[Math.floor(Math.random()*3)],hold:0,c:el('circle',{r:1.8,fill:'#E8E4DD',opacity:0.9},backfx)});
 pulses[pulses.length-1].act=pp.acts[Math.floor(Math.random()*pp.acts.length)];
 pulses[pulses.length-1].en=el('path',{fill:'none',stroke:'#E8E4DD','stroke-width':1.7,'stroke-linecap':'round',opacity:0.95},backfx);
 TAL.ins++;talDraw();talBump(talIns);
}
function fadeOut(elm,ms){
 var t0=performance.now(),o0=parseFloat(elm.getAttribute('opacity')||elm.getAttribute('stroke-opacity')||0.9);
 (function f(now){var u=(now-t0)/ms;if(u>=1){elm.remove();return}
  elm.setAttribute('opacity',o0*(1-u));elm.setAttribute('stroke-opacity',o0*(1-u));requestAnimationFrame(f)})(t0);
}
function cellRipple(pl,c,r){
 var x0=-pl.w/2+c*pl.w/6, x1=x0+pl.w/6, y0=-pl.h/2+r*pl.h/4, y1=y0+pl.h/4;
 var cx=(x0+x1)/2, cy=(y0+y1)/2, hw=(x1-x0)/2, hh=(y1-y0)/2;
 [0,220].forEach(function(delay){
  var poly=el('polygon',{fill:'none',stroke:'#E24840','stroke-width':delay?0.8:1.1,opacity:0},fx);
  var t0=performance.now()+delay;
  (function f(now){
   var u=(now-t0)/900;
   if(u>=1){poly.remove();return}
   if(u>0){
    var e=1-Math.pow(1-u,3);
    var sc3=1+0.55*e;
    var pts=[[cx-hw*sc3,cy-hh*sc3],[cx+hw*sc3,cy-hh*sc3],[cx+hw*sc3,cy+hh*sc3],[cx-hw*sc3,cy+hh*sc3]];
    poly.setAttribute('points',pts.map(function(q){var v=onPlane(pl,q[0],q[1]);return v[0].toFixed(1)+','+v[1].toFixed(1)}).join(' '));
    poly.setAttribute('opacity',(delay?0.4:0.65)*(1-u));
   }
   requestAnimationFrame(f);
  })(t0);
 });
}

function provKill(k){
 pr[k].lanes.forEach(function(L){
  L.vT=performance.now();
  L.cellP.setAttribute('fill','#E24840');L.cellP.setAttribute('stroke','#E24840');
  setTimeout(function(){L.cellP.setAttribute('fill',VCOL[L.cfg.kind]);L.cellP.setAttribute('stroke',VCOL[L.cfg.kind]);},1600);
 });
}
function pulseStep(q,dt){
 var pp=PA[q.k],L=pr[pp.key].lanes[q.ln],pts=G.pts[pp.key][q.ln];
 var sp=[pts.o,pts.g,pts.ex];
 if(q.hold>0){q.hold-=dt;var a0=sp[q.seg];q.c.setAttribute('cx',a0[0]);q.c.setAttribute('cy',a0[1]);return true}
 var a=sp[q.seg],b=sp[q.seg+1];
 if(q.ret&&q.seg===1){a=pts.g;b=pts.o;}
 if(!b){q.c.remove();if(q.en)q.en.remove();return false}
 var len=Math.hypot(b[0]-a[0],b[1]-a[1]);
 q.t+=dt*0.66/Math.max(60,len);
 var u=Math.min(1,q.t);
 if(q.seg===0&&pts.c){
  var m=1-u;
  q.c.setAttribute('cx',m*m*a[0]+2*m*u*pts.c[0]+u*u*b[0]);
  q.c.setAttribute('cy',m*m*a[1]+2*m*u*pts.c[1]+u*u*b[1]);
 } else {
  q.c.setAttribute('cx',a[0]+(b[0]-a[0])*u);
  q.c.setAttribute('cy',a[1]+(b[1]-a[1])*u);
 }
 if(q.en){
  var ut=Math.max(0,u-0.14);
  var PF=function(uu){
   if(q.seg===0&&pts.c){var mm=1-uu;return [mm*mm*a[0]+2*mm*uu*pts.c[0]+uu*uu*b[0], mm*mm*a[1]+2*mm*uu*pts.c[1]+uu*uu*b[1]];}
   return [a[0]+(b[0]-a[0])*uu, a[1]+(b[1]-a[1])*uu];
  };
  var hp=PF(u),tp=PF(ut);
  q.en.setAttribute('d','M'+tp[0].toFixed(1)+' '+tp[1].toFixed(1)+' L'+hp[0].toFixed(1)+' '+hp[1].toFixed(1));
 }
 if(u>=1){
  q.seg++;q.t=0;
  if(q.seg==1){
   fx.appendChild(q.c);
   var n=pts.g;
   L.vT=performance.now();
   var m=VMSG[q.kind]||VMSG.allow;
   (function(){
    var CH=(pp.key==='code')?MCH:(pp.key==='browser')?BCH:null;
    if(CH&&CH.S.length){var lz=CH.S[CH.S.length-1];lz.vc=m[1];lz.vT=performance.now();}
    if(pp.key==='gateway'){
     var cand=GPANES.filter(function(p5){return p5.type!=='idle'});
     var best=cand[Math.floor(Math.random()*cand.length)];
     if(best){best.vc=m[1];best.vT=performance.now();}
    }
   })();
   L.cellP.setAttribute('fill',VCOL[q.kind]);L.cellP.setAttribute('stroke',VCOL[q.kind]);
   var RSN={code:'SECRET DETECTED',browser:'PII DETECTED',gateway:'UNKNOWN DESTINATION'};
   var act3=q.act||pp.acts[0],sub3='';
   if(q.kind==='block'||q.kind==='flag')sub3=act3+' · '+RSN[pp.key];
   else if(q.kind==='notify')sub3=act3+' · CONFIRMATION REQUIRED';
   else sub3=act3+' · '+msPool[Math.floor(Math.random()*8)]+'MS';
   VB={t:performance.now(),txt:m[0],col:m[1],sub:sub3};
   if(q.kind=='block'){
    TAL.blk++;talDraw();talBump(talBlk);
    cellRipple(P[pp.planeIdx],L.cfg.cell[0],L.cfg.cell[1]);
    fadeOut(q.c,420);if(q.en)fadeOut(q.en,300); return false;
   }
   if(q.kind=='notify'){
    TAL.ntf++;talDraw();talBump(talNtf);
    q.ret=true;
   }
   if(q.kind=='flag'){
    TAL.blk++;talDraw();talBump(talBlk);
    cellRipple(P[pp.planeIdx],L.cfg.cell[0],L.cfg.cell[1]);
    provKill(pp.key);
    fadeOut(q.c,420);if(q.en)fadeOut(q.en,300); return false;
   }
   if(q.kind=='disc'){q.c.setAttribute('fill','#B6BCD9');if(q.en)q.en.setAttribute('stroke','#B6BCD9');}

  }
  if(q.seg>=2){
   var t0=performance.now(),c=q.c;
   var en2=q.en;(function fade(now){var u2=(now-t0)/300;if(u2>=1){c.remove();if(en2)en2.remove();return}c.setAttribute('opacity',0.9*(1-u2));if(en2)en2.setAttribute('opacity',0.95*(1-u2));requestAnimationFrame(fade)})(t0);
   return false;
  }
 }
 return true;
}
var mTX=0,mTY=0,mX=0,mY=0;
addEventListener('mousemove',function(e){
 var r=$('pinner').getBoundingClientRect();
 if(r.bottom<0||r.top>innerHeight){mTX=0;mTY=0;return}
 mTX=Math.max(-1,Math.min(1,(e.clientX/innerWidth)*2-1));
 mTY=Math.max(-1,Math.min(1,(e.clientY/innerHeight)*2-1));
});
addEventListener('mouseout',function(e){if(!e.relatedTarget){mTX=0;mTY=0}});
var chromeG=$('chrome');chromeG.setAttribute('opacity',0);
new IntersectionObserver(function(en){en.forEach(function(e){if(e.intersectionRatio>0.45)asmStarted=true})},{threshold:[0,0.45,1]}).observe($('pinner'));
var start=performance.now(),last=start,panCur=0;
function frame(now){
 var t=(now-start)/1000,dt=Math.min(50,now-last);last=now;
 driftT=t;
 if(asmStarted)asmT+=dt;
 chromeG.setAttribute('opacity',brF().toFixed(3));
 var settle=-4.5*(1-eoc(asmT/1500));
 var wob=1.2*Math.sin(t*2*Math.PI/14);
 var panT=CFG.camPan[Math.min(active,3)]||0;
 panCur+=(panT-panCur)*Math.min(1,dt*0.002);
 mX+=(mTX-mX)*Math.min(1,dt*0.004);
 mY+=(mTY-mY)*Math.min(1,dt*0.004);
 var par=eoc(asmT/1500);
 cam.yaw=(CFG.yaw0+wob+settle+3.4*mX*par)*Math.PI/180;
 cam.pitch=CFG.pitch+2.3*mY*par;
 cam.cx=CFG.CX+panCur;
 layout(dt);
 PA.forEach(function(pp,k){
 });
 if(asmDone()&&ctaP<0.5){
  TAL.tick-=dt;
  if(TAL.tick<=0){
   TAL.ins+=1+Math.floor(Math.random()*3);
   if(Math.random()<0.1)TAL.blk++;
   if(Math.random()<0.2)TAL.ntf++;
   talDraw();
   TAL.tick=1700+Math.random()*2600;
  }
 }
 if(ctaP<0.5&&asmDone()){
  spawnTimer-=dt;
  if(spawnTimer<=0){spawn();spawnTimer=1300+Math.random()*1500;}
 }
 for(var i=pulses.length-1;i>=0;i--){if(!pulseStep(pulses[i],dt))pulses.splice(i,1)}
 requestAnimationFrame(frame);
}
onScroll();
requestAnimationFrame(frame);

}
function __ready(fn){document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn):fn()}
__ready(__boot);
var __t=null;
addEventListener('resize',function(){if(__started)return;clearTimeout(__t);__t=setTimeout(__boot,200)},{passive:true});
})();
