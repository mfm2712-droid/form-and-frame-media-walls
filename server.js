/**
 * Lightweight production starter for Form & Frame.
 * Stores leads locally by default; sends notification email when Resend is configured.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Dependency-free .env support for local development. Production hosts normally inject env vars.
const envFile = path.join(__dirname, '.env');
if (fs.existsSync(envFile)) for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
  const match = line.match(/^\s*([^#=\s]+)=(.*)\s*$/);
  if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
}

const root = __dirname;
const dataDir = path.join(root, 'data');
const port = Number(process.env.PORT || 3000);
const recipient = process.env.NOTIFICATION_EMAIL;
const resendKey = process.env.RESEND_API_KEY;
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

function readJson(name) { try { return JSON.parse(fs.readFileSync(path.join(dataDir, name), 'utf8')); } catch { return []; } }
function writeJson(name, value) { fs.writeFileSync(path.join(dataDir, name), JSON.stringify(value, null, 2)); }
function body(req) {
  return new Promise((resolve, reject) => {
    let raw = ''; const limit = 250_000;
    req.on('data', chunk => { raw += chunk; if (raw.length > limit) { req.destroy(); reject(new Error('Request payload is too large')); } });
    req.on('end', () => { try { resolve(JSON.parse(raw || '{}')); } catch { reject(new Error('Invalid JSON')); } });
    req.on('error', reject);
  });
}
function respond(res, code, payload) { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(payload)); }
async function notify(subject, content) {
  if (!resendKey || !recipient) return { sent: false, reason: 'Email provider not configured' };
  const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: process.env.FROM_EMAIL || 'Form & Frame <onboarding@resend.dev>', to: [recipient], subject, text: content }) });
  return { sent: response.ok };
}
function botReply(message) {
  const m = String(message || '').toLowerCase();
  if (m.includes('price') || m.includes('cost') || m.includes('budget')) return 'Every wall is measured and specified individually. Share your wall size, TV size and the modules you like, and we’ll prepare a tailored estimate after the free visit.';
  if (m.includes('area') || m.includes('slough') || m.includes('cover')) return 'We cover Slough, Langley, Iver, Burnham, Windsor, Maidenhead and nearby areas. Send your postcode and I’ll check it for you.';
  if (m.includes('book') || m.includes('visit') || m.includes('consult')) return 'Absolutely — choose a preferred time in the consultation form and our team will confirm it. The first visit is free.';
  if (m.includes('fire') || m.includes('led') || m.includes('shelf')) return 'Yes — electric fires, warm LED lighting, open shelving, cabinets and glass display modules can all be designed as one fitted composition.';
  return 'Hello — I’m the Form & Frame project assistant. I can help with module layouts, finishes, electric fires, lead times and arranging a free Slough-area consultation.';
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/api/enquiries') {
    try { const lead = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...await body(req) }; const leads = readJson('enquiries.json'); leads.unshift(lead); writeJson('enquiries.json', leads); await notify(`New Form & Frame enquiry — ${lead.name || 'Website visitor'}`, JSON.stringify(lead, null, 2)); return respond(res, 201, { ok: true, id: lead.id }); } catch (error) { return respond(res, 400, { ok: false, error: error.message }); }
  }
  if (req.method === 'POST' && req.url === '/api/concepts') {
    try { const concept = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...await body(req) }; const concepts = readJson('concepts.json'); concepts.unshift(concept); writeJson('concepts.json', concepts); return respond(res, 201, { ok: true, id: concept.id }); } catch (error) { return respond(res, 400, { ok: false, error: error.message }); }
  }
  if (req.method === 'POST' && req.url === '/api/chat') {
    try { const payload = await body(req); const reply = botReply(payload.message); const chats = readJson('chats.json'); chats.unshift({ id: crypto.randomUUID(), createdAt: new Date().toISOString(), message: payload.message, reply }); writeJson('chats.json', chats.slice(0, 500)); return respond(res, 200, { reply }); } catch (error) { return respond(res, 400, { ok: false, error: error.message }); }
  }
  if (req.method === 'GET' && req.url === '/api/admin/enquiries') {
    if (!process.env.ADMIN_TOKEN || req.headers.authorization !== `Bearer ${process.env.ADMIN_TOKEN}`) return respond(res, 401, { ok: false, error: 'Unauthorised' });
    return respond(res, 200, readJson('enquiries.json'));
  }
  if (req.method === 'GET' && req.url === '/api/admin/concepts') {
    if (!process.env.ADMIN_TOKEN || req.headers.authorization !== `Bearer ${process.env.ADMIN_TOKEN}`) return respond(res, 401, { ok: false, error: 'Unauthorised' });
    return respond(res, 200, readJson('concepts.json'));
  }
  if (req.method === 'GET' && req.url === '/api/admin/chats') {
    if (!process.env.ADMIN_TOKEN || req.headers.authorization !== `Bearer ${process.env.ADMIN_TOKEN}`) return respond(res, 401, { ok: false, error: 'Unauthorised' });
    return respond(res, 200, readJson('chats.json'));
  }
  const pathname = new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname;
  const file = pathname === '/' ? 'index.html' : pathname.slice(1);
  const resolved = path.resolve(root, file);
  if (!resolved.startsWith(root) || !fs.existsSync(resolved) || fs.statSync(resolved).isDirectory()) { res.writeHead(404); return res.end('Not found'); }
  const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json' };
  res.writeHead(200, { 'Content-Type': types[path.extname(resolved)] || 'application/octet-stream' }); fs.createReadStream(resolved).pipe(res);
});
server.listen(port, () => console.log(`Form & Frame server running at http://localhost:${port}`));
