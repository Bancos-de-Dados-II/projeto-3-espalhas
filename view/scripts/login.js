const API_URL = "http://localhost:3333/login";

const form = document.getElementById("form-login");
const modalErro = document.getElementById("modal-erro");
const msgErro = document.getElementById("mensagem-erro");
const btnFechar = document.getElementById("btn-fechar");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      mostrarErro(data.message || "Erro no login.");
      return;
    }

    localStorage.setItem("token", data.token);

    window.location.href = "index.html";

  } catch (err) {
    console.error("Erro de rede:", err);
    mostrarErro("Erro de conexão com o servidor.");
  }
});

function mostrarErro(mensagem) {
  msgErro.textContent = mensagem;
  modalErro.style.display = "flex";
}

btnFechar.addEventListener("click", () => {
  modalErro.style.display = "none";
});

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('toggle-pass')) {
    const input = document.getElementById('password');
    input.type = input.type === 'password' ? 'text' : 'password';
  }
});