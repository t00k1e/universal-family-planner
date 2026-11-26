import re, pathlib
p = pathlib.Path('/home/user/app/index.html'); s = p.read_text()
if 'data-t="planner"' in s:
    s, n = re.subn(r'<a href="#planner" data-t="planner">.*?</a>', '', s, count=1); assert n == 1
if 'data-t="budget"' not in s:
    spend = '<a href="#budget" data-t="budget"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18M16 14.5h2"/></svg>Spend</a>'
    s, n = re.subn(r'(<a href="#dining" data-t="dining">.*?</a>)', lambda m: m.group(1) + spend, s, count=1); assert n == 1
p.write_text(s)
print(re.findall(r'data-t="([a-z]+)"', s))
