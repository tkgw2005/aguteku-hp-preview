// AI事業・農業事業のアイコンと、事業モデル・事例のタブ。
(function(){
  if(window.lucide&&lucide.createIcons) lucide.createIcons();
  document.querySelectorAll('[role="tablist"]').forEach(function(list){
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const panelId = tab => tab.getAttribute('aria-controls');
    const fragmentTab = () => tabs.find(tab => '#' + panelId(tab) === location.hash);

    function select(tab,focus){
      tabs.forEach(function(t){
        var on=t===tab; t.setAttribute('aria-selected',on?'true':'false'); t.tabIndex=on?0:-1;
        var p=document.getElementById(panelId(t)); if(p) p.hidden=!on;
      });
      if(focus) tab.focus();
    }

    function selectFromTab(tab, focus) {
      select(tab, focus);
      if (fragmentTab()) history.replaceState(history.state, '', '#' + panelId(tab));
    }

    function selectFromFragment() {
      const tab = fragmentTab();
      if (!tab) return;
      select(tab, false);
      // 初期状態で非表示のパネルは、表示してから目的の位置へ移動する。
      document.getElementById(panelId(tab)).scrollIntoView({behavior: 'instant'});
    }

    tabs.forEach(function(t,i){
      t.addEventListener('click',function(){selectFromTab(t,false);});
      t.addEventListener('keydown',function(e){
        var k=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0; if(!k) return;
        e.preventDefault(); selectFromTab(tabs[(i+k+tabs.length)%tabs.length],true);
      });
    });
    const current = tabs.find(tab => tab.getAttribute('aria-selected') === 'true');
    select(current || tabs[0], false);
    selectFromFragment();
    window.addEventListener('hashchange', selectFromFragment);
  });
})();
