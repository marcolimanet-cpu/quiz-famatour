import { DESTINOS } from "@/data/destinos";
import { PERGUNTAS } from "@/data/perguntas";
import type {
  ClusterNome,
  DestinoChave,
  OpcaoPergunta,
  PontuacaoDestino,
  ResultadoQuiz,
  RespostaQuiz,
} from "@/types/quiz";

const CLUSTERS: ClusterNome[] = [
  "Praia & Relax",
  "Mediterrâneo",
  "Natureza Extrema",
  "Exótico",
];

function obterOpcao(perguntaId: string, opcaoId: string): OpcaoPergunta | undefined {
  const pergunta = PERGUNTAS.find((p) => p.id === perguntaId);
  return pergunta?.opcoes.find((o) => o.id === opcaoId);
}

function pontuacoesVazias(): Record<DestinoChave, number> {
  const vazio = {} as Record<DestinoChave, number>;
  for (const destino of DESTINOS) {
    vazio[destino.chave] = 0;
  }
  return vazio;
}

/**
 * Soma os pontos de cada destino a partir de um conjunto de respostas.
 * Usada tanto para decidir o cluster (só respostas da Fase 1) como para o
 * resultado final (Fase 1 + Fase 2 juntas).
 */
export function calcularPontuacoesPorDestino(
  respostas: RespostaQuiz[]
): Record<DestinoChave, number> {
  const pontuacoes = pontuacoesVazias();

  for (const resposta of respostas) {
    const opcao = obterOpcao(resposta.perguntaId, resposta.opcaoId);
    if (!opcao) continue;

    for (const [chave, pontos] of Object.entries(opcao.pontos)) {
      pontuacoes[chave as DestinoChave] += pontos ?? 0;
    }
  }

  return pontuacoes;
}

function calcularPontuacoesPorCluster(
  pontuacoesPorDestino: Record<DestinoChave, number>
): Record<ClusterNome, number> {
  const porCluster = Object.fromEntries(
    CLUSTERS.map((c) => [c, 0])
  ) as Record<ClusterNome, number>;

  for (const destino of DESTINOS) {
    porCluster[destino.cluster] += pontuacoesPorDestino[destino.chave];
  }

  return porCluster;
}

/**
 * Função de desempate, isolada de propósito para ser fácil de trocar depois
 * (decisão de negócio em aberto: aleatório vs. regra fixa). Por agora,
 * baralha aleatoriamente os elementos empatados.
 */
export function desempatar<T>(empatados: T[]): T[] {
  const copia = [...empatados];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/**
 * Decide o cluster vencedor da Fase 1: soma os pontos de todos os destinos
 * de cada cluster e escolhe o cluster com maior soma. Em caso de empate
 * entre clusters, usa a mesma função de desempate isolada acima.
 */
export function decidirClusterVencedor(respostasFase1: RespostaQuiz[]): ClusterNome {
  const pontuacoesPorDestino = calcularPontuacoesPorDestino(respostasFase1);
  const pontuacoesPorCluster = calcularPontuacoesPorCluster(pontuacoesPorDestino);

  const maiorPontuacao = Math.max(...Object.values(pontuacoesPorCluster));
  const clustersEmpatados = CLUSTERS.filter(
    (c) => pontuacoesPorCluster[c] === maiorPontuacao
  );

  return desempatar(clustersEmpatados)[0];
}

/**
 * Ordena os destinos por pontos, baralhando aleatoriamente dentro de cada
 * grupo de pontuação empatada (via `desempatar`), para que o desempate não
 * dependa da ordem de inserção no ficheiro de dados.
 */
function ordenarComDesempate(
  pontuacoesPorDestino: Record<DestinoChave, number>
): PontuacaoDestino[] {
  const porPontos = new Map<number, DestinoChave[]>();

  for (const destino of DESTINOS) {
    const pontos = pontuacoesPorDestino[destino.chave];
    const grupo = porPontos.get(pontos) ?? [];
    grupo.push(destino.chave);
    porPontos.set(pontos, grupo);
  }

  const pontosDesc = [...porPontos.keys()].sort((a, b) => b - a);

  return pontosDesc.flatMap((pontos) =>
    desempatar(porPontos.get(pontos)!).map((chave) => ({ chave, pontos }))
  );
}

/**
 * Calcula o resultado final: soma Fase 1 + Fase 2, devolve o cluster
 * vencedor (recalculado só a partir das respostas de Fase 1 dentro do
 * conjunto dado), o top 3 e a lista completa ordenada para depuração/log.
 *
 * As respostas da secção CRM nunca devem ser passadas aqui — não pontuam e
 * não podem influenciar este cálculo (regra de negócio obrigatória).
 */
const IDS_PERGUNTAS_FASE_1 = new Set(
  PERGUNTAS.filter((p) => p.fase === 1).map((p) => p.id)
);

export function calcularResultadoFinal(todasRespostas: RespostaQuiz[]): ResultadoQuiz {
  const respostasFase1 = todasRespostas.filter((r) =>
    IDS_PERGUNTAS_FASE_1.has(r.perguntaId)
  );

  const pontuacoesPorDestino = calcularPontuacoesPorDestino(todasRespostas);
  const todasPontuacoes = ordenarComDesempate(pontuacoesPorDestino);

  return {
    clusterVencedor: decidirClusterVencedor(respostasFase1),
    top3: todasPontuacoes.slice(0, 3),
    todasPontuacoes,
  };
}
