// renderers/moderna.js — Plantilla Moderna
// Negro, blanco, geometría, sans-serif, mucho espacio

const RENDERER_MODERNA = {

  estilosDefault: {
    colorPrimario:    '#111111',
    colorSecundario:  '#ffffff',
    colorTexto:       '#111111',
    colorAccent:      '#666666',
    fuente:           'Libre Baskerville',
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
    // Música: botón flotante global, no inline
    if (boda.historia.activa) s.push(this._historia(boda.historia));
    if (boda.galeria.activa && boda.galeria.fotos.length > 0) s.push(this._galeria(boda.galeria));
    if (boda.evento.activo) s.push(this._evento(boda.evento, boda.fecha));
    if (boda.dresscode.activo) s.push(this._dresscode(boda.dresscode));
    if (boda.rsvp.activo) s.push(this._rsvp(boda.rsvp, boda.pareja));
    if (boda.mensaje.activo) s.push(this._mensajeFinal(boda.mensaje, boda.pareja));
    return s.join('');
  },

  _portada: function(boda) {
    var meses = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    var mes = meses[parseInt(boda.fecha.mes)-1] || boda.fecha.mes;
    return '<section style="background:var(--color-texto);min-height:100vh;display:flex;flex-direction:column;justify-content:flex-end;padding:48px 32px;position:relative;overflow:hidden">''+
      (boda.fotoCabecera ? '<div style="position:relative;width:100%;height:60vw;max-height:340px;overflow:hidden"><img src="'+boda.fotoCabecera+'" style="width:100%;height:100%;object-fit:cover;display:block"/><div style="position:absolute;bottom:0;left:0;right:0;height:100px;background:linear-gradient(to top,var(--color-secundario),transparent)"></div></div>' : '') +
      ' +
      // Línea decorativa diagonal
      '<div style="position:absolute;top:0;right:0;width:1px;height:60%;background:rgba(255,255,255,.15);transform:rotate(15deg);transform-origin:top right"></div>' +
      '<div style="position:absolute;top:32px;left:32px;width:40px;height:1px;background:rgba(255,255,255,.3)"></div>' +
      '<div style="position:absolute;top:32px;left:32px;width:1px;height:40px;background:rgba(255,255,255,.3)"></div>' +
      // Fecha arriba
      '<p style="position:absolute;top:40px;right:32px;font-family:var(--fuente-body);font-size:11px;font-weight:300;letter-spacing:4px;color:rgba(255,255,255,.4);text-transform:uppercase">' + boda.fecha.dia + '.' + mes + '.' + boda.fecha.anio + '</p>' +
      // Nombres
      '<div style="position:relative;z-index:1">' +
        '<p style="font-family:var(--fuente-body);font-size:10px;font-weight:300;letter-spacing:5px;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:16px">ceremonia de boda</p>' +
        '<h1 style="font-family:var(--fuente-display);font-weight:400;margin:0;line-height:1.05">' +
          '<span style="display:block;font-size:clamp(48px,12vw,72px);color:#fff">' + boda.pareja.novio + '</span>' +
          '<span style="display:block;font-size:clamp(14px,3vw,18px);font-weight:300;color:rgba(255,255,255,.4);letter-spacing:6px;margin:8px 0;font-style:italic">&amp;</span>' +
          '<span style="display:block;font-size:clamp(48px,12vw,72px);color:#fff">' + boda.pareja.novia + '</span>' +
        '</h1>' +
        '<div style="display:flex;align-items:center;gap:16px;margin-top:32px">' +
          '<div style="flex:1;height:1px;background:rgba(255,255,255,.2)"></div>' +
          '<p style="font-family:var(--fuente-body);font-size:10px;font-weight:300;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,.4)">' + boda.evento.lugar + '</p>' +
          '<div style="flex:1;height:1px;background:rgba(255,255,255,.2)"></div>' +
        '</div>' +
      '</div>' +
    '</section>';
  },

  _countdown: function(fecha) {
    return '<section style="padding:40px 32px;background:#f5f5f5;border-bottom:1px solid #e0e0e0">' +
      '<p style="font-family:var(--fuente-body);font-size:9px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#999;margin-bottom:20px;text-align:center">cuenta atrás</p>' +
      '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0">' +
        '<div style="text-align:center;border-right:1px solid #e0e0e0"><div id="cd-dias" style="font-family:var(--fuente-display);font-size:36px;color:var(--color-texto);font-weight:400">--</div><div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#999;margin-top:4px">días</div></div>' +
        '<div style="text-align:center;border-right:1px solid #e0e0e0"><div id="cd-horas" style="font-family:var(--fuente-display);font-size:36px;color:var(--color-texto);font-weight:400">--</div><div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#999;margin-top:4px">horas</div></div>' +
        '<div style="text-align:center;border-right:1px solid #e0e0e0"><div id="cd-minutos" style="font-family:var(--fuente-display);font-size:36px;color:var(--color-texto);font-weight:400">--</div><div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#999;margin-top:4px">min</div></div>' +
        '<div style="text-align:center"><div id="cd-segundos" style="font-family:var(--fuente-display);font-size:36px;color:var(--color-texto);font-weight:400">--</div><div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#999;margin-top:4px">seg</div></div>' +
      '</div>' +
    '</section>';
  },

  _musica: function(musica) {
    return '<section style="padding:20px 32px;background:#fff;border-bottom:1px solid #eee">' +
      '<div style="display:flex;align-items:center;gap:12px">' +
        '<div style="font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#ccc">♪</div>' +
        '<div style="flex:1;font-family:var(--fuente-body);font-size:13px;color:#666;letter-spacing:1px">' + (musica.titulo||'Nuestra canción') + '</div>' +
        '<button id="musica-btn" data-playing="false" style="width:36px;height:36px;border:1px solid var(--color-texto);background:transparent;color:var(--color-texto);cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center">' +
          '<span class="inv-musica__btn-icon">▶</span>' +
        '</button>' +
      '</div>' +
      '<audio id="musica-audio" src="' + musica.url + '" preload="none"></audio>' +
    '</section>';
  },

  _historia: function(historia) {
    return '<section style="padding:64px 32px;background:#fff">' +
      '<p style="font-family:var(--fuente-body);font-size:9px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#bbb;margin-bottom:20px">nuestra historia</p>' +
      '<div style="width:32px;height:2px;background:var(--color-texto);margin-bottom:28px"></div>' +
      '<p style="font-family:var(--fuente-display);font-size:17px;font-weight:400;line-height:1.85;color:var(--color-texto)">' + historia.texto + '</p>' +
    '</section>';
  },

  _galeria: function(galeria) {
    var imgs = galeria.fotos.map(function(url, i) {
      var style = i === 0 ? 'grid-column:1/-1;aspect-ratio:16/9' : 'aspect-ratio:1/1';
      return '<div style="' + style + ';overflow:hidden"><img src="' + url + '" style="width:100%;height:100%;object-fit:cover" loading="lazy"/></div>';
    }).join('');
    return '<section style="padding:0;background:#f5f5f5">' +
      '<div style="padding:48px 32px 24px">' +
        '<p style="font-family:var(--fuente-body);font-size:9px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#bbb;margin-bottom:12px">galería</p>' +
        '<div style="width:32px;height:2px;background:var(--color-texto)"></div>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:2px">' + imgs + '</div>' +
      '<div style="height:32px"></div>' +
    '</section>';
  },

  _evento: function(evento, fecha) {
    var meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    var mes = meses[parseInt(fecha.mes)-1]||fecha.mes;
    return '<section style="padding:64px 32px;background:#fff">' +
      '<p style="font-family:var(--fuente-body);font-size:9px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#bbb;margin-bottom:20px">la celebración</p>' +
      '<div style="width:32px;height:2px;background:var(--color-texto);margin-bottom:32px"></div>' +
      '<p style="font-family:var(--fuente-display);font-size:28px;font-weight:400;color:var(--color-texto);line-height:1.2;margin-bottom:8px">' + fecha.dia + ' de ' + mes + '</p>' +
      '<p style="font-family:var(--fuente-display);font-size:28px;font-weight:400;color:var(--color-texto);line-height:1.2;margin-bottom:24px">' + fecha.anio + '</p>' +
      '<div style="height:1px;background:#eee;margin-bottom:24px"></div>' +
      '<p style="font-family:var(--fuente-body);font-size:13px;font-weight:700;letter-spacing:1px;color:var(--color-texto);margin-bottom:4px">' + evento.lugar + '</p>' +
      '<p style="font-family:var(--fuente-body);font-size:13px;color:#999;margin-bottom:4px">' + evento.direccion + '</p>' +
      '<p style="font-family:var(--fuente-body);font-size:13px;color:#999;margin-bottom:20px">' + fecha.hora + ' h</p>' +
      (evento.googleMapsUrl ? '<a href="' + evento.googleMapsUrl + '" target="_blank" style="font-family:var(--fuente-body);font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--color-texto);text-decoration:none;border-bottom:2px solid var(--color-texto);padding-bottom:2px">Ver en el mapa →</a>' : '') +
    '</section>';
  },

  _dresscode: function(dresscode) {
    return '<section style="padding:48px 32px;background:#f5f5f5">' +
      '<p style="font-family:var(--fuente-body);font-size:9px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#bbb;margin-bottom:20px">dress code</p>' +
      '<div style="width:32px;height:2px;background:var(--color-texto);margin-bottom:24px"></div>' +
      '<p style="font-family:var(--fuente-display);font-size:17px;font-weight:400;color:var(--color-texto);line-height:1.8">' + dresscode.texto + '</p>' +
    '</section>';
  },

  _rsvp: function(rsvp, pareja) {
    var fechaStr = '';
    if (rsvp.fechaLimite) {
      var d = new Date(rsvp.fechaLimite);
      fechaStr = '<p style="font-family:var(--fuente-body);font-size:11px;color:#999;margin-bottom:24px">Confirmar antes del ' + d.toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'}) + '</p>';
    }
    return '<section style="padding:64px 32px;background:#fff">' +
      '<p style="font-family:var(--fuente-body);font-size:9px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#bbb;margin-bottom:20px">confirmar asistencia</p>' +
      '<div style="width:32px;height:2px;background:var(--color-texto);margin-bottom:32px"></div>' +
      fechaStr +
      '<form id="rsvp-form" style="display:flex;flex-direction:column;gap:12px">' +
        '<input type="text" name="nombre" placeholder="Nombre completo" required class="inv-rsvp__input" />' +
        '<div style="display:flex;flex-direction:column;gap:8px">' +
          '<label style="display:flex;align-items:center;gap:10px;font-family:var(--fuente-body);font-size:13px;color:var(--color-texto);cursor:pointer"><input type="radio" name="asistencia" value="si" /> Asistiré</label>' +
          '<label style="display:flex;align-items:center;gap:10px;font-family:var(--fuente-body);font-size:13px;color:var(--color-texto);cursor:pointer"><input type="radio" name="asistencia" value="no" /> No podré asistir</label>' +
        '</div>' +
        '<textarea name="mensaje" placeholder="Mensaje (opcional)" class="inv-rsvp__textarea" rows="3"></textarea>' +
        '<button type="submit" class="inv-rsvp__btn" style="background:var(--color-texto);letter-spacing:3px">Confirmar</button>' +
      '</form>' +
      '<div id="rsvp-enviado" style="display:none;font-family:var(--fuente-body);font-size:14px;color:#666;padding:24px 0">Confirmación recibida. Gracias.</div>' +
    '</section>';
  },

  _mensajeFinal: function(mensaje, pareja) {
    return '<section style="background:var(--color-texto);padding:64px 32px;position:relative;overflow:hidden">' +
      '<div style="position:absolute;bottom:0;right:0;width:100px;height:100px;border-top:1px solid rgba(255,255,255,.1);border-left:1px solid rgba(255,255,255,.1)"></div>' +
      '<p style="font-family:var(--fuente-display);font-size:clamp(18px,4vw,24px);font-weight:400;color:#fff;line-height:1.8;margin-bottom:32px">' + mensaje.texto + '</p>' +
      '<div style="height:1px;background:rgba(255,255,255,.15);margin-bottom:24px"></div>' +
      '<p style="font-family:var(--fuente-body);font-size:11px;font-weight:300;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,.5)">' + pareja.novio + ' &amp; ' + pareja.novia + '</p>' +
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
