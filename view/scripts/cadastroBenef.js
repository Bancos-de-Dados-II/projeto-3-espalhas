const nomeBenef = document.getElementById('nome');
const nomeResp = document.getElementById('Responsavel');
const phone1 = document.getElementById('telefone1');
const phone2 = document.getElementById('telefone2');
const dataNascimento = document.getElementById('dtNascimento');
const botaoSalvar = document.getElementById("botao");

const dataISO = dataNascimento.value;
const [ano, mes, dia] = dataISO.split("-");
const dataFormatada = `${dia}/${mes}/${ano}`;
  
const URL = "http://localhost:3333/benefs";
  
function clearField(){
    nomeBenef.value = '';
    nomeResp.value = ''; 
    phone1.value = '';
    phone2.value = '';
    dataNascimento.value = '';
}

function salvarBenef(localizacao) {
    const uuid = document.getElementById("uuid").value;
    const beneficiario = {
      nome: nomeBenef.value,
      nome_responsavel: nomeResp.value,
      data_nascimento: document.getElementById("dtNascimento").value,
      phone1: phone1.value,
      phone2: phone1.value,
      location: localizacao,
    };
  
    const method = uuid ? "PATCH" : "POST";
    const url = uuid ? `${URL}/${uuid}` : URL;
  
    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(beneficiario),
    })
      .then((res) => {
        if (res.ok) {
          alert(uuid ? "Beneficiário atualizado!" : "Beneficiário criado!");
          clearField();
          localStorage.removeItem("beneficiarioEdit");
        } else {
          alert("Erro ao salvar beneficiário.");
        }
    })
    .catch((err) => {
        console.error("Erro ao salvar beneficiário:", err);
    });
}
  
botaoSalvar.addEventListener("click", (evt) => {
    evt.preventDefault();
    const localizacao = {
    type: "Point",
    coordinates: [marker.getLatLng().lng, marker.getLatLng().lat],
    };
    salvarBenef(localizacao);
});

window.addEventListener("DOMContentLoaded", () => {
    const beneficiarioEdit = localStorage.getItem("beneficiarioEdit");
    
    if (beneficiarioEdit) {
        const benef = JSON.parse(beneficiarioEdit);
  
        document.getElementById("uuid").value = benef.uuid;
        document.getElementById("nome").value = benef.nome;
        document.getElementById("Responsavel").value = benef.nome_responsavel;
        document.getElementById("telefone1").value = benef.phone1 || '';
        document.getElementById("telefone2").value = benef.phone2 || '';
        document.getElementById("dtNascimento").value = new Date(benef.data_nascimento)
            .toISOString()
            .split("T")[0];

        const [lng, lat] = benef.location.coordinates;
        const latlng = { lat, lng };
        marker.setLatLng(latlng);
        map.setView(latlng, 13);
    }
});

document.getElementById("botaoLink").addEventListener("click", () => {
    localStorage.removeItem("beneficiarioEdit");
  });
    