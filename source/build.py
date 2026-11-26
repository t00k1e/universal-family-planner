import re, pathlib
src = pathlib.Path('/home/user/proto/index.html').read_text()
out = pathlib.Path('/home/user/app')
extra = (out / 'src/extra.js').read_text()

css = src.split('<style>', 1)[1].split('</style>', 1)[0]
js = src.split('<script>', 1)[1].split('</script>', 1)[0]
body = src.split('<body>', 1)[1].split('<script>', 1)[0]

def rep(s, a, b, count=1):
    assert a in s, a[:80]
    return s.replace(a, b, count if count else -1)

# ---------- CSS ----------
SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,system-ui,sans-serif"
css = css.replace('Outfit,Inter,sans-serif', SANS).replace('Inter,system-ui,sans-serif', SANS)
css = css.replace('Outfit,sans-serif', SANS).replace('Inter,sans-serif', SANS)
css = css.replace('TYPE Outfit for figures and titles, Inter for UI', 'TYPE system fonts (San Francisco on iPhone, Roboto on Android)')
css += r"""
/* ---------- Phone app (PWA) ---------- */
html{-webkit-text-size-adjust:100%;-webkit-tap-highlight-color:transparent}
.tabbar,.tclock{display:none}
.mlinks{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.mlink{text-decoration:none;color:var(--ink);display:grid;gap:4px}
.mlink b{font:600 17px/1.2 var(--sans)}
.mlink span{font-size:13.5px;color:var(--mute)}
.dm{background:var(--soft);color:var(--ink);border-radius:10px;padding:10px 12px;margin-top:6px}
.dm input{width:100%}
.trd{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.trd label{display:grid;gap:4px;font-size:14px;font-weight:600}
.trd input{font:inherit;font-size:16px;border:1px solid var(--line);border-radius:8px;padding:8px;background:var(--bg);color:var(--ink);min-height:42px;width:100%;box-sizing:border-box}
textarea{font-size:16px}
@media(max-width:900px){
 :root{--tabh:64px}
 .side{display:none}
 .app{display:block;height:auto}
 .col{display:block;height:auto;overflow:visible}
 .topbar{position:sticky;top:0;z-index:4;padding:calc(8px + env(safe-area-inset-top)) max(12px,env(safe-area-inset-right)) 8px max(12px,env(safe-area-inset-left));gap:8px;flex-wrap:nowrap}
 .dayctl{gap:6px}.dayctl b{min-width:0;font-size:15px;white-space:nowrap}
 .tclock{display:inline-flex;align-items:center;gap:4px;font:700 16px var(--sans);color:var(--ink);text-decoration:none;font-variant-numeric:tabular-nums;white-space:nowrap}
 .tclock i{font-style:normal;font-size:11px;font-weight:700;color:var(--sea2);border:1px solid var(--sea2);border-radius:5px;padding:0 4px}
 .offb{font-size:12px;padding:0 8px;white-space:nowrap;min-width:32px}
 .dn,.ol{display:none}
 .dm .row{color:var(--ink)}
 .dm input{accent-color:var(--sea2)}
 main{padding:14px max(12px,env(safe-area-inset-left)) calc(var(--tabh) + 24px + env(safe-area-inset-bottom)) max(12px,env(safe-area-inset-right))}
 h1{font-size:26px}
 .hd p{font-size:14px}
 .tabbar{display:grid;grid-template-columns:repeat(5,1fr);position:fixed;left:0;right:0;bottom:0;z-index:4;background:var(--bg);border-top:1px solid var(--line);padding:0 env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)}
 .tabbar a{display:grid;justify-items:center;align-content:center;gap:2px;height:var(--tabh);color:var(--mute);text-decoration:none;font-size:11.5px;font-weight:600}
 .tabbar svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
 .tabbar a.on{color:var(--sea2)}
 .tabbar a.on svg{stroke-width:2.3}
 .modal{place-items:end stretch;padding:0}
 .mbox{width:100%!important;max-width:none;border-radius:18px 18px 0 0;padding:18px max(16px,env(safe-area-inset-right)) calc(18px + env(safe-area-inset-bottom)) max(16px,env(safe-area-inset-left));max-height:88vh!important;overflow-y:auto}
 .mbox input,.mbox select,input,select{font-size:16px}
 .mlinks{grid-template-columns:repeat(2,minmax(0,1fr))}
 main select{max-width:100%;min-width:0}
 .grid2,.grid3{grid-template-columns:minmax(0,1fr)!important}
}
@media(display-mode:standalone){body{overscroll-behavior-y:none}}
"""
css = css.replace(':root{color-scheme:light dark;', ':root{--sans:' + SANS + ';color-scheme:light dark;', 1)

# ---------- HTML body ----------
body = rep(body, '<div class="brand">Family holiday planner<small>Universal Orlando · prototype</small></div>',
           '<div class="brand">Family holiday planner<small>Universal Orlando trips</small></div>')
body = rep(body, '<span style="flex:1"></span><button type="button" class="ib offb" id="offb" data-a="offline"></button>',
           '<span style="flex:1"></span><a href="#more" class="tclock" id="tclock" aria-label="Time settings"></a><button type="button" class="ib offb" id="offb" data-a="offline"></button>')
ICON = {
 'today': '<path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z"/>',
 'queues': '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
 'planner': '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1.2"/><circle cx="4.5" cy="12" r="1.2"/><circle cx="4.5" cy="18" r="1.2"/>',
 'dining': '<path d="M7 3v8M4.5 3v5a2.5 2.5 0 0 0 5 0V3M7 11v10M17 21V3c-2.2 1-3.5 3.5-3.5 7v3H17"/>',
 'more': '<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>',
}
TABS = [('today', 'Today'), ('queues', 'Waits'), ('planner', 'Plan'), ('dining', 'Eat'), ('more', 'More')]
tabbar = '<nav class="tabbar" id="tabbar" aria-label="Main">' + ''.join(
    f'<a href="#{k}" data-t="{k}"><svg viewBox="0 0 24 24" aria-hidden="true">{ICON[k]}</svg>{l}</a>' for k, l in TABS) + '</nav>'
body = rep(body, '\n<div class="modal" id="rpm"', '\n' + tabbar + '\n<div class="modal" id="rpm"')

# ---------- JS ----------
js = js.replace("'uohp-proto-2'", "'fhp-app-1'")
js = rep(js, "if(window.claude?.hot?.data&&window.claude.hot.data.it)S=window.claude.hot.data;\n", "")
js = rep(js, "window.claude?.hot?.snapshot?.(()=>S);\n", "if(navigator.onLine===false)S.offline=true;\n")
js = rep(js, "const route=()=>{let h=location.hash.slice(1);if(h==='itinerary')h='planner';return h!=='g'&&NAV.some(n=>n[0]===h)?h:'today'};",
         extra + "\nconst route=()=>{let h=location.hash.slice(1);if(h==='itinerary')h='planner';return h==='more'||(h!=='g'&&NAV.some(n=>n[0]===h))?h:'today'};")
js = rep(js, ":v==='budget'?viewBudget():viewSettings());", ":v==='budget'?viewBudget():v==='more'?viewMore():viewSettings());")
js = rep(js, " $('#clock').value=S.clock;$('#clockv').textContent=fmt(S.clock);",
         " $('#clock').value=S.clock;$('#clockv').textContent=fmt(S.clock);\n"
         " $('#tclock').innerHTML=fmt(S.clock)+(liveState()==='on'?'':'<i>DEMO</i>');\n"
         " const tab=['calendar','mustdos','budget','settings'].includes(v)?'more':v;document.querySelectorAll('#tabbar a').forEach(x=>{const on=x.dataset.t===tab;x.classList.toggle('on',on);on?x.setAttribute('aria-current','page'):x.removeAttribute('aria-current')});\n"
         " if(rendered!==v){rendered=v;scrollTo(0,0)}")
js = rep(js, "function render(){", "let rendered=null;\nfunction render(){")
js = rep(js, "$('#daylbl').textContent=`Day ${S.day+1} · ${DAYS[S.day][1]}`;", "$('#daylbl').innerHTML=`<span class=\"dn\">Day ${S.day+1} · </span>${DAYS[S.day][1]}`;")
js = rep(js, "`Offline${qn?' · '+qn+' to sync':''}`:'● Saved offline';", "`Offline${qn?'<span class=\"ol\"> · '+qn+' to sync</span>':''}`:'●<span class=\"ol\"> Saved offline</span>';$('#offb').setAttribute('aria-label',S.offline?'Offline'+(qn?', '+qn+' to sync':''):'Saved offline');")
js = rep(js, "if(a==='dprev'&&S.day>0){S.day--;", "if(a==='dprev'&&S.day>0){S.follow=false;S.day--;")
js = rep(js, "if(a==='dnext'&&S.day<11){S.day++;", "if(a==='dnext'&&S.day<11){S.follow=false;S.day++;")
js = rep(js, "if(a==='calday'){S.day=", "if(a==='calday'){S.follow=false;S.day=")
js = rep(js, " if(id==='clock'){S.clock=+e.target.value;render()}", " if(id==='clock'||id==='clockm'){S.clock=+e.target.value;render()}")
js = rep(js, "  if(f==='offline'){", "  if(f==='live'){S.live=el.checked;S.follow=true;syncLive()}\n  if(f==='offline'){")
js = rep(js, "window.addEventListener('hashchange',render);\nrender();",
         "window.addEventListener('hashchange',render);\nsyncLive();\nrender();")

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
js = rep(js, "fill();\nif(navigator.onLine===false)", "fill();\napplyTrip();\nif(navigator.onLine===false)")
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

(out / 'app.css').write_text(css.strip() + '\n')
(out / 'app.js').write_text(js.strip() + '\n')

head = """<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Family holiday planner</title>
<meta name="description" content="Day-by-day plan, ride waits, dining and spending for the Orlando family trip.">
<meta name="theme-color" content="#0E5A6B" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#141d21" media="(prefers-color-scheme: dark)">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icons/icon-192.png" type="image/png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Holiday">
<link rel="stylesheet" href="app.css">
</head>
<body>"""
(out / 'index.html').write_text(head + body.rstrip() + '\n<script src="app.js"></script>\n</body>\n</html>\n')
print('ok', len(css), len(js))
