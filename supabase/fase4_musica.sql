-- Fase 4: permitir subir canciones al almacenamiento de cada boda
-- Ejecutar en Supabase → SQL Editor (después de fase2_gestion.sql). Se puede ejecutar varias veces.

update storage.buckets
set file_size_limit = 20971520, -- 20 MB
    allowed_mime_types = array[
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/x-m4a', 'audio/aac', 'audio/ogg', 'audio/wav', 'audio/x-wav'
    ]
where id = 'bodas';
