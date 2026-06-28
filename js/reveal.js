/**
 * reveal.js — ScaleWthUs
 * Intersection Observer-based scroll reveal for elements with class="reveal".
 * When an element enters the viewport it receives class="reveal visible",
 * triggering the CSS transition defined in animations.css.
 */

(function () {
  'use strict';

  /* ── Options ──────────────────────────────────────────────────────────── */
  var THRESHOLD  = 0.15;   // 15 % of the element must be visible
  var ROOT_MARGIN = '0px 0px -40px 0px'; // trigger slightly before bottom edge

  /* ── Observer ─────────────────────────────────────────────────────────── */
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animate once only
      }
    });
  }, {
    threshold: THRESHOLD,
    rootMargin: ROOT_MARGIN
  });

  /* ── Observe all .reveal elements ─────────────────────────────────────── */
  function init() {
    var elements = document.querySelectorAll('.reveal');
    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ── Run after DOM is ready ────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
