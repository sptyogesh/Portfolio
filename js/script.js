/* ═══════════════════════════════════════
   SECTION LOADER
═══════════════════════════════════════ */
async function loadSections() {
  const sections = document.querySelectorAll('[data-section]');
  const promises = Array.from(sections).map(async (container) => {
    const sectionName = container.getAttribute('data-section');
    try {
      const response = await fetch(`sections/${sectionName}.html`);
      if (!response.ok) throw new Error(`Failed to load ${sectionName}`);
      const html = await response.text();
      container.outerHTML = html;
    } catch (err) {
      console.error(err);
    }
  });

  await Promise.all(promises);
  
  // Re-initialize scripts that depend on new elements
  initTheme();
  initMobileMenu();
  initCursor();
  initScrollReveal();
  initActiveNav();

  // Handle initial hash navigation (e.g. index.html#projects)
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      setTimeout(() => {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }, 100);
    }
  }
}

/* ═══════════════════════════════════════
   THEME
═══════════════════════════════════════ */
function initTheme() {
  const html = document.documentElement;
  const togBtn = document.getElementById('togBtn');
  if (!togBtn) return;
  
  const saved = localStorage.getItem('yg-theme') || 'dark';
  html.setAttribute('data-theme', saved);
  
  togBtn.onclick = () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('yg-theme', next);
  };
}

/* ═══════════════════════════════════════
   MOBILE MENU
═══════════════════════════════════════ */
const hbg = document.getElementById('hbg');
const mobMenu = document.getElementById('mobMenu');

function initMobileMenu() {
  if (!hbg || !mobMenu) return;
  hbg.onclick = () => {
    hbg.classList.toggle('open');
    mobMenu.classList.toggle('open');
  };
}

function closeM() {
  if (hbg) hbg.classList.remove('open');
  if (mobMenu) mobMenu.classList.remove('open');
}

document.addEventListener('click', (e) => {
  if (mobMenu && !mobMenu.contains(e.target) && hbg && !hbg.contains(e.target)) closeM();
});

/* ═══════════════════════════════════════
   CURSOR
═══════════════════════════════════════ */
function initCursor() {
  const cr = document.getElementById('cr');
  const crr = document.getElementById('crr');
  if (!cr || !crr) return;

  let mx = 0, my = 0, rx = 0, ry = 0;
  document.onmousemove = (e) => {
    mx = e.clientX;
    my = e.clientY;
    cr.style.left = `${mx - 4}px`;
    cr.style.top = `${my - 4}px`;
  };

  function loop() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    crr.style.left = `${rx}px`;
    crr.style.top = `${ry}px`;
    requestAnimationFrame(loop);
  }
  loop();

  document.querySelectorAll('a, button').forEach((el) => {
    el.onmouseenter = () => {
      crr.style.width = '46px';
      crr.style.height = '46px';
      cr.style.opacity = '0.35';
    };
    el.onmouseleave = () => {
      crr.style.width = '32px';
      crr.style.height = '32px';
      cr.style.opacity = '1';
    };
  });
}

/* ═══════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════ */
function initScrollReveal() {
  const ro = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('vis'), i * 70);
        ro.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach((el) => ro.observe(el));
}

/* ═══════════════════════════════════════
   ACTIVE NAV
═══════════════════════════════════════ */
function initActiveNav() {
  const secs = document.querySelectorAll('section[id]');
  const nls = document.querySelectorAll('.nav-links a');
  
  window.addEventListener('scroll', () => {
    let cur = '';
    secs.forEach((s) => {
      if (window.scrollY >= s.offsetTop - 130) cur = s.id;
    });
    nls.forEach((a) => {
      a.style.color = a.getAttribute('href') === `#${cur}` ? 'var(--text)' : '';
    });
  });
}

// Start everything
loadSections();
