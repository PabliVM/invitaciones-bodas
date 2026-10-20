// editor.js — Lógica del panel de edición.
// Lee inputs → actualiza STATE → PREVIEW re-dibuja la invitación real en el iframe.

const EDITOR = (() => {

  let _bodaId = null;

  // Secciones con campo "Foto (URL)" → se guarda en boda[seccion].foto
  const SECCIONES_CON_FOTO = ['historia', 'galeria', 'evento', 'dresscode', 'rsvp', 'mensaje', 'alojamiento', 'transporte'];

  async function init() {
    PREVIEW.init();
    const id = new URLSearchParams(window.location.search).get('id');
    let version = null;

    if (id) {
      _mostrarCargando(true);
      let boda = null;
      try { boda = await DB.cargarBoda(id); } catch (err) { console.error(err); }
      _mostrarCargando(false);
      if (!boda) {
        document.body.innerHTML = '<div class="cargando" style="padding-top:30vh">No se ha encontrado esta boda. <a href="index.html">Volver al panel</a></div>';
        return;
      }
      STATE.cargar(boda);
      _bodaId = id;
      version = boda.actualizadoEn;
    }

    _poblarPanel(STATE.get());
    _actualizarURL();
    _renderizarPreview();

    GUARDADO.init({
      id: _bodaId,
      version,
      alCrear: nuevoId => {
        _bodaId = nuevoId;
        history.replaceState({}, '', 'editor.html?id=' + nuevoId);
        _actualizarURL();
      }
    });

    // Vista previa siempre; el panel se repinta entero solo si el cambio no vino de él
    STATE.suscribir((boda, origen) => {
      _renderizarPreview();
      if (origen === 'carga' || origen === 'historial' || origen === 'recuperado') _poblarPanel(boda);
      _actualizarBotonesHistorial();
    });

    _adjuntarEventos();
    _actualizarBotonesHistorial();
    REVISION.init();
    FOCO.init();
    ORDEN.init();
    ENCUADRE.init();
  }

  function _renderizarPreview() {
    PREVIEW.actualizar(STATE.get());
  }

  // --- Poblar panel con valores del estado ---
  function _poblarPanel(boda) {
    _setVal('inp-titulo', boda.meta.titulo);
    _setVal('inp-foto-cabecera', boda.fotoCabecera || '');
    SECCIONES_CON_FOTO.forEach(s => _setVal('inp-foto-' + s, boda[s] ? boda[s].foto : ''));
    _setVal('inp-novio', boda.pareja.novio);
    _setVal('inp-novia', boda.pareja.novia);
    _setVal('inp-dia', boda.fecha.dia);
    _setVal('inp-mes', boda.fecha.mes);
    _setVal('inp-anio', boda.fecha.anio);
    _setVal('inp-hora', boda.fecha.hora);
    _setVal('inp-titulo-historia', boda.historia.titulo || 'Nuestra historia');
    _setVal('inp-historia', boda.historia.texto);
    _setCheck('chk-historia', boda.historia.activa);
    _setVal('inp-titulo-galeria', boda.galeria.titulo || 'Nuestra galería');
    _setVal('inp-galeria', boda.galeria.fotos.join('\n'));
    _setCheck('chk-galeria', boda.galeria.activa);
    _setVal('inp-musica-titulo', boda.musica ? boda.musica.titulo : '');
    _setVal('inp-musica-url', boda.musica ? boda.musica.url : '');
    _setCheck('chk-musica', boda.musica ? boda.musica.activa : true);
    _setVal('sel-musica-texto', boda.musica ? (boda.musica.mostrarTexto || 'titulo') : 'titulo');
    _setVal('inp-musica-texto-flotante', boda.musica ? boda.musica.textoFlotante : '');
    _toggleCampoPersonalizado(boda.musica ? boda.musica.mostrarTexto : 'titulo');
    _setVal('inp-musica-inicio', _aMinutos(boda.musica.inicio));
    _setCheck('chk-musica-bienvenida', boda.musica.bienvenida);
    _sincronizarReproductor(boda);
    _setVal('inp-titulo-evento', boda.evento.titulo || 'La celebración');
    _setVal('inp-lugar', boda.evento.lugar);
    _setVal('inp-direccion', boda.evento.direccion);
    _setVal('inp-maps-url', boda.evento.googleMapsUrl);
    _setCheck('chk-evento', boda.evento.activo);
    _setVal('inp-titulo-dresscode', boda.dresscode.titulo || 'Dress code');
    if (boda.alojamiento) {
      _setVal('inp-titulo-alojamiento', boda.alojamiento.titulo || 'Alojamiento');
      _setVal('inp-alojamiento', boda.alojamiento.texto || '');
      _setCheck('chk-alojamiento', boda.alojamiento.activo);
    }
    if (boda.transporte) {
      _setVal('inp-titulo-transporte', boda.transporte.titulo || 'Transporte');
      _setVal('inp-transporte', boda.transporte.texto || '');
      _setCheck('chk-transporte', boda.transporte.activo);
    }
    _setVal('inp-dresscode', boda.dresscode.texto);
    _setCheck('chk-dresscode', boda.dresscode.activo);
    _setVal('inp-titulo-rsvp', boda.rsvp.titulo || 'Confirma tu asistencia');
    _setVal('inp-rsvp-fecha', boda.rsvp.fechaLimite);
    _setVal('inp-rsvp-email', boda.rsvp.email);
    _setCheck('chk-rsvp', boda.rsvp.activo);
    _setVal('inp-titulo-mensaje', boda.mensaje.titulo || 'Mensaje final');
    _setVal('inp-mensaje', boda.mensaje.texto);
    _setCheck('chk-mensaje', boda.mensaje.activo);
    _setVal('inp-color-primario', boda.estilos.colorPrimario);
    _setVal('inp-color-secundario', boda.estilos.colorSecundario);
    _setVal('inp-color-texto', boda.estilos.colorTexto);
    _setVal('inp-color-accent', boda.estilos.colorAccent);
    _setVal('sel-fuente', boda.estilos.fuente);
  }

  // --- Adjuntar eventos a los inputs del panel ---
  function _adjuntarEventos() {

    // Helper: escuchar input + change en un elemento
    const on = (id, ruta, transform) => {
      const el = document.getElementById(id);
      if (!el) return;
      const tipo = el.type === 'checkbox' ? 'change' : 'input';
      el.addEventListener(tipo, () => {
        const valor = el.type === 'checkbox'
          ? el.checked
          : (transform ? transform(el.value) : el.value);
        STATE.set(ruta, valor, 'panel');
      });
    };

    on('inp-titulo',        'meta.titulo');
    on('inp-foto-cabecera', 'fotoCabecera');
    SECCIONES_CON_FOTO.forEach(s => on('inp-foto-' + s, s + '.foto'));
    on('inp-novio', 'pareja.novio');
    on('inp-novia', 'pareja.novia');
    on('inp-dia', 'fecha.dia');
    on('inp-mes', 'fecha.mes');
    on('inp-anio', 'fecha.anio');
    on('inp-hora', 'fecha.hora');
    on('inp-titulo-historia', 'historia.titulo');
    on('inp-titulo-evento',   'evento.titulo');
    on('inp-titulo-rsvp',     'rsvp.titulo');
    on('inp-titulo-mensaje',  'mensaje.titulo');
    on('inp-historia', 'historia.texto');
    on('chk-historia', 'historia.activa');
    on('chk-musica',        'musica.activa');
    on('inp-musica-titulo', 'musica.titulo');
    on('inp-musica-url',    'musica.url');
    on('inp-musica-texto-flotante', 'musica.textoFlotante');

    on('chk-musica-bienvenida', 'musica.bienvenida');
    on('inp-musica-inicio', 'musica.inicio', _aSegundos);

    // Reproductor de prueba: empieza donde se ha elegido; "Usar el punto actual" fija el inicio
    const prueba = document.getElementById('audio-prueba');
    if (prueba) {
      prueba.addEventListener('play', () => {
        const inicio = +STATE.get().musica.inicio || 0;
        if (inicio && prueba.currentTime < 0.5) prueba.currentTime = inicio;
      });
      document.getElementById('btn-musica-inicio')?.addEventListener('click', () => {
        const seg = Math.floor(prueba.currentTime || 0);
        _setVal('inp-musica-inicio', _aMinutos(seg));
        STATE.set('musica.inicio', seg, 'panel');
      });
    }
    STATE.suscribir(boda => _sincronizarReproductor(boda));

    var selMusica = document.getElementById('sel-musica-texto');
    if (selMusica) {
      selMusica.addEventListener('change', function() {
        STATE.set('musica.mostrarTexto', selMusica.value);
        _toggleCampoPersonalizado(selMusica.value);
      });
    }
    on('inp-lugar', 'evento.lugar');
    on('inp-direccion', 'evento.direccion');
    on('inp-maps-url', 'evento.googleMapsUrl');
    on('chk-evento', 'evento.activo');
    on('inp-titulo-dresscode', 'dresscode.titulo');
    on('inp-titulo-alojamiento', 'alojamiento.titulo');
    on('inp-alojamiento',        'alojamiento.texto');
    on('chk-alojamiento', 'alojamiento.activo');
    on('inp-titulo-transporte',  'transporte.titulo');
    on('inp-transporte',         'transporte.texto');
    on('chk-transporte', 'transporte.activo');

    // Sync orden cuando cambia activo de alojamiento/transporte
    ['chk-alojamiento','chk-transporte'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('change', function() {
        if (typeof ORDEN !== 'undefined') setTimeout(ORDEN.sincronizar, 100);
      });
    });
    on('inp-dresscode',        'dresscode.texto');
    on('chk-dresscode',        'dresscode.activo');
    on('inp-rsvp-fecha', 'rsvp.fechaLimite');
    on('inp-rsvp-email', 'rsvp.email');
    on('chk-rsvp', 'rsvp.activo');
    on('inp-mensaje', 'mensaje.texto');
    on('chk-mensaje', 'mensaje.activo');
    on('inp-color-primario', 'estilos.colorPrimario');
    on('inp-color-secundario', 'estilos.colorSecundario');
    on('inp-color-texto', 'estilos.colorTexto');
    on('inp-color-accent', 'estilos.colorAccent');
    on('sel-fuente', 'estilos.fuente');

    // Galería: texto plano, una URL por línea
    const inpGaleria = document.getElementById('inp-galeria');
    if (inpGaleria) {
      inpGaleria.addEventListener('input', () => {
        const fotos = inpGaleria.value
          .split('\n')
          .map(l => l.trim())
          .filter(Boolean);
        STATE.set('galeria.fotos', fotos);
      });
    }
    on('inp-titulo-galeria', 'galeria.titulo');
    document.getElementById('chk-galeria')?.addEventListener('change', (e) => {
      STATE.set('galeria.activa', e.target.checked);
    });

    // Botones del panel
    document.getElementById('btn-guardar')?.addEventListener('click', guardarAhora);
    document.getElementById('btn-abrir-invitacion')?.addEventListener('click', abrirInvitacion);
    document.getElementById('btn-deshacer')?.addEventListener('click', () => STATE.deshacer());
    document.getElementById('btn-rehacer')?.addEventListener('click', () => STATE.rehacer());

    document.addEventListener('keydown', e => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      const k = e.key.toLowerCase();
      if (k === 's') { e.preventDefault(); guardarAhora(); }
      // Deshacer propio solo fuera de campos de texto (dentro, el navegador deshace lo escrito)
      const enCampo = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement && document.activeElement.tagName);
      if (k === 'z' && !enCampo) { e.preventDefault(); e.shiftKey ? STATE.rehacer() : STATE.deshacer(); }
      if (k === 'y' && !enCampo) { e.preventDefault(); STATE.rehacer(); }
    });
  }

  async function guardarAhora() {
    const btn = document.getElementById('btn-guardar');
    _setBtnEstado(btn, 'Guardando…', true);
    await GUARDADO.guardarAhora();
    _setBtnEstado(btn, GUARDADO.hayPendientes() ? 'Guardar' : '✓ Guardado', false);
    setTimeout(() => _setBtnEstado(btn, 'Guardar', false), 1800);
  }

  // Abre la invitación real (si es nueva, la guarda antes para tener enlace)
  async function abrirInvitacion() {
    const ventana = window.open('about:blank', '_blank');
    const id = _bodaId || await GUARDADO.guardarAhora();
    if (!id) { if (ventana) ventana.close(); alert('No se pudo guardar la boda. Revisa la conexión.'); return; }
    const url = 'invitation.html?id=' + id;
    if (ventana) ventana.location = url; else window.location.href = url;
  }

  function _actualizarBotonesHistorial() {
    const d = document.getElementById('btn-deshacer');
    const r = document.getElementById('btn-rehacer');
    if (d) d.disabled = !STATE.puedeDeshacer();
    if (r) r.disabled = !STATE.puedeRehacer();
  }

  // Enlace para compartir (campo "URL del cliente")
  function _actualizarURL() {
    const input = document.getElementById('url-invitacion');
    if (input) input.value = _bodaId ? window.location.origin + '/invitation.html?id=' + _bodaId : 'Se genera al guardar';
  }

  // --- Helpers UI ---
  function _setVal(id, valor) {
    const el = document.getElementById(id);
    if (el) el.value = valor || '';
  }

  function _setCheck(id, valor) {
    const el = document.getElementById(id);
    if (el) el.checked = !!valor;
  }

  function _setBtnEstado(btn, texto, desactivado) {
    if (!btn) return;
    btn.textContent = texto;
    btn.disabled = desactivado;
  }

  function _mostrarCargando(visible) {
    const el = document.getElementById('editor-cargando');
    if (el) el.style.display = visible ? 'flex' : 'none';
  }

  function _mostrarIndicador(texto) {
    const el = document.getElementById('indicador-guardado');
    if (!el) return;
    el.textContent = texto;
    el.classList.add('visible');
    setTimeout(() => el.classList.remove('visible'), 2500);
  }

  // "1:25" → 85 · 85 → "1:25"
  function _aSegundos(txt) {
    const p = String(txt || '').trim().split(':').map(n => parseInt(n, 10) || 0);
    return Math.max(0, p.length > 1 ? p[0] * 60 + p[1] : p[0]);
  }
  function _aMinutos(seg) {
    seg = Math.max(0, Math.floor(+seg || 0));
    return seg ? Math.floor(seg / 60) + ':' + String(seg % 60).padStart(2, '0') : '';
  }

  // Muestra el reproductor de prueba cuando hay canción
  function _sincronizarReproductor(boda) {
    const caja = document.getElementById('musica-prueba');
    const audio = document.getElementById('audio-prueba');
    if (!caja || !audio) return;
    const src = (boda.musica && boda.musica.url || '').trim();
    caja.hidden = !src;
    if (src && audio.getAttribute('src') !== src) audio.setAttribute('src', src);
    if (!src) audio.removeAttribute('src');
  }

  function _toggleCampoPersonalizado(valor) {
    var campo = document.getElementById('campo-musica-personalizado');
    if (campo) campo.style.display = (valor === 'personalizado') ? 'flex' : 'none';
  }

  return { init };
})();

// Arrancar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
  DB.init();
  await DB.requireAdmin();
  EDITOR.init();
});
