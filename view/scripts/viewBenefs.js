const URL = "http://localhost:3333/benefs";
const tabelaBody = document.querySelector("#tabela-beneficiarios tbody");

// Criar modal para mapa
const modal = document.createElement("div");
modal.id = "modal-mapa";
modal.style.display = "block";


const closeBtn = document.createElement("button");
closeBtn.textContent = "Fechar";

closeBtn.onclick = () => {
  modal.style.display = "none";
};

const mapaDiv = document.createElement("div");
mapaDiv.id = "mapa-view";
mapaDiv.style.height = "250px";
mapaDiv.style.width = "100%";
mapaDiv.style.display = "block";

modal.appendChild(closeBtn);  
modal.appendChild(mapaDiv);
document.body.appendChild(modal);

let mapa;

document.getElementById("btnFiltrar").addEventListener("click", () => {
  const nome = document.getElementById("filtroNome").value.trim();
  const distancia = document.getElementById("filtroDistancia").value.trim();

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      const params = new URLSearchParams();
      if (nome) params.append("nome", nome);
      if (lat && lng) {
        params.append("lat", lat);
        params.append("lng", lng);
      }
      if (distancia) params.append("distancia", distancia);

      fetch(`${URL}/combo?${params.toString()}`)
        .then((res) => res.json())
        .then((json) => {
          if (!json.success) {
            alert(json.message || "Nenhum resultado encontrado");
            return;
          }
          renderTabela(json.data);
        })
        .catch((err) => console.error("Erro na busca:", err));
    },
    (err) => {
      alert("Não foi possível obter a localização");
      console.error(err);
    }
  );
});

function renderTabela(benefs) {
  tabelaBody.replaceChildren(); 

  benefs.forEach((benef) => {
    const tr = document.createElement("tr");

    const tdNome = document.createElement("td");
    tdNome.textContent = benef.nome;

    const tdResp = document.createElement("td");
    tdResp.textContent = benef.nome_responsavel;

    const tdNascimento = document.createElement("td");
    tdNascimento.textContent = formatarData(benef.data_nascimento);

    const tdTel1 = document.createElement("td");
    tdTel1.textContent = benef.phone1 || "-";

    const tdTel2 = document.createElement("td");
    tdTel2.textContent = benef.phone2 || "-";

    const tdLocal = document.createElement("td");
    const botaoMapa = document.createElement("button");
    botaoMapa.textContent = "Ver no mapa";
    botaoMapa.onclick = () => {
      exibirMapa(benef.location);
    };
    tdLocal.appendChild(botaoMapa);

    const tdAcoes = document.createElement("td");
    const btEdit = document.createElement("button");
    btEdit.textContent = "Editar";
    btEdit.onclick = () => editarBenef(benef.uuid);

    const btDelete = document.createElement("button");
    btDelete.textContent = "Excluir";
    btDelete.onclick = () => excluirBenef(benef.uuid);

    tdAcoes.appendChild(btEdit);
    tdAcoes.appendChild(btDelete);

    tr.append(tdNome, tdResp, tdNascimento, tdTel1, tdTel2, tdLocal, tdAcoes);
    tabelaBody.appendChild(tr);
  });
}

async function carregarBeneficiarios() {
  try {
    const res = await fetch(URL);
    const data = await res.json();

    tabelaBody.replaceChildren(); 

    data.forEach((benef) => {
      const tr = document.createElement("tr");

      const tdNome = document.createElement("td");
      tdNome.textContent = benef.nome;

      const tdResp = document.createElement("td");
      tdResp.textContent = benef.nome_responsavel;

      const tdNascimento = document.createElement("td");
      tdNascimento.textContent = formatarData(benef.data_nascimento);

      const tdTel1 = document.createElement("td");
      tdTel1.textContent = benef.phone1 || "-";

      const tdTel2 = document.createElement("td");
      tdTel2.textContent = benef.phone2 || "-";

      const tdLocal = document.createElement("td");
      const botaoMapa = document.createElement("button");
      botaoMapa.textContent = "Ver no mapa";
      botaoMapa.onclick = () => {
        exibirMapa(benef.location);
      };
      tdLocal.appendChild(botaoMapa);

      const tdAcoes = document.createElement("td");
      const btEdit = document.createElement("button");
      btEdit.textContent = "Editar";
      btEdit.onclick = () => editarBenef(benef.uuid);

      const btDelete = document.createElement("button");
      btDelete.textContent = "Excluir";
      btDelete.onclick = () => excluirBenef(benef.uuid);

      tdAcoes.appendChild(btEdit);
      tdAcoes.appendChild(btDelete);

      tr.append(tdNome, tdResp, tdNascimento, tdTel1, tdTel2, tdLocal, tdAcoes);
      tabelaBody.appendChild(tr);
    });
  } catch (err) {
    console.error("Erro ao carregar beneficiários:", err);
  }
}

function formatarData(dataISO) {
  const data = new Date(dataISO);
  return data.toLocaleDateString("pt-BR");
}

function editarBenef(id) {
  fetch(`${URL}/${id}`)
    .then(res => res.json())
    .then(benef => {
      localStorage.setItem("beneficiarioEdit", JSON.stringify(benef));
      window.location.href = "index.html";
    })
    .catch(err => {
      console.error("Erro ao buscar beneficiário:", err);
      alert("Erro ao carregar beneficiário.");
    });
}

async function excluirBenef(id) {
  const confirmado = confirm("Tem certeza que deseja excluir?");
  if (!confirmado) return;

  try {
    const res = await fetch(`${URL}/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("Beneficiário excluído.");
      carregarBeneficiarios();
    } else {
      alert("Erro ao excluir.");
    }
  } catch (err) {
    console.error("Erro ao excluir beneficiário:", err);
  }
}

function exibirMapa(location) {
  if (!location || !location.coordinates) {
    alert("Localização não disponível");
    return;
  }

  modal.style.display = "block";
  const [lng, lat] = location.coordinates;

  setTimeout(() => {
    if (mapa) mapa.remove();
    mapa = L.map("mapa-view").setView([lat, lng], 15);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapa);

    L.marker([lat, lng]).addTo(mapa);
  }, 100); 
}

const tdAcoes = document.createElement("td");

const btEdit = document.createElement("button");
btEdit.textContent = "✏️ Editar";
btEdit.classList.add("btn-edit");
btEdit.onclick = () => editarBenef(benef.uuid);

const btDelete = document.createElement("button");
btDelete.textContent = "🗑️ Excluir";
btDelete.classList.add("btn-delete");
btDelete.onclick = () => excluirBenef(benef.uuid);

tdAcoes.appendChild(btEdit);
tdAcoes.appendChild(btDelete);

carregarBeneficiarios();