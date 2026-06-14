// editor.js — Lógica del panel de edición.
// Lee inputs → actualiza STATE → RENDERER re-dibuja el preview.

const EDITOR = (() => {

  let _guardandoTimer = null;
  let _bodaId = null;

  async function init() {
    // 1. ¿Viene con ?id= en la URL? → cargar boda existente
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (id) {
      _mostrarCargando(true);
      const boda = await DB.cargarBoda(id);
      if (boda) {
        STATE.cargar(boda);
        _bodaId = id;
      }
      _mostrarCargando(false);
    }

    // 2. Rellenar el panel con los valores actuales
    _poblarPanel(STATE.get());

    // 3. Renderizar preview inicial
    _renderizarPreview();

    // 4. Suscribirse a cambios de estado
    STATE.suscribir(() => {
      _renderizarPreview();
      _guardarAutomatico();
    });

    // 5. Adjuntar eventos del panel
    _adjuntarEventos();
  }

  function _renderizarPreview() {
    const preview = document.getElementById('preview-root');
    if (preview) {
      RENDERER.render(STATE.get(), preview);
    }
  }

  // --- Poblar panel con valores del estado ---
  function _poblarPanel(boda) {
    _setVal('inp-titulo', boda.meta.titulo);
    _setVal('inp-foto-cabecera', boda.fotoCabecera || '');
    _setVal('inp-novio', boda.pareja.novio);
    _setVal('inp-novia', boda.pareja.novia);
    _setVal('inp-dia', boda.fecha.dia);
    _setVal('inp-mes', boda.fecha.mes);
    _setVal('inp-anio', boda.fecha.anio);
    _setVal('inp-hora', boda.fecha.hora);
    _setVal('inp-historia', boda.historia.texto);
    _setCheck('chk-historia', boda.historia.activa);
    _setVal('inp-galeria', boda.galeria.fotos.join('\n'));
    _setCheck('chk-galeria', boda.galeria.activa);
    _setVal('inp-musica-titulo', boda.musica ? boda.musica.titulo : '');
    _setVal('inp-musica-url', boda.musica ? boda.musica.url : '');
    _setCheck('chk-musica', boda.musica ? boda.musica.activa : true);
    _setVal('sel-musica-texto', boda.musica ? (boda.musica.mostrarTexto || 'titulo') : 'titulo');
    _setVal('inp-musica-texto-flotante', boda.musica ? boda.musica.textoFlotante : '');
    _toggleCampoPersonalizado(boda.musica ? boda.musica.mostrarTexto : 'titulo');
    _setVal('inp-lugar', boda.evento.lugar);
    _setVal('inp-direccion', boda.evento.direccion);
    _setVal('inp-maps-url', boda.evento.googleMapsUrl);
    _setCheck('chk-evento', boda.evento.activo);
    _setVal('inp-dresscode', boda.dresscode.texto);
    _setCheck('chk-dresscode', boda.dresscode.activo);
    _setVal('inp-rsvp-fecha', boda.rsvp.fechaLimite);
    _setVal('inp-rsvp-email', boda.rsvp.email);
    _setCheck('chk-rsvp', boda.rsvp.activo);
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
        STATE.set(ruta, valor);
      });
    };

    on('inp-titulo', 'meta.titulo');
    on('inp-novio', 'pareja.novio');
    on('inp-novia', 'pareja.novia');
    on('inp-dia', 'fecha.dia');
    on('inp-mes', 'fecha.mes');
    on('inp-anio', 'fecha.anio');
    on('inp-hora', 'fecha.hora');
    on('inp-historia', 'historia.texto');
    on('chk-historia', 'historia.activa');
    on('chk-musica',        'musica.activa');
    on('inp-musica-titulo', 'musica.titulo');
    on('inp-musica-url',    'musica.url');
    on('inp-musica-texto-flotante', 'musica.textoFlotante');

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
    on('inp-dresscode', 'dresscode.texto');
    on('chk-dresscode', 'dresscode.activo');
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
    document.getElementById('chk-galeria')?.addEventListener('change', (e) => {
      STATE.set('galeria.activa', e.target.checked);
    });

    // Botones del panel
    document.getElementById('btn-guardar')?.addEventListener('click', guardar);
    document.getElementById('btn-nueva')?.addEventListener('click', nuevaBoda);
    document.getElementById('btn-copiar-url')?.addEventListener('click', copiarURL);
    document.getElementById('btn-abrir-invitacion')?.addEventListener('click', abrirInvitacion);
  }

  // --- Guardar en Firebase ---
  async function guardar() {
    const boda = STATE.get();
    const btn = document.getElementById('btn-guardar');

    _setBtnEstado(btn, 'Guardando…', true);

    try {
      if (_bodaId) {
        await DB.guardarBoda(_bodaId, boda);
      } else {
        _bodaId = await DB.crearBoda(boda);
        STATE.setId(_bodaId);
        // Actualizar URL del navegador sin recargar
        history.replaceState({}, '', `editor.html?id=${_bodaId}`);
      }
      _setBtnEstado(btn, '✓ Guardado', false);
      _mostrarURLPanel(_bodaId);
      setTimeout(() => _setBtnEstado(btn, 'Guardar', false), 2000);
    } catch (err) {
      console.error('Error guardando:', err);
      _setBtnEstado(btn, 'Error al guardar', false);
      setTimeout(() => _setBtnEstado(btn, 'Guardar', false), 3000);
    }
  }

  // Autoguardado 3 segundos después del último cambio
  function _guardarAutomatico() {
    if (!_bodaId) return; // Solo si ya existe la boda
    clearTimeout(_guardandoTimer);
    _guardandoTimer = setTimeout(() => {
      DB.guardarBoda(_bodaId, STATE.get()).catch(console.error);
      _mostrarIndicador('Guardado automático');
    }, 3000);
  }

  function nuevaBoda() {
    if (!confirm('¿Crear nueva boda? Los cambios sin guardar se perderán.')) return;
    STATE.reset();
    _bodaId = null;
    history.replaceState({}, '', 'editor.html');
    _poblarPanel(STATE.get());
    _renderizarPreview();
    _ocultarURLPanel();
  }

  function copiarURL() {
    if (!_bodaId) {
      alert('Guarda primero la boda para obtener su URL.');
      return;
    }
    const url = `${window.location.origin}/invitation.html?id=${_bodaId}`;
    navigator.clipboard.writeText(url).then(() => {
      _mostrarIndicador('URL copiada al portapapeles');
    });
  }

  function abrirInvitacion() {
    if (!_bodaId) {
      alert('Guarda primero la boda.');
      return;
    }
    window.open(`invitation.html?id=${_bodaId}`, '_blank');
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

  function _mostrarURLPanel(id) {
    const panel = document.getElementById('url-panel');
    const input = document.getElementById('url-invitacion');
    if (panel && input) {
      const url = `${window.location.origin}/invitation.html?id=${id}`;
      input.value = url;
      panel.style.display = 'block';
    }
  }

  function _ocultarURLPanel() {
    const panel = document.getElementById('url-panel');
    if (panel) panel.style.display = 'none';
  }

  function _mostrarIndicador(texto) {
    const el = document.getElementById('indicador-guardado');
    if (!el) return;
    el.textContent = texto;
    el.classList.add('visible');
    setTimeout(() => el.classList.remove('visible'), 2500);
  }

  return { init };
})();

// Arrancar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  DB.init();
  EDITOR.init();
});
