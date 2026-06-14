// renderers/clasica.js — Plantilla Clásica
// Crema, dorado, serif elegante, ornamentos tipográficos

const RENDERER_CLASICA = {

  estilosDefault: {
    colorPrimario:    '#b8860b',
    colorSecundario:  '#f5f0e8',
    colorTexto:       '#2c2c2c',
    colorAccent:      '#8b6914',
    fuente:           'Cormorant Garamond',
    fuenteSecundaria: 'Lato',
  },

  render: function(boda, contenedor) {
    this._aplicarCSS(boda.estilos);
    contenedor.innerHTML = this._build(boda);
    this._initCountdown(boda.fecha, contenedor);
    this._initMusica(contenedor);
  },

  _aplicarCSS: function(e) {
    var r = document.documentElement;
    r.style.setProperty('--color-primario',   e.colorPrimario);
    r.style.setProperty('--color-secundario', e.colorSecundario);
    r.style.setProperty('--color-texto',      e.colorTexto);
    r.style.setProperty('--color-accent',     e.colorAccent);
    r.style.setProperty('--fuente-display',   "'" + e.fuente + "', serif");
    r.style.setProperty('--fuente-body',      "'" + e.fuenteSecundaria + "', sans-serif");
  },

  _build: function(boda) {
    var s = [];
    s.push(this._portada(boda));
    s.push(this._countdown(boda.fecha));

    var orden = boda._ordenEfectivo || ['historia','galeria','evento','dresscode','rsvp','mensaje'];
    var self = this;

    orden.forEach(function(id) {
      if (id.indexOf('extra_') === 0) {
        var idx = parseInt(id.replace('extra_', ''));
        var extras = boda.secciones_extra || [];
        if (extras[idx]) s.push(self._seccionExtra(extras[idx]));
        return;
      }
      var sec = boda[id];
      if (!sec) return;
      var activa = sec.activo !== false && sec.activa !== false;
      if (!activa) return;

      if (id === 'historia' && self._historia) {
        if (self._separador) s.push(self._separador());
        s.push(self._historia(sec));
        if (self._separador) s.push(self._separador());
      } else if (id === 'galeria' && self._galeria && sec.fotos && sec.fotos.length > 0) {
        s.push(self._galeria(sec));
        if (self._separador) s.push(self._separador());
      } else if (id === 'evento' && self._evento) {
        s.push(self._evento(sec, boda.fecha));
        if (self._separador) s.push(self._separador());
      } else if (id === 'dresscode' && self._dresscode) {
        if (self._separador) s.push(self._separador());
        s.push(self._dresscode(sec));
        if (self._separador) s.push(self._separador());
      } else if (id === 'alojamiento' && self._seccionSimple) {
        s.push(self._seccionSimple(sec));
      } else if (id === 'transporte' && self._seccionSimple) {
        s.push(self._seccionSimple(sec));
      } else if (id === 'rsvp' && self._rsvp) {
        if (self._separador) s.push(self._separador());
        s.push(self._rsvp(sec, boda.pareja));
      } else if (id === 'mensaje' && self._mensajeFinal) {
        s.push(self._mensajeFinal(sec, boda.pareja));
      }
    });

    return s.join('');
  },

  _seccionExtra: function(sec) {
    var html = '<section style="padding:56px 32px;background:var(--color-secundario)">';
    html += '<div style="text-align:center;margin-bottom:28px">';
    html += '<h2 style="font-family:var(--fuente-display);font-size:clamp(24px,6vw,32px);font-weight:300;color:var(--color-texto);margin:0 0 12px">' + (sec.titulo || '') + '</h2>';
    html += '<div style="width:40px;height:1px;background:var(--color-primario);margin:0 auto;opacity:.5"></div>';
    html += '</div>';
    if (sec.texto) html += '<p style="font-family:var(--fuente-display);font-size:17px;font-style:italic;line-height:1.8;text-align:center;color:var(--color-texto);max-width:340px;margin:0 auto">' + sec.texto + '</p>';
    var subs = sec.subsecciones || [];
    if (subs.length > 0) {
      html += '<div style="display:flex;flex-direction:column;gap:16px;margin-top:24px">';
      subs.forEach(function(sub) {
        html += '<div style="border-left:2px solid var(--color-primario);padding-left:16px">';
        if (sub.titulo) html += '<p style="font-family:var(--fuente-body);font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--color-accent);margin-bottom:6px">' + sub.titulo + '</p>';
        if (sub.texto) html += '<p style="font-family:var(--fuente-body);font-size:14px;font-weight:300;color:var(--color-texto);line-height:1.7">' + sub.texto + '</p>';
        html += '</div>';
      });
      html += '</div>';
    }
    html += '</section>';
    return html;
  },

  _portada: function(boda) {
    var meses = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
    var mes = meses[parseInt(boda.fecha.mes) - 1] || boda.fecha.mes;
    return '<section class="inv-portada" style="background:var(--color-secundario);min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:48px 32px;">' +
      (boda.fotoCabecera ? '<div style="position:relative;width:calc(100% + 64px);margin-left:-32px;height:60vw;max-height:340px;overflow:hidden"><img src="'+boda.fotoCabecera+'" style="width:100%;height:100%;object-fit:cover;object-position:center top;display:block"/><div style="position:absolute;bottom:0;left:0;right:0;height:100px;background:linear-gradient(to top,var(--color-secundario),transparent)"></div></div>' : '') +
      '<div style="font-size:20px;color:var(--color-primario);letter-spacing:8px;margin-bottom:24px">✦</div>' +
      '<p style="font-family:var(--fuente-body);font-size:11px;font-weight:300;letter-spacing:4px;text-transform:uppercase;color:var(--color-accent);margin-bottom:24px">Nos casamos</p>' +
      '<h1 style="font-family:var(--fuente-display);font-weight:300;display:flex;flex-direction:column;align-items:center;gap:4px;line-height:1.1;margin:0">' +
        '<span style="font-size:clamp(42px,10vw,64px);color:var(--color-texto)">' + boda.pareja.novio + '</span>' +
        '<span style="font-style:italic;font-size:clamp(32px,7vw,48px);color:var(--color-primario)">&amp;</span>' +
        '<span style="font-size:clamp(42px,10vw,64px);color:var(--color-texto)">' + boda.pareja.novia + '</span>' +
      '</h1>' +
      '<div style="margin-top:32px;display:flex;align-items:center;gap:12px;font-family:var(--fuente-body);font-size:13px;font-weight:300;letter-spacing:3px;text-transform:uppercase;color:var(--color-accent)">' +
        '<span>' + boda.fecha.dia + '</span><span style="opacity:.4">·</span>' +
        '<span>' + mes + '</span><span style="opacity:.4">·</span>' +
        '<span>' + boda.fecha.anio + '</span>' +
      '</div>' +
      '<div style="width:48px;height:1px;background:var(--color-primario);margin-top:32px;opacity:.5"></div>' +
    '</section>';
  },

  _countdown: function(fecha) {
    return '<section style="padding:48px 24px;text-align:center;background:var(--color-primario)">' +
      '<p style="font-family:var(--fuente-body);font-size:11px;font-weight:300;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,.7);margin-bottom:20px">Faltan</p>' +
      '<div style="display:flex;justify-content:center;gap:24px">' +
        '<div style="display:flex;flex-direction:column;align-items:center;gap:4px"><span id="cd-dias" style="font-family:var(--fuente-display);font-size:42px;font-weight:300;color:#fff;line-height:1">--</span><span style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.6)">días</span></div>' +
        '<div style="display:flex;flex-direction:column;align-items:center;gap:4px"><span id="cd-horas" style="font-family:var(--fuente-display);font-size:42px;font-weight:300;color:#fff;line-height:1">--</span><span style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.6)">horas</span></div>' +
        '<div style="display:flex;flex-direction:column;align-items:center;gap:4px"><span id="cd-minutos" style="font-family:var(--fuente-display);font-size:42px;font-weight:300;color:#fff;line-height:1">--</span><span style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.6)">min</span></div>' +
        '<div style="display:flex;flex-direction:column;align-items:center;gap:4px"><span id="cd-segundos" style="font-family:var(--fuente-display);font-size:42px;font-weight:300;color:#fff;line-height:1">--</span><span style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.6)">seg</span></div>' +
      '</div>' +
      '<p style="font-family:var(--fuente-body);font-size:11px;font-weight:300;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,.7);margin-top:16px">para el gran día</p>' +
    '</section>';
  },

  _musica: function(musica) {
    return '<section style="padding:24px 32px;background:#fff;border-top:1px solid rgba(184,134,11,.1)">' +
      '<div style="display:flex;align-items:center;gap:16px;max-width:360px;margin:0 auto">' +
        '<div style="font-size:24px;color:var(--color-primario);opacity:.6">♪</div>' +
        '<div style="flex:1"><div style="font-family:var(--fuente-display);font-size:15px;font-style:italic;color:var(--color-texto)">' + (musica.titulo||'Nuestra canción') + '</div></div>' +
        '<button id="musica-btn" data-playing="false" style="width:44px;height:44px;border-radius:50%;border:1.5px solid var(--color-primario);background:transparent;color:var(--color-primario);cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0">' +
          '<span class="inv-musica__btn-icon">▶</span>' +
        '</button>' +
      '</div>' +
      '<audio id="musica-audio" src="' + musica.url + '" preload="none"></audio>' +
    '</section>';
  },

  _historia: function(historia) {
    return '<section style="padding:0;background:var(--color-secundario)">' + this._separador() +
      '<div style="text-align:center;margin-bottom:36px">' +
        '<span style="display:block;font-size:14px;color:var(--color-primario);letter-spacing:6px;margin-bottom:12px">✦</span>' +
        '<h2 style="font-family:var(--fuente-display);font-size:clamp(26px,6vw,34px);font-weight:300;color:var(--color-texto);margin:0 0 16px">'+(historia.titulo||'Nuestra historia')+'</h2>' +
        '<div style="width:40px;height:1px;background:var(--color-primario);margin:0 auto;opacity:.5"></div>' +
      '</div>' +
      '<p style="font-family:var(--fuente-display);font-size:18px;font-weight:300;font-style:italic;line-height:1.8;text-align:center;color:var(--color-texto);max-width:360px;margin:0 auto">' + historia.texto + '</p>' +
    '</section>';
  },

  _galeria: function(galeria) {
    var imgs = galeria.fotos.map(function(url, i) {
      return '<div style="' + (i===0?'grid-column:1/-1;aspect-ratio:4/3':'aspect-ratio:3/4') + ';overflow:hidden"><img src="' + url + '" style="width:100%;height:100%;object-fit:cover" loading="lazy" /></div>';
    }).join('');
    return '<section style="padding:64px 32px;background:var(--color-secundario)">' +
      '<div style="text-align:center;margin-bottom:36px">' +
        '<span style="display:block;font-size:14px;color:var(--color-primario);letter-spacing:6px;margin-bottom:12px">✦</span>' +
        '<h2 style="font-family:var(--fuente-display);font-size:clamp(26px,6vw,34px);font-weight:300;color:var(--color-texto);margin:0 0 16px">'+(galeria.titulo||'Nuestra galería')+'</h2>' +
        '<div style="width:40px;height:1px;background:var(--color-primario);margin:0 auto;opacity:.5"></div>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">' + imgs + '</div>' +
    '</section>';
  },

  _evento: function(evento, fecha) {
    var meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    var mes = meses[parseInt(fecha.mes)-1] || fecha.mes;
    return '<section style="padding:64px 32px;background:var(--color-secundario)">' +
      '<div style="text-align:center;margin-bottom:36px">' +
        '<span style="display:block;font-size:14px;color:var(--color-primario);letter-spacing:6px;margin-bottom:12px">✦</span>' +
        '<h2 style="font-family:var(--fuente-display);font-size:clamp(26px,6vw,34px);font-weight:300;color:var(--color-texto);margin:0 0 16px">'+(evento.titulo||'La celebración')+'</h2>' +
        '<div style="width:40px;height:1px;background:var(--color-primario);margin:0 auto;opacity:.5"></div>' +
      '</div>' +
      '<div style="background:#fff;border:1px solid rgba(184,134,11,.2);padding:32px 24px;text-align:center">' +
        '<div style="font-family:var(--fuente-display);font-size:20px;font-weight:300;color:var(--color-texto);margin-bottom:8px">' + fecha.dia + ' de ' + mes + ' de ' + fecha.anio + '</div>' +
        '<div style="font-family:var(--fuente-body);font-size:13px;font-weight:300;letter-spacing:3px;color:var(--color-accent);text-transform:uppercase">' + fecha.hora + ' h</div>' +
        '<div style="width:32px;height:1px;background:var(--color-primario);margin:20px auto;opacity:.4"></div>' +
        '<div style="font-family:var(--fuente-display);font-size:22px;font-weight:400;color:var(--color-texto);margin-bottom:8px">' + evento.lugar + '</div>' +
        '<div style="font-family:var(--fuente-body);font-size:13px;font-weight:300;color:#888;margin-bottom:20px">' + evento.direccion + '</div>' +
        (evento.googleMapsUrl ? '<a href="' + evento.googleMapsUrl + '" target="_blank" style="font-family:var(--fuente-body);font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--color-primario);text-decoration:none;border-bottom:1px solid var(--color-primario);padding-bottom:2px">Ver en el mapa →</a>' : '') +
      '</div>' +
    '</section>';
  },

  _dresscode: function(dresscode) {
    return '<section style="padding:0;background:#fff;text-align:center">' + this._separador() +
      '<span style="display:block;font-size:14px;color:var(--color-primario);letter-spacing:6px;margin-bottom:12px">✦</span>' +
      '<h2 style="font-family:var(--fuente-display);font-size:clamp(26px,6vw,34px);font-weight:300;color:var(--color-texto);margin:0 0 16px">'+(dresscode.titulo||'Dress code')+'</h2>' +
      '<div style="width:40px;height:1px;background:var(--color-primario);margin:0 auto 32px;opacity:.5"></div>' +
      '<p style="font-family:var(--fuente-display);font-size:18px;font-weight:300;font-style:italic;color:var(--color-texto);line-height:1.7">' + dresscode.texto + '</p>' +
    '</section>';
  },

  _rsvp: function(rsvp, pareja) {
    var fechaStr = '';
    if (rsvp.fechaLimite) {
      var d = new Date(rsvp.fechaLimite);
      fechaStr = '<p style="font-family:var(--fuente-body);font-size:12px;font-weight:300;letter-spacing:2px;text-transform:uppercase;color:var(--color-accent);text-align:center;margin-bottom:28px">Antes del ' + d.toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'}) + '</p>';
    }
    return '<section style="padding:64px 32px;background:var(--color-secundario)">' +
      '<div style="text-align:center;margin-bottom:36px">' +
        '<span style="display:block;font-size:14px;color:var(--color-primario);letter-spacing:6px;margin-bottom:12px">✦</span>' +
        '<h2 style="font-family:var(--fuente-display);font-size:clamp(26px,6vw,34px);font-weight:300;color:var(--color-texto);margin:0 0 16px">'+(rsvp.titulo||'Confirma tu asistencia')+'</h2>' +
        '<div style="width:40px;height:1px;background:var(--color-primario);margin:0 auto;opacity:.5"></div>' +
      '</div>' +
      fechaStr +
      '<form id="rsvp-form" style="display:flex;flex-direction:column;gap:12px">' +
        '<input type="text" name="nombre" placeholder="Tu nombre completo" required class="inv-rsvp__input" />' +
        '<div style="display:flex;flex-direction:column;gap:8px">' +
          '<label style="display:flex;align-items:center;gap:10px;font-family:var(--fuente-body);font-size:14px;font-weight:300;color:var(--color-texto);cursor:pointer"><input type="radio" name="asistencia" value="si" /> Asistiré con alegría</label>' +
          '<label style="display:flex;align-items:center;gap:10px;font-family:var(--fuente-body);font-size:14px;font-weight:300;color:var(--color-texto);cursor:pointer"><input type="radio" name="asistencia" value="no" /> No podré asistir</label>' +
        '</div>' +
        '<textarea name="mensaje" placeholder="Mensaje para los novios (opcional)" class="inv-rsvp__textarea" rows="3"></textarea>' +
        '<button type="submit" class="inv-rsvp__btn">Confirmar</button>' +
      '</form>' +
      '<div id="rsvp-enviado" style="display:none;text-align:center;font-family:var(--fuente-display);font-size:18px;font-style:italic;color:var(--color-accent);padding:24px 0">¡Gracias! ' + pareja.novio + ' y ' + pareja.novia + ' lo han anotado.</div>' +
    '</section>';
  },

  _mensajeFinal: function(mensaje, pareja) {
    return '<section style="background:var(--color-primario);text-align:center;padding:64px 32px">' +
      '<div style="font-size:12px;color:rgba(255,255,255,.5);letter-spacing:12px;margin-bottom:32px">✦ ✦ ✦</div>' +
      '<p style="font-family:var(--fuente-display);font-size:clamp(18px,4vw,24px);font-weight:300;font-style:italic;color:rgba(255,255,255,.9);line-height:1.8;max-width:320px;margin:0 auto 24px">' + mensaje.texto + '</p>' +
      '<p style="font-family:var(--fuente-display);font-size:22px;font-weight:300;color:#fff;letter-spacing:2px">' + pareja.novio + ' &amp; ' + pareja.novia + '</p>' +
      '<div style="font-size:16px;color:rgba(255,255,255,.4);margin-top:32px;letter-spacing:4px">✦</div>' +
    '</section>';
  },


  _marco: function(contenido, fondo) {
    return '<div style="background:' + (fondo||'var(--color-secundario)') + ';padding:48px 32px;position:relative">' +
      // Marco exterior
      '<div style="position:absolute;top:16px;left:16px;right:16px;bottom:16px;border:1px solid var(--color-primario);opacity:.2;pointer-events:none"></div>' +
      // Esquinas decorativas
      '<div style="position:absolute;top:12px;left:12px;width:16px;height:16px;border-top:2px solid var(--color-primario);border-left:2px solid var(--color-primario);opacity:.5"></div>' +
      '<div style="position:absolute;top:12px;right:12px;width:16px;height:16px;border-top:2px solid var(--color-primario);border-right:2px solid var(--color-primario);opacity:.5"></div>' +
      '<div style="position:absolute;bottom:12px;left:12px;width:16px;height:16px;border-bottom:2px solid var(--color-primario);border-left:2px solid var(--color-primario);opacity:.5"></div>' +
      '<div style="position:absolute;bottom:12px;right:12px;width:16px;height:16px;border-bottom:2px solid var(--color-primario);border-right:2px solid var(--color-primario);opacity:.5"></div>' +
      contenido +
    '</div>';
  },

  _separador: function() {
    return '<div style="text-align:center;padding:4px 0;background:var(--color-secundario)">' +
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 20" style="width:160px;height:20px;display:inline-block;opacity:.6">' +
        '<line x1="0" y1="10" x2="80" y2="10" stroke="var(--color-primario)" stroke-width="0.8"/>' +
        '<polygon points="90,5 95,10 90,15 85,10" fill="var(--color-primario)" opacity=".8"/>' +
        '<polygon points="110,5 115,10 110,15 105,10" fill="var(--color-primario)" opacity=".8"/>' +
        '<line x1="120" y1="10" x2="200" y2="10" stroke="var(--color-primario)" stroke-width="0.8"/>' +
        '<circle cx="100" cy="10" r="2.5" fill="var(--color-primario)"/>' +
      '</svg>' +
    '</div>';
  },

  _initCountdown: function(fecha, contenedor) {
    var hhmm = (fecha.hora||'12:00').split(':');
    var obj = new Date(parseInt(fecha.anio), parseInt(fecha.mes)-1, parseInt(fecha.dia), parseInt(hhmm[0]), parseInt(hhmm[1]));
    function tick() {
      var diff = obj - new Date();
      if (diff <= 0) return;
      var s = function(id, v) { var el = contenedor.querySelector('#'+id); if(el) el.textContent = String(v).padStart(2,'0'); };
      s('cd-dias',    Math.floor(diff/86400000));
      s('cd-horas',   Math.floor((diff%86400000)/3600000));
      s('cd-minutos', Math.floor((diff%3600000)/60000));
      s('cd-segundos',Math.floor((diff%60000)/1000));
    }
    tick();
    if (contenedor.id === 'invitation-root') setInterval(tick, 1000);
  },

  _initMusica: function(contenedor) {
    var btn = contenedor.querySelector('#musica-btn');
    var audio = contenedor.querySelector('#musica-audio');
    if (!btn || !audio) return;
    btn.addEventListener('click', function() {
      var playing = btn.getAttribute('data-playing') === 'true';
      var icon = btn.querySelector('.inv-musica__btn-icon');
      if (playing) {
        audio.pause();
        btn.setAttribute('data-playing','false');
        if(icon) icon.textContent = '▶';
      } else {
        audio.play().then(function() {
          btn.setAttribute('data-playing','true');
          if(icon) icon.textContent = '⏸';
        }).catch(function(){});
      }
    });
    audio.addEventListener('ended', function() {
      btn.setAttribute('data-playing','false');
      var icon = btn.querySelector('.inv-musica__btn-icon');
      if(icon) icon.textContent = '▶';
    });
  }
};
