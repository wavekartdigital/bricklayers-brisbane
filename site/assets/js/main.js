/* Bricklayers Brisbane: site interactions (no dependencies) */
(() => {
  'use strict';
  const SITE = window.SITE || {};
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  document.documentElement.classList.add('js');

  // ── Header: shadow on scroll + mobile menu + dropdown ──────
  const header = $('.site-header');
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const burger = $('.burger');
  const nav = $('#main-nav');
  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger && burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav && nav.classList.contains('open')) { setMenu(false); burger.focus(); } });
  $$('.dd-toggle').forEach((btn) => btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', open);
    btn.nextElementSibling.classList.toggle('open', open);
  }));
  $$('.main-nav a').forEach((a) => a.addEventListener('click', () => nav.classList.contains('open') && setMenu(false)));

  // Placeholder links ([...] values not yet filled in) go to the reviews page instead of nowhere.
  $$('[data-ph-href]').forEach((a) => {
    if (/^\[.*\]$/.test(a.getAttribute('href') || '')) { a.href = '/reviews/'; a.removeAttribute('target'); }
  });

  // ── Reveal on scroll ───────────────────────────────────────
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((el, i) => { el.style.transitionDelay = `${(i % 3) * 70}ms`; io.observe(el); });
  } else reveals.forEach((el) => el.classList.add('in'));

  // ── Before / after sliders ─────────────────────────────────
  $$('.ba').forEach((ba) => {
    const r = $('.ba-range', ba);
    const set = () => ba.style.setProperty('--pos', `${r.value}%`);
    r.addEventListener('input', set);
    set();
  });

  // ── Carousels ──────────────────────────────────────────────
  const initCarousel = (c) => {
    const track = $('.carousel-track', c);
    const step = () => (track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width + 16 : 300);
    const prev = $('[data-prev]', c), next = $('[data-next]', c);
    prev && prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    next && next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); track.scrollBy({ left: step() }); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); track.scrollBy({ left: -step() }); }
    });
  };
  $$('[data-carousel]').forEach(initCarousel);

  // ── Live Google reviews (via /api/reviews.php proxy) ───────
  const escHTML = (s) => String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const starSVG = '<svg class="star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/></svg>';
  const reviewWraps = $$('[data-reviews]');
  if (reviewWraps.length && SITE.reviewsEndpoint && location.protocol !== 'file:') {
    fetch(SITE.reviewsEndpoint, { headers: { Accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        if (!data || !Array.isArray(data.reviews) || !data.reviews.length) return;
        const g = $('.g-logo') ? $('.g-logo').outerHTML : '';
        const card = (rv) => `
          <article class="review-card">
            <header>
              <span class="avatar">${rv.photo ? `<img src="${escHTML(rv.photo)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : escHTML((rv.author || 'G')[0])}</span>
              <div><b>${escHTML(rv.author)}</b><small>${escHTML(rv.date)}</small></div>${g}
            </header>
            <span class="stars" aria-label="${rv.rating} out of 5 stars">${starSVG.repeat(Math.round(rv.rating || 5))}</span>
            <p class="clamp">${escHTML(rv.text)}</p>
          </article>`;
        reviewWraps.forEach((w) => {
          let list = data.reviews;
          const f = w.dataset.filter;
          const kws = f && SITE.serviceKeywords && SITE.serviceKeywords[f];
          if (kws) {
            const matched = list.filter((rv) => kws.some((k) => (rv.text || '').toLowerCase().includes(k)));
            if (matched.length) list = [...matched, ...list.filter((rv) => !matched.includes(rv))];
          }
          $('.carousel-track', w).innerHTML = list.map(card).join('');
        });
        // Update rating summaries everywhere.
        if (data.rating) {
          $$('.rs-score').forEach((el) => { el.textContent = Number(data.rating).toFixed(1); });
          $$('.rb-score').forEach((el) => { el.textContent = `★ ${Number(data.rating).toFixed(1)}`; });
        }
        if (data.count) {
          $$('.rs-count').forEach((el) => { el.textContent = `Based on ${data.count} Google reviews`; });
          $$('.rb-text').forEach((el) => { el.textContent = `from ${data.count} Google reviews`; });
        }
      })
      .catch(() => { /* keep placeholders */ });
  }

  // ── Portfolio filters ──────────────────────────────────────
  const grid = $('#portfolio-grid');
  if (grid) {
    const chips = $$('.filters .chip');
    const status = $('.filter-status');
    const apply = (cat, push) => {
      let n = 0;
      $$('.pcard', grid).forEach((c) => { const show = cat === 'all' || c.dataset.cat === cat; c.hidden = !show; if (show) { n++; c.classList.add('in'); } });
      chips.forEach((ch) => ch.setAttribute('aria-pressed', ch.dataset.filter === cat));
      const label = chips.find((ch) => ch.dataset.filter === cat);
      if (status) status.textContent = `Showing ${n} ${n === 1 ? 'project' : 'projects'}${cat === 'all' ? '' : ` in ${label ? label.firstChild.textContent.trim() : cat}`}`;
      if (push) history.replaceState(null, '', cat === 'all' ? location.pathname : `?cat=${cat}`);
    };
    chips.forEach((ch) => ch.addEventListener('click', () => apply(ch.dataset.filter, true)));
    const initial = new URLSearchParams(location.search).get('cat');
    apply(chips.some((c) => c.dataset.filter === initial) ? initial : 'all', false);
  }

  // ── Case-study lightbox ────────────────────────────────────
  const lb = $('#lightbox');
  const dataEl = $('#projects-data');
  if (lb && dataEl) {
    const projects = JSON.parse(dataEl.textContent);
    let cur = null, idx = 0, opener = null;
    const ph = (s) => escHTML(s).replace(/\[[^\]]+\]/g, (m) => `<span class="ph">${m}</span>`);
    const show = (i) => {
      idx = (i + cur.photos.length) % cur.photos.length;
      const im = $('#lb-img');
      im.src = cur.photos[idx];
      im.alt = `${cur.title}: photo ${idx + 1} of ${cur.photos.length}`;
      $$('#lb-thumbs button').forEach((b, j) => b.setAttribute('aria-current', j === idx));
    };
    const open = (id, from) => {
      cur = projects.find((p) => p.id === id);
      if (!cur) return;
      opener = from;
      $('#lb-cat').textContent = cur.catName;
      $('#lb-title').textContent = cur.title;
      $('#lb-suburb').innerHTML = ph(cur.suburb);
      $('#lb-type').textContent = cur.type;
      $('#lb-duration').innerHTML = ph(cur.duration);
      $('#lb-challenge').textContent = cur.challenge;
      $('#lb-solution').textContent = cur.solution;
      $('#lb-quote').innerHTML = ph(cur.quote);
      $('#lb-quote').hidden = !cur.quote;
      const svc = Object.keys(SITE.serviceCats || {}).find((k) => SITE.serviceCats[k].includes(cur.cat));
      $('#lb-cta').href = `/quote/${svc ? `?service=${svc}` : ''}`;
      $('#lb-thumbs').innerHTML = cur.photos.map((src, j) => `<button type="button" aria-label="Show photo ${j + 1}"><img src="${src}" alt="" loading="lazy"></button>`).join('');
      $$('#lb-thumbs button').forEach((b, j) => b.addEventListener('click', () => show(j)));
      $$('.lb-nav', lb).forEach((b) => { b.hidden = cur.photos.length < 2; });
      show(0);
      lb.showModal();
      document.body.style.overflow = 'hidden';
    };
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-open]');
      if (btn) { e.preventDefault(); open(btn.dataset.open, btn); }
    });
    $('.lb-prev', lb).addEventListener('click', () => show(idx - 1));
    $('.lb-next', lb).addEventListener('click', () => show(idx + 1));
    $('[data-close]', lb).addEventListener('click', () => lb.close());
    lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
    lb.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') show(idx + 1); if (e.key === 'ArrowLeft') show(idx - 1); });
    lb.addEventListener('close', () => { document.body.style.overflow = ''; opener && opener.focus(); });
    // Swipe on touch
    let x0 = null;
    $('.lb-main', lb).addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    $('.lb-main', lb).addEventListener('touchend', (e) => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1)); x0 = null; });
  }

  // ── Spam protection helpers ────────────────────────────────
  const stamp = (form) => { const f = form.querySelector('[name="form_started"]'); if (f && !f.value) f.value = String(Date.now()); };
  let recaptchaLoading = null;
  const getRecaptcha = (action) => {
    if (!SITE.recaptchaSiteKey) return Promise.resolve('');
    if (!recaptchaLoading) {
      recaptchaLoading = new Promise((res) => {
        const s = document.createElement('script');
        s.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(SITE.recaptchaSiteKey)}`;
        s.onload = () => window.grecaptcha.ready(res);
        s.onerror = () => res();
        document.head.appendChild(s);
      });
    }
    return recaptchaLoading.then(() => (window.grecaptcha ? window.grecaptcha.execute(SITE.recaptchaSiteKey, { action }) : ''))
      .catch(() => '');
  };
  const post = async (form, fd, action) => {
    const netlify = form.hasAttribute('data-netlify');
    if (!netlify) fd.set('recaptcha_token', await getRecaptcha(action));
    fd.set('page', location.pathname);
    // Send services as one readable value ("Re-Point Repair, Brick & Block") for Netlify, slugs for PHP.
    const svcs = fd.getAll('services').filter(Boolean);
    fd.delete('services');
    fd.set('services', svcs.map((s) => (netlify ? (SITE.serviceNames || {})[s] || (s === 'other' ? 'Other' : s) : s)).join(', '));
    // Netlify Forms accepts posts to any static path; "/" is the documented default.
    const res = await fetch(netlify ? '/' : (form.dataset.endpoint || SITE.formEndpoint), { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
    let json = {};
    try { json = await res.json(); } catch (e) { /* Netlify replies with HTML */ }
    if (!res.ok || json.ok === false) throw new Error(json.error || 'Something went wrong sending your inquiry.');
    if (window.gtag) window.gtag('event', 'generate_lead', { form: action });
    return json;
  };
  const PHONE_RE = /^(\+?61|0)[2-478](?:[ -]?\d){8}$/;

  // ── Quick quote forms ──────────────────────────────────────
  $$('.quick-form').forEach((form) => {
    form.addEventListener('focusin', () => stamp(form), { once: true });
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const msg = $('.qq-msg', form);
      msg.className = 'qq-msg';
      let bad = null;
      $$('input[required], select[required]', form).forEach((el) => {
        let ok = el.value.trim() !== '';
        if (ok && el.type === 'tel') ok = PHONE_RE.test(el.value.replace(/\s+/g, ' ').trim());
        el.classList.toggle('is-invalid', !ok);
        el.setAttribute('aria-invalid', !ok);
        if (!ok && !bad) bad = el;
      });
      if (bad) { msg.textContent = bad.type === 'tel' && bad.value ? 'Please enter a valid Australian phone number.' : 'Please fill in your name, phone and service.'; msg.classList.add('bad'); bad.focus(); return; }
      const btn = $('button[type="submit"]', form);
      btn.disabled = true; const label = btn.textContent; btn.innerHTML = '<span class="spinner"></span> Sending…';
      try {
        await post(form, new FormData(form), 'quick_quote');
        form.reset();
        msg.textContent = "Thanks! We'll call you back shortly.";
        msg.classList.add('ok');
      } catch (err) {
        msg.textContent = `${err.message} Please call ${SITE.phone}.`;
        msg.classList.add('bad');
      } finally { btn.disabled = false; btn.textContent = label; }
    });
  });

  // ── Multi-step quote form ──────────────────────────────────
  const qf = $('#quote-form');
  if (qf) {
    const steps = $$('.qf-step', qf);
    const bar = $('.qf-bar span', qf);
    const labels = $$('.qf-steps li', qf);
    const count = $('.qf-count b', qf);
    const btnBack = $('[data-back]', qf), btnNext = $('[data-next]', qf), btnSubmit = $('[data-submit]', qf);
    let cur = 0;
    const files = [];

    // Pre-select a service from ?service=slug
    const pre = new URLSearchParams(location.search).get('service');
    if (pre) { const cb = qf.querySelector(`input[name="services"][value="${CSS.escape(pre)}"]`); if (cb) cb.checked = true; }
    qf.addEventListener('focusin', () => stamp(qf), { once: true });

    const setErr = (fieldEl, text) => {
      if (!fieldEl) return;
      fieldEl.classList.toggle('has-error', !!text);
      const e = $('.err', fieldEl);
      if (e) e.textContent = text || '';
      $$('input, select, textarea', fieldEl).forEach((i) => { if (i.type !== 'hidden') i.setAttribute('aria-invalid', !!text); });
    };
    const validateStep = (i) => {
      const step = steps[i];
      let first = null;
      const fail = (fieldEl, text, focusEl) => { setErr(fieldEl, text); if (!first) first = focusEl || fieldEl; };
      // Group of checkboxes
      const svc = $$('input[data-group-required]', step);
      if (svc.length) {
        const f = svc[0].closest('.field');
        if (!svc.some((c) => c.checked)) fail(f, 'Please choose at least one service.', svc[0]); else setErr(f, '');
      }
      // Required radio groups
      const radios = {};
      $$('input[type="radio"][required]', step).forEach((r) => { (radios[r.name] = radios[r.name] || []).push(r); });
      Object.values(radios).forEach((grp) => {
        const f = grp[0].closest('.field');
        if (!grp.some((r) => r.checked)) fail(f, 'Please choose an option.', grp[0]); else setErr(f, '');
      });
      // Text-like inputs
      $$('input:not([type="radio"]):not([type="checkbox"]):not([type="hidden"]):not([type="file"]), select, textarea', step).forEach((el) => {
        if (el.closest('.hp')) return;
        const f = el.closest('.field');
        const v = el.value.trim();
        let msg = '';
        if (el.required && !v) msg = 'This field is required.';
        else if (v && el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = 'Please enter a valid email address.';
        else if (v && el.type === 'tel' && !PHONE_RE.test(v.replace(/\s+/g, ' '))) msg = 'Please enter a valid Australian phone number, e.g. 0412 345 678.';
        else if (v && el.minLength > 0 && v.length < el.minLength) msg = `Please add a little more detail (at least ${el.minLength} characters).`;
        if (f && !f.matches('fieldset')) { if (msg) fail(f, msg, el); else setErr(f, ''); }
        el.classList.toggle('is-invalid', !!msg);
      });
      // Consent
      const consent = $('input[name="privacy_consent"]', step);
      if (consent) { const f = consent.closest('.field'); if (!consent.checked) fail(f, 'Please tick to agree so we can contact you.', consent); else setErr(f, ''); }
      if (first) { (first.focus ? first : $('input,select,textarea', first)).focus({ preventScroll: false }); }
      return !first;
    };
    // Clear errors as people fix things
    qf.addEventListener('change', (e) => { const f = e.target.closest('.field'); if (f && f.classList.contains('has-error')) setErr(f, ''); e.target.classList.remove('is-invalid'); });

    const go = (i) => {
      steps[cur].hidden = true; steps[cur].classList.remove('on');
      cur = i;
      steps[cur].hidden = false; steps[cur].classList.add('on');
      bar.style.width = `${((cur + 1) / steps.length) * 100}%`;
      labels.forEach((l, j) => { l.classList.toggle('on', j === cur); l.classList.toggle('done', j < cur); });
      count.textContent = cur + 1;
      btnBack.hidden = cur === 0;
      btnNext.hidden = cur === steps.length - 1;
      btnSubmit.hidden = cur !== steps.length - 1;
      const top = qf.getBoundingClientRect().top + window.scrollY - (header ? header.offsetHeight : 0) - 16;
      if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' });
      const h = $('h3', steps[cur]); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
      if (cur === 3) initAutocomplete();
    };
    btnNext.addEventListener('click', () => { if (validateStep(cur)) go(cur + 1); });
    btnBack.addEventListener('click', () => go(cur - 1));
    qf.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.type !== 'submit' && cur < steps.length - 1) { e.preventDefault(); btnNext.click(); }
    });

    // Files: drag & drop
    const dz = $('.dropzone', qf), input = $('.dz-picker', qf), list = $('.file-list', qf);
    // Netlify Forms caps a submission at 8MB, so the limit is on the total, not per file.
    const MAX_FILES = SITE.maxFiles || 5, MAX_TOTAL = 8 * 1024 * 1024;
    const fmt = (b) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.ceil(b / 1024)} KB`);
    const render = () => {
      list.innerHTML = '';
      files.forEach((f, i) => {
        const li = document.createElement('li');
        const isImg = f.type.startsWith('image/') && !/heic|heif/i.test(f.type);
        li.innerHTML = `${isImg ? '<img alt="">' : '<span class="fl-ic">PDF</span>'}<span class="fl-name"></span><span class="fl-size">${fmt(f.size)}</span><button type="button" aria-label="Remove ${escHTML(f.name)}"><svg class="ic" viewBox="0 0 24 24"><path d="M6 6l12 12 M18 6L6 18"/></svg></button>`;
        $('.fl-name', li).textContent = f.name;
        if (isImg) { const url = URL.createObjectURL(f); const im = $('img', li); im.src = url; im.onload = () => URL.revokeObjectURL(url); }
        $('button', li).addEventListener('click', () => { files.splice(i, 1); render(); });
        list.appendChild(li);
      });
    };
    const add = (fl) => {
      const errs = [];
      [...fl].forEach((f) => {
        if (files.length >= MAX_FILES) { errs.push(`Max ${MAX_FILES} files.`); return; }
        if (!(f.type.startsWith('image/') || f.type === 'application/pdf' || /\.(pdf|heic|heif)$/i.test(f.name))) { errs.push(`${f.name}: only images or PDFs.`); return; }
        if (files.reduce((t, x) => t + x.size, 0) + f.size > MAX_TOTAL) { errs.push(`${f.name} would take the upload over 8MB in total. Try smaller photos, or email them to us after you submit.`); return; }
        if (!files.some((x) => x.name === f.name && x.size === f.size)) files.push(f);
      });
      setErr(dz.closest('.field'), [...new Set(errs)].join(' '));
      render();
    };
    dz.addEventListener('click', () => input.click());
    dz.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } });
    input.addEventListener('change', () => { add(input.files); input.value = ''; });
    ['dragenter', 'dragover'].forEach((ev) => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.add('drag'); }));
    ['dragleave', 'drop'].forEach((ev) => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.remove('drag'); }));
    dz.addEventListener('drop', (e) => add(e.dataTransfer.files));

    // Google Places address autocomplete (only if a Maps key is configured)
    let acDone = false;
    function initAutocomplete() {
      if (acDone || !SITE.mapsKey) return;
      acDone = true;
      window.__bbPlaces = () => {
        const addr = $('#qf-address'), sub = $('#qf-suburb');
        const ac = new google.maps.places.Autocomplete(addr, { componentRestrictions: { country: 'au' }, fields: ['address_components', 'formatted_address'], types: ['address'] });
        ac.addListener('place_changed', () => {
          const p = ac.getPlace();
          const loc = (p.address_components || []).find((c) => c.types.includes('locality'));
          if (loc) sub.value = loc.long_name;
        });
      };
      const s = document.createElement('script');
      s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(SITE.mapsKey)}&libraries=places&callback=__bbPlaces&loading=async`;
      s.async = true;
      document.head.appendChild(s);
    }

    qf.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateStep(cur)) return;
      const errBox = $('.form-error', qf);
      errBox.hidden = true;
      const fd = new FormData(qf);
      // One file per field: Netlify Forms keeps a single file per input name.
      for (let i = 1; i <= MAX_FILES; i++) fd.delete(`attachment${i}`);
      files.forEach((f, i) => fd.set(`attachment${i + 1}`, f, f.name));
      btnSubmit.disabled = true;
      const label = btnSubmit.innerHTML;
      btnSubmit.innerHTML = '<span class="spinner"></span> Sending…';
      try {
        await post(qf, fd, 'quote');
        qf.classList.add('is-done');
        const done = $('.qf-done', qf);
        done.hidden = false;
        done.focus();
        qf.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (err) {
        errBox.textContent = `${err.message} You can also call us on ${SITE.phone}.`;
        errBox.hidden = false;
      } finally {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = label;
      }
    });
  }

  // Keep the footer year current
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
