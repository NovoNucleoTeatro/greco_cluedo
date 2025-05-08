const express = require('express');
const path = require('path');
const cors = require('cors');
const basicAuth = require('express-basic-auth');

// Para Lowdb v6+
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const { nanoid } = require('nanoid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware público
app.use(cors());
app.use(express.json());

// Servir frontend estático (index.html, css, js, images)
app.use(express.static(path.join(__dirname, '..')));

// Configuração do DB com default
const adapter = new JSONFile(path.join(__dirname, 'db.json'));
const db = new Low(adapter, { votes: [] });
(async () => {
  await db.read();
  await db.write();
})();

// Endpoint público para votar
app.post('/vote', async (req, res) => {
  const { character } = req.body;
  if (!character) return res.status(400).json({ error: 'Missing character' });

  await db.read();
  const entry = db.data.votes.find(v => v.character === character);
  if (entry) entry.count++;
  else db.data.votes.push({ id: nanoid(), character, count: 1 });
  await db.write();

  res.json({ success: true });
});

// Endpoint público para obter votos em JSON
app.get('/votes', async (req, res) => {
  await db.read();
  res.json(db.data.votes);
});

// Endpoint público para obter votos em JSON
app.get('/votes', async (req, res) => {
  await db.read();
  res.json(db.data.votes);
});

// Autenticação básica nas rotas admin
app.use('/admin', basicAuth({
  users: { 'admin': 'TUA_SENHA_AQUI' }, // substitui com a tua password
  challenge: true
}));

// Página admin protegida mostrando resultados
app.get('/admin', async (req, res) => {
  await db.read();
  let html = '<h1>Resultados de Votação</h1><ul>';
  db.data.votes.forEach(v => {
    html += `<li>${v.character}: ${v.count} voto${v.count !== 1 ? 's' : ''}</li>`;
  });
  html += '</ul>';
  res.send(html);
});

// Fallback para SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));