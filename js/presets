// presets.js — Presets de estilo para la invitación.
// Cada preset define colores y tipografía.

const PRESETS = [
  {
    id: 'clasica',
    nombre: 'Clásica',
    descripcion: 'Crema y dorado',
    muestra: ['#b8860b', '#f5f0e8'],
    estilos: {
      colorPrimario:   '#b8860b',
      colorSecundario: '#f5f0e8',
      colorTexto:      '#2c2c2c',
      colorAccent:     '#8b6914',
      fuente:          'Cormorant Garamond',
      fuenteSecundaria:'Lato',
    }
  },
  {
    id: 'moderna',
    nombre: 'Moderna',
    descripcion: 'Negro y blanco',
    muestra: ['#1a1a1a', '#ffffff'],
    estilos: {
      colorPrimario:   '#1a1a1a',
      colorSecundario: '#ffffff',
      colorTexto:      '#1a1a1a',
      colorAccent:     '#555555',
      fuente:          'Libre Baskerville',
      fuenteSecundaria:'Lato',
    }
  },
  {
    id: 'romantica',
    nombre: 'Romántica',
    descripcion: 'Rosa y verde salvia',
    muestra: ['#c4788a', '#f9f4f0'],
    estilos: {
      colorPrimario:   '#c4788a',
      colorSecundario: '#f9f4f0',
      colorTexto:      '#3d2b2b',
      colorAccent:     '#7a9e7e',
      fuente:          'Playfair Display',
      fuenteSecundaria:'Lato',
    }
  },
  {
    id: 'mediterranea',
    nombre: 'Mediterránea',
    descripcion: 'Azul y arena',
    muestra: ['#2c5f8a', '#faf7f2'],
    estilos: {
      colorPrimario:   '#2c5f8a',
      colorSecundario: '#faf7f2',
      colorTexto:      '#1e3a52',
      colorAccent:     '#c4a882',
      fuente:          'EB Garamond',
      fuenteSecundaria:'Lato',
    }
  },
  {
    id: 'boho',
    nombre: 'Boho',
    descripcion: 'Terracota y crudo',
    muestra: ['#c17a52', '#fdf6ee'],
    estilos: {
      colorPrimario:   '#c17a52',
      colorSecundario: '#fdf6ee',
      colorTexto:      '#3d2b1f',
      colorAccent:     '#8b6348',
      fuente:          'Cormorant Garamond',
      fuenteSecundaria:'Lato',
    }
  },
  {
    id: 'minimalista',
    nombre: 'Minimalista',
    descripcion: 'Gris y blanco roto',
    muestra: ['#4a4a4a', '#fafafa'],
    estilos: {
      colorPrimario:   '#4a4a4a',
      colorSecundario: '#fafafa',
      colorTexto:      '#2a2a2a',
      colorAccent:     '#888888',
      fuente:          'Libre Baskerville',
      fuenteSecundaria:'Lato',
    }
  }
];

function aplicarPreset(id) {
  const preset = PRESETS.find(p => p.id === id);
  if (!preset) return;
  const e = preset.estilos;
  STATE.set('estilos.colorPrimario',    e.colorPrimario);
  STATE.set('estilos.colorSecundario',  e.colorSecundario);
  STATE.set('estilos.colorTexto',       e.colorTexto);
  STATE.set('estilos.colorAccent',      e.colorAccent);
  STATE.set('estilos.fuente',           e.fuente);
  STATE.set('estilos.fuenteSecundaria', e.fuenteSecundaria);

  // Sincronizar inputs del panel
  _syncInputsPreset(e);
}

function _syncInputsPreset(e) {
  var campos = [
    ['inp-color-primario',   e.colorPrimario],
    ['inp-color-secundario', e.colorSecundario],
    ['inp-color-texto',      e.colorTexto],
    ['inp-color-accent',     e.colorAccent],
    ['inp-color-primario-picker',   e.colorPrimario],
    ['inp-color-secundario-picker', e.colorSecundario],
    ['inp-color-texto-picker',      e.colorTexto],
    ['inp-color-accent-picker',     e.colorAccent],
    ['sel-fuente',           e.fuente],
  ];
  campos.forEach(function(par) {
    var el = document.getElementById(par[0]);
    if (el) el.value = par[1];
  });
}
