/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_URL: string;
  // 👆 agregá acá todas las variables que uses con VITE_
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}