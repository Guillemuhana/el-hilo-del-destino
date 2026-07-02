import React, { useState, useRef } from "react";
import { IMAGENES } from "./imagenesCartas.js";

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
  },
  tres: {
    nombre: "Tirada de 3 Cartas",
    desc: "Pasado, presente y futuro, o una situación de un vistazo.",
    n: 3,
    tipo: "lineal",
    posiciones: ["Pasado / Origen", "Presente / Situación", "Futuro / Resultado"],
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
  },
  gran_tableau: {
    nombre: "Gran Tableau (36)",
    desc: "La tirada completa: las 36 cartas. Lectura magistral.",
    n: 36,
    tipo: "grilla",
    filas: 4,
    cols: 9,
    posiciones: Array.from({ length: 36 }, (_, i) => `Posición ${i + 1}`),
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

function Carta({ carta, posicion, revelada, onClick, delay, compacta }) {
  return (
    <div
      className={`carta-wrap ${compacta ? "compacta" : ""}`}
      style={{ animationDelay: `${delay}ms` }}
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
          </div>
        </div>
      </button>
      {revelada && !compacta && (
        <div className="carta-label">
          <span className="carta-num">{carta.id}</span> {carta.nombre}
        </div>
      )}
    </div>
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

  function revelar(i) {
    if (compacta && reveladas[i]) {
      setDetalle(cartas[i]);
      return;
    }
    setReveladas((r) => ({ ...r, [i]: true }));
    if (compacta) setDetalle(cartas[i]);
  }

  function revelarTodas() {
    const all = {};
    cartas.forEach((_, i) => (all[i] = true));
    setReveladas(all);
  }

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
      <div className="estrellas" />

      <header className="header">
        <h1 className="titulo" onClick={volver}>
          <span className="titulo-orn">✦</span> El Hilo del Destino{" "}
          <span className="titulo-orn">✦</span>
        </h1>
        <p className="subtitulo">Lectura de Lenormand · 36 cartas</p>
      </header>

      {pantalla === "inicio" && (
        <main className="inicio">
          <p className="intro">
            El oráculo Lenormand se lee combinando las cartas entre sí. Elegí
            una tirada: se mezcla la baraja y la interpretación la genera la
            inteligencia artificial leyendo las combinaciones.
          </p>
          <div className="grid-tiradas">
            {Object.entries(TIRADAS).map(([key, t], idx) => (
              <button
                key={key}
                className="tirada-card"
                style={{ animationDelay: `${idx * 90}ms` }}
                onClick={() => iniciar(key)}
              >
                <span className="tirada-num">{t.n}</span>
                <span className="tirada-nombre">{t.nombre}</span>
                <span className="tirada-desc">{t.desc}</span>
                <span className="tirada-cta">Tirar →</span>
              </button>
            ))}
          </div>
        </main>
      )}

      {pantalla === "tirada" && tirada && (
        <main className="mesa">
          <div className="mesa-head">
            <button className="btn-ghost" onClick={volver}>
              ← Volver
            </button>
            <h2 className="mesa-titulo">{tirada.nombre}</h2>
            <button className="btn-ghost" onClick={() => iniciar(tiradaKey)}>
              ↻ Remezclar
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
                onClick={() => revelar(i)}
                delay={compacta ? i * 30 : i * 120}
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
              Dar vuelta todas las cartas
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
                  {cargando
                    ? "Leyendo las combinaciones…"
                    : "✦ Interpretar la tirada"}
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
                  <h3>✦ Tu lectura ✦</h3>
                  <Markdown texto={interpretacion} />
                </div>
              )}

              {debePagar && (
                <div className="paywall" ref={resultRef}>
                  <div className="paywall-orn">🔮</div>
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
                    Continuar por WhatsApp →
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

      <footer className="footer">
        Las cartas son un espejo, no un destino. Confiá en tu criterio.
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
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Cinzel:wght@400;500;700&display=swap');

      * { box-sizing: border-box; margin: 0; padding: 0; }

      .app {
        --noche: #0a0612;
        --oro: #c8a24a;
        --oro-claro: #e8c874;
        --oro-tenue: rgba(200,162,74,0.35);
        --texto: #e8e0d0;
        --texto-tenue: #9a8f9f;
        min-height: 100vh;
        background:
          radial-gradient(ellipse at 50% -10%, #241636 0%, transparent 55%),
          radial-gradient(ellipse at 80% 110%, #1a1030 0%, transparent 50%),
          var(--noche);
        color: var(--texto);
        font-family: 'Cormorant Garamond', serif;
        position: relative; overflow-x: hidden;
        padding: 0 1rem 4rem;
      }

      .estrellas {
        position: fixed; inset: 0; pointer-events: none; z-index: 0;
        background-image:
          radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.6), transparent),
          radial-gradient(1px 1px at 60% 70%, rgba(255,255,255,0.4), transparent),
          radial-gradient(1.5px 1.5px at 80% 20%, rgba(232,200,116,0.5), transparent),
          radial-gradient(1px 1px at 35% 85%, rgba(255,255,255,0.5), transparent),
          radial-gradient(1px 1px at 90% 60%, rgba(255,255,255,0.3), transparent),
          radial-gradient(1.5px 1.5px at 10% 60%, rgba(232,200,116,0.4), transparent);
        animation: titilar 6s ease-in-out infinite alternate;
      }
      @keyframes titilar { from { opacity: 0.5; } to { opacity: 1; } }

      .header, .inicio, .mesa, .footer { position: relative; z-index: 1; }

      .header { text-align: center; padding: 3rem 0 1.5rem; }
      .titulo {
        font-family: 'Cinzel', serif; font-weight: 700;
        font-size: clamp(2rem, 6vw, 3.3rem);
        letter-spacing: 0.14em; cursor: pointer;
        color: var(--oro-claro);
        text-shadow: 0 0 25px rgba(200,162,74,0.35);
      }
      .titulo-orn { color: var(--oro); font-size: 0.6em; vertical-align: middle; }
      .subtitulo {
        color: var(--texto-tenue); letter-spacing: 0.3em;
        text-transform: uppercase; font-size: 0.72rem; margin-top: 0.5rem;
      }

      .intro {
        max-width: 560px; margin: 0 auto 2.5rem; text-align: center;
        font-size: 1.18rem; line-height: 1.7; color: var(--texto-tenue);
      }

      .grid-tiradas {
        display: grid; gap: 1.2rem; max-width: 920px; margin: 0 auto;
        grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      }
      .tirada-card {
        background: linear-gradient(160deg, rgba(42,26,74,0.5), rgba(20,11,36,0.7));
        border: 1px solid var(--oro-tenue);
        border-radius: 14px; padding: 1.7rem 1.4rem;
        cursor: pointer; text-align: left; color: var(--texto);
        display: flex; flex-direction: column; gap: 0.5rem;
        transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s, border-color .35s;
        opacity: 0; animation: subir 0.6s forwards; position: relative; overflow: hidden;
      }
      .tirada-card::before {
        content: ''; position: absolute; inset: 0;
        background: radial-gradient(circle at 50% 0%, rgba(200,162,74,0.12), transparent 70%);
        opacity: 0; transition: opacity .35s;
      }
      .tirada-card:hover {
        transform: translateY(-6px); border-color: var(--oro);
        box-shadow: 0 18px 50px rgba(0,0,0,0.5), 0 0 25px rgba(200,162,74,0.15);
      }
      .tirada-card:hover::before { opacity: 1; }
      .tirada-num {
        font-family: 'Cinzel', serif; font-size: 2.2rem; color: var(--oro);
        line-height: 1; opacity: 0.85;
      }
      .tirada-nombre {
        font-family: 'Cinzel', serif; font-size: 1.2rem;
        color: var(--oro-claro); letter-spacing: 0.03em;
      }
      .tirada-desc { color: var(--texto-tenue); font-size: 1.02rem; line-height: 1.5; flex: 1; }
      .tirada-cta { color: var(--oro); font-size: 1rem; margin-top: 0.4rem; letter-spacing: 0.05em; }

      .mesa { max-width: 1200px; margin: 0 auto; }
      .mesa-head {
        display: flex; align-items: center; justify-content: space-between;
        gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;
      }
      .mesa-titulo {
        font-family: 'Cinzel', serif; color: var(--oro-claro);
        font-size: clamp(1.2rem, 4vw, 1.9rem); letter-spacing: 0.05em;
        text-align: center; flex: 1; min-width: 180px;
      }
      .btn-ghost {
        background: transparent; border: 1px solid var(--oro-tenue);
        color: var(--oro); padding: 0.5rem 1rem; border-radius: 8px;
        cursor: pointer; font-family: 'Cormorant Garamond', serif;
        font-size: 1rem; transition: all .25s; white-space: nowrap;
      }
      .btn-ghost:hover { background: rgba(200,162,74,0.12); border-color: var(--oro); }

      .campo-pregunta { max-width: 520px; margin: 0 auto 2.5rem; }
      .campo-pregunta input {
        width: 100%; background: rgba(20,11,36,0.7);
        border: 1px solid var(--oro-tenue); border-radius: 10px;
        padding: 0.9rem 1.2rem; color: var(--texto);
        font-family: 'Cormorant Garamond', serif; font-size: 1.12rem;
        text-align: center; transition: border-color .25s;
      }
      .campo-pregunta input::placeholder { color: var(--texto-tenue); }
      .campo-pregunta input:focus { outline: none; border-color: var(--oro); }

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
        opacity: 0; animation: aparecer 0.6s forwards;
      }
      .carta-pos {
        font-family: 'Cinzel', serif; font-size: 0.68rem;
        color: var(--oro); letter-spacing: 0.06em; text-transform: uppercase;
        text-align: center; max-width: 140px; min-height: 1.6em;
      }
      .carta {
        width: 140px; aspect-ratio: 130 / 206; background: transparent;
        border: none; cursor: pointer; perspective: 1000px; padding: 0;
      }
      .carta-wrap.compacta .carta { width: 100%; }
      .carta-inner {
        position: relative; width: 100%; height: 100%;
        transform-style: preserve-3d; transition: transform .8s cubic-bezier(.2,.8,.2,1);
      }
      .carta.revelada .carta-inner { transform: rotateY(180deg); }
      .carta-cara {
        position: absolute; inset: 0; backface-visibility: hidden;
        border-radius: 9px; overflow: hidden;
        box-shadow: 0 6px 20px rgba(0,0,0,0.5);
      }
      .carta-cara img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .carta-dorso { border: 1px solid var(--oro-tenue); }
      .carta:hover .carta-dorso { border-color: var(--oro); }
      .carta-frente { transform: rotateY(180deg); border: 2px solid var(--oro); }

      .carta-label {
        font-family: 'Cinzel', serif; font-size: 0.8rem; color: var(--oro-claro);
        text-align: center; max-width: 140px; line-height: 1.2;
      }
      .carta-num {
        display: inline-block; background: var(--oro); color: #1a1030;
        border-radius: 50%; width: 1.4em; height: 1.4em; line-height: 1.4em;
        font-size: 0.75rem; text-align: center; font-weight: 700;
      }

      .detalle-carta {
        max-width: 620px; margin: 0 auto 2rem; text-align: center;
        background: rgba(20,11,36,0.6); border: 1px solid var(--oro-tenue);
        border-radius: 10px; padding: 1rem 1.3rem; font-size: 1.1rem;
        line-height: 1.5; animation: aparecer .4s forwards;
      }
      .detalle-carta strong { color: var(--oro-claro); font-family: 'Cinzel', serif; }
      .detalle-carta em { color: var(--oro); }

      .btn-secundario, .btn-principal {
        display: block; margin: 0 auto 2rem; cursor: pointer;
        font-family: 'Cinzel', serif; letter-spacing: 0.08em;
        border-radius: 10px; transition: all .3s;
      }
      .btn-secundario {
        background: transparent; border: 1px solid var(--oro);
        color: var(--oro); padding: 0.8rem 1.8rem; font-size: 0.95rem;
      }
      .btn-secundario:hover { background: rgba(200,162,74,0.12); }

      .lectura-box { max-width: 640px; margin: 0 auto; }
      .campo-apikey { margin-bottom: 1.5rem; text-align: center; }
      .campo-apikey label {
        display: block; color: var(--oro); font-family: 'Cinzel', serif;
        font-size: 0.82rem; letter-spacing: 0.1em; margin-bottom: 0.5rem;
        text-transform: uppercase;
      }
      .campo-apikey input {
        width: 100%; max-width: 360px; background: rgba(20,11,36,0.7);
        border: 1px solid var(--oro-tenue); border-radius: 10px;
        padding: 0.8rem 1rem; color: var(--texto); font-family: monospace;
        font-size: 0.95rem; text-align: center;
      }
      .campo-apikey input:focus { outline: none; border-color: var(--oro); }
      .campo-apikey small { display: block; margin-top: 0.6rem; color: var(--texto-tenue); }
      .campo-apikey a { color: var(--oro); }

      .btn-principal {
        background: linear-gradient(135deg, var(--oro), var(--oro-claro));
        border: none; color: #1a1030; padding: 1rem 2.2rem;
        font-size: 1.05rem; font-weight: 500;
        box-shadow: 0 8px 30px rgba(200,162,74,0.3);
      }
      .btn-principal:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 12px 38px rgba(200,162,74,0.45);
      }
      .btn-principal:disabled { opacity: 0.6; cursor: wait; }

      .error {
        background: rgba(120,30,40,0.3); border: 1px solid #a04050;
        color: #f0b0b8; padding: 0.9rem 1.2rem; border-radius: 10px;
        text-align: center; margin-bottom: 1.5rem; font-size: 1.02rem;
        word-break: break-word;
      }

      .cargando { text-align: center; padding: 2rem 0; }
      .orbe {
        width: 50px; height: 50px; margin: 0 auto 1rem; border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, var(--oro-claro), var(--oro));
        box-shadow: 0 0 30px rgba(200,162,74,0.6);
        animation: pulsar 1.4s ease-in-out infinite;
      }
      @keyframes pulsar {
        0%,100% { transform: scale(0.85); opacity: 0.7; }
        50% { transform: scale(1.15); opacity: 1; }
      }
      .cargando p { color: var(--texto-tenue); font-style: italic; font-size: 1.1rem; }

      .interpretacion {
        background: linear-gradient(160deg, rgba(42,26,74,0.4), rgba(20,11,36,0.6));
        border: 1px solid var(--oro-tenue); border-radius: 16px;
        padding: 2rem 1.8rem; margin-top: 1rem; animation: aparecer .8s forwards;
      }
      .interpretacion h3 {
        font-family: 'Cinzel', serif; color: var(--oro-claro);
        text-align: center; font-size: 1.4rem; margin-bottom: 1.2rem;
        letter-spacing: 0.05em;
      }
      .md p { font-size: 1.16rem; line-height: 1.75; margin-bottom: 1rem; color: var(--texto); }
      .md strong {
        color: var(--oro-claro); font-family: 'Cinzel', serif;
        font-size: 1.05rem; letter-spacing: 0.04em;
        display: inline-block; margin-top: 0.4rem;
      }

      .paywall {
        text-align: center; max-width: 520px; margin: 1.5rem auto 0;
        background: linear-gradient(160deg, rgba(42,26,74,0.55), rgba(20,11,36,0.7));
        border: 1px solid var(--oro); border-radius: 18px;
        padding: 2.2rem 1.8rem;
        box-shadow: 0 18px 50px rgba(0,0,0,0.5), 0 0 30px rgba(200,162,74,0.12);
        animation: aparecer .7s forwards;
      }
      .paywall-orn { font-size: 2.6rem; margin-bottom: 0.6rem; }
      .paywall h3 {
        font-family: 'Cinzel', serif; color: var(--oro-claro);
        font-size: 1.4rem; letter-spacing: 0.04em; margin-bottom: 0.9rem;
      }
      .paywall p {
        font-size: 1.14rem; line-height: 1.7; color: var(--texto);
        margin-bottom: 1.3rem;
      }
      .paywall-precio {
        font-family: 'Cinzel', serif; color: var(--oro-claro);
        font-size: 2.1rem; line-height: 1; margin-bottom: 1.4rem;
      }
      .paywall-precio span {
        display: block; font-family: 'Cormorant Garamond', serif;
        font-size: 0.95rem; color: var(--texto-tenue);
        letter-spacing: 0.1em; text-transform: uppercase; margin-top: 0.4rem;
      }
      .btn-wa {
        text-decoration: none; display: inline-block;
        background: linear-gradient(135deg, #25d366, #128c4b);
        color: #ffffff; box-shadow: 0 8px 30px rgba(37,211,102,0.35);
      }
      .btn-wa:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 38px rgba(37,211,102,0.5);
      }
      .paywall-nota {
        display: block; margin-top: 1rem; color: var(--texto-tenue);
        font-style: italic; font-size: 0.98rem;
      }

      .footer {
        text-align: center; margin-top: 4rem; padding-top: 2rem;
        color: var(--texto-tenue); font-style: italic; font-size: 1rem;
        border-top: 1px solid rgba(200,162,74,0.12); max-width: 600px;
        margin-left: auto; margin-right: auto;
      }

      @keyframes subir { from { opacity: 0; transform: translateY(25px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes aparecer { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }

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
