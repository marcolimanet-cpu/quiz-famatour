import type { Pergunta } from "@/types/quiz";

/**
 * Perguntas, opções e pontos por destino, extraídos 1:1 da folha
 * "Matriz_Pontos" de Quiz_Famatour_Destinos.xlsx.
 *
 * NÃO editar pontos aqui sem avisar o Marco — os pesos são uma hipótese
 * inicial de negócio, a ajustar mais tarde com dados reais de utilização.
 * Qualquer opção sem entrada para um destino vale 0 pontos para esse
 * destino (default implícito, ver lib/scoring.ts).
 *
 * tipoVisual: classificação inicial minha (texto/imagem) a validar por
 * ti depois de veres o protótipo com TextChoiceCard e ImageChoiceCard —
 * ver pedido explícito no briefing. Basta mudar o valor aqui.
 */
export const PERGUNTAS: Pergunta[] = [
  {
    id: "Q1",
    fase: 1,
    cluster: "Todos",
    texto: "O que te faz mais feliz numa viagem?",
    tipoVisual: "texto",
    opcoes: [
      {
        id: "Q1_A",
        texto: "Não fazer nada, só relaxar",
        pontos: { "caraibas": 3, "cabo-verde": 3, "maldivas": 3, "canarias": 3, "madeira": 3, "rep-dominicana": 3 },
      },
      {
        id: "Q1_B",
        texto: "Descobrir história, cultura e boa comida",
        pontos: { "grecia": 3, "italia": 3, "mediterraneo": 3, "turquia": 3, "marrocos": 3 },
      },
      {
        id: "Q1_C",
        texto: "Ver paisagens que parecem de outro planeta",
        pontos: { "noruega": 3, "islandia": 3, "acores": 3, "amazonia": 3, "alasca": 3 },
      },
      {
        id: "Q1_D",
        texto: "Uma aventura completamente diferente do que já vivi",
        pontos: { "dubai-eau": 3, "tailandia": 3, "japao": 3, "brasil": 3 },
      },
    ],
  },
  {
    id: "Q2",
    fase: 1,
    cluster: "Todos",
    texto: "Praia, montanha, cidade ou deserto?",
    tipoVisual: "imagem",
    opcoes: [
      {
        id: "Q2_A",
        texto: "Praia",
        imagemFundo: "/images/quiz/q2-praia.jpg",
        pontos: { "caraibas": 2, "cabo-verde": 2, "maldivas": 2, "canarias": 2, "madeira": 2, "rep-dominicana": 2 },
      },
      {
        id: "Q2_B",
        texto: "Montanha",
        imagemFundo: "/images/quiz/q2-montanha.jpg",
        pontos: { "noruega": 2, "islandia": 2, "acores": 2, "amazonia": 2, "alasca": 2 },
      },
      {
        id: "Q2_C",
        texto: "Cidade",
        imagemFundo: "/images/quiz/q2-cidade.jpg",
        pontos: { "dubai-eau": 1, "grecia": 2, "italia": 2, "mediterraneo": 2, "japao": 1, "turquia": 2, "marrocos": 2 },
      },
      {
        id: "Q2_D",
        texto: "Deserto",
        imagemFundo: "/images/quiz/q2-deserto.jpg",
        pontos: { "dubai-eau": 2, "grecia": 1, "italia": 1, "mediterraneo": 1, "turquia": 1, "marrocos": 3 },
      },
    ],
  },
  {
    id: "Q3",
    fase: 1,
    cluster: "Todos",
    texto: "Já viajaste para fora da Europa (voos de 8h ou mais)?",
    tipoVisual: "texto",
    opcoes: [
      {
        id: "Q3_A",
        texto: "Sim, não me assusta",
        pontos: { "dubai-eau": 2, "caraibas": 1, "tailandia": 2, "japao": 2, "maldivas": 1, "rep-dominicana": 1, "brasil": 2, "amazonia": 1, "alasca": 1 },
      },
      {
        id: "Q3_B",
        texto: "Prefiro ficar mais perto",
        pontos: { "grecia": 2, "italia": 2, "mediterraneo": 2, "noruega": 1, "islandia": 1, "cabo-verde": 1, "canarias": 1, "madeira": 1, "acores": 1, "turquia": 2, "marrocos": 2 },
      },
    ],
  },
  {
    id: "Q4",
    fase: 1,
    cluster: "Todos",
    texto: "Como gostas de gastar o teu dinheiro em férias?",
    tipoVisual: "texto",
    opcoes: [
      {
        id: "Q4_A",
        texto: "Quero luxo e exclusividade",
        pontos: { "dubai-eau": 2, "islandia": 2, "maldivas": 2, "amazonia": 2, "alasca": 2 },
      },
      {
        id: "Q4_B",
        texto: "Bom equilíbrio qualidade/preço",
        pontos: { "cabo-verde": 2, "tailandia": 2, "canarias": 2, "madeira": 2, "turquia": 2, "marrocos": 2, "rep-dominicana": 2 },
      },
    ],
  },
  {
    id: "Q5",
    fase: 2,
    cluster: "Praia & Relax",
    texto: "Praia paradisíaca isolada e romântica, ou praia animada com vida à volta?",
    tipoVisual: "imagem",
    opcoes: [
      {
        id: "Q5_A",
        texto: "Isolada e romântica",
        imagemFundo: "/images/quiz/q5-isolada.jpg",
        pontos: { "maldivas": 3, "madeira": 1 },
      },
      {
        id: "Q5_B",
        texto: "Animada, com vida à volta",
        imagemFundo: "/images/quiz/q5-animada.jpg",
        pontos: { "caraibas": 3, "cabo-verde": 1, "canarias": 1, "rep-dominicana": 2 },
      },
    ],
  },
  {
    id: "Q6",
    fase: 2,
    cluster: "Praia & Relax",
    texto: "Viajas com crianças pequenas?",
    tipoVisual: "texto",
    opcoes: [
      {
        id: "Q6_A",
        texto: "Sim",
        pontos: { "cabo-verde": 1, "maldivas": -1, "canarias": 2, "madeira": 1, "rep-dominicana": 2 },
      },
      {
        id: "Q6_B",
        texto: "Não, viajamos só adultos",
        pontos: { "maldivas": 2, "madeira": 1 },
      },
    ],
  },
  {
    id: "Q7",
    fase: 2,
    cluster: "Mediterrâneo",
    texto: "O que procuras mais: história antiga, boa gastronomia, ou charme e mercados diferentes?",
    tipoVisual: "texto",
    opcoes: [
      {
        id: "Q7_A",
        texto: "História antiga e monumentos",
        pontos: { "grecia": 3, "italia": 2, "turquia": 2 },
      },
      {
        id: "Q7_B",
        texto: "Boa gastronomia e vinho",
        pontos: { "grecia": 1, "italia": 3, "mediterraneo": 2 },
      },
      {
        id: "Q7_C",
        texto: "Charme, mercados e cultura diferente",
        pontos: { "turquia": 2, "marrocos": 3 },
      },
    ],
  },
  {
    id: "Q8",
    fase: 2,
    cluster: "Mediterrâneo",
    texto: "Preferes ficar num só país ou conhecer vários numa mesma viagem?",
    tipoVisual: "texto",
    opcoes: [
      {
        id: "Q8_A",
        texto: "Um só país, com calma",
        pontos: { "grecia": 2, "italia": 2, "turquia": 1, "marrocos": 1 },
      },
      {
        id: "Q8_B",
        texto: "Vários países ou portos diferentes",
        pontos: { "mediterraneo": 3 },
      },
    ],
  },
  {
    id: "Q9",
    fase: 2,
    cluster: "Natureza Extrema",
    texto: "Preferes frio seco e paisagens de gelo, ou calor húmido e selva?",
    tipoVisual: "imagem",
    opcoes: [
      {
        id: "Q9_A",
        texto: "Frio e paisagens de gelo",
        imagemFundo: "/images/quiz/q9-gelo.jpg",
        pontos: { "noruega": 3, "islandia": 3, "alasca": 2 },
      },
      {
        id: "Q9_B",
        texto: "Calor húmido e selva",
        imagemFundo: "/images/quiz/q9-selva.jpg",
        pontos: { "amazonia": 3 },
      },
    ],
  },
  {
    id: "Q10",
    fase: 2,
    cluster: "Natureza Extrema",
    texto: "Gostas de atividade física ativa (caminhadas, trilhos) ou preferes observar tudo em conforto?",
    tipoVisual: "texto",
    opcoes: [
      {
        id: "Q10_A",
        texto: "Atividade ativa",
        pontos: { "islandia": 2, "acores": 2, "amazonia": 1 },
      },
      {
        id: "Q10_B",
        texto: "Observar em conforto",
        pontos: { "noruega": 2, "alasca": 2 },
      },
    ],
  },
  {
    id: "Q11",
    fase: 2,
    cluster: "Exótico",
    texto: "O que mais te atrai: luxo moderno, tradição espiritual, ou natureza selvagem tropical?",
    tipoVisual: "texto",
    opcoes: [
      {
        id: "Q11_A",
        texto: "Luxo moderno e arranha-céus",
        pontos: { "dubai-eau": 3, "japao": 1 },
      },
      {
        id: "Q11_B",
        texto: "Tradição, templos e espiritualidade",
        pontos: { "tailandia": 3, "japao": 2 },
      },
      {
        id: "Q11_C",
        texto: "Natureza selvagem e tropical",
        pontos: { "tailandia": 1, "brasil": 3 },
      },
    ],
  },
  {
    id: "Q12",
    fase: 2,
    cluster: "Exótico",
    texto: "Gostas de comida picante e mercados de rua, ou preferes ambientes sofisticados e organizados?",
    tipoVisual: "texto",
    opcoes: [
      {
        id: "Q12_A",
        texto: "Comida picante e mercados de rua",
        pontos: { "tailandia": 2, "brasil": 1 },
      },
      {
        id: "Q12_B",
        texto: "Ambientes sofisticados e organizados",
        pontos: { "dubai-eau": 2, "japao": 2 },
      },
    ],
  },
];

export const PERGUNTAS_FASE_1 = PERGUNTAS.filter((p) => p.fase === 1);

export function getPerguntasFase2(cluster: Pergunta["cluster"]) {
  return PERGUNTAS.filter((p) => p.fase === 2 && p.cluster === cluster);
}
