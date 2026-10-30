// Shared markup: layout, header, footer, cards, forms, icons.
const { site, services, categories, projects, reviews, img } = require('./data');

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Escape, then highlight [placeholders] so they're obvious on the page.
const t = (s = '') => esc(s).replace(/\[[^\]]+\]/g, (m) => `<span class="ph">${m}</span>`);
const isPh = (s = '') => /^\[.*\]$/.test(String(s).trim());
const plain = (s = '') => String(s).replace(/[\[\]]/g, '');
const catName = (c) => (categories.find(([k]) => k === c) || [c, c])[1];
const svcBySlug = (slug) => services.find((s) => s.slug === slug);

// ── Icons (24px line icons) ───────────────────────────────────
const P = {
  wall: 'M3 5h18v14H3z M3 9.7h18 M3 14.3h18 M9 5v4.7 M15 5v4.7 M6 9.7v4.6 M12 9.7v4.6 M18 9.7v4.6 M9 14.3V19 M15 14.3V19',
  trowel: 'M13 4l7 7-7.5 1.5L11.5 11.5z M11.5 12.5L4 20 M6.5 17.5l-2-2',
  pavers: 'M3 3h8v8H3z M13 3h8v8h-8z M3 13h8v8H3z M13 13h8v8h-8z',
  shield: 'M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z M8.5 12l2.5 2.5 4.5-5',
  bricks: 'M2 14h9v6H2z M13 14h9v6h-9z M7 7h10v6H7z',
  house: 'M3 11l9-7 9 7 M5 9.5V20h14V9.5 M10 20v-6h4v6',
  award: 'M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M8.5 13.5L7 21l5-3 5 3-1.5-7.5',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3 2',
  broom: 'M20 4l-7.5 7.5 M10 10l4 4 M10 10c-3.5.5-5.5 4-6.5 9.5 2-.3 2.2-1.6 3.2-2.1.2 1.5.5 2.2.5 2.6 4.3-1 6.5-3.6 6.8-6',
  dollar: 'M12 2v20 M17 6.5C16.2 5 14.3 4 12 4 9.2 4 7 5.5 7 7.75S9 11 12 12s5 1.5 5 4-2.2 4-5 4c-2.5 0-4.4-1-5.2-2.7',
  pin: 'M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  mail: 'M3 5h18v14H3z M3 6l9 7 9-7',
  clipboard: 'M9 3.5h6v3H9z M7.5 5H5v16h14V5h-2.5 M8.5 13l2.5 2.5 4.5-5',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
  arrow: 'M5 12h14 M13 6l6 6-6 6',
  chevron: 'M6 9l6 6 6-6',
  left: 'M15 5l-7 7 7 7',
  right: 'M9 5l7 7-7 7',
  upload: 'M12 16V4 M7 9l5-5 5 5 M4 16v4h16v-4',
  sms: 'M4 4h16v12H9l-5 4z M8 9h8 M8 12h5',
  whatsapp: 'M20 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-4.2A8.5 8.5 0 1 1 20 11.5z M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 .8c-1-.5-2-1.5-2.5-2.5l.8-1-1-2z',
  facebook: 'M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v7h4v-7h3l1-4h-4V8z',
  instagram: 'M4 4h16v16H4z M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M17 7h.01',
  menu: 'M4 7h16 M4 12h16 M4 17h16',
  close: 'M6 6l12 12 M18 6L6 18',
  plus: 'M12 5v14 M5 12h14',
  file: 'M6 3h8l4 4v14H6z M14 3v4h4',
  quote: 'M7 7h4v5H8c0 2 1 3 3 3v2c-3.5 0-5-2-5-5V7z M14 7h4v5h-3c0 2 1 3 3 3v2c-3.5 0-5-2-5-5V7z',
  ruler: 'M3 16L16 3l5 5L8 21z M7 12l2 2 M10 9l2 2 M13 6l2 2',
};
const icon = (name, cls = '') =>
  `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${P[name]}"/></svg>`;
const star = '<svg class="star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/></svg>';
const stars = (n = 5) => `<span class="stars" aria-label="${n} out of 5 stars">${star.repeat(n)}</span>`;
const gLogo = '<svg class="g-logo" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>';

const logoMark = '<svg class="logo-mark" viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="9" fill="#B4472C"/><g fill="#FBF8F3"><rect x="6" y="9" width="13" height="6" rx="1.2"/><rect x="21" y="9" width="13" height="6" rx="1.2"/><rect x="6" y="17" width="5.5" height="6" rx="1.2"/><rect x="13.5" y="17" width="13" height="6" rx="1.2"/><rect x="28.5" y="17" width="5.5" height="6" rx="1.2"/><rect x="6" y="25" width="13" height="6" rx="1.2"/><rect x="21" y="25" width="13" height="6" rx="1.2" fill="#F5A623"/></g></svg>';
const logo = (light = false) =>
  `<a class="logo${light ? ' logo-light' : ''}" href="/" aria-label="${site.name} home">${logoMark}<span class="logo-text"><b>BRICKLAYERS</b><small>BRISBANE</small></span></a>`;

const tel = `tel:${site.phoneIntl}`;
const phoneLink = (cls = '') => `<a class="${cls}" href="${tel}">${icon('phone')}<span>${site.phone}</span></a>`;
const ratingBadge = (cls = '') => `
  <a class="rating-badge ${cls}" href="${isPh(site.googleProfile) ? '/reviews/' : site.googleProfile}">
    ${gLogo}<span class="rb-score">★ ${t(site.rating)}</span><span class="rb-text">from ${t(site.reviewCount)} Google reviews</span>
  </a>`;

// ── Images ────────────────────────────────────────────────────
const picture = (i, alt, { eager = false, cls = '', sizes = '' } = {}) =>
  `<img class="${cls}" src="${img(i)}" alt="${esc(alt)}" width="1600" height="1204" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"${sizes ? ` sizes="${sizes}"` : ''}>`;

const baSlider = (p) => `
  <div class="ba" style="--pos:50%">
    ${picture(p.ba[1], `${p.title}: after`, { cls: 'ba-img' })}
    <div class="ba-before">${picture(p.ba[0], `${p.title}: before`, { cls: 'ba-img' })}</div>
    <span class="ba-tag ba-tag-b">Before</span><span class="ba-tag ba-tag-a">After</span>
    <span class="ba-handle" aria-hidden="true"><span>${icon('left')}${icon('right')}</span></span>
    <input class="ba-range" type="range" min="0" max="100" value="50" aria-label="Drag to compare before and after: ${esc(p.title)}">
    ${p.baSample ? '<span class="ba-sample">Sample pair</span>' : ''}
  </div>`;

const projectCard = (p, i = 0) => `
  <article class="pcard reveal${i % 5 === 0 ? ' pcard-tall' : ''}" data-cat="${p.cat}" data-id="${p.id}">
    <div class="pcard-media">${p.ba ? baSlider(p) : `<button class="pcard-open" data-open="${p.id}" aria-label="Open case study: ${esc(p.title)}">${picture(p.cover, p.title)}</button>`}</div>
    <div class="pcard-body">
      <span class="tag">${catName(p.cat)}</span>
      <h3>${esc(p.title)}</h3>
      <p class="pcard-meta">${icon('pin')} ${t(p.suburb)} · ${esc(p.type)}</p>
      <button class="link-btn" data-open="${p.id}">View case study ${icon('arrow')}</button>
    </div>
  </article>`;

const projectsJSON = (list) =>
  `<script type="application/json" id="projects-data">${JSON.stringify(
    list.map((p) => ({ ...p, catName: catName(p.cat), photos: p.photos.map(img) }))
  ).replace(/</g, '\\u003c')}</script>`;

const lightbox = `
  <dialog class="lightbox" id="lightbox" aria-labelledby="lb-title">
    <div class="lb-inner">
      <button class="lb-close" data-close aria-label="Close">${icon('close')}</button>
      <div class="lb-gallery">
        <div class="lb-main"><img alt="" id="lb-img"><button class="lb-nav lb-prev" aria-label="Previous photo">${icon('left')}</button><button class="lb-nav lb-next" aria-label="Next photo">${icon('right')}</button></div>
        <div class="lb-thumbs" id="lb-thumbs"></div>
      </div>
      <div class="lb-info">
        <span class="tag" id="lb-cat"></span>
        <h2 id="lb-title"></h2>
        <dl class="lb-facts"><div><dt>Suburb</dt><dd id="lb-suburb"></dd></div><div><dt>Project</dt><dd id="lb-type"></dd></div><div><dt>Duration</dt><dd id="lb-duration"></dd></div></dl>
        <h3>The challenge</h3><p id="lb-challenge"></p>
        <h3>Our solution</h3><p id="lb-solution"></p>
        <blockquote id="lb-quote"></blockquote>
        <a class="btn btn-cta" id="lb-cta" href="/quote/">Get a quote for a similar project</a>
      </div>
    </div>
  </dialog>`;

const reviewCard = (r) => `
  <article class="review-card" data-service="${r.service || ''}">
    <header>
      <span class="avatar" aria-hidden="true">${esc((plain(r.author)[0] || 'G').toUpperCase())}</span>
      <div><b>${t(r.author)}</b><small>${t(r.date)}</small></div>
      ${gLogo}
    </header>
    ${stars(r.rating)}
    <p class="clamp">${t(r.text)}</p>
  </article>`;

const reviewSummary = () => `
  <div class="review-summary">
    ${gLogo}
    <p class="rs-score">${t(site.rating)}</p>
    ${stars(5)}
    <p class="rs-count">Based on ${t(site.reviewCount)} Google reviews</p>
    <a class="btn btn-outline" href="${esc(site.googleProfile)}" data-ph-href rel="noopener" target="_blank">See all reviews on Google</a>
    <a class="btn btn-cta" href="${esc(site.googleReviewUrl)}" data-ph-href rel="noopener" target="_blank">Leave us a review</a>
  </div>`;

const reviewsCarousel = (filter) => `
  <div class="reviews-wrap" data-reviews${filter ? ` data-filter="${filter}"` : ''}>
    <div class="carousel" data-carousel>
      <div class="carousel-track" tabindex="0" aria-label="Google reviews">
        ${reviews.map(reviewCard).join('')}
      </div>
      <div class="carousel-ctrl">
        <button class="icon-btn" data-prev aria-label="Previous reviews">${icon('left')}</button>
        <button class="icon-btn" data-next aria-label="Next reviews">${icon('right')}</button>
      </div>
    </div>
  </div>`;

const faqList = (items) => `
  <div class="faq">
    ${items.map(([q, a]) => `<details class="reveal"><summary><span>${esc(q)}</span>${icon('plus')}</summary><div class="faq-a"><p>${t(a)}</p></div></details>`).join('')}
  </div>`;

const sectionHead = (eyebrow, title, sub = '', center = true) => `
  <div class="sec-head${center ? ' center' : ''} reveal">
    ${eyebrow ? `<span class="eyebrow">${eyebrow}</span>` : ''}
    <h2>${title}</h2>
    ${sub ? `<p>${sub}</p>` : ''}
  </div>`;

// ── Forms ─────────────────────────────────────────────────────
const pills = (name, opts, { required = false, type = 'radio', checked } = {}) => `
  <div class="pills" role="${type === 'radio' ? 'radiogroup' : 'group'}">
    ${opts.map((o) => `<label class="pill"><input type="${type}" name="${name}" value="${esc(o)}"${required ? ' required' : ''}${checked === o ? ' checked' : ''}><span>${esc(o)}</span></label>`).join('')}
  </div>`;

const field = (label, input, { hint = '', req = false, id = '' } = {}) => `
  <div class="field">
    <label${id ? ` for="${id}"` : ''}>${label}${req ? ' <em aria-hidden="true">*</em>' : ' <small>(optional)</small>'}</label>
    ${input}
    ${hint ? `<p class="hint">${hint}</p>` : ''}
    <p class="err" aria-live="polite"></p>
  </div>`;

const group = (legend, inner, { req = false } = {}) => `
  <fieldset class="field">
    <legend>${legend}${req ? ' <em aria-hidden="true">*</em>' : ' <small>(optional)</small>'}</legend>
    ${inner}
    <p class="err" aria-live="polite"></p>
  </fieldset>`;

const spamFields = `
  <div class="hp" aria-hidden="true"><label>Leave this field empty<input type="text" name="company_website" tabindex="-1" autocomplete="off"></label></div>
  <input type="hidden" name="form_started" value="">
  <input type="hidden" name="recaptcha_token" value="">
  <input type="hidden" name="page" value="">`;

// Netlify Forms only stores fields that exist in the deployed HTML, so every
// field the JS sends (incl. attachment1..N) must be in the markup.
const MAX_FILES = 5;
const formAttrs = (name) => (site.formProvider === 'netlify'
  ? `name="${name}" method="POST" data-netlify="true" netlify-honeypot="company_website"`
  : `data-endpoint="${site.formEndpoint}"`);
const formName = (name) => (site.formProvider === 'netlify' ? `<input type="hidden" name="form-name" value="${name}">` : '');

const allSuburbs = () => require('./data').areas.flatMap(([, s]) => s).sort();

const quoteForm = (preselect = '') => `
  <form class="quote-form" id="quote-form" novalidate ${formAttrs('quote')} enctype="multipart/form-data">
    ${formName('quote')}
    <div class="qf-progress" aria-hidden="true">
      <div class="qf-bar"><span></span></div>
      <ol class="qf-steps"><li class="on">Your Project</li><li>Details</li><li>Timing &amp; Budget</li><li>Your Details</li></ol>
    </div>
    <p class="qf-count" aria-live="polite">Step <b>1</b> of 4</p>

    <section class="qf-step on" data-step="1" aria-label="Step 1: Your project">
      <h3>What can we help you with?</h3>
      ${group('Service required: select all that apply', `
        <div class="svc-cards">
          ${services.map((s) => `<label class="svc-card"><input type="checkbox" name="services" value="${s.slug}"${s.slug === preselect ? ' checked' : ''} data-group-required>${icon(s.icon)}<span>${esc(s.name)}</span></label>`).join('')}
          <label class="svc-card"><input type="checkbox" name="services" value="other" data-group-required>${icon('plus')}<span>Other</span></label>
        </div>`, { req: true })}
      ${group('Project type', pills('project_type', ['Residential', 'Commercial', 'New Build', 'Renovation', 'Repair'], { required: true }), { req: true })}
      ${group('Property type', pills('property_type', ['House', 'Townhouse', 'Unit', 'Commercial', 'Vacant Land'], { required: true }), { req: true })}
    </section>

    <section class="qf-step" data-step="2" aria-label="Step 2: Project details" hidden>
      <h3>Tell us about the job</h3>
      ${field('Brief project description', '<textarea id="qf-desc" name="description" rows="4" required minlength="10" placeholder="e.g. 15m block retaining wall along the back fence, about 1.2m high, yard slopes down to the house."></textarea>', { req: true, id: 'qf-desc' })}
      ${group('Approximate size', `
        <div class="size-grid">
          <label><span>Length (m)</span><input type="number" name="size_length" min="0" step="0.1" inputmode="decimal" placeholder="e.g. 12"></label>
          <label><span>Height (m)</span><input type="number" name="size_height" min="0" step="0.1" inputmode="decimal" placeholder="e.g. 1.2"></label>
          <label><span>Area (m²)</span><input type="number" name="size_area" min="0" step="0.5" inputmode="decimal" placeholder="e.g. 30"></label>
        </div>
        <p class="hint">A rough guess is fine. We measure properly at the site visit.</p>`)}
      ${group('Material preference', pills('material', ['Brick', 'Block', 'Stone', 'Pavers', 'Not sure']))}
      <div class="two-col">
        ${group('Existing structure needing repair?', pills('existing_structure', ['Yes', 'No']))}
        ${group('Site access', pills('site_access', ['Easy', 'Limited', 'Not sure']))}
      </div>
      ${group('Photos or plans', `
        <div class="dropzone" tabindex="0" role="button" aria-label="Upload photos or plans: drag and drop or press to browse">
          ${icon('upload')}
          <p><b>Drag &amp; drop</b> photos or plans here, or <u>browse</u></p>
          <small>JPG, PNG, HEIC or PDF · up to ${MAX_FILES} files · 8MB total</small>
          <input type="file" class="dz-picker" multiple accept="image/*,.pdf,application/pdf" hidden>
        </div>
        ${Array.from({ length: MAX_FILES }, (_, i) => `<input type="file" name="attachment${i + 1}" hidden tabindex="-1" aria-hidden="true">`).join('')}
        <ul class="file-list" aria-live="polite"></ul>`)}
    </section>

    <section class="qf-step" data-step="3" aria-label="Step 3: Timing and budget" hidden>
      <h3>Timing &amp; budget</h3>
      ${group('Preferred start date', pills('start_date', ['ASAP', 'Within 1 month', '1–3 months', 'Just planning'], { required: true }), { req: true })}
      ${field('Estimated budget range', `<select id="qf-budget" name="budget" required><option value="">Select a range…</option>${['Under $5k', '$5k – $15k', '$15k – $50k', '$50k+', 'Not sure'].map((b) => `<option>${b}</option>`).join('')}</select>`, { req: true, id: 'qf-budget', hint: 'This helps us recommend the right materials and approach. It\'s not a commitment.' })}
      ${group('Council / engineering approval?', pills('approval', ['Yes', 'No', 'Not required', 'Not sure']))}
    </section>

    <section class="qf-step" data-step="4" aria-label="Step 4: Your details" hidden>
      <h3>Where should we send your quote?</h3>
      <div class="two-col">
        ${field('Full name', '<input id="qf-name" name="name" type="text" autocomplete="name" required>', { req: true, id: 'qf-name' })}
        ${field('Phone', '<input id="qf-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required pattern="^(\\+?61|0)[2-478](?:[ -]?\\d){8}$" placeholder="04xx xxx xxx">', { req: true, id: 'qf-phone' })}
      </div>
      ${field('Email', '<input id="qf-email" name="email" type="email" autocomplete="email" required>', { req: true, id: 'qf-email' })}
      <div class="two-col">
        ${field('Property address', '<input id="qf-address" name="address" type="text" autocomplete="street-address" placeholder="Start typing your address">', { id: 'qf-address' })}
        ${field('Suburb', `<input id="qf-suburb" name="suburb" type="text" list="suburb-list" autocomplete="address-level2" required><datalist id="suburb-list">${allSuburbs().map((s) => `<option value="${s}">`).join('')}</datalist>`, { req: true, id: 'qf-suburb' })}
      </div>
      ${group('Preferred contact method', pills('contact_method', ['Phone', 'Email', 'SMS'], { checked: 'Phone' }))}
      <div class="two-col">
        ${field('Best time to contact', `<select id="qf-time" name="best_time">${['Anytime', 'Morning (7–10am)', 'Midday (10am–2pm)', 'Afternoon (2–5pm)', 'Evening (5–7pm)'].map((o) => `<option>${o}</option>`).join('')}</select>`, { id: 'qf-time' })}
        ${field('How did you hear about us?', `<select id="qf-heard" name="heard_about"><option value="">Select…</option>${['Google', 'Facebook', 'Referral / word of mouth', 'Signage / saw our work', 'Other'].map((o) => `<option>${o}</option>`).join('')}</select>`, { id: 'qf-heard' })}
      </div>
      <div class="field consent">
        <label class="check"><input type="checkbox" name="privacy_consent" value="yes" required><span>I agree to ${site.name} storing my details to respond to this inquiry, as described in the <a href="/privacy/" target="_blank">Privacy Policy</a>. <em aria-hidden="true">*</em></span></label>
        <p class="err" aria-live="polite"></p>
      </div>
      ${spamFields}
      <p class="form-error" role="alert" hidden></p>
    </section>

    <div class="qf-nav">
      <button type="button" class="btn btn-ghost" data-back hidden>${icon('left')} Back</button>
      <button type="button" class="btn btn-cta" data-next>Next ${icon('arrow')}</button>
      <button type="submit" class="btn btn-cta" data-submit hidden>Send my inquiry ${icon('arrow')}</button>
    </div>
    <p class="qf-secure">${icon('shield')} Your details are never shared. Free, no-obligation quote.</p>

    <div class="qf-done" hidden tabindex="-1">
      <span class="done-ic">${icon('check')}</span>
      <h3>Thanks, your inquiry is in!</h3>
      <p><b>We'll be in touch within 24 hours.</b> We've emailed you a copy of your request.</p>
      <p>Need us sooner? Call <a href="${tel}">${site.phone}</a></p>
      <a class="btn btn-outline" href="/reviews/">${gLogo} Read our Google reviews</a>
    </div>
  </form>`;

const quickForm = (idp = 'qq', dark = false) => `
  <form class="quick-form${dark ? ' on-dark' : ''}" ${formAttrs('callback')} novalidate>
    ${formName('callback')}
    <input type="hidden" name="form_type" value="quick">
    <label class="sr-only" for="${idp}-name">Name</label>
    <input id="${idp}-name" name="name" type="text" autocomplete="name" placeholder="Your name" required>
    <label class="sr-only" for="${idp}-phone">Phone</label>
    <input id="${idp}-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="Phone number" required pattern="^(\\+?61|0)[2-478](?:[ -]?\\d){8}$">
    <label class="sr-only" for="${idp}-svc">Service</label>
    <select id="${idp}-svc" name="services" required>
      <option value="">Service needed…</option>
      ${services.map((s) => `<option value="${s.slug}">${esc(s.name)}</option>`).join('')}
      <option value="other">Other</option>
    </select>
    <input type="hidden" name="privacy_consent" value="implied-callback">
    ${spamFields}
    <button class="btn btn-cta" type="submit">Call me back</button>
    <p class="qq-msg" role="status"></p>
  </form>`;

// ── Header / footer ───────────────────────────────────────────
const nav = [
  ['/', 'Home'],
  ['/services/', 'Services', true],
  ['/portfolio/', 'Our Work'],
  ['/about/', 'About'],
  ['/reviews/', 'Reviews'],
  ['/contact/', 'Contact'],
];

const header = (path) => `
  <a class="skip" href="#main">Skip to content</a>
  <div class="topbar">
    <div class="wrap tb">
      <p class="tb-area">${icon('pin')}<span>${site.suburb} ${site.state} · Servicing Brisbane &amp; South East Queensland</span></p>
      <ul class="tb-contact">
        <li><a href="${tel}">${icon('phone')}<span>${site.phone}</span></a></li>
        ${site.emails.map((e, i) => `<li class="tb-email${i ? ' tb-extra' : ''}"><a href="mailto:${e}" aria-label="Email ${e}">${icon('mail')}<span>${e}</span></a></li>`).join('')}
      </ul>
      <div class="tb-social">
        <a href="${site.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${icon('facebook')}</a>
        ${site.instagram ? `<a href="${site.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${icon('instagram')}</a>` : ''}
        <a href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">${icon('whatsapp')}</a>
        <a href="${esc(site.googleProfile)}" data-ph-href target="_blank" rel="noopener" aria-label="Google reviews">${gLogo}</a>
      </div>
    </div>
  </div>
  <header class="site-header" id="top">
    <div class="wrap hdr">
      ${logo()}
      <nav class="main-nav" id="main-nav" aria-label="Main">
        <ul>
          ${nav.map(([href, label, dd]) => {
            const active = href === '/' ? path === '/' : path.startsWith(href);
            if (!dd) return `<li><a href="${href}"${active ? ' aria-current="page"' : ''}>${label}</a></li>`;
            return `<li class="has-dd"><a href="${href}"${active ? ' aria-current="page"' : ''}>${label}</a><button class="dd-toggle" aria-expanded="false" aria-label="Show services">${icon('chevron')}</button>
              <ul class="dd">${services.map((s) => `<li><a href="/services/${s.slug}/">${icon(s.icon)}${esc(s.name)}</a></li>`).join('')}</ul></li>`;
          }).join('')}
        </ul>
        <div class="nav-mobile-cta">
          ${phoneLink('btn btn-outline')}
          <a class="btn btn-cta" href="/quote/">Get a Free Quote</a>
        </div>
      </nav>
      <div class="hdr-actions">
        ${phoneLink('hdr-phone')}
        <a class="btn btn-cta hdr-cta" href="/quote/">Get a Free Quote</a>
        <button class="burger" aria-controls="main-nav" aria-expanded="false" aria-label="Open menu">${icon('menu')}${icon('close')}</button>
      </div>
    </div>
  </header>`;

const ctaBand = () => `
  <section class="cta-band brick-bg" aria-labelledby="cta-title">
    <div class="wrap cta-grid">
      <div class="reveal">
        <span class="eyebrow light">Free quotes · No obligation</span>
        <h2 id="cta-title">Ready to start your project?</h2>
        <p>Tell us what you need and we'll get back to you within 24 hours with next steps and a free site visit.</p>
        <div class="btn-row">
          <a class="btn btn-cta btn-lg" href="/quote/">Get a Free Quote ${icon('arrow')}</a>
          ${phoneLink('btn btn-light btn-lg')}
        </div>
      </div>
      <div class="cta-quick reveal">
        <h3>Prefer a quick call back?</h3>
        <p>Leave your number and we'll call you.</p>
        ${quickForm('cta', true)}
      </div>
    </div>
  </section>`;

const footer = () => `
  <footer class="site-footer">
    <div class="mortar-line" aria-hidden="true"></div>
    <div class="wrap ftr">
      <div class="ftr-brand">
        ${logo(true)}
        <p>Family-owned bricklayers with ${site.years} years' experience. Quality brick, block and masonry across Brisbane and South East Queensland.</p>
        ${ratingBadge('on-dark')}
        <div class="social">
          <a href="${site.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${icon('facebook')}</a>
          ${site.instagram ? `<a href="${site.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${icon('instagram')}</a>` : ''}
          <a href="${esc(site.googleProfile)}" data-ph-href target="_blank" rel="noopener" aria-label="Google Business Profile">${gLogo}</a>
        </div>
      </div>
      <div>
        <h3>Quick links</h3>
        <ul>${[...nav, ['/quote/', 'Get a Free Quote'], ['/privacy/', 'Privacy Policy']].map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join('')}</ul>
      </div>
      <div>
        <h3>Services</h3>
        <ul>${services.map((s) => `<li><a href="/services/${s.slug}/">${esc(s.name)}</a></li>`).join('')}</ul>
      </div>
      <div>
        <h3>Contact</h3>
        <ul class="ftr-contact">
          <li>${icon('phone')}<a href="${tel}">${site.phone}</a></li>
          ${site.emails.map((e) => `<li>${icon('mail')}<a href="mailto:${e}">${e}</a></li>`).join('')}
          <li>${icon('pin')}<span>${site.street}, ${site.suburb} ${site.state} ${site.postcode}</span></li>
          <li>${icon('clock')}<span>${site.hours.map(([d, h]) => `${d}: ${t(h)}`).join('<br>')}</span></li>
        </ul>
      </div>
    </div>
    <div class="wrap ftr-legal">
      <p>© <span data-year>${new Date().getFullYear()}</span> ${site.legalName} · ABN ${t(site.abn)}${isPh(site.qbcc) ? '' : ` · QBCC Licence ${esc(site.qbcc)}`}</p>
      <p>Licensed &amp; fully insured · Servicing Brisbane, Redlands, Logan, Ipswich &amp; Moreton Bay</p>
      <p class="credit">Designed by <span class="credit-name">Wavekart Digital</span></p>
    </div>
  </footer>

  <a class="wa-float" href="https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hi Bricklayers Brisbane, I'd like a quote for…")}" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">${icon('whatsapp')}<span>Chat on WhatsApp</span></a>

  <nav class="mobile-bar" aria-label="Quick contact">
    <a href="${tel}">${icon('phone')}<span>Call</span></a>
    <a href="sms:${site.phoneIntl}">${icon('sms')}<span>SMS</span></a>
    <a href="https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hi Bricklayers Brisbane, I'd like a quote for…")}" target="_blank" rel="noopener">${icon('whatsapp')}<span>WhatsApp</span></a>
    <a class="mb-cta" href="/quote/">${icon('clipboard')}<span>Free Quote</span></a>
  </nav>`;

// ── Schema / head ─────────────────────────────────────────────
const localBusiness = () => {
  const s = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${site.url}/#business`,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    telephone: site.phoneIntl,
    email: site.email,
    image: img(31),
    logo: `${site.url}/assets/img/logo.svg`,
    priceRange: '$$',
    address: { '@type': 'PostalAddress', streetAddress: site.street, addressLocality: site.suburb, addressRegion: site.state, postalCode: site.postcode, addressCountry: 'AU' },
    areaServed: ['Brisbane', 'Redland City', 'Logan City', 'Ipswich', 'Moreton Bay'].map((n) => ({ '@type': 'City', name: n })),
    sameAs: [site.facebook, site.instagram, isPh(site.googleProfile) ? '' : site.googleProfile].filter(Boolean),
    hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Bricklaying services', itemListElement: services.map((sv) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: sv.name, url: `${site.url}/services/${sv.slug}/` } })) },
  };
  // Added automatically once real numbers replace the placeholders in data.js.
  if (!isPh(site.rating) && !isPh(site.reviewCount)) {
    s.aggregateRating = { '@type': 'AggregateRating', ratingValue: site.rating, reviewCount: site.reviewCount, bestRating: '5' };
  }
  return s;
};

const faqSchema = (items) => ({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: plain(a) } })),
});
const crumbSchema = (crumbs) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: crumbs.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: site.url + path })),
});
const jsonld = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;

const clientConfig = () => ({
  phone: site.phone, phoneIntl: site.phoneIntl, formProvider: site.formProvider, formEndpoint: site.formEndpoint, maxFiles: MAX_FILES, reviewsEndpoint: site.reviewsEndpoint,
  mapsKey: site.mapsKey, recaptchaSiteKey: site.recaptchaSiteKey,
  serviceNames: Object.fromEntries(services.map((s) => [s.slug, s.name])),
  serviceCats: Object.fromEntries(services.map((s) => [s.slug, s.cats])),
  serviceKeywords: {
    'retaining-feature-walls': ['retaining', 'feature', 'entrance', 'fence', 'wall'],
    're-pointing': ['repoint', 're-point', 'mortar', 'pointing'],
    'existing-work-pavers': ['paver', 'paving', 'step', 'stairs', 'path'],
    'wall-removal-repair': ['remov', 'insurance', 'safe', 'crack', 'damage'],
    'brick-block': ['brick', 'block'],
    'homes-developments': ['home', 'house', 'build', 'develop', 'townhouse'],
  },
});

const layout = ({ path, title, desc, body, schema = [], ogImage = 31, noCta = false, extraHead = '' }) => `<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${site.url}${path}">
<meta name="theme-color" content="#22262B">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${site.name}">
<meta property="og:locale" content="en_AU">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${site.url}${path}">
<meta property="og:image" content="${img(ogImage)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="geo.region" content="AU-QLD"><meta name="geo.placename" content="Brisbane">
${site.searchConsole ? `<meta name="google-site-verification" content="${esc(site.searchConsole)}">` : '<!-- Google Search Console: set site.searchConsole in src/data.js -->'}
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://bricklayersbrisbane.com.au">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800;900&family=Inter:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="/assets/css/styles.css">
${extraHead}
${[localBusiness(), ...schema].map(jsonld).join('\n')}
<script>window.SITE=${JSON.stringify(clientConfig())};</script>
${site.gaId ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${site.gaId}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${site.gaId}');</script>` : '<!-- Google Analytics 4: set site.gaId in src/data.js -->'}
<script src="/assets/js/main.js" defer></script>
</head>
<body>
${header(path)}
<main id="main">
${body}
</main>
${noCta ? '' : ctaBand()}
${footer()}
</body>
</html>
`;

module.exports = {
  esc, t, isPh, plain, icon, stars, gLogo, logoMark, tel, phoneLink, ratingBadge, picture, baSlider,
  projectCard, projectsJSON, lightbox, reviewCard, reviewSummary, reviewsCarousel, faqList, sectionHead,
  quoteForm, quickForm, layout, faqSchema, crumbSchema, catName, svcBySlug,
};
