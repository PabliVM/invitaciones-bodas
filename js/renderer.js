// renderer.js — Genera el HTML de la invitación desde el estado.
// Usado tanto en editor.html (preview) como en invitation.html.

const RENDERER = (() => {

  function render(boda, contenedor) {
    if (!contenedor) return;
    _aplicarVariablesCSS(boda.estilos);
    contenedor.innerHTML = _buildHTML(boda);
    _initCountdown(boda.fecha, contenedor);
  }

  function _aplicarVariablesCSS(estilos) {
    const root = document.documentElement;
    root.style.setProperty('--color-primario', estilos.colorPrimario);
    root.style.setProperty('--color-secundario', estilos.colorSecundario);
    root.style.setProperty('--color-texto', estilos.colorTexto);
    root.style.setProperty('--color-accent', estilos.colorAccent);
    root.style.setProperty('--fuente-display', `'${estilos.fuente}', serif`);
    root.style.setProperty('--fuente-body', `'${estilos.fuenteSecundaria}', sans-serif`);
  }

  function _buildHTML(boda) {
    const secciones = [];
    secciones.push(_portada(boda));
    secciones.push(_countdown(boda.fecha));
    if (boda.historia.activa) secciones.push(_historia(boda.historia));
    if (boda.galeria.activa && boda.galeria.fotos.length > 0) secciones.push(_galeria(boda.galeria));
    if (boda.evento.activo) secciones.push(_evento(boda.evento, boda.fecha));
    if (boda.dresscode.activo) secciones.push(_dresscode(boda.dresscode));
    if (boda.rsvp.activo) secciones.push(_rsvp(boda.rsvp, boda.pareja));
    if (boda.mensaje.activo) secciones.push(_mensajeFinal(boda.mensaje, boda.pareja));
    return secciones.join('');
  }

  function _portada(boda) {
    const { novio, novia } = boda.pareja;
    const { dia, mes, anio } = boda.fecha;
    const meses = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
    const mesNombre = meses[parseInt(mes) - 1] || mes;
    return `<section class="inv-portada">
      <div class="inv-portada__ornamento">✦</div>
      <p class="inv-portada__preludio">Nos casamos</p>
      <h1 class="inv-portada__nombres">
        <span>${novio}</span>
        <span class="inv-portada__amp">&</span>
        <span>${novia}</span>
      </h1>
      <div class="inv-portada__fecha">
        <span>${dia}</span><span class="inv-portada__fecha-sep">·</span>
        <span>${mesNombre}</span><span class="inv-portada__fecha-sep">·</span>
        <span>${anio}</span>
      </div>
      <div class="inv-portada__linea"></div>
    </section>`;
  }

  // ... _countdown, _historia, _galeria, _evento, _dresscode, _rsvp, _mensajeFinal
  // Ver archivo completo en el ZIP

  function _initCountdown(fecha, contenedor) {
    const { dia, mes, anio, hora } = fecha;
    const [hh, mm] = (hora || '12:00').split(':');
    const objetivo = new Date(parseInt(anio), parseInt(mes)-1, parseInt(dia), parseInt(hh), parseInt(mm));
    function actualizar() {
      const diff = objetivo - new Date();
      if (diff <= 0) return;
      const setVal = (id, val) => {
        const el = contenedor.querySelector(`#${id}`);
        if (el) el.textContent = String(val).padStart(2, '0');
      };
      setVal('cd-dias', Math.floor(diff / 86400000));
      setVal('cd-horas', Math.floor((diff % 86400000) / 3600000));
      setVal('cd-minutos', Math.floor((diff % 3600000) / 60000));
      setVal('cd-segundos', Math.floor((diff % 60000) / 1000));
    }
    actualizar();
    if (contenedor.id === 'invitation-root') setInterval(actualizar, 1000);
  }

  return { render };
})();
