// orden.js — Gestor del orden de secciones

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

  function _renderPanel() {
    var contenedor = document.getElementById('orden-panel');
    if (!contenedor) return;
    var boda = STATE.get();
    var orden = (boda.orden_secciones || ['historia','galeria','evento','dresscode','alojamiento','transporte','rsvp','mensaje']).slice();
    var extras = boda.secciones_extra || [];

    var html = '<div style="padding:8px 12px;display:flex;flex-direction:column;gap:4px">';

    // Secciones predefinidas
    orden.forEach(function(id, i) {
      var sec = boda[id] || {};
      var activa = sec.activo !== false && sec.activa !== false;
      var label = LABELS[id] || id;

      html += '<div style="display:flex;align-items:center;gap:6px;background:var(--editor-input-bg);border:1px solid var(--editor-border);padding:8px 10px;opacity:' + (activa ? '1' : '0.4') + '">';
      html += '<span style="flex:1;font-size:12px;color:var(--editor-text)">' + label + '</span>';
      html += '<button onclick="ORDEN.subir(' + i + ')" style="background:transparent;border:1px solid var(--editor-border);color:var(--editor-text-muted);cursor:pointer;padding:2px 7px;font-size:12px;line-height:1" ' + (i === 0 ? 'disabled' : '') + '>↑</button>';
      html += '<button onclick="ORDEN.bajar(' + i + ')" style="background:transparent;border:1px solid var(--editor-border);color:var(--editor-text-muted);cursor:pointer;padding:2px 7px;font-size:12px;line-height:1" ' + (i === orden.length - 1 && extras.length === 0 ? 'disabled' : '') + '>↓</button>';
      html += '</div>';
    });

    // Secciones extra
    extras.forEach(function(sec, i) {
      var idxGlobal = orden.length + i;
      html += '<div style="display:flex;align-items:center;gap:6px;background:var(--editor-input-bg);border:1px solid rgba(184,134,11,.3);padding:8px 10px">';
      html += '<span style="flex:1;font-size:12px;color:var(--editor-text)">✦ ' + (sec.titulo || 'Sección personalizada') + '</span>';
      html += '<button onclick="ORDEN.subirExtra(' + i + ')" style="background:transparent;border:1px solid var(--editor-border);color:var(--editor-text-muted);cursor:pointer;padding:2px 7px;font-size:12px;line-height:1" ' + (idxGlobal === 0 ? 'disabled' : '') + '>↑</button>';
      html += '<button onclick="ORDEN.bajarExtra(' + i + ')" style="background:transparent;border:1px solid var(--editor-border);color:var(--editor-text-muted);cursor:pointer;padding:2px 7px;font-size:12px;line-height:1" ' + (i === extras.length - 1 ? 'disabled' : '') + '>↓</button>';
      html += '</div>';
    });

    html += '</div>';
    contenedor.innerHTML = html;
  }

  function subir(i) {
    var boda = STATE.get();
    var orden = (boda.orden_secciones || []).slice();
    if (i <= 0) return;
    var tmp = orden[i - 1];
    orden[i - 1] = orden[i];
    orden[i] = tmp;
    STATE.set('orden_secciones', orden);
  }

  function bajar(i) {
    var boda = STATE.get();
    var orden = (boda.orden_secciones || []).slice();
    if (i >= orden.length - 1) return;
    var tmp = orden[i + 1];
    orden[i + 1] = orden[i];
    orden[i] = tmp;
    STATE.set('orden_secciones', orden);
  }

  function subirExtra(i) {
    var boda = STATE.get();
    var extras = (boda.secciones_extra || []).slice();
    if (i <= 0) return;
    var tmp = extras[i - 1];
    extras[i - 1] = extras[i];
    extras[i] = tmp;
    STATE.set('secciones_extra', extras);
  }

  function bajarExtra(i) {
    var boda = STATE.get();
    var extras = (boda.secciones_extra || []).slice();
    if (i >= extras.length - 1) return;
    var tmp = extras[i + 1];
    extras[i + 1] = extras[i];
    extras[i] = tmp;
    STATE.set('secciones_extra', extras);
  }

  return { init, subir, bajar, subirExtra, bajarExtra };
})();
