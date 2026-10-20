// revision.js — Revisión de la invitación antes de enviarla.
// Detecta errores (impiden que salga bien) y avisos (mejorables). Cada punto
// lleva al campo exacto del editor. También marca en rojo los campos con error.

const REVISION = (() => {
  const _imagenes = {}; // url → 'ok' | 'error' | 'cargando'
  let _timer = null;
  let _ultimos = [];

  const vacio = v => !String(v == null ? '' : v).trim();
  const esUrl = v => /^https?:\/\/\S+\.\S+/i.test(String(v || '').trim()) || /^\/\S+/.test(String(v || '').trim());
  const activa = s => !!s && s.activo !== false && s.activa !== false;

  // Contraste WCAG entre dos colores hex
  function luminancia(hex) {
    const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim());
    if (!m) return null;
    const n = parseInt(m[1], 16);
    const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function contraste(a, b) {
    const la = luminancia(a), lb = luminancia(b);
    if (la == null || lb == null) return 21;
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  }

  // Comprueba en segundo plano que cada foto carga
  function comprobarImagen(url) {
    if (!url || _imagenes[url]) return;
    _imagenes[url] = 'cargando';
    const img = new Image();
    img.onload = () => { _imagenes[url] = 'ok'; programar(); };
    img.onerror = () => { _imagenes[url] = 'error'; programar(); };
    img.src = url;
  }

  function analizar(b) {
    const r = [];
    const err = (texto, campo) => r.push({ nivel: 'error', texto, campo });
    const avi = (texto, campo) => r.push({ nivel: 'aviso', texto, campo });
    const p = b.pareja || {}, f = b.fecha || {};

    // Pareja y fecha
    if (vacio(p.novio)) err('Falta el primer nombre de la pareja', 'inp-novio');
    if (vacio(p.novia)) err('Falta el segundo nombre de la pareja', 'inp-novia');
    if (p.novio === 'Alejandro' && p.novia === 'Sofía') avi('Los nombres son los de ejemplo', 'inp-novio');
    const dia = +f.dia, mes = +f.mes, anio = +f.anio;
    const fecha = new Date(anio, mes - 1, dia);
    const fechaOk = /^\d{4}$/.test(String(f.anio)) && fecha.getFullYear() === anio && fecha.getMonth() === mes - 1 && fecha.getDate() === dia;
    if (!fechaOk) err('La fecha de la boda no es válida (día, mes y año)', !(dia >= 1 && dia <= 31) ? 'inp-dia' : !(mes >= 1 && mes <= 12) ? 'inp-mes' : 'inp-anio');
    else if (fecha < new Date(new Date().toDateString())) avi('La fecha de la boda ya ha pasado', 'inp-anio');
    if (vacio(f.hora)) avi('Falta la hora de la boda', 'inp-hora');
    if (vacio(b.meta && b.meta.titulo)) avi('Falta el título interno (para tu lista de bodas)', 'inp-titulo');

    // Fotos
    if (vacio(b.fotoCabecera)) avi('No hay foto de portada', 'inp-foto-cabecera');
    const fotos = [['inp-foto-cabecera', b.fotoCabecera]];
    ['historia', 'galeria', 'evento', 'dresscode', 'rsvp', 'mensaje', 'alojamiento', 'transporte'].forEach(id => {
      if (b[id] && b[id].foto) fotos.push(['inp-foto-' + id, b[id].foto]);
    });
    (b.galeria.fotos || []).forEach(u => fotos.push(['inp-galeria', u]));
    let deEjemplo = false;
    fotos.forEach(([campo, url]) => {
      if (vacio(url)) return;
      if (!esUrl(url)) { err('Hay una foto con un enlace no válido', campo); return; }
      if (url.indexOf('/assets/demo/') !== -1) deEjemplo = true;
      comprobarImagen(url);
      if (_imagenes[url] === 'error') err('Una foto no se puede cargar (enlace roto)', campo);
    });
    if (deEjemplo) avi('Quedan fotos de ejemplo: cámbialas por las de la pareja', 'inp-galeria');
    if (activa(b.galeria) && !(b.galeria.fotos || []).length) avi('La galería está activa pero no tiene fotos', 'inp-galeria');

    // Evento
    if (activa(b.evento)) {
      if (vacio(b.evento.lugar)) err('Falta el nombre del lugar de la celebración', 'inp-lugar');
      if (vacio(b.evento.direccion)) avi('Falta la dirección del lugar', 'inp-direccion');
      if (vacio(b.evento.googleMapsUrl)) avi('Sin enlace de Google Maps no aparece el botón "Cómo llegar"', 'inp-maps-url');
      else if (!esUrl(b.evento.googleMapsUrl)) err('El enlace de Google Maps no es válido', 'inp-maps-url');
    }

    // Confirmación de asistencia
    if (activa(b.rsvp)) {
      if (vacio(b.rsvp.fechaLimite)) avi('No hay fecha límite para confirmar asistencia', 'inp-rsvp-fecha');
      else {
        const lim = new Date(b.rsvp.fechaLimite + 'T00:00');
        if (fechaOk && lim > fecha) err('La fecha límite para confirmar es posterior a la boda', 'inp-rsvp-fecha');
        else if (lim < new Date(new Date().toDateString())) avi('La fecha límite para confirmar ya ha pasado', 'inp-rsvp-fecha');
      }
    }

    // Textos de secciones activas
    if (activa(b.historia) && vacio(b.historia.texto)) avi('La historia está activa pero sin texto', 'inp-historia');
    if (activa(b.dresscode) && vacio(b.dresscode.texto)) avi('El dress code está activo pero sin texto', 'inp-dresscode');
    if (activa(b.alojamiento) && vacio(b.alojamiento.texto)) avi('Alojamiento está activo pero sin texto', 'inp-alojamiento');
    if (activa(b.transporte) && vacio(b.transporte.texto)) avi('Transporte está activo pero sin texto', 'inp-transporte');
    if (activa(b.mensaje) && vacio(b.mensaje.texto)) avi('El mensaje final está activo pero sin texto', 'inp-mensaje');
    (b.secciones_extra || []).forEach((s, i) => { if (vacio(s.titulo)) avi('La sección personalizada ' + (i + 1) + ' no tiene título', 'secciones-panel'); });

    // Música
    if (activa(b.musica) && vacio(b.musica.url)) err('La música está activa pero falta el enlace del MP3', 'inp-musica-url');
    else if (activa(b.musica) && !esUrl(b.musica.url)) err('El enlace de la música no es válido', 'inp-musica-url');
    else if (activa(b.musica) && !/\.(mp3|m4a|aac|ogg|wav)(\?|$)/i.test(b.musica.url)) avi('El enlace de la música no parece un archivo de audio (.mp3)', 'inp-musica-url');
    if (activa(b.musica) && !b.musica.bienvenida) avi('Sin pantalla de bienvenida, en el móvil la música solo suena si el invitado pulsa ♪', 'chk-musica-bienvenida');

    // Cuestionario
    if (b.formulario && b.formulario.activo) {
      const qs = b.formulario.preguntas || [];
      if (!qs.length) err('El cuestionario está activo pero no tiene preguntas', 'formulario-panel');
      qs.forEach((q, i) => {
        if (vacio(q.texto)) err('La pregunta ' + (i + 1) + ' del cuestionario está vacía', 'formulario-panel');
        if ((q.tipo === 'opcion_unica' || q.tipo === 'opcion_multiple') && (q.opciones || []).filter(o => !vacio(o)).length < 2)
          err('La pregunta ' + (i + 1) + ' necesita al menos 2 opciones', 'formulario-panel');
      });
    }

    // Legibilidad
    const e = b.estilos || {};
    if (contraste(e.colorTexto, e.colorSecundario) < 4.5) avi('El color del texto se lee mal sobre el fondo', 'inp-color-texto');
    if (contraste(e.colorPrimario, e.colorSecundario) < 1.8) avi('El color primario apenas se distingue del fondo', 'inp-color-primario');

    return r;
  }

  // ── Interfaz ──

  function pintar() {
    const lista = analizar(STATE.get());
    _ultimos = lista;
    const errores = lista.filter(x => x.nivel === 'error').length;
    const avisos = lista.length - errores;

    const btn = document.getElementById('btn-revisar');
    if (btn) {
      btn.className = 'btn btn-revisar ' + (errores ? 'btn-revisar--error' : avisos ? 'btn-revisar--aviso' : 'btn-revisar--ok');
      btn.textContent = errores ? '✕ ' + errores + (errores === 1 ? ' error' : ' errores') : avisos ? '! ' + avisos + (avisos === 1 ? ' aviso' : ' avisos') : '✓ Lista para enviar';
    }

    // Campos en rojo
    document.querySelectorAll('.campo--error').forEach(el => el.classList.remove('campo--error'));
    lista.filter(x => x.nivel === 'error').forEach(x => { const el = document.getElementById(x.campo); if (el && el.tagName !== 'DIV') el.classList.add('campo--error'); });

    const caja = document.getElementById('revision-lista');
    if (caja && !caja.hidden) pintarLista();
  }

  function pintarLista() {
    const caja = document.getElementById('revision-lista');
    if (!caja) return;
    const items = _ultimos.slice().sort((a, b) => (a.nivel === 'error' ? 0 : 1) - (b.nivel === 'error' ? 0 : 1));
    caja.innerHTML = '<div class="revision__cab"><strong>Revisión de la invitación</strong><button class="revision__cerrar" aria-label="Cerrar">✕</button></div>' +
      (items.length
        ? '<ul>' + items.map((x, i) => '<li><button class="revision__item revision__item--' + x.nivel + '" data-i="' + i + '"><span>' + (x.nivel === 'error' ? '✕' : '!') + '</span>' + x.texto + '</button></li>').join('') + '</ul>'
        : '<p class="revision__ok">✓ Todo correcto. La invitación está lista para enviar.</p>');
    caja.querySelector('.revision__cerrar').addEventListener('click', () => { caja.hidden = true; });
    caja.querySelectorAll('.revision__item').forEach(bt => bt.addEventListener('click', () => irA(items[+bt.dataset.i].campo)));
  }

  // Abre el bloque/subapartado que contiene el campo, lo enfoca y lo resalta
  function irA(id) {
    const el = document.getElementById(id);
    if (!el) return;
    if (typeof FOCO !== 'undefined') FOCO.mostrarPestanaDe(el);
    let p = el.parentElement;
    while (p) {
      if (p.classList.contains('eb-sub')) p.classList.add('eb-sub--abierto');
      if (p.classList.contains('eb-bloque')) p.classList.add('eb-bloque--abierto');
      p = p.parentElement;
    }
    setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (el.focus && el.tagName !== 'DIV') el.focus({ preventScroll: true });
      el.classList.remove('campo--resaltar');
      void el.offsetWidth;
      el.classList.add('campo--resaltar');
    }, 60);
  }

  function programar() {
    clearTimeout(_timer);
    _timer = setTimeout(pintar, 400);
  }

  function init() {
    const btn = document.getElementById('btn-revisar');
    const caja = document.getElementById('revision-lista');
    if (btn && caja) btn.addEventListener('click', () => { caja.hidden = !caja.hidden; if (!caja.hidden) pintarLista(); });
    document.addEventListener('click', e => {
      if (caja && !caja.hidden && !caja.contains(e.target) && e.target !== btn) caja.hidden = true;
    });
    STATE.suscribir(programar);
    pintar();
  }

  return { init, analizar, irA };
})();
