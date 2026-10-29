// 유입 경로 기록 — 구독할 때만 Buttondown 메타데이터에 함께 실린다. 쿠키 없음.
//  · ref   : ?ref=youtube 또는 ?utm_source=youtube 로 들어온 경우(우리 링크 꼬리표)
//  · from  : 처음 들어올 때 거쳐 온 바깥 사이트의 주소 이름만(예: www.youtube.com). 경로·검색어는 남기지 않는다.
//  · landing: 처음 도착한 zekirex.com 페이지 경로
// 30일 동안 이 브라우저에만 보관(localStorage). 저장이 막혀도 페이지는 그대로 동작한다.
// 2026-10-28 Rex 승인(구독 경로 파악) — 발행 총괄.
(function(){
  var KEY='zr_ref', FKEY='zr_from', DAY=864e5, ref=null, from=null;
  function clean(v,n){ return String(v||'').replace(/[^a-z0-9._-]/gi,'').slice(0,n||32); }
  function cpath(v){ return String(v||'/').replace(/[^a-z0-9._\/-]/gi,'').slice(0,64)||'/'; }
  try{ var q=new URLSearchParams(location.search); ref=q.get('ref')||q.get('utm_source'); }catch(e){}
  if(ref){ ref=clean(ref); try{ localStorage.setItem(KEY, JSON.stringify({r:ref,t:Date.now()})); }catch(e){} }
  else { try{ var s=JSON.parse(localStorage.getItem(KEY)||'null'); if(s && Date.now()-s.t < 30*DAY) ref=s.r; }catch(e){} }
  try{
    var f=JSON.parse(localStorage.getItem(FKEY)||'null');
    if(f && Date.now()-f.t < 30*DAY){ from=f; }
    else {
      var h=''; try{ h=document.referrer ? new URL(document.referrer).hostname : ''; }catch(e){}
      if(h && !/(^|\.)zekirex\.com$/i.test(h)){ from={h:clean(h,64),p:cpath(location.pathname),t:Date.now()}; }
      else if(!h && !f){ from={h:'direct',p:cpath(location.pathname),t:Date.now()}; }
      if(from) localStorage.setItem(FKEY, JSON.stringify(from));
    }
  }catch(e){}
  function add(form,name,val){
    if(!val || form.querySelector('input[name="'+name+'"]')) return;
    var i=document.createElement('input'); i.type='hidden'; i.name=name; i.value=val; form.appendChild(i);
  }
  function tag(){
    document.querySelectorAll('form[action*="buttondown.com"]').forEach(function(f){
      add(f,'metadata__ref',ref);
      if(from){ add(f,'metadata__from',from.h); add(f,'metadata__landing',from.p); }
    });
    if(ref) document.querySelectorAll('a[href^="/"]').forEach(function(a){
      var h=a.getAttribute('href'); if(h.indexOf('ref=')>-1) return;
      var p=h.split('#'); a.setAttribute('href', p[0]+(p[0].indexOf('?')>-1?'&':'?')+'ref='+ref+(p[1]!==undefined?'#'+p[1]:''));
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',tag); else tag();
})();
