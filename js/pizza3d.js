/* Sitio de muestra — portada con la pizza 3D (fotos reales por capas).
   La pizza arranca detrás del título y se desarma en 20 fases con el scroll;
   en cada fase aparece un panel de información. Necesita GSAP + ScrollTrigger. */
(() => {
  const story = document.getElementById('inicio');
  const pizza = document.getElementById('pizza');
  if (!story || !pizza) return;

  /* ------------------------------------------------------------ utilidades */
  let SEED = 20;
  const rnd = () => (SEED = (SEED * 16807) % 2147483647) / 2147483647;
  const R = (a, b) => a + rnd() * (b - a);
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const n1 = v => v.toFixed(1);
  const TAU = Math.PI * 2;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animated = !!(window.gsap && window.ScrollTrigger) && !reduce;
  document.documentElement.classList.add(animated ? 'pz3d' : 'pz-static');
  // Celulares y tabletas: modo liviano. Sin 3D del navegador (preserve-3d traba y pinta capas en negro
  // en muchos celulares): la perspectiva se calcula aquí y cada capa se mueve como una imagen plana.
  // Además: menos piezas, fotos más pequeñas, sin filtros ni máscaras, y solo se dibuja al hacer scroll.
  const LITE = matchMedia('(pointer: coarse)').matches || innerWidth < 768;
  if (LITE) document.documentElement.classList.add('pz-lite');
  const N = (full, lite) => (LITE ? lite : full);
  const thin = zs => (LITE ? zs.filter((_, i) => i % 2 === 0 || i === zs.length - 1) : zs);
  let visible = true, raf = 0, dirty = true;   // estado del dibujo (ver loop al final)

  /* ------------------------------------------------------------ fondo de piedra */
  document.getElementById('stone').style.backgroundImage = 'url("img/piedra.webp")';

  /* ------------------------------------------------------------ construcción */
  const D = { board: 720, base: 600, tom: 150 };
  const Z = { dough: 14, sauce: 16, cheese: 18.5, tom: 21, oreg: 23 };
  const IMG = n => `img/pizza/${n}${LITE && n !== 'tomate' ? '-m' : ''}.webp`;

  function put(tag, cls, size, parent, h = size) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    e.style.width = size + 'px'; e.style.height = h + 'px';
    e.style.marginLeft = (-size / 2) + 'px'; e.style.marginTop = (-h / 2) + 'px';
    parent.appendChild(e);
    return e;
  }
  function topImg(src, size, parent, z) {
    const img = put('img', 'top', size, parent);
    img.alt = ''; img.draggable = false; img.decoding = 'async'; img.src = src;
    img.style.transform = `translateZ(${z}px)`;
    (parent.__leaves ||= []).push({ el: img, z });
    return img;
  }
  function discs(parent, size, zs, c1, c2) {
    zs = thin(zs);
    zs.forEach((z, i) => {
      const d = put('div', 'disc', size, parent);
      d.style.background = `radial-gradient(circle at 50% 50%, ${c1} 60%, ${c2} 100%)`;
      if (!LITE) d.style.filter = `brightness(${1 - (i / Math.max(1, zs.length - 1)) * 0.35})`;
      d.style.transform = `translateZ(${z}px)`;
      (parent.__leaves ||= []).push({ el: d, z });
    });
  }
  function shadowDiv(parent, size, z) {
    const s = put('div', 'shadow', size, parent);
    s.style.background = 'radial-gradient(closest-side, rgba(10,4,0,.75), rgba(10,4,0,.45) 62%, rgba(10,4,0,0) 100%)';
    s.dataset.z = z;
    return s;
  }
  // Brillo que sigue a la luz, recortado con la forma de la foto (da volumen)
  const glosses = [];
  function gloss(src, size, parent, z, power, rotOf, round = false) {
    if (LITE) {
      // en celular: brillo fijo y sin máscara, solo en las rodajas redondas
      if (!round) return null;
      const g = put('div', 'gloss', size * 0.94, parent);
      g.style.borderRadius = '50%';
      g.style.background = `radial-gradient(circle at 34% 30%, rgba(255,250,240,${power}) 0, rgba(255,250,240,0) 36%), radial-gradient(circle, rgba(20,4,0,0) 58%, rgba(20,4,0,.4) 100%)`;
      g.style.transform = `translateZ(${z}px)`;
      (parent.__leaves ||= []).push({ el: g, z });
      return g;
    }
    const g = put('div', 'gloss', size, parent);
    g.style.webkitMaskImage = g.style.maskImage = `url(${src})`;
    g.style.webkitMaskSize = g.style.maskSize = '100% 100%';
    g.style.transform = `translateZ(${z}px)`;
    glosses.push({ el: g, power, rotOf, last: '' });
    return g;
  }
  const group = () => { const g = document.createElement('div'); g.className = 'g'; pizza.appendChild(g); return g; };

  const boardShadow = shadowDiv(pizza, 780, -30);

  const gBoard = group();
  discs(gBoard, D.board * 0.995, [-24, -21, -18, -15, -12, -9, -6, -3], '#6E3A16', '#3F1F09');
  const imgBoard = topImg(IMG('tabla'), D.board, gBoard, 0);
  const shDough = shadowDiv(gBoard, D.base * 1.02, 0.6);

  const gDough = group();
  discs(gDough, D.base * 0.975, [2, 4.5, 7, 9.5, 12], '#D7B385', '#9C7146');
  const imgDough = topImg(IMG('masa'), D.base, gDough, Z.dough);
  const shSauce = shadowDiv(gDough, D.base * 0.86, Z.dough + 0.6);

  const gSauce = group();
  discs(gSauce, D.base * 0.78, [-1, -2.2, -3.4, -4.6], '#B1281A', '#6A0F05');
  const imgSauce = topImg(IMG('salsa'), D.base, gSauce, 0);
  gloss(IMG('salsa'), D.base, gSauce, 0.3, .34, () => st.rz);
  const shCheese = shadowDiv(gSauce, D.base * 0.8, 0.6);

  const gCheese = group();
  discs(gCheese, D.base * 0.7, [-1, -2.2, -3.4], '#F2D68C', '#C4933F');
  const imgCheese = topImg(IMG('queso'), D.base, gCheese, 0);
  gloss(IMG('queso'), D.base, gCheese, 0.3, .26, () => st.rz);

  const toms = [];
  const spots = [[0, 0]];
  for (let k = 0; k < 5; k++) spots.push([158, (k / 5) * TAU + 0.35]);
  spots.forEach(([r, a]) => {
    const g = group();
    discs(g, D.tom * 0.925, [-1, -2.4, -3.8, -5.2, -6.6, -8, -9.4], '#D42A1A', '#8A0F06');
    const img = topImg(IMG('tomate'), D.tom, g, 0);
    const sh = shadowDiv(gCheese, D.tom * 1.05, 0.6);
    const tm = { g, img, sh, r, a, rot: R(0, 360), spin: R(.6, 1.4) * (rnd() > .5 ? 1 : -1),
      tx: R(-40, -26), ty: R(-18, 18), dz: R(-30, 30), ph: R(0, TAU), sc: R(.9, 1.06) };
    gloss(IMG('tomate'), D.tom, g, 0.4, .42, () => st.rz + tm.rot + st.tomSpin * tm.spin, true);
    toms.push(tm);
  });

  const flakes = [];
  const greens = ['#4B5126', '#5C5A2C', '#3A3E1C', '#6A6534', '#2D3015', '#55602A'];
  for (let i = 0; i < N(90, 30); i++) {
    const s = R(7, 19);
    const e = put('div', 'flake', s, pizza, s * R(.5, .9));
    e.style.background = greens[Math.floor(rnd() * greens.length)];
    const pts = Array.from({ length: 5 }, (_, k) => {
      const a = (k / 5) * TAU + R(-.4, .4), rr = R(30, 50);
      return `${n1(50 + Math.cos(a) * rr)}% ${n1(50 + Math.sin(a) * rr)}%`;
    });
    e.style.clipPath = `polygon(${pts.join(',')})`;
    const a = R(0, TAU), r = Math.sqrt(rnd()) * 235, a2 = a + R(-.5, .5), r2 = R(120, 420);
    flakes.push({ e, x0: Math.cos(a) * r, y0: Math.sin(a) * r, x1: Math.cos(a2) * r2, y1: Math.sin(a2) * r2,
      z1: R(250, 470), lift: R(40, 120), rot: R(0, 360), spin: R(-260, 260), flip: R(-180, 180), ph: R(0, TAU) });
  }

  const shreds = [];
  for (let i = 0; i < N(34, 12); i++) {
    const e = put('div', 'shred', R(4, 8), gCheese, R(22, 58));
    e.style.borderRadius = '50%';
    e.style.background = 'linear-gradient(180deg, #FFF6D0, #F6D271 60%, #E3A945)';
    const a = R(0, TAU), r = R(40, 240), r2 = r + R(120, 300);
    shreds.push({ e, x0: Math.cos(a) * r, y0: Math.sin(a) * r, x1: Math.cos(a) * r2, y1: Math.sin(a) * r2,
      z1: R(40, 200), rot: a * 57.3 + 90 + R(-40, 40), spin: R(-120, 120), flip: R(-70, 70) });
  }

  const drops = [];
  for (let i = 0; i < N(26, 10); i++) {
    const s = R(6, 22);
    const e = put('div', 'drop', s, gSauce, s * R(.75, 1));
    e.style.borderRadius = `${R(40, 60)}% ${R(40, 60)}% ${R(40, 60)}% ${R(40, 60)}%`;
    e.style.background = 'radial-gradient(circle at 35% 30%, #FF8A6E 0, #D8301B 35%, #8C1506 100%)';
    const a = R(0, TAU), r = R(60, 240), r2 = r + R(140, 330);
    drops.push({ e, x0: Math.cos(a) * r, y0: Math.sin(a) * r, x1: Math.cos(a) * r2, y1: Math.sin(a) * r2,
      z1: R(20, 150), rot: R(0, 360), flip: R(-80, 80) });
  }

  /* ------------------------------------------------------------ estado */
  const st = {
    rx: 58, rz: -32, sc: 1.02, y: 20, sink: 0, dark: 0,
    boardZ: 0, zDough: 0, zSauce: Z.sauce, zCheese: Z.cheese, zTom: Z.tom,
    tomSpread: 0, tomSpin: 0, tomTilt: 0, oreg: 0, oregLift: 0, oregGather: 0,
    cheeseBurst: 0, cheesePuff: 1, sauceBurst: 0, mAmp: 8,
    side: 0, focus: 0,   // side: -1 pizza a la izquierda, +1 a la derecha. focus: hay un panel abierto
  };

  /* ------------------------------------------------------------ línea de tiempo */
  if (animated) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });   // la barra del navegador del celular no reinicia la animación
    const stage = document.getElementById('stage');
    const hero = document.getElementById('hero');
    const panels = [...story.querySelectorAll('.panel')];
    const kids = p => [...p.querySelectorAll(':scope > *')];

    // entrada del título al cargar
    gsap.from(kids(hero.querySelector('.hero__in')), { y: 34, autoAlpha: 0, duration: 1.2, stagger: .1, delay: .25, ease: 'power3.out' });
    panels.forEach(p => { gsap.set(p, { autoAlpha: 0 }); gsap.set(kids(p), { autoAlpha: 0, y: 34 }); });

    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onUpdate: () => markDirty(),
      scrollTrigger: {
        trigger: stage, start: 'top top', end: () => '+=' + innerHeight * N(16, 11),
        scrub: N(1.2, .8), pin: true, anticipatePin: 1, invalidateOnRefresh: true,
      },
    });

    const show = (p, t) => {
      tl.to(p, { autoAlpha: 1, duration: .35, ease: 'none' }, t);
      tl.to(kids(p), { autoAlpha: 1, y: 0, duration: .55, stagger: .07, ease: 'power3.out' }, t);
    };
    const hide = (p, t) => {
      tl.to(kids(p), { autoAlpha: 0, y: -30, duration: .45, stagger: .04, ease: 'power2.in' }, t);
      tl.to(p, { autoAlpha: 0, duration: .3, ease: 'none' }, t + .3);
    };
    const [pCasa, pTrad, pEsp, pMas, pRoof, pFin] = panels;

    tl
      // el título se va y la pizza queda sola
      .to(hero, { autoAlpha: 0, y: -70, duration: 1, ease: 'power2.in' }, .4)
      .to('#scrim', { autoAlpha: 0, duration: 1.2 }, .4)
      // Fases 01–03: gira hasta quedar de frente
      .to(st, { rx: 24, rz: -8, sc: .86, y: 10, duration: 3 }, 0)
      .to(st, { side: 1, focus: 1, duration: .9 }, 2.2)
      // Fase 04: se hunde
      .to(st, { sink: -170, dark: .42, duration: 1 }, 3)
      // Fases 05–06: tomates  →  panel "La casa"
      .to(st, { zTom: 250, tomSpread: .22, tomSpin: 32, tomTilt: 1, duration: 2 }, 4)
      .to(st, { side: -1, duration: .9 }, 5.6)
      // Fases 07–08: orégano  →  "Tradicionales"
      .to(st, { oreg: 1, zTom: 310, duration: 2, ease: 'power3.out' }, 6)
      .to(st, { side: 1, duration: .9 }, 8)
      // Fases 09–12: queso  →  "Especiales"
      .to(st, { zCheese: 150, zTom: 390, tomSpread: .34, oregLift: 1, duration: 2 }, 8)
      .to(st, { cheeseBurst: 1, duration: 2, ease: 'power3.out' }, 10)
      .to(st, { cheesePuff: 1.07, duration: 1, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 10)
      .to(st, { side: -1, duration: .9 }, 11.6)
      // Fases 13–14: salsa  →  "Más que pizza"
      .to(st, { zSauce: 85, sauceBurst: 1, duration: 2 }, 12)
      .to(st, { side: 1, duration: .9 }, 14.2)
      // Fases 15–17: masa  →  "Rooftop"
      .to(st, { zDough: 24, boardZ: -55, dark: .2, duration: 3 }, 14)
      // Fases 18–20: despiece en torre  →  "Todo junto"
      .to(st, {
        rx: 63, rz: -20, sc: .7, y: 115, sink: -20, dark: 0,
        boardZ: -20, zDough: 72, zSauce: 152, zCheese: 234, zTom: 320,
        tomSpread: .1, tomTilt: 1, oregGather: 1, mAmp: 15, duration: 3,
      }, 17)
      .to({}, { duration: 1 }, 20);


    // paneles de información, cada uno en su fase
    show(pCasa, 3.2); hide(pCasa, 5.5);
    show(pTrad, 6.4); hide(pTrad, 7.9);
    show(pEsp, 8.8); hide(pEsp, 11.5);
    show(pMas, 12.4); hide(pMas, 14.1);
    show(pRoof, 15); hide(pRoof, 16.9);
    show(pFin, 18.2);

    // la barra de navegación se vuelve sólida al salir de la portada
    const nav = document.querySelector('.nav');
    ScrollTrigger.create({
      trigger: story.nextElementSibling, start: 'top 70px',
      onEnter: () => nav.classList.add('is-solid'), onLeaveBack: () => nav.classList.remove('is-solid'),
    });

    // los enlaces del menú saltan a la fase de cada panel
    const jump = { '#rooftop': 15.6, '#reservas': 19 };
    document.querySelectorAll('a[href="#rooftop"], a[href="#reservas"]').forEach(a => a.addEventListener('click', e => {
      const st0 = tl.scrollTrigger; if (!st0) return;
      e.preventDefault();
      const t = jump[a.getAttribute('href')] / tl.duration();
      window.scrollTo({ top: st0.start + (st0.end - st0.start) * t, behavior: 'smooth' });
    }));
  }

  /* ------------------------------------------------------------ render */
  const light = document.getElementById('light');
  const mouse = { x: -.35, y: -.45, tx: -.35, ty: -.45, has: false };
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    mouse.tx = (e.clientX / innerWidth - .5) * 2;
    mouse.ty = (e.clientY / innerHeight - .5) * 2;
    mouse.has = true;
  }, { passive: true });

  let fit = 1, W = innerWidth, H = innerHeight;
  function measure() {
    W = innerWidth; H = innerHeight;
    fit = Math.min(W * (W < 700 ? 0.95 : 0.7), H * 0.95) / D.board;
  }
  measure();
  addEventListener('resize', () => { measure(); markDirty(); });

  const lastF = new Map();
  let LX = 0, LY = 0;
  function setLook(el, b, gap = 0, rot = 0) {
    let f = `brightness(${LITE ? Math.round(b * 20) / 20 : Math.round(b * 100) / 100})`;
    if (gap > 3 && !LITE) {
      const k = Math.min(gap, 420) * 0.09, a = -rot * Math.PI / 180;
      const ox = -LX * k, oy = -LY * k + k * 0.6;
      const dx = Math.round(ox * Math.cos(a) - oy * Math.sin(a)), dy = Math.round(ox * Math.sin(a) + oy * Math.cos(a));
      f += ` drop-shadow(${dx}px ${dy}px ${Math.round(6 + gap * 0.07)}px rgba(8,3,0,${clamp(0.6 - gap * 0.0006, 0.3, 0.6).toFixed(2)}))`;
    }
    if (lastF.get(el) !== f) { el.style.filter = f; lastF.set(el, f); }
  }
  function castShadow(el, x, y, gap, cosr, sinr) {
    const k = gap * 0.32, ox = -LX * k, oy = -LY * k;
    const rx = ox * cosr - oy * sinr, ry = ox * sinr + oy * cosr;
    el.style.transform = `translate3d(${n1(x + rx)}px, ${n1(y + ry)}px, ${el.dataset.z}px) scale(${(1 + gap * 0.002).toFixed(3)})`;
    el.style.opacity = clamp(0.62 - gap * 0.0024, 0, 0.62).toFixed(3);
  }

  function render() {
    const t = LITE ? 0 : performance.now() / 1000;   // en celular nada flota solo: se mueve con el scroll
    mouse.x += (mouse.tx - mouse.x) * 0.07;
    mouse.y += (mouse.ty - mouse.y) * 0.07;
    const idle = mouse.has || LITE ? 0 : 1;
    const mx = mouse.x + idle * Math.sin(t * 0.45) * 0.3;
    const my = mouse.y + idle * Math.cos(t * 0.35) * 0.18;
    const s = st, mob = W < 768;

    const px = mob ? 0 : s.side * W * 0.21;
    const py = mob ? -s.focus * H * 0.23 : 0;
    const k = fit * s.sc * (mob ? 1 - 0.1 * s.focus : 1 - 0.08 * Math.abs(s.side));
    pizza.style.transform =
      `translate3d(${n1(px)}px, ${n1(s.y * fit + py)}px, 0) rotateX(${n1(s.rx - my * s.mAmp)}deg) rotateY(${n1(mx * s.mAmp)}deg) rotateZ(${n1(s.rz)}deg) scale3d(${k.toFixed(4)}, ${k.toFixed(4)}, ${k.toFixed(4)}) translateZ(${n1(s.sink)}px)`;

    const bob = clamp((s.zTom - Z.tom) / 220);
    const zD = s.zDough + Math.sin(t * 1.1) * 3 * clamp(s.zDough / 40);
    const zS = s.zSauce + Math.sin(t * 1.25 + 1) * 4 * clamp((s.zSauce - Z.sauce) / 40);
    const zC = s.zCheese + Math.sin(t * 1.15 + 2) * 5 * clamp((s.zCheese - Z.cheese) / 40);

    gBoard.style.transform = `translateZ(${n1(s.boardZ)}px)`;
    gDough.style.transform = `translateZ(${n1(zD)}px)`;
    gSauce.style.transform = `translateZ(${n1(zS)}px)`;
    gCheese.style.transform = `translateZ(${n1(zC)}px) scale(${s.cheesePuff.toFixed(3)})`;
    boardShadow.style.transform = `translate3d(${n1(-mx * 22)}px, ${n1(-my * 22)}px, ${n1(s.boardZ - 30)}px)`;
    boardShadow.style.opacity = '0.75';

    LX = mx; LY = my;
    const ang = -s.rz * Math.PI / 180, cosr = Math.cos(ang), sinr = Math.sin(ang);
    castShadow(shDough, 0, 0, (zD + 2) - s.boardZ, cosr, sinr);
    castShadow(shSauce, 0, 0, zS - (zD + Z.dough), cosr, sinr);
    castShadow(shCheese, 0, 0, zC - zS, cosr, sinr);

    const tilt = s.tomTilt;
    toms.forEach(tm => {
      const r = tm.r * (1 + s.tomSpread * 1.6);
      const x = Math.cos(tm.a) * r, y = Math.sin(tm.a) * r;
      const z = s.zTom + tm.dz * bob + Math.sin(t * 1.3 + tm.ph) * 6 * bob;
      tm.g.style.transform = `translate3d(${n1(x)}px, ${n1(y)}px, ${n1(z)}px) rotateZ(${n1(-s.rz)}deg) rotateX(${n1(tm.tx * tilt)}deg) rotateY(${n1(tm.ty * tilt)}deg) rotateZ(${n1(s.rz + tm.rot + s.tomSpin * tm.spin)}deg) scale(${tm.sc.toFixed(3)})`;
      castShadow(tm.sh, x / s.cheesePuff, y / s.cheesePuff, z - zC, cosr, sinr);
      setLook(tm.img, 1.02 + 0.08 * bob - mx * 0.04, z - zC, s.rz + tm.rot + s.tomSpin * tm.spin);
    });

    const gat = 1 - 0.5 * s.oregGather, p = s.oreg;
    flakes.forEach(fl => {
      const x = lerp(fl.x0, fl.x1 * gat, p), y = lerp(fl.y0, fl.y1 * gat, p);
      const z = lerp(Z.oreg, fl.z1, p) + s.oregLift * fl.lift + Math.sin(t * 1.7 + fl.ph) * 7 * p;
      fl.e.style.transform = `translate3d(${n1(x)}px, ${n1(y)}px, ${n1(z)}px) rotateZ(${n1(fl.rot + fl.spin * p)}deg) rotateX(${n1(fl.flip * p)}deg)`;
    });

    const cb = s.cheeseBurst;
    shreds.forEach(sh => {
      sh.e.style.transform = `translate3d(${n1(lerp(sh.x0, sh.x1, cb))}px, ${n1(lerp(sh.y0, sh.y1, cb))}px, ${n1(1 + sh.z1 * cb)}px) rotateZ(${n1(sh.rot + sh.spin * cb)}deg) rotateX(${n1(sh.flip * cb)}deg)`;
      sh.e.style.opacity = clamp(cb * 5).toFixed(2);
    });

    const sb = s.sauceBurst;
    drops.forEach(dp => {
      dp.e.style.transform = `translate3d(${n1(lerp(dp.x0, dp.x1, sb))}px, ${n1(lerp(dp.y0, dp.y1, sb))}px, ${n1(1 + dp.z1 * sb)}px) rotateZ(${n1(dp.rot)}deg) rotateX(${n1(dp.flip * sb)}deg)`;
      dp.e.style.opacity = clamp(sb * 5).toFixed(2);
    });

    const lift = (z, z0) => clamp((z - z0) / 110);
    const bri = (z, z0) => (1 - s.dark * 0.72 * (1 - lift(z, z0))) * (0.94 + 0.12 * clamp((z + s.sink + 60) / 420));
    setLook(imgBoard, bri(s.boardZ, 999) - 0.04);
    setLook(imgDough, bri(zD, 0), (zD + 2) - s.boardZ, s.rz);
    setLook(imgSauce, bri(zS, Z.sauce), zS - (zD + Z.dough), s.rz);
    setLook(imgCheese, bri(zC, Z.cheese) + 0.03, zC - zS, s.rz);

    // brillo especular: aparece del lado de la luz y el borde se oscurece (se ve abombado)
    glosses.forEach(g => {
      const a = -g.rotOf() * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
      const lx = mx * ca - my * sa, ly = mx * sa + my * ca;
      const gx = Math.round(50 + lx * 26), gy = Math.round(50 + ly * 26);
      const key = gx + ',' + gy;
      if (key === g.last) return;
      g.last = key;
      g.el.style.background =
        `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,250,240,${g.power}) 0, rgba(255,250,240,${(g.power * .35).toFixed(2)}) 14%, rgba(255,250,240,0) 36%),` +
        `radial-gradient(circle at ${100 - gx}% ${100 - gy}%, rgba(20,4,0,.28) 0, rgba(20,4,0,0) 42%),` +
        'radial-gradient(circle, rgba(20,4,0,0) 58%, rgba(20,4,0,.4) 100%)';
    });

    if (!LITE) light.style.background =
      `radial-gradient(circle at ${n1(50 + px / W * 100 + mx * 30)}% ${n1(50 + my * 30)}%, rgba(255,226,180,.34), rgba(255,226,180,0) 46%)`;
  }


  /* ------------------------------------------------------------ dibujo plano (celular) */
  // Proyecta cada pieza (x, y, altura) con la misma inclinación y perspectiva que la versión 3D,
  // y la coloca con un transform 2D: mover, escalar (achatada según la inclinación) y girar.
  const DEG = Math.PI / 180, PERSP = 1200;
  function render2D() {
    const s = st;
    const mob = W < 768;
    const px = mob ? 0 : s.side * W * 0.21;
    const oy = s.y * fit + (mob ? -s.focus * H * 0.23 : 0);
    const k = fit * s.sc * (mob ? 1 - 0.1 * s.focus : 1 - 0.08 * Math.abs(s.side));
    const tiltDeg = s.rx + 3.6;
    const cX = Math.cos(tiltDeg * DEG), sX = Math.sin(tiltDeg * DEG);
    const cZ = Math.cos(s.rz * DEG), sZ = Math.sin(s.rz * DEG);

    function place(el, x, y, z, rot, squash = cX, extra = 1) {
      const xr = x * cZ - y * sZ, yr = x * sZ + y * cZ, zz = z + s.sink;
      const Y = yr * cX - zz * sX, depth = yr * sX + zz * cX;
      const f = PERSP / Math.max(240, PERSP - depth * k);
      const S = k * f * extra;
      el.style.transform = `translate(${n1(px + xr * k * f)}px, ${n1(oy + Y * k * f)}px) scale(${S.toFixed(4)}, ${(S * squash).toFixed(4)}) rotate(${n1(rot)}deg)`;
    }
    const layer = (g, gz, extra = 1) => g.__leaves.forEach(l => place(l.el, 0, 0, gz + l.z, s.rz, cX, extra));
    // sombra: cae hacia abajo a la derecha (luz fija arriba a la izquierda), más suave cuanto más alto está lo que la proyecta
    function shade(el, x, y, hostZ, gap) {
      const d = gap * 0.32, ox = 0.35 * d, oy2 = 0.45 * d;
      place(el, x + ox * cZ + oy2 * sZ, y - ox * sZ + oy2 * cZ, hostZ + 0.6, s.rz, cX, 1 + gap * 0.002);
      el.style.opacity = clamp(0.62 - gap * 0.0024, 0, 0.62).toFixed(2);
    }

    const zD = s.zDough, zS = s.zSauce, zC = s.zCheese;
    place(boardShadow, 8, 10, s.boardZ - 30, s.rz);
    boardShadow.style.opacity = '0.75';
    layer(gBoard, s.boardZ);
    layer(gDough, zD);
    layer(gSauce, zS);
    layer(gCheese, zC, s.cheesePuff);
    shade(shDough, 0, 0, s.boardZ, (zD + 2) - s.boardZ);
    shade(shSauce, 0, 0, zD + Z.dough, zS - (zD + Z.dough));
    shade(shCheese, 0, 0, zS, zC - zS);

    const bob = clamp((s.zTom - Z.tom) / 220);
    toms.forEach(tm => {
      const r = tm.r * (1 + s.tomSpread * 1.6);
      const x = Math.cos(tm.a) * r, y = Math.sin(tm.a) * r;
      const z = s.zTom + tm.dz * bob;
      const sq = Math.cos(Math.max(0, tiltDeg + tm.tx * s.tomTilt) * DEG);   // se inclinan hacia la cámara
      const rot = s.rz + tm.rot + s.tomSpin * tm.spin;
      tm.g.__leaves.forEach(l => place(l.el, x, y, z + l.z, rot, sq, tm.sc));
      shade(tm.sh, x, y, zC, z - zC);
      setLook(tm.img, 1.02 + 0.08 * bob);
    });

    const gat = 1 - 0.5 * s.oregGather, p = s.oreg;
    flakes.forEach(fl => {
      const x = lerp(fl.x0, fl.x1 * gat, p), y = lerp(fl.y0, fl.y1 * gat, p);
      const z = lerp(Z.oreg, fl.z1, p) + s.oregLift * fl.lift;
      place(fl.e, x, y, z, fl.rot + fl.spin * p, cX * Math.max(.25, Math.abs(Math.cos(fl.flip * p * DEG))));
    });
    const cb = s.cheeseBurst;
    shreds.forEach(sh => {
      place(sh.e, lerp(sh.x0, sh.x1, cb) * s.cheesePuff, lerp(sh.y0, sh.y1, cb) * s.cheesePuff, zC + 1 + sh.z1 * cb,
        sh.rot + sh.spin * cb, cX * Math.max(.3, Math.abs(Math.cos(sh.flip * cb * DEG))));
      sh.e.style.opacity = clamp(cb * 5).toFixed(2);
    });
    const sb = s.sauceBurst;
    drops.forEach(dp => {
      place(dp.e, lerp(dp.x0, dp.x1, sb), lerp(dp.y0, dp.y1, sb), zS + 1 + dp.z1 * sb, dp.rot,
        cX * Math.max(.3, Math.abs(Math.cos(dp.flip * sb * DEG))));
      dp.e.style.opacity = clamp(sb * 5).toFixed(2);
    });

    const lift = (z, z0) => clamp((z - z0) / 110);
    const bri = (z, z0) => (1 - s.dark * 0.72 * (1 - lift(z, z0))) * (0.94 + 0.12 * clamp((z + s.sink + 60) / 420));
    setLook(imgBoard, bri(s.boardZ, 999) - 0.04);
    setLook(imgDough, bri(zD, 0));
    setLook(imgSauce, bri(zS, Z.sauce));
    setLook(imgCheese, bri(zC, Z.cheese) + 0.03);
  }

  // Solo se dibuja mientras la portada está en pantalla. En computador, en cada cuadro (sigue al mouse);
  // en celular, solo cuando el scroll cambia algo.
  function markDirty() { dirty = true; if (visible && !raf) raf = requestAnimationFrame(loop); }
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) markDirty(); }).observe(story);
  function loop() {
    raf = 0;
    if (!visible || (LITE && !dirty)) return;
    dirty = false;
    (LITE ? render2D : render)();
    if (!LITE) raf = requestAnimationFrame(loop);
  }
  loop();

  // La pizza aparece cuando sus fotos ya cargaron (antes se veían discos de colores sin foto)
  const scene = pizza.parentElement;
  const ready = () => { scene.classList.add('is-ready'); markDirty(); };
  Promise.all([...pizza.querySelectorAll('img')].map(i => (i.complete ? 1 : new Promise(r => { i.onload = i.onerror = r; })))).then(ready);
  setTimeout(ready, 3000);
})();
