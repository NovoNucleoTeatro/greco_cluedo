// Remove alert e adapta voteBtn:
document.getElementById('voteBtn').addEventListener('click', async () => {
  const res = await fetch('http://localhost:3000/vote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ character: char.name })
  });
  const data = await res.json();
  if (data.success) alert(`Obrigado por votar na ${char.name}!`);
  else alert('Erro a registar voto.');
});