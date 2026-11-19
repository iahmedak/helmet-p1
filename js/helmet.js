import * as THREE from "three";
import { OrbitControls } from "../vendor/OrbitControls.js";
import { RoomEnvironment } from "../vendor/RoomEnvironment.js";

const HI = 0xd8f44b;

/* ------------------------------------------------------------------ */
/* geometry helpers                                                    */
/* ------------------------------------------------------------------ */

function roundedRectShape(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

function roundedBox(w, h, d, r, material) {
  const shape = roundedRectShape(Math.max(0.01, w - r * 2), Math.max(0.01, h - r * 2), r);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.01, d - r * 2),
    bevelEnabled: true,
    bevelSize: r,
    bevelThickness: r,
    bevelSegments: 3,
    curveSegments: 10,
    steps: 1,
  });
  geo.center();
  return new THREE.Mesh(geo, material);
}

function labelTexture(lines, opts = {}) {
  const { bg = "#0e1012", fg = "#d8f44b", sub = "#9aa1a7", w = 512, h = 160 } = opts;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = fg;
  ctx.font = "600 44px Archivo, Arial, sans-serif";
  ctx.letterSpacing = "2px";
  ctx.fillText(lines[0], 28, 70);
  if (lines[1]) {
    ctx.fillStyle = sub;
    ctx.font = "400 26px 'IBM Plex Mono', monospace";
    ctx.fillText(lines[1], 28, 116);
  }
  ctx.strokeStyle = "rgba(216,244,75,.35)";
  ctx.lineWidth = 2;
  ctx.strokeRect(8, 8, w - 16, h - 16);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function grilleTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#0a0c0e";
  ctx.fillRect(0, 0, 128, 128);
  ctx.fillStyle = "#343a40";
  for (let y = 3; y < 128; y += 5) {
    for (let x = 3; x < 128; x += 5) {
      ctx.beginPath();
      ctx.arc(x, y, 0.9, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function epsTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#2e3134";
  ctx.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 2200; i++) {
    const r = Math.random() * 0.8 + 0.2;
    ctx.fillStyle = Math.random() > 0.5 ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.16)";
    ctx.beginPath();
    ctx.arc(Math.random() * 128, Math.random() * 128, r, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(7, 5);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/* ------------------------------------------------------------------ */
/* shell                                                               */
/* ------------------------------------------------------------------ */

function shellMask(x, y, z) {
  const v = Math.asin(THREE.MathUtils.clamp(y, -1, 1)); // latitude
  const h = Math.atan2(x, z); // 0 at front, +/- pi at back

  // rounded-rectangle eyeport, wrapping to the temples
  const ah = h / 1.12;
  const av = (v - 0.045) / 0.27;
  if (Math.pow(Math.abs(ah), 4) + Math.pow(Math.abs(av), 4) < 1) return true;

  // bottom opening: deeper at the chin, higher at the back
  const front = Math.max(0, Math.cos(h));
  const vCut = -1.18 - 0.1 * front;
  return v < vCut;
}

function smoothstep(a, b, x) {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

function deformShell(geo, rx, ry, rz, strength = 3.4) {
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    const y = pos.getY(i);
    let z = pos.getZ(i);
    const ny = y / ry;
    const nz = z / rz;
    const down = smoothstep(-0.1, -0.78, ny);
    const front = smoothstep(-0.45, 0.6, nz);
    z += strength * down * front;
    x *= 1 + 0.04 * down;
    x *= 1 - 0.18 * smoothstep(-0.55, -1.0, ny);
    if (nz < -0.2) z *= 1 - 0.035 * smoothstep(-0.2, -0.9, nz);
    pos.setXYZ(i, x, y, z);
  }
  pos.needsUpdate = true;
}

function helmetPoint(RX, RY, RZ, h, v, scale = 1) {
  const x = RX * scale * Math.cos(v) * Math.sin(h);
  const y = RY * scale * Math.sin(v);
  let z = RZ * scale * Math.cos(v) * Math.cos(h);
  const ny = y / (RY * scale);
  const nz = z / (RZ * scale);
  z += 3.4 * scale * smoothstep(-0.1, -0.78, ny) * smoothstep(-0.45, 0.6, nz);
  return new THREE.Vector3(x, y, z);
}

function shellGeometry(rx, ry, rz, scale = 1, mask = shellMask) {
  const geo = new THREE.SphereGeometry(1, 128, 88);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    pos.setXYZ(i, pos.getX(i) * rx * scale, pos.getY(i) * ry * scale, pos.getZ(i) * rz * scale);
  }
  const idx = geo.index.array;
  const keep = [];
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  for (let i = 0; i < idx.length; i += 3) {
    a.fromBufferAttribute(pos, idx[i]);
    b.fromBufferAttribute(pos, idx[i + 1]);
    c.fromBufferAttribute(pos, idx[i + 2]);
    const cx = (a.x + b.x + c.x) / 3 / (rx * scale);
    const cy = (a.y + b.y + c.y) / 3 / (ry * scale);
    const cz = (a.z + b.z + c.z) / 3 / (rz * scale);
    if (!mask(cx, cy, cz)) keep.push(idx[i], idx[i + 1], idx[i + 2]);
  }
  geo.setIndex(keep);
  deformShell(geo, rx * scale, ry * scale, rz * scale, 3.4 * scale);
  geo.computeVertexNormals();
  geo.computeBoundingSphere();
  return geo;
}

function boundaryLoops(geo) {
  const idx = geo.index.array;
  const edges = new Map();
  const key = (a, b) => (a < b ? a + "_" + b : b + "_" + a);
  for (let i = 0; i < idx.length; i += 3) {
    const t = [idx[i], idx[i + 1], idx[i + 2]];
    for (let e = 0; e < 3; e++) {
      const k = key(t[e], t[(e + 1) % 3]);
      const rec = edges.get(k);
      if (rec) rec.n++;
      else edges.set(k, { a: t[e], b: t[(e + 1) % 3], n: 1 });
    }
  }
  const open = [...edges.values()].filter((e) => e.n === 1);
  const adj = new Map();
  for (const e of open) {
    if (!adj.has(e.a)) adj.set(e.a, []);
    if (!adj.has(e.b)) adj.set(e.b, []);
    adj.get(e.a).push(e.b);
    adj.get(e.b).push(e.a);
  }
  const used = new Set();
  const loops = [];
  for (const e of open) {
    if (used.has(key(e.a, e.b))) continue;
    const loop = [e.a];
    used.add(key(e.a, e.b));
    let prev = e.a;
    let cur = e.b;
    let guard = 0;
    while (cur !== loop[0] && guard++ < 40000) {
      loop.push(cur);
      const nbrs = adj.get(cur) || [];
      let next = null;
      for (const n of nbrs) {
        if (n !== prev && !used.has(key(cur, n))) {
          next = n;
          break;
        }
      }
      if (next == null) break;
      used.add(key(cur, next));
      prev = cur;
      cur = next;
    }
    if (loop.length > 10) loops.push(loop);
  }
  const pos = geo.attributes.position;
  return loops.map((loop) => loop.map((i) => new THREE.Vector3().fromBufferAttribute(pos, i)));
}

function smoothLoop(points, passes = 3) {
  let pts = points;
  for (let p = 0; p < passes; p++) {
    pts = pts.map((v, i) => {
      const a = pts[(i - 1 + pts.length) % pts.length];
      const b = pts[(i + 1) % pts.length];
      return new THREE.Vector3()
        .addVectors(a, b)
        .multiplyScalar(0.22)
        .add(v.clone().multiplyScalar(0.56));
    });
  }
  return pts;
}

function rimTube(points, radius, material) {
  const pts = smoothLoop(points).filter((_, i) => i % 2 === 0);
  const curve = new THREE.CatmullRomCurve3(pts, true, "centripetal", 0.4);
  const geo = new THREE.TubeGeometry(curve, pts.length * 2, radius, 7, true);
  return new THREE.Mesh(geo, material);
}

/* ------------------------------------------------------------------ */
/* electronics                                                         */
/* ------------------------------------------------------------------ */

const MAT = {
  pcbBlack: new THREE.MeshStandardMaterial({ color: 0x232a28, roughness: 0.72, metalness: 0.1 }),
  pcbBlue: new THREE.MeshStandardMaterial({ color: 0x1f5f96, roughness: 0.62, metalness: 0.08 }),
  pcbPurple: new THREE.MeshStandardMaterial({ color: 0x6f4a8e, roughness: 0.62, metalness: 0.08 }),
  chip: new THREE.MeshStandardMaterial({ color: 0x0b0c0d, roughness: 0.45, metalness: 0.25 }),
  metal: new THREE.MeshStandardMaterial({ color: 0xb9bfc4, roughness: 0.28, metalness: 0.95 }),
  gold: new THREE.MeshStandardMaterial({ color: 0xc9a25a, roughness: 0.3, metalness: 1 }),
  silver: new THREE.MeshStandardMaterial({ color: 0xd5d9dc, roughness: 0.24, metalness: 0.9 }),
  rubber: new THREE.MeshStandardMaterial({ color: 0x111315, roughness: 0.92, metalness: 0 }),
  foam: new THREE.MeshStandardMaterial({ color: 0x222529, roughness: 0.96, metalness: 0 }),
  foamDark: new THREE.MeshStandardMaterial({ color: 0x17191c, roughness: 0.98, metalness: 0 }),
  red: new THREE.MeshStandardMaterial({ color: 0x9d2c27, roughness: 0.5 }),
  white: new THREE.MeshStandardMaterial({ color: 0xd9d5ca, roughness: 0.6 }),
  grey: new THREE.MeshStandardMaterial({ color: 0x6b7177, roughness: 0.6 }),
  purpleWire: new THREE.MeshStandardMaterial({ color: 0x6c4f86, roughness: 0.6 }),
  label: new THREE.MeshStandardMaterial({ color: 0xe8e3d6, roughness: 0.8 }),
};

function pcb(w, h, mat) {
  const g = new THREE.Group();
  const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.16), mat);
  g.add(b);
  return g;
}

function pinRow(count, spacing, mat = MAT.gold) {
  const g = new THREE.Group();
  for (let i = 0; i < count; i++) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.42), mat);
    p.position.x = (i - (count - 1) / 2) * spacing;
    g.add(p);
  }
  return g;
}

function chip(w, h, d, mat = MAT.chip) {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
}

function usbC(w = 0.9, h = 0.34) {
  const g = new THREE.Group();
  const shell = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.5), MAT.metal);
  const mouth = new THREE.Mesh(new THREE.BoxGeometry(w * 0.72, h * 0.48, 0.1), MAT.chip);
  mouth.position.z = -0.24;
  g.add(shell, mouth);
  return g;
}

function makeESP32() {
  const g = pcb(2.6, 4.8, MAT.pcbBlack);
  const shield = chip(1.7, 1.5, 0.22, MAT.silver);
  shield.position.set(-0.1, 1.1, -0.2);
  const mcu = chip(0.7, 0.7, 0.12);
  mcu.position.set(0, -0.4, -0.2);
  const led = chip(0.22, 0.14, 0.1, new THREE.MeshStandardMaterial({ color: 0x3a7d5c, emissive: 0x1f5a3b, emissiveIntensity: 1 }));
  led.position.set(0.9, -0.8, -0.18);
  const usb = usbC();
  usb.position.set(0, -2.55, 0.05);
  const p1 = pinRow(10, 0.24);
  p1.rotation.z = Math.PI / 2;
  p1.position.set(-1.36, 0.4, 0);
  const p2 = pinRow(10, 0.24);
  p2.rotation.z = Math.PI / 2;
  p2.position.set(1.36, 0.4, 0);
  g.add(shield, mcu, led, usb, p1, p2);
  return g;
}

function makeDFPlayer() {
  const g = pcb(2.2, 2.2, MAT.pcbBlue);
  const sd = chip(0.95, 0.8, 0.14, MAT.silver);
  sd.position.set(-0.55, 0.62, -0.18);
  const jack = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.7, 16), MAT.chip);
  jack.rotation.x = Math.PI / 2;
  jack.position.set(0.62, -0.72, -0.34);
  const amp = chip(0.7, 0.5, 0.14);
  amp.position.set(0.5, 0.6, -0.18);
  const pins = pinRow(5, 0.26);
  pins.position.set(-0.4, -1.12, 0);
  g.add(sd, jack, amp, pins);
  return g;
}

function makeTP4056() {
  const g = pcb(2.7, 1.6, MAT.pcbBlue);
  const usb = usbC(0.78, 0.3);
  usb.position.set(0, -1.0, 0.1);
  const ic = chip(0.55, 0.5, 0.14);
  ic.position.set(-0.55, 0.35, -0.18);
  const ledA = chip(0.16, 0.1, 0.08, new THREE.MeshStandardMaterial({ color: 0x9d2c27, emissive: 0x7a1e1a }));
  ledA.position.set(-0.9, -0.4, -0.16);
  const ledB = chip(0.16, 0.1, 0.08, new THREE.MeshStandardMaterial({ color: 0x1f5a3b, emissive: 0x2f7d4f }));
  ledB.position.set(-0.55, -0.4, -0.16);
  g.add(usb, ic, ledA, ledB);
  return g;
}

function makeMT3608() {
  const g = pcb(1.8, 1.4, MAT.pcbBlue);
  const ind = chip(0.8, 0.7, 0.5);
  ind.position.set(-0.35, 0.1, -0.3);
  const pot = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.34, 0.3), new THREE.MeshStandardMaterial({ color: 0x2a5f8a, roughness: 0.5 }));
  pot.position.set(0.55, 0.38, -0.22);
  const ic = chip(0.4, 0.4, 0.12);
  ic.position.set(0.55, -0.3, -0.16);
  g.add(ind, pot, ic);
  return g;
}

function makeMAX9814() {
  const g = pcb(1.6, 1.35, MAT.pcbPurple);
  const mic = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.28, 16), MAT.silver);
  mic.rotation.x = Math.PI / 2;
  mic.position.set(-0.34, 0.28, -0.22);
  const ic = chip(0.5, 0.4, 0.12);
  ic.position.set(0.36, -0.18, -0.16);
  const pins = pinRow(4, 0.22);
  pins.position.set(0, -0.82, 0);
  g.add(mic, ic, pins);
  return g;
}

function makeBattery() {
  const g = new THREE.Group();
  const cell = roundedBox(5.4, 3.2, 0.9, 0.35, new THREE.MeshStandardMaterial({ color: 0x2c2f33, roughness: 0.55, metalness: 0.25 }));
  const band = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.5, 0.02), MAT.label);
  band.position.z = -0.47;
  const tabA = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.0, 0.5), MAT.red);
  tabA.position.set(-1.6, 1.62, 0);
  const tabB = tabA.clone();
  tabB.material = MAT.chip;
  tabB.position.x = -1.2;
  g.add(cell, band, tabA, tabB);
  return g;
}

function makeSpeaker() {
  const g = new THREE.Group();
  const housing = new THREE.Mesh(new THREE.CylinderGeometry(2.45, 2.45, 1.0, 40), MAT.rubber);
  housing.rotation.z = Math.PI / 2;
  g.add(housing);
  const face = new THREE.Mesh(new THREE.CircleGeometry(2.1, 40), new THREE.MeshStandardMaterial({ color: 0x0b0c0d, roughness: 0.95 }));
  face.rotation.y = -Math.PI / 2;
  face.position.x = -0.52;
  g.add(face);
  for (let i = 1; i <= 3; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.45 * i, 0.035, 6, 40), new THREE.MeshStandardMaterial({ color: 0x3a3f45, roughness: 0.5, metalness: 0.4 }));
    ring.rotation.y = Math.PI / 2;
    ring.position.x = -0.55;
    g.add(ring);
  }
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 12), MAT.silver);
  dome.scale.x = 0.4;
  dome.position.x = -0.58;
  g.add(dome);
  const pad = new THREE.Mesh(new THREE.TorusGeometry(2.35, 0.35, 8, 36), MAT.foam);
  pad.rotation.y = Math.PI / 2;
  pad.position.x = -0.6;
  g.add(pad);
  return g;
}

/* ------------------------------------------------------------------ */
/* model                                                               */
/* ------------------------------------------------------------------ */

function buildModel() {
  const root = new THREE.Group();
  const parts = new Map();
  const finish = [];

  const epsMap = epsTexture();
  const shellMat = new THREE.MeshPhysicalMaterial({
    color: 0x101214,
    roughness: 0.56,
    metalness: 0.06,
    clearcoat: 0.16,
    clearcoatRoughness: 0.45,
    side: THREE.DoubleSide,
    envMapIntensity: 0.95,
  });
  const linerMat = new THREE.MeshStandardMaterial({
    color: 0x8f9396,
    map: epsMap,
    bumpMap: epsMap,
    bumpScale: 0.04,
    roughness: 0.96,
    metalness: 0,
    side: THREE.DoubleSide,
  });
  const visorMat = new THREE.MeshPhysicalMaterial({
    color: 0x9fb4ba,
    roughness: 0.02,
    metalness: 0.08,
    transparent: true,
    opacity: 0.34,
    side: THREE.DoubleSide,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    envMapIntensity: 3.4,
    depthWrite: false,
  });

  const RX = 12.2;
  const RY = 14.2;
  const RZ = 16.4;

  const surfaceFrame = (h, v, scale = 1) => {
    const p = helmetPoint(RX, RY, RZ, h, v, scale);
    const normal = new THREE.Vector3(
      Math.cos(v) * Math.sin(h) / RX,
      Math.sin(v) / RY,
      Math.cos(v) * Math.cos(h) / RZ
    ).normalize();
    const tangentH = new THREE.Vector3(
      RX * Math.cos(v) * Math.cos(h),
      0,
      -RZ * Math.cos(v) * Math.sin(h)
    ).normalize();
    const tangentV = new THREE.Vector3(
      -RX * Math.sin(v) * Math.sin(h),
      RY * Math.cos(v),
      -RZ * Math.sin(v) * Math.cos(h)
    ).normalize();
    const basis = new THREE.Matrix4().makeBasis(tangentH, tangentV, normal);
    return { p, normal, q: new THREE.Quaternion().setFromRotationMatrix(basis) };
  };

  /* ---- shell ---- */
  const shellGroup = new THREE.Group();
  const shellGeo = shellGeometry(RX, RY, RZ);
  const shell = new THREE.Mesh(shellGeo, shellMat);
  const linerGeo = shellGeometry(RX, RY, RZ, 0.935);
  const liner = new THREE.Mesh(linerGeo, linerMat);
  const linerGroup = new THREE.Group();
  linerGroup.add(liner);
  shellGroup.add(shell);
  root.add(linerGroup);
  parts.set("liner", linerGroup);

  const rimMat = new THREE.MeshStandardMaterial({ color: 0x141619, roughness: 0.85 });

  // eyeport gasket, matching the shell cut exactly
  const gasketPts = [];
  for (let i = 0; i < 96; i++) {
    const t = (i / 96) * Math.PI * 2;
    const c = Math.cos(t);
    const s = Math.sin(t);
    const h = 1.145 * Math.sign(c) * Math.sqrt(Math.abs(c));
    const v = 0.045 + 0.282 * Math.sign(s) * Math.sqrt(Math.abs(s));
    gasketPts.push(helmetPoint(RX, RY, RZ, h, v, 1.004));
  }
  const gasketCurve = new THREE.CatmullRomCurve3(gasketPts, true, "centripetal");
  shellGroup.add(new THREE.Mesh(new THREE.TubeGeometry(gasketCurve, 140, 0.26, 8, true), rimMat));

  // inner eyeport trim, covering the liner's cut edge
  const innerPts = [];
  for (let i = 0; i < 96; i++) {
    const t = (i / 96) * Math.PI * 2;
    const c = Math.cos(t);
    const s = Math.sin(t);
    const h = 1.145 * Math.sign(c) * Math.sqrt(Math.abs(c));
    const v = 0.045 + 0.282 * Math.sign(s) * Math.sqrt(Math.abs(s));
    innerPts.push(helmetPoint(RX, RY, RZ, h, v, 0.93));
  }
  const innerCurve = new THREE.CatmullRomCurve3(innerPts, true, "centripetal");
  shellGroup.add(new THREE.Mesh(new THREE.TubeGeometry(innerCurve, 120, 0.24, 8, true), new THREE.MeshStandardMaterial({ color: 0x08090a, roughness: 0.94 })));

  // bottom rim
  const bottomPts = [];
  for (let i = 0; i < 96; i++) {
    const h = (i / 96) * Math.PI * 2;
    const vCut = -1.16 - 0.1 * Math.max(0, Math.cos(h));
    bottomPts.push(helmetPoint(RX, RY, RZ, h, vCut, 1.004));
  }
  const bottomCurve = new THREE.CatmullRomCurve3(bottomPts, true, "centripetal");
  shellGroup.add(new THREE.Mesh(new THREE.TubeGeometry(bottomCurve, 140, 0.5, 8, true), rimMat));

  // hi-vis accent stays on the rear-bay label; the shell itself is matte black

  // brow pad inside the eyeport
  const brow = roundedBox(13.6, 1.8, 2.2, 0.8, MAT.foam);
  brow.position.set(0, 4.15, 9.3);
  brow.rotation.x = -0.3;
  shellGroup.add(brow);

  // chin bar: dark structural panel, hugging the shell
  const guardMat = new THREE.MeshPhysicalMaterial({ color: 0x101214, roughness: 0.52, metalness: 0.12, clearcoat: 0.18, clearcoatRoughness: 0.4, side: THREE.DoubleSide });
  const guardGeo = (() => {
    const h0 = -1.5;
    const h1 = 1.5;
    const su = 56;
    const sv = 14;
    const pos = [];
    const idx = [];
    for (let j = 0; j <= sv; j++) {
      const f = j / sv;
      for (let i = 0; i <= su; i++) {
        const h = h0 + (h1 - h0) * (i / su);
        // top edge tucks under the visor; bottom edge follows the shell opening
        const vTop = -0.34 + 0.05 * Math.min(1, Math.pow(h / 0.7, 2));
        const vCut = -1.18 - 0.1 * Math.max(0, Math.cos(h));
        const v = vTop + (vCut - 0.05 - vTop) * f;
        const p = helmetPoint(RX, RY, RZ, h, v, 1.022);
        pos.push(p.x, p.y, p.z);
      }
    }
    for (let j = 0; j < sv; j++) {
      for (let i = 0; i < su; i++) {
        const a = j * (su + 1) + i;
        const b = a + 1;
        const c = a + su + 1;
        const d = c + 1;
        idx.push(a, b, d, a, d, c);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  })();
  shellGroup.add(new THREE.Mesh(guardGeo, guardMat));

  // chin vent, sitting proud of the chin bar just under the visor
  const ventP = helmetPoint(RX, RY, RZ, 0, -0.45, 1.032);
  const chinVent = roundedBox(5.2, 1.15, 0.9, 0.24, new THREE.MeshStandardMaterial({ color: 0x101315, roughness: 0.66, metalness: 0.22 }));
  chinVent.position.set(0, ventP.y, ventP.z + 0.1);
  chinVent.rotation.x = 0.1;
  shellGroup.add(chinVent);
  for (let i = -1; i <= 1; i++) {
    const slit = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.5, 0.08), MAT.grey);
    slit.position.set(i * 1.45, ventP.y, ventP.z + 0.62);
    slit.rotation.x = 0.1;
    shellGroup.add(slit);
  }

  // seam along the top of the chin panel
  const chinSeamPts = [];
  for (let i = 0; i <= 72; i++) {
    const h = -1.38 + (2.76 * i) / 72;
    chinSeamPts.push(helmetPoint(RX, RY, RZ, h, -0.345 + 0.05 * Math.min(1, Math.pow(h / 0.7, 2)), 1.03));
  }
  const chinSeam = new THREE.CatmullRomCurve3(chinSeamPts);
  shellGroup.add(new THREE.Mesh(
    new THREE.TubeGeometry(chinSeam, 72, 0.075, 6, false),
    new THREE.MeshStandardMaterial({ color: 0x0a0b0c, roughness: 0.9 })
  ));

  // subtle crown spine
  const spinePts = [];
  for (let i = 0; i <= 40; i++) {
    const v = 0.34 + (2.5 - 0.34) * (i / 40);
    spinePts.push(helmetPoint(RX, RY, RZ, 0, v, 1.008));
  }
  const spineCurve = new THREE.CatmullRomCurve3(spinePts);
  shellGroup.add(new THREE.Mesh(
    new THREE.TubeGeometry(spineCurve, 60, 0.11, 6, false),
    new THREE.MeshStandardMaterial({ color: 0x191c1f, roughness: 0.5, metalness: 0.12 })
  ));

  // chin strap anchors
  for (const side of [-1, 1]) {
    const anchor = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.35), MAT.metal);
    anchor.position.copy(helmetPoint(RX, RY, RZ, side * 0.78, -1.12, 1.01));
    shellGroup.add(anchor);
  }

  // rear exhaust vents
  for (let i = -1; i <= 1; i++) {
    const vent = new THREE.Mesh(new THREE.BoxGeometry(0.32, 2.4, 0.18), MAT.rubber);
    vent.position.set(i * 1.15, 7.15, -13.28);
    vent.rotation.x = -0.12;
    shellGroup.add(vent);
  }

  // crown vents, flanking the stripe
  const ventMat = new THREE.MeshStandardMaterial({ color: 0x0a0c0e, roughness: 0.6, metalness: 0.2 });
  const ventSlatMat = new THREE.MeshStandardMaterial({ color: 0x262b2f, roughness: 0.46, metalness: 0.45 });
  for (const side of [-1, 1]) {
    const { p, normal, q } = surfaceFrame(side * 0.36, 0.7, 1.006);
    const g = new THREE.Group();
    g.position.copy(p).addScaledVector(normal, 0.1);
    g.quaternion.copy(q);
    g.add(roundedBox(3.0, 1.8, 0.42, 0.22, ventMat));
    for (let i = -1; i <= 1; i++) {
      const slit = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.25, 0.06), ventSlatMat);
      slit.position.set(i * 0.68, 0, 0.22);
      g.add(slit);
    }
    shellGroup.add(g);
  }

  // visor hinge and locking lever
  const hingeMat = new THREE.MeshPhysicalMaterial({ color: 0x0b0d0f, roughness: 0.5, metalness: 0.4, clearcoat: 0.2, clearcoatRoughness: 0.45 });
  const hingeMetal = new THREE.MeshStandardMaterial({ color: 0x8e969c, roughness: 0.3, metalness: 0.95 });
  for (const side of [-1, 1]) {
    const { p, q } = surfaceFrame(side * 1.15, -0.03, 1.0);
    const hg = new THREE.Group();
    hg.position.copy(p);
    hg.quaternion.copy(q);

    const base = roundedBox(2.1, 2.1, 0.2, 0.4, hingeMat);
    base.position.z = 0.08;
    hg.add(base);

    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.64, 0.64, 0.2, 28), hingeMat);
    disc.rotation.x = Math.PI / 2;
    disc.position.z = 0.25;
    hg.add(disc);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.64, 0.06, 8, 32), hingeMetal);
    ring.position.z = 0.36;
    hg.add(ring);

    const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.12, 12), hingeMetal);
    screw.rotation.x = Math.PI / 2;
    screw.position.z = 0.41;
    hg.add(screw);

    const lever = roundedBox(0.38, 1.15, 0.18, 0.12, hingeMat);
    lever.position.set(0, -0.95, 0.3);
    hg.add(lever);

    shellGroup.add(hg);
  }

  root.add(shellGroup);
  parts.set("shell", shellGroup);

  /* ---- visor ---- */
  const VIS = { scale: 1.022, u: 1.08, v0: -0.235, v1: 0.33 };
  const visorPoint = (u, v, scale = VIS.scale) => helmetPoint(RX, RY, RZ, Math.PI / 2 - u, v, scale);

  const visorGroup = new THREE.Group();
  const vGeo = (() => {
    const su = 64;
    const sv = 18;
    const pos = [];
    const idx = [];
    for (let j = 0; j <= sv; j++) {
      const f = j / sv;
      for (let i = 0; i <= su; i++) {
        const n = (i / su) * 2 - 1;
        const uLim = VIS.u * (1 - 0.16 * f);
        const u = Math.PI / 2 + uLim * n;
        const vTop = VIS.v1 - 0.06 * n * n;
        const vBot = VIS.v0 + 0.075 * n * n;
        const v = vBot + (vTop - vBot) * f;
        const p = visorPoint(u, v);
        pos.push(p.x, p.y, p.z);
      }
    }
    for (let j = 0; j < sv; j++) {
      for (let i = 0; i < su; i++) {
        const a = j * (su + 1) + i;
        const b = a + 1;
        const c = a + su + 1;
        const d = c + 1;
        idx.push(a, b, d, a, d, c);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  })();
  const visor = new THREE.Mesh(vGeo, visorMat);
  visorGroup.add(visor);

  // hi-vis edge along the lower rim of the visor
  const edgePts = [];
  for (let i = 0; i <= 64; i++) {
    const n = -1 + (2 * i) / 64;
    const u = Math.PI / 2 + VIS.u * n;
    const v = VIS.v0 + 0.075 * n * n;
    edgePts.push(visorPoint(u, v, VIS.scale + 0.008));
  }
  const edgeCurve = new THREE.CatmullRomCurve3(edgePts);
  const edge = new THREE.Mesh(
    new THREE.TubeGeometry(edgeCurve, 90, 0.085, 6, false),
    new THREE.MeshStandardMaterial({ color: 0x08090a, roughness: 0.92, metalness: 0.05 })
  );
  visorGroup.add(edge);

  // dark trim along the top edge
  const topPts = [];
  for (let i = 0; i <= 64; i++) {
    const n = -1 + (2 * i) / 64;
    const u = Math.PI / 2 + VIS.u * 0.78 * n;
    const v = VIS.v1 - 0.06 * n * n;
    topPts.push(visorPoint(u, v, VIS.scale + 0.006));
  }
  const topCurve = new THREE.CatmullRomCurve3(topPts);
  visorGroup.add(new THREE.Mesh(new THREE.TubeGeometry(topCurve, 90, 0.1, 6, false), rimMat));

  root.add(visorGroup);
  parts.set("visor", visorGroup);

  /* ---- cheek pads ---- */
  const padGroup = new THREE.Group();
  for (const side of [-1, 1]) {
    const pad = roundedBox(2.7, 5.4, 6.0, 1.05, MAT.foam);
    pad.position.set(side * 7.7, -7.2, 2.8);
    pad.rotation.y = side * -0.28;
    pad.rotation.z = side * 0.06;
    padGroup.add(pad);
  }
  // neck roll at the back, proud of the shell rim so it reads from outside
  const neck = roundedBox(10.2, 2.2, 3.0, 0.9, MAT.foamDark);
  neck.position.set(0, -12.35, -6.5);
  neck.rotation.x = 0.25;
  padGroup.add(neck);
  // chin curtain, closing the lower interior behind the chin bar
  const curtain = roundedBox(10.4, 3.2, 2.2, 0.9, MAT.foamDark);
  curtain.position.set(0, -8.9, 8.1);
  curtain.rotation.x = 0.2;
  padGroup.add(curtain);
  root.add(padGroup);
  parts.set("pads", padGroup);

  /* ---- rear electronics bay ---- */
  // curved oval gasket: closes the seam between the flat pod and the shell
  const bayPadGeo = (() => {
    const CH = Math.PI;
    const CV = -0.1;
    const RH = 0.45;
    const RV = 0.3;
    const su = 56;
    const sv = 14;
    const pos = (() => { const p = helmetPoint(RX, RY, RZ, CH, CV, 1.012); return [p.x, p.y, p.z]; })();
    const idx = [];
    for (let j = 1; j <= sv; j++) {
      const r = j / sv;
      for (let i = 0; i < su; i++) {
        const a = (i / su) * Math.PI * 2;
        const p = helmetPoint(RX, RY, RZ, CH + r * RH * Math.cos(a), CV + r * RV * Math.sin(a), 1.012);
        pos.push(p.x, p.y, p.z);
      }
    }
    for (let i = 0; i < su; i++) idx.push(0, 1 + i, 1 + ((i + 1) % su));
    for (let j = 1; j < sv; j++) {
      const ring = 1 + (j - 1) * su;
      const next = ring + su;
      for (let i = 0; i < su; i++) {
        const i2 = (i + 1) % su;
        idx.push(ring + i, next + i, next + i2, ring + i, next + i2, ring + i2);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  })();
  root.add(new THREE.Mesh(bayPadGeo, new THREE.MeshStandardMaterial({ color: 0x0f1214, roughness: 0.82, metalness: 0.08, side: THREE.DoubleSide })));

  const bay = new THREE.Group();
  bay.position.set(0, -1.42, -14.85);

  const podMat = new THREE.MeshPhysicalMaterial({ color: 0x202428, roughness: 0.56, metalness: 0.16, clearcoat: 0.14, clearcoatRoughness: 0.62 });
  // housing body, buried through the shell so the pod meets the curved surface
  const back = roundedBox(9.9, 6.8, 3.2, 0.6, podMat);
  back.position.z = -0.5;
  bay.add(back);

  // deep frame: the pod's side wall, running from the cover back into the shell
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x121518, roughness: 0.72, metalness: 0.22 });
  const top = roundedBox(10.2, 0.7, 3.7, 0.25, frameMat);
  top.position.set(0, 3.35, -1.78);
  const bot = top.clone();
  bot.position.y = -3.35;
  const left = roundedBox(0.7, 6.0, 3.7, 0.25, frameMat);
  left.position.set(-4.75, 0, -1.78);
  const right = left.clone();
  right.position.x = 4.75;
  bay.add(top, bot, left, right);

  // carrier plate, sitting on the housing's rear wall
  const tray = roundedBox(8.8, 6.2, 0.12, 0.05, new THREE.MeshStandardMaterial({ color: 0x2a3035, roughness: 0.76, metalness: 0.22 }));
  tray.position.z = -2.2;
  bay.add(tray);

  const battery = makeBattery();
  battery.scale.setScalar(0.82);
  battery.position.set(-2.35, -1.8, -2.55);
  bay.add(battery);

  const esp = makeESP32();
  esp.scale.setScalar(0.78);
  esp.position.set(-3.4, 1.45, -2.6);
  bay.add(esp);

  const df = makeDFPlayer();
  df.scale.setScalar(0.8);
  df.position.set(-0.55, 1.75, -2.6);
  bay.add(df);

  const max = makeMAX9814();
  max.scale.setScalar(0.9);
  max.position.set(2.55, 2.1, -2.6);
  bay.add(max);

  const tp = makeTP4056();
  tp.scale.setScalar(0.78);
  tp.position.set(1.55, 0.0, -2.6);
  bay.add(tp);

  const mt = makeMT3608();
  mt.scale.setScalar(0.8);
  mt.position.set(3.45, -0.15, -2.6);
  bay.add(mt);

  // pod wiring
  const wireMat = (color) => new THREE.MeshStandardMaterial({ color, roughness: 0.55 });
  const wires = [
    { c: 0x9d2c27, pts: [[-3.3, -0.75, -2.6], [-2.9, -1.5, -2.55], [-2.1, -1.75, -2.5]] },
    { c: 0x0b0c0d, pts: [[-3.6, -0.75, -2.6], [-3.2, -1.7, -2.55], [-2.45, -1.8, -2.5]] },
    { c: 0xc9a25a, pts: [[-2.55, 0.9, -2.6], [-1.6, 0.5, -2.55], [-0.5, 0.85, -2.5]] },
    { c: 0x6b7177, pts: [[0.1, 1.4, -2.6], [1.0, 0.9, -2.55], [1.55, 0.6, -2.5]] },
    { c: 0x6c4f86, pts: [[3.5, 1.6, -2.6], [3.8, 0.9, -2.55], [3.95, 0.4, -2.5]] },
  ];
  for (const w of wires) {
    const curve = new THREE.CatmullRomCurve3(w.pts.map((p) => new THREE.Vector3(...p)));
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.065, 5, false), wireMat(w.c));
    bay.add(tube);
  }

  // cover panel, recessed behind the frame
  const coverGroup = new THREE.Group();
  const cover = roundedBox(9.3, 6.9, 0.5, 0.2, new THREE.MeshPhysicalMaterial({ color: 0x15181c, roughness: 0.34, metalness: 0.4, clearcoat: 0.45, clearcoatRoughness: 0.4 }));
  cover.position.z = -3.25;
  coverGroup.add(cover);

  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(5.2, 1.55),
    new THREE.MeshBasicMaterial({ map: labelTexture(["SOUNDNAV", "AUDIO CONTROL UNIT"], {}), transparent: false })
  );
  label.position.set(0, -1.95, -3.55);
  label.rotation.y = Math.PI;
  coverGroup.add(label);

  for (const sx of [-1, 1]) {
    for (const sy of [-1, 1]) {
      const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.1, 12), MAT.metal);
      screw.rotation.x = Math.PI / 2;
      screw.position.set(sx * 3.95, sy * 2.75, -3.55);
      coverGroup.add(screw);
    }
  }

  // charge port on the lower edge of the pod
  const port = usbC(0.85, 0.3);
  port.position.set(2.9, -3.5, -2.35);
  port.rotation.x = Math.PI / 2;
  bay.add(port);

  bay.add(coverGroup);
  root.add(bay);
  parts.set("bay", bay);
  coverGroup.userData.explode = new THREE.Vector3(-1.2, -10.5, -1.2);

  /* ---- audio: flush exterior grilles + interior speakers ---- */
  const audio = new THREE.Group();
  const podMatte = new THREE.MeshPhysicalMaterial({ color: 0x15181b, roughness: 0.52, metalness: 0.18, clearcoat: 0.16, clearcoatRoughness: 0.55 });
  const grilleMat = new THREE.MeshStandardMaterial({ map: grilleTexture(), color: 0xffffff, roughness: 0.7, metalness: 0.15 });
  for (const side of [-1, 1]) {
    const base = new THREE.Mesh(new THREE.CylinderGeometry(2.85, 2.85, 1.0, 40), podMatte);
    base.rotation.z = Math.PI / 2;
    base.position.set(side * 11.85, -3.4, -0.8);
    audio.add(base);

    const face = new THREE.Mesh(new THREE.CircleGeometry(2.56, 40), grilleMat);
    face.rotation.y = side * Math.PI / 2;
    face.position.set(side * 12.36, -3.4, -0.8);
    audio.add(face);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.58, 0.055, 8, 48),
      new THREE.MeshStandardMaterial({ color: 0x4b5258, roughness: 0.38, metalness: 0.7 })
    );
    ring.rotation.y = Math.PI / 2;
    ring.position.set(side * 12.37, -3.4, -0.8);
    audio.add(ring);

    const cup = makeSpeaker();
    cup.position.set(side * 9.6, -3.4, -0.8);
    cup.rotation.y = side === 1 ? 0 : Math.PI;
    audio.add(cup);
  }

  const speakerWire = (side, color) => {
    const pts = [
      new THREE.Vector3(side * 1.0, -3.5, -14.4),
      new THREE.Vector3(side * 4.2, -9.2, -8.6),
      new THREE.Vector3(side * 7.6, -9.0, -4.2),
      new THREE.Vector3(side * 8.9, -6.4, -1.8),
      new THREE.Vector3(side * 9.4, -4.6, -0.8),
    ];
    const curve = new THREE.CatmullRomCurve3(pts, false, "centripetal");
    return new THREE.Mesh(new THREE.TubeGeometry(curve, 70, 0.07, 5, false), wireMat(color));
  };
  audio.add(speakerWire(-1, 0x3f4449));
  audio.add(speakerWire(1, 0x3f4449));
  root.add(audio);
  parts.set("audio", audio);

  /* ---- mic: mounted at the left cheek, inside the chin bar ---- */
  const micGroup = new THREE.Group();
  const micBody = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.9, 18), MAT.chip);
  micBody.rotation.z = Math.PI / 2;
  micBody.rotation.y = -0.5;
  micBody.position.set(-4.4, -7.9, 12.2);
  micGroup.add(micBody);
  const micMesh = new THREE.Mesh(new THREE.CircleGeometry(0.3, 20), new THREE.MeshStandardMaterial({ color: 0x2a2e32, roughness: 0.9 }));
  micMesh.position.set(-4.9, -7.9, 12.45);
  micMesh.rotation.y = -0.95;
  micGroup.add(micMesh);
  const micWireCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-4.9, -7.9, 11.9),
    new THREE.Vector3(-6.2, -9.4, 7.2),
    new THREE.Vector3(-5.6, -10.6, -2.2),
    new THREE.Vector3(-2.3, -6.8, -14.3),
  ], false, "centripetal");
  micGroup.add(new THREE.Mesh(new THREE.TubeGeometry(micWireCurve, 60, 0.055, 5, false), wireMat(0x6c4f86)));
  root.add(micGroup);
  parts.set("mic", micGroup);

  /* ---- finish: clone materials per part for highlighting ---- */
  for (const [id, group] of parts) {
    group.userData.partId = id;
    group.traverse((o) => {
      if (o.isMesh && o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        const cloned = mats.map((m) => {
          const c = m.clone();
          c.userData.baseEmissive = c.emissive ? c.emissive.getHex() : null;
          c.userData.baseIntensity = c.emissiveIntensity ?? 1;
          return c;
        });
        o.material = Array.isArray(o.material) ? cloned : cloned[0];
        finish.push(o);
      }
    });
  }
  // the EPS liner is picked and highlight as part of "Liner + pads"
  linerGroup.userData.partId = "pads";

  return { root, parts, finish };
}

/* ------------------------------------------------------------------ */
/* viewer                                                              */
/* ------------------------------------------------------------------ */

export function createHelmetViewer(container, opts = {}) {
  const { hero = false, autoRotate = hero, onSelect = null } = opts;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(hero ? 30 : 31, 1, 0.5, 300);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.98;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.localClippingEnabled = true;
  container.appendChild(renderer.domElement);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new RoomEnvironment();
  const env = pmrem.fromScene(envScene, 0.04).texture;
  scene.environment = env;
  envScene.dispose?.();
  pmrem.dispose();

  const key = new THREE.DirectionalLight(0xfff2dd, 2.4);
  key.position.set(26, 34, 30);
  const rim = new THREE.DirectionalLight(0xd8f44b, 2.5);
  rim.position.set(-36, 10, -20);
  const rimCool = new THREE.DirectionalLight(0xc6d8e2, 1.5);
  rimCool.position.set(34, 16, -26);
  const fill = new THREE.DirectionalLight(0x9db6c4, 0.65);
  fill.position.set(18, -16, 20);
  const under = new THREE.DirectionalLight(0xffffff, 0.35);
  under.position.set(0, -30, 4);
  const back = new THREE.DirectionalLight(0xfff6e8, 1.25);
  back.position.set(2, 18, -34);
  scene.add(key, rim, rimCool, fill, under, back, new THREE.HemisphereLight(0xdfe6ef, 0x0a0b0d, 0.5));

  const { root, parts } = buildModel();
  scene.add(root);

  const clipPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 40);
  const clippable = ["shell", "visor", "pads"];
  for (const [id, group] of parts) {
    if (!clippable.includes(id)) continue;
    group.traverse((o) => {
      if (o.isMesh && o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => {
          m.clippingPlanes = [clipPlane];
          m.clipShadows = true;
        });
      }
    });
  }

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.075;
  controls.enablePan = false;
  controls.minDistance = 48;
  controls.maxDistance = 150;
  controls.minPolarAngle = 0.18;
  controls.maxPolarAngle = Math.PI - 0.18;
  controls.autoRotate = autoRotate;
  controls.autoRotateSpeed = 0.45;
  controls.target.set(0, -0.6, 0);

  const presets = {
    hero: { pos: [40, 18, 76], target: [0, -1, 0] },
    three: { pos: [42, 16, 74], target: [0, -1, 0] },
    side: { pos: [-84, 6, 12], target: [0, -2, 0] },
    rear: { pos: [26, 10, -76], target: [0, -1, -6] },
    top: { pos: [4, 88, 16], target: [0, 0, 0] },
    front: { pos: [0, 2, 84], target: [0, -1, 0] },
  };

  camera.position.set(...(hero ? presets.hero.pos : presets.three.pos));
  camera.lookAt(new THREE.Vector3(...(hero ? presets.hero.target : presets.three.target)));

  let tween = null;
  const api = {
    scene,
    camera,
    renderer,
    parts,
    cutaway: 0,
    explode: 0,
    ghost: false,
    selected: null,
  };

  function applyCamera(name) {
    const p = presets[name] || presets.three;
    tween = {
      t: 0,
      fromPos: camera.position.clone(),
      toPos: new THREE.Vector3(...p.pos),
      fromTarget: controls.target.clone(),
      toTarget: new THREE.Vector3(...p.target),
      dur: 0.85,
    };
    controls.autoRotate = false;
  }

  api.setPreset = applyCamera;

  const explodeMap = {
    shell: new THREE.Vector3(0, 9, -1.5),
    liner: new THREE.Vector3(0, 0, 0),
    visor: new THREE.Vector3(0, 2, 14),
    pads: new THREE.Vector3(0, -6, 3),
    bay: new THREE.Vector3(0, 0, 0),
    audio: new THREE.Vector3(0, -7, 2),
    mic: new THREE.Vector3(0, -2, 6),
  };
  const bases = new Map();
  for (const [id, group] of parts) bases.set(id, group.position.clone());
  // bay's cover is nested; handle it separately
  const cover = parts.get("bay").children.find((c) => c.userData.explode);
  const coverBase = cover ? cover.position.clone() : null;

  api.setCutaway = (v) => {
    api.cutaway = THREE.MathUtils.clamp(v, 0, 1);
  };
  api.setExplode = (v) => {
    api.explode = THREE.MathUtils.clamp(v, 0, 1);
  };
  api.setGhost = (v) => {
    api.ghost = !!v;
    for (const id of ["shell", "liner", "visor", "pads"]) {
      parts.get(id).traverse((o) => {
        if (!o.isMesh || !o.material) return;
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => {
          if (api.ghost) {
            if (m.userData.wasTransparent === undefined) {
              m.userData.wasTransparent = m.transparent;
              m.userData.wasOpacity = m.opacity;
              m.userData.wasDepthWrite = m.depthWrite;
            }
            m.transparent = true;
            m.opacity = id === "visor" ? 0.12 : 0.14;
            m.depthWrite = false;
            m.needsUpdate = true;
          } else if (m.userData.wasTransparent !== undefined) {
            m.transparent = m.userData.wasTransparent;
            m.opacity = m.userData.wasOpacity;
            m.depthWrite = m.userData.wasDepthWrite;
            delete m.userData.wasTransparent;
            m.needsUpdate = true;
          }
        });
      });
    }
  };

  api.select = (id) => {
    api.selected = id;
    for (const [pid, group] of parts) {
      group.traverse((o) => {
        if (!o.isMesh || !o.material) return;
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => {
          if (!m.emissive) return;
          if (pid === id || (id === "pads" && pid === "liner")) {
            m.emissive.setHex(HI);
            m.emissiveIntensity = m.userData.baseIntensity > 1 ? m.userData.baseIntensity : 0.08;
          } else if (m.userData.baseEmissive !== undefined && m.userData.baseEmissive !== null) {
            m.emissive.setHex(m.userData.baseEmissive);
            m.emissiveIntensity = m.userData.baseIntensity ?? 1;
          }
        });
      });
    }
  };

  /* picking */
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let downX = 0;
  let downY = 0;
  const onDown = (e) => {
    downX = e.clientX;
    downY = e.clientY;
  };
  const onUp = (e) => {
    if (Math.hypot(e.clientX - downX, e.clientY - downY) > 5) return;
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(root.children, true);
    if (!hits.length) return;
    let node = hits[0].object;
    while (node && !node.userData.partId) node = node.parent;
    if (node && onSelect) {
      api.select(node.userData.partId);
      onSelect(node.userData.partId);
    }
  };
  renderer.domElement.addEventListener("pointerdown", onDown);
  renderer.domElement.addEventListener("pointerup", onUp);

  /* sizing */
  const resize = () => {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  /* animation */
  let raf = 0;
  let last = performance.now();
  let visible = true;
  const io = new IntersectionObserver(
    (entries) => {
      visible = entries.some((e) => e.isIntersecting);
    },
    { rootMargin: "120px" }
  );
  io.observe(container);

  function tick(now) {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!visible) return;

    if (tween) {
      tween.t += dt / tween.dur;
      const t = Math.min(1, tween.t);
      const e = 1 - Math.pow(1 - t, 3);
      camera.position.lerpVectors(tween.fromPos, tween.toPos, e);
      controls.target.lerpVectors(tween.fromTarget, tween.toTarget, e);
      if (t >= 1) tween = null;
    }

    // clipping
    const targetConst = 40 - 40 * api.cutaway;
    clipPlane.constant += (targetConst - clipPlane.constant) * Math.min(1, dt * 8);

    // explode
    for (const [id, group] of parts) {
      if (id === "bay") continue;
      const base = bases.get(id);
      const off = explodeMap[id] || new THREE.Vector3();
      const tx = base.x + off.x * api.explode;
      const ty = base.y + off.y * api.explode;
      const tz = base.z + off.z * api.explode;
      group.position.x += (tx - group.position.x) * Math.min(1, dt * 7);
      group.position.y += (ty - group.position.y) * Math.min(1, dt * 7);
      group.position.z += (tz - group.position.z) * Math.min(1, dt * 7);
    }
    if (cover && coverBase) {
      const off = cover.userData.explode;
      const tx = coverBase.x + off.x * api.explode;
      const ty = coverBase.y + off.y * api.explode;
      const tz = coverBase.z + off.z * api.explode;
      cover.position.x += (tx - cover.position.x) * Math.min(1, dt * 7);
      cover.position.y += (ty - cover.position.y) * Math.min(1, dt * 7);
      cover.position.z += (tz - cover.position.z) * Math.min(1, dt * 7);
    }

    controls.update();
    renderer.render(scene, camera);
  }
  raf = requestAnimationFrame(tick);

  api.dispose = () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    renderer.domElement.removeEventListener("pointerdown", onDown);
    renderer.domElement.removeEventListener("pointerup", onUp);
    controls.dispose();
    renderer.dispose();
    env.dispose();
  };

  return api;
}
