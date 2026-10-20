// guardado.js — Autoguardado robusto del editor.
// - Guarda solo tras una pausa al editar, de uno en uno y siempre la última versión.
// - Boda nueva: se crea en la base de datos con el primer cambio.
// - Reintenta solo si falla la conexión. Detecta si otra pestaña/persona la cambió.
// - Copia local en el navegador por si se cierra la página antes de guardar.

const GUARDADO = (() => {
  const PAUSA = 1200;
  let _id = null;
  let _version = null;
  let _revGuardada = 0;
  let _guardando = null;
  let _timer = null;
  let _reintento = null;
  let _intentos = 0;
  let _conflicto = false;
  let _estado = 'guardado';
  let _alCrear = () => {};
  let _ultimoOk = null;

  const clave = () => 'wb-borrador:' + (_id || 'nueva');

  // ── Indicador en la barra superior ──
  function pintarEstado(estado, detalle) {
    _estado = estado;
    const el = document.getElementById('estado-guardado');
    if (!el) return;
    const textos = {
      pendiente: 'Cambios sin guardar',
      guardando: 'Guardando…',
      guardado: _ultimoOk ? '✓ Guardado' : '✓ Al día',
      error: 'Sin conexión · reintentando',
      conflicto: '⚠ Cambiada en otro sitio'
    };
    el.textContent = textos[estado] || '';
    el.className = 'estado-guardado estado-guardado--' + estado;
    el.title = detalle || (_ultimoOk ? 'Último guardado: ' + _ultimoOk.toLocaleTimeString('es-ES') : '');
  }

  function aviso(html, acciones) {
    const b = document.getElementById('aviso-editor');
    if (!b) return;
    b.innerHTML = '<span>' + html + '</span>' + (acciones || []).map((a, i) => '<button class="btn ' + (i === 0 ? 'btn--primario' : 'btn--secundario') + '" data-i="' + i + '">' + a.texto + '</button>').join('');
    b.hidden = false;
    b.querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => { b.hidden = true; acciones[+btn.dataset.i].accion(); }));
  }
  function ocultarAviso() { const b = document.getElementById('aviso-editor'); if (b) b.hidden = true; }

  // ── Copia local ──
  function guardarCopiaLocal() {
    try { localStorage.setItem(clave(), JSON.stringify({ ts: Date.now(), boda: STATE.get() })); } catch (e) { /* sin almacenamiento */ }
  }
  function borrarCopiaLocal(k) {
    try { localStorage.removeItem(k || clave()); } catch (e) { /* sin almacenamiento */ }
  }
  function leerCopiaLocal() {
    try { return JSON.parse(localStorage.getItem(clave()) || 'null'); } catch (e) { return null; }
  }

  // ── Guardar ──
  function programar() {
    clearTimeout(_timer);
    if (_conflicto) return;
    pintarEstado('pendiente');
    _timer = setTimeout(guardar, PAUSA);
  }

  let _otraVez = false;

  // Un solo guardado a la vez; si llegan cambios mientras guarda, repite al terminar
  function guardar(forzar) {
    clearTimeout(_timer);
    if (_conflicto && !forzar) return Promise.resolve();
    if (_guardando) { _otraVez = true; return _guardando; }
    _guardando = _guardarUnaVez(forzar).finally(() => {
      _guardando = null;
      if (_otraVez && !_conflicto && _estado !== 'error') { _otraVez = false; return guardar(); }
      _otraVez = false;
      if (!_conflicto && _estado !== 'error' && STATE.revision() !== _revGuardada) programar();
    });
    return _guardando;
  }

  async function _guardarUnaVez(forzar) {
    const rev = STATE.revision();
    if (rev === _revGuardada && _id && !forzar) { pintarEstado('guardado'); return; }
    pintarEstado('guardando');
    const datos = JSON.parse(JSON.stringify(STATE.get()));
    try {
      if (!_id) {
        const claveNueva = clave();
        const r = await DB.crearBodaSegura(datos);
        _id = r.id;
        _version = r.version;
        STATE.setId(_id);
        borrarCopiaLocal(claveNueva);
        _alCrear(_id);
      } else {
        _version = await DB.guardarBodaSegura(_id, datos, forzar ? null : _version);
      }
      _revGuardada = rev;
      _intentos = 0;
      _conflicto = false;
      _ultimoOk = new Date();
      if (STATE.revision() === rev) borrarCopiaLocal();
      ocultarAviso();
      pintarEstado('guardado');
    } catch (err) {
      console.error('Error guardando:', err);
      if (err.conflicto) {
        _conflicto = true;
        pintarEstado('conflicto');
        aviso('Esta boda se ha cambiado en otra pestaña o por otra persona. Tus cambios siguen aquí, sin guardar.', [
          { texto: 'Cargar la versión guardada', accion: () => { borrarCopiaLocal(); window.removeEventListener('beforeunload', _alSalir); location.reload(); } },
          { texto: 'Guardar la mía encima', accion: () => guardar(true) }
        ]);
      } else {
        _intentos++;
        pintarEstado('error', err.message);
        clearTimeout(_reintento);
        _reintento = setTimeout(() => { pintarEstado('guardando'); guardar(); }, Math.min(30000, 2000 * Math.pow(2, _intentos - 1)));
      }
    }
  }

  // Guardado inmediato (botón Guardar, Ctrl+S, antes de abrir la invitación)
  async function guardarAhora() {
    await guardar();
    if (_guardando) await _guardando;
    return _id;
  }

  const hayPendientes = () => STATE.revision() !== _revGuardada || !!_guardando;

  function _alSalir(e) {
    if (!hayPendientes()) return;
    guardarCopiaLocal();
    e.preventDefault();
    e.returnValue = '';
  }

  // ── Arranque ──
  // opciones: { id, version, alCrear(id) }
  function init(opciones) {
    _id = opciones.id || null;
    _version = opciones.version || null;
    _alCrear = opciones.alCrear || (() => {});
    _revGuardada = STATE.revision();
    pintarEstado('guardado');

    STATE.suscribir((boda, origen) => {
      if (origen === 'carga') return;
      guardarCopiaLocal();
      programar();
    });

    window.addEventListener('beforeunload', _alSalir);
    window.addEventListener('online', () => { if (_estado === 'error') guardar(); });

    // ¿Quedaron cambios sin guardar de una sesión anterior?
    const copia = leerCopiaLocal();
    const versionServidor = _version ? new Date(_version).getTime() : 0;
    if (copia && copia.boda && copia.ts > versionServidor && JSON.stringify(STATE.normalizar(copia.boda)) !== JSON.stringify(STATE.get())) {
      aviso('Hay cambios sin guardar de tu última sesión (' + new Date(copia.ts).toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) + ').', [
        { texto: 'Recuperarlos', accion: () => { STATE.cargar(Object.assign({}, copia.boda, { id: _id })); STATE.actualizar(() => {}, 'recuperado'); } },
        { texto: 'Descartar', accion: () => borrarCopiaLocal() }
      ]);
    }
  }

  return { init, guardarAhora, hayPendientes, ocultarAviso };
})();
