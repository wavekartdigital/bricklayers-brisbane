// Static site generator: `node build.js` writes every page into ./site
const fs = require('fs');
const path = require('path');
const { site, heroSlides, services, categories, projects, whyUs, process: steps, faqs, areas, img } = require('./src/data');
const C = require('./src/components');
const { esc, t, icon, stars, gLogo, tel, phoneLink, ratingBadge, picture, projectCard, projectsJSON, lightbox,
  reviewSummary, reviewsCarousel, faqList, sectionHead, quoteForm, quickForm, layout, faqSchema, crumbSchema, catName } = C;

const OUT = path.join(__dirname, 'site');
const pages = [];
const write = (route, html) => {
  const file = path.join(OUT, route, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  pages.push(route);
};

const crumbs = (list) => `
  <nav class="crumbs" aria-label="Breadcrumb"><ol>
    ${list.map(([n, h], i) => (i < list.length - 1 ? `<li><a href="${h}">${n}</a></li>` : `<li aria-current="page">${n}</li>`)).join('')}
  </ol></nav>`;

const pageHero = ({ title, sub, image, crumb, extra = '', aside = '' }) => `
  <section class="page-hero${aside ? ' with-aside' : ''}">
    <div class="ph-bg">${picture(image, '', { eager: true })}</div>
    <div class="wrap ph-grid">
      <div class="ph-copy">
        ${crumbs(crumb)}
        <h1>${title}</h1>
        ${sub ? `<p class="lead">${sub}</p>` : ''}
        ${extra}
      </div>
      ${aside}
    </div>
  </section>`;

const trustItems = [
  ['shield', 'QBCC Licensed', site.qbcc],
  ['check', 'Fully insured', 'Public liability cover'],
  ['bricks', `${site.projects} projects`, 'Completed across SEQ'],
  ['award', `${site.years} years`, 'Family-owned experience'],
  ['clipboard', 'Free quotes', 'No obligation site visit'],
];
const trustBar = () => `
  <section class="trust-bar" aria-label="Why customers trust us">
    <div class="wrap"><ul>
      ${trustItems.map(([ic, a, b]) => `<li>${icon(ic)}<div><b>${t(a)}</b><span>${t(b)}</span></div></li>`).join('')}
    </ul></div>
  </section>`;

const serviceCards = () => `
  <div class="svc-grid">
    ${services.map((s) => `
      <a class="svc-tile reveal" href="/services/${s.slug}/">
        <div class="svc-img">${picture(s.hero, s.name)}<span class="svc-ic">${icon(s.icon)}</span></div>
        <div class="svc-body"><h3>${esc(s.name)}</h3><p>${esc(s.short)}</p><span class="link-btn">Learn more ${icon('arrow')}</span></div>
      </a>`).join('')}
  </div>`;

const whySection = () => `
  <section class="section why">
    <div class="wrap why-grid">
      <div class="why-media reveal">
        ${picture(25, 'Block retaining wall with glass balustrade by Bricklayers Brisbane', { cls: 'why-a' })}
        ${picture(113, 'Rendered entrance fence with piers', { cls: 'why-b' })}
        <div class="why-badge"><b>${site.years}</b><span>years laying bricks in Brisbane</span></div>
      </div>
      <div>
        ${sectionHead('Why choose us', 'Built properly. Built to last.', 'We\'re a family-owned business, and we treat every wall like it has our name on it, because it does.', false)}
        <ul class="why-list">
          ${whyUs.map(([ic, h, p]) => `<li class="reveal">${icon(ic)}<div><h3>${h}</h3><p>${p}</p></div></li>`).join('')}
        </ul>
      </div>
    </div>
  </section>`;

const processSection = () => `
  <section class="section process-sec">
    <div class="wrap">
      ${sectionHead('How it works', 'Four simple steps from idea to finished wall')}
      <ol class="process">
        ${steps.map(([ic, h, p], i) => `<li class="reveal"><span class="p-ic">${icon(ic)}<b>${i + 1}</b></span><h3>${h}</h3><p>${p}</p></li>`).join('')}
      </ol>
    </div>
  </section>`;

const reviewsSection = (filter, title = 'What our customers say') => `
  <section class="section reviews-sec">
    <div class="wrap">
      ${sectionHead('Google reviews', title)}
      <div class="reviews-grid">
        ${reviewSummary()}
        ${reviewsCarousel(filter)}
      </div>
    </div>
  </section>`;

const mapEmbed = `<iframe class="map" title="Map of our Brisbane service area" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Brisbane+QLD&z=9&output=embed"></iframe>`;
const areasSection = () => `
  <section class="section areas-sec">
    <div class="wrap areas-grid">
      <div>
        ${sectionHead('Service areas', 'Bricklayers across Brisbane &amp; surrounds', 'Based in Victoria Point, we work across Greater Brisbane and South East Queensland. Don\'t see your suburb? Ask us.', false)}
        <div class="areas">
          ${areas.map(([r, list]) => `<div class="area reveal"><h3>${icon('pin')} ${r}</h3><p>${list.join(' · ')}</p></div>`).join('')}
        </div>
      </div>
      <div class="map-wrap reveal">${mapEmbed}</div>
    </div>
  </section>`;

const divider = '<div class="brick-divider" aria-hidden="true"></div>';

// ── Home ──────────────────────────────────────────────────────
const featured = projects.filter((p) => p.featured);
write('/', layout({
  path: '/',
  title: 'Bricklayer Brisbane | Retaining Walls, Brick & Block | Bricklayers Brisbane',
  desc: `Family-owned Brisbane bricklayers with ${site.years} years' experience. Retaining walls, feature walls, brick repointing, pavers and new builds. QBCC licensed & insured. Free quotes.`,
  schema: [faqSchema(faqs)],
  body: `
  <section class="hero">
    <div class="hero-bg">${picture(31, 'Rendered poolside feature wall built by Bricklayers Brisbane', { eager: true })}</div>
    <div class="wrap hero-inner">
      <div class="hero-copy">
        <div class="hero-slides" data-hero-slides aria-roledescription="carousel" aria-label="What we do">
          ${heroSlides.map((s, i) => `
          <div class="hero-slide${i ? '' : ' is-active'}" data-slide aria-roledescription="slide" aria-label="${i + 1} of ${heroSlides.length}"${i ? ' aria-hidden="true"' : ''}>
            <span class="eyebrow light">${s.eyebrow}</span>
            ${i ? `<p class="h1">${s.title}</p>` : `<h1>${s.title}</h1>`}
            <p class="lead">${s.text}${s.slug ? ` <a class="hero-more" href="/services/${s.slug}/"${i ? ' tabindex="-1"' : ''}>${s.link} ${icon('arrow')}</a>` : ''}</p>
          </div>`).join('')}
          <div class="hero-dots" role="group" aria-label="Choose a headline">
            ${heroSlides.map((s, i) => `<button type="button" data-dot="${i}" aria-label="${s.eyebrow}"${i ? '' : ' aria-current="true"'}></button>`).join('')}
          </div>
        </div>
        <div class="btn-row">
          <a class="btn btn-cta btn-lg" href="/quote/">Get a Free Quote ${icon('arrow')}</a>
          <a class="btn btn-light btn-lg" href="/portfolio/">View Our Work</a>
        </div>
        ${ratingBadge('hero-rating')}
      </div>
    </div>
  </section>
  ${trustBar()}

  <section class="section">
    <div class="wrap">
      ${sectionHead('Our services', 'Brick, block &amp; masonry. Done right.', 'From a single repaired wall to a whole development, we do it with the same care.')}
      ${serviceCards()}
    </div>
  </section>
  ${divider}

  <section class="section sand">
    <div class="wrap">
      ${sectionHead('Featured projects', 'Recent work around Brisbane', 'Drag the sliders to compare before and after. Tap any project for the full story.')}
      <div class="masonry">${featured.map(projectCard).join('')}</div>
      <p class="center mt"><a class="btn btn-dark" href="/portfolio/">See the full portfolio ${icon('arrow')}</a></p>
    </div>
  </section>

  ${whySection()}
  ${divider}
  ${processSection()}
  ${reviewsSection()}
  ${areasSection()}

  <section class="section sand">
    <div class="wrap narrow">
      ${sectionHead('FAQ', 'Common questions')}
      ${faqList(faqs)}
    </div>
  </section>
  ${projectsJSON(featured)}
  ${lightbox}`,
}));

// ── Services overview ─────────────────────────────────────────
write('/services/', layout({
  path: '/services/',
  title: 'Bricklaying Services Brisbane | Bricklayers Brisbane',
  desc: 'Retaining & feature walls, brick repointing, pavers, wall removal, brick & block and new home bricklaying across Brisbane. Free quotes.',
  schema: [crumbSchema([['Home', '/'], ['Services', '/services/']])],
  body: `
  ${pageHero({ title: 'Our Bricklaying Services', sub: 'Six specialist services, one experienced local team. Whatever you\'re building or fixing, we\'ll do it properly.', image: 24, crumb: [['Home', '/'], ['Services', '/services/']] })}
  ${trustBar()}
  <section class="section">
    <div class="wrap svc-rows">
      ${services.map((s, i) => `
        <article class="svc-row reveal${i % 2 ? ' flip' : ''}">
          <div class="svc-row-img">${picture(s.hero, s.name)}</div>
          <div class="svc-row-body">
            <span class="svc-ic inline">${icon(s.icon)}</span>
            <h2>${esc(s.name)}</h2>
            <p>${esc(s.intro)}</p>
            <ul class="checks">${s.includes.slice(0, 4).map((x) => `<li>${icon('check')}${esc(x)}</li>`).join('')}</ul>
            <div class="btn-row">
              <a class="btn btn-dark" href="/services/${s.slug}/">Learn more</a>
              <a class="btn btn-ghost" href="/quote/?service=${s.slug}">Get a quote ${icon('arrow')}</a>
            </div>
          </div>
        </article>`).join('')}
    </div>
  </section>
  ${processSection()}`,
}));

// ── Individual service pages ──────────────────────────────────
for (const s of services) {
  const list = projects.filter((p) => s.cats.includes(p.cat));
  const route = `/services/${s.slug}/`;
  const cr = [['Home', '/'], ['Services', '/services/'], [s.name, route]];
  write(route, layout({
    path: route,
    title: s.metaTitle,
    desc: s.metaDesc,
    ogImage: s.hero,
    schema: [
      { '@context': 'https://schema.org', '@type': 'Service', name: s.name, serviceType: s.name, description: s.metaDesc, areaServed: 'Brisbane, QLD', provider: { '@id': `${site.url}/#business` }, url: site.url + route },
      faqSchema(s.faqs),
      crumbSchema(cr),
    ],
    body: `
    ${pageHero({
      title: esc(s.headline), sub: esc(s.intro), image: s.hero, crumb: cr,
      extra: `<div class="btn-row"><a class="btn btn-cta btn-lg" href="#inquiry">Get a Free Quote ${icon('arrow')}</a>${phoneLink('btn btn-light btn-lg')}</div>${ratingBadge('hero-rating')}`,
      aside: `<aside class="hero-card"><h2>Quick quote</h2><p>Leave your details and we'll call you back today.</p>${quickForm('svc')}</aside>`,
    })}
    ${trustBar()}
    <section class="section">
      <div class="wrap split">
        <div class="reveal">
          ${sectionHead('What\'s included', `Our ${esc(s.name.toLowerCase())} service`, '', false)}
          <ul class="checks big">${s.includes.map((x) => `<li>${icon('check')}${esc(x)}</li>`).join('')}</ul>
        </div>
        <div class="split-img reveal">${picture(s.hero === list[0]?.cover && list[1] ? list[1].cover : (list[0]?.cover ?? s.hero), s.name)}</div>
      </div>
    </section>
    <section class="section sand">
      <div class="wrap">
        ${sectionHead('Problems we solve', 'Common issues, fixed properly')}
        <div class="problem-grid">
          ${s.problems.map(([h, p]) => `<div class="problem reveal">${icon('check')}<h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join('')}
        </div>
      </div>
    </section>
    ${list.length ? `
    <section class="section">
      <div class="wrap">
        ${sectionHead('Project gallery', `Recent ${esc(s.name.toLowerCase())} work`)}
        <div class="masonry">${list.map(projectCard).join('')}</div>
        <p class="center mt"><a class="btn btn-dark" href="/portfolio/?cat=${s.cats[0]}">More ${esc(catName(s.cats[0]).toLowerCase())} projects ${icon('arrow')}</a></p>
      </div>
    </section>` : ''}
    ${reviewsSection(s.slug, 'What customers say about this service')}
    <section class="section sand">
      <div class="wrap narrow">
        ${sectionHead('FAQ', `${esc(s.name)}: your questions answered`)}
        ${faqList(s.faqs)}
      </div>
    </section>
    <section class="section" id="inquiry">
      <div class="wrap narrow">
        ${sectionHead('Free quote', `Get a quote for ${esc(s.name.toLowerCase())}`, 'Takes about 2 minutes. We reply within 24 hours.')}
        <div class="form-card">${quoteForm(s.slug)}</div>
      </div>
    </section>
    ${projectsJSON(list)}
    ${lightbox}`,
  }));
}

// ── Portfolio ─────────────────────────────────────────────────
write('/portfolio/', layout({
  path: '/portfolio/',
  title: 'Our Work | Bricklaying Projects Brisbane | Bricklayers Brisbane',
  desc: 'See our retaining walls, feature walls, repointing, paving and new home bricklaying projects across Brisbane. Before & after photos and case studies.',
  schema: [crumbSchema([['Home', '/'], ['Our Work', '/portfolio/']])],
  body: `
  ${pageHero({ title: 'Our Work', sub: 'A selection of recent brick, block and masonry projects across Brisbane and South East Queensland.', image: 116, crumb: [['Home', '/'], ['Our Work', '/portfolio/']] })}
  <section class="section">
    <div class="wrap">
      <div class="filters" role="toolbar" aria-label="Filter projects by service">
        ${categories.map(([k, n]) => {
          const count = k === 'all' ? projects.length : projects.filter((p) => p.cat === k).length;
          return `<button class="chip" data-filter="${k}" aria-pressed="${k === 'all'}">${n} <span>${count}</span></button>`;
        }).join('')}
      </div>
      <p class="filter-status" aria-live="polite"></p>
      <div class="masonry" id="portfolio-grid">${projects.map(projectCard).join('')}</div>
    </div>
  </section>
  ${projectsJSON(projects)}
  ${lightbox}`,
}));

// ── About ─────────────────────────────────────────────────────
write('/about/', layout({
  path: '/about/',
  title: 'About Us | Family-Owned Brisbane Bricklayers | Bricklayers Brisbane',
  desc: `Bricklayers Brisbane is a family-owned business with ${site.years} years' experience in brick, block and masonry across Brisbane, Redlands, Logan, Ipswich and Moreton Bay.`,
  schema: [crumbSchema([['Home', '/'], ['About', '/about/']])],
  body: `
  ${pageHero({ title: 'About Bricklayers Brisbane', sub: `A family-owned business with ${site.years} years of experience, and a reputation built one wall at a time.`, image: 113, crumb: [['Home', '/'], ['About', '/about/']] })}
  <section class="section">
    <div class="wrap split">
      <div class="reveal prose">
        ${sectionHead('Our story', 'Local, family-owned, and proud of our work', '', false)}
        <p>Bricklayers Brisbane Pty Ltd is a family-owned business with over ${site.years.replace('+', '')} years of experience in bricklaying and masonry. We work on residential, commercial and industrial projects, from small repairs to complete new builds.</p>
        <p>Our team of qualified tradespeople takes pride in top-quality workmanship, on-time completion and clear communication. We leave every job site clean and tidy, and we treat your property like our own.</p>
        <p class="ph-note">${t('[Add your story here: who founded the business, when, and what you love about the trade. A team photo works well beside this section.]')}</p>
      </div>
      <div class="split-img reveal">${picture(116, 'Rendered block entry wall built by Bricklayers Brisbane')}</div>
    </div>
  </section>
  <section class="stats brick-bg">
    <div class="wrap"><ul>
      <li><b>${site.years}</b><span>Years experience</span></li>
      <li><b>${t(site.projects)}</b><span>Projects completed</span></li>
      <li><b>★ ${t(site.rating)}</b><span>Google rating</span></li>
      <li><b>100%</b><span>Licensed &amp; insured</span></li>
    </ul></div>
  </section>
  ${whySection()}
  <section class="section sand">
    <div class="wrap">
      ${sectionHead('Licensed & insured', 'Peace of mind on every job')}
      <div class="cred-grid">
        <div class="cred reveal">${icon('shield')}<h3>QBCC Licensed</h3><p>Licence no. ${t(site.qbcc)}</p></div>
        <div class="cred reveal">${icon('check')}<h3>Fully insured</h3><p>Public liability insurance on every job.</p></div>
        <div class="cred reveal">${icon('award')}<h3>Workmanship guarantee</h3><p>${t('[Guarantee terms, e.g. 6-year workmanship warranty]')}</p></div>
        <div class="cred reveal">${icon('clipboard')}<h3>ABN</h3><p>${t(site.abn)}</p></div>
      </div>
    </div>
  </section>
  ${areasSection()}`,
}));

// ── Reviews ───────────────────────────────────────────────────
write('/reviews/', layout({
  path: '/reviews/',
  title: 'Customer Reviews | Bricklayers Brisbane',
  desc: 'Read Google reviews from Bricklayers Brisbane customers, and leave your own.',
  schema: [crumbSchema([['Home', '/'], ['Reviews', '/reviews/']])],
  body: `
  ${pageHero({ title: 'Customer Reviews', sub: 'Our best advertising is a happy customer. Here\'s what people say about working with us.', image: 122, crumb: [['Home', '/'], ['Reviews', '/reviews/']], extra: ratingBadge('hero-rating') })}
  <section class="section">
    <div class="wrap reviews-page">
      ${reviewSummary()}
      <div class="reviews-wrap review-wall" data-reviews data-layout="grid">
        <div class="carousel-track grid">${require('./src/data').reviews.map(C.reviewCard).join('')}</div>
      </div>
    </div>
  </section>
  <section class="section sand">
    <div class="wrap narrow center">
      ${sectionHead('Worked with us?', 'We\'d love your feedback', 'Reviews help other Brisbane homeowners find a bricklayer they can trust. It only takes a minute.')}
      <a class="btn btn-cta btn-lg" href="${esc(site.googleReviewUrl)}" data-ph-href target="_blank" rel="noopener">${gLogo} Leave us a Google review</a>
    </div>
  </section>`,
}));

// ── Quote ─────────────────────────────────────────────────────
write('/quote/', layout({
  path: '/quote/',
  title: 'Get a Free Quote | Bricklayers Brisbane',
  desc: 'Request a free bricklaying quote in Brisbane. Tell us about your retaining wall, repointing, paving or brick & block project. We reply within 24 hours.',
  schema: [crumbSchema([['Home', '/'], ['Get a Free Quote', '/quote/']])],
  noCta: true,
  body: `
  <section class="quote-page">
    <div class="wrap quote-grid">
      <div class="quote-main">
        ${crumbs([['Home', '/'], ['Get a Free Quote', '/quote/']])}
        <h1>Get a Free Quote</h1>
        <p class="lead">Four quick steps, about 2 minutes. The more you tell us, the more accurate your quote.</p>
        <div class="form-card">${quoteForm()}</div>
      </div>
      <aside class="quote-side">
        <div class="side-card">
          <h2>What happens next?</h2>
          <ol class="mini-steps">
            <li><b>We review your inquiry</b> and any photos or plans.</li>
            <li><b>We call you within 24 hours</b> to talk it through.</li>
            <li><b>Free site visit</b> to measure and inspect.</li>
            <li><b>Clear written quote</b> with no hidden extras.</li>
          </ol>
        </div>
        <div class="side-card dark">
          <h2>Rather talk now?</h2>
          ${phoneLink('btn btn-cta btn-block')}
          <p class="small">${site.hours[0][0]}: ${t(site.hours[0][1])}</p>
        </div>
        ${ratingBadge()}
        <ul class="side-trust">
          <li>${icon('shield')} QBCC licensed ${t(site.qbcc)}</li>
          <li>${icon('check')} Fully insured</li>
          <li>${icon('award')} ${site.years} years' experience</li>
        </ul>
      </aside>
    </div>
  </section>`,
}));

// ── Contact ───────────────────────────────────────────────────
write('/contact/', layout({
  path: '/contact/',
  title: 'Contact Us | Bricklayers Brisbane',
  desc: `Call ${site.phone} or email ${site.email}. Bricklayers Brisbane, Victoria Point QLD, servicing all of Brisbane.`,
  schema: [crumbSchema([['Home', '/'], ['Contact', '/contact/']])],
  body: `
  ${pageHero({ title: 'Contact Us', sub: 'Questions, quotes or urgent make-safe work: we\'re here to help.', image: 101, crumb: [['Home', '/'], ['Contact', '/contact/']] })}
  <section class="section">
    <div class="wrap contact-grid">
      <a class="contact-card reveal" href="${tel}">${icon('phone')}<h2>Call</h2><p>${site.phone}</p></a>
      <div class="contact-card reveal">${icon('mail')}<h2>Email</h2><p>${site.emails.map((e) => `<a href="mailto:${e}">${e}</a>`).join('<br>')}</p></div>
      <a class="contact-card reveal" href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener">${icon('whatsapp')}<h2>WhatsApp / SMS</h2><p>Send photos of your job</p></a>
      <div class="contact-card reveal">${icon('clock')}<h2>Hours</h2><p>${site.hours.map(([d, h]) => `${d}: ${t(h)}`).join('<br>')}</p></div>
    </div>
    <div class="wrap split mt">
      <div class="reveal">
        <h2>Request a call back</h2>
        <p>Leave your name and number and we'll call you. For a detailed quote, use our <a href="/quote/">full quote form</a>.</p>
        ${quickForm('contact')}
        <p class="addr">${icon('pin')} ${site.street}, ${site.suburb} ${site.state} ${site.postcode}</p>
      </div>
      <div class="map-wrap reveal"><iframe class="map" title="Bricklayers Brisbane location" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${encodeURIComponent(`${site.street}, ${site.suburb} QLD ${site.postcode}`)}&z=13&output=embed"></iframe></div>
    </div>
  </section>`,
}));

// ── Privacy & 404 ─────────────────────────────────────────────
write('/privacy/', layout({
  path: '/privacy/',
  title: 'Privacy Policy | Bricklayers Brisbane',
  desc: 'How Bricklayers Brisbane collects, uses and protects your personal information.',
  body: `
  <section class="section"><div class="wrap narrow prose">
    ${crumbs([['Home', '/'], ['Privacy Policy', '/privacy/']])}
    <h1>Privacy Policy</h1>
    <p class="ph-note">${t('[Template only. Have this reviewed to make sure it fits your business before launch.]')}</p>
    <p>${site.legalName} ("we", "us") respects your privacy and handles personal information in line with the Australian Privacy Principles.</p>
    <h2>What we collect</h2><p>When you contact us or request a quote we collect your name, phone number, email, property address, project details and any photos or plans you upload.</p>
    <h2>How we use it</h2><p>We use your information only to respond to your inquiry, prepare quotes, carry out work and keep records. We don't sell or share your details with third parties for marketing.</p>
    <h2>Storage & security</h2><p>Information is stored securely and kept only as long as needed for business and legal purposes.</p>
    <h2>Analytics & cookies</h2><p>We may use Google Analytics to understand how visitors use our site. This uses cookies and collects anonymous usage data.</p>
    <h2>Access & contact</h2><p>To access or correct your information, contact us on <a href="${tel}">${site.phone}</a> or <a href="mailto:${site.email}">${site.email}</a>.</p>
  </div></section>`,
}));

fs.writeFileSync(path.join(OUT, '404.html'), layout({
  path: '/404', title: 'Page not found | Bricklayers Brisbane', desc: 'Page not found.',
  body: `<section class="section"><div class="wrap narrow center"><h1>That page has gone missing</h1><p class="lead">Like a brick out of a wall. Let's get you back on track.</p><div class="btn-row center"><a class="btn btn-dark" href="/">Home</a><a class="btn btn-cta" href="/quote/">Get a Free Quote</a></div></div></section>`,
}));

// ── Sitemap & robots ──────────────────────────────────────────
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${site.url}${p}</loc><lastmod>${today}</lastmod><priority>${p === '/' ? '1.0' : p.split('/').length > 3 ? '0.8' : '0.7'}</priority></url>`).join('\n')}
</urlset>
`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${site.url}/sitemap.xml\n`);

// Logo + favicon files
fs.mkdirSync(path.join(OUT, 'assets/img'), { recursive: true });
const mark = C.logoMark.replace('class="logo-mark" ', 'xmlns="http://www.w3.org/2000/svg" ');
fs.writeFileSync(path.join(OUT, 'assets/img/favicon.svg'), mark);
fs.writeFileSync(path.join(OUT, 'assets/img/logo.svg'), mark);

console.log(`Built ${pages.length + 1} pages → site/`);
