# Pendientes de Pablo

Lista de lo que queda por hacer o decidir por tu parte. Marca con `[x]` lo que vayas cerrando.

## 1. Activar lo que ya está hecho (imprescindible)

- [ ] **Vercel → Settings → Deployment Protection → Vercel Authentication: Disabled.**
      Sin esto, nadie de fuera puede abrir la web ni las invitaciones (`*.vercel.app` pide login de Vercel).
- [ ] **Supabase → SQL Editor:** ejecutar, en este orden, los que falten:
  - [x] `supabase/schema.sql`
  - [x] `supabase/fase1_auth.sql` (+ rol superadmin)
  - [ ] `supabase/fase2_gestion.sql` (archivar + fotos)
  - [ ] `supabase/fase3_web_novios.sql` (solicitudes + área de novios)
  - [ ] `supabase/fase4_musica.sql` (subir canciones)
- [ ] **Vercel → Environment Variables:** `SUPABASE_SERVICE_ROLE_KEY` = clave `service_role` (Supabase → API Keys → pestaña *Legacy*). Marcar **Sensitive**. Después **Redeploy**.
- [ ] **Supabase → Authentication → URL Configuration:**
  - Site URL: `https://invitaciones-bodas-pablivms-projects.vercel.app`
  - Redirect URLs: añadir `https://invitaciones-bodas-pablivms-projects.vercel.app/novios`
- [ ] **Supabase → Authentication → Sign In / Providers:** desactivar *Allow new users to sign up*.

## 2. Cosas por probar

- [ ] Login en `/admin` con tu email.
- [ ] Crear una boda nueva: arriba debe salir "✓ Guardado" sin pulsar nada.
- [ ] Botón de **revisión** (arriba): tocar un aviso y comprobar que lleva al campo.
- [ ] Deshacer / rehacer (↶ ↷ o Ctrl+Z fuera de un campo de texto).
- [ ] Vista previa: abrir una sección del panel y ver que la previa salta a ella.
- [ ] Editor desde el **móvil**: pestañas Contenido · Diseño · Vista previa.
- [ ] **Subir fotos** (portada, sección, varias a la galería).
- [ ] **Subir una canción**, elegir el segundo de inicio y probar la pantalla de bienvenida.
- [ ] **Orden**: en Secciones → *Orden de la invitación*, arrastrar ⠿ (también con el dedo en el móvil).
- [ ] **Encuadrar** una foto (⌖ bajo cada foto y en las miniaturas de la galería) y ver que no se cortan las caras en móvil y ordenador.
- [ ] Archivar, restaurar y duplicar una boda.
- [ ] **Respuestas**: enviar un RSVP de prueba desde la invitación → verlo en Respuestas → descargar Excel.
- [ ] **Área de novios**: en el panel → botón *Novios* → poner tu email → abrir el enlace del correo → ver `/novios`.
- [ ] **Web pública** `/`: ejemplos en Móvil/Ordenador, visor, formulario de contacto → ver la solicitud en *Solicitudes*.
- [ ] Abrir una invitación en el móvil de otra persona (sin sesión iniciada).

## 3. Decisiones pendientes

- [ ] **Nombre de la marca** (ahora "Wedding Builder" en todas partes).
- [ ] **Dominio** (comprarlo y decirme cuál).
- [ ] **Email de contacto** para la web y la política de privacidad.
- [ ] **Datos legales** para `privacidad.html` (nombre/razón social, NIF, dirección).
- [ ] **Otros tipos de evento**: ¿solo celebraciones familiares (boda, bautizo, comunión, cumpleaños, aniversario), también empresa, o todo?
- [ ] **Web pública con varios eventos**: ¿general con la boda como estrella, o una página por tipo?

## 4. Próximas fases (cuando decidas)

1. Dominio + emails propios + enlaces cortos + vista previa en WhatsApp.
2. Lista de invitados con enlace personal, quién falta por responder y recordatorios.
3. Otros tipos de evento.
4. Cobros con Stripe.
5. Estadísticas de visitas y respuestas.
