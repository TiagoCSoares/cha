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

db.collection(COLLECTION).onSnapshot(snapshot => {
  lista.innerHTML = "";

  snapshot.forEach(doc => {
    const p = doc.data();

    const div = document.createElement("div");
    div.className = "card";
    if (p.reservado) div.style.opacity = "0.5";

    div.innerHTML = `
      <img src="${p.imagem}">
      <h3>${p.nome}</h3>
      <a href="${p.link}" target="_blank">Ver produto</a>
      <button ${p.reservado ? "disabled" : ""}>
        ${p.reservado ? "Já escolhido" : "Selecionar"}
      </button>
    `;

    const btn = div.querySelector("button");

    if (!p.reservado) {
      btn.onclick = () => reservar(doc.id);
    }

    lista.appendChild(div);
  });
});

function reservar(id) {
  const nome = nomeInput.value.trim();
  if (!nome) return alert("Informe seu nome");

  const ref = db.collection(COLLECTION).doc(id);

  db.runTransaction(async t => {
    const snap = await t.get(ref);
    if (snap.data().reservado) throw "Já reservado";

    t.update(ref, {
      reservado: true,
      por: nome
    });
  }).catch(() => alert("Esse presente já foi escolhido"));
}