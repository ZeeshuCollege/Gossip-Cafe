import express from 'express';
import crypto from 'node:crypto';
import { db } from './db.js';

const app = express();
const port = Number(process.env.PORT || 8787);
app.use(express.json());

const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => ({
  salt,
  hash: crypto.scryptSync(password, salt, 64).toString('hex')
});
const validPassword = (password, salt, hash) =>
  crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(hashPassword(password, salt).hash, 'hex'));
const publicUser = (user) => ({ id: user.id, name: user.name, email: user.email, phone: user.phone || '' });
const createSession = (userId) => {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString();
  db.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)').run(token, userId, expires);
  return token;
};
const auth = (req, res, next) => {
  const token = req.get('authorization')?.replace(/^Bearer\s+/i, '');
  const row = token && db.prepare(`
    SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id
    WHERE s.token = ? AND s.expires_at > datetime('now')
  `).get(token);
  if (!row) return res.status(401).json({ error: 'Authentication required' });
  req.user = row;
  req.token = token;
  next();
};

app.post('/api/auth/signup', (req, res) => {
  const { name, email, phone = '', password } = req.body || {};
  if (!name?.trim() || !email?.trim() || !password || password.length < 8) {
    return res.status(400).json({ error: 'Name, email, and a password of at least 8 characters are required' });
  }
  const credentials = hashPassword(password);
  try {
    const result = db.prepare(`
      INSERT INTO users (name, email, phone, password_hash, provider)
      VALUES (?, ?, ?, ?, 'local')
    `).run(name.trim(), email.trim().toLowerCase(), phone.trim(), `${credentials.salt}:${credentials.hash}`);
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ user: publicUser(user), token: createSession(user.id) });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') return res.status(409).json({ error: 'An account with this email already exists' });
    throw error;
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = email && db.prepare('SELECT * FROM users WHERE email = ? AND provider = ?').get(email.trim().toLowerCase(), 'local');
  if (!user?.password_hash) return res.status(401).json({ error: 'Invalid email or password' });
  const [salt, hash] = user.password_hash.split(':');
  if (!password || !validPassword(password, salt, hash)) return res.status(401).json({ error: 'Invalid email or password' });
  res.json({ user: publicUser(user), token: createSession(user.id) });
});

app.post('/api/auth/google', (req, res) => {
  const { email, name, providerId } = req.body || {};
  if (!email?.trim() || !providerId) return res.status(400).json({ error: 'A verified Google profile is required' });
  let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.trim().toLowerCase());
  if (!user) {
    const result = db.prepare(`
      INSERT INTO users (name, email, provider, provider_id) VALUES (?, ?, 'google', ?)
    `).run(name?.trim() || email.split('@')[0], email.trim().toLowerCase(), providerId);
    user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
  }
  res.json({ user: publicUser(user), token: createSession(user.id) });
});

app.get('/api/auth/me', auth, (req, res) => res.json({ user: publicUser(req.user) }));
app.post('/api/auth/logout', auth, (req, res) => {
  db.prepare('DELETE FROM sessions WHERE token = ?').run(req.token);
  res.status(204).end();
});

app.get('/api/reservations', auth, (req, res) => {
  const rows = db.prepare('SELECT * FROM reservations WHERE user_id = ? ORDER BY date, time').all(req.user.id);
  res.json({ reservations: rows });
});
app.post('/api/reservations', auth, (req, res) => {
  const reservation = req.body || {};
  const required = ['table_id', 'table_name', 'date', 'time', 'party_size', 'name', 'phone'];
  if (required.some((field) => !reservation[field])) return res.status(400).json({ error: 'Complete the reservation details before confirming' });
  try {
    const result = db.prepare(`
      INSERT INTO reservations
        (user_id, table_id, table_name, date, time, party_size, name, phone, email, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(req.user.id, reservation.table_id, reservation.table_name, reservation.date, reservation.time,
      reservation.party_size, reservation.name, reservation.phone, reservation.email || '', reservation.notes || '');
    res.status(201).json({ reservation: db.prepare('SELECT * FROM reservations WHERE id = ?').get(result.lastInsertRowid) });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') return res.status(409).json({ error: 'This table is already reserved for that date and time' });
    throw error;
  }
});

app.use(express.static('dist'));
app.listen(port, () => console.log(`Gossip Cafe API listening on http://localhost:${port}`));
