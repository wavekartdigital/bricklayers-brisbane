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
- `qbcc`, `abn` (a directory lists ABN 22 687 173 128; verify it at abr.business.gov.au)
- `projects`, `rating`, `reviewCount`, `hours`
- `googleProfile`, `googleReviewUrl`, `instagram`
- Each project's `suburb`, `duration`, `quote`, plus the draft challenge/solution copy
- About page: your story and guarantee terms
- Before/after sliders currently use **sample pairs** (same job type, not the same view). Add true before/after photo indexes to `ba` and set `baSample: false`.

Once `rating` and `reviewCount` are real numbers, `aggregateRating` is added to the LocalBusiness schema automatically.

## Go-live checklist
- **Hosting:** any PHP 8+ host (the current WordPress host works). Upload `site/` to the web root.
- **Email:** set `api/config.php` → `business_email`, `from_email` (must be on your domain with SPF/DKIM set up). For best deliverability, swap `mail()` for SMTP (PHPMailer or your host's SMTP).
- **Leads backup:** every submission is also logged to `api/storage/leads.csv` (blocked from the web).
- **Google reviews:** create a Places API key (server, restricted), find your Place ID, then set `places_api_key` + `place_id` in `api/config.php`. The carousel then swaps the sample cards for live reviews automatically.
- **Address autocomplete:** set `mapsKey` in `src/data.js` (browser key, HTTP-referrer restricted, Places API).
- **reCAPTCHA v3 (optional):** `recaptchaSiteKey` in data.js + `recaptcha_secret` in config.php. The honeypot, time-trap and rate limit are always on.
- **Analytics / Search Console:** set `gaId` and `searchConsole` in data.js and rebuild. Submit `/sitemap.xml` in Search Console.
- **Images:** photos are currently hot-linked from the existing WordPress uploads (full-size JPGs). For Core Web Vitals, download them, convert to WebP at ~1600/800/400px, add `srcset`, and self-host under `site/assets/img/`.
- **Redirects:** add 301s from the old URLs (`/our-services/...`, `/our-work/`, `/about-us/`, `/contact-us/`, `/get-a-quote/`, the old `.php` pages) to the new ones so you keep existing rankings.
- **Privacy policy:** the template at `/privacy/` needs reviewing.
