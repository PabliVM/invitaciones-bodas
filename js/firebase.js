// firebase.js — inicialización Firebase (CDN, sin build step)
// Proyecto: bodas-b9fb6

const firebaseConfig = {
  apiKey: "AIzaSyCG_c3EVdKElSZRLI462AzJTQfz9pOX8v8",
  authDomain: "bodas-b9fb6.firebaseapp.com",
  projectId: "bodas-b9fb6",
  storageBucket: "bodas-b9fb6.firebasestorage.app",
  messagingSenderId: "783561257826",
  appId: "1:783561257826:web:855340ea5e4fe3fd2af23b"
};

// Firebase se carga via CDN en cada HTML.
// Este archivo solo exporta la config para que db.js la use.
window.FIREBASE_CONFIG = firebaseConfig;
