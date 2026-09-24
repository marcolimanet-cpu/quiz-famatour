import { supabaseServidor } from "@/lib/supabase/server";
import type { ClusterNome, DestinoChave, PontuacaoDestino } from "@/types/quiz";

/**
 * Subconjunto seguro de uma participação, para a página de resultado
 * pública (/resultado/[id]). O link de resultado é feito para ser
 * partilhado (WhatsApp, Instagram) — por isso NUNCA devolve nome, email,
 * telemóvel ou respostas do participante original, só o que é suposto ser
 * público: o destino e o top 3.
 */
export type ParticipacaoPublica = {
  id: string;
  criadoEm: string;
  clusterVencedor: ClusterNome;
  destinoVencedor: DestinoChave;
  top3: PontuacaoDestino[];
  partilhaId: string;
};

export async function buscarParticipacaoPublica(
  id: string
): Promise<ParticipacaoPublica | null> {
  const supabase = supabaseServidor();

  const { data, error } = await supabase
    .from("participacoes")
    .select(
      "id, criado_em, cluster_vencedor, destino_vencedor, top3, partilha_id"
    )
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    criadoEm: data.criado_em,
    clusterVencedor: data.cluster_vencedor,
    destinoVencedor: data.destino_vencedor,
    top3: data.top3,
    partilhaId: data.partilha_id,
  };
}
