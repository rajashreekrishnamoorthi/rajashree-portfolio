(function(){
 var $=function(s){return document.querySelector(s)};
 $('#yr').textContent=new Date().getFullYear();
 var nav=$('#nav'),links=$('#links'),btn=$('#menuBtn');
 addEventListener('scroll',function(){nav.classList.toggle('scrolled',scrollY>30)},{passive:true});
 function toggle(o){links.classList.toggle('open',o);btn.classList.toggle('open',o);btn.setAttribute('aria-expanded',o)}
 btn.onclick=function(){toggle(!links.classList.contains('open'))};
 links.querySelectorAll('a').forEach(function(a){a.onclick=function(){toggle(false)}});

 var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 var els=document.querySelectorAll('.sec .glass,.sec .card,.sec h2');
 if('IntersectionObserver' in window&&!reduce){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
  els.forEach(function(e){e.classList.add('rv');io.observe(e)});
 }

 if(!reduce&&matchMedia('(hover:hover)').matches){
  document.querySelectorAll('.tilt').forEach(function(c){
   c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform='perspective(700px) rotateY('+x*10+'deg) rotateX('+-y*10+'deg) translateY(-4px)'});
   c.addEventListener('mouseleave',function(){c.style.transform=''});
  });
 }

 if(typeof THREE==='undefined')return; // page still works without the 3D layer
 var canvas=$('#bg'),mobile=innerWidth<820;
 var renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:!mobile,alpha:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.5:2));
 var scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(55,1,.1,200);
 cam.position.z=9;
 var cyan=0x3dd6f5,blue=0x3d7bff;

 var core=new THREE.Group();scene.add(core);
 var ico=new THREE.Mesh(new THREE.IcosahedronGeometry(2.1,1),new THREE.MeshBasicMaterial({color:cyan,wireframe:true,transparent:true,opacity:.38}));
 var inner=new THREE.Mesh(new THREE.IcosahedronGeometry(1.35,0),new THREE.MeshBasicMaterial({color:blue,wireframe:true,transparent:true,opacity:.55}));
 var dots=new THREE.Points(new THREE.IcosahedronGeometry(2.1,2),new THREE.PointsMaterial({color:0xffffff,size:.045,transparent:true,opacity:.9}));
 core.add(ico,inner,dots);
 var rings=[];
 [3.2,4.1].forEach(function(r,i){
  var m=new THREE.Mesh(new THREE.TorusGeometry(r,.012,8,160),new THREE.MeshBasicMaterial({color:i?blue:cyan,transparent:true,opacity:.55}));
  m.rotation.set(1.1+i*.7,i*.6,0);core.add(m);rings.push(m);
 });
 var floaters=[];
 for(var i=0;i<(mobile?5:9);i++){
  var g=[new THREE.OctahedronGeometry(.28),new THREE.TetrahedronGeometry(.3),new THREE.BoxGeometry(.38,.38,.38)][i%3];
  var m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:i%2?cyan:0xc9d3e3,wireframe:true,transparent:true,opacity:.5}));
  var a=Math.random()*6.28,d=5+Math.random()*5;
  m.position.set(Math.cos(a)*d,(Math.random()-.5)*10,-Math.random()*8-1);
  m.userData={s:.2+Math.random()*.4,y:m.position.y,p:Math.random()*6};
  scene.add(m);floaters.push(m);
 }
 var N=mobile?500:1400,pos=new Float32Array(N*3);
 for(var j=0;j<N;j++){pos[j*3]=(Math.random()-.5)*60;pos[j*3+1]=(Math.random()-.5)*40;pos[j*3+2]=-Math.random()*40}
 var pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pos,3));
 var stars=new THREE.Points(pg,new THREE.PointsMaterial({color:0x9fb6dd,size:.06,transparent:true,opacity:.6}));
 scene.add(stars);

 var mx=0,my=0,sy=0;
 addEventListener('pointermove',function(e){mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5},{passive:true});
 function size(){var w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);cam.aspect=w/h;
  cam.updateProjectionMatrix();core.position.x=w>820?3.2:0;core.position.y=w>820?0:2.2;core.scale.setScalar(w>820?1:.7)}
 size();addEventListener('resize',size);
 var clock=new THREE.Clock(),run=true;
 document.addEventListener('visibilitychange',function(){run=!document.hidden;if(run)loop()});
 function loop(){
  if(!run)return;requestAnimationFrame(loop);
  var t=clock.getElapsedTime();
  sy+=(scrollY-sy)*.06;
  var k=reduce?0:1;
  core.rotation.y=t*.12*k+mx*.6;core.rotation.x=t*.05*k+my*.4;
  inner.rotation.y=-t*.25*k;
  rings.forEach(function(r,i){r.rotation.z=t*(.1+i*.07)*k});
  floaters.forEach(function(f){f.rotation.x+=.003*f.userData.s*k;f.rotation.y+=.004*f.userData.s*k;f.position.y=f.userData.y+Math.sin(t*f.userData.s+f.userData.p)*.4*k});
  stars.rotation.y=t*.008*k;
  cam.position.y=-sy*.0016;cam.position.x=mx*.8;cam.lookAt(0,-sy*.0012,0);
  core.position.y=(innerWidth>820?0:2.2)+sy*.0009;
  renderer.render(scene,cam);
 }
 loop();
})();
