"use server";

import { after } from "next/server";
import { supabaseServidor } from "@/lib/supabase/server";
import { calcularResultadoFinal } from "@/lib/scoring";
import { enviarParaAutomacao } from "@/lib/services/automation";
import type { RespostaQuiz } from "@/types/quiz";
import type { RespostaCrmGuardada, UtmParams } from "@/lib/supabase/types";

export interface CriarParticipacaoInput {
  nome: string;
  email: string;
  telemovel: string;
  respostas: RespostaQuiz[];
  utm: UtmParams;
  referrerPartilhaId: string | null;
}

export type CriarParticipacaoResultado =
  | { ok: true; id: string }
  | { ok: false; erro: string };

/**
 * Grava uma participação completa (Fase 1 + Fase 2 já respondidas). O
 * resultado é sempre recalculado aqui a partir das respostas cruas — nunca
 * confiamos num resultado pré-calculado vindo do cliente.
 */
export async function criarParticipacao(
  input: CriarParticipacaoInput
): Promise<CriarParticipacaoResultado> {
  if (!input.nome.trim()) {
    return { ok: false, erro: "Nome em falta." };
  }
  if (!input.email.trim() && !input.telemovel.trim()) {
    return { ok: false, erro: "Precisamos de pelo menos um contacto." };
  }
  if (input.respostas.length === 0) {
    return { ok: false, erro: "Sem respostas para calcular o resultado." };
  }

  const resultado = calcularResultadoFinal(input.respostas);
  const destinoVencedor = resultado.top3[0]?.chave;

  if (!destinoVencedor) {
    return { ok: false, erro: "Não foi possível calcular um destino." };
  }

  const supabase = supabaseServidor();
  const { data, error } = await supabase
    .from("participacoes")
    .insert({
      nome: input.nome.trim(),
      email: input.email.trim() || null,
      telemovel: input.telemovel.trim() || null,
      respostas: input.respostas,
      cluster_vencedor: resultado.clusterVencedor,
      destino_vencedor: destinoVencedor,
      top3: resultado.top3,
      todas_pontuacoes: resultado.todasPontuacoes,
      utm: input.utm,
      referrer_partilha_id: input.referrerPartilhaId,
    })
    .select("id, criado_em")
    .single();

  if (error || !data) {
    console.error("[participacoes] falha ao gravar participação:", error?.message);
    return {
      ok: false,
      erro: "Não foi possível gravar a tua participação. Tenta outra vez.",
    };
  }

  // Entrega do guia completo: transacional (a pessoa acabou de dar o email
  // precisamente para isto), por isso dispara sempre, sem depender do
  // consentimento CRM — esse continua só a gerir marketing personalizado
  // (ver submeterCrm). Corre com `after()` para não atrasar a revelação do
  // resultado à espera da resposta do Make.com.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const participacaoId = data.id;
  const criadoEm = data.criado_em;

  after(async () => {
    const envio = await enviarParaAutomacao({
      evento: "resultado_calculado",
      participacaoId,
      criadoEm,
      nome: input.nome.trim(),
      email: input.email.trim() || null,
      telemovel: input.telemovel.trim() || null,
      destinoVencedor,
      clusterVencedor: resultado.clusterVencedor,
      utm: input.utm,
      linkGuiaCompleto: `${siteUrl}/guia/${destinoVencedor}?p=${participacaoId}`,
      linkResultado: `${siteUrl}/resultado/${participacaoId}`,
    });

    if (!envio.ok) {
      console.error(
        `[automation] guia completo não enviado por email para participação ${participacaoId}: ${envio.erro}`
      );
    }
  });

  return { ok: true, id: participacaoId };
}

export interface SubmeterCrmInput {
  participacaoId: string;
  respostas: RespostaCrmGuardada[];
  consentimento: boolean;
}

export type SubmeterCrmResultado = { ok: boolean; erro?: string };

/**
 * Guarda as respostas da secção CRM e, só com consentimento explícito,
 * envia a participação para a automação externa (Make.com). O acesso ao
 * resultado do quiz nunca depende desta ação — é sempre chamada depois de o
 * destino já ter sido mostrado.
 */
export async function submeterCrm(
  input: SubmeterCrmInput
): Promise<SubmeterCrmResultado> {
  const supabase = supabaseServidor();
  const agora = new Date().toISOString();

  const { data: participacao, error: erroLeitura } = await supabase
    .from("participacoes")
    .select("*")
    .eq("id", input.participacaoId)
    .single();

  if (erroLeitura || !participacao) {
    return { ok: false, erro: "Participação não encontrada." };
  }

  const { error: erroUpdate } = await supabase
    .from("participacoes")
    .update({
      respostas_crm: input.consentimento ? input.respostas : null,
      consentimento_crm: input.consentimento,
      consentimento_crm_em: input.consentimento ? agora : null,
    })
    .eq("id", input.participacaoId);

  if (erroUpdate) {
    console.error("[participacoes] falha ao gravar CRM:", erroUpdate.message);
    return { ok: false, erro: "Não foi possível guardar as tuas respostas." };
  }

  if (input.consentimento) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

    const resultadoEnvio = await enviarParaAutomacao({
      evento: "crm_consentido",
      participacaoId: participacao.id,
      criadoEm: participacao.criado_em,
      nome: participacao.nome,
      email: participacao.email,
      telemovel: participacao.telemovel,
      destinoVencedor: participacao.destino_vencedor,
      clusterVencedor: participacao.cluster_vencedor,
      top3: participacao.top3,
      utm: participacao.utm,
      respostasCrm: input.respostas,
      sinaisComportamento: {
        tempoPorPerguntaSegundos: Object.fromEntries(
          participacao.respostas.map((r) => [r.perguntaId, r.tempoRespostaSegundos])
        ),
        guiaAbertoCompleto: participacao.guia_aberto_completo,
        partilhaWhatsappClicada: participacao.partilha_whatsapp_clicada,
      },
      partilhaId: participacao.partilha_id,
      linkResultado: `${siteUrl}/resultado/${participacao.id}`,
    });

    await supabase
      .from("participacoes")
      .update({
        webhook_enviado: resultadoEnvio.ok,
        webhook_tentativas: 1,
        webhook_ultimo_erro: resultadoEnvio.erro ?? null,
        webhook_ultimo_erro_em: resultadoEnvio.ok ? null : agora,
      })
      .eq("id", input.participacaoId);
  }

  return { ok: true };
}
