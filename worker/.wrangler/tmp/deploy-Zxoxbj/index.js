// src/index.js
var ALLOWED_ORIGIN = "https://markovw.github.io";
var API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
var CORS_HEADERS = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
var index_default = {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: CORS_HEADERS });
    }
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
      });
    }
    const { prompt, model, ratio } = body;
    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return new Response(JSON.stringify({ error: "prompt is required" }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
      });
    }
    const allowedModels = [
      "gemini-2.0-flash-preview-image-generation",
      "gemini-2.5-flash-preview-image-generation"
    ];
    const safeModel = allowedModels.includes(model) ? model : allowedModels[0];
    const allowedRatios = ["1:1", "16:9", "9:16", "4:3", "3:4"];
    const safeRatio = allowedRatios.includes(ratio) ? ratio : "1:1";
    const geminiBody = {
      contents: [{ parts: [{ text: prompt.trim() }] }],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
        imageConfig: { aspectRatio: safeRatio }
      }
    };
    try {
      const upstream = await fetch(
        `${API_BASE}/${safeModel}:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(geminiBody)
        }
      );
      const data = await upstream.json();
      return new Response(JSON.stringify(data), {
        status: upstream.status,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Upstream request failed" }), {
        status: 502,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
      });
    }
  }
};
export {
  index_default as default
};
//# sourceMappingURL=index.js.map
