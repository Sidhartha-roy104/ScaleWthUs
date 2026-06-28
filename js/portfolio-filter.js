/**
 * portfolio-filter.js — ScaleWthUs
 * Handles the work portfolio category filter buttons.
 *
 * Usage:
 *  Filter buttons must have: data-filter="all|web|ai|video"
 *  Work cards must have:     data-cat="web|ai|video"
 *
 * The active filter button receives the CSS class "active".
 * Non-matching cards receive the CSS class "hidden" (display:none in portfolio.css).
 */

(function () {
  'use strict';

  /* ── DOM refs ──────────────────────────────────────────────────────────── */
  var filterContainer = document.querySelector('.work-filter');
  var workGrid        = document.getElementById('work-grid');

  if (!filterContainer || !workGrid) return; // guard: section not on page

  /* ── Filter logic ──────────────────────────────────────────────────────── */
  function filterWork(activeBtn, category) {
    // 1. Update active button state
    var allBtns = filterContainer.querySelectorAll('.filter-btn');
    allBtns.forEach(function (btn) { btn.classList.remove('active'); });
    activeBtn.classList.add('active');

    // 2. Show / hide cards
    var cards = workGrid.querySelectorAll('.work-card');
    cards.forEach(function (card) {
      var cardCat = card.getAttribute('data-cat');
      if (category === 'all' || cardCat === category) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }

  /* ── Expose globally (used by inline onclick in sections/portfolio.html) ── */
  window.filterWork = filterWork;

  /* ── Delegate click events on filter container (cleaner than inline) ───── */
  filterContainer.addEventListener('click', function (e) {
    var btn = e.target.closest('.filter-btn');
    if (!btn) return;
    var category = btn.getAttribute('data-filter') || 'all';
    filterWork(btn, category);
  });
})();
