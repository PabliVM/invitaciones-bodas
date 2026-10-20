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
  },
  {
    id: 'acuarela',
    nombre: 'Acuarela',
    descripcion: 'Rosa empolvado y salvia',
    muestra: ['#c98a8a', '#fbf6f3'],
    estilos: {
      colorPrimario:   '#c98a8a',
      colorSecundario: '#fbf6f3',
      colorTexto:      '#4a3a3a',
      colorAccent:     '#7a8f7c',
      fuente:          'Cormorant Garamond',
      fuenteSecundaria:'Lato',
    }
  },
  {
    id: 'editorial',
    nombre: 'Editorial',
    descripcion: 'Tinta y terracota',
    muestra: ['#1b1b1b', '#f4f1ec'],
    estilos: {
      colorPrimario:   '#1b1b1b',
      colorSecundario: '#f4f1ec',
      colorTexto:      '#1b1b1b',
      colorAccent:     '#b0532f',
      fuente:          'Playfair Display',
      fuenteSecundaria:'Lato',
    }
  },
  {
    id: 'noche',
    nombre: 'Noche dorada',
    descripcion: 'Negro y oro',
    muestra: ['#c9a45c', '#0f0e0c'],
    estilos: {
      colorPrimario:   '#c9a45c',
      colorSecundario: '#0f0e0c',
      colorTexto:      '#efe7d6',
      colorAccent:     '#e3c88e',
      fuente:          'Cormorant Garamond',
      fuenteSecundaria:'Lato',
    }
  },
  {
    id: 'medianoche',
    nombre: 'Medianoche',
    descripcion: 'Azul noche y plata',
    muestra: ['#9fb4d0', '#0e1726'],
    estilos: {
      colorPrimario:   '#9fb4d0',
      colorSecundario: '#0e1726',
      colorTexto:      '#e6ebf2',
      colorAccent:     '#d8c7a3',
      fuente:          'Playfair Display',
      fuenteSecundaria:'Raleway',
    }
  },
  {
    id: 'oliva',
    nombre: 'Verde oliva',
    descripcion: 'Oliva y arena',
    muestra: ['#6b7a3a', '#f3f1e7'],
    estilos: {
      colorPrimario:   '#6b7a3a',
      colorSecundario: '#f3f1e7',
      colorTexto:      '#2f3320',
      colorAccent:     '#c2a26b',
      fuente:          'Cormorant Garamond',
      fuenteSecundaria:'Lato',
    }
  },
  {
    id: 'terracota',
    nombre: 'Terracota',
    descripcion: 'Barro y ocre',
    muestra: ['#b5502f', '#f7ece4'],
    estilos: {
      colorPrimario:   '#b5502f',
      colorSecundario: '#f7ece4',
      colorTexto:      '#3b2219',
      colorAccent:     '#e0a96d',
      fuente:          'Playfair Display',
      fuenteSecundaria:'Lato',
    }
  },
  {
    id: 'lavanda',
    nombre: 'Lavanda',
    descripcion: 'Lila y malva',
    muestra: ['#7d6aa8', '#f4f1f8'],
    estilos: {
      colorPrimario:   '#7d6aa8',
      colorSecundario: '#f4f1f8',
      colorTexto:      '#2e2840',
      colorAccent:     '#c7a7c9',
      fuente:          'Cormorant Garamond',
      fuenteSecundaria:'Lato',
    }
  },
  {
    id: 'empolvado',
    nombre: 'Azul empolvado',
    descripcion: 'Azul suave y beige',
    muestra: ['#5d7fa3', '#eef3f7'],
    estilos: {
      colorPrimario:   '#5d7fa3',
      colorSecundario: '#eef3f7',
      colorTexto:      '#1f2e3d',
      colorAccent:     '#c9b28a',
      fuente:          'EB Garamond',
      fuenteSecundaria:'Lato',
    }
  },
  {
    id: 'burdeos',
    nombre: 'Burdeos',
    descripcion: 'Vino y dorado',
    muestra: ['#7b1e32', '#f8f1ee'],
    estilos: {
      colorPrimario:   '#7b1e32',
      colorSecundario: '#f8f1ee',
      colorTexto:      '#2e1418',
      colorAccent:     '#c69c6d',
      fuente:          'Playfair Display',
      fuenteSecundaria:'Lato',
    }
  },
  {
    id: 'esmeralda',
    nombre: 'Esmeralda',
    descripcion: 'Verde noche y oro',
    muestra: ['#d4b06a', '#0f2a24'],
    estilos: {
      colorPrimario:   '#d4b06a',
      colorSecundario: '#0f2a24',
      colorTexto:      '#ecf2ee',
      colorAccent:     '#8fbfa8',
      fuente:          'Cormorant Garamond',
      fuenteSecundaria:'Lato',
    }
  },
  {
    id: 'melocoton',
    nombre: 'Melocotón',
    descripcion: 'Coral y salvia',
    muestra: ['#e0896a', '#fff3ec'],
    estilos: {
      colorPrimario:   '#e0896a',
      colorSecundario: '#fff3ec',
      colorTexto:      '#4a2f26',
      colorAccent:     '#9aae8f',
      fuente:          'Lora',
      fuenteSecundaria:'Lato',
    }
  },
  {
    id: 'mostaza',
    nombre: 'Mostaza',
    descripcion: 'Ocre y verde bosque',
    muestra: ['#c99a2e', '#faf5e8'],
    estilos: {
      colorPrimario:   '#c99a2e',
      colorSecundario: '#faf5e8',
      colorTexto:      '#2d2a1f',
      colorAccent:     '#4f6d5a',
      fuente:          'Libre Baskerville',
      fuenteSecundaria:'Lato',
    }
  },
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
