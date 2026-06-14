// secciones.js — Gestor de secciones y subsecciones del editor

const SECCIONES = (() => {

  // Secciones predefinidas con su config
  const PREDEFINIDAS = [
    { id: 'historia',    label: 'Nuestra historia',   icono: '📖' },
    { id: 'galeria',     label: 'Galería',             icono: '📷' },
    { id: 'evento',      label: 'La celebración',      icono: '📍' },
    { id: 'dresscode',   label: 'Dress code',          icono: '👔' },
    { id: 'alojamiento', label: 'Alojamiento',         icono: '🏨' },
    { id: 'transporte',  label: 'Transporte',          icono: '🚌' },
    { id: 'rsvp',        label: 'Confirmar asistencia',icono: '✉️' },
    { id: 'mensaje',     label: 'Mensaje final',       icono: '💌' },
  ];

  var _renderTimer = null;

  function init() {
    _renderPanel();
    // Debounce: no re-renderizar mientras el usuario escribe
    STATE.suscribir(function() {
      clearTimeout(_renderTimer);
      _renderTimer = setTimeout(_renderPanel, 400);
    });
  }

  function _renderPanel() {
    var contenedor = document.getElementById('secciones-panel');
    if (!contenedor) return;
    var boda = STATE.get();
    var html = '';

    // Solo secciones personalizadas
    var extras = boda.secciones_extra || [];
    if (extras.length > 0) {
      html += '<div class="sec-grupo">';
      extras.forEach(function(sec, i) {
        html += _renderSeccionExtra(sec, i);
      });
      html += '</div>';
    }
    html += '<div style="padding:8px 12px">';
    html += '<button class="sec-btn-nueva" onclick="SECCIONES.añadirExtra()">+ Añadir sección personalizada</button>';
    html += '</div>';

    contenedor.innerHTML = html;
  }

  function _renderSeccion(def, activa, subsecciones, esExtra) {
    var html = '';
    html += '<div class="sec-item" id="sec-item-' + def.id + '">';
    html += '<div class="sec-item__header">';
    html += '<span class="sec-item__icono">' + def.icono + '</span>';
    html += '<span class="sec-item__label">' + def.label + '</span>';
    html += '<label class="campo__toggle" style="flex-shrink:0;margin-left:8px">';
    html += '<input type="checkbox" ' + (activa ? 'checked' : '') + ' onchange="SECCIONES.toggleSeccion(\'' + def.id + '\', this.checked)" />';
    html += '<span class="campo__toggle-slider"></span>';
    html += '</label>';
    html += '</div>';

    if (activa) {
      // Texto principal de la sección (si lo tiene)
      var camposTexto = { historia: 'historia.texto', dresscode: 'dresscode.texto', mensaje: 'mensaje.texto', alojamiento: 'alojamiento.texto', transporte: 'transporte.texto' };
      if (camposTexto[def.id]) {
        var boda2 = STATE.get();
        var textoActual = '';
        if (def.id === 'historia') textoActual = (boda2.historia && boda2.historia.texto) || '';
        if (def.id === 'dresscode') textoActual = (boda2.dresscode && boda2.dresscode.texto) || '';
        if (def.id === 'mensaje') textoActual = (boda2.mensaje && boda2.mensaje.texto) || '';
        if (def.id === 'alojamiento') textoActual = (boda2.alojamiento && boda2.alojamiento.texto) || '';
        if (def.id === 'transporte') textoActual = (boda2.transporte && boda2.transporte.texto) || '';
        html += '<div style="padding:0 10px 8px">';
        html += '<textarea class="sec-sub__texto" style="min-height:72px" placeholder="Texto principal..." oninput="SECCIONES.updateTexto('' + def.id + '',this.value)">' + textoActual + '</textarea>';
        html += '</div>';
      }
      // Subsecciones existentes
      if (subsecciones.length > 0) {
        html += '<div class="sec-subsecciones">';
        subsecciones.forEach(function(sub, i) {
          html += '<div class="sec-sub">';
          html += '<div class="sec-sub__header">';
          html += '<input type="text" class="sec-sub__titulo" value="' + (sub.titulo || '') + '" placeholder="Título" oninput="SECCIONES.updateSubTitulo(\'' + def.id + '\',' + i + ',this.value)" />';
          html += '<button class="sec-sub__eliminar" onclick="SECCIONES.eliminarSub(\'' + def.id + '\',' + i + ')">✕</button>';
          html += '</div>';
          html += '<textarea class="sec-sub__texto" placeholder="Texto..." oninput="SECCIONES.updateSubTexto(\'' + def.id + '\',' + i + ',this.value)">' + (sub.texto || '') + '</textarea>';
          html += '</div>';
        });
        html += '</div>';
      }
      html += '<button class="sec-btn-sub" onclick="SECCIONES.añadirSub(\'' + def.id + '\')">+ Añadir subsección</button>';
    }

    html += '</div>';
    return html;
  }

  function _renderSeccionExtra(sec, i) {
    var html = '';
    html += '<div class="sec-item sec-item--extra">';
    html += '<div class="sec-item__header">';
    html += '<span class="sec-item__icono">✦</span>';
    html += '<input type="text" class="sec-extra__titulo" value="' + (sec.titulo || '') + '" placeholder="Título de la sección" oninput="SECCIONES.updateExtraTitulo(' + i + ',this.value)" />';
    html += '<button class="sec-sub__eliminar" onclick="SECCIONES.eliminarExtra(' + i + ')">✕</button>';
    html += '</div>';
    html += '<textarea class="sec-sub__texto" placeholder="Texto principal..." oninput="SECCIONES.updateExtraTexto(' + i + ',this.value)">' + (sec.texto || '') + '</textarea>';

    // Subsecciones de sección extra
    var subs = sec.subsecciones || [];
    if (subs.length > 0) {
      html += '<div class="sec-subsecciones">';
      subs.forEach(function(sub, j) {
        html += '<div class="sec-sub">';
        html += '<div class="sec-sub__header">';
        html += '<input type="text" class="sec-sub__titulo" value="' + (sub.titulo || '') + '" placeholder="Título" oninput="SECCIONES.updateExtraSubTitulo(' + i + ',' + j + ',this.value)" />';
        html += '<button class="sec-sub__eliminar" onclick="SECCIONES.eliminarExtraSub(' + i + ',' + j + ')">✕</button>';
        html += '</div>';
        html += '<textarea class="sec-sub__texto" placeholder="Texto..." oninput="SECCIONES.updateExtraSubTexto(' + i + ',' + j + ',this.value)">' + (sub.texto || '') + '</textarea>';
        html += '</div>';
      });
      html += '</div>';
    }
    html += '<button class="sec-btn-sub" onclick="SECCIONES.añadirExtraSub(' + i + ')">+ Añadir subsección</button>';
    html += '</div>';
    return html;
  }

  // ── API pública ──

  function updateTexto(secId, val) {
    // Update text directly without re-rendering panel
    var boda = STATE.get();
    if (boda[secId]) {
      var campo = ('texto' in boda[secId]) ? 'texto' : null;
      if (campo) boda[secId][campo] = val;
    }
  }

  function toggleSeccion(id, activo) {
    // Las secciones usan 'activo' o 'activa' dependiendo del campo
    var boda = STATE.get();
    if (boda[id]) {
      var campo = ('activa' in boda[id]) ? id + '.activa' : id + '.activo';
      STATE.set(campo, activo);
    }
  }

  function añadirSub(secId) {
    var boda = STATE.get();
    var sec = boda[secId];
    if (!sec) return;
    var subs = (sec.subsecciones || []).slice();
    subs.push({ titulo: '', texto: '' });
    STATE.set(secId + '.subsecciones', subs);
  }

  function eliminarSub(secId, i) {
    var boda = STATE.get();
    var subs = (boda[secId].subsecciones || []).slice();
    subs.splice(i, 1);
    STATE.set(secId + '.subsecciones', subs);
  }

  function updateSubTitulo(secId, i, val) {
    var boda = STATE.get();
    var subs = (boda[secId].subsecciones || []).slice();
    subs[i] = Object.assign({}, subs[i], { titulo: val });
    // Actualizar sin notificar para no perder el foco
    var partes = (secId + '.subsecciones').split('.');
    var obj = boda;
    for (var p = 0; p < partes.length - 1; p++) obj = obj[partes[p]];
    obj[partes[partes.length-1]] = subs;
  }

  function updateSubTexto(secId, i, val) {
    var boda = STATE.get();
    var subs = (boda[secId].subsecciones || []).slice();
    subs[i] = Object.assign({}, subs[i], { texto: val });
    var partes = (secId + '.subsecciones').split('.');
    var obj = boda;
    for (var p = 0; p < partes.length - 1; p++) obj = obj[partes[p]];
    obj[partes[partes.length-1]] = subs;
  }

  // Secciones extra
  function añadirExtra() {
    var boda = STATE.get();
    var extras = (boda.secciones_extra || []).slice();
    extras.push({ titulo: '', texto: '', subsecciones: [] });
    STATE.set('secciones_extra', extras);
  }

  function eliminarExtra(i) {
    if (!confirm('¿Eliminar esta sección?')) return;
    var boda = STATE.get();
    var extras = (boda.secciones_extra || []).slice();
    extras.splice(i, 1);
    STATE.set('secciones_extra', extras);
  }

  function updateExtraTitulo(i, val) {
    var boda = STATE.get();
    var extras = (boda.secciones_extra || []).slice();
    extras[i] = Object.assign({}, extras[i], { titulo: val });
    boda.secciones_extra = extras;
  }

  function updateExtraTexto(i, val) {
    var boda = STATE.get();
    var extras = (boda.secciones_extra || []).slice();
    extras[i] = Object.assign({}, extras[i], { texto: val });
    boda.secciones_extra = extras;
  }

  function añadirExtraSub(i) {
    var boda = STATE.get();
    var extras = (boda.secciones_extra || []).slice();
    var subs = (extras[i].subsecciones || []).slice();
    subs.push({ titulo: '', texto: '' });
    extras[i] = Object.assign({}, extras[i], { subsecciones: subs });
    STATE.set('secciones_extra', extras);
  }

  function eliminarExtraSub(i, j) {
    var boda = STATE.get();
    var extras = (boda.secciones_extra || []).slice();
    var subs = (extras[i].subsecciones || []).slice();
    subs.splice(j, 1);
    extras[i] = Object.assign({}, extras[i], { subsecciones: subs });
    STATE.set('secciones_extra', extras);
  }

  function updateExtraSubTitulo(i, j, val) {
    var boda = STATE.get();
    var extras = (boda.secciones_extra || []).slice();
    var subs = (extras[i].subsecciones || []).slice();
    subs[j] = Object.assign({}, subs[j], { titulo: val });
    extras[i] = Object.assign({}, extras[i], { subsecciones: subs });
    boda.secciones_extra = extras;
  }

  function updateExtraSubTexto(i, j, val) {
    var boda = STATE.get();
    var extras = (boda.secciones_extra || []).slice();
    var subs = (extras[i].subsecciones || []).slice();
    subs[j] = Object.assign({}, subs[j], { texto: val });
    extras[i] = Object.assign({}, extras[i], { subsecciones: subs });
    boda.secciones_extra = extras;
  }

  return {
    init, toggleSeccion, updateTexto,
    añadirSub, eliminarSub, updateSubTitulo, updateSubTexto,
    añadirExtra, eliminarExtra, updateExtraTitulo, updateExtraTexto,
    añadirExtraSub, eliminarExtraSub, updateExtraSubTitulo, updateExtraSubTexto,
  };
})();
