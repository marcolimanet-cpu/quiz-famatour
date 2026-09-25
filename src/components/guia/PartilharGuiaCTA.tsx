"use client";

import { registarSinal } from "@/lib/sinais";
import { registarEvento } from "@/lib/analytics";
import type { Destino } from "@/types/quiz";

interface PartilharGuiaCTAProps {
  participacaoId?: string;
  destino: Destino;
  linkGuia: string;
}

/**
 * Convite a um amigo para ver este guia — mesma lógica de partilha do botão
 * WhatsApp do ecrã de resultado, mas a apontar para o próprio guia (página
 * pública, sem dados do participante — ver README) em vez do link de
 * resultado pessoal, que não faz sentido partilhar a partir daqui.
 */
export function PartilharGuiaCTA({ participacaoId, destino, linkGuia }: PartilharGuiaCTAProps) {
  const mensagem = `Vê este guia de ${destino.nomeCompleto} da Famatour, acho que vais gostar: ${linkGuia}`;
  const linkWhatsapp = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;

  function clicar() {
    if (participacaoId) registarSinal(participacaoId, "partilha_whatsapp_clicada");
    registarEvento("partilha_whatsapp_clicada", { destino: destino.chave });
  }

  return (
    <a
      href={linkWhatsapp}
      target="_blank"
      rel="noopener noreferrer"
      onClick={clicar}
      className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-4 text-lg font-semibold text-white shadow-lg shadow-[#25D366]/30 transition-transform hover:scale-[1.02] active:scale-[0.98]"
    >
      Partilhar com um amigo
    </a>
  );
}
