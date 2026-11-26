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

js = rep(js, "function planDay(){\n const di=S.day,", "function planDay(){\n let picked=false;if(!(S.must[S.day]||[]).length&&ps(S.day).length){const P=ps(S.day);S.must[S.day]=P.flatMap(([p])=>RIDES.filter(r=>r.park===p).sort((a,b)=>b.pop-a.pop).slice(0,P.length>1?2:4).map(r=>r.id));picked=true}\n const di=S.day,")
js = rep(js, " S.flash=n?`${started", " S.flash=(picked?'No must-dos were picked for this day, so I used the most popular rides. Change them on Must-dos. ':'')+(n?`${started")
js = rep(js, ":'No must-dos fit the parks planned for this day.';", ":'No must-dos fit the parks planned for this day.');")

js = rep(js, """<div class="addf">${must.length?'<button type="button" class="btn" data-a="planday">Plan my day</button>':''}""", """<div class="addf">${must.length||ps(di).length?'<button type="button" class="btn" data-a="planday">Plan my day</button>':''}""")

css = css.rstrip() + """
/* Trip dates (2026-11-26) */
.trd{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.trd label{display:grid;gap:4px;font-size:14px;font-weight:600}
.trd input{font:inherit;font-size:16px;border:1px solid var(--line);border-radius:8px;padding:8px;background:var(--bg);color:var(--ink);min-height:42px;width:100%;box-sizing:border-box}
@media(max-width:900px){main select{max-width:100%;min-width:0}}
"""
(out/'app.css').write_text(css)
(out/'app.js').write_text(js)
print('ok', len(css), len(js))
