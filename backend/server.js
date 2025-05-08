const express = require('express');
const path = require('path');
// Para Lowdb v6+, importa JSONFile de lowdb/node\ nconst { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const { nanoid } = require('nanoid');
const cors = require('cors');
// Autenticação básica para rotas admin
const basicAuth = require('express-basic-auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir frontend público
app.use(express.static(path.join(__dirname, '..')));

// Configuração do DB\ nconst adapter = new JSONFile('db.json');
const db = new Low(adapter, { votes: [] });
(async () => {
  await db.read();
  await db.write();
})();

// Endpoints públicos
app.post('/vote', async (req, res) => {
  const { character } = req.body;
  if (!character) return res.status(400).json({ error: 'Missing character' });

  await db.read();
  const entry = db.data.votes.find(v => v.character === character);
  if (entry) {
    entry.count++;
  } else {
    db.data.votes.push({ id: nanoid(), character, count: 1 });
  }
  await db.write();
  res.json({ success: true });
});

// Protege rotas admin com autenticação básica
app.use('/admin', basicAuth({
  users: { 'admin': 'senhaSegura' },
  challenge: true
}));

// Página admin estática ou gerada com contagens
app.get('/admin', async (req, res) => {
  await db.read();
  // Podes criar um HTML simples ou servir um ficheiro
  let html = '<h1>Resultados de Votação</h1><ul>';
  db.data.votes.forEach(v => {
    html += `<li>${v.character}: ${v.count} voto${v.count !== 1 ? 's' : ''}</li>`;
  });
  html += '</ul>';
  res.send(html);
});

// Fallback SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));