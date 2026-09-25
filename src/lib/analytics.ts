"use client";

/**
 * Eventos de conversão instalados desde o lançamento (Meta Pixel + GA4), tal
 * como pedido: início do quiz, conclusão da Fase 1, resultado revelado,
 * formulário CRM submetido, partilha WhatsApp, clique em falar com
 * consultor. Ver components/Analytics.tsx para a instalação dos scripts.
 */
export type EventoAnalytics =
  | "quiz_iniciado"
  | "fase1_concluida"
  | "resultado_revelado"
  | "crm_submetido"
  | "partilha_whatsapp_clicada"
  | "partilha_instagram_clicada"
  | "consultor_clicado";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function registarEvento(
  evento: EventoAnalytics,
  params?: Record<string, string | number | boolean | undefined>
) {
  if (typeof window === "undefined") return;

  try {
    window.gtag?.("event", evento, params);
    window.fbq?.("trackCustom", evento, params);
  } catch {
    // Analytics nunca deve partir o fluxo do quiz.
  }
}
