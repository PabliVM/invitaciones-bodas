// landing.js — Interacción de la web pública: cabecera, probador de estilos, ejemplos, formulario.

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
  const ajustar = el => el.style.setProperty('--k', (el.clientWidth / (+el.dataset.base || ANCHO_MOVIL)).toFixed(4));
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

  // ── Probador del hero ──
  const frame = document.getElementById('probador-frame');
  escalar(frame.closest('.l-movil__pantalla'));
  document.querySelectorAll('#chips .l-chip').forEach(chip => chip.addEventListener('click', () => {
    document.querySelectorAll('#chips .l-chip').forEach(c => c.classList.toggle('activo', c === chip));
    frame.src = 'invitation.html?demo=' + chip.dataset.demo;
  }));

  // ── Ejemplos ──
  const lista = document.getElementById('lista-ejemplos');
  lista.innerHTML = EJEMPLOS.map((e, i) =>
    '<a class="l-ejemplo l-revelar" style="--d:' + (i % 2) * 0.08 + 's" href="/ejemplos/' + e.id + '" target="_blank" rel="noopener">' +
      '<div class="l-navegador"><div class="l-movil__pantalla" data-base="1280"><iframe src="invitation.html?demo=' + e.id + '" title="Ejemplo ' + e.nombre + '" loading="lazy" tabindex="-1"></iframe></div></div>' +
      '<h3 class="l-ejemplo__nombre">' + e.nombre + '<span>Ver ejemplo ↗</span></h3>' +
      '<p class="l-ejemplo__desc">' + e.desc + '</p>' +
    '</a>').join('');
  lista.querySelectorAll('.l-movil__pantalla').forEach(escalar);

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
