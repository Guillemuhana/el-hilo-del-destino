// Función serverless de Vercel.
// Recibe el prompt desde el frontend y consulta a Groq usando la API key
// guardada como variable de entorno (GROQ_API_KEY). Así la key NUNCA
// queda expuesta en el navegador del cliente.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método no permitido." });
    return;
  }

  try {
    const { prompt, maxTokens, servicio } = req.body || {};
    if (!prompt) {
      res.status(400).json({ error: "Falta el prompt." });
      return;
    }

    // El horóscopo puede usar una API key de Groq propia
    // (GROQ_API_KEY_HOROSCOPO). Si no está seteada, cae en la key general.
    const apiKey =
      servicio === "horoscopo"
        ? process.env.GROQ_API_KEY_HOROSCOPO || process.env.GROQ_API_KEY
        : process.env.GROQ_API_KEY;

    if (!apiKey) {
      res
        .status(500)
        .json({ error: "El servidor no tiene configurada la GROQ_API_KEY." });
      return;
    }

    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.9,
        max_tokens: maxTokens || 1600,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!r.ok) {
      const txt = await r.text();
      res
        .status(r.status)
        .json({ error: `Groq ${r.status}: ${txt.slice(0, 300)}` });
      return;
    }

    const data = await r.json();
    const texto = data?.choices?.[0]?.message?.content;
    if (!texto) {
      res.status(502).json({ error: "Respuesta vacía de Groq." });
      return;
    }

    res.status(200).json({ texto });
  } catch (e) {
    res.status(500).json({ error: e.message || "Error interno del servidor." });
  }
}
