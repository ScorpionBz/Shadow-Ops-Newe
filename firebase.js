import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
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
