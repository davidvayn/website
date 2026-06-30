import { GoogleGenAI } from "@google/genai";
import { buildSystemInstruction } from "@/lib/corpus";

export const runtime = "nodejs";

// Gemini model. There is no plain `gemini-3.1-flash` text model; the 3.1 flash
// family is "flash-lite" for text generation. Swap here to change models
// (e.g. "gemini-3.5-flash" for the newer full-flash tier).
const MODEL = "gemini-3.1-flash-lite";

const MAX_QUERY_LENGTH = 300;

// Best-effort in-memory rate limit. Note: serverless instances don't share
// memory, so this caps abuse per-instance, not globally. For a hard global
// limit, swap in @upstash/ratelimit (see plan). Good enough for a low-traffic
// personal site alongside the input cap and the scoped system instruction.
const RATE_LIMIT = 12; // requests
const RATE_WINDOW_MS = 60_000; // per minute
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "AI search is not configured (missing GEMINI_API_KEY)." },
      { status: 500 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return Response.json(
      { error: "Too many requests. Please slow down." },
      { status: 429 },
    );
  }

  let query: unknown;
  try {
    ({ query } = await request.json());
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (typeof query !== "string" || query.trim().length === 0) {
    return Response.json(
      { error: "A non-empty 'query' string is required." },
      { status: 400 },
    );
  }
  if (query.length > MAX_QUERY_LENGTH) {
    return Response.json(
      { error: `Query must be at most ${MAX_QUERY_LENGTH} characters.` },
      { status: 400 },
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  let geminiStream;
  try {
    geminiStream = await ai.models.generateContentStream({
      model: MODEL,
      contents: query,
      config: {
        systemInstruction: buildSystemInstruction(),
        maxOutputTokens: 512,
      },
    });
  } catch (err) {
    console.error("Gemini request failed:", err);
    return Response.json(
      { error: "AI search is temporarily unavailable." },
      { status: 502 },
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of geminiStream) {
          const text = chunk.text;
          if (text) controller.enqueue(encoder.encode(text));
        }
      } catch (err) {
        console.error("Gemini stream error:", err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
