
```js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  update
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCBE0hhMLUQR91JokZFxSm1119s5tmQ0k4",
  authDomain: "shadow-ops-nexus.firebaseapp.com",
  projectId: "shadow-ops-nexus",
  storageBucket: "shadow-ops-nexus.firebasestorage.app",
  messagingSenderId: "422758972704",
  appId: "1:422758972704:web:a57c4ea46a20d6d604eb45"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

const $ = id => document.getElementById(id);

let currentUser = JSON.parse(localStorage.getItem("shdw_user") || "null");
let coins = Number(localStorage.getItem("shdw_coins") || 0);
let inventory = JSON.parse(localStorage.getItem("shdw_inventory") || "[]");
let posts = [];
let clips = [];
let xp = Number(localStorage.getItem("shdw_xp") || 0);

const toArray = obj =>
  Object.entries(obj || {}).map(([id, data]) => ({ id, ...data }));

function saveData(){
  localStorage.setItem("shdw_user", JSON.stringify(currentUser));
  localStorage.setItem("shdw_coins", coins);
  localStorage.setItem("shdw_inventory", JSON.stringify(inventory));
  localStorage.setItem("shdw_xp", xp);
}

function getLevel(){
  return Math.floor(xp / 100) + 1;
}

function addXP(amount){
  xp += amount;
  saveData();
  renderProfile();
}

function addCoins(amount){
  coins += amount;
  saveData();
  renderCoins();
  renderProfile();
}

function renderCoins(){
  if($("myCoins")) $("myCoins").textContent = coins;
}

document.querySelectorAll("[data-tab]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
    const section = $(btn.dataset.tab);
    if(section){
      section.classList.add("active");
      window.scrollTo(0,0);
    }
  });
});

const profileForm = $("profileForm");

if(profileForm){
  profileForm.onsubmit = async e => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(profileForm).entries());

    data.xp = xp;
    data.coins = coins;
    data.createdAt = new Date().toISOString();

    await push(ref(db, "nexus_profiles"), data);

    currentUser = data;
    saveData();
    renderProfile();
    profileForm.reset();

    alert("Perfil guardado en línea.");
  };
}

function renderProfile(){
  const box = $("myProfile");
  if(!box || !currentUser) return;

  box.innerHTML = `
    <div class="card">
      ${currentUser.photo ? `<img src="${currentUser.photo}" width="100">` : ""}
      <h3>${currentUser.gamertag || "Jugador SHDW"}</h3>
      <p>${currentUser.role || "Jugador"}</p>
      <p>${currentUser.region || "Global"}</p>
      <p>⭐ Nivel ${getLevel()}</p>
      <p>🎖️ XP ${xp}</p>
      <p>💰 Coins ${coins}</p>
    </div>
  `;
}

const postForm = $("postForm");

if(postForm){
  postForm.onsubmit = async e => {
    e.preventDefault();

    const post = Object.fromEntries(new FormData(postForm).entries());

    post.hearts = 0;
    post.createdAt = new Date().toISOString();

    await push(ref(db, "nexus_posts"), post);

    addXP(20);
    addCoins(5);

    postForm.reset();
    alert("Publicación subida.");
  };
}

function renderFeed(){
  const box = $("feedList");
  if(!box) return;

  box.innerHTML = posts.length ? posts.map(post => `
    <div class="card">
      <h3>${post.title}</h3>
      <small>${post.name}</small>
      <p>${post.text || ""}</p>
      ${post.link ? `<a href="${post.link}" target="_blank">Ver contenido</a>` : ""}
      <br><br>
      <button onclick="heartPost('${post.id}', ${post.hearts || 0})">
        ❤️ ${post.hearts || 0}
      </button>
    </div>
  `).join("") : "<p>No hay publicaciones todavía.</p>";
}

window.heartPost = async function(id, hearts){
  await update(ref(db, "nexus_posts/" + id), {
    hearts: Number(hearts) + 1
  });

  addCoins(1);
};

const clipForm = $("clipForm");

if(clipForm){
  clipForm.onsubmit = async e => {
    e.preventDefault();

    const clip = Object.fromEntries(new FormData(clipForm).entries());

    clip.hearts = 0;
    clip.createdAt = new Date().toISOString();

    await push(ref(db, "nexus_clips"), clip);

    addXP(50);
    addCoins(15);

    clipForm.reset();
    alert("Clip subido.");
  };
}

function renderClips(){
  const box = $("clipsList");
  const top = $("topStreamer");

  if(!box) return;

  box.innerHTML = clips.length ? clips.map(clip => `
    <div class="card">
      <h3>${clip.title}</h3>
      <p>${clip.name}</p>
      <p>${clip.game || "Gaming"}</p>
      <a href="${clip.video}" target="_blank">Ver Clip</a>
      <br><br>
      <button onclick="heartClip('${clip.id}', ${clip.hearts || 0})">
        ❤️ ${clip.hearts || 0}
      </button>
    </div>
  `).join("") : "<p>No hay clips todavía.</p>";

  if(top){
    if(clips.length){
      const best = [...clips].sort((a,b)=>(b.hearts || 0)-(a.hearts || 0))[0];

      top.innerHTML = `
        <div class="card">
          <h2>👑 ${best.name}</h2>
          <p>${best.title}</p>
          <p>❤️ ${best.hearts || 0}</p>
        </div>
      `;
    } else {
      top.innerHTML = "<p>Aún no hay streamer destacado.</p>";
    }
  }
}

window.heartClip = async function(id, hearts){
  await update(ref(db, "nexus_clips/" + id), {
    hearts: Number(hearts) + 1
  });

  addCoins(1);
};

const shopItems = [
  {id:"bronze", name:"🥉 Marco Bronce", price:100},
  {id:"silver", name:"🥈 Marco Plata", price:500},
  {id:"gold", name:"🥇 Marco Oro", price:1000},
  {id:"diamond", name:"💎 Marco Diamante", price:5000},
  {id:"vip", name:"👑 Membresía VIP", price:10000}
];

function renderShop(){
  const box = $("shopItems");
  if(!box) return;

  box.innerHTML = shopItems.map(item => `
    <div class="card">
      <h3>${item.name}</h3>
      <p>💰 ${item.price} Coins</p>
      <button onclick="buyItem('${item.id}')">Comprar</button>
    </div>
  `).join("");

  renderInventory();
}

window.buyItem = function(id){
  const item = shopItems.find(x => x.id === id);
  if(!item) return;

  if(coins < item.price){
    alert("No tienes suficientes Coins.");
    return;
  }

  coins -= item.price;
  inventory.push(item);

  saveData();
  renderCoins();
  renderInventory();
  renderProfile();

  alert("Compraste: " + item.name);
};

function renderInventory(){
  const box = $("inventoryList");
  if(!box) return;

  box.innerHTML = inventory.length ? inventory.map(item => `
    <div class="card">
      <h3>${item.name}</h3>
      <p>Propiedad desbloqueada</p>
    </div>
  `).join("") : "<p>No tienes artículos.</p>";
}

const aiForm = $("aiForm");

if(aiForm){
  aiForm.onsubmit = e => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(aiForm).entries());
    const game = data.game;
    const type = data.type;
    const result = $("aiResult");

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

    const list = AI[type] || AI.title;
    const random = list[Math.floor(Math.random() * list.length)];

    if(result){
      result.innerHTML = `
        <div class="card">
          <h3>🤖 SHDW AI</h3>
          <p>${random}</p>
        </div>
      `;
    }

    addXP(10);
  };
}

onValue(ref(db, "nexus_posts"), snapshot => {
  posts = toArray(snapshot.val());
  renderFeed();
});

onValue(ref(db, "nexus_clips"), snapshot => {
  clips = toArray(snapshot.val());
  renderClips();
});

onValue(ref(db, "nexus_profiles"), snapshot => {
  const profiles = toArray(snapshot.val());
  const statUsers = $("statUsers");
  if(statUsers) statUsers.textContent = profiles.length;
});

onValue(ref(db, "nexus_clips"), snapshot => {
  const list = toArray(snapshot.val());
  const statClips = $("statClips");
  const statHearts = $("statHearts");

  if(statClips) statClips.textContent = list.length;
  if(statHearts) {
    statHearts.textContent = list.reduce((sum, c) => sum + Number(c.hearts || 0), 0);
  }
});

renderProfile();
renderCoins();
renderShop();
renderInventory();
```

Y revisa que en `index.html` tengas esto al final:

```html
<script type="module" src="app.js"></script>
```
