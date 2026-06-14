// renderer.js — Dispatcher principal + música flotante global

const RENDERER = (() => {

  function _getRenderer(id) {
    var map = {
      clasica:      typeof RENDERER_CLASICA      !== 'undefined' ? RENDERER_CLASICA      : null,
      floral:       typeof RENDERER_FLORAL       !== 'undefined' ? RENDERER_FLORAL       : null,
      moderna:      typeof RENDERER_MODERNA      !== 'undefined' ? RENDERER_MODERNA      : null,
      mediterranea: typeof RENDERER_MEDITERRANEA !== 'undefined' ? RENDERER_MEDITERRANEA : null,
    };
    return map[id] || map['clasica'] || null;
  }

  function render(boda, contenedor) {
    if (!contenedor) return;

    // Limpiar música flotante anterior
    var flotanteViejo = document.getElementById('musica-flotante-global');
    if (flotanteViejo) flotanteViejo.remove();

    var id = boda.plantilla || 'clasica';
    var r = _getRenderer(id);
    if (!r) {
      contenedor.innerHTML = '<p style="padding:32px;color:red;font-family:sans-serif">Error: renderer "' + id + '" no encontrado</p>';
      return;
    }
    r.render(boda, contenedor);

    // Añadir IDs de navegación a las secciones
    var secciones = contenedor.querySelectorAll('section');
    var ids = ['sec-portada', 'sec-countdown', 'sec-historia', 'sec-galeria', 'sec-evento', 'sec-dresscode', 'sec-rsvp', 'sec-mensaje'];
    secciones.forEach(function(sec, i) {
      if (ids[i]) sec.id = ids[i];
    });

    // Música flotante global (fuera del contenedor, fija en pantalla)
    if (boda.musica && boda.musica.activa && boda.musica.url) {
      _initMusicaFlotante(boda.musica);
    }
  }

  function _initMusicaFlotante(musica) {
    // Crear elemento flotante
    var flotante = document.createElement('div');
    flotante.id = 'musica-flotante-global';
    flotante.className = 'musica-flotante';
    flotante.innerHTML =
      '<span class="musica-flotante__titulo">' + (musica.titulo || 'Nuestra canción') + '</span>' +
      '<button class="musica-flotante__btn" id="musica-flotante-btn" aria-label="Reproducir música">' +
        '<span id="musica-flotante-icon">▶</span>' +
      '</button>' +
      '<audio id="musica-flotante-audio" src="' + musica.url + '" preload="none" loop></audio>';

    document.body.appendChild(flotante);

    var btn = document.getElementById('musica-flotante-btn');
    var audio = document.getElementById('musica-flotante-audio');
    var icon = document.getElementById('musica-flotante-icon');
    var playing = false;

    btn.addEventListener('click', function() {
      if (playing) {
        audio.pause();
        playing = false;
        icon.textContent = '▶';
        btn.classList.remove('playing');
      } else {
        audio.play().then(function() {
          playing = true;
          icon.textContent = '⏸';
          btn.classList.add('playing');
        }).catch(function(err) {
          console.warn('Audio bloqueado por el navegador:', err);
        });
      }
    });

    audio.addEventListener('ended', function() {
      playing = false;
      icon.textContent = '▶';
      btn.classList.remove('playing');
    });
  }

  return { render };
})();
