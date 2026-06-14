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

    // Renderizar formulario personalizado
    if (boda.formulario && boda.formulario.activo && boda.formulario.preguntas && boda.formulario.preguntas.length > 0) {
      var formEl = document.createElement('section');
      formEl.style.cssText = 'padding:56px 32px;background:var(--color-secundario)';
      formEl.innerHTML = _renderFormulario(boda.formulario, boda.id || STATE.getId());
      contenedor.appendChild(formEl);
      _initFormulario(formEl, boda.formulario, boda.id || STATE.getId());
    }

    // Renderizar secciones extra al final
    _renderSeccionesExtra(boda, contenedor);

    // Renderizar subsecciones de secciones predefinidas
    _renderSubseccionesPredefinidas(boda, contenedor);

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
    // Determinar texto a mostrar
    var texto = '';
    if (musica.mostrarTexto === 'titulo') {
      texto = musica.titulo || 'Nuestra canción';
    } else if (musica.mostrarTexto === 'personalizado') {
      texto = musica.textoFlotante || '';
    }
    // ninguno = sin texto

    // Crear elemento flotante
    var flotante = document.createElement('div');
    flotante.id = 'musica-flotante-global';
    flotante.className = 'musica-flotante';
    flotante.innerHTML =
      (texto ? '<span class="musica-flotante__titulo">' + texto + '</span>' : '') +
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

  function _renderSubseccionesPredefinidas(boda, contenedor) {
    var mapa = {
      historia:    1,  // índice de sección en el DOM (0=portada, 1=countdown, 2=historia...)
      galeria:     2,
      evento:      3,
      dresscode:   4,
      rsvp:        5,
      mensaje:     6,
    };

    // Reconstruir mapa dinámico basado en qué secciones están activas
    var secciones = contenedor.querySelectorAll('section');
    var predefinidas = ['historia','galeria','evento','dresscode','alojamiento','transporte','rsvp','mensaje'];
    var seccionesActivas = ['portada','countdown'];
    predefinidas.forEach(function(id) {
      var sec = boda[id];
      if (!sec) return;
      var activa = sec.activo !== false && sec.activa !== false;
      if (activa) seccionesActivas.push(id);
    });

    seccionesActivas.forEach(function(id, idx) {
      var sec = boda[id];
      if (!sec || !sec.subsecciones || sec.subsecciones.length === 0) return;
      var secEl = secciones[idx];
      if (!secEl) return;
      _appendSubsecciones(secEl, sec.subsecciones);
    });
  }

  function _renderSeccionesExtra(boda, contenedor) {
    // Subsecciones en secciones predefinidas
    var predefinidas = ['historia','galeria','evento','dresscode','alojamiento','transporte','rsvp','mensaje'];
    predefinidas.forEach(function(id) {
      var sec = boda[id];
      if (!sec || !sec.subsecciones || sec.subsecciones.length === 0) return;
      // Encontrar la sección en el DOM y añadir subsecciones
      var secEls = contenedor.querySelectorAll('section');
      // Añadir bloque de subsecciones al final de la sección correspondiente
    });

    // Secciones completamente nuevas
    var extras = boda.secciones_extra || [];
    if (extras.length === 0) return;

    extras.forEach(function(sec) {
      if (!sec.titulo && !sec.texto && (!sec.subsecciones || sec.subsecciones.length === 0)) return;
      var el = document.createElement('section');
      el.style.cssText = 'padding:56px 32px;background:var(--color-secundario)';
      var html = '<div style="text-align:center;margin-bottom:28px">' +
        '<h2 style="font-family:var(--fuente-display);font-size:clamp(24px,6vw,32px);font-weight:300;color:var(--color-texto);margin:0 0 12px">' + (sec.titulo || '') + '</h2>' +
        '<div style="width:40px;height:1px;background:var(--color-primario);margin:0 auto;opacity:.5"></div>' +
        '</div>';
      if (sec.texto) {
        html += '<p style="font-family:var(--fuente-display);font-size:17px;font-style:italic;line-height:1.8;text-align:center;color:var(--color-texto);max-width:340px;margin:0 auto 24px">' + sec.texto + '</p>';
      }
      var subs = sec.subsecciones || [];
      if (subs.length > 0) {
        html += '<div style="display:flex;flex-direction:column;gap:20px;margin-top:24px">';
        subs.forEach(function(sub) {
          html += '<div style="border-left:2px solid var(--color-primario);padding-left:16px">';
          if (sub.titulo) html += '<p style="font-family:var(--fuente-body);font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--color-accent);margin-bottom:6px">' + sub.titulo + '</p>';
          if (sub.texto) html += '<p style="font-family:var(--fuente-body);font-size:14px;font-weight:300;color:var(--color-texto);line-height:1.7">' + sub.texto + '</p>';
          html += '</div>';
        });
        html += '</div>';
      }
      el.innerHTML = html;
      contenedor.appendChild(el);
    });
  }

  // Render subsecciones dentro de una sección existente
  function _appendSubsecciones(secEl, subsecciones) {
    if (!subsecciones || subsecciones.length === 0) return;
    var div = document.createElement('div');
    div.style.cssText = 'display:flex;flex-direction:column;gap:16px;margin-top:24px;padding:0 32px 32px';
    subsecciones.forEach(function(sub) {
      var item = '<div style="border-left:2px solid var(--color-primario);padding-left:16px">';
      if (sub.titulo) item += '<p style="font-family:var(--fuente-body);font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--color-accent);margin-bottom:6px">' + sub.titulo + '</p>';
      if (sub.texto) item += '<p style="font-family:var(--fuente-body);font-size:14px;font-weight:300;color:var(--color-texto);line-height:1.7">' + sub.texto + '</p>';
      item += '</div>';
      div.innerHTML += item;
    });
    secEl.appendChild(div);
  }

  function _renderFormulario(form, bodaId) {
    var html = '';
    html += '<div style="text-align:center;margin-bottom:28px">';
    html += '<h2 style="font-family:var(--fuente-display);font-size:clamp(24px,6vw,32px);font-weight:300;color:var(--color-texto);margin:0 0 12px">' + (form.titulo || 'Formulario') + '</h2>';
    if (form.descripcion) html += '<p style="font-family:var(--fuente-body);font-size:14px;color:#888;line-height:1.6">' + form.descripcion + '</p>';
    html += '<div style="width:40px;height:1px;background:var(--color-primario);margin:16px auto 0;opacity:.5"></div>';
    html += '</div>';

    html += '<form id="formulario-custom" style="display:flex;flex-direction:column;gap:20px">';

    (form.preguntas || []).forEach(function(preg, i) {
      html += '<div class="form-pregunta" data-id="' + preg.id + '">';
      html += '<p style="font-family:var(--fuente-body);font-size:13px;font-weight:700;color:var(--color-texto);margin-bottom:10px">';
      html += (i+1) + '. ' + (preg.texto || '') + (preg.obligatoria ? ' <span style="color:var(--color-primario)">*</span>' : '');
      html += '</p>';

      if (preg.tipo === 'texto') {
        html += '<input type="text" name="preg_' + preg.id + '" ' + (preg.obligatoria ? 'required' : '') + ' class="inv-rsvp__input" placeholder="Tu respuesta..." />';
      } else if (preg.tipo === 'numero') {
        html += '<input type="number" name="preg_' + preg.id + '" ' + (preg.obligatoria ? 'required' : '') + ' class="inv-rsvp__input" placeholder="0" style="width:120px" />';
      } else if (preg.tipo === 'opcion_unica') {
        (preg.opciones || []).forEach(function(op) {
          if (!op) return;
          html += '<label style="display:flex;align-items:center;gap:10px;font-family:var(--fuente-body);font-size:14px;color:var(--color-texto);margin-bottom:8px;cursor:pointer">';
          html += '<input type="radio" name="preg_' + preg.id + '" value="' + op + '" ' + (preg.obligatoria ? 'required' : '') + ' />';
          html += op + '</label>';
        });
      } else if (preg.tipo === 'opcion_multiple') {
        (preg.opciones || []).forEach(function(op) {
          if (!op) return;
          html += '<label style="display:flex;align-items:center;gap:10px;font-family:var(--fuente-body);font-size:14px;color:var(--color-texto);margin-bottom:8px;cursor:pointer">';
          html += '<input type="checkbox" name="preg_' + preg.id + '" value="' + op + '" />';
          html += op + '</label>';
        });
      }

      html += '</div>';
    });

    html += '<button type="submit" class="inv-rsvp__btn" style="margin-top:8px">' + (form.textoBtnEnviar || 'Enviar') + '</button>';
    html += '</form>';
    html += '<div id="formulario-confirmacion" style="display:none;text-align:center;font-family:var(--fuente-display);font-size:18px;font-style:italic;color:var(--color-accent);padding:24px 0">' + (form.mensajeConfirmacion || '¡Gracias!') + '</div>';

    return html;
  }

  function _initFormulario(secEl, form, bodaId) {
    var formEl = secEl.querySelector('#formulario-custom');
    var confirmEl = secEl.querySelector('#formulario-confirmacion');
    if (!formEl) return;

    formEl.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = formEl.querySelector('button[type="submit"]');
      btn.textContent = 'Enviando…';
      btn.disabled = true;

      var respuestas = {};
      (form.preguntas || []).forEach(function(preg) {
        if (preg.tipo === 'opcion_multiple') {
          var checks = formEl.querySelectorAll('input[name="preg_' + preg.id + '"]:checked');
          respuestas[preg.texto] = Array.from(checks).map(function(c) { return c.value; }).join(', ');
        } else {
          var el = formEl.querySelector('[name="preg_' + preg.id + '"]');
          if (el) respuestas[preg.texto] = el.type === 'radio'
            ? (formEl.querySelector('input[name="preg_' + preg.id + '"]:checked') || {}).value || ''
            : el.value;
        }
      });

      // Guardar en Firebase
      try {
        var db = firebase.firestore();
        db.collection('weddings').doc(bodaId).collection('formularios').add({
          respuestas: respuestas,
          enviadoEn: firebase.firestore.FieldValue.serverTimestamp(),
        }).then(function() {
          formEl.style.display = 'none';
          if (confirmEl) confirmEl.style.display = 'block';
        }).catch(function(err) {
          console.error(err);
          btn.textContent = 'Error. Inténtalo de nuevo.';
          btn.disabled = false;
        });
      } catch(err) {
        console.error(err);
        btn.textContent = 'Error.';
        btn.disabled = false;
      }
    });
  }

  return { render };
})();
