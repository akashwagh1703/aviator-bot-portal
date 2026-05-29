/**
 * OpenRouter API utility (server-side only).
 *
 * Thin, reusable wrapper around the OpenRouter chat-completions endpoint with
 * streaming support. Model and endpoint are configurable via env so swapping
 * providers/models later requires no code changes.
 */

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";

/**
 * Call OpenRouter with streaming enabled.
 * @returns {Promise<Response>} the raw streaming fetch Response (SSE body).
 * @throws {Error} with a `.status` property on non-2xx responses.
 */
export async function streamChatCompletion({ messages, model = DEFAULT_MODEL }) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    const err = new Error("OPENROUTER_API_KEY is not configured on the server.");
    err.status = 500;
    err.code = "NO_API_KEY";
    throw err;
  }

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      // Optional attribution headers recommended by OpenRouter.
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": process.env.NEXT_PUBLIC_APP_NAME || "Aether AI",
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
      temperature: 0.7,
    }),
  });

  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => "");
    const err = new Error(`OpenRouter request failed (${res.status}): ${text.slice(0, 300)}`);
    err.status = res.status || 502;
    throw err;
  }

  return res;
}

export { DEFAULT_MODEL };
