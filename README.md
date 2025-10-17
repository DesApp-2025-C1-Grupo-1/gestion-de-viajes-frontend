# Gestión de Viajes – Frontend (React + Vite + MUI)

SPA para gestionar empresas, choferes, vehículos, viajes y distribución de viajes. Construida con React 18, Vite, Material UI, React Query y React Router.

## Requisitos

- Node.js LTS (20.x recomendado)
- npm

## Configuración y ejecución

1) Instalar dependencias

```powershell
npm install
```

2) Variables de entorno (Opcional)

Crear un archivo `.env` en la raíz del frontend con al menos:

```env
VITE_API_URL=https://gestion-de-viajes.onrender.com/api-json
```

Este valor es usado por `orval.config.ts` para generar el cliente de API (`src/api/generated.ts`).

3) Generar cliente API (opcional, si cambia el backend)

```powershell
npm run orval
```

4) Ejecutar en modo desarrollo

```powershell
npm run dev
```

La app corre por defecto en `http://localhost:5173`.

5) Build de producción

```powershell
npm run build
npm run preview
```

## Librerias utilizadas

- UI: Material UI + tema personalizado en `src/config/customMuiTheme.ts`.
- React Query: para fetching/caché; cliente generado por Orval desde OpenAPI del backend.
- React Router (ver `src/AppRouter.tsx`).
- API de provincias/localidades en `src/api/georefApi.ts`.
