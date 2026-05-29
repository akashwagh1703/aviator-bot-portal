/**
 * POST /api/chat
 *
 * Accepts { messages, system, model } and proxies a streaming completion from
 * OpenRouter back to the client as a plain text stream of token deltas. The
 * client renders these progressively (ChatGPT-style) — no waiting for the full
 * response. The API key never leaves the server.
 */

import { streamChatCompletion } from "@/lib/openrouter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  let payload;
  try {
    payload = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { messages = [], system, model } = payload;

  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "`messages` is required." }, { status: 400 });
  }

  // Prepend the configurable system/personality prompt.
  const finalMessages = system
    ? [{ role: "system", content: system }, ...messages]
    : messages;

  let upstream;
  try {
    upstream = await streamChatCompletion({ messages: finalMessages, model });
  } catch (err) {
    const status = err.status || 502;
    const message =
      err.code === "NO_API_KEY"
        ? "AI is not configured. Add OPENROUTER_API_KEY to your environment."
        : "The AI service is currently unavailable. Please try again.";
    return Response.json({ error: message }, { status });
  }

  // Transform OpenRouter's SSE stream into a clean text-delta stream.
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body.getReader();
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const data = trimmed.replace(/^data:\s*/, "");
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const json = JSON.parse(data);
              const delta = json.choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(delta));
            } catch {
              // Ignore keep-alive comments / partial chunks.
            }
          }
        }
        controller.close();
      } catch (e) {
        controller.error(e);
      } finally {
        reader.releaseLock();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
