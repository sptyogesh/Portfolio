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
  initContactForm();

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

/* ═══════════════════════════════════════
   PROJECT MODAL
   ═══════════════════════════════════════ */
const projectData = {
  ysdesk: {
    title: "YSDesk",
    tagline: "Real-Time Customer Support Platform",
    desc: "A production-grade real-time customer support system developed as part of my work at YS Innovations. The platform enables seamless communication between agents and website visitors with live tracking and low-latency messaging.",
    contributions: [
      "Built WebSocket-based real-time messaging system for instant agent–visitor communication",
      "Implemented live visitor tracking with multi-tab session handling and presence detection",
      "Designed role-based access control (RBAC) for admins, agents, and users",
      "Developed scalable backend APIs using NestJS for chat, session management, and analytics",
      "Integrated Redis for caching and real-time event handling",
      "Deployed and managed infrastructure on AWS (EC2, S3, CloudFront, RDS)"
    ],
    impact: [
      "Enabled real-time communication with minimal latency",
      "Improved system scalability and user experience for concurrent users"
    ]
  },
  hirez: {
    title: "HireZ",
    tagline: "Rental Platform (Full Stack)",
    desc: "A full-stack rental platform designed to connect property owners and tenants directly, eliminating intermediaries and improving transparency in pricing and communication.",
    contributions: [
      "Developed backend APIs for property listings, user management, and communication workflows",
      "Designed database schema using Prisma and PostgreSQL for efficient data handling",
      "Optimized database queries for faster property search and filtering",
      "Built responsive frontend interfaces using Next.js for seamless user experience"
    ],
    impact: [
      "Reduced dependency on brokers by enabling direct owner–tenant interaction",
      "Improved performance of listing and search features"
    ]
  },
  microfinance: {
    title: "Micro-Finance Platform",
    tagline: "Micro-Finance Operations Platform — Financial System",
    desc: "A full-stack financial management system designed to digitize and automate micro-finance operations across the entire loan lifecycle.",
    contributions: [
      "Built backend services for loan onboarding, approval, disbursement, and repayment tracking",
      "Designed scalable APIs and database models for financial data handling",
      "Developed analytics dashboards to monitor loan performance and financial metrics",
      "Ensured secure data handling and structured workflows for financial operations"
    ],
    impact: [
      "Streamlined manual financial processes into a digital system",
      "Improved tracking accuracy and operational efficiency"
    ]
  },
  trackvision: {
    title: "TrackVisionAI",
    tagline: "Real-Time Object Tracking System",
    desc: "An AI-powered system for tracking and monitoring objects in real-time using computer vision models.",
    contributions: [
      "Integrated AI models for object detection and tracking using TensorFlow",
      "Built backend services using FastAPI for processing and serving tracking data",
      "Developed frontend dashboard for visualizing live tracking results",
      "Implemented alert mechanisms for event-based tracking insights"
    ],
    impact: [
      "Enabled real-time monitoring and analysis of visual data",
      "Improved tracking accuracy and responsiveness"
    ]
  },
  roadsafety: {
    title: "Road Safety Detection",
    tagline: "AI-Based Monitoring System",
    desc: "A computer vision-based system designed to detect road violations and generate real-time alerts for traffic monitoring.",
    contributions: [
      "Developed computer vision models to detect traffic violations",
      "Implemented real-time alert system for monitoring unsafe driving patterns",
      "Integrated IoT/visual data inputs for continuous analysis",
      "Built processing pipeline for handling real-time video streams"
    ],
    impact: [
      "Enhanced traffic monitoring and safety awareness",
      "Provided automated detection of violations"
    ]
  }
};

function openP(id) {
  const modal = document.getElementById('projModal');
  const mBody = document.getElementById('m-body');
  const p = projectData[id];
  if (!p || !modal || !mBody) return;

  mBody.innerHTML = `
    <div class="m-header">
      <div class="m-tagline">${p.tagline}</div>
      <h3 class="m-title">${p.title}</h3>
    </div>
    <div class="m-section">
      <div class="m-section-title">Overview</div>
      <p style="font-size: 1rem; color: var(--muted); line-height: 1.8;">${p.desc}</p>
    </div>
    <div class="m-section">
      <div class="m-section-title">Key Contributions</div>
      <ul class="m-list">
        ${p.contributions.map(c => `<li>${c}</li>`).join('')}
      </ul>
    </div>
    <div class="m-section">
      <div class="m-section-title">Impact</div>
      <div class="m-impact">
        <ul class="m-list m-impact-list">
          ${p.impact.map(i => `<li>${i}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeP() {
  const modal = document.getElementById('projModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

// Start everything
loadSections();

// Global click handlers for modal
document.addEventListener('click', (e) => {
  const modal = document.getElementById('projModal');
  if (e.target.id === 'closeModal' || e.target === modal) closeP();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeP();
});

/* ═══════════════════════════════════════
   CONTACT FORM HANDLER
   ═══════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('successMsg');
  const submitBtn = document.getElementById('submitBtn');

  if (!form || !successMsg || !submitBtn) return;

  form.onsubmit = async (e) => {
    e.preventDefault();
    
    // Manual Validation
    let isValid = true;
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    // Reset states
    [name, email, message].forEach(el => {
      el.classList.remove('invalid');
      el.parentElement.classList.remove('invalid');
    });

    if (name.value.trim().length < 2) {
      name.classList.add('invalid');
      name.parentElement.classList.add('invalid');
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      email.classList.add('invalid');
      email.parentElement.classList.add('invalid');
      isValid = false;
    }

    if (message.value.trim().length < 10) {
      message.classList.add('invalid');
      message.parentElement.classList.add('invalid');
      isValid = false;
    }

    if (!isValid) return;
    
    // Start Loading
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    const formData = new FormData(form);
    
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Success
        form.classList.add('hide');
        setTimeout(() => {
          successMsg.classList.add('show');
          form.reset();
        }, 400);
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Submission failed');
      }
    } catch (err) {
      console.error(err);
      alert('Oops! There was a problem submitting your form. Please try again.');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  };
}

function resetForm() {
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('successMsg');
  if (form && successMsg) {
    successMsg.classList.remove('show');
    setTimeout(() => {
      form.classList.remove('hide');
    }, 300);
  }
}
