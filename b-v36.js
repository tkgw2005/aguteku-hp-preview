// v36：資料寄りの事業ページ（AI事業・農業事業）。アイコン（Lucide）の描画と、タブの切り替え。
(function(){
  if(window.lucide&&lucide.createIcons) lucide.createIcons();
  document.querySelectorAll('[role="tablist"]').forEach(function(list){
    var tabs=[].slice.call(list.querySelectorAll('[role="tab"]'));
    function select(tab,focus){
      tabs.forEach(function(t){
        var on=t===tab; t.setAttribute('aria-selected',on?'true':'false'); t.tabIndex=on?0:-1;
        var p=document.getElementById(t.getAttribute('aria-controls')); if(p) p.hidden=!on;
      });
      if(focus) tab.focus();
    }
    tabs.forEach(function(t,i){
      t.addEventListener('click',function(){select(t,false);});
      t.addEventListener('keydown',function(e){
        var k=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0; if(!k) return;
        e.preventDefault(); select(tabs[(i+k+tabs.length)%tabs.length],true);
      });
    });
    var cur=tabs.filter(function(t){return t.getAttribute('aria-selected')==='true';})[0]||tabs[0]; select(cur,false);
  });
})();
