const express = require('express');
const path = require('path');
// Para Lowdb v6+, importa JSONFile de lowdb/node
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const { nanoid } = require('nanoid');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir frontend estático (index.html, css/, js/, images/)
app.use(express.static(path.join(__dirname, '..')));

// Configuração do DB
const adapter = new JSONFile('db.json');
const db = new Low(adapter, { votes: [] });
(async () => {
  await db.read();
  await db.write();
})();

// Endpoints
// Registar voto
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

// Obter contagem de votos
app.get('/votes', async (req, res) => {
  await db.read();
  res.json(db.data.votes);
});

// Qualquer rota não reconhecida devolve index.html (Single Page)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));