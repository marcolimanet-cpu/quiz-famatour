"use client";

export type SinalComportamento =
  | "guia_aberto_completo"
  | "partilha_whatsapp_clicada"
  | "consultor_whatsapp_clicado";

/**
 * Dispara um sinal de comportamento sem bloquear a UI nem depender da
 * página continuar aberta (fetch keepalive sobrevive à navegação/fecho).
 */
export function registarSinal(participacaoId: string, sinal: SinalComportamento) {
  try {
    fetch("/api/sinais", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participacaoId, sinal }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Sinais de comportamento nunca devem partir a experiência do utilizador.
  }
}
