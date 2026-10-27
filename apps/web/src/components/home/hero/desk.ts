/* ──────────────────────────────────────────────────────────────
   The desk diorama.

   A clay model of the desk this site is built at, sitting on a mint
   base. Every object is a door: the laptop (its screen cycles through
   real project screenshots) goes to the work, the camera to the
   photographs, the notebook to the writing, the toolbox to the tools,
   the plant to the notes, Baymax to the about. The lamp switches the
   site between day and night.

   Baymax follows the pointer with his head and breathes. Drag sideways
   to turn the model; it keeps a little momentum.
   ────────────────────────────────────────────────────────────── */
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export type DeskKey = "laptop" | "baymax" | "camera" | "notebook" | "toolbox" | "plant" | "lamp" | "mug";

export interface DeskTarget {
  key: DeskKey;
  label: string;
  sub: string;
}

export interface DeskOptions {
  canvas: HTMLCanvasElement;
  label: HTMLElement;
  screens: string[];
  reducedMotion: boolean;
  onHover: (target: DeskTarget | null) => void;
  onSelect: (key: DeskKey) => void;
  onReady: () => void;
}

export const DESK_TARGETS: Record<DeskKey, DeskTarget> = {
  laptop: { key: "laptop", label: "Projects", sub: "The laptop" },
  baymax: { key: "baymax", label: "About", sub: "Baymax Engineer" },
  camera: { key: "camera", label: "Photos", sub: "The camera" },
  notebook: { key: "notebook", label: "Writing", sub: "The notebook" },
  toolbox: { key: "toolbox", label: "Tools", sub: "The toolbox" },
  plant: { key: "plant", label: "Notes", sub: "Still growing" },
  mug: { key: "mug", label: "Get in touch", sub: "Coffee?" },
  lamp: { key: "lamp", label: "Lights", sub: "Switch day and night" },
};

const C = {
  base: "#7cc4a4",
  baseSide: "#5fa98a",
  wood: "#e3b98c",
  woodDark: "#c99a6c",
  plum: "#4a4552",
  ink: "#2b2a33",
  white: "#fbf8f3",
  laptop: "#cfcad3",
  coral: "#ff6b4a",
  mustard: "#eab14d",
  leaf: "#5fae7f",
  leafDark: "#3f8a63",
  pot: "#4a4552",
  bulb: "#fff1cf",
};

const clay = (color: string, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.82, metalness: 0, flatShading: false, ...extra });

const rbox = (w: number, h: number, d: number, r = 0.06) => new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2, h / 2, d / 2));

function shadowAll(o: THREE.Object3D) {
  o.traverse((c) => {
    const m = c as THREE.Mesh;
    if (m.isMesh) {
      m.castShadow = true;
      m.receiveShadow = true;
    }
  });
}

const imageUrl = (src: string) => `/_next/image?url=${encodeURIComponent(src)}&w=640&q=75`;

export function createDesk(opts: DeskOptions) {
  const { canvas, label, reducedMotion } = opts;
  const isDark = () => document.documentElement.dataset.theme === "dark";

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 200);
  const camHome = new THREE.Vector3(10.5, 9.2, 13.5);
  const lookAt = new THREE.Vector3(0, 1.55, 0);

  // ── Light ──
  const hemi = new THREE.HemisphereLight("#fff4e6", "#b99c80", 1.25);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight("#fff1dd", 2.2);
  sun.position.set(-6, 12, 6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -7;
  sun.shadow.camera.right = 7;
  sun.shadow.camera.top = 7;
  sun.shadow.camera.bottom = -7;
  sun.shadow.radius = 4;
  sun.shadow.bias = -0.0008;
  scene.add(sun);

  // ── Model ──
  const world = new THREE.Group();
  scene.add(world);

  const base = new THREE.Group();
  const top = new THREE.Mesh(new THREE.CylinderGeometry(5.3, 5.3, 0.36, 64), clay(C.base));
  top.position.y = -0.18;
  const side = new THREE.Mesh(new THREE.CylinderGeometry(5.3, 5.05, 0.5, 64), clay(C.baseSide));
  side.position.y = -0.61;
  base.add(top, side);
  shadowAll(base);
  side.castShadow = false;
  world.add(base);

  // Desk
  const desk = new THREE.Group();
  const deskTop = new THREE.Mesh(rbox(6.4, 0.24, 3.2, 0.08), clay(C.wood));
  deskTop.position.y = 2.0;
  desk.add(deskTop);
  for (const [x, z] of [[-2.95, -1.35], [2.95, -1.35], [-2.95, 1.35], [2.95, 1.35]] as const) {
    const leg = new THREE.Mesh(rbox(0.2, 1.9, 0.2, 0.05), clay(C.woodDark));
    leg.position.set(x, 0.95, z);
    desk.add(leg);
  }
  const drawer = new THREE.Mesh(rbox(1.6, 0.42, 2.6, 0.06), clay(C.woodDark));
  drawer.position.set(2.0, 1.62, 0);
  desk.add(drawer);
  shadowAll(desk);
  world.add(desk);

  const D = 2.12; // desk surface height

  // Stool (furniture, not a door)
  const stool = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.18, 32), clay(C.plum));
  seat.position.y = 1.2;
  stool.add(seat);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + 0.4;
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 1.2, 8), clay(C.ink));
    leg.position.set(Math.cos(a) * 0.38, 0.6, Math.sin(a) * 0.38);
    stool.add(leg);
  }
  stool.position.set(-0.4, 0, 2.6);
  shadowAll(stool);
  world.add(stool);

  const doors = new Map<DeskKey, THREE.Group>();
  const door = (key: DeskKey, g: THREE.Group, x: number, y: number, z: number, ry = 0) => {
    g.position.set(x, y, z);
    g.rotation.y = ry;
    g.userData = { key, lift: 0, home: y, drop: 0 };
    shadowAll(g);
    world.add(g);
    doors.set(key, g);
    return g;
  };

  // Laptop — the screen shows real work.
  const laptop = new THREE.Group();
  const lapBase = new THREE.Mesh(rbox(1.9, 0.08, 1.3, 0.04), clay(C.laptop, { roughness: 0.5 }));
  lapBase.position.y = 0.04;
  laptop.add(lapBase);
  const keys = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.6), clay("#b9b3bd"));
  keys.rotation.x = -Math.PI / 2;
  keys.position.set(0, 0.085, -0.12);
  laptop.add(keys);
  const hinge = new THREE.Group();
  hinge.position.set(0, 0.08, -0.62);
  hinge.rotation.x = -0.28;
  const lid = new THREE.Mesh(rbox(1.9, 1.25, 0.06, 0.04), clay(C.laptop, { roughness: 0.5 }));
  lid.position.y = 0.62;
  hinge.add(lid);
  const screenMats = [0, 1].map(() => new THREE.MeshBasicMaterial({ color: "#1e1d24", transparent: true, opacity: 1 }));
  const screens = screenMats.map((m, i) => {
    const s = new THREE.Mesh(new THREE.PlaneGeometry(1.74, 1.08), m);
    s.position.set(0, 0.62, 0.032 + i * 0.001);
    hinge.add(s);
    return s;
  });
  laptop.add(hinge);
  door("laptop", laptop, 0.35, D, -0.35, -0.08);

  // Baymax
  const baymax = new THREE.Group();
  const white = clay(C.white, { roughness: 0.6 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 40, 32), white);
  body.scale.set(1.08, 1.22, 0.92);
  body.position.y = 0.66;
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.5, 40, 32), white);
  belly.scale.set(1.18, 0.9, 1.02);
  belly.position.y = 0.42;
  baymax.add(body, belly);
  const legGeo = new THREE.CapsuleGeometry(0.16, 0.12, 6, 16);
  for (const x of [-0.22, 0.22]) {
    const leg = new THREE.Mesh(legGeo, white);
    leg.position.set(x, 0.12, 0.05);
    baymax.add(leg);
  }
  const armGeo = new THREE.CapsuleGeometry(0.14, 0.52, 6, 16);
  const armL = new THREE.Group();
  const armR = new THREE.Group();
  for (const [g, x, s] of [[armL, -0.52, -1], [armR, 0.52, 1]] as const) {
    g.position.set(x, 0.98, 0);
    const a = new THREE.Mesh(armGeo, white);
    a.position.y = -0.34;
    g.add(a);
    g.rotation.z = s * 0.2;
    baymax.add(g);
  }
  const head = new THREE.Group();
  head.position.y = 1.38;
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.3, 40, 24), white);
  skull.scale.set(1.25, 0.92, 1.05);
  head.add(skull);
  const eyeMat = new THREE.MeshBasicMaterial({ color: "#16151a" });
  for (const x of [-0.13, 0.13]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.048, 16, 12), eyeMat);
    eye.scale.set(1, 1, 0.5);
    eye.position.set(x, 0.02, 0.305);
    head.add(eye);
  }
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.26, 8), eyeMat);
  bar.rotation.z = Math.PI / 2;
  bar.position.set(0, 0.02, 0.31);
  head.add(bar);
  baymax.add(head);
  door("baymax", baymax, -1.5, D, 0.3, 0.3);

  // Camera
  const cam = new THREE.Group();
  const camBody = new THREE.Mesh(rbox(0.7, 0.44, 0.34, 0.06), clay(C.ink, { roughness: 0.55 }));
  camBody.position.y = 0.22;
  cam.add(camBody);
  const camTop = new THREE.Mesh(rbox(0.28, 0.12, 0.24, 0.03), clay(C.ink));
  camTop.position.set(-0.14, 0.48, 0);
  cam.add(camTop);
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.17, 0.24, 32), clay("#1a191f", { roughness: 0.4 }));
  lens.rotation.x = Math.PI / 2;
  lens.position.set(0.06, 0.22, 0.27);
  cam.add(lens);
  const glass = new THREE.Mesh(new THREE.CircleGeometry(0.115, 32), new THREE.MeshStandardMaterial({ color: "#3d4b5e", roughness: 0.1, metalness: 0.4 }));
  glass.position.set(0.06, 0.22, 0.395);
  cam.add(glass);
  const flashMat = new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0 });
  const flash = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 12), flashMat);
  flash.position.set(-0.14, 0.5, 0.2);
  cam.add(flash);
  door("camera", cam, 2.0, D, 0.85, -0.45);

  // Notebook + pen
  const book = new THREE.Group();
  const pages = new THREE.Mesh(rbox(1.0, 0.1, 0.74, 0.03), clay(C.white));
  pages.position.y = 0.05;
  book.add(pages);
  const coverHinge = new THREE.Group();
  coverHinge.position.set(-0.5, 0.11, 0);
  const cover = new THREE.Mesh(rbox(1.04, 0.03, 0.78, 0.015), clay(C.coral));
  cover.position.x = 0.52;
  coverHinge.add(cover);
  book.add(coverHinge);
  const pen = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.8, 10), clay(C.ink));
  pen.rotation.set(Math.PI / 2, 0, 0.55);
  pen.position.set(0.72, 0.05, 0.08);
  book.add(pen);
  door("notebook", book, -0.15, D, 0.95, 0.22);

  // Mug with steam
  const mug = new THREE.Group();
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.2, 0.42, 32), clay(C.white));
  cup.position.y = 0.21;
  mug.add(cup);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.222, 0.215, 0.08, 32), clay(C.coral));
  band.position.y = 0.3;
  mug.add(band);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.03, 10, 24), clay(C.white));
  handle.position.set(0.24, 0.22, 0);
  mug.add(handle);
  const coffee = new THREE.Mesh(new THREE.CircleGeometry(0.19, 24), clay("#6b4630"));
  coffee.rotation.x = -Math.PI / 2;
  coffee.position.y = 0.39;
  mug.add(coffee);
  const steamMat = new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.5, depthWrite: false });
  const steam = [0, 1, 2].map((i) => {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), steamMat.clone());
    s.userData.phase = i / 3;
    mug.add(s);
    return s;
  });
  door("mug", mug, -2.7, D, -0.85);

  // Lamp — switches day and night
  const lamp = new THREE.Group();
  const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.34, 0.08, 32), clay(C.ink));
  lampBase.position.y = 0.04;
  lamp.add(lampBase);
  const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.3, 10), clay(C.ink));
  arm1.position.set(0.12, 0.66, 0);
  arm1.rotation.z = -0.2;
  lamp.add(arm1);
  const arm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.95, 10), clay(C.ink));
  arm2.position.set(0.55, 1.36, 0);
  arm2.rotation.z = -1.15;
  lamp.add(arm2);
  const shade = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.36, 32, 1, true), clay(C.mustard, { side: THREE.DoubleSide }));
  shade.position.set(0.98, 1.42, 0);
  shade.rotation.z = -0.5;
  lamp.add(shade);
  const bulbMat = new THREE.MeshBasicMaterial({ color: C.bulb });
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 12), bulbMat);
  bulb.position.set(1.04, 1.3, 0);
  lamp.add(bulb);
  const lampLight = new THREE.PointLight("#ffcf8a", 0, 9, 1.4);
  lampLight.position.set(1.05, 1.15, 0);
  lamp.add(lampLight);
  door("lamp", lamp, 2.95, D, -1.2, -2.6);

  // Toolbox on the floor
  const tools = new THREE.Group();
  const box = new THREE.Mesh(rbox(1.0, 0.5, 0.56, 0.06), clay(C.mustard));
  box.position.y = 0.25;
  tools.add(box);
  const lidLine = new THREE.Mesh(rbox(1.02, 0.06, 0.58, 0.02), clay("#c98f32"));
  lidLine.position.y = 0.4;
  tools.add(lidLine);
  const tHandle = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.035, 8, 20, Math.PI), clay(C.ink));
  tHandle.position.y = 0.52;
  tools.add(tHandle);
  door("toolbox", tools, 3.25, 0, 1.75, -0.6);

  // Plant on the floor
  const plant = new THREE.Group();
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.26, 0.56, 24), clay(C.pot));
  pot.position.y = 0.28;
  plant.add(pot);
  // Leaves fan out from the top of the stem, each tipped up and out.
  const leafGeo = new THREE.SphereGeometry(0.5, 14, 10);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.9, 8), clay(C.leafDark));
  stem.position.y = 0.95;
  plant.add(stem);
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2 + 0.3;
    const tilt = 0.55 + (i % 3) * 0.18;
    const pivot = new THREE.Group();
    pivot.position.y = 1.15 + (i % 2) * 0.12;
    pivot.rotation.set(0, a, 0);
    const leaf = new THREE.Mesh(leafGeo, clay(i % 2 ? C.leafDark : C.leaf));
    leaf.scale.set(0.2, 0.05, 0.5);
    leaf.position.set(0, 0.18, 0.42);
    leaf.rotation.x = -tilt;
    pivot.add(leaf);
    plant.add(pivot);
  }
  door("plant", plant, -3.6, 0, 1.5);

  // ── Screens ──
  const loader = new THREE.TextureLoader();
  const screenTex: THREE.Texture[] = [];
  opts.screens.forEach((src, i) => {
    loader.load(imageUrl(src), (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      // Cover-crop the screenshot to the 16:10 screen, top-aligned.
      const img = t.image as HTMLImageElement;
      const sa = 1.74 / 1.08;
      const ia = img.width / img.height;
      if (ia > sa) {
        t.repeat.set(sa / ia, 1);
        t.offset.set((1 - sa / ia) / 2, 0);
      } else {
        t.repeat.set(1, ia / sa);
        t.offset.set(0, 1 - ia / sa);
      }
      screenTex[i] = t;
      if (i === 0) showScreen(0, true);
    });
  });
  let screenIdx = 0;
  let screenFade = 1;
  let front = 0;
  function showScreen(i: number, instant = false) {
    const t = screenTex[i];
    if (!t) return;
    front = 1 - front;
    const m = screenMats[front]!;
    m.map = t;
    m.color.set("#ffffff");
    m.needsUpdate = true;
    screens[front]!.position.z = 0.034;
    screens[1 - front]!.position.z = 0.032;
    screenFade = instant ? 1 : 0;
    screenIdx = i;
  }

  // ── State ──
  let width = 1;
  let height = 1;
  const pointer = { x: 0, y: 0, nx: 0, ny: 0, inside: false };
  let hovered: DeskKey | null = null;
  let focused: DeskKey | null = null;
  const drag = { active: false, startX: 0, lastX: 0, moved: 0, vel: 0 };
  let yaw = 0;
  let yawTarget = 0;
  let night = isDark() ? 1 : 0;
  let nightTarget = night;
  let flashT = -1;
  let running = false;
  let raf = 0;
  const born = performance.now();
  let lastT = born;
  let lastScreenSwap = born;
  let readySent = false;

  // Drop-in order for the intro.
  const order: DeskKey[] = ["laptop", "baymax", "notebook", "camera", "mug", "lamp", "plant", "toolbox"];
  order.forEach((k, i) => (doors.get(k)!.userData.delay = 0.35 + i * 0.09));

  function resize() {
    const r = canvas.getBoundingClientRect();
    width = Math.max(1, Math.round(r.width));
    height = Math.max(1, Math.round(r.height));
    renderer.setSize(width, height, false);
    const aspect = width / height;
    camera.aspect = aspect;
    // Frame the model: right of the copy on wide screens, under it on narrow.
    const wide = aspect > 1.05;
    const zoom = wide ? Math.min(0.94, 0.48 + aspect * 0.25) : 0.52;
    camera.zoom = zoom;
    camera.setViewOffset(width, height, wide ? -width * 0.22 : 0, wide ? height * 0.02 : -height * 0.2, width, height);
    camera.updateProjectionMatrix();
  }

  // ── Input ──
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const doorList = [...doors.values()];

  function pick(clientX: number, clientY: number): DeskKey | null {
    const r = canvas.getBoundingClientRect();
    ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObjects(doorList, true)[0];
    let o: THREE.Object3D | null = hit?.object ?? null;
    while (o && !o.userData.key) o = o.parent;
    return (o?.userData.key as DeskKey) ?? null;
  }

  function setHover(k: DeskKey | null) {
    if (k === hovered) return;
    hovered = k;
    canvas.style.cursor = k ? "pointer" : drag.active ? "grabbing" : "grab";
    opts.onHover(k ? DESK_TARGETS[k] : null);
    if (k === "camera") flashT = 0;
  }

  function onMove(e: PointerEvent) {
    const r = canvas.getBoundingClientRect();
    pointer.x = e.clientX - r.left;
    pointer.y = e.clientY - r.top;
    pointer.nx = (pointer.x / r.width) * 2 - 1;
    pointer.ny = (pointer.y / r.height) * 2 - 1;
    pointer.inside = true;
    if (drag.active) {
      const dx = e.clientX - drag.lastX;
      drag.moved += Math.abs(dx);
      drag.lastX = e.clientX;
      drag.vel = dx * 0.006;
      yawTarget = THREE.MathUtils.clamp(yawTarget + dx * 0.006, -0.9, 0.9);
    } else if (e.pointerType === "mouse") {
      setHover(pick(e.clientX, e.clientY));
    }
    wake();
  }
  function onDown(e: PointerEvent) {
    drag.active = true;
    drag.startX = drag.lastX = e.clientX;
    drag.moved = 0;
    drag.vel = 0;
    if (e.pointerType === "mouse") canvas.style.cursor = "grabbing";
    wake();
  }
  function onUp(e: PointerEvent) {
    const wasClick = drag.active && drag.moved < 6;
    drag.active = false;
    if (wasClick) {
      const k = pick(e.clientX, e.clientY);
      if (k) {
        if (k === "camera") flashT = 0;
        opts.onSelect(k);
      }
    }
    canvas.style.cursor = hovered ? "pointer" : "grab";
    wake();
  }
  function onLeave() {
    pointer.inside = false;
    drag.active = false;
    setHover(null);
    wake();
  }
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerdown", onDown);
  window.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointerleave", onLeave);
  canvas.style.cursor = "grab";

  // ── Loop ──
  const tmp = new THREE.Vector3();
  const headTarget = new THREE.Euler();
  const DAY = { hemi: 1.25, sun: 2.2, lamp: 0, sky: new THREE.Color("#fff4e6"), ground: new THREE.Color("#b99c80"), sunCol: new THREE.Color("#fff1dd") };
  const NIGHT = { hemi: 0.32, sun: 0.35, lamp: 16, sky: new THREE.Color("#6c74a8"), ground: new THREE.Color("#2a2433"), sunCol: new THREE.Color("#9aa6ff") };

  function frame(now: number) {
    const dt = Math.min(0.05, (now - lastT) / 1000);
    lastT = now;
    const age = (now - born) / 1000;
    const k = (rate: number) => 1 - Math.exp(-dt * rate);
    let moving = !reducedMotion;

    // Intro: objects are set down on the desk.
    for (const g of doorList) {
      const u = g.userData;
      const t = reducedMotion ? 1 : THREE.MathUtils.clamp((age - u.delay) / 0.7, 0, 1);
      // A soft landing: falls, compresses a touch, settles.
      const fall = 1 - Math.pow(1 - t, 3);
      const squash = t < 1 ? Math.sin(t * Math.PI) * 0.06 : 0;
      u.lift += ((g.userData.key === hovered || g.userData.key === focused ? 1 : 0) - u.lift) * k(12);
      g.position.y = u.home + (1 - fall) * 2.4 + u.lift * 0.18;
      g.scale.set(1 + squash * 0.5, 1 - squash, 1 + squash * 0.5);
      g.visible = t > 0;
      if (t < 1) moving = true;
    }
    const baseT = reducedMotion ? 1 : THREE.MathUtils.clamp(age / 0.6, 0, 1);
    world.scale.setScalar(0.92 + 0.08 * (1 - Math.pow(1 - baseT, 3)));

    // Turn: dragged, with momentum, else an unhurried sway.
    if (!drag.active) {
      yawTarget += drag.vel;
      drag.vel *= Math.pow(0.0015, dt);
      yawTarget = THREE.MathUtils.clamp(yawTarget, -0.9, 0.9);
      if (!reducedMotion && Math.abs(drag.vel) < 0.0005) yawTarget += (Math.sin(age * 0.25) * 0.08 - yawTarget) * k(0.4);
    }
    yaw += (yawTarget - yaw) * k(8);
    world.rotation.y = yaw;
    if (!reducedMotion) world.position.y = Math.sin(age * 0.9) * 0.04;

    // Baymax watches the pointer and breathes.
    if (!reducedMotion) {
      const tx = pointer.inside ? pointer.nx : Math.sin(age * 0.4) * 0.3;
      const ty = pointer.inside ? pointer.ny : 0.1;
      headTarget.set(THREE.MathUtils.clamp(ty * 0.35, -0.3, 0.35), THREE.MathUtils.clamp(tx * 0.7 - 0.25, -0.75, 0.6), 0);
      head.rotation.x += (headTarget.x - head.rotation.x) * k(5);
      head.rotation.y += (headTarget.y - head.rotation.y) * k(5);
      const breath = Math.sin(age * 1.6) * 0.012;
      body.scale.y = 1.22 + breath;
      belly.scale.x = 1.18 + breath;
      // Hovering him gets a wave.
      const wave = hovered === "baymax" || focused === "baymax" ? Math.sin(age * 9) * 0.35 - 2.4 : 0.2;
      armR.rotation.z += (wave - armR.rotation.z) * k(8);
    }

    // The notebook cover lifts when it is the target.
    const bookOpen = hovered === "notebook" || focused === "notebook" ? -0.9 : 0;
    coverHinge.rotation.z += (bookOpen - coverHinge.rotation.z) * k(9);

    // Steam
    steam.forEach((s) => {
      const p = reducedMotion ? 0.4 : (age * 0.35 + s.userData.phase) % 1;
      s.position.set(Math.sin(p * 6 + s.userData.phase * 4) * 0.06, 0.45 + p * 0.7, 0);
      s.scale.setScalar(0.6 + p * 1.1);
      (s.material as THREE.MeshBasicMaterial).opacity = (1 - p) * (0.45 - night * 0.25);
    });

    // Camera flash
    if (flashT >= 0) {
      flashT += dt;
      const f = Math.max(0, 1 - flashT / 0.35);
      flashMat.opacity = f * 0.9;
      flash.scale.setScalar(0.3 + (1 - f) * 1.4);
      if (flashT > 0.35) flashT = -1;
      moving = true;
    }

    // Screen: swap every few seconds, crossfading.
    if (screenTex.length > 1 && now - lastScreenSwap > 3600 && !reducedMotion) {
      lastScreenSwap = now;
      for (let i = 1; i <= screenTex.length; i++) {
        const n = (screenIdx + i) % opts.screens.length;
        if (screenTex[n]) {
          showScreen(n);
          break;
        }
      }
    }
    screenFade = Math.min(1, screenFade + dt * 2.5);
    screenMats[front]!.opacity = screenFade;
    screenMats[1 - front]!.opacity = 1;

    // Day and night
    night += (nightTarget - night) * k(4);
    hemi.intensity = THREE.MathUtils.lerp(DAY.hemi, NIGHT.hemi, night);
    hemi.color.copy(DAY.sky).lerp(NIGHT.sky, night);
    hemi.groundColor.copy(DAY.ground).lerp(NIGHT.ground, night);
    sun.intensity = THREE.MathUtils.lerp(DAY.sun, NIGHT.sun, night);
    sun.color.copy(DAY.sunCol).lerp(NIGHT.sunCol, night);
    lampLight.intensity = THREE.MathUtils.lerp(DAY.lamp, NIGHT.lamp, night);
    bulbMat.color.set(night > 0.5 ? "#fff1cf" : "#e9e0cf");
    if (Math.abs(nightTarget - night) > 0.002) moving = true;

    // Camera breathes with the pointer a little.
    const px = pointer.inside && !reducedMotion ? pointer.nx : 0;
    const py = pointer.inside && !reducedMotion ? pointer.ny : 0;
    tmp.set(camHome.x + px * 0.6, camHome.y - py * 0.4, camHome.z);
    camera.position.lerp(tmp, k(3));
    camera.lookAt(lookAt);

    // Label follows its object.
    const key = hovered ?? focused;
    if (key) {
      const g = doors.get(key)!;
      tmp.set(0, 0, 0);
      g.localToWorld(tmp);
      tmp.y += key === "baymax" ? 1.9 : key === "plant" ? 2.3 : key === "lamp" ? 1.9 : 1.2;
      tmp.project(camera);
      const x = (tmp.x * 0.5 + 0.5) * width;
      const y = (-tmp.y * 0.5 + 0.5) * height;
      label.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    }

    renderer.render(scene, camera);
    if (!readySent) {
      readySent = true;
      opts.onReady();
    }

    if (running && (moving || drag.active || Math.abs(yawTarget - yaw) > 0.0005)) raf = requestAnimationFrame(frame);
    else raf = 0;
  }

  function wake() {
    if (running && !raf) {
      lastT = performance.now();
      raf = requestAnimationFrame(frame);
    }
  }

  const themeObs = new MutationObserver(() => {
    nightTarget = isDark() ? 1 : 0;
    wake();
  });
  themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  const ro = new ResizeObserver(() => {
    resize();
    wake();
  });
  ro.observe(canvas);
  resize();

  const io = new IntersectionObserver(([e]) => {
    running = !!e?.isIntersecting && document.visibilityState === "visible";
    if (running) wake();
  });
  io.observe(canvas);
  const onVis = () => {
    running = document.visibilityState === "visible";
    if (running) wake();
  };
  document.addEventListener("visibilitychange", onVis);

  running = true;
  camera.position.copy(camHome);
  wake();

  return {
    /** Highlight an object from outside (keyboard focus on its link). */
    focus(k: DeskKey | null) {
      focused = k;
      opts.onHover(k ? DESK_TARGETS[k] : hovered ? DESK_TARGETS[hovered] : null);
      wake();
    },
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      themeObs.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (!m.isMesh) return;
        m.geometry.dispose();
        const mat = m.material as THREE.MeshBasicMaterial;
        mat.map?.dispose();
        mat.dispose();
      });
      screenTex.forEach((t) => t.dispose());
      renderer.dispose();
    },
  };
}
