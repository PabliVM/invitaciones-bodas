// firebase.js — inicialización Firebase (CDN, sin build step)
// Proyecto: invitaciones-e768f

const firebaseConfig = {
  apiKey: "AIzaSyD2DJfvlVs3uw11H2r4TYJ5-tbbTMqdWuQ",
  authDomain: "invitaciones-e768f.firebaseapp.com",
  projectId: "invitaciones-e768f",
  storageBucket: "invitaciones-e768f.firebasestorage.app",
  messagingSenderId: "429462791386",
  appId: "1:429462791386:web:2fed974c1b9ed421e771e3"
};

// Firebase se carga via CDN en cada HTML.
// Este archivo solo exporta la config para que db.js la use.
window.FIREBASE_CONFIG = firebaseConfig;
