// ---- Phone app additions (PWA v1) ----
const TZ='America/New_York';
function orlandoNow(){
 const p=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date()).map(x=>[x.type,x.value]));
 return {date:`${p.year}-${p.month}-${p.day}`,min:(+p.hour)*60+(+p.minute)};
}
const tripIdx=d=>DAYS.findIndex(x=>x[0]===d);
const daysToTrip=()=>{const n=orlandoNow();return Math.round((Date.parse(DAYS[0][0])-Date.parse(n.date))/864e5)};
function liveState(){if(!S.live)return 'demo';const n=orlandoNow(),i=tripIdx(n.date);return i<0?(n.date<DAYS[0][0]?'before':'after'):'on'}
function syncLive(){
 if(liveState()!=='on')return false;
 const n=orlandoNow();
 if(S.follow!==false)S.day=tripIdx(n.date);
 S.clock=Math.max(420,Math.min(1380,n.min-n.min%5));
 return true;
}
let deferredInstall=null;
const isStandalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const isIOS=()=>/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
function viewMore(){
 const ls=liveState(),dt=daysToTrip();
 const live=S.live?(ls==='on'?`Following Orlando time. ${S.follow===false?'You picked a different day.':'Today is Day '+(S.day+1)+'.'}`:ls==='before'?`Real Orlando time starts on 28 Dec, ${dt} day${dt===1?'':'s'} away. Until then the app uses the demo clock below.`:'The trip has finished, so the app uses the demo clock.'):'The app uses the demo clock, so you can try any time of day.';
 const inst=isStandalone()?`<p class="mute" style="margin:0">Installed. You're using the app from your home screen.</p>`:
  `${deferredInstall?`<div class="addf" style="margin-top:0"><button type="button" class="btn" data-a="install">Install the app</button></div>`:''}
   <div class="sp"><span><b>iPhone</b></span><span>Open the link in Safari, tap Share, then Add to Home Screen.</span></div>
   <div class="sp"><span><b>Android</b></span><span>Open the link in Chrome, tap the ⋮ menu, then Install app.</span></div>`;
 return `<div class="hd"><div><h1>More</h1><p>Trip set-up, money and app settings.</p></div></div>
 <div class="mlinks">
  <a href="#calendar" class="card mlink"><b>Calendar</b><span>Park days, crowds and weather</span></a>
  <a href="#mustdos" class="card mlink"><b>Must-dos</b><span>Pick the rides you can't miss</span></a>
  <a href="#budget" class="card mlink"><b>Spend</b><span>Food and whole-trip budget</span></a>
  <a href="#settings" class="card mlink"><b>Settings</b><span>Trip, Express, alerts, currency</span></a>
 </div>
 <div class="grid2" style="margin-top:14px">
  <div class="card"><h2>Time</h2>
   <div class="alr"><label for="livet">Use real Orlando time</label><input id="livet" type="checkbox" data-f="live" ${S.live?'checked':''} style="width:22px;height:22px;flex:none"></div>
   <p class="mute" style="margin:8px 0">${live}</p>
   ${S.live&&ls==='on'&&S.follow===false?`<div class="addf" style="margin-top:0"><button type="button" class="btn ghost" data-a="backtoday">Back to today</button></div>`:''}
   ${ls==='on'?'':`<div class="dm"><div class="row" style="margin-bottom:6px"><label for="clockm">Demo time</label><b>${fmt(S.clock)}</b></div><input id="clockm" type="range" min="420" max="1380" step="5" value="${S.clock}"></div>`}
  </div>
  <div class="card"><h2>Add to your home screen</h2>${inst}
   <p class="mute" style="margin:8px 0 0;font-size:13.5px">It then opens full screen like any other app, and the plan works without signal.</p></div>
  <div class="card"><h2>Your data</h2>
   <p class="mute" style="margin:0 0 8px">Everything is saved on this phone only. To move it to another phone, copy it here and paste it there.</p>
   <div class="addf" style="margin-top:0"><button type="button" class="btn ghost" data-a="exp">Copy my data</button><button type="button" class="btn ghost" data-a="impshow">Paste data</button></div>
   <div id="impw" hidden style="margin-top:10px"><textarea id="impt" rows="4" style="width:100%;font:13px ui-monospace,monospace;border:1px solid var(--line);border-radius:8px;padding:8px;background:var(--bg);color:var(--ink)" placeholder="Paste the copied data here"></textarea><div class="addf"><button type="button" class="btn" data-a="imp">Load it</button></div></div>
   <p id="expmsg" class="mute" style="margin:8px 0 0;font-size:13.5px" aria-live="polite"></p>
   <div class="addf"><button type="button" class="btn ghost" data-a="reset">Reset to sample trip</button></div></div>
  <div class="card"><h2>About</h2><p class="mute" style="margin:0">First phone version. Waits are estimates from sample historic patterns, not live data. Restaurants, prices and spends are samples. Not affiliated with Universal.</p></div>
 </div>`;
}
document.addEventListener('click',async e=>{
 const t=e.target.closest('[data-a]');if(!t)return;const a=t.dataset.a;
 if(a==='install'&&deferredInstall){deferredInstall.prompt();try{await deferredInstall.userChoice}catch(x){}deferredInstall=null;render()}
 if(a==='backtoday'){S.follow=true;syncLive();render()}
 if(a==='exp'){const txt=JSON.stringify(S);let ok=false;try{await navigator.clipboard.writeText(txt);ok=true}catch(x){}
  const m=$('#expmsg');if(ok){m.textContent='Copied. Paste it into Paste data on the other phone.'}else{$('#impw').hidden=false;$('#impt').value=txt;$('#impt').select();m.textContent='Select all the text above and copy it.'}}
 if(a==='impshow'){$('#impw').hidden=false;$('#impt').value='';$('#impt').focus()}
 if(a==='imp'){try{const d=JSON.parse($('#impt').value);if(!d||!d.it||!d.set)throw 0;S=d;fill();render();const m=$('#expmsg');if(m)m.textContent='Loaded.'}catch(x){$('#expmsg').textContent="That doesn't look like data copied from this app."}}
});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;if(route()==='more')render()});
window.addEventListener('appinstalled',()=>{deferredInstall=null});
window.addEventListener('online',()=>{S.offline=false;syncQ();render()});
window.addEventListener('offline',()=>{S.offline=true;render()});
setInterval(()=>{if(S.live&&!document.hidden&&!document.querySelector('.modal.open')&&!(document.activeElement&&/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName))){const c=S.clock,d=S.day;if(syncLive()&&(c!==S.clock||d!==S.day))render()}},60000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&S.live&&syncLive())render()});
if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol)){window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}))}
