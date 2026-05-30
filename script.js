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

(function loopRing() {
  rx += (mx - rx) * 0.11;
  ry += (my - ry) * 0.11;
  curR.style.left = (rx - 18) + 'px';
  curR.style.top  = (ry - 18) + 'px';
  requestAnimationFrame(loopRing);
})();

document.querySelectorAll('a, button, .proj-card, .sk-card, .ach-card, .btn').forEach(el => {
  el.addEventListener('mouseenter', () => { cur.classList.add('hover'); curR.classList.add('hover'); });
  el.addEventListener('mouseleave', () => { cur.classList.remove('hover'); curR.classList.remove('hover'); });
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
  particles.push({ x: Math.random()*1920, y: Math.random()*1080, vx: (Math.random()-.5)*.45, vy: (Math.random()-.5)*.45, r: Math.random()*1.8+.4 });
}

function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
  });
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    for (let j = i+1; j < PARTICLE_COUNT; j++) {
      const d = Math.hypot(particles[i].x-particles[j].x, particles[i].y-particles[j].y);
      if (d < 155) {
        ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,161,224,${0.13*(1-d/155)})`; ctx.lineWidth = .5; ctx.stroke();
      }
    }
  }
  particles.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fillStyle='rgba(0,161,224,0.55)'; ctx.fill(); });
  requestAnimationFrame(drawParticles);
}
drawParticles();


/* ════════════════════════════════════
   3. NAV — SCROLL SHRINK + ACTIVE
════════════════════════════════════ */
const navEl    = document.querySelector('nav');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav ul a');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navEl.classList.add('scrolled');
  else navEl.classList.remove('scrolled');
  const sy = window.scrollY;
  sections.forEach(sec => {
    const top = sec.offsetTop - 140, bottom = top + sec.offsetHeight;
    if (sy >= top && sy < bottom) {
      navLinks.forEach(a => { a.classList.toggle('active', a.getAttribute('href') === '#' + sec.id); });
    }
  });
}, { passive: true });


/* ════════════════════════════════════
   4. TIMELINE — SCROLL REVEAL
════════════════════════════════════ */
const tlObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); tlObserver.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.tl-item').forEach(el => tlObserver.observe(el));


/* ════════════════════════════════════
   5. SKILL BARS — ANIMATE ON SCROLL
════════════════════════════════════ */
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.querySelectorAll('.bar-fill').forEach(b => b.style.width = b.dataset.w+'%'); barObserver.unobserve(e.target); }
  });
}, { threshold: 0.3 });
const skillBarsEl = document.getElementById('skill-bars');
if (skillBarsEl) barObserver.observe(skillBarsEl);


/* ════════════════════════════════════
   6. STATS — COUNT UP ANIMATION
════════════════════════════════════ */
function countUp(el, target) {
  const dur = 1700, t0 = performance.now();
  (function step(now) {
    const p = Math.min((now-t0)/dur, 1), e = 1-Math.pow(1-p, 3);
    el.textContent = Math.round(e*target);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target + (target >= 50 ? '%' : '+');
  })(performance.now());
}
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.querySelectorAll('[data-target]').forEach(el => countUp(el, parseInt(el.dataset.target))); statsObserver.unobserve(e.target); }
  });
}, { threshold: 0.4 });
const statsRow = document.querySelector('.stats');
if (statsRow) statsObserver.observe(statsRow);


/* ════════════════════════════════════
   7. VISITOR TRACKER — GOOGLE SHEETS
   (IP Location + GPS Location)
════════════════════════════════════ */
// 👇 Apna Apps Script URL yahan paste karo
const TRACKER_URL = "https://script.google.com/macros/s/AKfycbwqNE8-Ef5jVEpYH7rMGspG6yAZkjbJjnfqh2Y-XHxOBBTgAqto4RahNQ1MLI8Ii-A/exec";

// ── Helper functions ──
const ua = navigator.userAgent;
const getDevice  = () => /Mobi|Android/i.test(ua) ? "Mobile" : /Tablet|iPad/i.test(ua) ? "Tablet" : "Desktop";
const getBrowser = () => ua.includes("Edg") ? "Edge" : ua.includes("OPR") ? "Opera" : ua.includes("Chrome") ? "Chrome" : ua.includes("Firefox") ? "Firefox" : ua.includes("Safari") ? "Safari" : "Other";
const getOS      = () => ua.includes("Windows") ? "Windows" : ua.includes("Mac") ? "MacOS" : ua.includes("Android") ? "Android" : (ua.includes("iPhone")||ua.includes("iPad")) ? "iOS" : ua.includes("Linux") ? "Linux" : "Unknown";

// ── Send data to Google Sheets ──
async function sendToSheet(data) {
  await fetch(TRACKER_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(data)
  });
  console.log("✅ Visitor tracked!", data);
}

// ── Main tracker function ──
async function trackVisitor() {
  if (TRACKER_URL.includes("YAHAN")) return;

  try {
    // 1. IP se basic info
    const geoRes = await fetch("https://ipapi.co/json/");
    const geo    = await geoRes.json();

    // 2. Extra browser info
    const extraInfo = {
      city:       geo.city        || "Unknown",
      country:    geo.country     || "Unknown",
      device:     getDevice(),
      browser:    getBrowser(),
      os:         getOS(),
      referrer:   document.referrer ? document.referrer : "Direct",
      language:   navigator.language || "Unknown",
      screen:     `${screen.width}x${screen.height}`,
      timezone:   Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown",
      gps_lat:    "Not allowed",
      gps_lng:    "Not allowed",
      gps_acc:    "Not allowed"
    };

    // 3. GPS Location try karo (permission maangega)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // ✅ Allow kiya toh — exact GPS milegi
        (pos) => {
          extraInfo.gps_lat = pos.coords.latitude.toFixed(6);
          extraInfo.gps_lng = pos.coords.longitude.toFixed(6);
          extraInfo.gps_acc = Math.round(pos.coords.accuracy) + "m";
          sendToSheet(extraInfo);
        },
        // ❌ Block kiya toh — baki info toh bhejo
        () => {
          extraInfo.gps_lat = "Blocked";
          extraInfo.gps_lng = "Blocked";
          extraInfo.gps_acc = "Blocked";
          sendToSheet(extraInfo);
        },
        { timeout: 8000, maximumAge: 0 }
      );
    } else {
      // Browser GPS support nahi karta
      sendToSheet(extraInfo);
    }

  } catch (err) {
    console.log("Tracking skipped:", err.message);
  }
}

window.addEventListener("load", trackVisitor);
