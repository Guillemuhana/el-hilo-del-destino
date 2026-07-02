# El Hilo del Destino

App de lectura de **Lenormand** (36 cartas de la baraja Piatnik clásica) con interpretación por IA usando **Groq**. Hecha en React + Vite.

## Qué hace

- 4 tiradas: Carta del Día (1), Tirada de 3, Tirada de 9 (grilla 3×3) y Gran Tableau (36 cartas).
- Cartas reales de la baraja, animación de volteo 3D.
- Interpretación de las combinaciones entre cartas vecinas, en español rioplatense, generada por IA.

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior (incluye `npm`).
- Una API key gratis de Groq: https://console.groq.com/keys

## Cómo correrla (paso a paso en VS Code)

1. Descomprimí el .zip y abrí la carpeta en VS Code (`Archivo → Abrir carpeta`).
2. Abrí una terminal integrada (`Terminal → Nueva terminal`).
3. Instalá las dependencias:

   ```bash
   npm install
   ```

4. Levantá el servidor de desarrollo:

   ```bash
   npm run dev
   ```

5. Abrí en el navegador la dirección que aparece (normalmente `http://localhost:5173`).

## Cómo usar la interpretación por IA

1. Creá una API key gratis en https://console.groq.com/keys (empieza con `gsk_`).
2. En la app, hacé una tirada y revelá las cartas.
3. Pegá tu API key en el campo **"API key de Groq"**.
4. Tocá **"Interpretar la tirada"**.

> La key se usa directamente desde tu navegador. Para un deploy público conviene mover la key a un backend (proxy) para no exponerla — ver más abajo.

## Compilar para producción

```bash
npm run build
```

Genera la carpeta `dist/` con los archivos estáticos listos para subir a cualquier hosting (Vercel, Netlify, etc.).

Para previsualizar el build:

```bash
npm run preview
```

## Nota sobre la API key en producción

La versión actual hace la llamada a Groq desde el navegador con la key que ingresa el usuario. Eso está perfecto para uso personal o pruebas. Si vas a publicar la app para que la use tu clienta sin que cada quien ponga su propia key, conviene crear un pequeño backend (una función serverless o un flujo en n8n) que guarde la key del lado del servidor, y que el frontend le pegue a ese endpoint. Así la key no queda expuesta.

## Estructura

```
el-hilo-del-destino/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx            → punto de entrada
    ├── index.css           → reset global
    ├── LenormandApp.jsx    → toda la app (componente + estilos + lógica)
    └── imagenesCartas.js   → las 36 cartas + dorso en base64 (WebP)
```
