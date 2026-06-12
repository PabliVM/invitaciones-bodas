// db.js — CRUD Firestore
// Todas las operaciones de base de datos pasan por aquí.

const DB = (() => {
  let db = null;

  function init() {
    const app = firebase.initializeApp(window.FIREBASE_CONFIG);
    db = firebase.firestore(app);
  }

  // Crear nueva boda — devuelve el ID generado
  async function crearBoda(datos) {
    const ref = await db.collection('weddings').add({
      ...datos,
      creadoEn: firebase.firestore.FieldValue.serverTimestamp(),
      actualizadoEn: firebase.firestore.FieldValue.serverTimestamp()
    });
    return ref.id;
  }

  // Guardar boda existente por ID
  async function guardarBoda(id, datos) {
    await db.collection('weddings').doc(id).set({
      ...datos,
      actualizadoEn: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  }

  // Cargar una boda por ID
  async function cargarBoda(id) {
    const doc = await db.collection('weddings').doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  // Listar todas las bodas (para index.html)
  async function listarBodas() {
    const snapshot = await db.collection('weddings')
      .orderBy('creadoEn', 'desc')
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Eliminar boda
  async function eliminarBoda(id) {
    await db.collection('weddings').doc(id).delete();
  }

  return { init, crearBoda, guardarBoda, cargarBoda, listarBodas, eliminarBoda };
})();
