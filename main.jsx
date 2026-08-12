import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, deleteDoc, getDocs, getDoc, updateDoc, increment } from "firebase/firestore";
import App from "./app-src.jsx";

/* ============ Stockage local (IndexedDB) : cache + hors-ligne ============ */
const localKV = (() => {
  let dbp;
  function open() {
    if (!dbp) dbp = new Promise((res, rej) => {
      const r = indexedDB.open("nutrisuivi", 1);
      r.onupgradeneeded = () => r.result.createObjectStore("kv");
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
    return dbp;
  }
  async function store(mode) { const db = await open(); return db.transaction("kv", mode).objectStore("kv"); }
  return {
    async get(k) { const s = await store("readonly"); return new Promise((res) => { const r = s.get(k); r.onsuccess = () => res(r.result == null ? null : { value: r.result, key: k }); r.onerror = () => res(null); }); },
    async set(k, v) { const s = await store("readwrite"); return new Promise((res) => { const r = s.put(v, k); r.onsuccess = () => res({ value: v, key: k }); r.onerror = () => res(null); }); },
    async delete(k) { const s = await store("readwrite"); return new Promise((res) => { const r = s.delete(k); r.onsuccess = () => res({ deleted: true }); r.onerror = () => res(null); }); },
    async list(prefix) { const s = await store("readonly"); return new Promise((res) => { const r = s.getAllKeys(); r.onsuccess = () => res({ keys: (r.result || []).map(String).filter((k) => !prefix || k.startsWith(prefix)) }); r.onerror = () => res({ keys: [] }); }); },
    async clearLocal() { const s = await store("readwrite"); return new Promise((res) => { const r = s.clear(); r.onsuccess = () => res(true); r.onerror = () => res(false); }); },
  };
})();

/* ============ Firebase (auth + Firestore synchronisé) ============ */
const CONFIGURED = !!(window.FIREBASE_CONFIG && window.FIREBASE_CONFIG.apiKey);
let _auth, _db;
function fb() {
  if (!_auth) { const app = initializeApp(window.FIREBASE_CONFIG); _auth = getAuth(app); _db = getFirestore(app); }
  return { auth: _auth, db: _db };
}
const docId = (key) => encodeURIComponent(key);

// Stockage cloud : lit le cache local ; écrit local + Firestore (dernier écrit gagne).
function makeCloudKV(uid) {
  const { db } = fb();
  const col = () => collection(db, "users", uid, "kv");
  return {
    get: (k) => localKV.get(k),
    list: (p) => localKV.list(p),
    async set(k, v) {
      await localKV.set(k, v);
      try { await setDoc(doc(col(), docId(k)), { k, value: JSON.parse(v), updated_at: Date.now() }); } catch (e) {}
      return { value: v };
    },
    async delete(k) {
      await localKV.delete(k);
      try { await deleteDoc(doc(col(), docId(k))); } catch (e) {}
      return { deleted: true };
    },
  };
}

// À la connexion : récupère les données du compte (cloud -> cache local).
async function pullFromCloud(uid) {
  try {
    const { db } = fb();
    const snap = await getDocs(collection(db, "users", uid, "kv"));
    await localKV.clearLocal();
    const ps = [];
    snap.forEach((d) => { const data = d.data(); if (data && data.k != null) ps.push(localKV.set(data.k, JSON.stringify(data.value))); });
    await Promise.all(ps);
  } catch (e) {}
}

/* ============ Base d'aliments partagée (communautaire) ============ */
// Chaque scan de code-barres ou aliment encodé rejoint une collection publique.
// Tous les utilisateurs authentifiés lisent la même base, qui grossit au fil du temps.
function sharedFoodDocId(rawId) {
  // Sécurise l'id pour Firestore : lettres/chiffres/tiret/underscore uniquement, tronque à 100.
  return String(rawId || "").replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 100) || "unknown";
}
function makeSharedFoods(uid) {
  const { db } = fb();
  const col = () => collection(db, "sharedFoods");
  return {
    async list() {
      try {
        const snap = await getDocs(col());
        const arr = [];
        snap.forEach((d) => arr.push(d.data()));
        return arr;
      } catch (e) { return []; }
    },
    // Ajoute/met à jour un aliment dans la base partagée.
    // food : { code, nom, kcal, p, c, f, fib?, suc?, grp?, source: 'scan'|'encoded' }
    async submit(food) {
      if (!food || !food.code || !food.nom) return null;
      const id = sharedFoodDocId(food.code);
      const ref = doc(col(), id);
      const payload = {
        code: String(food.code),
        nom: String(food.nom).slice(0, 120),
        kcal: Number(food.kcal) || 0,
        p: Number(food.p) || 0,
        c: Number(food.c) || 0,
        f: Number(food.f) || 0,
        fib: Number(food.fib) || 0,
        suc: Number(food.suc) || 0,
        grp: String(food.grp || "plat"),
        source: food.source === "encoded" ? "encoded" : "scan",
        addedAt: Date.now(),
        addedBy: uid || "anon",
        contributions: 1,
      };
      try {
        const existing = await getDoc(ref);
        if (existing.exists()) {
          await updateDoc(ref, { contributions: increment(1), lastAt: Date.now(), lastBy: uid || "anon" });
        } else {
          await setDoc(ref, payload);
        }
        return payload;
      } catch (e) { return null; }
    },
  };
}

/* ============ Écran de connexion ============ */
const A = {
  wrap: { maxWidth: 420, margin: "0 auto", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: 24, background: "#F4F6F1", fontFamily: "'Inter',system-ui,sans-serif", color: "#17241C" },
  card: { background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 1px 3px rgba(23,36,28,.08)" },
  input: { width: "100%", padding: "13px 14px", borderRadius: 12, border: "1px solid #E1E6DC", fontSize: 15, background: "#FAFBF8", boxSizing: "border-box", marginTop: 10, outline: "none" },
  btn: { width: "100%", marginTop: 16, padding: "14px 0", borderRadius: 14, border: "none", background: "#2C6E49", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer" },
  link: { background: "none", border: "none", color: "#2C6E49", fontSize: 14, cursor: "pointer", textDecoration: "underline", marginTop: 14, display: "block", width: "100%", textAlign: "center" },
};
function humanErr(code) {
  const m = { "auth/invalid-email": "E-mail invalide.", "auth/missing-password": "Entre un mot de passe.", "auth/weak-password": "Mot de passe trop court (min. 6 caractères).", "auth/email-already-in-use": "Un compte existe déjà avec cet e-mail.", "auth/invalid-credential": "E-mail ou mot de passe incorrect.", "auth/user-not-found": "Aucun compte pour cet e-mail.", "auth/wrong-password": "Mot de passe incorrect." };
  return m[code] || "Erreur : " + code;
}
function Auth() {
  const [mode, setMode] = useState("in");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit() {
    if (!email || !pw) { setMsg("Renseigne ton e-mail et ton mot de passe."); return; }
    setBusy(true); setMsg("");
    try {
      const { auth } = fb();
      if (mode === "up") await createUserWithEmailAndPassword(auth, email, pw);
      else await signInWithEmailAndPassword(auth, email, pw);
    } catch (e) { setMsg(humanErr(e.code || e.message)); }
    setBusy(false);
  }
  return (
    <div style={A.wrap}>
      <div style={{ textAlign: "center", marginBottom: 22 }}>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 28 }}>Nutri<span style={{ color: "#E0912F" }}>Suivi</span></div>
        <div style={{ color: "#7C8A80", fontSize: 14, marginTop: 4 }}>{mode === "in" ? "Connecte-toi pour retrouver tes données" : "Crée ton compte"}</div>
      </div>
      <div style={A.card}>
        <input style={A.input} type="email" inputMode="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input style={A.input} type="password" placeholder="Mot de passe" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
        {msg && <div style={{ color: "#C0562B", fontSize: 13, marginTop: 12, lineHeight: 1.4 }}>{msg}</div>}
        <button style={{ ...A.btn, opacity: busy ? 0.6 : 1 }} disabled={busy} onClick={submit}>{busy ? "…" : mode === "in" ? "Se connecter" : "Créer le compte"}</button>
        <button style={A.link} onClick={() => { setMode(mode === "in" ? "up" : "in"); setMsg(""); }}>
          {mode === "in" ? "Pas encore de compte ? En créer un" : "Déjà un compte ? Se connecter"}
        </button>
      </div>
      <div style={{ color: "#7C8A80", fontSize: 11, textAlign: "center", marginTop: 18, lineHeight: 1.5 }}>
        Tes données sont stockées sur ton espace privé et se synchronisent entre tous tes appareils.
      </div>
    </div>
  );
}
function Splash() {
  return <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#F4F6F1", fontFamily: "'Space Grotesk',sans-serif", color: "#2C6E49", fontWeight: 800, fontSize: 22 }}>NutriSuivi…</div>;
}

/* ============ Racine ============ */
function Root() {
  if (!CONFIGURED) { window.storage = localKV; return <App />; }

  const [user, setUser] = useState(undefined);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { auth } = fb();
    return onAuthStateChanged(auth, (u) => { setUser(u || null); setReady(false); });
  }, []);

  useEffect(() => {
    if (user) {
      window.NUTRI_ACCOUNT = { email: user.email, logout: () => signOut(fb().auth) };
      window.storage = makeCloudKV(user.uid);
      window.NUTRI_SHARED_FOODS = makeSharedFoods(user.uid);
      pullFromCloud(user.uid).then(() => setReady(true));
    }
  }, [user]);

  if (user === undefined) return <Splash />;
  if (!user) return <Auth />;
  if (!ready) return <Splash />;
  return <App key={user.uid} />;
}

createRoot(document.getElementById("root")).render(React.createElement(Root));

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const reg = await navigator.serviceWorker.register("./service-worker.js");

      // Une nouvelle version est prête ? On lui dit de prendre la main, puis on recharge.
      function activateWaiting() {
        if (reg.waiting) reg.waiting.postMessage("SKIP_WAITING");
      }
      if (reg.waiting) activateWaiting();
      reg.addEventListener("updatefound", () => {
        const nw = reg.installing;
        if (!nw) return;
        nw.addEventListener("statechange", () => {
          if (nw.state === "installed" && navigator.serviceWorker.controller) activateWaiting();
        });
      });

      // Quand le nouveau SW prend le contrôle, on recharge une fois pour appliquer la nouvelle version.
      let reloaded = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (reloaded) return;
        reloaded = true;
        location.reload();
      });

      // API exposée à l'app pour le bouton "Rechercher une mise à jour" dans Profil.
      window.NUTRI_UPDATE = {
        check: async () => {
          try {
            await reg.update();
            if (reg.waiting) { activateWaiting(); return "updating"; }
            return "up-to-date";
          } catch { return "error"; }
        },
      };
    } catch {}
  });
}
