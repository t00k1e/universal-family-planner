// ---- Live Orlando forecast (Open-Meteo, free, no key) ----
const FC_URL='https://api.open-meteo.com/v1/forecast?latitude=28.4744&longitude=-81.4678&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m,precipitation&hourly=temperature_2m,precipitation_probability,weather_code&timezone=America%2FNew_York&forecast_days=16';
const FC_DAYS=16;
function fcDay(iso){
 const f=S.fc&&S.fc.d&&S.fc.d[iso];if(!f)return null;
 const t=f.t.map(x=>x==null?null:Math.round(x)),p=f.p.map(x=>x==null?0:Math.round(x));
 const tv=t.filter(x=>x!=null);if(!tv.length)return null;
 const day=t.slice(7,22).filter(x=>x!=null);
 let best=null,run=null;
 for(let h=7;h<22;h++){if(p[h]>=40){if(!run)run=[h,h,p[h]];run[1]=h;run[2]=Math.max(run[2],p[h])}else run=null;if(run&&(!best||run[1]-run[0]>best[1]-best[0]))best=run.slice()}
 const cs=(f.c||[]).slice(9,19).filter(x=>x!=null),cnt={};cs.forEach(x=>cnt[x]=(cnt[x]||0)+1);
 let code=cs.length?+Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a]||b-a)[0]:null;
 if(best&&f.c){const sc=f.c.slice(best[0],best[1]+1).filter(x=>x!=null);if(sc.length)code=Math.max(...sc)}
 return{hi:Math.max(...(day.length?day:tv)),lo:Math.min(...tv),storm:best?[best[0]*60,(best[1]+1)*60,best[2]]:null,t,p,code}
}
const mkWX=()=>{WX=DAYS.map(d=>fcDay(d[0]))};
const fcWhen=()=>S.fc?'updated '+new Date(S.fc.at).toLocaleString('en-GB',{timeZone:TZ,weekday:'short',hour:'2-digit',minute:'2-digit'}).replace(',',''):'';
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
 const onTrip=DAYS.some(x=>x[0]===orlandoNow().date);
 if(!force&&!fcFail&&S.fc&&Date.now()-S.fc.at<(onTrip?20*60e3:3*3600e3))return;
 fcBusy=true;
 try{
  const r=await fetch(FC_URL,{cache:'no-store'});if(!r.ok)throw new Error(r.status);
  const j=await r.json(),h=j.hourly,d={};
  h.time.forEach((ts,k)=>{const iso=ts.slice(0,10),hr=+ts.slice(11,13);const x=d[iso]||(d[iso]={t:Array(24).fill(null),p:Array(24).fill(null),c:Array(24).fill(null)});x.t[hr]=h.temperature_2m[k];x.p[hr]=h.precipitation_probability[k];if(h.weather_code)x.c[hr]=h.weather_code[k]});
  const first=Object.keys(d).sort()[0],old=(S.fc&&S.fc.d)||{};
  // keep earlier trip days from the last download so past days still show what was forecast
  const tripDates=new Set(DAYS.map(x=>x[0]));
  for(const k in old)if(k<first&&tripDates.has(k))d[k]=old[k];
  const c=j.current;
  S.fc={at:Date.now(),d,cur:c?{time:c.time,t:c.temperature_2m,feels:c.apparent_temperature,code:c.weather_code,wind:c.wind_speed_10m,hum:c.relative_humidity_2m,rain:c.precipitation}:null};fcFail=false;mkWX();render();
 }catch(e){const was=fcFail;fcFail=true;if(!was)render()}
 finally{fcBusy=false}
}
window.addEventListener('online',()=>fetchFC(true));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)fetchFC()});
setInterval(()=>fetchFC(),5*60e3);
setTimeout(()=>fetchFC(),0);

const wxLbl=w=>w.code!=null&&!(w.storm&&w.code>=51)?WMO(w.code).toLowerCase():'';
const WMO=c=>c==null?'':c===0?'Clear':c===1?'Mainly clear':c===2?'Partly cloudy':c===3?'Cloudy':c<=48?'Fog':c<=57?'Drizzle':c<=67?'Rain':c<=77?'Snow':c<=82?'Showers':'Thunderstorms';
const isToday=di=>!!DAYS[di]&&DAYS[di][0]===orlandoNow().date;
const curFresh=()=>{const c=S.fc&&S.fc.cur;if(!c)return null;const n=orlandoNow();return c.time&&c.time.slice(0,10)===n.date&&Math.abs((+c.time.slice(11,13)*60+(+c.time.slice(14,16)))-n.min)<=180?c:null};
function nowBlock(di){
 if(!isToday(di))return '';const c=curFresh();
 if(!c)return '';
 return `<div class="wxnow"><div><span class="mute">Now in Orlando</span><b>${Math.round(c.t)}°C</b><span>${WMO(c.code)}</span></div><div class="mute">Feels like ${Math.round(c.feels)}°C · wind ${Math.round(c.wind)} km/h · humidity ${Math.round(c.hum)}%${c.rain>0?' · raining now':''}<br>Updated ${c.time.slice(11,16)} Orlando time${navigator.onLine===false?' (saved)':''}</div></div>`;
}
const wxShort=di=>{const w=WX[di];if(!w)return 'no forecast yet';const c=isToday(di)&&curFresh();
 return (c?'now '+Math.round(c.t)+'°C, '+WMO(c.code).toLowerCase():w.hi+'°C'+(w.code!=null&&!(w.storm&&w.code>=51)?', '+WMO(w.code).toLowerCase():''))+(w.storm?', showers '+fmt(w.storm[0])+'–'+fmt(w.storm[1]):'')};
const restHL=(di,w)=>{if(!isToday(di))return[w.hi,w.lo];const h=Math.floor(orlandoNow().min/60),r=w.t.slice(h).filter(x=>x!=null);return r.length?[Math.max(...r),Math.min(...r)]:[w.hi,w.lo]};
