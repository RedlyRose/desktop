#!/usr/bin/env node
/* Zero-dependency local dev server: static files + /api/nhentai proxy.
 *
 * `npx serve .` only serves static files, so the nHentai reader's gallery
 * fetch has nothing to hit locally — functions/api/nhentai.js only runs on
 * Cloudflare Pages (or under `wrangler pages dev`). This server mirrors
 * that function's logic in plain Node so the reader works locally without
 * any Cloudflare tooling.
 *
 * Usage: node dev-server.js [port]   (defaults to 8080)
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.argv[2]) || 8080;
const ROOT = process.cwd();
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

function proxyGallery(id, res) {
  if (!/^\d+$/.test(id)) {
    res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ error: 'Invalid or missing gallery ID' }));
    return;
  }

  https.get(`https://nhentai.net/api/v2/galleries/${id}`, {
    headers: { 'User-Agent': UA, 'Accept': 'application/json', 'Referer': 'https://nhentai.net/' },
  }, (upstream) => {
    let body = '';
    upstream.on('data', (chunk) => { body += chunk; });
    upstream.on('end', () => {
      res.writeHead(upstream.statusCode || 502, {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(body);
    });
  }).on('error', (err) => {
    res.writeHead(502, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ error: err.message || 'Failed to fetch gallery metadata' }));
  });
}

function serveStatic(urlPath, res) {
  const clean = path.normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, '');
  let filePath = path.join(ROOT, clean);
  if (filePath.endsWith(path.sep)) filePath = path.join(filePath, 'index.html');

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (url.pathname === '/api/nhentai') {
    proxyGallery((url.searchParams.get('id') || '').trim(), res);
    return;
  }
  serveStatic(url.pathname, res);
});

server.listen(PORT, () => {
  console.log(`webOS dev server: http://localhost:${PORT}`);
  console.log(`nHentai gallery proxy live at /api/nhentai — no Cloudflare needed.`);
});
