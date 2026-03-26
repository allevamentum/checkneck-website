const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const port = process.env.PORT || 8090;
const dir = path.dirname(__filename);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico':  'image/x-icon',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.woff':  'font/woff',
};

const compressible = new Set(['.html', '.css', '.js', '.svg', '.json']);

http.createServer((req, res) => {
  let file = req.url.split('?')[0];
  if (file === '/') file = '/index.html';

  const fp = path.join(dir, file);
  const ext = path.extname(fp);

  // Prevent path traversal
  if (!fp.startsWith(dir)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(fp, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }

    const contentType = mimeTypes[ext] || 'application/octet-stream';
    const headers = {
      'Content-Type': contentType,
      'X-Content-Type-Options': 'nosniff',
    };

    // Cache static assets (images, fonts) for 1 year; HTML/CSS/JS for 1 hour
    if (['.png', '.jpg', '.jpeg', '.woff2', '.woff', '.ico'].includes(ext)) {
      headers['Cache-Control'] = 'public, max-age=31536000, immutable';
    } else {
      headers['Cache-Control'] = 'public, max-age=3600';
    }

    // Gzip compressible content
    const acceptEncoding = req.headers['accept-encoding'] || '';
    if (compressible.has(ext) && acceptEncoding.includes('gzip')) {
      zlib.gzip(data, (gzErr, compressed) => {
        if (gzErr) {
          res.writeHead(200, headers);
          res.end(data);
        } else {
          headers['Content-Encoding'] = 'gzip';
          headers['Vary'] = 'Accept-Encoding';
          res.writeHead(200, headers);
          res.end(compressed);
        }
      });
    } else {
      res.writeHead(200, headers);
      res.end(data);
    }
  });
}).listen(port, '0.0.0.0', () => {
  console.log(`CheckNeck website running on port ${port}`);
});
