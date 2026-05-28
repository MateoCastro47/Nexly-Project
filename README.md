# Nexly

**Nexly** es una red social full-stack: publicaciones con reacciones y comentarios anidados,
comunidades con roles y moderación, mensajería y notificaciones en tiempo real, búsqueda,
autenticación con email/contraseña y Google, verificación de cuenta por correo y un panel
de administración.

Proyecto de Fin de Ciclo del CFGS de **Desarrollo de Aplicaciones Web (DAW)**.

---

## ✨ Características

- **Autenticación**: registro con verificación de email, inicio de sesión con JWT en cookie *HttpOnly* e inicio de sesión con **Google (OAuth2)**.
- **Publicaciones**: feed paginado, tipos de post (normal, pregunta, noticia, debate, anuncio), imágenes, citas, fijar y reacciones.
- **Comentarios**: anidados (respuestas) y con reacciones propias.
- **Perfiles**: edición de perfil, seguir/dejar de seguir, bloquear, perfiles públicos/privados.
- **Comunidades**: creación, categorías, roles (admin/moderador/miembro), solicitudes y baneos.
- **Tiempo real (WebSocket STOMP)**: mensajería y notificaciones instantáneas.
- **Notificaciones push (PWA)** mediante Web Push (VAPID).
- **Subida de imágenes** a Cloudinary.
- **Panel de administración** (rol `ADMIN`): estadísticas, gestión de usuarios, moderación de publicaciones y comunidades.

---

## 🛠️ Stack tecnológico

| Capa | Tecnologías |
|------|-------------|
| **Backend** | Java 21, Spring Boot 3.4 (Web, Data JPA, Security, WebSocket, Mail, Validation), MySQL 8, JWT (jjwt), MapStruct, Lombok, Cloudinary |
| **Frontend** | React 19, TypeScript, Vite, React Router 7, Zustand, Tailwind CSS 4, STOMP/SockJS |
| **Infraestructura** | Docker (MySQL y Mailpit), Maven Wrapper |

---

## 📋 Requisitos previos

- **Java 21** (JDK)
- **Node.js 20+** y npm
- **Docker** y Docker Compose (para MySQL y el servidor de correo de desarrollo)

> No necesitas instalar Maven: el proyecto incluye el *wrapper* (`mvnw`).

---

## 🚀 Puesta en marcha (desarrollo)

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd Nexly-Project
```

### 2. Levantar la base de datos y el correo (Docker)
Arranca MySQL y **Mailpit** (servidor SMTP de pruebas que captura los correos de verificación):
```bash
docker compose up -d mysql mailpit
```
- MySQL queda en `localhost:3306` (base de datos `apiNexly`).
- La bandeja web de Mailpit queda en **http://localhost:8025**.

### 3. Configurar y arrancar el backend
```bash
cd NexlyBack
cp .env.example .env        # en Windows (PowerShell): copy .env.example .env
# edita .env y rellena DB_PASSWORD, JWT_SECRET, etc.
./mvnw spring-boot:run      # en Windows: .\mvnw.cmd spring-boot:run
```
El backend arranca en `http://localhost:8080`. Al iniciarse, Hibernate crea el esquema
y se cargan automáticamente los **datos de prueba** (`src/main/resources/data.sql`).

### 4. Arrancar el frontend
```bash
cd NexlyFront
npm install
npm run dev
```
La aplicación queda en **http://localhost:5173** (Vite hace *proxy* de `/api`, `/oauth2` y `/ws` al backend).

---

## 👤 Datos de prueba

Al levantar el backend con una base de datos vacía se crean usuarios, comunidades y
publicaciones de ejemplo. **La contraseña de todos los usuarios de prueba es `Nexly1234`.**

| Email | Rol | Descripción |
|-------|-----|-------------|
| `admin@nexly.com` | **ADMIN** | Acceso al panel de administración (`/admin`) |
| `lucia@nexly.com` | USER | Usuaria de ejemplo |
| `mateo@nexly.com` | USER | Usuario de ejemplo |
| *(y 7 usuarios más)* | USER | — |

> Los usuarios del seed ya están verificados. Al **registrar uno nuevo**, recibirás el
> correo de verificación en la bandeja de Mailpit (**http://localhost:8025**); hasta pulsar
> el enlace no se puede iniciar sesión.

---

## 🔧 Variables de entorno (`NexlyBack/.env`)

| Variable | Descripción |
|----------|-------------|
| `DB_URL` | URL JDBC de MySQL (p. ej. `jdbc:mysql://localhost:3306/apiNexly?createDatabaseIfNotExist=true`) |
| `DB_USERNAME` / `DB_PASSWORD` | Credenciales de MySQL |
| `JWT_SECRET` | Secreto Base64 ≥ 32 bytes (`openssl rand -base64 32`) |
| `JWT_EXPIRATION_MS` | Caducidad del token (opcional, por defecto 24 h) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Credenciales OAuth2 de Google |
| `CLOUDINARY_URL` | `cloudinary://<api_key>:<api_secret>@<cloud_name>` |
| `MAIL_HOST` / `MAIL_PORT` / `MAIL_FROM` | SMTP (por defecto Mailpit: `localhost:1025`) |
| `FRONTEND_URL` | URL del frontend (por defecto `http://localhost:5173`) |
| `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` / `VAPID_SUBJECT` | Web Push (opcional; vacías ⇒ push deshabilitado) |

> Consulta `NexlyBack/.env.example` para la plantilla completa. **Nunca subas el `.env` real al repositorio.**

---

## 📁 Estructura del proyecto

```
Nexly-Project/
├── NexlyBack/            # API REST + WebSocket (Spring Boot)
│   ├── src/main/java/com/edu/mcs/NexlyBack/
│   │   ├── Controllers/  # Endpoints REST
│   │   ├── Services/     # Lógica de negocio
│   │   ├── Repositories/ # Acceso a datos (Spring Data JPA)
│   │   ├── models/       # Entidades JPA
│   │   ├── DTOs/         # Objetos de transferencia
│   │   ├── Mappers/      # MapStruct
│   │   └── Security/      # JWT, OAuth2, configuración de seguridad
│   └── src/main/resources/
│       ├── application.properties
│       └── data.sql      # Datos de prueba
├── NexlyFront/           # SPA (React + TypeScript + Vite)
│   └── src/
│       ├── pages/        # Páginas por ruta (Auth, Feed, Profile, Admin, ...)
│       ├── components/   # Componentes reutilizables
│       ├── store/        # Estado global (Zustand)
│       └── api/          # Cliente HTTP por dominio
├── docs/                 # Documentación técnica
└── docker-compose.yml    # MySQL + Mailpit + backend
```

---

## 📜 Scripts útiles

**Backend** (`NexlyBack/`)
```bash
./mvnw spring-boot:run     # arrancar en desarrollo
./mvnw clean package       # empaquetar (genera el .jar en target/)
```

**Frontend** (`NexlyFront/`)
```bash
npm run dev       # servidor de desarrollo
npm run build     # build de producción (tsc + vite)
npm run preview   # previsualizar el build
npm run lint      # ESLint
```

---

## 🐳 Despliegue con Docker (opcional)

El `docker-compose.yml` incluye también el servicio `backend` (construido con
`NexlyBack/Dockerfile`). Con un `NexlyBack/.env` configurado:

```bash
docker compose up -d --build
```

Esto levanta MySQL, Mailpit y la API. El frontend se despliega aparte como sitio estático
(`npm run build` → servir la carpeta `dist/`).

---

## 👨‍💻 Autor

Proyecto desarrollado por **Mateo Castro** como Proyecto de Fin de Ciclo (DAW).
