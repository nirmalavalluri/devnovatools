/* DevNova Tools — Community Features */
/* Live counters, newsletter, testimonials */

const DevNovaCommunity = (() => {

// ── LIVE STATS ─────────────────────────────────────────────────
// Simulated growing counters — replace with real analytics later
const BASE_STATS = {
  toolRuns: 12847,
  developers: 3241,
  tools: 76,
  countries: 48
};

function animateCounter(el, target, suffix='') {
  const duration = 2000;
  const start = 0;
  const startTime = performance.now();
  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (target - start) * eased);
    el.textContent = current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function initStats() {
  const section = document.getElementById('live-stats');
  if (!section) return;

  // Add small random increment to feel live
  const stored = JSON.parse(localStorage.getItem('dnt-stats') || 'null');
  const now = Date.now();
  let stats = stored || { ...BASE_STATS, lastUpdate: now };

  if (now - stats.lastUpdate > 3600000) { // 1 hour
    stats.toolRuns += Math.floor(Math.random() * 200) + 50;
    stats.developers += Math.floor(Math.random() * 30) + 5;
    stats.lastUpdate = now;
    localStorage.setItem('dnt-stats', JSON.stringify(stats));
  }

  const els = {
    runs: document.getElementById('stat-runs'),
    devs: document.getElementById('stat-devs'),
    tools: document.getElementById('stat-tools'),
    countries: document.getElementById('stat-countries'),
  };

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      if (els.runs) animateCounter(els.runs, stats.toolRuns, '+');
      if (els.devs) animateCounter(els.devs, stats.developers, '+');
      if (els.tools) animateCounter(els.tools, stats.tools, '');
      if (els.countries) animateCounter(els.countries, stats.countries, '+');
      observer.disconnect();
    }
  }, { threshold: 0.3 });
  observer.observe(section);

  // Track tool run on tool pages
  if (window.location.pathname.split('/').filter(Boolean).length >= 2) {
    const key = 'dnt-runs-' + new Date().toDateString();
    const runs = parseInt(localStorage.getItem(key) || '0') + 1;
    localStorage.setItem(key, runs);
  }
}

// ── NEWSLETTER ────────────────────────────────────────────────
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('newsletter-email').value.trim();
    const btn = document.getElementById('newsletter-btn');
    const success = document.getElementById('newsletter-success');

    if (!email || !email.includes('@')) {
      document.getElementById('newsletter-email').style.borderColor = 'var(--error)';
      return;
    }

    btn.textContent = 'Subscribing...';
    btn.disabled = true;

    // GA4 conversion event (mark as Key Event in GA4 Admin)
    if (typeof window.gtag === 'function') {
      gtag('event', 'newsletter_signup', { page_path: location.pathname });
    }

    // Store locally (replace with your email service: ConvertKit, Mailchimp, etc.)
    const subscribers = JSON.parse(localStorage.getItem('dnt-subscribers') || '[]');
    if (!subscribers.includes(email)) {
      subscribers.push(email);
      localStorage.setItem('dnt-subscribers', JSON.stringify(subscribers));
    }

    // Simulate API call — replace with real endpoint
    await new Promise(r => setTimeout(r, 800));

    form.style.display = 'none';
    success.style.display = 'block';

    // Track subscription
    console.log('New subscriber:', email);
    // TODO: POST to your email service API
    // await fetch('https://api.convertkit.com/v3/forms/YOUR_FORM_ID/subscribe', {
    //   method: 'POST',
    //   headers: {'Content-Type': 'application/json'},
    //   body: JSON.stringify({api_key: 'YOUR_KEY', email})
    // });
  });
}

// ── TESTIMONIALS ────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    text: "DevNova Tools is now my first tab every morning. The JSON formatter and JWT decoder alone save me 30 minutes a day.",
    name: "Alex M.",
    role: "Full Stack Developer",
    tool: "JSON Formatter",
    initials: "AM",
    stars: 5
  },
  {
    text: "Finally a tool site that doesn't make me create an account or disable my ad blocker. The cron builder is incredibly intuitive.",
    name: "Sarah K.",
    role: "DevOps Engineer",
    tool: "Cron Builder",
    initials: "SK",
    stars: 5
  },
  {
    text: "The regex tester with live match highlighting is exactly what I needed. Clean, fast and works offline too.",
    name: "Raj P.",
    role: "Backend Engineer",
    tool: "Regex Tester",
    initials: "RP",
    stars: 5
  },
  {
    text: "I use the UUID generator and password generator daily. No login, no ads — exactly how developer tools should work.",
    name: "Maria L.",
    role: "Security Engineer",
    tool: "UUID Generator",
    initials: "ML",
    stars: 5
  },
  {
    text: "The CSS Grid and Flexbox generators have transformed how I prototype layouts. Visual + code output is perfect.",
    name: "Tom W.",
    role: "Frontend Developer",
    tool: "CSS Grid",
    initials: "TW",
    stars: 5
  },
  {
    text: "Bookmarked every single tool within the first 10 minutes. The SQL formatter saved me during a live code review.",
    name: "Chen J.",
    role: "Data Engineer",
    tool: "SQL Formatter",
    initials: "CJ",
    stars: 5
  },
];

function renderTestimonials() {
  const grid = document.getElementById('testimonials-grid');
  if (!grid) return;

  grid.innerHTML = TESTIMONIALS.map(t => `
    <div class="testimonial-card">
      <span class="testimonial-tool">${t.tool}</span>
      <div class="testimonial-stars">${'★'.repeat(t.stars)}</div>
      <p class="testimonial-text">${t.text}</p>
      <div class="testimonial-author">
        <div class="testimonial-avatar">${t.initials}</div>
        <div>
          <div class="testimonial-name">${t.name}</div>
          <div class="testimonial-role">${t.role}</div>
        </div>
      </div>
    </div>
  `).join('');
}

// ── BLOG ARTICLES ──────────────────────────────────────────────
const BLOG_POSTS = [
  {
    emoji: '⏰',
    bgColor: 'rgba(245,158,11,0.12)',
    tag: 'DevOps',
    tagColor: '#F59E0B',
    tagBg: 'rgba(245,158,11,0.12)',
    title: 'Cron Expression Cheat Sheet — Every Schedule You Need',
    excerpt: 'Copy-paste cron expressions for every schedule: every 5 minutes, hourly, daily, weekly, monthly. Syntax reference, platform differences, and common mistakes.',
    date: 'Jun 2026',
    readTime: '7 min read',
    slug: 'cron-expression-cheat-sheet',
  },
  {
    emoji: '🔍',
    bgColor: 'rgba(139,92,246,0.12)',
    tag: 'Text',
    tagColor: '#8B5CF6',
    tagBg: 'rgba(139,92,246,0.12)',
    title: 'Regex Cheat Sheet for Developers — Patterns, Examples & Common Mistakes',
    excerpt: 'Every metacharacter, quantifier, and flag explained. Plus the patterns developers copy most often: email, URL, IP, date, phone. With a live tester.',
    date: 'Jun 2026',
    readTime: '8 min read',
    slug: 'regex-cheat-sheet',
  },
  {
    emoji: '📦',
    bgColor: 'rgba(16,185,129,0.12)',
    tag: 'Frontend',
    tagColor: '#10B981',
    tagBg: 'rgba(16,185,129,0.12)',
    title: 'CSS Flexbox vs Grid — When to Use Which (With Examples)',
    excerpt: 'Flexbox is for 1D alignment, Grid is for 2D layouts. Side-by-side comparisons, real code examples, and a decision flowchart.',
    date: 'Jun 2026',
    readTime: '7 min read',
    slug: 'css-flexbox-vs-grid',
  },
  {
    emoji: '🔣',
    bgColor: 'rgba(16,185,129,0.12)',
    tag: 'Frontend',
    tagColor: '#10B981',
    tagBg: 'rgba(16,185,129,0.12)',
    title: 'HTML Entities Explained: When to Use <, >, & and Quotes',
    excerpt: 'The 5 characters you must always escape, encoding vs sanitization, common double-encoding bugs, and code examples in JavaScript, Python and C#.',
    date: 'Jun 2026',
    readTime: '6 min read',
    slug: 'html-entities-explained',
  },
  {
    emoji: '🔐',
    bgColor: 'rgba(0,102,255,0.12)',
    tag: 'Security',
    tagColor: '#0066FF',
    tagBg: 'rgba(0,102,255,0.12)',
    title: 'What is a JWT Token and How Does It Work?',
    excerpt: 'JSON Web Tokens are the backbone of modern API authentication. Learn how they are structured, signed and verified — with real examples.',
    date: 'May 2026',
    readTime: '5 min read',
    slug: 'what-is-jwt-token',
  },
  {
    emoji: '🟦',
    bgColor: 'rgba(0,200,150,0.12)',
    tag: 'JSON',
    tagColor: '#00C896',
    tagBg: 'rgba(0,200,150,0.12)',
    title: 'JSON vs YAML vs TOML — Which Config Format Should You Use?',
    excerpt: 'Configuration files are everywhere in modern development. Compare the three most popular formats and learn when to use each one.',
    date: 'May 2026',
    readTime: '7 min read',
    slug: 'json-vs-yaml-vs-toml',
  },
  {
    emoji: '⏰',
    bgColor: 'rgba(255,107,53,0.12)',
    tag: 'DevOps',
    tagColor: '#FF6B35',
    tagBg: 'rgba(255,107,53,0.12)',
    title: 'Cron Job Expressions Explained — A Complete Guide',
    excerpt: 'Every developer needs to schedule tasks. Master cron expressions once and for all with clear examples, common patterns and gotchas to avoid.',
    date: 'May 2026',
    readTime: '6 min read',
    slug: 'cron-job-expressions-guide',
  },
  {
    emoji: '✍️',
    bgColor: 'rgba(123,97,255,0.12)',
    tag: 'Regex',
    tagColor: '#7B61FF',
    tagBg: 'rgba(123,97,255,0.12)',
    title: '10 Regex Patterns Every Developer Should Know',
    excerpt: 'From email validation to URL matching — these 10 regular expression patterns come up in almost every project. Copy, paste and adapt them.',
    date: 'May 2026',
    readTime: '8 min read',
    slug: '10-regex-patterns-developers',
  },
  {
    emoji: '🌐',
    bgColor: 'rgba(77,166,255,0.12)',
    tag: 'APIs',
    tagColor: '#4DA6FF',
    tagBg: 'rgba(77,166,255,0.12)',
    title: 'HTTP Status Codes — The Complete Developer Reference',
    excerpt: 'What is the difference between 401 and 403? When do you use 201 vs 200? A practical guide to every HTTP status code you will encounter.',
    date: 'Apr 2026',
    readTime: '5 min read',
    slug: 'http-status-codes-guide',
  },
  {
    emoji: '🎨',
    bgColor: 'rgba(0,212,255,0.12)',
    tag: 'CSS',
    tagColor: '#00D4FF',
    tagBg: 'rgba(0,212,255,0.12)',
    title: 'CSS Grid vs Flexbox — When to Use Which',
    excerpt: 'Both are powerful layout systems but they solve different problems. Learn the key differences and the simple rule for choosing between them.',
    date: 'Apr 2026',
    readTime: '6 min read',
    slug: 'css-grid-vs-flexbox',
  },
  {
    emoji: '🔓',
    bgColor: 'rgba(0,102,255,0.12)',
    tag: 'Security',
    tagColor: '#0066FF',
    tagBg: 'rgba(0,102,255,0.12)',
    title: 'How to Decode a JWT Token (And What\'s Actually Inside It)',
    excerpt: 'Ever pasted a JWT token into a random online decoder? It probably got sent to their server. Learn to decode JWT tokens safely with JavaScript, Python and C#.',
    date: 'Jun 2026',
    readTime: '6 min read',
    slug: 'how-to-decode-jwt-token',
  },
  {
    emoji: '🟦',
    bgColor: 'rgba(0,200,150,0.12)',
    tag: 'JSON',
    tagColor: '#00C896',
    tagBg: 'rgba(0,200,150,0.12)',
    title: 'How to Format and Validate JSON Online — Free & Instant',
    excerpt: 'Working with messy, minified or broken JSON? Learn how to format, beautify and validate JSON instantly — with real examples and common error fixes.',
    date: 'Jun 2026',
    readTime: '6 min read',
    slug: 'how-to-format-validate-json',
  },
  {
    emoji: '⏰',
    bgColor: 'rgba(255,107,53,0.12)',
    tag: 'DevOps',
    tagColor: '#FF6B35',
    tagBg: 'rgba(255,107,53,0.12)',
    title: 'Cron Job Syntax: The Complete Guide with Examples',
    excerpt: 'Cron syntax is something every developer looks up every single time. This guide explains every field, special character and common schedule — once and for all.',
    date: 'Jun 2026',
    readTime: '7 min read',
    slug: 'cron-job-syntax',
  },
  {
    emoji: '🔒',
    bgColor: 'rgba(0,102,255,0.12)',
    tag: 'Security',
    tagColor: '#0066FF',
    tagBg: 'rgba(0,102,255,0.12)',
    title: 'What Is Base64 Encoding? (And When to Use It)',
    excerpt: 'Base64 is everywhere — in JWTs, image embeds, email attachments and API auth. Learn exactly what it is, how it works and when to use it.',
    date: 'Jun 2026',
    readTime: '5 min read',
    slug: 'what-is-base64-encoding',
  },
  {
    emoji: '🛠️',
    bgColor: 'rgba(155,89,182,0.12)',
    tag: 'Tools',
    tagColor: '#9B59B6',
    tagBg: 'rgba(155,89,182,0.12)',
    title: '10 Free Developer Tools Every Web Developer Needs in 2026',
    excerpt: 'The 10 best free browser-based developer utilities — JSON formatter, JWT decoder, regex tester, cron builder and more. No login, no ads, works offline.',
    date: 'Jun 2026',
    readTime: '6 min read',
    slug: 'free-developer-tools',
  },
  {
    emoji: '⚙️',
    bgColor: 'rgba(167,139,250,0.12)',
    tag: 'Encoding',
    tagColor: '#A78BFA',
    tagBg: 'rgba(167,139,250,0.12)',
    title: 'Bitwise Calculator Online — AND, OR, XOR, NOT with Examples',
    excerpt: 'Learn how to use bitwise operators AND, OR, XOR, NOT, left shift and right shift with real examples in JavaScript, Python and C#.',
    date: 'Jun 2026',
    readTime: '7 min read',
    slug: 'bitwise-calculator',
  },
  {
    emoji: '💅',
    bgColor: 'rgba(0,212,255,0.12)',
    tag: 'Frontend',
    tagColor: '#00D4FF',
    tagBg: 'rgba(0,212,255,0.12)',
    title: 'HTML Beautifier Online — Format & Prettify HTML Instantly',
    excerpt: 'Messy, minified or unformatted HTML is a nightmare to read. Learn how to beautify HTML instantly — online, in your editor, and with JavaScript, Python and C#.',
    date: 'Jun 2026',
    readTime: '5 min read',
    slug: 'html-beautifier',
  },
  {
    emoji: '🛠️',
    bgColor: 'rgba(255,107,53,0.12)',
    tag: 'DevOps',
    tagColor: '#FF6B35',
    tagBg: 'rgba(255,107,53,0.12)',
    title: 'DevOps Tools Every Developer Should Know',
    excerpt: 'From cron jobs to SQL formatters — the essential DevOps utilities that every developer needs in their daily workflow. Free and browser-based.',
    date: 'May 2026',
    readTime: '6 min read',
    slug: 'devops-tools-every-developer-should-know',
  },
  {
    emoji: '🔢',
    bgColor: 'rgba(167,139,250,0.12)',
    tag: 'Encoding',
    tagColor: '#A78BFA',
    tagBg: 'rgba(167,139,250,0.12)',
    title: 'Understanding Encoding — Base64, Hex and Binary Explained',
    excerpt: 'What is the difference between Base64, hexadecimal and binary? Learn how each encoding works, when to use it and how to convert between them.',
    date: 'May 2026',
    readTime: '6 min read',
    slug: 'understanding-encoding-base64-hex-binary',
  },
  {
    emoji: '🌐',
    bgColor: 'rgba(77,166,255,0.12)',
    tag: 'Networking',
    tagColor: '#4DA6FF',
    tagBg: 'rgba(77,166,255,0.12)',
    title: 'DNS Explained for Developers',
    excerpt: 'How does DNS actually work? From typing a URL to getting a response — a practical guide to DNS for developers who want to understand the internet.',
    date: 'May 2026',
    readTime: '5 min read',
    slug: 'dns-explained-for-developers',
  },
  {
    emoji: '🐛',
    bgColor: 'rgba(0,200,150,0.12)',
    tag: 'APIs',
    tagColor: '#00C896',
    tagBg: 'rgba(0,200,150,0.12)',
    title: 'How to Debug API Requests Like a Pro',
    excerpt: 'Struggling with failing API calls? Learn the systematic approach to debugging HTTP requests — headers, status codes, payloads and common gotchas.',
    date: 'May 2026',
    readTime: '7 min read',
    slug: 'how-to-debug-api-requests',
  },
  {
    emoji: '🗄️',
    bgColor: 'rgba(0,200,150,0.12)',
    tag: 'Database',
    tagColor: '#00C896',
    tagBg: 'rgba(0,200,150,0.12)',
    title: 'SQL vs NoSQL — When to Use Which',
    excerpt: 'Should you use PostgreSQL or MongoDB? MySQL or DynamoDB? A practical guide to choosing between SQL and NoSQL databases for your project.',
    date: 'May 2026',
    readTime: '6 min read',
    slug: 'sql-vs-nosql-when-to-use',
  },
];

function renderBlog() {
  const grid = document.getElementById('blog-grid');
  if (!grid) return;

  grid.innerHTML = BLOG_POSTS.map(p => `
    <a href="/blog/${p.slug}/" class="blog-card">
      <div class="blog-card-image" style="background:${p.bgColor}">
        <span style="font-size:3rem">${p.emoji}</span>
      </div>
      <div class="blog-card-body">
        <span class="blog-card-tag" style="color:${p.tagColor};background:${p.tagBg}">${p.tag}</span>
        <div class="blog-card-title">${p.title}</div>
        <div class="blog-card-excerpt">${p.excerpt}</div>
        <div class="blog-card-footer">
          <span class="blog-card-meta">${p.date} · ${p.readTime}</span>
          <span class="blog-card-read">Read →</span>
        </div>
      </div>
    </a>
  `).join('');
}

function init() {
  initStats();
  initNewsletter();
  renderTestimonials();
  renderBlog();
}

document.addEventListener('DOMContentLoaded', init);
return { init };
})();
