let fraldas = [];

const container = document.getElementById("fraldasContainer");
const mensagem = document.getElementById("mensagemPresente");
const form = document.getElementById("formPresentes");

const PLANILHA_PRESENTES_URL = "https://script.google.com/macros/s/AKfycbz91MBmfL-xaYaaxnvb8Q7p4JkzV4u_LWKNmTzQVD22O9o8Ir0ExKup-o80rgAmoyqE/exec";

// Busca o estoque atualizado do Google Sheets
fetch(PLANILHA_PRESENTES_URL)
  .then(res => res.json())
  .then(data => {
    fraldas = data;
    renderizaFraldas();
  })
  .catch(() => {
    container.innerHTML = "<p>Erro ao carregar estoque de fraldas.</p>";
  });

function renderizaFraldas() {
  fraldas.forEach(fralda => {
    const bloco = document.createElement("div");
    bloco.style.marginBottom = "1rem";

    bloco.innerHTML = `
      <label><strong>${fralda.tamanho}</strong> – até ${fralda.disponivel} pacotes:</label><br/>
      <input type="number" id="fralda-${fralda.tamanho}" min="0" max="${fralda.disponivel}" value="0" style="width: 80px;" />
    `;

    container.appendChild(bloco);
  });
}

// Envio do formulário
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  if (!nome) return alert("Por favor, preencha seu nome.");

  const fraldasSelecionadas = fraldas.map(fralda => {
    const qtd = parseInt(document.getElementById(`fralda-${fralda.tamanho}`).value || 0);
    return qtd > 0 ? `${qtd}x ${fralda.tamanho}` : null;
  }).filter(Boolean);

  if (fraldasSelecionadas.length === 0) {
    return alert("Selecione pelo menos 1 pacote de fralda.");
  }

  const payload = {
    nome,
    fraldas: fraldasSelecionadas.join(', ')
  };

  fetch(PLANILHA_PRESENTES_URL, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(() => {
    mensagem.innerHTML = `
      <p>Agradecemos pelo carinho e pelo presente, caso precise nos pergunte qual tamanho você escolheu 🎁</p>
    `;
    form.reset();
    container.innerHTML = "";
    renderizaFraldas();
  })
  .catch(() => {
    mensagem.innerHTML = `<p>Houve um erro no envio. Tente novamente mais tarde.</p>`;
  });
});
