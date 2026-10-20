// foco.js — Une el panel con la vista previa y adapta el editor al móvil.
// - Al abrir o editar una sección del panel, la vista previa salta a ella.
// - En pantallas estrechas el editor se divide en pestañas: Contenido · Diseño · Vista previa.

const FOCO = (() => {
  const SECCIONES = ['historia', 'galeria', 'evento', 'dresscode', 'rsvp', 'mensaje', 'alojamiento', 'transporte', 'formulario'];
  let _actual = null;
  let _timer = null;

  // Sección de la invitación que corresponde a un subapartado del panel
  function seccionDeSub(sub) {
    if (!sub) return null;
    if (sub.dataset.seccion !== undefined) return sub.dataset.seccion || null;
    let sec = '';
    const chk = sub.querySelector('.eb-sub__cab input[type="checkbox"][id^="chk-"]');
    if (chk && SECCIONES.indexOf(chk.id.slice(4)) !== -1) sec = chk.id.slice(4);
    else if (sub.querySelector('#inp-novio')) sec = 'portada';
    sub.dataset.seccion = sec;
    return sec || null;
  }

  // Sección de un elemento cualquiera del panel (incluye secciones personalizadas)
  function seccionDe(el) {
    const extra = el.closest && el.closest('.sec-item--extra');
    if (extra) {
      const i = Array.prototype.indexOf.call(document.querySelectorAll('#secciones-panel .sec-item--extra'), extra);
      const sec = (STATE.get().secciones_extra || [])[i];
      return sec && sec.uid ? 'extra_' + sec.uid : null;
    }
    return seccionDeSub(el.closest && el.closest('.eb-sub'));
  }

  function ir(seccion, forzar) {
    if (!seccion || (seccion === _actual && !forzar)) return;
    _actual = seccion;
    clearTimeout(_timer);
    _timer = setTimeout(() => PREVIEW.irA(seccion), 120);
  }

  // ── Pestañas en móvil ──
  function vista(nombre) {
    document.body.dataset.vista = nombre;
    document.querySelectorAll('#editor-pestanas [data-vista]').forEach(b => b.classList.toggle('activo', b.dataset.vista === nombre));
    if (nombre === 'vista') {
      window.dispatchEvent(new Event('resize')); // reajusta la vista previa ahora que es visible
      if (_actual) setTimeout(() => PREVIEW.irA(_actual), 150);
    }
  }

  // Muestra la pestaña donde está un elemento (lo usa la revisión)
  function mostrarPestanaDe(el) {
    if (!el || !document.body.dataset.vista) return;
    if (el.closest('.editor-panel-right')) vista('diseno');
    else if (el.closest('.editor-panel')) vista('contenido');
  }

  function init() {
    const panel = document.querySelector('.editor-panel');
    if (panel) {
      // Abrir un subapartado → ir a su sección
      panel.addEventListener('click', e => {
        const cab = e.target.closest('.eb-sub__cab, .sec-item__header');
        if (cab) ir(seccionDe(cab), true);
      });
      // Escribir en un campo → ir a su sección (si cambia)
      panel.addEventListener('focusin', e => ir(seccionDe(e.target)));
    }
    document.querySelectorAll('#editor-pestanas [data-vista]').forEach(b => b.addEventListener('click', () => vista(b.dataset.vista)));
    vista('contenido');
  }

  return { init, ir, vista, mostrarPestanaDe };
})();
