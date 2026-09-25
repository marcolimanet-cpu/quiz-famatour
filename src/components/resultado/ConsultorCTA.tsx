"use client";

import { registarSinal } from "@/lib/sinais";
import { registarEvento } from "@/lib/analytics";

interface ConsultorCTAProps {
  /** Omitido em contextos sem participação associada (ex: /guia/[destino] aberto sem ?p=). */
  participacaoId?: string;
  nomeDestino: string;
  /** Texto do botão — cada ecrã onde este CTA aparece pode enquadrar a chamada de forma diferente. */
  texto?: string;
}

/**
 * Atalho para contacto humano imediato — visível logo a seguir ao
 * resultado, nunca escondido num menu. Não é chatbot nem automação: é o
 * WhatsApp direto de um humano da equipa Famatour.
 */
export function ConsultorCTA({
  participacaoId,
  nomeDestino,
  texto = "Fala com um especialista Famatour",
}: ConsultorCTAProps) {
  const numero = process.env.NEXT_PUBLIC_WHATSAPP_CONSULTOR_NUMERO;

  if (!numero) {
    return (
      <p className="rounded-xl border-2 border-dashed border-azul-200 p-4 text-center text-sm text-azul-600">
        [PLACEHOLDER] Configura NEXT_PUBLIC_WHATSAPP_CONSULTOR_NUMERO para
        ativar o botão &quot;Fala com um especialista Famatour&quot;.
      </p>
    );
  }

  const mensagem = `Olá, acabei de fazer o quiz e o meu destino foi ${nomeDestino}, gostava de saber mais`;
  const link = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

  function clicar() {
    if (participacaoId) registarSinal(participacaoId, "consultor_whatsapp_clicado");
    registarEvento("consultor_clicado", { destino: nomeDestino });
  }

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={clicar}
      className="flex items-center justify-center gap-2 rounded-full bg-azul-900 px-6 py-4 text-lg font-semibold text-white shadow-lg shadow-azul-900/30 transition-transform hover:scale-[1.02] hover:bg-azul-800 active:scale-[0.98]"
    >
      {texto}
    </a>
  );
}
