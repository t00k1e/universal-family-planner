import pathlib, re
out = pathlib.Path('/home/user/app')
base = pathlib.Path('/home/user/live')
js = (base/'app.js').read_text()
css = (base/'app.css').read_text()
def rep(s, a, b, count=1):
    assert a in s, a[:80]
    return s.replace(a, b, count if count else -1)
js = rep(js, "if(!(S.day>=0&&S.day<12))S.day=0;", "")
trip = (out / 'src/trip.js').read_text()
js = rep(js, "const DAYS=[", "const SAMPLE=[")
js = rep(js, "'Departure day']];", "'Departure day']];\nlet DAYS=SAMPLE;")
import re as _re
wx = (out / 'src/weather.js').read_text()
js, nwx = _re.subn(r"const WX=DAYS\.map\(.*?base:Math\.round\(5\+R\(\)\*10\)\}\}\);", lambda m: "let WX=[];\n" + trip + wx, js, count=1, flags=_re.S)
assert nwx == 1
js = rep(js, "const rainAt=(di,m)=>{const w=WX[di];if(w.storm&&m>=w.storm[0]-30&&m<w.storm[1]+30)return m>=w.storm[0]&&m<w.storm[1]?w.storm[2]:Math.round(w.storm[2]/2);return w.base};",
 "const rainAt=(di,m)=>{const w=WX[di];return w?w.p[Math.max(0,Math.min(23,Math.floor(m/60)))]:0};")
js = _re.sub(r"const tempAt=\(di,m\)=>\{const w=WX\[di\];.*?\};", "const tempAt=(di,m)=>{const w=WX[di];if(!w)return null;const h=Math.max(0,Math.min(23,Math.floor(m/60)));return w.t[h]!=null?w.t[h]:w.hi};", js, count=1, flags=_re.S)
js = rep(js, "function wxPen(r,di,t){if(S.set.wx===false)return 0;", "function wxPen(r,di,t){if(S.set.wx===false||!WX[di])return 0;")
js = rep(js, "function wxStrip(di){const cells=[];", "function wxStrip(di){if(!WX[di])return `<div class=\"wx\"><p class=\"mute\" style=\"margin:0;font-size:14px\">${noFcText(di)}</p></div>`;const cells=[];")
js = rep(js, '<span class="mute">sample forecast</span>', '<span class="mute">Open-Meteo forecast${S.fc?\', \'+fcWhen():\'\'}${navigator.onLine===false?\' (saved)\':\'\'}</span>')
js = rep(js, " if(w.storm&&m<w.storm[1]&&ps(di).length)", " if(w&&w.storm&&m<w.storm[1]&&ps(di).length)")
js = rep(js, "${w.hi}°C${w.storm?', showers '+fmt(w.storm[0])+'–'+fmt(w.storm[1]):', dry'}", "${w?w.hi+'°C'+(w.storm?', showers '+fmt(w.storm[0])+'–'+fmt(w.storm[1]):', dry'):'no forecast yet'}")
js = rep(js, "${WX[i].hi}°C · ${WX[i].storm?WX[i].storm[2]+'% showers':'dry'}", "${WX[i]?WX[i].hi+'°C · '+(WX[i].storm?WX[i].storm[2]+'% showers':'dry'):'forecast later'}")
js = rep(js, "Crowd levels are sample forecasts and scale the historic wait estimates.", "Crowd levels are sample estimates and scale the historic wait estimates. Weather is the live Orlando forecast, which reaches about 16 days ahead.")
js = rep(js, "\nfill();\n", "\nfill();\napplyTrip();\n")
js = js.replace("(di===3?60:0)", "(late(di)?60:0)")
assert "di===3" not in js
js = rep(js, "Day ${di+1} of 12 ·", "Day ${di+1} of ${DAYS.length} ·")
js = rep(js, "${usd(S.daily*12)}", "${usd(S.daily*DAYS.length)}")
js = rep(js, "<p>12 days, 28 Dec to 8 Jan.", "<p>${DAYS.length} days, ${DAYS[0][1]} to ${DAYS[DAYS.length-1][1]}.")
js = rep(js, "(i===4?'Rest':i===11?'Depart':'')", "(i===DAYS.length-1&&i>0?'Depart':'Rest')")
js = js.replace("D*12", "D*DAYS.length")
js = rep(js, "for 12 days", "for ${DAYS.length} days")
js = rep(js, "avg*(11-di)", "avg*(DAYS.length-1-di)")
js = rep(js, "'All 12 days'", "'All '+DAYS.length+' days'")
js = rep(js, "(S.day<11?", "(S.day<DAYS.length-1?")
js = rep(js, "Save all 12 days,", "Save all ${DAYS.length} days,")
js = rep(js, "if(a==='dnext'&&S.day<11)", "if(a==='dnext'&&S.day<DAYS.length-1)")
js = rep(js, "S=seed();fill();render()", "S=seed();fill();tripPending=null;tripMsg='';applyTrip();syncLive();render()")
js = rep(js, "S=d;fill();render();", "S=d;fill();applyTrip();syncLive();render();")
js = rep(js, "Real Orlando time starts on 28 Dec,", "Real Orlando time starts on ${DAYS[0][1]},")
js = rep(js, '<div class="sp"><span>Dates</span><span>28 Dec 2026 – 8 Jan 2027 · 12 days</span></div>', '${tripCard()}')

js = rep(js, "function planDay(){\n const di=S.day,", "function planDay(btn){\n let picked=false;if(btn&&!(S.must[S.day]||[]).length&&ps(S.day).length){const P=ps(S.day);S.must[S.day]=P.flatMap(([p])=>RIDES.filter(r=>r.park===p).sort((a,b)=>b.pop-a.pop).slice(0,P.length>1?2:4).map(r=>r.id));picked=true}\n const di=S.day,")
js = rep(js, " S.flash=n?`${started", " S.flash=(picked?'No must-dos were picked for this day, so I used the most popular rides. Change them on Must-dos. ':'')+(n?`${started")
js = rep(js, ":'No must-dos fit the parks planned for this day.';", ":'No must-dos fit the parks planned for this day.');")

js = rep(js, """<div class="addf">${must.length?'<button type="button" class="btn" data-a="planday">Plan my day</button>':''}""", """<div class="addf">${must.length||ps(di).length?'<button type="button" class="btn" data-a="planday">Plan my day</button>':''}""")

js = rep(js, "${w?w.hi+'°C'+(w.storm?', showers '+fmt(w.storm[0])+'–'+fmt(w.storm[1]):', dry'):'no forecast yet'}", "${wxShort(di)}")
js = rep(js, "${WX[i]?WX[i].hi+'°C · '+(WX[i].storm?WX[i].storm[2]+'% showers':'dry'):'forecast later'}", "${WX[i]?WX[i].hi+'°C · '+(WX[i].storm?WX[i].storm[2]+'% showers':(WX[i].code!=null?WMO(WX[i].code).toLowerCase():'dry')):'forecast later'}")
js = rep(js, "const cells=[];for(let m=420;m<1320;m+=60){const r=rainAt(di,m);", "const cells=[],td=isToday(di),nm=orlandoNow().min;for(let m=420;m<1320;m+=60){const r=rainAt(di,m),past=td&&m+60<=nm;")
js = rep(js, '<span class="wxc" title="${fmt(m)}: ${r}% chance', '<span class="wxc${past?\' past\':\'\'}" title="${fmt(m)}: ${r}% chance')
js = rep(js, 'return `<div class="wx"><div class="row" style="font-size:14px"><span><b>${w.hi}°C</b> / ${w.lo}°C · ', 'return `<div class="wx">${nowBlock(di)}<div class="row" style="font-size:14px"><span>${td?\'<span class="mute">Rest of today · </span>\':\'\'}<b>${restHL(di,w)[0]}°C</b> / ${restHL(di,w)[1]}°C · ${wxLbl(w)?wxLbl(w)+\' · \':\'\'}')
js = rep(js, "'mostly dry'}${w.hi<20?", "'no showers expected'}${w.hi<20?")

js = rep(js, "return head+al+`<div class=\"today2\">", "return head+al+nowBlock(di)+`<div class=\"today2\">")

# Today: rides widget above budget widget; rename Waits to Ride planner
_fi = js.index('   <div class="card"><h2>Food today')
_si = js.index('   <div class="card"><h2>Shortest now')
_end = js.index('\n  </div>\n </div>`;', _si)
food = js[_fi:_si]; short = js[_si:_end]
js = js[:_fi] + short + '\n' + food.rstrip('\n') + js[_end:]
js = rep(js, "['queues','Waits']", "['queues','Ride planner']")
js = rep(js, "<h1>Waits</h1>", "<h1>Ride planner</h1>")
js = rep(js, ">All waits ›</a>", ">Ride planner ›</a>")

# ---- Merge Waits / Plan / Must-dos into one Ride planner ----
rides = (out / 'src/rides.js').read_text()
js = rep(js, "function viewQueues(){", "function viewQueuesOld(){")
js = rep(js, "\nconst route=()=>", "\n" + rides + "\nconst route=()=>")
js = rep(js, "if(a==='planday')planDay();", "if(a==='planday')planDay(true);")
js = rep(js, "if(v==='queues'){$('#sort').value=S.sort;$('#crowd').value=ck(S.day);", "if(v==='queues'){const so=$('#sort');if(so)so.value=S.sort;const cw=$('#crowd');if(cw)cw.value=ck(S.day);")
js = rep(js, "['queues','Ride planner'],['planner','Plan'],['g','Before the trip'],['calendar','Calendar'],['mustdos','Must-dos'],", "['queues','Ride planner'],['g','Before the trip'],['calendar','Calendar'],")
js = rep(js, "h==='more'||(h!=='g'&&NAV.some(n=>n[0]===h))", "['more','planner','mustdos'].includes(h)||(h!=='g'&&NAV.some(n=>n[0]===h))")
js = rep(js, "const tab=['calendar','mustdos','budget','settings'].includes(v)?'more':v;", "const tab=['calendar','settings'].includes(v)?'more':['planner','mustdos'].includes(v)?'queues':v;")
js = rep(js, '<a href="#mustdos" class="card mlink"><b>Must-dos</b><span>Pick the rides you can\'t miss</span></a>', '<a href="#planner" class="card mlink"><b>Edit a day</b><span>Add meals, hops and change times</span></a>')
js = rep(js, '<a href="#budget" class="card mlink"><b>Spend</b><span>Food and whole-trip budget</span></a>', '<a href="#dining" class="card mlink"><b>Eat</b><span>Restaurants, map and ratings</span></a>')

css = css.rstrip() + """
/* Trip dates (2026-11-26) */
.trd{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.trd label{display:grid;gap:4px;font-size:14px;font-weight:600}
.trd input{font:inherit;font-size:16px;border:1px solid var(--line);border-radius:8px;padding:8px;background:var(--bg);color:var(--ink);min-height:42px;width:100%;box-sizing:border-box}
@media(max-width:900px){main select{max-width:100%;min-width:0}}
.wxnow{display:grid;gap:4px;padding:10px 12px;margin:0 0 12px;border-radius:10px;background:var(--soft)}
.wxnow>div:first-child{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}
.wxnow b{font-size:30px;line-height:1;font-variant-numeric:tabular-nums}
.wxnow .mute{font-size:13.5px}
.wxc.past{opacity:.35}
/* Ride planner */
.rseg{margin:0 0 14px;flex-wrap:wrap}.rseg small{font-size:11px;opacity:.7;font-weight:500}
.rgrid2{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:18px;align-items:start}
.sh{font-size:18px;display:flex;justify-content:space-between;align-items:baseline;gap:8px;flex-wrap:wrap;margin:0 0 4px}.sh small{font:500 13px var(--sans);color:var(--mute)}
.rlist{display:grid;gap:10px}
.rcard{display:grid;grid-template-columns:88px minmax(0,1fr) 48px;background:var(--bg);border:1px solid var(--line);border-radius:14px;overflow:hidden;align-items:stretch}
.rcard.on{border-color:var(--sea2);box-shadow:0 0 0 1px var(--sea2)}
.rart{all:unset;cursor:pointer;display:grid;place-items:center;align-content:center;gap:4px;color:#fff;font-size:11px;font-weight:600;text-align:center;padding:10px 4px;background:radial-gradient(circle at 30% 20%,color-mix(in srgb,#fff 28%,var(--c)) 0,var(--c) 55%,color-mix(in srgb,#000 22%,var(--c)) 100%)}
.rart:focus-visible{outline:2px solid var(--acc);outline-offset:-3px}
.rbody{display:grid;gap:3px;padding:10px 12px;align-content:center}.rbody>b{font-size:16px;line-height:1.2}.rbody .mute{font-size:13px}
.best{font-size:13.5px;color:var(--ink)}.best b{color:var(--sea2);font-variant-numeric:tabular-nums}
.inplan{font-size:12.5px;font-weight:600;color:var(--ok)}
.spark{display:flex;align-items:flex-end;gap:2px;height:20px;margin-top:2px}.spark i{flex:1;background:color-mix(in srgb,var(--sea2) 45%,transparent);border-radius:2px 2px 0 0;min-height:2px}
.heart{all:unset;cursor:pointer;display:grid;place-items:center;font-size:26px;color:var(--acc);border-left:1px solid var(--line)}
.heart[aria-pressed=false]{color:var(--mute)}
.heart:focus-visible{outline:2px solid var(--acc);outline-offset:-3px}
.tl{padding:8px 14px}
.tli{display:grid;grid-template-columns:3.2em 34px minmax(0,1fr) 36px;gap:10px;align-items:center;padding:9px 0;border-bottom:1px solid var(--line);position:relative}
.tli .tlt{font-weight:700;font-variant-numeric:tabular-nums}
.tld{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:var(--c);color:#fff}
.tln{display:grid;gap:2px}.tln .mute{font-size:12.5px}
.tli.done .tln b{text-decoration:line-through;color:var(--mute)}
.tli .ck{width:30px;height:30px;border:1.5px solid var(--line);border-radius:8px;background:var(--bg);cursor:pointer;color:var(--ok);font-weight:700}
.tli.done .ck{border-color:var(--ok)}
.pickbar{display:none}
.rgrid2 input[type=search]{border:1px solid var(--line);border-radius:10px;padding:10px 12px;font:inherit;font-size:16px;background:var(--bg);color:var(--ink);min-height:44px}
.pickbar span{line-height:1.25}
@media(max-width:900px){.rgrid2{grid-template-columns:minmax(0,1fr)}
 .pickbar{display:flex;position:fixed;left:8px;right:8px;bottom:calc(var(--tabh) + 8px + env(safe-area-inset-bottom));z-index:3;align-items:center;justify-content:space-between;gap:10px;background:var(--ink);color:var(--bg);border-radius:14px;padding:8px 8px 8px 14px;font-size:14px;box-shadow:0 6px 20px rgba(0,0,0,.18)}
 .pickbar .btn{background:var(--ambl);color:#1B2B34;min-height:38px}
 main{padding-bottom:calc(var(--tabh) + 84px + env(safe-area-inset-bottom))}}
"""
(out/'app.css').write_text(css)
(out/'app.js').write_text(js)
print('ok', len(css), len(js))
