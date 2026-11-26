// ---- Ride planner: pick rides, the day builds itself ----
const RTYPE={hagrid:'coaster',velo:'coaster',hulk:'coaster',rockit:'coaster',mummy:'coaster',stardust:'coaster',minecart:'coaster',doom:'thrill',
 jpra:'water',ripsaw:'water',barges:'water',
 cat:'kids',hippo:'kids',yoshi:'kids',carousel:'kids',rally:'kids',hiccup:'family',villain:'family',minion:'family',
 fj:'dark',spidey:'dark',kong:'dark',gringotts:'dark',trans:'dark',mib:'dark',simpsons:'dark',ff:'dark',hwexp:'dark',ministry:'dark',mario:'dark',monsters:'dark',werewolf:'thrill'};
const TNAME={coaster:'Coaster',thrill:'Thrill',water:'Water ride',kids:'Little ones',family:'Family',dark:'Dark ride'};
const TICON={
 coaster:'<path d="M2 18c3 0 4-10 8-10s3 7 6 7 3-5 6-5"/><path d="M5 18v3M10 9v12M16 15v6M21 11v10"/>',
 thrill:'<path d="M12 2v16"/><path d="M8 6h8M8 10h8"/><path d="M6 22h12"/><circle cx="12" cy="14" r="2"/>',
 water:'<path d="M2 15c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2 2 2 4 2"/><path d="M2 20c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2 2 2 4 2"/><path d="M6 12l6-8 6 8"/>',
 kids:'<circle cx="12" cy="6" r="3"/><path d="M5 22l2-8h10l2 8"/><path d="M12 9v5"/>',
 family:'<circle cx="8" cy="6" r="2.5"/><circle cx="16" cy="7" r="2"/><path d="M4 20c0-4 2-7 4-7s4 3 4 7M12 20c0-3 2-6 4-6s4 3 4 6"/>',
 dark:'<path d="M3 20h18"/><path d="M5 20V9l7-5 7 5v11"/><path d="M10 20v-5h4v5"/><circle cx="12" cy="10" r="1.5"/>'};
const ricon=(t,sz)=>`<svg viewBox="0 0 24 24" width="${sz||26}" height="${sz||26}" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${TICON[t]||TICON.dark}</svg>`;
const IICON={meal:'<path d="M7 3v8M4.5 3v5a2.5 2.5 0 0 0 5 0V3M7 11v10M17 21V3c-2.2 1-3.5 3.5-3.5 7v3H17"/>',hop:'<path d="M4 12h14M13 6l6 6-6 6"/>',activity:'<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>'};
function dayBest(r,di){const w=window4(di,r.park);if(!w)return null;const cr=ck(di);let b=null;for(let m=w[0];m<w[1];m+=15){const v=sim(r,di,m,cr);if(v.w!=null&&(!b||v.w<b.w))b={m,w:v.w}}return b}
function spark(r,di){const w=window4(di,r.park)||hours(r,di),cr=ck(di),pts=[];for(let m=w[0];m<w[1];m+=60)pts.push(sim(r,di,m,cr).w);const mx=Math.max(30,...pts.map(x=>x||0));
 return `<span class="spark" aria-hidden="true">${pts.map(x=>`<i style="height:${x==null?2:Math.max(8,x/mx*100)}%"></i>`).join('')}</span>`}
function viewQueues(){
 const di=S.day,m=S.clock,cr=ck(di),P=ps(di),pd=P.map(x=>x[0]);
 const p=S.qpark&&PARKS[S.qpark]?S.qpark:(parkAt(di,m)||pd[0]||'ioa');
 const must=S.must[di]||[];
 const q=S.q.trim().toLowerCase();
 let list=RIDES.filter(r=>r.park===p).sort((a,b)=>b.pop-a.pop);
 if(q)list=list.filter(r=>(r.name+' '+r.area+' '+SHORT[r.id]+' '+TNAME[RTYPE[r.id]]).toLowerCase().includes(q));
 if(!RID[S.sel]||RID[S.sel].park!==p)S.sel=list[0]?list[0].id:RIDES.find(r=>r.park===p).id;
 const its=items(di),rides=its.filter(i=>i.ride),left=rides.filter(i=>!i.done),tot=left.reduce((s,i)=>s+(wt(RID[i.ride],di,i.t)??0),0);
 const hm=n=>n>=60?Math.floor(n/60)+' h '+(n%60?n%60+' min':''):n+' min';
 const inDay=pd.includes(p);
 const cards=list.map(r=>{const t=RTYPE[r.id]||'dark',on=must.includes(r.id),b=inDay?dayBest(r,di):null,it=its.find(i=>i.ride===r.id);
  return `<div class="rcard${on?' on':''}">
   <button type="button" class="rart" style="--c:var(--${r.park})" data-a="rdet" data-id="${r.id}" aria-label="Wait pattern for ${esc(SHORT[r.id])}">${ricon(t,34)}<span>${TNAME[t]}</span></button>
   <div class="rbody"><b>${esc(SHORT[r.id])}</b><span class="mute">${esc(r.area)}</span>
    ${inDay?(b?`<span class="best">Best around <b>${fmt(b.m)}</b> · ~${b.w} min</span>`:'<span class="mute">Not open while you are here</span>'):`<span class="mute">Not in today's parks</span>`}
    ${inDay?spark(r,di):''}
    ${it?`<span class="inplan">In your day at ${fmt(it.t)}</span>`:''}</div>
   <button type="button" class="heart" data-a="mtog" data-id="${r.id}" aria-pressed="${on}" aria-label="${on?'Remove':'Add'} ${esc(SHORT[r.id])}">${on?'♥':'♡'}</button>
  </div>`}).join('')||'<div class="empty">No rides match.</div>';
 const r=RID[S.sel];
 const tl=its.length?its.map(i=>{const R=i.ride&&RID[i.ride],w=R?wt(R,di,i.t):null,t=R?(RTYPE[R.id]||'dark'):i.type;
  return `<div class="tli${i.done?' done':''}"><span class="tlt">${fmt(i.t)}</span><span class="tld" style="--c:var(--${R?R.park:'hotel'})">${R?ricon(t,18):`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IICON[i.type]||IICON.activity}</svg>`}</span><span class="tln"><b>${esc(i.title)}</b>${R?`<span class="mute">${esc(R.area)} · ~${w??'?'} min wait (est.)</span>`:''}</span><button type="button" class="ck" data-a="tick" data-id="${i.id}" aria-pressed="${!!i.done}" aria-label="Done">${i.done?'✓':''}</button></div>`}).join(''):`<div class="empty">Tap ♡ on the rides you want. Your day builds itself here, in the order with the least queuing.</div>`;
 return `<div class="hd"><div><h1>Ride planner</h1><p>${DAYS[di][1]} · ${esc(planText(di))} · ${CNAME[cr]} crowds · waits are historic estimates</p></div></div>
 <div class="seg rseg" role="group" aria-label="Park">${Object.entries(PARKS).map(([k,x])=>`<button type="button" class="${k===p?'on':''}" data-a="qpark" data-p="${k}"><span class="pdot" style="background:var(--${k})"></span>${x.short}${pd.includes(k)?'':' <small>not today</small>'}</button>`).join('')}</div>
 <div class="rgrid2">
  <section><h2 class="sh">1 · Pick your rides <small>${must.length} picked for this day</small></h2>
   <input id="q" type="search" placeholder="Search rides, areas or types" value="${esc(S.q)}" aria-label="Search rides" style="width:100%;margin:6px 0 10px">
   <div class="rlist">${cards}</div></section>
  <section id="yday"><h2 class="sh">2 · Your day <small>${left.length} rides to go · about ${hm(tot)} queuing (est.)</small></h2>
   <div class="card tl">${tl}
    <div class="addf"><button type="button" class="btn ghost" data-a="replan">Re-plan from here</button><a class="more" style="align-self:center" href="#planner">Add meals or change times ›</a></div>
    ${S.flash?`<p class="mute" style="font-size:13.5px;margin:8px 0 0">${esc(S.flash)}</p>`:''}</div>
   <div class="card" id="wpat" style="margin-top:14px"><h2>Typical waits: ${esc(SHORT[r.id])} <small>${PARKS[r.park].short}</small></h2>
    <div class="fig"><svg id="ch" role="img" aria-label="Typical wait across the day"></svg></div>
    <div class="row" style="flex-wrap:wrap;gap:8px"><span class="mute" style="font-size:13px">For ${cr==='extreme'?'an':'a'} ${CNAME[cr].toLowerCase()} day. Tap a ride's picture to see it here.</span><select id="crowd" aria-label="Crowd level">${Object.keys(CROWD).map(k=>`<option value="${k}">${CNAME[k]} crowds</option>`).join('')}</select></div></div>
  </section>
 </div>
 ${must.length?`<div class="pickbar"><span><b>${must.length} picked</b> · ${left.length} to go · ~${hm(tot)} queuing</span><button type="button" class="btn" data-a="seeday">My day</button></div>`:''}`;
}
document.addEventListener('click',e=>{const t=e.target.closest('[data-a]');if(!t)return;const a=t.dataset.a;
 if(a==='rdet'){S.sel=t.dataset.id;render();const w=$('#wpat');if(w)w.scrollIntoView({behavior:'smooth',block:'center'})}
 if(a==='seeday'){const y=$('#yday');if(y)y.scrollIntoView({behavior:'smooth',block:'start'})}
});
