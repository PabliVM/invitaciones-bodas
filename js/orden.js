// orden.js — Gestor del orden unificado de secciones
// Un solo array que mezcla predefinidas y extras

const ORDEN = (() => {

  var _timer = null;

  var LABELS = {
    historia:    '📖 Historia',
    galeria:     '📷 Galería',
    evento:      '📍 El evento',
    dresscode:   '👔 Dress code',
    alojamiento: '🏨 Alojamiento',
    transporte:  '🚌 Transporte',
    rsvp:        '✉️ RSVP',
    mensaje:     '💌 Mensaje final',
  };

  function init() {
    _renderPanel();
    STATE.suscribir(function() {
      clearTimeout(_timer);
      _timer = setTimeout(_renderPanel, 300);
    });
  }

  // Asegurar que el orden incluye todas las secciones existentes
  function _ordenCompleto(boda) {
    var orden = (boda.orden_secciones || []).slice();
    var predefinidas = ['historia','galeria','evento','dresscode','alojamiento','transporte','rsvp','mensaje'];
    var extras = boda.secciones_extra || [];

    // Añadir predefinidas que no estén en el orden
    predefinidas.forEach(function(id) {
      if (orden.indexOf(id) === -1) orden.push(id);
    });

    // Sincronizar extras: añadir nuevas, eliminar las que ya no existen
    var extrasEnOrden = orden.filter(function(id) { return id.indexOf('extra_') === 0; });
    
    // Añadir extras nuevas que no estén en el orden
    extras.forEach(function(_, i) {
      if (orden.indexOf('extra_' + i) === -1) orden.push('extra_' + i);
    });

    // Eliminar extras que ya no existen
    orden = orden.filter(function(id) {
      if (id.indexOf('extra_') !== 0) return true;
      var idx = parseInt(id.replace('extra_', ''));
      return idx < extras.length;
    });

    return orden;
  }

  function _renderPanel() {
    var contenedor = document.getElementById('orden-panel');
    if (!contenedor) return;
    var boda = STATE.get();
    var orden = _ordenCompleto(boda);
    var extras = boda.secciones_extra || [];

    var html = '<div style="padding:8px 12px;display:flex;flex-direction:column;gap:4px">';

    orden.forEach(function(id, i) {
      var esExtra = id.indexOf('extra_') === 0;
      var label, activa;

      if (esExtra) {
        var idx = parseInt(id.replace('extra_', ''));
        var sec = extras[idx] || {};
        label = '✦ ' + (sec.titulo || 'Sección personalizada');
        activa = true;
      } else {
        var sec = boda[id] || {};
        label = LABELS[id] || id;
        activa = sec.activo !== false && sec.activa !== false;
      }

      var bordeColor = esExtra ? 'rgba(184,134,11,.3)' : 'var(--editor-border)';

      html += '<div style="display:flex;align-items:center;gap:6px;background:var(--editor-input-bg);border:1px solid ' + bordeColor + ';padding:8px 10px;opacity:' + (activa ? '1' : '0.4') + '">';
      html += '<span style="flex:1;font-size:12px;color:var(--editor-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + label + '</span>';
      html += '<button onclick="ORDEN.mover(' + i + ',-1)" style="background:transparent;border:1px solid var(--editor-border);color:var(--editor-text-muted);cursor:pointer;padding:2px 7px;font-size:12px;line-height:1" ' + (i === 0 ? 'disabled' : '') + '>↑</button>';
      html += '<button onclick="ORDEN.mover(' + i + ',1)" style="background:transparent;border:1px solid var(--editor-border);color:var(--editor-text-muted);cursor:pointer;padding:2px 7px;font-size:12px;line-height:1" ' + (i === orden.length - 1 ? 'disabled' : '') + '>↓</button>';
      html += '</div>';
    });

    html += '</div>';
    contenedor.innerHTML = html;

    // Guardar orden actualizado en state si cambió
    var ordenActual = JSON.stringify(boda.orden_secciones || []);
    var ordenNuevo = JSON.stringify(orden);
    if (ordenActual !== ordenNuevo) {
      boda.orden_secciones = orden; // actualizar sin notificar para evitar loop
    }
  }

  function mover(i, direccion) {
    var boda = STATE.get();
    var orden = _ordenCompleto(boda).slice();
    var j = i + direccion;
    if (j < 0 || j >= orden.length) return;
    var tmp = orden[j];
    orden[j] = orden[i];
    orden[i] = tmp;
    STATE.set('orden_secciones', orden);
  }

  // Llamar cuando se añade una sección extra nueva
  function sincronizar() {
    var boda = STATE.get();
    var orden = _ordenCompleto(boda);
    boda.orden_secciones = orden;
    STATE.set('orden_secciones', orden);
  }

  return { init, mover, sincronizar };
})();
