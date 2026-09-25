"use client";

import { useEffect, useState } from "react";
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
  const [partilhaNativaDisponivel, setPartilhaNativaDisponivel] = useState(false);

  const mensagem = `O meu destino ideal é ${destino.nomeCompleto}! Descobre o teu aqui: ${linkResultado}`;
  const linkWhatsapp = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
  const nomeFicheiro = `famatour-${destino.chave}.png`;

  // Só é possível saber se o telemóvel suporta partilha nativa de ficheiros
  // depois de montar (depende de `navigator`, inexistente no servidor) —
  // testamos a capacidade com um ficheiro vazio, sem gerar já o cartão real.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const ficheiroTeste = new File([""], "teste.png", { type: "image/png" });
      setPartilhaNativaDisponivel(
        typeof navigator.share === "function" &&
          typeof navigator.canShare === "function" &&
          navigator.canShare({ files: [ficheiroTeste] })
      );
    } catch {
      setPartilhaNativaDisponivel(false);
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  function clicarPartilhaWhatsapp() {
    registarSinal(participacaoId, "partilha_whatsapp_clicada");
    registarEvento("partilha_whatsapp_clicada", { destino: destino.chave });
  }

  async function partilharCartao() {
    setAGerarCartao(true);
    try {
      const blob = await gerarCartaoPartilha(destino);
      if (!blob) return;

      registarEvento("partilha_instagram_clicada", { destino: destino.chave });

      if (partilhaNativaDisponivel) {
        const ficheiro = new File([blob], nomeFicheiro, { type: "image/png" });
        try {
          await navigator.share({
            files: [ficheiro],
            title: "Famatour",
            text: `O meu destino ideal é ${destino.nomeCompleto}!`,
          });
          return;
        } catch (erro) {
          // Pessoa cancelou a caixa de partilha nativa — não é um erro,
          // simplesmente não descarregamos nada a seguir.
          if (erro instanceof Error && erro.name === "AbortError") return;
          // Qualquer outro erro (raro): cai para o download abaixo.
        }
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = nomeFicheiro;
      link.click();
      URL.revokeObjectURL(url);
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

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={partilharCartao}
          disabled={aGerarCartao}
          className="rounded-full border-2 border-azul-200 px-6 py-4 text-base font-semibold text-azul-900 transition-colors hover:border-dourado-400 hover:bg-azul-50 disabled:opacity-60"
        >
          {aGerarCartao ? "A preparar imagem..." : "Partilhar no Instagram"}
        </button>
        {!partilhaNativaDisponivel && (
          <p className="text-center text-sm text-azul-600">
            Guarda esta imagem e publica-a na tua Story.
          </p>
        )}
      </div>
    </div>
  );
}
