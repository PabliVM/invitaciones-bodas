// orden.js — Orden de las secciones de la invitación.
// - Lista "Orden de la invitación" que se reordena arrastrando (ratón y dedo) o con el teclado.
// - El panel del editor se reordena igual que la invitación.
// - moverSeccion() sigue sirviendo para los botones ↑ ↓ de cada sección.

const ORDEN = (() => {

  const ETIQUETAS = {
    historia: 'Historia', galeria: 'Galería', evento: 'El evento', dresscode: 'Dress code',
    alojamiento: 'Alojamiento', transporte: 'Transporte', rsvp: 'Confirmar asistencia',
    mensaje: 'Mensaje final', formulario: 'Cuestionario'
  };
  const ICONOS = {
    historia: '📖', galeria: '📷', evento: '📍', dresscode: '👔', alojamiento: '🏨',
    transporte: '🚌', rsvp: '✉️', mensaje: '💌', formulario: '📋'
  };

  let _timer = null;
  let _arrastrando = false;

  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // Orden completo y válido (predefinidas + 'extra_<uid>'), calculado por STATE.normalizar
  function _ordenCompleto(boda) {
    return STATE.normalizar(boda).orden_secciones;
  }

  function _info(boda, id) {
    if (id.indexOf('extra_') === 0) {
      const sec = (boda.secciones_extra || []).find(x => 'extra_' + x.uid === id) || {};
      return { etiqueta: sec.titulo || 'Sección personalizada', icono: '✦', activa: true, extra: true };
    }
    if (id === 'formulario') {
      return { etiqueta: (boda.formulario && boda.formulario.titulo) || ETIQUETAS.formulario, icono: ICONOS.formulario, activa: !!(boda.formulario && boda.formulario.activo) };
    }
    const sec = boda[id] || {};
    return { etiqueta: sec.titulo || ETIQUETAS[id] || id, icono: ICONOS[id] || '', activa: sec.activo !== false && sec.activa !== false };
  }

  // ── Lista arrastrable ──
  function _renderPanel() {
    const lista = document.getElementById('orden-panel');
    if (!lista || _arrastrando) return;
    const boda = STATE.get();
    const act = document.activeElement;
    const conFoco = act && lista.contains(act) ? act.dataset.id : null;
    lista.innerHTML = _ordenCompleto(boda).map(id => {
      const i = _info(boda, id);
      return '<li class="orden-item' + (i.activa ? '' : ' orden-item--oculta') + (i.extra ? ' orden-item--extra' : '') + '" data-id="' + esc(id) + '" tabindex="0" aria-label="' + esc(i.etiqueta) + '. Alt + flechas para mover">' +
        '<span class="orden-item__asa" aria-hidden="true">⠿</span>' +
        '<span class="orden-item__icono" aria-hidden="true">' + i.icono + '</span>' +
        '<span class="orden-item__texto">' + esc(i.etiqueta) + '</span>' +
        (i.activa ? '' : '<span class="orden-item__estado">oculta</span>') +
      '</li>';
    }).join('');
    if (conFoco) { const el = lista.querySelector('[data-id="' + CSS.escape(conFoco) + '"]'); if (el) el.focus({ preventScroll: true }); }
  }

  // Coloca los subapartados del panel en el mismo orden que la invitación
  function _ordenarPanel() {
    const ref = document.getElementById('chk-historia');
    const sub = ref && ref.closest('.eb-sub');
    const cont = sub && sub.parentElement;
    if (!cont) return;
    const subDe = id => { const chk = document.getElementById('chk-' + id); return chk && chk.closest('.eb-sub'); };
    _ordenCompleto(STATE.get()).forEach(id => { const el = subDe(id); if (el && el.parentElement === cont) cont.appendChild(el); });
  }

  function _aplicar(orden, idMovido) {
    STATE.set('orden_secciones', orden);
    if (idMovido && typeof FOCO !== 'undefined') FOCO.ir(idMovido, true);
  }

  function _ordenDeLista(lista) {
    return Array.from(lista.querySelectorAll('.orden-item')).map(li => li.dataset.id);
  }

  // Arrastre con Pointer Events (funciona con ratón y con el dedo)
  function _iniciarArrastre(lista) {
    lista.addEventListener('pointerdown', e => {
      const asa = e.target.closest('.orden-item__asa');
      const item = asa && asa.closest('.orden-item');
      if (!item) return;
      e.preventDefault();
      _arrastrando = true;
      const inicioY = e.clientY;
      let base = 0;
      item.classList.add('orden-item--arrastrando');
      try { item.setPointerCapture(e.pointerId); } catch (_) { /* puntero sintético */ }

      const mover = ev => {
        let dy = ev.clientY - inicioY - base;
        // Intercambia con el vecino al pasar su mitad
        const prev = item.previousElementSibling, next = item.nextElementSibling;
        if (dy > 0 && next && dy > next.offsetHeight / 2) {
          lista.insertBefore(next, item);
          base += next.offsetHeight + 4;
          dy = ev.clientY - inicioY - base;
        } else if (dy < 0 && prev && -dy > prev.offsetHeight / 2) {
          lista.insertBefore(item, prev);
          base -= prev.offsetHeight + 4;
          dy = ev.clientY - inicioY - base;
        }
        item.style.transform = 'translateY(' + dy + 'px)';
      };
      const soltar = () => {
        item.removeEventListener('pointermove', mover);
        item.removeEventListener('pointerup', soltar);
        item.removeEventListener('pointercancel', soltar);
        item.classList.remove('orden-item--arrastrando');
        item.style.transform = '';
        _arrastrando = false;
        const nuevo = _ordenDeLista(lista);
        if (JSON.stringify(nuevo) !== JSON.stringify(STATE.get().orden_secciones)) _aplicar(nuevo, item.dataset.id);
      };
      item.addEventListener('pointermove', mover);
      item.addEventListener('pointerup', soltar);
      item.addEventListener('pointercancel', soltar);
    });

    // Teclado: Alt + ↑/↓ mueve el elemento con foco
    lista.addEventListener('keydown', e => {
      const item = e.target.closest('.orden-item');
      if (!item || !e.altKey || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return;
      e.preventDefault();
      const id = item.dataset.id;
      moverSeccion(id, e.key === 'ArrowUp' ? -1 : 1);
      _renderPanel();
      const nuevo = lista.querySelector('[data-id="' + CSS.escape(id) + '"]');
      if (nuevo) nuevo.focus();
    });
  }

  function init() {
    const lista = document.getElementById('orden-panel');
    _renderPanel();
    _ordenarPanel();
    if (lista) _iniciarArrastre(lista);
    STATE.suscribir(() => {
      clearTimeout(_timer);
      _timer = setTimeout(() => { _renderPanel(); _ordenarPanel(); }, 120);
    });
  }

  function mover(i, direccion) {
    const orden = _ordenCompleto(STATE.get()).slice();
    const j = i + direccion;
    if (j < 0 || j >= orden.length) return;
    [orden[i], orden[j]] = [orden[j], orden[i]];
    _aplicar(orden, orden[j]);
  }

  // Llamar cuando se añade/activa una sección
  function sincronizar() {
    STATE.set('orden_secciones', _ordenCompleto(STATE.get()));
  }

  // Botones ↑ ↓ de cada sección del panel
  function moverSeccion(id, direccion) {
    const orden = _ordenCompleto(STATE.get()).slice();
    const idx = orden.indexOf(id);
    if (idx === -1) return;
    const j = idx + direccion;
    if (j < 0 || j >= orden.length) return;
    [orden[idx], orden[j]] = [orden[j], orden[idx]];
    _aplicar(orden, id);
  }

  return { init, mover, moverSeccion, sincronizar };
})();
