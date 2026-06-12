// renderer.js — Dispatcher principal.
// Lee boda.plantilla y delega al renderer correspondiente.

const RENDERER = (() => {

  var _renderers = {
    clasica:      typeof RENDERER_CLASICA      !== 'undefined' ? RENDERER_CLASICA      : null,
    floral:       typeof RENDERER_FLORAL       !== 'undefined' ? RENDERER_FLORAL       : null,
    moderna:      typeof RENDERER_MODERNA      !== 'undefined' ? RENDERER_MODERNA      : null,
    mediterranea: typeof RENDERER_MEDITERRANEA !== 'undefined' ? RENDERER_MEDITERRANEA : null,
  };

  function render(boda, contenedor) {
    if (!contenedor) return;
    var id = (boda.plantilla && _renderers[boda.plantilla]) ? boda.plantilla : 'clasica';
    var r = _renderers[id] || _renderers['clasica'];
    if (!r) { contenedor.innerHTML = '<p style="padding:32px;color:red">Error: renderer no encontrado</p>'; return; }
    r.render(boda, contenedor);
  }

  return { render };
})();
