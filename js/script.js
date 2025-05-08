// js/script.js

// URL do teu serviço backend na Render
const API_URL = 'https://greco-cluedo-backend.onrender.com';

const characters = [
  { name: 'Personagem 1', img: 'images/person1.jpg', desc: 'Descrição breve da personagem 1.' },
  { name: 'Personagem 2', img: 'images/person2.jpg', desc: 'Descrição breve da personagem 2.' },
  { name: 'Personagem 3', img: 'images/person3.jpg', desc: 'Descrição breve da personagem 3.' },
  { name: 'Personagem 4', img: 'images/person4.jpg', desc: 'Descrição breve da personagem 4.' },
  { name: 'Personagem 5', img: 'images/person5.jpg', desc: 'Descrição breve da personagem 5.' },
  { name: 'Personagem 6', img: 'images/person6.jpg', desc: 'Descrição breve da personagem 6.' },
  { name: 'Personagem 7', img: 'images/person7.jpg', desc: 'Descrição breve da personagem 7.' },
  { name: 'Personagem 8', img: 'images/person8.jpg', desc: 'Descrição breve da personagem 8.' }
];

let currentPage = 0;
const container = document.querySelector('.card-container');
const pagination = document.querySelector('.pagination');

/**
 * Renderiza o cartão da personagem na página atual
 */
function renderCharacter(page) {
  const char = characters[page];
  container.innerHTML = `
    <div class="card">
      <img src="${char.img}" alt="${char.name}">
      <h2>${char.name}</h2>
      <p>${char.desc}</p>
      <button id="voteBtn">Votar</button>
    </div>
  `;
  document.getElementById('voteBtn').addEventListener('click', async () => {
    try {
      const res = await fetch(`${API_URL}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ character: char.name })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Obrigado por votar na ${char.name}!`);
      } else {
        alert('Erro ao registar voto.');
      }
    } catch (err) {
      console.error('Erro no POST /vote:', err);
      alert('Erro de comunicação com o servidor.');
    }
  });

  // Destaca o botão ativo
  document.querySelectorAll('.page-btn').forEach((btn, idx) => {
    btn.classList.toggle('active', idx === page);
  });
}

/**
 * Gera os botões de paginação (1–8)
 */
function renderPagination() {
  pagination.innerHTML = characters
    .map((_, idx) => `<button class="page-btn" data-page="${idx}">${idx + 1}</button>`)
    .join('');

  pagination.addEventListener('click', e => {
    if (e.target.classList.contains('page-btn')) {
      currentPage = +e.target.dataset.page;
      renderCharacter(currentPage);
    }
  });
}

// Inicializa o front
renderPagination();
renderCharacter(currentPage);
