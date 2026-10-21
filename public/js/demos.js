// demos.js — Bodas de ejemplo para la web pública (invitation.html?demo=<plantilla>).
// No usa base de datos: los formularios de las demos no envían nada.

const DEMOS = (() => {

  const TEMAS = {
    clasica:      { colorPrimario: '#b8860b', colorSecundario: '#f5f0e8', colorTexto: '#2c2c2c', colorAccent: '#8b6914', fuente: 'Cormorant Garamond', fuenteSecundaria: 'Lato' },
    floral:       { colorPrimario: '#c4788a', colorSecundario: '#f9f4f0', colorTexto: '#3d2b2b', colorAccent: '#7a9e7e', fuente: 'Playfair Display', fuenteSecundaria: 'Lato' },
    moderna:      { colorPrimario: '#1a1a1a', colorSecundario: '#ffffff', colorTexto: '#1a1a1a', colorAccent: '#8a8a8a', fuente: 'Libre Baskerville', fuenteSecundaria: 'Lato' },
    mediterranea: { colorPrimario: '#2c5f8a', colorSecundario: '#faf7f2', colorTexto: '#1e3a52', colorAccent: '#c4a882', fuente: 'EB Garamond', fuenteSecundaria: 'Lato' },
    deco:         { colorPrimario: '#c9a45c', colorSecundario: '#0f0e0c', colorTexto: '#efe7d6', colorAccent: '#e3c88e', fuente: 'Cormorant Garamond', fuenteSecundaria: 'Josefin Sans' },
    acuarela:     { colorPrimario: '#c98a8a', colorSecundario: '#fbf6f3', colorTexto: '#4a3a3a', colorAccent: '#7a8f7c', fuente: 'Cormorant Garamond', fuenteSecundaria: 'Lato' },
    revista:      { colorPrimario: '#1b1b1b', colorSecundario: '#f4f1ec', colorTexto: '#1b1b1b', colorAccent: '#b0532f', fuente: 'Playfair Display', fuenteSecundaria: 'Lato' },
    boho:         { colorPrimario: '#c17a52', colorSecundario: '#fdf6ee', colorTexto: '#3d2b1f', colorAccent: '#8b6348', fuente: 'Cormorant Garamond', fuenteSecundaria: 'Josefin Sans' }
  };

  const PAREJAS = {
    clasica:      ['Lucía', 'Daniel', 'Palacio de los Duques', 'Calle Mayor 12, Madrid'],
    floral:       ['Marta', 'Javier', 'Jardines de la Quinta', 'Camino del Prado s/n, Segovia'],
    moderna:      ['Irene', 'Pablo', 'Espacio Nave 9', 'Calle de la Industria 9, Barcelona'],
    mediterranea: ['Elena', 'Marcos', 'Hacienda Cala Blanca', 'Ctra. del Faro km 3, Mallorca'],
    deco:         ['Carla', 'Hugo', 'Gran Hotel Inglés', 'Calle Echegaray 8, Madrid'],
    acuarela:     ['Sara', 'Álvaro', 'Masía Can Roure', 'Camí de la Font 21, Girona'],
    revista:      ['Noa', 'Bruno', 'Galería Lumen', 'Calle del Arte 40, Valencia'],
    boho:         ['Alba', 'Mateo', 'Finca El Olivar', 'Camino de los Almendros 7, Granada']
  };

  // Tipografías de títulos: las mismas en el editor (sel-fuente) y en la web
  const FUENTES = ['Cormorant Garamond', 'Playfair Display', 'EB Garamond', 'Lora', 'Great Vibes', 'Dancing Script',
    'Parisienne', 'Josefin Sans', 'Montserrat', 'Raleway', 'Libre Baskerville'];

  // Otros eventos (con música y pantalla de bienvenida): se montan sobre un modelo
  const MUSICA_DEMO = { activa: true, titulo: 'Nuestra canción', url: '/assets/demo/musica-demo.mp3', mostrarTexto: 'titulo', inicio: 0, bienvenida: true };
  const EVENTOS = {
    bautizo: b => Object.assign(b, {
      tipoEvento: 'bautizo', fotoCabecera: '',
      pareja: { novio: 'Lucas', novia: '' },
      fecha: { dia: '12', mes: '09', anio: '2027', hora: '12:00' },
      historia: { activa: true, titulo: 'Bienvenido, Lucas', texto: 'Llegó en primavera y lo cambió todo. Queremos compartir con vosotros este día tan especial.', subsecciones: [] },
      galeria: { activa: false, fotos: [] },
      evento: { activo: true, titulo: 'La celebración', lugar: 'Parroquia de San Miguel', direccion: 'Plaza Mayor 3, Toledo', googleMapsUrl: 'https://maps.google.com/?q=Toledo', subsecciones: [
        { titulo: 'Bautizo', texto: '12:00 h · Parroquia de San Miguel' }, { titulo: 'Comida', texto: '14:00 h · Restaurante El Jardín' }] },
      dresscode: { activo: false }, alojamiento: { activo: false }, transporte: { activo: false },
      mensaje: { activo: true, titulo: 'Gracias', texto: '¡Os esperamos para celebrarlo juntos!', subsecciones: [] },
      formulario: { activo: false, preguntas: [] },
      musica: Object.assign({}, MUSICA_DEMO, { titulo: 'La canción de Lucas' })
    }),
    cumple: b => Object.assign(b, {
      tipoEvento: 'cumpleanos', fotoCabecera: '',
      pareja: { novio: 'Elena · 40', novia: '' },
      fecha: { dia: '23', mes: '10', anio: '2027', hora: '21:00' },
      historia: { activa: true, titulo: 'Cuarenta y fabulosa', texto: 'Una noche para celebrar con las personas que más quiero. Cena, música y baile hasta que el cuerpo aguante.', subsecciones: [] },
      galeria: { activa: false, fotos: [] },
      evento: { activo: true, titulo: 'La fiesta', lugar: 'Terraza Lumière', direccion: 'Calle Alcalá 120, Madrid', googleMapsUrl: 'https://maps.google.com/?q=Madrid', subsecciones: [
        { titulo: 'Cena', texto: '21:00 h' }, { titulo: 'Fiesta', texto: '23:30 h · DJ' }] },
      dresscode: { activo: true, titulo: 'Dress code', texto: 'Un toque dorado o brillante.', subsecciones: [] },
      alojamiento: { activo: false }, transporte: { activo: false },
      mensaje: { activo: true, titulo: 'Te espero', texto: '¡Sin ti no sería lo mismo!', subsecciones: [] },
      formulario: { activo: true, titulo: 'Para la fiesta', descripcion: '', textoBtnEnviar: 'Enviar', mensajeConfirmacion: '¡Gracias!', preguntas: [
        { id: 'cancion', texto: 'La canción que no puede faltar', tipo: 'texto', obligatoria: false }] },
      musica: Object.assign({}, MUSICA_DEMO, { titulo: 'Música de la fiesta' })
    })
  };
  const MODELO_EVENTO = { bautizo: 'acuarela', cumple: 'deco' };

  function boda(plantilla) {
    if (EVENTOS[plantilla]) return EVENTOS[plantilla](boda(MODELO_EVENTO[plantilla]));
    const id = TEMAS[plantilla] ? plantilla : 'clasica';
    const [novia, novio, lugar, direccion] = PAREJAS[id];
    // Alterna las fotos de portada entre estilos para que los ejemplos no se repitan
    const par = Object.keys(TEMAS).indexOf(id) % 2 === 1;
    const fotoA = par ? '/assets/demo/pareja-2.jpg' : '/assets/demo/pareja-1.jpg';
    const fotoB = par ? '/assets/demo/pareja-1.jpg' : '/assets/demo/pareja-2.jpg';
    return {
      id: 'demo-' + id,
      plantilla: id,
      estilos: Object.assign({}, TEMAS[id]),
      meta: { titulo: 'Demo ' + id },
      fotoCabecera: fotoA,
      pareja: { novio: novia, novia: novio },
      fecha: { dia: '19', mes: '06', anio: '2027', hora: '18:00' },
      historia: {
        activa: true, titulo: 'Nuestra historia', foto: fotoB,
        texto: 'Nos conocimos una tarde de verano, sin buscarnos. Diez años, tres mudanzas y mil viajes después, queremos celebrar contigo el comienzo de nuestra vida juntos.',
        subsecciones: []
      },
      galeria: { activa: true, titulo: 'Momentos', fotos: ['/assets/demo/pareja-1.jpg', '/assets/demo/pareja-2.jpg', '/assets/demo/pareja-1-s.jpg'], subsecciones: [] },
      musica: { activa: false },
      evento: { activo: true, titulo: 'La celebración', lugar, direccion, googleMapsUrl: 'https://maps.google.com/?q=' + encodeURIComponent(lugar), subsecciones: [
        { titulo: 'Ceremonia', texto: '18:00 h · Jardín principal' },
        { titulo: 'Cóctel y cena', texto: '19:30 h · Salón de los espejos' }
      ] },
      dresscode: { activo: true, titulo: 'Dress code', texto: 'Etiqueta de verano. Os pedimos evitar el blanco.', subsecciones: [] },
      alojamiento: { activo: true, titulo: 'Alojamiento', texto: 'Hemos reservado habitaciones a precio especial en el hotel más cercano. Menciona nuestra boda al reservar.', subsecciones: [] },
      transporte: { activo: true, titulo: 'Transporte', texto: 'Habrá autobuses de ida y vuelta desde el centro de la ciudad.', subsecciones: [] },
      rsvp: { activo: true, titulo: 'Confirma tu asistencia', fechaLimite: '2027-05-15', subsecciones: [] },
      mensaje: { activo: true, titulo: 'Mensaje final', texto: 'Vuestra presencia es el mejor regalo. ¡Os esperamos!', subsecciones: [] },
      formulario: {
        activo: true, titulo: 'Cuéntanos', descripcion: 'Nos ayuda a preparar cada detalle.', textoBtnEnviar: 'Enviar respuestas',
        mensajeConfirmacion: '¡Gracias! Lo tenemos en cuenta.',
        preguntas: [
          { id: 'menu', texto: '¿Qué menú prefieres?', tipo: 'opcion_unica', opciones: ['Carne', 'Pescado', 'Vegetariano'], obligatoria: true },
          { id: 'alergias', texto: '¿Alguna alergia o intolerancia?', tipo: 'texto', obligatoria: false },
          { id: 'cancion', texto: 'Una canción que no puede faltar', tipo: 'texto', obligatoria: false }
        ]
      },
      secciones_extra: [],
      orden_secciones: ['historia', 'galeria', 'evento', 'dresscode', 'alojamiento', 'transporte', 'rsvp', 'formulario', 'mensaje']
    };
  }

  return { FUENTES, boda, TEMAS, PLANTILLAS: Object.keys(TEMAS), MODELO_EVENTO };
})();
