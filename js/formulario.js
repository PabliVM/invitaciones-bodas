// formulario.js — Gestor del formulario personalizado en el editor

const FORMULARIO = (() => {

  var _renderTimer = null;

  function init() {
    _renderPanel();
    STATE.suscribir(function() {
      clearTimeout(_renderTimer);
      _renderTimer = setTimeout(_renderPanel, 300);
    });
  }

  function _renderPanel() {
    var contenedor = document.getElementById('formulario-panel');
    if (!contenedor) return;
    var boda = STATE.get();
    var form = boda.formulario || {};
    var preguntas = form.preguntas || [];

    var html = '';

    // Config general
    html += '<div style="padding:10px 12px;border-bottom:1px solid var(--editor-border)">';
    html += '<div class="campo" style="margin-bottom:8px"><label class="campo__label">Título del formulario</label>';
    html += '<input type="text" class="campo__input" value="' + (form.titulo || '') + '" oninput="FORMULARIO.updateCampo(\'titulo\',this.value)" placeholder="Ej: Confirma tu asistencia" /></div>';
    html += '<div class="campo" style="margin-bottom:8px"><label class="campo__label">Descripción (opcional)</label>';
    html += '<textarea class="campo__textarea" rows="2" oninput="FORMULARIO.updateCampo(\'descripcion\',this.value)" placeholder="Texto introductorio...">' + (form.descripcion || '') + '</textarea></div>';
    html += '<div class="campo" style="margin-bottom:8px"><label class="campo__label">Texto del botón enviar</label>';
    html += '<input type="text" class="campo__input" value="' + (form.textoBtnEnviar || 'Enviar') + '" oninput="FORMULARIO.updateCampo(\'textoBtnEnviar\',this.value)" /></div>';
    html += '<div class="campo"><label class="campo__label">Mensaje de confirmación</label>';
    html += '<input type="text" class="campo__input" value="' + (form.mensajeConfirmacion || '') + '" oninput="FORMULARIO.updateCampo(\'mensajeConfirmacion\',this.value)" /></div>';
    html += '</div>';

    // Preguntas
    html += '<div id="preguntas-lista" style="padding:8px 12px">';

    preguntas.forEach(function(preg, i) {
      html += '<div class="preg-item" id="preg-' + i + '">';

      // Header pregunta
      html += '<div class="preg-item__header">';
      html += '<span class="preg-item__num">' + (i + 1) + '</span>';
      html += '<input type="text" class="preg-item__titulo" value="' + (preg.texto || '') + '" placeholder="Escribe la pregunta..." oninput="FORMULARIO.updatePregunta(' + i + ',\'texto\',this.value)" />';
      html += '<button class="sec-sub__eliminar" onclick="FORMULARIO.eliminarPregunta(' + i + ')">✕</button>';
      html += '</div>';

      // Tipo
      html += '<div style="display:flex;gap:6px;margin:6px 0;flex-wrap:wrap">';
      var tipos = [
        { val: 'texto', label: 'Texto' },
        { val: 'opcion_unica', label: 'Una opción' },
        { val: 'opcion_multiple', label: 'Varias opciones' },
        { val: 'numero', label: 'Número' },
      ];
      tipos.forEach(function(t) {
        var activo = preg.tipo === t.val;
        html += '<button onclick="FORMULARIO.updatePregunta(' + i + ',\'tipo\',\'' + t.val + '\')" style="padding:4px 8px;font-size:10px;font-family:inherit;cursor:pointer;border:1px solid ' + (activo ? 'var(--editor-accent)' : 'var(--editor-border)') + ';background:' + (activo ? 'rgba(184,134,11,.15)' : 'transparent') + ';color:' + (activo ? 'var(--editor-accent)' : 'var(--editor-text-muted)') + '">' + t.label + '</button>';
      });
      html += '</div>';

      // Opciones (para opción única y múltiple)
      if (preg.tipo === 'opcion_unica' || preg.tipo === 'opcion_multiple') {
        var opciones = preg.opciones || [];
        html += '<div style="margin:4px 0 6px">';
        opciones.forEach(function(op, j) {
          html += '<div style="display:flex;align-items:center;gap:4px;margin-bottom:4px">';
          html += '<span style="color:var(--editor-text-muted);font-size:11px;width:14px">' + (preg.tipo === 'opcion_unica' ? '○' : '□') + '</span>';
          html += '<input type="text" style="flex:1;background:var(--editor-input-bg);border:1px solid var(--editor-border);color:var(--editor-text);font-family:inherit;font-size:11px;padding:4px 6px;outline:none" value="' + op + '" placeholder="Opción ' + (j+1) + '" oninput="FORMULARIO.updateOpcion(' + i + ',' + j + ',this.value)" />';
          html += '<button onclick="FORMULARIO.eliminarOpcion(' + i + ',' + j + ')" style="background:transparent;border:none;color:var(--editor-text-muted);cursor:pointer;font-size:11px;padding:2px 4px">✕</button>';
          html += '</div>';
        });
        html += '<button onclick="FORMULARIO.añadirOpcion(' + i + ')" style="font-size:10px;padding:3px 8px;background:transparent;border:1px dashed var(--editor-border);color:var(--editor-text-muted);cursor:pointer;font-family:inherit;margin-top:2px">+ Añadir opción</button>';
        html += '</div>';
      }

      // Obligatoria
      html += '<div style="display:flex;align-items:center;gap:8px;margin-top:6px">';
      html += '<label class="campo__toggle"><input type="checkbox" ' + (preg.obligatoria ? 'checked' : '') + ' onchange="FORMULARIO.updatePregunta(' + i + ',\'obligatoria\',this.checked)" /><span class="campo__toggle-slider"></span></label>';
      html += '<span style="font-size:10px;color:var(--editor-text-muted)">Obligatoria</span>';
      html += '</div>';

      html += '</div>'; // preg-item
    });

    html += '</div>'; // preguntas-lista

    // Botón añadir pregunta
    html += '<div style="padding:0 12px 12px">';
    html += '<button class="sec-btn-nueva" onclick="FORMULARIO.añadirPregunta()">+ Añadir pregunta</button>';
    html += '</div>';

    contenedor.innerHTML = html;
  }

  // ── API ──

  function updateCampo(campo, valor) {
    var boda = STATE.get();
    if (!boda.formulario) boda.formulario = {};
    boda.formulario[campo] = valor;
    // Re-render preview sin re-renderizar panel
    clearTimeout(_renderTimer);
    _renderTimer = setTimeout(function() {
      var preview = document.getElementById('preview-root');
      if (preview) RENDERER.render(STATE.get(), preview);
    }, 500);
  }

  function añadirPregunta() {
    var boda = STATE.get();
    if (!boda.formulario) boda.formulario = {};
    var preguntas = (boda.formulario.preguntas || []).slice();
    preguntas.push({
      id: 'p' + Date.now(),
      texto: '',
      tipo: 'texto',
      opciones: [],
      obligatoria: false,
    });
    boda.formulario.preguntas = preguntas;
    STATE.set('formulario.preguntas', preguntas);
  }

  function eliminarPregunta(i) {
    var boda = STATE.get();
    var preguntas = (boda.formulario.preguntas || []).slice();
    preguntas.splice(i, 1);
    STATE.set('formulario.preguntas', preguntas);
  }

  function updatePregunta(i, campo, valor) {
    var boda = STATE.get();
    var preguntas = (boda.formulario.preguntas || []).slice();
    preguntas[i] = Object.assign({}, preguntas[i]);
    preguntas[i][campo] = valor;
    if (campo === 'tipo' && (valor === 'opcion_unica' || valor === 'opcion_multiple') && (!preguntas[i].opciones || preguntas[i].opciones.length === 0)) {
      preguntas[i].opciones = ['', ''];
    }
    STATE.set('formulario.preguntas', preguntas);
  }

  function añadirOpcion(pregIdx) {
    var boda = STATE.get();
    var preguntas = (boda.formulario.preguntas || []).slice();
    preguntas[pregIdx] = Object.assign({}, preguntas[pregIdx]);
    preguntas[pregIdx].opciones = (preguntas[pregIdx].opciones || []).concat('');
    STATE.set('formulario.preguntas', preguntas);
  }

  function eliminarOpcion(pregIdx, opIdx) {
    var boda = STATE.get();
    var preguntas = (boda.formulario.preguntas || []).slice();
    preguntas[pregIdx] = Object.assign({}, preguntas[pregIdx]);
    var ops = preguntas[pregIdx].opciones.slice();
    ops.splice(opIdx, 1);
    preguntas[pregIdx].opciones = ops;
    STATE.set('formulario.preguntas', preguntas);
  }

  function updateOpcion(pregIdx, opIdx, valor) {
    var boda = STATE.get();
    var preguntas = (boda.formulario.preguntas || []).slice();
    preguntas[pregIdx] = Object.assign({}, preguntas[pregIdx]);
    var ops = preguntas[pregIdx].opciones.slice();
    ops[opIdx] = valor;
    preguntas[pregIdx].opciones = ops;
    // Update directly without triggering re-render
    boda.formulario.preguntas = preguntas;
  }

  return { init, updateCampo, añadirPregunta, eliminarPregunta, updatePregunta, añadirOpcion, eliminarOpcion, updateOpcion };
})();
