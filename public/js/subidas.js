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
  function _boton(texto, multiple, onUrls) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn--secundario subir-btn';
    btn.textContent = texto;

    const file = document.createElement('input');
    file.type = 'file';
    file.accept = 'image/*';
    file.multiple = multiple;
    file.hidden = true;

    btn.addEventListener('click', () => {
      if (!_bodaId()) { _aviso('Guarda la boda antes de subir fotos'); return; }
      file.click();
    });

    file.addEventListener('change', async () => {
      const archivos = Array.from(file.files || []);
      file.value = '';
      if (!archivos.length) return;
      const original = btn.textContent;
      btn.disabled = true;
      const urls = [];
      try {
        for (let i = 0; i < archivos.length; i++) {
          btn.textContent = archivos.length > 1 ? `Subiendo ${i + 1}/${archivos.length}…` : 'Subiendo…';
          urls.push(await DB.subirFoto(_bodaId(), archivos[i]));
        }
        _aviso(urls.length > 1 ? `${urls.length} fotos subidas` : 'Foto subida');
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
    });

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
