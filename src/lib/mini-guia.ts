import type { PerfilDica, RespostaQuiz } from "@/types/quiz";

/**
 * Deduz um "perfil de dica" a partir das respostas do quiz, para adaptar a
 * dica de embalar/preparar do mini-guia sem pedir mais nada ao utilizador.
 *
 * Nota: a Matriz_Pontos não tem uma pergunta direta sobre "medo/enjoo de
 * viajar" (só um exemplo do briefing) — por não poder inventar perguntas
 * novas, uso Q3_B ("prefiro ficar mais perto", ou seja, menos à-vontade com
 * voos longos) como o proxy mais próximo disponível para a dica
 * tranquilizadora. Fácil de trocar aqui se um dia houver uma pergunta mais
 * direta sobre isso.
 */
export function derivarPerfilDica(respostas: RespostaQuiz[]): PerfilDica {
  const opcoes = new Set(respostas.map((r) => r.opcaoId));

  if (opcoes.has("Q6_A")) return "familia";
  if (opcoes.has("Q4_A")) return "luxo";
  if (opcoes.has("Q3_B")) return "tranquilizadora";
  return "padrao";
}

export function obterDicaEmbalar(perfil: PerfilDica, nomeDestino: string): string {
  switch (perfil) {
    case "familia":
      return `Como vais viajar com crianças, leva na mala algo para as distrair nos momentos de espera e confirma com a tua consultora Famatour as facilidades para famílias em ${nomeDestino}.`;
    case "luxo":
      return `Já que gostas de experiências exclusivas, pergunta-nos por upgrades e experiências privadas em ${nomeDestino} — é nesses pormenores que se sente a diferença.`;
    case "tranquilizadora":
      return `Se esta vai ser uma das tuas viagens mais longas até agora, descansa: a nossa equipa trata de todos os detalhes práticos, para tu só teres de aproveitar ${nomeDestino}.`;
    case "padrao":
    default:
      return `Uma boa mala para ${nomeDestino} começa por roupa em camadas e um plano de bagagem de mão com o essencial — o resto, deixa com a gente.`;
  }
}
