import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buscarParticipacaoPublica } from "@/lib/participacoes";
import { getDestino } from "@/data/destinos";
import { getConteudoGuia } from "@/data/conteudo-guia";
import { ResultadoClient } from "@/components/resultado/ResultadoClient";
import { urlBaseAbsoluta } from "@/lib/site-url";

export async function generateMetadata({
  params,
}: PageProps<"/resultado/[id]">): Promise<Metadata> {
  const { id } = await params;
  const participacao = await buscarParticipacaoPublica(id);
  if (!participacao) return {};

  const destino = getDestino(participacao.destinoVencedor);
  if (!destino) return {};

  const urlBase = await urlBaseAbsoluta();
  const titulo = `O meu destino ideal é ${destino.nomeCompleto}! | Famatour`;
  const descricao = destino.tagline;
  // Imagem 1200x630 pré-gerada (ver scratchpad/gen_og_images.py) — a foto
  // original tem outra proporção e passa dos ~300KB que o WhatsApp aceita
  // bem, por isso a partilha usa esta versão dedicada, não o `1.jpg` cru.
  const imagem = `${urlBase}/images/og/destinos/${destino.chave}.jpg`;
  const urlPagina = `${urlBase}/resultado/${participacao.id}`;

  return {
    title: titulo,
    description: descricao,
    openGraph: {
      title: titulo,
      description: descricao,
      type: "website",
      url: urlPagina,
      images: [{ url: imagem, width: 1200, height: 630, alt: destino.nomeCompleto }],
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: descricao,
      images: [imagem],
    },
  };
}

export default async function ResultadoPage({ params }: PageProps<"/resultado/[id]">) {
  const { id } = await params;
  const participacao = await buscarParticipacaoPublica(id);
  if (!participacao) notFound();

  const destinoVencedor = getDestino(participacao.destinoVencedor);
  const conteudoGuia = getConteudoGuia(participacao.destinoVencedor);
  if (!destinoVencedor || !conteudoGuia) notFound();

  const outrosTop3 = participacao.top3
    .slice(1)
    .map((p) => getDestino(p.chave))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  const urlBase = await urlBaseAbsoluta();
  const linkResultado = `${urlBase}/resultado/${participacao.id}`;

  return (
    <main className="flex flex-1 flex-col bg-white">
      <div className="mx-auto w-full max-w-xl px-6 pt-10">
        <ResultadoClient
          participacaoId={participacao.id}
          partilhaId={participacao.partilhaId}
          destinoVencedor={destinoVencedor}
          outrosTop3={outrosTop3}
          conteudoGuia={conteudoGuia}
          linkResultado={linkResultado}
        />
      </div>
    </main>
  );
}
