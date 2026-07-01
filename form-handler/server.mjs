import http from 'http';
import nodemailer from 'nodemailer';
import { clients } from './clients.mjs';

const PORT      = process.env.PORT      || 3001;
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.checkdomain.de';
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.SMTP_USER || 'info@echtzeit-production.de';
const SMTP_PASS = process.env.SMTP_PASS || '';

const transporter = nodemailer.createTransport({
  host:   SMTP_HOST,
  port:   Number(SMTP_PORT),
  secure: false,
  auth:   { user: SMTP_USER, pass: SMTP_PASS },
});

// Simple rate limiter: max 5 requests per IP per 10 minutes
const ratemap = new Map();
function isRateLimited(ip) {
  const now    = Date.now();
  const window = 10 * 60 * 1000;
  const entry  = ratemap.get(ip) || { count: 0, start: now };
  if (now - entry.start > window) { ratemap.set(ip, { count: 1, start: now }); return false; }
  if (entry.count >= 5) return true;
  entry.count++;
  ratemap.set(ip, entry);
  return false;
}

// Kein Mensch füllt Name/E-Mail/Nachricht in unter 3 Sekunden aus —
// klassisches Bot-Signal. `ts` ist optional: fehlt es (altes gecachtes
// Frontend-JS), wird der Timing-Check übersprungen statt echte Anfragen
// stillschweigend zu verwerfen.
const MIN_SUBMIT_MS = 3000;

// Häufige Muster aus "Rechnung"/"überfällig"-Spam-Kampagnen. Kein Hard-Block —
// nur Betreff-Tag, damit nie eine echte Anfrage verloren geht.
const SPAM_LINK_PATTERN    = /(https?:\/\/|www\.)/i;
const SPAM_KEYWORD_PATTERN = /(rechnung|invoice|mahnung|überfällig|zahlung\s*ausst|inkasso|bitcoin|krypto|usdt|wallet|seo[- ]?service|backlink|link\s*building|google\s*ranking)/i;

function json(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

http.createServer(async (req, res) => {
  const origin  = (req.headers.origin || '').replace(/\/$/, '');
  const toEmail = clients[origin];

  // CORS — nur bekannte Domains durchlassen
  if (toEmail) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  if (req.method !== 'POST' || req.url !== '/api/kontakt') {
    return json(res, 404, { error: 'Not found' });
  }

  if (!toEmail) {
    console.warn('Unbekannte Origin:', origin);
    return json(res, 403, { error: 'Nicht autorisiert.' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
  if (isRateLimited(ip)) return json(res, 429, { error: 'Zu viele Anfragen. Bitte warte kurz.' });

  let body = '';
  req.on('data', chunk => { body += chunk; if (body.length > 10_000) req.destroy(); });
  req.on('end', async () => {
    let data;
    try { data = JSON.parse(body); } catch { return json(res, 400, { error: 'Ungültige Anfrage.' }); }

    const honeypot  = String(data.website   || '');
    if (honeypot)   return json(res, 400, { error: 'Ungültige Anfrage.' });

    // Timing-Check — nur wenn Frontend einen Zeitstempel mitschickt (siehe oben).
    if (data.ts !== undefined) {
      const elapsed = Date.now() - Number(data.ts);
      if (!Number.isFinite(elapsed) || elapsed < MIN_SUBMIT_MS) {
        console.warn(`Bot-Verdacht (Timing, ${elapsed}ms) – Origin ${origin}`);
        // Fake-Erfolg: kein Hinweis an den Bot, dass er geblockt wurde.
        return json(res, 200, { ok: true });
      }
    }

    const name      = String(data.name      || '').trim().slice(0, 200);
    const email     = String(data.email     || '').trim().slice(0, 200);
    const betreff   = String(data.betreff   || '').trim().slice(0, 200);
    const nachricht = String(data.nachricht || '').trim().slice(0, 5000);

    if (!name || !email || !nachricht) {
      return json(res, 400, { error: 'Bitte alle Pflichtfelder ausfüllen.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json(res, 400, { error: 'Bitte eine gültige E-Mail-Adresse eingeben.' });
    }

    const isSuspicious = SPAM_LINK_PATTERN.test(nachricht)
      || SPAM_KEYWORD_PATTERN.test(nachricht)
      || SPAM_KEYWORD_PATTERN.test(betreff);
    const subjectPrefix = isSuspicious ? '⚠️ [SPAM-VERDACHT] ' : '';

    try {
      await transporter.sendMail({
        from:    `"Website Kontaktformular" <${SMTP_USER}>`,
        replyTo: `"${name}" <${email}>`,
        to:      toEmail,
        subject: subjectPrefix + (betreff || `Neue Anfrage von ${name} (${origin})`),
        text:    `Von: ${name}\nE-Mail: ${email}\nWebsite: ${origin}\n\n${nachricht}`,
        html:    `<p><strong>Von:</strong> ${name}</p><p><strong>E-Mail:</strong> <a href="mailto:${email}">${email}</a></p><p><strong>Website:</strong> ${origin}</p><hr><p>${nachricht.replace(/\n/g, '<br>')}</p>`,
      });
      console.log(`Mail gesendet: ${origin} → ${toEmail}`);
      return json(res, 200, { ok: true });
    } catch (err) {
      console.error('Mail-Fehler:', err.message);
      return json(res, 500, { error: 'Beim Senden ist ein Fehler aufgetreten. Bitte versuche es später erneut.' });
    }
  });
}).listen(PORT, () => console.log(`Form handler läuft auf Port ${PORT}`));
