// renderer.js — Genera el HTML de la invitación desde el estado.

const RENDERER = (() => {

  function render(boda, contenedor) {
    if (!contenedor) return;
    _aplicarVariablesCSS(boda.estilos);
    contenedor.innerHTML = _buildHTML(boda);
    _initCountdown(boda.fecha, contenedor);
    _initMusica(contenedor);
  }

  function _aplicarVariablesCSS(estilos) {
    const root = document.documentElement;
    root.style.setProperty('--color-primario', estilos.colorPrimario);
    root.style.setProperty('--color-secundario', estilos.colorSecundario);
    root.style.setProperty('--color-texto', estilos.colorTexto);
    root.style.setProperty('--color-accent', estilos.colorAccent);
    root.style.setProperty('--fuente-display', "'" + estilos.fuente + "', serif");
    root.style.setProperty('--fuente-body', "'" + estilos.fuenteSecundaria + "', sans-serif");
  }

  function _buildHTML(boda) {
    const secciones = [];
    secciones.push(_portada(boda));
    secciones.push(_countdown(boda.fecha));
    if (boda.musica && boda.musica.activa && boda.musica.url) {
      secciones.push(_musica(boda.musica));
    }
    if (boda.historia.activa) secciones.push(_historia(boda.historia));
    if (boda.galeria.activa && boda.galeria.fotos.length > 0) secciones.push(_galeria(boda.galeria));
    if (boda.evento.activo) secciones.push(_evento(boda.evento, boda.fecha));
    if (boda.dresscode.activo) secciones.push(_dresscode(boda.dresscode));
    if (boda.rsvp.activo) secciones.push(_rsvp(boda.rsvp, boda.pareja));
    if (boda.mensaje.activo) secciones.push(_mensajeFinal(boda.mensaje, boda.pareja));
    return secciones.join('');
  }

  function _portada(boda) {
    const { novio, novia } = boda.pareja;
    const { dia, mes, anio } = boda.fecha;
    const meses = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
    const mesNombre = meses[parseInt(mes) - 1] || mes;
    return '<section class="inv-portada">' +
      '<div class="inv-portada__ornamento">✦</div>' +
      '<p class="inv-portada__preludio">Nos casamos</p>' +
      '<h1 class="inv-portada__nombres">' +
        '<span>' + novio + '</span>' +
        '<span class="inv-portada__amp">&amp;</span>' +
        '<span>' + novia + '</span>' +
      '</h1>' +
      '<div class="inv-portada__fecha">' +
        '<span class="inv-portada__fecha-dia">' + dia + '</span>' +
        '<span class="inv-portada__fecha-sep">·</span>' +
        '<span class="inv-portada__fecha-mes">' + mesNombre + '</span>' +
        '<span class="inv-portada__fecha-sep">·</span>' +
        '<span class="inv-portada__fecha-anio">' + anio + '</span>' +
      '</div>' +
      '<div class="inv-portada__linea"></div>' +
    '</section>';
  }

  function _countdown(fecha) {
    return '<section class="inv-countdown">' +
      '<p class="inv-countdown__label">Faltan</p>' +
      '<div class="inv-countdown__bloques" id="countdown-bloques">' +
        '<div class="inv-countdown__bloque"><span class="inv-countdown__num" id="cd-dias">--</span><span class="inv-countdown__unit">días</span></div>' +
        '<div class="inv-countdown__bloque"><span class="inv-countdown__num" id="cd-horas">--</span><span class="inv-countdown__unit">horas</span></div>' +
        '<div class="inv-countdown__bloque"><span class="inv-countdown__num" id="cd-minutos">--</span><span class="inv-countdown__unit">min</span></div>' +
        '<div class="inv-countdown__bloque"><span class="inv-countdown__num" id="cd-segundos">--</span><span class="inv-countdown__unit">seg</span></div>' +
      '</div>' +
      '<p class="inv-countdown__sublabel">para el gran día</p>' +
    '</section>';
  }

  function _musica(musica) {
    return '<section class="inv-musica">' +
      '<div class="inv-musica__inner">' +
        '<div class="inv-musica__nota">♪</div>' +
        '<div class="inv-musica__info">' +
          '<span class="inv-musica__titulo">' + (musica.titulo || 'Nuestra canción') + '</span>' +
          '<span class="inv-musica__sub">Música para este momento</span>' +
        '</div>' +
        '<button class="inv-musica__btn" id="musica-btn" data-url="' + musica.url + '" data-playing="false">' +
          '<span class="inv-musica__btn-icon">▶</span>' +
        '</button>' +
      '</div>' +
      '<audio id="musica-audio" src="' + musica.url + '" preload="none"></audio>' +
    '</section>';
  }

  function _historia(historia) {
    return '<section class="inv-seccion inv-historia">' +
      '<div class="inv-seccion__header">' +
        '<span class="inv-seccion__ornamento">✦</span>' +
        '<h2 class="inv-seccion__titulo">Nuestra historia</h2>' +
        '<div class="inv-seccion__linea"></div>' +
      '</div>' +
      '<p class="inv-historia__texto">' + historia.texto + '</p>' +
    '</section>';
  }

  function _galeria(galeria) {
    var imgs = galeria.fotos.map(function(url) {
      return '<div class="inv-galeria__item"><img src="' + url + '" alt="Foto de boda" loading="lazy" /></div>';
    }).join('');
    return '<section class="inv-seccion inv-galeria">' +
      '<div class="inv-seccion__header">' +
        '<span class="inv-seccion__ornamento">✦</span>' +
        '<h2 class="inv-seccion__titulo">Nuestra galería</h2>' +
        '<div class="inv-seccion__linea"></div>' +
      '</div>' +
      '<div class="inv-galeria__grid">' + imgs + '</div>' +
    '</section>';
  }

  function _evento(evento, fecha) {
    var meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    var mesNombre = meses[parseInt(fecha.mes) - 1] || fecha.mes;
    var mapaBtn = evento.googleMapsUrl
      ? '<a href="' + evento.googleMapsUrl + '" target="_blank" class="inv-evento__mapa-btn">Ver en el mapa →</a>'
      : '';
    return '<section class="inv-seccion inv-evento">' +
      '<div class="inv-seccion__header">' +
        '<span class="inv-seccion__ornamento">✦</span>' +
        '<h2 class="inv-seccion__titulo">La celebración</h2>' +
        '<div class="inv-seccion__linea"></div>' +
      '</div>' +
      '<div class="inv-evento__card">' +
        '<div class="inv-evento__fecha-completa">' + fecha.dia + ' de ' + mesNombre + ' de ' + fecha.anio + '</div>' +
        '<div class="inv-evento__hora">' + fecha.hora + ' h</div>' +
        '<div class="inv-evento__divider"></div>' +
        '<div class="inv-evento__lugar">' + evento.lugar + '</div>' +
        '<div class="inv-evento__direccion">' + evento.direccion + '</div>' +
        mapaBtn +
      '</div>' +
    '</section>';
  }

  function _dresscode(dresscode) {
    return '<section class="inv-seccion inv-dresscode">' +
      '<div class="inv-seccion__header">' +
        '<span class="inv-seccion__ornamento">✦</span>' +
        '<h2 class="inv-seccion__titulo">Dress code</h2>' +
        '<div class="inv-seccion__linea"></div>' +
      '</div>' +
      '<p class="inv-dresscode__texto">' + dresscode.texto + '</p>' +
    '</section>';
  }

  function _rsvp(rsvp, pareja) {
    var fechaStr = '';
    if (rsvp.fechaLimite) {
      var d = new Date(rsvp.fechaLimite);
      fechaStr = '<p class="inv-rsvp__fecha">Antes del ' + d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) + '</p>';
    }
    return '<section class="inv-seccion inv-rsvp">' +
      '<div class="inv-seccion__header">' +
        '<span class="inv-seccion__ornamento">✦</span>' +
        '<h2 class="inv-seccion__titulo">Confirma tu asistencia</h2>' +
        '<div class="inv-seccion__linea"></div>' +
      '</div>' +
      fechaStr +
      '<form class="inv-rsvp__form" id="rsvp-form">' +
        '<input type="text" name="nombre" placeholder="Tu nombre completo" required class="inv-rsvp__input" />' +
        '<div class="inv-rsvp__radio-group">' +
          '<label class="inv-rsvp__radio"><input type="radio" name="asistencia" value="si" /> Asistiré con alegría</label>' +
          '<label class="inv-rsvp__radio"><input type="radio" name="asistencia" value="no" /> No podré asistir</label>' +
        '</div>' +
        '<textarea name="mensaje" placeholder="Mensaje para los novios (opcional)" class="inv-rsvp__textarea" rows="3"></textarea>' +
        '<button type="submit" class="inv-rsvp__btn">Confirmar</button>' +
      '</form>' +
      '<div class="inv-rsvp__enviado" id="rsvp-enviado" style="display:none">¡Gracias! ' + pareja.novio + ' y ' + pareja.novia + ' lo han anotado.</div>' +
    '</section>';
  }

  function _mensajeFinal(mensaje, pareja) {
    return '<section class="inv-seccion inv-mensaje">' +
      '<div class="inv-mensaje__ornamento-top">✦ ✦ ✦</div>' +
      '<p class="inv-mensaje__texto">' + mensaje.texto + '</p>' +
      '<p class="inv-mensaje__firma">' + pareja.novio + ' &amp; ' + pareja.novia + '</p>' +
      '<div class="inv-mensaje__ornamento-bottom">✦</div>' +
    '</section>';
  }

  function _initCountdown(fecha, contenedor) {
    var hhmm = (fecha.hora || '12:00').split(':');
    var objetivo = new Date(parseInt(fecha.anio), parseInt(fecha.mes) - 1, parseInt(fecha.dia), parseInt(hhmm[0]), parseInt(hhmm[1]));

    function actualizar() {
      var diff = objetivo - new Date();
      if (diff <= 0) {
        var bloques = contenedor.querySelector('#countdown-bloques');
        if (bloques) bloques.innerHTML = '<p class="inv-countdown__hoy">¡Hoy es el día! 🎉</p>';
        return;
      }
      var setVal = function(id, val) {
        var el = contenedor.querySelector('#' + id);
        if (el) el.textContent = String(val).padStart(2, '0');
      };
      setVal('cd-dias', Math.floor(diff / 86400000));
      setVal('cd-horas', Math.floor((diff % 86400000) / 3600000));
      setVal('cd-minutos', Math.floor((diff % 3600000) / 60000));
      setVal('cd-segundos', Math.floor((diff % 60000) / 1000));
    }

    actualizar();
    if (contenedor.id === 'invitation-root') setInterval(actualizar, 1000);
  }

  function _initMusica(contenedor) {
    var btn = contenedor.querySelector('#musica-btn');
    var audio = contenedor.querySelector('#musica-audio');
    if (!btn || !audio) return;

    btn.addEventListener('click', function() {
      var playing = btn.getAttribute('data-playing') === 'true';
      var icon = btn.querySelector('.inv-musica__btn-icon');
      if (playing) {
        audio.pause();
        btn.setAttribute('data-playing', 'false');
        icon.textContent = '▶';
        btn.classList.remove('playing');
      } else {
        audio.play().then(function() {
          btn.setAttribute('data-playing', 'true');
          icon.textContent = '⏸';
          btn.classList.add('playing');
        }).catch(function(err) {
          console.error('Error reproduciendo audio:', err);
        });
      }
    });

    audio.addEventListener('ended', function() {
      btn.setAttribute('data-playing', 'false');
      btn.querySelector('.inv-musica__btn-icon').textContent = '▶';
      btn.classList.remove('playing');
    });
  }

  return { render };
})();
