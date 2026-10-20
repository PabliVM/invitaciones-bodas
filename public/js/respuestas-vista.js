// respuestas-vista.js — Contadores, tablas y descarga Excel de las respuestas de una boda.
// Lo usan respuestas.html (superadmin) y novios.html (portal de los novios).

const RESPUESTAS_VISTA = (() => {

  let _datos = { rsvps: [], formularios: [] };
  let _nombre = 'boda';

  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function fecha(iso) {
    return iso ? new Date(iso).toLocaleString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
  }

  function asistenciaTexto(v) {
    return v === 'si' ? 'Asiste' : v === 'no' ? 'No asiste' : (v || '—');
  }

  // Columnas del cuestionario = todas las preguntas que aparecen en alguna respuesta
  function columnas() {
    const cols = [];
    _datos.formularios.forEach(f => Object.keys(f.respuestas || {}).forEach(k => { if (cols.indexOf(k) === -1) cols.push(k); }));
    return cols;
  }

  function pintar(contenedor, datos, nombre) {
    _datos = datos;
    _nombre = nombre || 'boda';
    const r = datos.rsvps;
    const si = r.filter(x => x.asistencia === 'si').length;
    const no = r.filter(x => x.asistencia === 'no').length;
    let html = '';

    html += '<div class="stats">';
    html += '<div class="stat"><div class="stat__num">' + r.length + '</div><div class="stat__label">Confirmaciones</div></div>';
    html += '<div class="stat stat--si"><div class="stat__num">' + si + '</div><div class="stat__label">Asisten</div></div>';
    html += '<div class="stat stat--no"><div class="stat__num">' + no + '</div><div class="stat__label">No asisten</div></div>';
    html += '<div class="stat"><div class="stat__num">' + datos.formularios.length + '</div><div class="stat__label">Cuestionarios</div></div>';
    html += '</div>';

    html += '<section class="bloque-resp">';
    html += '<div class="bloque-resp__cab"><h2 class="bloque-resp__titulo">Confirmaciones de asistencia</h2>';
    if (r.length) html += '<button class="btn btn--secundario" data-exportar="rsvps">Descargar Excel</button>';
    html += '</div>';
    if (!r.length) {
      html += '<div class="vacio"><p class="vacio__sub">Todavía no hay confirmaciones.</p></div>';
    } else {
      html += '<div class="tabla-wrap"><table class="tabla"><thead><tr><th>Nombre</th><th>Asistencia</th><th>Mensaje</th><th>Fecha</th></tr></thead><tbody>';
      r.forEach(x => {
        html += '<tr><td>' + esc(x.nombre) + '</td>';
        html += '<td><span class="chip chip--' + esc(x.asistencia) + '">' + esc(asistenciaTexto(x.asistencia)) + '</span></td>';
        html += '<td>' + esc(x.mensaje) + '</td><td class="tabla__fecha">' + fecha(x.enviado_en) + '</td></tr>';
      });
      html += '</tbody></table></div>';
    }
    html += '</section>';

    const cols = columnas();
    html += '<section class="bloque-resp">';
    html += '<div class="bloque-resp__cab"><h2 class="bloque-resp__titulo">Cuestionario</h2>';
    if (datos.formularios.length) html += '<button class="btn btn--secundario" data-exportar="formularios">Descargar Excel</button>';
    html += '</div>';
    if (!datos.formularios.length) {
      html += '<div class="vacio"><p class="vacio__sub">Todavía no hay cuestionarios enviados.</p></div>';
    } else {
      html += '<div class="tabla-wrap"><table class="tabla"><thead><tr>';
      cols.forEach(c => { html += '<th>' + esc(c) + '</th>'; });
      html += '<th>Fecha</th></tr></thead><tbody>';
      datos.formularios.forEach(f => {
        html += '<tr>';
        cols.forEach(c => { html += '<td>' + esc((f.respuestas || {})[c]) + '</td>'; });
        html += '<td class="tabla__fecha">' + fecha(f.enviado_en) + '</td></tr>';
      });
      html += '</tbody></table></div>';
    }
    html += '</section>';

    contenedor.innerHTML = html;
    contenedor.querySelectorAll('[data-exportar]').forEach(b => b.addEventListener('click', () => exportar(b.dataset.exportar)));
  }

  // CSV con ; y BOM → se abre bien en Excel en español
  function exportar(tipo) {
    let filas;
    if (tipo === 'rsvps') {
      filas = [['Nombre', 'Asistencia', 'Mensaje', 'Fecha']].concat(_datos.rsvps.map(x =>
        [x.nombre, asistenciaTexto(x.asistencia), x.mensaje, fecha(x.enviado_en)]));
    } else {
      const cols = columnas();
      filas = [cols.concat('Fecha')].concat(_datos.formularios.map(f =>
        cols.map(c => (f.respuestas || {})[c]).concat(fecha(f.enviado_en))));
    }
    // Evita fórmulas en Excel (inyección CSV): prefija = + - @
    const celda = v => {
      let s = String(v == null ? '' : v);
      if (/^[=+\-@]/.test(s)) s = "'" + s;
      return '"' + s.replace(/"/g, '""') + '"';
    };
    const csv = filas.map(f => f.map(celda).join(';')).join('\r\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = _nombre.replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-').toLowerCase() + '-' + (tipo === 'rsvps' ? 'asistencia' : 'cuestionario') + '.csv';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  return { pintar };
})();
