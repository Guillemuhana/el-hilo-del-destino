import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: './' permite servir la app tanto desde la raíz de un dominio
// como desde una subcarpeta o abriendo el build localmente.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
