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
  - [ ] `supabase/fase5_planes.sql` (plan Completa en las solicitudes)
- [ ] **Vercel → Environment Variables:** `SUPABASE_SERVICE_ROLE_KEY` = clave `service_role` (Supabase → API Keys → pestaña *Legacy*). Marcar **Sensitive**. Después **Redeploy**.
- [ ] **Supabase → Authentication → URL Configuration:**
  - Site URL: `https://invitaciones-bodas-pablivms-projects.vercel.app`
  - Redirect URLs: añadir `https://invitaciones-bodas-pablivms-projects.vercel.app/novios`
- [ ] **Supabase → Authentication → Sign In / Providers:** desactivar *Allow new users to sign up*.

## 1b. Conectar el dominio yourdate.es

- [ ] **Vercel → proyecto → Settings → Domains → Add:** `yourdate.es` y `www.yourdate.es` (que `www` redirija a `yourdate.es`).
- [ ] **En la web donde compraste el dominio (DNS):** poner los registros que te muestre Vercel (normalmente un `A` a `76.76.21.21` para `yourdate.es` y un `CNAME` `www` → `cname.vercel-dns.com`). Tarda de minutos a unas horas.
- [ ] **Supabase → Authentication → URL Configuration:**
  - Site URL: `https://yourdate.es`
  - Redirect URLs: añadir `https://yourdate.es/novios`

## 2. Cosas por probar

- [ ] Login en `/admin` con tu email.
- [ ] Crear una boda nueva: arriba debe salir "✓ Guardado" sin pulsar nada.
- [ ] Botón de **revisión** (arriba): tocar un aviso y comprobar que lleva al campo.
- [ ] Deshacer / rehacer (↶ ↷ o Ctrl+Z fuera de un campo de texto).
- [ ] Vista previa: abrir una sección del panel y ver que la previa salta a ella.
- [ ] Editor desde el **móvil**: pestañas Contenido · Diseño · Vista previa.
- [ ] **Subir fotos** (portada, sección, varias a la galería).
- [ ] **Save the date**: en el editor → bloque *Save the date* → *Ver save the date* y *Copiar enlace*.
- [ ] **Subir una canción**, elegir el segundo de inicio y probar la pantalla de bienvenida.
- [ ] **Orden**: en Secciones → *Orden de la invitación*, arrastrar ⠿ (también con el dedo en el móvil).
- [ ] **Encuadrar** una foto (⌖ bajo cada foto y en las miniaturas de la galería) y ver que no se cortan las caras en móvil y ordenador.
- [ ] Archivar, restaurar y duplicar una boda.
- [ ] **Respuestas**: enviar un RSVP de prueba desde la invitación → verlo en Respuestas → descargar Excel.
- [ ] **Área de novios**: en el panel → botón *Novios* → poner tu email → abrir el enlace del correo → ver `/novios`.
- [ ] **Web pública** `/`: ejemplos en Móvil/Ordenador, visor, formulario de contacto → ver la solicitud en *Solicitudes*.
- [ ] Abrir una invitación en el móvil de otra persona (sin sesión iniciada).

## 3. Decisiones pendientes

- [x] **Nombre de la marca**: yourdate · "Tu fecha. Tu historia."
- [x] **Dominio**: yourdate.es (falta conectarlo, ver abajo).
- [ ] **Email de contacto** para la web y la política de privacidad.
- [ ] **Datos legales** para `privacidad.html` (nombre/razón social, NIF, dirección).
- [x] **Otros tipos de evento**: el editor ya tiene "Tipo de evento" (boda, bautizo, comunión, cumpleaños, aniversario, otra).
- [ ] **Precios**: 29 / 49 / 69 € — confirmar si llevan IVA incluido y si "Cambios hasta el día del evento" va en Premium.
- [ ] **Web pública con varios eventos**: ¿general con la boda como estrella, o una página por tipo?

## 4. Próximas fases (cuando decidas)

1. Dominio + emails propios + enlaces cortos + vista previa en WhatsApp.
2. Lista de invitados con enlace personal, quién falta por responder y recordatorios.
3. Otros tipos de evento.
4. Cobros con Stripe.
5. Estadísticas de visitas y respuestas.
