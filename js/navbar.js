/**
 * navbar.js — ScaleWthUs
 * Handles:
 *  - Sticky navbar scroll class
 *  - Hamburger / mobile menu open & close
 *  - Smooth anchor close on mobile link tap
 */

(function () {
  'use strict';

  /* ── DOM refs ──────────────────────────────────────────────────────────── */
  const navbar      = document.getElementById('navbar');
  const hamburger   = document.getElementById('hamburger-btn');
  const mobileMenu  = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  /* ── Scroll → add/remove .scrolled class ──────────────────────────────── */
  function onScroll() {
    if (!navbar) return;
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ── Open mobile menu ──────────────────────────────────────────────────── */
  function openMobileMenu() {
    if (!mobileMenu || !hamburger) return;
    mobileMenu.classList.add('open');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // prevent body scroll
  }

  /* ── Close mobile menu ─────────────────────────────────────────────────── */
  function closeMobileMenu() {
    if (!mobileMenu || !hamburger) return;
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  // Expose globally so inline onclick="" attributes in sections still work
  window.closeMobileMenu = closeMobileMenu;

  /* ── Event listeners ───────────────────────────────────────────────────── */
  if (hamburger)   hamburger.addEventListener('click', openMobileMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);

  // Close when a mobile nav link is tapped
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on ESC key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobileMenu();
  });

  /* ── Theme Switching (Light/Dark Mode) ────────────────────────────────── */
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('theme');
  const userPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  // Set initial state
  if (savedTheme === 'light' || (!savedTheme && userPrefersLight)) {
    document.body.classList.add('light-theme');
    updateThemeUI('light');
  } else {
    document.body.classList.remove('light-theme');
    updateThemeUI('dark');
  }

  function updateThemeUI(theme) {
    const isLight = theme === 'light';
    
    // Update Desktop button icon
    if (themeToggle) {
      const iconSpan = themeToggle.querySelector('.theme-icon');
      if (iconSpan) iconSpan.textContent = isLight ? '☀️' : '🌙';
    }
    
    // Update Mobile button text/icon
    if (themeToggleMobile) {
      const iconSpan = themeToggleMobile.querySelector('span');
      if (iconSpan) iconSpan.textContent = isLight ? '☀️' : '🌙';
    }
  }

  function toggleTheme() {
    const wasLight = document.body.classList.contains('light-theme');
    const newTheme = wasLight ? 'dark' : 'light';
    
    if (newTheme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    
    localStorage.setItem('theme', newTheme);
    updateThemeUI(newTheme);
  }

  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);

  /* ── Custom Cursor & Dynamic Glow Tracking ────────────────────────────── */
  // Create cursor element dynamically so we don't pollute HTML base files
  const cursorGlow = document.createElement('div');
  cursorGlow.className = 'cursor-glow';
  document.body.appendChild(cursorGlow);

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;
  let hasMoved = false;

  // Track cursor movement
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Only display cursor element once the mouse has moved on desktop viewports
    if (!hasMoved) {
      cursorGlow.style.display = 'block';
      hasMoved = true;
    }
  });

  // Smooth linear interpolation (lerp) loop for trailing inertia
  function updateCursorTracking() {
    // Lerp glow (slower for trailing lag/inertia effect)
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    
    cursorGlow.style.left = `${glowX}px`;
    cursorGlow.style.top = `${glowY}px`;
    
    requestAnimationFrame(updateCursorTracking);
  }
  requestAnimationFrame(updateCursorTracking);

  // Set hover state triggers for all interactive selectors
  function initCursorHoverEvents() {
    const interactives = document.querySelectorAll(
      'a, button, select, input, textarea, .service-card, .work-card, .team-card, .testimonial-card, .client-domain-card, #theme-toggle'
    );
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-active');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-active');
      });
    });
  }

  // Run on load
  initCursorHoverEvents();

  // Re-run hook when new content is dynamically injected (like portfolio filters)
  window.addEventListener('portfolioFiltered', () => {
    initCursorHoverEvents();
  });
})();
