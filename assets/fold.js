// 2026-10-28 Rex 승인 — 휴대폰에서 홈의 긴 칸을 접는다(「더 보기」로 펼침). 컴퓨터 화면은 그대로.
(function(){
  if(!window.matchMedia || !matchMedia('(max-width:560px)').matches) return;
  var en = (document.documentElement.lang||'').indexOf('en')===0;
  var LIM = {what:900, video:1000, method:560};
  Object.keys(LIM).forEach(function(id){
    var s=document.getElementById(id); if(!s) return;
    var w=s.querySelector('.wrap')||s; var lim=LIM[id];
    if(w.scrollHeight < lim+300) return;
    var bg=getComputedStyle(s).backgroundColor; if(bg && bg!=='rgba(0, 0, 0, 0)') w.style.setProperty('--fold-bg',bg);
    var inner=document.createElement('div'); while(w.firstChild) inner.appendChild(w.firstChild); w.appendChild(inner);
    inner.className='zx-fold'; inner.style.maxHeight=lim+'px';
    var b=document.createElement('button'); b.type='button'; b.className='zx-fold-btn';
    b.textContent = en ? 'See more ▾' : '더 보기 ▾'; b.setAttribute('aria-expanded','false');
    b.addEventListener('click',function(){ inner.style.maxHeight='none'; inner.classList.remove('zx-fold'); b.remove(); });
    w.appendChild(b);
  });
})();
