// メニュー・出現アニメーション・ヘッダーの切り替え。
(()=>{
 const root=document.documentElement, reduced=matchMedia('(prefers-reduced-motion: reduce)'),header=document.querySelector('.site-header');
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}}),{threshold:.08});
 if(!reduced.matches)root.classList.add('reveal-ready');
 document.querySelectorAll('[data-reveal],.vision').forEach(el=>io.observe(el));
 document.querySelectorAll('.biz-item').forEach((el,i)=>el.style.setProperty('--delay',i*60+'ms'));
 const menu=document.getElementById('sp-menu'),opener=document.querySelector('.menu-btn'),closer=menu.querySelector('.menu-close'),main=document.querySelector('main'),footer=document.querySelector('footer');
 const setMenu=open=>{menu.hidden=!open;root.classList.toggle('menu-open',open);opener.setAttribute('aria-expanded',String(open));[header,main,footer].forEach(el=>el.inert=open);(open?closer:opener).focus()};
 opener.addEventListener('click',()=>setMenu(true));closer.addEventListener('click',()=>setMenu(false));
 menu.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
 menu.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false);if(e.key==='Tab'){const f=[...menu.querySelectorAll('a,button')],first=f[0],last=f.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
 matchMedia('(min-width: 901px)').addEventListener('change',e=>{if(e.matches&&!menu.hidden)setMenu(false)});
 const item=document.querySelector('.has-sub'),b=item.querySelector('.gnav-link'),panel=item.querySelector('.gnav-sub'),backdrop=document.querySelector('.nav-backdrop');
 const setBusiness=open=>{item.classList.toggle('is-open',open);header.classList.toggle('nav-expanded',open);b.setAttribute('aria-expanded',String(open));panel.inert=!open;backdrop.hidden=!open};
 setBusiness(false);b.addEventListener('click',()=>setBusiness(!item.classList.contains('is-open')));
 panel.querySelector('.mega-close').addEventListener('click',()=>{setBusiness(false);b.focus()});backdrop.addEventListener('click',()=>{setBusiness(false);b.focus()});
 item.addEventListener('focusout',e=>{if(!item.contains(e.relatedTarget))setBusiness(false)});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&item.classList.contains('is-open')){setBusiness(false);b.focus()}});
 panel.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setBusiness(false)));document.addEventListener('click',e=>{if(!item.contains(e.target))setBusiness(false)});matchMedia('(max-width:900px)').addEventListener('change',e=>{if(e.matches)setBusiness(false)});
 const panels=[...document.querySelectorAll('.brand-panel')];let scheduled=false;const update=()=>{scheduled=false;header.classList.toggle('is-scrolled',scrollY>20);if(reduced.matches)return;panels.forEach(p=>{const r=p.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight){const progress=(r.top+r.height/2-innerHeight/2)/innerHeight;p.querySelector('.panel-art').style.transform='translateY('+Math.max(-18,Math.min(18,progress*22))+'px)'}})};addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update)}},{passive:true});update();reduced.addEventListener('change',()=>{root.classList.toggle('reveal-ready',!reduced.matches);if(reduced.matches)panels.forEach(p=>p.querySelector('.panel-art').style.transform='none')});
})();

// 取り組み・事例の横送り。
(function(){
  var track=document.querySelector('.work-track'); if(!track) return;
  var btns=document.querySelectorAll('.carousel-btn');
  function step(){var item=track.querySelector('.work-item'); if(!item) return track.clientWidth; var gap=parseFloat(getComputedStyle(track).columnGap)||0; return item.getBoundingClientRect().width+gap;}
  function update(){var max=track.scrollWidth-track.clientWidth-2; btns.forEach(function(b){var d=+b.dataset.dir; b.disabled=d<0?track.scrollLeft<=2:track.scrollLeft>=max;});}
  var target=null;
  btns.forEach(function(b){b.addEventListener('click',function(){
    var s=step(),max=track.scrollWidth-track.clientWidth;
    var base=target!==null?target:track.scrollLeft;
    target=Math.max(0,Math.min(max,Math.round(base/s)*s+(+b.dataset.dir)*s));
    track.scrollTo({left:target,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  });});
  track.addEventListener('scrollend',function(){target=null;update();});
  ['pointerdown','wheel','touchstart'].forEach(function(e){track.addEventListener(e,function(){target=null;},{passive:true});});
  track.addEventListener('scroll',function(){window.requestAnimationFrame(update);},{passive:true});
  window.addEventListener('resize',update); update();
})();

// スマートフォンの下部固定ボタン。
(function(){
  var dock=document.querySelector('.cta-dock'); if(!dock) return;
  var contact=document.getElementById('contact'), contactVisible=false, ticking=false;
  function update(){
    ticking=false;
    var past=window.scrollY>window.innerHeight*0.55;
    dock.classList.toggle('is-on',past&&!contactVisible);
  }
  if(contact&&'IntersectionObserver' in window){
    new IntersectionObserver(function(es){contactVisible=es[0].isIntersecting;update();},{threshold:0.15}).observe(contact);
  }
  window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(update);}},{passive:true});
  update();
})();
