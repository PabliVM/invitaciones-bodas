// invitacion.js — Motor único de la invitación (móvil y escritorio, todas las plantillas).
// Genera HTML semántico con clases inv-*; el aspecto lo ponen css/invitacion.css
// (plantilla vía data-plantilla) y las variables de tema calculadas de boda.estilos.

const INVITACION = (() => {

  const PLANTILLAS = ['clasica', 'floral', 'moderna', 'mediterranea', 'deco', 'acuarela', 'revista', 'boho'];
  const PREDEFINIDAS = ['historia', 'galeria', 'evento', 'dresscode', 'alojamiento', 'transporte', 'rsvp', 'mensaje'];
  const ETIQUETAS = {
    portada: 'Inicio', historia: 'Historia', galeria: 'Galería', evento: 'Evento', dresscode: 'Dress code',
    alojamiento: 'Alojamiento', transporte: 'Transporte', rsvp: 'Asistencia', mensaje: 'Mensaje', formulario: 'Cuestionario'
  };
  const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

  // Ejes de Google Fonts por familia (null = solo peso 400)
  const FUENTES = {
    'Cormorant Garamond': 'ital,wght@0,300;0,400;0,500;0,600;1,300;1,400',
    'Playfair Display':   'ital,wght@0,400;0,500;1,400',
    'EB Garamond':        'ital,wght@0,400;0,500;1,400',
    'Libre Baskerville':  'ital,wght@0,400;0,700;1,400',
    'Lora':               'ital,wght@0,400;0,500;1,400',
    'Great Vibes':        null,
    'Dancing Script':     'wght@400;600',
    'Parisienne':         null,
    'Pinyon Script':      null,
    'Josefin Sans':       'wght@300;400;600',
    'Montserrat':         'wght@300;400;500;600',
    'Raleway':            'wght@300;400;500;600',
    'Lato':               'wght@300;400;700'
  };
  // Fuente caligráfica que usa cada plantilla para detalles (el "&", firmas…)
  const FUENTE_SCRIPT = { clasica: null, floral: 'Great Vibes', moderna: 'Great Vibes', mediterranea: null, deco: null, acuarela: 'Great Vibes', revista: null, boho: 'Great Vibes' };

  let _timers = [];
  let _observadores = [];
  let _teclas = null;

  // ── Utilidades ──

  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function parrafos(t) { return esc(t).replace(/\n/g, '<br>'); }
  function url(u) {
    u = String(u || '').trim();
    return /^(https?:)?\/\//i.test(u) || /^\/[^/]/.test(u) ? esc(u) : '';
  }
  // Punto importante de la foto elegido en el editor ('X% Y%')
  let _encuadres = {};
  function foco(u) {
    const v = _encuadres[String(u || '').trim()];
    return /^\d{1,3}% \d{1,3}%$/.test(v || '') ? ' style="object-position:' + v + '"' : '';
  }
  function activa(sec) { return !!sec && sec.activo !== false && sec.activa !== false; }

  function fechaBoda(f) {
    const hm = String((f && f.hora) || '12:00').split(':');
    return new Date(parseInt(f.anio), parseInt(f.mes) - 1, parseInt(f.dia), parseInt(hm[0]) || 0, parseInt(hm[1]) || 0);
  }
  function fechaLarga(f) {
    const mes = MESES[parseInt(f.mes) - 1] || f.mes || '';
    return (f.dia || '') + ' de ' + mes + ' de ' + (f.anio || '');
  }
  function diaSemana(f) {
    const d = fechaBoda(f);
    return isNaN(d) ? '' : DIAS[d.getDay()];
  }
  // Textos según el tipo de evento (boda por defecto)
  const TIPOS = {
    boda:        { kicker: 'Nos casamos',                 invitado: 'Estás invitado a la boda de',        titulo: 'Boda de',        para: 'los novios' },
    bautizo:     { kicker: 'Mi bautizo',                  invitado: 'Estás invitado al bautizo de',       titulo: 'Bautizo de',     para: 'la familia' },
    comunion:    { kicker: 'Mi primera comunión',         invitado: 'Estás invitado a la comunión de',    titulo: 'Comunión de',    para: 'la familia' },
    cumpleanos:  { kicker: '¡Lo celebramos!',             invitado: 'Estás invitado al cumpleaños de',    titulo: 'Cumpleaños de',  para: 'el anfitrión' },
    aniversario: { kicker: 'Celebramos nuestro aniversario', invitado: 'Estás invitado al aniversario de', titulo: 'Aniversario de', para: 'los anfitriones' },
    evento:      { kicker: 'Te invitamos',                invitado: 'Estás invitado a la celebración de', titulo: 'Celebración de', para: 'los anfitriones' }
  };
  function textos(boda) { return TIPOS[boda && boda.tipoEvento] || TIPOS.boda; }
  // "Ana & Luis" o solo "Lucas" si hay un único nombre
  function nombresHtml(p) {
    return p.novia ? esc(p.novio) + ' <span>&amp;</span> ' + esc(p.novia) : esc(p.novio);
  }
  function nombresTexto(p, union) {
    return p.novia ? (p.novio || '') + union + p.novia : (p.novio || '');
  }

  function iniciales(p) {
    return ((p.novio || ' ')[0] + (p.novia || ' ')[0]).toUpperCase().trim();
  }

  // Luminancia → color de texto legible sobre el primario
  function contraste(hex) {
    const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim());
    if (!m) return '#ffffff';
    const n = parseInt(m[1], 16);
    const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.45 ? '#141414' : '#ffffff';
  }
  function esOscuro(hex) { return contraste(hex) === '#ffffff'; }

  // ── Tema y fuentes ──

  function aplicarTema(estilos, plantilla, raiz) {
    const e = estilos || {};
    const v = {
      '--inv-fondo':          e.colorSecundario || '#f5f0e8',
      '--inv-texto':          e.colorTexto || '#2c2c2c',
      '--inv-primario':       e.colorPrimario || '#b8860b',
      '--inv-acento':         e.colorAccent || '#8b6914',
      '--inv-sobre-primario': contraste(e.colorPrimario || '#b8860b'),
      '--inv-fuente-display': "'" + (e.fuente || 'Cormorant Garamond') + "', Georgia, serif",
      '--inv-fuente-body':    "'" + (e.fuenteSecundaria || 'Lato') + "', -apple-system, 'Segoe UI', sans-serif",
      '--inv-fuente-script':  FUENTE_SCRIPT[plantilla] ? "'" + FUENTE_SCRIPT[plantilla] + "', cursive" : 'inherit'
    };
    // También en <html>: lo usan elementos fuera de la raíz (música flotante, efectos)
    Object.keys(v).forEach(k => { raiz.style.setProperty(k, v[k]); document.documentElement.style.setProperty(k, v[k]); });
    raiz.setAttribute('data-tono', esOscuro(v['--inv-fondo']) ? 'oscuro' : 'claro');
    // Fondo del documento (rebote de scroll, barras del navegador)
    document.documentElement.style.background = v['--inv-fondo'];
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', v['--inv-fondo']);
  }

  function cargarFuentes(estilos, plantilla) {
    const e = estilos || {};
    const familias = [e.fuente || 'Cormorant Garamond', e.fuenteSecundaria || 'Lato', FUENTE_SCRIPT[plantilla]]
      .filter((f, i, a) => f && a.indexOf(f) === i && f in FUENTES);
    const href = 'https://fonts.googleapis.com/css2?' + familias.map(f =>
      'family=' + f.replace(/ /g, '+') + (FUENTES[f] ? ':' + FUENTES[f] : '')).join('&') + '&display=swap';
    let link = document.getElementById('inv-fuentes');
    if (link && link.getAttribute('href') === href) return;
    if (!link) {
      link = document.createElement('link');
      link.id = 'inv-fuentes';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }

  // ── Orden de secciones ──

  // Sección extra por id estable ('extra_<uid>') o, en datos antiguos, por posición ('extra_0')
  function buscarExtra(boda, id) {
    const extras = boda.secciones_extra || [];
    const clave = id.slice(6);
    return extras.find(s => s && s.uid === clave) || (/^\d+$/.test(clave) ? extras[+clave] : null);
  }

  function orden(boda) {
    let o = (boda.orden_secciones || ['historia', 'galeria', 'evento', 'dresscode', 'rsvp', 'mensaje']).slice();
    const extras = boda.secciones_extra || [];
    if (boda.formulario && boda.formulario.activo && o.indexOf('formulario') === -1) o.push('formulario');
    extras.forEach((s, i) => {
      if (!o.some(id => id.indexOf('extra_') === 0 && buscarExtra(boda, id) === s)) o.push('extra_' + (s && s.uid ? s.uid : i));
    });
    return o.filter((id, i) => {
      if (o.indexOf(id) !== i) return false;
      if (id.indexOf('extra_') === 0) {
        const ex = buscarExtra(boda, id);
        return !!ex && !!(ex.titulo || ex.texto || (ex.subsecciones && ex.subsecciones.length));
      }
      if (id === 'formulario') return !!(boda.formulario && boda.formulario.activo && (boda.formulario.preguntas || []).length);
      if (id === 'galeria') return activa(boda.galeria) && (boda.galeria.fotos || []).length > 0;
      return PREDEFINIDAS.indexOf(id) !== -1 && activa(boda[id]);
    });
  }

  function datosSeccion(boda, id) {
    return id.indexOf('extra_') === 0 ? buscarExtra(boda, id) : boda[id];
  }

  // Etiqueta corta para el menú: fija en las predefinidas, título en las extra
  function etiqueta(boda, id) {
    if (ETIQUETAS[id]) return ETIQUETAS[id];
    const sec = datosSeccion(boda, id) || {};
    return sec.titulo || 'Sección';
  }

  // ── Bloques comunes ──

  function cabecera(titulo, kicker) {
    return '<header class="inv-cab">' +
      '<span class="inv-orn" aria-hidden="true"></span>' +
      (kicker ? '<p class="inv-kicker">' + esc(kicker) + '</p>' : '') +
      '<h2 class="inv-titulo">' + esc(titulo) + '</h2>' +
      '<span class="inv-regla" aria-hidden="true"></span>' +
    '</header>';
  }

  function subsecciones(subs) {
    subs = (subs || []).filter(s => s && (s.titulo || s.texto));
    if (!subs.length) return '';
    return '<div class="inv-subs">' + subs.map(s =>
      '<div class="inv-sub">' +
        (s.titulo ? '<p class="inv-sub__titulo">' + esc(s.titulo) + '</p>' : '') +
        (s.texto ? '<p class="inv-sub__texto">' + parrafos(s.texto) + '</p>' : '') +
      '</div>').join('') + '</div>';
  }

  function seccion(id, clase, foto, contenido) {
    return '<section class="inv-sec inv-' + clase + '" id="sec-' + id + '" data-seccion="' + id + '"' +
      (foto ? ' data-foto="' + url(foto) + '"' : '') + '>' +
      '<div class="inv-sec__in">' + contenido + '</div></section>';
  }

  // ── Secciones ──

  function portada(boda) {
    const p = boda.pareja || {}, f = boda.fecha || {};
    const mes = (MESES[parseInt(f.mes) - 1] || '').slice(0, 3);
    const foto = url(boda.fotoCabecera);
    const lugar = boda.evento && activa(boda.evento) ? boda.evento.lugar : '';
    return '<section class="inv-sec inv-portada" id="sec-portada" data-seccion="portada"' + (foto ? ' data-foto="' + foto + '"' : '') + '>' +
      (foto ? '<figure class="inv-portada__foto"><img src="' + foto + '" alt=""' + foco(boda.fotoCabecera) + ' /></figure>' : '') +
      '<div class="inv-portada__marco" aria-hidden="true"></div>' +
      '<div class="inv-sec__in">' +
        '<span class="inv-orn" aria-hidden="true"></span>' +
        '<p class="inv-kicker inv-portada__kicker">' + esc(textos(boda).kicker) + '</p>' +
        '<h1 class="inv-nombres">' +
          '<span class="inv-nombres__uno">' + esc(p.novio) + '</span>' +
          (p.novia ? '<span class="inv-nombres__y">&amp;</span><span class="inv-nombres__dos">' + esc(p.novia) + '</span>' : '') +
        '</h1>' +
        '<p class="inv-portada__fecha">' +
          '<span class="inv-portada__dia">' + esc(diaSemana(f)) + '</span>' +
          '<span>' + esc(f.dia) + '</span><i>·</i><span>' + esc(mes) + '</span><i>·</i><span>' + esc(f.anio) + '</span>' +
        '</p>' +
        (lugar ? '<p class="inv-portada__lugar">' + esc(lugar) + '</p>' : '') +
        '<span class="inv-regla" aria-hidden="true"></span>' +
      '</div>' +
      '<a class="inv-portada__bajar" href="#sec-cuenta" aria-label="Ver más"><span></span></a>' +
    '</section>';
  }

  function cuentaAtras() {
    const celda = (id, txt) => '<div class="inv-cuenta__celda"><span class="inv-cuenta__num" data-cd="' + id + '">--</span><span class="inv-cuenta__lbl">' + txt + '</span></div>';
    return '<section class="inv-sec inv-cuenta" id="sec-cuenta" data-seccion="cuenta"><div class="inv-sec__in">' +
      '<p class="inv-kicker">Faltan</p>' +
      '<div class="inv-cuenta__grid">' + celda('d', 'días') + celda('h', 'horas') + celda('m', 'min') + celda('s', 'seg') + '</div>' +
      '<p class="inv-kicker inv-cuenta__pie">para el gran día</p>' +
    '</div></section>';
  }

  function historia(sec) {
    return seccion('historia', 'historia', sec.foto,
      cabecera(sec.titulo || 'Nuestra historia') +
      (sec.texto ? '<p class="inv-cita">' + parrafos(sec.texto) + '</p>' : '') +
      subsecciones(sec.subsecciones));
  }

  function galeria(sec) {
    const originales = (sec.fotos || []).filter(u => url(u));
    const fotos = originales.map(url);
    return seccion('galeria', 'galeria', sec.foto || fotos[0],
      cabecera(sec.titulo || 'Nuestra galería') +
      '<div class="inv-galeria__grid" data-n="' + Math.min(fotos.length, 5) + '">' +
        fotos.map((u, i) => '<button type="button" class="inv-galeria__item" data-i="' + i + '" aria-label="Ver foto ' + (i + 1) + '"><img src="' + u + '" alt="" loading="lazy"' + foco(originales[i]) + ' /></button>').join('') +
      '</div>' + subsecciones(sec.subsecciones));
  }

  function evento(sec, boda) {
    const f = boda.fecha || {};
    const inicio = fechaBoda(f);
    const fmt = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const p = boda.pareja || {};
    const cal = isNaN(inicio) ? '' :
      'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(textos(boda).titulo + ' ' + nombresTexto(p, ' y ')) +
      '&dates=' + fmt(inicio) + '/' + fmt(new Date(inicio.getTime() + 6 * 3600000)) +
      '&location=' + encodeURIComponent([sec.lugar, sec.direccion].filter(Boolean).join(', '));
    const mapa = url(sec.googleMapsUrl);
    return seccion('evento', 'evento', sec.foto,
      cabecera(sec.titulo || 'La celebración') +
      '<div class="inv-tarjeta">' +
        '<p class="inv-evento__fecha">' + esc(fechaLarga(f)) + '</p>' +
        (f.hora ? '<p class="inv-evento__hora">' + esc(f.hora) + ' h</p>' : '') +
        '<span class="inv-regla" aria-hidden="true"></span>' +
        (sec.lugar ? '<p class="inv-evento__lugar">' + esc(sec.lugar) + '</p>' : '') +
        (sec.direccion ? '<p class="inv-evento__dir">' + esc(sec.direccion) + '</p>' : '') +
        '<div class="inv-acciones">' +
          (mapa ? '<a class="inv-btn" href="' + mapa + '" target="_blank" rel="noopener">Cómo llegar</a>' : '') +
          (cal ? '<a class="inv-btn inv-btn--linea" href="' + esc(cal) + '" target="_blank" rel="noopener">Añadir al calendario</a>' : '') +
        '</div>' +
      '</div>' + subsecciones(sec.subsecciones));
  }

  function texto(id, sec, defecto) {
    return seccion(id, 'texto inv-' + id, sec.foto,
      cabecera(sec.titulo || defecto) +
      (sec.texto ? '<p class="inv-cita">' + parrafos(sec.texto) + '</p>' : '') +
      subsecciones(sec.subsecciones));
  }

  function rsvp(sec, preview, boda) {
    let limite = '';
    if (sec.fechaLimite) {
      const d = new Date(sec.fechaLimite);
      if (!isNaN(d)) limite = 'Antes del ' + d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    }
    return seccion('rsvp', 'rsvp', sec.foto,
      cabecera(sec.titulo || 'Confirma tu asistencia', limite) +
      '<form class="inv-form" id="rsvp-form" novalidate>' +
        '<input class="inv-input" type="text" name="nombre" placeholder="Nombre y apellidos" required autocomplete="name" />' +
        '<div class="inv-opciones">' +
          '<label class="inv-opcion"><input type="radio" name="asistencia" value="si" required /><span>Asistiré con alegría</span></label>' +
          '<label class="inv-opcion"><input type="radio" name="asistencia" value="no" /><span>No podré asistir</span></label>' +
        '</div>' +
        '<textarea class="inv-input" name="mensaje" rows="3" placeholder="Mensaje para ' + esc(textos(boda).para) + ' (opcional)"></textarea>' +
        '<p class="inv-form__error" hidden></p>' +
        '<button class="inv-btn inv-btn--lleno" type="submit">' + (preview ? 'Confirmar (vista previa)' : 'Confirmar asistencia') + '</button>' +
      '</form>' +
      '<div class="inv-gracias" hidden><span class="inv-orn" aria-hidden="true"></span><p></p></div>' +
      subsecciones(sec.subsecciones));
  }

  function mensaje(sec, boda) {
    const p = boda.pareja || {};
    return seccion('mensaje', 'mensaje', sec.foto,
      '<span class="inv-orn inv-orn--triple" aria-hidden="true"></span>' +
      (sec.texto ? '<p class="inv-mensaje__texto">' + parrafos(sec.texto) + '</p>' : '') +
      '<p class="inv-firma">' + nombresHtml(p) + '</p>' +
      subsecciones(sec.subsecciones));
  }

  function formulario(form, preview) {
    const preguntas = (form.preguntas || []).map((q, i) => {
      const nombre = 'preg_' + esc(q.id);
      const req = q.obligatoria ? ' required' : '';
      let campo = '';
      if (q.tipo === 'opcion_unica' || q.tipo === 'opcion_multiple') {
        const tipo = q.tipo === 'opcion_unica' ? 'radio' : 'checkbox';
        campo = '<div class="inv-opciones">' + (q.opciones || []).filter(Boolean).map(op =>
          '<label class="inv-opcion"><input type="' + tipo + '" name="' + nombre + '" value="' + esc(op) + '"' + (tipo === 'radio' ? req : '') + ' /><span>' + esc(op) + '</span></label>').join('') + '</div>';
      } else if (q.tipo === 'numero') {
        campo = '<input class="inv-input inv-input--corto" type="number" min="0" name="' + nombre + '" placeholder="0"' + req + ' />';
      } else {
        campo = '<input class="inv-input" type="text" name="' + nombre + '" placeholder="Tu respuesta"' + req + ' />';
      }
      return '<fieldset class="inv-pregunta" data-id="' + esc(q.id) + '" data-tipo="' + esc(q.tipo) + '" data-req="' + (q.obligatoria ? 1 : 0) + '">' +
        '<legend class="inv-pregunta__txt">' + (i + 1) + '. ' + esc(q.texto) + (q.obligatoria ? ' <span class="inv-req">*</span>' : '') + '</legend>' +
        campo + '</fieldset>';
    }).join('');
    return seccion('formulario', 'formulario', form.foto,
      cabecera(form.titulo || 'Cuestionario') +
      (form.descripcion ? '<p class="inv-desc">' + parrafos(form.descripcion) + '</p>' : '') +
      '<form class="inv-form" id="formulario-custom" novalidate>' + preguntas +
        '<p class="inv-form__error" hidden></p>' +
        '<button class="inv-btn inv-btn--lleno" type="submit">' + esc(form.textoBtnEnviar || 'Enviar') + (preview ? ' (vista previa)' : '') + '</button>' +
      '</form>' +
      '<div class="inv-gracias" hidden><span class="inv-orn" aria-hidden="true"></span><p>' + esc(form.mensajeConfirmacion || '¡Gracias!') + '</p></div>');
  }

  function extra(id, sec) {
    return seccion(id, 'texto inv-extra', sec.foto,
      cabecera(sec.titulo || '') +
      (sec.texto ? '<p class="inv-cita">' + parrafos(sec.texto) + '</p>' : '') +
      subsecciones(sec.subsecciones));
  }

  function construirSeccion(boda, id, preview) {
    const sec = datosSeccion(boda, id);
    if (id.indexOf('extra_') === 0) return extra(id, sec);
    switch (id) {
      case 'historia':    return historia(sec);
      case 'galeria':     return galeria(sec);
      case 'evento':      return evento(sec, boda);
      case 'dresscode':   return texto('dresscode', sec, 'Dress code');
      case 'alojamiento': return texto('alojamiento', sec, 'Alojamiento');
      case 'transporte':  return texto('transporte', sec, 'Transporte');
      case 'rsvp':        return rsvp(sec, preview, boda);
      case 'mensaje':     return mensaje(sec, boda);
      case 'formulario':  return formulario(boda.formulario, preview);
    }
    return '';
  }

  // ── Estructura completa ──

  function construir(boda, ids, preview) {
    const p = boda.pareja || {}, f = boda.fecha || {};
    const nav = [{ id: 'portada', label: 'Inicio' }].concat(ids.map(id => ({ id, label: etiqueta(boda, id) })));
    const enlaces = nav.map(n => '<a href="#sec-' + esc(n.id) + '" data-ir="' + esc(n.id) + '">' + esc(n.label) + '</a>').join('');

    return '' +
      // Escritorio: panel fijo con foto de la sección visible
      '<aside class="inv-lateral" aria-hidden="true">' +
        '<div class="inv-lateral__fotos"></div>' +
        '<div class="inv-lateral__vacio"><span>' + esc(iniciales(p)) + '</span></div>' +
        '<div class="inv-lateral__velo"></div>' +
        '<div class="inv-lateral__pie">' +
          '<p class="inv-lateral__nombres">' + nombresHtml(p) + '</p>' +
          '<p class="inv-lateral__fecha">' + esc(fechaLarga(f)) + '</p>' +
        '</div>' +
      '</aside>' +
      '<div class="inv-contenido">' +
        '<nav class="inv-nav" aria-label="Secciones"><div class="inv-nav__pista">' + enlaces + '</div></nav>' +
        portada(boda) + cuentaAtras() +
        ids.map(id => construirSeccion(boda, id, preview)).join('') +
        '<footer class="inv-pie"><span class="inv-orn" aria-hidden="true"></span><p>' + esc(p.novio) + ' &amp; ' + esc(p.novia) + ' · ' + esc(f.anio) + '</p></footer>' +
      '</div>' +
      '<div class="inv-lightbox" hidden><button type="button" class="inv-lightbox__cerrar" aria-label="Cerrar">✕</button>' +
        '<button type="button" class="inv-lightbox__nav inv-lightbox__prev" aria-label="Anterior">‹</button>' +
        '<img alt="" /><button type="button" class="inv-lightbox__nav inv-lightbox__next" aria-label="Siguiente">›</button></div>';
  }

  // ── Comportamiento ──

  function limpiar() {
    _timers.forEach(clearInterval);
    _observadores.forEach(o => o.disconnect());
    _timers = [];
    _observadores = [];
    if (_teclas) document.removeEventListener('keydown', _teclas);
    _teclas = null;
    document.body.classList.remove('inv-bloqueo');
    const m = document.getElementById('inv-musica');
    if (m) m.remove();
  }

  function iniciarCuenta(raiz, f) {
    const objetivo = fechaBoda(f || {});
    const tick = () => {
      const diff = objetivo - new Date();
      const caja = raiz.querySelector('.inv-cuenta');
      if (!caja) return;
      if (isNaN(diff)) return;
      if (diff <= 0) {
        caja.classList.add('inv-cuenta--fin');
        caja.querySelector('.inv-cuenta__grid').innerHTML = '<p class="inv-cuenta__hoy">¡Ya es el gran día!</p>';
        return true;
      }
      const set = (k, v) => { const el = raiz.querySelector('[data-cd="' + k + '"]'); if (el) el.textContent = String(v).padStart(2, '0'); };
      set('d', Math.floor(diff / 86400000));
      set('h', Math.floor(diff % 86400000 / 3600000));
      set('m', Math.floor(diff % 3600000 / 60000));
      set('s', Math.floor(diff % 60000 / 1000));
    };
    if (tick()) return;
    const t = setInterval(() => { if (tick()) clearInterval(t); }, 1000);
    _timers.push(t);
  }

  let _reproducir = null; // arranca la música (lo usa la pantalla de bienvenida)

  function iniciarMusica(musica) {
    _reproducir = null;
    if (!musica || !activa(musica) || !url(musica.url)) return;
    const texto = musica.mostrarTexto === 'personalizado' ? musica.textoFlotante
      : musica.mostrarTexto === 'ninguno' ? '' : (musica.titulo || 'Nuestra canción');
    const inicio = Math.max(0, +musica.inicio || 0);
    const el = document.createElement('div');
    el.id = 'inv-musica';
    el.className = 'inv-musica';
    el.innerHTML = (texto ? '<span class="inv-musica__txt">' + esc(texto) + '</span>' : '') +
      '<button type="button" class="inv-musica__btn" aria-label="Reproducir música"><span class="inv-musica__ico">▶</span></button>' +
      '<audio src="' + url(musica.url) + '" preload="metadata" loop></audio>';
    document.body.appendChild(el);
    const btn = el.querySelector('button'), audio = el.querySelector('audio'), ico = el.querySelector('.inv-musica__ico');
    let empezada = false, rampa = null;

    // Primera vez: salta al segundo elegido y sube el volumen suavemente
    const reproducir = () => {
      if (!empezada && inicio) {
        if (audio.readyState >= 1) audio.currentTime = inicio;
        else audio.addEventListener('loadedmetadata', () => { audio.currentTime = inicio; }, { once: true });
      }
      empezada = true;
      audio.volume = 0;
      clearInterval(rampa);
      rampa = setInterval(() => { audio.volume = Math.min(1, audio.volume + 0.05); if (audio.volume >= 1) clearInterval(rampa); }, 100);
      return audio.play().catch(() => {});
    };
    _reproducir = reproducir;
    btn.addEventListener('click', () => { if (!audio.paused) audio.pause(); else reproducir(); });
    // Respaldo: si el salto inicial no se aplicó (audio aún cargando), se repite al empezar a sonar
    audio.addEventListener('playing', () => {
      if (inicio && audio.currentTime < inicio - 1 && !audio.dataset.saltado) { audio.dataset.saltado = '1'; audio.currentTime = inicio; }
    });
    audio.addEventListener('play', () => { el.classList.add('sonando'); ico.textContent = '❚❚'; btn.setAttribute('aria-label', 'Pausar música'); });
    audio.addEventListener('pause', () => { el.classList.remove('sonando'); ico.textContent = '▶'; btn.setAttribute('aria-label', 'Reproducir música'); });
  }

  // Pantalla "Abrir invitación": al tocarla arranca la música (los móviles lo exigen)
  function iniciarBienvenida(boda) {
    const m = boda.musica || {};
    if (!m.bienvenida) return;
    const p = boda.pareja || {}, f = boda.fecha || {};
    const foto = url(boda.fotoCabecera);
    const el = document.createElement('div');
    el.className = 'inv-bienvenida';
    el.id = 'inv-bienvenida';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Abrir invitación');
    el.innerHTML = (foto ? '<img class="inv-bienvenida__foto" src="' + foto + '" alt=""' + foco(boda.fotoCabecera) + ' />' : '') +
      '<div class="inv-bienvenida__in">' +
        '<span class="inv-orn" aria-hidden="true"></span>' +
        '<p class="inv-kicker">' + esc(textos(boda).invitado) + '</p>' +
        '<p class="inv-bienvenida__nombres">' + nombresHtml(p) + '</p>' +
        '<p class="inv-bienvenida__fecha">' + esc(fechaLarga(f)) + '</p>' +
        '<button type="button" class="inv-btn inv-btn--lleno inv-bienvenida__btn">Abrir invitación</button>' +
        (_reproducir ? '<p class="inv-bienvenida__nota">♪ con música</p>' : '') +
      '</div>';
    document.querySelector('.inv').appendChild(el);
    document.body.classList.add('inv-bloqueo');
    el.querySelector('button').addEventListener('click', () => {
      if (_reproducir) _reproducir();
      el.classList.add('abierta');
      document.body.classList.remove('inv-bloqueo');
      setTimeout(() => el.remove(), 1000);
    });
  }

  // Nav activa + foto lateral según la sección visible
  function iniciarScroll(raiz) {
    const secciones = Array.from(raiz.querySelectorAll('.inv-sec[data-seccion]'));
    const enlaces = Array.from(raiz.querySelectorAll('.inv-nav a'));
    const pista = raiz.querySelector('.inv-nav__pista');
    const fotos = raiz.querySelector('.inv-lateral__fotos');
    const lateral = raiz.querySelector('.inv-lateral');

    // Foto efectiva de cada sección: la suya o la última anterior
    let ultima = '';
    const mapaFoto = {};
    secciones.forEach(s => { if (s.dataset.foto) ultima = s.dataset.foto; mapaFoto[s.dataset.seccion] = ultima; });
    const distintas = Array.from(new Set(Object.values(mapaFoto).filter(Boolean)));
    fotos.innerHTML = distintas.map(u => '<img src="' + esc(u) + '" alt="" data-src="' + esc(u) + '"' + foco(u) + ' />').join('');
    lateral.classList.toggle('inv-lateral--sin-foto', !distintas.length);

    const activar = id => {
      enlaces.forEach(a => {
        const on = a.dataset.ir === id;
        a.classList.toggle('activo', on);
        if (on && pista) pista.scrollTo({ left: a.offsetLeft - pista.clientWidth / 2 + a.clientWidth / 2, behavior: 'smooth' });
      });
      const u = mapaFoto[id];
      fotos.querySelectorAll('img').forEach(img => img.classList.toggle('visible', img.dataset.src === u));
    };

    const io = new IntersectionObserver(entradas => {
      entradas.forEach(e => { if (e.isIntersecting) activar(e.target.dataset.seccion === 'cuenta' ? 'portada' : e.target.dataset.seccion); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secciones.forEach(s => io.observe(s));
    _observadores.push(io);
    activar('portada');

    // Nav: aparece tras la portada
    const portadaEl = raiz.querySelector('.inv-portada');
    const nav = raiz.querySelector('.inv-nav');
    if (portadaEl && nav) {
      const ioNav = new IntersectionObserver(([e]) => nav.classList.toggle('visible', !e.isIntersecting), { threshold: 0.15 });
      ioNav.observe(portadaEl);
      _observadores.push(ioNav);
    }
  }

  function iniciarGaleria(raiz) {
    const box = raiz.querySelector('.inv-lightbox');
    const items = Array.from(raiz.querySelectorAll('.inv-galeria__item img'));
    if (!box || !items.length) return;
    const img = box.querySelector('img');
    let i = 0;
    const ver = n => { i = (n + items.length) % items.length; img.src = items[i].src; };
    const cerrar = () => { box.hidden = true; document.body.classList.remove('inv-bloqueo'); };
    raiz.querySelectorAll('.inv-galeria__item').forEach(b => b.addEventListener('click', () => {
      ver(parseInt(b.dataset.i)); box.hidden = false; document.body.classList.add('inv-bloqueo');
    }));
    box.querySelector('.inv-lightbox__cerrar').addEventListener('click', cerrar);
    box.querySelector('.inv-lightbox__prev').addEventListener('click', () => ver(i - 1));
    box.querySelector('.inv-lightbox__next').addEventListener('click', () => ver(i + 1));
    box.addEventListener('click', e => { if (e.target === box) cerrar(); });
    _teclas = e => {
      if (box.hidden) return;
      if (e.key === 'Escape') cerrar();
      if (e.key === 'ArrowLeft') ver(i - 1);
      if (e.key === 'ArrowRight') ver(i + 1);
    };
    document.addEventListener('keydown', _teclas);
  }

  function gracias(form, texto) {
    const caja = form.parentNode.querySelector('.inv-gracias');
    form.hidden = true;
    if (caja) {
      if (texto) caja.querySelector('p').textContent = texto;
      caja.hidden = false;
    }
  }

  function error(form, txt) {
    const e = form.querySelector('.inv-form__error');
    if (!e) return;
    e.textContent = txt;
    e.hidden = !txt;
  }

  function iniciarFormularios(raiz, boda, opciones) {
    const p = boda.pareja || {};
    const fRsvp = raiz.querySelector('#rsvp-form');
    if (fRsvp) fRsvp.addEventListener('submit', async e => {
      e.preventDefault();
      const nombre = fRsvp.nombre.value.trim();
      const asistencia = (fRsvp.querySelector('input[name="asistencia"]:checked') || {}).value;
      if (!nombre) return error(fRsvp, 'Escribe tu nombre.');
      if (!asistencia) return error(fRsvp, 'Indica si podrás asistir.');
      error(fRsvp, '');
      const btn = fRsvp.querySelector('button[type="submit"]');
      const txt = btn.textContent;
      btn.disabled = true; btn.textContent = 'Enviando…';
      try {
        if (opciones.onRsvp) await opciones.onRsvp({ nombre, asistencia, mensaje: fRsvp.mensaje.value.trim() });
        gracias(fRsvp, asistencia === 'si'
          ? '¡Gracias, ' + nombre.split(' ')[0] + '! ' + (p.novio || '') + ' y ' + (p.novia || '') + ' te esperan.'
          : 'Gracias por avisar, ' + nombre.split(' ')[0] + '. Te echaremos de menos.');
      } catch (err) {
        console.error(err);
        error(fRsvp, 'No se pudo enviar. Inténtalo de nuevo.');
        btn.disabled = false; btn.textContent = txt;
      }
    });

    const fForm = raiz.querySelector('#formulario-custom');
    if (fForm) fForm.addEventListener('submit', async e => {
      e.preventDefault();
      const respuestas = {};
      let falta = '';
      (boda.formulario.preguntas || []).forEach(q => {
        const sel = '[name="preg_' + CSS.escape(String(q.id)) + '"]';
        let v = '';
        if (q.tipo === 'opcion_multiple') v = Array.from(fForm.querySelectorAll(sel + ':checked')).map(c => c.value).join(', ');
        else if (q.tipo === 'opcion_unica') v = (fForm.querySelector(sel + ':checked') || {}).value || '';
        else v = ((fForm.querySelector(sel) || {}).value || '').trim();
        if (q.obligatoria && !v && !falta) falta = q.texto;
        respuestas[q.texto] = v;
      });
      if (falta) return error(fForm, 'Falta responder: ' + falta);
      error(fForm, '');
      const btn = fForm.querySelector('button[type="submit"]');
      const txt = btn.textContent;
      btn.disabled = true; btn.textContent = 'Enviando…';
      try {
        if (opciones.onFormulario) await opciones.onFormulario(respuestas);
        gracias(fForm);
      } catch (err) {
        console.error(err);
        error(fForm, 'No se pudo enviar. Inténtalo de nuevo.');
        btn.disabled = false; btn.textContent = txt;
      }
    });
  }

  // ── API ──

  // opciones: { preview, onRsvp(datos), onFormulario(respuestas) }
  function render(boda, raiz, opciones) {
    opciones = opciones || {};
    limpiar();
    _encuadres = (boda.encuadres && typeof boda.encuadres === 'object') ? boda.encuadres : {};
    const plantilla = PLANTILLAS.indexOf(boda.plantilla) !== -1 ? boda.plantilla : 'clasica';
    raiz.classList.add('inv');
    raiz.setAttribute('data-plantilla', plantilla);
    aplicarTema(boda.estilos, plantilla, raiz);
    cargarFuentes(boda.estilos, plantilla);

    const ids = orden(boda);
    raiz.innerHTML = construir(boda, ids, opciones.preview);

    iniciarCuenta(raiz, boda.fecha);
    iniciarScroll(raiz);
    iniciarGaleria(raiz);
    iniciarFormularios(raiz, boda, opciones);
    iniciarMusica(boda.musica);
    if (!opciones.preview) iniciarBienvenida(boda);
  }

  return { render, orden, PLANTILLAS };
})();
