const $=s=>document.querySelector(s),rm=matchMedia('(prefers-reduced-motion:reduce)').matches,norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1});
document.querySelectorAll('.rv').forEach(e=>io.observe(e));

document.addEventListener('error',e=>{const i=e.target;if(!i.closest||!i.closest('.ph'))return;if(!i.dataset.r){i.dataset.r=1;const s=i.src;i.removeAttribute('src');setTimeout(()=>{i.src=s},300)}else{const b=document.createElement('b');b.textContent=i.alt.split(' ').map(w=>w[0]).slice(0,2).join('');i.replaceWith(b)}},true);
/* galeria 3D de clientes */
const ALL=CLUBS.flatMap(g=>g.people.map(p=>({c:g.club,n:p[0],r:p[1],f:p[2]||''})));
let sel='',cur=0,L=[];const cf=$('#cf');
$('#chips').innerHTML=['Todos',...CLUBS.map(g=>g.club)].map((c,i)=>`<button class="chip${i?'':' on'}" data-c="${i?c:''}">${c}</button>`).join('');
function place(){[...cf.children].forEach((el,i)=>{const d=i-cur,a=Math.abs(d);
 el.style.transform=`translateX(${d*(innerWidth<700?150:230)}px) translateZ(${-a*140}px) rotateY(${-d*34}deg)`;
 el.style.opacity=a>3?0:1-a*.22;el.style.zIndex=99-a;el.style.visibility=a>4?'hidden':'visible';el.style.pointerEvents=a>3?'none':'auto';el.classList.toggle('on',!d)})}
function build(){const q=norm($('#q').value.trim());
 L=ALL.filter(p=>(!sel||p.c===sel)&&(!q||norm(p.n+' '+p.r+' '+p.c).includes(q)));cur=0;
 cf.innerHTML=L.map(p=>`<li class="ci"><div class="ph">${p.f?`<img decoding="async" src="${p.f}" alt="${p.n}" draggable="false">`:`<b aria-hidden="true">${p.n.split(' ').map(w=>w[0]).slice(0,2).join('')}</b>`}</div><div class="inf"><small>${p.c}</small><h4>${p.n}</h4><p>${p.r}</p></div></li>`).join('');
 $('#n').textContent=L.length+(L.length===1?' cliente encontrado':' clientes encontrados');$('#none').hidden=!!L.length;place()}
const go=n=>{cur=Math.max(0,Math.min(L.length-1,n));place()};
$('#chips').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;sel=b.dataset.c;document.querySelectorAll('.chip').forEach(x=>x.classList.toggle('on',x===b));build()});
$('#q').addEventListener('input',build);
$('#clr').addEventListener('click',()=>{$('#q').value='';sel='';document.querySelectorAll('.chip').forEach((x,i)=>x.classList.toggle('on',!i));build()});
$('#pv').onclick=()=>go(cur-1);$('#nx').onclick=()=>go(cur+1);
$('#stage').addEventListener('keydown',e=>{if(e.key==='ArrowLeft')go(cur-1);if(e.key==='ArrowRight')go(cur+1)});
cf.addEventListener('click',e=>{const li=e.target.closest('.ci');if(li&&!li.classList.contains('on'))go([...cf.children].indexOf(li))});
let x0=null;$('#stage').addEventListener('pointerdown',e=>{x0=e.clientX});
addEventListener('pointerup',e=>{if(x0==null)return;const dx=e.clientX-x0;x0=null;if(Math.abs(dx)>40)go(cur-Math.sign(dx)*Math.max(1,Math.round(Math.abs(dx)/160)))});
addEventListener('resize',place);build();

/* cena 3D: logo em camadas, campo, bola e partículas; a câmera orbita com a rolagem */
(function(){
 if(!window.THREE)return;
 const cv=$('#gl');let R;try{R=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:true})}catch(e){return}
 R.setPixelRatio(Math.min(devicePixelRatio,2));
 const S=new THREE.Scene(),C=new THREE.PerspectiveCamera(42,1,.1,200),G=new THREE.Group();
 let p=0,mx=0,my=0,t=0;
 const view=()=>{const w=cv.clientWidth,h=cv.clientHeight,m=w<900,k=Math.max(0,1-p*5);C.setViewOffset(w,h,m?0:-w*.2*k,m?h*.22*k:0,w,h)};
 const draw=()=>{const a=p*Math.PI*1.5,r=11-p*2;C.position.set(Math.sin(a)*r,2.6+p*4,Math.cos(a)*r);C.lookAt(0,.9,0);view();R.render(S,C)};
 const tx=new THREE.TextureLoader().load($('.logo img').src,draw);
 for(let i=0;i<20;i++){const q=new THREE.Mesh(new THREE.PlaneGeometry(3.2,3.35),new THREE.MeshBasicMaterial({map:tx,transparent:true,alphaTest:.5,color:new THREE.Color().setScalar(i?.5-i*.018:1)}));q.position.z=-i*.045;G.add(q)}
 G.position.y=.9;S.add(G);
 const ln=(a,c,o)=>S.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(a.map(v=>new THREE.Vector3(v[0],-1.5,v[1]))),new THREE.LineBasicMaterial({color:c,transparent:true,opacity:o})));
 const W=14,D=8,bx=s=>[[s*W,-3.2],[s*(W-3),-3.2],[s*(W-3),3.2],[s*W,3.2]];
 ln([[-W,-D],[W,-D],[W,D],[-W,D],[-W,-D]],0xffffff,.4);ln([[0,-D],[0,D]],0xffffff,.4);ln(bx(-1),0xffffff,.4);ln(bx(1),0xffffff,.4);
 ln(Array.from({length:65},(_,i)=>[Math.cos(i/64*6.2832)*2.6,Math.sin(i/64*6.2832)*2.6]),0x00c9a7,1);
 const gr=new THREE.GridHelper(80,80,0x16332e,0x101b19);gr.position.y=-1.52;S.add(gr);
 const ball=new THREE.Mesh(new THREE.IcosahedronGeometry(.4,1),new THREE.MeshBasicMaterial({color:0xffffff,wireframe:true,transparent:true,opacity:.7}));S.add(ball);
 const pa=new Float32Array(1500);for(let i=0;i<1500;i++)pa[i]=i%3==1?Math.random()*9-1:(Math.random()-.5)*60;
 const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pa,3));
 const pts=new THREE.Points(pg,new THREE.PointsMaterial({color:0x00c9a7,size:.07,transparent:true,opacity:.7}));S.add(pts);
 const rs=()=>{R.setSize(cv.clientWidth,cv.clientHeight,false);C.aspect=cv.clientWidth/cv.clientHeight;C.updateProjectionMatrix();draw()};
 addEventListener('resize',rs);rs();
 addEventListener('scroll',()=>{p=Math.min(1,scrollY/Math.max(1,document.body.scrollHeight-innerHeight));if(rm)draw()},{passive:true});
 if(rm){G.rotation.y=-.3;ball.position.set(1.5,1.4,2.5);draw();return}
 addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
 addEventListener('touchmove',e=>{const q=e.touches[0];mx=q.clientX/innerWidth-.5;my=q.clientY/innerHeight-.5},{passive:true});
 addEventListener('deviceorientation',e=>{if(e.gamma==null)return;mx=Math.max(-.5,Math.min(.5,e.gamma/60));my=Math.max(-.5,Math.min(.5,(e.beta-50)/80))});
 addEventListener('click',()=>{if(window.DeviceOrientationEvent&&DeviceOrientationEvent.requestPermission)DeviceOrientationEvent.requestPermission().catch(()=>{})},{once:true});
 let on=true;new IntersectionObserver(e=>on=e[0].isIntersecting).observe($('#inicio'));
 (function f(){requestAnimationFrame(f);t+=.01;
  G.rotation.y+=(mx*.8+Math.sin(t)*.25-G.rotation.y)*.05;G.rotation.x+=(my*.3-G.rotation.x)*.05;
  ball.position.set(Math.cos(t*1.4)*3.6,.9+Math.sin(t*2)*.4,Math.sin(t*1.4)*3.6);ball.rotation.x=ball.rotation.y=t*2;pts.rotation.y=t*.05;draw()})();
})();

/* inclinação 3D com mouse */
if(!rm)document.addEventListener('pointermove',e=>{
 const c=e.pointerType==='mouse'&&e.target.closest('.sv article,.pan');
 document.querySelectorAll('.tl').forEach(x=>{if(x!==c){x.classList.remove('tl');x.style.removeProperty('--rx');x.style.removeProperty('--ry')}});
 if(!c)return;const r=c.getBoundingClientRect();c.classList.add('tl');
 c.style.setProperty('--ry',((e.clientX-r.left)/r.width-.5)*14+'deg');c.style.setProperty('--rx',(.5-(e.clientY-r.top)/r.height)*14+'deg')});

/* contato e navegação */
const ch=[['WhatsApp comercial',CONFIG.whatsapp&&'https://wa.me/'+CONFIG.whatsapp.replace(/\D/g,'')],['E-mail institucional',CONFIG.email&&'mailto:'+CONFIG.email],['Instagram oficial',CONFIG.instagram&&'https://instagram.com/'+CONFIG.instagram.replace('@','')]];
$('#canais').innerHTML=ch.map(([t,u])=>u?`<a href="${u}" target="_blank" rel="noopener">${t}<small>${u.replace(/^(https:\/\/|mailto:)/,'')}</small></a>`:`<span class="off">${t}<small>A configurar</small></span>`).join('');
$('#soc').innerHTML=ch.filter(c=>c[1]).map(([t,u])=>`<li><a href="${u}" target="_blank" rel="noopener">${t.split(' ')[0]}</a></li>`).join('');
const fc=ch.find(c=>c[1]);if(fc){const g=$('#go');g.href=fc[1];g.target='_blank';g.rel='noopener'}
$('#yr').textContent=new Date().getFullYear();
const tp=$('#top'),tg=$('#tg');
const sc=()=>tp.classList.toggle('sc',scrollY>40);addEventListener('scroll',sc,{passive:true});sc();
tg.addEventListener('click',()=>{const o=tp.classList.toggle('open');tg.setAttribute('aria-expanded',o);tg.textContent=o?'✕':'☰'});
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
 const t=document.querySelector(a.getAttribute('href'));if(!t||a.target==='_blank')return;
 e.preventDefault();t.scrollIntoView({behavior:rm?'auto':'smooth'});tp.classList.remove('open');tg.setAttribute('aria-expanded',false);tg.textContent='☰'}));
