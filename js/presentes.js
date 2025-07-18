const fraldas = [
  { tamanho: "RN", total: 8 },
  { tamanho: "P", total: 11 },
  { tamanho: "M", total: 23 },
  { tamanho: "G", total: 30 },
  { tamanho: "XG", total: 18 }
];

const container = document.getElementById("fraldasContainer");
const mensagem = document.getElementById("mensagemPresente");
const form = document.getElementById("formPresentes");

const PLANILHA_PRESENTES_URL = "https://script.google.com/macros/s/AKfycbxURxZ4M3bVGeaQBxJhvX0NXmM9ZUhpYYdjCcDW-bkbpVa0qD1Zb3RV1GmzPIL2bvYq/exec";

// Monta a interface do estoque
fraldas.forEach(fralda => {
  const bloco = document.createElement("div");
  bloco.style.marginBottom = "1rem";

  bloco.innerHTML = `
    <label><strong>${fralda.tamanho}</strong> – até ${fralda.total} pacotes:</label><br/>
    <input type="number" id="fralda-${fralda.tamanho}" min="0" max="${fralda.total}" value="0" style="width: 80px;" />
  `;

  container.appendChild(bloco);
});

// Envio do formulário
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const contato = document.getElementById("contato").value.trim();
  if (!nome || !contato) return alert("Por favor, preencha nome e contato.");

  const fraldasSelecionadas = fraldas.map(fralda => {
    const qtd = parseInt(document.getElementById(`fralda-${fralda.tamanho}`).value || 0);
    return qtd > 0 ? `${qtd}x ${fralda.tamanho}` : null;
  }).filter(Boolean);

  if (fraldasSelecionadas.length === 0) {
    return alert("Selecione pelo menos 1 pacote de fralda.");
  }

  const payload = {
    nome,
    contato,
    fraldas: fraldasSelecionadas.join(', ')
  };

  fetch(PLANILHA_PRESENTES_URL, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" }
  })
  .then(() => {
    mensagem.innerHTML = `
      <h3>Obrigado, ${nome}! 🎁</h3>
      <p>Recebemos sua contribuição com carinho:</p>
      <ul>
        ${fraldasSelecionadas.map(f => `<li>${f}</li>`).join("")}
      </ul>
      <p>Armando, Andressa e a pequena Catarina agradecem de coração!<br>
      Te esperamos dia <strong>16/08/2025 às 12:30h</strong> com muito amor 💖</p>
    `;
    form.reset();
  })
  .catch(() => {
    mensagem.innerHTML = `<p>Houve um erro no envio. Tente novamente mais tarde.</p>`;
  });
});
