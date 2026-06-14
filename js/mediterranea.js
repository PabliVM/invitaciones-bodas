// mediterranea.js — Plantilla Mediterránea
// Azulejos talavera SVG como borde, limones, azul intenso, verano

const RENDERER_MEDITERRANEA = {

  estilosDefault: {
    colorPrimario:    '#1a56a0',
    colorSecundario:  '#ffffff',
    colorTexto:       '#0d2d5e',
    colorAccent:      '#e8b84b',
    fuente:           'Cormorant Garamond',
    fuenteSecundaria: 'Lato',
  },

  // Azulejo SVG individual
  _azulejo: function(x, y, size) {
    var b='#1a56a0'; var w='#ffffff'; var g='#e8b84b';
    return '<g transform="translate('+x+','+y+')">' +
      '<rect width="'+size+'" height="'+size+'" fill="'+b+'"/>' +
      '<rect x="2" y="2" width="'+(size-4)+'" height="'+(size-4)+'" fill="none" stroke="'+w+'" stroke-width="0.8" opacity=".6"/>' +
      '<circle cx="'+(size/2)+'" cy="'+(size/2)+'" r="'+(size*0.15)+'" fill="'+w+'" opacity=".7"/>' +
      '<path d="'+size*0.15+','+size*0.15+' '+size*0.85+','+size*0.85+'" stroke="'+w+'" stroke-width="0.6" opacity=".4"/>' +
      '<path d="'+size*0.85+','+size*0.15+' '+size*0.15+','+size*0.85+'" stroke="'+w+'" stroke-width="0.6" opacity=".4"/>' +
      '<circle cx="'+size*0.15+'" cy="'+size*0.15+'" r="'+size*0.08+'" fill="'+g+'" opacity=".7"/>' +
      '<circle cx="'+size*0.85+'" cy="'+size*0.15+'" r="'+size*0.08+'" fill="'+g+'" opacity=".7"/>' +
      '<circle cx="'+size*0.15+'" cy="'+size*0.85+'" r="'+size*0.08+'" fill="'+g+'" opacity=".7"/>' +
      '<circle cx="'+size*0.85+'" cy="'+size*0.85+'" r="'+size*0.08+'" fill="'+g+'" opacity=".7"/>' +
    '</g>';
  },

  // Borde de azulejos para una sección
  _bordeTalavera: function(ancho, alto, grosor) {
    var s = grosor; // tamaño de cada azulejo
    var cols = Math.ceil(ancho/s);
    var rows = Math.ceil(alto/s);
    var g = '';
    // Fila superior
    for(var c=0;c<cols;c++) g+=this._azulejo(c*s,0,s);
    // Fila inferior
    for(var c=0;c<cols;c++) g+=this._azulejo(c*s,(rows-1)*s,s);
    // Columna izquierda (sin esquinas)
    for(var r=1;r<rows-1;r++) g+=this._azulejo(0,r*s,s);
    // Columna derecha (sin esquinas)
    for(var r=1;r<rows-1;r++) g+=this._azulejo((cols-1)*s,r*s,s);
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+(cols*s)+' '+(rows*s)+'" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none">'+g+'</svg>';
  },

  // Limón SVG
  _limon: function(x, y, size, rot) {
    return '<g transform="translate('+x+','+y+') rotate('+rot+','+size/2+','+size/2+')">' +
      '<ellipse cx="'+size/2+'" cy="'+size/2+'" rx="'+size*0.42+'" ry="'+size*0.28+'" fill="#f4d03f" stroke="#e8b84b" stroke-width="0.8"/>' +
      '<ellipse cx="'+size*0.12+'" cy="'+size/2+'" rx="'+size*0.08+'" ry="'+size*0.06+'" fill="#f9e87f" opacity=".7"/>' +
      '<path d="'+size/2+','+(size*0.05)+' Q'+(size*0.6)+',0 '+(size*0.7)+','+(size*0.1)+'" stroke="#7ab548" stroke-width="1.2" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="'+size*0.72+'" cy="'+size*0.08+'" rx="'+size*0.12+'" ry="'+size*0.07+'" fill="#7ab548" opacity=".85" transform="rotate(-30,'+size*0.72+','+size*0.08+')"/>' +
    '</g>';
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
    var s=[];
    s.push(this._portada(boda));
    s.push(this._countdown(boda.fecha));
    // Música: botón flotante global, no inline
    if(boda.historia&&boda.historia.activa)s.push(this._historia(boda.historia));
    if(boda.galeria&&boda.galeria.activa&&boda.galeria.fotos.length>0)s.push(this._galeria(boda.galeria));
    if(boda.evento&&boda.evento.activo)s.push(this._evento(boda.evento,boda.fecha));
    if(boda.dresscode&&boda.dresscode.activo)s.push(this._dresscode(boda.dresscode));
    if(boda.rsvp&&boda.rsvp.activo)s.push(this._rsvp(boda.rsvp,boda.pareja));
    if(boda.mensaje&&boda.mensaje.activo)s.push(this._mensajeFinal(boda.mensaje,boda.pareja));
    return s.join('');
  },

  _portada: function(boda) {
    var meses=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    var mes=meses[parseInt(boda.fecha.mes)-1]||boda.fecha.mes;
    var s=28; // tamaño azulejo
    // Limones decorativos
    var limones='';
    var pos=[[20,20,40,15],[60,10,36,-10],[200,15,42,20],[230,25,34,-15],[20,180,38,30],[240,175,40,-20],[15,140,32,10]];
    pos.forEach(function(p){limones+='<div style="position:absolute;left:'+p[0]+'px;top:'+p[1]+'px;width:'+p[2]+'px;height:'+(p[2]*0.7)+'px">'+
      '<svg viewBox="0 0 '+p[2]+' '+(p[2]*0.7)+'" xmlns="http://www.w3.org/2000/svg">' +
      '<ellipse cx="'+(p[2]/2)+'" cy="'+(p[2]*0.35)+'" rx="'+(p[2]*0.42)+'" ry="'+(p[2]*0.28)+'" fill="#f4d03f" stroke="#e8b84b" stroke-width="0.8" transform="rotate('+p[3]+','+(p[2]/2)+','+(p[2]*0.35)+')"/>' +
      '<path d="'+(p[2]/2)+','+(p[2]*0.05)+' Q'+(p[2]*0.65)+',0 '+(p[2]*0.75)+','+(p[2]*0.15)+'" stroke="#7ab548" stroke-width="1.5" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="'+(p[2]*0.78)+'" cy="'+(p[2]*0.1)+'" rx="'+(p[2]*0.14)+'" ry="'+(p[2]*0.09)+'" fill="#7ab548" opacity=".9" transform="rotate(-30,'+(p[2]*0.78)+','+(p[2]*0.1)+')"/>' +
      '</svg></div>';
    });

    var fotoCab = boda.fotoCabecera ? '<div style="position:relative;width:100%;height:60vw;max-height:340px;overflow:hidden"><img src="'+boda.fotoCabecera+'" style="width:100%;height:100%;object-fit:cover;display:block"/><div style="position:absolute;bottom:0;left:0;right:0;height:100px;background:linear-gradient(to top,#fff,transparent)"></div></div>' : '';

    return '<section style="background:#fff;min-height:100vh;position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:60px 60px">' +
      // Borde azulejos (solo visual con div de borde)
      '<div style="position:absolute;inset:0;border:'+(s)+'px solid transparent;background:linear-gradient(white,white) padding-box, repeating-linear-gradient(90deg,#1a56a0 0px,'+(s)+'px,#1e6ab0 '+(s)+'px,'+(s*2)+'px) border-box;pointer-events:none"></div>' +
      // Marco azulejos real SVG - top
      '<div style="position:absolute;top:0;left:0;right:0;height:'+s+'px;overflow:hidden;background:var(--color-primario)"></div>' +
      '<div style="position:absolute;bottom:0;left:0;right:0;height:'+s+'px;overflow:hidden;background:var(--color-primario)"></div>' +
      '<div style="position:absolute;top:0;left:0;bottom:0;width:'+s+'px;background:var(--color-primario)"></div>' +
      '<div style="position:absolute;top:0;right:0;bottom:0;width:'+s+'px;background:var(--color-primario)"></div>' +
      // Limones
      limones +
      // Foto cabecera
      fotoCab +
      // Contenido
      '<div style="position:relative;z-index:2;max-width:260px">' +
        '<p style="font-family:var(--fuente-body);font-size:10px;font-weight:300;letter-spacing:4px;text-transform:uppercase;color:var(--color-primario);margin-bottom:20px;opacity:.7">— juntos para siempre —</p>' +
        '<h1 style="font-family:\'Cormorant Garamond\',serif;font-weight:300;margin:0;line-height:1.1;color:var(--color-texto)">' +
          '<span style="display:block;font-size:clamp(44px,11vw,62px)">'+boda.pareja.novio+'</span>' +
          '<span style="display:block;font-size:clamp(26px,6vw,36px);font-style:italic;color:var(--color-accent);letter-spacing:2px">&amp;</span>' +
          '<span style="display:block;font-size:clamp(44px,11vw,62px)">'+boda.pareja.novia+'</span>' +
        '</h1>' +
        '<div style="width:48px;height:2px;background:var(--color-accent);margin:20px auto"></div>' +
        '<p style="font-family:var(--fuente-body);font-size:12px;font-weight:300;letter-spacing:3px;color:var(--color-texto);text-transform:uppercase">'+boda.fecha.dia+' · '+mes+' · '+boda.fecha.anio+'</p>' +
        '<p style="font-family:var(--fuente-body);font-size:11px;font-weight:300;color:#aaa;margin-top:4px;letter-spacing:2px">'+boda.fecha.hora+' h — '+boda.evento.lugar+'</p>' +
      '</div>' +
    '</section>';
  },

  _countdown: function(fecha) {
    return '<section style="padding:36px 24px;text-align:center;background:var(--color-primario)">' +
      '<p style="font-family:var(--fuente-body);font-size:10px;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,.6);margin-bottom:16px">faltan</p>' +
      '<div style="display:flex;justify-content:center;gap:16px">' +
        [['cd-dias','días'],['cd-horas','horas'],['cd-minutos','min'],['cd-segundos','seg']].map(function(p){
          return '<div style="text-align:center;background:rgba(255,255,255,.1);padding:12px 14px;border:1px solid rgba(255,255,255,.2)">' +
            '<div id="'+p[0]+'" style="font-family:\'Cormorant Garamond\',serif;font-size:34px;color:#fff;line-height:1">--</div>' +
            '<div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.55);margin-top:4px">'+p[1]+'</div>' +
          '</div>';
        }).join('') +
      '</div>' +
    '</section>';
  },

  _musica: function(m) {
    return '<section style="padding:18px 32px;background:#fffdf5;border-bottom:1px solid #f5e9c0">' +
      '<div style="display:flex;align-items:center;gap:12px;max-width:320px;margin:0 auto">' +
        '<span style="font-size:18px;color:var(--color-accent)">♪</span>' +
        '<span style="flex:1;font-family:\'Cormorant Garamond\',serif;font-size:16px;font-style:italic;color:var(--color-texto)">'+(m.titulo||'Nuestra canción')+'</span>' +
        '<button id="musica-btn" data-playing="false" style="width:40px;height:40px;border-radius:50%;border:1.5px solid var(--color-primario);background:transparent;color:var(--color-primario);cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center"><span class="inv-musica__btn-icon">▶</span></button>' +
      '</div>' +
      '<audio id="musica-audio" src="'+m.url+'" preload="none"></audio>' +
    '</section>';
  },

  _seccionHeader: function(titulo) {
    return '<div style="text-align:center;margin-bottom:32px">' +
      '<p style="font-family:var(--fuente-body);font-size:9px;letter-spacing:4px;text-transform:uppercase;color:var(--color-accent);margin-bottom:10px">'+titulo+'</p>' +
      '<div style="width:40px;height:2px;background:var(--color-primario);margin:0 auto"></div>' +
    '</div>';
  },

  _historia: function(h) {
    return '<section style="padding:56px 36px;background:#fff;text-align:center">' +
      this._seccionHeader('nuestra historia') +
      '<p style="font-family:\'Cormorant Garamond\',serif;font-size:18px;font-style:italic;line-height:1.9;color:var(--color-texto);max-width:300px;margin:0 auto">'+h.texto+'</p>' +
    '</section>';
  },

  _galeria: function(g) {
    var imgs=g.fotos.map(function(url,i){return '<div style="'+(i===0?'grid-column:1/-1;aspect-ratio:4/3':'aspect-ratio:3/4')+';overflow:hidden"><img src="'+url+'" style="width:100%;height:100%;object-fit:cover" loading="lazy"/></div>';}).join('');
    return '<section style="background:#fffdf5">' +
      '<div style="padding:48px 36px 20px">'+this._seccionHeader('momentos')+'</div>' +
      '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:4px;padding:0 16px 40px">'+imgs+'</div>' +
    '</section>';
  },

  _evento: function(ev, fecha) {
    var meses=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    var mes=meses[parseInt(fecha.mes)-1]||fecha.mes;
    return '<section style="padding:56px 36px;background:var(--color-primario);text-align:center">' +
      this._seccionHeader('la celebración') +
      '<p style="font-family:\'Cormorant Garamond\',serif;font-size:22px;color:#fff;margin-bottom:6px">'+fecha.dia+' de '+mes+' de '+fecha.anio+'</p>' +
      '<p style="font-family:var(--fuente-body);font-size:11px;letter-spacing:3px;color:var(--color-accent);text-transform:uppercase;margin-bottom:24px">'+fecha.hora+' h</p>' +
      '<div style="background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);padding:20px 24px">' +
        '<p style="font-family:\'Cormorant Garamond\',serif;font-size:20px;color:#fff;margin-bottom:6px">'+ev.lugar+'</p>' +
        '<p style="font-family:var(--fuente-body);font-size:12px;color:rgba(255,255,255,.65);margin-bottom:16px">'+ev.direccion+'</p>' +
        (ev.googleMapsUrl?'<a href="'+ev.googleMapsUrl+'" target="_blank" style="font-family:var(--fuente-body);font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--color-accent);text-decoration:none;border-bottom:1px solid var(--color-accent);padding-bottom:2px">Ver en el mapa →</a>':'') +
      '</div>' +
    '</section>';
  },

  _dresscode: function(d) {
    return '<section style="padding:52px 36px;background:#fff;text-align:center">' +
      this._seccionHeader('dress code') +
      '<p style="font-family:\'Cormorant Garamond\',serif;font-size:18px;font-style:italic;color:var(--color-texto);line-height:1.8">'+d.texto+'</p>' +
    '</section>';
  },

  _rsvp: function(rsvp, pareja) {
    var fStr='';if(rsvp.fechaLimite){var d=new Date(rsvp.fechaLimite);fStr='<p style="font-family:var(--fuente-body);font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--color-accent);text-align:center;margin-bottom:20px">antes del '+d.toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'})+'</p>';}
    return '<section style="padding:56px 36px;background:#fffdf5">' +
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
      '<div id="rsvp-enviado" style="display:none;text-align:center;font-family:\'Cormorant Garamond\',serif;font-size:20px;font-style:italic;color:var(--color-primario);padding:24px 0">¡Gracias! '+pareja.novio+' y '+pareja.novia+'</div>' +
    '</section>';
  },

  _mensajeFinal: function(msg, pareja) {
    return '<section style="background:var(--color-texto);text-align:center;padding:56px 36px">' +
      '<div style="width:40px;height:2px;background:var(--color-accent);margin:0 auto 24px"></div>' +
      '<p style="font-family:\'Cormorant Garamond\',serif;font-size:18px;font-style:italic;color:rgba(255,255,255,.88);line-height:1.9;max-width:280px;margin:0 auto 24px">'+msg.texto+'</p>' +
      '<div style="width:40px;height:2px;background:var(--color-accent);margin:0 auto 20px"></div>' +
      '<p style="font-family:\'Cormorant Garamond\',serif;font-size:22px;color:#fff;font-weight:300">'+pareja.novio+' &amp; '+pareja.novia+'</p>' +
    '</section>';
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
