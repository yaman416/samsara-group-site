# Live broadcast overlays (SPL Season 3)

Three OBS browser-source pages, served by the site, that follow the live score entered in the admin portal.

| Page | What it shows |
|---|---|
| `/broadcast/scoreboard.html` | Scoreboard top left (crests, short codes, score, match clock), "Presented by SBA Property Group", a GOAL pop-up for 8 seconds after each goal tap, scrolling partner bar along the bottom. Transparent. |
| `/broadcast/break.html` | Full-screen break card. Title follows the match: KICK-OFF SOON, HALF TIME, FULL TIME (SHORT BREAK during play). Live score, rotating partner wall, UP NEXT fixture on the same ground. |
| `/broadcast/lower-third.html` | Second-camera name strap (name, role, club crest) plus a small score badge top right. Transparent. |

## OBS setup
Add each as a **Browser** source, untick *Local file*, paste the URL, width **1920**, height **1080**.
Put the scoreboard on the match scene, the break page on its own scene, and the lower third on the second-camera scene.

The pages scale to fit any window, so they also work in a normal browser tab. Add `?preview=1` to see them on a grass-coloured backdrop (never in OBS).

URL options:
- any page: `?fixture=<fixture id>` pins a match (e.g. a second stream on the other ground). Without it the page shows the match set on stream in the admin portal.
- scoreboard: `?ticker=0` hides the partner bar, `?presented=0` hides the SBA tag, `?speed=50` slows the bar.
- break: `?title=Drinks%20Break` sets a fixed title, `?rotate=8` seconds per partner page.
- lower third: `?score=0` hides the score badge, `?name=..&role=..` fixed text instead of the portal.

## Match day in the admin portal (Matchday tab)
1. **Live stream** card: choose the match on stream. The first tap on any match also puts it on stream if none is set.
2. In the match card: **Kick-off**, then **+ Goal** for the team that scored (no player needed). **Undo goal** fixes a mis-tap. **Half-time**, **2nd half**, **Full time**. The clock counts from the Kick-off and 2nd half taps (30-minute halves by default).
3. Lower third: type name and role, pick the club, **Show** / **Hide**.
4. After full time: **Enter result**. The score and one blank goal row per goal are filled in from the live score. Type each scorer's jersey number (it picks the player), add cards, and save. Rows left blank are saved as unknown scorers. The league table only changes on this save.

## How it works
- Tables `live_matches` and `broadcast_state` (RLS on, no policies; written only by `/api/admin/live` with the service role).
- `/api/public/live` returns names, crests, score, period and lower-third text only (no player data). The pages poll it every 1.5 seconds; it is CDN-cached for 1 second.
