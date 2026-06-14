// moderna.js — Plantilla Moderna / Minimalista
// Tipografía enorme, blanco total, serif + cursiva fina, cero ornamentos

const RENDERER_MODERNA = {

  estilosDefault: {
    colorPrimario:    '#111111',
    colorSecundario:  '#ffffff',
    colorTexto:       '#111111',
    colorAccent:      '#888888',
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
    var r=document.documentElement;
    r.style.setProperty('--color-primario',e.colorPrimario);
    r.style.setProperty('--color-secundario',e.colorSecundario);
    r.style.setProperty('--color-texto',e.colorTexto);
    r.style.setProperty('--color-accent',e.colorAccent);
    r.style.setProperty('--fuente-display',"'"+e.fuente+"', serif");
    r.style.setProperty('--fuente-body',"'"+e.fuenteSecundaria+"', sans-serif");
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
    var meses=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    var mes=meses[parseInt(boda.fecha.mes)-1]||boda.fecha.mes;
    return '<section style="background:#fff;min-height:100vh;padding:48px 36px;display:flex;flex-direction:column;justify-content:space-between">'+
      (boda.fotoCabecera ? '<div style="position:relative;width:calc(100% + 64px);margin-left:-32px;height:60vw;max-height:340px;overflow:hidden"><img src="'+boda.fotoCabecera+'" style="width:100%;height:100%;object-fit:cover;object-position:center top;display:block"/><div style="position:absolute;bottom:0;left:0;right:0;height:100px;background:linear-gradient(to top,var(--color-secundario),transparent)"></div></div>' : '') +
      // Top
      '<div style="display:flex;justify-content:space-between;align-items:flex-start">' +
        '<p style="font-family:var(--fuente-body);font-size:9px;font-weight:400;letter-spacing:3px;text-transform:uppercase;color:#ccc">boda</p>' +
        '<p style="font-family:var(--fuente-body);font-size:9px;font-weight:400;letter-spacing:3px;text-transform:uppercase;color:#ccc">'+boda.fecha.anio+'</p>' +
      '</div>' +
      // Centro — nombres grandes
      '<div style="padding:20px 0">' +
        '<h1 style="font-family:\'Libre Baskerville\',serif;font-weight:400;margin:0;line-height:0.95;letter-spacing:-1px">' +
          '<span style="display:block;font-size:clamp(54px,14vw,80px);color:var(--color-texto)">'+boda.pareja.novio+'</span>' +
        '</h1>' +
        '<p style="font-family:\'Great Vibes\',cursive;font-size:clamp(22px,5vw,30px);color:var(--color-accent);margin:8px 0 0 4px;line-height:1">and</p>' +
        '<h1 style="font-family:\'Libre Baskerville\',serif;font-weight:400;margin:0;line-height:0.95;letter-spacing:-1px">' +
          '<span style="display:block;font-size:clamp(54px,14vw,80px);color:var(--color-texto)">'+boda.pareja.novia+'</span>' +
        '</h1>' +
      '</div>' +
      // Bottom — detalles
      '<div style="border-top:1px solid #e8e8e8;padding-top:24px">' +
        '<p style="font-family:var(--fuente-body);font-size:11px;font-weight:400;letter-spacing:2px;text-transform:uppercase;color:var(--color-texto);margin-bottom:6px">'+boda.fecha.dia+' de '+mes+' de '+boda.fecha.anio+'</p>' +
        '<p style="font-family:var(--fuente-body);font-size:11px;font-weight:300;letter-spacing:1px;color:#aaa;margin-bottom:4px">'+boda.fecha.hora+' h</p>' +
        '<p style="font-family:var(--fuente-body);font-size:11px;font-weight:300;letter-spacing:1px;color:#aaa">'+boda.evento.lugar+'</p>' +
      '</div>' +
    '</section>';
  },

  _countdown: function(fecha) {
    return '<section style="padding:36px 36px;background:#f9f9f9">' +
      '<p style="font-family:var(--fuente-body);font-size:9px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#ccc;margin-bottom:20px;text-align:center">cuenta atrás</p>' +
      '<div style="display:grid;grid-template-columns:repeat(4,1fr);border:1px solid #ebebeb">' +
        [['cd-dias','días'],['cd-horas','horas'],['cd-minutos','min'],['cd-segundos','seg']].map(function(p,i){
          return '<div style="padding:16px 8px;text-align:center'+(i<3?';border-right:1px solid #ebebeb':'')+'">' +
            '<div id="'+p[0]+'" style="font-family:\'Libre Baskerville\',serif;font-size:32px;color:var(--color-texto);font-weight:400;line-height:1">--</div>' +
            '<div style="font-size:8px;letter-spacing:2px;text-transform:uppercase;color:#bbb;margin-top:6px">'+p[1]+'</div>' +
          '</div>';
        }).join('') +
      '</div>' +
    '</section>';
  },

  _musica: function(m) {
    return '<section style="padding:18px 36px;background:#fff;border-bottom:1px solid #f0f0f0">' +
      '<div style="display:flex;align-items:center;gap:16px">' +
        '<p style="font-family:var(--fuente-body);font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#bbb;flex-shrink:0">música</p>' +
        '<div style="flex:1;height:1px;background:#f0f0f0"></div>' +
        '<p style="font-family:\'Great Vibes\',cursive;font-size:16px;color:var(--color-texto)">'+(m.titulo||'Nuestra canción')+'</p>' +
        '<button id="musica-btn" data-playing="false" style="width:36px;height:36px;border:1px solid var(--color-texto);background:transparent;color:var(--color-texto);cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0"><span class="inv-musica__btn-icon">▶</span></button>' +
      '</div>' +
      '<audio id="musica-audio" src="'+m.url+'" preload="none"></audio>' +
    '</section>';
  },

  _historia: function(h) {
    return '<section style="padding:60px 36px;background:#fff">' +
      '<p style="font-family:var(--fuente-body);font-size:9px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#bbb;margin-bottom:16px">'+(historia.titulo||'Nuestra historia')+'</p>' +
      '<div style="width:24px;height:2px;background:var(--color-texto);margin-bottom:24px"></div>' +
      '<p style="font-family:\'Libre Baskerville\',serif;font-size:16px;font-weight:400;line-height:1.9;color:var(--color-texto)">'+h.texto+'</p>' +
    '</section>';
  },

  _galeria: function(g) {
    var imgs=g.fotos.map(function(url,i){return '<div style="'+(i===0?'grid-column:1/-1;aspect-ratio:16/9':'aspect-ratio:1/1')+';overflow:hidden"><img src="'+url+'" style="width:100%;height:100%;object-fit:cover" loading="lazy"/></div>';}).join('');
    return '<section style="background:#f9f9f9">' +
      '<div style="padding:48px 36px 20px"><p style="font-family:var(--fuente-body);font-size:9px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#bbb;margin-bottom:12px">'+(g.titulo||'Nuestra galería')+'</p><div style="width:24px;height:2px;background:var(--color-texto)"></div></div>' +
      '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:2px">'+imgs+'</div>' +
      '<div style="height:40px"></div>' +
    '</section>';
  },

  _evento: function(ev, fecha) {
    var meses=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    var mes=meses[parseInt(fecha.mes)-1]||fecha.mes;
    return '<section style="padding:60px 36px;background:#fff">' +
      '<p style="font-family:var(--fuente-body);font-size:9px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#bbb;margin-bottom:16px">'+(evento.titulo||'La celebración')+'</p>' +
      '<div style="width:24px;height:2px;background:var(--color-texto);margin-bottom:28px"></div>' +
      '<p style="font-family:\'Libre Baskerville\',serif;font-size:26px;font-weight:400;color:var(--color-texto);line-height:1.2;margin-bottom:6px">'+fecha.dia+' de '+mes+'</p>' +
      '<p style="font-family:\'Libre Baskerville\',serif;font-size:26px;font-weight:400;color:var(--color-texto);line-height:1.2;margin-bottom:20px">'+fecha.anio+'</p>' +
      '<div style="height:1px;background:#ebebeb;margin-bottom:20px"></div>' +
      '<p style="font-family:var(--fuente-body);font-size:13px;font-weight:700;color:var(--color-texto);margin-bottom:4px">'+ev.lugar+'</p>' +
      '<p style="font-family:var(--fuente-body);font-size:12px;font-weight:300;color:#aaa;margin-bottom:4px">'+ev.direccion+'</p>' +
      '<p style="font-family:var(--fuente-body);font-size:12px;font-weight:300;color:#aaa;margin-bottom:20px">'+fecha.hora+' h</p>' +
      (ev.googleMapsUrl?'<a href="'+ev.googleMapsUrl+'" target="_blank" style="font-family:var(--fuente-body);font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--color-texto);text-decoration:none;border-bottom:2px solid var(--color-texto);padding-bottom:2px">Ver ubicación →</a>':'') +
    '</section>';
  },

  _dresscode: function(d) {
    return '<section style="padding:52px 36px;background:#f9f9f9">' +
      '<p style="font-family:var(--fuente-body);font-size:9px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#bbb;margin-bottom:16px">'+(dresscode.titulo||'Dress code')+'</p>' +
      '<div style="width:24px;height:2px;background:var(--color-texto);margin-bottom:24px"></div>' +
      '<p style="font-family:\'Libre Baskerville\',serif;font-size:17px;font-weight:400;color:var(--color-texto);line-height:1.8">'+d.texto+'</p>' +
    '</section>';
  },

  _rsvp: function(rsvp, pareja) {
    var fStr='';if(rsvp.fechaLimite){var d=new Date(rsvp.fechaLimite);fStr='<p style="font-family:var(--fuente-body);font-size:11px;color:#aaa;margin-bottom:20px">Confirmar antes del '+d.toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'})+'</p>';}
    return '<section style="padding:60px 36px;background:#fff">' +
      '<p style="font-family:var(--fuente-body);font-size:9px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#bbb;margin-bottom:16px">'+(rsvp.titulo||'Confirma tu asistencia')+'</p>' +
      '<div style="width:24px;height:2px;background:var(--color-texto);margin-bottom:28px"></div>' +
      fStr +
      '<form id="rsvp-form" style="display:flex;flex-direction:column;gap:12px">' +
        '<input type="text" name="nombre" placeholder="Nombre completo" required class="inv-rsvp__input"/>' +
        '<div style="display:flex;flex-direction:column;gap:8px">' +
          '<label style="display:flex;align-items:center;gap:10px;font-family:var(--fuente-body);font-size:13px;color:var(--color-texto);cursor:pointer"><input type="radio" name="asistencia" value="si"/> Asistiré</label>' +
          '<label style="display:flex;align-items:center;gap:10px;font-family:var(--fuente-body);font-size:13px;color:var(--color-texto);cursor:pointer"><input type="radio" name="asistencia" value="no"/> No podré asistir</label>' +
        '</div>' +
        '<textarea name="mensaje" placeholder="Mensaje (opcional)" class="inv-rsvp__textarea" rows="3"></textarea>' +
        '<button type="submit" class="inv-rsvp__btn" style="background:var(--color-texto);letter-spacing:4px">CONFIRMAR</button>' +
      '</form>' +
      '<div id="rsvp-enviado" style="display:none;font-family:var(--fuente-body);font-size:13px;color:#888;padding:20px 0">Confirmación recibida. Gracias.</div>' +
    '</section>';
  },

  _mensajeFinal: function(msg, pareja) {
    return '<section style="background:var(--color-texto);padding:60px 36px">' +
      '<p style="font-family:\'Libre Baskerville\',serif;font-size:clamp(18px,4vw,24px);font-weight:400;color:#fff;line-height:1.85;margin-bottom:32px">'+msg.texto+'</p>' +
      '<div style="height:1px;background:rgba(255,255,255,.15);margin-bottom:24px"></div>' +
      '<p style="font-family:\'Great Vibes\',cursive;font-size:28px;color:rgba(255,255,255,.8)">'+pareja.novio+' &amp; '+pareja.novia+'</p>' +
    '</section>';
  },


  _separador: function() {
    return '<div style="padding:0;overflow:hidden;background:var(--color-secundario)">' +
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 375 32" style="width:100%;height:32px;display:block">' +
        // Línea principal
        '<line x1="0" y1="16" x2="375" y2="16" stroke="var(--color-texto)" stroke-width="0.5" opacity=".12"/>' +
        // Forma geométrica central
        '<rect x="175" y="10" width="12" height="12" fill="none" stroke="var(--color-texto)" stroke-width="1" opacity=".25" transform="rotate(45,181,16)"/>' +
        '<rect x="178" y="13" width="6" height="6" fill="var(--color-texto)" opacity=".15" transform="rotate(45,181,16)"/>' +
        // Guiones laterales
        '<line x1="120" y1="16" x2="155" y2="16" stroke="var(--color-texto)" stroke-width="1" opacity=".2"/>' +
        '<line x1="207" y1="16" x2="242" y2="16" stroke="var(--color-texto)" stroke-width="1" opacity=".2"/>' +
      '</svg>' +
    '</div>';
  },

  _initCountdown: function(fecha, contenedor) {
    var hhmm=(fecha.hora||'12:00').split(':');var obj=new Date(parseInt(fecha.anio),parseInt(fecha.mes)-1,parseInt(fecha.dia),parseInt(hhmm[0]),parseInt(hhmm[1]));
    function tick(){var diff=obj-new Date();if(diff<=0)return;var s=function(id,v){var el=contenedor.querySelector('#'+id);if(el)el.textContent=String(v).padStart(2,'0');};s('cd-dias',Math.floor(diff/86400000));s('cd-horas',Math.floor((diff%86400000)/3600000));s('cd-minutos',Math.floor((diff%3600000)/60000));s('cd-segundos',Math.floor((diff%60000)/1000));}
    tick();if(contenedor.id==='invitation-root')setInterval(tick,1000);
  },

  _initMusica: function(contenedor) {
    var btn=contenedor.querySelector('#musica-btn');var audio=contenedor.querySelector('#musica-audio');if(!btn||!audio)return;
    btn.addEventListener('click',function(){var p=btn.getAttribute('data-playing')==='true';var ic=btn.querySelector('.inv-musica__btn-icon');if(p){audio.pause();btn.setAttribute('data-playing','false');if(ic)ic.textContent='▶';}else{audio.play().then(function(){btn.setAttribute('data-playing','true');if(ic)ic.textContent='⏸';}).catch(function(){});}});
    audio.addEventListener('ended',function(){btn.setAttribute('data-playing','false');var ic=btn.querySelector('.inv-musica__btn-icon');if(ic)ic.textContent='▶';});
  }
};
