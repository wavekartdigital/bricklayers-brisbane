// Tiny static server for local preview: `node serve.js` → http://localhost:5173
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, 'site');
const port = process.env.PORT || 5173;
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.xml': 'application/xml', '.txt': 'text/plain',
  '.ico': 'image/x-icon'
};

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  // PHP isn't available locally: fake the API so forms can be tested end to end.
  // Same for Netlify Forms, which posts to "/".
  if (req.method === 'POST' && (p === '/api/quote.php' || p === '/' || p === '/index.html')) {
    let body = '';
    req.on('data', (c) => { body += c.toString('latin1'); });
    req.on('end', () => {
      const fields = [...body.matchAll(/name="([^"]+)"(?:; filename="([^"]*)")?\r\n(?:Content-Type: [^\r]+\r\n)?\r\n([^\r]*)/g)]
        .filter((m) => m[2] || m[3]).map((m) => (m[2] ? `${m[1]}=[file ${m[2]}]` : `${m[1]}=${m[3].slice(0, 40)}`));
      console.log(`[form] POST ${p} (${body.length} bytes): demo mode, no email sent\n  ${fields.join('\n  ')}`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, demo: true }));
    });
    return;
  }
  if (p === '/api/reviews.php') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ rating: null, count: null, reviews: [] }));
  }
  if (p.endsWith('/')) p += 'index.html';
  let file = path.join(root, p);
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  if (!path.extname(file) && fs.existsSync(file + '.html')) file += '.html';
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      return res.end(fs.existsSync(path.join(root, '404.html')) ? fs.readFileSync(path.join(root, '404.html')) : 'Not found');
    }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(port, () => console.log(`Preview: http://localhost:${port}`));
