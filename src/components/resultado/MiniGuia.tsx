import type { ConteudoGuiaDestino, PerfilDica } from "@/types/quiz";
import { obterDicaEmbalar } from "@/lib/mini-guia";

interface MiniGuiaProps {
  nomeDestino: string;
  conteudo: ConteudoGuiaDestino;
  perfilDica: PerfilDica;
}

/**
 * Prévia do guia, mostrada logo no ecrã de resultado — 3 imperdíveis,
 * melhor altura e uma dica adaptada às respostas do quiz. O guia com todas
 * as secções (info prática, mala, gastronomia, cultura, etc.) fica em
 * /guia/[destino] (ver GuiaCompletoCTA).
 */
export function MiniGuia({ nomeDestino, conteudo, perfilDica }: MiniGuiaProps) {
  return (
    <div className="flex w-full flex-col gap-6 rounded-3xl bg-azul-50 p-6 sm:p-8">
      <h3 className="font-display text-2xl font-semibold text-azul-950">
        O teu mini-guia de {nomeDestino}
      </h3>

      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-dourado-600">
          3 experiências imperdíveis
        </p>
        <ul className="mt-2 flex flex-col gap-2">
          {conteudo.imperdiveis.slice(0, 3).map((experiencia) => (
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
        <p className="mt-2 text-azul-900">{conteudo.resumo.melhorAltura}</p>
      </div>

      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-dourado-600">
          Dica só para ti
        </p>
        <p className="mt-2 text-azul-900">{obterDicaEmbalar(perfilDica, nomeDestino)}</p>
      </div>
    </div>
  );
}
