// renderers/floral.js — Plantilla Floral
// Flores SVG en esquinas, fondo crema suave, tipografía caligráfica

const RENDERER_FLORAL = {

  estilosDefault: {
    colorPrimario:    '#d4788a',
    colorSecundario:  '#fdf8f5',
    colorTexto:       '#3d2b2b',
    colorAccent:      '#7a9e7e',
    fuente:           'Playfair Display',
    fuenteSecundaria: 'Lato',
  },

  // SVG de flores para esquinas
  _svgFlores: function(color, mirror) {
    var t = mirror ? 'transform="scale(-1,1) translate(-200,0)"' : '';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" style="position:absolute;width:140px;height:140px;opacity:.55" ' + t + '>' +
      // Ramas
      '<path d="M10,190 Q40,140 80,100 Q110,70 140,40" stroke="' + color + '" stroke-width="1.5" fill="none" opacity=".6"/>' +
      '<path d="M10,190 Q50,160 90,130" stroke="' + color + '" stroke-width="1" fill="none" opacity=".4"/>' +
      '<path d="M80,100 Q60,80 50,60" stroke="' + color + '" stroke-width="1" fill="none" opacity=".5"/>' +
      '<path d="M100,80 Q85,60 75,45" stroke="' + color + '" stroke-width="1" fill="none" opacity=".4"/>' +
      // Hojas
      '<ellipse cx="55" cy="58" rx="10" ry="6" fill="' + color + '" opacity=".35" transform="rotate(-45,55,58)"/>' +
      '<ellipse cx="75" cy="43" rx="9" ry="5" fill="' + color + '" opacity=".3" transform="rotate(-50,75,43)"/>' +
      '<ellipse cx="90" cy="128" rx="10" ry="5" fill="' + color + '" opacity=".3" transform="rotate(20,90,128)"/>' +
      // Flores pequeñas
      '<circle cx="82" cy="99" r="5" fill="' + color + '" opacity=".5"/>' +
      '<circle cx="79" cy="99" r="2.5" fill="#fff" opacity=".8"/>' +
      '<circle cx="141" cy="39" r="6" fill="' + color + '" opacity=".6"/>' +
      '<circle cx="138" cy="39" r="3" fill="#fff" opacity=".8"/>' +
      '<circle cx="110" cy="68" r="4" fill="' + color + '" opacity=".45"/>' +
      '<circle cx="108" cy="68" r="2" fill="#fff" opacity=".8"/>' +
      // Pétalos
      '<ellipse cx="82" cy="93" rx="3" ry="5" fill="' + color + '" opacity=".4" transform="rotate(0,82,93)"/>' +
      '<ellipse cx="88" cy="95" rx="3" ry="5" fill="' + color + '" opacity=".4" transform="rotate(50,88,95)"/>' +
      '<ellipse cx="85" cy="106" rx="3" ry="5" fill="' + color + '" opacity=".4" transform="rotate(130,85,106)"/>' +
      '<ellipse cx="76" cy="104" rx="3" ry="5" fill="' + color + '" opacity=".4" transform="rotate(180,76,104)"/>' +
      '<ellipse cx="74" cy="95" rx="3" ry="5" fill="' + color + '" opacity=".4" transform="rotate(230,74,95)"/>' +
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
    var mes = meses[parseInt(boda.fecha.mes)-1] || boda.fecha.mes;
    var c = boda.estilos.colorPrimario;
    var ca = boda.estilos.colorAccent;
    return '<section style="background:var(--color-secundario);min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:48px 32px;position:relative;overflow:hidden">' +
      // Flores esquina superior izquierda
      '<div style="position:absolute;top:0;left:0">' + this._svgFlores(ca, false) + '</div>' +
      // Flores esquina superior derecha (espejadas)
      '<div style="position:absolute;top:0;right:0">' + this._svgFlores(c, true) + '</div>' +
      // Flores esquina inferior izquierda (rotadas)
      '<div style="position:absolute;bottom:0;left:0;transform:rotate(90deg) translateX(-100%)">' + this._svgFlores(ca, false) + '</div>' +
      // Flores esquina inferior derecha
      '<div style="position:absolute;bottom:0;right:0;transform:rotate(-90deg) translateY(-100%)">' + this._svgFlores(c, true) + '</div>' +
      // Contenido
      '<div style="position:relative;z-index:1">' +
        '<p style="font-family:var(--fuente-body);font-size:10px;font-weight:300;letter-spacing:5px;text-transform:uppercase;color:var(--color-accent);margin-bottom:20px">— con amor —</p>' +
        '<h1 style="font-family:var(--fuente-display);font-weight:400;display:flex;flex-direction:column;align-items:center;line-height:1.15;margin:0">' +
          '<span style="font-size:clamp(44px,11vw,68px);color:var(--color-texto)">' + boda.pareja.novio + '</span>' +
          '<span style="font-size:clamp(22px,5vw,32px);color:var(--color-primario);font-style:italic;letter-spacing:2px">y</span>' +
          '<span style="font-size:clamp(44px,11vw,68px);color:var(--color-texto)">' + boda.pareja.novia + '</span>' +
        '</h1>' +
        '<div style="margin-top:28px;width:60px;height:1px;background:var(--color-primario);margin-left:auto;margin-right:auto;opacity:.4"></div>' +
        '<p style="font-family:var(--fuente-body);font-size:13px;font-weight:300;letter-spacing:3px;color:var(--color-texto);margin-top:16px;opacity:.7">' +
          boda.fecha.dia + ' · ' + mes + ' · ' + boda.fecha.anio +
        '</p>' +
        '<p style="font-family:var(--fuente-body);font-size:10px;font-weight:300;letter-spacing:2px;text-transform:uppercase;color:var(--color-accent);margin-top:8px">nos casamos</p>' +
      '</div>' +
    '</section>';
  },

  _countdown: function(fecha) {
    return '<section style="padding:40px 24px;text-align:center;background:var(--color-primario);position:relative">' +
      '<p style="font-family:var(--fuente-body);font-size:10px;font-weight:300;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,.7);margin-bottom:16px">✿ faltan ✿</p>' +
      '<div style="display:flex;justify-content:center;gap:20px">' +
        '<div style="text-align:center"><div id="cd-dias" style="font-family:var(--fuente-display);font-size:40px;color:#fff;font-weight:400;line-height:1">--</div><div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.6);margin-top:4px">días</div></div>' +
        '<div style="text-align:center"><div id="cd-horas" style="font-family:var(--fuente-display);font-size:40px;color:#fff;font-weight:400;line-height:1">--</div><div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.6);margin-top:4px">horas</div></div>' +
        '<div style="text-align:center"><div id="cd-minutos" style="font-family:var(--fuente-display);font-size:40px;color:#fff;font-weight:400;line-height:1">--</div><div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.6);margin-top:4px">min</div></div>' +
        '<div style="text-align:center"><div id="cd-segundos" style="font-family:var(--fuente-display);font-size:40px;color:#fff;font-weight:400;line-height:1">--</div><div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.6);margin-top:4px">seg</div></div>' +
      '</div>' +
      '<p style="font-family:var(--fuente-body);font-size:10px;font-weight:300;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,.7);margin-top:16px">para el gran día</p>' +
    '</section>';
  },

  _musica: function(musica) {
    return '<section style="padding:20px 32px;background:var(--color-secundario)">' +
      '<div style="display:flex;align-items:center;gap:12px;max-width:340px;margin:0 auto;background:#fff;padding:14px 16px;border-radius:0;border:1px solid rgba(0,0,0,.08)">' +
        '<div style="font-size:20px;color:var(--color-primario)">✿</div>' +
        '<div style="flex:1;font-family:var(--fuente-display);font-size:14px;font-style:italic;color:var(--color-texto)">' + (musica.titulo||'Nuestra canción') + '</div>' +
        '<button id="musica-btn" data-playing="false" style="width:40px;height:40px;border-radius:50%;border:1.5px solid var(--color-primario);background:transparent;color:var(--color-primario);cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center">' +
          '<span class="inv-musica__btn-icon">▶</span>' +
        '</button>' +
      '</div>' +
      '<audio id="musica-audio" src="' + musica.url + '" preload="none"></audio>' +
    '</section>';
  },

  _historia: function(historia) {
    var c = historia.colorPrimario;
    return '<section style="padding:64px 32px;background:var(--color-secundario);text-align:center;position:relative">' +
      '<p style="font-family:var(--fuente-body);font-size:10px;font-weight:300;letter-spacing:4px;text-transform:uppercase;color:var(--color-accent);margin-bottom:8px">✿</p>' +
      '<h2 style="font-family:var(--fuente-display);font-size:32px;font-weight:400;color:var(--color-texto);margin:0 0 8px">Nuestra historia</h2>' +
      '<div style="width:48px;height:1px;background:var(--color-primario);margin:0 auto 32px;opacity:.4"></div>' +
      '<p style="font-family:var(--fuente-display);font-size:17px;font-style:italic;line-height:1.9;color:var(--color-texto);max-width:340px;margin:0 auto;font-weight:400">' + historia.texto + '</p>' +
    '</section>';
  },

  _galeria: function(galeria) {
    var imgs = galeria.fotos.map(function(url, i) {
      var style = i === 0 ? 'grid-column:1/-1;aspect-ratio:4/3' : 'aspect-ratio:3/4';
      return '<div style="' + style + ';overflow:hidden"><img src="' + url + '" style="width:100%;height:100%;object-fit:cover" loading="lazy"/></div>';
    }).join('');
    return '<section style="padding:0;background:var(--color-secundario)">' +
      '<div style="text-align:center;padding:48px 32px 32px">' +
        '<p style="font-family:var(--fuente-body);font-size:10px;letter-spacing:4px;text-transform:uppercase;color:var(--color-accent);margin-bottom:8px">✿</p>' +
        '<h2 style="font-family:var(--fuente-display);font-size:32px;font-weight:400;color:var(--color-texto);margin:0 0 8px">Momentos</h2>' +
        '<div style="width:48px;height:1px;background:var(--color-primario);margin:0 auto;opacity:.4"></div>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:6px;padding:0 24px 48px">' + imgs + '</div>' +
    '</section>';
  },

  _evento: function(evento, fecha) {
    var meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    var mes = meses[parseInt(fecha.mes)-1]||fecha.mes;
    return '<section style="padding:56px 32px;background:#fff;text-align:center">' +
      '<p style="font-family:var(--fuente-body);font-size:10px;letter-spacing:4px;text-transform:uppercase;color:var(--color-accent);margin-bottom:8px">✿</p>' +
      '<h2 style="font-family:var(--fuente-display);font-size:32px;font-weight:400;color:var(--color-texto);margin:0 0 8px">La celebración</h2>' +
      '<div style="width:48px;height:1px;background:var(--color-primario);margin:0 auto 32px;opacity:.4"></div>' +
      '<p style="font-family:var(--fuente-display);font-size:20px;color:var(--color-texto);font-weight:400;margin-bottom:4px">' + fecha.dia + ' de ' + mes + ' de ' + fecha.anio + '</p>' +
      '<p style="font-family:var(--fuente-body);font-size:12px;letter-spacing:3px;color:var(--color-accent);text-transform:uppercase;margin-bottom:24px">' + fecha.hora + ' h</p>' +
      '<div style="width:32px;height:1px;background:var(--color-primario);margin:0 auto 24px;opacity:.3"></div>' +
      '<p style="font-family:var(--fuente-display);font-size:22px;font-weight:400;color:var(--color-texto);margin-bottom:8px">' + evento.lugar + '</p>' +
      '<p style="font-family:var(--fuente-body);font-size:13px;color:#999;margin-bottom:20px">' + evento.direccion + '</p>' +
      (evento.googleMapsUrl ? '<a href="' + evento.googleMapsUrl + '" target="_blank" style="font-family:var(--fuente-body);font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--color-primario);text-decoration:none;border-bottom:1px solid var(--color-primario);padding-bottom:2px">Ver en el mapa →</a>' : '') +
    '</section>';
  },

  _dresscode: function(dresscode) {
    return '<section style="padding:56px 32px;background:var(--color-secundario);text-align:center">' +
      '<p style="font-family:var(--fuente-body);font-size:10px;letter-spacing:4px;text-transform:uppercase;color:var(--color-accent);margin-bottom:8px">✿</p>' +
      '<h2 style="font-family:var(--fuente-display);font-size:32px;font-weight:400;color:var(--color-texto);margin:0 0 8px">Dress code</h2>' +
      '<div style="width:48px;height:1px;background:var(--color-primario);margin:0 auto 28px;opacity:.4"></div>' +
      '<p style="font-family:var(--fuente-display);font-size:17px;font-style:italic;color:var(--color-texto);line-height:1.8;font-weight:400">' + dresscode.texto + '</p>' +
    '</section>';
  },

  _rsvp: function(rsvp, pareja) {
    var fechaStr = '';
    if (rsvp.fechaLimite) {
      var d = new Date(rsvp.fechaLimite);
      fechaStr = '<p style="font-family:var(--fuente-body);font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--color-accent);text-align:center;margin-bottom:24px">Antes del ' + d.toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'}) + '</p>';
    }
    return '<section style="padding:56px 32px;background:#fff">' +
      '<div style="text-align:center;margin-bottom:32px">' +
        '<p style="font-family:var(--fuente-body);font-size:10px;letter-spacing:4px;text-transform:uppercase;color:var(--color-accent);margin-bottom:8px">✿</p>' +
        '<h2 style="font-family:var(--fuente-display);font-size:32px;font-weight:400;color:var(--color-texto);margin:0 0 8px">Confirma tu asistencia</h2>' +
        '<div style="width:48px;height:1px;background:var(--color-primario);margin:0 auto;opacity:.4"></div>' +
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
    return '<section style="background:var(--color-primario);text-align:center;padding:64px 32px;position:relative;overflow:hidden">' +
      '<p style="font-size:14px;color:rgba(255,255,255,.5);letter-spacing:10px;margin-bottom:28px">✿ ✿ ✿</p>' +
      '<p style="font-family:var(--fuente-display);font-size:clamp(17px,4vw,22px);font-weight:400;font-style:italic;color:rgba(255,255,255,.92);line-height:1.9;max-width:300px;margin:0 auto 20px">' + mensaje.texto + '</p>' +
      '<p style="font-family:var(--fuente-display);font-size:20px;font-weight:400;color:#fff;letter-spacing:2px">' + pareja.novio + ' &amp; ' + pareja.novia + '</p>' +
      '<p style="font-size:14px;color:rgba(255,255,255,.4);margin-top:28px;letter-spacing:8px">✿</p>' +
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
