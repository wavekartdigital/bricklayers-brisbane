# Bricklayers Brisbane website

Static, fast, SEO-friendly site with a PHP form handler. No framework and no npm packages.

```
src/data.js        ← ALL content: business details, services, projects, FAQs, suburbs
src/components.js  ← shared markup (header, footer, forms, cards, schema)
build.js           ← generates every page into site/
site/              ← upload this folder to the web host
  assets/css/styles.css, assets/js/main.js   (hand-written, not generated)
  api/quote.php    ← form handler: emails business + customer, spam checks
  api/reviews.php  ← Google reviews proxy (Places API), cached
  api/config.php   ← server secrets (emails, API keys). Not in git: copy config.example.php
serve.js           ← local preview server (fakes the PHP API)
```

## Edit & preview
1. Edit `src/data.js` → run `node build.js`
2. Run `node serve.js` → http://localhost:5173 (forms run in demo mode locally and send no email)

## Fill in placeholders
Anything in `[square brackets]` shows with an amber highlight on the page. Replace these in `src/data.js`:
- `qbcc`: leave blank to hide the licence number everywhere
- `projects`, `rating`, `reviewCount`, `hours`
- `googleProfile`, `googleReviewUrl`, `instagram`
- Each project's `suburb`, `duration`, `quote`, plus the draft challenge/solution copy
- About page: your story and guarantee terms
- Before/after sliders currently use **sample pairs** (same job type, not the same view). Add true before/after photo indexes to `ba` and set `baSample: false`.

Once `rating` and `reviewCount` are real numbers, `aggregateRating` is added to the LocalBusiness schema automatically.

## Hosting on Netlify (current setup)
`netlify.toml` builds the pages and publishes `site/`. `formProvider: 'netlify'` in `src/data.js` makes both forms use **Netlify Forms** (`quote` and `callback`).
- **Turn on form detection:** Netlify → Site → Forms → *Enable form detection*, then redeploy.
- **Business email for each inquiry:** Site configuration → Notifications → Emails and webhooks → *Form submission notifications* → add an email notification for each form, `quote` and `callback`. Uploaded photos/plans appear as links.
- **Customer confirmation email:** `netlify/functions/submission-created.js` sends it through [Resend](https://resend.com). Set `RESEND_API_KEY`, `FROM_EMAIL` (on a domain verified in Resend) and `BUSINESS_EMAIL` under Site configuration → Environment variables. Without the key, no confirmation is sent; inquiries still arrive.
- **Spam:** Netlify's spam filter + the honeypot field. Spam goes to the Forms → *Spam* tab.
- **Uploads:** up to 5 files, 8MB total (Netlify's limit).
- **Not on Netlify:** `api/*.php` (blocked). Google reviews stay as sample cards until a reviews feed is added.

To move to a PHP host instead, set `formProvider: 'php'` and rebuild.

## Go-live checklist (PHP host)
- **Hosting:** any PHP 8+ host (the current WordPress host works). Upload `site/` to the web root.
- **Email:** set `api/config.php` → `business_email`, `from_email` (must be on your domain with SPF/DKIM set up). For best deliverability, swap `mail()` for SMTP (PHPMailer or your host's SMTP).
- **Leads backup:** every submission is also logged to `api/storage/leads.csv` (blocked from the web).
- **Google reviews:** create a Places API key (server, restricted), find your Place ID, then set `places_api_key` + `place_id` in `api/config.php`. The carousel then swaps the sample cards for live reviews automatically.
- **Address autocomplete:** set `mapsKey` in `src/data.js` (browser key, HTTP-referrer restricted, Places API).
- **reCAPTCHA v3 (optional):** `recaptchaSiteKey` in data.js + `recaptcha_secret` in config.php. The honeypot, time-trap and rate limit are always on.
- **Analytics / Search Console:** set `gaId` and `searchConsole` in data.js and rebuild. Submit `/sitemap.xml` in Search Console.
- **Images:** photos are self-hosted in `site/wp-content/uploads/`, at the same URLs as the old WordPress site. For Core Web Vitals, convert to WebP at ~1600/800/400px and add `srcset`.
- **Redirects:** add 301s from the old URLs (`/our-services/...`, `/our-work/`, `/about-us/`, `/contact-us/`, `/get-a-quote/`, the old `.php` pages) to the new ones so you keep existing rankings.
- **Privacy policy:** the template at `/privacy/` needs reviewing.

## Hosting on a DigitalOcean droplet
DigitalOcean blocks outbound SMTP, so form email goes through [Resend](https://resend.com): verify the domain there, then set `resend_api_key` in `api/config.php` on the server.

`deploy/setup.sh` installs or updates the site on Ubuntu 24.04 with nginx and PHP-FPM. It builds with `formProvider: 'php'` on the server only, and keeps `api/config.php` and `api/storage/` across updates. As root on the server:

```
curl -fsSL https://raw.githubusercontent.com/wavekartdigital/bricklayers-brisbane/main/deploy/setup.sh | bash
```
