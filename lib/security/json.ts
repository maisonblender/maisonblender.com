/**
 * JSON parsing met body-size limit. Beschermt tegen oversized payloads die
 * serverless functions zouden kunnen opblazen / DoS uitlokken op de
 * Anthropic / Resend / Twenty calls die erna komen.
 *
 * Default limit: 64 KB — ruim voldoende voor onze formulieren (de quickscan
 * payload ligt typisch onder 10 KB).
 */

const DEFAULT_MAX_BYTES = 64 * 1024;

interface ParseSuccess<T> {
  ok: true;
  data: T;
}
interface ParseError {
  ok: false;
  response: Response;
}

export async function readJsonBody<T = unknown>(
  request: Request,
  maxBytes: number = DEFAULT_MAX_BYTES
): Promise<ParseSuccess<T> | ParseError> {
  const contentLengthHeader = request.headers.get("content-length");
  if (contentLengthHeader) {
    const declared = Number(contentLengthHeader);
    if (Number.isFinite(declared) && declared > maxBytes) {
      return {
        ok: false,
        response: Response.json(
          { error: "Payload te groot." },
          { status: 413 }
        ),
      };
    }
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return {
      ok: false,
      response: Response.json({ error: "Ongeldige invoer." }, { status: 400 }),
    };
  }

  // Tweede check op werkelijk ontvangen bytes (Content-Length header is niet
  // verplicht, en kan liegen).
  if (raw.length > maxBytes) {
    return {
      ok: false,
      response: Response.json({ error: "Payload te groot." }, { status: 413 }),
    };
  }

  try {
    const data = JSON.parse(raw) as T;
    return { ok: true, data };
  } catch {
    return {
      ok: false,
      response: Response.json({ error: "Ongeldige invoer." }, { status: 400 }),
    };
  }
}
