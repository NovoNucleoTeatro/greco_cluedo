const express = require('express');
const { Low, JSONFile } = require('lowdb');
const { nanoid } = require('nanoid');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do DB
const adapter = new JSONFile('db.json');
const db = new Low(adapter);
(async () => {
  await db.read();
  db.data ||= { votes: [] };
  await db.write();
})();

app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));