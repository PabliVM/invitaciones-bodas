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

  // Escapa texto para meterlo en value="" o dentro de un textarea
  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"']/g, function(c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function init() {
    _renderPanel();
    // No repintar con los cambios propios (se perdería el foco al escribir)
    STATE.suscribir(function(boda, origen) {
      if (origen === 'secciones') return;
      clearTimeout(_renderTimer);
      _renderTimer = setTimeout(_renderPanel, 300);
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
        html += '<textarea class="sec-sub__texto" style="min-height:72px" placeholder="Texto principal..." oninput="SECCIONES.updateTexto(\'' + def.id + '\',this.value)">' + esc(textoActual) + '</textarea>';
        html += '</div>';
      }
      // Subsecciones existentes
      if (subsecciones.length > 0) {
        html += '<div class="sec-subsecciones">';
        subsecciones.forEach(function(sub, i) {
          html += '<div class="sec-sub">';
          html += '<div class="sec-sub__header">';
          html += '<input type="text" class="sec-sub__titulo" value="' + esc(sub.titulo) + '" placeholder="Título" oninput="SECCIONES.updateSubTitulo(\'' + def.id + '\',' + i + ',this.value)" />';
          html += '<button class="sec-sub__eliminar" onclick="SECCIONES.eliminarSub(\'' + def.id + '\',' + i + ')">✕</button>';
          html += '</div>';
          html += '<textarea class="sec-sub__texto" placeholder="Texto..." oninput="SECCIONES.updateSubTexto(\'' + def.id + '\',' + i + ',this.value)">' + esc(sub.texto) + '</textarea>';
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
    html += '<input type="text" class="sec-extra__titulo" value="' + esc(sec.titulo) + '" placeholder="Título de la sección" oninput="SECCIONES.updateExtraTitulo(' + i + ',this.value)" />';
    html += '<button class="sec-sub__eliminar" onclick="SECCIONES.eliminarExtra(' + i + ')">✕</button>';
    html += '</div>';
    html += '<textarea class="sec-sub__texto" placeholder="Texto principal..." oninput="SECCIONES.updateExtraTexto(' + i + ',this.value)">' + esc(sec.texto) + '</textarea>';

    // Subsecciones de sección extra
    var subs = sec.subsecciones || [];
    if (subs.length > 0) {
      html += '<div class="sec-subsecciones">';
      subs.forEach(function(sub, j) {
        html += '<div class="sec-sub">';
        html += '<div class="sec-sub__header">';
        html += '<input type="text" class="sec-sub__titulo" value="' + esc(sub.titulo) + '" placeholder="Título" oninput="SECCIONES.updateExtraSubTitulo(' + i + ',' + j + ',this.value)" />';
        html += '<button class="sec-sub__eliminar" onclick="SECCIONES.eliminarExtraSub(' + i + ',' + j + ')">✕</button>';
        html += '</div>';
        html += '<textarea class="sec-sub__texto" placeholder="Texto..." oninput="SECCIONES.updateExtraSubTexto(' + i + ',' + j + ',this.value)">' + esc(sub.texto) + '</textarea>';
        html += '</div>';
      });
      html += '</div>';
    }
    html += '<button class="sec-btn-sub" onclick="SECCIONES.añadirExtraSub(' + i + ')">+ Añadir subsección</button>';
    html += '</div>';
    return html;
  }

  // ── API pública ──
  // Ediciones de texto: origen 'secciones' (no repinta el panel). Altas/bajas: repinta.

  function _extra(boda, i) { return (boda.secciones_extra || [])[i]; }

  function updateTexto(secId, val) {
    STATE.actualizar(function(b) { if (b[secId]) b[secId].texto = val; }, 'secciones');
  }

  function toggleSeccion(id, activo) {
    var boda = STATE.get();
    if (!boda[id]) return;
    STATE.set(id + ('activa' in boda[id] ? '.activa' : '.activo'), activo);
  }

  function añadirSub(secId) {
    STATE.actualizar(function(b) { if (b[secId]) b[secId].subsecciones = (b[secId].subsecciones || []).concat({ titulo: '', texto: '' }); });
  }

  function eliminarSub(secId, i) {
    STATE.actualizar(function(b) { if (b[secId]) b[secId].subsecciones.splice(i, 1); });
  }

  function updateSubTitulo(secId, i, val) {
    STATE.actualizar(function(b) { var s = b[secId] && b[secId].subsecciones[i]; if (s) s.titulo = val; }, 'secciones');
  }

  function updateSubTexto(secId, i, val) {
    STATE.actualizar(function(b) { var s = b[secId] && b[secId].subsecciones[i]; if (s) s.texto = val; }, 'secciones');
  }

  // Secciones extra (identificador estable 'extra_<uid>' en el orden)
  function añadirExtra() {
    STATE.actualizar(function(b) {
      var uid = STATE.nuevoUid();
      b.secciones_extra = (b.secciones_extra || []).concat({ uid: uid, titulo: '', texto: '', subsecciones: [] });
      b.orden_secciones = (b.orden_secciones || []).concat('extra_' + uid);
    });
  }

  function eliminarExtra(i) {
    if (!confirm('¿Eliminar esta sección?')) return;
    STATE.actualizar(function(b) {
      var sec = _extra(b, i);
      if (!sec) return;
      b.secciones_extra.splice(i, 1);
      b.orden_secciones = (b.orden_secciones || []).filter(function(id) { return id !== 'extra_' + sec.uid; });
    });
  }

  function updateExtraTitulo(i, val) {
    STATE.actualizar(function(b) { var e = _extra(b, i); if (e) e.titulo = val; }, 'secciones');
  }

  function updateExtraTexto(i, val) {
    STATE.actualizar(function(b) { var e = _extra(b, i); if (e) e.texto = val; }, 'secciones');
  }

  function añadirExtraSub(i) {
    STATE.actualizar(function(b) { var e = _extra(b, i); if (e) e.subsecciones = (e.subsecciones || []).concat({ titulo: '', texto: '' }); });
  }

  function eliminarExtraSub(i, j) {
    STATE.actualizar(function(b) { var e = _extra(b, i); if (e) e.subsecciones.splice(j, 1); });
  }

  function updateExtraSubTitulo(i, j, val) {
    STATE.actualizar(function(b) { var e = _extra(b, i); if (e && e.subsecciones[j]) e.subsecciones[j].titulo = val; }, 'secciones');
  }

  function updateExtraSubTexto(i, j, val) {
    STATE.actualizar(function(b) { var e = _extra(b, i); if (e && e.subsecciones[j]) e.subsecciones[j].texto = val; }, 'secciones');
  }

  return {
    init, toggleSeccion, updateTexto,
    añadirSub, eliminarSub, updateSubTitulo, updateSubTexto,
    añadirExtra, eliminarExtra, updateExtraTitulo, updateExtraTexto,
    añadirExtraSub, eliminarExtraSub, updateExtraSubTitulo, updateExtraSubTexto,
  };
})();
