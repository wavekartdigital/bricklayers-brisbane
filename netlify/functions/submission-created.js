// Runs automatically on every verified (non-spam) Netlify Forms submission.
// Sends the customer a confirmation email for the full quote form.
// The business notification is Netlify's built-in form email (set in the Netlify UI).
//
// Needs these environment variables in Netlify (Site configuration → Environment variables):
//   RESEND_API_KEY   API key from https://resend.com (free tier is enough)
//   FROM_EMAIL       e.g. "Bricklayers Brisbane <quotes@bricklayersbrisbane.com.au>" (domain verified in Resend)
//   BUSINESS_EMAIL   where customer replies should go, e.g. info@bricklayersbrisbane.com.au
//   BUSINESS_PHONE   optional, defaults to 0431 138 393
//   REVIEWS_URL      optional Google reviews link
// Without RESEND_API_KEY this does nothing, and submissions still arrive as normal.

const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const LABELS = [
  ['services', 'Services'], ['project_type', 'Project type'], ['property_type', 'Property type'],
  ['description', 'Description'], ['size_length', 'Length (m)'], ['size_height', 'Height (m)'], ['size_area', 'Area (m²)'],
  ['material', 'Material'], ['existing_structure', 'Existing structure'], ['site_access', 'Site access'],
  ['start_date', 'Preferred start'], ['budget', 'Budget'], ['approval', 'Approval'],
  ['name', 'Name'], ['phone', 'Phone'], ['email', 'Email'], ['address', 'Address'], ['suburb', 'Suburb'],
  ['contact_method', 'Contact via'], ['best_time', 'Best time'],
];

exports.handler = async (event) => {
  const { payload } = JSON.parse(event.body || '{}');
  const d = (payload && payload.data) || {};
  const { RESEND_API_KEY, FROM_EMAIL, BUSINESS_EMAIL } = process.env;
  const phone = process.env.BUSINESS_PHONE || '0431 138 393';

  if (!RESEND_API_KEY || !FROM_EMAIL || payload.form_name !== 'quote' || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email || '')) {
    return { statusCode: 200, body: 'skipped' };
  }

  const rows = LABELS.filter(([k]) => d[k]).map(([k, label]) =>
    `<tr><th align="left" style="background:#f3ece1;border:1px solid #e5dccd;width:160px;vertical-align:top;padding:8px">${label}</th><td style="border:1px solid #e5dccd;padding:8px">${esc(d[k]).replace(/\n/g, '<br>')}</td></tr>`).join('');
  const first = esc(String(d.name || '').split(' ')[0]);
  const html = `<div style="font:15px Arial,sans-serif;color:#1d2024;max-width:640px">
    <h2 style="color:#b4472c">Thanks ${first}, we've got your inquiry!</h2>
    <p><b>We'll be in touch within 24 hours</b> to talk through your project and book a free site visit.</p>
    <p>Need us sooner? Call <a href="tel:${phone.replace(/\s+/g, '')}">${esc(phone)}</a>.</p>
    <h3>Your request</h3>
    <table cellspacing="0" style="border-collapse:collapse;font:14px Arial,sans-serif;width:100%">${rows}</table>
    ${process.env.REVIEWS_URL ? `<p style="margin-top:20px">See what our customers say: <a href="${esc(process.env.REVIEWS_URL)}">our Google reviews</a></p>` : ''}
    <p style="color:#5b6168;margin-top:24px">Bricklayers Brisbane · Licensed &amp; insured bricklayers · Brisbane</p>
  </div>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [d.email],
      reply_to: BUSINESS_EMAIL || undefined,
      subject: "We've received your quote request: Bricklayers Brisbane",
      html,
    }),
  });
  if (!res.ok) console.error('Confirmation email failed', res.status, await res.text());
  return { statusCode: 200, body: 'ok' };
};
