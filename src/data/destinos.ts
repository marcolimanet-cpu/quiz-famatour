import type { Destino } from "@/types/quiz";

/**
 * Os 20 destinos do catálogo, extraídos 1:1 da folha "Destinos" de
 * Quiz_Famatour_Destinos.xlsx. Não alterar cluster/tagline aqui sem
 * atualizar também a folha de origem — mantém as duas fontes alinhadas.
 *
 * A coluna "Alinhado com catálogo Famatour" da folha original é uma
 * checklist de negócio (confirmar oferta comercial real por trás de
 * cada destino antes do lançamento) — não afeta o código, por isso não
 * está representada aqui.
 */
export const DESTINOS: Destino[] = [
  {
    chave: "dubai-eau",
    nomeCompleto: "Dubai e Emirados Árabes Unidos",
    cluster: "Exótico",
    tagline: "Luxo moderno, arranha-céus e deserto ao virar da esquina",
  },
  {
    chave: "grecia",
    nomeCompleto: "Grécia e Ilhas Gregas",
    cluster: "Mediterrâneo",
    tagline: "Ilhas brancas e azuis, história antiga, ritmo lento",
  },
  {
    chave: "italia",
    nomeCompleto: "Itália",
    cluster: "Mediterrâneo",
    tagline: "Gastronomia, arte e cidades icónicas",
  },
  {
    chave: "mediterraneo",
    nomeCompleto: "Mediterrâneo (multi-país)",
    cluster: "Mediterrâneo",
    tagline: "Vários países e portos na mesma viagem",
  },
  {
    chave: "noruega",
    nomeCompleto: "Noruega e Fiordes",
    cluster: "Natureza Extrema",
    tagline: "Fiordes, paisagens dramáticas, conforto a bordo",
  },
  {
    chave: "islandia",
    nomeCompleto: "Islândia",
    cluster: "Natureza Extrema",
    tagline: "Glaciares, vulcões e aventura ativa",
  },
  {
    chave: "caraibas",
    nomeCompleto: "Caraíbas",
    cluster: "Praia & Relax",
    tagline: "Praias animadas, várias ilhas, ambiente festivo",
  },
  {
    chave: "cabo-verde",
    nomeCompleto: "Cabo Verde",
    cluster: "Praia & Relax",
    tagline: "Praia autêntica, bom preço, perto de casa",
  },
  {
    chave: "tailandia",
    nomeCompleto: "Tailândia",
    cluster: "Exótico",
    tagline: "Templos, comida picante, mercados vibrantes",
  },
  {
    chave: "japao",
    nomeCompleto: "Japão",
    cluster: "Exótico",
    tagline: "Tradição e modernidade sofisticada lado a lado",
  },
  {
    chave: "maldivas",
    nomeCompleto: "Maldivas",
    cluster: "Praia & Relax",
    tagline: "Resort isolado, romance, luxo tranquilo",
  },
  {
    chave: "canarias",
    nomeCompleto: "Ilhas Canárias",
    cluster: "Praia & Relax",
    tagline: "Praia com bom preço, curta distância, todo o ano",
  },
  {
    chave: "madeira",
    nomeCompleto: "Madeira",
    cluster: "Praia & Relax",
    tagline: "Natureza e mar perto de casa, clima ameno",
  },
  {
    chave: "acores",
    nomeCompleto: "Açores",
    cluster: "Natureza Extrema",
    tagline: "Natureza intensa, atividade ao ar livre, perto de casa",
  },
  {
    chave: "turquia",
    nomeCompleto: "Turquia",
    cluster: "Mediterrâneo",
    tagline: "Ponte entre história, cultura e mercados",
  },
  {
    chave: "marrocos",
    nomeCompleto: "Marrocos",
    cluster: "Mediterrâneo",
    tagline: "Mercados, deserto e cultura diferente, perto da Europa",
  },
  {
    chave: "rep-dominicana",
    nomeCompleto: "República Dominicana",
    cluster: "Praia & Relax",
    tagline: "Praia animada, bom para famílias, longa distância",
  },
  {
    chave: "brasil",
    nomeCompleto: "Brasil",
    cluster: "Exótico",
    tagline: "Natureza tropical, energia e cultura vibrante",
  },
  {
    chave: "amazonia",
    nomeCompleto: "Amazónia",
    cluster: "Natureza Extrema",
    tagline: "Selva, expedição, natureza extrema de nicho",
  },
  {
    chave: "alasca",
    nomeCompleto: "Alasca",
    cluster: "Natureza Extrema",
    tagline: "Glaciares e vida selvagem, observação confortável",
  },
];

export function getDestino(chave: string) {
  return DESTINOS.find((d) => d.chave === chave);
}
