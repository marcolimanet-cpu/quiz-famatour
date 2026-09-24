import type { PontuacaoDestino } from "@/types/quiz";
import type { RespostaCrmGuardada, UtmParams } from "@/lib/supabase/types";

/**
 * Serviço dedicado e desacoplado de envio para a ferramenta de
 * automação/CRM externa (Make.com por agora, configurável por variável de
 * ambiente — ver AUTOMATION_WEBHOOK_URL no .env.example). Se um dia
 * trocares de ferramenta (HubSpot, Zapier, outra), só este ficheiro muda.
 *
 * Só deve ser chamado depois de consentimento CRM explícito ter sido dado
 * (a Server Action que o invoca garante isso).
 */

export interface SinaisComportamento {
  tempoPorPerguntaSegundos: Record<string, number>;
  guiaAbertoCompleto: boolean;
  partilhaWhatsappClicada: boolean;
}

export interface PayloadAutomacao {
  participacaoId: string;
  criadoEm: string;
  nome: string;
  email: string | null;
  telemovel: string | null;
  destinoVencedor: string;
  clusterVencedor: string;
  top3: PontuacaoDestino[];
  utm: UtmParams;
  respostasCrm: RespostaCrmGuardada[];
  sinaisComportamento: SinaisComportamento;
  partilhaId: string;
  linkResultado: string;
}

export interface ResultadoEnvioAutomacao {
  ok: boolean;
  erro?: string;
}

/**
 * Envia o payload por POST JSON para o webhook configurado. Nunca lança —
 * devolve sempre { ok, erro? } para o chamador decidir o que gravar na BD.
 * Timeout curto para não bloquear a resposta ao utilizador.
 */
export async function enviarParaAutomacao(
  payload: PayloadAutomacao
): Promise<ResultadoEnvioAutomacao> {
  const webhookUrl = process.env.AUTOMATION_WEBHOOK_URL;

  if (!webhookUrl) {
    const erro = "AUTOMATION_WEBHOOK_URL não configurada";
    console.error(
      `[automation] envio ignorado para participação ${payload.participacaoId}: ${erro}`
    );
    return { ok: false, erro };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const resposta = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!resposta.ok) {
      const erro = `HTTP ${resposta.status}`;
      // Log sem dados sensíveis: só o ID e o estado da resposta, nunca
      // nome/email/telemóvel/respostas.
      console.error(
        `[automation] falha ao enviar participação ${payload.participacaoId}: ${erro}`
      );
      return { ok: false, erro };
    }

    return { ok: true };
  } catch (erro) {
    const mensagem = erro instanceof Error ? erro.message : "erro desconhecido";
    console.error(
      `[automation] exceção ao enviar participação ${payload.participacaoId}: ${mensagem}`
    );
    return { ok: false, erro: mensagem };
  }
}
