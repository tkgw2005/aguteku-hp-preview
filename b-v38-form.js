// v38（2026-11-13）：資料請求・お問い合わせのフォーム。
// 入力チェック → （お問い合わせだけ確認画面）→ 送信 → 完了ページ。
// 送信先：ENDPOINT に Google Apps Script のウェブアプリのURLを入れると、そこへ送る（tools/form-mailer/ を参照）。
// 空のあいだはデザイン確認版として、実際には送らずに完了ページへ進む。
(function(){
  var ENDPOINT = '';

  function q(el, s){ return el.querySelector(s); }
  function label(field){
    var l = field.closest('fieldset') ? q(field.closest('fieldset'), 'legend') : field.closest('form').querySelector('label[for="'+field.id+'"]');
    return l ? l.childNodes[0].textContent.trim() : field.name;
  }
  function showError(field, on){
    var box = field.closest('.field') || field.closest('fieldset');
    if(!box) return;
    var msg = q(box, '.field-error');
    if(on){
      if(!msg){ msg = document.createElement('p'); msg.className = 'field-error'; msg.id = (field.id || field.name) + '-err'; box.appendChild(msg); }
      msg.textContent = field.dataset.error || '入力内容をご確認ください';
      box.classList.add('is-error');
      box.querySelectorAll('input,textarea').forEach(function(i){ i.setAttribute('aria-invalid','true'); i.setAttribute('aria-describedby', msg.id); });
    }else{
      if(msg) msg.remove();
      box.classList.remove('is-error');
      box.querySelectorAll('input,textarea').forEach(function(i){ i.removeAttribute('aria-invalid'); i.removeAttribute('aria-describedby'); });
    }
  }
  function validate(form){
    var first = null, seen = {};
    form.querySelectorAll('[required]').forEach(function(f){
      if(f.type === 'radio'){ if(seen[f.name]) return; seen[f.name] = 1; }
      var ok = f.type === 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.value.trim()) : f.type === 'radio' ? !!form.querySelector('input[name="'+f.name+'"]:checked') : f.checkValidity() && f.value.trim() !== '' || (f.type === 'checkbox' && f.checked);
      showError(f, !ok);
      if(!ok && !first) first = f;
    });
    if(first){ first.focus(); first.closest('.field,fieldset').scrollIntoView({block:'center', behavior:'smooth'}); }
    return !first;
  }
  function collect(form){
    var data = new FormData(form), out = {form: form.dataset.form, page: location.href};
    data.forEach(function(v, k){ out[k] = typeof v === 'string' ? v.trim() : v; });
    return out;
  }
  function send(form, data){
    var btns = form.querySelectorAll('button'), status = q(form, '.form-status');
    btns.forEach(function(b){ b.disabled = true; });
    status.textContent = '送信しています…';
    if(data.website){ location.href = form.dataset.thanks; return; } // ボット除け（人には見えない欄に入力があれば送らない）
    try{ if(data.email) sessionStorage.setItem('aq-sent-email', data.email); }catch(e){}
    var done = function(){ location.href = form.dataset.thanks; };
    if(!ENDPOINT){ setTimeout(done, 500); return; }
    fetch(ENDPOINT, {method:'POST', mode:'no-cors', body:new URLSearchParams(data)}).then(done).catch(function(){
      btns.forEach(function(b){ b.disabled = false; });
      status.textContent = '送信できませんでした。通信状況をご確認のうえ、もう一度お試しください。';
    });
  }
  function setStep(name){
    document.querySelectorAll('.fp-steps li').forEach(function(li){ li.classList.toggle('is-current', li.dataset.step === name); });
  }

  document.querySelectorAll('.aq-form').forEach(function(form){
    form.addEventListener('input', function(e){ if(e.target.closest('.is-error')) showError(e.target, false); });
    form.addEventListener('change', function(e){ if(e.target.closest('.is-error')) showError(e.target, false); });
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if(!validate(form)) return;
      var data = collect(form);
      if(!form.hasAttribute('data-confirm')){ send(form, data); return; }
      // 確認画面
      var list = q(form, '.confirm-list'); list.innerHTML = '';
      form.querySelectorAll('.form-input input:not([type=radio]):not([type=checkbox]):not([name=website]), .form-input textarea').forEach(function(f){ add(label(f), f.value.trim() || '（未入力）'); });
      var r = form.querySelector('input[type=radio]:checked'); if(r) list.insertBefore(row(label(r), r.value), list.firstChild);
      function row(k, v){ var d = document.createElement('div'), dt = document.createElement('dt'), dd = document.createElement('dd'); dt.textContent = k; dd.textContent = v; d.appendChild(dt); d.appendChild(dd); return d; }
      function add(k, v){ list.appendChild(row(k, v)); }
      q(form, '.form-input').hidden = true; q(form, '.form-confirm').hidden = false; setStep('confirm');
      form.closest('.fp-form-box').scrollIntoView({block:'start', behavior:'smooth'});
      q(form, '.form-send').focus({preventScroll:true});
      form._data = data;
    });
    var back = q(form, '.form-back'), go = q(form, '.form-send');
    if(back) back.addEventListener('click', function(){ q(form, '.form-confirm').hidden = true; q(form, '.form-input').hidden = false; setStep('input'); form.closest('.fp-form-box').scrollIntoView({block:'start', behavior:'smooth'}); });
    if(go) go.addEventListener('click', function(){ setStep('done'); send(form, form._data); });
  });

  // 完了ページ：送ったアドレスを表示
  var sent = document.querySelector('[data-sent-email]');
  if(sent){ try{ var m = sessionStorage.getItem('aq-sent-email'); if(m){ sent.textContent = m + ' に'; sent.nextSibling && (sent.nextSibling.textContent = sent.nextSibling.textContent.replace('ご入力いただいたメールアドレスに、', '')); } }catch(e){} }
})();
