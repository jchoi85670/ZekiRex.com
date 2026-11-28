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

// 페이지 안 행동 세기 — 2026-11-27 Rex 승인. 쿠키·주소·IP 없음, 개수만 (app.zekirex.com/demo/_sev 로 보냄).
//  · v=페이지 열림 · s25/s50/s75/s100=스크롤 깊이 · t10/t30/t60/t180=화면을 보고 있던 초
//  · c_app/c_demo=앱 가입·둘러보기 클릭 · c_nl=뉴스레터 칸으로 가는 클릭 · nl_sub=뉴스레터 구독 제출 · c_yt=유튜브 · c_sig=신호판
(function(){
  try{
    if(!/(^|\.)zekirex\.com$/i.test(location.hostname)) return;
    var path=location.pathname.replace(/\/index\.html$/,'/'), en=/^\/en\//.test(path);
    var name=(path.replace(/^\/en\//,'/').replace(/^\//,'').replace(/\.html$/,'').split('/')[0])||'home';
    var known={home:1,signals:1,guide:1,videos:1,about:1,live:1,plan:1,archive:1,welcome:1,scorecard:1,editions:1};
    var page=(en?'en_':'')+(known[name]?name:'other'), sent={};
    function send(e){
      if(sent[e]) return; sent[e]=1;
      var u='https://app.zekirex.com/demo/_sev?p='+encodeURIComponent(page)+'&e='+e;
      try{ fetch(u,{mode:'no-cors',keepalive:true,credentials:'omit'}); }catch(x){ try{ (new Image()).src=u; }catch(y){} }
    }
    send('v');
    var marks=[25,50,75,100];
    function onScroll(){
      var d=document.documentElement, h=Math.max(d.scrollHeight,document.body.scrollHeight)-window.innerHeight;
      var pct=h<=0?100:Math.round((window.scrollY||d.scrollTop)/h*100);
      for(var i=0;i<marks.length;i++){ if(pct>=marks[i]-2) send('s'+marks[i]); }
    }
    window.addEventListener('scroll',onScroll,{passive:true}); setTimeout(onScroll,1500);
    var secs=0, steps={10:'t10',30:'t30',60:'t60',180:'t180'};
    var timer=setInterval(function(){
      if(document.visibilityState!=='visible') return;
      secs++; if(steps[secs]) send(steps[secs]); if(secs>=180) clearInterval(timer);
    },1000);
    document.addEventListener('click',function(ev){
      var a=ev.target&&ev.target.closest?ev.target.closest('a'):null; if(!a) return;
      var h=a.getAttribute('href')||'';
      if(/app\.zekirex\.com\/demo/i.test(h)) send('c_demo');
      else if(/app\.zekirex\.com/i.test(h)) send('c_app');
      else if(/#subscribe|editions\.html/i.test(h)) send('c_nl');
      else if(/youtube\.com|youtu\.be/i.test(h)) send('c_yt');
      else if(/signals\.html/i.test(h)) send('c_sig');
    },true);
    document.addEventListener('submit',function(ev){
      var f=ev.target; if(f&&f.action&&/buttondown\.com/i.test(f.action)) send('nl_sub');
    },true);
  }catch(e){}
})();
