// 유입 경로 기록: ?ref=youtube 로 들어온 방문자가 다른 쪽에서 구독해도
// Buttondown 메타데이터(ref)에 남도록 한다. 저장이 막혀도 페이지는 그대로 동작한다.
(function(){
  var KEY='zr_ref', ref=null;
  try{ ref=new URLSearchParams(location.search).get('ref'); }catch(e){}
  if(ref){ ref=ref.replace(/[^a-z0-9_-]/gi,'').slice(0,32);
    try{ localStorage.setItem(KEY, JSON.stringify({r:ref,t:Date.now()})); }catch(e){} }
  else { try{ var s=JSON.parse(localStorage.getItem(KEY)||'null');
    if(s && Date.now()-s.t < 30*864e5) ref=s.r; }catch(e){} }
  if(!ref) return;
  function tag(){
    document.querySelectorAll('form[action*="buttondown.com"]').forEach(function(f){
      if(f.querySelector('input[name="metadata__ref"]')) return;
      var i=document.createElement('input'); i.type='hidden'; i.name='metadata__ref'; i.value=ref; f.appendChild(i);
    });
    document.querySelectorAll('a[href^="/"]').forEach(function(a){
      var h=a.getAttribute('href'); if(h.indexOf('ref=')>-1) return;
      var p=h.split('#'); a.setAttribute('href', p[0]+(p[0].indexOf('?')>-1?'&':'?')+'ref='+ref+(p[1]!==undefined?'#'+p[1]:''));
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',tag); else tag();
})();
