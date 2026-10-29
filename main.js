const $=s=>document.querySelector(s),norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
const io='IntersectionObserver'in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.08}):null;
const seen=el=>io?io.observe(el):el.classList.add('in');
document.querySelectorAll('.rv').forEach(seen);

document.addEventListener('error',e=>{const i=e.target;if(!i.closest||!i.closest('.ph'))return;if(!i.dataset.r){i.dataset.r=1;const s=i.src;i.removeAttribute('src');setTimeout(()=>{i.src=s},300)}else{const b=document.createElement('b');b.textContent=i.alt.split(' ').map(w=>w[0]).slice(0,2).join('');i.replaceWith(b)}},true);
const card=p=>`<li class="card"><div class="ph">${p[2]?`<img decoding="async" src="${p[2]}" alt="${p[0]}">`:`<b aria-hidden="true">${p[0].split(' ').map(w=>w[0]).slice(0,2).join('')}</b>`}</div><div class="inf"><h4>${p[0]}</h4><p>${p[1]}</p></div></li>`;
function render(){
 const q=norm($('#q').value.trim()),c=$('#club').value;let n=0,h='';
 CLUBS.forEach(g=>{
  if(c&&g.club!==c)return;
  const hit=q&&norm(g.club).includes(q),ps=g.people.filter(p=>!q||hit||norm(p[0]+' '+p[1]).includes(q));
  if(!ps.length)return;n+=ps.length;
  h+=`<section class="grp" aria-label="${g.club}"><header>${g.crest?`<img src="${g.crest}" alt="Escudo ${g.club}">`:''}<h3>${g.club}</h3><span>${ps.length}</span></header><ul>${ps.map(card).join('')}</ul></section>`;
 });
 $('#list').innerHTML=n?h:'<p class="none">Nenhum cliente encontrado. Tente outra busca.</p>';
 $('#n').textContent=n+(n===1?' cliente encontrado':' clientes encontrados');
 document.querySelectorAll('.grp').forEach(seen);
}
$('#club').insertAdjacentHTML('beforeend',CLUBS.map(g=>`<option>${g.club}</option>`).join(''));
$('#q').addEventListener('input',render);$('#club').addEventListener('change',render);
$('#clr').addEventListener('click',()=>{$('#q').value='';$('#club').value='';render()});
render();

/* contato */
const ch=[['WhatsApp comercial',CONFIG.whatsapp&&'https://wa.me/'+CONFIG.whatsapp.replace(/\D/g,'')],['E-mail institucional',CONFIG.email&&'mailto:'+CONFIG.email],['Instagram oficial',CONFIG.instagram&&'https://instagram.com/'+CONFIG.instagram.replace('@','')]];
$('#canais').innerHTML=ch.map(([t,u])=>u?`<a href="${u}" target="_blank" rel="noopener">${t}<small>${u.replace(/^(https:\/\/|mailto:)/,'')}</small></a>`:`<span class="off">${t}<small>A configurar</small></span>`).join('');
$('#soc').innerHTML=ch.filter(c=>c[1]).map(([t,u])=>`<li><a href="${u}" target="_blank" rel="noopener">${t.split(' ')[0]}</a></li>`).join('');
const first=ch.find(c=>c[1]);if(first){const g=$('#go');g.href=first[1];g.target='_blank';g.rel='noopener'}
$('#yr').textContent=new Date().getFullYear();
if(CONFIG.heroImage){const b=$('#hbg');b.hidden=false;b.style.backgroundImage=`url("${CONFIG.heroImage}")`}

/* 3D: logo em camadas sobre campo em perspectiva (Three.js) */
(function(){
 if(!window.THREE)return;
 const cv=$('#cv');let R;try{R=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:true})}catch(e){return}
 const S=new THREE.Scene(),C=new THREE.PerspectiveCamera(40,1,.1,100),G=new THREE.Group();
 C.position.set(0,2.4,9.5);C.lookAt(0,.2,0);R.setPixelRatio(Math.min(devicePixelRatio,2));
 document.querySelector('.hero').classList.add('d3');
 const draw=()=>R.render(S,C);
 const tx=new THREE.TextureLoader().load(document.querySelector('.logo img').src,draw);
 for(let i=0;i<18;i++){const p=new THREE.Mesh(new THREE.PlaneGeometry(3.2,3.35),new THREE.MeshBasicMaterial({map:tx,transparent:true,alphaTest:.5,color:new THREE.Color().setScalar(i?.5-i*.02:1)}));p.position.z=-i*.04;G.add(p)}
 S.add(G);
 const ln=(a,c,o)=>S.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(a.map(p=>new THREE.Vector3(p[0],-1.5,p[1]))),new THREE.LineBasicMaterial({color:c,transparent:true,opacity:o})));
 const W=11,D=6,bx=s=>[[s*W,-2.6],[s*(W-2.4),-2.6],[s*(W-2.4),2.6],[s*W,2.6]];
 ln([[-W,-D],[W,-D],[W,D],[-W,D],[-W,-D]],0xffffff,.4);ln([[0,-D],[0,D]],0xffffff,.4);ln(bx(-1),0xffffff,.4);ln(bx(1),0xffffff,.4);
 ln(Array.from({length:65},(_,i)=>[Math.cos(i/64*6.2832)*2.2,Math.sin(i/64*6.2832)*2.2]),0x00c9a7,1);
 const gr=new THREE.GridHelper(44,44,0x16332e,0x101b19);gr.position.y=-1.52;S.add(gr);
 const ball=new THREE.Mesh(new THREE.IcosahedronGeometry(.4,1),new THREE.MeshBasicMaterial({color:0xffffff,wireframe:true,transparent:true,opacity:.7}));S.add(ball);
 const rs=()=>{const w=cv.clientWidth,h=cv.clientHeight,m=w<900;R.setSize(w,h,false);C.aspect=w/h;C.fov=m?62:40;C.updateProjectionMatrix();G.position.set(m?0:3.2,m?2.6:.9,0);G.scale.setScalar(1);draw()};
 new ResizeObserver(rs).observe(cv);
 let mx=0,my=0,on=true,t=0;
 addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
 addEventListener('touchmove',e=>{const p=e.touches[0];mx=p.clientX/innerWidth-.5;my=p.clientY/innerHeight-.5},{passive:true});
 addEventListener('deviceorientation',e=>{if(e.gamma==null)return;mx=Math.max(-.5,Math.min(.5,e.gamma/60));my=Math.max(-.5,Math.min(.5,(e.beta-50)/80))});
 addEventListener('click',()=>{if(window.DeviceOrientationEvent&&DeviceOrientationEvent.requestPermission)DeviceOrientationEvent.requestPermission().catch(()=>{})},{once:true});
 if(rm){G.rotation.y=-.45;ball.position.set(1.2,1.6,2.2);draw();return}
 new IntersectionObserver(e=>on=e[0].isIntersecting).observe(cv);
 (function f(){requestAnimationFrame(f);if(!on)return;t+=.01;
  G.rotation.y+=(mx*.9+Math.sin(t)*.35-G.rotation.y)*.05;G.rotation.x+=(my*.4-G.rotation.x)*.05;
  ball.position.set(Math.cos(t*1.4)*3.2+G.position.x,.9+Math.sin(t*2)*.4,Math.sin(t*1.4)*3);ball.rotation.x=ball.rotation.y=t*2;
  C.position.x=mx*1.2;C.lookAt(0,.2,0);draw()})();
})();
/* inclinação 3D dos cards */
if(!rm)document.addEventListener('pointermove',e=>{
 const c=e.pointerType==='mouse'&&e.target.closest('.card,.sv article');
 document.querySelectorAll('.tl').forEach(x=>{if(x!==c){x.classList.remove('tl');x.style.removeProperty('--rx');x.style.removeProperty('--ry')}});
 if(!c)return;const r=c.getBoundingClientRect();c.classList.add('tl');
 c.style.setProperty('--ry',((e.clientX-r.left)/r.width-.5)*14+'deg');c.style.setProperty('--rx',(.5-(e.clientY-r.top)/r.height)*14+'deg');
});

/* navegação */
const top_=$('#top'),tg=$('#tg');
const sc=()=>top_.classList.toggle('sc',scrollY>40);addEventListener('scroll',sc,{passive:true});sc();
tg.addEventListener('click',()=>{const o=top_.classList.toggle('open');tg.setAttribute('aria-expanded',o);tg.textContent=o?'✕':'☰'});
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
 const t=document.querySelector(a.getAttribute('href'));if(!t||a.target==='_blank')return;
 e.preventDefault();t.scrollIntoView({behavior:rm?'auto':'smooth'});
 top_.classList.remove('open');tg.setAttribute('aria-expanded',false);tg.textContent='☰';
}));
