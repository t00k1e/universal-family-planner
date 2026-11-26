{
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=m=>Math.floor(m/60)+':'+String(m%60).padStart(2,'0');
const usd=n=>'$'+Math.round(n).toLocaleString('en-US');
const uid=()=>Math.random().toString(36).slice(2,9);
const PARKS={usf:{name:'Universal Studios Florida',short:'Studios',open:480,close:1260},ioa:{name:'Islands of Adventure',short:'Islands',open:480,close:1260},epic:{name:'Epic Universe',short:'Epic',open:540,close:1260}};
const RIDES=[
 ['hagrid','ioa',"Hagrid's Magical Creatures Motorbike Adventure",'Hogsmeade',95,1],['velo','ioa','Jurassic World VelociCoaster','Jurassic Park',88],['fj','ioa','Harry Potter and the Forbidden Journey','Hogsmeade',65,1],['hulk','ioa','The Incredible Hulk Coaster','Marvel Super Hero Island',55],['spidey','ioa','The Amazing Adventures of Spider-Man','Marvel Super Hero Island',42],['kong','ioa','Skull Island: Reign of Kong','Skull Island',48],['jpra','ioa','Jurassic Park River Adventure','Jurassic Park',40],['doom',"ioa","Doctor Doom's Fearfall",'Marvel Super Hero Island',32],['hippo','ioa','Flight of the Hippogriff','Hogsmeade',38],['barges','ioa',"Popeye & Bluto's Bilge-Rat Barges",'Toon Lagoon',38],['ripsaw','ioa',"Dudley Do-Right's Ripsaw Falls",'Toon Lagoon',30],['cat','ioa','The Cat in the Hat','Seuss Landing',26],
 ['gringotts','usf','Harry Potter and the Escape from Gringotts','Diagon Alley',75,1],['mummy','usf','Revenge of the Mummy','New York',50],['rockit','usf','Hollywood Rip Ride Rockit','Production Central',52],['trans','usf','Transformers: The Ride-3D','Production Central',32],['minion','usf','Despicable Me Minion Mayhem','Minion Land',55],['villain','usf',"Illumination's Villain-Con Minion Blast",'Minion Land',38],['mib','usf','Men in Black Alien Attack','World Expo',35],['simpsons','usf','The Simpsons Ride','Springfield',40],['ff','usf','Fast & Furious: Supercharged','San Francisco',25],['hwexp','usf',"Hogwarts Express (King's Cross)",'London',35],
 ['ministry','epic','Harry Potter and the Battle at the Ministry','Ministry of Magic',100,1],['mario','epic',"Mario Kart: Bowser's Challenge",'Super Nintendo World',85],['minecart','epic','Mine-Cart Madness','Super Nintendo World',78],['stardust','epic','Stardust Racers','Celestial Park',72],['monsters','epic','Monsters Unchained: The Frankenstein Experiment','Dark Universe',68],['hiccup','epic',"Hiccup's Wing Gliders",'Isle of Berk',58],['yoshi','epic',"Yoshi's Adventure",'Super Nintendo World',40],['werewolf','epic','Curse of the Werewolf','Dark Universe',35],['rally','epic',"Dragon Racer's Rally",'Isle of Berk',32],['carousel','epic','Constellation Carousel','Celestial Park',15]
].map(([id,park,name,area,pop,ee])=>({id,park,name,area,pop,ee:!!ee}));
const RID=Object.fromEntries(RIDES.map(r=>[r.id,r]));
const SHORT={hagrid:"Hagrid's",velo:'VelociCoaster',fj:'Forbidden Journey',hulk:'Hulk Coaster',spidey:'Spider-Man',kong:'Skull Island',jpra:'River Adventure',doom:"Doctor Doom's",hippo:'Hippogriff',barges:'Bilge-Rat Barges',ripsaw:'Ripsaw Falls',cat:'Cat in the Hat',gringotts:'Gringotts',mummy:'Mummy',rockit:'Rip Ride Rockit',trans:'Transformers',minion:'Minion Mayhem',villain:'Villain-Con',mib:'Men in Black',simpsons:'Simpsons Ride',ff:'Fast & Furious',hwexp:'Hogwarts Express',ministry:'Battle at the Ministry',mario:'Mario Kart',minecart:'Mine-Cart Madness',stardust:'Stardust Racers',monsters:'Monsters Unchained',hiccup:'Wing Gliders',yoshi:"Yoshi's Adventure",werewolf:'Curse of the Werewolf',rally:"Dragon Racer's Rally",carousel:'Carousel'};
const CROWD={quiet:.62,moderate:1,busy:1.38,extreme:1.78};
const CNAME={quiet:'Quiet',moderate:'Moderate',busy:'Busy',extreme:'Extreme'};
const SAMPLE=[
 ['2026-12-28','Mon 28 Dec',[['usf',0]],'moderate','Arrival day, Studios after check-in'],
 ['2026-12-29','Tue 29 Dec',[['usf',0]],'busy',''],
 ['2026-12-30','Wed 30 Dec',[['ioa',0],['usf',795]],'extreme','Hop to Studios after lunch'],
 ['2026-12-31','Thu 31 Dec',[['epic',0]],'extreme',"New Year's Eve, late close (sample hours)"],
 ['2027-01-01','Fri 1 Jan',[],'moderate','Rest day at the resort'],
 ['2027-01-02','Sat 2 Jan',[['ioa',0]],'busy',''],
 ['2027-01-03','Sun 3 Jan',[['usf',0]],'moderate',''],
 ['2027-01-04','Mon 4 Jan',[['epic',0]],'moderate',''],
 ['2027-01-05','Tue 5 Jan',[['ioa',0]],'quiet',''],
 ['2027-01-06','Wed 6 Jan',[['epic',0]],'quiet',''],
 ['2027-01-07','Thu 7 Jan',[['usf',0],['ioa',780]],'quiet','Free choice, last park day'],
 ['2027-01-08','Fri 8 Jan',[],'moderate','Departure day']];
let DAYS=SAMPLE;
const BUDGET=[['Breakfast',75],['Lunch',125],['Dinner',200],['Snacks and drinks',75],['Treats and contingency',25]];
const NAV=[['g','On the day'],['today','Today'],['queues','Waits'],['planner','Plan'],['g','Before the trip'],['calendar','Calendar'],['mustdos','Must-dos'],['g','Money'],['dining','Eat'],['budget','Spend'],['g',''],['settings','Settings']];
const hs=s=>{let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
const rng=seed=>()=>{seed=(seed+0x6D2B79F5)|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const hours=(r,di)=>[PARKS[r.park].open-(r.ee&&S.set.epa!==false?60:0),PARKS[r.park].close+(late(di)?60:0)];
const OUT=new Set(['hagrid','velo','hulk','rockit','ripsaw','barges','jpra','hippo','doom','stardust','hiccup','minecart','rally','werewolf','carousel']);
const WET=new Set(['ripsaw','barges','jpra']);
const NOX=new Set(['hagrid','ministry']);
let WX=[];
// ---- Custom trip dates ----
const late=di=>!!DAYS[di]&&DAYS[di][0].slice(5)==='12-31';
const dLabel=iso=>new Date(iso+'T12:00:00Z').toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short',timeZone:'UTC'}).replace(/,/g,'');
const addDay=(iso,n)=>new Date(Date.parse(iso+'T12:00:00Z')+n*864e5).toISOString().slice(0,10);
const longDate=iso=>new Date(iso+'T12:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
function sampleCrowd(iso){const m=+iso.slice(5,7),d=+iso.slice(8,10),wd=new Date(iso+'T12:00:00Z').getUTCDay();
 if((m===12&&d>=26)||(m===1&&d<=1))return 'extreme';
 if((m===12&&d>=20)||(m===1&&d<=4)||m===7||(m===6&&d>=15)||(m===8&&d<=15)||(m===3&&d>=10)||(m===4&&d<=20))return wd===0||wd===6?'extreme':'busy';
 if(m===9||(m===1&&d>=6)||(m===2&&d<=10)||(m===11&&d<=15))return wd===6?'moderate':'quiet';
 return wd===0||wd===6?'busy':'moderate'}
function genDays(a,b){
 const n=Math.round((Date.parse(b)-Date.parse(a))/864e5)+1,rot=['usf','ioa','epic'],out=[];
 for(let i=0;i<n;i++){const iso=addDay(a,i),last=n>1&&i===n-1;
  out.push([iso,dLabel(iso),last?[]:[[rot[i%3],0]],sampleCrowd(iso),i===0?'Arrival day':last?'Departure day':''])}
 return out}
function applyTrip(){
 const t=S.trip;
 DAYS=t&&!(t.start===SAMPLE[0][0]&&t.end===SAMPLE[SAMPLE.length-1][0])?genDays(t.start,t.end):SAMPLE;
 if(!(S.day>=0&&S.day<DAYS.length))S.day=0;
 if(S.live==null)S.live=true;
 mkWX();
}
let tripMsg='',tripPending=null;
function tripCard(){
 const a=DAYS[0][0],b=DAYS[DAYS.length-1][0];
 return `<div class="trd"><label>First day<input type="date" id="tds" value="${tripPending?tripPending.start:a}"></label><label>Last day<input type="date" id="tde" value="${tripPending?tripPending.end:b}"></label></div>
 ${tripPending?`<div class="alert" style="margin:8px 0 0"><span>New dates start a fresh plan. Day plans, must-dos, park choices, Express days, typed waits and spends for ${longDate(a)} to ${longDate(b)} will be cleared. Budgets and settings stay.</span></div>
 <div class="addf"><button type="button" class="btn ghost" data-a="tripcancel">Cancel</button><button type="button" class="btn" data-a="tripok">Clear and use new dates</button></div>`:
 `<div class="addf"><button type="button" class="btn" data-a="tripset">Use these dates</button></div>`}
 <p class="mute" id="tripmsg" aria-live="polite" style="font-size:13.5px;margin:6px 0 0">${tripMsg||`${DAYS.length} days, ${longDate(a)} to ${longDate(b)}. Each park day starts with a suggested park you can change on Plan. Crowd levels and weather for new dates are rough samples.`}</p>`;
}
function useTrip(start,end){
 S.trip={start,end};S.it={};S.ex={};S.must={};S.pp={};S.crowd={};S.xp={};S.obs={};S.olog=[];S.day=0;S.follow=true;
 applyTrip();syncLive();tripPending=null;tripMsg=`Trip set: ${DAYS.length} days from ${longDate(start)}. Open Must-dos to pick rides, then Plan my day.`;render();fetchFC(true);
}
document.addEventListener('click',e=>{
 const t=e.target.closest('[data-a]');if(!t)return;const a=t.dataset.a;
 if(a==='tripset'){const s=$('#tds').value,en=$('#tde').value;tripMsg='';
  if(!s||!en){tripMsg='Pick both dates.';render();return}
  const n=Math.round((Date.parse(en)-Date.parse(s))/864e5)+1;
  if(n<1){tripMsg='The last day must be on or after the first day.';render();return}
  if(n>30){tripMsg='Trips can be up to 30 days.';render();return}
  if(s===DAYS[0][0]&&en===DAYS[DAYS.length-1][0]){tripMsg='Those are already your trip dates.';render();return}
  const has=Object.values(S.it).some(x=>x&&x.length)||Object.values(S.ex).some(x=>x&&x.length)||Object.values(S.must).some(x=>x&&x.length);
  if(has){tripPending={start:s,end:en};render()}else useTrip(s,en)}
 if(a==='tripcancel'){tripPending=null;tripMsg='';render()}
 if(a==='tripok'&&tripPending)useTrip(tripPending.start,tripPending.end);
});
// ---- Live Orlando forecast (Open-Meteo, free, no key) ----
const FC_URL='https://api.open-meteo.com/v1/forecast?latitude=28.4744&longitude=-81.4678&hourly=temperature_2m,precipitation_probability&timezone=America%2FNew_York&forecast_days=16';
const FC_DAYS=16;
function fcDay(iso){
 const f=S.fc&&S.fc.d&&S.fc.d[iso];if(!f)return null;
 const t=f.t.map(x=>x==null?null:Math.round(x)),p=f.p.map(x=>x==null?0:Math.round(x));
 const tv=t.filter(x=>x!=null);if(!tv.length)return null;
 const day=t.slice(7,22).filter(x=>x!=null);
 let best=null,run=null;
 for(let h=7;h<22;h++){if(p[h]>=40){if(!run)run=[h,h,p[h]];run[1]=h;run[2]=Math.max(run[2],p[h])}else run=null;if(run&&(!best||run[1]-run[0]>best[1]-best[0]))best=run.slice()}
 return{hi:Math.max(...(day.length?day:tv)),lo:Math.min(...tv),storm:best?[best[0]*60,(best[1]+1)*60,best[2]]:null,t,p}
}
const mkWX=()=>{WX=DAYS.map(d=>fcDay(d[0]))};
const fcWhen=()=>S.fc?new Date(S.fc.at).toLocaleString('en-GB',{weekday:'short',hour:'2-digit',minute:'2-digit'}):'';
function noFcText(di){
 const iso=DAYS[di][0],today=orlandoNow().date;
 if(iso<today)return 'No forecast was saved for this day.';
 const from=addDay(iso,-(FC_DAYS-1));
 if(from<=today&&fcFail)return `Couldn't load the forecast. The preview link can't reach outside services, so live weather works once the app is online at its own address. If it already is, it will try again shortly.`;
 return navigator.onLine===false&&!S.fc?'No forecast saved yet. It loads when you have signal.':
  from>today?`No forecast yet. Orlando forecasts reach ${FC_DAYS} days ahead, so this day's appears from ${longDate(from)}.`:'Forecast not loaded yet. It updates when you have signal.';
}
let fcBusy=false,fcFail=false;
async function fetchFC(force){
 if(fcBusy||navigator.onLine===false)return;
 if(!force&&!fcFail&&S.fc&&Date.now()-S.fc.at<3*3600e3)return;
 fcBusy=true;
 try{
  const r=await fetch(FC_URL,{cache:'no-store'});if(!r.ok)throw new Error(r.status);
  const j=await r.json(),h=j.hourly,d={};
  h.time.forEach((ts,k)=>{const iso=ts.slice(0,10),hr=+ts.slice(11,13);const x=d[iso]||(d[iso]={t:Array(24).fill(null),p:Array(24).fill(null)});x.t[hr]=h.temperature_2m[k];x.p[hr]=h.precipitation_probability[k]});
  const first=Object.keys(d).sort()[0],old=(S.fc&&S.fc.d)||{};
  // keep earlier trip days from the last download so past days still show what was forecast
  const tripDates=new Set(DAYS.map(x=>x[0]));
  for(const k in old)if(k<first&&tripDates.has(k))d[k]=old[k];
  S.fc={at:Date.now(),d};fcFail=false;mkWX();render();
 }catch(e){const was=fcFail;fcFail=true;if(!was)render()}
 finally{fcBusy=false}
}
window.addEventListener('online',()=>fetchFC(true));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)fetchFC()});
setInterval(()=>fetchFC(),5*60e3);
setTimeout(()=>fetchFC(),0);

const rainAt=(di,m)=>{const w=WX[di];return w?w.p[Math.max(0,Math.min(23,Math.floor(m/60)))]:0};
const tempAt=(di,m)=>{const w=WX[di];if(!w)return null;const h=Math.max(0,Math.min(23,Math.floor(m/60)));return w.t[h]!=null?w.t[h]:w.hi};
const XPN={none:'No Express',once:'Express (once per ride)',unl:'Express Unlimited'};
const xpOn=di=>(S.xp&&S.xp[di])||'none';
function wt(r,di,t){const v=sim(r,di,t,ck(di));if(v.w==null)return null;return xpOn(di)!=='none'&&!NOX.has(r.id)?Math.max(5,Math.round(v.w*.25/5)*5):v.w}
function wxPen(r,di,t){if(S.set.wx===false||!WX[di])return 0;let p=0;if(OUT.has(r.id)&&rainAt(di,t)>=40)p+=60;if(WET.has(r.id)&&tempAt(di,t)<20)p+=40;return p}
function wxStrip(di){if(!WX[di])return `<div class="wx"><p class="mute" style="margin:0;font-size:14px">${noFcText(di)}</p></div>`;const cells=[];for(let m=420;m<1320;m+=60){const r=rainAt(di,m);cells.push(`<span class="wxc" title="${fmt(m)}: ${r}% chance of rain, ${tempAt(di,m)}°C"><b>${(m-420)%180===0?fmt(m):''}</b><i style="height:${Math.max(4,r*.6)}px;opacity:${.25+r/130}"></i><em>${r>=30?r+'%':tempAt(di,m)+'°'}</em></span>`)}const w=WX[di];return `<div class="wx"><div class="row" style="font-size:14px"><span><b>${w.hi}°C</b> / ${w.lo}°C · ${w.storm?'showers '+fmt(w.storm[0])+'–'+fmt(w.storm[1])+', '+w.storm[2]+'% chance':'mostly dry'}${w.hi<20?' · cool day, water rides not advised':''}</span><span class="mute">Open-Meteo forecast${S.fc?', '+fcWhen():''}${navigator.onLine===false?' (saved)':''}</span></div><div class="wxs">${cells.join('')}</div></div>`}
function down(r,di){const o=S.obs&&S.obs[di];if(!o)return null;const x=o.rd[r.id];return x&&x.closed?[o.at,o.at+45]:null}
function sim(r,di,m,ck,raw){
 const[o,c]=hours(r,di);
 if(m<o||m>=c)return{w:null,s:'Closed'};
 const dn=raw?null:down(r,di);
 if(dn&&m>=dn[0]&&m<dn[1])return{w:null,s:'Reported closed',dn};
 const R=rng(hs(r.id));const ph=R()*6.28;
 const x=(m-o)/(c-o);
 const sh=.3+.7*Math.exp(-(((x-.45)/.3)**2))+.1*Math.exp(-(((x-.88)/.07)**2));
 const ramp=r.pop>=70?1:.4+.6*Math.min(1,(m-o)/40);
 const nz=1+.05*Math.sin(m/53+ph);
 const tail=.5+.5*Math.min(1,(c-m)/45);
 let w=r.pop*CROWD[ck]*sh*ramp*nz*tail;
 const ob=raw?null:S.obs&&S.obs[di];
 if(ob&&m>=ob.at)w*=1+(ob.f-1)*Math.max(0,1-(m-ob.at)/120);
 return{w:Math.max(5,Math.round(w/5)*5),s:'Open'};
}
function seed(){
 const I=(t,type,title,ride,done)=>({id:uid(),t,type,title,ride:ride||null,done:!!done});
 const E=(cat,where,amt,t)=>({id:uid(),cat,where,amt,t});
 return{day:2,clock:640,crowd:{},qpark:null,sel:'velo',q:'',sort:'short',mf:false,
  it:{
   1:[I(510,'meal','Breakfast at Dockside food court'),I(560,'ride','Escape from Gringotts','gringotts'),I(620,'ride','Revenge of the Mummy','mummy'),I(720,'meal','Lunch at Leaky Cauldron'),I(840,'ride','Minion Mayhem','minion'),I(1110,'meal','Dinner at CityWalk')],
   2:[I(420,'ride',"Early entry: Hagrid's",'hagrid',1),I(490,'meal','Breakfast at Croissant Moon',null,1),I(540,'ride','Hulk Coaster','hulk',1),I(585,'ride','Spider-Man','spidey',1),I(675,'ride','VelociCoaster','velo'),I(750,'meal','Lunch at Mythos'),I(795,'hop','Walk to Studios via CityWalk (~15 min est.)'),I(870,'ride','Escape from Gringotts','gringotts'),I(960,'ride','Revenge of the Mummy','mummy'),I(1110,'meal','Dinner at Leaky Cauldron')],
   3:[I(480,'ride','Rope drop: Battle at the Ministry','ministry'),I(600,'ride','Mario Kart','mario'),I(1080,'activity','New Year countdown plans')]},
  ex:{
   0:[E('Lunch','Airport',96,690),E('Dinner','Louie’s Italian',168,1140),E('Snacks and drinks','Butterbeer x4',36,1230),E('Breakfast','Hotel food court',58,540)],
   1:[E('Breakfast','Dockside food court',64,500),E('Lunch','Leaky Cauldron',118,735),E('Snacks and drinks','Churros and drinks',42,900),E('Dinner','Bigfire',236,1125),E('Treats and contingency','Chocolate frogs',32,1200)],
   2:[E('Breakfast','Croissant Moon',62,495),E('Snacks and drinks','Butterbeer x2',10,605)]}};
}
let S;
try{S=JSON.parse(localStorage.getItem('fhp-app-1'))}catch(e){S=null}
if(!S||typeof S!=='object'||!S.it)S=seed();
function fill(){if(!S.extra){S.extra={Souvenirs:600,Extras:400};const E=(d,cat,where,amt,t)=>(S.ex[d]||(S.ex[d]=[])).push({id:uid(),cat,where,amt,t});E(1,'Souvenirs','Wands x2 (Diagon Alley)',140,780);E(1,'Extras','Lockers',20,600);E(2,'Extras','Ride photo package',70,560);E(0,'Extras','Taxi from airport',85,720)}
const D={daily:500,alloc:Object.fromEntries(BUDGET),must:{1:['gringotts','mummy','rockit'],2:['velo','hagrid','gringotts','mummy'],3:['ministry','mario','stardust','monsters'],5:['velo','hagrid','fj']},pp:{},obs:{},cmp:null,df:{park:'all',type:'all',meal:'',max:0},set:{cur:false,rate:0.79},crowd:{},ex:{},it:{},q:'',sort:'short',day:0,clock:600,olog:[]};for(const k in D)if(S[k]==null)S[k]=JSON.parse(JSON.stringify(D[k]))}
fill();
applyTrip();

if(navigator.onLine===false)S.offline=true;
const save=()=>{try{localStorage.setItem('fhp-app-1',JSON.stringify(S))}catch(e){}};
const ck=di=>S.crowd[di]||DAYS[di][3];
const ps=di=>S.pp[di]||DAYS[di][2];
function parkAt(di,m){const P=ps(di);if(!P.length)return null;let p=P[0][0];for(const[k,f]of P)if(m>=f)p=k;return p}
const planText=di=>ps(di).map(([p,f],i)=>PARKS[p].short+(i?' from '+fmt(f):'')).join(', then ')||(DAYS[di][4]||'No park');
const items=di=>(S.it[di]||(S.it[di]=[])).slice().sort((a,b)=>a.t-b.t);
const spends=di=>(S.ex[di]||(S.ex[di]=[])).slice().sort((a,b)=>b.t-a.t);
const spent=di=>(S.ex[di]||[]).filter(e=>e.cat in S.alloc).reduce((s,e)=>s+e.amt,0);
const syncQ=()=>Object.values(S.ex).flat().forEach(e=>{delete e.q});
const allCats=()=>Object.keys(S.alloc).concat(Object.keys(S.extra));
function best(r,di,from){const[o,c]=hours(r,di);let b=null;for(let m=Math.max(from,o);m<c-30;m+=5){const v=sim(r,di,m,ck(di));if(v.w!=null&&(!b||v.w<b.w))b={m,w:v.w}}return b}
function bestFor(r,di,from){const w=window4(di,r.park);return w?bestIn(r,di,Math.max(from,w[0]),w[1]):best(r,di,from)}
function peak(r,di){const[o,c]=hours(r,di);let b=null;for(let m=o;m<c;m+=5){const v=sim(r,di,m,ck(di));if(v.w!=null&&(!b||v.w>b.w))b={m,w:v.w}}return b}
const pct=(a,b)=>Math.max(0,Math.min(100,a/b*100));
let ro=null;

function viewToday(){
 const di=S.day,m=S.clock,cr=ck(di),p=parkAt(di,m),its=items(di),ob=S.obs[di],w=WX[di];
 const alerts=[];
 if(w&&w.storm&&m<w.storm[1]&&ps(di).length){const hit=its.filter(i=>!i.done&&i.ride&&OUT.has(i.ride)&&i.t>=w.storm[0]-30&&i.t<w.storm[1]);alerts.push(['',`Showers likely ${fmt(w.storm[0])}–${fmt(w.storm[1])}`,`<b>Showers likely ${fmt(w.storm[0])}–${fmt(w.storm[1])} (${w.storm[2]}%).</b> ${hit.length?hit.map(i=>esc(i.title)).join(', ')+(hit.length>1?' are outdoor rides':' is an outdoor ride')+' in that window; Plan my day or Re-plan will move outdoor rides out of it.':'No outdoor rides are planned in that window.'} Outdoor rides close when there is lightning nearby.`])}
 if(ob){Object.entries(ob.rd).filter(([k,x])=>x.closed).forEach(([k])=>alerts.push(['',`${SHORT[k]} reported closed`,`<b>${esc(SHORT[k])} reported closed</b> at ${fmt(ob.at)}. Check the Universal app again around ${fmt(ob.at+45)}.`]));
  alerts.push(['',`Re-planned at ${fmt(ob.at)}`,`<b>Re-planned at ${fmt(ob.at)}.</b> Your typed waits ran ×${ob.f.toFixed(2)} of the estimate; the rest of today is adjusted. <button type="button" class="btn ghost" style="min-height:32px;padding:3px 10px" data-a="clearobs">Clear</button>`])}
 const sp=spent(di),left=S.daily-sp;
 Object.entries(S.alloc).forEach(([c,a])=>{const u=(S.ex[di]||[]).filter(e=>e.cat===c).reduce((s,e)=>s+e.amt,0);if(u>a)alerts.push(['bad',`${c} over budget`,`<b>${esc(c)} over by ${usd(u-a)}</b> today. ${usd(Math.max(0,left))} left for the rest of the day.`])});
 let tot=0;for(let d=0;d<=di;d++)tot+=spent(d);
 const pace=S.daily*(di+1)-tot;
 const nx=its.find(i=>!i.done),up=its.filter(i=>!i.done&&i!==nx).slice(0,3);
 let nxh='<div class="empty">Everything ticked off for today.</div>';
 if(nx){const r=nx.ride&&RID[nx.ride];let extra='';
  if(r){const v=sim(r,di,m,cr),ww=wt(r,di,m),b=bestFor(r,di,m);extra=`<div class="row" style="align-items:flex-end;margin-top:4px"><span class="mute"><span class="pdot" style="background:var(--${r.park})"></span>${esc(r.area)} · ${PARKS[r.park].short}${xpOn(di)!=='none'&&!NOX.has(r.id)?' · Express':''}<br>${b&&b.m>m&&v.w!=null&&b.w<v.w?'Best later: '+fmt(b.m)+', ~'+b.w+' min':b&&v.w!=null?'Won’t get shorter while you’re in '+PARKS[r.park].short:''}</span><span style="text-align:right"><span class="nxw">${v.w!=null?ww+'m':'<span style="font-size:20px">'+esc(v.s)+'</span>'}</span>${v.w!=null?'<br><span class="tag est" title="historic estimate">EST</span>':''}</span></div><div class="mute" style="font-size:13.5px;margin-top:6px">Historic estimate. Check the Universal app for the live wait, then Re-plan if it's way off.</div>`}
  nxh=`<div class="mute">Next up · ${fmt(nx.t)}</div><div class="nxbig">${esc(nx.title)}</div>${extra}<div class="addf"><button type="button" class="btn" data-a="tick" data-id="${nx.id}">Done</button><a class="more" style="align-self:center" href="#planner">Full plan ›</a></div>`}
 const sh=p?RIDES.filter(r=>r.park===p).map(r=>({r,w:wt(r,di,m)})).filter(x=>x.w!=null).sort((a,b)=>a.w-b.w).slice(0,4):[];
 const mx=Math.max(60,...sh.map(x=>x.w));
 const head=`<div class="hd"><div><h1>${DAYS[di][1]}</h1><p>Day ${di+1} of ${DAYS.length} · ${esc(planText(di))} · ${CNAME[cr]} crowds · ${w?w.hi+'°C'+(w.storm?', showers '+fmt(w.storm[0])+'–'+fmt(w.storm[1]):', dry'):'no forecast yet'} · waits are historic estimates</p></div><span class="addf" style="margin:0"><button class="btn ghost" type="button" data-a="replan">Re-plan from here</button><button class="btn" type="button" data-a="spend">+ Log spend</button></span></div>`;
 const bad=alerts.some(a=>a[0]==='bad');
 const al=alerts.length?`<div style="margin-bottom:16px"><button type="button" class="alsum" data-a="alx" aria-expanded="${!!S.alx}" style="${bad?'border-color:var(--acc);background:var(--accbg)':''}"><span><b style="${bad?'color:var(--acc)':''}">${alerts.length} alert${alerts.length>1?'s':''}</b> · ${esc(alerts.map(a=>a[1]).join(' · '))}</span><span>${S.alx?'Hide':'Show'}</span></button>${S.alx?`<div class="alerts" style="margin:8px 0 0">${alerts.map(a=>`<div class="alert ${a[0]}"><span>${a[2]}</span></div>`).join('')}</div>`:''}</div>`:'';
 return head+al+`<div class="today2">
  <div class="card" style="padding:20px 22px">${nxh}
   ${up.length?`<div style="margin-top:16px"><div class="mute" style="font-size:13.5px;margin-bottom:2px">Then</div>${up.map(i=>`<div class="sp"><span><b class="nw">${fmt(i.t)}</b> ${esc(i.title)}</span></div>`).join('')}</div>`:''}</div>
  <div style="display:grid;gap:16px">
   <div class="card"><h2>Food today <a class="more" href="#budget" style="font:600 14px Inter,sans-serif">Spend ›</a></h2>
    <div class="row"><span class="fig1 ${left<0?'up':''}">${left<0?usd(-left)+' over':usd(left)+' left'}</span><span class="mute nw">of ${usd(S.daily)}</span></div>
    <div class="meter" style="margin-top:8px;height:9px"><i class="${left<0?'over':''}" style="width:${pct(sp,S.daily)}%"></i></div>
    <div class="row mute" style="margin-top:8px;font-size:14px"><span>Trip ${usd(tot)} of ${usd(S.daily*DAYS.length)}</span><span class="nw ${pace<0?'up':'ok'}">${usd(Math.abs(pace))} ${pace<0?'over':'under'} pace</span></div></div>
   <div class="card"><h2>Shortest now <a class="more" href="#queues" style="font:600 14px Inter,sans-serif">All waits ›</a></h2>
    ${sh.length?sh.map(({r,w})=>`<button type="button" class="wl" data-a="go" data-id="${r.id}"><span class="wn">${esc(SHORT[r.id])}</span><span class="wv">${w}m</span><span class="meter"><i style="width:${pct(w,mx)}%;background:var(--${r.park})"></i></span></button>`).join(''):`<div class="empty">${p?'Park is closed at this time.':'Rest day.'}</div>`}</div>
  </div>
 </div>`;
}

function viewQueues(){
 const di=S.day,m=S.clock,cr=ck(di),ob=S.obs[di];
 const p=S.qpark||parkAt(di,m)||ps(di)[0]?.[0]||'ioa';
 const must=S.must[di]||[];
 let rows=RIDES.filter(r=>r.park===p).map(r=>({r,v:sim(r,di,m,cr),b:bestFor(r,di,m),y:ob&&ob.rd[r.id]}));
 const all=rows.slice();
 const q=S.q.trim().toLowerCase();
 if(q)rows=rows.filter(x=>(x.r.name+' '+x.r.area+' '+SHORT[x.r.id]).toLowerCase().includes(q));
 if(S.mf)rows=rows.filter(x=>must.includes(x.r.id));
 const W=x=>x.v.w==null?1e4:x.v.w;
 rows.sort(S.sort==='short'?(a,b)=>W(a)-W(b):S.sort==='long'?(a,b)=>(b.v.w??-1)-(a.v.w??-1):(a,b)=>a.r.name.localeCompare(b.r.name));
 const open=all.filter(x=>x.v.w!=null);
 const avg=open.length?Math.round(open.reduce((s,x)=>s+x.v.w,0)/open.length):0;
 const sh=open.slice().sort((a,b)=>a.v.w-b.v.w)[0];
 if(!RID[S.sel]||RID[S.sel].park!==p)S.sel=(rows[0]||all[0]).r.id;
 const r=RID[S.sel],v=sim(r,di,m,cr),b=bestFor(r,di,m),pk=peak(r,di),inPlan=items(di).find(i=>i.ride===r.id),y=ob&&ob.rd[r.id];
 const mx=Math.max(60,...open.map(x=>x.v.w));
 return `<div class="hd"><div><h1>Waits</h1><p>${PARKS[p].name} · ${DAYS[di][1]} at ${fmt(m)} · typical waits from historic patterns</p></div>
  <div class="seg" role="group" aria-label="Park">${Object.entries(PARKS).map(([k,x])=>`<button type="button" class="${k===p?'on':''}" data-a="qpark" data-p="${k}"><span class="pdot" style="background:var(--${k})"></span>${x.short}</button>`).join('')}</div></div>
 <div class="info" style="margin-bottom:14px"><span><b>Estimates, not live waits.</b> In the park, check the official Universal app, then use Re-plan from here to correct today's plan.</span><button type="button" class="btn" style="min-height:34px;padding:4px 12px" data-a="replan">Re-plan from here</button></div>
 <div class="tool"><input id="q" type="search" placeholder="Search rides or areas" value="${esc(S.q)}" aria-label="Search rides">
  <select id="sort" aria-label="Sort"><option value="short">Shortest first</option><option value="long">Longest first</option><option value="name">A to Z</option></select>
  <label class="nw" style="display:flex;gap:6px;align-items:center"><input id="mf" type="checkbox" ${S.mf?'checked':''} style="width:20px;height:20px"> Must-dos only</label>
  <label class="mute nw" for="crowd">Crowd level</label><select id="crowd">${Object.keys(CROWD).map(k=>`<option value="${k}">${CNAME[k]} ×${CROWD[k]}</option>`).join('')}</select></div>
 <div class="sum"><div><b>${avg?avg+'m':'·'}</b><span>typical wait now</span></div><div><b>${sh?sh.v.w+'m':'·'}</b><span>shortest${sh?': '+esc(SHORT[sh.r.id]):''}</span></div><div><b>${CNAME[cr]}</b><span>crowd level ×${CROWD[cr]}</span></div><div><b>${ob?'×'+ob.f.toFixed(2):'none'}</b><span>${ob?'your correction from '+fmt(ob.at):'waits typed today'}</span></div></div>
 <div class="grid2">
  <div class="card" style="padding:6px 8px"><div class="scroll"><table><thead><tr><th>Ride</th><th class="n">Est. now</th><th class="n">Best later</th><th class="n">You typed</th></tr></thead><tbody>
   ${rows.map(x=>`<tr tabindex="0" data-a="sel" data-id="${x.r.id}" class="${x.r.id===S.sel?'sel':''}"><td><b>${esc(SHORT[x.r.id])}</b>${must.includes(x.r.id)?' <span class="ty">must-do</span>':''}<div class="mute" style="font-size:12.5px">${esc(x.r.area)}</div>${x.v.w!=null?`<div class="meter" style="margin-top:4px;height:4px"><i style="width:${pct(x.v.w,mx)}%"></i></div>`:''}</td><td class="n"><span class="wv">${x.v.w!=null?x.v.w+'m':''}</span>${x.v.w==null?`<span class="st ${x.v.s==='Reported closed'?'c':''}">${esc(x.v.s)}</span>`:''}</td><td class="n">${x.b?fmt(x.b.m)+' <span class="mute">'+x.b.w+'m</span>':'·'}</td><td class="n">${x.y?(x.y.closed?'<span class="tag you">closed</span>':'<span class="tag you">'+x.y.w+'m</span>'):''}</td></tr>`).join('')||'<tr><td colspan="4"><div class="empty">No rides match.</div></td></tr>'}
  </tbody></table></div></div>
  <div class="card"><h2>${esc(r.name)} </h2>
   <div class="mute">${esc(r.area)} · ${PARKS[r.park].short}${r.ee?' · early entry for hotel guests (sample)':''}</div>
   <div class="stats"><div><b>${v.w!=null?v.w+' min':esc(v.s)}</b><span>estimate at ${fmt(m)}</span></div><div><b>${b?fmt(b.m):'·'}</b><span>${b?'best later, ~'+b.w+' min':window4(di,r.park)?'no time left in this park today':'no time left today'}</span></div><div><b>${pk?pk.w+' min':'·'}</b><span>${pk?'typical peak '+fmt(pk.m):'closed'}</span></div><div><b>${y?(y.closed?'Closed':y.w+' min'):'·'}</b><span>${y?'you typed at '+fmt(ob.at):'nothing typed'}</span></div></div>
   <div class="fig"><svg id="ch" role="img" aria-label="Typical wait across the day"></svg></div>
   <p class="mute" style="font-size:13px;margin:0 0 10px">Line: typical wait for ${cr==='extreme'?'an':'a'} ${CNAME[cr].toLowerCase()} day${ob?'. Dashed: before your correction. Dot: the wait you typed':''}. Ride breakdowns aren't predicted; report them in Re-plan.</p>
   <div class="row" style="flex-wrap:wrap;justify-content:flex-start;gap:10px"><button type="button" class="btn ghost" data-a="mtog" data-id="${r.id}">${must.includes(r.id)?'Remove from must-dos':'Add to must-dos'}</button>${b?`<button type="button" class="btn" data-a="addbest" data-id="${r.id}" data-m="${b.m}">Add to plan at ${fmt(b.m)}</button>`:''}<span class="mute">${inPlan?'In this day’s plan at '+fmt(inPlan.t)+'.':'Not in this day’s plan.'}</span></div>
  </div>
 </div>${readingsCard(di)}`;
}
const med=a=>{if(!a.length)return null;const b=a.slice().sort((x,y)=>x-y);return b[Math.floor((b.length-1)/2)]};
function accuracy(L){const rs=L.filter(o=>!o.closed&&o.est&&o.w!=null).map(o=>Math.max(5,o.w)/o.est);return{n:L.length,m:med(rs),k:rs.length}}
function readingsCard(di){
 const all=S.olog||[],L=all.filter(o=>o.d===di).sort((a,b)=>b.at-a.at),T=accuracy(all);
 if(!all.length)return `<div class="card" style="margin-top:16px"><h2>Your readings <small>typed in Re-plan</small></h2><div class="empty">No waits typed yet. Each wait you type in Re-plan from here is kept here, so you can see how close the estimates were.</div></div>`;
 return `<div class="card" style="margin-top:16px"><h2>Your readings <small>${DAYS[di][1]} · ${L.length} typed</small></h2>
  ${L.length?`<div class="scroll"><table><thead><tr><th>Time</th><th>Ride</th><th class="n">You</th><th class="n">Est.</th><th class="n">Ratio</th><th></th></tr></thead><tbody>${L.map(o=>`<tr style="cursor:default"><td class="nw">${fmt(o.at)}</td><td>${esc(SHORT[o.ride]||o.ride)}</td><td class="n">${o.closed?'<span class="tag you">closed</span>':'<span class="tag you">'+o.w+'m</span>'}</td><td class="n mute">${o.est!=null?o.est+'m':'·'}</td><td class="n">${!o.closed&&o.est?'×'+(Math.max(5,o.w)/o.est).toFixed(2):'·'}</td><td><button type="button" class="x" data-a="delobs" data-id="${o.id}" aria-label="Delete reading">✕</button></td></tr>`).join('')}</tbody></table></div>`:'<div class="mute">Nothing typed for this day yet.</div>'}
  <p class="mute" style="font-size:13px;margin:10px 0 0">Whole trip: ${T.n} reading${T.n===1?'':'s'}${T.m!=null?`, typed waits ran <b style="color:var(--ink)">×${T.m.toFixed(2)}</b> of the historic estimate (median of ${T.k})${T.m>1.1?', so the profiles run low':T.m<.9?', so the profiles run high':', so the profiles are close'}`:''}. Kept on this phone and included in Copy my data.</p></div>`;
}

function drawChart(){
 const s=$('#ch');if(!s)return;
 const W=s.clientWidth,H=s.clientHeight;if(!W||!H)return;
 const r=RID[S.sel],di=S.day,cr=ck(di),[o,c]=hours(r,di),ob=S.obs[di];
 const pts=[],raw=[];for(let m=o;m<c;m+=5){pts.push([m,sim(r,di,m,cr).w]);raw.push([m,sim(r,di,m,cr,true).w])}
 const y=ob&&ob.rd[r.id];
 const mxw=Math.max(...pts.map(p=>p[1]||0),...raw.map(p=>p[1]||0),y&&!y.closed?y.w:0,10);const st=mxw>150?60:30;const top=Math.ceil(mxw/st)*st;
 const M={l:40,r:14,t:22,b:26};
 const X=m=>M.l+(m-o)/(c-o)*(W-M.l-M.r),Y=w=>M.t+(1-w/top)*(H-M.t-M.b);
 let g='';
 for(let w=0;w<=top;w+=st)g+=`<line x1="${M.l}" x2="${W-M.r}" y1="${Y(w)}" y2="${Y(w)}" stroke="currentColor" opacity=".12"/><text x="${M.l-6}" y="${Y(w)+4}" text-anchor="end">${w}</text>`;
 const step=W<520?180:120;
 for(let m=Math.ceil(o/60)*60;m<=c;m+=step)g+=`<text x="${X(m)}" y="${H-6}" text-anchor="middle">${fmt(m)}</text>`;
 const dn=down(r,di);
 if(dn)g+=`<rect x="${X(dn[0])}" y="${M.t}" width="${Math.max(0,Math.min(X(c),X(dn[1]))-X(dn[0]))}" height="${H-M.t-M.b}" fill="var(--ambl)" opacity=".25"/><text x="${(X(dn[0])+Math.min(X(c),X(dn[1])))/2}" y="${M.t+14}" text-anchor="middle" class="k">reported closed</text>`;
 const path=(P,f)=>{let d='',pen=false;for(const[m,w]of P){if(w==null||!f(m)){pen=false;continue}d+=(pen?'L':'M')+X(m).toFixed(1)+' '+Y(w).toFixed(1);pen=true}return d};
 let a='',seg=[];const flush=()=>{if(seg.length>1)a+=`M${X(seg[0][0])} ${Y(0)}`+seg.map(p=>`L${X(p[0])} ${Y(p[1])}`).join('')+`L${X(seg[seg.length-1][0])} ${Y(0)}Z`;seg=[]};for(const p of pts){if(p[1]==null)flush();else seg.push(p)}flush();
 g+=`<path d="${a}" fill="var(--sea2)" opacity=".12"/>`;
 if(ob)g+=`<path d="${path(raw,m=>m>=ob.at)}" fill="none" stroke="var(--mute)" stroke-width="2" stroke-dasharray="5 5"/>`;
 g+=`<path d="${path(pts,()=>true)}" fill="none" stroke="var(--sea2)" stroke-width="2.5"/>`;
 const now=S.clock,b=bestFor(r,di,now);
 if(b)g+=`<circle cx="${X(b.m)}" cy="${Y(b.w)}" r="5" fill="var(--bg)" stroke="var(--ink)" stroke-width="2"/><text x="${Math.min(W-M.r-40,Math.max(M.l+40,X(b.m)))}" y="${Y(b.w)-12}" text-anchor="middle" class="k">best ${fmt(b.m)}</text>`;
 if(now>=o&&now<=c)g+=`<line x1="${X(now)}" x2="${X(now)}" y1="${M.t-6}" y2="${H-M.b}" stroke="var(--ink)" stroke-width="2"/><text x="${Math.min(W-M.r-20,Math.max(M.l+20,X(now)))}" y="${M.t-9}" text-anchor="middle" class="k">now</text>`;
 if(y&&!y.closed&&ob.at>=o&&ob.at<=c)g+=`<circle cx="${X(ob.at)}" cy="${Y(y.w)}" r="6" fill="var(--sea2)" stroke="var(--bg)" stroke-width="2"/><text x="${Math.min(W-M.r-40,Math.max(M.l+40,X(ob.at)))}" y="${Math.min(H-M.b-8,Y(y.w)+22)}" text-anchor="middle" class="k">you ${y.w}m</text>`;
 s.innerHTML=g;
}

function viewCalendar(){
 return `<div class="hd"><div><h1>Calendar</h1><p>${DAYS.length} days, ${DAYS[0][1]} to ${DAYS[DAYS.length-1][1]}. Click a day to open it on Today. Crowd levels are sample estimates and scale the historic wait estimates. Weather is the live Orlando forecast, which reaches about 16 days ahead.</p></div></div>
 <div class="cal">${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=>`<span class="h">${d}</span>`).join('')}
 ${DAYS.map((d,i)=>{const sp=spent(i);return `<button type="button" class="cd ${i===S.day?'on':''}" data-a="calday" data-d="${i}"><span class="row"><b>${d[1].split(' ')[1]}</b><span class="mute">Day ${i+1}</span></span><span class="cr ${ck(i)}">${CNAME[ck(i)]}</span><span class="mute" style="font-size:13px">${WX[i]?WX[i].hi+'°C · '+(WX[i].storm?WX[i].storm[2]+'% showers':'dry'):'forecast later'}${xpOn(i)!=='none'?' · Express':''}</span><span>${ps(i).map(x=>'<span class="pdot" style="background:var(--'+x[0]+')"></span>').join('')}${esc(ps(i).map(x=>PARKS[x[0]].short).join(' + ')||(i===DAYS.length-1&&i>0?'Depart':'Rest'))}</span><span class="mute" style="font-size:13px">${items(i).length} planned${sp?' · '+usd(sp)+' spent':''}</span></button>`}).join('')}</div>`;
}
const TRAVEL={'ioa-usf':[15,'walk via CityWalk'],'epic-ioa':[25,'resort bus via Dockside'],'epic-usf':[25,'resort bus via Dockside']};
const travel=(a,b)=>TRAVEL[[a,b].sort().join('-')]||[0,''];
function avgWait(p,di,m){let s=0,n=0;for(const r of RIDES){if(r.park!==p||r.pop<45)continue;const v=sim(r,di,m,ck(di));if(v.w!=null){s+=v.w;n++}}return n?s/n:null}
function suggestHop(di,a,b){
 const tv=travel(a,b)[0],end=Math.min(PARKS[a].close,PARKS[b].close)+(late(di)?60:0);let bestH=null,bestS=-1e9;
 for(let h=600;h<=960;h+=15){let s=0,n=0;for(let m=h+tv;m<end;m+=15){const A=avgWait(a,di,m),B=avgWait(b,di,m);if(A!=null&&B!=null){s+=A-B;n++}}if(n&&s/n>bestS){bestS=s/n;bestH=h}}
 return bestH==null?null:{h:bestH,save:Math.round(bestS)};
}
const BAR0=420,BAR1=1320;
function dayBar(di){
 const P=ps(di);if(!P.length)return '<div class="empty">Rest day: no park planned.</div>';
 const segs=P.map(([p,f],i)=>{const s=Math.max(f,PARKS[p].open-60),e=i<P.length-1?P[i+1][1]:PARKS[p].close+(late(di)?60:0);return{p,s,e}});
 let h='',cur=BAR0;
 segs.forEach((g,i)=>{if(i>0){const tv=travel(segs[i-1].p,g.p)[0];h+=`<span class="bseg tv" style="flex:${tv}">${tv}m</span>`;g.s+=tv}if(g.s>cur&&i===0)h+=`<span class="bseg gap" style="flex:${g.s-cur}"></span>`;h+=`<span class="bseg pk-${g.p}" style="flex:${g.e-g.s}">${PARKS[g.p].short} ${fmt(g.s)}–${fmt(g.e)}</span>`;cur=g.e});
 if(cur<BAR1)h+=`<span class="bseg gap" style="flex:${BAR1-cur}"></span>`;
 return `<div class="dbar">${h}</div><div class="row mute" style="font-size:13px;margin-top:4px"><span>7:00</span><span>12:00</span><span>17:00</span><span>22:00</span></div>`;
}
function window4(di,p){const P=ps(di);for(let i=0;i<P.length;i++)if(P[i][0]===p){const s=P[i][1]+(i?travel(P[i-1][0],p)[0]:0),e=i<P.length-1?P[i+1][1]:1440;return[s,e]}return null}
function bestIn(r,di,s,e){const[o,c]=hours(r,di);let b=null;for(let m=Math.max(s,o);m<Math.min(e,c)-15;m+=5){const v=sim(r,di,m,ck(di));if(v.w!=null&&(!b||v.w<b.w))b={m,w:v.w}}return b}
const parkOpts=(sel,none)=>(none?`<option value="">${none}</option>`:'')+Object.entries(PARKS).map(([k,x])=>`<option value="${k}" ${k===sel?'selected':''}>${x.name}</option>`).join('');
function viewPlanner(){
 const di=S.day,P=ps(di),a=P[0]?.[0],b=P[1]?.[0];
 const cmp=b||(a?(S.cmp&&S.cmp!==a?S.cmp:(a==='ioa'?'usf':a==='usf'?'ioa':'ioa')):null);
 const sg=a&&cmp?suggestHop(di,a,cmp):null;
 const must=(S.must[di]||[]).map(id=>RID[id]).filter(Boolean);
 const its=items(di),rides=RIDES.filter(r=>P.some(x=>x[0]===r.park));
 const avail=RIDES.filter(r=>P.some(x=>x[0]===r.park)&&!must.includes(r));
 return `<div class="hd"><div><h1>Plan</h1><p>${DAYS[di][1]} · ${esc(planText(di))} · ${its.filter(i=>i.done).length} of ${its.length} done · waits and travel times are estimates</p></div><span class="addf" style="margin:0"><button class="btn ghost" type="button" data-a="replan">Re-plan from here</button><button class="btn" type="button" data-a="spend">+ Log spend</button></span></div>
 <div class="card"><h2>Day shape <small>${esc(planText(di))}</small></h2>${dayBar(di)}<div style="margin-top:14px">${wxStrip(di)}</div>${xpOn(di)!=='none'?`<p class="mute" style="margin:10px 0 0"><b style="color:var(--ink)">${XPN[xpOn(di)]}</b> on this day: the planner uses Express waits (about a quarter of standby), except on rides that don't take Express (sample: Hagrid's, Battle at the Ministry).</p>`:''}${S.set.epa!==false?'<p class="mute" style="margin:6px 0 0">Early Park Admission on: early-entry rides open an hour before the park (sample hours).</p>':''}
  <div class="addf" style="align-items:center"><label class="mute nw" for="pp1">Start at</label><select id="pp1" data-f="pp1">${parkOpts(a,'No park (rest day)')}</select>
  ${a?`<label class="mute nw" for="pp2">then hop to</label><select id="pp2" data-f="pp2">${parkOpts(b,'Stay all day')}</select>${b?`<label class="mute nw" for="pph">at</label><input id="pph" data-f="pph" type="time" value="${fmt(P[1][1]).padStart(5,'0')}" step="900">`:''}`:''}</div>
  ${b?`<p class="mute" style="margin:10px 0 0">${PARKS[a].short} to ${PARKS[b].short}: about ${travel(a,b)[0]} min by ${travel(a,b)[1]}</p>`:''}</div>
 <div class="grid2 g-plan" style="margin-top:16px">
  <div> <div class="card"><h2>Itinerary <small>tick when done · edit a time or use ↑ ↓ to reorder</small></h2>${its.length?its.map((i,k)=>{const r=i.ride&&RID[i.ride];const v=r?sim(r,di,i.t,ck(di)):null;const nx=its[k+1];const d=dur(i,di);const clash=nx&&!i.done&&!nx.done&&nx.t<i.t+d;
  return `<div class="it2 ${i.done?'done':''}"><button type="button" class="ck" data-a="tick" data-id="${i.id}" aria-label="${i.done?'Mark not done':'Mark done'}">${i.done?'✓':''}</button><input type="time" class="tin" value="${fmt(i.t).padStart(5,'0')}" data-f="itt" data-id="${i.id}" aria-label="Time"><span class="ti"><b>${esc(i.title)}</b><br><span class="mute" style="font-size:13px">${esc(i.type)}${r?` · ${PARKS[r.park].short} · ${v.w!=null?(xpOn(di)!=='none'&&!NOX.has(r.id)?'Express ~'+wt(r,di,i.t)+' min (standby ~'+v.w+')':'est. ~'+v.w+' min wait')+' at '+fmt(i.t)+(OUT.has(r.id)&&rainAt(di,i.t)>=40?' · <span class="up">outdoor ride, '+rainAt(di,i.t)+'% rain</span>':'')+(WET.has(r.id)&&tempAt(di,i.t)<20?' · <span class="up">water ride, '+tempAt(di,i.t)+'°C</span>':''):esc(v.s)+' at '+fmt(i.t)}`:''}</span>${clash?`<br><span class="up" style="font-size:13px">Likely still busy at ${fmt(nx.t)} (about ${d} min needed). Move ${esc(nx.title)} later?</span>`:''}</span><span class="nw"><button type="button" class="x" data-a="up" data-id="${i.id}" aria-label="Move earlier" ${k?'':'disabled'}>↑</button><button type="button" class="x" data-a="down" data-id="${i.id}" aria-label="Move later" ${nx?'':'disabled'}>↓</button><button type="button" class="x" data-a="deli" data-id="${i.id}" aria-label="Remove">✕</button></span></div>`}).join(''):'<div class="empty">Nothing planned for this day. Add items below, or pick must-dos and press Plan my day.</div>'}
  <form class="addf" id="addf2"><input id="at2" type="time" value="${fmt(Math.min(1380,S.clock+60)).padStart(5,'0')}" aria-label="Time" required>${rides.length?`<select id="ar2" aria-label="Ride"><option value="">Not a ride</option>${rides.map(r=>`<option value="${r.id}">${esc(SHORT[r.id])}</option>`).join('')}</select>`:''}<input id="an2" type="text" maxlength="80" placeholder="Or type a meal or activity" aria-label="What"><select id="ay2" aria-label="Type"><option value="activity">Activity</option><option value="meal">Meal</option><option value="hop">Park hop</option></select><button class="btn" type="submit">Add</button></form>
  <p class="mute" style="font-size:13px;margin:10px 0 0">↑ and ↓ swap an item's time with its neighbour. Clash warnings assume ride wait + 10 min, meals 45 min, hops 25 min.</p></div></div>
  <div style="display:grid;gap:16px;align-content:start">
  <div class="card"><h2>Must-dos <small>${must.length} for this day</small></h2>${must.length?`<div style="display:flex;flex-wrap:wrap;gap:6px">${must.map(r=>`<span class="ty" style="font-size:13.5px;color:var(--ink)"><span class="pdot" style="background:var(--${r.park})"></span>${esc(SHORT[r.id])}</span>`).join('')}</div>`:'<div class="mute">None picked yet.</div>'}
   <div class="addf">${must.length||ps(di).length?'<button type="button" class="btn" data-a="planday">Plan my day</button>':''}<a class="more" style="align-self:center" href="#mustdos">Edit must-dos ›</a></div>${S.flash?`<p class="mute" style="font-size:13.5px;margin:8px 0 0">${esc(S.flash)}</p>`:''}</div>
  <div class="card"><h2>Suggested hop </h2>
   ${!a?'<div class="empty">Pick a park for this day to get a suggestion.</div>':sg&&sg.save>3?`<div style="font:600 21px/1.25 Outfit,sans-serif">Hop to ${PARKS[cmp].short} at ${fmt(sg.h)}</div><p class="mute" style="margin:6px 0 12px">For the rest of the day, headline rides in ${PARKS[cmp].short} average about ${sg.save} min shorter than staying in ${PARKS[a].short}, after ${travel(a,cmp)[0]} min travel.</p><div class="addf" style="margin-top:0"><button type="button" class="btn" data-a="usehop" data-p="${cmp}" data-h="${sg.h}">Use this</button><button type="button" class="btn ghost" data-a="stay">Stay in ${PARKS[a].short}</button>${b?'':`<select data-f="cmp" aria-label="Compare with">${Object.entries(PARKS).filter(([k])=>k!==a).map(([k,x])=>`<option value="${k}" ${k===cmp?'selected':''}>Compare with ${x.short}</option>`).join('')}</select>`}</div>`:`<div style="font:600 21px/1.25 Outfit,sans-serif">Stay in ${PARKS[a].short}</div><p class="mute" style="margin:6px 0 12px">Hopping to ${PARKS[cmp].short} doesn't save meaningful time today.</p>${b?'':`<select data-f="cmp" aria-label="Compare with">${Object.entries(PARKS).filter(([k])=>k!==a).map(([k,x])=>`<option value="${k}" ${k===cmp?'selected':''}>Compare with ${x.short}</option>`).join('')}</select>`}`}
   <div class="fig" style="height:240px"><svg id="pch" role="img" aria-label="Average headline wait by park"></svg></div>
   <p class="mute" style="font-size:13px;margin:0">Typical wait of each park's headline rides, from historic patterns at this day's crowd level. Thick line: where your plan has you.</p></div>
  </div>
 </div>`;
}
function viewMustdos(){
 const di=S.day,P=ps(di),a=P[0]?.[0],b=P[1]?.[0];
 const cmp=b||(a?(S.cmp&&S.cmp!==a?S.cmp:(a==='ioa'?'usf':a==='usf'?'ioa':'ioa')):null);
 const sg=a&&cmp?suggestHop(di,a,cmp):null;
 const must=(S.must[di]||[]).map(id=>RID[id]).filter(Boolean);
 const its=items(di),rides=RIDES.filter(r=>P.some(x=>x[0]===r.park));
 const avail=RIDES.filter(r=>P.some(x=>x[0]===r.park)&&!must.includes(r));
 return `<div class="hd"><div><h1>Must-dos</h1><p>${DAYS[di][1]} · ${esc(planText(di))} · pick rides for each day; the plan updates as you go · waits are historic estimates</p></div></div>
 <div class="grid2 g-must">
  <div class="card"><h2>Must-dos <small>${must.length} rides</small></h2>
   ${must.length?must.map(r=>{const w=window4(di,r.park);const bt=w&&bestIn(r,di,w[0],w[1]);const pl=its.find(i=>i.ride===r.id);return `<div class="sp" style="flex-wrap:wrap"><span><b>${esc(SHORT[r.id])}</b> <span class="mute">· ${PARKS[r.park].short}</span><br><span class="mute" style="font-size:13px">${!w?'Not in a park you visit today':bt?'Best while you’re there: '+fmt(bt.m)+', ~'+bt.w+' min':'Closed while you’re there'}${pl?' · planned '+fmt(pl.t):''}</span></span><span class="nw">${bt&&!pl?`<button type="button" class="btn ghost" style="min-height:34px;padding:4px 10px" data-a="addbest" data-id="${r.id}" data-m="${bt.m}">Plan ${fmt(bt.m)}</button>`:''} <button type="button" class="x" data-a="mustdel" data-id="${r.id}" aria-label="Remove must-do">✕</button></span></div>`}).join(''):'<div class="empty">No must-dos for this day yet.</div>'}
   ${must.length?`<div class="addf"><button type="button" class="btn" data-a="planday">Plan my day</button><span class="mute" style="align-self:center;font-size:13.5px">${S.flash?esc(S.flash):'Puts the must-dos in the order with the least waiting, around meals and hops.'}</span></div>`:''}
   ${avail.length?`<div class="addf"><select data-f="mustadd" aria-label="Add a must-do"><option value="">+ Add a must-do</option>${avail.map(r=>`<option value="${r.id}">${esc(SHORT[r.id])} (${PARKS[r.park].short})</option>`).join('')}</select></div>`:''}</div>
 <div class="card"><h2>Pick must-dos <small>tap to add or remove · the day re-plans automatically</small></h2>
 ${P.length?P.map(([pk])=>`<div class="sec2">${PARKS[pk].name}</div><div class="pick">${RIDES.filter(r=>r.park===pk).sort((a,b)=>b.pop-a.pop).map(r=>{const on=(S.must[di]||[]).includes(r.id);const pw=peak(r,di);return `<button type="button" class="pk ${on?'on':''}" aria-pressed="${on}" data-a="mtog" data-id="${r.id}"><b>${esc(SHORT[r.id])}</b><span>${pw?'typical peak ~'+pw.w+' min':''}</span></button>`}).join('')}</div>`).join(''):'<div class="empty">Pick a park for this day first.</div>'}
 </div>
 </div>`;
}
function drawPlan(){
 const s=$('#pch');if(!s)return;const W=s.clientWidth,H=s.clientHeight;if(!W||!H)return;
 const di=S.day,o=420,c=1320,M={l:36,r:64,t:12,b:24};
 const ser=Object.keys(PARKS).map(p=>{const pts=[];for(let m=o;m<=c;m+=15)pts.push([m,avgWait(p,di,m)]);return{p,pts}});
 const mx=Math.max(30,...ser.flatMap(x=>x.pts.map(p=>p[1]||0)));const st=mx>120?60:30,top=Math.ceil(mx/st)*st;
 const X=m=>M.l+(m-o)/(c-o)*(W-M.l-M.r),Y=w=>M.t+(1-w/top)*(H-M.t-M.b);
 let g='';for(let w=0;w<=top;w+=st)g+=`<line x1="${M.l}" x2="${W-M.r}" y1="${Y(w)}" y2="${Y(w)}" stroke="currentColor" opacity=".12"/><text x="${M.l-6}" y="${Y(w)+4}" text-anchor="end">${w}</text>`;
 for(let m=480;m<=c;m+=(W<520?240:120))g+=`<text x="${X(m)}" y="${H-6}" text-anchor="middle">${fmt(m)}</text>`;
 const col={usf:'var(--usf)',ioa:'var(--ioa)',epic:'var(--epic)'};const labs=[];
 for(const{p,pts}of ser){let d='',pen=false;for(const[m,w]of pts){if(w==null){pen=false;continue}d+=(pen?'L':'M')+X(m).toFixed(1)+' '+Y(w).toFixed(1);pen=true}
  g+=`<path d="${d}" fill="none" stroke="${col[p]}" stroke-width="1.5" opacity=".45"/>`;
  const w=window4(di,p);if(w){let d2='',pn=false;for(const[m,v]of pts){if(v==null||m<w[0]||m>w[1]){pn=false;continue}d2+=(pn?'L':'M')+X(m).toFixed(1)+' '+Y(v).toFixed(1);pn=true}g+=`<path d="${d2}" fill="none" stroke="${col[p]}" stroke-width="4"/>`}
  const last=pts.filter(x=>x[1]!=null).pop();if(last)labs.push({p,x:X(last[0])+6,y:Y(last[1])+4})}
 labs.sort((a,b)=>a.y-b.y);for(let i=1;i<labs.length;i++)if(labs[i].y-labs[i-1].y<15)labs[i].y=labs[i-1].y+15;
 for(const l of labs)g+=`<text x="${l.x}" y="${l.y}" class="k" style="fill:${col[l.p]}">${PARKS[l.p].short}</text>`;
 if(S.clock>=o&&S.clock<=c)g+=`<line x1="${X(S.clock)}" x2="${X(S.clock)}" y1="${M.t}" y2="${H-M.b}" stroke="var(--ink)" stroke-dasharray="3 3" opacity=".6"/>`;
 s.innerHTML=g;
}
function dur(i,di){if(i.type==='ride'&&i.ride){return(wt(RID[i.ride],di,i.t)??0)+10}return i.type==='meal'?45:i.type==='hop'?25:30}
const REST=[
 ['Mythos Restaurant','ioa','The Lost Continent','table','Mediterranean',30],['Confisco Grille','ioa','Port of Entry','table','American',26],['Three Broomsticks','ioa','Hogsmeade','quick','British',20],['Thunder Falls Terrace','ioa','Jurassic Park','quick','BBQ',21],['Croissant Moon Bakery','ioa','Port of Entry','quick','Bakery',12],['Circus McGurkus Cafe Stoo-pendous','ioa','Seuss Landing','quick','American',16],
 ['Leaky Cauldron','usf','Diagon Alley','quick','British',21],['Finnegan’s Bar & Grill','usf','New York','table','Irish',28],['Krusty Burger','usf','Springfield','quick','Burgers',17],['Louie’s Italian','usf','New York','quick','Italian',16],['Mel’s Drive-In','usf','Hollywood','quick','American',17],['Lard Lad Donuts','usf','Springfield','quick','Snacks',8],
 ['The Toadstool Cafe','epic','Super Nintendo World','quick','Mushroom Kingdom',24],['Mead Hall','epic','Isle of Berk','quick','Viking',21],['The Burning Blade Tavern','epic','Dark Universe','quick','Pub food',19],['Pizza Moon','epic','Celestial Park','quick','Pizza',16],['Atlantic','epic','Celestial Park','table','Seafood',45],
 ['Bigfire','cw','CityWalk','table','American grill',36],['The Toothsome Chocolate Emporium','cw','CityWalk','table','American',30],['Dockside food court','hotel','Dockside Inn & Suites','quick','Food court',14],
 ["McDonald's",'out','Kirkman Road','quick','Burgers',9,'west',1],['Chick-fil-A','out','Kirkman Road','quick','Chicken',10,'west',1],["Wendy's",'out','Kirkman Road','quick','Burgers',9,'west',1],['Taco Bell','out','Kirkman Road','quick','Tex-Mex',8,'west',1],["Denny's",'out','Kirkman Road','table','Diner',15,'west'],
 ['Five Guys','out','International Drive','quick','Burgers',15,'east',1],['Chipotle','out','International Drive','quick','Mexican',13,'east',1],['Starbucks','out','International Drive','quick','Coffee',8,'east',1],['IHOP','out','International Drive','table','Breakfast',15,'east'],['Olive Garden','out','International Drive','table','Italian',22,'east']
].map(([n,park,area,type,cuisine,pp,z,ff])=>({n,park,area,type,cuisine,pp,z:z||park,ff:!!ff}));
const ZONES={usf:{x:120,y:110,w:260,h:220,l:'Universal Studios Florida'},ioa:{x:530,y:90,w:260,h:240,l:'Islands of Adventure'},cw:{x:395,y:190,w:120,h:130,l:'CityWalk'},hotel:{x:370,y:390,w:200,h:90,l:'Endless Summer hotels'},epic:{x:560,y:560,w:270,h:120,l:'Epic Universe (separate site)'},west:{x:15,y:90,w:85,h:440,l:'Kirkman Rd'},east:{x:850,y:280,w:135,h:380,l:'Intl Drive'}};
const DRIVEZ=['epic','west','east'];
Object.keys(ZONES).forEach(k=>{const z=ZONES[k],rs=REST.filter(r=>r.z===k),cols=Math.max(1,Math.floor((z.w-20)/44)),rows=Math.ceil(rs.length/cols),gy=Math.min(60,(z.h-60)/Math.max(1,rows));rs.forEach((r,i)=>{const R=rng(hs('xy'+r.n));r.x=Math.round(z.x+(z.w-(cols-1)*44)/2+(i%cols)*44+(R()-.5)*8);r.y=Math.round(z.y+56+Math.floor(i/cols)*gy+(R()-.5)*8)})});
REST.forEach(r=>{const R=rng(hs('rt'+r.n));r.g=Math.round((3.9+R()*.8)*10)/10;r.gn=Math.round(600+R()*8400);r.ta=Math.round((3.5+R()*1.0)*2)/2;r.tan=Math.round(150+R()*3800)});
const bub=v=>'<span class="bub" aria-hidden="true">'+[1,2,3,4,5].map(i=>`<i class="${v>=i?'f':v>=i-.5?'h':''}"></i>`).join('')+'</span>';
const PLACE={usf:'Studios',ioa:'Islands',epic:'Epic',cw:'CityWalk',hotel:'Hotel',out:'Outside'};
const TAX=.065,TIP=.2;
const allIn=r=>Math.round(r.pp*4*(1+TAX+(r.type==='table'?TIP:0)));
function origin(){const di=S.day,m=S.clock;const mode=S.df.from||'now';
 if(mode==='next'){const nx=items(di).find(i=>!i.done&&i.t>=m&&i.ride);if(nx){const r=RID[nx.ride];const z=ZONES[r.park];return{z:r.park,x:z.x+z.w/2,y:z.y+z.h/2,l:'next stop: '+SHORT[r.id]+' at '+fmt(nx.t)}}}
 const p=parkAt(di,m);if(p&&m>=PARKS[p].open-60&&m<PARKS[p].close+60){const z=ZONES[p];return{z:p,x:z.x+z.w/2,y:z.y+z.h/2,l:'you, in '+PARKS[p].short+' (demo position)'}}
 const z=ZONES.hotel;return{z:'hotel',x:z.x+z.w/2,y:z.y+z.h/2,l:'you, at the hotel (demo position)'}}
function trav(r,o){const d=Math.hypot(r.x-o.x,r.y-o.y)*3;const drive=r.z!==o.z&&(DRIVEZ.includes(r.z)||DRIVEZ.includes(o.z));return drive?{m:Math.round(6+d/350+(['usf','ioa','epic'].includes(o.z)?15:0)),mode:'drive'}:{m:Math.max(2,Math.round(d/75)),mode:'walk'}}
const inScope=(r,v)=>v==='all'||v===r.park||(v==='inpark'&&['usf','ioa','epic'].includes(r.park))||(v==='ff'&&r.ff);
function mealNow(){const m=S.clock;return m<630?'Breakfast':m<960?'Lunch':'Dinner'}
const PINC={usf:'var(--usf)',ioa:'var(--ioa)',epic:'var(--epic)',cw:'var(--cw)',hotel:'var(--hotel)',out:'var(--out)'};
function viewDining(){
 const di=S.day,f=S.df,meal=f.meal||mealNow(),view=f.view||'list';
 const al=S.alloc[meal]||0,used=(S.ex[di]||[]).filter(e=>e.cat===meal).reduce((s,e)=>s+e.amt,0),left=al-used;
 const o=origin();
 let list=REST.filter(r=>inScope(r,f.park||'all')&&(f.type==='all'||r.type===f.type)&&(!f.max||r.pp<=f.max));
 if(meal==='Breakfast')list=list.filter(r=>r.type==='quick'||r.cuisine==='Breakfast'||r.cuisine==='Diner');else list=list.filter(r=>r.cuisine!=='Snacks'&&r.cuisine!=='Bakery'&&r.cuisine!=='Breakfast');
 list.forEach(r=>{r.tv=trav(r,o)});
 const so=f.sort||(view==='map'?'near':'price');
 list.sort(so==='google'?(a,b)=>b.g-a.g||b.gn-a.gn:so==='ta'?(a,b)=>b.ta-a.ta||b.tan-a.tan:so==='near'?(a,b)=>a.tv.m+(a.tv.mode==='drive'?5:0)-(b.tv.m+(b.tv.mode==='drive'?5:0)):(a,b)=>allIn(a)-allIn(b));
 const tvTxt=r=>`<span class="nw">${r.tv.m} min ${r.tv.mode}</span>`;
 const where=r=>r.park==='out'?esc(r.area)+(r.ff?' · fast food':''):esc(PLACE[r.park])+' · '+esc(r.area);
 const tools=`<div class="tool">
  <div class="seg" role="group" aria-label="View">${[['list','List'],['map','Map']].map(([k,l])=>`<button type="button" class="${k===view?'on':''}" data-a="dview" data-v="${k}">${l}</button>`).join('')}</div>
  <div class="seg" role="group" aria-label="Meal">${['Breakfast','Lunch','Dinner'].map(x=>`<button type="button" class="${x===meal?'on':''}" data-a="dmeal" data-m="${x}">${x}</button>`).join('')}</div>
  <select data-f="dfpark" aria-label="Where">${[['all','Everywhere'],['inpark','In the parks'],['usf','Studios'],['ioa','Islands'],['epic','Epic'],['cw','CityWalk'],['hotel','Hotel'],['out','Outside the parks'],['ff','Fast food chains']].map(([k,v])=>`<option value="${k}" ${(f.park||'all')===k?'selected':''}>${v}</option>`).join('')}</select>
  <select data-f="dftype" aria-label="Service"><option value="all">Quick and table</option><option value="quick" ${f.type==='quick'?'selected':''}>Quick service</option><option value="table" ${f.type==='table'?'selected':''}>Table service</option></select>
  <select data-f="dfmax" aria-label="Price"><option value="0">Any price</option>${[10,15,20,25,30].map(v=>`<option value="${v}" ${f.max===v?'selected':''}>Up to $${v} pp</option>`).join('')}</select>
  <select data-f="dfsort" aria-label="Sort"><option value="price" ${so==='price'?'selected':''}>Cheapest first</option><option value="near" ${so==='near'?'selected':''}>Nearest first</option><option value="google" ${so==='google'?'selected':''}>Best Google rating</option><option value="ta" ${so==='ta'?'selected':''}>Best Tripadvisor rating</option></select>
  <select data-f="dffrom" aria-label="Distances from"><option value="now">From where I am</option><option value="next" ${f.from==='next'?'selected':''}>From my next ride</option></select></div>`;
 const head=`<div class="hd"><div><h1>Eat</h1><p>${DAYS[di][1]} · ${meal} budget left: <b>${usd(left)}</b> of ${usd(al)}${S.set.cur?' '+gbp(left):''} · distances from ${esc(o.l)}</p></div></div>`;
 const rate=r=>`<div class="rate"><span title="Google rating (sample)"><span class="mute">Google</span> <b>${r.g.toFixed(1)}</b> <span class="stars">★</span> <span class="mute">(${r.gn.toLocaleString('en-US')})</span></span><span title="Tripadvisor rating (sample)"><span class="mute">Tripadvisor</span> <b>${r.ta.toFixed(1)}</b> ${bub(r.ta)} <span class="mute">(${r.tan.toLocaleString('en-US')})</span></span></div>`;
 const btns=r=>`<button type="button" class="btn ghost" data-a="dplan" data-n="${REST.indexOf(r)}" data-m="${meal}">Add to plan</button><button type="button" class="btn ghost" data-a="dspend" data-n="${REST.indexOf(r)}" data-m="${meal}">Log spend</button><a class="btn ghost" style="text-decoration:none;display:inline-grid;place-items:center" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.n+', Orlando FL')}" target="_blank" rel="noopener">Directions ↗</a>`;
 const foot=`<p class="mute" style="font-size:13px">Sample restaurants, prices, ratings and positions. Outside chains are examples, not checked locations. Drive times from inside a park include about 15 minutes to get out to the car or bus. The real app shows a live Google map with Places results and fetches ratings from Google and Tripadvisor (with Tripadvisor's logo and links). In-park places always show their land, because Google maps are vague inside the parks.</p>`;
 if(view==='map'){
  const sel=REST[f.pin]&&list.includes(REST[f.pin])?REST[f.pin]:list[0];
  const shown=list.slice(0,24);
  const Z=Object.entries(ZONES).map(([k,z])=>`<rect x="${z.x}" y="${z.y}" width="${z.w}" height="${z.h}" rx="18" fill="${['west','east'].includes(k)?'color-mix(in srgb,#2f7d32 10%,transparent)':k==='epic'?'color-mix(in srgb,#6b4fb3 12%,transparent)':'color-mix(in srgb,var(--ink) 7%,transparent)'}" stroke="var(--line)" stroke-width="2"/><text x="${z.x+12}" y="${z.y+26}" ${['west','east'].includes(k)?`transform="rotate(${k==='west'?-90:0} ${z.x+12} ${z.y+26})"`:''}>${k==='west'?'':esc(z.l)}</text>`).join('')+`<text transform="rotate(-90 70 ${ZONES.west.y+ZONES.west.h-12})" x="70" y="${ZONES.west.y+ZONES.west.h-12}">Kirkman Rd</text>`;
  const roads=`<path d="M100 360 C 250 370 330 360 380 430" fill="none" stroke="var(--line)" stroke-width="6" stroke-dasharray="2 10" stroke-linecap="round"/><path d="M570 440 C 700 430 800 420 850 430" fill="none" stroke="var(--line)" stroke-width="6" stroke-dasharray="2 10" stroke-linecap="round"/><path d="M520 480 C 560 520 600 540 640 560" fill="none" stroke="var(--line)" stroke-width="6" stroke-dasharray="2 10" stroke-linecap="round"/><text x="600" y="520">bus ~25 min</text>`;
  const pins=shown.map((r,k)=>`<g class="pin ${r===sel?'on':''}" tabindex="0" role="button" aria-label="${esc(r.n)}" data-a="pin" data-n="${REST.indexOf(r)}"><circle cx="${r.x}" cy="${r.y}" r="${r===sel?17:14}" fill="${PINC[r.park]}" stroke="var(--bg)" stroke-width="3"/><text x="${r.x}" y="${r.y+6}" text-anchor="middle" style="fill:#fff;font-size:15px">${k+1}</text></g>`).join('');
  const me=`<circle cx="${o.x}" cy="${o.y}" r="30" fill="var(--ink)" opacity=".12"/><circle cx="${o.x}" cy="${o.y}" r="10" fill="var(--ink)" stroke="#fff" stroke-width="4"/><text x="${o.x+16}" y="${o.y-14}" style="fill:var(--ink)">${S.df.from==='next'?'next stop':'you'}</text>`;
  return head+tools+`<div class="mapw"><div><div class="map"><svg viewBox="0 0 1000 700" role="img" aria-label="Schematic map of restaurants around Universal Orlando">${Z}${roads}${me}${pins}</svg></div>
   <div class="legend">${[['usf','Studios'],['ioa','Islands'],['epic','Epic'],['cw','CityWalk'],['hotel','Hotel'],['out','Outside the parks']].map(([k,l])=>`<span><i style="background:${PINC[k]}"></i>${l}</span>`).join('')}<span>Schematic, not to scale. The real app uses Google Maps.</span></div></div>
   <div class="card" style="padding:10px 12px">${sel?`<div style="padding:4px 4px 10px;border-bottom:1px solid var(--line)"><div class="row"><b style="font:600 18px/1.2 Outfit,sans-serif">${esc(sel.n)}</b><span class="ty nw">${sel.type==='table'?'Table':'Quick'}</span></div><div class="mute" style="font-size:13.5px">${where(sel)} · ${esc(sel.cuisine)} · ${tvTxt(sel)}</div>${rate(sel)}<div class="row" style="margin-top:6px"><span><b class="fig2">≈ ${usd(allIn(sel))}</b> <span class="mute" style="font-size:13px">family, all-in</span></span><span class="nw ${allIn(sel)<=left?'ok':'up'}" style="font-weight:600;font-size:14px">${allIn(sel)<=left?'Fits '+meal.toLowerCase():'Over by '+usd(allIn(sel)-left)}</span></div><div class="addf" style="margin-top:8px">${btns(sel)}</div></div>`:''}
    <div class="plist">${shown.map((r,k)=>`<button type="button" class="prow ${r===sel?'on':''}" data-a="pin" data-n="${REST.indexOf(r)}"><span class="pn" style="background:${PINC[r.park]}">${k+1}</span><span><b>${esc(r.n)}</b><br><span class="mute" style="font-size:13px">${where(r)} · G ${r.g.toFixed(1)} · TA ${r.ta.toFixed(1)}</span></span><span class="mute" style="font-size:13.5px;text-align:right">${tvTxt(r)}<br>≈ ${usd(allIn(r))}</span></button>`).join('')||'<div class="empty">No places match these filters.</div>'}</div></div></div>`+foot;
 }
 return head+tools+`<div class="rgrid">${list.map(r=>{const a=allIn(r),fit=a<=left;return `<div class="card rc"><div class="row"><b style="font:600 17px/1.2 Outfit,sans-serif">${esc(r.n)}</b><span class="ty nw">${r.type==='table'?'Table':'Quick'}</span></div><div class="mute" style="font-size:13.5px">${where(r)} · ${esc(r.cuisine)} · ${tvTxt(r)}</div>
  ${rate(r)}
  <div class="row" style="margin-top:10px;align-items:flex-end"><span><span class="mute" style="font-size:13px">~$${r.pp} pp · family ${usd(r.pp*4)}</span><br><b class="fig2">≈ ${usd(a)}</b> <span class="mute" style="font-size:13px">all-in</span></span><span class="nw ${fit?'ok':'up'}" style="font-size:14px;font-weight:600">${fit?'Fits '+meal.toLowerCase():'Over by '+usd(a-left)}</span></div>
  <div class="mute" style="font-size:12.5px">incl. ${Math.round(TAX*1000)/10}% tax${r.type==='table'?' + 20% tip · book ahead':''}</div>
  <div class="addf" style="margin-top:10px">${btns(r)}</div></div>`}).join('')||'<div class="empty">No places match these filters.</div>'}</div>`+foot;
}
const gbp=n=>`<span class="mute nw">≈ £${Math.round(n*S.set.rate).toLocaleString('en-GB')}</span>`;
function viewBudget(){
 const di=S.day,D=S.daily;
 const tots=DAYS.map((_,i)=>spent(i));let tot=0;for(let i=0;i<=di;i++)tot+=tots[i];
 const past=tots.slice(0,di).reduce((a,b)=>a+b,0);const avg=di?past/di:tots[di];
 const proj=Math.round(past+Math.max(tots[di],avg)+avg*(DAYS.length-1-di)),mx=Math.max(D*1.25,...tots);
 const asum=Object.values(S.alloc).reduce((s,v)=>s+v,0);
 return `<div class="hd"><div><h1>Spend</h1><p>${usd(D)} a day · ${usd(D*DAYS.length)} for ${DAYS.length} days · up to ${DAYS[di][1]}</p></div><button class="btn acc" type="button" data-a="spend">+ Log spend</button></div>
 <div class="sum"><div><b>${usd(tot)}</b><span>spent so far ${S.set.cur?gbp(tot):''}</span></div><div><b>${usd(D*DAYS.length-tot)}</b><span>left for the trip</span></div><div><b>${usd(avg)}</b><span>average per full day</span></div><div><b class="${proj>D*DAYS.length?'up':''}">${usd(proj)}</b><span>projected trip total</span></div></div>
 <div class="card" style="margin-bottom:16px"><h2>Whole trip <small>food, souvenirs and extras · £ at ${S.set.rate} per $1 (sample rate)</small></h2>${(()=>{const all=Object.values(S.ex).flat();const sum=c=>all.filter(e=>e.cat===c).reduce((s,e)=>s+e.amt,0);const food=all.filter(e=>e.cat in S.alloc).reduce((s,e)=>s+e.amt,0);const rows=[['Food',food,D*DAYS.length,null]].concat(Object.entries(S.extra).map(([c,b])=>[c,sum(c),b,c]));const tS=rows.reduce((s,r)=>s+r[1],0),tB=rows.reduce((s,r)=>s+r[2],0);const g=n=>'£'+Math.round(n*S.set.rate).toLocaleString('en-GB');
 return `<div class="scroll"><table class="trip"><thead><tr><th>Category</th><th class="n">Spent $</th><th class="n">Spent £</th><th class="n">Budget $</th><th class="n">Budget £</th><th class="n">Left $</th><th style="width:28%"></th></tr></thead><tbody>${rows.map(([c,sp,b,k])=>`<tr style="cursor:default"><td><b>${esc(c)}</b>${c==='Extras'?'<div class="mute" style="font-size:12.5px">lockers, photos, taxis, parking</div>':''}</td><td class="n">${usd(sp)}</td><td class="n mute">${g(sp)}</td><td class="n">${k?`<input class="amt" type="number" min="0" step="50" value="${b}" data-f="xb" data-c="${esc(k)}" aria-label="${esc(c)} trip budget">`:usd(b)}</td><td class="n mute">${g(b)}</td><td class="n ${sp>b?'up':''}">${usd(b-sp)}</td><td><div class="meter"><i class="${sp>b?'over':''}" style="width:${pct(sp,b)}%"></i></div></td></tr>`).join('')}<tr style="cursor:default"><td><b>Total</b></td><td class="n"><b>${usd(tS)}</b></td><td class="n"><b>${g(tS)}</b></td><td class="n">${usd(tB)}</td><td class="n mute">${g(tB)}</td><td class="n"><b>${usd(tB-tS)}</b></td><td></td></tr></tbody></table></div>`})()}
  <p class="mute" style="font-size:13px;margin:8px 0 0">Log souvenirs and extras with + Log spend; they count here but not against the $${D} daily food allowance. Card fees and the real exchange rate will differ.</p></div>
 <div class="card"><h2>Spend by day <small>line = ${usd(D)} allowance · click a day</small></h2>
  <div class="dbars">${tots.map((v,i)=>`<button type="button" class="db ${i===di?'on':''}" data-a="bday" data-d="${i}" aria-label="${DAYS[i][1]}: ${usd(v)}"><span class="dv nw">${v?usd(v):''}</span><span class="dcol"><i class="${v>D?'over':''} ${i>di?'fut':''}" style="height:${v/mx*100}%"></i><span class="lim" style="bottom:${D/mx*100}%"></span></span><span class="dl">${DAYS[i][1].split(' ')[1]}</span></button>`).join('')}</div></div>
 <div class="grid2" style="margin-top:16px">
  <div class="card"><h2>${DAYS[di][1]} spends <small>${usd(spent(di))} of ${usd(D)}</small></h2>
   ${(S.ex[di]||[]).length?`<div class="scroll"><table><thead><tr><th>Time</th><th>Where</th><th>Category</th><th class="n">Amount</th><th></th></tr></thead><tbody>${spends(di).map(e=>`<tr style="cursor:default"><td class="nw">${fmt(e.t)}</td><td>${esc(e.where||'·')}</td><td><select data-f="exc" data-id="${e.id}" aria-label="Category">${allCats().map(c=>`<option ${c===e.cat?'selected':''}>${esc(c)}</option>`).join('')}</select></td><td class="n"><input class="amt" type="number" min="0" step="0.01" value="${e.amt}" data-f="exa" data-id="${e.id}" aria-label="Amount"></td><td><button type="button" class="x" data-a="delx" data-id="${e.id}" aria-label="Delete">✕</button></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">No spends logged for this day.</div>'}</div>
  <div class="card"><h2>Daily split <small class="${asum!==D?'up':''}">${usd(asum)} of ${usd(D)} allocated</small></h2>
   ${Object.entries(S.alloc).map(([c,a])=>{const used=(S.ex[di]||[]).filter(e=>e.cat===c).reduce((s,e)=>s+e.amt,0);let ttot=0;for(let i=0;i<=di;i++)ttot+=(S.ex[i]||[]).filter(e=>e.cat===c).reduce((s,e)=>s+e.amt,0);return `<div class="alr"><span>${esc(c)}<br><span class="mute" style="font-size:12.5px">today ${usd(used)} · trip ${usd(ttot)} of ${usd(a*(di+1))}</span></span><input class="amt" type="number" min="0" step="5" value="${a}" data-f="al" data-c="${esc(c)}" aria-label="${esc(c)} daily allocation"></div>`}).join('')}
   <div class="alr" style="border-top:2px solid var(--ink)"><b>Daily allowance</b><input class="amt" type="number" min="50" step="25" value="${D}" data-f="daily" aria-label="Daily allowance"></div>
   ${asum!==D?`<p class="up" style="font-size:13px;margin:8px 0 0">The split adds up to ${usd(asum)}, ${asum>D?'more':'less'} than the ${usd(D)} allowance.</p>`:''}</div>
 </div>`;
}
function viewSettings(){
 const st=S.set;
 return `<div class="hd"><div><h1>Settings</h1><p>Trip details, queue data, alerts and currency. Changes apply across the prototype.</p></div></div>
 <div class="grid2">
  <div class="card"><h2>Trip</h2>
   ${tripCard()}
   <div class="sp"><span>Hotel</span><span>Endless Summer – Dockside Inn & Suites</span></div>
   <div class="sp"><span>Ticket</span><span>Three Park, park-to-park, 14 days</span></div>
   <div class="sp"><span>Travellers</span><span>2 adults, children 13 and 10</span></div>
   <div class="sp"><span>Food budget</span><span>${usd(S.daily)} a day · edit on <a href="#budget">Spend</a></span></div>
   <h2 style="margin-top:18px">Wait estimates</h2>
   <div class="sp"><span>Source</span><span>Sample historic profiles (prototype)</span></div>
   <div class="sp"><span>Profile version</span><span>2026.11-sample · 32 rides · 15-minute slots</span></div>
   <div class="sp"><span>Crowd scaling</span><span>Quiet ×0.62 · Moderate ×1 · Busy ×1.38 · Extreme ×1.78</span></div>
   <div class="sp"><span>Live waits</span><span>Use the official Universal Orlando app, then Re-plan from here</span></div>
   <div class="sp"><span>Your readings</span><span>${(()=>{const T=accuracy(S.olog||[]);return T.n?T.n+' typed'+(T.m!=null?' · ran ×'+T.m.toFixed(2)+' of estimates':''):'None typed yet'})()} · <a href="#queues">see Waits</a></span></div>
   <h2 style="margin-top:18px">Park extras</h2>
   <div class="alr"><label for="epa">Early Park Admission (hotel guest benefit; check which park each day)</label><input id="epa" type="checkbox" data-f="epa" ${st.epa!==false?'checked':''} style="width:22px;height:22px;flex:none"></div>
   <div class="alr"><label for="wx">Weather-aware plans: keep outdoor rides out of likely showers, water rides off cool days</label><input id="wx" type="checkbox" data-f="wx" ${st.wx!==false?'checked':''} style="width:22px;height:22px;flex:none"></div>
   <p class="mute" style="font-size:13px;margin:6px 0 0">Express Pass is set per day on the right. Endless Summer hotels don't include free Express, so it's bought per day. Which rides accept it here is sample data; check Universal's list.</p>
   <h2 style="margin-top:18px">Offline</h2>
   <div class="sp"><span>Saved on this device</span><span>${st.saveall?'All '+DAYS.length+' days':DAYS[S.day][1]+(S.day<DAYS.length-1?' and '+DAYS[S.day+1][1]:'')}</span></div>
   <div class="sp"><span>Also saved</span><span>Wait profiles, restaurants, budget · about ${st.saveall?'310':'190'} KB</span></div>
   <div class="sp"><span>Needs signal</span><span>Map tiles, live ratings, syncing with family</span></div>
   <div class="alr"><label for="saveall">Save all ${DAYS.length} days, not just today and tomorrow</label><input id="saveall" type="checkbox" data-f="saveall" ${st.saveall?'checked':''} style="width:22px;height:22px;flex:none"></div>
   <div class="alr"><label for="offt">Try offline mode (prototype)</label><input id="offt" type="checkbox" data-f="offline" ${S.offline?'checked':''} style="width:22px;height:22px;flex:none"></div>
   <h2 style="margin-top:18px">Currency</h2>
   <div class="alr"><label for="cur">Show pounds next to dollars</label><input id="cur" type="checkbox" data-f="cur" ${st.cur?'checked':''} style="width:22px;height:22px"></div>
   <div class="alr"><label for="rate">Rate used, £ per $1 (sample)</label><input id="rate" class="amt" type="number" min="0.1" max="2" step="0.01" value="${st.rate}" data-f="rate"></div></div>
  <div class="card"><h2>Each day <small>crowd level and Express Pass</small></h2>
   ${DAYS.map((d,i)=>`<div class="alr"><span>${d[1]} <span class="mute">· ${esc(ps(i).map(x=>PARKS[x[0]].short).join(' + ')||'no park')}</span></span><select data-f="cd" data-d="${i}" aria-label="Crowd for ${d[1]}">${Object.keys(CROWD).map(k=>`<option value="${k}" ${ck(i)===k?'selected':''}>${CNAME[k]} ×${CROWD[k]}</option>`).join('')}</select><select data-f="xpd" data-d="${i}" aria-label="Express Pass for ${d[1]}">${Object.entries(XPN).map(([k,l])=>`<option value="${k}" ${xpOn(i)===k?'selected':''}>${l}</option>`).join('')}</select></div>`).join('')}
   <div class="addf"><button type="button" class="btn ghost" data-a="reset">Reset all demo data</button></div></div>
 </div>`;
}

const RMIN=6,WALK=10;
function fixedOf(di){return items(di).filter(i=>!i.done&&!i.ride).map(i=>({s:i.t,e:i.t+(i.type==='meal'?45:i.type==='hop'?25:30)}))}
function evalOrder(order,di,start,end,fx){
 let t=start,tot=0,late=0,pen=0;const out=[];
 for(const r of order){
  for(let g=0;g<12;g++){const[o]=hours(r,di);if(t<o)t=o;const w0=wt(r,di,t);const w=w0==null?90:w0;const d=w+RMIN;const f=fx.find(f=>t<f.e&&t+d>f.s);if(f){t=f.e;continue}tot+=w;pen+=wxPen(r,di,t);out.push({r,t,w});t+=d+WALK;break}
  if(t>end)late+=t-end;
 }
 return{tot,score:tot+late*5+pen,out};
}
function perms(a){if(a.length<=1)return[a];const res=[];a.forEach((x,i)=>{for(const p of perms(a.slice(0,i).concat(a.slice(i+1))))res.push([x,...p])});return res}
function bestOrder(rs,di,start,end,fx){
 if(!rs.length)return{out:[],tot:0,score:0};
 if(rs.length<=8){let b=null;for(const p of perms(rs)){const e=evalOrder(p,di,start,end,fx);if(!b||e.score<b.score)b=e}return b}
 const left=rs.slice(),order=[];let t=start;
 while(left.length){let bi=0,bs=1e9;left.forEach((r,i)=>{const now=sim(r,di,t,ck(di)).w??999,later=sim(r,di,t+90,ck(di)).w??now,sc=now-(later-now)*.5;if(sc<bs){bs=sc;bi=i}});order.push(left.splice(bi,1)[0]);const e=evalOrder(order,di,start,end,fx);const l=e.out[e.out.length-1];t=l?l.t+l.w+RMIN+WALK:t}
 return evalOrder(order,di,start,end,fx);
}
function segOf(di,p){const w=window4(di,p);if(!w)return null;const anyEE=RIDES.some(r=>r.park===p&&r.ee);return[Math.max(w[0],PARKS[p].open-(anyEE?60:0)),Math.min(w[1],PARKS[p].close+(late(di)?60:0))]}
function planDay(){
 let picked=false;if(!(S.must[S.day]||[]).length&&ps(S.day).length){const P=ps(S.day);S.must[S.day]=P.flatMap(([p])=>RIDES.filter(r=>r.park===p).sort((a,b)=>b.pop-a.pop).slice(0,P.length>1?2:4).map(r=>r.id));picked=true}
 const di=S.day,must=(S.must[di]||[]).map(id=>RID[id]).filter(r=>r&&!items(di).some(i=>i.done&&i.ride===r.id));
 S.it[di]=(S.it[di]||[]).filter(i=>i.done||!i.ride||!(i.auto||must.some(r=>r.id===i.ride)));
 const started=items(di).some(i=>i.done);const fx=fixedOf(di);let tot=0,n=0;
 for(const[p]of ps(di)){const sg=segOf(di,p);if(!sg)continue;const st=started?Math.max(sg[0],S.clock):sg[0];if(st>=sg[1])continue;const rs=must.filter(r=>r.park===p);const b=bestOrder(rs,di,st,sg[1],fx);
  b.out.forEach(x=>{S.it[di].push({id:uid(),t:x.t,type:'ride',title:SHORT[x.r.id],ride:x.r.id,done:false,auto:true});tot+=x.w;n++})}
 S.flash=(picked?'No must-dos were picked for this day, so I used the most popular rides. Change them on Must-dos. ':'')+(n?`${started?'Planned the rest of the day from '+fmt(S.clock)+': ':''}${n} must-dos placed, about ${tot} min of waiting in total (estimate). See the plan.`:'No must-dos fit the parks planned for this day.');
 render();setTimeout(()=>{S.flash=null;save()},0);
}
let RP=null;
function rpRides(){
 const di=S.day,m=S.clock,p=parkAt(di,m);if(!p)return{p:null,list:[]};
 const sg=segOf(di,p)||[m,m];
 const ids=new Set(items(di).filter(i=>!i.done&&i.ride&&RID[i.ride].park===p&&i.t<sg[1]).map(i=>i.ride));
 (S.must[di]||[]).forEach(id=>{if(RID[id]&&RID[id].park===p&&!items(di).some(i=>i.ride===id&&i.done))ids.add(id)});
 return{p,sg,list:[...ids].map(id=>RID[id])};
}
function openRP(){
 const di=S.day,m=S.clock,{p,list}=rpRides();const prev=S.obs[di]&&S.obs[di].rd||{};
 RP={stage:1};
 $('#rpbox').innerHTML=`<h2>Re-plan from here · ${fmt(m)}</h2>`+(!p?'<p>No park is planned at this time, so there is nothing to re-plan.</p><div class="row"><button type="button" class="btn ghost" data-a="rpclose">Close</button></div>':
 `<p class="mute" style="margin:0">Open the Universal app and type the current wait for any of these ${esc(PARKS[p].short)} rides. Leave the rest blank. Tick closed if a ride is down.</p>
 <div>${list.map(r=>{const e=sim(r,di,m,ck(di),true);return `<div class="rprow"><span><b>${esc(SHORT[r.id])}</b><br><span class="mute" style="font-size:13px">estimate ${e.w!=null?e.w+' min':esc(e.s)}</span></span><input id="rp-${r.id}" type="number" min="0" max="300" step="5" inputmode="numeric" placeholder="min" aria-label="${esc(SHORT[r.id])} wait in minutes" value="${prev[r.id]&&!prev[r.id].closed?prev[r.id].w:''}"><label class="nw" style="display:flex;gap:6px;align-items:center"><input id="rc-${r.id}" type="checkbox" ${prev[r.id]&&prev[r.id].closed?'checked':''} style="width:20px;height:20px"> closed</label><span></span></div>`}).join('')||'<div class="empty">No rides left to plan in this park.</div>'}</div>
 <div class="row"><button type="button" class="btn ghost" data-a="rpclose">Cancel</button><button type="button" class="btn acc" data-a="rpgo">Re-plan</button></div>`);
 $('#rpm').classList.add('open');const f=$('#rpbox input');if(f)f.focus();
}
function logObs(di,ob,prev){const pr=prev&&prev.rd||{};S.olog=S.olog||[];for(const[id,x]of Object.entries(ob.rd)){const p=pr[id];if(p&&!!p.closed===!!x.closed&&p.w===x.w)continue;const r=RID[id];const e=r?sim(r,di,ob.at,ck(di),true).w:null;S.olog.push({id:uid(),d:di,at:ob.at,ride:id,w:x.closed?null:x.w,closed:!!x.closed,est:e,crowd:ck(di),kind:'typed'})}}
const closeRP=()=>{$('#rpm').classList.remove('open');RP=null};
function rpCompute(){
 const di=S.day,m=S.clock,{p,sg,list}=rpRides();const rd={},ratios=[];
 list.forEach(r=>{const w=parseFloat($('#rp-'+r.id).value),cl=$('#rc-'+r.id).checked;if(cl)rd[r.id]={closed:true};else if(w>=0&&!isNaN(w)){rd[r.id]={w:Math.round(w)};const e=sim(r,di,m,ck(di),true).w;if(e)ratios.push(Math.max(5,w)/e)}});
 if(!Object.keys(rd).length){if(!$('#rperr'))$('#rpbox .row').insertAdjacentHTML('beforebegin','<p id="rperr" class="up" style="margin:0">Type at least one wait, or tick a ride as closed.</p>');return}
 ratios.sort((a,b)=>a-b);const f=ratios.length?ratios[Math.floor((ratios.length-1)/2)]:1;
 const old=S.obs[di];S.obs[di]={at:m,f:Math.round(f*100)/100,rd};
 const its=items(di).filter(i=>!i.done&&i.ride&&RID[i.ride].park===p&&i.t<sg[1]);
 const oldCost=evalOrder(its.slice().sort((a,b)=>a.t-b.t).map(i=>RID[i.ride]).filter(r=>!(rd[r.id]&&rd[r.id].closed)),di,m,sg[1],fixedOf(di).filter(x=>x.e>m)).tot;
 const openR=list.filter(r=>!(rd[r.id]&&rd[r.id].closed)),closedR=list.filter(r=>rd[r.id]&&rd[r.id].closed);
 const fx=fixedOf(di).filter(x=>x.e>m);
 const nb=bestOrder(openR,di,m,sg[1],fx);
 S.obs[di]=old;if(!old)delete S.obs[di];
 RP={stage:2,obs:{at:m,f:Math.round(f*100)/100,rd},plan:nb.out,closed:closedR,p,sg};const RPsg=sg;
 const oldList=its.slice().sort((a,b)=>a.t-b.t);
 $('#rpbox').innerHTML=`<h2>New plan from ${fmt(m)}</h2>
 <p style="margin:0">Your waits ran <b>×${f.toFixed(2)}</b> of the historic estimate${ratios.length>1?' (median of '+ratios.length+' readings)':''}. ${f>1.05?'Busier than usual, so later waits are raised and ease back over two hours.':f<.95?'Quieter than usual, so later waits are lowered for the next two hours.':'About as expected.'}${closedR.length?' '+closedR.map(r=>esc(SHORT[r.id])).join(', ')+' moved to a check-again slot.':''}</p>
 <div class="cmp"><div><h3>Current plan</h3>${oldList.map(i=>`<div class="sp"><span><b class="nw">${fmt(i.t)}</b> ${esc(i.title)}</span></div>`).join('')||'<div class="mute">No rides planned.</div>'}</div>
 <div><h3>Suggested</h3>${nb.out.map(x=>`<div class="sp"><span><b class="nw">${fmt(x.t)}</b> ${esc(SHORT[x.r.id])}</span><span class="mute nw">~${x.w}m${x.t+x.w>RP.sg[1]&&RP.sg[1]<1300?' <span class="up">won\'t finish before '+fmt(RP.sg[1])+'</span>':''}</span></div>`).join('')}${closedR.map(r=>`<div class="sp"><span><b class="nw">${fmt(m+45)}</b> Check again: ${esc(SHORT[r.id])}</span></div>`).join('')}</div></div>
 <p class="mute" style="margin:0">Estimated waiting: <b>${nb.tot} min</b> suggested${oldList.length?` vs about ${Math.round(oldCost)} min for the current plan (which skips any must-dos it doesn't include)`:''}. Meals and park hops stay where they are.</p>
 <div class="row"><button type="button" class="btn ghost" data-a="rpkeep">Keep mine</button><button type="button" class="btn acc" data-a="rpuse">Use this plan</button></div>`;
}
function rpApply(use){
 if(!RP||RP.stage!==2)return;const di=S.day;
 logObs(di,RP.obs,S.obs[di]);S.obs[di]=RP.obs;
 if(use){const ids=new Set(RP.plan.map(x=>x.r.id).concat(RP.closed.map(r=>r.id)));
  S.it[di]=(S.it[di]||[]).filter(i=>i.done||!i.ride||!ids.has(i.ride));
  RP.plan.forEach(x=>S.it[di].push({id:uid(),t:x.t,type:'ride',title:SHORT[x.r.id],ride:x.r.id,done:false,auto:true}));
  RP.closed.forEach(r=>S.it[di].push({id:uid(),t:RP.obs.at+45,type:'ride',title:'Check again: '+SHORT[r.id],ride:r.id,done:false,auto:true}))}
 closeRP();render();
}

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
 const live=S.live?(ls==='on'?`Following Orlando time. ${S.follow===false?'You picked a different day.':'Today is Day '+(S.day+1)+'.'}`:ls==='before'?`Real Orlando time starts on ${DAYS[0][1]}, ${dt} day${dt===1?'':'s'} away. Until then the app uses the demo clock below.`:'The trip has finished, so the app uses the demo clock.'):'The app uses the demo clock, so you can try any time of day.';
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
 if(a==='imp'){try{const d=JSON.parse($('#impt').value);if(!d||typeof d!=='object'||!d.it||!d.set)throw 0;S=d;fill();applyTrip();syncLive();render();const m=$('#expmsg');if(m)m.textContent='Loaded.'}catch(x){$('#expmsg').textContent="That doesn't look like data copied from this app."}}
});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;if(route()==='more')render()});
window.addEventListener('appinstalled',()=>{deferredInstall=null});
window.addEventListener('online',()=>{S.offline=false;syncQ();render()});
window.addEventListener('offline',()=>{S.offline=true;render()});
setInterval(()=>{if(S.live&&!document.hidden&&!document.querySelector('.modal.open')&&!(document.activeElement&&/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName))){const c=S.clock,d=S.day;if(syncLive()&&(c!==S.clock||d!==S.day))render()}},60000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&S.live&&syncLive())render()});
if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol)){window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}))}

const route=()=>{let h=location.hash.slice(1);if(h==='itinerary')h='planner';return h==='more'||(h!=='g'&&NAV.some(n=>n[0]===h))?h:'today'};
let rendered=null;
function render(){
 const a=document.activeElement,aid=a&&a.id&&$('#main').contains(a)?a.id:null,sel=aid&&a.selectionStart!=null?[a.selectionStart,a.selectionEnd]:null;
 const v=route();
 $('#nav').innerHTML=NAV.map(([k,l])=>k==='g'?`<div class="navh">${l}</div>`:`<a href="#${k}" class="${k===v?'on':''}">${l}</a>`).join('');
 $('#daylbl').innerHTML=`<span class="dn">Day ${S.day+1} · </span>${DAYS[S.day][1]}`;
 $('#clock').value=S.clock;$('#clockv').textContent=fmt(S.clock);
 $('#tclock').innerHTML=fmt(S.clock)+(liveState()==='on'?'':'<i>DEMO</i>');
 const tab=['calendar','mustdos','budget','settings'].includes(v)?'more':v;document.querySelectorAll('#tabbar a').forEach(x=>{const on=x.dataset.t===tab;x.classList.toggle('on',on);on?x.setAttribute('aria-current','page'):x.removeAttribute('aria-current')});
 if(rendered!==v){rendered=v;scrollTo(0,0)}
 if(ro){ro.disconnect();ro=null}
 const qn=Object.values(S.ex).flat().filter(e=>e.q).length;
 $('#offb').innerHTML=S.offline?`Offline${qn?'<span class="ol"> · '+qn+' to sync</span>':''}`:'●<span class="ol"> Saved offline</span>';$('#offb').setAttribute('aria-label',S.offline?'Offline'+(qn?', '+qn+' to sync':''):'Saved offline');$('#offb').classList.toggle('off',!!S.offline);$('#offb').title=S.offline?'Tap to go back online and sync':'Today and tomorrow are saved on this device. Tap to try offline mode';
 $('#main').innerHTML=(S.offline?`<div class="alert" style="margin-bottom:14px"><span><b>You're offline.</b> Showing the plan saved on this device. ${qn?qn+' spend'+(qn>1?'s':'')+' will sync when you’re back online.':'Spends you log now will sync later.'} Maps, live ratings and family sync need signal.</span></div>`:'')+(v==='today'?viewToday():v==='queues'?viewQueues():v==='calendar'?viewCalendar():v==='planner'?viewPlanner():v==='mustdos'?viewMustdos():v==='dining'?viewDining():v==='budget'?viewBudget():v==='more'?viewMore():viewSettings());
 if(v==='queues'){$('#sort').value=S.sort;$('#crowd').value=ck(S.day);const s=$('#ch');if(s){ro=new ResizeObserver(drawChart);ro.observe(s)}}
 if(v==='planner'){const s=$('#pch');if(s){ro=new ResizeObserver(drawPlan);ro.observe(s)}}
 if(aid){const el=document.getElementById(aid);if(el){el.focus();if(sel&&el.setSelectionRange)try{el.setSelectionRange(sel[0],sel[1])}catch(e){}}}
 save();
}
let timer=null;
function setPlay(on){if(timer){clearInterval(timer);timer=null}$('#playb').textContent=on?'❚❚':'▶';$('#playb').setAttribute('aria-label',on?'Pause demo clock':'Play demo clock');if(on)timer=setInterval(()=>{if(S.clock>=1380){setPlay(false);return}S.clock+=5;render()},450)}
function openModal(pre){pre=pre||{};$('#sc').innerHTML=allCats().map(c=>`<option>${esc(c)}</option>`).join('');const m=S.clock;$('#sc').value=pre.cat||(m<630?'Breakfast':m<900?'Lunch':m>=1020?'Dinner':'Snacks and drinks');$('#sa').value=pre.amt||'';$('#sw').value=pre.where||'';$('#modal').classList.add('open');$('#sa').focus()}
const closeModal=()=>$('#modal').classList.remove('open');
document.addEventListener('click',e=>{
 const t=e.target.closest('[data-a]');if(!t)return;const a=t.dataset.a,id=t.dataset.id,di=S.day;
 if(a==='dprev'&&S.day>0){S.follow=false;S.day--;S.qpark=null;render()}
 if(a==='dnext'&&S.day<DAYS.length-1){S.follow=false;S.day++;S.qpark=null;render()}
 if(a==='play')setPlay(!timer);
 if(a==='spend')openModal();
 if(a==='close')closeModal();
 if(a==='delx'){S.ex[di]=S.ex[di].filter(x=>x.id!==id);render()}
 if(a==='tick'){const i=S.it[di].find(x=>x.id===id);if(i)i.done=!i.done;render()}
 if(a==='deli'){S.it[di]=S.it[di].filter(x=>x.id!==id);render()}
 if(a==='qpark'){S.qpark=t.dataset.p;S.sel=null;render()}
 if(a==='sel'){S.sel=id;render()}
 if(a==='go'){S.sel=id;S.qpark=RID[id].park;location.hash='queues'}
 if(a==='addbest'){const r=RID[id];(S.it[di]||(S.it[di]=[])).push({id:uid(),t:+t.dataset.m,type:'ride',title:SHORT[r.id],ride:r.id,done:false});render()}
 if(a==='calday'){S.follow=false;S.day=+t.dataset.d;S.qpark=null;location.hash='today';render()}
 if(a==='replan')openRP();
 if(a==='rpgo')rpCompute();
 if(a==='rpuse')rpApply(true);
 if(a==='rpkeep')rpApply(false);
 if(a==='rpclose')closeRP();
 if(a==='clearobs'){delete S.obs[di];render()}
 if(a==='delobs'){S.olog=(S.olog||[]).filter(o=>o.id!==id);render()}
 if(a==='planday')planDay();
 if(a==='alx'){S.alx=!S.alx;render()}
 if(a==='offline'){S.offline=!S.offline;if(!S.offline)syncQ();render()}
 if(a==='reset'){setPlay(false);S=seed();fill();tripPending=null;tripMsg='';applyTrip();syncLive();render()}
 if(a==='usehop'){S.pp[di]=[[ps(di)[0][0],0],[t.dataset.p,+t.dataset.h]];const hp=(S.it[di]||[]).find(x=>x.type==='hop'&&!x.done);if(hp)hp.t=+t.dataset.h;render()}
 if(a==='stay'){S.pp[di]=[[ps(di)[0][0],0]];render()}
 if(a==='mustdel'){S.must[di]=(S.must[di]||[]).filter(x=>x!==id);planDay()}
 if(a==='mtog'){const L=S.must[di]||(S.must[di]=[]);if(L.includes(id))S.must[di]=L.filter(x=>x!==id);else L.push(id);planDay()}
 if(a==='up'||a==='down'){const L=items(di),k=L.findIndex(x=>x.id===id),o=L[a==='up'?k-1:k+1];if(o){const tt=o.t;o.t=L[k].t;L[k].t=tt;render()}}
 if(a==='bday'){S.follow=false;S.day=+t.dataset.d;S.qpark=null;render()}
 if(a==='dmeal'){S.df.meal=t.dataset.m;render()}
 if(a==='dview'){S.df.view=t.dataset.v;render()}
 if(a==='pin'){S.df.pin=+t.dataset.n;render()}
 if(a==='dplan'){const r=REST[+t.dataset.n],ml=t.dataset.m;(S.it[di]||(S.it[di]=[])).push({id:uid(),t:ml==='Breakfast'?480:ml==='Lunch'?750:1110,type:'meal',title:ml+' at '+r.n,ride:null,done:false});render()}
 if(a==='dspend'){const r=REST[+t.dataset.n];openModal({amt:allIn(r),cat:t.dataset.m,where:r.n})}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();closeRP()}const t=e.target.closest&&e.target.closest('tr[data-a="sel"]');if(t&&(e.key==='Enter'||e.key===' ')){e.preventDefault();S.sel=t.dataset.id;render();const n=document.querySelector(`tr[data-id="${t.dataset.id}"]`);if(n)n.focus()}});
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal()});
$('#rpm').addEventListener('click',e=>{if(e.target.id==='rpm')closeRP()});
document.addEventListener('input',e=>{
 const id=e.target.id;
 if(id==='clock'||id==='clockm'){S.clock=+e.target.value;render()}
 if(id==='q'){S.q=e.target.value;render()}
});
document.addEventListener('change',e=>{
 const id=e.target.id,f=e.target.dataset.f,di=S.day,v=e.target.value,el=e.target;
 if(f){
  const cur=ps(di);
  if(f==='pp1')S.pp[di]=v?[[v,0],...(cur[1]&&cur[1][0]!==v?[cur[1]]:[])]:[];
  if(f==='pp2'&&cur.length)S.pp[di]=v&&v!==cur[0][0]?[[cur[0][0],0],[v,cur[1]?.[1]||780]]:[[cur[0][0],0]];
  if(f==='pph'&&cur[1]&&v){const[h,m]=v.split(':').map(Number);S.pp[di]=[[cur[0][0],0],[cur[1][0],Math.max(480,Math.min(1200,h*60+m))]]}
  if(f==='cmp')S.cmp=v;
  if(f==='mustadd'&&v){(S.must[di]||(S.must[di]=[])).push(v);planDay();return}
  if(f==='itt'&&v){const it=S.it[di].find(x=>x.id===el.dataset.id);const[h,m]=v.split(':').map(Number);if(it)it.t=h*60+m}
  if(f==='dfpark')S.df.park=v;
  if(f==='dftype')S.df.type=v;
  if(f==='dfmax')S.df.max=+v;
  if(f==='dfsort')S.df.sort=v;
  if(f==='dffrom')S.df.from=v;
  if(f==='exc'){const x=S.ex[di].find(x=>x.id===el.dataset.id);if(x)x.cat=v}
  if(f==='exa'){const x=S.ex[di].find(x=>x.id===el.dataset.id);const n=parseFloat(v);if(x&&n>=0)x.amt=Math.round(n*100)/100}
  if(f==='al'){const n=parseFloat(v);if(n>=0)S.alloc[el.dataset.c]=n}
  if(f==='daily'){const n=parseFloat(v);if(n>=50)S.daily=n}
  if(f==='cur')S.set.cur=el.checked;
  if(f==='rate'){const n=parseFloat(v);if(n>0)S.set.rate=n}
  if(f==='cd')S.crowd[+el.dataset.d]=v;
  if(f==='xpd'){S.xp=S.xp||{};S.xp[+el.dataset.d]=v}
  if(f==='epa')S.set.epa=el.checked;
  if(f==='wx')S.set.wx=el.checked;
  if(f==='saveall')S.set.saveall=el.checked;
  if(f==='live'){S.live=el.checked;S.follow=true;syncLive()}
  if(f==='offline'){S.offline=el.checked;if(!S.offline)syncQ()}
  if(f==='xb'){const n=parseFloat(v);if(n>=0)S.extra[el.dataset.c]=n}
  render();return;
 }
 if(id==='sort'){S.sort=e.target.value;render()}
 if(id==='mf'){S.mf=e.target.checked;render()}
 if(id==='crowd'){S.crowd[S.day]=e.target.value;render()}
});
document.addEventListener('submit',e=>{
 e.preventDefault();const di=S.day;
 if(e.target.id==='spendf'){const amt=parseFloat($('#sa').value);if(!(amt>0))return;(S.ex[di]||(S.ex[di]=[])).push({id:uid(),cat:$('#sc').value,where:$('#sw').value.trim(),amt:Math.round(amt*100)/100,t:S.clock,q:!!S.offline});closeModal();render()}
 if(e.target.id==='addf2'){const[h,mi]=($('#at2').value||'12:00').split(':').map(Number);const rid=$('#ar2')?.value;const name=$('#an2').value.trim();if(!rid&&!name)return;(S.it[di]||(S.it[di]=[])).push(rid?{id:uid(),t:h*60+mi,type:'ride',title:SHORT[rid],ride:rid,done:false}:{id:uid(),t:h*60+mi,type:$('#ay2').value,title:name,ride:null,done:false});render()}
 if(e.target.id==='addf'){const[h,mi]=($('#at').value||'12:00').split(':').map(Number);const name=$('#an').value.trim();if(!name)return;(S.it[di]||(S.it[di]=[])).push({id:uid(),t:h*60+mi,type:$('#ay').value,title:name,ride:null,done:false});render();const n=$('#an');if(n)n.focus()}
});
window.addEventListener('hashchange',render);
syncLive();
render();
}
