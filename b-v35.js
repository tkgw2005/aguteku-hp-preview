// v35：取り組み・事例を横に送る（矢印ボタン＋スワイプ）。燈の「注目のニュース」と同じ仕組み。
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
