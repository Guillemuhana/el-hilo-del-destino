import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Shuffle,
  WandSparkles,
  MessageCircle,
  Eye,
} from "lucide-react";
import { IMAGENES } from "./imagenesCartas.js";

/* ============================================================
   EFECTOS — destellos magicos (canvas-confetti)
   ============================================================ */

const COLORES_MAGIA = ["#f0c929", "#29cceb", "#0e9dbb", "#ffffff"];

function chispas(x = 0.5, y = 0.5) {
  confetti({
    particleCount: 24,
    spread: 60,
    startVelocity: 20,
    gravity: 0.6,
    scalar: 0.9,
    ticks: 90,
    origin: { x, y },
    colors: COLORES_MAGIA,
    shapes: ["star", "circle"],
    disableForReducedMotion: true,
  });
}

function granFinale() {
  confetti({
    particleCount: 90,
    spread: 105,
    startVelocity: 38,
    gravity: 0.7,
    scalar: 1,
    ticks: 150,
    origin: { x: 0.5, y: 0.32 },
    colors: COLORES_MAGIA,
    shapes: ["star", "circle"],
    disableForReducedMotion: true,
  });
}

/* ============================================================
   CONFIGURACIÓN DE MONETIZACIÓN
   El usuario tiene 1 lectura gratis. Después, para seguir,
   debe coordinar el pago por WhatsApp.
   ============================================================ */

// Número de WhatsApp al que escribe el cliente para pagar.
// Formato internacional SOLO dígitos (sin +, sin espacios, sin guiones).
// Ej. Argentina: 54 9 11 1234-5678  ->  "5491112345678"
// ⚠️ PENDIENTE: reemplazar por el número real.
const WHATSAPP_NUMERO = "5491100000000";

const PRECIO_LECTURA = "$5.000"; // texto que se muestra al usuario
const LECTURAS_GRATIS = 1; // cuántas lecturas gratis antes del paywall
const STORAGE_KEY = "hdd_lecturas_usadas";

function lecturasHechas() {
  try {
    return parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10) || 0;
  } catch {
    return 0;
  }
}

function guardarLecturas(n) {
  try {
    localStorage.setItem(STORAGE_KEY, String(n));
  } catch {
    /* localStorage no disponible */
  }
}

function linkWhatsApp() {
  const msg = encodeURIComponent(
    `¡Hola! Quiero seguir con mis lecturas de Lenormand en El Hilo del Destino. Vengo a coordinar el pago de mi próxima lectura (${PRECIO_LECTURA}).`
  );
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${msg}`;
}

/* ============================================================
   BARAJA LENORMAND — 36 CARTAS (Piatnik clásica)
   Cada carta: número, nombre, palabra clave y significado.
   El Lenormand se lee DERECHO (no hay invertidas) y el
   sentido surge de la COMBINACIÓN entre cartas vecinas.
   ============================================================ */

const CARTAS = [
  { id: 1, nombre: "El Jinete", clave: "Noticias, novedades", sig: "Mensajes que llegan, movimiento, algo nuevo que se acerca. Visitas, información en camino." },
  { id: 2, nombre: "El Trébol", clave: "Suerte, oportunidad", sig: "Golpes de fortuna, pequeñas alegrías, oportunidades breves. Optimismo, aunque pasajero." },
  { id: 3, nombre: "El Barco", clave: "Viaje, distancia", sig: "Viajes, comercio, cambios de rumbo, cosas que vienen de lejos. Búsqueda y expansión." },
  { id: 4, nombre: "La Casa", clave: "Hogar, familia, estabilidad", sig: "El ámbito privado, la familia, la seguridad, lo propio. Bienestar y raíces." },
  { id: 5, nombre: "El Árbol", clave: "Salud, crecimiento, raíces", sig: "Vitalidad, cuerpo, procesos lentos y profundos, karma. Todo lo que crece con el tiempo." },
  { id: 6, nombre: "Las Nubes", clave: "Confusión, dudas", sig: "Incertidumbre, problemas temporales, claroscuros. Algo no está claro todavía." },
  { id: 7, nombre: "La Serpiente", clave: "Enredos, deseo, traición", sig: "Complicaciones, rodeos, seducción, una mujer astuta. Cuidado con engaños." },
  { id: 8, nombre: "El Ataúd", clave: "Final, transformación", sig: "Cierre de un ciclo, pérdida, enfermedad o duelo. También liberación de lo viejo." },
  { id: 9, nombre: "El Ramo", clave: "Regalo, belleza, alegría", sig: "Invitaciones, gratitud, cosas agradables, un obsequio. Placer y reconocimiento." },
  { id: 10, nombre: "La Guadaña", clave: "Corte, decisión súbita", sig: "Cortes bruscos, rupturas, peligro, decisiones repentinas. Algo que termina de golpe." },
  { id: 11, nombre: "El Látigo", clave: "Conflicto, repetición", sig: "Discusiones, tensiones, esfuerzo físico, rutinas. También pasión y deporte." },
  { id: 12, nombre: "Los Pájaros", clave: "Charlas, nerviosismo", sig: "Conversaciones, llamadas, ansiedad, pareja o dúo. Muchas palabras, poca calma." },
  { id: 13, nombre: "El Niño", clave: "Comienzo, inocencia", sig: "Algo nuevo y pequeño, un niño, ingenuidad, frescura. Inicios que necesitan cuidado." },
  { id: 14, nombre: "El Zorro", clave: "Astucia, trabajo, cautela", sig: "El empleo, la estrategia, la desconfianza necesaria. Algo o alguien astuto." },
  { id: 15, nombre: "El Oso", clave: "Poder, protección, fuerza", sig: "Una figura de autoridad, jefe, fortaleza, finanzas. Protección y también dominación." },
  { id: 16, nombre: "Las Estrellas", clave: "Esperanza, claridad, guía", sig: "Buena orientación, espiritualidad, metas claras, fortuna. La luz que muestra el camino." },
  { id: 17, nombre: "La Cigüeña", clave: "Cambio, mudanza", sig: "Transformaciones, traslados, embarazo, renovación. Algo se mueve hacia lo mejor." },
  { id: 18, nombre: "El Perro", clave: "Amistad, lealtad", sig: "Un amigo fiel, confianza, compañía. Alguien de confianza en tu vida." },
  { id: 19, nombre: "La Torre", clave: "Instituciones, soledad", sig: "Organismos, empresas, aislamiento, límites. Estructuras firmes y a veces frías." },
  { id: 20, nombre: "El Jardín", clave: "Público, encuentros", sig: "Vida social, eventos, la comunidad, exposición. Todo lo que ocurre de cara a otros." },
  { id: 21, nombre: "La Montaña", clave: "Obstáculo, bloqueo", sig: "Un desafío grande, demoras, enemigos, algo que frena. Hace falta paciencia y esfuerzo." },
  { id: 22, nombre: "El Camino", clave: "Elección, decisiones", sig: "Bifurcaciones, opciones, libertad de elegir. Un cruce que pide decisión." },
  { id: 23, nombre: "Los Ratones", clave: "Pérdida, desgaste", sig: "Robo, deterioro, estrés, cosas que se pierden de a poco. Preocupaciones que carcomen." },
  { id: 24, nombre: "El Corazón", clave: "Amor, afecto", sig: "Romance, cariño, reconciliación, lo que se ama. El sentimiento en primer plano." },
  { id: 25, nombre: "El Anillo", clave: "Compromiso, unión, ciclos", sig: "Contratos, matrimonio, sociedades, promesas. Vínculos que se sellan." },
  { id: 26, nombre: "El Libro", clave: "Secreto, conocimiento", sig: "Lo oculto, el estudio, información reservada, aprendizaje. Algo que aún no se revela." },
  { id: 27, nombre: "La Carta", clave: "Documentos, mensajes", sig: "Papeles, correos, comunicación escrita, noticias formales. Todo lo que consta por escrito." },
  { id: 28, nombre: "El Hombre", clave: "Figura masculina / consultante", sig: "El consultante si es hombre, o una figura masculina clave: pareja, socio, referente." },
  { id: 29, nombre: "La Mujer", clave: "Figura femenina / consultante", sig: "La consultante si es mujer, o una figura femenina clave: pareja, socia, referente." },
  { id: 30, nombre: "Los Lirios", clave: "Paz, madurez, sexualidad", sig: "Armonía, virtud, familia, serenidad. También sensualidad y experiencia." },
  { id: 31, nombre: "El Sol", clave: "Éxito, energía, vitalidad", sig: "Triunfo, alegría, salud, claridad plena. La mejor de las cartas: todo florece." },
  { id: 32, nombre: "La Luna", clave: "Emociones, reconocimiento", sig: "Intuición, fama, honores, romanticismo, el mundo interior. Reconocimiento y sensibilidad." },
  { id: 33, nombre: "La Llave", clave: "Solución, certeza", sig: "La respuesta, el éxito asegurado, apertura de puertas. Sí definitivo, algo se resuelve." },
  { id: 34, nombre: "Los Peces", clave: "Dinero, abundancia", sig: "Finanzas, negocios, prosperidad, independencia. El flujo material y la abundancia." },
  { id: 35, nombre: "El Ancla", clave: "Estabilidad, trabajo, constancia", sig: "Seguridad, metas alcanzadas, perseverancia, el trabajo firme. Algo que se afianza." },
  { id: 36, nombre: "La Cruz", clave: "Destino, carga, fe", sig: "Pruebas, sacrificio, espiritualidad, algo inevitable. Un peso a atravesar con fe." },
];

const IMG = IMAGENES;

/* ============================================================
   TIRADAS LENORMAND
   ============================================================ */

const TIRADAS = {
  carta_dia: {
    nombre: "Carta del Día",
    desc: "Una carta como guía para tu jornada.",
    n: 1,
    tipo: "lineal",
    posiciones: ["Tu día"],
    icono: "/img/icono-carta-dia.webp",
    badge: "Rápida",
  },
  tres: {
    nombre: "Tirada de 3 Cartas",
    desc: "Pasado, presente y futuro, o una situación de un vistazo.",
    n: 3,
    tipo: "lineal",
    posiciones: ["Pasado / Origen", "Presente / Situación", "Futuro / Resultado"],
    icono: "/img/icono-tres.webp",
    badge: "La más elegida",
  },
  nueve: {
    nombre: "Tirada de 9 (3×3)",
    desc: "Nueve cartas para explorar un tema con profundidad.",
    n: 9,
    tipo: "grilla",
    filas: 3,
    cols: 3,
    posiciones: [
      "Pasado", "Consultante", "Futuro",
      "Base", "El tema central", "Lo que se desarrolla",
      "Influencia oculta", "Consejo", "Resultado",
    ],
    icono: "/img/icono-nueve.webp",
    badge: "En profundidad",
  },
  gran_tableau: {
    nombre: "Gran Tableau (36)",
    desc: "La tirada completa: las 36 cartas. Lectura magistral.",
    n: 36,
    tipo: "grilla",
    filas: 4,
    cols: 9,
    posiciones: Array.from({ length: 36 }, (_, i) => `Posición ${i + 1}`),
    icono: "/img/icono-tableau.webp",
    badge: "La más completa",
  },
};

/* ============================================================
   UTILIDADES
   ============================================================ */

function mezclar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function robar(n) {
  return mezclar(CARTAS).slice(0, n);
}

/* ============================================================
   INTERPRETACIÓN por combinaciones
   La llamada a la IA (Groq) se hace del lado del servidor
   mediante la función serverless /api/interpretar, así la
   API key nunca queda expuesta en el navegador del cliente.
   ============================================================ */

async function interpretar({ tirada, cartas, pregunta }) {
  const listado = cartas
    .map((c, i) => {
      const pos = tirada.posiciones[i] || `Carta ${i + 1}`;
      return `${i + 1}. [${pos}] ${c.nombre} — ${c.clave}: ${c.sig}`;
    })
    .join("\n");

  const instruccionesTirada =
    tirada.tipo === "grilla"
      ? `Es una tirada en grilla de ${tirada.filas}×${tirada.cols}. Prestá atención a las cartas vecinas (arriba, abajo, a los lados y en diagonal): en Lenormand el significado nace de cómo se combinan las cartas contiguas, no de cada carta por separado.`
      : `Es una tirada lineal. Leé las cartas como una frase de izquierda a derecha, donde cada carta modifica a la siguiente.`;

  const prompt = `Sos una tarotista experta en LENORMAND (no tarot), cálida y cercana, que habla en español rioplatense (usás "vos"). 

REGLAS DEL LENORMAND que respetás siempre:
- Las cartas se leen SIEMPRE derechas (no existen cartas invertidas).
- El significado surge de la COMBINACIÓN entre cartas vecinas, como si armaras frases. Ej: Jinete + Corazón = "noticias de amor"; Ataúd + Peces = "pérdida de dinero".
- No inventás cartas que no están. Trabajás solo con las que salieron.

${instruccionesTirada}

Tipo de tirada: ${tirada.nombre}
${pregunta ? `Pregunta de la consultante: "${pregunta}"` : "Sin pregunta específica: hacé una lectura general del panorama."}

Cartas que salieron (en orden de posición):
${listado}

Estructurá tu respuesta con estos títulos en negrita markdown:
**La lectura** — el cuerpo principal. Tejé las combinaciones entre cartas vecinas en una narrativa fluida (2-4 párrafos según la cantidad de cartas). Nombrá las combinaciones clave que ves.
**El mensaje central** — síntesis en 2-3 frases.
**Un consejo** — algo concreto y accionable.

Tono empático y claro, sin fatalismos. ${tirada.n >= 9 ? "Como son muchas cartas, priorizá las combinaciones más significativas en vez de mencionar las 36 una por una." : ""} Máximo ~${tirada.n >= 9 ? 550 : 380} palabras.`;

  const res = await fetch("/api/interpretar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, maxTokens: 1600 }),
  });

  if (!res.ok) {
    let msg = `Error ${res.status}`;
    try {
      const j = await res.json();
      if (j?.error) msg = j.error;
    } catch {
      /* respuesta sin JSON */
    }
    throw new Error(msg);
  }
  const data = await res.json();
  const out = data?.texto;
  if (!out) throw new Error("Respuesta vacía del servidor.");
  return out;
}

/* ============================================================
   MARKDOWN MÍNIMO
   ============================================================ */

function Markdown({ texto }) {
  const lineas = texto.split("\n").filter((l) => l.trim() !== "");
  return (
    <div className="md">
      {lineas.map((linea, i) => {
        const partes = linea.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i}>
            {partes.map((p, j) =>
              p.startsWith("**") && p.endsWith("**") ? (
                <strong key={j}>{p.slice(2, -2)}</strong>
              ) : (
                <span key={j}>{p}</span>
              )
            )}
          </p>
        );
      })}
    </div>
  );
}

/* ============================================================
   COMPONENTE CARTA
   ============================================================ */

function Carta({ carta, posicion, revelada, onClick, index, compacta }) {
  return (
    <motion.div
      className={`carta-wrap ${compacta ? "compacta" : ""}`}
      initial={{ opacity: 0, y: 26, scale: 0.82, rotate: compacta ? 0 : -5 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 20,
        delay: index * (compacta ? 0.018 : 0.09),
      }}
      whileHover={{
        y: -10,
        scale: compacta ? 1.12 : 1.06,
        zIndex: 5,
        transition: { type: "spring", stiffness: 320, damping: 14 },
      }}
      whileTap={{ scale: 0.96 }}
    >
      {posicion && !compacta && <div className="carta-pos">{posicion}</div>}
      <button
        className={`carta ${revelada ? "revelada" : ""}`}
        onClick={onClick}
        aria-label={revelada ? carta.nombre : "Carta boca abajo"}
      >
        <div className="carta-inner">
          <div className="carta-cara carta-dorso">
            <img src={`data:image/webp;base64,${IMG.dorso}`} alt="dorso" />
          </div>
          <div className="carta-cara carta-frente">
            <img
              src={`data:image/webp;base64,${IMG[carta.id]}`}
              alt={carta.nombre}
            />
            <span className="carta-brillo" />
          </div>
        </div>
      </button>
      {revelada && !compacta && (
        <motion.div
          className="carta-label"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <span className="carta-num">{carta.id}</span> {carta.nombre}
        </motion.div>
      )}
    </motion.div>
  );
}

/* ============================================================
   APP
   ============================================================ */

export default function LenormandApp() {
  const [pantalla, setPantalla] = useState("inicio");
  const [tiradaKey, setTiradaKey] = useState(null);
  const [cartas, setCartas] = useState([]);
  const [reveladas, setReveladas] = useState({});
  const [pregunta, setPregunta] = useState("");
  const [interpretacion, setInterpretacion] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [detalle, setDetalle] = useState(null);
  const [lecturasUsadas, setLecturasUsadas] = useState(() => lecturasHechas());
  const resultRef = useRef(null);

  const debePagar = lecturasUsadas >= LECTURAS_GRATIS;

  const tirada = tiradaKey ? TIRADAS[tiradaKey] : null;
  const todasReveladas =
    cartas.length > 0 && cartas.every((_, i) => reveladas[i]);
  const compacta = tirada && tirada.n >= 9;

  function iniciar(key) {
    const t = TIRADAS[key];
    setTiradaKey(key);
    setCartas(robar(t.n));
    setReveladas({});
    setInterpretacion("");
    setError("");
    setDetalle(null);
    setPantalla("tirada");
  }

  function revelar(i, e) {
    if (compacta && reveladas[i]) {
      setDetalle(cartas[i]);
      return;
    }
    if (!reveladas[i] && e?.currentTarget) {
      const r = e.currentTarget.getBoundingClientRect();
      chispas(
        (r.left + r.width / 2) / window.innerWidth,
        (r.top + r.height / 2) / window.innerHeight
      );
    }
    setReveladas((r) => ({ ...r, [i]: true }));
    if (compacta) setDetalle(cartas[i]);
  }

  function revelarTodas() {
    const all = {};
    cartas.forEach((_, i) => (all[i] = true));
    setReveladas(all);
  }

  // Estallido de destellos cuando toda la tirada queda revelada.
  const yaFestejado = useRef(false);
  useEffect(() => {
    if (todasReveladas && !yaFestejado.current) {
      yaFestejado.current = true;
      const t = setTimeout(granFinale, compacta ? 250 : 700);
      return () => clearTimeout(t);
    }
    if (!todasReveladas) yaFestejado.current = false;
  }, [todasReveladas, compacta]);

  async function pedirLectura() {
    // Paywall: si ya usó su(s) lectura(s) gratis, no llama a la IA.
    if (debePagar) {
      setTimeout(
        () => resultRef.current?.scrollIntoView({ behavior: "smooth" }),
        100
      );
      return;
    }
    setError("");
    setCargando(true);
    setInterpretacion("");
    try {
      const texto = await interpretar({
        tirada,
        cartas,
        pregunta: pregunta.trim(),
      });
      setInterpretacion(texto);
      // Registra la lectura gratuita consumida.
      const nuevas = lecturasHechas() + 1;
      guardarLecturas(nuevas);
      setLecturasUsadas(nuevas);
      setTimeout(
        () => resultRef.current?.scrollIntoView({ behavior: "smooth" }),
        100
      );
    } catch (e) {
      setError(e.message || "Error al generar la interpretación.");
    } finally {
      setCargando(false);
    }
  }

  function volver() {
    setPantalla("inicio");
    setTiradaKey(null);
    setCartas([]);
    setReveladas({});
    setInterpretacion("");
    setError("");
    setDetalle(null);
  }

  return (
    <div className="app">
      <Estilos />

      <header className="header">
        <div className="header-barra" />
        <div className="header-inner">
          <img
            src="/img/logo-badge.webp"
            alt="El Hilo del Destino"
            className="logo-header"
            onClick={volver}
          />
          <h1 className="titulo" onClick={volver}>
            El Hilo del Destino
          </h1>
          <p className="subtitulo">Lecturas de Lenormand online · 36 cartas</p>
        </div>
      </header>

      {pantalla === "inicio" && (
        <main className="inicio">
          <section className="hero-slide">
            <img src="/img/hero-slide.webp" alt="" />
          </section>

          <section className="hero">
            <div className="hero-texto">
              <h2 className="hero-titulo">
                Consultá tu tirada de Lenormand, gratis
              </h2>
              <p className="intro">
                El oráculo Lenormand se lee combinando las cartas entre sí.
                Elegí una tirada, mezclá la baraja y recibí una interpretación
                generada por inteligencia artificial leyendo las combinaciones.
              </p>
            </div>
            <div className="hero-img">
              <img src="/img/hero-ilustracion.webp" alt="" />
            </div>
          </section>

          <div className="grid-tiradas" id="tiradas">
            {Object.entries(TIRADAS).map(([key, t], idx) => (
              <button
                key={key}
                className="tirada-card"
                style={{ animationDelay: `${idx * 90}ms` }}
                onClick={() => iniciar(key)}
              >
                {t.badge && <span className="tirada-badge">{t.badge}</span>}
                <span className="tirada-icono">
                  <img src={t.icono} alt="" className="tirada-icono-img" />
                </span>
                <span className="tirada-nombre">{t.nombre}</span>
                <span className="tirada-desc">{t.desc}</span>
                <span className="tirada-meta">{t.n} carta{t.n > 1 ? "s" : ""}</span>
                <span className="tirada-cta">
                  Consultar <ArrowRight size={16} strokeWidth={2.5} />
                </span>
              </button>
            ))}
          </div>
        </main>
      )}

      {pantalla === "tirada" && tirada && (
        <main className="mesa">
          <div className="mesa-head">
            <button className="btn-ghost" onClick={volver}>
              <ArrowLeft size={17} strokeWidth={2.4} /> Volver
            </button>
            <h2 className="mesa-titulo">{tirada.nombre}</h2>
            <button className="btn-ghost" onClick={() => iniciar(tiradaKey)}>
              <Shuffle size={17} strokeWidth={2.4} /> Remezclar
            </button>
          </div>

          <div className="campo-pregunta">
            <input
              type="text"
              placeholder="¿Tenés una pregunta? (opcional)"
              value={pregunta}
              onChange={(e) => setPregunta(e.target.value)}
            />
          </div>

          <div
            className={`tablero ${compacta ? "tablero-grilla" : "tablero-lineal"}`}
            style={
              compacta
                ? { "--cols": tirada.cols, "--filas": tirada.filas }
                : undefined
            }
          >
            {cartas.map((c, i) => (
              <Carta
                key={`${c.id}-${i}`}
                carta={c}
                posicion={tirada.posiciones[i]}
                revelada={!!reveladas[i]}
                onClick={(e) => revelar(i, e)}
                index={i}
                compacta={compacta}
              />
            ))}
          </div>

          {compacta && detalle && (
            <div className="detalle-carta">
              <strong>
                {detalle.id}. {detalle.nombre}
              </strong>{" "}
              — <em>{detalle.clave}.</em> {detalle.sig}
            </div>
          )}

          {!todasReveladas && (
            <button className="btn-secundario" onClick={revelarTodas}>
              <Eye size={18} strokeWidth={2.2} /> Dar vuelta todas las cartas
            </button>
          )}

          {todasReveladas && (
            <section className="lectura-box">
              {!debePagar && (
                <button
                  className="btn-principal"
                  onClick={pedirLectura}
                  disabled={cargando}
                >
                  {cargando ? (
                    "Leyendo las combinaciones…"
                  ) : (
                    <>
                      <WandSparkles size={19} strokeWidth={2.2} /> Interpretar la
                      tirada
                    </>
                  )}
                </button>
              )}

              {error && <div className="error">{error}</div>}

              {cargando && (
                <div className="cargando">
                  <div className="orbe" />
                  <p>Las cartas se combinan…</p>
                </div>
              )}

              {interpretacion && (
                <div className="interpretacion">
                  <h3>
                    <Sparkles size={20} strokeWidth={2} /> Tu lectura
                  </h3>
                  <Markdown texto={interpretacion} />
                </div>
              )}

              {debePagar && (
                <div className="paywall" ref={resultRef}>
                  <div className="paywall-orn">
                    <Sparkles size={40} strokeWidth={1.6} />
                  </div>
                  <h3>El oráculo tiene más para revelarte</h3>
                  <p>
                    Ya disfrutaste de tu lectura de regalo. El hilo del destino
                    sigue tejiéndose: para desbloquear tu próxima lectura
                    completa, coordiná el pago por WhatsApp y seguimos.
                  </p>
                  <div className="paywall-precio">
                    {PRECIO_LECTURA} <span>por lectura</span>
                  </div>
                  <a
                    className="btn-principal btn-wa"
                    href={linkWhatsApp()}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle size={19} strokeWidth={2.2} /> Continuar por
                    WhatsApp
                  </a>
                  <small className="paywall-nota">
                    Te respondemos a la brevedad para habilitar tu lectura.
                  </small>
                </div>
              )}
            </section>
          )}
        </main>
      )}

      {pantalla === "inicio" && (
        <section className="banner-compartir">
          <div className="banner-overlay">
            <h3>
              <Sparkles size={20} strokeWidth={2} /> Regalá una lectura
            </h3>
            <p>
              Compartí El Hilo del Destino con quien quieras, o volvé a tirar
              las cartas para explorar otra pregunta.
            </p>
            <button
              className="btn-banner"
              onClick={() =>
                document
                  .getElementById("tiradas")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Elegir otra tirada <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        </section>
      )}

      <footer className="footer">
        <p>Las cartas son un espejo, no un destino. Confiá en tu criterio.</p>
        <p className="footer-marca">El Hilo del Destino</p>
      </footer>
    </div>
  );
}

/* ============================================================
   ESTILOS
   ============================================================ */

function Estilos() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Poppins:wght@500;600;700;800&display=swap');

      * { box-sizing: border-box; margin: 0; padding: 0; }

      .app {
        --turquesa: #0e9dbb;
        --turquesa-fuerte: #0a7f98;
        --turquesa-claro: #29cceb;
        --turquesa-suave: rgba(41,204,235,0.10);
        --turquesa-borde: rgba(14,157,187,0.28);
        --dorado: #f0c929;
        --dorado-fuerte: #d9ac0a;
        --dorado-suave: rgba(240,201,41,0.14);
        --rojo: #c12422;
        --fondo: #f5f9fb;
        --superficie: #ffffff;
        --texto: #1e2733;
        --texto-suave: #64748b;
        --borde: #e3ecf1;
        min-height: 100vh;
        background-color: var(--fondo);
        color: var(--texto);
        font-family: 'Nunito', sans-serif;
        position: relative; overflow-x: hidden;
        padding-bottom: 4rem;
      }
      /* textura sutil repetible superpuesta al color de fondo */
      .app::before {
        content: ""; position: fixed; inset: 0; z-index: 0; pointer-events: none;
        background-image: url('/img/textura-fondo.webp');
        background-repeat: repeat; background-size: 340px;
        opacity: 0.5;
      }

      .header, .inicio, .mesa, .footer, .banner-compartir { position: relative; z-index: 1; }

      /* HEADER */
      .header { text-align: center; }
      .header-barra {
        height: 6px;
        background: linear-gradient(90deg, var(--turquesa), var(--turquesa-claro), var(--dorado));
      }
      .header-inner {
        background: var(--superficie);
        padding: 1.6rem 1rem 1.6rem;
        border-bottom: 1px solid var(--borde);
        box-shadow: 0 2px 14px rgba(15,60,75,0.05);
        display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
      }
      .logo-header {
        height: 52px; width: auto; cursor: pointer;
        border-radius: 12px;
        box-shadow: 0 6px 18px rgba(10,32,39,0.22);
        transition: transform .2s ease;
      }
      .logo-header:hover { transform: translateY(-2px) scale(1.02); }
      .titulo {
        font-family: 'Poppins', sans-serif; font-weight: 700;
        font-size: clamp(1.7rem, 5vw, 2.5rem);
        letter-spacing: -0.01em; cursor: pointer;
        color: var(--turquesa-fuerte);
      }
      .subtitulo {
        color: var(--texto-suave); letter-spacing: 0.06em;
        font-size: 0.9rem; margin-top: 0.4rem; font-weight: 600;
      }

      /* HERO SLIDE (banner bajo el header) */
      .hero-slide {
        max-width: 1100px; margin: 1.8rem auto 0; padding: 0 1rem;
      }
      .hero-slide img {
        display: block; width: 100%; height: auto;
        border-radius: 18px;
        box-shadow: 0 14px 40px rgba(15,60,75,0.16);
        border: 1px solid var(--borde);
      }

      /* HERO (texto + ilustracion) */
      .hero {
        max-width: 1040px; margin: 2.4rem auto 2.4rem; padding: 0 1rem;
        display: grid; grid-template-columns: 1.05fr 0.95fr;
        gap: 1.5rem; align-items: center;
      }
      .hero-texto { text-align: left; }
      .hero-titulo {
        font-family: 'Poppins', sans-serif; font-weight: 700;
        font-size: clamp(1.4rem, 4vw, 2.1rem); color: var(--texto);
        margin-bottom: 0.9rem; line-height: 1.2;
      }
      .intro {
        font-size: 1.05rem; line-height: 1.65; color: var(--texto-suave);
      }
      .hero-img img {
        display: block; width: 100%; height: auto; border-radius: 16px;
      }
      @media (max-width: 720px) {
        .hero { grid-template-columns: 1fr; text-align: center; }
        .hero-texto { text-align: center; }
        .hero-img { max-width: 420px; margin: 0 auto; }
      }

      /* GRID DE TIRADAS */
      .grid-tiradas {
        display: grid; gap: 1.3rem; max-width: 1000px; margin: 0 auto; padding: 0 1rem;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      }
      .tirada-card {
        background: var(--superficie);
        border: 1px solid var(--borde);
        border-top: 4px solid var(--turquesa);
        border-radius: 14px; padding: 1.6rem 1.4rem 1.3rem;
        cursor: pointer; text-align: left; color: var(--texto);
        display: flex; flex-direction: column; gap: 0.45rem;
        transition: transform .25s ease, box-shadow .25s ease;
        opacity: 0; animation: subir 0.5s forwards; position: relative;
      }
      .tirada-card:nth-child(2) { border-top-color: var(--dorado); }
      .tirada-card:nth-child(3) { border-top-color: var(--rojo); }
      .tirada-card:nth-child(4) { border-top-color: var(--turquesa-claro); }
      .tirada-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 14px 34px rgba(15,60,75,0.12);
      }
      .tirada-badge {
        position: absolute; top: -0.6rem; right: 1rem;
        background: var(--dorado); color: #3a2e00;
        font-family: 'Poppins', sans-serif; font-size: 0.68rem; font-weight: 700;
        letter-spacing: 0.03em; padding: 0.3rem 0.7rem; border-radius: 999px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.12);
      }
      .tirada-icono {
        width: 62px; height: 62px; margin-bottom: 0.4rem;
        display: flex; align-items: center; justify-content: center;
        border-radius: 16px;
        background: radial-gradient(120% 120% at 50% 32%, #0e3a46 0%, #0a2027 100%);
        box-shadow: 0 6px 16px rgba(10,32,39,0.28), inset 0 1px 0 rgba(255,255,255,0.05);
      }
      .tirada-icono-img {
        width: 52px; height: 52px; object-fit: contain; display: block;
      }
      .tirada-nombre {
        font-family: 'Poppins', sans-serif; font-size: 1.12rem; font-weight: 700;
        color: var(--turquesa-fuerte);
      }
      .tirada-desc { color: var(--texto-suave); font-size: 0.96rem; line-height: 1.45; flex: 1; }
      .tirada-meta {
        color: var(--texto-suave); font-size: 0.78rem; font-weight: 700;
        text-transform: uppercase; letter-spacing: 0.06em;
      }
      .tirada-cta {
        color: var(--turquesa-fuerte); font-family: 'Poppins', sans-serif;
        font-weight: 700; font-size: 0.92rem; margin-top: 0.3rem;
        display: inline-flex; align-items: center; gap: 0.35rem;
      }

      /* MESA DE TIRADA */
      .mesa { max-width: 1200px; margin: 2rem auto 0; padding: 0 1rem; }
      .mesa-head {
        display: flex; align-items: center; justify-content: space-between;
        gap: 1rem; margin-bottom: 1.6rem; flex-wrap: wrap;
      }
      .mesa-titulo {
        font-family: 'Poppins', sans-serif; color: var(--texto);
        font-weight: 700; font-size: clamp(1.15rem, 3.6vw, 1.6rem);
        text-align: center; flex: 1; min-width: 180px;
      }
      .btn-ghost {
        background: var(--superficie); border: 1px solid var(--turquesa-borde);
        color: var(--turquesa-fuerte); padding: 0.55rem 1.05rem; border-radius: 8px;
        cursor: pointer; font-family: 'Nunito', sans-serif; font-weight: 700;
        font-size: 0.95rem; transition: all .2s; white-space: nowrap;
        display: inline-flex; align-items: center; gap: 0.4rem;
      }
      .btn-ghost:hover { background: var(--turquesa-suave); border-color: var(--turquesa); }

      .campo-pregunta { max-width: 520px; margin: 0 auto 2.2rem; }
      .campo-pregunta input {
        width: 100%; background: var(--superficie);
        border: 1px solid var(--borde); border-radius: 10px;
        padding: 0.85rem 1.1rem; color: var(--texto);
        font-family: 'Nunito', sans-serif; font-size: 1.02rem;
        text-align: center; transition: border-color .2s;
      }
      .campo-pregunta input::placeholder { color: var(--texto-suave); }
      .campo-pregunta input:focus { outline: none; border-color: var(--turquesa); }

      /* TABLERO LINEAL */
      .tablero-lineal {
        display: flex; flex-wrap: wrap; justify-content: center;
        gap: 1.8rem 1.4rem; margin-bottom: 2rem;
      }
      /* TABLERO GRILLA */
      .tablero-grilla {
        display: grid;
        grid-template-columns: repeat(var(--cols), 1fr);
        gap: 0.6rem; margin: 0 auto 2rem; max-width: 1100px;
      }

      .carta-wrap {
        display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
      }
      .carta-pos {
        font-family: 'Poppins', sans-serif; font-size: 0.66rem; font-weight: 700;
        color: var(--turquesa-fuerte); letter-spacing: 0.04em; text-transform: uppercase;
        text-align: center; max-width: 140px; min-height: 1.6em;
      }
      .carta {
        width: 140px; aspect-ratio: 130 / 206; background: transparent;
        border: none; cursor: pointer; perspective: 1000px; padding: 0;
      }
      .carta-wrap.compacta .carta { width: 100%; }
      .carta-inner {
        position: relative; width: 100%; height: 100%;
        transform-style: preserve-3d; transition: transform .7s cubic-bezier(.2,.8,.2,1);
      }
      .carta.revelada .carta-inner { transform: rotateY(180deg); }
      .carta-cara {
        position: absolute; inset: 0; backface-visibility: hidden;
        border-radius: 9px; overflow: hidden;
        box-shadow: 0 6px 18px rgba(15,60,75,0.16);
        background: var(--superficie);
      }
      .carta-cara img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .carta-dorso { border: 1px solid var(--borde); }
      .carta:hover .carta-dorso { border-color: var(--turquesa); }
      .carta-frente { transform: rotateY(180deg); border: 2px solid var(--dorado); }

      /* brillo holografico que barre la carta al revelarse */
      .carta-brillo {
        position: absolute; inset: 0; pointer-events: none; z-index: 2;
        background: linear-gradient(115deg,
          transparent 32%,
          rgba(255,255,255,0.55) 47%,
          rgba(255,255,255,0.0) 60%);
        transform: translateX(-130%);
      }
      .carta.revelada .carta-brillo { animation: brillo 1s ease 0.45s 1; }
      @keyframes brillo {
        from { transform: translateX(-130%); }
        to { transform: translateX(130%); }
      }
      /* aura dorada palpitante en cartas reveladas (tiradas chicas) */
      .carta-wrap:not(.compacta) .carta.revelada .carta-frente {
        animation: aura 2.6s ease-in-out 0.7s infinite;
      }
      @keyframes aura {
        0%, 100% { box-shadow: 0 6px 18px rgba(15,60,75,0.16); }
        50% { box-shadow: 0 6px 20px rgba(15,60,75,0.16), 0 0 26px rgba(240,201,41,0.55); }
      }

      .carta-label {
        font-family: 'Poppins', sans-serif; font-size: 0.8rem; font-weight: 600;
        color: var(--texto); text-align: center; max-width: 140px; line-height: 1.2;
      }
      .carta-num {
        display: inline-block; background: var(--turquesa); color: #fff;
        border-radius: 50%; width: 1.4em; height: 1.4em; line-height: 1.4em;
        font-size: 0.75rem; text-align: center; font-weight: 700;
      }

      .detalle-carta {
        max-width: 620px; margin: 0 auto 2rem; text-align: center;
        background: var(--superficie); border: 1px solid var(--borde);
        border-left: 4px solid var(--turquesa);
        border-radius: 10px; padding: 1rem 1.3rem; font-size: 1.04rem;
        line-height: 1.5; animation: aparecer .4s forwards;
        box-shadow: 0 4px 16px rgba(15,60,75,0.06);
      }
      .detalle-carta strong { color: var(--turquesa-fuerte); font-family: 'Poppins', sans-serif; }
      .detalle-carta em { color: var(--dorado-fuerte); font-style: normal; font-weight: 700; }

      .btn-secundario, .btn-principal {
        display: flex; align-items: center; justify-content: center; gap: 0.55rem;
        margin: 0 auto 2rem; cursor: pointer;
        font-family: 'Poppins', sans-serif; font-weight: 700; letter-spacing: 0.01em;
        border-radius: 10px; transition: all .25s;
      }
      .btn-secundario {
        background: var(--superficie); border: 1px solid var(--turquesa-borde);
        color: var(--turquesa-fuerte); padding: 0.8rem 1.8rem; font-size: 0.95rem;
      }
      .btn-secundario:hover { background: var(--turquesa-suave); }

      .lectura-box { max-width: 640px; margin: 0 auto; }

      .btn-principal {
        background: linear-gradient(135deg, var(--turquesa), var(--turquesa-claro));
        border: none; color: #ffffff; padding: 1rem 2.2rem;
        font-size: 1.05rem;
        box-shadow: 0 8px 24px rgba(14,157,187,0.35);
      }
      .btn-principal:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 12px 30px rgba(14,157,187,0.45);
      }
      .btn-principal:disabled { opacity: 0.6; cursor: wait; }

      .error {
        background: #fdecec; border: 1px solid var(--rojo);
        color: #8f1917; padding: 0.9rem 1.2rem; border-radius: 10px;
        text-align: center; margin-bottom: 1.5rem; font-size: 1rem;
        word-break: break-word; font-weight: 600;
      }

      .cargando { text-align: center; padding: 2rem 0; }
      .orbe {
        width: 42px; height: 42px; margin: 0 auto 1rem;
        border-radius: 50%;
        border: 4px solid var(--turquesa-suave);
        border-top-color: var(--turquesa);
        animation: girar 0.9s linear infinite;
      }
      @keyframes girar { to { transform: rotate(360deg); } }
      .cargando p { color: var(--texto-suave); font-weight: 600; font-size: 1.05rem; }

      .interpretacion {
        background: var(--superficie);
        border: 1px solid var(--borde); border-top: 4px solid var(--dorado);
        border-radius: 16px;
        padding: 2rem 1.8rem; margin-top: 1rem; animation: aparecer .6s forwards;
        box-shadow: 0 10px 30px rgba(15,60,75,0.08);
      }
      .interpretacion h3 {
        font-family: 'Poppins', sans-serif; color: var(--turquesa-fuerte); font-weight: 700;
        font-size: 1.3rem; margin-bottom: 1.2rem;
        display: flex; align-items: center; justify-content: center; gap: 0.5rem;
      }
      .md p { font-size: 1.08rem; line-height: 1.7; margin-bottom: 1rem; color: var(--texto); }
      .md strong {
        color: var(--turquesa-fuerte); font-family: 'Poppins', sans-serif;
        font-size: 1rem; letter-spacing: 0.01em;
        display: inline-block; margin-top: 0.4rem;
      }

      .paywall {
        text-align: center; max-width: 520px; margin: 1.5rem auto 0;
        background: var(--superficie);
        border: 1px solid var(--borde); border-top: 4px solid var(--rojo);
        border-radius: 18px;
        padding: 2.2rem 1.8rem;
        box-shadow: 0 16px 40px rgba(15,60,75,0.1);
        animation: aparecer .6s forwards;
      }
      .paywall-orn {
        color: var(--dorado-fuerte); margin-bottom: 0.6rem;
        display: flex; justify-content: center;
      }
      .paywall h3 {
        font-family: 'Poppins', sans-serif; color: var(--texto); font-weight: 700;
        font-size: 1.3rem; margin-bottom: 0.9rem;
      }
      .paywall p {
        font-size: 1.05rem; line-height: 1.65; color: var(--texto-suave);
        margin-bottom: 1.3rem;
      }
      .paywall-precio {
        font-family: 'Poppins', sans-serif; color: var(--turquesa-fuerte); font-weight: 800;
        font-size: 2rem; line-height: 1; margin-bottom: 1.4rem;
      }
      .paywall-precio span {
        display: block; font-family: 'Nunito', sans-serif; font-weight: 600;
        font-size: 0.85rem; color: var(--texto-suave);
        letter-spacing: 0.08em; text-transform: uppercase; margin-top: 0.4rem;
      }
      .btn-wa {
        text-decoration: none; display: inline-block;
        background: linear-gradient(135deg, #25d366, #128c4b);
        color: #ffffff; box-shadow: 0 8px 24px rgba(37,211,102,0.3);
      }
      .btn-wa:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 30px rgba(37,211,102,0.4);
      }
      .paywall-nota {
        display: block; margin-top: 1rem; color: var(--texto-suave);
        font-size: 0.92rem; font-weight: 600;
      }

      .footer {
        text-align: center; margin-top: 4rem; padding: 2rem 1rem 0;
        color: var(--texto-suave); font-size: 0.92rem;
        border-top: 1px solid var(--borde); max-width: 600px;
        margin-left: auto; margin-right: auto;
      }
      .footer-marca {
        margin-top: 0.4rem; font-family: 'Poppins', sans-serif;
        font-weight: 700; color: var(--turquesa-fuerte); font-size: 0.85rem;
      }

      /* BANNER COMPARTIR */
      .banner-compartir { max-width: 1040px; margin: 3.5rem auto 0; padding: 0 1rem; }
      .banner-overlay {
        position: relative;
        background-image:
          linear-gradient(90deg, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.78) 42%, rgba(255,255,255,0.12) 100%),
          url('/img/banner-compartir.webp');
        background-size: cover; background-position: center right;
        border: 1px solid var(--borde); border-radius: 18px;
        padding: 2.2rem 2rem; min-height: 190px;
        box-shadow: 0 10px 30px rgba(15,60,75,0.08);
        display: flex; flex-direction: column; justify-content: center;
        align-items: flex-start; gap: 0.7rem;
      }
      .banner-overlay h3 {
        font-family: 'Poppins', sans-serif; color: var(--turquesa-fuerte);
        font-size: 1.35rem; font-weight: 700;
        display: flex; align-items: center; gap: 0.5rem;
      }
      .banner-overlay p { color: var(--texto); max-width: 460px; line-height: 1.55; font-size: 1.02rem; }
      .btn-banner {
        display: inline-flex; align-items: center; gap: 0.4rem;
        background: linear-gradient(135deg, var(--turquesa), var(--turquesa-claro));
        color: #fff; border: none; padding: 0.75rem 1.5rem; border-radius: 10px;
        font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 0.95rem;
        cursor: pointer; box-shadow: 0 8px 20px rgba(14,157,187,0.3); transition: all .2s;
      }
      .btn-banner:hover { transform: translateY(-2px); box-shadow: 0 12px 26px rgba(14,157,187,0.42); }
      @media (max-width: 620px) {
        .banner-overlay {
          background-image:
            linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.72) 100%),
            url('/img/banner-compartir.webp');
          text-align: center; align-items: center;
        }
        .banner-overlay p { text-align: center; }
      }

      @keyframes subir { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes aparecer { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

      @media (max-width: 640px) {
        .carta { width: 120px; }
        .tablero-lineal { gap: 1.4rem 1rem; }
        .tablero-grilla { gap: 0.35rem; }
        .carta-cara { border-radius: 6px; }
        .carta-frente { border-width: 1px; }
      }
    `}</style>
  );
}
