import type { NextRequest } from "next/server";
import { runAudit, AuditError } from "@/lib/a11y/audit";
import { checkRateLimit, getClientIp } from "@/lib/quickscan/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Ongeldige invoer." }, { status: 400 });
  }

  const url = (body?.url ?? "").toString();
  if (!url) {
    return Response.json({ error: "URL is verplicht." }, { status: 400 });
  }

  // Rate limiting: 6 audits per IP per 10 min
  const ip = getClientIp(request);
  const rate = checkRateLimit(`a11y:${ip}`, 6, 10 * 60 * 1000);
  if (!rate.allowed) {
    return Response.json(
      {
        error: `Te veel audits in korte tijd. Probeer het opnieuw over ${rate.retryAfterSeconds} seconden.`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfterSeconds) },
      }
    );
  }

  try {
    const report = await runAudit(url);
    return Response.json(report);
  } catch (err) {
    if (err instanceof AuditError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    console.error("[a11y/scan] unexpected error", err);
    return Response.json(
      { error: "Onverwachte fout tijdens de audit." },
      { status: 500 }
    );
  }
}
