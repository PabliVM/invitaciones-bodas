// state.js — Estado en memoria. Una sola fuente de verdad.
// - normalizar(): completa y corrige datos antiguos o incompletos al cargar.
// - set()/actualizar(): toda edición pasa por aquí y avisa a los suscriptores
//   (vista previa, guardado, paneles). El "origen" permite a un panel no
//   repintarse con sus propios cambios (no pierde el foco al escribir).
// - Historial para deshacer / rehacer.

const STATE = (() => {

  // Fecha por defecto de una boda nueva: dentro de un año
  function fechaDentroDeUnAnio() {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return { dia: String(d.getDate()).padStart(2, '0'), mes: String(d.getMonth() + 1).padStart(2, '0'), anio: String(d.getFullYear()) };
  }

  const defaultBoda = () => {
    const f = fechaDentroDeUnAnio();
    const limite = new Date(+f.anio, +f.mes - 2, +f.dia);
    return {
      v: 2,
      meta: { titulo: 'Nueva boda' },
      plantilla: 'clasica',
      fotoCabecera: '',  // URL de la foto principal de portada
      encuadres: {},     // URL de foto → punto importante ('50% 30%'), para recortar bien en móvil y ordenador
      pareja: { novio: 'Alejandro', novia: 'Sofía' },
      fecha: { dia: f.dia, mes: f.mes, anio: f.anio, hora: '12:30' },
      historia: {
        activa: true,
        titulo: 'Nuestra historia',
        texto: 'Nos conocimos en un momento inesperado y desde entonces supimos que nuestros caminos estaban unidos para siempre.',
        subsecciones: []
      },
      galeria: {
        activa: true,
        titulo: 'Nuestra galería',
        fotos: ['/assets/demo/pareja-1.jpg', '/assets/demo/pareja-2.jpg'],
        subsecciones: []
      },
      musica: {
        activa: false,
        titulo: 'Nuestra canción',
        url: '',
        textoFlotante: '',
        mostrarTexto: 'titulo',
        inicio: 0,          // segundo en el que empieza a sonar
        bienvenida: false,  // pantalla "Abrir invitación" que arranca la música
      },
      evento: {
        activo: true,
        titulo: 'La celebración',
        lugar: '',
        direccion: '',
        googleMapsUrl: '',
        subsecciones: []
      },
      dresscode: { activo: true, titulo: 'Dress code', texto: 'Elegante. Tonos claros bienvenidos.', subsecciones: [] },
      alojamiento: { activo: false, titulo: 'Alojamiento', texto: '', subsecciones: [] },
      transporte: { activo: false, titulo: 'Transporte', texto: '', subsecciones: [] },
      secciones_extra: [], // { uid, titulo, texto, subsecciones }
      orden_secciones: ['historia', 'galeria', 'evento', 'dresscode', 'alojamiento', 'transporte', 'rsvp', 'mensaje', 'formulario'], // predefinidas + 'extra_<uid>'
      formulario: {
        activo: false,
        titulo: 'Cuestionario',
        descripcion: '',
        textoBtnEnviar: 'Enviar',
        mensajeConfirmacion: '¡Gracias! Hemos recibido tus respuestas.',
        preguntas: [],
        // { id, texto, tipo: 'texto'|'opcion_unica'|'opcion_multiple'|'numero', opciones: [], obligatoria }
      },
      rsvp: {
        activo: true, titulo: 'Confirma tu asistencia', email: '', subsecciones: [],
        fechaLimite: limite.getFullYear() + '-' + String(limite.getMonth() + 1).padStart(2, '0') + '-' + String(limite.getDate()).padStart(2, '0')
      },
      mensaje: { activo: true, titulo: 'Mensaje final', texto: 'Vuestra presencia es el mejor regalo.', subsecciones: [] },
      estilos: {
        colorPrimario: '#b8860b',
        colorSecundario: '#f5f0e8',
        colorTexto: '#2c2c2c',
        colorAccent: '#8b6914',
        fuente: 'Cormorant Garamond',
        fuenteSecundaria: 'Lato',
      },
    };
  };

  const uid = () => Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-3);
  const esObjeto = v => v && typeof v === 'object' && !Array.isArray(v);
  const copia = v => JSON.parse(JSON.stringify(v));

  // Rellena lo que falte con los valores por defecto (sin pisar lo existente)
  function completar(base, datos) {
    const out = esObjeto(datos) ? { ...datos } : {};
    Object.keys(base).forEach(k => {
      if (out[k] === undefined || out[k] === null) out[k] = copia(base[k]);
      else if (esObjeto(base[k]) && esObjeto(out[k])) out[k] = completar(base[k], out[k]);
      else if (Array.isArray(base[k]) && !Array.isArray(out[k])) out[k] = copia(base[k]);
    });
    return out;
  }

  // Corrige datos antiguos/incompletos para que el editor y la invitación no fallen
  function normalizar(datos) {
    const b = completar(defaultBoda(), datos);
    const texto = v => (v == null ? '' : String(v));
    ['dia', 'mes', 'anio', 'hora'].forEach(k => { b.fecha[k] = texto(b.fecha[k]); });
    b.galeria.fotos = b.galeria.fotos.map(texto).map(s => s.trim()).filter(Boolean);
    ['historia', 'galeria', 'evento', 'dresscode', 'alojamiento', 'transporte', 'rsvp', 'mensaje'].forEach(id => {
      if (!Array.isArray(b[id].subsecciones)) b[id].subsecciones = [];
    });

    // Secciones extra con identificador estable (antes se identificaban por posición)
    const mapaViejo = {};
    b.secciones_extra = (Array.isArray(b.secciones_extra) ? b.secciones_extra : []).map((s, i) => {
      const sec = { titulo: '', texto: '', subsecciones: [], ...(esObjeto(s) ? s : {}) };
      if (!sec.uid) sec.uid = uid();
      if (!Array.isArray(sec.subsecciones)) sec.subsecciones = [];
      mapaViejo['extra_' + i] = 'extra_' + sec.uid;
      return sec;
    });
    const uids = b.secciones_extra.map(s => 'extra_' + s.uid);

    // Orden: traducir referencias antiguas, quitar duplicados/inexistentes, añadir lo que falte
    const validas = ['historia', 'galeria', 'evento', 'dresscode', 'alojamiento', 'transporte', 'rsvp', 'mensaje', 'formulario'];
    let orden = (Array.isArray(b.orden_secciones) ? b.orden_secciones : []).map(id => mapaViejo[id] && !uids.includes(id) ? mapaViejo[id] : id);
    orden = orden.filter((id, i) => orden.indexOf(id) === i && (validas.includes(id) || uids.includes(id)));
    validas.concat(uids).forEach(id => { if (!orden.includes(id)) orden.push(id); });
    b.orden_secciones = orden;

    // Preguntas con id y opciones válidas
    b.formulario.preguntas = (Array.isArray(b.formulario.preguntas) ? b.formulario.preguntas : []).map(q => ({
      id: (q && q.id) || 'p' + uid(),
      texto: texto(q && q.texto),
      tipo: ['texto', 'opcion_unica', 'opcion_multiple', 'numero'].includes(q && q.tipo) ? q.tipo : 'texto',
      opciones: Array.isArray(q && q.opciones) ? q.opciones.map(texto) : [],
      obligatoria: !!(q && q.obligatoria)
    }));
    // Encuadres: solo valores 'X% Y%' válidos
    const enc = esObjeto(b.encuadres) ? b.encuadres : {};
    b.encuadres = {};
    Object.keys(enc).forEach(k => { if (/^\d{1,3}% \d{1,3}%$/.test(enc[k])) b.encuadres[k] = enc[k]; });
    b.v = 2;
    return b;
  }

  let _boda = normalizar({});
  let _id = null;
  let _listeners = [];
  let _revision = 0;

  // ── Historial (deshacer / rehacer) ──
  const MAX_HISTORIAL = 60;
  let _pasado = [];
  let _futuro = [];
  let _ultimaFoto = JSON.stringify(_boda);
  let _timerFoto = null;

  // Guarda una "foto" del estado tras una pausa al editar (agrupa pulsaciones)
  function _programarFoto() {
    clearTimeout(_timerFoto);
    _timerFoto = setTimeout(_tomarFoto, 700);
  }
  function _tomarFoto() {
    clearTimeout(_timerFoto);
    const actual = JSON.stringify(_boda);
    if (actual === _ultimaFoto) return;
    _pasado.push(_ultimaFoto);
    if (_pasado.length > MAX_HISTORIAL) _pasado.shift();
    _futuro = [];
    _ultimaFoto = actual;
  }
  function _reiniciarHistorial() {
    clearTimeout(_timerFoto);
    _pasado = [];
    _futuro = [];
    _ultimaFoto = JSON.stringify(_boda);
  }

  function deshacer() {
    _tomarFoto();
    if (!_pasado.length) return false;
    _futuro.push(_ultimaFoto);
    _ultimaFoto = _pasado.pop();
    _boda = JSON.parse(_ultimaFoto);
    _revision++;
    _notificar('historial');
    return true;
  }
  function rehacer() {
    if (!_futuro.length) return false;
    _pasado.push(_ultimaFoto);
    _ultimaFoto = _futuro.pop();
    _boda = JSON.parse(_ultimaFoto);
    _revision++;
    _notificar('historial');
    return true;
  }
  const puedeDeshacer = () => _pasado.length > 0 || JSON.stringify(_boda) !== _ultimaFoto;
  const puedeRehacer = () => _futuro.length > 0;

  // ── API ──

  function get() { return _boda; }
  function getId() { return _id; }
  function setId(id) { _id = id; }
  function revision() { return _revision; }

  // Cambia un valor por ruta ('evento.lugar'); crea objetos intermedios si faltan
  function set(ruta, valor, origen) {
    const partes = ruta.split('.');
    let obj = _boda;
    for (let i = 0; i < partes.length - 1; i++) {
      if (!esObjeto(obj[partes[i]])) obj[partes[i]] = {};
      obj = obj[partes[i]];
    }
    obj[partes[partes.length - 1]] = valor;
    _cambio(origen);
  }

  // Cambios más complejos: actualizar(b => { b.formulario.preguntas.push(...) }, 'formulario')
  function actualizar(mutador, origen) {
    mutador(_boda);
    _cambio(origen);
  }

  function _cambio(origen) {
    _revision++;
    _programarFoto();
    _notificar(origen);
  }

  // Carga una boda guardada (no cuenta como cambio del usuario)
  function cargar(datos) {
    _boda = normalizar(datos);
    _id = datos.id || null;
    _reiniciarHistorial();
    _notificar('carga');
  }

  function reset() { _boda = normalizar({}); _id = null; _reiniciarHistorial(); _notificar('carga'); }

  // fn(boda, origen) — origen: 'carga' | 'historial' | nombre del panel que cambió | undefined
  function suscribir(fn) {
    _listeners.push(fn);
    return () => { _listeners = _listeners.filter(l => l !== fn); };
  }

  function _notificar(origen) { _listeners.forEach(fn => fn(_boda, origen)); }

  return { get, getId, setId, set, actualizar, cargar, reset, suscribir, revision, normalizar, deshacer, rehacer, puedeDeshacer, puedeRehacer, nuevoUid: uid };
})();
