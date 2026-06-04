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
// =======================
// FEED GAMER
// =======================

const postForm = document.getElementById("postForm");

if(postForm){

  postForm.onsubmit = e => {

    e.preventDefault();

    const post =
      Object.fromEntries(
        new FormData(postForm).entries()
      );

    post.hearts = 0;
    post.date = new Date().toLocaleString();

    posts.unshift(post);

    saveData();

    renderFeed();

    postForm.reset();

    addXP(20);
    addCoins(5);
  };
}

function renderFeed(){

  const box =
    document.getElementById("feedList");

  if(!box) return;

  box.innerHTML =
    posts.map((post,index)=>`

    <div class="card">

      <h3>${post.title}</h3>

      <small>${post.name}</small>

      <p>${post.text || ""}</p>

      ${
        post.link
        ?
        `<a href="${post.link}" target="_blank">
          Ver contenido
        </a>`
        :
        ""
      }

      <br><br>

      <button onclick="heartPost(${index})">
        ❤️ ${post.hearts}
      </button>

    </div>

  `).join("");
}

window.heartPost = function(index){

  posts[index].hearts++;

  saveData();

  renderFeed();
}

renderFeed();
// =======================
// CLIPS STREAMER
// =======================

const clipForm =
document.getElementById("clipForm");

if(clipForm){

  clipForm.onsubmit = e => {

    e.preventDefault();

    const clip =
      Object.fromEntries(
        new FormData(clipForm).entries()
      );

    clip.hearts = 0;

    clips.unshift(clip);

    saveData();

    renderClips();

    clipForm.reset();

    addXP(50);
    addCoins(15);
  };
}

function renderClips(){

  const box =
  document.getElementById("clipsList");

  const top =
  document.getElementById("topStreamer");

  if(!box) return;

  box.innerHTML =
    clips.map((clip,index)=>`

    <div class="card">

      <h3>${clip.title}</h3>

      <p>${clip.name}</p>

      <p>${clip.game}</p>

      <a href="${clip.video}"
      target="_blank">

      Ver Clip

      </a>

      <br><br>

      <button
      onclick="heartClip(${index})">

      ❤️ ${clip.hearts}

      </button>

    </div>

  `).join("");

  if(clips.length){

    const best =
    [...clips].sort(
      (a,b)=>b.hearts-a.hearts
    )[0];

    top.innerHTML = `
      <div class="card">
        <h2>👑 ${best.name}</h2>
        <p>${best.title}</p>
        <p>❤️ ${best.hearts}</p>
      </div>
    `;
  }
}

window.heartClip = function(index){

  clips[index].hearts++;

  saveData();

  renderClips();

  addCoins(1);
}

renderClips();
// =======================
// SHDW SHOP
// =======================

const shopItems = [
  {
    id:"bronze",
    name:"🥉 Marco Bronce",
    price:100
  },
  {
    id:"silver",
    name:"🥈 Marco Plata",
    price:500
  },
  {
    id:"gold",
    name:"🥇 Marco Oro",
    price:1000
  },
  {
    id:"diamond",
    name:"💎 Marco Diamante",
    price:5000
  },
  {
    id:"vip",
    name:"👑 Membresía VIP",
    price:10000
  }
];

function renderShop(){

  const box =
  document.getElementById("shopItems");

  if(!box) return;

  box.innerHTML =
  shopItems.map(item=>`

    <div class="card">

      <h3>${item.name}</h3>

      <p>
      💰 ${item.price} Coins
      </p>

      <button
      onclick="buyItem('${item.id}')">

      Comprar

      </button>

    </div>

  `).join("");

  renderInventory();
}

window.buyItem = function(id){

  const item =
  shopItems.find(
    x=>x.id===id
  );

  if(!item) return;

  if(coins < item.price){

    alert(
      "No tienes suficientes Coins."
    );

    return;
  }

  coins -= item.price;

  inventory.push(item);

  saveData();

  renderCoins();

  renderInventory();

  alert(
    "Compraste: " + item.name
  );
};

function renderInventory(){

  const box =
  document.getElementById(
    "inventoryList"
  );

  if(!box) return;

  box.innerHTML =
  inventory.length

  ?

  inventory.map(item=>`

    <div class="card">

      <h3>${item.name}</h3>

      <p>Propiedad desbloqueada</p>

    </div>

  `).join("")

  :

  "<p>No tienes artículos.</p>";
}

renderShop();
// =======================
// SHDW AI PRO
// =======================

const aiForm = document.getElementById("aiForm");

if(aiForm){

  aiForm.onsubmit = e => {

    e.preventDefault();

    const data =
      Object.fromEntries(
        new FormData(aiForm).entries()
      );

    const game = data.game;
    const type = data.type;

    const result =
      document.getElementById("aiResult");

    const AI = {

      title:[
        `🔥 Dominando ${game} con la comunidad SHDW`,
        `💀 ¿Podremos ganar en ${game}?`,
        `🚀 Camino a la victoria en ${game}`,
        `👑 Noche épica jugando ${game}`,
        `🎮 Solo los mejores sobreviven en ${game}`
      ],

      hashtags:[
        `#${game} #Gaming #ShadowOpsNexus #SHDW`,
        `#StreamerLatino #${game} #GamingCommunity`,
        `#TikTokGaming #SHDW #${game}`
      ],

      bio:[
        `Streamer apasionado por ${game} y miembro de Shadow Ops Nexus.`,
        `Creando contenido de ${game} todos los días.`,
        `Jugador competitivo de ${game} buscando llegar al top.`
      ],

      ideas:[
        `Jugar con seguidores`,
        `Reaccionar a clips de la comunidad`,
        `Torneo entre streamers`,
        `Reto extremo en ${game}`,
        `Mejores momentos de la semana`
      ],

      recruit:[
        `🎮 Buscamos jugadores de ${game}. Únete a Shadow Ops Nexus.`,
        `🔥 Reclutamiento abierto para miembros activos de ${game}.`,
        `⚔️ Forma parte de la comunidad SHDW y crece con nosotros.`
      ]
    };

    const list = AI[type];

    const random =
      list[
        Math.floor(
          Math.random() * list.length
        )
      ];

    result.innerHTML = `
      <div class="card">
        <h3>🤖 SHDW AI</h3>
        <p>${random}</p>
      </div>
    `;

    addXP(10);
  };
}
// =======================
// FIREBASE ONLINE NEXUS
// =======================

let onlineProfiles = {};
let onlinePosts = {};
let onlineClips = {};

onValue(ref(db, "nexus_profiles"), snapshot => {
  onlineProfiles = snapshot.val() || {};
  renderOnlineProfiles();
});

onValue(ref(db, "nexus_posts"), snapshot => {
  onlinePosts = snapshot.val() || {};
  renderOnlineFeed();
});

onValue(ref(db, "nexus_clips"), snapshot => {
  onlineClips = snapshot.val() || {};
  renderOnlineClips();
});

function toArray(obj){
  return Object.entries(obj || {}).map(([id, data]) => ({
    id,
    ...data
  }));
}
