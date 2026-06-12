// floral.js — Plantilla Botánica / Eucalipto
// Hojas acuarela SVG en esquinas, tipografía caligráfica, fondo blanco, detalles dorados

const RENDERER_FLORAL = {

  estilosDefault: {
    colorPrimario:    '#4a7c59',
    colorSecundario:  '#ffffff',
    colorTexto:       '#1a1a1a',
    colorAccent:      '#c9a84c',
    fuente:           'Cormorant Garamond',
    fuenteSecundaria: 'Lato',
  },

  _hoja: function(cx, cy, rx, ry, rot, color, op) {
    return '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="'+color+'" opacity="'+op+'" transform="rotate('+rot+','+cx+','+cy+')" />';
  },

  _rama: function(x1,y1,x2,y2,color,w,op) {
    return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+color+'" stroke-width="'+w+'" opacity="'+op+'" stroke-linecap="round"/>';
  },

  _eucalipto: function(mirror, flip) {
    var tx = mirror ? 'scale(-1,1) translate(-320,0)' : '';
    var ty = flip ? 'scale(1,-1) translate(0,-240)' : '';
    var t = (tx||ty) ? 'transform="'+(tx+' '+ty).trim()+'"' : '';
    var g1 = '#7ab893'; var g2 = '#5a9470'; var g3 = '#3d7a58';
    var gold = '#d4af5a';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" style="position:absolute;width:200px;height:150px" '+t+'>' +
      // Rama principal
      '<path d="M20,220 Q60,180 100,140 Q140,100 170,60 Q185,40 200,20" stroke="'+g3+'" stroke-width="1.8" fill="none" opacity=".7"/>' +
      // Rama secundaria
      '<path d="M80,160 Q110,130 130,100" stroke="'+g3+'" stroke-width="1.2" fill="none" opacity=".5"/>' +
      '<path d="M120,130 Q140,110 155,85" stroke="'+g3+'" stroke-width="1" fill="none" opacity=".45"/>' +
      // Hojas rama principal
      this._hoja(55,185,14,8,-50,g1,'.65') +
      this._hoja(45,195,12,7,-40,g2,'.5') +
      this._hoja(80,160,13,8,-55,g1,'.6') +
      this._hoja(70,168,11,6,-45,g2,'.5') +
      this._hoja(105,138,14,8,-60,g1,'.65') +
      this._hoja(95,148,12,7,-50,g2,'.5') +
      this._hoja(130,112,13,8,-65,g1,'.6') +
      this._hoja(120,122,11,6,-55,g2,'.5') +
      this._hoja(155,88,13,8,-70,g1,'.6') +
      this._hoja(145,98,11,6,-60,g2,'.5') +
      this._hoja(175,62,12,7,-75,g1,'.55') +
      this._hoja(165,72,10,6,-65,g2,'.45') +
      this._hoja(195,38,11,7,-80,g1,'.5') +
      // Hojas rama secundaria
      this._hoja(95,148,10,6,30,g1,'.55') +
      this._hoja(110,133,11,6,25,g2,'.5') +
      this._hoja(125,118,10,6,20,g1,'.5') +
      this._hoja(138,102,10,6,15,g2,'.45') +
      this._hoja(150,88,10,6,10,g1,'.5') +
      // Detalles dorados (pequeñas bayas)
      '<circle cx="60" cy="178" r="2.5" fill="'+gold+'" opacity=".7"/>' +
      '<circle cx="65" cy="172" r="2" fill="'+gold+'" opacity=".6"/>' +
      '<circle cx="55" cy="175" r="1.8" fill="'+gold+'" opacity=".55"/>' +
      '<circle cx="135" cy="106" r="2.5" fill="'+gold+'" opacity=".65"/>' +
      '<circle cx="140" cy="100" r="2" fill="'+gold+'" opacity=".55"/>' +
      '<circle cx="180" cy="55" r="2.5" fill="'+gold+'" opacity=".6"/>' +
      '<circle cx="185" cy="48" r="2" fill="'+gold+'" opacity=".5"/>' +
      '<circle cx="175" cy="52" r="1.8" fill="'+gold+'" opacity=".5"/>' +
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
    r.style.setProperty('--fuente-display',   "'"+e.fuente+"', serif");
    r.style.setProperty('--fuente-body',      "'"+e.fuenteSecundaria+"', sans-serif");
  },

  _build: function(boda) {
    var s = [];
    s.push(this._portada(boda));
    s.push(this._countdown(boda.fecha));
    if (boda.musica && boda.musica.activa && boda.musica.url) s.push(this._musica(boda.musica));
    if (boda.historia && boda.historia.activa) s.push(this._historia(boda.historia));
    if (boda.galeria && boda.galeria.activa && boda.galeria.fotos.length > 0) s.push(this._galeria(boda.galeria));
    if (boda.evento && boda.evento.activo) s.push(this._evento(boda.evento, boda.fecha));
    if (boda.dresscode && boda.dresscode.activo) s.push(this._dresscode(boda.dresscode));
    if (boda.rsvp && boda.rsvp.activo) s.push(this._rsvp(boda.rsvp, boda.pareja));
    if (boda.mensaje && boda.mensaje.activo) s.push(this._mensajeFinal(boda.mensaje, boda.pareja));
    return s.join('');
  },

  _portada: function(boda) {
    var meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    var mesN = meses[parseInt(boda.fecha.mes)-1]||boda.fecha.mes;
    var dias = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
    var fechaObj = new Date(parseInt(boda.fecha.anio), parseInt(boda.fecha.mes)-1, parseInt(boda.fecha.dia));
    var diaSemana = dias[fechaObj.getDay()] || '';
    return '<section style="background:#fff;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:60px 32px;position:relative;overflow:hidden">' +
      // Eucalipto esquina superior izquierda
      '<div style="position:absolute;top:0;left:0">'+this._eucalipto(false,false)+'</div>' +
      // Eucalipto esquina superior derecha (espejado)
      '<div style="position:absolute;top:0;right:0">'+this._eucalipto(true,false)+'</div>' +
      // Eucalipto esquina inferior izquierda
      '<div style="position:absolute;bottom:0;left:0">'+this._eucalipto(false,true)+'</div>' +
      // Eucalipto esquina inferior derecha
      '<div style="position:absolute;bottom:0;right:0">'+this._eucalipto(true,true)+'</div>' +
      // Contenido
      '<div style="position:relative;z-index:1;max-width:300px">' +
        '<p style="font-family:var(--fuente-body);font-size:10px;font-weight:400;letter-spacing:4px;text-transform:uppercase;color:#aaa;margin-bottom:24px">— os invitamos a nuestra boda —</p>' +
        '<h1 style="font-family:\'Great Vibes\',cursive;font-weight:400;margin:0;line-height:1.1;color:var(--color-texto)">' +
          '<span style="display:block;font-size:clamp(52px,13vw,72px)">'+boda.pareja.novio+'</span>' +
          '<span style="display:block;font-family:var(--fuente-body);font-size:14px;font-weight:300;letter-spacing:3px;color:var(--color-accent);margin:8px 0;font-style:italic">&amp;</span>' +
          '<span style="display:block;font-size:clamp(52px,13vw,72px)">'+boda.pareja.novia+'</span>' +
        '</h1>' +
        '<div style="width:60px;height:1px;background:var(--color-accent);margin:24px auto;opacity:.6"></div>' +
        '<p style="font-family:var(--fuente-body);font-size:11px;font-weight:300;letter-spacing:2px;text-transform:uppercase;color:#888;margin-bottom:4px">'+diaSemana+'</p>' +
        '<p style="font-family:var(--fuente-body);font-size:13px;font-weight:400;letter-spacing:3px;text-transform:uppercase;color:var(--color-texto);margin-bottom:4px">'+boda.fecha.dia+' · '+mesN+' · '+boda.fecha.anio+'</p>' +
        '<p style="font-family:var(--fuente-body);font-size:11px;font-weight:300;letter-spacing:2px;color:#aaa">'+boda.fecha.hora+' h — '+boda.evento.lugar+'</p>' +
      '</div>' +
    '</section>';
  },

  _countdown: function(fecha) {
    return '<section style="padding:36px 24px;text-align:center;background:var(--color-primario)">' +
      '<p style="font-family:var(--fuente-body);font-size:10px;font-weight:300;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,.65);margin-bottom:16px">cuenta atrás</p>' +
      '<div style="display:flex;justify-content:center;gap:20px">' +
        ['días','horas','min','seg'].map(function(u,i){ var id=['cd-dias','cd-horas','cd-minutos','cd-segundos'][i]; return '<div style="text-align:center"><div id="'+id+'" style="font-family:\'Cormorant Garamond\',serif;font-size:38px;color:#fff;line-height:1">--</div><div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.55);margin-top:4px">'+u+'</div></div>'; }).join('') +
      '</div>' +
    '</section>';
  },

  _musica: function(m) {
    return '<section style="padding:18px 32px;background:#fafafa;border-bottom:1px solid #f0f0f0">' +
      '<div style="display:flex;align-items:center;gap:12px;max-width:320px;margin:0 auto">' +
        '<span style="font-size:18px;color:var(--color-accent)">♪</span>' +
        '<span style="flex:1;font-family:\'Great Vibes\',cursive;font-size:18px;color:var(--color-texto)">'+(m.titulo||'Nuestra canción')+'</span>' +
        '<button id="musica-btn" data-playing="false" style="width:40px;height:40px;border-radius:50%;border:1.5px solid var(--color-primario);background:transparent;color:var(--color-primario);cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center"><span class="inv-musica__btn-icon">▶</span></button>' +
      '</div>' +
      '<audio id="musica-audio" src="'+m.url+'" preload="none"></audio>' +
    '</section>';
  },

  _seccionHeader: function(titulo) {
    return '<div style="text-align:center;margin-bottom:32px">' +
      '<p style="font-family:var(--fuente-body);font-size:9px;font-weight:400;letter-spacing:4px;text-transform:uppercase;color:var(--color-accent);margin-bottom:10px">— '+titulo+' —</p>' +
      '<div style="width:40px;height:1px;background:var(--color-accent);margin:0 auto;opacity:.5"></div>' +
    '</div>';
  },

  _historia: function(h) {
    return '<section style="padding:60px 36px;background:#fff;text-align:center">' +
      this._seccionHeader('nuestra historia') +
      '<p style="font-family:\'Cormorant Garamond\',serif;font-size:18px;font-style:italic;line-height:1.9;color:var(--color-texto);max-width:320px;margin:0 auto">'+h.texto+'</p>' +
    '</section>';
  },

  _galeria: function(g) {
    var imgs = g.fotos.map(function(url,i){ return '<div style="'+(i===0?'grid-column:1/-1;aspect-ratio:4/3':'aspect-ratio:3/4')+';overflow:hidden"><img src="'+url+'" style="width:100%;height:100%;object-fit:cover" loading="lazy"/></div>'; }).join('');
    return '<section style="padding:0;background:#fff">' +
      '<div style="text-align:center;padding:48px 32px 24px">'+this._seccionHeader('galería')+'</div>' +
      '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:4px">'+imgs+'</div>' +
    '</section>';
  },

  _evento: function(ev, fecha) {
    var meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    var mes = meses[parseInt(fecha.mes)-1]||fecha.mes;
    return '<section style="padding:60px 36px;background:#fafafa;text-align:center">' +
      this._seccionHeader('la celebración') +
      '<p style="font-family:\'Cormorant Garamond\',serif;font-size:22px;color:var(--color-texto);margin-bottom:6px">'+fecha.dia+' de '+mes+' de '+fecha.anio+'</p>' +
      '<p style="font-family:var(--fuente-body);font-size:11px;letter-spacing:3px;text-transform:uppercase;color:var(--color-accent);margin-bottom:24px">'+fecha.hora+' h</p>' +
      '<div style="width:32px;height:1px;background:var(--color-accent);margin:0 auto 24px;opacity:.4"></div>' +
      '<p style="font-family:\'Cormorant Garamond\',serif;font-size:20px;color:var(--color-texto);margin-bottom:6px">'+ev.lugar+'</p>' +
      '<p style="font-family:var(--fuente-body);font-size:12px;color:#aaa;margin-bottom:20px">'+ev.direccion+'</p>' +
      (ev.googleMapsUrl?'<a href="'+ev.googleMapsUrl+'" target="_blank" style="font-family:var(--fuente-body);font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--color-primario);text-decoration:none;border-bottom:1px solid var(--color-primario);padding-bottom:2px">Ver en el mapa →</a>':'') +
    '</section>';
  },

  _dresscode: function(d) {
    return '<section style="padding:52px 36px;background:#fff;text-align:center">' +
      this._seccionHeader('dress code') +
      '<p style="font-family:\'Cormorant Garamond\',serif;font-size:18px;font-style:italic;color:var(--color-texto);line-height:1.8">'+d.texto+'</p>' +
    '</section>';
  },

  _rsvp: function(rsvp, pareja) {
    var fStr='';
    if(rsvp.fechaLimite){var d=new Date(rsvp.fechaLimite);fStr='<p style="font-family:var(--fuente-body);font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--color-accent);text-align:center;margin-bottom:20px">antes del '+d.toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'})+'</p>';}
    return '<section style="padding:60px 36px;background:#fafafa">' +
      this._seccionHeader('confirma tu asistencia') +
      fStr +
      '<form id="rsvp-form" style="display:flex;flex-direction:column;gap:12px">' +
        '<input type="text" name="nombre" placeholder="Tu nombre completo" required class="inv-rsvp__input"/>' +
        '<div style="display:flex;flex-direction:column;gap:8px">' +
          '<label style="display:flex;align-items:center;gap:10px;font-family:var(--fuente-body);font-size:13px;color:var(--color-texto);cursor:pointer"><input type="radio" name="asistencia" value="si"/> Asistiré con alegría</label>' +
          '<label style="display:flex;align-items:center;gap:10px;font-family:var(--fuente-body);font-size:13px;color:var(--color-texto);cursor:pointer"><input type="radio" name="asistencia" value="no"/> No podré asistir</label>' +
        '</div>' +
        '<textarea name="mensaje" placeholder="Mensaje para los novios (opcional)" class="inv-rsvp__textarea" rows="3"></textarea>' +
        '<button type="submit" class="inv-rsvp__btn" style="background:var(--color-primario)">Confirmar</button>' +
      '</form>' +
      '<div id="rsvp-enviado" style="display:none;text-align:center;font-family:\'Great Vibes\',cursive;font-size:24px;color:var(--color-primario);padding:24px 0">¡Gracias! '+pareja.novio+' y '+pareja.novia+'</div>' +
    '</section>';
  },

  _mensajeFinal: function(msg, pareja) {
    return '<section style="background:#fff;text-align:center;padding:60px 36px;position:relative;overflow:hidden">' +
      '<div style="position:absolute;top:0;left:0;opacity:.3">'+this._eucalipto(false,false)+'</div>' +
      '<div style="position:absolute;top:0;right:0;opacity:.3">'+this._eucalipto(true,false)+'</div>' +
      '<div style="position:relative;z-index:1">' +
        '<div style="width:40px;height:1px;background:var(--color-accent);margin:0 auto 28px;opacity:.5"></div>' +
        '<p style="font-family:\'Cormorant Garamond\',serif;font-size:18px;font-style:italic;color:var(--color-texto);line-height:1.9;max-width:300px;margin:0 auto 24px">'+msg.texto+'</p>' +
        '<p style="font-family:\'Great Vibes\',cursive;font-size:32px;color:var(--color-primario)">'+pareja.novio+' &amp; '+pareja.novia+'</p>' +
        '<div style="width:40px;height:1px;background:var(--color-accent);margin:24px auto 0;opacity:.5"></div>' +
      '</div>' +
    '</section>';
  },

  _initCountdown: function(fecha, contenedor) {
    var hhmm=(fecha.hora||'12:00').split(':');
    var obj=new Date(parseInt(fecha.anio),parseInt(fecha.mes)-1,parseInt(fecha.dia),parseInt(hhmm[0]),parseInt(hhmm[1]));
    function tick(){var diff=obj-new Date();if(diff<=0)return;var s=function(id,v){var el=contenedor.querySelector('#'+id);if(el)el.textContent=String(v).padStart(2,'0');};s('cd-dias',Math.floor(diff/86400000));s('cd-horas',Math.floor((diff%86400000)/3600000));s('cd-minutos',Math.floor((diff%3600000)/60000));s('cd-segundos',Math.floor((diff%60000)/1000));}
    tick();if(contenedor.id==='invitation-root')setInterval(tick,1000);
  },

  _initMusica: function(contenedor) {
    var btn=contenedor.querySelector('#musica-btn');var audio=contenedor.querySelector('#musica-audio');if(!btn||!audio)return;
    btn.addEventListener('click',function(){var p=btn.getAttribute('data-playing')==='true';var ic=btn.querySelector('.inv-musica__btn-icon');if(p){audio.pause();btn.setAttribute('data-playing','false');if(ic)ic.textContent='▶';}else{audio.play().then(function(){btn.setAttribute('data-playing','true');if(ic)ic.textContent='⏸';}).catch(function(){});}});
    audio.addEventListener('ended',function(){btn.setAttribute('data-playing','false');var ic=btn.querySelector('.inv-musica__btn-icon');if(ic)ic.textContent='▶';});
  }
};
