"use client";

import Image from "next/image";
import { BrandLogo } from "@/components/BrandLogo";

interface EcraInicialProps {
  onComecar: () => void;
}

export function EcraInicial({ onComecar }: EcraInicialProps) {
  return (
    <div className="flex w-full flex-col items-center gap-8 text-center">
      <div className="relative h-56 w-full overflow-hidden rounded-3xl sm:h-72">
        <Image
          src="/images/hero/inicio.jpg"
          alt="Destinos de férias Famatour"
          fill
          priority
          sizes="(max-width: 640px) 100vw, 640px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-azul-950/70 via-azul-950/10 to-transparent" />
        <div className="absolute left-5 top-5">
          <BrandLogo variante="branco" />
        </div>
      </div>

      <div>
        <h1 className="font-display text-4xl font-semibold text-azul-950 sm:text-5xl">
          Descobre o teu Destino
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-azul-700">
          Em menos de 2 minutos, descobre qual é o destino de férias perfeito
          para ti — e leva já um mini-guia à medida.
        </p>
      </div>

      <button
        type="button"
        onClick={onComecar}
        className="rounded-full bg-azul-900 px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-azul-900/20 transition-transform hover:scale-[1.03] hover:bg-azul-800 active:scale-[0.98]"
      >
        Começar
      </button>
    </div>
  );
}
