// state.js — Estado en memoria. Una sola fuente de verdad.

const STATE = (() => {
  const defaultBoda = () => ({
    meta: { titulo: 'Nueva boda' },
    plantilla: 'clasica',
    fotoCabecera: '',  // URL de la foto principal de portada
    pareja: { novio: 'Alejandro', novia: 'Sofía' },
    fecha: { dia: '14', mes: '09', anio: '2025', hora: '12:30' },
    historia: {
      activa: true,
      titulo: 'Nuestra historia',
      texto: 'Nos conocimos en un momento inesperado y desde entonces supimos que nuestros caminos estaban unidos para siempre.',
      subsecciones: []
    },
    galeria: {
      activa: true,
      titulo: 'Nuestra galería',
      fotos: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
      ],
      subsecciones: []
    },
    musica: {
      activa: true,
      titulo: 'Nuestra canción',
      url: '',
      titulo: 'Nuestra canción',
      textoFlotante: '',
      mostrarTexto: 'titulo',
    },
    evento: {
      activo: true,
      titulo: 'La celebración',
      lugar: 'Finca La Alameda',
      direccion: 'Ctra. de Burgos, km 24, Madrid',
      googleMapsUrl: 'https://maps.google.com',
      subsecciones: []
    },
    dresscode: { activo: true, titulo: 'Dress code', texto: 'Elegante. Tonos claros bienvenidos.' ,
      subsecciones: []},
    alojamiento: {
      activo: false,
      titulo: 'Alojamiento',
      texto: '',
      subsecciones: [],
    },
    transporte: {
      activo: false,
      titulo: 'Transporte',
      texto: '',
      subsecciones: [],
    },
    secciones_extra: [], // secciones completamente libres
    orden_secciones: ['historia','galeria','evento','dresscode','alojamiento','transporte','rsvp','mensaje'], // orden editable
    formulario: {
      activo: false,
      titulo: 'Formulario',
      descripcion: '',
      textoBtnEnviar: 'Enviar',
      mensajeConfirmacion: '¡Gracias! Hemos recibido tus respuestas.',
      preguntas: [],
      // Estructura de cada pregunta:
      // { id, texto, tipo: 'texto'|'opcion_unica'|'opcion_multiple'|'numero', opciones: [], obligatoria: true }
    },
    rsvp: { activo: true, titulo: 'Confirma tu asistencia', fechaLimite: '2025-08-01', email: 'boda@ejemplo.com' ,
      subsecciones: []},
    mensaje: { activo: true, titulo: 'Mensaje final', texto: 'Vuestra presencia es el mejor regalo.' ,
      subsecciones: []},
    estilos: {
      colorPrimario: '#b8860b',
      colorSecundario: '#f5f0e8',
      colorTexto: '#2c2c2c',
      colorAccent: '#8b6914',
      fuente: 'Cormorant Garamond',
      fuenteSecundaria: 'Lato',
    },
  });

  let _boda = defaultBoda();
  let _id = null;
  let _listeners = [];

  function get() { return _boda; }
  function getId() { return _id; }
  function setId(id) { _id = id; }

  function set(ruta, valor) {
    const partes = ruta.split('.');
    let obj = _boda;
    for (let i = 0; i < partes.length - 1; i++) obj = obj[partes[i]];
    obj[partes[partes.length - 1]] = valor;
    _notificar();
  }

  function cargar(datos) {
    _boda = { ...defaultBoda(), ...datos };
    _id = datos.id || null;
    _notificar();
  }

  function reset() { _boda = defaultBoda(); _id = null; _notificar(); }

  function suscribir(fn) {
    _listeners.push(fn);
    return () => { _listeners = _listeners.filter(l => l !== fn); };
  }

  function _notificar() { _listeners.forEach(fn => fn(_boda)); }

  return { get, getId, setId, set, cargar, reset, suscribir };
})();
