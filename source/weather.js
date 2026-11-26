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
