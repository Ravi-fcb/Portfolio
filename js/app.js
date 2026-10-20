(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile navigation
  const menuToggle = $('#menuToggle');
  const navLinks = $('#navLinks');
  menuToggle?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  $$('#navLinks a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open navigation');
  }));

  // Active navigation state, including Skills
  const sectionIds = ['home', 'about', 'projects', 'skills', 'experience', 'contact'];
  const navAnchors = $$('.nav-links a');
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(anchor => anchor.classList.toggle('active', anchor.getAttribute('href') === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
  sectionIds.forEach(id => { const section = document.getElementById(id); if (section) sectionObserver.observe(section); });

  // Reveal elements as they enter view
  const revealTargets = $$('.section-heading, .glass-panel, .fact-card, .project-card, .skill-panel, .journey-item, .education-card, .contact-panel');
  if ('IntersectionObserver' in window && !reducedMotion) {
    revealTargets.forEach(el => el.classList.add('reveal-in'));
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
    }), { threshold: 0.12 });
    revealTargets.forEach(el => revealObserver.observe(el));
  }

  // Restrained 3D portrait and project-card tilt. Disabled on touch/reduced-motion devices.
  const canTilt = !reducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (canTilt) {
    const portrait = $('#portraitTilt');
    const heroArt = $('#heroArt');
    heroArt?.addEventListener('pointermove', event => {
      const rect = heroArt.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      portrait.style.transform = `rotateY(${-x * 18 - 4}deg) rotateX(${y * 12}deg) translateZ(30px)`;
    });
    heroArt?.addEventListener('pointerleave', () => { portrait.style.transform = 'rotateY(-8deg) rotateX(3deg) translateZ(30px)'; });
    $$('.tilt-card').forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1100px) rotateY(${x * 4}deg) rotateX(${-y * 3}deg) translateY(-2px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  // Contact form intentionally opens the visitor's email client; no backend is implied.
  $('#contactForm')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
    $('#formNote').textContent = 'Opening your email app…';
    window.location.href = `mailto:badipati.ravikiran@gmail.com?subject=${subject}&body=${body}`;
  });
  $('#year').textContent = new Date().getFullYear();

  // Three.js background: a restrained particle field and rotating wireframe geometry.
  // The 3D layer is decorative and falls back gracefully if WebGL/Three.js is unavailable.
  const canvas = $('#scene3d');
  if (!canvas || !window.THREE || reducedMotion) return;
  try {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setSize(window.innerWidth, window.innerHeight);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 8;

    const particleCount = window.innerWidth < 650 ? 250 : 480;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 13;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const points = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0xf04452, size: 0.022, transparent: true, opacity: 0.5, depthWrite: false }));
    scene.add(points);

    const crystal = new THREE.Mesh(new THREE.IcosahedronGeometry(1.55, 1), new THREE.MeshBasicMaterial({ color: 0xf04452, wireframe: true, transparent: true, opacity: 0.13 }));
    crystal.position.set(3.7, 0.2, -1.5);
    scene.add(crystal);
    const crystalTwo = new THREE.Mesh(new THREE.OctahedronGeometry(0.8, 0), new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.075 }));
    crystalTwo.position.set(-4.2, -1.1, -2.5);
    scene.add(crystalTwo);

    let targetX = 0, targetY = 0;
    window.addEventListener('pointermove', event => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 0.45;
      targetY = (0.5 - event.clientY / window.innerHeight) * 0.3;
    }, { passive: true });
    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    };
    window.addEventListener('resize', resize, { passive: true });
    let frame = 0;
    const render = () => {
      frame = requestAnimationFrame(render);
      points.rotation.y += 0.00025;
      points.rotation.x += 0.0001;
      crystal.rotation.y += 0.0016;
      crystal.rotation.x += 0.0008;
      crystalTwo.rotation.y -= 0.002;
      camera.position.x += (targetX - camera.position.x) * 0.015;
      camera.position.y += (targetY - camera.position.y) * 0.015;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    render();
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(frame);
      else render();
    });
  } catch (error) {
    console.warn('3D background could not initialize; continuing without it.', error);
  }
})();
