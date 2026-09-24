import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { buscarParticipacaoPublica } from "@/lib/participacoes";
import { getDestino } from "@/data/destinos";
import { getConteudoGuia } from "@/data/conteudo-guia";
import { ResultadoClient } from "@/components/resultado/ResultadoClient";

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

  const headersList = await headers();
  const host = headersList.get("host");
  const protocolo = process.env.NODE_ENV === "development" ? "http" : "https";
  const origem = process.env.NEXT_PUBLIC_SITE_URL ?? (host ? `${protocolo}://${host}` : "");
  const linkResultado = `${origem}/resultado/${participacao.id}`;

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
