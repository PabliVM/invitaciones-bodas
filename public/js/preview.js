// preview.js — Vista previa del editor = la invitación real (invitation.html?preview=1) en un iframe.
// Modo móvil (390px) o escritorio (1280px escalado). La boda se envía por postMessage.

const PREVIEW = (() => {
  const ANCHO_ESCRITORIO = 1280;
  let _frame = null;
  let _listo = false;
  let _pendiente = null;
  let _timer = null;
  let _modo = 'movil';
  let _std = false; // true = save the date

  function _enviar() {
    if (!_listo || !_pendiente || !_frame.contentWindow) return;
    _frame.contentWindow.postMessage({ tipo: 'boda', boda: _pendiente, std: _std }, window.location.origin);
  }

  // Programa un render (agrupa cambios seguidos al escribir)
  function actualizar(boda) {
    _pendiente = JSON.parse(JSON.stringify(boda));
    clearTimeout(_timer);
    _timer = setTimeout(_enviar, 120);
  }

  function _ajustar() {
    const zona = document.querySelector('.editor-preview');
    const marco = document.getElementById('preview-marco');
    if (!zona || !marco || !_frame) return;
    if (_modo === 'movil') {
      marco.style.width = marco.style.height = '';
      _frame.style.width = _frame.style.height = _frame.style.transform = '';
      return;
    }
    const disponibleW = zona.clientWidth - 48;
    const disponibleH = zona.clientHeight - 110;
    const escala = Math.min(1, disponibleW / ANCHO_ESCRITORIO);
    const altoFrame = Math.max(600, Math.min(900, disponibleH / escala));
    _frame.style.width = ANCHO_ESCRITORIO + 'px';
    _frame.style.height = altoFrame + 'px';
    _frame.style.transform = 'scale(' + escala + ')';
    marco.style.width = Math.round(ANCHO_ESCRITORIO * escala) + 'px';
    marco.style.height = Math.round(altoFrame * escala) + 'px';
  }

  // Desplaza la vista previa hasta una sección y la resalta
  // (la sección 'std' cambia a la vista del save the date; cualquier otra vuelve a la invitación)
  function irA(seccion) {
    if (!_listo || !_frame.contentWindow) return;
    const std = seccion === 'std';
    if (std !== _std) {
      verSaveTheDate(std);
      setTimeout(() => irA(seccion), 350);
      return;
    }
    _frame.contentWindow.postMessage({ tipo: 'ir', seccion: std ? 'portada' : seccion }, window.location.origin);
  }

  function verSaveTheDate(activo) {
    _std = !!activo;
    document.querySelectorAll('.preview-vista button').forEach(b => b.classList.toggle('activo', (b.dataset.vista === 'std') === _std));
    _enviar();
  }

  function cambiarModo(modo) {
    _modo = modo;
    document.querySelectorAll('.preview-modos button').forEach(b => b.classList.toggle('activo', b.dataset.modo === modo));
    const marco = document.getElementById('preview-marco');
    if (marco) marco.classList.toggle('preview-phone--escritorio', modo === 'escritorio');
    _ajustar();
  }

  function init() {
    _frame = document.getElementById('preview-frame');
    if (!_frame) return;
    window.addEventListener('message', e => {
      if (e.origin !== window.location.origin || e.source !== _frame.contentWindow) return;
      if (e.data && e.data.tipo === 'preview-listo') { _listo = true; _enviar(); }
    });
    _frame.src = 'invitation.html?preview=1';
    document.querySelectorAll('.preview-modos button').forEach(b => b.addEventListener('click', () => cambiarModo(b.dataset.modo)));
    document.querySelectorAll('.preview-vista button').forEach(b => b.addEventListener('click', () => verSaveTheDate(b.dataset.vista === 'std')));
    window.addEventListener('resize', _ajustar);
  }

  return { init, actualizar, cambiarModo, irA, verSaveTheDate };
})();
