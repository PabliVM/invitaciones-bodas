// renderer.js — Dispatcher principal.
// Lee boda.plantilla y delega al renderer correspondiente.

const RENDERER = (() => {

  function _getRenderer(id) {
    var map = {
      clasica:      typeof RENDERER_CLASICA      !== 'undefined' ? RENDERER_CLASICA      : null,
      floral:       typeof RENDERER_FLORAL       !== 'undefined' ? RENDERER_FLORAL       : null,
      moderna:      typeof RENDERER_MODERNA      !== 'undefined' ? RENDERER_MODERNA      : null,
      mediterranea: typeof RENDERER_MEDITERRANEA !== 'undefined' ? RENDERER_MEDITERRANEA : null,
    };
    return map[id] || map['clasica'] || null;
  }

  function render(boda, contenedor) {
    if (!contenedor) return;
    var id = boda.plantilla || 'clasica';
    var r = _getRenderer(id);
    if (!r) {
      contenedor.innerHTML = '<p style="padding:32px;color:red;font-family:sans-serif">Error: renderer "' + id + '" no encontrado</p>';
      return;
    }
    r.render(boda, contenedor);
  }

  return { render };
})();
