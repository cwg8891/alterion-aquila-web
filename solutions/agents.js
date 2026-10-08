/* assets/shadow-agents/agents.js */
/* Shadow Agents page animations, from shadow-agents-page-v114.html.
   canvas.solo = problem agent, canvas.splane = solution slab, canvas.pagent = industry agent.
   Each self-starts and sizes to its canvas. Hand off as a hosted script or Custom Code embed. */

/* v51: spinning agent: the hero's wireframe tetrahedron, drawn in brand orange */
(function(){
  var TV=[[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]].map(function(v){return v.map(function(c){return c/Math.sqrt(3)})});
  var TE=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]], reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function rot(v,a,b,c){var x=v[0],y=v[1],z=v[2],t;
    t=y*Math.cos(a)-z*Math.sin(a);z=y*Math.sin(a)+z*Math.cos(a);y=t;
    t=x*Math.cos(b)+z*Math.sin(b);z=-x*Math.sin(b)+z*Math.cos(b);x=t;
    t=x*Math.cos(c)-y*Math.sin(c);y=x*Math.sin(c)+y*Math.cos(c);x=t;return [x,y,z]}
  var C=[].map.call(document.querySelectorAll('canvas.pagent'),function(cv){return {cv:cv,ctx:cv.getContext('2d')}});
  function draw(t){C.forEach(function(o){var r=o.cv.getBoundingClientRect();if(!r.width)return;var px=devicePixelRatio||1,W=Math.round(r.width*px),H=Math.round(r.height*px);
      if(o.cv.width!==W||o.cv.height!==H){o.cv.width=W;o.cv.height=H}
      var c=o.ctx,R=W*0.36,a=0.9+t*0.55,b=t*0.9,g=0.4+t*0.3;c.clearRect(0,0,W,H);
      var P=TV.map(function(v){var q=rot(v,a,b,g),s=2.6/(2.6-q[2]);return [W/2+q[0]*R*s,H/2-q[1]*R*s,q[2]]});
      c.lineJoin='round';c.lineCap='round';
      /* v100: industry agent drawn as a shadow agent: page-bg filled silhouette, only visible edges, #A5AAB3 dashed */
      var sx=P.slice().sort(function(p,q){return p[0]-q[0]||p[1]-q[1]}),cr=function(o,p,q){return (p[0]-o[0])*(q[1]-o[1])-(p[1]-o[1])*(q[0]-o[0])},lo=[],up=[],k;
      for(k=0;k<4;k++){while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],sx[k])<=0)lo.pop();lo.push(sx[k])}
      for(k=3;k>=0;k--){while(up.length>=2&&cr(up[up.length-2],up[up.length-1],sx[k])<=0)up.pop();up.push(sx[k])}
      var Hh=lo.slice(0,-1).concat(up.slice(0,-1));c.fillStyle='#050505';c.beginPath();Hh.forEach(function(q,i){i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1])});c.closePath();c.fill();
      var vis={};[[1,2,3,0],[0,2,3,1],[0,1,3,2],[0,1,2,3]].forEach(function(f){var A=P[f[0]],B=P[f[1]],Cc=P[f[2]],O=P[f[3]];
        var den=(B[1]-Cc[1])*(A[0]-Cc[0])+(Cc[0]-B[0])*(A[1]-Cc[1]);if(Math.abs(den)<1e-9)return;
        var w1=((B[1]-Cc[1])*(O[0]-Cc[0])+(Cc[0]-B[0])*(O[1]-Cc[1]))/den,w2=((Cc[1]-A[1])*(O[0]-Cc[0])+(A[0]-Cc[0])*(O[1]-Cc[1]))/den,w3=1-w1-w2;
        if(O[2]<w1*A[2]+w2*B[2]+w3*Cc[2]){[[f[0],f[1]],[f[1],f[2]],[f[0],f[2]]].forEach(function(e){vis[Math.min(e[0],e[1])+'-'+Math.max(e[0],e[1])]=e})}});
      var dsh=Math.max(3,W/80);c.strokeStyle='#A5AAB3';c.lineWidth=Math.max(1,W/260)*px/px;c.setLineDash([dsh,dsh]);c.beginPath();
      Object.keys(vis).forEach(function(kk){var e=vis[kk];c.moveTo(P[e[0]][0],P[e[0]][1]);c.lineTo(P[e[1]][0],P[e[1]][1])});c.stroke();c.setLineDash([]);});}
  var t0=performance.now();
  function loop(now){draw(reduced?0.6:(now-t0)/1000);if(!reduced)requestAnimationFrame(loop)}
  requestAnimationFrame(loop);
})();


/* v56–v58: slab above "The solution" (your editor settings + Exploded Stack lattice), driven by SLAB_CFG. Paste settings from slab-editor here. It auto-fits its canvas, so it never clips */
var SLAB_CFG={"width":0.9,"depth":1.1,"thickness":0.38,"tilt":42,"persp":3.2,"motion":"spin","period":50,"sway":20,"start":28.6,"stroke":1.35,"color":"#D24A2F","fill":0.4,"sideFill":1,"backEdges":1,"glow":0,"pad":4,"scale":1,"lattice":1,"latticeN":7,"latticeWave":0,"latticeSides":1,"latticeLine":0.6,"latticeDot":1.1,"latticeColor":"#DB3926","latticeOpacity":1};
/* Slab renderer shared by the prototype and the Slab Editor (v3: lattice on top + sides). SLAB(cfg) returns {draw(ctx,W,H,px,t)}.
   Box of width w, depth d, thickness h; seen from above at `tilt` degrees with camera distance `persp`.
   Scales itself to fit the canvas across the whole motion, so it never clips. */
function SLAB(cfg){
  var w=cfg.width,d=cfg.depth,h=cfg.thickness,pitch=cfg.tilt*Math.PI/180,D=cfg.persp;
  var V=[[-w,h/2,-d],[w,h/2,-d],[w,h/2,d],[-w,h/2,d],[-w,-h/2,-d],[w,-h/2,-d],[w,-h/2,d],[-w,-h/2,d]];
  var F=[{v:[0,1,2,3],n:[0,1,0]},{v:[4,5,6,7],n:[0,-1,0]},{v:[0,1,5,4],n:[0,0,-1]},{v:[1,2,6,5],n:[1,0,0]},{v:[2,3,7,6],n:[0,0,1]},{v:[3,0,4,7],n:[-1,0,0]}];
  var E=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  var EF=E.map(function(e){return F.map(function(f,i){return f.v.indexOf(e[0])>=0&&f.v.indexOf(e[1])>=0?i:-1}).filter(function(i){return i>=0})});
  function yawAt(t){var a=cfg.start*Math.PI/180,P=cfg.period;if(!P)return a;
    return cfg.motion==='sway'?a+cfg.sway*Math.PI/180*Math.sin(t*2*Math.PI/P):a+t*2*Math.PI/P}
  function view(p,yaw){var x=p[0]*Math.cos(yaw)+p[2]*Math.sin(yaw),z=-p[0]*Math.sin(yaw)+p[2]*Math.cos(yaw),y=p[1];
    return [x,y*Math.cos(pitch)-z*Math.sin(pitch),y*Math.sin(pitch)+z*Math.cos(pitch)]}
  function proj(q){var s=D/(D-q[2]);return [q[0]*s,q[1]*s]}
  // fit: sample the full motion, find the unit-scale bounding box
  var bx=[1e9,-1e9,1e9,-1e9];
  for(var i=0;i<360;i++){var t=cfg.period?i/360*cfg.period:0,yw=yawAt(t);V.forEach(function(p){var s=proj(view(p,yw));bx[0]=Math.min(bx[0],s[0]);bx[1]=Math.max(bx[1],s[0]);bx[2]=Math.min(bx[2],s[1]);bx[3]=Math.max(bx[3],s[1])})}
  return {draw:function(c,W,H,px,t){
    var pad=cfg.pad*px,R=Math.min((W-2*pad)/(bx[1]-bx[0]),(H-2*pad)/(bx[3]-bx[2]))*cfg.scale;
    var cx=W/2-(bx[0]+bx[1])/2*R, cy=H/2+(bx[2]+bx[3])/2*R, yw=yawAt(t);
    var Q=V.map(function(p){return view(p,yw)}),P=Q.map(function(q){var s=proj(q);return [cx+s[0]*R,cy-s[1]*R]});
    var vis=F.map(function(f){var n=view(f.n,yw),c0=[0,0,0];f.v.forEach(function(k){c0[0]+=Q[k][0]/4;c0[1]+=Q[k][1]/4;c0[2]+=Q[k][2]/4});
      return (0-c0[0])*n[0]+(0-c0[1])*n[1]+(D-c0[2])*n[2]>0});
    c.clearRect(0,0,W,H);c.lineJoin='miter';c.lineCap='butt';
    var col=cfg.color, rgb=[parseInt(col.slice(1,3),16),parseInt(col.slice(3,5),16),parseInt(col.slice(5,7),16)].join(',');
    // fill visible faces (translucent, like the stack)
    F.forEach(function(f,i){if(!vis[i])return;c.beginPath();f.v.forEach(function(k,j){j?c.lineTo(P[k][0],P[k][1]):c.moveTo(P[k][0],P[k][1])});c.closePath();
      c.fillStyle='rgba('+rgb+','+(cfg.fill*(i===0?1:cfg.sideFill))+')';c.fill()});
    // lattice (Exploded Stack: #DB3926 hairlines, #D24A2F nodes at every crossing) on the top face and, optionally, the visible sides.
    // The side grids share the top grid's column positions, so the mesh wraps over the edges.
    if(cfg.lattice){var N=Math.max(1,Math.round(cfg.latticeN)),A=cfg.latticeWave||0,sp=Math.min(2*w,2*d)/(N+1),M=Math.max(1,Math.round(h/sp)-1);
      function pt(p){var s=proj(view(p,yw));return [cx+s[0]*R,cy-s[1]*R]}
      function line(f){c.beginPath();for(var k=0;k<=24;k++){var p=pt(f(k/24));k?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1])}c.stroke()}
      function dot(p){p=pt(p);c.beginPath();c.arc(p[0],p[1],cfg.latticeDot*px,0,6.2832);c.fill()}
      var xs=[],zs=[],ys=[];for(var i=1;i<=N;i++){xs.push(-w+2*w*i/(N+1));zs.push(-d+2*d*i/(N+1))}for(var i=1;i<=M;i++)ys.push(-h/2+h*i/(M+1));
      c.save();c.globalAlpha=cfg.latticeOpacity;c.strokeStyle=cfg.latticeColor;c.fillStyle=cfg.color;c.lineWidth=cfg.latticeLine*px;c.lineJoin='round';
      if(vis[0]){var yT=h/2;
        zs.forEach(function(z0){line(function(u){return [-w+2*w*u,yT,z0+A*(2*d/(N+1))*Math.sin(2*Math.PI*u)]})});
        xs.forEach(function(x0){line(function(u){return [x0-A*(2*w/(N+1))*Math.sin(2*Math.PI*u),yT,-d+2*d*u]})});
        zs.forEach(function(z0,i){xs.forEach(function(x0,j){dot([x0-A*(2*w/(N+1))*Math.sin(2*Math.PI*(i+1)/(N+1)),yT,z0+A*(2*d/(N+1))*Math.sin(2*Math.PI*(j+1)/(N+1))])})})}
      if(cfg.latticeSides){
        [[2,-d],[4,d]].forEach(function(F2){if(!vis[F2[0]])return;var z0=F2[1];      // faces at z = -d / +d, columns follow top x positions
          xs.forEach(function(x0){line(function(u){return [x0,-h/2+h*u,z0]})});ys.forEach(function(y0){line(function(u){return [-w+2*w*u,y0,z0]})});
          xs.forEach(function(x0){ys.forEach(function(y0){dot([x0,y0,z0])})})});
        [[5,-w],[3,w]].forEach(function(F2){if(!vis[F2[0]])return;var x0=F2[1];      // faces at x = -w / +w, columns follow top z positions
          zs.forEach(function(z0){line(function(u){return [x0,-h/2+h*u,z0]})});ys.forEach(function(y0){line(function(u){return [x0,y0,-d+2*d*u]})});
          zs.forEach(function(z0){ys.forEach(function(y0){dot([x0,y0,z0])})})})}
      c.restore()}
    if(cfg.glow){c.shadowColor='rgba('+rgb+',.55)';c.shadowBlur=cfg.glow*px}
    c.strokeStyle=col;c.lineWidth=cfg.stroke*px;
    [false,true].forEach(function(front){E.forEach(function(e,i){var f=EF[i].some(function(k){return vis[k]});if(f!==front)return;
      c.globalAlpha=front?1:cfg.backEdges;if(!c.globalAlpha)return;c.beginPath();c.moveTo(P[e[0]][0],P[e[0]][1]);c.lineTo(P[e[1]][0],P[e[1]][1]);c.stroke()})});
    c.globalAlpha=1;c.shadowBlur=0;
  }};
}

(function(){
  var reduced=matchMedia('(prefers-reduced-motion: reduce)').matches, S=SLAB(SLAB_CFG);
  var C=[].map.call(document.querySelectorAll('canvas.splane'),function(cv){return {cv:cv,ctx:cv.getContext('2d')}});
  function draw(t){C.forEach(function(o){var r=o.cv.getBoundingClientRect();if(!r.width)return;var px=devicePixelRatio||1,W=Math.round(r.width*px),H=Math.round(r.height*px);
    if(o.cv.width!==W||o.cv.height!==H){o.cv.width=W;o.cv.height=H}S.draw(o.ctx,W,H,px,t)})}
  var t0=performance.now();
  function loop(now){draw(reduced?0:(now-t0)/1000);if(!reduced)requestAnimationFrame(loop)}
  requestAnimationFrame(loop);
})();


/* v89: Problem B: a single shadow agent (tetrahedron), orange 3/3 dashed stroke, no fill, same spin as the original problem agent */
(function(){
  var TV=[[0,1,0],[0.943,-0.333,0],[-0.471,-0.333,0.816],[-0.471,-0.333,-0.816]],TE=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]],reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function rot(v,a,b,c){var x=v[0],y=v[1],z=v[2],t;
    t=y*Math.cos(a)-z*Math.sin(a);z=y*Math.sin(a)+z*Math.cos(a);y=t;
    t=x*Math.cos(b)+z*Math.sin(b);z=-x*Math.sin(b)+z*Math.cos(b);x=t;
    t=x*Math.cos(c)-y*Math.sin(c);y=x*Math.sin(c)+y*Math.cos(c);x=t;return [x,y,z]}
  var C=[].map.call(document.querySelectorAll('canvas.solo'),function(cv){return {cv:cv,ctx:cv.getContext('2d')}}),t0=performance.now();
  function draw(t){C.forEach(function(o){var r=o.cv.getBoundingClientRect();if(!r.width)return;var px=devicePixelRatio||1,W=Math.round(r.width*px),H=Math.round(r.height*px);
      if(o.cv.width!==W||o.cv.height!==H){o.cv.width=W;o.cv.height=H}
      var c=o.ctx,R=W*0.36,a=0.9+t*0.55,b=t*0.9,g=0.4+t*0.3;c.clearRect(0,0,W,H);
      var P=TV.map(function(v){var q=rot(v,a,b,g),s=2.6/(2.6-q[2]);return [W/2+q[0]*R*s,H/2-q[1]*R*s,q[2]]});
      c.lineCap='round';c.lineJoin='round';
      TE.forEach(function(e){var d=(P[e[0]][2]+P[e[1]][2])/2;c.strokeStyle='#d24a2f';c.globalAlpha=0.55+0.45*(d+1)/2;c.lineWidth=(1.4+0.6*(d+1)/2)*px;
        c.shadowColor='rgba(210,74,47,.55)';c.shadowBlur=6*px;c.beginPath();c.moveTo(P[e[0]][0],P[e[0]][1]);c.lineTo(P[e[1]][0],P[e[1]][1]);c.stroke()});
      c.globalAlpha=1;c.shadowBlur=0})} /* v92: solid orange + glow, exactly the original problem agent */
  function loop(now){draw(reduced?0.6:(now-t0)/1000);if(!reduced)requestAnimationFrame(loop)}
  requestAnimationFrame(loop);
})();
