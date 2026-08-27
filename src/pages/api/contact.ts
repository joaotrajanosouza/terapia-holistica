import type { APIRoute } from 'astro';

export const prerender = false;

// Rate limiting simples em memória por IP — suficiente para o volume de
// um site institucional. Para tráfego maior, mover para Cloudflare
// Turnstile + KV ou um serviço dedicado (ex.: Upstash Ratelimit).
const requestLog = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > MAX_REQUESTS_PER_WINDOW;
}

function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 13;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (isRateLimited(clientAddress ?? 'unknown')) {
    return new Response(JSON.stringify({ error: 'Muitas tentativas. Tente novamente em instantes.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: { name?: string; whatsapp?: string; email?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Corpo inválido.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const name = (body.name ?? '').trim();
  const whatsapp = (body.whatsapp ?? '').trim();
  const email = (body.email ?? '').trim();

  if (!name || name.length > 120) {
    return new Response(JSON.stringify({ error: 'Nome inválido.' }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (!isValidPhone(whatsapp)) {
    return new Response(JSON.stringify({ error: 'WhatsApp inválido.' }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: 'E-mail inválido.' }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Aqui entra o envio real: e-mail transacional (Resend/Postmark) e/ou
  // notificação no WhatsApp Business API. Nunca logar nome/telefone/e-mail
  // em texto plano em ferramentas de analytics ou logs persistentes.
  // await sendNotification({ name, whatsapp, email });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
