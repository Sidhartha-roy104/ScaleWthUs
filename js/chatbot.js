/**
 * chatbot.js — ScaleWthUs
 * Simple FAQ-style chatbot widget.
 *
 * Features:
 *  - Toggle open/close the chatbot window
 *  - Pre-defined bot responses for common queries
 *  - Quick-option buttons for fast navigation
 *  - Free-text fallback response
 *  - Send via button click or Enter key
 */

(function () {
  'use strict';

  /* ── DOM refs ──────────────────────────────────────────────────────────── */
  var chatBtn    = document.getElementById('chatbot-btn');
  var chatWindow = document.getElementById('chatbot-window');
  var chatClose  = document.getElementById('chat-close-btn');
  var messages   = document.getElementById('chat-messages');
  var input      = document.getElementById('chat-input');
  var sendBtn    = document.getElementById('chat-send');
  var optionsBar = document.getElementById('chat-options');

  if (!chatBtn || !chatWindow) return; // guard

  /* ── Knowledge base ────────────────────────────────────────────────────── */
  var KB = [
    {
      keywords: ['web', 'website', 'development', 'design'],
      reply: "We build custom websites using React, Next.js, and modern CMS platforms. 🌐\n\nTypical turnaround: 2–4 weeks. Want a quote?"
    },
    {
      keywords: ['ai', 'automation', 'n8n', 'bot', 'workflow', 'agent'],
      reply: "Our AI & automation team builds n8n workflows, WhatsApp bots, CRM integrations, and custom AI agent pipelines. 🤖\n\nWe can automate lead capture, follow-ups, reporting, and more!"
    },
    {
      keywords: ['video', 'drone', 'film', 'reel', 'shoot', 'edit'],
      reply: "We handle everything from aerial drone footage to brand films, social reels, and corporate event coverage. 🎬\n\nWe own our own cameras and drones — no outsourcing!"
    },
    {
      keywords: ['price', 'cost', 'pricing', 'quote', 'budget', 'how much'],
      reply: "Pricing depends on scope. 💰\n\n• Website: from ₹15,000\n• AI Automation: from ₹20,000\n• Video Production: from ₹10,000\n\nFill the quote form for a custom estimate!"
    },
    {
      keywords: ['contact', 'email', 'call', 'reach', 'whatsapp', 'phone'],
      reply: "You can reach us at:\n📧 hello@scalewthus.com\n📱 WhatsApp: +91 98765 43210\n\nOr fill our quote form and we'll get back within 24 hrs!"
    },
    {
      keywords: ['turnaround', 'time', 'long', 'fast', 'deadline', 'when'],
      reply: "Our typical timelines:\n\n• Landing page: 5–7 days\n• Full website: 2–4 weeks\n• AI workflow: 1–2 weeks\n• Video project: 1–3 weeks\n\nRush delivery available!"
    },
    {
      keywords: ['hospital', 'school', 'real estate', 'retail', 'healthcare', 'clinic'],
      reply: "We've worked with hospitals, schools, real estate agencies, retail chains, and startups. 🏥🏫🏠\n\nEach industry gets a custom approach — not a template!"
    },
    {
      keywords: ['hello', 'hi', 'hey', 'help', 'start'],
      reply: "Hey there! 👋 I'm ScaleBot, your assistant at ScaleWthUs.\n\nHow can I help you today? Choose an option below or type your question."
    }
  ];

  /* ── Quick options ─────────────────────────────────────────────────────── */
  var QUICK_OPTIONS = [
    { label: '🌐 Web Dev',        query: 'website development' },
    { label: '🤖 AI Automation',  query: 'ai automation' },
    { label: '🎬 Video',          query: 'video production' },
    { label: '💰 Pricing',        query: 'pricing' },
    { label: '📞 Contact',        query: 'contact' }
  ];

  /* ── Helpers ───────────────────────────────────────────────────────────── */
  function addMsg(text, role) {
    var div = document.createElement('div');
    div.classList.add('chat-msg', role);
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function getBotReply(text) {
    var lower = text.toLowerCase();
    for (var i = 0; i < KB.length; i++) {
      var entry = KB[i];
      for (var j = 0; j < entry.keywords.length; j++) {
        if (lower.indexOf(entry.keywords[j]) !== -1) {
          return entry.reply;
        }
      }
    }
    return "I'm not sure about that — but our team can help! 😊\n\nEmail us at hello@scalewthus.com or fill the quote form.";
  }

  function typingIndicator() {
    var div = document.createElement('div');
    div.classList.add('chat-msg', 'bot');
    div.id = 'typing-indicator';
    div.textContent = '...';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  function sendMessage(text) {
    if (!text.trim()) return;
    addMsg(text, 'user');

    // Simulate typing delay
    var indicator = typingIndicator();
    setTimeout(function () {
      indicator.remove();
      addMsg(getBotReply(text), 'bot');
    }, 600 + Math.random() * 400);
  }

  /* ── Build quick options ───────────────────────────────────────────────── */
  function buildOptions() {
    if (!optionsBar) return;
    optionsBar.innerHTML = '';
    QUICK_OPTIONS.forEach(function (opt) {
      var btn = document.createElement('button');
      btn.className = 'chat-opt';
      btn.textContent = opt.label;
      btn.addEventListener('click', function () {
        sendMessage(opt.query);
      });
      optionsBar.appendChild(btn);
    });
  }

  /* ── Toggle chat window ────────────────────────────────────────────────── */
  function openChat() {
    chatWindow.classList.add('open');
  }
  function closeChat() {
    chatWindow.classList.remove('open');
  }

  /* ── Event listeners ───────────────────────────────────────────────────── */
  chatBtn.addEventListener('click', function () {
    chatWindow.classList.contains('open') ? closeChat() : openChat();
  });

  if (chatClose) chatClose.addEventListener('click', closeChat);

  sendBtn.addEventListener('click', function () {
    sendMessage(input.value);
    input.value = '';
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      sendMessage(input.value);
      input.value = '';
    }
  });

  /* ── Init ──────────────────────────────────────────────────────────────── */
  buildOptions();

  // Initial greeting after a slight delay
  setTimeout(function () {
    addMsg("👋 Hi! I'm ScaleBot. Ask me about our services, pricing, or anything else!", 'bot');
  }, 300);
})();
