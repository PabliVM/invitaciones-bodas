// state.js — Estado en memoria. Una sola fuente de verdad.

const STATE = (() => {
  const defaultBoda = () => ({
    meta: { titulo: 'Nueva boda' },
    plantilla: 'clasica',
    pareja: { novio: 'Alejandro', novia: 'Sofía' },
    fecha: { dia: '14', mes: '09', anio: '2025', hora: '12:30' },
    historia: {
      activa: true,
      texto: 'Nos conocimos en un momento inesperado y desde entonces supimos que nuestros caminos estaban unidos para siempre.',
    },
    galeria: {
      activa: true,
      fotos: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
      ],
    },
    musica: {
      activa: true,
      url: '',
      titulo: 'Nuestra canción',
    },
    evento: {
      activo: true,
      lugar: 'Finca La Alameda',
      direccion: 'Ctra. de Burgos, km 24, Madrid',
      googleMapsUrl: 'https://maps.google.com',
    },
    dresscode: { activo: true, texto: 'Elegante. Tonos claros bienvenidos.' },
    rsvp: { activo: true, fechaLimite: '2025-08-01', email: 'boda@ejemplo.com' },
    mensaje: { activo: true, texto: 'Vuestra presencia es el mejor regalo.' },
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
