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
    return { ...fila.data, id: fila.id, creadoEn: fila.creado_en, actualizadoEn: fila.actualizado_en };
  }

  // Quita campos que no se guardan dentro de data
  function _limpiar(datos) {
    const { id, creadoEn, actualizadoEn, ...resto } = datos;
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

  return { init, crearBoda, guardarBoda, cargarBoda, listarBodas, eliminarBoda, enviarRSVP, enviarFormulario };
})();
