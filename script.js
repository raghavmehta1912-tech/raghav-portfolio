/* ═══════════════════════════════════════════════
   RAGHAV — SALESFORCE DEVELOPER PORTFOLIO
   Main JavaScript
   ═══════════════════════════════════════════════ */

/* ════════════════════════════════════
   1. CUSTOM CURSOR
════════════════════════════════════ */
const cur  = document.getElementById('cur');
const curR = document.getElementById('cur-r');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = (mx - 5) + 'px';
  cur.style.top  = (my - 5) + 'px';
});

// Smooth ring follow
(function loopRing() {
  rx += (mx - rx) * 0.11;
  ry += (my - ry) * 0.11;
  curR.style.left = (rx - 18) + 'px';
  curR.style.top  = (ry - 18) + 'px';
  requestAnimationFrame(loopRing);
})();

// Cursor hover effect
document.querySelectorAll('a, button, .proj-card, .sk-card, .ach-card, .btn').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cur.classList.add('hover');
    curR.classList.add('hover');
  });
  el.addEventListener('mouseleave', () => {
    cur.classList.remove('hover');
    curR.classList.remove('hover');
  });
});


/* ════════════════════════════════════
   2. ANIMATED PARTICLE CANVAS
════════════════════════════════════ */
const canvas = document.getElementById('canvas-bg');
const ctx    = canvas.getContext('2d');
let W, H;

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const PARTICLE_COUNT = 60;
const particles = [];

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push({
    x:  Math.random() * 1920,
    y:  Math.random() * 1080,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45,
    r:  Math.random() * 1.8 + 0.4
  });
}

function drawParticles() {
  ctx.clearRect(0, 0, W, H);

  // Move
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
  });

  // Lines between nearby particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    for (let j = i + 1; j < PARTICLE_COUNT; j++) {
      const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
      if (d < 155) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,161,224,${0.13 * (1 - d / 155)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  // Dots
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,161,224,0.55)';
    ctx.fill();
  });

  requestAnimationFrame(drawParticles);
}
drawParticles();


/* ════════════════════════════════════
   3. NAV — SCROLL SHRINK + ACTIVE
════════════════════════════════════ */
const navEl   = document.querySelector('nav');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav ul a');

window.addEventListener('scroll', () => {
  // Shrink nav
  if (window.scrollY > 60) navEl.classList.add('scrolled');
  else                      navEl.classList.remove('scrolled');

  // Active nav link
  const sy = window.scrollY;
  sections.forEach(sec => {
    const top    = sec.offsetTop - 140;
    const bottom = top + sec.offsetHeight;
    if (sy >= top && sy < bottom) {
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + sec.id);
      });
    }
  });
}, { passive: true });


/* ════════════════════════════════════
   4. TIMELINE — SCROLL REVEAL
════════════════════════════════════ */
const tlObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('vis');
      tlObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.tl-item').forEach(el => tlObserver.observe(el));


/* ════════════════════════════════════
   5. SKILL BARS — ANIMATE ON SCROLL
════════════════════════════════════ */
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
      });
      barObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

const skillBarsEl = document.getElementById('skill-bars');
if (skillBarsEl) barObserver.observe(skillBarsEl);


/* ════════════════════════════════════
   6. STATS — COUNT UP ANIMATION
════════════════════════════════════ */
function countUp(el, target) {
  const duration = 1700;
  const startTime = performance.now();

  function step(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease out cubic
    el.textContent = Math.round(eased * target);
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      // Add suffix
      el.textContent = target + (target >= 50 ? '%' : '+');
    }
  }
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('[data-target]').forEach(el => {
        countUp(el, parseInt(el.dataset.target));
      });
      statsObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });

const statsRow = document.querySelector('.stats');
if (statsRow) statsObserver.observe(statsRow);


/* ════════════════════════════════════
   7. VISITOR TRACKER — GOOGLE SHEETS
════════════════════════════════════ */
// 👇 Step 3: Apna Apps Script Web App URL yahan paste karo
const TRACKER_URL = "https://script.google.com/macros/s/AKfycbzsBiHl5jaxCwAskYsRoyTVYLwwDKxNQEO9apN5_1joe36IHQSUtudyL5TiHsOld5w/exec";

async function trackVisitor() {
  if (TRACKER_URL.includes("YAHAN")) return; // URL set nahi kiya toh skip

  try {
    // Location from IP (free API)
    const geoRes = await fetch("https://ipapi.co/json/");
    const geo    = await geoRes.json();

    const ua = navigator.userAgent;

    const getDevice = () => {
      if (/Mobi|Android/i.test(ua)) return "Mobile";
      if (/Tablet|iPad/i.test(ua))  return "Tablet";
      return "Desktop";
    };

    const getBrowser = () => {
      if (ua.includes("Edg"))     return "Edge";
      if (ua.includes("OPR"))     return "Opera";
      if (ua.includes("Chrome"))  return "Chrome";
      if (ua.includes("Firefox")) return "Firefox";
      if (ua.includes("Safari"))  return "Safari";
      return "Other";
    };

    const getOS = () => {
      if (ua.includes("Windows")) return "Windows";
      if (ua.includes("Mac"))     return "MacOS";
      if (ua.includes("Android")) return "Android";
      if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
      if (ua.includes("Linux"))   return "Linux";
      return "Unknown";
    };

    await fetch(TRACKER_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        city:    geo.city    || "Unknown",
        country: geo.country || "Unknown",
        device:  getDevice(),
        browser: getBrowser(),
        os:      getOS()
      })
    });

    console.log("✅ Visitor tracked!");
  } catch (err) {
    console.log("Tracking skipped:", err.message); // Silent fail
  }
}

window.addEventListener("load", trackVisitor);