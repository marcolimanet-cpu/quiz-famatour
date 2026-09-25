import { headers } from "next/headers";

/**
 * URL base absoluta do site (sem "/" final), para construir links que têm
 * de funcionar fora do browser onde foram gerados — partilha no WhatsApp,
 * payload do webhook de automação, Open Graph.
 *
 * Prioriza NEXT_PUBLIC_SITE_URL, mas ignora-a se estiver definida como
 * string vazia (não só `undefined`): `env ?? fallback` não apanha esse
 * caso, e foi exatamente isso que gerou links relativos ("/resultado/xyz")
 * partilhados no WhatsApp em produção. O host do pedido serve de rede de
 * segurança para todos os ambientes (preview da Vercel, local) onde a
 * variável não esteja configurada.
 */
export async function urlBaseAbsoluta(): Promise<string> {
  const configurado = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configurado) return configurado.replace(/\/+$/, "");

  const headersList = await headers();
  const host = headersList.get("host");
  if (!host) return "";

  const protocolo = process.env.NODE_ENV === "development" ? "http" : "https";
  return `${protocolo}://${host}`;
}
