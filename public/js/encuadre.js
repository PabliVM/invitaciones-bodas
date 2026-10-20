// encuadre.js — Encuadrar fotos: el usuario marca el punto importante (caras)
// y la invitación recorta cada foto alrededor de ese punto en móvil y ordenador.
// Se guarda en boda.encuadres = { '<url>': 'X% Y%' }.

const ENCUADRE = (() => {

  const POR_DEFECTO = '50% 30%';
  let _modal = null, _url = '', _x = 50, _y = 30;

  const valido = v => /^\d{1,3}% \d{1,3}%$/.test(v || '');

  function de(url) {
    const enc = (STATE.get().encuadres || {})[String(url || '').trim()];
    return valido(enc) ? enc : '';
  }

  function _crear() {
    _modal = document.createElement('div');
    _modal.className = 'encuadre';
    _modal.hidden = true;
    _modal.setAttribute('role', 'dialog');
    _modal.setAttribute('aria-modal', 'true');
    _modal.setAttribute('aria-label', 'Encuadrar foto');
    _modal.innerHTML =
      '<div class="encuadre__caja">' +
        '<div class="encuadre__cab"><strong>Encuadrar foto</strong><button type="button" class="encuadre__cerrar" aria-label="Cerrar">✕</button></div>' +
        '<p class="encuadre__ayuda">Toca o arrastra sobre la foto el punto que nunca debe cortarse (normalmente las caras). Con teclado: flechas.</p>' +
        '<div class="encuadre__cuerpo">' +
          '<div class="encuadre__foto" tabindex="0" aria-label="Punto importante de la foto">' +
            '<img alt="" draggable="false" />' +
            '<span class="encuadre__punto" aria-hidden="true"></span>' +
          '</div>' +
          '<div class="encuadre__vistas">' +
            '<figure><div class="encuadre__vista encuadre__vista--portada"><img alt="" /></div><figcaption>Móvil · portada</figcaption></figure>' +
            '<figure><div class="encuadre__vista encuadre__vista--pantalla"><img alt="" /></div><figcaption>Móvil · bienvenida</figcaption></figure>' +
            '<figure><div class="encuadre__vista encuadre__vista--lateral"><img alt="" /></div><figcaption>Ordenador · lateral</figcaption></figure>' +
            '<figure><div class="encuadre__vista encuadre__vista--galeria"><img alt="" /></div><figcaption>Galería</figcaption></figure>' +
          '</div>' +
        '</div>' +
        '<div class="encuadre__pie">' +
          '<button type="button" class="btn btn--ghost encuadre__centrar">Restablecer</button>' +
          '<span></span>' +
          '<button type="button" class="btn btn--secundario encuadre__cancelar">Cancelar</button>' +
          '<button type="button" class="btn btn--primario encuadre__guardar">Guardar encuadre</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(_modal);

    const zona = _modal.querySelector('.encuadre__foto');
    const img = zona.querySelector('img');
    const marcar = e => {
      const r = img.getBoundingClientRect();
      if (!r.width || !r.height) return;
      _x = Math.round(Math.min(100, Math.max(0, (e.clientX - r.left) / r.width * 100)));
      _y = Math.round(Math.min(100, Math.max(0, (e.clientY - r.top) / r.height * 100)));
      _pintar();
    };
    zona.addEventListener('pointerdown', e => {
      e.preventDefault();
      try { zona.setPointerCapture(e.pointerId); } catch (_) { /* puntero sintético */ }
      marcar(e);
      const mover = ev => marcar(ev);
      const soltar = () => { zona.removeEventListener('pointermove', mover); zona.removeEventListener('pointerup', soltar); zona.removeEventListener('pointercancel', soltar); };
      zona.addEventListener('pointermove', mover);
      zona.addEventListener('pointerup', soltar);
      zona.addEventListener('pointercancel', soltar);
    });
    zona.addEventListener('keydown', e => {
      const d = { ArrowLeft: [-2, 0], ArrowRight: [2, 0], ArrowUp: [0, -2], ArrowDown: [0, 2] }[e.key];
      if (!d) return;
      e.preventDefault();
      _x = Math.min(100, Math.max(0, _x + d[0]));
      _y = Math.min(100, Math.max(0, _y + d[1]));
      _pintar();
    });
    // Ajusta el punto al tamaño real de la foto cuando carga
    img.addEventListener('load', _pintar);

    _modal.querySelector('.encuadre__cerrar').addEventListener('click', cerrar);
    _modal.querySelector('.encuadre__cancelar').addEventListener('click', cerrar);
    _modal.querySelector('.encuadre__centrar').addEventListener('click', () => { [_x, _y] = POR_DEFECTO.split(' ').map(parseFloat); _pintar(); });
    _modal.querySelector('.encuadre__guardar').addEventListener('click', _guardar);
    _modal.addEventListener('click', e => { if (e.target === _modal) cerrar(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && _modal && !_modal.hidden) cerrar(); });
  }

  function _pintar() {
    const valor = _x + '% ' + _y + '%';
    const img = _modal.querySelector('.encuadre__foto img');
    const punto = _modal.querySelector('.encuadre__punto');
    // El punto se coloca sobre la foto (que puede no ocupar toda la zona)
    punto.style.left = (img.offsetLeft + img.offsetWidth * _x / 100) + 'px';
    punto.style.top = (img.offsetTop + img.offsetHeight * _y / 100) + 'px';
    _modal.querySelectorAll('.encuadre__vista img').forEach(v => { v.style.objectPosition = valor; });
  }

  function abrir(url) {
    url = String(url || '').trim();
    if (!url) return;
    if (!_modal) _crear();
    _url = url;
    [_x, _y] = (de(url) || POR_DEFECTO).split(' ').map(parseFloat);
    _modal.querySelectorAll('img').forEach(i => { i.src = url; });
    _modal.hidden = false;
    document.body.classList.add('encuadre-abierto');
    _pintar();
    _modal.querySelector('.encuadre__foto').focus({ preventScroll: true });
  }

  function cerrar() {
    if (!_modal) return;
    _modal.hidden = true;
    document.body.classList.remove('encuadre-abierto');
  }

  function _guardar() {
    const valor = _x + '% ' + _y + '%';
    const url = _url;
    STATE.actualizar(b => {
      if (!b.encuadres || typeof b.encuadres !== 'object') b.encuadres = {};
      if (valor === POR_DEFECTO) delete b.encuadres[url];
      else b.encuadres[url] = valor;
    }, 'encuadre');
    cerrar();
  }

  // ── Botones en el editor ──

  // Miniatura + botón "Encuadrar" bajo un campo de una foto
  function _campo(input) {
    const caja = document.createElement('div');
    caja.className = 'encuadre-campo';
    caja.innerHTML = '<img class="encuadre-campo__mini" alt="" /><button type="button" class="btn btn--ghost encuadre-campo__btn">⌖ Encuadrar</button><span class="encuadre-campo__estado"></span>';
    const mini = caja.querySelector('img');
    const estado = caja.querySelector('.encuadre-campo__estado');
    caja.querySelector('button').addEventListener('click', () => abrir(input.value));
    const ver = () => {
      const u = input.value.trim();
      caja.hidden = !u;
      if (!u) return;
      if (mini.getAttribute('src') !== u) mini.src = u;
      const v = de(u);
      mini.style.objectPosition = v || POR_DEFECTO;
      estado.textContent = v ? 'Encuadre personalizado' : '';
    };
    input.addEventListener('input', ver);
    STATE.suscribir(() => setTimeout(ver));
    ver();
    return caja;
  }

  // Miniaturas de la galería: tocar una para encuadrarla
  function _galeria(textarea) {
    const caja = document.createElement('div');
    caja.className = 'encuadre-galeria';
    const ver = () => {
      const fotos = (STATE.get().galeria.fotos || []).filter(Boolean);
      const firma = JSON.stringify([fotos, STATE.get().encuadres]);
      if (caja.dataset.firma === firma) return;
      caja.dataset.firma = firma;
      caja.hidden = !fotos.length;
      caja.innerHTML = fotos.length ? '<p class="campo__ayuda">Toca una foto para encuadrarla:</p><div class="encuadre-galeria__lista"></div>' : '';
      const lista = caja.querySelector('.encuadre-galeria__lista');
      fotos.forEach((u, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'encuadre-galeria__item' + (de(u) ? ' encuadre-galeria__item--hecho' : '');
        b.title = 'Encuadrar foto ' + (i + 1);
        b.setAttribute('aria-label', b.title);
        const im = document.createElement('img');
        im.alt = '';
        im.loading = 'lazy';
        im.src = u;
        im.style.objectPosition = de(u) || POR_DEFECTO;
        b.appendChild(im);
        b.addEventListener('click', () => abrir(u));
        lista.appendChild(b);
      });
    };
    STATE.suscribir(() => setTimeout(ver));
    ver();
    return caja;
  }

  function init() {
    document.querySelectorAll('input[id^="inp-foto-"]').forEach(input => {
      const ancla = input.closest('.subir-fila') || input;
      ancla.parentNode.insertBefore(_campo(input), ancla.nextSibling);
    });
    const galeria = document.getElementById('inp-galeria');
    if (galeria) galeria.parentNode.appendChild(_galeria(galeria));
  }

  return { init, abrir, cerrar, de };
})();
