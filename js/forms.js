/**
 * forms.js — ScaleWthUs
 * Handles:
 *  - Quote / contact form validation
 *  - Accessible error display
 *  - Submit with success feedback (no backend required for demo)
 */

(function () {
  'use strict';

  /* ── Shared helpers ────────────────────────────────────────────────────── */
  function setError(field, msg) {
    field.style.borderColor = '#ff4d4d';
    var err = field.parentElement.querySelector('.field-error');
    if (!err) {
      err = document.createElement('span');
      err.className = 'field-error';
      err.style.cssText = 'color:#ff4d4d;font-size:12px;margin-top:4px;display:block;';
      field.parentElement.appendChild(err);
    }
    err.textContent = msg;
  }

  function clearError(field) {
    field.style.borderColor = '';
    var err = field.parentElement.querySelector('.field-error');
    if (err) err.remove();
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    return /^[\d\s\+\-\(\)]{7,15}$/.test(phone.trim());
  }

  /* ── Quote form ─────────────────────────────────────────────────────────── */
const quoteForm = document.getElementById('quote-form');
console.log("Form:", quoteForm);
quoteForm.addEventListener('submit', async function (e) {

  e.preventDefault();

  var valid = validateAllQuoteFields();
  if (!valid) return;

  var submitBtn = quoteForm.querySelector('.form-submit');
  var originalText = submitBtn.textContent;

  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  const formData = {
    name: document.getElementById('q-name').value,
    email: document.getElementById('q-email').value,
    phone: document.getElementById('q-phone').value,
    service: document.getElementById('q-service').value,
    budget: document.getElementById('q-budget').value,
    message: document.getElementById('q-message').value
  };

  try {

    const response = await fetch(
      'http://localhost:5678/webhook-test/contact',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      }
    );

    const result = await response.json();

    console.log(result);

    submitBtn.textContent = '✓ Request Sent!';
    submitBtn.style.background = '#22c55e';

    quoteForm.reset();

  } catch (error) {

    console.error(error);

    submitBtn.textContent = 'Failed';
    submitBtn.style.background = '#ef4444';

  }

  setTimeout(() => {
    submitBtn.textContent = originalText;
    submitBtn.style.background = '';
    submitBtn.disabled = false;
  }, 3000);

});  

  function validateQuoteField(field) {
    var val = field.value.trim();
    var name = field.name || field.id;

    if (field.required && !val) {
      setError(field, 'This field is required.');
      return false;
    }
    if (name === 'email' && val && !validateEmail(val)) {
      setError(field, 'Please enter a valid email address.');
      return false;
    }
    if (name === 'phone' && val && !validatePhone(val)) {
      setError(field, 'Please enter a valid phone number.');
      return false;
    }
    clearError(field);
    return true;
  }

  function validateAllQuoteFields() {
    var fields = quoteForm.querySelectorAll('input[required], select[required], textarea[required]');
    var allValid = true;
    fields.forEach(function (field) {
      if (!validateQuoteField(field)) allValid = false;
    });
    return allValid;
  }

  /* ── Contact form (if separate from quote) ──────────────────────────────── */
  var contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.querySelectorAll('input, textarea').forEach(function (field) {
      field.addEventListener('blur', function () { validateContactField(field); });
      field.addEventListener('input', function () { clearError(field); });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields = contactForm.querySelectorAll('input[required], textarea[required]');
      var allValid = true;
      fields.forEach(function (field) {
        if (!validateContactField(field)) allValid = false;
      });
      if (!allValid) return;

      var btn = contactForm.querySelector('button[type="submit"]');
      var orig = btn.textContent;
      btn.textContent = '✓ Message Sent!';
      btn.style.background = '#22c55e';
      btn.disabled = true;

      setTimeout(function () {
        btn.textContent = orig;
        btn.style.background = '';
        btn.disabled = false;
        contactForm.reset();
        // [DEMO CONTENT] — Replace with real API call
        console.log('[ScaleWthUs] Contact form submitted. Wire up to real API here.');
      }, 3000);
    });
  }

  function validateContactField(field) {
    var val = field.value.trim();
    var name = field.name || field.id;
    if (field.required && !val) {
      setError(field, 'This field is required.');
      return false;
    }
    if (name === 'email' && val && !validateEmail(val)) {
      setError(field, 'Please enter a valid email address.');
      return false;
    }
    clearError(field);
    return true;
  }
})();
