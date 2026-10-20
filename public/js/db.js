// db.js — CRUD Supabase
// Todas las operaciones de base de datos pasan por aquí.

const DB = (() => {
  let db = null;

  function init() {
    const { url, anonKey } = window.SUPABASE_CONFIG || {};
    db = supabase.createClient(url, anonKey);
  }

  // Fila → objeto boda (mismo formato que antes)
  function _aBoda(fila) {
    return { ...fila.data, id: fila.id, creadoEn: fila.creado_en, actualizadoEn: fila.actualizado_en, archivada: !!fila.archivada };
  }

  // Quita campos que no se guardan dentro de data
  function _limpiar(datos) {
    const { id, creadoEn, actualizadoEn, archivada, ...resto } = datos;
    return resto;
  }

  // Crear nueva boda — devuelve el ID generado
  async function crearBoda(datos) {
    const { data, error } = await db.from('weddings')
      .insert({ data: _limpiar(datos) })
      .select('id')
      .single();
    if (error) throw error;
    return data.id;
  }

  // Guardar boda existente por ID
  async function guardarBoda(id, datos) {
    const { error } = await db.from('weddings')
      .upsert({ id, data: _limpiar(datos), actualizado_en: new Date().toISOString() });
    if (error) throw error;
  }

  // Cargar una boda por ID
  async function cargarBoda(id) {
    const { data, error } = await db.from('weddings').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data ? _aBoda(data) : null;
  }

  // Cargar una boda para la invitación pública (sin login, solo por ID)
  async function cargarBodaPublica(id) {
    const { data, error } = await db.rpc('get_wedding_public', { p_id: id }).maybeSingle();
    if (error) throw error;
    return data ? _aBoda(data) : null;
  }

  // Listar todas las bodas (para index.html)
  async function listarBodas() {
    const { data, error } = await db.from('weddings')
      .select('*')
      .order('creado_en', { ascending: false });
    if (error) throw error;
    return data.map(_aBoda);
  }

  // Eliminar boda
  async function eliminarBoda(id) {
    const { error } = await db.from('weddings').delete().eq('id', id);
    if (error) throw error;
  }

  // Archivar / desarchivar
  async function archivarBoda(id, archivada) {
    const { error } = await db.from('weddings').update({ archivada }).eq('id', id);
    if (error) throw error;
  }

  // Duplicar como plantilla — devuelve el ID de la copia
  async function duplicarBoda(id) {
    const original = await cargarBoda(id);
    if (!original) throw new Error('Boda no encontrada');
    const copia = JSON.parse(JSON.stringify(original));
    copia.meta = { ...(copia.meta || {}), titulo: ((original.meta && original.meta.titulo) || 'Boda') + ' (copia)' };
    return crearBoda(copia);
  }

  // ── Fotos (Storage, carpeta por boda) ──

  // Reduce fotos grandes antes de subir (máx. 2400px, JPEG 85%)
  async function _comprimir(file) {
    if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size < 400 * 1024) return file;
    try {
      const img = await createImageBitmap(file);
      const escala = Math.min(1, 2400 / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * escala);
      canvas.height = Math.round(img.height * escala);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', 0.85));
      return blob && blob.size < file.size ? new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' }) : file;
    } catch (e) {
      return file;
    }
  }

  // Sube una foto a <bodaId>/ y devuelve su URL pública
  async function subirFoto(bodaId, file) {
    if (!bodaId) throw new Error('Guarda la boda antes de subir fotos.');
    const final = await _comprimir(file);
    const nombre = final.name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9.]+/g, '-');
    const ruta = bodaId + '/' + Date.now() + '-' + nombre;
    const { error } = await db.storage.from('bodas').upload(ruta, final, { contentType: final.type, cacheControl: '31536000' });
    if (error) throw error;
    return db.storage.from('bodas').getPublicUrl(ruta).data.publicUrl;
  }

  // ── Respuestas de invitados ──

  async function listarRespuestas(bodaId) {
    const [rsvps, formularios] = await Promise.all([
      db.from('rsvps').select('*').eq('boda_id', bodaId).order('enviado_en', { ascending: false }),
      db.from('formularios').select('*').eq('boda_id', bodaId).order('enviado_en', { ascending: false })
    ]);
    if (rsvps.error) throw rsvps.error;
    if (formularios.error) throw formularios.error;
    return { rsvps: rsvps.data, formularios: formularios.data };
  }

  // RSVP de invitado
  async function enviarRSVP(bodaId, { nombre, asistencia, mensaje }) {
    const { error } = await db.from('rsvps').insert({ boda_id: bodaId, nombre, asistencia, mensaje });
    if (error) throw error;
  }

  // Respuestas del formulario personalizado
  async function enviarFormulario(bodaId, respuestas) {
    const { error } = await db.from('formularios').insert({ boda_id: bodaId, respuestas });
    if (error) throw error;
  }

  // ── Auth ──

  async function login(email, password) {
    const { error } = await db.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (!(await esSuperadmin())) {
      await db.auth.signOut();
      throw new Error('Este usuario no tiene acceso de administrador.');
    }
  }

  async function logout() {
    await db.auth.signOut();
    window.location.href = 'login.html';
  }

  async function esSuperadmin() {
    const { data, error } = await db.rpc('is_superadmin');
    return !error && data === true;
  }

  // Protege páginas de administración: sin sesión de superadmin → login
  async function requireAdmin() {
    const { data } = await db.auth.getSession();
    if (data.session && (await esSuperadmin())) return data.session.user;
    const volver = encodeURIComponent(window.location.pathname.replace(/^\//, '') + window.location.search);
    window.location.replace('login.html?next=' + volver);
    return new Promise(() => {}); // detiene la carga mientras redirige
  }

  return { init, crearBoda, guardarBoda, cargarBoda, cargarBodaPublica, listarBodas, eliminarBoda, archivarBoda, duplicarBoda, subirFoto, listarRespuestas, enviarRSVP, enviarFormulario, login, logout, requireAdmin };
})();
