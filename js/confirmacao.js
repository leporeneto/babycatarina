const form = document.getElementById('formConfirmacao');
const adultosContainer = document.getElementById('adultosContainer');
const criancasContainer = document.getElementById('criancasContainer');
const mensagem = document.getElementById('mensagemConfirmacao');

// URLs do seu Web App (já integradas)
const PLANILHA_CONFIRMACOES_URL = "https://script.google.com/macros/s/AKfycbykNgSj9FTxkkq9UDRCtgbzD9gOQtZ5ecA3bxEfV-jZANcl7pB_XsZNR8euDU_EQlru/exec";

// Adicionar campos de adulto
function adicionarAdulto() {
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Nome do adulto';
  input.classList.add('input-nome');
  adultosContainer.appendChild(input);
}

// Adicionar campos de criança
function adicionarCrianca() {
  const div = document.createElement('div');
  div.classList.add('bloco-crianca');

  const nome = document.createElement('input');
  nome.type = 'text';
  nome.placeholder = 'Nome da criança';
  nome.classList.add('input-nome');

  const idade = document.createElement('input');
  idade.type = 'number';
  idade.placeholder = 'Idade';
  idade.classList.add('input-idade');

  div.appendChild(nome);
  div.appendChild(idade);
  criancasContainer.appendChild(div);
}

// Ao enviar o formulário
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nomePrincipal = document.getElementById('nomePrincipal').value.trim();
  if (!nomePrincipal) return alert("Por favor, preencha seu nome.");

  const adultos = Array.from(adultosContainer.querySelectorAll('input'))
    .map(input => input.value.trim())
    .filter(nome => nome.length > 0);

  const criancas = Array.from(criancasContainer.querySelectorAll('.bloco-crianca')).map(div => {
    const nome = div.querySelector('.input-nome')?.value.trim();
    const idade = div.querySelector('.input-idade')?.value.trim();
    return nome && idade ? `${nome} (${idade} anos)` : null;
  }).filter(Boolean);

  const payload = {
    nome: nomePrincipal,
    adultos: adultos.join(', '),
    criancas: criancas.join(', ')
  };

  const formData = new FormData();
formData.append("nome", nomePrincipal);
formData.append("adultos", adultos.join(', '));
formData.append("criancas", criancas.join(', '));

fetch(PLANILHA_CONFIRMACOES_URL, {
  method: "POST",
  body: formData
})
.then(() => {
  mensagem.innerHTML = `
    <h3>Obrigada, ${nomePrincipal}! 💖</h3>
    <p>Sua confirmação foi registrada com sucesso.</p>
    ${adultos.length ? `<p>👨‍👩‍👧‍👦 Adultos: ${adultos.join(', ')}</p>` : ""}
    ${criancas.length ? `<p>🧒 Crianças: ${criancas.join(', ')}</p>` : ""}
    <p>Esperamos vocês dia <strong>16/08/2025 às 12:30h</strong> para celebrar a chegada da nossa princesa Catarina! 👑</p>
  `;
  form.reset();
  adultosContainer.innerHTML = "";
  criancasContainer.innerHTML = "";
})
.catch(() => {
  mensagem.innerHTML = `<p>Ocorreu um erro no envio. Tente novamente mais tarde.</p>`;
});
