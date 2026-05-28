# LIMINAL

**El único archivo que realmente importa.**

LIMINAL es una plataforma web de archivo digital creativo con capa social. Un espacio donde diseñadores, artistas y creativos contemporáneos documentan, comparten y construyen referencias visuales colectivamente. No es una red social. No es un portfolio. Es el espacio entre la idea y el archivo.

Proyecto desarrollado como Trabajo de Fin de Grado (TFG) del Ciclo Superior de Desarrollo de Aplicaciones Web (DAW) en CEI Sevilla.

---

## Autor / Contacto

**David Beneito**
- Email: davidbeneitopastor@gmail.com
- Instagram: [@glax.xyz](https://instagram.com/glax.xyz)
- GitHub: [@Dbeneito](https://github.com/Dbeneito)
- Portfolio: [glax.xyz](https://davidbeneitopastor.com)

Centro: CEI Sevilla
Curso: 2º DAW
Año: 2025 / 2026

---

## Stack técnico

**Frontend**
- React 18 + TypeScript
- Vite
- Tailwind CSS + inline styles
- React Router v6
- i18next (ES / EN)
- Axios

**Backend**
- Node.js + Express + TypeScript
- MySQL (TiDB Cloud en producción)
- JWT para autenticación
- bcryptjs para encriptación de contraseñas

**Servicios externos**
- Cloudinary (almacenamiento de imágenes)
- TiDB Cloud (base de datos)

**Deploy**
- Frontend: Vercel
- Backend: Railway
- Base de datos: TiDB Cloud

---

## Estructura del proyecto

Liminal/
├── client/                     # Frontend React
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── i18n/
│   │   ├── pages/
│   │   └── router/
│   └── package.json
└── server/                     # Backend Express
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   └── index.ts
└── package.json

---

## Requisitos previos

- Node.js v18 o superior
- npm v9 o superior
- MySQL 8.0 o superior (o cuenta en TiDB Cloud)
- Cuenta en Cloudinary

---

## Instrucciones de instalación

**1. Clonar el repositorio**

```bash
git clone https://github.com/Dbeneito/Liminal.git
cd Liminal
```

**2. Instalar dependencias del frontend**

```bash
cd client
npm install
```

**3. Instalar dependencias del backend**

```bash
cd ../server
npm install
```

**4. Configurar variables de entorno**

Crea un archivo `server/.env` con el siguiente contenido:

```env
PORT=3000
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=liminal
JWT_SECRET=liminal_secret_2025
```

Crea un archivo `client/.env.development`:

```env
VITE_API_URL=http://localhost:3000
```

Para producción crea `client/.env.production`:

```env
VITE_API_URL=https://tu-backend.railway.app
```

**5. Configurar la base de datos**

Crea la base de datos en MySQL:

```sql
CREATE DATABASE liminal;
USE liminal;
```

Ejecuta el script SQL incluido en `server/database/schema.sql` para crear las tablas, o usa las tablas: `users`, `projects`, `project_images`, `categories`, `project_categories`, `comments`, `favorites`, `follows`, `likes`, `referents`.

---

## Instrucciones para compilar

**Compilar el frontend para producción**

```bash
cd client
npm run build
```

Los archivos compilados se generan en `client/dist/`.

**Compilar el backend para producción**

```bash
cd server
npm run build
```

Los archivos compilados se generan en `server/dist/`.

---

## Instrucciones para ejecutar

**Modo desarrollo local**

Primero arranca MySQL (si lo tienes instalado localmente):

```bash
sudo /usr/local/mysql/support-files/mysql.server start
```

En una terminal, arranca el backend:

```bash
cd server
npm run dev
```

El servidor estará disponible en `http://localhost:3000`.

En otra terminal, arranca el frontend:

```bash
cd client
npm run dev
```

El cliente estará disponible en `http://localhost:5173`.

**Modo producción**

```bash
# Backend
cd server
npm run build
npm run start

# Frontend
cd client
npm run build
npm run preview
```

---

## Cuenta de demostración

Para probar la aplicación puedes registrarte con cualquier email o usar la cuenta de prueba:

Email: demo@liminal.app
Contraseña: demo1234

Para acceder al panel de administración, modifica el rol de tu usuario en la base de datos:

```sql
UPDATE users SET role = 'admin' WHERE username = 'tu_username';
```

---

## Funcionalidades principales

- Registro y autenticación de usuarios con JWT
- Sistema de roles (user / admin)
- Publicación de proyectos con imágenes (Cloudinary)
- Sistema de NoLikes (favoritos)
- Comentarios en proyectos
- Sistema de seguidores / siguiendo
- Filtrado por categorías y disciplinas
- Página de referentes históricos del diseño
- Panel de administración completo
- Internacionalización (ES / EN)
- Diseño responsive (móvil, tablet, escritorio)
- Estética inspirada en Mac OS clásico Snow Leopard

---

## Problemas conocidos

- **Cloudinary**: el upload preset `ml_default` debe estar configurado como **Unsigned** en Cloudinary. Si está como Signed, la subida de imágenes fallará con error 400.
- **CORS en producción**: si despliegas en un dominio diferente al configurado, debes actualizar la lista de orígenes permitidos en `server/src/index.ts`.
- **Variable VITE_API_URL**: no debe terminar con barra `/`, ya que generaría URLs con doble barra (`//api/...`) que algunos navegadores rechazan.
- **TiDB Cloud**: las conexiones requieren SSL. Asegúrate de tener el certificado correctamente configurado en la conexión MySQL del backend.
- **Sesiones expiradas**: el token JWT expira a los 7 días. El usuario debe volver a iniciar sesión.

---

## Rastreador de errores

Los errores y mejoras se gestionan a través de GitHub Issues:

[https://github.com/Dbeneito/Liminal/issues](https://github.com/Dbeneito/Liminal/issues)

Si encuentras un bug puedes abrir un issue describiendo:
- Qué estabas intentando hacer
- Qué ocurrió en su lugar
- Pasos para reproducirlo
- Capturas de pantalla si es posible

---

## Pruebas

El proyecto no incluye un conjunto de pruebas automatizadas en esta versión. Las pruebas se han realizado de forma manual durante el desarrollo, verificando:

- Registro y login de usuarios
- Publicación de proyectos con imágenes
- Sistema de NoLikes y comentarios
- Sistema de seguidores
- Panel de administración (CRUD de usuarios, proyectos, referentes y categorías)
- Responsive en móvil, tablet y escritorio
- Funcionamiento de la subida a Cloudinary

Para futuras versiones se planea añadir tests con Jest (backend) y Vitest (frontend).

---

## Licencia

Este proyecto es de uso académico, desarrollado como TFG. Todos los derechos reservados © 2025 — LIMINAL™.

El código está disponible para consulta y aprendizaje. Para uso comercial o redistribución, contactar con el autor.

---

## Agradecimientos

- A los profesores de CEI Sevilla por la guía durante el proyecto
- A la comunidad de diseño y creativos contemporáneos que inspiraron LIMINAL
- A Virgil Abloh, Dieter Rams, El Lissitzky, Iris van Herpen, Paul Rand, Bodys Isek Kingelez, April Greiman y Neville Brody — los referentes que abren el archivo

---

**LIMINAL™ — The space between the idea and the archive.**
Made with care in Valencia, Spain.