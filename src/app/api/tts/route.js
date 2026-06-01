/**
 * POST /api/tts
 *
 * Synthesizes speech with Microsoft Edge neural voices (free, no API key).
 * Indian voices: Neerja, Prabhat (en-IN), Swara, Madhur (hi-IN).
 */

import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import { textForSpeech } from "@/lib/tts/sanitize";
import { resolveNeuralVoice } from "@/lib/tts/resolveVoice";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_CHARS = 4000;

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

export async function POST(req) {
  if (process.env.TTS_PROVIDER === "browser") {
    return Response.json({ error: "Server TTS is disabled." }, { status: 503 });
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const raw = payload.text;
  const text = textForSpeech(typeof raw === "string" ? raw : "");
  if (!text) {
    return Response.json({ error: "`text` is required." }, { status: 400 });
  }

  const input = text.length > MAX_CHARS ? `${text.slice(0, MAX_CHARS)}…` : text;
  const voiceName =
    payload.voice ||
    resolveNeuralVoice({ lang: payload.lang, gender: payload.gender, neural: payload.neural });

  const prosody = {};
  if (payload.rate != null) prosody.rate = payload.rate;
  if (payload.pitch != null) prosody.pitch = payload.pitch;
  if (payload.volume != null) prosody.volume = payload.volume;

  const tts = new MsEdgeTTS();

  try {
    await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
    const { audioStream } = tts.toStream(input, prosody);
    const buffer = await streamToBuffer(audioStream);

    return new Response(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[tts]", err);
    return Response.json(
      { error: err.message || "Speech synthesis failed." },
      { status: 502 }
    );
  } finally {
    try {
      tts.close();
    } catch {}
  }
}
