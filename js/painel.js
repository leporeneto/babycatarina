const URL_CONFIRMACOES = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRsVoLRjL8wXN5D6EAAslMRRR890OP5Ehy5UnUxECoj6s8Xii2CT5ZTeRdwGBopIARvvS7pcWlYQw2n/pub?gid=0&single=true&output=csv";
const URL_PRESENTES = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQQFVxAkn225VsKhunRWxzZ1JAC9Rmpn4tCWxj-84eHAKLt68f0eS3eQgi-kSojBAjeBlZqR3xR_i3i/pub?gid=0&single=true&output=csv";

// 🔁 Trocar pelas URLs PÚBLICAS das planilhas no formato CSV (não é a mesma do Web App)

// Utilitário para converter CSV → Array de objetos
function parseCSV(text) {
  const [headerLine, ...lines] = text.trim().split("\n");
  const headers = headerLine.split(",").map(h => h.trim());
  return lines.map(line => {
    const values = line.split(",");
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = values[i];
    });
    return obj;
  });
}

// Renderiza as confirmações
function renderConfirmacoes(data) {
  const div = document.getElementById("confirmacoes");
  if (!data.length) return div.innerHTML = "<p>Nenhuma confirmação registrada ainda.</p>";

  let html = "<ul>";
  data.forEach(item => {
    html += `<li><strong>${item["Nome"]}</strong>`;
    if (item["Adultos"]) html += ` – Adultos: ${item["Adultos"]}`;
    if (item["Criancas"]) html += ` – Crianças: ${item["Criancas"]}`;
    html += "</li>";
  });
  html += "</ul>";
  div.innerHTML = html;
}

// Renderiza os presentes
function renderPresentes(data) {
  const div = document.getElementById("presentes");
  if (!data.length) return div.innerHTML = "<p>Nenhum presente registrado ainda.</p>";

  let html = "<ul>";
  data.forEach(item => {
    html += `<li><strong>${item["Nome"]}</strong> – ${item["Fraldas"]}</li>`;
  });
  html += "</ul>";
  div.innerHTML = html;
}

// Faz as buscas e renderiza tudo
Promise.all([
  fetch(URL_CONFIRMACOES).then(r => r.text()).then(parseCSV).then(renderConfirmacoes),
  fetch(URL_PRESENTES).then(r => r.text()).then(parseCSV).then(renderPresentes)
]).catch(err => {
  document.getElementById("confirmacoes").innerHTML = "<p>Erro ao carregar dados.</p>";
  document.getElementById("presentes").innerHTML = "<p>Erro ao carregar dados.</p>";
});
