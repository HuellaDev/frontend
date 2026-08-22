# Huella — Frontend

Huella es una plataforma web que ayuda a las personas y a los animales a encontrarse. Los usuarios pueden crear reportes de mascotas perdidas y reportes de mascotas avistadas, además de explorar organizaciones como veterinarias o centros de ayuda en un mapa interactivo. Las organizaciones aparecen como verificadas o sin verificar, para que los usuarios sepan qué registros ya han sido revisados por el equipo de Huella.

Construido con React 19, TypeScript, Vite, Tailwind CSS y Supabase.

- Repositorio del backend: [HuellaDev/backend](https://github.com/HuellaDev/backend)
- Documentación de la API (Postman): [Ver colección](https://documenter.getpostman.com/view/47022693/2sBYArUsef)
- App en producción: [huella-kerh.onrender.com](https://huella-kerh.onrender.com)

## Stack tecnológico

- **Framework:** React 19 + TypeScript + Vite
- **Estilos:** Tailwind CSS + componentes UI estilo shadcn (`@base-ui/react`)
- **Manejo de datos:** TanStack Query + Axios
- **Auth:** Supabase Auth
- **Mapas:** MapLibre GL / react-map-gl + Turf.js
- **Ruteo:** React Router
- **PWA:** vite-plugin-pwa (app instalable, service worker offline)
- **Notificaciones:** Web Push

## Requisitos

- Node.js 18+
- pnpm
- Un proyecto de Supabase (el mismo que usa el [backend](https://github.com/HuellaDev/backend))
- El backend de Huella corriendo y accesible (local o desplegado)

## Instalación

```bash
git clone https://github.com/HuellaDev/frontend.git
cd frontend
pnpm install
cp .env.example .env   # completa las variables de abajo
pnpm dev
```

Otros scripts:

```bash
pnpm build     # Verifica tipos y compila para producción
pnpm preview   # Previsualiza el build de producción localmente
pnpm lint      # Ejecuta oxlint
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `VITE_SUPABASE_URL` | URL del proyecto de Supabase. |
| `VITE_SUPABASE_ANON_KEY` | Clave anon/pública de Supabase (segura para exponer en el cliente). |
| `VITE_API_URL` | URL base de la API del backend de Huella (ej. `http://localhost:3000/api/huella`). |
| `VITE_VAPID_PUBLIC_KEY` | Clave pública VAPID, debe coincidir con `VAPID_PUBLIC_KEY` del backend. |

## Estructura del proyecto

```
Huella-Frontend-ia/
├── src/
│   ├── pages/        # Páginas a nivel de ruta (mapa, auth, reportes, settings, admin, legal, help center)
│   ├── components/    # Componentes por funcionalidad/página, + ui/ (design system)
│   ├── layout/         # Shell / layout de la app
│   ├── router/         # Definición de rutas + guards (protegidas, admin)
│   ├── hooks/           # Hooks personalizados (auth, geolocalización, datos del mapa, tema, push, etc.)
│   ├── lib/              # Clientes de API (axios), cliente de Supabase, utilidades
│   └── types/             # Tipos de TypeScript compartidos
└── public/                 # Assets estáticos, íconos de la PWA
```

## Funcionalidades principales

- Mapa interactivo con reportes de pérdida/avistamiento, filtros por fecha y radio de búsqueda.
- Flujo de creación de reportes de mascotas perdidas o avistadas, con subida de múltiples fotos.
- Páginas de detalle de reporte con comentarios y seguimiento de estado.
- Directorio de organizaciones (veterinarias, centros de ayuda) en el mapa, con estado verificado/sin verificar.
- Configuración de usuario: perfil, información de cuenta, contraseña, notificaciones, apariencia, eliminación de cuenta.
- Flujo de solicitud para que una organización se convierta en un centro de ayuda listado.
- Panel de administración para verificación de organizaciones.
- PWA instalable con notificaciones push.

## Autenticación

Manejada con Supabase (`supabase.auth`). El cliente de Axios (`src/lib/api.ts`) adjunta el access token de la sesión a cada petición:

```
Authorization: Bearer <access_token>
```

Las rutas protegidas están envueltas con los guards `ProtectedRoute` / `AdminRoute` (`src/router/guards`).

## Repositorios relacionados

- Backend / API: [HuellaDev/backend](https://github.com/HuellaDev/backend)
- Documentación en Postman: [Ver colección](https://documenter.getpostman.com/view/47022693/2sBYArUsef)

## Licencia

ISC. Ver [LICENSE](./LICENSE).
