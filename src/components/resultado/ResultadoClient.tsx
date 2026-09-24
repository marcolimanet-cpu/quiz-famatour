"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ConteudoGuiaDestino, Destino, PerfilDica } from "@/types/quiz";
import { CHAVE_SESSAO_NOME, CHAVE_SESSAO_PERFIL_DICA } from "@/lib/sessao";
import { BrandLogo } from "@/components/BrandLogo";
import { ShareButtons } from "./ShareButtons";
import { ConsultorCTA } from "./ConsultorCTA";
import { MiniGuia } from "./MiniGuia";
import { GuiaEmailCTA } from "./GuiaEmailCTA";
import { FormularioCrm } from "./FormularioCrm";

interface ResultadoClientProps {
  participacaoId: string;
  partilhaId: string;
  destinoVencedor: Destino;
  outrosTop3: Destino[];
  conteudoGuia: ConteudoGuiaDestino;
  linkResultado: string;
}

export function ResultadoClient({
  participacaoId,
  partilhaId,
  destinoVencedor,
  outrosTop3,
  conteudoGuia,
  linkResultado,
}: ResultadoClientProps) {
  const [nome, setNome] = useState<string | null>(null);
  const [perfilDica, setPerfilDica] = useState<PerfilDica>("padrao");

  // Lê sessionStorage só depois de montar (nunca no servidor nem na
  // primeira passagem de hidratação, para não gerar um mismatch entre HTML
  // do servidor e do cliente) e sincroniza o estado local uma única vez —
  // é exatamente o caso de uso que useEffect + setState existe para
  // resolver, apesar do aviso mais genérico do linter.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const nomeGuardado = sessionStorage.getItem(CHAVE_SESSAO_NOME);
      const perfilGuardado = sessionStorage.getItem(CHAVE_SESSAO_PERFIL_DICA) as PerfilDica | null;
      if (nomeGuardado) setNome(nomeGuardado);
      if (perfilGuardado) setPerfilDica(perfilGuardado);
    } catch {
      // Sem sessionStorage, mostramos a versão genérica — não é crítico.
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <div className="flex w-full flex-col gap-10 pb-16">
      <section className="flex flex-col items-center gap-6 text-center">
        <div className="relative h-72 w-full overflow-hidden rounded-3xl sm:h-96">
          <Image
            src={`/images/destinos/${destinoVencedor.chave}/1.jpg`}
            alt={destinoVencedor.nomeCompleto}
            fill
            priority
            sizes="(max-width: 640px) 100vw, 640px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-azul-950/80 via-azul-950/10 to-transparent" />
          <div className="absolute left-5 top-5">
            <BrandLogo variante="branco" />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-6 text-left">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-dourado-400">
              {nome ? `${nome}, o teu destino é` : "O teu destino é"}
            </p>
            <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
              {destinoVencedor.nomeCompleto}
            </h1>
          </div>
        </div>
        <p className="max-w-md text-lg text-azul-700">{destinoVencedor.tagline}</p>
      </section>

      <ConsultorCTA participacaoId={participacaoId} nomeDestino={destinoVencedor.nomeCompleto} />

      <ShareButtons
        participacaoId={participacaoId}
        destino={destinoVencedor}
        linkResultado={linkResultado}
      />

      <section>
        <h2 className="font-display text-xl font-semibold text-azul-950">
          Também podias gostar de...
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {outrosTop3.map((destino) => (
            <div
              key={destino.chave}
              className="relative h-32 overflow-hidden rounded-2xl"
            >
              <Image
                src={`/images/destinos/${destino.chave}/1.jpg`}
                alt={destino.nomeCompleto}
                fill
                sizes="50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-azul-950/40" />
              <span className="absolute inset-x-0 bottom-0 p-3 font-semibold text-white">
                {destino.nomeCompleto}
              </span>
            </div>
          ))}
        </div>
      </section>

      <MiniGuia
        participacaoId={participacaoId}
        nomeDestino={destinoVencedor.nomeCompleto}
        conteudo={conteudoGuia}
        perfilDica={perfilDica}
      />

      <GuiaEmailCTA participacaoId={participacaoId} />

      <FormularioCrm participacaoId={participacaoId} />

      <section className="flex flex-col items-center gap-4 border-t border-azul-100 pt-8 text-center">
        <p className="font-display text-xl font-semibold text-azul-950">
          Obrigado por jogares!
        </p>
        <p className="text-azul-700">
          A Famatour tem uma equipa pronta para transformar este resultado
          numa viagem a sério.
        </p>
        <Link
          href={`/?ref=${partilhaId}`}
          className="text-sm font-semibold text-azul-700 underline underline-offset-4 hover:text-azul-900"
        >
          Ainda não fizeste o quiz? Descobre o teu destino
        </Link>
      </section>
    </div>
  );
}
