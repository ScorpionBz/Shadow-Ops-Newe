// SHADOW OPS NEXUS 1.0

const $ = id => document.getElementById(id);

// Navegación
document.querySelectorAll("[data-tab]").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.tab;

    document.querySelectorAll(".tab").forEach(tab => {
      tab.classList.remove("active");
    });

    const section = document.getElementById(target);

    if(section){
      section.classList.add("active");
      window.scrollTo(0,0);
    }
  });
});

// Perfil Local
let currentUser = JSON.parse(
  localStorage.getItem("shdw_user") || "null"
);

// Coins
let coins = Number(
  localStorage.getItem("shdw_coins") || 0
);

// Inventario
let inventory = JSON.parse(
  localStorage.getItem("shdw_inventory") || "[]"
);

// Feed
let posts = JSON.parse(
  localStorage.getItem("shdw_posts") || "[]"
);

// Clips
let clips = JSON.parse(
  localStorage.getItem("shdw_clips") || "[]"
);

// XP
let xp = Number(
  localStorage.getItem("shdw_xp") || 0
);

// Nivel
function getLevel(){
  return Math.floor(xp / 100) + 1;
}

function saveData(){
  localStorage.setItem(
    "shdw_user",
    JSON.stringify(currentUser)
  );

  localStorage.setItem(
    "shdw_coins",
    coins
  );

  localStorage.setItem(
    "shdw_inventory",
    JSON.stringify(inventory)
  );

  localStorage.setItem(
    "shdw_posts",
    JSON.stringify(posts)
  );

  localStorage.setItem(
    "shdw_clips",
    JSON.stringify(clips)
  );

  localStorage.setItem(
    "shdw_xp",
    xp
  );
}

function addXP(amount){
  xp += amount;
  saveData();
}

function addCoins(amount){
  coins += amount;
  saveData();
  renderCoins();
}

function renderCoins(){
  const box = document.getElementById("myCoins");

  if(box){
    box.textContent = coins;
  }
}

// Perfil
const profileForm =
document.getElementById("profileForm");

if(profileForm){

  profileForm.onsubmit = e => {

    e.preventDefault();

    const data =
      Object.fromEntries(
        new FormData(profileForm).entries()
      );

    currentUser = data;

    saveData();

    renderProfile();

    alert("Perfil guardado.");
  };
}

function renderProfile(){

  const box =
  document.getElementById("myProfile");

  if(!box || !currentUser) return;

  box.innerHTML = `
    <div class="card">
      ${currentUser.photo ?
      `<img src="${currentUser.photo}" width="100">`
      : ""}

      <h3>${currentUser.gamertag}</h3>

      <p>${currentUser.role}</p>

      <p>${currentUser.region}</p>

      <p>⭐ Nivel ${getLevel()}</p>

      <p>🎖️ XP ${xp}</p>

      <p>💰 Coins ${coins}</p>
    </div>
  `;
}

// Inicio
renderProfile();
renderCoins();

console.log(
  "Shadow Ops Nexus iniciado correctamente"
);
