// subidas.js — Botón "Subir" junto a cada campo de foto del editor.
// Sube a Supabase Storage (carpeta de la boda) y escribe la URL en el campo,
// disparando 'input' para que el editor la guarde como si se hubiera pegado.

(function() {

  function _aviso(texto) {
    const el = document.getElementById('indicador-guardado');
    if (!el) return;
    el.textContent = texto;
    el.classList.add('visible');
    setTimeout(() => el.classList.remove('visible'), 2500);
  }

  function _bodaId() {
    return (typeof STATE !== 'undefined' && STATE.getId()) || new URLSearchParams(location.search).get('id');
  }

  // Crea el botón + input file oculto; onUrls recibe las URLs subidas
  function _boton(texto, multiple, onUrls, acepta) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn--secundario subir-btn';
    btn.textContent = texto;

    const file = document.createElement('input');
    file.type = 'file';
    file.accept = acepta || 'image/*';
    file.multiple = multiple;
    file.hidden = true;

    btn.addEventListener('click', () => file.click());

    file.addEventListener('change', async () => {
      const archivos = Array.from(file.files || []);
      file.value = '';
      if (!archivos.length) return;
      const original = btn.textContent;
      btn.disabled = true;
      const urls = [];
      try {
        // Boda nueva: se guarda primero para tener su carpeta de fotos
        if (!_bodaId() && typeof GUARDADO !== 'undefined') {
          btn.textContent = 'Preparando…';
          await GUARDADO.guardarAhora();
        }
        if (!_bodaId()) throw new Error('no se pudo guardar la boda');
        for (let i = 0; i < archivos.length; i++) {
          btn.textContent = archivos.length > 1 ? `Subiendo ${i + 1}/${archivos.length}…` : 'Subiendo…';
          urls.push(await DB.subirFoto(_bodaId(), archivos[i]));
        }
        _aviso(urls.length > 1 ? `${urls.length} fotos subidas` : (acepta ? 'Canción subida' : 'Foto subida'));
      } catch (err) {
        console.error(err);
        _aviso('Error al subir: ' + (err.message || 'inténtalo de nuevo'));
      }
      if (urls.length) onUrls(urls);
      btn.disabled = false;
      btn.textContent = original;
    });

    return [btn, file];
  }

  // Botón ✕ para vaciar el campo (la foto/canción deja de usarse en la invitación)
  function _quitar(input) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn btn--ghost subir-quitar';
    b.title = 'Quitar';
    b.setAttribute('aria-label', 'Quitar');
    b.textContent = '✕';
    const ver = () => { b.hidden = !input.value.trim(); };
    b.addEventListener('click', () => { input.value = ''; _emitir(input); ver(); });
    input.addEventListener('input', ver);
    if (typeof STATE !== 'undefined') STATE.suscribir(() => setTimeout(ver));
    ver();
    return b;
  }

  function _emitir(el) {
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function iniciar() {
    // Campos de una foto
    document.querySelectorAll('input[id^="inp-foto-"]').forEach(input => {
      const fila = document.createElement('div');
      fila.className = 'subir-fila';
      input.parentNode.insertBefore(fila, input);
      fila.appendChild(input);
      _boton('Subir', false, urls => { input.value = urls[0]; _emitir(input); })
        .forEach(el => fila.appendChild(el));
      fila.appendChild(_quitar(input));
    });

    // Canción: sube MP3/M4A a la carpeta de la boda
    const musica = document.getElementById('inp-musica-url');
    if (musica) {
      const fila = document.createElement('div');
      fila.className = 'subir-fila';
      musica.parentNode.insertBefore(fila, musica);
      fila.appendChild(musica);
      _boton('Subir canción', false, urls => { musica.value = urls[0]; _emitir(musica); }, 'audio/mpeg,audio/mp4,audio/x-m4a,audio/aac,audio/ogg,audio/wav,.mp3,.m4a')
        .forEach(el => fila.appendChild(el));
      fila.appendChild(_quitar(musica));
    }

    // Galería: varias fotos, se añaden al final de la lista
    const galeria = document.getElementById('inp-galeria');
    if (galeria) {
      const [btn, file] = _boton('Subir fotos a la galería', true, urls => {
        const actual = galeria.value.trim();
        galeria.value = (actual ? actual + '\n' : '') + urls.join('\n');
        _emitir(galeria);
      });
      btn.classList.add('subir-btn--ancho');
      galeria.parentNode.appendChild(btn);
      galeria.parentNode.appendChild(file);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
