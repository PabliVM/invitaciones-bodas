// landing.js — Interacción de la web pública: cabecera, ejemplos (móvil/ordenador), visor, formulario.

(function() {
  const EJEMPLOS = [
    { id: 'clasica',      nombre: 'Clásica',      desc: 'Simetría, marco con esquinas y detalles dorados. Atemporal.' },
    { id: 'floral',       nombre: 'Floral',       desc: 'Caligrafía, ramas y flores. Romántica y delicada.' },
    { id: 'moderna',      nombre: 'Moderna',      desc: 'Tipografía grande y líneas limpias. Sin adornos.' },
    { id: 'mediterranea', nombre: 'Mediterránea', desc: 'Azulejo, sol y luz de costa. Para bodas de verano.' },
    { id: 'deco',         nombre: 'Art Déco',     desc: 'Geometría, abanicos y marcos dobles. Glamour años 20.' },
    { id: 'acuarela',     nombre: 'Acuarela',     desc: 'Manchas de color suaves y trazos de pincel.' },
    { id: 'revista',      nombre: 'Revista',      desc: 'Estilo editorial con secciones numeradas.' },
    { id: 'boho',         nombre: 'Boho',         desc: 'Arcos, sol naciente y tonos tierra. Cálida y natural.' }
  ];
  const ANCHO_MOVIL = 390;

  // Escala los iframes (ancho real: 390px móvil, 1280px ordenador) al tamaño de su marco
  const ajustar = el => {
    const k = el.clientWidth / (+el.dataset.base || ANCHO_MOVIL);
    el.style.setProperty('--k', k.toFixed(4));
    // Alto real del iframe = alto visible / escala → la invitación llena la pantalla del marco
    const f = el.querySelector('iframe');
    if (f && k && el.clientHeight) f.style.height = Math.ceil(el.clientHeight / k) + 'px';
  };
  const ro = new ResizeObserver(entradas => entradas.forEach(e => ajustar(e.target)));
  const escalar = el => ro.observe(el);

  // ── Cabecera ──
  const cab = document.getElementById('cabecera');
  const menuBtn = document.getElementById('menu-btn');
  const actualizarCab = () => cab.classList.toggle('solido', window.scrollY > 20 || cab.classList.contains('abierto'));
  window.addEventListener('scroll', actualizarCab, { passive: true });
  actualizarCab();
  menuBtn.addEventListener('click', () => {
    const abierto = cab.classList.toggle('abierto');
    menuBtn.setAttribute('aria-expanded', abierto);
    menuBtn.textContent = abierto ? '✕' : '☰';
    actualizarCab();
  });
  document.querySelectorAll('#nav a').forEach(a => a.addEventListener('click', () => {
    cab.classList.remove('abierto');
    menuBtn.textContent = '☰';
    menuBtn.setAttribute('aria-expanded', false);
    actualizarCab();
  }));

  // ── Ejemplos ──
  const lista = document.getElementById('lista-ejemplos');
  let modoEjemplos = 'movil';
  lista.innerHTML = EJEMPLOS.map((e, i) =>
    '<a class="l-ejemplo l-revelar" style="--d:' + (i % 4) * 0.06 + 's" href="/ejemplos/' + e.id + '" data-ver="' + i + '">' +
      '<div class="l-movil"><div class="l-movil__pantalla" data-base="390"><iframe src="invitation.html?demo=' + e.id + '" title="Ejemplo ' + e.nombre + '" loading="lazy" tabindex="-1"></iframe></div></div>' +
      '<h3 class="l-ejemplo__nombre">' + e.nombre + '<span>Ver a fondo →</span></h3>' +
      '<p class="l-ejemplo__desc">' + e.desc + '</p>' +
    '</a>').join('');
  lista.querySelectorAll('.l-movil__pantalla').forEach(escalar);

  // Cambia todas las tarjetas entre marco de móvil (390px) y de ordenador (1280px) sin recargar
  function verEjemplosEn(modo) {
    modoEjemplos = modo;
    const pc = modo === 'ordenador';
    lista.classList.toggle('l-ejemplos--ordenador', pc);
    lista.querySelectorAll('.l-ejemplo > div').forEach(d => { d.className = pc ? 'l-navegador' : 'l-movil'; });
    lista.querySelectorAll('.l-movil__pantalla').forEach(p => { p.dataset.base = pc ? 1280 : ANCHO_MOVIL; ajustar(p); });
    document.querySelectorAll('#vista-ejemplos .l-vista__btn').forEach(b => b.classList.toggle('activo', b.dataset.modo === modo));
  }
  document.querySelectorAll('#vista-ejemplos .l-vista__btn').forEach(b => b.addEventListener('click', () => verEjemplosEn(b.dataset.modo)));

  // ── Visor de ejemplos (misma página, Móvil / Ordenador) ──
  const visor = document.getElementById('visor');
  const vDisp = document.getElementById('visor-disp');
  const vPant = document.getElementById('visor-pantalla');
  const vFrame = document.getElementById('visor-frame');
  let vIndice = 0;
  let vModo = 'ordenador';
  escalar(vPant);

  function visorModo(modo) {
    vModo = modo;
    const pc = modo === 'ordenador';
    vDisp.className = pc ? 'l-navegador' : 'l-movil';
    vPant.dataset.base = pc ? 1280 : ANCHO_MOVIL;
    visor.querySelectorAll('.l-visor__modo').forEach(b => b.classList.toggle('activo', b.dataset.modo === modo));
    requestAnimationFrame(() => ajustar(vPant));
  }

  function visorVer(i) {
    vIndice = (i + EJEMPLOS.length) % EJEMPLOS.length;
    const e = EJEMPLOS[vIndice];
    document.getElementById('visor-nombre').textContent = e.nombre;
    vFrame.src = 'invitation.html?demo=' + e.id;
  }

  function visorAbrir(i) {
    visorModo(modoEjemplos);
    visorVer(i);
    visor.hidden = false;
    document.body.style.overflow = 'hidden';
    document.getElementById('visor-cerrar').focus();
  }

  function visorCerrar() {
    visor.hidden = true;
    document.body.style.overflow = '';
    vFrame.src = 'about:blank';
  }

  lista.querySelectorAll('[data-ver]').forEach(a => a.addEventListener('click', ev => {
    ev.preventDefault();
    visorAbrir(+a.dataset.ver);
  }));
  visor.querySelectorAll('.l-visor__modo').forEach(b => b.addEventListener('click', () => visorModo(b.dataset.modo)));
  document.getElementById('visor-cerrar').addEventListener('click', visorCerrar);
  document.getElementById('visor-prev').addEventListener('click', () => visorVer(vIndice - 1));
  document.getElementById('visor-next').addEventListener('click', () => visorVer(vIndice + 1));
  visor.addEventListener('click', ev => { if (ev.target === visor || ev.target.classList.contains('l-visor__escena')) visorCerrar(); });
  document.addEventListener('keydown', ev => {
    if (visor.hidden) return;
    if (ev.key === 'Escape') visorCerrar();
    if (ev.key === 'ArrowLeft') visorVer(vIndice - 1);
    if (ev.key === 'ArrowRight') visorVer(vIndice + 1);
  });

  // ── Diseñad la vuestra: estilo + colores + letra con vista en vivo ──
  const cfg = { estilo: 'floral', paleta: '', fuente: '', modo: 'movil' };
  // Selección corta y muy distinta entre sí (el editor tiene todas)
  const PALETAS_WEB = ['clasica', 'moderna', 'romantica', 'mediterranea', 'oliva', 'terracota', 'lavanda', 'esmeralda'];
  const FUENTES_WEB = ['Cormorant Garamond', 'Playfair Display', 'EB Garamond', 'Lora', 'Great Vibes', 'Dancing Script', 'Parisienne', 'Josefin Sans', 'Montserrat', 'Raleway', 'Libre Baskerville'];
  const PALETAS = typeof PRESETS !== 'undefined' ? PALETAS_WEB.map(id => PRESETS.find(p => p.id === id)).filter(Boolean) : [];
  const FUENTES = typeof DEMOS !== 'undefined' ? FUENTES_WEB.filter(f => DEMOS.FUENTES.includes(f)) : [];
  const cDisp = document.getElementById('config-disp');
  const cPant = document.getElementById('config-pantalla');
  const cFrame = document.getElementById('config-frame');
  const escHtml = t => String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const opcion = (grupo, valor, contenido, titulo) =>
    '<button type="button" class="l-opcion" data-grupo="' + grupo + '" data-valor="' + escHtml(valor) + '" title="' + escHtml(titulo) + '">' + contenido + '</button>';
  const muestra = cols => '<span class="l-opcion__muestra">' + cols.map(c => '<i style="background:' + c + '"></i>').join('') + '</span>';

  document.getElementById('config-estilos').innerHTML = EJEMPLOS.map(e => opcion('estilo', e.id, escHtml(e.nombre), e.desc)).join('');
  document.getElementById('config-colores').innerHTML = opcion('paleta', '', muestra([]) + '<span>Original</span>', 'Colores originales del estilo') +
    PALETAS.map(p => opcion('paleta', p.id, muestra([p.estilos.colorSecundario, p.estilos.colorPrimario, p.estilos.colorAccent]) + '<span>' + escHtml(p.nombre) + '</span>', p.descripcion || p.nombre)).join('') +
    opcion('paleta', 'libre', '<span class="l-opcion__muestra l-opcion__muestra--libre"></span><span>A medida</span>', 'Probad cualquier color');
  const libre = k => document.getElementById('config-' + k).value.slice(1).toLowerCase();
  document.getElementById('config-fuentes').innerHTML = opcion('fuente', '', '<span class="l-opcion__aa">Aa</span><span>Original</span>', 'Tipografía original del estilo') +
    FUENTES.map(f => opcion('fuente', f, '<span class="l-opcion__aa" style="font-family:\'' + f + '\', serif">Aa</span><span>' + escHtml(f) + '</span>', f)).join('');

  // Carga las tipografías solo cuando se acerca la sección (y solo las letras necesarias)
  let fuentesCargadas = false;
  function cargarFuentesConfig() {
    if (fuentesCargadas || !FUENTES.length) return;
    fuentesCargadas = true;
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?' + FUENTES.map(f => 'family=' + f.replace(/ /g, '+')).join('&') + '&display=swap&text=Aa';
    document.head.appendChild(l);
  }

  const nombreDe = {
    estilo: v => (EJEMPLOS.find(e => e.id === v) || {}).nombre,
    paleta: v => v === 'libre' ? 'a medida (fondo #' + libre('fondo') + ', principal #' + libre('principal') + ', detalles #' + libre('detalle') + ')' : v ? (PALETAS.find(p => p.id === v) || {}).nombre : 'los del estilo',
    fuente: v => v || 'la del estilo'
  };
  const paramsConfig = () => {
    const q = new URLSearchParams();
    if (cfg.paleta === 'libre') ['fondo', 'principal', 'detalle'].forEach(k => q.set(k, libre(k)));
    else if (cfg.paleta) q.set('paleta', cfg.paleta);
    if (cfg.fuente) q.set('fuente', cfg.fuente);
    return q;
  };
  const enlaceConfig = () => {
    const q = paramsConfig();
    return location.origin + '/ejemplos/' + cfg.estilo + (q.toString() ? '?' + q : '');
  };
  const textoConfig = () => 'Estilo ' + nombreDe.estilo(cfg.estilo) + ' · colores ' + nombreDe.paleta(cfg.paleta) + ' · letra ' + nombreDe.fuente(cfg.fuente);

  let cTimer = null;
  function configPintar() {
    document.querySelectorAll('.l-opcion').forEach(b => b.classList.toggle('activo', cfg[b.dataset.grupo] === b.dataset.valor));
    document.getElementById('config-resumen').textContent = textoConfig();
    clearTimeout(cTimer);
    cTimer = setTimeout(() => {
      const q = paramsConfig();
      q.set('demo', cfg.estilo);
      cFrame.src = 'invitation.html?' + q;
    }, 250);
    document.getElementById('config-libres').hidden = cfg.paleta !== 'libre';
  }
  function configModo(modo) {
    cfg.modo = modo;
    const pc = modo === 'ordenador';
    cDisp.className = pc ? 'l-navegador' : 'l-movil';
    cPant.dataset.base = pc ? 1280 : ANCHO_MOVIL;
    document.querySelectorAll('#vista-config .l-vista__btn').forEach(b => b.classList.toggle('activo', b.dataset.modo === modo));
    requestAnimationFrame(() => ajustar(cPant));
  }
  escalar(cPant);
  document.querySelectorAll('.l-opcion').forEach(b => b.addEventListener('click', () => { cfg[b.dataset.grupo] = b.dataset.valor; configPintar(); }));
  document.querySelectorAll('#vista-config .l-vista__btn').forEach(b => b.addEventListener('click', () => configModo(b.dataset.modo)));
  ['fondo', 'principal', 'detalle'].forEach(k => document.getElementById('config-' + k).addEventListener('input', configPintar));

  // La vista se carga al acercarse a la sección
  const ioCfg = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    cargarFuentesConfig();
    if (!cFrame.getAttribute('src')) configPintar();
    ioCfg.disconnect();
  }, { rootMargin: '400px 0px' });
  ioCfg.observe(document.getElementById('disena'));
  configPintar();

  document.getElementById('config-copiar').addEventListener('click', async ev => {
    const b = ev.currentTarget;
    try { await navigator.clipboard.writeText(enlaceConfig()); b.textContent = '✓ Enlace copiado'; }
    catch (_) { window.prompt('Copia este enlace:', enlaceConfig()); }
    setTimeout(() => { b.textContent = 'Copiar enlace'; }, 2200);
  });
  document.getElementById('config-pedir').addEventListener('click', () => {
    const msg = document.getElementById('c-mensaje');
    const texto = 'Nos gusta: ' + textoConfig() + '.';
    if (msg.value.indexOf(texto) === -1) msg.value = (msg.value.trim() ? msg.value.trim() + '\n' : '') + texto;
    document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => document.getElementById('c-nombre').focus({ preventScroll: true }), 600);
  });

  // Desde el visor: personalizar el estilo que se está viendo
  document.getElementById('visor-personalizar').addEventListener('click', () => {
    cfg.estilo = EJEMPLOS[vIndice].id;
    configModo(vModo);
    visorCerrar();
    cargarFuentesConfig();
    configPintar();
    document.getElementById('disena').scrollIntoView({ behavior: 'smooth' });
  });

  // ── Revelado al hacer scroll ──
  const io = new IntersectionObserver(entradas => entradas.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.l-revelar').forEach(el => io.observe(el));

  // ── Planes → formulario ──
  document.querySelectorAll('[data-plan]').forEach(b => b.addEventListener('click', () => {
    document.getElementById('c-plan').value = b.dataset.plan;
    document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => document.getElementById('c-nombre').focus({ preventScroll: true }), 600);
  }));

  // ── Formulario de contacto ──
  const form = document.getElementById('form-contacto');
  const abierto = Date.now();
  const error = txt => {
    const e = document.getElementById('c-error');
    e.textContent = txt || '';
    e.hidden = !txt;
  };

  form.addEventListener('submit', async ev => {
    ev.preventDefault();
    const v = id => document.getElementById(id).value.trim();
    // Antispam: campo trampa relleno o envío en menos de 3 s → se ignora en silencio
    const bot = v('c-web') || Date.now() - abierto < 3000;
    const nombre = v('c-nombre'), email = v('c-email').toLowerCase();
    if (nombre.length < 2) return error('Escribid vuestro nombre.');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return error('Revisad el email.');
    if (!document.getElementById('c-privacidad').checked) return error('Necesitamos que aceptéis la política de privacidad.');
    error('');
    const btn = document.getElementById('c-enviar');
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    try {
      if (!bot) {
        DB.init();
        await DB.enviarSolicitud({
          nombre,
          email,
          telefono: v('c-telefono') || null,
          fecha_boda: v('c-fecha') || null,
          plan: v('c-plan') || null,
          mensaje: v('c-mensaje') || null,
          acepta_privacidad: true
        });
      }
      form.innerHTML = '<div class="l-form__ok"><b>¡Gracias, ' + nombre.split(' ')[0].replace(/[<>&"]/g, '') + '!</b>' +
        '<p>Hemos recibido vuestra solicitud. Os escribiremos muy pronto a <strong>' + email.replace(/[<>&"]/g, '') + '</strong>.</p></div>';
    } catch (err) {
      console.error(err);
      error(/Demasiadas/.test(err.message || '') ? 'Ya hemos recibido vuestra solicitud. Os escribiremos pronto.' : 'No se pudo enviar. Inténtalo de nuevo en unos minutos.');
      btn.disabled = false;
      btn.textContent = 'Enviar solicitud';
    }
  });

  document.getElementById('anio').textContent = new Date().getFullYear();
})();
