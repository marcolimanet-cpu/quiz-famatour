"use client";

import { useEffect, useRef, useState } from "react";
import type { ConteudoGuiaDestino, PerfilDica } from "@/types/quiz";
import { obterDicaEmbalar } from "@/lib/mini-guia";
import { registarSinal } from "@/lib/sinais";

interface MiniGuiaProps {
  participacaoId: string;
  nomeDestino: string;
  conteudo: ConteudoGuiaDestino;
  perfilDica: PerfilDica;
}

/**
 * Mini-guia personalizado do destino vencedor. Regista se foi aberto por
 * completo (scroll até ao fim) ou só visto de relance — sinal de
 * comportamento pedido no briefing, sem fricção nenhuma para o utilizador.
 */
export function MiniGuia({ participacaoId, nomeDestino, conteudo, perfilDica }: MiniGuiaProps) {
  const fimRef = useRef<HTMLDivElement>(null);
  const [jaRegistado, setJaRegistado] = useState(false);

  useEffect(() => {
    const elemento = fimRef.current;
    if (!elemento) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !jaRegistado) {
          setJaRegistado(true);
          registarSinal(participacaoId, "guia_aberto_completo");
        }
      },
      { threshold: 0.9 }
    );

    observer.observe(elemento);
    return () => observer.disconnect();
  }, [participacaoId, jaRegistado]);

  return (
    <div className="flex w-full flex-col gap-6 rounded-3xl bg-azul-50 p-6 sm:p-8">
      <h3 className="font-display text-2xl font-semibold text-azul-950">
        O teu mini-guia de {nomeDestino}
      </h3>

      {conteudo.placeholder && (
        <p className="rounded-lg bg-dourado-100 px-3 py-2 text-xs font-medium text-dourado-600">
          Conteúdo placeholder — vai ser substituído pela folha
          &quot;Conteudo_Guia&quot; do Excel.
        </p>
      )}

      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-dourado-600">
          3 experiências imperdíveis
        </p>
        <ul className="mt-2 flex flex-col gap-2">
          {conteudo.experiencias.map((experiencia) => (
            <li key={experiencia} className="flex gap-3 text-azul-900">
              <span className="text-dourado-500">✦</span>
              <span>{experiencia}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-dourado-600">
          Melhor altura para viajar
        </p>
        <p className="mt-2 text-azul-900">{conteudo.melhorAltura}</p>
      </div>

      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-dourado-600">
          Dica só para ti
        </p>
        <p className="mt-2 text-azul-900">{obterDicaEmbalar(perfilDica, nomeDestino)}</p>
      </div>

      <div ref={fimRef} />
    </div>
  );
}
