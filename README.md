# SOUNDNAV — product page

A static product page for the SOUNDNAV smart audio navigation helmet: a student design project for VTU `1BIDTL158`.

The page tells the project story in order — the glance problem, the display-to-audio pivot, the intended system, the 3D helmet anatomy, the five-cue language, the build status, peer feedback and what comes next. It deliberately separates what runs on the bench from what is simulated and what is still only a render.

## Run

No build step, no package manager. Serve the folder (ES modules and the Three.js import map need HTTP):

```powershell
cd soundnav
python -m http.server 4322 --bind 127.0.0.1
```

Open `http://127.0.0.1:4322/`.

The page also works from any static host. Opening `index.html` directly from disk will block the ES modules in most browsers.

## Deploy

Import the repository at [vercel.com/new](https://vercel.com/new) and deploy. `vercel.json` already sets the framework preset to Other, skips the install and build steps, and serves the repository root, so no settings need changing in the dashboard.

## Files

```
index.html          page markup and copy
css/style.css       all styling
js/main.js          nav, cue previews, route simulation, system tabs, part list
js/helmet.js        parametric Three.js helmet model and viewer
vendor/             Three.js r169, OrbitControls, RoomEnvironment
assets/fonts/       Archivo variable, IBM Plex Mono 400/500
dev.html            minimal 3D test harness (not part of the page)
```

## What is real, simulated, or missing

| Area | Status |
| --- | --- |
| Helmet form | Parametric Three.js model. No print, no fit test. |
| ESP32 cue firmware | Built. L / R / U / D / C tone patterns on a passive piezo. |
| Power chain | Built. Protected 1S LiPo → TP4056 → MT3608 5 V → ESP32-C3. |
| Browser → ESP32 link | Built for buzzer commands. Range and latency not measured. |
| Map and route | Simulated in the browser. No live GPS. |
| Spoken guidance | Browser speech preview. No DFPlayer wiring or MP3 set. |
| Voice commands | Scripted demo. MAX9814 not connected. |
| MAX9814 / DFPlayer / speakers | On hand, not integrated. |
| Road test | Not run. No noise measurement, no rider trial, no safety claim. |

The 3D shell was modelled directly in Three.js; Tripo and Meshy models could not be exported without a paid plan.

## Notes

- Cue tones are synthesized locally with the Web Audio API. Nothing is uploaded or tracked.
- The voice preview uses the browser's speech synthesizer and is not the intended DFPlayer output.
- The helmet viewer supports orbit, preset views, explode, cutaway and x-ray. Part buttons below the model select and describe each part.
- `prefers-reduced-motion` disables the hero auto-rotation and reveal transitions.
- The page is a student project, not a safety, medical or roadworthiness claim.
