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
