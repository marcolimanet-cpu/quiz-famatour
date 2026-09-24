"use client";

import { useState } from "react";
import { gerarCartaoPartilha } from "@/lib/cartao-partilha";
import { registarSinal } from "@/lib/sinais";
import { registarEvento } from "@/lib/analytics";
import type { Destino } from "@/types/quiz";

interface ShareButtonsProps {
  participacaoId: string;
  destino: Destino;
  linkResultado: string;
}

export function ShareButtons({ participacaoId, destino, linkResultado }: ShareButtonsProps) {
  const [aGerarCartao, setAGerarCartao] = useState(false);

  const mensagem = `O meu destino ideal é ${destino.nomeCompleto}! Descobre o teu aqui: ${linkResultado}`;
  const linkWhatsapp = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;

  function clicarPartilhaWhatsapp() {
    registarSinal(participacaoId, "partilha_whatsapp_clicada");
    registarEvento("partilha_whatsapp_clicada", { destino: destino.chave });
  }

  function descarregarCartao() {
    setAGerarCartao(true);
    try {
      const dataUrl = gerarCartaoPartilha(destino.nomeCompleto, destino.tagline);
      if (!dataUrl) return;

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `famatour-${destino.chave}.png`;
      link.click();
    } finally {
      setAGerarCartao(false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <a
        href={linkWhatsapp}
        target="_blank"
        rel="noopener noreferrer"
        onClick={clicarPartilhaWhatsapp}
        className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-4 text-lg font-semibold text-white shadow-lg shadow-[#25D366]/30 transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        Partilhar no WhatsApp
      </a>

      <button
        type="button"
        onClick={descarregarCartao}
        disabled={aGerarCartao}
        className="rounded-full border-2 border-azul-200 px-6 py-4 text-base font-semibold text-azul-900 transition-colors hover:border-dourado-400 hover:bg-azul-50 disabled:opacity-60"
      >
        {aGerarCartao ? "A preparar imagem..." : "Descarregar cartão para Instagram"}
      </button>
    </div>
  );
}
