// magia.js — Efectos de la invitación: revelado al scroll, polvo dorado y barra de progreso.
// Solo añade clases mg-* y elementos decorativos; no toca datos ni lógica.

(function() {
  var reducido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var io = null;

  // En la vista previa del editor no hay efectos (se re-renderiza en cada cambio)
  if (new URLSearchParams(window.location.search).get('preview') === '1') return;

  function observar(el, delay) {
    if (!el || el.classList.contains('mg-reveal')) return;
    if (delay) el.style.setProperty('--mg-delay', delay + 's');
    el.classList.add('mg-reveal');
    if (io) io.observe(el); else el.classList.add('mg-in');
  }

  // Portada: entrada escalonada. Resto: cada bloque aparece al hacer scroll.
  function prepararInvitacion(root) {
    var portada = root.querySelector('.inv-portada .inv-sec__in');
    if (portada) portada.classList.add('mg-entrada');
    root.querySelectorAll('.inv-sec:not(.inv-portada) .inv-sec__in').forEach(function(sec) {
      Array.prototype.forEach.call(sec.children, function(hijo, i) { observar(hijo, Math.min(i * 0.12, 0.48)); });
    });
  }

  function vigilar(id, fn) {
    var el = document.getElementById(id);
    if (!el) return;
    var t = null;
    new MutationObserver(function() {
      clearTimeout(t);
      t = setTimeout(function() { fn(el); }, 30);
    }).observe(el, { childList: true });
    if (el.children.length) fn(el);
  }

  // Barra de progreso de lectura
  function progreso() {
    var barra = document.createElement('div');
    barra.className = 'mg-progreso';
    document.body.appendChild(barra);
    var pendiente = false;
    window.addEventListener('scroll', function() {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(function() {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        barra.style.transform = 'scaleX(' + (max > 0 ? Math.min(window.scrollY / max, 1) : 0) + ')';
        pendiente = false;
      });
    }, { passive: true });
  }

  // Polvo dorado sobre la portada; se desvanece al bajar
  function polvo() {
    var canvas = document.createElement('canvas');
    canvas.className = 'mg-polvo';
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, particulas = [];
    var color = (getComputedStyle(document.getElementById('invitation-root') || document.documentElement).getPropertyValue('--inv-primario') || '').trim() || '#d9b26a';

    function medir() {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(70, (w * h) / 18000));
      particulas = [];
      for (var i = 0; i < n; i++) particulas.push(nueva(true));
    }

    function nueva(inicial) {
      return {
        x: Math.random() * w,
        y: inicial ? Math.random() * h : h + 10,
        r: Math.random() * 1.6 + 0.4,
        vy: -(Math.random() * 0.35 + 0.08),
        vx: (Math.random() - 0.5) * 0.15,
        fase: Math.random() * Math.PI * 2,
        a: Math.random() * 0.5 + 0.3
      };
    }

    function frame(t) {
      var visible = Math.max(0, 1 - window.scrollY / (h * 0.9));
      canvas.style.opacity = visible;
      if (visible > 0) {
        ctx.clearRect(0, 0, w, h);
        for (var i = 0; i < particulas.length; i++) {
          var p = particulas[i];
          p.x += p.vx + Math.sin(t / 1800 + p.fase) * 0.12;
          p.y += p.vy;
          if (p.y < -10) particulas[i] = p = nueva(false);
          var parpadeo = 0.55 + 0.45 * Math.sin(t / 700 + p.fase);
          ctx.globalAlpha = p.a * parpadeo;
          ctx.shadowBlur = 8;
          ctx.shadowColor = color;
          ctx.fillStyle = p.r > 1.4 ? '#fff6dc' : color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      requestAnimationFrame(frame);
    }

    window.addEventListener('resize', medir);
    medir();
    requestAnimationFrame(frame);
  }

  function iniciar() {
    if (!reducido && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(function(entradas) {
        entradas.forEach(function(e) {
          if (!e.isIntersecting) return;
          e.target.classList.add('mg-in');
          io.unobserve(e.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    }

    vigilar('invitation-root', prepararInvitacion);
    progreso();

    // El polvo arranca cuando la invitación ya tiene colores aplicados
    if (!reducido) {
      var carga = document.getElementById('pantalla-carga');
      var lanzado = false;
      var lanzar = function() { if (!lanzado) { lanzado = true; polvo(); } };
      if (carga) {
        new MutationObserver(function() {
          if (carga.classList.contains('oculto')) lanzar();
        }).observe(carga, { attributes: true, attributeFilter: ['class'] });
      } else {
        lanzar();
      }
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
