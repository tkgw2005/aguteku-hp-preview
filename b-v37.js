// v37：スマートフォンの下部固定ボタン（資料請求・お問い合わせ）。第一画面を過ぎたら出し、最後のご相談の欄が見えている間は隠す。
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
