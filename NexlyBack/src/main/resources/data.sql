-- ============================================================================
--  Nexly · Datos de prueba (seed)
-- ----------------------------------------------------------------------------
--  Se carga automáticamente al arrancar el backend gracias a:
--      spring.sql.init.mode=always
--      spring.jpa.defer-datasource-initialization=true   (corre DESPUÉS de
--      que Hibernate cree el esquema con ddl-auto=update)
--
--  Es IDEMPOTENTE: todas las inserciones usan ON DUPLICATE KEY UPDATE, por lo
--  que se puede reiniciar el servidor sin que falle por claves duplicadas.
--
--  Credenciales de acceso de TODOS los usuarios de prueba:
--      contraseña: Nexly1234
--      (hash BCrypt común, compatible con BCryptPasswordEncoder)
--
--  Usuario administrador:  email = admin@nexly.com   /  Nexly1234
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Categorías de comunidad
-- ----------------------------------------------------------------------------
INSERT INTO CategoriaComunidad (id, nombre) VALUES
    (1, 'Tecnología'),
    (2, 'Videojuegos'),
    (3, 'Arte y Diseño'),
    (4, 'Música'),
    (5, 'Deportes'),
    (6, 'Ciencia')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- ----------------------------------------------------------------------------
-- 2. Usuarios  (contraseña en claro: Nexly1234)
-- ----------------------------------------------------------------------------
INSERT INTO Usuario
    (id, nombre_completo, nombre_usuario, email, telefono, contrasena_hash,
     foto_perfil, foto_portada, biografia, enlace_web, ubicacion, fecha_nacimiento,
     rol, perfil_privado, fecha_registro, activo, onboarding_completado, email_verificado)
VALUES
    (1, 'Nexly Admin', 'admin', 'admin@nexly.com', NULL,
     '$2b$10$5mDCMxUD/m.BZk9E/VSwSO/eiuNnBTFkmoPQvuuAQBeTX23UWeTZC',
     'https://i.pravatar.cc/150?img=68', NULL,
     'Cuenta de administración de Nexly.', NULL, 'A Coruña', '1995-01-10',
     'ADMIN', 0, '2026-03-01 09:00:00', 1, 1, 1),

    (2, 'Lucía Fernández', 'luciafdez', 'lucia@nexly.com', '600111222',
     '$2b$10$5mDCMxUD/m.BZk9E/VSwSO/eiuNnBTFkmoPQvuuAQBeTX23UWeTZC',
     'https://i.pravatar.cc/150?img=5', 'https://picsum.photos/seed/cover2/800/200',
     'Diseñadora UX/UI. Me encanta el café y los gatos.', 'https://lucia.design', 'Madrid', '1998-04-22',
     'USER', 0, '2026-03-05 11:30:00', 1, 1, 1),

    (3, 'Mateo Castro', 'mateoc', 'mateo@nexly.com', '600333444',
     '$2b$10$5mDCMxUD/m.BZk9E/VSwSO/eiuNnBTFkmoPQvuuAQBeTX23UWeTZC',
     'https://i.pravatar.cc/150?img=12', 'https://picsum.photos/seed/cover3/800/200',
     'Desarrollador full-stack. Spring Boot + React.', NULL, 'A Coruña', '1999-09-15',
     'USER', 0, '2026-03-06 18:45:00', 1, 1, 1),

    (4, 'Sofía Romero', 'sofiart', 'sofia@nexly.com', NULL,
     '$2b$10$5mDCMxUD/m.BZk9E/VSwSO/eiuNnBTFkmoPQvuuAQBeTX23UWeTZC',
     'https://i.pravatar.cc/150?img=47', 'https://picsum.photos/seed/cover4/800/200',
     'Ilustradora digital. Comisiones abiertas.', 'https://sofiart.com', 'Valencia', '2000-12-03',
     'USER', 0, '2026-03-10 10:15:00', 1, 1, 1),

    (5, 'Diego Navarro', 'dnavarro', 'diego@nexly.com', '600555666',
     '$2b$10$5mDCMxUD/m.BZk9E/VSwSO/eiuNnBTFkmoPQvuuAQBeTX23UWeTZC',
     'https://i.pravatar.cc/150?img=33', NULL,
     'Gamer de corazón. Estrategia y RPG.', NULL, 'Sevilla', '1997-07-19',
     'USER', 0, '2026-03-14 20:00:00', 1, 1, 1),

    (6, 'Valentina Ruiz', 'valeruiz', 'valentina@nexly.com', NULL,
     '$2b$10$5mDCMxUD/m.BZk9E/VSwSO/eiuNnBTFkmoPQvuuAQBeTX23UWeTZC',
     'https://i.pravatar.cc/150?img=20', 'https://picsum.photos/seed/cover6/800/200',
     'Melómana. Vinilos, conciertos y guitarra.', NULL, 'Bilbao', '1996-02-28',
     'USER', 0, '2026-03-18 13:20:00', 1, 1, 1),

    (7, 'Hugo Ortega', 'hugodev', 'hugo@nexly.com', '600777888',
     '$2b$10$5mDCMxUD/m.BZk9E/VSwSO/eiuNnBTFkmoPQvuuAQBeTX23UWeTZC',
     'https://i.pravatar.cc/150?img=51', NULL,
     'Ingeniero de software. Open source enthusiast.', 'https://github.com/hugodev', 'Barcelona', '1994-11-08',
     'USER', 0, '2026-03-22 08:50:00', 1, 1, 1),

    (8, 'Martina Gil', 'martina_g', 'martina@nexly.com', NULL,
     '$2b$10$5mDCMxUD/m.BZk9E/VSwSO/eiuNnBTFkmoPQvuuAQBeTX23UWeTZC',
     'https://i.pravatar.cc/150?img=44', NULL,
     'Fotógrafa de naturaleza. Cuenta privada.', NULL, 'Granada', '2001-06-30',
     'USER', 1, '2026-04-02 16:10:00', 1, 1, 1),

    (9, 'Pablo Sánchez', 'pablosan', 'pablo@nexly.com', '600999000',
     '$2b$10$5mDCMxUD/m.BZk9E/VSwSO/eiuNnBTFkmoPQvuuAQBeTX23UWeTZC',
     'https://i.pravatar.cc/150?img=15', 'https://picsum.photos/seed/cover9/800/200',
     'Físico y divulgador científico.', NULL, 'Salamanca', '1993-03-12',
     'USER', 0, '2026-04-08 12:00:00', 1, 1, 1),

    (10, 'Carla Méndez', 'carlam', 'carla@nexly.com', NULL,
     '$2b$10$5mDCMxUD/m.BZk9E/VSwSO/eiuNnBTFkmoPQvuuAQBeTX23UWeTZC',
     'https://i.pravatar.cc/150?img=26', NULL,
     'Community manager. Siempre conectando personas.', NULL, 'Málaga', '1999-10-25',
     'USER', 0, '2026-04-15 19:30:00', 1, 1, 1)
ON DUPLICATE KEY UPDATE email_verificado = VALUES(email_verificado);

-- ----------------------------------------------------------------------------
-- 3. Seguimientos  (estado ACEPTADA)
-- ----------------------------------------------------------------------------
INSERT INTO Seguimiento (seguidor_id, seguido_id, estado, silenciado, fecha) VALUES
    (3, 2, 'ACEPTADA', 0, '2026-04-01 10:00:00'),
    (3, 4, 'ACEPTADA', 0, '2026-04-01 10:05:00'),
    (3, 7, 'ACEPTADA', 0, '2026-04-02 09:00:00'),
    (2, 3, 'ACEPTADA', 0, '2026-04-02 11:00:00'),
    (2, 4, 'ACEPTADA', 0, '2026-04-03 14:00:00'),
    (4, 2, 'ACEPTADA', 0, '2026-04-03 15:00:00'),
    (5, 3, 'ACEPTADA', 0, '2026-04-04 18:00:00'),
    (5, 7, 'ACEPTADA', 0, '2026-04-05 20:00:00'),
    (6, 4, 'ACEPTADA', 0, '2026-04-06 12:00:00'),
    (7, 3, 'ACEPTADA', 0, '2026-04-07 08:00:00'),
    (9, 7, 'ACEPTADA', 0, '2026-04-08 13:00:00'),
    (10, 2, 'ACEPTADA', 0, '2026-04-09 17:00:00'),
    (10, 3, 'ACEPTADA', 0, '2026-04-09 17:05:00')
ON DUPLICATE KEY UPDATE fecha = VALUES(fecha);

-- ----------------------------------------------------------------------------
-- 4. Comunidades
-- ----------------------------------------------------------------------------
INSERT INTO Comunidad
    (id, creador_id, categoria_id, nombre, descripcion, reglas, foto, es_publica, fecha_creacion)
VALUES
    (1, 7, 1, 'Desarrollo Web',
     'Comunidad sobre desarrollo web: frontend, backend, frameworks y buenas prácticas.',
     '1. Respeto entre miembros. 2. Nada de spam. 3. Comparte conocimiento.',
     'https://picsum.photos/seed/comu1/400/400', 1, '2026-04-10 10:00:00'),

    (2, 5, 2, 'Gamers Unidos',
     'El punto de encuentro para hablar de videojuegos, estrenos y partidas.',
     '1. No spoilers sin aviso. 2. Sé constructivo.',
     'https://picsum.photos/seed/comu2/400/400', 1, '2026-04-11 12:30:00'),

    (3, 4, 3, 'Rincón del Arte',
     'Espacio para compartir ilustraciones, pintura y diseño.',
     '1. Solo obra propia o citada. 2. Feedback respetuoso.',
     'https://picsum.photos/seed/comu3/400/400', 1, '2026-04-12 09:15:00'),

    (4, 6, 4, 'Melómanos',
     'Para los que viven la música: recomendaciones, conciertos y debates.',
     '1. Todos los géneros son bienvenidos.',
     'https://picsum.photos/seed/comu4/400/400', 1, '2026-04-13 18:00:00'),

    (5, 9, 6, 'Ciencia Hoy',
     'Divulgación científica y últimas noticias de investigación.',
     '1. Cita tus fuentes. 2. Rigor ante todo.',
     'https://picsum.photos/seed/comu5/400/400', 0, '2026-04-14 11:45:00')
ON DUPLICATE KEY UPDATE id = id;

-- ----------------------------------------------------------------------------
-- 5. Miembros de comunidad  (el creador es ADMIN; estado ACEPTADO)
--    Se incluye una solicitud PENDIENTE para poder demostrar la moderación.
-- ----------------------------------------------------------------------------
INSERT INTO MiembroComunidad
    (usuario_id, comunidad_id, rol, estado, baneado, silenciada, fecha_union)
VALUES
    (7, 1, 'ADMIN',   'ACEPTADO', 0, 0, '2026-04-10 10:00:00'),
    (3, 1, 'MOD',     'ACEPTADO', 0, 0, '2026-04-10 11:00:00'),
    (2, 1, 'MIEMBRO', 'ACEPTADO', 0, 0, '2026-04-11 09:00:00'),
    (5, 1, 'MIEMBRO', 'ACEPTADO', 0, 0, '2026-04-12 14:00:00'),
    (10, 1, 'MIEMBRO', 'PENDIENTE', 0, 0, '2026-05-20 10:00:00'),

    (5, 2, 'ADMIN',   'ACEPTADO', 0, 0, '2026-04-11 12:30:00'),
    (3, 2, 'MIEMBRO', 'ACEPTADO', 0, 0, '2026-04-13 16:00:00'),
    (7, 2, 'MIEMBRO', 'ACEPTADO', 0, 0, '2026-04-14 17:00:00'),

    (4, 3, 'ADMIN',   'ACEPTADO', 0, 0, '2026-04-12 09:15:00'),
    (2, 3, 'MOD',     'ACEPTADO', 0, 0, '2026-04-12 10:00:00'),
    (6, 3, 'MIEMBRO', 'ACEPTADO', 0, 0, '2026-04-15 11:00:00'),

    (6, 4, 'ADMIN',   'ACEPTADO', 0, 0, '2026-04-13 18:00:00'),
    (2, 4, 'MIEMBRO', 'ACEPTADO', 0, 0, '2026-04-16 19:00:00'),

    (9, 5, 'ADMIN',   'ACEPTADO', 0, 0, '2026-04-14 11:45:00'),
    (7, 5, 'MIEMBRO', 'ACEPTADO', 0, 0, '2026-04-17 12:00:00')
ON DUPLICATE KEY UPDATE fecha_union = VALUES(fecha_union);

-- ----------------------------------------------------------------------------
-- 6. Publicaciones
--    comunidad_id NULL = publicación de feed; con valor = publicada en comunidad
--    OJO: la columna del tipo de post es "tipoPost" (sin guion bajo)
-- ----------------------------------------------------------------------------
INSERT INTO Publicacion
    (id, usuario_id, comunidad_id, publicacion_ref_id, contenido, visibilidad,
     fecha_creacion, fecha_edicion, fijada, comentarios_activos, tipoPost)
VALUES
    (1, 3, NULL, NULL, '¡Hola Nexly! Estrenando perfil. Encantado de estar por aquí 👋',
     'PUBLICA', '2026-05-01 09:00:00', NULL, 0, 1, 'NORMAL'),

    (2, 2, NULL, NULL, '¿Qué herramienta usáis para prototipar interfaces? Estoy dudando entre Figma y Penpot.',
     'PUBLICA', '2026-05-02 10:30:00', NULL, 0, 1, 'PREGUNTA'),

    (3, 4, NULL, NULL, 'Terminé esta ilustración este finde. ¿Qué os parece? 🎨',
     'PUBLICA', '2026-05-03 17:45:00', NULL, 0, 1, 'NORMAL'),

    (4, 7, 1, NULL, 'Nueva versión de Spring Boot disponible. Mejoras importantes en rendimiento y observabilidad.',
     'PUBLICA', '2026-05-04 08:15:00', NULL, 1, 1, 'NOTICIA'),

    (5, 5, 2, NULL, '¿RPG por turnos o acción en tiempo real? Abro debate. Yo lo tengo claro 😏',
     'PUBLICA', '2026-05-05 21:00:00', NULL, 0, 1, 'DEBATE'),

    (6, 6, 4, NULL, 'Recomendación de la semana: un disco de jazz que me tiene enganchada.',
     'PUBLICA', '2026-05-06 19:30:00', NULL, 0, 1, 'NORMAL'),

    (7, 9, 5, NULL, 'Publicado un nuevo estudio sobre computación cuántica. Resultados prometedores.',
     'PUBLICA', '2026-05-07 12:00:00', NULL, 0, 1, 'NOTICIA'),

    (8, 4, 3, NULL, 'Comparto el proceso de esta pieza, del boceto al color final.',
     'PUBLICA', '2026-05-08 16:20:00', NULL, 0, 1, 'NORMAL'),

    (9, 8, NULL, NULL, 'Amanecer en la sierra de esta mañana. La luz era increíble.',
     'PUBLICA', '2026-05-09 07:10:00', NULL, 0, 1, 'NORMAL'),

    (10, 10, NULL, NULL, '¡Hemos superado los 1.000 usuarios en Nexly! Gracias a toda la comunidad 🎉',
     'PUBLICA', '2026-05-10 11:00:00', NULL, 0, 1, 'ANUNCIO'),

    (11, 3, NULL, NULL, 'Mi setup de trabajo actual. Productividad al máximo 💻',
     'PUBLICA', '2026-05-11 13:40:00', NULL, 0, 1, 'NORMAL'),

    (12, 7, 1, NULL, '¿Preferís monorepo o múltiples repositorios para microservicios?',
     'PUBLICA', '2026-05-12 09:50:00', NULL, 0, 1, 'PREGUNTA'),

    (13, 5, NULL, NULL, 'Capturas de mi última partida. Qué nivel de detalle gráfico.',
     'PUBLICA', '2026-05-13 22:15:00', NULL, 0, 1, 'NORMAL'),

    (14, 2, NULL, NULL, '¿El diseño debería priorizar siempre la accesibilidad sobre la estética? Yo creo que no son incompatibles.',
     'PUBLICA', '2026-05-14 10:00:00', NULL, 0, 1, 'DEBATE'),

    (15, 6, NULL, NULL, 'Probando la guitarra nueva. El sonido es otra cosa 🎸',
     'PUBLICA', '2026-05-15 18:25:00', NULL, 0, 1, 'NORMAL'),

    (16, 9, NULL, 7, 'Os dejo por aquí también el estudio de computación cuántica que comenté en la comunidad. Imprescindible.',
     'PUBLICA', '2026-05-16 12:30:00', NULL, 0, 1, 'NORMAL')
ON DUPLICATE KEY UPDATE id = id;

-- ----------------------------------------------------------------------------
-- 7. Imágenes de publicaciones
-- ----------------------------------------------------------------------------
INSERT INTO PublicacionImagen (id, publicacion_id, url, tipo, orden) VALUES
    (1, 3,  'https://picsum.photos/seed/post3/800/600',  'IMAGEN', 0),
    (2, 8,  'https://picsum.photos/seed/post8a/800/600', 'IMAGEN', 0),
    (3, 8,  'https://picsum.photos/seed/post8b/800/600', 'IMAGEN', 1),
    (4, 11, 'https://picsum.photos/seed/post11/800/600', 'IMAGEN', 0),
    (5, 13, 'https://picsum.photos/seed/post13/800/600', 'IMAGEN', 0),
    (6, 9,  'https://picsum.photos/seed/post9/800/600',  'IMAGEN', 0)
ON DUPLICATE KEY UPDATE id = id;

-- ----------------------------------------------------------------------------
-- 8. Comentarios  (los que tienen comentario_padre_id son respuestas anidadas)
-- ----------------------------------------------------------------------------
INSERT INTO Comentario
    (id, publicacion_id, usuario_id, comentario_padre_id, contenido, fecha_creacion, fecha_edicion)
VALUES
    (1, 1, 2, NULL, '¡Bienvenido, Mateo! 🎉', '2026-05-01 09:30:00', NULL),
    (2, 1, 4, NULL, 'Un placer tenerte por aquí.', '2026-05-01 10:00:00', NULL),
    (3, 1, 3, 1,    '¡Gracias, Lucía! Encantado.', '2026-05-01 10:15:00', NULL),
    (4, 2, 5, NULL, 'Figma para trabajo en equipo, sin duda.', '2026-05-02 11:00:00', NULL),
    (5, 4, 3, NULL, 'Justo lo que esperaba. A actualizar el proyecto.', '2026-05-04 09:00:00', NULL),
    (6, 4, 2, 5,    'Cuidado con los breaking changes en la config.', '2026-05-04 09:20:00', NULL),
    (7, 5, 7, NULL, 'Por turnos, la estrategia gana siempre.', '2026-05-05 21:30:00', NULL),
    (8, 7, 6, NULL, 'Fascinante, ¿tienes el enlace al paper?', '2026-05-07 12:30:00', NULL),
    (9, 8, 2, NULL, 'El proceso es tan interesante como el resultado.', '2026-05-08 17:00:00', NULL),
    (10, 10, 9, NULL, '¡Enhorabuena al equipo! 🚀', '2026-05-10 11:30:00', NULL),
    (11, 11, 4, NULL, 'Ese teclado tiene una pinta estupenda.', '2026-05-11 14:00:00', NULL),
    (12, 11, 3, 11,   '¡Lo es! Mecánico, no lo cambio por nada.', '2026-05-11 14:20:00', NULL),
    (13, 14, 10, NULL, 'Totalmente de acuerdo, se puede tener todo.', '2026-05-14 10:30:00', NULL),
    (14, 5, 5, 7,     'Discrepo, la acción tiene su punto 😄', '2026-05-05 21:45:00', NULL)
ON DUPLICATE KEY UPDATE id = id;

-- ----------------------------------------------------------------------------
-- 9. Reacciones a publicaciones  (clave compuesta usuario_id + publicacion_id)
-- ----------------------------------------------------------------------------
INSERT INTO Reaccion (usuario_id, publicacion_id, tipo, fecha) VALUES
    (2, 1, 'ME_GUSTA',     '2026-05-01 09:25:00'),
    (4, 1, 'ME_ENCANTA',   '2026-05-01 09:40:00'),
    (7, 1, 'ME_GUSTA',     '2026-05-01 10:05:00'),
    (3, 2, 'ME_GUSTA',     '2026-05-02 10:45:00'),
    (5, 2, 'SORPRENDIDO',  '2026-05-02 11:05:00'),
    (2, 3, 'ME_ENCANTA',   '2026-05-03 18:00:00'),
    (3, 3, 'ME_ENCANTA',   '2026-05-03 18:10:00'),
    (6, 3, 'ME_GUSTA',     '2026-05-03 18:30:00'),
    (3, 4, 'ME_GUSTA',     '2026-05-04 08:40:00'),
    (2, 4, 'ME_GUSTA',     '2026-05-04 09:10:00'),
    (5, 4, 'ME_ENCANTA',   '2026-05-04 09:30:00'),
    (7, 5, 'DIVERTIDO',    '2026-05-05 21:20:00'),
    (3, 5, 'ME_GUSTA',     '2026-05-05 21:50:00'),
    (2, 6, 'ME_ENCANTA',   '2026-05-06 20:00:00'),
    (6, 7, 'SORPRENDIDO',  '2026-05-07 12:20:00'),
    (7, 7, 'ME_GUSTA',     '2026-05-07 12:40:00'),
    (2, 8, 'ME_ENCANTA',   '2026-05-08 16:50:00'),
    (3, 8, 'ME_GUSTA',     '2026-05-08 17:10:00'),
    (9, 10, 'ME_ENCANTA',  '2026-05-10 11:20:00'),
    (2, 10, 'ME_GUSTA',    '2026-05-10 11:40:00'),
    (4, 11, 'ME_GUSTA',    '2026-05-11 13:55:00'),
    (5, 13, 'ME_ENCANTA',  '2026-05-13 22:30:00'),
    (10, 14, 'ME_GUSTA',   '2026-05-14 10:25:00'),
    (3, 15, 'ME_GUSTA',    '2026-05-15 18:40:00'),
    (7, 16, 'ME_GUSTA',    '2026-05-16 12:45:00')
ON DUPLICATE KEY UPDATE fecha = VALUES(fecha);
