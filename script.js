let presenteIdSelecionado = null;
let presenteNomeSelecionado = "";

const firebaseConfig = {
  apiKey: "AIzaSyCC3mHyiAuZx2SWAXO0nMSoPSahpzKEFpg",
  authDomain: "cha-de-casa-nova-55260.firebaseapp.com",
  projectId: "cha-de-casa-nova-55260",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const COLLECTION = "Presentes";

const lista = document.getElementById("lista");
const nomeInput = document.getElementById("nome");

window.onload = () => {
  document.getElementById("modalWelcome").style.display = "flex";
};

function fecharWelcome() {
  document.getElementById("modalWelcome").style.display = "none";
}

db.collection(COLLECTION).onSnapshot(snapshot => {
  lista.innerHTML = "";

  snapshot.forEach(doc => {
    const p = doc.data();

    const div = document.createElement("div");
    div.className = "card";
    if (p.reservado) div.style.opacity = "0.5";

    div.innerHTML = `
      <a href="${p.link}" target="_blank" class="produto-link">
        <img src="${p.imagem}">
      </a>

      <a href="${p.link}" target="_blank" class="produto-link titulo-link">
        <h3>${p.nome}</h3>
      </a> 

      <a href="${p.link}" target="_blank">Ver produto</a>
      <button ${p.reservado ? "disabled" : ""}>
        ${p.reservado ? "Já escolhido" : "Selecionar"}
      </button>
    `;

    const btn = div.querySelector("button");

    if (!p.reservado) {
      btn.onclick = () => abrirConfirmacao(doc.id, p.nome);
    }

    lista.appendChild(div);
  });
});


function abrirConfirmacao(id, nome) {
  presenteIdSelecionado = id;
  presenteNomeSelecionado = nome;

  document.getElementById("presenteSelecionado").innerText =
    `Você selecionou: ${nome}`;

  document.getElementById("nomeModal").value = "";
  document.getElementById("modalConfirm").style.display = "flex";
}

function fecharConfirm() {
  document.getElementById("modalConfirm").style.display = "none";
}

function confirmarReserva() {
  const nome = document.getElementById("nomeModal").value.trim();
  if (!nome) return alert("Informe seu nome");

  const ref = db.collection(COLLECTION).doc(presenteIdSelecionado);

  db.runTransaction(async t => {
    const snap = await t.get(ref);
    if (snap.data().reservado) throw "Já reservado";

    t.update(ref, {
      reservado: true,
      por: nome
    });
  })
  .then(() => fecharConfirm())
  .catch(() => alert("Esse presente já foi escolhido"));
}