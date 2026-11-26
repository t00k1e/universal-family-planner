# Family holiday planner: phone app, first version

An installable web app (PWA). One set of files runs on iPhone and Android: open the link, add it to the home screen, and it opens full screen like a normal app and works without signal.

## What's in v1

- Bottom tabs: Today, Waits, Plan, Eat, More (Calendar, Must-dos, Spend, Settings).
- Everything from the desktop prototype: historic wait estimates, Plan my day, Re-plan from here, must-dos, dining list and map with ratings, weather, Express, early park admission, food and whole-trip budget.
- Your own trip dates (Settings → Trip). Pick the first and last day, up to 30 days, and the app builds the days with a suggested park for each. Changing dates starts a fresh plan, so the app asks first. Reset in More goes back to the sample trip.
- Real Orlando time, on by default (More → Time). During the trip the app follows the date and time in Orlando. Before and after the trip it uses the demo clock.
- Live Orlando weather from Open-Meteo (free, no key). It covers about 16 days ahead; days further out say when their forecast will appear. The last download is kept for offline use and refreshed every 3 hours when there is signal. Live weather needs the app online at its own address: the Claude preview link blocks outside services, so it shows a message there instead.
- Plan my day with no must-dos picked uses the most popular rides for that park, which you can then change.
- Works offline. The service worker keeps the app on the phone. Spends logged with no signal are queued and marked synced when signal returns.
- Data is saved on each phone. More → Your data copies it to another phone. Family sync comes later.
- Waits, crowd levels and restaurants are samples: waits are estimates, not live Universal data. Not affiliated with Universal.

## Files

| File | What it is |
|---|---|
| `index.html` | Page shell and bottom tabs |
| `app.css` | Styles, including the phone layout |
| `app.js` | The app |
| `manifest.webmanifest` | Name, icon and colours for installing |
| `sw.js` | Offline support |
| `icons/` | Home-screen icons |

## Put it online (free, about 5 minutes)

It needs to be served over https so phones will install it. Pick one option:

1. **Netlify Drop (easiest).** Go to app.netlify.com/drop and drag the `phone-app` folder (or unzip `phone-app.zip` first) onto the page. You get a link like `https://something.netlify.app`. Make a free account to keep it.
2. **GitHub Pages.** Put these files in a repository, then go to Settings → Pages → Deploy from branch → main / root.
3. **Vercel or Cloudflare Pages.** Both work the same way: import the folder as a static site with no build step.

## Install on a phone

- **iPhone:** open the link in Safari, tap Share, then Add to Home Screen.
- **Android:** open the link in Chrome, tap ⋮, then Install app. Some phones show an Install banner instead.

## Updating

Change the files and upload them again. Phones get the new version the next time the app opens with signal. If you change `app.css` or `app.js`, also change `CACHE` in `sw.js` to the next number (it's `fhp-v4` now) so old copies are cleared.

## Next steps

- Family sync and sign-in with Supabase, as the spec describes.
- Hotel, ticket and party size set-up (dates are done).
- Push reminders (iPhone supports these for home-screen apps from iOS 16.4).
- If you want app store listings later, wrap this same code with Capacitor.
