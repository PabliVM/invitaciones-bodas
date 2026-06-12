// renderers/mediterranea.js — Plantilla Mediterránea
// Azul marino, arena, verano, grecas decorativas

const RENDERER_MEDITERRANEA = {

  estilosDefault: {
    colorPrimario:    '#1e4d8c',
    colorSecundario:  '#faf7f0',
    colorTexto:       '#1a2e4a',
    colorAccent:      '#c4a466',
    fuente:           'EB Garamond',
    fuenteSecundaria: 'Lato',
  },

  // Greca SVG decorativa
  _greca: function(color) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 20" style="width:100%;height:20px;display:block;opacity:.35">' +
      '<pattern id="greca" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">' +
        '<path d="M0,10 L5,10 L5,5 L10,5 L10,15 L15,15 L15,10 L20,10" stroke="' + color + '" stroke-width="1.5" fill="none"/>' +
      '</pattern>' +
      '<rect width="300" height="20" fill="url(#greca)"/>' +
    '</svg>';
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
    if (boda.musica && boda.musica.activa && boda.musica.url) s.push(this._musica(boda.musica));
    if (boda.historia.activa) s.push(this._historia(boda.historia));
    if (boda.galeria.activa && boda.galeria.fotos.length > 0) s.push(this._galeria(boda.galeria));
    if (boda.evento.activo) s.push(this._evento(boda.evento, boda.fecha));
    if (boda.dresscode.activo) s.push(this._dresscode(boda.dresscode));
    if (boda.rsvp.activo) s.push(this._rsvp(boda.rsvp, boda.pareja));
    if (boda.mensaje.activo) s.push(this._mensajeFinal(boda.mensaje, boda.pareja));
    return s.join('');
  },

  _portada: function(boda) {
    var meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    var mes = meses[parseInt(boda.fecha.mes)-1]||boda.fecha.mes;
    var c = boda.estilos.colorPrimario;
    var ca = boda.estilos.colorAccent;
    return '<section style="background:var(--color-primario);min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:48px 32px;position:relative;overflow:hidden">' +
      // Círculo decorativo fondo
      '<div style="position:absolute;top:-80px;right:-80px;width:280px;height:280px;border-radius:50%;border:1px solid rgba(255,255,255,.08)"></div>' +
      '<div style="position:absolute;bottom:-60px;left:-60px;width:200px;height:200px;border-radius:50%;border:1px solid rgba(255,255,255,.06)"></div>' +
      // Greca superior
      '<div style="position:absolute;top:0;left:0;right:0">' + this._greca('#ffffff') + '</div>' +
      // Greca inferior
      '<div style="position:absolute;bottom:0;left:0;right:0;transform:scaleY(-1)">' + this._greca('#ffffff') + '</div>' +
      // Contenido
      '<div style="position:relative;z-index:1">' +
        '<p style="font-family:var(--fuente-body);font-size:10px;font-weight:300;letter-spacing:5px;text-transform:uppercase;color:rgba(255,255,255,.5);margin-bottom:32px">' + boda.fecha.dia + ' · ' + mes + ' · ' + boda.fecha.anio + '</p>' +
        '<div style="width:1px;height:40px;background:rgba(255,255,255,.2);margin:0 auto 24px"></div>' +
        '<h1 style="font-family:var(--fuente-display);font-weight:400;display:flex;flex-direction:column;align-items:center;line-height:1.1;margin:0">' +
          '<span style="font-size:clamp(40px,10vw,60px);color:#fff">' + boda.pareja.novio + '</span>' +
          '<span style="font-size:clamp(18px,4vw,26px);color:var(--color-accent);font-style:italic;letter-spacing:3px;margin:6px 0">&amp;</span>' +
          '<span style="font-size:clamp(40px,10vw,60px);color:#fff">' + boda.pareja.novia + '</span>' +
        '</h1>' +
        '<div style="width:1px;height:40px;background:rgba(255,255,255,.2);margin:24px auto 0"></div>' +
        '<p style="font-family:var(--fuente-body);font-size:10px;font-weight:300;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,.4);margin-top:16px">nos casamos</p>' +
      '</div>' +
    '</section>';
  },

  _countdown: function(fecha) {
    return '<section style="padding:40px 24px;text-align:center;background:var(--color-secundario)">' +
      this._greca(this._getCSSVar('--color-primario') || '#1e4d8c') +
      '<div style="padding:24px 0">' +
        '<p style="font-family:var(--fuente-body);font-size:10px;font-weight:300;letter-spacing:4px;text-transform:uppercase;color:var(--color-accent);margin-bottom:20px">faltan</p>' +
        '<div style="display:flex;justify-content:center;gap:16px">' +
          '<div style="text-align:center;background:#fff;padding:12px 16px;border:1px solid rgba(30,77,140,.1)"><div id="cd-dias" style="font-family:var(--fuente-display);font-size:36px;color:var(--color-primario);font-weight:400;line-height:1">--</div><div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--color-accent);margin-top:4px">días</div></div>' +
          '<div style="text-align:center;background:#fff;padding:12px 16px;border:1px solid rgba(30,77,140,.1)"><div id="cd-horas" style="font-family:var(--fuente-display);font-size:36px;color:var(--color-primario);font-weight:400;line-height:1">--</div><div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--color-accent);margin-top:4px">horas</div></div>' +
          '<div style="text-align:center;background:#fff;padding:12px 16px;border:1px solid rgba(30,77,140,.1)"><div id="cd-minutos" style="font-family:var(--fuente-display);font-size:36px;color:var(--color-primario);font-weight:400;line-height:1">--</div><div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--color-accent);margin-top:4px">min</div></div>' +
          '<div style="text-align:center;background:#fff;padding:12px 16px;border:1px solid rgba(30,77,140,.1)"><div id="cd-segundos" style="font-family:var(--fuente-display);font-size:36px;color:var(--color-primario);font-weight:400;line-height:1">--</div><div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--color-accent);margin-top:4px">seg</div></div>' +
        '</div>' +
      '</div>' +
      this._greca(this._getCSSVar('--color-primario') || '#1e4d8c') +
    '</section>';
  },

  _getCSSVar: function(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  },

  _musica: function(musica) {
    return '<section style="padding:20px 32px;background:#fff;border-top:1px solid rgba(30,77,140,.1)">' +
      '<div style="display:flex;align-items:center;gap:12px">' +
        '<div style="font-size:18px;color:var(--color-accent)">♪</div>' +
        '<div style="flex:1;font-family:var(--fuente-display);font-size:15px;font-style:italic;color:var(--color-texto)">' + (musica.titulo||'Nuestra canción') + '</div>' +
        '<button id="musica-btn" data-playing="false" style="width:40px;height:40px;border-radius:50%;border:1.5px solid var(--color-primario);background:transparent;color:var(--color-primario);cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center">' +
          '<span class="inv-musica__btn-icon">▶</span>' +
        '</button>' +
      '</div>' +
      '<audio id="musica-audio" src="' + musica.url + '" preload="none"></audio>' +
    '</section>';
  },

  _historia: function(historia) {
    return '<section style="padding:64px 32px;background:var(--color-secundario);text-align:center">' +
      '<p style="font-family:var(--fuente-body);font-size:10px;letter-spacing:4px;text-transform:uppercase;color:var(--color-accent);margin-bottom:12px">nuestra historia</p>' +
      '<h2 style="font-family:var(--fuente-display);font-size:32px;font-weight:400;color:var(--color-primario);margin:0 0 24px">Como empezó todo</h2>' +
      '<div style="width:40px;height:2px;background:var(--color-accent);margin:0 auto 32px"></div>' +
      '<p style="font-family:var(--fuente-display);font-size:17px;font-style:italic;line-height:1.85;color:var(--color-texto);max-width:340px;margin:0 auto">' + historia.texto + '</p>' +
    '</section>';
  },

  _galeria: function(galeria) {
    var imgs = galeria.fotos.map(function(url, i) {
      var style = i === 0 ? 'grid-column:1/-1;aspect-ratio:4/3' : 'aspect-ratio:3/4';
      return '<div style="' + style + ';overflow:hidden"><img src="' + url + '" style="width:100%;height:100%;object-fit:cover" loading="lazy"/></div>';
    }).join('');
    return '<section style="padding:0;background:var(--color-secundario)">' +
      '<div style="text-align:center;padding:48px 32px 24px">' +
        '<p style="font-family:var(--fuente-body);font-size:10px;letter-spacing:4px;text-transform:uppercase;color:var(--color-accent);margin-bottom:12px">momentos</p>' +
        '<h2 style="font-family:var(--fuente-display);font-size:32px;font-weight:400;color:var(--color-primario);margin:0 0 16px">Nuestra galería</h2>' +
        '<div style="width:40px;height:2px;background:var(--color-accent);margin:0 auto"></div>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px;padding:0 16px 48px">' + imgs + '</div>' +
    '</section>';
  },

  _evento: function(evento, fecha) {
    var meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    var mes = meses[parseInt(fecha.mes)-1]||fecha.mes;
    return '<section style="padding:0;background:var(--color-primario)">' +
      '<div style="padding:56px 32px;text-align:center">' +
        '<p style="font-family:var(--fuente-body);font-size:10px;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,.5);margin-bottom:12px">la celebración</p>' +
        '<h2 style="font-family:var(--fuente-display);font-size:32px;font-weight:400;color:#fff;margin:0 0 24px">Nos vemos aquí</h2>' +
        '<div style="width:40px;height:2px;background:var(--color-accent);margin:0 auto 32px"></div>' +
        '<p style="font-family:var(--fuente-display);font-size:20px;color:#fff;margin-bottom:8px">' + fecha.dia + ' de ' + mes + ' de ' + fecha.anio + '</p>' +
        '<p style="font-family:var(--fuente-body);font-size:12px;letter-spacing:3px;color:var(--color-accent);text-transform:uppercase;margin-bottom:28px">' + fecha.hora + ' h</p>' +
        '<div style="background:rgba(255,255,255,.08);padding:24px;border:1px solid rgba(255,255,255,.12)">' +
          '<p style="font-family:var(--fuente-display);font-size:22px;color:#fff;margin-bottom:8px">' + evento.lugar + '</p>' +
          '<p style="font-family:var(--fuente-body);font-size:13px;color:rgba(255,255,255,.6);margin-bottom:20px">' + evento.direccion + '</p>' +
          (evento.googleMapsUrl ? '<a href="' + evento.googleMapsUrl + '" target="_blank" style="font-family:var(--fuente-body);font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--color-accent);text-decoration:none;border-bottom:1px solid var(--color-accent);padding-bottom:2px">Ver en el mapa →</a>' : '') +
        '</div>' +
      '</div>' +
    '</section>';
  },

  _dresscode: function(dresscode) {
    return '<section style="padding:56px 32px;background:var(--color-secundario);text-align:center">' +
      '<p style="font-family:var(--fuente-body);font-size:10px;letter-spacing:4px;text-transform:uppercase;color:var(--color-accent);margin-bottom:12px">etiqueta</p>' +
      '<h2 style="font-family:var(--fuente-display);font-size:32px;font-weight:400;color:var(--color-primario);margin:0 0 24px">Dress code</h2>' +
      '<div style="width:40px;height:2px;background:var(--color-accent);margin:0 auto 28px"></div>' +
      '<p style="font-family:var(--fuente-display);font-size:17px;font-style:italic;color:var(--color-texto);line-height:1.8">' + dresscode.texto + '</p>' +
    '</section>';
  },

  _rsvp: function(rsvp, pareja) {
    var fechaStr = '';
    if (rsvp.fechaLimite) {
      var d = new Date(rsvp.fechaLimite);
      fechaStr = '<p style="font-family:var(--fuente-body);font-size:12px;letter-spacing:1px;color:var(--color-accent);text-align:center;margin-bottom:24px">Antes del ' + d.toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'}) + '</p>';
    }
    return '<section style="padding:56px 32px;background:#fff">' +
      '<div style="text-align:center;margin-bottom:32px">' +
        '<p style="font-family:var(--fuente-body);font-size:10px;letter-spacing:4px;text-transform:uppercase;color:var(--color-accent);margin-bottom:12px">asistencia</p>' +
        '<h2 style="font-family:var(--fuente-display);font-size:32px;font-weight:400;color:var(--color-primario);margin:0 0 16px">Confirma tu asistencia</h2>' +
        '<div style="width:40px;height:2px;background:var(--color-accent);margin:0 auto"></div>' +
      '</div>' +
      fechaStr +
      '<form id="rsvp-form" style="display:flex;flex-direction:column;gap:12px">' +
        '<input type="text" name="nombre" placeholder="Tu nombre completo" required class="inv-rsvp__input" />' +
        '<div style="display:flex;flex-direction:column;gap:8px">' +
          '<label style="display:flex;align-items:center;gap:10px;font-family:var(--fuente-body);font-size:14px;color:var(--color-texto);cursor:pointer"><input type="radio" name="asistencia" value="si" /> Asistiré con alegría</label>' +
          '<label style="display:flex;align-items:center;gap:10px;font-family:var(--fuente-body);font-size:14px;color:var(--color-texto);cursor:pointer"><input type="radio" name="asistencia" value="no" /> No podré asistir</label>' +
        '</div>' +
        '<textarea name="mensaje" placeholder="Mensaje para los novios (opcional)" class="inv-rsvp__textarea" rows="3"></textarea>' +
        '<button type="submit" class="inv-rsvp__btn" style="background:var(--color-primario)">Confirmar</button>' +
      '</form>' +
      '<div id="rsvp-enviado" style="display:none;text-align:center;font-family:var(--fuente-display);font-size:18px;font-style:italic;color:var(--color-accent);padding:24px 0">¡Gracias! ' + pareja.novio + ' y ' + pareja.novia + ' lo han anotado.</div>' +
    '</section>';
  },

  _mensajeFinal: function(mensaje, pareja) {
    return '<section style="background:var(--color-texto);text-align:center;padding:64px 32px;position:relative;overflow:hidden">' +
      '<div style="position:absolute;top:0;left:0;right:0">' + this._greca('#ffffff') + '</div>' +
      '<div style="padding-top:24px">' +
        '<p style="font-family:var(--fuente-display);font-size:clamp(17px,4vw,22px);font-style:italic;color:rgba(255,255,255,.88);line-height:1.85;max-width:300px;margin:0 auto 24px">' + mensaje.texto + '</p>' +
        '<div style="width:40px;height:1px;background:var(--color-accent);margin:0 auto 20px;opacity:.6"></div>' +
        '<p style="font-family:var(--fuente-display);font-size:20px;color:#fff;letter-spacing:2px">' + pareja.novio + ' &amp; ' + pareja.novia + '</p>' +
      '</div>' +
    '</section>';
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
      if (playing) { audio.pause(); btn.setAttribute('data-playing','false'); if(icon) icon.textContent='▶'; }
      else { audio.play().then(function(){ btn.setAttribute('data-playing','true'); if(icon) icon.textContent='⏸'; }).catch(function(){}); }
    });
    audio.addEventListener('ended', function() {
      btn.setAttribute('data-playing','false');
      var icon = btn.querySelector('.inv-musica__btn-icon');
      if(icon) icon.textContent='▶';
    });
  }
};
