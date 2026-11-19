import { createHelmetViewer } from "./helmet.js";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ */
/* navigation                                                          */
/* ------------------------------------------------------------------ */

const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");

function closeMenu() {
  document.body.classList.remove("menu-open");
  navToggle?.setAttribute("aria-expanded", "false");
  if (navToggle) navToggle.lastChild.textContent = " Menu";
}
navToggle?.addEventListener("click", () => {
  const open = document.body.classList.toggle("menu-open");
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.lastChild.textContent = open ? " Close" : " Menu";
});
navLinks?.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

const navAnchors = [...document.querySelectorAll(".nav-links a[href^='#']")];
const navSections = navAnchors
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);
if ("IntersectionObserver" in window) {
  const navIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach((a) => {
          a.setAttribute("aria-current", a.getAttribute("href") === `#${entry.target.id}` ? "true" : "false");
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  navSections.forEach((s) => navIO.observe(s));
}

/* ------------------------------------------------------------------ */
/* reveal                                                              */
/* ------------------------------------------------------------------ */

if (!reduceMotion && "IntersectionObserver" in window) {
  const revealIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealIO.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealIO.observe(el));
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
}

/* ------------------------------------------------------------------ */
/* 3D viewers                                                          */
/* ------------------------------------------------------------------ */

let heroViewer = null;
let anatomyViewer = null;

function showViewerFallback(el, message) {
  if (!el) return;
  el.innerHTML = `<p class="mono" style="position:absolute;inset:0;display:grid;place-content:center;padding:24px;color:#8d959b;text-align:center;max-width:36ch;margin:auto">${message}</p>`;
}

try {
  heroViewer = createHelmetViewer(document.getElementById("hero-viewer"), {
    hero: true,
    autoRotate: !reduceMotion,
  });
} catch (err) {
  console.warn("Hero 3D viewer unavailable:", err);
  showViewerFallback(
    document.getElementById("hero-viewer"),
    "The 3D helmet could not start in this browser. It is a digital concept model — the written build status below is the full record."
  );
}

/* part data */
const PARTS = {
  shell: {
    title: "Shell + chin bar",
    copy:
      "A full-face shell generated parametrically: a deformed ellipsoid with a rounded eyeport and a lower neck opening. The chin bar is a separate dark panel on the same surface, with a vent and visor hinge plates. It was built directly in Three.js because the Tripo and Meshy exports required a paid plan. This is geometry only — the shell has not been printed or fitted.",
    status: "Digital concept",
    statusClass: "tag--sim",
    extra: "No print / no fit test",
    extraClass: "tag--none",
    view: "three",
  },
  visor: {
    title: "Visor",
    copy:
      "A smoke visor fitted to the eyeport, reaching back to the temple hinges. It exists because the original HUD optic did not: the combiner, projector and eye box were removed when the project pivoted to audio in November 2026. The dark trim is a design detail, not a light.",
    status: "Digital concept",
    statusClass: "tag--sim",
    extra: "No optics",
    extraClass: "tag--none",
    view: "front",
  },
  bay: {
    title: "Rear control bay",
    copy:
      "The rear pod holds the ESP32-C3, DFPlayer Mini, TP4056 charger, MT3608 boost, MAX9814 and a protected 1S LiPo. The bench build uses the ESP32, charger, boost and piezo only; the rest are placed in the model, not wired. The cover lifts away in the exploded view.",
    status: "Partly built",
    statusClass: "tag--sim",
    extra: "No enclosure print",
    extraClass: "tag--none",
    view: "rear",
  },
  audio: {
    title: "Audio pods",
    copy:
      "Two ear pods with 3 W speakers and a hi-vis ring. The speakers are on hand but have not been connected to the DFPlayer or mounted in a helmet. The pods are a concept for the output stage, not a tested acoustic design.",
    status: "Parts only",
    statusClass: "tag--none",
    extra: "Not wired",
    extraClass: "tag--none",
    view: "side",
  },
  mic: {
    title: "Microphone",
    copy:
      "A MAX9814 microphone module is reserved for voice commands. In the intended loop it feeds the ESP32, which passes audio to the phone for recognition. On the bench it is not connected; the voice-command path on this page is a scripted simulation.",
    status: "Parts only",
    statusClass: "tag--none",
    extra: "Not integrated",
    extraClass: "tag--none",
    view: "front",
  },
  pads: {
    title: "Liner + pads",
    copy:
      "Cheek pads, a neck roll and a brow pad complete the interior. They are modelled to show where the electronics and ear pods sit relative to a wearer. Comfort, heat and fit have not been tested.",
    status: "Digital concept",
    statusClass: "tag--sim",
    extra: "No comfort test",
    extraClass: "tag--none",
    view: "side",
  },
};

try {
  anatomyViewer = createHelmetViewer(document.getElementById("anatomy-viewer"), {
    hero: false,
    autoRotate: false,
  });
} catch (err) {
  console.warn("Anatomy 3D viewer unavailable:", err);
  showViewerFallback(
    document.getElementById("anatomy-viewer"),
    "The 3D anatomy viewer could not start. Every part is described in the list beside this panel."
  );
}

const partButtons = [...document.querySelectorAll(".part-btn")];
const partTitle = document.getElementById("part-title");
const partCopy = document.getElementById("part-copy");
const partStatus = document.getElementById("part-status");
const partExtra = document.getElementById("part-extra");

function selectPart(id) {
  const data = PARTS[id];
  if (!data) return;
  partButtons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.part === id)));
  if (partTitle) partTitle.textContent = data.title;
  if (partCopy) partCopy.textContent = data.copy;
  if (partStatus) {
    partStatus.textContent = data.status;
    partStatus.className = `tag ${data.statusClass}`;
  }
  if (partExtra) {
    partExtra.textContent = data.extra;
    partExtra.className = `tag ${data.extraClass}`;
  }
  if (anatomyViewer) {
    anatomyViewer.select(id);
    if (data.view) {
      anatomyViewer.setPreset(data.view);
      document.querySelectorAll("[data-view]").forEach((b) => {
        b.setAttribute("aria-pressed", String(b.dataset.view === data.view));
      });
    }
  }
}

partButtons.forEach((btn) => btn.addEventListener("click", () => selectPart(btn.dataset.part)));

const viewButtons = [...document.querySelectorAll("[data-view]")];
viewButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    viewButtons.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    anatomyViewer?.setPreset(btn.dataset.view);
  });
});

const btnExplode = document.getElementById("btn-explode");
const btnCutaway = document.getElementById("btn-cutaway");
const btnGhost = document.getElementById("btn-ghost");

btnExplode?.addEventListener("click", () => {
  const on = btnExplode.getAttribute("aria-pressed") !== "true";
  btnExplode.setAttribute("aria-pressed", String(on));
  anatomyViewer?.setExplode(on ? 1 : 0);
});
btnCutaway?.addEventListener("click", () => {
  const on = btnCutaway.getAttribute("aria-pressed") !== "true";
  btnCutaway.setAttribute("aria-pressed", String(on));
  anatomyViewer?.setCutaway(on ? 1 : 0);
  if (on) {
    anatomyViewer?.setPreset("side");
    viewButtons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.view === "side")));
  }
});
btnGhost?.addEventListener("click", () => {
  const on = btnGhost.getAttribute("aria-pressed") !== "true";
  btnGhost.setAttribute("aria-pressed", String(on));
  anatomyViewer?.setGhost(on);
});

/* ------------------------------------------------------------------ */
/* system tabs                                                         */
/* ------------------------------------------------------------------ */

const SYSTEM = {
  mic: {
    kicker: "01 / IN",
    title: "Microphone captures a voice command",
    copy:
      "The MAX9814 module amplifies an electret capsule. In the intended loop the ESP32 samples it and hands the audio to the phone, which does the speech recognition. This is the part that makes hands-free control possible — and it is not wired yet.",
    status: "Available, not integrated",
    exists: "A MAX9814 module is on the bench, unmounted.",
    missing: "No capture path, gain calibration or on-device speech pipeline.",
    node: "mic",
  },
  esp32: {
    kicker: "02 / BRIDGE",
    title: "ESP32-C3 turns commands into sound",
    copy:
      "The ESP32 is the bridge between the phone and the audio hardware. In the bench build it receives a cue command and drives a passive piezo through a series resistor. In the intended build it also triggers the DFPlayer and reads the microphone.",
    status: "Bench firmware built",
    exists: "Cue firmware for L / R / U / D / C, powered from a protected LiPo and 5 V boost.",
    missing: "The mic and DFPlayer paths; a sealed enclosure; a documented radio range.",
    node: "esp32",
  },
  phone: {
    kicker: "03 / ROUTE",
    title: "Phone computes the next cue",
    copy:
      "The browser holds the route and decides when a cue is due. In the bench demo, a cue command is sent to the ESP32-C3. In the intended build, the phone also handles speech recognition and sends short phrases to the DFPlayer. The map on this page is a simulation, not live GPS.",
    status: "Simulated in the browser",
    exists: "A demo route, timed cue sequence and browser voice preview.",
    missing: "Live GPS, a mounted phone, and any on-road trial.",
    node: "phone",
  },
  dfplayer: {
    kicker: "04 / OUT",
    title: "DFPlayer plays the spoken phrase",
    copy:
      "The DFPlayer Mini stores short MP3 phrases on an SD card and outputs line-level audio. It is the intended voice source for the helmet: five phrases, triggered by the ESP32. It is on hand but has not been wired or loaded with a phrase set.",
    status: "Available, not integrated",
    exists: "A DFPlayer Mini and microSD card.",
    missing: "A recorded phrase set, wiring, and amplifier/speaker matching.",
    node: "dfplayer",
  },
  speakers: {
    kicker: "05 / SOUND",
    title: "Ear pods put the cue near the ear",
    copy:
      "Two small speakers sit in the ear pods, close to the ear but not sealed like earbuds. The open design is deliberate: the rider must still hear traffic. Whether the cue is intelligible without masking the road is an open question that needs measurement.",
    status: "Available, not integrated",
    exists: "Two 3 W speakers and a modelled ear-pod housing.",
    missing: "Mounting, amplifier, level calibration and a noise test.",
    node: "speakers",
  },
};

const systemTabs = [...document.querySelectorAll(".system-tab")];
const systemNodes = [...document.querySelectorAll("[data-node]")];
const detailKicker = document.getElementById("detail-kicker");
const detailTitle = document.getElementById("detail-title");
const detailCopy = document.getElementById("detail-copy");
const detailStatus = document.getElementById("detail-status");
const detailExists = document.getElementById("detail-exists");
const detailMissing = document.getElementById("detail-missing");

function showSystem(id) {
  const data = SYSTEM[id];
  if (!data) return;
  systemNodes.forEach((n) => n.setAttribute("aria-pressed", String(n.dataset.node === id)));
  if (detailKicker) detailKicker.textContent = data.kicker;
  if (detailTitle) detailTitle.textContent = data.title;
  if (detailCopy) detailCopy.textContent = data.copy;
  if (detailStatus) detailStatus.textContent = data.status;
  if (detailExists) detailExists.textContent = data.exists;
  if (detailMissing) detailMissing.textContent = data.missing;
}

systemNodes.forEach((node) => node.addEventListener("click", () => showSystem(node.dataset.node)));

systemTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    systemTabs.forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
    const flow = tab.dataset.flow;
    const pipeline = document.getElementById("pipeline");
    if (pipeline) pipeline.dataset.flow = flow;
    if (flow === "voice") {
      document.querySelector('[data-node="mic"]')?.classList.remove("is-idle");
      showSystem("mic");
    } else {
      document.querySelector('[data-node="mic"]')?.classList.add("is-idle");
      showSystem("phone");
    }
  });
});

/* ------------------------------------------------------------------ */
/* audio previews                                                      */
/* ------------------------------------------------------------------ */

const CUES = {
  L: {
    name: "Turn left",
    voice: "Turn left",
    steps: [[2400, 80, 0]],
    phone: "Turn left",
    sub: "In 80 m · after the junction",
    distance: "80 m",
  },
  R: {
    name: "Turn right",
    voice: "Turn right",
    steps: [[2400, 80, 80], [2400, 80, 0]],
    phone: "Turn right",
    sub: "In 60 m · keep the lane",
    distance: "60 m",
  },
  U: {
    name: "U-turn ahead",
    voice: "Make a U-turn",
    steps: [[3000, 60, 60], [3000, 60, 60], [3000, 60, 0]],
    phone: "U-turn ahead",
    sub: "Sharp correction · slow down",
    distance: "40 m",
  },
  D: {
    name: "Destination",
    voice: "You have arrived",
    steps: [[1800, 500, 0]],
    phone: "Destination",
    sub: "Arrive on your left",
    distance: "20 m",
  },
  C: {
    name: "Connected",
    voice: "Connected",
    steps: [[2000, 100, 50], [2600, 150, 0]],
    phone: "Connected",
    sub: "Audio channel ready · phone in pocket",
    distance: "0 m",
  },
};

let audioCtx = null;
function getAudio() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!audioCtx) audioCtx = new AC();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function playTone(steps) {
  const ac = getAudio();
  if (!ac) return;
  const t0 = ac.currentTime + 0.03;
  let cursor = 0;
  steps.forEach(([freq, dur, gap]) => {
    const start = t0 + cursor / 1000;
    const end = start + dur / 1000;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.12, start + 0.008);
    gain.gain.setValueAtTime(0.12, Math.max(start + 0.009, end - 0.012));
    gain.gain.linearRampToValueAtTime(0, end);
    osc.connect(gain).connect(ac.destination);
    osc.start(start);
    osc.stop(end + 0.02);
    cursor += dur + gap;
  });
}

const speechWarning = document.getElementById("speech-warning");
function speak(text) {
  if (!("speechSynthesis" in window)) {
    speechWarning?.classList.add("show");
    return false;
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.95;
  u.pitch = 1;
  u.volume = 0.9;
  u.lang = "en-IN";
  window.speechSynthesis.speak(u);
  return true;
}

let cueMode = "tone";
const modeTone = document.getElementById("mode-tone");
const modeVoice = document.getElementById("mode-voice");

function setMode(mode) {
  cueMode = mode;
  modeTone?.setAttribute("aria-pressed", String(mode === "tone"));
  modeVoice?.setAttribute("aria-pressed", String(mode === "voice"));
}
modeTone?.addEventListener("click", () => setMode("tone"));
modeVoice?.addEventListener("click", () => setMode("voice"));

const phoneCode = document.getElementById("phone-code");
const phoneText = document.getElementById("phone-text");
const phoneSub = document.getElementById("phone-sub");
const phoneDistance = document.getElementById("phone-distance");
const cueButtons = [...document.querySelectorAll(".cue")];

function updatePhone(id) {
  const cue = CUES[id];
  if (!cue) return;
  if (phoneCode) phoneCode.textContent = id;
  if (phoneText) phoneText.textContent = cue.phone;
  if (phoneSub) phoneSub.textContent = cue.sub;
  if (phoneDistance) phoneDistance.textContent = cue.distance;
}

function fireCue(id) {
  const cue = CUES[id];
  if (!cue) return;
  updatePhone(id);
  cueButtons.forEach((b) => b.classList.toggle("is-active", b.dataset.cue === id));
  if (cueMode === "voice") {
    const ok = speak(cue.voice);
    if (!ok) playTone(cue.steps);
  } else {
    playTone(cue.steps);
  }
  window.setTimeout(() => {
    cueButtons.forEach((b) => b.classList.remove("is-active"));
  }, 1100);
}

cueButtons.forEach((btn) =>
  btn.addEventListener("click", () => {
    stopRoute();
    fireCue(btn.dataset.cue);
  })
);

/* ------------------------------------------------------------------ */
/* simulated route                                                     */
/* ------------------------------------------------------------------ */

const routePath = document.getElementById("route-path");
const routeDot = document.getElementById("route-dot");
const playRouteBtn = document.getElementById("play-route");
const stopRouteBtn = document.getElementById("stop-route");

const ROUTE_CUES = [
  { id: "C", at: 0.015 },
  { id: "R", at: 0.275 },
  { id: "L", at: 0.535 },
  { id: "R", at: 0.775 },
  { id: "D", at: 0.975 },
];

let routeFrame = 0;
let routePlaying = false;
let routeStart = 0;
let routeFired = new Set();
const ROUTE_MS = 17000;

function setDot(fraction) {
  if (!routePath || !routeDot) return;
  const len = routePath.getTotalLength();
  const p = routePath.getPointAtLength(len * Math.min(1, Math.max(0, fraction)));
  routeDot.setAttribute("cx", p.x.toFixed(2));
  routeDot.setAttribute("cy", p.y.toFixed(2));
}

function routeTick(now) {
  if (!routePlaying) return;
  const t = Math.min(1, (now - routeStart) / ROUTE_MS);
  setDot(t);

  for (const cue of ROUTE_CUES) {
    if (t >= cue.at && !routeFired.has(cue.id + cue.at)) {
      routeFired.add(cue.id + cue.at);
      fireCue(cue.id);
    }
  }

  if (t < 1) {
    routeFrame = requestAnimationFrame(routeTick);
  } else {
    finishRoute();
  }
}

function playRoute() {
  stopRoute();
  if (!routePath) return;
  routePlaying = true;
  routeFired = new Set();
  setDot(0);
  updatePhone("C");
  playRouteBtn?.setAttribute("hidden", "");
  stopRouteBtn?.removeAttribute("hidden");
  routeStart = performance.now();
  routeFrame = requestAnimationFrame(routeTick);
}

function finishRoute() {
  routePlaying = false;
  cancelAnimationFrame(routeFrame);
  setDot(1);
  playRouteBtn?.removeAttribute("hidden");
  stopRouteBtn?.setAttribute("hidden", "");
}

function stopRoute() {
  if (!routePlaying) return;
  routePlaying = false;
  cancelAnimationFrame(routeFrame);
  window.speechSynthesis?.cancel();
  setDot(0);
  updatePhone("C");
  playRouteBtn?.removeAttribute("hidden");
  stopRouteBtn?.setAttribute("hidden", "");
}

playRouteBtn?.addEventListener("click", playRoute);
stopRouteBtn?.addEventListener("click", stopRoute);

/* speech support check */
if (!("speechSynthesis" in window)) {
  speechWarning?.classList.add("show");
}

/* ------------------------------------------------------------------ */
/* small things                                                        */
/* ------------------------------------------------------------------ */

const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());
