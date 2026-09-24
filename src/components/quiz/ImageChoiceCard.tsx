"use client";

import Image from "next/image";

interface ImageChoiceCardProps {
  texto: string;
  imagemFundo: string;
  selecionado: boolean;
  onSelect: () => void;
}

/**
 * Cartão de resposta com imagem de fundo + texto sobreposto, para perguntas
 * visualmente óbvias (ex: "Praia, montanha, cidade ou deserto?"). Formato
 * grande e tocável, otimizado para mobile.
 */
export function ImageChoiceCard({
  texto,
  imagemFundo,
  selecionado,
  onSelect,
}: ImageChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selecionado}
      className={`group relative h-40 w-full overflow-hidden rounded-2xl border-2 transition-all duration-200 active:scale-[0.98] sm:h-48 ${
        selecionado ? "animacao-acender border-dourado-500" : "border-transparent"
      }`}
    >
      <Image
        src={imagemFundo}
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, 50vw"
        className={`object-cover transition-transform duration-300 ${
          selecionado ? "scale-110" : "group-hover:scale-105"
        }`}
      />
      <div
        className={`absolute inset-0 bg-gradient-to-t ${
          selecionado
            ? "from-dourado-600/80 via-azul-950/20 to-transparent"
            : "from-azul-950/80 via-azul-950/10 to-transparent"
        }`}
      />
      <span className="absolute inset-x-0 bottom-0 p-4 text-left text-lg font-semibold text-white drop-shadow">
        {texto}
      </span>
    </button>
  );
}
