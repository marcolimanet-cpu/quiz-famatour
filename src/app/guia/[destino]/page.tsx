import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { DESTINOS, getDestino } from "@/data/destinos";
import { getConteudoGuia } from "@/data/conteudo-guia";
import { GuiaCompletoConteudo } from "@/components/guia/GuiaCompletoConteudo";
import { BotaoGuardarPdf } from "@/components/guia/BotaoGuardarPdf";
import { RegistarAberturaGuia } from "@/components/guia/RegistarAberturaGuia";
import { BrandLogo } from "@/components/BrandLogo";
import { ConsultorCTA } from "@/components/resultado/ConsultorCTA";

export function generateStaticParams() {
  return DESTINOS.map((d) => ({ destino: d.chave }));
}

export async function generateMetadata({
  params,
}: PageProps<"/guia/[destino]">): Promise<Metadata> {
  const { destino: chave } = await params;
  const destino = getDestino(chave);
  if (!destino) return {};

  return {
    title: `Guia de ${destino.nomeCompleto} | Famatour`,
    description: destino.tagline,
  };
}

function primeiroValor(valor: string | string[] | undefined): string | undefined {
  return Array.isArray(valor) ? valor[0] : valor;
}

export default async function GuiaCompletoPage({
  params,
  searchParams,
}: PageProps<"/guia/[destino]">) {
  const { destino: chave } = await params;
  const query = await searchParams;

  const destino = getDestino(chave);
  const conteudo = getConteudoGuia(chave);
  if (!destino || !conteudo) notFound();

  const participacaoId = primeiroValor(query.p) ?? null;

  return (
    <main className="flex flex-1 flex-col bg-white">
      <RegistarAberturaGuia participacaoId={participacaoId} />

      <div className="mx-auto w-full max-w-2xl px-6 py-10">
        <div className="print:hidden mb-6 flex items-center justify-between">
          <BrandLogo />
          <BotaoGuardarPdf />
        </div>

        <div className="relative h-64 w-full overflow-hidden rounded-3xl sm:h-80">
          <Image
            src={`/images/destinos/${destino.chave}/1.jpg`}
            alt={destino.nomeCompleto}
            fill
            priority
            sizes="(max-width: 640px) 100vw, 672px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-azul-950/80 via-azul-950/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
              Guia completo de {destino.nomeCompleto}
            </h1>
          </div>
        </div>

        <p className="mt-6 text-lg italic text-azul-700">{conteudo.intro}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="relative h-40 overflow-hidden rounded-2xl">
            <Image
              src={`/images/destinos/${destino.chave}/2.jpg`}
              alt=""
              fill
              sizes="50vw"
              className="object-cover"
            />
          </div>
          <div className="relative h-40 overflow-hidden rounded-2xl">
            <Image
              src={`/images/destinos/${destino.chave}/3.jpg`}
              alt=""
              fill
              sizes="50vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mt-8">
          <GuiaCompletoConteudo conteudo={conteudo} />
        </div>

        <div className="print:hidden mt-10 flex flex-col gap-4 border-t border-azul-100 pt-8">
          <ConsultorCTA participacaoId={participacaoId ?? undefined} nomeDestino={destino.nomeCompleto} />
          <Link
            href="/"
            className="text-center text-sm font-semibold text-azul-700 underline underline-offset-4 hover:text-azul-900"
          >
            Descobre o teu destino também
          </Link>
        </div>
      </div>
    </main>
  );
}
