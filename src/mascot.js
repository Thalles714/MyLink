import * as THREE from 'three';

// The character is built here, rather than borrowing the reference site's model.
export function initMascot() {
  const host = document.createElement('aside');
  host.className = 'companion';
  host.setAttribute('aria-label', 'Seu pequeno companheiro de exploração');
  host.innerHTML = `<span class="pet-shadow"></span><button class="pet-grab" type="button" aria-label="Brincar com o mascote. Arraste e solte para jogar. Use as setas para mover, Enter para brincar e Home para voltar ao canto."></button><div class="pet-tools"><button type="button" data-home aria-label="Levar mascote de volta ao canto" title="Voltar ao cantinho"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m3 11 9-8 9 8M6 9v12h12V9m-9 12v-7h6v7"/></svg></button><button type="button" data-hide aria-label="Recolher mascote" title="Vou descansar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 12h12"/></svg></button></div>`;
  const bubble = document.createElement('div');
  bubble.className = 'pet-bubble';
  bubble.innerHTML = '<span role="status" aria-live="polite"></span><button type="button" aria-label="Fechar fala do mascote">×</button>';
  const restore = document.createElement('button');
  restore.className = 'pet-return'; restore.type = 'button'; restore.hidden = true;
  restore.setAttribute('aria-label', 'Acordar mascote'); restore.innerHTML = '<img src="./favicon.svg" alt="">';
  document.body.append(host, bubble, restore);
  const grab = host.querySelector('.pet-grab');
  const shadow = host.querySelector('.pet-shadow');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let size = host.offsetWidth, width = innerWidth, height = innerHeight;
  let x, y, vx = 0, vy = 0, drag = null, hidden = false, airborne = false;
  let pointer = { x: width / 2, y: height / 2 }, rotation = 0, spin = 0;
  let squash = 0, squashVelocity = 0, nextGesture = 0, gesture = 0, gestureStart = 0;
  let nextBlink = 2, blinkAt = -10, last = 0, elapsed = 0, speechTimer, lastSpeech = 0;
  const used = new Map();
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const floor = () => Math.max(0, height - size - (width <= 600 ? 41 : 45));
  const home = () => { x = width - size - (width <= 600 ? 9 : 22); y = floor(); vx = vy = spin = rotation = 0; airborne = false; squash = .12; };
  home();
  function say(lines, force = false) {
    if (hidden || document.querySelector('dialog[open]') || (!force && performance.now() - lastSpeech < 14000)) return;
    const options = lines.filter(line => !used.has(line));
    const line = (options.length ? options : lines)[Math.floor(Math.random() * (options.length || lines.length))];
    if (!options.length) lines.forEach(l => used.delete(l));
    used.set(line, true); bubble.querySelector('span').textContent = line;
    bubble.classList.add('visible'); lastSpeech = performance.now();
    clearTimeout(speechTimer); speechTimer = setTimeout(() => bubble.classList.remove('visible'), 5800);
  }
  bubble.querySelector('button').onclick = () => bubble.classList.remove('visible');
  host.querySelector('[data-home]').onclick = () => { home(); say(['Ahh, meu cantinho. Pode explorar, eu espero aqui.'], true); };
  function hide() { hidden = true; host.hidden = true; restore.hidden = false; bubble.classList.remove('visible'); restore.focus(); }
  host.querySelector('[data-hide]').onclick = hide;
  restore.onclick = () => { hidden = false; host.hidden = false; restore.hidden = true; home(); grab.focus(); say(['Voltei! O que a gente vai descobrir agora?'], true); };

  let renderer, group, eyes = [];
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(size, size);
    renderer.setClearColor(0, 0); renderer.outputColorSpace = THREE.SRGBColorSpace;
    grab.append(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, .1, 30); camera.position.set(0, .06, 4.5);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x7b7a72, 2));
    const key = new THREE.DirectionalLight(0xffffff, 3.1); key.position.set(-3, 5, 6); scene.add(key);
    const rim = new THREE.DirectionalLight(0xffffff, 1.1); rim.position.set(3, 1, -2); scene.add(rim);
    group = new THREE.Group(); scene.add(group);
    const shape = new THREE.Shape();
    shape.moveTo(-.66, -.53);
    shape.bezierCurveTo(-.93, -.46, -.50, .28, -.20, .72);
    shape.bezierCurveTo(-.03, .98, .17, .88, .36, .63);
    shape.bezierCurveTo(.57, .37, 1.02, -.21, .75, -.48);
    shape.bezierCurveTo(.53, -.70, -.29, -.70, -.66, -.53);
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: .22, bevelEnabled: true, bevelSegments: 8, steps: 1, bevelSize: .14, bevelThickness: .22, curveSegments: 32 });
    geometry.translate(0, -.05, -.11); geometry.computeVertexNormals();
    const body = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: 0x999992, roughness: .63, metalness: .03 }));
    group.add(body);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x20201e, roughness: .5 });
    [-.20, .20].forEach(ex => {
      const eye = new THREE.Mesh(new THREE.CapsuleGeometry(.064, .19, 8, 16), eyeMaterial);
      eye.position.set(ex, -.03, .36); eye.rotation.z = .07; group.add(eye); eyes.push(eye);
    });
    renderer.setAnimationLoop(frame);
    function render() { renderer.render(scene, camera); }
    function frame(now) {
      if (hidden || document.hidden) { last = now; return; }
      const dt = Math.min((now - (last || now)) / 1000, .035); last = now; elapsed += dt;
      updatePhysics(dt);
      const smoothing = 1 - Math.exp(-dt * 9);
      const lookX = clamp((pointer.x - x - size / 2) / width, -.6, .6);
      const lookY = clamp((pointer.y - y - size / 2) / height, -.4, .4);
      if (elapsed > nextBlink) { blinkAt = elapsed; nextBlink = elapsed + 2.8 + Math.random() * 5; }
      if (elapsed > nextGesture && !airborne && !drag) {
        gesture = (gesture + 1 + Math.floor(Math.random() * 3)) % 4; gestureStart = elapsed; nextGesture = elapsed + 6 + Math.random() * 10;
      }
      const phase = clamp((elapsed - gestureStart) / 1.6, 0, 1);
      const impulse = Math.sin(phase * Math.PI) * (phase < 1 ? 1 : 0);
      const lean = reduced.matches ? 0 : (gesture === 1 ? -.13 : gesture === 2 ? .10 : 0) * impulse;
      group.rotation.y += ((reduced.matches ? 0 : lookX * .65 + (drag ? vx * .0002 : 0)) - group.rotation.y) * smoothing;
      group.rotation.x += ((reduced.matches ? 0 : lookY * .3 + (airborne ? -.13 : 0)) - group.rotation.x) * smoothing;
      group.rotation.z += ((rotation + lean) - group.rotation.z) * smoothing;
      group.scale.set(1 + squash * .5, 1 - squash, 1 + squash * .18);
      const blink = elapsed - blinkAt;
      const openness = blink < .16 ? Math.max(.08, Math.abs(blink - .08) / .08) : 1;
      eyes.forEach((eye, i) => {
        const wink = !reduced.matches && gesture === 3 && phase > .3 && phase < .5 && i === 1;
        eye.scale.y = reduced.matches ? 1 : Math.max(.08, wink ? .08 : openness) * (drag ? 1.18 : airborne ? 1.22 : 1);
        eye.position.x = (i ? .20 : -.20) + (reduced.matches ? 0 : lookX * .05);
      });
      shadow.style.transform = `scale(${airborne ? .65 : 1 + squash})`;
      shadow.style.opacity = airborne ? '.3' : '.8';
      render();
    }
  } catch {
    grab.innerHTML = '<span class="pet-fallback" aria-hidden="true"></span>';
    // Dragging and speech remain available without WebGL.
    const fallback = now => { const dt = Math.min((now - (last || now)) / 1000, .035); last = now; if (!hidden && !document.hidden) updatePhysics(dt); requestAnimationFrame(fallback); };
    requestAnimationFrame(fallback);
  }

  function updatePhysics(dt) {
    if (!drag && airborne) {
      vy += 1550 * dt; x += vx * dt; y += vy * dt; rotation += spin * dt;
      vx *= Math.exp(-.35 * dt); spin *= Math.exp(-1.6 * dt);
      if (x < 0 || x > width - size) { x = clamp(x, 0, width - size); vx *= -.68; spin *= -.55; squashVelocity += 1.8; }
      if (y < 0) { y = 0; vy = Math.abs(vy) * .6; }
      if (y >= floor()) {
        y = floor(); const impact = vy; vy *= -.56; vx *= .82;
        squashVelocity += Math.min(impact / 230, 5); spin *= .35;
        if (impact > 650) say(['Boing. Tá tudo bem, eu sou molinho.', 'Pouso quase perfeito. Quase.', 'Opa! Ainda prefiro pousar em projetos.']);
        if (Math.abs(vy) < 85) { vy = 0; if (Math.abs(vx) < 18) { vx = 0; airborne = false; } else vx *= Math.exp(-8 * dt); }
      }
    }
    if (!drag) {
      rotation *= Math.exp(-dt * 5);
      squashVelocity += (-squash * 180 - squashVelocity * 14) * dt;
      squash = clamp(squash + squashVelocity * dt, -.18, .28);
    }
    if (reduced.matches) { rotation = squash = squashVelocity = 0; }
    host.style.transform = `translate3d(${x}px,${y}px,0)`;
    bubble.style.left = `${clamp(x + size / 2 - 164, 12, Math.max(12, width - 224))}px`;
    bubble.style.top = `${Math.max(12, y - bubble.offsetHeight - 3)}px`;
  }
  grab.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    grab.setPointerCapture(e.pointerId);
    drag = { id: e.pointerId, dx: e.clientX - x, dy: e.clientY - y, startX: x, startY: y, lastX: e.clientX, lastY: e.clientY, at: performance.now(), moved: false };
    vx = vy = spin = 0; airborne = false; bubble.classList.remove('visible'); squash = -.08;
  });
  grab.addEventListener('pointermove', e => {
    if (!drag || drag.id !== e.pointerId) return;
    const now = performance.now(), dt = Math.max((now - drag.at) / 1000, .008);
    vx = vx * .35 + clamp((e.clientX - drag.lastX) / dt, -2200, 2200) * .65;
    vy = vy * .35 + clamp((e.clientY - drag.lastY) / dt, -2000, 2000) * .65;
    x = clamp(e.clientX - drag.dx, 0, width - size); y = clamp(e.clientY - drag.dy, 0, floor());
    drag.moved ||= Math.hypot(x - drag.startX, y - drag.startY) > 7;
    rotation = reduced.matches ? 0 : clamp(vx / 4000, -.35, .35); squash = reduced.matches ? 0 : -.07;
    drag.lastX = e.clientX; drag.lastY = e.clientY; drag.at = now;
    updatePhysics(0);
  });
  function release(e, cancelled = false) {
    if (!drag || (e && drag.id !== e.pointerId)) return;
    const moved = drag.moved, stale = performance.now() - drag.at > 100;
    const id = drag.id; drag = null;
    if (grab.hasPointerCapture(id)) grab.releasePointerCapture(id);
    if (cancelled || stale) vx = vy = 0;
    if (reduced.matches) { vx = vy = 0; airborne = false; }
    else { airborne = true; spin = clamp(vx / 450, -4, 4); if (!moved && !cancelled) vy = -270; }
    if (!cancelled) say(moved ? ['Uii, passeio surpresa!', 'Tá, essa vista é nova pra mim.', 'Peguei carona. Pra onde agora?'] : ['Oi! Eu moro aqui. Mas aceito um passeio.', 'Rodrigo, já deu uma espiada nos projetos?', 'Pequeno por fora. Curioso por inteiro.', 'Pode me arrastar. Prometo tentar um pouso bonito.'], true);
  }
  grab.addEventListener('pointerup', e => release(e));
  grab.addEventListener('pointercancel', e => release(e, true));
  grab.addEventListener('lostpointercapture', e => release(e, true));
  grab.addEventListener('keydown', e => {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'Escape', 'Enter', ' '].includes(e.key)) e.preventDefault();
    if (e.key === 'Escape') return hide();
    if (e.key === 'Home') return home();
    const delta = 30;
    if (e.key.startsWith('Arrow')) {
      airborne = false; vx = vy = 0;
      if (e.key === 'ArrowLeft') x -= delta;
      if (e.key === 'ArrowRight') x += delta;
      if (e.key === 'ArrowUp') y -= delta;
      if (e.key === 'ArrowDown') y += delta;
      x = clamp(x, 0, width - size); y = clamp(y, 0, floor()); updatePhysics(0);
    }
    if (e.key === 'Enter' || e.key === ' ') { if (!reduced.matches) { vy = -360; airborne = true; } say(['Um pulinho entre uma ideia e outra.', 'Eu iria de projetos pessoais. Adoro uma ideia que vira coisa.'], true); }
  });
  window.addEventListener('pointermove', e => { pointer.x = e.clientX; pointer.y = e.clientY; }, { passive: true });
  window.addEventListener('resize', () => { width = innerWidth; height = innerHeight; size = host.offsetWidth || (width <= 600 ? 94 : 124); renderer?.setSize(size, size); x = clamp(x, 0, width - size); y = Math.min(y, floor()); updatePhysics(0); });
  window.addEventListener('blur', () => { if (drag) release(null, true); });
  reduced.addEventListener('change', () => { vx = vy = rotation = spin = 0; airborne = false; });
  document.querySelectorAll('.card').forEach(card => card.addEventListener('pointerenter', () => {
    const lines = { professional: ['Por aqui: o estúdio, o código e a pessoa por trás.', 'Curioso pra ver o que o Thalles anda construindo?'], personal: ['Ideias que saíram do caderno. Minha parte favorita.', 'Tem organização até nas ideias. Eu ainda tô aprendendo.'], freelance: ['Aqui as ideias encontraram clientes de verdade.', 'Do briefing pra vida real. Bora espiar?'] };
    say(lines[card.dataset.open]);
  }));
  document.querySelectorAll('a[href^="mailto:"]').forEach(a => a.addEventListener('pointerenter', () => say(['A próxima ideia pode começar com um oi.'])));
  updatePhysics(0);
  setTimeout(() => say(['Psst. Pode me pegar e jogar por aí. Eu sou molinho!'], true), 2100);
}
