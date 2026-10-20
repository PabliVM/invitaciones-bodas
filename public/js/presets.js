// presets.js — Paletas de color: las mismas en el editor y en la web pública.
// Solo cambian colores; la tipografía se elige aparte (lista DEMOS.FUENTES).

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
    }
  },
  {
    id: 'medianoche',
    nombre: 'Medianoche',
    descripcion: 'Azul noche y plata',
    muestra: ['#9fb4d0', '#070b14'],
    estilos: {
      colorPrimario:   '#9fb4d0',
      colorSecundario: '#070b14',
      colorTexto:      '#e6ebf2',
      colorAccent:     '#d8c7a3',
    }
  },
];

// id 'original' = colores propios de la plantilla elegida (DEMOS.TEMAS)
function aplicarPreset(id) {
  const preset = id === 'original'
    ? { estilos: DEMOS.TEMAS[STATE.get().plantilla] || DEMOS.TEMAS.clasica }
    : PRESETS.find(p => p.id === id);
  if (!preset) return;
  const e = preset.estilos;
  STATE.actualizar(b => {
    b.estilos.colorPrimario = e.colorPrimario;
    b.estilos.colorSecundario = e.colorSecundario;
    b.estilos.colorTexto = e.colorTexto;
    b.estilos.colorAccent = e.colorAccent;
  }, 'preset');

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
  ];
  campos.forEach(function(par) {
    var el = document.getElementById(par[0]);
    if (el) el.value = par[1];
  });
}
